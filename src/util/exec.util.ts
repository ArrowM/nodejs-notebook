
export function measureExecutionTime(fn: Function, input: any): void {
	const startTime = performance.now();
	const result = fn(input);
	const endTime = performance.now();
	console.log(result);
	console.log(`Execution Time: ${endTime - startTime} ms`);
}
