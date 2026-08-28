export function createCooldown<T extends (...args: any[]) => any>(
	fn: T,
	delay: number,
	onComplete?: () => void
) {
	let timer: ReturnType<typeof setTimeout> | undefined;

	return async (...args: Parameters<T>): Promise<void> => {
		if (timer) {
			return;
		}

		await fn(...args);

		timer = setTimeout(() => {
			timer = undefined;
			onComplete?.();
		}, delay);
	};
}
