import type { Country } from '$lib/types/country';

/** An undirected graph where country codes are nodes and land borders are edges. */
export type CountryGraph = Map<string, Set<string>>;

/**
 * Creates a graph from normalized countries.
 *
 * A border is a shared land border, so we add it in both directions even if the
 * source data lists it for only one of the two countries.
 */
export function createCountryGraph(countries: Country[]): CountryGraph {
	const graph: CountryGraph = new Map(countries.map((country) => [country.code, new Set()]));

	for (const country of countries) {
		const neighbours = graph.get(country.code);

		if (!neighbours) {
			continue;
		}

		for (const borderCode of country.borders) {
			const borderNeighbours = graph.get(borderCode);

			if (!borderNeighbours) {
				continue;
			}

			neighbours.add(borderCode);
			borderNeighbours.add(country.code);
		}
	}

	return graph;
}

/** Returns every group of countries reachable through land borders. */
export function getConnectedComponents(graph: CountryGraph): Set<string>[] {
	const visited = new Set<string>();
	const components: Set<string>[] = [];

	for (const countryCode of graph.keys()) {
		if (visited.has(countryCode)) {
			continue;
		}

		const component = new Set<string>();
		const queue = [countryCode];
		visited.add(countryCode);

		for (let index = 0; index < queue.length; index += 1) {
			const currentCode = queue[index];
			component.add(currentCode);

			for (const neighbourCode of graph.get(currentCode) ?? []) {
				if (!visited.has(neighbourCode)) {
					visited.add(neighbourCode);
					queue.push(neighbourCode);
				}
			}
		}

		components.push(component);
	}

	return components;
}
