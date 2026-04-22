# Light entities

All `*_LIGHT` types use **`light?: IAnimation<IEntityLight>`** for color and photometric fields, plus transform and optional visibility.

---

## `IEntityLight`

| Field | Notes |
|-------|-------|
| `lightColor` | Hex / CSS color string. |
| `intensity` | Brightness multiplier. |
| `distance` | Range where intensity falls off (point / spot). |
| `decay` | Falloff curve (physically correct lights). |
| `angle` | Spot outer cone (radians). |
| `penumbra` | Spot edge softness (0–1). |
| `attenuation` | Extra falloff tuning (product-specific). |
| `anglePower` | Volumetric / cone shaping where used. |

Not every field applies to every light type — see table below.

---

## MCP paths

`light.currentValue.intensity`, `light.currentValue.lightColor`, `position.currentValue`, etc.

---

## MCP defaults (create path)

Lights use **`light.currentValue`** merged with MCP defaults (**caller overrides win**):

| Entity type | Notes |
|-------------|--------|
| Generic `*_LIGHT` (except below) | Starts from default light track: `lightColor` `#FFFFFF`, `intensity` `1`, `decay` `0`, etc. |
| **`AMBIENT_LIGHT`** | Merged with MCP defaults `lightColor` `#FFFFFF`, `intensity` `1`, `decay` `0`. **`position`** defaults to `[10,10,10]` unless **`overrides.position`** is set at create time. |
| **`POINT_LIGHT`** | Merged with MCP defaults including **`decay: 2`**, **`distance: 0`**. |

Sky / camera placement of lights is unchanged from shared semantics: point/spot use **position**; directional uses **rotation** for direction.

---

## Per-type notes

| Type | Role | Relevant fields | Transform notes |
|------|------|-----------------|-----------------|
| `AMBIENT_LIGHT` | Uniform fill, no direction/shadows | `lightColor`, `intensity` | Position usually irrelevant for lighting. |
| `POINT_LIGHT` | Omnidirectional, distance falloff | `lightColor`, `intensity`, `distance`, `decay` | Position matters; rotation has no effect. |
| `SPOT_LIGHT` | Cone spotlight | `lightColor`, `intensity`, `distance`, `decay`, `angle`, `penumbra` | Position = origin; rotation aims the cone. |
| `DIRECTIONAL_LIGHT` | Parallel sun rays, infinite distance | `lightColor`, `intensity` | Rotation sets direction; position usually irrelevant. |
| `VOLUMETRIC_SPOT_LIGHT` | Visible volumetric beam | Same as spot + `anglePower`/`attenuation` for beam shape | Same as spot. |
| `TUBE_LIGHT` | Linear / tube area light | `lightColor`, `intensity`, `distance`, decay along tube | Scale or geometry may define tube extent — check `get_entity`. |
