# material-design-icons-svelte

<p align="center">
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg" alt="license" />
  </a>
  <a href="https://npmjs.org/package/material-design-icons-svelte">
    <img src="https://badgen.now.sh/npm/v/material-design-icons-svelte" alt="version" />
  </a>
  <a href="https://npmjs.org/package/material-design-icons-svelte">
    <img src="https://badgen.now.sh/npm/dm/material-design-icons-svelte" alt="downloads" />
  </a>
</p>


Svelte components generated from [Google's official Material Symbols / Material Design Icons](https://fonts.google.com/icons).

Every icon is a standalone, tree-shakeable Svelte 5 component — no runtime dependencies, no icon fonts, no CSS imports. The whole package is produced by a single generator script: it reads the upstream SVGs and writes the publish-ready output straight into `dist/`, with no extra compilation step.

- [Installation](#installation)
- [Usage](#usage)
- [Direct Icon Imports](#direct-icon-imports)
- [Props](#props)
- [Styling](#styling)
- [How It Works](#how-it-works)
- [Development](#development)

## Installation

```sh
npm install material-design-icons-svelte
```

Requires Svelte 5 or later.

## Usage

Icons are available in five styles — `filled`, `outlined`, `round`, `sharp` and `two-tone` — exposed as subpath exports:

```js
material-design-icons-svelte/{style}
```

Import any icon by its PascalCase name:

```svelte
<script lang="ts">
	import { Face } from 'material-design-icons-svelte/filled';
</script>

<Face />
```

Other styles:

```svelte
<script lang="ts">
	import { Face } from 'material-design-icons-svelte/outlined';
	import { Face } from 'material-design-icons-svelte/round';
	import { Face } from 'material-design-icons-svelte/sharp';
	import { Face } from 'material-design-icons-svelte/two-tone';
</script>
```

Each component renders an inline `<svg>` and accepts any standard SVG attribute:

```svelte
<Face class="my-icon" aria-label="Profile" width={24} height={24} />
```

## Direct Icon Imports

Prefer not to pull the barrel? Import a single `.svelte` file directly:

```svelte
<script lang="ts">
	import Face from 'material-design-icons-svelte/filled/Face.svelte';
</script>
```

## Props

| Prop    | Type               | Default | Description         |
| ------- | ------------------ | ------- | ------------------- |
| `width`  | `string \| number` | `'1em'` | Width of the SVG    |
| `height` | `string \| number` | `'1em'` | Height of the SVG   |

Any additional props are spread onto the root `<svg>` element.

## Styling

Components use `fill="currentColor"` and default to `1em` sizing, so they inherit `color` and scale with `font-size`:

```css
.my-icon {
	font-size: 2rem;
	color: tomato;
}
```

## How It Works

This library is a generator. `scripts/generate-dist.mjs` reads the latest optimized SVGs from [`@material-design-icons/svg`](https://www.npmjs.com/package/@material-design-icons/svg) and writes the final package output directly into `dist/`:

```
dist/{style}/Icon.svelte        inline SVG Svelte 5 component (runes)
dist/{style}/Icon.svelte.d.ts   type declaration for the component
dist/{style}/index.js           named re-exports for every icon
dist/{style}/index.d.ts         types for the barrel
```

Because the output is publish-ready, there is no bundling or `svelte-package` step — generation *is* the build.

Generation is incremental, per style:

- if `dist/{style}` already exists, that variant is skipped
- run with `--force` to wipe and regenerate all variants
- if a variant fails mid-generation, its folder is removed entirely (generation happens into a temp dir and is swapped in atomically on success)
- icons whose names would collide on case-insensitive file systems (e.g. `AddChart` vs `Addchart`) are deduplicated with a warning

Generated files are not meant to be edited by hand — changes will be overwritten on the next generation. To change the output, modify the templates inside the generator script.

Browse all available icons at [Google Fonts Icons](https://fonts.google.com/icons).

## Development

```sh
npm install

npm run dev        # regenerate src/lib/icons + icon directory: browse/search every icon, preview all styles, copy as Svelte or SVG
npm run build      # regenerate src/lib/icons + build demo + publint
npm run build:lib  # generate dist/ (the publishable library)
npm run update:metadata # refresh icon categories/tags from Google Fonts
npm run check      # svelte-check
npm run lint       # biome check
npm run format     # biome format
```

The directory site is fully client-side: the generator also emits SVG data per style into `src/lib/icons/data/`, so pages load icon styles lazily instead of importing thousands of components. This data lives in `scripts/generate-data.mjs` and always regenerates on `dev` and `build`.

Each icon also carries metadata (category + search tags) sourced from Google Fonts. It is vendored into `scripts/data/icons-metadata.json` (not committed, ignored via `.gitignore`) via `npm run update:metadata` — run it once after cloning — and `generate:data` turns it into `src/lib/icons/metadata.ts` (`IconMetadata`, `ICON_CATEGORIES`, `ICON_METADATA`) plus `src/lib/icons/index.ts` and `src/lib/icons/data/{variant}.ts`. Search matches names, categories, and tags; icons without official metadata fall back to tags derived from their name.

Full regeneration of the library after updating the upstream icon package:

```sh
node scripts/generate-dist.mjs --force
```

Inside this repo, `src/` consumes `dist/` through the self-referenced package name (`material-design-icons-svelte/*`) plus a `paths` mapping in `tsconfig.json`, so the demo app always exercises the exact files that get published.

## License

Material design icons are created by [Google](https://github.com/google/material-design-icons#license) and distributed under the [Apache License Version 2.0](./LICENSE).
