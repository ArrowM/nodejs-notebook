import { measureExecutionTime } from "../../util/exec.util.ts";
import type { Point } from "../../util/math.util.ts";
import { printMatrix } from "../../util/string.utils.ts";
import { input12Ex } from "./12-input.ts";

const DEBUG = true;
const input = input12Ex;


/** Part 1 **/

function solve() {
	let perimeterCost = 0;
	let sideCost = 0;
	let nextRegionId = 0;
	const regionIdMatrix: number[][] = Array.from({ length: input.length }, () => Array(input[0].length).fill(null));

	input.forEach((row, y) => {
		row.split("").forEach((crop, x) => {
			if (regionIdMatrix[y][x] !== null) return;
			const regionId = nextRegionId++;
			const leftFences: Point[] = [];
			const rightFences: Point[] = [];
			const topFences: Point[] = [];
			const botFences: Point[] = [];
			let area = 0;

			function exploreRegion({ x, y }: Point) {
				if (regionIdMatrix[y][x] !== null) return;
				const pointsToExplore: Point[] = [];
				const leftPnt = { x: x - 1, y };
				const rightPnt = { x: x + 1, y };
				const topPnt = { x, y: y - 1 };
				const botPnt = { x, y: y + 1 };
				(input[leftPnt.y]?.[leftPnt.x] === crop ? pointsToExplore : leftFences).push(leftPnt);
				(input[rightPnt.y]?.[rightPnt.x] === crop ? pointsToExplore : rightFences).push(rightPnt);
				(input[topPnt.y]?.[topPnt.x] === crop ? pointsToExplore : topFences).push(topPnt);
				(input[botPnt.y]?.[botPnt.x] === crop ? pointsToExplore : botFences).push(botPnt);
				area += 1;
				regionIdMatrix[y][x] = regionId;
				pointsToExplore.filter(pnt => pnt).forEach((pnt) => exploreRegion(pnt));
			}

			exploreRegion({ x, y });

			/** part 1 - perimeter **/
			const perimeter = leftFences.length + rightFences.length + topFences.length + botFences.length;
			perimeterCost += perimeter * area;

			/** part 2 - sides **/
			let sides = 0;
			function countVerticalSides(verticalFences: Point[]) {
				// sort into columns
				verticalFences.sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);
				// count sides
				verticalFences.forEach((fence, i) => {
					const prevFence = verticalFences[i - 1];
					const isContinuationOfSide = prevFence?.y === fence.y - 1 && prevFence?.x === fence.x;
					sides += isContinuationOfSide ? 0 : 1;
				});
			}
			function countHorizontalSides(horizontalSides: Point[]) {
				// sort into rows
				horizontalSides.sort((a, b) => a.y === b.y ? a.x - b.x : a.y - b.y);
				// count sides
				horizontalSides.forEach((fence, i) => {
					const prevFence = horizontalSides[i - 1];
					const isContinuationOfSide = prevFence?.x === fence.x - 1 && prevFence?.y === fence.y;
					sides += isContinuationOfSide ? 0 : 1;
				});
			}
			countVerticalSides(leftFences);
			countVerticalSides(rightFences);
			countHorizontalSides(topFences);
			countHorizontalSides(botFences);
			sideCost += sides * area;

			if (DEBUG) {
				console.log("=".repeat(24));
				console.log("regionId", regionId);
				console.log("-", area, "area");
				console.log("-", perimeter, "perimeter");
				console.log("-", sides, "sides");
				console.log(perimeter * area, "perimeterCost");
				console.log(sides * area, "sideCost");
				console.log("map after adding region:");
				console.log("-".repeat(24));
				printMatrix(regionIdMatrix, { allowZero: true });
				console.log("=".repeat(24));
				console.log("\n");
			}
		});
	});

	return { perimeterCost, sideCost };
}

/** Solver **/

measureExecutionTime(solve);
