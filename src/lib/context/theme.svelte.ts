import { getContext, setContext } from 'svelte';

export type Theme = 'light' | 'dark';

const THEME_CONTEXT = Symbol('theme');
const STORAGE_KEY = 'theme';

function isTheme(value: string | null): value is Theme {
	return value === 'light' || value === 'dark';
}

export type ThemeContext = {
	get value(): Theme;
	set value(val: Theme);
	toggle: () => void;
};

export function setThemeContext(initial: Theme = 'dark') {
	// 1. Retrieve initial value from LocalStorage (client-side only)
	if (typeof window !== 'undefined') {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (isTheme(stored)) {
			initial = stored;
		}
	}

	// 2. Define reactive state using the $state rune
	let theme = $state<Theme>(initial);

	// 3. Effect to sync theme changes with localStorage and HTML dataset
	$effect(() => {
		if (typeof window === 'undefined') return;

		localStorage.setItem(STORAGE_KEY, theme);
		document.documentElement.dataset.theme = theme;
	});

	// 4. Exposed reactive context object
	const context: ThemeContext = {
		get value() {
			return theme;
		},
		set value(v) {
			theme = v;
		},
		toggle() {
			theme = theme === 'dark' ? 'light' : 'dark';
		}
	};

	setContext(THEME_CONTEXT, context);

	return context;
}

export function getThemeContext() {
	const context = getContext<ThemeContext>(THEME_CONTEXT);
	if (!context) {
		throw new Error('getThemeContext must be called within a child component inside a setThemeContext tree.');
	}
	return context;
}
