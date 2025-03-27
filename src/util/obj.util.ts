export function keyBy<T extends object>(list: T[], key: keyof T) {
	const map = new Map<T[keyof T], T>();
	list.forEach(obj => map.set(obj[key], obj));
	return map;
}
