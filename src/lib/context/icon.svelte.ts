import { getContext, setContext } from 'svelte';
import { type Icon, isVariant, SVG_BY_VARIANT, type Variant } from '$lib/icons';
import {
	filterIconForMetadata,
	type IconMetadata,
	isValidCategory as isCategory
} from '$lib/icons/metadata';
import { getFilterContext } from './filter.svelte';

const ICON_CONTEXT = Symbol('icon');

export type IconState = {
	readonly activeIcons: Record<Icon, string> | null;
	readonly isFetching: boolean;
	readonly loadError: boolean;
	readonly filteredIcons: IconMetadata[];
	readonly hasFilteredIcons: boolean;
	readonly isValidVariant: boolean;
  readonly isValidCategory: boolean;
};

export type IconContext = {
	get value(): IconState;
};

export function setIconContext() {
	const filterContext = getFilterContext();
  const cached = new Map<Variant, Record<Icon, string>>();

	// 1. Estado reactivo interno
	let activeIcons = $state<Record<Icon, string> | null>(null);
	let isFetching = $state<boolean>(false);
	let loadError = $state<boolean>(false);

	// 2. Valores derivados vinculados a filterContext
	const filteredIcons = $derived(
		filterIconForMetadata(filterContext.value.query, filterContext.value.category)
	);
	const hasFilteredIcons = $derived(filteredIcons.length > 0);
	const isValidVariant = $derived(isVariant(filterContext.value.variant));
	const isValidCategory = $derived(
		isCategory(filterContext.value.category) || filterContext.value.category === 'all'
	);

	// 3. Efecto de carga dinámica y caché de SVGs
	$effect(() => {
		const variant = filterContext.value.variant;

		if (!isValidVariant || !hasFilteredIcons) return;

		if (cached.has(variant)) {
			activeIcons = cached.get(variant) ?? ({} as Record<Icon, string>);
			isFetching = false;
			loadError = false;
			return;
		}

		isFetching = true;
		loadError = false;

		let canceled = false;

		SVG_BY_VARIANT[variant]()
			.then((icons) => {
				if (canceled) return;
				cached.set(variant, icons);
				activeIcons = icons;
				isFetching = false;
			})
			.catch(() => {
				if (canceled) return;
				loadError = true;
				isFetching = false;
			});

		return () => {
			canceled = true;
		};
	});

	// 4. Objeto de contexto reactivo expuesto a través de `.value`
	const context: IconContext = {
		get value() {
			return {
				activeIcons,
				isFetching,
				loadError,
				filteredIcons,
				hasFilteredIcons,
				isValidVariant,
				isValidCategory
			};
		}
	};

	setContext(ICON_CONTEXT, context);

	return context;
}

export function getIconContext() {
	const context = getContext<IconContext>(ICON_CONTEXT);
	if (!context) {
		throw new Error(
			'getIconContext must be called within a child component inside a setIconContext tree.'
		);
	}
	return context;
}
