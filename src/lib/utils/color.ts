type RGBA = {
	r: number;
	g: number;
	b: number;
	a?: number;
};

export const rgbaToHex = ({ r, g, b, a = 1 }: RGBA): string => {
	const toHex = (value: number) =>
		Math.round(Math.max(0, Math.min(255, value)))
			.toString(16)
			.padStart(2, '0');

	const alpha = Math.round(Math.max(0, Math.min(1, a)) * 255);

	const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

	return alpha < 255 ? `${hex}${toHex(alpha)}` : hex;
}
