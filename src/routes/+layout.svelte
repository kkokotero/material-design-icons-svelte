<script lang="ts">
import type { Snippet } from 'svelte';
import AsideFilter from '$lib/components/AsideFilter.svelte';
import FooterPage from '$lib/components/FooterPage.svelte';
import HeaderMenu from '$lib/components/HeaderMenu.svelte';
import ScrollToTop from '$lib/components/ScrollToTop.svelte';
import { setAsideContext } from '$lib/context/aside.svelte';
import { setFilterContext } from '$lib/context/filter.svelte';
import { setIconContext } from '$lib/context/icon.svelte';
import { setThemeContext } from '$lib/context/theme.svelte';

type Props = {
	children: Snippet;
};

const { children }: Props = $props();

const filterContext = setFilterContext();
const themeContext = setThemeContext();
const asideContext = setAsideContext(false);
const iconContext = setIconContext();

$effect(() => {
  if (filterContext.value.color === undefined ||
    filterContext.value.color === "#fbfbfb" ||
    filterContext.value.color === "#323232") {
    filterContext.value.color = themeContext.value === 'dark' ? "#fbfbfb" : "#323232";
  }
})
</script>

<svelte:head>
	<title>Material Design Icons Svelte</title>
	<meta name="theme-color" content={themeContext.value} />
	<meta name="query-search" content={filterContext.query} />
	<meta name="query-category" content={filterContext.category} />
	<meta name="query-variant" content={filterContext.variant} />
	<meta name="aside-open" content={String(asideContext.value)} />
	<meta name="icon-loading" content={String(iconContext.value.isFetching)} />
	<meta name="icon-error" content={String(iconContext.value.loadError)} />
</svelte:head>

<div class="app-container {asideContext.value && 'aside-open'}" data-theme={themeContext.value}>
	<aside>
		<AsideFilter />
	</aside>

	<div class="app-main">
		<header>
			<HeaderMenu />
		</header>
		<main>
			<ScrollToTop />
			{@render children?.()}
		</main>
		<footer>
			<FooterPage />
		</footer>
	</div>
</div>

<style>
@import "$lib/styles/root.css";

.app-container {
	display: flex;
	transition: gap 1s cubic-bezier(0.42, 0, 0.2, 0.99);
}

.app-container.aside-open {
	gap: 1rem;
}

.app-main {
	display: flex;
	gap: 0.5rem;
	flex-direction: column;
	width: 100%;
	flex: 1;
	min-height: 100dvh;
}

.app-main header {
	width: 100%;
	height: auto;
	position: sticky;
	top: 0;
	background-color: var(--color-background);
	z-index: 99;
}

.app-main main {
	flex: 1;
	width: 100%;
	height: auto;
	z-index: 1;
}

.app-main footer {
	width: 100%;
	height: auto;
}

.app-container aside {
	width: auto;
	height: 100dvh;
	position: sticky;
	top: 0;
	z-index: 100;
}

@media (width <= 768px) {
	.app-container aside {
		position: fixed;
		top: 0;
		left: 0;
	}
}
</style>
