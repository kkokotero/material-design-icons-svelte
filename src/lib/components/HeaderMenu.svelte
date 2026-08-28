<script lang="ts">
import ArrowBack from 'material-design-icons-svelte/outlined/ArrowBack.svelte';
import ArrowOutward from 'material-design-icons-svelte/outlined/ArrowOutward.svelte';
import Bedtime from 'material-design-icons-svelte/outlined/Bedtime.svelte';
import Close from 'material-design-icons-svelte/outlined/Close.svelte';
import Search from 'material-design-icons-svelte/outlined/Search.svelte';
import Tune from 'material-design-icons-svelte/outlined/Tune.svelte';
import WbSunny from 'material-design-icons-svelte/outlined/WbSunny.svelte';
import { goto } from '$app/navigation';
import { page } from '$app/state';
import { getAsideContext } from '$lib/context/aside.svelte';
import { getFilterContext } from '$lib/context/filter.svelte';
import { getThemeContext } from '$lib/context/theme.svelte';
import type { Icon } from '$lib/icons';
import { formatIconName } from '$lib/utils/format';

const icon: Icon | undefined = $derived((page.params.icon as Icon) ?? undefined);

const filterContext = getFilterContext();
const asideContext = getAsideContext();
const themeContext = getThemeContext();

const hasFilters = $derived(
	filterContext.value.category !== 'all' ||
		filterContext.value.query !== '' ||
		filterContext.value.strokeWidth !== 0 ||
		(filterContext.value.color !== '#fbfbfb' && filterContext.value.color !== '#323232')
);

const homeUrl = $derived.by(() => {
	const url = new URL(page.url);

	url.pathname = '/';
	url.search = new URLSearchParams(page.url.searchParams).toString();

	return url.toString();
});

function onSearchSubmit(event: SubmitEvent) {
	event.preventDefault();
	event.stopPropagation();

	const form = event.target as HTMLFormElement;
	filterContext.query = form.search.value.trim();

	goto(homeUrl);
}
</script>

<div class="header-menu {asideContext.value ? 'aside-open' : ''}">
	<div class="header-menu__head">
		<button
			type="button"
			onclick={() => goto(homeUrl, {noScroll: true, keepFocus: true})}
			class="circular-button-icon {!icon && 'visually-hidden'}"
		>
			<ArrowBack />
		</button>
		<h1 class="header-menu__head--title mobile-hidden">Material <span>Svelte</span></h1>
		<div class="header-menu_head-nav nav-search">
			<form class="header-menu__head-form" onsubmit={onSearchSubmit}>
				<label for="search-icons" class="visually-hidden">Search icons</label>
				<Search class="header-menu__head-form-icon" />
				<input
					bind:value={filterContext.value.query}
					id="search-icons"
					name="search"
					type="search"
					placeholder="Search Icons..."
					class="header-menu__head-form-input"
					autocomplete="off"
				/>
			</form>

			<div class="header-menu__head-links">
				<a
					href="https://github.com/kkokotero/material-design-icons-svelte"
					target="_blank"
					rel="noopener noreferrer"
					class="github-link desktop"
					aria-label="GitHub Repository"
					title="View on GitHub"
				>
					<ArrowOutward class="github-link-icon" />
				</a>

				<button type="button" onclick={() => themeContext.toggle()} class="circular-button-icon">
					{#if themeContext.value === "light"}
						<Bedtime />
					{:else}
						<WbSunny />
					{/if}
				</button>
			</div>
		</div>
	</div>
	<div class="header-menu__actions">
		<button
			onclick={asideContext.toggle}
			type="button"
			class="header-menu__action-filter {hasFilters ? 'active' : ''}"
		>
			{#if asideContext.value}
				<Close />
			{:else}
				<Tune />
			{/if}
			Filters
		</button>
		{#if filterContext.value.category !== 'all'}
			<button
				onclick={() => filterContext.value.category = 'all'}
				type="button"
				class="header-menu__action-category"
			>
				<Close /> {formatIconName(filterContext.value.category)}
			</button>
		{/if}
		{#if filterContext.value.strokeWidth !== 0}
			<button
				onclick={() => filterContext.value.strokeWidth = 0}
				type="button"
				class="header-menu__action-stroke-width"
			>
				<Close />
				Stroke Width
			</button>
		{/if}
		{#if (filterContext.value.color !== '#fbfbfb' && filterContext.value.color !== '#323232')}
			<button
				onclick={() => filterContext.value.color = undefined}
				type="button"
				class="header-menu__action-stroke-width"
			>
				<Close />
				Color
			</button>
		{/if}
		{#if hasFilters}
			<button onclick={filterContext.reset} type="button" class="header-menu__action-clear">
				Clear All
			</button>
		{/if}
	</div>
</div>

<style>
.visually-hidden {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}

.header-menu {
	display: flex;
	flex-direction: column;
	z-index: 10;
	position: sticky;
	top: 0;
	padding: 1rem;
	margin: 0 auto;
	max-width: 1300px;
}

.header-menu__head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: nowrap;
	padding: 1rem;
	gap: 5rem;
	width: auto;
}

.header-menu__head--title {
	font-size: 2.5rem;
	margin: 0;
}

.header-menu__head--title span {
	color: var(--color-primary-fixed);
}

.header-menu__head-form {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: nowrap;
	position: relative;
	z-index: 0;
	pointer-events: all;
	flex: 1;
}

:global(.header-menu__head-form-icon) {
	font-size: 1.4rem;
	stroke-width: 0px;
	position: absolute;
	left: 1rem;
}

.header-menu__head-form-input {
	background-color: var(--color-surface-variant);
	border: none;
	padding-left: 3rem;
	width: 100%;
	flex: 1;
}

.header-menu_head-nav {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: nowrap;
	gap: 0.5rem;
	width: auto;
}

.nav-search {
	flex: 1;
}

.github-link {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	width: 3rem;
	aspect-ratio: 1;
	border-radius: 5rem;
	color: var(--color-on-surface-variant);
}

.github-link :global(.github-link-icon) {
	font-size: clamp(1rem, 5dvw, 1.5rem);
	stroke-width: 0;
}

.circular-button-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	padding: 0.8rem;
	aspect-ratio: 1;
	border-radius: 5rem;
	font-size: clamp(1rem, 5dvw, 1.5rem);
	color: var(--color-on-surface-variant);
	background: none;
	stroke-width: 0;
}

.circular-button-icon:hover {
	background-color: var(--color-surface-variant);
	box-shadow: none;
}

.mobile-hidden {
	display: block;
}

.header-menu__actions {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: 0.5rem;
	padding: 0 1rem;
	flex-wrap: wrap;
}

.header-menu__action-filter {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	background-color: var(--color-surface-variant);
	color: var(--color-on-surface-variant);
	transition:
		border-radius 0.3s cubic-bezier(0.42, 0, 0.2, 0.99),
		background-color 0.3s cubic-bezier(0.42, 0, 0.2, 0.99);
}

.header-menu__action-filter.active {
	background-color: var(--color-primary);
	color: var(--color-on-primary);
	border-radius: 1rem;
}

.header-menu__action-category {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	background-color: var(--color-tertiary);
	color: var(--color-on-tertiary);
	border-radius: 0.8rem;
	min-height: 0rem;
	padding: 0.5rem 1rem;
	font-size: 0.8rem;
	margin: 0;
}

.header-menu__action-stroke-width {
	background-color: var(--color-secondary);
	color: var(--color-on-secondary);
	border-radius: 0.8rem;
	min-height: 0rem;
	padding: 0.5rem 1rem;
	font-size: 0.8rem;
	margin: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
}

.header-menu__action-clear {
	background: none;
	color: var(--color-on-surface-variant);
	border-radius: 0.8rem;
	min-height: 0rem;
	padding: 0.5rem 1rem;
	font-size: 0.8rem;
	margin: 0;
}

.header-menu__action-clear:hover {
	color: var(--color-on-surface);
	background-color: var(--color-surface-variant);
}

.header-menu__head-links {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 1rem;
}

@media (width <= 768px) {
	.header-menu__head {
		gap: 0.5rem;
	}

	.mobile-hidden {
		display: none;
	}

	.header-menu_head-nav {
		flex: 1;
		gap: 1rem;
	}

	.header-menu.aside-open {
		z-index: -1;
	}
}
</style>
