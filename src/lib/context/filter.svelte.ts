import { getContext, setContext } from 'svelte';
import { goto } from '$app/navigation';
import type { Variant } from '$lib/icons';
import type { IconCategory } from '$lib/icons/metadata';

export type FilterState = {
	category: IconCategory | 'all';
	query: string;
	variant: Variant;
	strokeWidth: number;
	color?: string;
};

const FILTER_CONTEXT = Symbol('filter');

export type FilterContext = {
	get value(): FilterState;
	get query(): string;
	set query(val: string);
	get category(): IconCategory | 'all';
	set category(val: IconCategory | 'all');
	get variant(): Variant;
	set variant(val: Variant);
	get strokeWidth(): number;
	set strokeWidth(val: number);
	get color(): string | undefined;
	set color(val: string | undefined);
	reset: () => void;
};

const DEFAULT_FILTERS: FilterState = {
	category: 'all',
	query: '',
	variant: 'outlined',
	strokeWidth: 0,
	color: undefined
};

export function setFilterContext(initial: Partial<FilterState> = {}) {
	const initialFilters: FilterState = {
		...DEFAULT_FILTERS,
		...initial
	};

	// 1. Read initial values from URL search params if present (client-side)
	if (typeof window !== 'undefined') {
		const params = new URLSearchParams(window.location.search);
		const urlQuery = params.get('q');
		const urlCategory = params.get('category') as IconCategory | 'all' | null;
		const urlVariant = params.get('variant') as Variant | null;
    const urlStrokeWidth = Number(params.get('stroke-width') || 0) as number | null;
		const urlColor = params.get('color');

		if (urlQuery !== null) initialFilters.query = urlQuery;
		if (urlCategory !== null) initialFilters.category = urlCategory;
		if (urlVariant !== null) initialFilters.variant = urlVariant;
		if (urlStrokeWidth !== null) initialFilters.strokeWidth = urlStrokeWidth;
		if (urlColor !== null && urlColor.toLowerCase() !== '#000000' && urlColor !== '') initialFilters.color = urlColor;
	}

	// 2. Define reactive state using the $state rune
	let filters = $state<FilterState>(initialFilters);

	// 3. Sync changes back to URL search params
	$effect(() => {
		if (typeof window === 'undefined') return;
		const url = new URL(window.location.href);

		// Sync query param (omit if empty)
		if (filters.query.trim()) {
			url.searchParams.set('q', filters.query.trim());
		} else {
			url.searchParams.delete('q');
		}

		// Sync category param (omit if default 'all')
		if (filters.category !== 'all') {
			url.searchParams.set('category', filters.category);
		} else {
			url.searchParams.delete('category');
		}

		// Sync variant param (omit if default 'filled')
		if (filters.variant !== DEFAULT_FILTERS.variant) {
			url.searchParams.set('variant', filters.variant);
		} else {
			url.searchParams.delete('variant');
		}

		if (filters.strokeWidth !== DEFAULT_FILTERS.strokeWidth && filters.strokeWidth !== null) {
			url.searchParams.set('stroke-width', String(filters.strokeWidth));
		} else {
			url.searchParams.delete('stroke-width');
    }

    const normalizedColor = filters.color?.toLowerCase();
    if (filters.color !== undefined && normalizedColor !== '#000000' && normalizedColor !== '' && normalizedColor !== '#') {
      url.searchParams.set('color', filters.color);
		} else {
			url.searchParams.delete('color');
    }

		// Update URL without triggering a full page reload or scrolling top
		goto(url.toString(), {
			replaceState: true,
			keepFocus: true,
			noScroll: true
		});
	});

	// 4. Exposed reactive context object
	const context: FilterContext = {
		get value() {
			return filters;
		},

		get query() {
			return filters.query;
		},
		set query(v: string) {
			filters.query = v;
		},

		get category() {
			return filters.category;
		},
		set category(v: IconCategory | 'all') {
			filters.category = v;
		},

		get variant() {
			return filters.variant;
		},
		set variant(v: Variant) {
			filters.variant = v;
		},

		get strokeWidth() {
			return filters.strokeWidth;
		},
		set strokeWidth(v: number) {
			filters.strokeWidth = v;
		},

		get color() {
			return filters.color;
		},
		set color(v: string | undefined) {
      filters.color = v;
		},

		reset() {
			const variant = filters.variant;
			filters = { ...DEFAULT_FILTERS, ...initial, variant };
		}
	};

	setContext(FILTER_CONTEXT, context);

	return context;
}

export function getFilterContext() {
	const context = getContext<FilterContext>(FILTER_CONTEXT);
	if (!context) {
		throw new Error(
			'getFilterContext must be called within a child component inside a setFilterContext tree.'
		);
	}
	return context;
}
