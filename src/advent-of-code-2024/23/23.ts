import { measureExecutionTime } from "../../util/exec.util.ts";
import { input23Ex } from "./23-input.ts";

let input = input23Ex;

function solve1() {
	let conns = input.split("\n").map(line => line.split("-"));

	let map = new Map<string, string[]>();
	conns.forEach(([pc1, pc2]) => {
		map.set(pc1, [...map.get(pc1) ?? [], pc2]);
		map.set(pc2, [...map.get(pc2) ?? [], pc1]);
	});

	let part1 = new Set<string>();
	map.entries().filter(([firstPc]) => firstPc.startsWith("t")).forEach(([firstPc, secondPcs]) => {
		secondPcs.forEach((secondPc) => {
			const thirdPcs = map.get(secondPc);
			thirdPcs.filter((thirdPc) => thirdPc !== firstPc).forEach((thirdPc) => {
				const fourthPcs = map.get(thirdPc);
				fourthPcs.forEach((fourthPc) => {
					if (fourthPc === firstPc) {
						part1.add([firstPc, secondPc, thirdPc].sort().join(","));
					}
				});
			});
		});
	});

	const bigMap = new Set<string>();
	let biggestParty = "";

	// RE-READ, every pc in the member group needs a connection to ever other member

	function partySearch(pc: string, members: string[], conns: string[][]) {
		const updatedMembers = [...members, pc];
		const str = updatedMembers.sort().join();

		if (bigMap.has(str)) {
			return;
		}

		bigMap.add(str);
		const connsWithPc: string[][] = [];
		const connsWoutPc: string[][] = [];
		conns.forEach((conn) => {
			(conn.includes(pc) ? connsWithPc : connsWoutPc).push(conn);
		});
		if (!members.length || connsWoutPc.some(c => c.includes(updatedMembers[0]))) {
			connsWithPc.forEach(connWithPc => {
					const nextPc = connWithPc.find((p) => p !== pc);
					if (nextPc === updatedMembers[0]) {
						if (str.length > biggestParty.length) {
							biggestParty = str;
						}
					} else {
						partySearch(nextPc, updatedMembers, members.length ? connsWoutPc : conns);
					}
			});
		}
	}

	map.keys().forEach(pc => partySearch(pc, [], conns));

	return { part1: part1.size };
}

measureExecutionTime(solve1);

function solve2() {
	// Loop through each pc. let's say pc1 for example
	// for pc1, get all the pc1 connections from a map.
	// then ask each of those connected how many of the other connected they can see.

}

measureExecutionTime(solve2);
