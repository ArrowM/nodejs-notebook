import { measureExecutionTime } from "../../util/exec.util.ts";
import { input24 } from "./24-input.ts";
import { keyBy } from "../../util/obj.util.ts";

let input = input24;

const opMap = {
	"AND": (v1: number, v2: number) => v1 & v2,
	"XOR": (v1: number, v2: number) => v1 ^ v2,
	"OR": (v1: number, v2: number) => v1 | v2,
};

interface Wiring {
	w1: string,
	w2: string,
	op: string,
	w3: string
}

/** Part 1 **/

function solve1() {
	let [startingValuesLines, wiringLines] = input.split("\n\n").map(g => g.split("\n"));

	const wireValues = new Map<string, number>();
	startingValuesLines.forEach(line => {
		let [wire, val] = line.split(": ");
		wireValues.set(wire, Number(val));
	});
	const wirings = wiringLines.map(line => {
		let [w1, op, w2, _, w3] = line.split(" ");
		return { w1, w2, op, w3 };
	});

	const outToWiring = keyBy(wirings, "w3");
	const allWires = [...wireValues.keys(), ...outToWiring.keys()];
	const zWires = allWires.filter(w => w.startsWith("z")).sort().reverse();
	const xWires = allWires.filter(w => w.startsWith("x")).sort().reverse();
	const yWires = allWires.filter(w => w.startsWith("y")).sort().reverse();

	const evalWireValue = (wire: string) => {
		if (wireValues.has(wire)) {
			return wireValues.get(wire);
		}

		const { w1, w2, op } = outToWiring.get(wire);
		[w1, w2].filter(w => !wireValues.has(w)).forEach(w => evalWireValue(w));
		const [v1, v2] = [w1, w2].map(w => wireValues.get(w));
		const v3 = opMap[op](v1, v2);
		wireValues.set(wire, v3);
		return v3;
	};

	// Part 1

	const zBinary = zWires.map(w => evalWireValue(w));
	const zVal = parseInt(zBinary.join(""), 2);

	// Part 2

	const xBinary = xWires.map(w => evalWireValue(w));
	const xVal = parseInt(xBinary.join(""), 2);

	const yBinary = yWires.map(w => evalWireValue(w));
	const yVal = parseInt(yBinary.join(""), 2);

	const expectedVal = xVal + yVal;
	const expectedBinary = expectedVal.toString(2).split("").map(Number);

	console.log(expectedBinary.join(""));
	console.log(zBinary.join(""));

	// Determine invalid bits
	// 10111100 011 10 01 10001 0111 001 10000 01010101001000
	// 10111100 100 10 10 10001 1000 001 01111 01010101001000
	//          ***    **       ****     *****
	const invalidBinaryIndexes = expectedBinary.reduce((res, bit, idx) => bit === zBinary.at(idx) ? res : [...res, idx], []);
	const invalidZWires = zWires.filter((_, idx) => invalidBinaryIndexes.includes(idx));

	console.log(zBinary.map((bit, idx) => invalidBinaryIndexes.includes(idx) ? bit : " ").join(""));
	console.log();
	console.log(`invalid binary indexes (${invalidBinaryIndexes.length}): `, invalidBinaryIndexes.join());
	console.log(`z wires to check (${invalidBinaryIndexes.length}): `, invalidZWires.join());

	// There are 14 incorrect outputs, we can only swap 8 (4 pairs), so we need to backtrack to find the intersecting wirings.

	const invalidWiringPaths = new Map<string, Wiring[][]>();

	function getPath(wire: string, result?: Wiring[][]) {
		if (!result) {
			result = [[outToWiring.get(wire)]];
		}
		const prevCalculatedWiringLevel: Wiring[] = result[result.length - 1];
		const nextWiringLevel = prevCalculatedWiringLevel.flatMap(wiring =>
			[outToWiring.get(wiring.w1), outToWiring.get(wiring.w2)].filter(Boolean),
		);
		if (nextWiringLevel.length) {
			result.push(nextWiringLevel);
			return getPath(wire, result);
		}
		return result;
	}

	invalidZWires.forEach(invalidWire => invalidWiringPaths.set(invalidWire, getPath(invalidWire)));

	const invalidWiringCounts = new Map<Wiring, number>();
	invalidWiringPaths.values().forEach(invalidWiringPath => {
		invalidWiringPath.forEach(invalidWiringLevel => {
			invalidWiringLevel.forEach(w => {
				invalidWiringCounts.set(w, (invalidWiringCounts.get(w) ?? 0) + 1);
			})
		})
	})

	// I give up

	return { part1: zVal };
}

/** Solver **/

measureExecutionTime(solve1);
