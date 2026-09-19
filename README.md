# Country Guesser

A SvelteKit learning project: guess the target country using the number of land borders between it and each guess.

## Stack

- SvelteKit and Svelte 5
- TypeScript
- Tailwind CSS and shadcn-svelte for the shared UI foundation
- ESLint and Prettier
- Vitest for graph and game-logic unit tests

## Local development

```sh
yarn install
yarn dev
```

Other useful commands:

```sh
yarn run check # Svelte and TypeScript validation
yarn lint     # formatting and ESLint validation
yarn test     # unit tests
yarn build    # production build
```

The UI is composed from local shadcn-svelte components. Add components through its CLI only when a feature needs them, then customize the copied Svelte source in `src/lib/components/ui` as needed.

The next implementation step is the normalized country model and pure border-graph utilities, including BFS.
