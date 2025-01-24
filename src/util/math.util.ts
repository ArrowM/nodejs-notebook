export function sum(arr: number[]) {
	return arr.reduce((total, item) => total + item, 0);
}

export function listEquals(a1: any[], a2: any[]) {
	return a1.length === a2.length && a1.every((item, idx) => item === a2[idx]);
}

export interface Point {
	x?: number;
	y?: number;
}

export function pointsEqual<P extends Point, Q extends Point>(p1: P, p2: Q) {
	return p1.x === p2.x && p1.y === p2.y;
}

export function addPoints<P extends Point, Q extends Point>(p1: P, p2: Q) {
	return { x: (p1.x ?? 0) + (p2.x ?? 0), y: (p1.y ?? 0) + (p2.y ?? 0) };
}

export function subtractPoints<P extends Point, Q extends Point>(p1: P, p2: Q) {
	return { x: (p1.x ?? 0) - (p2.x ?? 0), y: (p1.y ?? 0) - (p2.y ?? 0) };
}

export function getPerpendicularVectors<P extends Point>(p1: P) {
	return [{ x: p1.y ?? 0, y: p1.x ?? 0 }, { x: -(p1.y ?? 0), y: -(p1.x ?? 0) }];
}

export function getAdjacentPoints<P extends Point>({ x, y }: P) {
	return [
		{ x: x + 1, y },
		{ x: x - 1, y },
		{ x, y: y + 1 },
		{ x, y: y - 1 },
	];
}

export function distanceBetween<P extends Point, Q extends Point>(p1: P, p2: Q) {
	const aSq = Math.pow(Math.abs(p1.x - p2.x), 2);
	const bSq = Math.pow(Math.abs(p1.y - p2.y), 2);
	return Math.pow(aSq + bSq, 0.5);
}

export function smallest(nums: number[]) {
	return nums.length ? nums.reduce<number>((smallest, num) => Math.min(smallest, num), Number.MAX_SAFE_INTEGER) : undefined;
}

export function smallestIdx(nums: number[]) {
	return nums.indexOf(smallest(nums));
}

export function atPoint<P extends Point>(matrix: any[][], { x, y }: P): string {
	return matrix[y][x];
}

export function charToDir(char: string): Point {
	if (char == ">") return { x: 1 };
	if (char == "<") return { x: -1 };
	if (char == "^") return { y: 1 };
	if (char == "v") return { y: -1 };
}

export function dirToChar({ x, y }: Point): string {
	if (x > 0) return ">";
	if (x < 0) return "<";
	if (y < 0) return "^";
	if (y > 0) return "v";
}