import { measureExecutionTime } from "../../util/exec.util.ts";
import { input20 } from "./20-input.ts";
import { addPoints, atPoint, findPoint, getAdjacentPoints, setPoint } from "../../util/math.util.ts";


let input = input20;
const CHEAT_LENGTH_THRESHOLD = 100;

// let input = input20Ex;
// const CHEAT_LENGTH_THRESHOLD = 3;

function getCheatTranslations(size = 20) {
	const translations = [];
	for (let y = 0; y <= size; y++) {
		for (let x = 0; x <= size; x++) {
			const distance = y + x;
			if (distance >= 2 && distance <= size) {
				translations.push({ x, y, distance });
				if (x !== 0) translations.push({ x: -x, y, distance });
				if (y !== 0) translations.push({ x, y: -y, distance });
				if (x !== 0 && y !== 0) translations.push({ x: -x, y: -y, distance });
			}
		}
	}
	return translations;
}

function solve(maxCheatLen: number) {
	const matrix = input.split("\n").map(row => row.split(""));

	// trace path
	const pathPoints = [];
	let navPoint = findPoint(matrix, "S");
	for (let pathIdx = 0; navPoint; pathIdx++) {
		pathPoints.push(navPoint);
		setPoint(matrix, navPoint, pathIdx);
		navPoint = getAdjacentPoints(navPoint).find(adj => [".", "E"].includes(atPoint(matrix, adj)));
	}

	// find cheats
	const cheatResults = new Map<number, number>();
	const cheatTranslations = getCheatTranslations(maxCheatLen);

	for (const srcPoint of pathPoints) {
		const src = Number(atPoint(matrix, srcPoint));
		for (const trans of cheatTranslations) {
			const dest = Number(atPoint(matrix, addPoints(srcPoint, trans)));
			if (dest > src) {
				const cheatLength = dest - src - trans.distance;
				cheatResults.set(cheatLength, (cheatResults.get(cheatLength) ?? 0) + 1);
			}
		}
	}

	// [...cheatResults.entries()].sort((a, b) => a[0] - b[0]).forEach(entry => console.log(entry));

	return cheatResults.entries().reduce(
		(total, [cheatLength, numCheats]) => total + (cheatLength >= CHEAT_LENGTH_THRESHOLD ? numCheats : 0),
		0,
	);
}

/** Solver **/

measureExecutionTime(solve, 2)
	.then(() =>
		measureExecutionTime(solve, 20)
	);
