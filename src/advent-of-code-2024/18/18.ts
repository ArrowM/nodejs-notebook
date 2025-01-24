import { delay, measureExecutionTime } from "../../util/exec.util.ts";
import { getAdjacentPoints, pointsEqual } from "../../util/math.util.ts";
import { SortedList } from "../../util/sorted-list.utils.ts";
import { Color, printMatrix } from "../../util/string.utils.ts";
import { input18 } from "./18-input.ts";

let input = input18;
const GRID_SIZE = 71;

// let input = input18Ex1;
// const GRID_SIZE = 7;
// const BYTES_DROPPED = 12;

/** Part 1 **/

interface Point {
	x: number,
	y: number,
	cost: number,
}

const wallCoords = [...input.matchAll(/(\d+),(\d+)/g)];

async function solve1({BYTES_DROPPED, log}) {
	const walls = Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => false));
	wallCoords.slice(0, BYTES_DROPPED).forEach(([_, x, y]) => walls[+y][+x] = true);

	const start = { x: 0, y: 0, cost: 0 };
	const end = { x: GRID_SIZE - 1, y: GRID_SIZE - 1 };
	const exploredPoints = Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => false));
	const pointsToExplore = new SortedList<Point>((p1, p2) => p2.cost - p1.cost);
	pointsToExplore.add(start);

	function findExplorationPoints(src: Point) {
		const explorationPoints = getAdjacentPoints(src).filter((p) => {
			const isOutOfBounds = p.x < 0 || p.x >= GRID_SIZE || p.y < 0 || p.y >= GRID_SIZE;
			if (isOutOfBounds) return false;

			const isWall = walls[p.y][p.x];
			if (isWall) return false;

			const isAlreadyExplored = exploredPoints[p.y][p.x];
			if (isAlreadyExplored) return false;

			return true;
		}) as Point[];

		explorationPoints.forEach((p) => p.cost = src.cost + 1);

		exploredPoints[src.y][src.x] = true;

		return explorationPoints;
	}

	function printSolution() {
		const solutionMatrix = Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => "_"));
		walls.forEach((row, y) => row.forEach((cell, x) => {
			if (cell) solutionMatrix[y][x] = "#";
		}));
		exploredPoints.forEach((row, y) => row.forEach((cell, x) => {
			if (cell) solutionMatrix[y][x] = ".";
		}));
		console.clear();
		// printMatrix(solutionMatrix);
		printMatrix(solutionMatrix, {
			colors: [
				{ color: Color.DarkRed, strings: ["#"] },
				{ color: Color.Cyan, strings: ["."] },
			],
		});
	}

	// Solve
	for (let i = 0; pointsToExplore.length; i++) {
		const explorationSource = pointsToExplore.pop();

		if (log && i++ % 10 === 0) {
			await delay(1);
			printSolution();
			console.log("explorationSource", explorationSource);
		}

		if (pointsEqual(explorationSource, end)) {
			if (log) printSolution();
			return explorationSource.cost;
		}

		findExplorationPoints(explorationSource).forEach(p1 => {
			if (!pointsToExplore.getList().some(p2 => pointsEqual(p1, p2))) {
				pointsToExplore.add(p1);
			}
		});
	}

	if (log) printSolution();
	return -1;
}


/** Part 2 **/

async function solve2({log}) {
	for (let i = (GRID_SIZE * 2) - 1; i < Math.pow(GRID_SIZE, 2); i++) {
		const cost = await solve1({log: false, BYTES_DROPPED: i});
		console.log("bytes dropped", i, "cost", cost)

		if (cost === -1) {
			await solve1({log: true, BYTES_DROPPED: i - 1});
			console.log("first byte to block exit:")
			return wallCoords[i - 1][0];
		}
	}
}

/** Solver **/

// await measureExecutionTime(solve1, {BYTES_DROPPED: 1024, log: true});
await measureExecutionTime(solve2, {log: true});
