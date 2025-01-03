export function sum(arr: number[]) {
	return arr.reduce((total, item) => total + item, 0);
}

export interface Point {
  x?: number;
  y?: number;
}

export function pointsEqual<P extends Point>(p1: P, p2: P) {
	return p1.x === p2.x && p1.y === p2.y;
}

export function addPoints<P extends Point>(p1: P, p2: P) {
	return { x: (p1.x ?? 0) + (p2.x ?? 0), y: (p1.y ?? 0) + (p2.y ?? 0) } as P;
}

export function subtractPoints<P extends Point>(p1: P, p2: P) {
	return { x: (p1.x ?? 0) - (p2.x ?? 0), y: (p1.y ?? 0) - (p2.y ?? 0) } as P;
}
