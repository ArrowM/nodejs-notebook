import { measureExecutionTime } from "../../util/exec.util.ts";
import type { Point } from "../../util/math.util.ts";
import { input10 } from "./10-input.ts";

const input = input10;
const DEBUG = true;

/** Part 1 **/
// count trail heads in reach

function printTrailHeadsMap(map: Point[][][]) {
	console.log(map.map(row => row.map(cell => cell.length).join(" ")).join("\n"));
}

function countTrailHeadsToCell({ x, y, trailHeadsToCell, searchElevation }) {
	if (input[y][x] != searchElevation) return [];
	return [...new Set([
		...trailHeadsToCell[y + 1]?.[x] ?? [],
		...trailHeadsToCell[y - 1]?.[x] ?? [],
		...trailHeadsToCell[y]?.[x + 1] ?? [],
		...trailHeadsToCell[y]?.[x - 1] ?? [],
	])];
}

function solve1() {
	let trailHeadsToCell: Point[][][] = input.map((row, y) =>
		row.split("").map((cell, x) =>
			cell === "0" ? [{ x, y }] : [],
		),
	);

	if (DEBUG) {
		printTrailHeadsMap(trailHeadsToCell);
		console.log("search: ", 0);
		console.log("count: ", trailHeadsToCell.flat().reduce((t, x) => t + x.length, 0));
		console.log();
	}

	for (let searchElevation = 1; searchElevation < 10; searchElevation++) {
		trailHeadsToCell = trailHeadsToCell.map((row, y) =>
			row.map((cell, x) =>
				countTrailHeadsToCell({ x, y, trailHeadsToCell, searchElevation }),
			),
		);

		if (DEBUG) {
			printTrailHeadsMap(trailHeadsToCell);
			console.log("search: ", searchElevation);
			console.log("count: ", trailHeadsToCell.flat().reduce((t, x) => t + x.length, 0));
			console.log();
		}
	}

	return trailHeadsToCell.flat().reduce((t, x) => t + x.length, 0);
}


/** Part 2 **/
// count number of possible trails

function printTrailCountMap(map: number[][]) {
	console.log(map.map(r => r.join(" ")).join("\n"));
}

function countUniqueTrailsToCell({ x, y, numTrailsToCell, searchElevation }) {
	if (input[y][x] != searchElevation) return 0;
	return [
		numTrailsToCell[y + 1]?.[x],
		numTrailsToCell[y - 1]?.[x],
		numTrailsToCell[y]?.[x + 1],
		numTrailsToCell[y]?.[x - 1],
	].reduce((tot, val) => tot + (val ?? 0), 0);
}

function solve2() {
	let numTrailsToCell: number[][] = input.map(row => row.split("").map(cell => cell === "0" ? 1 : 0));

	if (DEBUG) {
		printTrailCountMap(numTrailsToCell);
		console.log("search: ", 0);
		console.log("count: ", numTrailsToCell.flat().reduce((t, x) => t + x, 0));
		console.log();
	}

	for (let searchElevation = 1; searchElevation < 10; searchElevation++) {
		numTrailsToCell = numTrailsToCell.map((row, y) =>
			row.map((cell, x) =>
				countUniqueTrailsToCell({ x, y, numTrailsToCell, searchElevation }),
			),
		);

		if (DEBUG) {
			printTrailCountMap(numTrailsToCell);
			console.log("search: ", searchElevation);
			console.log("count: ", numTrailsToCell.flat().reduce((t, x) => t + x, 0));
			console.log();
		}
	}

	return numTrailsToCell.flat().reduce((t, x) => t + x, 0);
}

/** Solver **/

measureExecutionTime(solve1);
measureExecutionTime(solve2);
