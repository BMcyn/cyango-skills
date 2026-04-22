# Models & splats

Types defined in `cyango-shared` (`EntityTypes`, `IEntity`, `IEntityAnimation`, `IEntitySplat`, `SplatEffectTypes`). Below matches the **models / splat** slice of the entity model.

---

## Entity types

| Type | Role | Key details |
|------|------|-------------|
| `CUSTOM_3D_MODEL` | Imported **glTF / GLB** mesh with optional skeletal animation | `animations?: IAnimation<IEntityAnimation[]>` — clips (`IEntityAnimation`: `id`, `name`, `loop`, `play` / `pause` / `stop`, fades). `geometry` / `material` per mesh; `physics` for colliders; `prefab` when the tree is a prefab instance. Asset binding via `assetDomElementId` / story assets. |
| `MODEL_3D__CHILD` | Node in a **parent model** hierarchy (sub-mesh, bone attachment, nested part) | **`parentEntityId` required** — not a scene root. Transforms are **local** to the parent (armature / group). Usually created with the parent import; use `get_entity` for extra keys. |
| `SPLAT` | **Gaussian splat** / point-cloud style asset (processed splat formats in the pipeline) | `splat?: IAnimation<IEntitySplat>` — see **`SplatEffectTypes`** below. `material.currentValue.customShaderCode` when `effects.type` is `custom`. Assets via `assetDomElementId` / uploaded scans. |

---

## `IEntityAnimation` (3D model clips)

Used on **`CUSTOM_3D_MODEL`** under `animations.currentValue`.

| Field | Role |
|-------|------|
| `id` | Stable clip id. |
| `name` | Display / lookup name. |
| `blendMode` | How this clip blends with others (`AnimationBlendMode`). |
| `loop` | Loop style (`AnimationActionLoopStyles`). |
| `repetitions` | Repeat count when looping. |
| `clampWhenFinished` | Hold last frame when finished. |
| `zeroSlopeAtStart` / `zeroSlopeAtEnd` | Tangent control at clip boundaries. |
| `play` / `pause` / `stop` / `reset` / `reverse` | Playback control flags. |
| `fadeIn` / `fadeOut` | Fade durations (seconds). |

---

## `IEntitySplat` and `SplatEffectTypes`

`IEntitySplat` (on **`SPLAT`**):

| Field | Role |
|-------|------|
| `effects.enabled` | Turn the stylized effect on or off. |
| `effects.type` | One of **`SplatEffectTypes`** (see table below). |
| `effects.intensity` | **0–1** (typical default **0.8**). Used by **`electronic`**, **`deep_meditation`**, **`waves`**, **`disintegrate`**, **`burst_disintegrate`**, **`splat_flow`** per schema comment in `cyango-shared`. |

### `SplatEffectTypes`

Enum in `cyango-shared` — string values are the runtime tokens (e.g. `magic`, `none`). Names suggest motion/shader style; where the codebase does not document behavior, treat as **preset labels** and confirm in the editor.

| Value | Description |
|-------|-------------|
| `NONE` (`none`) | No extra stylized effect; baseline splat rendering. |
| `MAGIC` (`magic`) | “Magic”-style preset (particles / reveal — confirm in editor). |
| `SPREAD` (`spread`) | Spread / expansion-style motion. |
| `UNROLL` (`unroll`) | Unroll / peel-style motion. |
| `TWISTER` (`twister`) | Twist / vortex-style motion. |
| `RAIN` (`rain`) | Rain-like downward motion. |
| `ELECTRONIC` (`electronic`) | Electronic-style effect; uses **`intensity`**. |
| `DEEP_MEDITATION` (`deep_meditation`) | “Deep meditation” preset; uses **`intensity`**. |
| `WAVES` (`waves`) | Wave motion; uses **`intensity`**. |
| `FLARE` (`flare`) | Flare / burst-of-light style accent. |
| `DISINTEGRATE` (`disintegrate`) | Disintegration-style dissolve; uses **`intensity`**. |
| `BURST_DISINTEGRATE` (`burst_disintegrate`) | Burst + disintegrate variant; uses **`intensity`**. |
| `SPLAT_FLOW` (`splat_flow`) | Flowing splat motion; uses **`intensity`**. |
| `CUSTOM` (`custom`) | Custom shader path — set **`material.currentValue.customShaderCode`** (and any other material fields the runtime expects). |

---

## MCP paths

- **Models**: `animations.currentValue`, `geometry.currentValue`, `material.currentValue`, `physics.currentValue`, `prefab`, transforms.
- **Splats**: `splat.currentValue.effects`, `material.currentValue` (especially `customShaderCode` for `custom`).
