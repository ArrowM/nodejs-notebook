import { measureExecutionTime } from "../../util/exec.util.ts";
import { input04 } from "./04-input.ts";

const input = input04.split("\n");

/** Part 1 **/

function solve1(input: string[]) {
	const height = input.length;
	const width = input[0].length;
	let result = 0;

	function countXmas(line: string) {
		if (/XMAS/g.test(line)) result++;
		if (/SAMX/g.test(line)) result++;
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
	input.forEach(countXmas);

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
			const line1 = input[y][x] + input[y + 1][x + 1] + input[y + 2][x + 2];
			const line2 = input[y][x + 2] + input[y + 1][x + 1] + input[y + 2][x];
			if ([line1, line2].every(line => /MAS|SAM/.test(line))) {
				result += 1;
			}
		}
	}

	return result;
}

/** Solver  **/

measureExecutionTime(solve1);
measureExecutionTime(solve2);
