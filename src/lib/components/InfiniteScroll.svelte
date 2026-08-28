<script lang="ts" generics="T">
import { tick } from 'svelte';

type Props<T> = {
	items: T[];
	chunkSize?: number;
	rootMargin?: string;
	children: (item: T, index: number) => any;
	storageKey?: string;
};

let {
	items,
	chunkSize = 100,
	rootMargin = '500px 0px',
	children,
	storageKey = 'infinite_scroll_state'
}: Props<T> = $props();

function getSavedState() {
	if (typeof window === 'undefined') return null;
	try {
		const raw = sessionStorage.getItem(storageKey);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		const currentUrl = window.location.pathname + window.location.search;

		if (parsed.url === currentUrl) {
			return parsed;
		}
	} catch {
		return null;
	}
	return null;
}

const savedState = getSavedState();

let visibleCount = $state(savedState?.count ?? chunkSize);
let sentinel = $state<HTMLElement | null>(null);
let hasRestoredScroll = $state(false);

const visibleItems = $derived(items.slice(0, visibleCount));
const hasMore = $derived(visibleCount < items.length);

function loadMore() {
	visibleCount = Math.min(visibleCount + chunkSize, items.length);
}

$effect(() => {
	if (!hasRestoredScroll && savedState?.scrollY && items.length > 0) {
		hasRestoredScroll = true;
		tick().then(() => {
			window.scrollTo({ top: savedState.scrollY, behavior: 'instant' });
		});
	}
});

$effect(() => {
	if (typeof window === 'undefined') return;

	function save() {
		const currentUrl = window.location.pathname + window.location.search;
		sessionStorage.setItem(
			storageKey,
			JSON.stringify({
				url: currentUrl,
				count: visibleCount,
				scrollY: window.scrollY
			})
		);
	}

	window.addEventListener('scroll', save, { passive: true });
	window.addEventListener('beforeunload', save);

	return () => {
		window.removeEventListener('scroll', save);
		window.removeEventListener('beforeunload', save);
	};
});

$effect(() => {
	const element = sentinel;

	if (!element || !hasMore) {
		return;
	}

	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry?.isIntersecting) {
				loadMore();
			}
		},
		{
			rootMargin,
			threshold: 0
		}
	);

	observer.observe(element);

	return () => observer.disconnect();
});
</script>

{#each visibleItems as item, index}
	{@render children(item, index)}
{/each}

{#if hasMore}
	<div bind:this={sentinel} class="sentinel" aria-hidden="true"></div>
{/if}

<style>
.sentinel {
	width: 100%;
	height: 1px;
}
</style>
