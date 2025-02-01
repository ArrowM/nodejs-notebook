import { measureExecutionTime } from "../../util/exec.util.ts";
import { input22 } from "./22-input.ts";

let input = input22;

function solve(iter = 2000) {
	let nums = input.split("\n").map(BigInt);
	const globalSeqToPrice = new Map<string, number>();
	let part1 = 0n;

	for (let num of nums) {
		const deltas = Array(iter);
		const localSeqToPrice = new Map<string, number>();
		let prevPrice = Number(num % 10n);

		for (let i = 0; i < iter; i++) {
			num = (num ^ (num << 6n)) % 16777216n;
			num = (num ^ (num >> 5n)) % 16777216n;
			num = (num ^ (num << 11n)) % 16777216n;

			const price = Number(num % 10n);
			deltas[i] = price - prevPrice;
			if (i >= 4) {
				let seq = deltas.slice(i - 4, i).join();
				if (!localSeqToPrice.has(seq)) {
					localSeqToPrice.set(seq, prevPrice);
					// console.log(seq, prevPrice);
				}
			}
			prevPrice = price;
			// console.log(num, ":", price, "(", deltas[i], ")");
		}

		part1 += num;
		localSeqToPrice.forEach((price, seq) => {
			globalSeqToPrice.set(seq, (globalSeqToPrice.get(seq) ?? 0) + price);
		});
	}

	const part2 = Math.max(...globalSeqToPrice.values());

	return { part1, part2 };
}

measureExecutionTime(solve);
