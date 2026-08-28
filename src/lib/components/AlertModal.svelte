<script lang="ts">
import type { Snippet } from 'svelte';

type Props = {
	open?: boolean;
	children?: Snippet;
};

let { open = $bindable(), children }: Props = $props();

let dialog: HTMLDialogElement;

function handleCancel(event: Event) {
	event.preventDefault();
	event.stopPropagation();

	dialog.showModal();
}

function openModal() {
	dialog.showModal();
}

function closeModal() {
	dialog.close();
}

$effect(() => {
	if (open) openModal();
	else closeModal();
});
</script>

<dialog oncancel={handleCancel} bind:this={dialog} class="dialog {open && 'open'}">
	{@render children?.()}
</dialog>

<style>
.dialog {
	border: none;
	opacity: 1;
	border-radius: 2rem;
	background-color: var(--color-surface-variant);
	transform: scale(1);
	transition:
		opacity 200ms ease,
		transform 200ms ease,
		display 200ms allow-discrete,
		overlay 200ms allow-discrete;
}

@starting-style {
	.dialog {
		opacity: 0;
		transform: scale(0);
	}
}

.dialog::backdrop {
	background: rgb(0 0 0 / 50%);
	transition:
		background 200ms ease,
		display 200ms allow-discrete,
		overlay 200ms allow-discrete;
}

@starting-style {
	.dialog::backdrop {
		background: rgb(0 0 0 / 0%);
	}
}
</style>
