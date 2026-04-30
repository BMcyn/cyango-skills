# 3D text entities

Both use **`text3D?: IAnimation<IEntityText3D>`** plus `material`, `geometry`, and transforms.

## `IEntityText3D`

| Field | Notes |
|-------|-------|
| `text` | `LocalizationObject` — copy per language. |
| `letterSpacing` / `lineHeight` | Typography spacing. |
| `bevelEnabled` / `bevelSize` / `bevelThickness` | Extruded mesh bevel. |

## Per-type notes

| Type | Role |
|------|------|
| `TEXT_3D` | Extruded 3D text mesh. `text3D` for string + bevel; `material` for face color/metalness. `actions` for click behavior when needed. |
| `TEXT_3D_VIDEO` | 3D text with video on glyph surfaces. Adds `media` for playback; timeline and media actions apply. |

MCP paths: `text3D.currentValue.text`, `material.currentValue`, `media.currentValue` (`TEXT_3D_VIDEO`).
