export function printMatrix(matrix: any[][], emptyChar = " ", allowZero = true) {
	const replaceEmpty = allowZero ? item => item ?? emptyChar : item => item || emptyChar;
	const longestItem = Math.max(...matrix.flat().map(item => item?.toString().length ?? 0));
	console.log(
		matrix.map(row => row.map(item =>
			replaceEmpty(item).toString().padEnd(longestItem),
		).join(" "),
		).join("\n"),
	);
}
