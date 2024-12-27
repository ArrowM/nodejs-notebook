import { measureExecutionTime } from "../../util/exec.util.ts";
import { input07 } from "./07-input.ts";

let input = input07;

/** Part 1 **/

function solve1() {
	let result = 0;
	for (const line of input) {
		const [target, ...nums] = line.match(/\d+/g).map(Number);
		let totals = [0];
		for (const num of nums) {
			totals = totals.flatMap(total => [total + num, total * num]).filter(n => n && n <= target);
		}
		if (totals.includes(target)) {
			result += target;
		}
	}
	return result;
}


/** Part 2 **/

function solve2() {
	let result = 0;
	for (const line of input) {
		const [target, ...nums] = line.match(/\d+/g).map(Number);
		let totals = [0];
		for (const num of nums) {
			totals = totals.flatMap(total => [total + num, total * num, Number(`${total}${num}`)]).filter(n => n && n <= target);
		}
		if (totals.includes(target)) {
			result += target;
		}
	}
	return result;
}

/** Solver **/

measureExecutionTime(solve1);
measureExecutionTime(solve2);
