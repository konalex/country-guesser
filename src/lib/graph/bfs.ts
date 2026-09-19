import type { CountryGraph } from './graph';

/**
 * Finds the shortest route between two countries using breadth-first search.
 * Returns country codes in travel order, including the start and destination.
 */
export function findShortestBorderPath(
	graph: CountryGraph,
	startCode: string,
	targetCode: string
): string[] | null {
	if (!graph.has(startCode) || !graph.has(targetCode)) {
		return null;
	}

	const previous = new Map<string, string | null>([[startCode, null]]);
	const queue = [startCode];

	for (let index = 0; index < queue.length; index += 1) {
		const currentCode = queue[index];

		if (currentCode === targetCode) {
			return reconstructPath(previous, targetCode);
		}

		for (const neighbourCode of graph.get(currentCode) ?? []) {
			if (!previous.has(neighbourCode)) {
				previous.set(neighbourCode, currentCode);
				queue.push(neighbourCode);
			}
		}
	}

	return null;
}

/** Returns the minimum number of land borders between two countries. */
export function getBorderDistance(
	graph: CountryGraph,
	startCode: string,
	targetCode: string
): number | null {
	const path = findShortestBorderPath(graph, startCode, targetCode);

	return path ? path.length - 1 : null;
}

function reconstructPath(previous: Map<string, string | null>, targetCode: string): string[] {
	const path: string[] = [];
	let currentCode: string | null = targetCode;

	while (currentCode) {
		path.push(currentCode);
		currentCode = previous.get(currentCode) ?? null;
	}

	return path.reverse();
}
