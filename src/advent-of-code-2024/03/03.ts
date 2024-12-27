import { sum } from "lodash-es";

import { measureExecutionTime } from "../../util/exec.util.ts";
import { input03 } from "./03-input.ts";

const input = input03;

/** Part 1 **/

function solve1(input: string): number {
	const matches = [...input.matchAll(/mul\((\d{1,3})\s*,\s*(\d{1,3})\)/gm)];
	const mults = matches.map(([_, num1, num2]) => parseInt(num1) * parseInt(num2));
	return sum(mults);
}

/** Part 2 **/

function solve2(input: string): number {
	const matches = [...input.matchAll(/(.*?)mul\((\d{1,3})\s*,\s*(\d{1,3})\)/gm)];
	let isDo = true;
	let result = 0;

	for (const match of matches.values()) {
		const instruction = match[1].match(/.*(do|don't)\(\)/m)?.[1];
		if (instruction === "do") isDo = true;
		if (instruction === "don't") isDo = false;
		if (isDo) {
			result += parseInt(match[2]) * parseInt(match[3]);
		}
	}

	return result;
}


/** Calling **/

measureExecutionTime(solve1);
measureExecutionTime(solve2);
