import {input04} from "./04-input.ts";
import {measureExecutionTime} from "../../util/exec.util.ts";

let input = input04.split("\n");

/** Part 1 **/

function solve1(input: string[]) {
	const height = input.length;
	const width = input[0].length;
	let result = 0;

	function countXmas(line: string) {
		result += line.match(/XMAS/g)?.length ?? 0;
		result += line.match(/SAMX/g)?.length ?? 0;
	}

	// N
	for (let x = 0; x < width; x++) {
		let line = "";
		for (let y = 0; y < height; y++) {
			line += input[y][x];
		}
		countXmas(line);
	}

	// E
	for (const line of input) {
		countXmas(line);
	}

	// NE
	for (let y1 = 0; y1 < height; y1++) {
		let line = "";
		for (let x = 0, y = y1; y >= 0 && x < width; x++, y--) {
			line += input[y][x];
		}
		countXmas(line);
	}
	for (let x1 = 1; x1 < width; x1++) {
		let line = "";
		for (let x = x1, y = height - 1; y >= 0 && x < width; x++, y--) {
			line += input[y][x];
		}
		countXmas(line);
	}

	// SE
	for (let y1 = 0; y1 < height; y1++) {
		let line = "";
		for (let x = 0, y = y1; y < height && x < width; x++, y++) {
			line += input[y][x];
		}
		countXmas(line);
	}
	for (let x1 = 1; x1 < width; x1++) {
		let line = "";
		for (let x = x1, y = 0; y < height && x < width; x++, y++) {
			line += input[y][x];
		}
		countXmas(line);
	}

	return result;
}


/** Part 2 **/

function solve2(input: string[]) {
	const height = input.length;
	const width = input[0].length;
	let result = 0;

	for (let x = 0; x < width - 2; x++) {
		for (let y = 0; y < height - 2; y++) {
			let line1 = input[y][x] + input[y + 1][x + 1] + input[y + 2][x + 2];
			let line2 = input[y][x + 2] + input[y + 1][x + 1] + input[y + 2][x];

			if (
				(line1 === "MAS" && line2 === "MAS") ||
				(line1 === "SAM" && line2 === "SAM")
			) {
				result += 1;
			}
		}
	}

	return result;
}



measureExecutionTime(solve2, [
	"M.M.M",
	".A.A.",
	"S.S.S",
	".A.A.",
	"M.M.M",
]);

/** Solver **/

// measureExecutionTime(solve1, input)
// measureExecutionTime(solve2, input)
