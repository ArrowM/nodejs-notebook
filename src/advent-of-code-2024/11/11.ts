import { measureExecutionTime } from "../../util/exec.util.ts";
import { input11 } from "./11-input.ts";

let input = input11;
const DEBUG = false;

/** Part 1 **/

function solve1(blinks = 25) {
	let stones = input.split(" ");
	for (let idx = 0; idx < blinks; idx++) {
		if (DEBUG) console.log(`calculating blink ${idx}`);
		stones = stones.flatMap(stone => {
			// If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
			if (stone === "0") return ["1"];
			// If the stone is engraved with a number that has an even number of digits, it is replaced by two stones.
			// The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone.
			// (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
			const halfLen = stone.length / 2;
			if (halfLen % 1 === 0) return [stone.slice(0, halfLen), Number(stone.slice(halfLen)).toString()];
			// If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone.
			return [(Number(stone) * 2024).toString()];
		});
	}
	return stones.length;
}


/** Part 2 **/

function solve2(blinks = 75) {
	let stones = input.split(" ");
	const stoneToRemainingStepsToResultLenMap: { [stone: string]: { [remainingSteps: number]: number } } = {};

	function getResultLen(stone: string | number, remainingSteps: number) {
		stone = Number(stone).toString();
		let remainingStepsToResultLenMap = stoneToRemainingStepsToResultLenMap[stone] ?? {};
		stoneToRemainingStepsToResultLenMap[stone] = remainingStepsToResultLenMap;

		let resultLen = remainingStepsToResultLenMap[remainingSteps];
		if (resultLen !== undefined) return resultLen;

		const halfLen = stone.length / 2;
		// base
		if (remainingSteps === 0) {
			resultLen = 1;
		}
		// rec cond 1
		else if (halfLen % 1 === 0) {
			resultLen = (
				getResultLen(stone.slice(0, halfLen), remainingSteps - 1) +
				getResultLen(stone.slice(halfLen), remainingSteps - 1)
			);
		}
		// rec cond 2
		else if (stone === "0") {
			resultLen = getResultLen("1", remainingSteps - 1);
		}
		// rec cond 3
		else {
			resultLen = getResultLen(Number(stone) * 2024, remainingSteps - 1);
		}

		remainingStepsToResultLenMap[remainingSteps] = resultLen;
		return resultLen;
	}

	return stones.reduce((tot, stone) => tot + getResultLen(stone, blinks), 0);
}


/** Solver **/

measureExecutionTime(solve1);
measureExecutionTime(solve2);
