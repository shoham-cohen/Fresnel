# features/narratives

Everything specific to narratives (shown in the UI as "התראות") goes here: the narratives table, the details panel, the key-metric cards, the API client for Doron's server, and their types and tests.

Nothing is here yet. That's on purpose. Building it is the team's first task.

Suggested layout once code exists:

```
narratives/
├── components/   # NarrativesTable, NarrativeDetailsPanel, ...
├── api/          # calls to /narratives and /narratives/{narrative_id}/items
├── types.ts
└── index.ts      # the feature's public exports; pages import from here only
```
