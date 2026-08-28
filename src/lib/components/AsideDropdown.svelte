<script lang="ts">
import KeyboardArrowDown from 'material-design-icons-svelte/outlined/KeyboardArrowDown.svelte';
import type { Snippet } from 'svelte';

type Props = {
	head: Snippet;
	content?: Snippet;
	opened?: boolean;
	selected?: boolean;
};

const { content, head, opened, selected }: Props = $props();

let open = $state(opened ?? false);

function toggle() {
	open = !open;
}
</script>

<div class="filter-aside__section {open && 'open'} {selected && 'selected'}">
	<button onclick={toggle} type="button" class="filerter-aside__section-head">
		{@render head()}
		<KeyboardArrowDown class="filter-aside__section-head__arrow {open && 'open'}" />
	</button>
	<div class="filerter-aside__section-content">
		{@render content?.()}
	</div>
</div>

<style>
.filter-aside__section {
	padding: 0 1rem;
	width: 100%;
}

.filerter-aside__section-head {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 0.5rem;
	padding: 1rem 1.5rem;
	cursor: pointer;
	border-radius: 5rem;
	width: 100%;
	color: var(--color-on-surface-variant);
	background: none;
	transition:
		border-radius 0.3s cubic-bezier(0.42, 0, 0.2, 0.99),
		background-color 0.3s cubic-bezier(0.42, 0, 0.2, 0.99);
}

:global(.filter-aside__section-head__arrow) {
	font-size: 1.5rem;
	transition: transform 0.3s cubic-bezier(0.42, 0, 0.2, 0.99);
}

:global(.filter-aside__section-head__arrow.open) {
	transform: rotate(180deg);
}

.filter-aside__section.open .filerter-aside__section-head {
	background-color: var(--color-primary);
	color: var(--color-on-primary);
	border-radius: 4rem;
}

.filter-aside__section.selected .filerter-aside__section-head {
	background-color: var(--color-tertiary);
	color: var(--color-on-tertiary);
	border-radius: 1rem;
}

.filerter-aside__section-head:hover {
	background-color: var(--color-surface-bright);
	border-radius: 1rem;
}

.filter-aside__section.open .filerter-aside__section-head:hover {
	background-color: var(--color-primary-container);
	color: var(--color-on-primary-container);
	border-radius: 1rem;
}

.filter-aside__section.selected .filerter-aside__section-head:hover {
	background-color: var(--color-tertiary-container);
	color: var(--color-on-tertiary-container);
	border-radius: 5rem;
}

.filerter-aside__section-content {
	height: 0rem;
	overflow: hidden;
	transition: height 0.5s cubic-bezier(0.42, 0, 0.2, 0.99);
}

.filter-aside__section.open .filerter-aside__section-content {
	height: auto;
}
</style>
