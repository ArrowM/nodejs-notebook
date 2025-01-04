export interface PrintOptions {
	allowZero?: boolean;
	emptyChar?: string;
	colors?: PrintColorOption[];
}

export interface PrintColorOption {
	color: Color;
	strings: string[];
}

export function getMatrixString(matrix: any[][], opts?: PrintOptions) {
	const longestItem = Math.max(...matrix.flat().map(item => item?.toString().length ?? 0));
	const emptyChar = opts?.emptyChar ?? " ";
	const replaceEmpty = opts?.allowZero ?
		(item: any) => item ?? emptyChar :
		(item: any) => item || emptyChar;

	return matrix.map(row => row.map(item => {
		let itemString = replaceEmpty(item).toString().padEnd(longestItem);

		const highlightColor = opts?.colors.find(({ strings }) => strings.includes(itemString))?.color;
		if (highlightColor) {
			itemString = highlightColor.replace("%s", itemString);
		}

		return itemString;
	}).join(" ")).join("\n");
}

export function printMatrix(matrix: any[][], opts?: PrintOptions) {
	console.log(getMatrixString(matrix, opts));
}

export enum Color {
	DarkRed = "\x1b[91m%s\x1b[0m",
	Red = "\x1b[31m%s\x1b[0m",
	Green = "\x1b[32m%s\x1b[0m",
	Yellow = "\x1b[33m%s\x1b[0m",
	Blue = "\x1b[34m%s\x1b[0m",
	Magenta = "\x1b[35m%s\x1b[0m",
	Cyan = "\x1b[36m%s\x1b[0m",
	White = "\x1b[37m%s\x1b[0m",
}
