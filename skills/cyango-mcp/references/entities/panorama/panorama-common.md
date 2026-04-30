# Panorama entities

360° and 180° image and video on sphere or dome meshes. Shared fields:

- **`assetDomElementId`** — ties the entity to `storyJson.assets`.
- **`media?: IAnimation<IMediaClip>`** — clip timing, trim, volume, loop (video types).
- **`material`** / **`geometry`** — often animated for projection.

MCP paths: `media.currentValue.*`, `material.currentValue.*`, transforms.

---

## Per-type notes

| Type | Role | Scene pairing |
|------|------|---------------|
| `PANORAMA` | 360° equirectangular still image | `PANORAMA_360` |
| `PANORAMA_VIDEO` | 360° video sphere; playback via `media.currentValue` | `PANORAMA_360` / livestream |
| `PANORAMA_180` | 180° hemisphere still | `PANORAMA_180_SCENE` |
| `PANORAMA_180_VIDEO` | 180° video dome | `PANORAMA_180_SCENE` |
