import { delay, measureExecutionTime } from "../../util/exec.util.ts";
import { addPoints, type Point, pointsEqual } from "../../util/math.util.ts";
import { input15 } from "./15-input.ts";

const DEBUG = false;
const MS_PER_DEBUG_FRAME = 100;
const input = input15;

/** Helpers **/

const directionDict = {
  "^": { x: 0, y: -1 },
  ">": { x: 1, y: 0 },
  "v": { x: 0, y: 1 },
  "<": { x: -1, y: 0 },
};

function printMap(map: string[][]) {
  console.log(map.map((row) => row.join(" ")).join("\n"));
  console.log();
}

async function logStep(map: string[][], instructions: string[], instructionIdx: number) {
  if (DEBUG && MS_PER_DEBUG_FRAME) {
    console.clear();
		console.log(instructions[instructionIdx], instructionIdx + 1, "/", instructions.length);
    printMap(map);
    await delay(MS_PER_DEBUG_FRAME);
  }
}

function getRobotPos(map: string[][]) {
  for (let y = 0; y < map.length; y++) {
    const x = map[y].indexOf("@");
    if (x !== -1) {
      return { x, y };
    }
  }
}

function sumCoordinates(map: string[][], boxChar: string) {
  let sum = 0;
  map.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === boxChar) {
				sum += (y * 100) + x;
      }
    });
  });
  return sum;
}

/** Part 1 **/

function pushPoint(map: string[][], point: Point, dir: Point) {
  const emptyPoint = addPoints(point, dir);
  map[emptyPoint.y][emptyPoint.x] = map[point.y][point.x];
  map[point.y][point.x] = ".";
}

function getPointsToPush(map: string[][], position: Point, dir: Point) {
  const pointsToPush = [position];
  while (true) {
    position = addPoints(position, dir);
    const probeChar = map[position.y][position.x];
    if (probeChar === "#") return null;
    if (probeChar === ".") return pointsToPush;
    pointsToPush.push(position);
  }
}

function push1(map: string[][], robotPos: Point, dir: Point) {
  const pointsToPush = getPointsToPush(map, robotPos, dir);
  if (pointsToPush) {
    // update boxes
    for (let idx = pointsToPush.length - 1; idx >= 0; idx--) {
      pushPoint(map, pointsToPush[idx], dir);
    }
    // update robot
    const newRobotPos = addPoints(robotPos, dir);
    robotPos.x = newRobotPos.x;
    robotPos.y = newRobotPos.y;
  }
}

async function solve1() {
  const [mapLines, instructionLines] = input.split("\n\n");
  const map = mapLines.split("\n").map((line) => line.split(""));
  const instructions = instructionLines.match(/\S/g);

  const robotPos = getRobotPos(map);

  if (DEBUG) printMap(map);

  for (let idx = 0; idx < instructions.length; idx++) {
    const instruction = instructions[idx];
    const dir = directionDict[instruction];
    push1(map, robotPos, dir);
    await logStep(map, instructions, idx);
  }

  return { solution1: sumCoordinates(map, "O") };
}


/** Part 2 **/

function getRowsToPush(map: string[][], position: Point, dir: Point) {
  const pointsToPush: Point[][] = [[position]];
  while (true) {
    const prevPoints = pointsToPush[pointsToPush.length - 1];
    const nextPoints = prevPoints
			.map(pnt => addPoints(pnt, dir))
      .map(({ x, y }) => ({ x, y, char: map[y][x] }))
			.filter(tile => tile.char !== ".");

    if (nextPoints.length === 0) return pointsToPush;
		if (nextPoints.some(tile => tile.char === "#")) return null;

    if (dir.y) {
      for (let idx = nextPoints.length - 1; idx >= 0; idx--) {
        const point = nextPoints[idx];
        if (point.char === "[") {
          const rightPoint = addPoints(point, { x: 1, y: 0, char: "]" });
					if (!nextPoints.some(otherPoint => pointsEqual(otherPoint, rightPoint))) {
            nextPoints.splice(idx + 1, 0, rightPoint);
          }
        }
        if (point.char === "]") {
          const leftPoint = addPoints(point, { x: -1, y: 0, char: "[" });
					if (!nextPoints.some(otherPoint => pointsEqual(otherPoint, leftPoint))) {
            nextPoints.splice(idx, 0, leftPoint);
          }
        }
      }
    }
    pointsToPush.push(nextPoints);
  }
}

function push2(map: string[][], robotPos: Point, dir: Point) {
  const rowsToPush = getRowsToPush(map, robotPos, dir);
  if (rowsToPush) {
    // update boxes
    for (let idx = rowsToPush.length - 1; idx >= 0; idx--) {
      for (const pointToPush of rowsToPush[idx]) {
        pushPoint(map, pointToPush, dir);
      }
    }
    // update robot
    const newRobotPos = addPoints(robotPos, dir);
    robotPos.x = newRobotPos.x;
    robotPos.y = newRobotPos.y;
  }
}

async function solve2() {
  const [mapLines, instructionLines] = input.split("\n\n");
	const map = mapLines.split("\n").map(line =>
		line.split("").flatMap((char) =>
          char === "O" ? ["[", "]"] : char === "@" ? ["@", "."] : [char, char],
        ),
    );
  const instructions = instructionLines.match(/\S/g);

  const robotPos = getRobotPos(map);

  if (DEBUG) printMap(map);

  for (let idx = 0; idx < instructions.length; idx++) {
    const instruction = instructions[idx];
    const dir = directionDict[instruction];
    push2(map, robotPos, dir);
    await logStep(map, instructions, idx);
  }

  return { solution2: sumCoordinates(map, "[") };
}

/** Solver **/

measureExecutionTime(solve1);
measureExecutionTime(solve2);
