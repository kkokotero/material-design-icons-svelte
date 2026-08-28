export function createDownloadSvg(svg: string, filename = 'icon.svg'): void {
	const blob = new Blob([svg], {
		type: 'image/svg+xml;charset=utf-8'
	});

	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');

	link.href = url;
	link.download = filename;

	document.body.appendChild(link);
	link.click();
	link.remove();

	URL.revokeObjectURL(url);
}

type PngOptions = {
	filename?: string;
	size?: number;
	color?: string;
};

export async function createDownloadPng(
	svg: string,
	{ filename = 'icon.png', size = 512, color = '#000000' }: PngOptions = {}
): Promise<void> {
	const coloredSvg = svg.replace(/currentColor/g, color);

	const blob = new Blob([coloredSvg], {
		type: 'image/svg+xml;charset=utf-8'
	});

	const url = URL.createObjectURL(blob);

	try {
		const image = new Image();

		await new Promise<void>((resolve, reject) => {
			image.onload = () => resolve();
			image.onerror = () => reject(new Error('Failed to load SVG'));

			image.src = url;
		});

		const canvas = document.createElement('canvas');

		canvas.width = size;
		canvas.height = size;

		const context = canvas.getContext('2d');

		if (!context) {
			throw new Error('Canvas 2D context is not available');
		}

		context.drawImage(image, 0, 0, size, size);

		const png = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));

		if (!png) {
			throw new Error('Failed to convert SVG to PNG');
		}

		const downloadUrl = URL.createObjectURL(png);

		const link = document.createElement('a');

		link.href = downloadUrl;
		link.download = filename;

		document.body.appendChild(link);
		link.click();
		link.remove();

		URL.revokeObjectURL(downloadUrl);
	} finally {
		URL.revokeObjectURL(url);
	}
}
