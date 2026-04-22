# Common entity model

Every scene has an **`entities[]`** array. Each item is an **`IEntity`**: a typed object with `entityType`, identity, hierarchy, optional `IAnimation<T>` tracks, and type-specific payloads (`gui`, `geometry`, `light`, …).

Hierarchy uses `parentEntityId` and local-vs-world transform semantics.

Animation/timeline fields use `IAnimation<T>` wrappers (`currentValue`, optional keyframes, repeat).

Actions are attached as `actions.currentValue` (`IAction[]`).

---

## Identity & hierarchy

| Field | Notes |
|-------|-------|
| `id` | Stable id (references, actions, parenting). |
| `name` | Display / editor name. |
| `sceneId` | Which scene owns this entity. |
| `entityType` | `EntityTypes` — discriminator; drives which optional blocks apply. |
| `parentEntityId` | Parent entity id, or unset for scene-root entities. |
| `children` | Optional nested `IEntity[]` (hierarchy is often flat with `parentEntityId`). |
| `locked` | Editor treats entity as non-editable. |
| `isPlaceholder` | Renders nothing; useful as group / template anchor. |

---

## Transforms & animation

Most "live" fields use `IAnimation<T>`: `currentValue` plus optional `keyframes`, `repeat`, `excludeFromMasterTimeline`.

| Field | Typical `T` |
|-------|-------------|
| `position` / `rotation` / `scale` | Number arrays (length 3). |
| `geometry` | `IEntityGeometry` (primitive + dimensions). |
| `material` | `IEntityMaterial` (`materialType` + Three.js-style props). |
| `media` | `IMediaClip` (video/audio clip on the timeline). |
| `gui` | `IEntityGUI` (per-breakpoint UI states). |
| `light` / `camera` / `player` / … | Type-specific structs — see family docs below. |
| `actions` | `IAction[]` — can be keyed like other tracks. |

---

## Visibility

`visibility` uses **`IVisibility`** — same shape as on scenes: optional booleans (and one language list) that hide this entity in specific contexts. If a flag is unset, it does not apply.

| Field | Role |
|-------|------|
| `hiddenTotally` | Hidden in all cases (strongest hide). |
| `hiddenInDesktop` | Hidden in desktop layout / viewport. |
| `hiddenInTablet` | Hidden on tablet breakpoint. |
| `hiddenInMobile` | Hidden on mobile breakpoint. |
| `hiddenInMobileAR` | Hidden in mobile AR. |
| `hiddenInVR` | Hidden in VR. |
| `hiddenInAR` | Hidden in AR. |
| `hideInTimeline` | Hidden on the timeline (editor / playback strip). |
| `hiddenInLanguages` | Hide only for these languages (`LanguageTypes[]`). |
| `hiddenInIPhone` | Hidden on iPhone. |
| `hiddenInIPad` | Hidden on iPad. |
| `hiddenInAndroid` | Hidden on Android devices. |
| `hiddenInPWAAndroid` | Hidden in Android PWA. |
| `hiddenInPWAiOS` | Hidden in iOS PWA. |

---

## Other fields

| Field | Notes |
|-------|-------|
| `assetDomElementId` | Links DOM media to asset (composite id: `asset.id + entity.id`). |
| `tags` | `ITag[]` — `{ name, color, textColor? }` for filtering and action targeting. |
| `physics` | `IEntityPhysics` — Rapier rigid body: `enabled`, `type`, `shape`, mass, friction, colliders. |
| `layer` | `IAnimationLayer` — editor UI only (locked, duration, expanded). |
| `handles` | `IEntityHandles` — gizmo manipulation in editor. |
| `billboard` | Face-camera behavior. |
| `prefab` | `IEntityPrefabLink` — prefab id, overrides, instance group. |

---

## Per-family docs

Each row names the family’s `*-common.md` file. That file defines the family `entityType` values, roles, and payloads.

| Family | `*-common.md` |
|--------|---------------|
| GUI | `gui/gui-common.md` |
| Primitives | `primitives/primitives-common.md` |
| Lights | `lights/lights-common.md` |
| Panorama | `panorama/panorama-common.md` |
| 3D text | `text-3d/text-3d-common.md` |
| Maps | `maps/maps-common.md` |
| Models & splats | `models/models-common.md` |
| Environment | `environment/environment-common.md` |
| Audio | `audio/audio-common.md` |
| Camera / player / webcam / face | `camera-player/camera-player-common.md` |
| Subtitle | `subtitle/subtitle-common.md` |
| Structure | `structure/structure-common.md` |

---

## `MaterialTypes`

| Value | Role |
|-------|------|
| `NONE` | — |
| `COLORKEY` | Chroma-style keying. |
| `ALPHA` | Alpha channel handling. |
| `LEFT_RIGHT` / `TOP_BOTTOM` | Stereo layouts. |
| `FLAT` | MeshBasic-style. |
| `STANDARD` | PBR-style. |
| `PHONG` / `LAMBERT` | Classic lit materials. |
| `OCCLUSION` | Depth/occlusion pass helper. |
| `TRANSPARENT` | Transparent mesh. |
