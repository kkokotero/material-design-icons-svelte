export const generateImportIconSvelte = (variant: string, name: string): string => {
	return `<script lang="ts">
  import ${name} from 'material-design-icons-svelte/${variant}/${name}.svelte';
</script>

<${name} />
`;
};

export const formatIconName = (name: string) => {
	return name
		.replace(/[-_]/g, " ")
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/([a-zA-Z])(\d)/g, "$1 $2")
		.replace(/(\d)([a-zA-Z])/g, "$1 $2")
		.trim()
		.toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace("N ", "");
};

export const formatSvg = (svg: string): string => {
	const normalized = svg.trim().replace(/'/g, '"').replace(/>\s+</g, '><');

	return normalized.replace(/<svg([^>]*)>(.*?)<\/svg>/s, (_, attributes, body) => {
		const elements: string[] = body.trim().match(/<[^>]+(?:\/>|>.*?<\/[^>]+>)/g) ?? [];

		return [
			`<svg ${attributes.trim()}>`,
			...elements.map((element) => `    ${element.trim()}`),
			`</svg>`
		].join('\n');
	});
}
