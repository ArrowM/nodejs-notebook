export function measureExecutionTime(fn: Function, input?: any) {
	const startTime = performance.now();
	const result = fn(input);
	const endTime = performance.now();
	console.log(result);
	console.log(`took ${(endTime - startTime).toFixed(2)} ms`);
	console.log();
	return result;
}

export interface Point {
	x: number;
	y: number;
}

export function addPoints(p1: Point, p2: Point) {
	return {x: p1.x + p2.x, y: p1.y + p2.y}
}

export function subtractPoints(p1: Point, p2: Point) {
	return {x: p1.x - p2.x, y: p1.y - p2.y };
}
