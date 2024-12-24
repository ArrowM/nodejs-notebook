import {input01} from "./01-input.ts";

/** Part 1 **/

const list1 = input01.map((item) => item[0]);
const list2 = input01.map((item) => item[1]);

list1.sort();
list2.sort();

let result1 = 0;

list1.forEach((val, i) => result1 += Math.abs(val - list2[i]));

console.log(result1);


/** Part 2 **/

const dict2 = {};

for (const num of list2) {
	dict2[num] = 1 + (dict2[num] ?? 0);
}

let result2 = 0;

for (const num of list1) {
	result2 += num * (dict2[num] ?? 0);
}

console.log(result2);
