export function measureExecutionTime(fn: Function, input?: any): void {
	const startTime = performance.now();
	const result = fn(input);
	const endTime = performance.now();
	console.log(result);
	console.log(`took ${(endTime - startTime).toFixed(2)} ms`);
	console.log();
}
