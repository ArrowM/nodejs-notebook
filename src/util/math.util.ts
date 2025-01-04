export function sum(arr: number[]) {
	return arr.reduce((total, item) => total + item, 0);
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

export function getPerpendiculars<P extends Point>(p1: P) {
	return [{ x: p1.y ?? 0, y: p1.x ?? 0 }, { x: -(p1.y ?? 0), y: -(p1.x ?? 0) }];
}

export function smallest(nums: number[]) {
	return nums.length ? nums.reduce<number>((smallest, num) => Math.min(smallest, num), Number.MAX_SAFE_INTEGER) : undefined;
}

export function smallestIdx(nums: number[]) {
	return nums.indexOf(smallest(nums));
}

export function atPoint(matrix: any[][], { x, y }: Point): string {
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