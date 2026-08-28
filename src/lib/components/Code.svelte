<script lang="ts">
import { type BundledLanguage, type BundledTheme, codeToHtml } from 'shiki';
import { getThemeContext } from '$lib/context/theme.svelte';

type Code = {
	code?: string;
	viewLanguage?: string;
	language?: BundledLanguage;
};

type RenderedCode = {
	code: string;
	language: BundledLanguage;
	viewLanguage: string;
};

type Props = {
	codes: Code[];
};

const { codes }: Props = $props();

let html = $state<RenderedCode[]>([]);
let selectedLang = $state<BundledLanguage | undefined>();

const themeContext = getThemeContext();

const variant = $derived<BundledTheme>(
	themeContext.value === 'dark' ? 'github-dark-high-contrast' : 'github-light-high-contrast'
);

const langs = $derived([...new Set(html.map((code) => code.language))]);

const activeLang = $derived(selectedLang ?? langs[0]);

const visibleCodes = $derived(
	activeLang ? html.filter((code) => code.language === activeLang) : []
);

$effect(() => {
	let cancelled = false;

	html = [];
	selectedLang = undefined;

	if (!codes?.length) {
		return;
	}

	Promise.all(
		codes.map(async (code) => {
			const language = code.language ?? 'ts';

			return {
				code: await codeToHtml(code.code ?? '', {
					lang: language,
					theme: variant
				}),
				language,
				viewLanguage: code.viewLanguage ?? language
			};
		})
	).then((result) => {
		if (!cancelled) {
			html = result;
		}
	});

	return () => {
		cancelled = true;
	};
});

function selectLanguage(language: BundledLanguage) {
	selectedLang = language;
}
</script>

<div data-font="mono" class="code">
	{#if langs.length > 1}
		<div data-font="mono" class="languages">
			<div class="languages-action">
				{#each langs as lang (lang)}
					{@const item = html.find(
				(code) => code.language === lang
			)}

					<button
						type="button"
						class:active={activeLang === lang}
						onclick={() =>
					selectLanguage(lang)}
					>
						{item?.viewLanguage ?? lang}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	{#each visibleCodes as { code } (code)}
		<div class="code-block">
			{@html code}
		</div>
	{/each}
</div>

<style>
.code {
	margin-bottom: 1rem;
	background-color: var(--color-surface);
	border-radius: 1rem;
	overflow: hidden;
}

.languages {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-direction: row;
	padding: 0rem 1rem;
}

.languages-action {
	display: flex;
	gap: 0.5rem;
}

.languages-action button {
	padding: 0.25rem 0.5rem;
	border: none;
	z-index: 1;
	border-radius: 0;
	background-color: var(--color-surface);
	color: var(--color-on-surface);
	position: relative;
	height: 100%;
}

.languages-action button:hover {
	box-shadow: none;
}

.languages-action button.active::after {
	content: "";
	border-bottom: 0.2rem solid var(--color-outline-variant);
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
}

.code-block :global(pre) {
	margin: 0;
	border-radius: 0;
}
</style>
