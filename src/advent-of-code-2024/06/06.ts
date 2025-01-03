import { measureExecutionTime } from "../../util/exec.util.ts";
import { input06 } from "./06-input.ts";

const input = input06;
const height = input.length;
const width = input[0].length;

const DIRECTIONS = [
	{ x: 0, y: -1 }, // N
	{ x: 1, y: 0 }, // E
	{ x: 0, y: 1 }, // S
	{ x: -1, y: 0 }, // W
];

const START = (() => {
	for (let y = 0; y < height; y++) {
		const x = input[y].indexOf("^");
		if (x !== -1) return { x, y };
	}
})();


/** Part 1 **/

function solve1() {
	const map = input.map(row => row.split(""));
	let activeDirIdx = 0;
	let pos = { ...START };

	const getTile = ({ x, y }) => map[y]?.[x];
	const setTile = ({ x, y }, char) => map[y][x] = char;

	setTile(START, "X");

	while (true) {
		const dir = DIRECTIONS[activeDirIdx];
		const nextPos = { x: pos.x + dir.x, y: pos.y + dir.y };
		const nextTile = getTile(nextPos);
		if (!nextTile) break;
		if (nextTile === "#") {
			activeDirIdx = (activeDirIdx + 1) % DIRECTIONS.length;
		}
		else {
			pos = nextPos;
			setTile(pos, "X");
		}
	}

	return map.join("").match(/X/g).length;
}


/** Part 2 **/

function solve2() {
	let result = 0;

	const getTile = (map, { x, y }) => map[y]?.[x];
	const setTile = (map, { x, y }, char) => map[y][x] = char;

	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			if (x === START.x && y === START.y) continue;

			const map = input.map(row => row.split(""));
			let activeDirIdx = 0;
			let pos = { ...START };

			setTile(map, pos, activeDirIdx.toString());
			setTile(map, { x, y }, "#");

			while (true) {
				const dir = DIRECTIONS[activeDirIdx];
				const nextPos = { x: pos.x + dir.x, y: pos.y + dir.y };
				const nextTile = getTile(map, nextPos);
				if (!nextTile) break;
				if (nextTile === "#") {
					activeDirIdx = (activeDirIdx + 1) % DIRECTIONS.length;
				}
				else if (nextTile === activeDirIdx.toString()) {
					result++;
					break;
				}
				else {
					pos = nextPos;
					setTile(map, pos, activeDirIdx.toString());
				}
			}
		}
	}

	return result;
}

/** Solver **/

measureExecutionTime(solve1);
measureExecutionTime(solve2);
