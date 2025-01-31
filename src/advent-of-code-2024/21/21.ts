import { measureExecutionTime } from "../../util/exec.util.ts";
import { input21 } from "./21-input.ts";
import { addPoints, atPoint, findPoint, type Point, subtractPoints } from "../../util/math.util.ts";

// const input = input21Ex1;
const input = input21;

const numPad = [
	["7", "8", "9"],
	["4", "5", "6"],
	["1", "2", "3"],
	[null, "0", "A"],
];

const dirPad = [
	[null, "^", "A"],
	["<", "v", ">"],
];


function findPathOptions(pad: string[][], start: Point, end: Point): string[] {
	let { x: dx, y: dy } = subtractPoints(end, start);
	const results = [];

	if (dx !== 0) {
		const pointAfterStep = addPoints(start, { x: Math.sign(dx) });
		if (atPoint(pad, pointAfterStep) !== null) {
			const paths = findPathOptions(pad, pointAfterStep, end);
			results.push(...paths.map(path => `${dx > 0 ? ">" : "<"}${path}`));
		}
	}

	if (dy !== 0) {
		const pointAfterStep = addPoints(start, { y: Math.sign(dy) });
		if (atPoint(pad, pointAfterStep) !== null) {
			const paths = findPathOptions(pad, pointAfterStep, end);
			results.push(...paths.map(path => `${dy > 0 ? "v" : "^"}${path}`));
		}
	}

	return results.length ? results : [""];
}


const nextPathOptionsCache = new Map([[numPad, new Map()], [dirPad, new Map()]]);

function findNextPathOptionsSeq(pad: string[][], path: string): string[][] {
	const cache = nextPathOptionsCache.get(pad);

	if (!cache.has(path)) {
		let start = findPoint(pad, "A");
		const nextPathOptions = path.split("").map(char => {
			const end = findPoint(pad, char);
			return findPathOptions(pad, start, start = end).map(s => s + "A");
		});
		cache.set(path, nextPathOptions);
	}

	return cache.get(path);
}


const finalLenCache = new Map<string, number>();

function findShortestFinalLen(pathOptions: string[], maxDepth: number, depth = 0): number {
	const key = depth + pathOptions.join("") + maxDepth;

	if (!finalLenCache.has(key)) {
		const nextSequences = pathOptions.map(path => findNextPathOptionsSeq(dirPad, path));
		depth++;

		let shortestFinalLen: number;
		for (const sequence of nextSequences) {
			const sequenceFinalLen = sequence.map(pathOptions =>
				(depth === maxDepth)
					? Math.min(...pathOptions.map(p => p.length))
					: findShortestFinalLen(pathOptions, maxDepth, depth),
			).reduce((tot, len) => tot + len, 0);

			if (!shortestFinalLen || sequenceFinalLen < shortestFinalLen) {
				shortestFinalLen = sequenceFinalLen;
			}
		}

		finalLenCache.set(key, shortestFinalLen);
	}

	return finalLenCache.get(key);
}


function solve(numBots: number) {
	let result = 0;

	for (const path of input.split("\n")) {
		const pathOptionsSeq = findNextPathOptionsSeq(numPad, path);
		const shortestLength = pathOptionsSeq
			.map(pathOptions => findShortestFinalLen(pathOptions, numBots))
			.reduce((tot, len) => tot + len, 0);
		result += shortestLength * Number(path.match(/\d+/));
	}

	return result;
}

measureExecutionTime(solve, 2);
measureExecutionTime(solve, 25);
