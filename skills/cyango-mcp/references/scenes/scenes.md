# Scenes

A story is an ordered list of scenes. Each scene has `entities[]`, optional `timeline`, and optional `sceneActions` (scene-level; separate from per-entity `actions`).

---

## Scene types

| Scene type | Notes |
|------------|-------|
| `TOUR_3D` | First- or third-person movement in 3D with colliders. Default scene for interactive experiences including 2D-style GUI overlays. |
| `MODEL_VIEWER` | Camera orbits around a 3D model target. |
| `PANORAMA_360` | Fixed camera; 360° panorama (image or video). |
| `PANORAMA_180_SCENE` | Fixed camera; 180° panorama. |
| `LIVESTREAM_PANORAMA` | Livestream 360° panorama. |
| `LIVESTREAM_180_VIDEO_SCENE` | Livestream 180° video. |
| `MAP_2D_SCENE` / `MAP_3D_SCENE` | Map scenes. |
| `WEBCAM_SCENE` | Live webcam feed. |
| `FACE_TRACKING_SCENE` | Face tracking. |
| `AR_WORLD_TRACKING_SCENE` | AR world tracking. |
| `PASSWORD_SCENE` | Password entry flow. |
| `NOT_FOUND_SCENE` | 404 / not-found page. |

Use these strings for `sceneType`; compare with `get_story_state` / `get_scene` if rejected.

---

## Scene object fields

| Field | Role |
|-------|------|
| `id` | Scene id (navigation, `GO_TO_SCENE`, deep links). |
| `name` | Display name. |
| `sceneType` | One of the types above. |
| `entities` | Entities in this scene; hierarchy via parent ids. |
| `timeline` | Optional scene-level `ITimeline`. |
| `visibility` | Optional — `IVisibility` (per-device/language/timeline hiding). |
| `sceneActions` | Lifecycle `IAction[]` (e.g. `ON_SCENE_ENTER`). |
| `sceneColor` | Background color. |
| `physics` | `enabled`, `gravity`, `debug`. |
| `tags` | Tags for filtering / actions. |
| `effects` | Post-processing stack (bloom, DOF, color grading, anti-aliasing). |
| `toneMapping` | Renderer tone mapping. |

---

## GUI and 2D-style experiences

For 2D-style content (quizzes, menus, overlays), use `TOUR_3D` and parent GUI under the scene's `GUI_SCREEN`.
