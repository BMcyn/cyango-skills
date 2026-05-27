# Assets (MCP list/insert/import)

Use this guide when working with editor assets through MCP.

## Core tools

- `list_assets` — list assets from:
  - story assets (`activeStoryJson.assets`)
  - user library assets (`getAssets(folderId, page, perPage, filters)`)
  - both merged
- `insert_assets` — insert one or many assets in one batched call. Each row may set `sceneId`; optional top-level `sceneId` is the fallback for rows that omit it, so **one call can target one or more scenes** (the MCP server sends one bridge `insertAssets` per distinct scene).
- `upload_assets` — upload assets from a local path, URL, or directory through the editor upload pipeline. Returns uploaded asset IDs and can optionally chain a shared insert.

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
  sceneId?: string, // default scene when a row omits sceneId
  inserts: Array<{
    assetId: string,
    sceneId?: string, // override per row for multi-scene batches
    parentEntityId?: string,
    parentIndex?: number, // in-batch parent reference (same scene as the row)
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

## `upload_assets` input

```ts
{
  items: Array<{
    source: "path" | "url" | "directory",
    value: string,
    name?: string,
    mimeType?: string,
    assetFolderId?: string,
    recursive?: boolean, // directory only; default false
    fileTypes?: string[], // mime prefixes ("image/") or extensions ("jpg", "glb")
    maxFiles?: number, // directory cap; default 100
    insert?: {
      sceneId: string,
      parentEntityId?: string,
      position?: [number, number, number],
      rotation?: [number, number, number],
      scale?: [number, number, number],
      forceEntityType?: EntityTypes,
      attachToStory?: boolean
    }
  }>
}
```

## Import workflow

- MCP server reads bytes from `path`, fetches bytes from `url`, or expands supported files from `directory`.
- MIME is inferred with `mime-types`; override with `mimeType` when needed.
- Directory mode skips dot-files, subdirectories unless `recursive: true`, non-files, and unsupported types. Default-allowed: `image/*`, `model/*`, `video/*`, `audio/*`, `font/*`, plus known extras such as `.glb`, `.gltf`, `.hdr`, `.exr`, `.ktx2`, `.splat`, `.ply`.
- Files stream to the editor as 256 KB raw chunks. The final chunk builds a browser `File` and `ICustomFile`, then reuses `uploadAssetFiles`.
- Uploads use the editor session/auth and normal pipeline: presigned URL -> S3 PUT -> thumbnail processing -> `handleNewAsset`.
- Long uploads send progress heartbeats (`assembled`, `presigned`, `s3`, `thumbnail`, `registering`) so the MCP bridge stays alive while progress continues. Silence over 30 seconds on `uploadAssetChunk` still times out.
- Default upload folder name is `My Uploads`; pass `assetFolderId` to target a specific library folder.
- Default per-file cap is 200 MB; directory default cap is 100 files.

## Multi-file insert semantics

`insert` on an item that produces multiple assets (especially `source: "directory"`) is applied as-is to every uploaded asset:

- same `position`
- same `rotation`
- same `scale`
- same `forceEntityType`
- same `attachToStory`

Result: assets stack at the same transform. This is intentional; there is no per-index array form.

When assets need different placements:

1. Call `upload_assets` without `insert` to get asset IDs in batch order.
2. Call `insert_assets` once with all rows, using per-row `position` / `rotation` / `scale` and per-row `sceneId` when inserting into more than one scene.
3. Optionally call `update_entities` for fine-tuning after entities exist.

## Story vs library

- Story assets live in `activeStoryJson.assets` and are immediately available for insert.
- Library assets require `folderId` to page through `/assets/getAssets/:folderId`.
- `insert_assets` auto-attaches library assets into the open story by default (`attachToStory !== false`).

## Asset category -> default entity type

Entity inference comes from editor `setNewEntityType(asset, scene)`:

- `VIDEO` -> `PANORAMA_VIDEO` / `PANORAMA_180_VIDEO` / `FLAT_VIDEO` (flat scenes only) / `GUI_VIDEO`
- `IMAGE` -> `PANORAMA` / `PANORAMA_180` / `FLAT_IMAGE` (flat scenes only) / `GUI_IMAGE`
- `VECTOR` -> `FLAT_IMAGE` (flat scenes only) / `GUI_VECTOR`
- `AUDIO` -> `AUDIO_GLOBAL`
- `MODEL_3D` -> `CUSTOM_3D_MODEL`
- `SPLAT` -> `SPLAT`
- `FONT` -> `TEXT_3D`
- `SUBTITLES` -> `SUBTITLE`
- `HDR` -> `HDR`

Use `forceEntityType` when you need to override default inference.

## Image and video entity types — trust the editor; `FLAT_*` scope

The editor's default inference for a plain image asset is **`GUI_IMAGE`** outside panorama cases — correct for most work. **Do not pass `forceEntityType` unless a row below matches.** Agents must not force `FLAT_IMAGE` or `FLAT_VIDEO` just because those enums exist.

**`FLAT_IMAGE` and `FLAT_VIDEO` belong only inside flat scenes.** They are not for wall posters, billboards, or arbitrary textured planes in navigable 3D tours — use **`GUI_IMAGE`/`GUI_VIDEO`**, **`PRIMITIVE_*`** with materials, **`CUSTOM_3D_MODEL`**, etc. Do not document flat scenes here beyond this rule; rely on studio scene typing when in doubt.

**When `forceEntityType` IS appropriate — images:**

| Situation | `forceEntityType` |
|-----------|-------------------|
| 360° equirectangular scene background | `PANORAMA` |
| 180° equirectangular (half-sphere) background | `PANORAMA_180` |
| Only inside flat scenes — flat media layer (editor normally infers; rarely force) | `FLAT_IMAGE` |
| SVG/vector in UI | `GUI_VECTOR` |
| All other image placements | omit — let the editor infer (typically `GUI_IMAGE`) |

**When `forceEntityType` IS appropriate — videos:**

| Situation | `forceEntityType` |
|-----------|-------------------|
| 360° equirectangular video background | `PANORAMA_VIDEO` |
| 180° equirectangular video background | `PANORAMA_180_VIDEO` |
| Only inside flat scenes — flat media layer (editor normally infers; rarely force) | `FLAT_VIDEO` |
| All other video placements | omit — let the editor infer (typically `GUI_VIDEO`) |

If intent is ambiguous, ask rather than guessing — and never use `FLAT_IMAGE` or `FLAT_VIDEO` outside flat scenes or as a fallback.

## Batch rules

- Prefer one `insert_assets` call for the full insertion wave (all rows and scenes in one batch when practical), not repeated single-row inserts or redundant extra tool calls.
- For parent-child chains within one batch, use `parentIndex` so parents can be referenced before IDs are known.
- Avoid interleaving `add_entities` and `insert_assets` against the same target chain in separate calls.
