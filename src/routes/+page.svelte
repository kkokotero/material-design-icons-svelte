<script lang="ts">
import HeroMessage from '$lib/components/HeroMessage.svelte';
import IconCard from '$lib/components/IconCard.svelte';
import InfiniteScroll from '$lib/components/InfiniteScroll.svelte';
import { getFilterContext } from '$lib/context/filter.svelte';
import { getIconContext } from '$lib/context/icon.svelte';

const filterContext = getFilterContext();
const iconContext = getIconContext();

const {
	isValidVariant,
	isValidCategory,
	hasFilteredIcons,
	activeIcons,
	loadError,
	isFetching,
	filteredIcons
} = $derived(iconContext.value);
</script>

{#if !isValidVariant}
	<HeroMessage message="Invalid variant.">
		<div class="hero-buttons">
			<button
				type="button"
				onclick={() => {
					filterContext.variant = 'outlined';
				}}
			>
				Back to home
			</button>
		</div>
	</HeroMessage>
{:else if !isValidCategory}
	<HeroMessage message="Invalid category.">
		<div class="hero-buttons">
			<button
				type="button"
				onclick={() => {
					filterContext.category = 'all';
				}}
			>
				Back to home
			</button>
		</div>
	</HeroMessage>
{:else if !hasFilteredIcons}
	<HeroMessage message="Nothing found.">
		<div class="hero-buttons">
			<button
				type="button"
				onclick={() => {
					filterContext.query = '';
				}}
			>
				Back to home
			</button>
		</div>
	</HeroMessage>
{:else if loadError && !activeIcons}
	<HeroMessage message="Failed to load icons">
		<p>Something went wrong while loading the icons. Please try again.</p>
	</HeroMessage>
{:else}
	<div class="icons-grid" class:fetching={isFetching}>
		<InfiniteScroll items={filteredIcons} chunkSize={100}>
			{#snippet children({ name })}
				<IconCard {name} svg={activeIcons?.[name]} />
			{/snippet}
		</InfiniteScroll>
	</div>
{/if}

<style>
.icons-grid {
	display: grid;
	grid-template-columns: repeat(7, minmax(0rem, 1fr));
	gap: 1rem;
	transition: opacity 0.2s ease;
	max-width: 1200px;
	margin: 0 auto;
}

.icons-grid.fetching {
	pointer-events: none;
}

@media (width <= 768px) {
	.icons-grid {
		grid-template-columns: repeat(3, minmax(0rem, 1fr));
		padding: 0.5rem 1rem;
	}
}
</style>
