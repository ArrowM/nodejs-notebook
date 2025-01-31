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

export function getAdjacentPoints<P extends Point>({ x, y }: P, distance = 1) {
	return [
		{ x: x + distance, y },
		{ x: x - distance, y },
		{ x, y: y + distance },
		{ x, y: y - distance },
	];
}

export function distanceBetween<P extends Point, Q extends Point>(p1: P, p2: Q) {
	const aSq = Math.pow(Math.abs(p1.x - p2.x), 2);
	const bSq = Math.pow(Math.abs(p1.y - p2.y), 2);
	return Math.pow(aSq + bSq, 0.5);
}

export function minIdx(nums: number[]) {
	return nums.indexOf(Math.min(...nums));
}

export function atPoint<P extends Point>(matrix: any[][], { x, y }: P): string {
	return matrix[y]?.[x];
}

export function setPoint<P extends Point>(matrix: any[][], { x, y }: P, value: any): void {
	return matrix[y][x] = value;
}

export function findPoint(matrix: any[][], value: any) {
	for (let y = 0; y < matrix.length; y++) {
		const x = matrix[y].indexOf(value);
		if (x !== -1) return { x, y };
	}
}

export function pointsBetween<P extends Point, Q extends Point>(p1: P, p2: Q) {
	const points = [];
	const xMin = Math.min(p1.x, p2.x), xMax = Math.max(p1.x, p2.x);
	const yMin = Math.min(p1.y, p2.y), yMax = Math.max(p1.y, p2.y);
	for (let y = yMin; y <= yMax; y++) {
		for (let x = xMin; x <= xMax; x++) {
			points.push({x, y});
		}
	}
	return points;
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