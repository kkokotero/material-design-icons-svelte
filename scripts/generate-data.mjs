import { promises as fs } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureIconsPackage, readVariantJobs, VARIANTS } from './shared.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const DATA_DIR = join(root, 'src', 'lib', 'icons');
const sourceMetadataFile = join(root, 'scripts', 'data', 'icons-metadata.json');
const FALLBACK_CATEGORY = 'other';

// --- Helpers para el CSS con el SVG como fondo ---

function rawSvgMarkup(viewBox, body) {
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="currentColor" stroke="currentColor">${body}</svg>`;
}

function svgRuleFor(job) {
	const svg = rawSvgMarkup(job.viewBox, job.body);

	return `'${job.componentName}': '${escapeStringLiteral(svg)}'`;
}

function svgsTemplate(jobs) {
	const svgs = jobs.map((job) => svgRuleFor(job)).join(',\n');

	return `// This file is auto-generated. Do not edit manually.
// Generated from the official Material Design Icons by Google.
// https://fonts.google.com/icons

export const SVGS = {
${svgs}
};
`;
}

// --- Helpers para los metadatos (categoría y tags por icono) ---

function toSourceName(file) {
	return file.replace(/\.svg$/, '');
}

// Tags de respaldo derivados del nombre cuando un icono no tiene metadatos oficiales.
// "N18UpRating" -> ["18", "up", "rating"]
function deriveTagsFromName(componentName) {
	return componentName
		.replace(/^N(?=\d)/, '')
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.split(/[\s_-]+/)
		.filter(Boolean)
		.map((word) => word.toLowerCase());
}

async function loadSourceMetadata() {
	try {
		return JSON.parse(await fs.readFile(sourceMetadataFile, 'utf8'));
	} catch {
		console.error(
			`Icon metadata not found at ${sourceMetadataFile}. Run "npm run update:metadata".`
		);
		process.exit(1);
	}
}

function buildIconEntries(jobs, sourceMetadata) {
	const entries = [];
	let matched = 0;

	for (const job of jobs) {
		const source = sourceMetadata[toSourceName(job.file)];

		if (source) {
			matched++;
			entries.push({
				name: job.componentName,
				category: source.category,
				tags: source.tags
			});
			continue;
		}

		console.warn(`No metadata for "${job.componentName}", deriving tags from its name.`);
		entries.push({
			name: job.componentName,
			category: FALLBACK_CATEGORY,
			tags: [...new Set(deriveTagsFromName(job.componentName))].sort()
		});
	}

	return { entries, matched };
}

// Normaliza y escapa un valor para emitirlo como string literal de TypeScript.
function escapeStringLiteral(str) {
	return str.replace(/\s+/g, ' ').trim().replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function metadataTemplate(entries, categories) {
	const serializedEntries = entries
		.map(
      (entry) => `{
			name: '${escapeStringLiteral(entry.name)}',
			category: '${escapeStringLiteral(entry.category)}',
			tags: [${entry.tags.map((tag) => `'${escapeStringLiteral(tag)}'`).join(', ')}]
	}`
		)
		.join(',\n');

	return `// This file is auto-generated. Do not edit manually.
// Categories and tags sourced from Google Fonts: https://fonts.google.com/icons

export const ICON_CATEGORIES = [
${categories.map((category) => `\t'${category}'`).join(',\n')}
] as const;

export type IconCategory = typeof ICON_CATEGORIES[number];

export const isValidCategory = (category: string): category is IconCategory => {
	return ICON_CATEGORIES.includes(category as IconCategory);
};

export type IconMetadata = {
	name: string;
	category: IconCategory;
	tags: string[];
};

export const ICON_METADATA: IconMetadata[] = [
${serializedEntries}
] as const;

export function filterIconForMetadata(
	name?: string,
	category?: string
): IconMetadata[] {
	const query = name?.trim().toLowerCase();
	const normalizedCategory = category?.trim().toLowerCase();

	return ICON_METADATA.filter((entry) => {
		const matchesQuery =
			!query ||
			entry.name.toLowerCase().includes(query) ||
			entry.tags.some((tag) =>
				tag.toLowerCase().includes(query)
			);

		const matchesCategory =
			!normalizedCategory ||
			normalizedCategory === "all" ||
			entry.category.includes(normalizedCategory);

		return matchesQuery && matchesCategory;
	});
}

export const filterIconForCategory = (category: string): IconMetadata[] => {
	const query = category.trim().toLowerCase();
	return ICON_METADATA.filter((entry) => entry.category.includes(query));
};

`;
}

await ensureIconsPackage();

await fs.mkdir(DATA_DIR, { recursive: true });
await fs.mkdir(join(DATA_DIR, 'data'), { recursive: true });

const sourceMetadata = await loadSourceMetadata();
const jobsByVariant = new Map();

for (const variant of VARIANTS) {
	const jobs = await readVariantJobs(variant);

	await fs.writeFile(join(DATA_DIR, 'data', `${variant}.ts`), svgsTemplate(jobs));

	jobsByVariant.set(variant, jobs);

	console.log(`Generated SVG data for "${variant}" (${jobs.length} icons)`);
}

const { entries, matched } = buildIconEntries(jobsByVariant.get(VARIANTS[0]), sourceMetadata);

const categories = [...new Set(entries.map((entry) => entry.category))].sort();

await fs.writeFile(join(DATA_DIR, 'metadata.ts'), metadataTemplate(entries, categories));

console.log(
	`Generated metadata for ${entries.length} icons (${matched} with official categories/tags, ${categories.length} categories).`
);

const iconNames = entries.map((entry) => entry.name);

const iconEntries = iconNames.map((name) => `\t'${name}'`).join(',\n');

const svgImports = VARIANTS.map(
	(v) => `'${v}': () => import('./data/${v}').then((m) => m.SVGS as Record<string, string>)`
).join(',\n');

await fs.writeFile(
	join(DATA_DIR, 'index.ts'),
	`// This file is auto-generated. Do not edit manually.

export const VARIANTS = [
	${VARIANTS.map((v) => `'${v}'`).join(',\n\t')}
] as const;

export const ICONS = [
${iconEntries}
] as const;

export type Variant = (typeof VARIANTS)[number];

export type Icon = (typeof ICONS)[number];

export const isIcon = (name: string): name is Icon => {
	return ICONS.includes(name as Icon);
};

export const isVariant = (name: string): name is Variant => {
	return VARIANTS.includes(name as Variant);
};

export const SVG_BY_VARIANT: Record<Variant, () => Promise<Record<Icon, string>>> = {
${svgImports}
};
`
);

console.log('Done.');
