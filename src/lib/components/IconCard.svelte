<script lang="ts">
import { page } from '$app/state';
import { getAsideContext } from '$lib/context/aside.svelte';
import { getFilterContext } from '$lib/context/filter.svelte';
import { formatIconName } from '$lib/utils/format';

type Props = {
	name: string;
	svg: string;
};

const { name, svg }: Props = $props();

const filterContext = getFilterContext();
const asideContext = getAsideContext();

const iconUrl = $derived.by(() => {
	const url = new URL(page.url);

	url.pathname = `/${name}`;
	url.search = new URLSearchParams(page.url.searchParams).toString();

	return url.toString();
});
</script>

<a href="{iconUrl}" class="icon-card__link">
	<article class="icon-card">
		{#if svg}
			<div
				class="icon-wrapper"
				style="stroke-width: {filterContext.value.strokeWidth === null ? 0 : filterContext.value.strokeWidth}px; color: {filterContext.value.color};"
			>
				{@html svg}
			</div>
		{:else}
			<div class="icon-skeleton" aria-hidden="true"></div>
		{/if}
		<span class="icon-name {asideContext.value && 'aside-open'}">{formatIconName(name)}</span>
	</article>
</a>

<style>
.icon-card__link {
	text-decoration: none;
	color: inherit;
	border-radius: 1rem;
}

.icon-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 1rem;
	border-radius: 0.5rem;
	background: none;
	gap: 0.5rem;
}

.icon-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 3.5rem;
	height: 3.5rem;
}

.icon-wrapper :global(*) {
	stroke-width: inherit;
}

.icon-skeleton {
	width: 3.5rem;
	height: 3.5rem;
	border-radius: 0.25rem;
	background-color: var(--color-surface-bright);
}

.icon-name {
	font-size: 1rem;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 100%;
	text-align: center;
	display: -webkit-box;
	line-clamp: 2;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	word-break: break-word;
	transition: font-size 0.2s cubic-bezier(0.23, 1, 0.32, 1);
	height: auto;
}

.aside-open {
	font-size: 0.875rem;
}

@media (width < 768px) {
	.aside-open {
		font-size: 1rem;
	}
}
</style>
