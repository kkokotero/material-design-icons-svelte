<script lang="ts">
import type { Snippet } from 'svelte';
import { getRandomAscii } from '$lib/constants/ascii';

type Props = {
	message: string;
	children?: Snippet;
};

let { message, children }: Props = $props();
</script>

<section class="hero">
	<p class="hero-ascii" data-font="sans">{getRandomAscii()}</p>

	<p class="hero-message">{message}</p>

	{@render children?.()}
</section>

<style>
.hero {
	width: 100%;
	height: 100%;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.hero-ascii {
	width: 100%;
	font-size: clamp(4rem, 10dvw, 10rem);
	text-align: center;
}

.hero-message {
	font-size: clamp(1rem, 5dvw, 2rem);
}
</style>
