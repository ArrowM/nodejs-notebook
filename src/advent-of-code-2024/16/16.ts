import { delay, measureExecutionTime } from "../../util/exec.util.ts";
import {
	addPoints,
	atPoint,
	dirToChar,
	getPerpendicularVectors,
	minIdx,
	type Point,
	pointsEqual,
	subtractPoints,
} from "../../util/math.util.ts";
import { Color, matrixToString } from "../../util/string.utils.ts";
import { input16 } from "./16-input.ts";

const DEBUG = false;
const MS_PER_DEBUG_FRAME = 0;
const DEBUG_START_COST = 100_000;

const input = input16;

interface Intersection extends Point {
	cost: number;
	discoveryDir: Point;
	pathsTo: Intersection[][];
}

const colors = [
	{ color: Color.Blue, strings: ["S", "E"] },
	{ color: Color.Red, strings: ["<", "v", "^", ">"] },
	{ color: Color.Green, strings: ["O"] },
];

function parseInput() {
	const map = input.split("\n").map(line => line.split("").map(c => c === "#" ? " " : c));
	let start: Point;
	let end: Point;
	map.forEach((row, y) => {
		row.forEach((cell, x) => {
			if (cell === "S") start = { x, y };
			if (cell === "E") end = { x, y };
		});
	});
	return { map, start, end };
}

const knownIntersections: Intersection[] = [];
const unexploredIntersections: Intersection[] = [];

function discoverNextIntersection(map: string[][], fromIntersection: Intersection, fromPoint: Point, dir: Point, cost: number) {
	cost++;
	const unexploredPoint = { ...addPoints(fromPoint, dir) };
	let isIntersection = false;

	switch (atPoint(map, unexploredPoint)) {
		case ".":
		case "o":
			isIntersection = getPerpendicularVectors(dir).some(perpDir =>
				[".", "o"].includes(atPoint(map, addPoints(unexploredPoint, perpDir))),
			);
			if (!isIntersection) {
				// continue searching
				discoverNextIntersection(map, fromIntersection, unexploredPoint, dir, cost);
				return;
			}
			break;
		case "E":
			isIntersection = true;
	}

	if (isIntersection) {
		const pathsTo = fromIntersection.pathsTo.length ?
			fromIntersection.pathsTo.map(pathTo => [...pathTo, fromIntersection]) :
			[[fromIntersection]];
		const matchedIntersection = knownIntersections.find((known) =>
			pointsEqual(known, unexploredPoint) && pointsEqual(known.discoveryDir, dir),
		);

		const newIntersection = { ...unexploredPoint, pathsTo, discoveryDir: dir, cost };

		if (!matchedIntersection) {
			unexploredIntersections.push(newIntersection);
			knownIntersections.push(newIntersection);
		}
		else if (cost < matchedIntersection.cost) {
			// Got to same state cheaper, re-explore it
			knownIntersections.splice(knownIntersections.indexOf(matchedIntersection), 1);
			unexploredIntersections.splice(unexploredIntersections.indexOf(matchedIntersection), 1);
			unexploredIntersections.push(newIntersection);
			knownIntersections.push(newIntersection);
		}
		else if (cost === matchedIntersection.cost) {
			matchedIntersection.pathsTo.push(...pathsTo);
		}
	}
}

function discoverNextIntersections(map: string[][], discoverySource: Intersection) {
	[discoverySource.discoveryDir, ...getPerpendicularVectors(discoverySource.discoveryDir)].forEach(dir => {
		const cost = discoverySource.cost + (pointsEqual(dir, discoverySource.discoveryDir) ? 0 : 1000);
		discoverNextIntersection(map, discoverySource, discoverySource, dir, cost);
	});
}

function drawLine(map: string[][], start: Point, end: Point, dir: Point, char: string) {
	let pnt: Point = start;
	while (true) {
		if (!["S", "E"].includes(map[pnt.y][pnt.x])) {
			map[pnt.y][pnt.x] = char;
		}
		if (pointsEqual(pnt, end)) return;
		pnt = addPoints(pnt, dir);
	}
}

function drawPathsTo(map: string[][], intersection: Intersection, opts: { char?: string, onlyLatest?: boolean } = {}) {
	const pathsWithIntersections = intersection.pathsTo.map(pathTo => [...pathTo, intersection]);
	for (const pathTo of pathsWithIntersections) {
		for (let idx = pathTo.length; idx > 0; idx--) {
			const [startIntersection, endIntersection] = pathTo.slice(idx - 2, idx);
			if (!startIntersection) break;

			const endpoint = subtractPoints(endIntersection, endIntersection.discoveryDir);
			const char = opts.char ?? dirToChar(endIntersection.discoveryDir);
			drawLine(map, startIntersection, endpoint, endIntersection.discoveryDir, char);
		}
		if (opts.onlyLatest) break;
	}
}

async function printMap(map: string[][], cost: number) {
	const clearConsole = "\x1b[2J\x1b[0;0H";
	const legend =
		". : undiscovered\n" +
		"o : explored\n" +
		"\x1b[91m>\x1b[0m : active search\n" +
		"\x1b[32mO\x1b[0m : shortest path\n" +
		"\n" +
		"current cost: " + cost + "\n";
	const mapString = matrixToString(map, { colors });
	console.log(clearConsole + legend + mapString);

	if (MS_PER_DEBUG_FRAME) await delay(MS_PER_DEBUG_FRAME);
}

async function drawPathToExplorationSource(map: string[][], intersection: Intersection) {
	drawPathsTo(map, intersection, { onlyLatest: true, char: "o" });

	if (DEBUG) {
		if (intersection.cost > DEBUG_START_COST) {
			// Print a copy of the map with a path to this intersection
			const mapPrintCopy = map.map(r => r.map(c => c));
			drawPathsTo(mapPrintCopy, intersection);
			await printMap(mapPrintCopy, intersection.cost);
		}
		else {
			console.clear();
			console.log("current cost", intersection.cost);
		}
	}
}

/** Part 1 & 2 **/

async function solve() {
	const { map, start, end } = parseInput();
	knownIntersections.push({ ...start, cost: 0, discoveryDir: { x: 1 }, pathsTo: [] });
	unexploredIntersections.push(...knownIntersections);

	while (unexploredIntersections.length) {
		const cheapestIdx = minIdx(unexploredIntersections.map(({ cost }) => cost));
		const [explorationSource] = unexploredIntersections.splice(cheapestIdx, 1);
		const isAtEnd = pointsEqual(explorationSource, end);

		await drawPathToExplorationSource(map, explorationSource);

		if (!isAtEnd) discoverNextIntersections(map, explorationSource);
	}


	const endIntersections = knownIntersections.filter(inter => pointsEqual(inter, end));
	const lowestCost = Math.min(...endIntersections.map(e => e.cost));
	const cheapestEnds = endIntersections.filter(e => e.cost == lowestCost);
	cheapestEnds.forEach(cheapest => drawPathsTo(map, cheapest, { char: "O" }));
	await printMap(map, lowestCost);
	return {
		lowestCost,
		numTilesOnLowest: map.flat().filter(c => ["S", "E", "O"].includes(c)).length,
	};
}

/** Solver **/

measureExecutionTime(solve);
