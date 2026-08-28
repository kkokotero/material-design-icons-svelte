<script lang="ts">
import ArrowUpward from 'material-design-icons-svelte/outlined/ArrowUpward.svelte';

type Props = {
	threshold?: number;
};

const { threshold = 300 }: Props = $props();

let showButton = $state(false);

$effect(() => {
	function handleScroll() {
		showButton = window.scrollY > threshold;
	}

	handleScroll();
	window.addEventListener('scroll', handleScroll, { passive: true });

	return () => {
		window.removeEventListener('scroll', handleScroll);
	};
});

function scrollToTop() {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
}
</script>

<button
	type="button"
	class="scroll-to-top {showButton && 'visible'}"
	onclick={scrollToTop}
	aria-label="Volver arriba"
	tabindex={showButton ? 0 : -1}
>
	<ArrowUpward />
</button>

<style>
.scroll-to-top {
	position: fixed;
	bottom: 2rem;
	right: 3rem;
	z-index: 50;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 4rem;
	aspect-ratio: 1;
	padding: 0;
	border: none;
	border-radius: 50%;
	background-color: var(--color-surface-variant);
	color: var(--color-on-surface-variant);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	cursor: pointer;
	font-size: 1.5rem;

	opacity: 0;
	visibility: hidden;
	pointer-events: none;
	transform: translateY(1rem) scale(0.9);
}

/* Estado visible */
.scroll-to-top.visible {
	opacity: 1;
	visibility: visible;
	pointer-events: auto;
	transform: translateY(0) scale(1);
}

@media (width <= 768px) {
	.scroll-to-top {
		right: 2rem;
	}
}

.scroll-to-top:hover {
	background-color: var(--color-surface-bright);
}
</style>
