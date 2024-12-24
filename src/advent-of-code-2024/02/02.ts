import {input02} from "./02-input.ts";

/** Part 1 **/

const isRowSafe = (row: number[]) => {
	const isRowIncr = row[1] > row[0];
	return row.every((num, idx) => {
		if (idx === 0) return true;
		const diff = num - row[idx - 1];
		return (Math.abs(diff) >= 1 && Math.abs(diff) <= 3 && (diff > 0 == isRowIncr));
	});
};

let result1 = 0;

for (const row of input02) {
	if (isRowSafe(row)) result1++;
}

console.log(result1);


/** Part 2 **/

let result2 = 0;

for (const row of input02) {
	for (let idx = 0; idx < row.length; idx++) {
		const moddedRow = [...row];
		moddedRow.splice(idx, 1);
		if (isRowSafe(moddedRow)) {
			result2++;
			break;
		}
	}
}

console.log(result2);
