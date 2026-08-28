import adapterAuto from '@sveltejs/adapter-auto';
import adapterVercel from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// The demo site consumes the generated package output directly.
			alias: {
				'material-design-icons-svelte': 'dist',
				'material-design-icons-svelte/*': 'dist/*',
				'$lib/*': 'src/lib/*',
				$lib: 'src/lib'
			},

			// Use adapter-vercel on Vercel, otherwise adapter-auto (supports Netlify, Cloudflare, etc.)
			// https://svelte.dev/docs/kit/adapters
			adapter: process.env.VERCEL ? adapterVercel() : adapterAuto()
		})
	]
});
