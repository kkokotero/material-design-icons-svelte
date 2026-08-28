<script lang="ts">
	const links = [
		{ label: 'Icons', href: '/' },
		{ label: 'GitHub', href: 'https://github.com/kkokotero/material-design-icons-svelte' }
	];
</script>

<footer class="footer">
	<div class="footer__content">
		<div class="footer__brand">
			<a href="/" class="footer__logo">Material Design Icons Svelte</a>

			<p>
				Material Design Icons as Svelte components.
			</p>
		</div>

		<nav class="footer__nav" aria-label="Footer navigation">
			{#each links as link}
				<a href={link.href}>{link.label}</a>
			{/each}
		</nav>
	</div>

	<div class="footer__bottom">
		<span>© {new Date().getFullYear()} Material Design Icons Svelte</span>

		<span>
			Icons by
			<a href="https://fonts.google.com/icons" target="_blank" rel="noreferrer">
				Material Design Icons
			</a>
		</span>
	</div>
</footer>

<style>
	.footer {
		padding: 3rem 2rem 1.5rem;
	}

	.footer__content {
		display: flex;
		justify-content: space-between;
		gap: 3rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.footer__brand {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.footer__logo {
		color: var(--color-on-surface);
		font-size: 1.1rem;
		font-weight: 600;
		text-decoration: none;
	}

	.footer__brand p {
		margin: 0;
		color: var(--color-on-surface-variant);
		font-size: 0.875rem;
	}

	.footer__nav {
		display: flex;
		gap: 1.5rem;
		align-items: flex-start;
	}

	.footer__nav a,
	.footer__bottom a {
		color: var(--color-on-surface-variant);
		text-decoration: none;
		transition: color 150ms ease;
	}

	.footer__nav a:hover,
	.footer__bottom a:hover {
		color: var(--color-on-surface);
	}

	.footer__bottom {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		max-width: 1200px;
		margin: 3rem auto 0;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-outline-variant);
		color: var(--color-on-surface-variant);
		font-size: 0.8rem;
	}

	@media (max-width: 600px) {
		.footer__content,
		.footer__bottom {
			flex-direction: column;
		}

		.footer__nav {
			flex-wrap: wrap;
		}
	}
</style>
