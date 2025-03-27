export class SortedList<T> {
	private list: T[] = [];

	get length() {
		return this.list.length;
	}

	constructor(
		private compare: (a: T, b: T) => number,
	) {
	}

	add(item: T): void {
		const index = this.binarySearch(item);
		this.list.splice(index, 0, item);
	}

	getList(): T[] {
		return this.list;
	}

	pop(): T {
		return this.list.pop();
	}

	private binarySearch(item: T): number {
		let low = 0;
		let high = this.list.length;

		while (low < high) {
			const mid = (low + high) >>> 1;
			if (this.compare(this.list[mid], item) < 0) {
				low = mid + 1;
			}
			else {
				high = mid;
			}
		}

		return low;
	}
}
