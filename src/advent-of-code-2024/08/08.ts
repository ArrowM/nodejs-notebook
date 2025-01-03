import { measureExecutionTime } from "../../util/exec.util.ts";
import { addPoints, type Point, subtractPoints } from "../../util/math.util.ts";
import { input08 } from "./08-input.ts";

const input = input08;

const height = input.length;
const width = input[0].length;

/** Part 1 **/

function isPointInBounds({ x, y }: Point) {
	return x >= 0 && x < width && y >= 0 && y < height;
}

function solve(findAntisFn: Function) {
	const towersDict: { [key: string]: Point[] } = {};
	input.forEach((row, y) => {
		row.split("").forEach((char, x) => {
			if (![".", "#"].includes(char)) {
				towersDict[char] = (towersDict[char] ?? []).concat({ x, y });
			}
		});
	});

	const resultMap = Array.from({ length: height }, () => Array(width).fill("."));

	Object.values(towersDict).forEach((towers) => {
		Object.values(towers).forEach((tower1, idx) => {
			towers.slice(idx + 1)?.forEach((tower2) => {
				findAntisFn(tower1, tower2).forEach((pnt) => {
					resultMap[pnt.y][pnt.x] = "#";
					// console.log(resultMap.map(r => r.join("")).join("\n"));
					// console.log("\n");
				});
			});
		});
	});

	const resultString = resultMap.map(r => r.join("")).join("\n");
	// console.log(resultString);
	return resultString.match(/#/g)?.length ?? 0;
}

function findAntis1(tower1: Point, tower2: Point) {
	const diff = { x: tower1.x - tower2.x, y: tower1.y - tower2.y };
	return [
		{ x: tower1.x + diff.x, y: tower1.y + diff.y },
		{ x: tower2.x - diff.x, y: tower2.y - diff.y },
	].filter(p => isPointInBounds(p));
}

const solve1 = () => solve(findAntis1);

/** Part 2 **/

function findAntis2(tower1: Point, tower2: Point) {
	const diff = { x: tower1.x - tower2.x, y: tower1.y - tower2.y };
	const antis = [];

	let translated = tower1;
	while (isPointInBounds(translated)) {
		antis.push(translated);
		translated = addPoints(translated, diff);
	}

	translated = tower1;
	while (isPointInBounds(translated)) {
		antis.push(translated);
		translated = subtractPoints(translated, diff);
	}

	return antis;
}


const solve2 = () => solve(findAntis2);

/** Solver **/

measureExecutionTime(solve1);
measureExecutionTime(solve2);
