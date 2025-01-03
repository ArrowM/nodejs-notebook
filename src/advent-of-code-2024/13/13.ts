import { measureExecutionTime } from "../../util/exec.util.ts";
import { input13 } from "./13-input.ts";

const DEBUG = false;
let input = input13;

function solve(offset = 0) {
	let result = 0;
	input.split("\n\n")
		.map(g => g.match(/\d+/g).map((n, i) => Number(n) + (i > 3 ? offset : 0)))
		.forEach((machine, idx) => {
			if (DEBUG) console.log("\nsolving machine", idx);
			let [vecAx, vecAy, vecBx, vecBy, pntX, pntY] = machine;

			let numX = pntX * vecBy - pntY * vecBx;
			let denomX = vecAx * vecBy - vecAy * vecBx;

			let numY = pntX * vecAy - pntY * vecAx;
			let denomY = vecAy * vecBx - vecAx * vecBy;

			if (numX % denomX == 0 && numY % denomY == 0) {
				let a = numX / denomX;
				let b = numY / denomY;
				if (DEBUG) console.log("a", a, "b", b);
				result += (3 * a) + b;
			}
		});
	return result;
}

measureExecutionTime(solve);
measureExecutionTime(solve, 10000000000000);
