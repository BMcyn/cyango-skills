# Assets (MCP list/insert)

Use this guide when working with editor assets through MCP.

## Core tools

- `list_assets` — list assets from:
  - story assets (`activeStoryJson.assets`)
  - user library assets (`getAssets(folderId, page, perPage, filters)`)
  - both merged
- `insert_assets` — insert one or many assets into one scene in a batched call.

## `list_assets` input

```ts
{
  scope: "story" | "library" | "both", // default: "both"
  category?: string,
  folderId?: string, // required for library/both
  fileTypes?: string[],
  page?: number, // default 1
  perPage?: number, // default 12
  search?: string
}
```

## `insert_assets` input

```ts
{
  sceneId: string,
  inserts: Array<{
    assetId: string,
    parentEntityId?: string,
    parentIndex?: number, // in-batch parent reference
    position?: [number, number, number],
    rotation?: [number, number, number],
    scale?: [number, number, number],
    forceEntityType?: EntityTypes,
    attachToStory?: boolean, // default true
    assetFolderId?: string, // optional library fetch hint
    page?: number,
    perPage?: number
  }>
}
```

## Story vs library

- Story assets live in `activeStoryJson.assets` and are immediately available for insert.
- Library assets require `folderId` to page through `/assets/getAssets/:folderId`.
- `insert_assets` auto-attaches library assets into the open story by default (`attachToStory !== false`).

## Asset category -> default entity type

Entity inference comes from editor `setNewEntityType(asset, scene)`:

- `VIDEO` -> `PANORAMA_VIDEO` / `PANORAMA_180_VIDEO` / `FLAT_VIDEO` / `GUI_VIDEO`
- `IMAGE` -> `PANORAMA` / `PANORAMA_180` / `FLAT_IMAGE` / `GUI_IMAGE`
- `VECTOR` -> `FLAT_IMAGE` / `GUI_VECTOR`
- `AUDIO` -> `AUDIO_GLOBAL`
- `MODEL_3D` -> `CUSTOM_3D_MODEL`
- `SPLAT` -> `SPLAT`
- `FONT` -> `TEXT_3D`
- `SUBTITLES` -> `SUBTITLE`
- `HDR` -> `HDR`

Use `forceEntityType` when you need to override default inference.

## Batch rules

- Prefer one `insert_assets` call per scene, not repeated single inserts.
- For parent-child chains within one batch, use `parentIndex` so parents can be referenced before IDs are known.
- Avoid interleaving `add_entities` and `insert_assets` against the same target chain in separate calls.
