import { measureExecutionTime } from "../../util/exec.util.ts";
import { input09Ex } from "./09-input.ts";

const input = input09Ex;

/** Part 1 **/

interface Block {
	id?: number;
	length: number;
}

function getBlocks() {
	const fileBlocks: Block[] = [];
	const freeBlocks: Block[] = [];
	input.split("").map(n => Number(n)).forEach((n, idx) => {
		if (idx % 2) {
			freeBlocks.push({ length: n });
		}
		else {
			fileBlocks.push({ id: idx / 2, length: n });
		}
	});
	return { fileBlocks, freeBlocks };
}

function solve1() {
	const { fileBlocks, freeBlocks } = getBlocks();

	let result = 0;
	let expandedIdx = 0;

	for (let compressedIdx = 0; fileBlocks.length; compressedIdx++) {
		// get file block
		const fileBlock = fileBlocks[compressedIdx];
		if (!fileBlock) break;
		// sum file block
		let maxPostIdx = expandedIdx + fileBlock.length;
		for (; expandedIdx < maxPostIdx; expandedIdx++) {
			// process.stdout.write(fileBlock.id.toString());
			result += fileBlock.id * expandedIdx;
		}
		// get free block
		const freeBlock = freeBlocks[compressedIdx];
		maxPostIdx += freeBlock.length;
		// sum free block
		for (; expandedIdx < maxPostIdx; expandedIdx++) {
			const lastFileBlock = fileBlocks[fileBlocks.length - 1];
			if (lastFileBlock === fileBlock) break;

			// process.stdout.write(lastFileBlock.id.toString());
			result += lastFileBlock.id * expandedIdx;
			lastFileBlock.length--;

			if (lastFileBlock.length === 0) {
				fileBlocks.pop();
			}
		}
	}
	console.log();

	return result;
}


/** Part 2 **/

function solve2() {
	const { fileBlocks, freeBlocks } = getBlocks();

	fileBlocks.toReversed().forEach((fileBlock) => {
		const fileIdx = fileBlocks.indexOf(fileBlock);
		const freeIdx = freeBlocks.findIndex((freeBlock) => freeBlock.length > 0 && freeBlock.length >= fileBlock.length);
		if (freeIdx !== -1 && freeIdx < fileIdx) {
			// move file block
			fileBlocks.splice(fileIdx, 1);
			fileBlocks.splice(freeIdx + 1, 0, fileBlock);
			// insert a blank free block at the file insert idx to keep free and file blocks synced
			freeBlocks[freeIdx].length -= fileBlock.length;
			if (fileIdx < freeBlocks.length) {
				const adjFreeBlocks = freeBlocks.splice(fileIdx - 1, 2);
				freeBlocks.splice(fileIdx - 1, 0, { length: adjFreeBlocks[0].length + adjFreeBlocks[1].length + fileBlock.length });
			}
			freeBlocks.splice(freeIdx, 0, { length: 0 });
		}
	});

	let result = 0;
	let expandedIdx = 0;

	for (let compressedIdx = 0; fileBlocks.length; compressedIdx++) {
		// get file block
		const fileBlock = fileBlocks[compressedIdx];
		if (!fileBlock) break;
		// sum file block
		const maxPostIdx = expandedIdx + fileBlock.length;
		for (; expandedIdx < maxPostIdx; expandedIdx++) {
			// process.stdout.write(fileBlock.id.toString());
			result += fileBlock.id * expandedIdx;
		}
		// get free block
		const freeBlock = freeBlocks[compressedIdx];
		if (freeBlock) {
			// process.stdout.write('.'.repeat(freeBlock.length));
			expandedIdx += freeBlock.length;
		}
	}
	console.log();

	return result;
}

/** Solver **/

measureExecutionTime(solve1);
measureExecutionTime(solve2);
