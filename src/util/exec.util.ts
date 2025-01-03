export async function measureExecutionTime(fn: Function, input?: any) {
  const startTime = performance.now();
  const result = await fn(input);
  const endTime = performance.now();
  console.log(result);
  console.log(`took ${(endTime - startTime).toFixed(2)} ms`);
  console.log();
  return result;
}

export function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
