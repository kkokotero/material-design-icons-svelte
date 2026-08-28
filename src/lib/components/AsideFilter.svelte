<script lang="ts">
import Add from 'material-design-icons-svelte/outlined/Add.svelte';
import Close from 'material-design-icons-svelte/outlined/Close.svelte';
import Done from 'material-design-icons-svelte/outlined/Done.svelte';
import Folder from 'material-design-icons-svelte/outlined/Folder.svelte';
import Refresh from 'material-design-icons-svelte/outlined/Refresh.svelte';
import Remove from 'material-design-icons-svelte/outlined/Remove.svelte';
import Style from 'material-design-icons-svelte/outlined/Style.svelte';
import { page } from '$app/state';
import { getAsideContext } from '$lib/context/aside.svelte';
import { getFilterContext } from '$lib/context/filter.svelte';
import { type Icon, VARIANTS, type Variant } from '$lib/icons';
import { ICON_CATEGORIES, type IconCategory } from '$lib/icons/metadata';
import { formatIconName } from '$lib/utils/format';
import AlertModal from './AlertModal.svelte';
import AsideDropdown from './AsideDropdown.svelte';

const icon: Icon | undefined = $derived((page.params.icon as Icon) ?? undefined);

const filterContext = getFilterContext();
const asideContext = getAsideContext();

let dialogOpen = $state(false);
let dialogCategory = $state('');

const hasFilters = $derived(
	filterContext.value.category !== 'all' ||
		filterContext.value.query !== '' ||
		(filterContext.value.color !== '#fbfbfb' && filterContext.value.color !== '#323232')
);

const FULL_ROW_CATEGORIES = new Set<IconCategory>([
	'communication',
	'notification',
	'hardware',
	'av'
]);

export function isFullRowCategory(category: IconCategory): boolean {
	return FULL_ROW_CATEGORIES.has(category);
}

function selectVariant(variant: Variant) {
	if (variant === filterContext.variant) return;
	filterContext.variant = variant;
}

function setCategory(category: IconCategory) {
	dialogOpen = false;

	if (category === filterContext.category) {
		filterContext.category = 'all';
		return;
	}
	filterContext.category = category;
}

function selectCategory(category: IconCategory) {
	if (icon !== undefined) {
		dialogOpen = true;
		dialogCategory = category;
		return;
	}

	setCategory(category);
}

function onSubmit(event: SubmitEvent) {
	event.preventDefault();
	event.stopPropagation();
}
</script>

<div class="filter-aside {asideContext.value && 'open'}">
	<div class="filter-aside__header">
		<button
			onclick={() => filterContext.reset()}
			type="button"
			class="filter-aside__action-reset"
			disabled={!hasFilters}
		>
			<Refresh class="filter-aside__action-reset-icon" />
			Reset Filters
		</button>
		<button onclick={() => asideContext.close()} type="button" class="filter-aside__action-close">
			<Close />
		</button>
	</div>
	<h4 class="filter-aside__gruop-title">Style</h4>
	<div class="filter-aside__group">
		<h5 class="filter-aside__sub-title">Stroke Width</h5>
		<form
			class="filter-aside__action-stroke-form"
			onsubmit={onSubmit}
			novalidate
			autocomplete="off"
		>
			<button
				type="button"
				class="filter-aside__action-stroke-button"
				onclick={() => filterContext.strokeWidth = Math.min(3, Math.max(-1, filterContext.strokeWidth - 1))}
			>
				<Remove />
			</button>
			<input
				class="filter-aside__action-stroke-input"
				type="number"
				bind:value={filterContext.strokeWidth}
				min="-1"
				max="3"
				step="1"
				inputmode="decimal"
				autocomplete="off"
				oninput={(event) => {
			const input = event.currentTarget as HTMLInputElement;
			const value = Number(input.value);

			if (!Number.isNaN(value)) {
				filterContext.strokeWidth = Math.min(3, Math.max(-1, value));
			}
		}}
			/>
			<button
				type="button"
				class="filter-aside__action-stroke-button"
				onclick={() => filterContext.strokeWidth = Math.min(3, Math.max(-1, filterContext.strokeWidth + 1))}
			>
				<Add />
			</button>
		</form>
	</div>
	<div class="filter-aside__group">
		<h5 class="filter-aside__sub-title">Color</h5>
		<form
			class="filter-aside__action-stroke-form"
			onsubmit={onSubmit}
			novalidate
			autocomplete="off"
		>
			<div class="color-picker">
				<input
					type="color"
					bind:value={filterContext.value.color}
					class="color-picker__input"
					aria-label="Choose color"
					name="color-picker"
					id="color-picker"
				/>

				<div
					class="filter-aside__color--preview"
					style="--input-color: {filterContext.value.color}"
				></div>
			</div>
			<input
				type="text"
				class="filter-aside__color--value"
				bind:value={filterContext.value.color}
				name="color-value"
				id="color-value"
				oninput={(event) => {
     			const input = event.currentTarget as HTMLInputElement;
     			const value = input.value;
                filterContext.color = value.startsWith('#') ? value : `#${value}`;
				}}
			/>
			{#if filterContext.value.color !== "#fbfbfb" && filterContext.value.color !== "#323232"}
				<button
					type="button"
					class="filter-aside__action-color"
					onclick={() => filterContext.value.color = undefined}
				>
					<Close />
				</button>
			{/if}
		</form>
	</div>
	<AsideDropdown>
		{#snippet head()}
			<h3 class="filter-aside__section-title">
				<Style />
				<div class="filter-aside__section-title-wrapper">
					Variant
					<p
						class="filter-aside__selected-option {filterContext.value.variant === 'outlined' && 'hidden'}"
					>
						({formatIconName(filterContext.value.variant)})
					</p>
				</div>
			</h3>
		{/snippet}
		{#snippet content()}
			<div class="filter-aside__options">
				{#each VARIANTS as variant (variant)}
					<button
						onclick={() => selectVariant(variant)}
						type="button"
						class="filter-aside__option {filterContext.value.variant === variant && 'active'}"
					>
						{#if filterContext.value.variant === variant}
							<Done />
						{/if}
						{formatIconName(variant)}
					</button>
				{/each}
			</div>
		{/snippet}
	</AsideDropdown>
	<h4 class="filter-aside__gruop-title">Filters</h4>
	<AsideDropdown selected={filterContext.value.category !== 'all'}>
		{#snippet head()}
			<h3 class="filter-aside__section-title">
				<Folder />
				<div class="filter-aside__section-title-wrapper">
					Category
					<p
						class="filter-aside__selected-option {filterContext.value.category === 'all' && 'hidden'}"
					>
						({formatIconName(filterContext.value.category)})
					</p>
				</div>
			</h3>
		{/snippet}
		{#snippet content()}
			<div class="filter-aside__options-2">
				{#each ICON_CATEGORIES as category (category)}
					<button
						onclick={() => selectCategory(category)}
						type="button"
						class="filter-aside__option {isFullRowCategory(category) && 'full-row'} {filterContext.value.category === category && 'active'}"
					>
						{#if filterContext.value.category === category}
							<Close />
						{/if}
						{formatIconName(category)}
					</button>
				{/each}
			</div>
		{/snippet}
	</AsideDropdown>
</div>

<AlertModal open={dialogOpen}>
	<h3 class="dialog--title">Change <strong class="dialog--title__icon">icon</strong> category?</h3>
	<p class="dialog--text">
		You are viewing an icon from the <strong>{formatIconName(dialogCategory)}</strong> category. If
		you change the category, you will see the icons from the new category when you return to the
		list.
	</p>
	<p class="dialog--text">The icon you are currently viewing will not change.</p>
	<div class="dialog--actions">
		<button
			class="dialog--action dialog--action--cancel"
			onclick={() => dialogOpen = false}
			type="button"
		>
			Cancel
		</button>
		<button
			class="dialog--action dialog--action--change"
			onclick={() => setCategory(dialogCategory as IconCategory)}
			type="button"
		>
			Change category
		</button>
	</div>
</AlertModal>

<style>
.filter-aside__action-color {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2.8rem;
	height: 2.8rem;
	font-size: 1.3rem;
	padding: 0;
	background: none;
	color: var(--color-on-surface-variant);
}

.filter-aside__action-color:hover {
	background-color: var(--color-surface-variant);
}

.filter-aside__color--value {
	border: none;
	background: none;
	color: var(--color-on-surface-variant);
	width: 100%;
	max-width: 7rem;
	text-align: center;
	margin: 0;
	font-size: 1.3rem;
	padding: 0.5rem;
}

.filter-aside__color--value:hover {
	background-color: var(--color-surface-variant);
}

.filter-aside__color--value:focus {
	outline: none;
}

.color-picker {
	position: relative;
	width: 2.8rem;
	height: 2.8rem;
}

.color-picker__input {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
	cursor: pointer;
	z-index: 1;
}

.filter-aside__color--preview {
	background-color: var(--input-color);
	width: 100%;
	height: 100%;
	border-radius: 5rem;
}

.dialog--title {
	font-size: 3rem;
	font-weight: 500;
	margin: 0;
	margin-bottom: 1rem;
}

.dialog--title__icon {
	font-style: italic;
	color: var(--color-primary);
}

.dialog--text {
	font-size: 1.2rem;
	line-height: 1.4;
}

.dialog--actions {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	gap: 0.5rem;
}

.dialog--action {
	border: none;
	cursor: pointer;
	background: none;
	color: var(--color-on-surface);
}

.dialog--action:hover {
	background-color: var(--color-surface-container);
}

.dialog--action--change:hover {
	background-color: var(--color-error);
	color: var(--color-on-error);
}

.hidden {
	display: none;
}

.filter-aside {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	overflow: hidden;
	width: 0rem;
	height: 100dvh;
	transition: width 0.5s cubic-bezier(0.42, 0, 0.2, 0.99);
	background-color: var(--color-surface-container);
	white-space: nowrap;
	z-index: 10000;
}

.filter-aside.open {
	width: auto;
	overflow-y: auto;
}

.filter-aside__header {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 0.5rem;
	padding: 1rem;
	width: 100%;
	position: sticky;
	top: 0;
	background-color: var(--color-surface-container);
	z-index: 500;
}

.filter-aside__action-close {
	border: none;
	cursor: pointer;
	color: var(--color-on-surface-variant);
	background: none;
	aspect-ratio: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 1.2rem;
	padding: 1rem;
	stroke-width: 1px;
	transition: background-color 0.3s cubic-bezier(0.42, 0, 0.2, 0.99);
}

.filter-aside__action-close:hover {
	background-color: var(--color-surface-bright);
}

.filter-aside__action-reset {
	background: none;
	color: var(--color-primary);
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
	gap: 0.5rem;
	transition: background-color 0.3s cubic-bezier(0.42, 0, 0.2, 0.99);
}

.filter-aside__action-reset:hover:not(:disabled) {
	background-color: var(--color-surface-bright);
}

.filter-aside__action-reset:disabled {
	color: var(--color-on-surface-variant);
	background: none;
}

:global(.filter-aside__action-reset-icon) {
	font-size: 1.4rem;
	stroke-width: 1px;
	transition:
		transform 0.3s cubic-bezier(0.42, 0, 0.2, 0.99),
		font-size 0.3s cubic-bezier(0.42, 0, 0.2, 0.99);
}

.filter-aside__action-reset:hover:not(:disabled) :global(.filter-aside__action-reset-icon) {
	transform: rotate(120deg);
	font-size: 1.6rem;
}

.filter-aside__section-title {
	font-size: 1.5rem;
	display: flex;
	align-items: center;
	gap: 1rem;
	font-weight: 500;
	margin: 0;
	flex: 1;
	transition: gap 0.3s cubic-bezier(0.42, 0, 0.2, 0.99);
}

.filter-aside__section-title:hover {
	gap: 2rem;
}

.filter-aside__options {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	flex-direction: column;
	padding: 0.5rem;
}

.filter-aside__options-2 {
	display: grid;
	grid-template-columns: repeat(2, minmax(0rem, 1fr));
	gap: 0.5rem;
	flex-direction: column;
	padding: 0.5rem;
}

.filter-aside__option {
	background: none;
	position: relative;
	min-width: 10rem;
	color: var(--color-on-surface-variant);
	border: 0.1rem solid var(--color-outline);
	border-radius: 1rem;
	transition:
		border-radius 0.3s ease,
		background-color 0.3s cubic-bezier(0.42, 0, 0.2, 0.99);
}

.filter-aside__option:hover {
	border-radius: 5rem;
}

.filter-aside__option.active {
	background: var(--color-secondary);
	color: var(--color-on-secondary);
	border: none;
	border-radius: 5rem;
	gap: 0.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
}

.filter-aside__option.active:hover {
	border-radius: 1rem;
}

.filter-aside__option.full-row {
	grid-column: span 2;
	padding: 0.5rem 2rem;
}

.filter-aside__group {
	width: 100%;
	padding: 0rem 2rem;
	padding-bottom: 1rem;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.filter-aside__gruop-title {
	margin: 0;
	font-size: 1.5rem;
	font-weight: 500;
	width: 100%;
	padding: 1rem 2rem;
}

.filter-aside__sub-title {
	margin: 0;
	font-size: 1.2rem;
	font-weight: 500;
	width: 100%;
	padding: 0.5rem 0.5rem;
}
.filter-aside__action-stroke-form {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.2rem;
	background-color: var(--color-surface);
	width: auto;
	border-radius: 5rem;
	padding: 0.2rem;
}

.filter-aside__action-stroke-button {
	border: none;
	cursor: pointer;
	padding: 0.2rem;
	display: flex;
	align-items: center;
	justify-content: center;
	aspect-ratio: 1;
	background: none;
	color: var(--color-on-surface-variant);
}

.filter-aside__action-stroke-button:hover {
	background-color: var(--color-surface-variant);
}

.filter-aside__action-stroke-input {
	border: none;
	background: none;
	color: var(--color-on-surface-variant);
	width: 100%;
	min-width: 1rem;
	max-width: 2.8rem;
	text-align: center;
}

.filter-aside__action-stroke-input::-webkit-inner-spin-button,
.filter-aside__action-stroke-input::-webkit-outer-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

.filter-aside__action-stroke-input:hover {
	background-color: var(--color-surface-variant);
}

.filter-aside__action-stroke-input:focus {
	outline: none;
}

.filter-aside__selected-option {
	font-size: 1rem;
	margin: 0;
}

.filter-aside__section-title-wrapper {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}
</style>
