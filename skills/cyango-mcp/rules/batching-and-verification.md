# Batching, writes, and verification

Many separate create/remove/update operations can **crash the editor connection**. **Always** use batch tools:

- **Entity writes**: `add_entities`, `remove_entities`, `update_entities`.
- **Scene writes**: `add_scenes`, `remove_scenes`, `update_scenes` for multi-scene work; `add_scene`, `remove_scene`, `update_scene` are one-scene convenience wrappers that still use batched bridge commands internally.

The current MCP server bridge protocol is plural-only for writes (v4). Do not depend on old single-write bridge commands like `addEntity`, `removeEntity`, `addScene`, `removeScene`, `updateScene`, or `updateEntity`.

## Entity writes (required)

- **Creates**: always **`add_entities`** — order parents before children; use `parentIndex` when the parent row is in the same batch.
- **Removals**: always **`remove_entities`** — pass every target `entityId` in one call when they belong to the same scene.
- **Scenes**: use **`add_scene`** for one scene, **`add_scenes`** for multiple scenes in the same planned scene batch, **`remove_scenes`** for multi-scene removals, and **`update_scenes`** for scene patches across more than one scene.
- **Entity property updates**: always **`update_entities`** — bundle every patch for the task into one call’s `updates` array (each patch can target different `entityIds`). Prefer setting layout and payloads via `overrides` on **`add_entities`** at create time so you need fewer follow-up updates.
- **Scene property updates**: use **`update_scene`** for one scene, or **`update_scenes`** when different scene IDs/properties can be patched together.

## Verification (debugging only)

`get_entity` and `list_entities` are **not** required after every write. Use them when you suspect a value did not apply, an entity is missing, or you are debugging layout. The MCP **`add_entities`** / **`remove_entities`** tools already re-check existence against the editor and report `verified` / `fallbackUsed` in the response — agent-level re-verification after every batch duplicates that and adds latency.

`{"success": true}` from the bridge still only means the editor accepted the command; if something looks wrong in the viewport, that is when to read state.

Use **`bridge_status`** when debugging connection/queue problems, and **`validate_patch`** before writes when you are unsure about GUI paths or schema-safe values.

### Reference: what to check when debugging a suspected silent failure

Use the tables below only when you are investigating — not as a mandatory checklist after every operation.

**All entities:**

| Check | What to verify in `get_entity` |
|-------|-------------------------------|
| Name | `name` matches what you set. |
| Hierarchy | `parentEntityId` is correct (or empty for roots). |
| Transform | `position.currentValue`, `rotation.currentValue`, `scale.currentValue` match intended values. |
| Visibility | `visibility.hiddenTotally` and per-device flags match intent. |
| Actions | `actions.currentValue` array has correct length, ids, types, and nested objects (targets, properties, eventTypes). |

**Primitives / 3D content:**

| Check | What to verify |
|-------|---------------|
| Geometry | `geometry.currentValue.primitive` matches type (e.g. `BOX` for cube). Dimensions (`radius`, `width`, `height`) are what you set. |
| Material | `material.currentValue.color`, `materialType`, `metalness`, `roughness` match intent. |

**Lights:**

| Check | What to verify |
|-------|---------------|
| Light props | `light.currentValue.intensity`, `lightColor`, `distance`, `decay` match intent. |

**GUI entities:**

| Check | What to verify | Fix if wrong |
|-------|---------------|-------------|
| Text wrapping | `GUI_TEXT` inside a flex parent has `width` (e.g. `"100%"`) and `whiteSpace: "normal"` | Set `gui.currentValue.desktop.default.width` and `.whiteSpace` |
| Line clipping | `lineHeight` ≥ `fontSize` + ~4 px | Increase `lineHeight` |
| Container sizing | Parent `GUI_CONTAINER` has explicit `width`/`height` when children use `%` values | Set numeric or `"auto"` sizing on the container |
| Overflow | Wrapper `overflow` is `"visible"` unless scrolling is intended | Set `overflow: "visible"` |
| Responsive | `tablet` and `mobile` breakpoints have values if the design needs them — each is an independent override slot; writing to `desktop` does not auto-populate others | Set per-breakpoint values explicitly |

**Media / audio:**

| Check | What to verify |
|-------|---------------|
| Clip | `media.currentValue.volume`, `loop`, `play`, `speed` match intent. |
| Positional audio | `audio3D.currentValue.distance`, `rolloffFactor` match intent. |

If a value did not stick, re-apply with a **single** **`update_entities`** call whose `updates` array contains the fix.

## GUI on create

Pass `gui` (and other fields) in **`overrides` on each row of `add_entities`**. The MCP server deep-merges `overrides.gui.currentValue` with per-type defaults. Get layout right at create time to avoid extra **`update_entities`** churn.

## Child ordering in `add_entities`

Children render in the order they appear in the parent's children list. In flex layouts this is the visual order — a `flexDirection: "column"` panel with children added as `[Label, Question, Answers]` renders top-to-bottom in that sequence; add them as `[Answers, Label, Question]` and the buttons appear above the question text. The same principle extends to paint order, z-stacking, and any other context where sibling sequence is meaningful. Parents must always precede their children within a batch.

**Re-adding a removed entity appends it to the end.** If `[A, B, C]` exists and you remove then re-add `B`, the result is `[A, C, B]`. To restore correct order, remove all out-of-sequence siblings and re-add them in the right sequence.

## Read before removing or re-adding entities

Before removing any entity for any reason (ordering fix, reparenting, style correction), call `get_entity` on the **parent** to capture the full property set of all children. When re-creating the entity, every property from the original — including `height`, `positionType`, `justifyContent`, and any other GUI field — must be explicitly restated in the new **`overrides`** for **`add_entities`**. The MCP does not carry over any data from a removed entity. Properties omitted from the re-creation are silently dropped and revert to type defaults, which may be visually wrong (e.g. a button without explicit `height` collapses to `padding + lineHeight`, looking like a text link).

## Read before large edits

Use `get_story_state`, `get_scene`, or `get_entity` before bulk changes **when scene IDs, entity IDs, or structure are not already in your context** — so you do not edit the wrong targets.
