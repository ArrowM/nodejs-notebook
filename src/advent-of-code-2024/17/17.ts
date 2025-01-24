import { measureExecutionTime } from "../../util/exec.util.ts";
import { input17 } from "./17-input.ts";

let input = input17;

interface State {
	a: number,
	b: number,
	c: number,
	instrPointer: number;
	instructions: number[];
	output: number[];
}

// convert operand to combo operand value
function combo(state: State, operand: number) {
	if (operand <= 3) return operand;
	if (operand === 4) return state.a;
	if (operand === 5) return state.b;
	if (operand === 6) return state.b;
	throw Error("Combo operand 7 is reserved");
}

/** ORIGINAL **/
// 0 | 2,4,  b = a mask 3 bits
// 1 | 1,7,  b = b xor 7
// 2 | 7,5,  c = a rshift b bits
// 3 | 1,7,  b = b xor 7
// 4 | 0,3,  a = a rshift 3 bits
// 5 | 4,1,  b = b xor c
// 6 | 5,5,  out b mask 3 bits
// 7 | 3,0   restart


/** RE-ARRANGED **/
// CANCEL OUT
// 1 | 1,7,  b = b XOR 7
// 3 | 1,7,  b = b XOR 7

const ops = [
	// 0  -  adv (division to a)
	(state: State, operand: number) => state.a = state.a >> combo(state, operand),
	// 1  -  bxl (bitwise XOR to b)
	(state: State, operand: number) => state.b ^= operand,
	// 2  -  bst (modulo to b)
	(state: State, operand: number) => state.b = combo(state, operand) & 7,
	// 3  -  jnz (conditional jump)
	(state: State, operand: number) => state.a === 0 ? null : state.instrPointer = (operand - 2),
	// 4  -  bxc (bitwise XOR to b)
	(state: State, operand: number) => state.b ^= state.c,
	// 5  -  out (modulo to out)
	(state: State, operand: number) => state.output.push(combo(state, operand) & 7),
	// 6  -  bdv (division to b)
	(state: State, operand: number) => state.b = state.a >> combo(state, operand),
	// 7  -  cdv (division to c)
	(state: State, operand: number) => state.c = state.a >> combo(state, operand),
];

function getInitialState(): State {
	let nums = input.match(/\d+/g).map(n => Number(n));
	return {
		a: nums[0],
		b: nums[1],
		c: nums[2],
		instrPointer: 0,
		instructions: nums.slice(3),
		output: [],
	};
}


/**  Part 1  -  what is the output?  **/

function solve1() {
	const state = getInitialState();

	while (state.instrPointer < state.instructions.length - 1) {
		const opCode = state.instructions[state.instrPointer];
		const operand = state.instructions[state.instrPointer + 1];
		const op = ops[opCode];

		op(state, operand);

		state.instrPointer += 2;
	}

	return state.output.join(",");
}


/**  Part 2  -  Make it quine-ish  **/


function solve2() {
	const { instructions } = getInitialState();
	function solve(p: number, r: bigint): boolean {
		if (p < 0n) {
			console.log(r);
			return true;
		}
		for (let d = 0n; d < 8n; d++) {
			let a = (r << 3n) | d;
			let i = 0;
			let b = 0n, c = 0n, w = 0n;
			while (i < instructions.length) {
				let o: bigint;
				if (instructions[i + 1] <= 3) o = BigInt(instructions[i + 1]);
				else if (instructions[i + 1] === 4) o = a;
				else if (instructions[i + 1] === 5) o = b;
				else if (instructions[i + 1] === 6) o = c;

				if (instructions[i] === 0) a >>= o;
				else if (instructions[i] === 1) b ^= BigInt(instructions[i + 1]);
				else if (instructions[i] === 2) b = o & 7n;
				else if (instructions[i] === 3) i = a !== 0n ? instructions[i + 1] - 2 : i;
				else if (instructions[i] === 4) b ^= c;
				else if (instructions[i] === 5) { w = o & 7n; break; }
				else if (instructions[i] === 6) b = a >> o;
				else if (instructions[i] === 7) c = a >> o;

				i += 2;
			}
			if (w === BigInt(instructions[p])) {
				if (solve(p - 1, (r << 3n) | d)) {
					return true;
				}
			}
		}
		return false;
	}

	return solve(instructions.length - 1, 0n);
}


function other() {
	const { instructions } = getInitialState();
	// for (let A = parseInt("110 000 001 110 011 011".split(" ").join(""), 2); ; A++) {
	let out = [], a = 265601188299675n, b = 0n, c = 0n;
	while (a !== 0n) {
		b = a & 7n;
		b = b ^ 7n;
		c = a >> b;
		b = b ^ 7n;
		b = b ^ c;
		out.push(b & 7n);
		a = a >> 3n;
	}

	// console.log(out);
	return out;
}


measureExecutionTime(solve2);
// measureExecutionTime(other);

let nums = [
	410715035, // 2,4,1,7,7,5,1,7,0,3   0b 11 000 011 110 110 000 001 110 011 011
	410719131, // 2,4,1,7,7,5,1,7,0,3   0b 11 000 011 110 110 001 001 110 011 011
	410723227, // 2,4,1,7,7,5,1,7,0,3   0b 11 000 011 110 110 010 001 110 011 011

	410715037, // 2,4,1,7,7,5,1,7,0,3   0b 11 000 011 110 110 000 001 110 011 101
	410719133, // 2,4,1,7,7,5,1,7,0,3   0b 11 000 011 110 110 001 001 110 011 101
	410723229, // 2,4,1,7,7,5,1,7,0,3   0b 11 000 011 110 110 010 001 110 011 101
];
for (let i = 1; i < nums.length - 1; i++) {
	// console.log(nums[i] - nums[i-1]);
}
