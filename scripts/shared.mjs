import { promises as fs } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const pkgDir = join(root, 'node_modules', '@material-design-icons', 'svg');

export const DIST_DIR = join(root, 'dist');
export const DATA_DIR = join(root, 'src', 'lib', 'data', 'icons');

export const VARIANTS = ['filled', 'outlined', 'round', 'sharp', 'two-tone'];
export const CONCURRENCY = 32;

export async function ensureIconsPackage() {
	if (!(await fs.readdir(pkgDir, { withFileTypes: true })).some((entry) => entry.isDirectory())) {
		console.error(
			`Package "@material-design-icons/svg" not found at ${pkgDir}. Run "npm i -D @material-design-icons/svg".`
		);
		process.exit(1);
	}
}

export async function exists(path) {
	try {
		await fs.stat(path);
		return true;
	} catch {
		return false;
	}
}

export async function pool(items, limit, worker) {
	const results = new Array(items.length);
	let next = 0;

	async function runner() {
		while (next < items.length) {
			const index = next++;
			results[index] = await worker(items[index], index);
		}
	}

	await Promise.all(Array.from({ length: Math.min(limit, items.length) }, runner));

	return results;
}

function pascalCase(name) {
	const upper = name.replace(/[_-]+(.)/g, (_, c) => c.toUpperCase());

	return /^[a-z]/.test(upper) ? upper[0].toUpperCase() + upper.slice(1) : upper;
}

function toComponentName(file) {
	const name = pascalCase(file.replace(/\.svg$/, ''));

	return /^\d/.test(name) ? `N${name}` : name;
}

export async function readVariantJobs(variant) {
	const srcDir = join(pkgDir, variant);

	const files = (await fs.readdir(srcDir)).filter((file) => file.endsWith('.svg')).sort();

	const rawContents = await pool(files, CONCURRENCY, async (file) => ({
		file,
		raw: await fs.readFile(join(srcDir, file), 'utf8')
	}));

	const seen = new Map();
	const seenCaseInsensitive = new Map();
	const jobs = [];

	for (const { file, raw } of rawContents) {
		const match = raw.match(/<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>/);

		if (!match) {
			console.warn(`Skipping ${variant}/${file}: could not parse`);
			continue;
		}

		const [, viewBox, body] = match;

		const cleanBody = body.trim();
		const componentName = toComponentName(file);

		if (seen.has(componentName)) {
			throw new Error(
				`Collision: "${componentName}" from "${file}" and "${seen.get(componentName)}"`
			);
		}

		const caseInsensitiveKey = componentName.toLowerCase();

		if (seenCaseInsensitive.has(caseInsensitiveKey)) {
			console.warn(
				`Skipping ${variant}/${file}: "${componentName}" collides with "${seenCaseInsensitive.get(caseInsensitiveKey)}" on case-insensitive file systems`
			);
			continue;
		}

		seen.set(componentName, file);
		seenCaseInsensitive.set(caseInsensitiveKey, componentName);

		const title = file
			.replace(/\.svg$/, '')
			.replace(/[_]+/g, ' ')
			.replace(/^[a-z]/, (c) => c.toUpperCase());

		jobs.push({
			file,
			componentName,
			title,
			viewBox,
			body: cleanBody
		});
	}

	return jobs;
}
