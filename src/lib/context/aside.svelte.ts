import { getContext, setContext } from 'svelte';

const ASIDE_CONTEXT = Symbol('aside');
const STORAGE_KEY = 'aside_open';

export type AsideContext = {
	get value(): boolean;
	set value(val: boolean);
	toggle: () => void;
	open: () => void;
	close: () => void;
};

export function setAsideContext(initialOpen: boolean = true) {
	// 1. Retrieve initial value from LocalStorage (client-side only)
	if (typeof window !== 'undefined') {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored !== null) {
			initialOpen = stored === 'true';
		}
	}

	// 2. Define reactive state using the $state rune
	let isOpen = $state<boolean>(initialOpen);

	// 3. Effect to sync sidebar state with localStorage and HTML dataset
	$effect(() => {
		if (typeof window === 'undefined') return;

		localStorage.setItem(STORAGE_KEY, String(isOpen));
		document.documentElement.dataset.asideOpen = String(isOpen);
	});

	// 4. Exposed reactive context object
	const context: AsideContext = {
		get value() {
			return isOpen;
		},
		set value(v: boolean) {
			isOpen = v;
		},
		toggle() {
			isOpen = !isOpen;
		},
		open() {
			isOpen = true;
		},
		close() {
			isOpen = false;
		}
	};

	setContext(ASIDE_CONTEXT, context);

	return context;
}

export function getAsideContext() {
	const context = getContext<AsideContext>(ASIDE_CONTEXT);
	if (!context) {
		throw new Error('getAsideContext must be called within a child component inside a setAsideContext tree.');
	}
	return context;
}
