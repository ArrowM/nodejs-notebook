import { measureExecutionTime } from "../../util/exec.util.ts";
import { input19 } from "./19-input.ts";

// let input = input19Ex1;
let input = input19;

/** Part 1 **/

function solve() {
	const [towels, patterns] = input.split("\n\n").map(txt => txt.match(/\w+/g));
	const cache = new Map<string, number>([["", 1]]);

	function countComposite(pattern: string): number {
		if (!cache.has(pattern)) {
			cache.set(pattern, towels.reduce(
				(sum, towel) => sum + (pattern.startsWith(towel) ? countComposite(pattern.slice(towel.length)) : 0),
				0
			));
		}
		return cache.get(pattern)!;
	}

	const numPatternCompositions = patterns.reduce((total, pattern) => total + countComposite(pattern), 0);
	const numPatternsWithCompositions = patterns.filter(pattern => cache.get(pattern)).length;

	console.log("[part 1] number of patterns with compositions", numPatternsWithCompositions);
	console.log("[part 2] number of patterns compositions", numPatternCompositions);
}

measureExecutionTime(solve);
