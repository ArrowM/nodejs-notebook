import { measureExecutionTime } from "../../util/exec.util.ts";
import { input05 } from "./05-input.ts";

const input = input05.split("\n");

/** Part 1 **/

const brIdx = input.indexOf("");
const rules = input.slice(0, brIdx).map(rule => rule.split("|").map(n => parseInt(n)));
const updates = input.slice(brIdx + 1).map(update => update.split(",").map(n => parseInt(n)));

function isValidUpdate(update: number[]) {
	for (const [beforeNum, afterNum] of rules) {
		const beforeIdx = update.indexOf(beforeNum);
		const afterIdx = update.indexOf(afterNum);
		if ([beforeIdx, afterIdx].includes(-1)) {
			continue;
		}
		if (beforeIdx > afterIdx) {
			return false;
		}
	}
	return true;
}

function solve1() {
	// sum middle numbers of valid updates
	return updates
		.filter(update => isValidUpdate(update))
		.reduce((total, update) => total + update[Math.floor(update.length / 2)], 0);
}


/** Part 2 **/

const numToAfterMap: { [key: number]: Set<number> } = {};
rules.forEach(([bef, aft]) => {
	numToAfterMap[bef] = numToAfterMap[bef] ?? new Set();
	numToAfterMap[bef].add(aft);
});

function compareNum(a: number, b: number) {
	if (numToAfterMap[a]?.has(b)) {
		return -1;
	}
	if (numToAfterMap[b]?.has(a)) {
		return 1;
	}
	return 0;
}

function solve2() {
	// sum middle numbers of originally invalid updates after they have been corrected
	const invalidUpdates = updates.filter(update => !isValidUpdate(update));
	return invalidUpdates
		.map(update => update.sort((a, b) => compareNum(a, b)))
		.reduce((total, update) => total + update[Math.floor(update.length / 2)], 0);
}

/** Solver **/

measureExecutionTime(solve1, input);
measureExecutionTime(solve2, input);
