import { input14 } from "./14-input.ts";
import { measureExecutionTime } from "../../util/exec.util.ts";

// let input = input14Ex;
// const height = 7;
// const width = 11;

let input = input14;
const height = 103;
const width = 101;

/** Part 1 **/

function solve1(t = 100) {
	let quads = [0, 0, 0, 0];
	const halfHeight = Math.floor(height / 2);
	const halfWidth = Math.floor(width / 2);

	const robots = input.split("\n").map(line => line.match(/-?\d+/g).map(n => Number(n)));
	robots.forEach(([px, py, vx, vy]) => {
		let rx = (px + (t * vx)) % width;
		let ry = (py + (t * vy)) % height;
		if (rx < 0) rx += width;
		if (ry < 0) ry += height;
		if (rx > halfWidth && ry > halfHeight) quads[0]++;
		if (rx > halfWidth && ry < halfHeight) quads[1]++;
		if (rx < halfWidth && ry > halfHeight) quads[2]++;
		if (rx < halfWidth && ry < halfHeight) quads[3]++;
	});
	console.log(quads[0], quads[1], quads[2], quads[3]);
	return quads[0] * quads[1] * quads[2] * quads[3];
}


/** Part 2  **/

interface Robot {
	px: number,
	py: number,
	vx: number,
	vy: number,
}

function toMatrix(robots: Robot[]) {
	let matrix = Array.from({ length: height }, () => Array(width).fill(0));
	for (const { px, py } of robots) {
		matrix[py][px] += 1;
	}
	return matrix;
}

function printRobots(robots: Robot[]) {
	console.log(toMatrix(robots).map(line => line.map(c => c ? c : ".").join(" ")).join("\n"));
}

function getPercentRobotsWithNeighbors(robots: Robot[]) {
	let nRobotsWithNeighbors = 0;
	let matrix = toMatrix(robots);
	for (let y = 0; y < matrix.length; y++) {
		const row = matrix[y];
		for (let x = 0; x < row.length; x++) {
			const cell = row[x];
			// get a fast estimate with just 2 directions
			if (
				matrix[y + 1]?.[x] ||
				// matrix[y][x - 1] ||
				matrix[y][x + 1]
			) {
				nRobotsWithNeighbors += cell;
			}
		}
	}
	return nRobotsWithNeighbors / robots.length;
}

function solve2() {
	const robots = input.split("\n")
		.map(line => line.match(/-?\d+/g).map(n => Number(n)))
		.map(([px, py, vx, vy]) => ({ px, py, vx, vy }));

	for (let t = 1; t < 1_000_000; t++) {
		for (const robot of robots) {
			const { px, py, vx, vy } = robot;
			robot.px = (px + vx) % width;
			robot.py = (py + vy) % height;
			if (robot.px < 0) robot.px += width;
			if (robot.py < 0) robot.py += height;
		}
		if (getPercentRobotsWithNeighbors(robots) > 0.4) {
			printRobots(robots);
			console.log("t =", t.toLocaleString());
			return t;
		}
	}
}

/** Solver **/

measureExecutionTime(solve1);
measureExecutionTime(solve2);
