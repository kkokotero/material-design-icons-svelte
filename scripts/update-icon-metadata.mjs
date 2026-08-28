import { promises as fs } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outFile = join(root, 'scripts', 'data', 'icons-metadata.json');
const SOURCE_URL = 'https://fonts.google.com/metadata/icons';

async function fetchIconMetadata() {
	const response = await fetch(SOURCE_URL, { signal: AbortSignal.timeout(30_000) });

	if (!response.ok) {
		throw new Error(`Request to ${SOURCE_URL} failed: ${response.status} ${response.statusText}`);
	}

	const text = await response.text();

	return JSON.parse(text.replace(/^\)\]\}'\s*/, ''));
}

function normalize(icons) {
	const result = {};

	for (const icon of icons) {
		if (!icon?.name || !Array.isArray(icon.categories) || !Array.isArray(icon.tags)) {
			continue;
		}

		result[icon.name] = {
			category: icon.categories[0] ?? 'other',
			tags: [
				// Los tags son palabras clave cortas; se descartan frases largas
				// que Google a veces cuela como ruido.
				...new Set(
					icon.tags
						.map((tag) => String(tag).replace(/\s+/g, ' ').trim().toLowerCase())
						.filter((tag) => tag.length > 0 && tag.length <= 36)
				)
			].sort()
		};
	}

	return result;
}

try {
	const metadata = normalize((await fetchIconMetadata()).icons ?? []);

	await fs.mkdir(dirname(outFile), { recursive: true });

	const lines = Object.entries(metadata).map(
		([name, entry]) => `\t${JSON.stringify(name)}: ${JSON.stringify(entry)}`
	);

	await fs.writeFile(outFile, `{\n${lines.join(',\n')}\n}\n`);

	console.log(`Saved metadata for ${Object.keys(metadata).length} icons.`);
} catch (error) {
	console.error(
		`Failed to update icon metadata: ${error instanceof Error ? error.message : error}`
	);
	process.exit(1);
}
