<script lang="ts">
import Download from 'material-design-icons-svelte/filled/Download.svelte';
import Filter from 'material-design-icons-svelte/outlined/Filter.svelte';
import FilterVintage from 'material-design-icons-svelte/outlined/FilterVintage.svelte';
import { page } from '$app/state';
import AlertModal from '$lib/components/AlertModal.svelte';
import Code from '$lib/components/Code.svelte';
import HeroMessage from '$lib/components/HeroMessage.svelte';
import { getFilterContext } from '$lib/context/filter.svelte';
import { getIconContext } from '$lib/context/icon.svelte';
import { ICONS, type Icon } from '$lib/icons';
import { ICON_METADATA } from '$lib/icons/metadata';
import { createDownloadPng, createDownloadSvg } from '$lib/utils/create-download';
import { formatIconName, formatSvg, generateImportIconSvelte } from '$lib/utils/format';

let showAlertDownload = $state(false);

const icon: Icon = $derived((page.params.icon as Icon) ?? 'N123');

const isValidIcon = $derived(ICONS.includes(icon));

const iconContext = getIconContext();
const filterContext = getFilterContext();

const iconData = $derived(ICON_METADATA.filter((entry) => entry.name === String(icon))[0]);

const { activeIcons } = $derived(iconContext.value);

const homeUrl = $derived.by(() => {
	const url = new URL(page.url);

	url.pathname = '/';
	url.search = new URLSearchParams(page.url.searchParams).toString();

	return url;
});

type TargetDownload = 'png' | 'svg';

function handleDownload(target: TargetDownload) {
	showAlertDownload = false;

	switch (target) {
		case 'png':
			createDownloadPng(activeIcons?.[icon] ?? '', {
				filename: `${icon}.png`,
				color: filterContext.value.color,
				strokeWidth: filterContext.value.strokeWidth ?? 0
			});
			break;
		case 'svg':
			createDownloadSvg(activeIcons?.[icon] ?? '', `${icon}.svg`);
			break;
	}
}
</script>

<svelte:head>
	<title>{formatIconName(icon)}</title>
</svelte:head>

{#if !isValidIcon}
	<HeroMessage message="Icon not found.">
		<div class="hero--buttons">
			<a href={homeUrl.toString()} class="hero--button"> Back to home </a>
		</div>
	</HeroMessage>
{:else}
	<div class="icon--container">
		<div
			class="icon--wrapper"
			style="stroke-width: {filterContext.value.strokeWidth === null ? 0 : filterContext.value.strokeWidth}px; color: {filterContext.value.color};"
		>
			{@html activeIcons?.[icon]}
		</div>
		<div class="icon--content">
			<div class="icon--content__head">
				<div class="icon--content__header">
					<h2 class="icon--content__title">{formatIconName(icon)}</h2>
					<span class="icon--content__category">{iconData.category}</span>
				</div>
				<div class="icon--content__header">
					<button
						type="button"
						class="icon--content__header__button"
						onclick={() => showAlertDownload = true}
					>
						<Download />
					</button>
				</div>
			</div>
			<div class="icon--content__section">
				<h3 class="icon--content__section--title">Code</h3>
				<Code
					codes={[{
     					code: generateImportIconSvelte(filterContext.value.variant, icon),
     					language: 'svelte',
					}, {
       					code: formatSvg(activeIcons?.[icon] ?? ''),
       					language: 'html',
       					viewLanguage: 'svg',
					}]}
				/>
			</div>
			<div class="icon--content__section">
				<h3 class="icon--content__section--title">Tags</h3>
				<div class="icon--content__tags">
					{#each iconData.tags as tag}
						<p class="icon--content__tag">{formatIconName(tag)}</p>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

<AlertModal open={showAlertDownload}>
	<h3 class="dialog--title">Download icon</h3>
	<div class="dialog--actions__full-width">
		<button
			type="button"
			class="dialog--action dialog--action__full-width"
			onclick={() => handleDownload('png')}
		>
			<Filter />
			Download PNG
		</button>
		<button
			type="button"
			class="dialog--action dialog--action__full-width"
			onclick={() => handleDownload('svg')}
		>
			<FilterVintage />
			Download SVG
		</button>
	</div>
	<div class="dialog--actions">
		<button
			type="button"
			class="dialog--action dialog--action__cancel"
			onclick={() => showAlertDownload = false}
		>
			Cancel
		</button>
	</div>
</AlertModal>

<style>
.dialog--title {
	font-size: 3rem;
	font-weight: 500;
	margin: 0;
	margin-bottom: 1rem;
}

.dialog--actions {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	gap: 0.5rem;
}

.dialog--actions__full-width {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	margin-bottom: 1rem;
}

.dialog--action__full-width {
	width: 100%;
	padding: 1rem;
}

.dialog--action {
	border: none;
	cursor: pointer;
	background: none;
	color: var(--color-on-surface);
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
}

.dialog--action:hover {
	background-color: var(--color-surface-container);
}

.dialog--action__cancel:hover {
	background-color: var(--color-error);
	color: var(--color-on-error);
}

.hero--button {
	background-color: var(--color-primary);
	color: var(--color-on-primary);
	padding: 1rem 2rem;
	border-radius: 2rem;
	text-decoration: none;
}

.icon--container {
	display: grid;
	grid-template-columns: repeat(3, minmax(0rem, 1fr));
	align-items: start;
	justify-items: stretch;
	gap: 1rem;
	padding: 1rem;
	position: relative;
	z-index: 1;
	max-width: 1300px;
	margin: 0 auto;
}

.icon--wrapper {
	grid-column: span 1;
	background-color: var(--color-surface-container);
	padding: 3rem;
	border-radius: 5rem;
	position: sticky;
	top: 10rem;
}

.icon--wrapper :global(svg) {
	stroke-width: inherit;
	font-size: 5rem;
}

.icon--content {
	grid-column: span 2;
	background-color: var(--color-surface-container);
	padding: 1rem 2rem;
	border-radius: 2rem;
}

.icon--content__head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
}

.icon--content__header {
	display: flex;
	align-items: center;
	gap: 0.6rem;
	padding: 1rem 0.5rem;
}

.icon--content__header__button {
	display: flex;
	align-items: center;
	justify-content: center;
	aspect-ratio: 1;
	font-size: 1.5rem;
	padding: 1rem;
	background: none;
	border: none;
	color: var(--color-on-surface-variant);
}

.icon--content__header__button:hover {
	background-color: var(--color-surface-variant);
}

.icon--content__title {
	font-size: 3rem;
	margin: 0;
}

.icon--content__category {
	font-size: 0.8rem;
	margin: 0;
	background-color: var(--color-secondary);
	color: var(--color-on-secondary);
	padding: 0.2rem 1rem;
	border-radius: 5rem;
}

.icon--content__section {
	padding: 0rem 0.5rem;
}

.icon--content__section--title {
	font-size: 2rem;
	margin: 0;
	margin-bottom: 1rem;
}

.icon--content__tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.icon--content__tag {
	background-color: var(--color-surface);
	padding: 0.5rem 1rem;
	border-radius: 2rem;
	font-size: 0.8rem;
	margin: 0;
}

.icon--content__head {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
}

.icon--content__title {
	font-size: 3rem;
	margin: 0;
	word-break: break-word;
	overflow-wrap: break-word;
}

@media (width <= 768px) {
	.icon--container {
		grid-template-columns: 1fr;
		max-width: 90dvw;
		margin: 0 auto;
		padding: 0;
	}

	.icon--wrapper {
		position: relative;
		top: 0;
		padding: 1.5rem;
		border-radius: 2rem;
		max-width: 90dvw;
	}

	.icon--wrapper :global(svg) {
		font-size: 3rem;
	}

	.icon--content {
		grid-column: span 1;
		padding: 1rem;
		max-width: 90dvw;
		width: 100%;
	}

	.icon--content__title {
		font-size: 1.8rem;
	}

	.icon--content__section--title {
		font-size: 1.4rem;
	}

	.icon--content__head {
		gap: 0.5rem;
	}
}
</style>
