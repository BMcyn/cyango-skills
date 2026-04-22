# Primitive entities

**`PRIMITIVE_*`** types are mesh primitives sharing **`geometry`**, **`material`**, and **transform** as `IAnimation<…>` tracks.

---

## `IEntityGeometry`

Dimensions are often **strings** (editor serializes through HTML-style attributes); numbers for segment counts and angles.

| Field | Used for |
|-------|----------|
| `primitive` | **`GeometryPrimitive`** — mesh kind (see table below). |
| `radius` | Spheres, cylinders, cones (string). |
| `radiusBottom` / `radiusTop` | Cones, truncated cones. |
| `segmentsWidth` / `segmentsHeight` | Tessellation. |
| `thetaLength` / `phiLength` / `thetaStart` / `phiStart` | Partial surfaces (radians). |
| `height` / `width` | Box, cylinder, cone, capsule, plane sizing. |

---

## `IEntityMaterial`

**`materialType`** is required and must match `MaterialTypes` from the shared common entity model. Key fields: `color`, `metalness`, `roughness`, `transparent`, `castShadow`, `receiveShadow`, PBR maps, `colorKey` / `colorKeyThreshold` for keyed video.

---

## MCP paths

`geometry.currentValue.*`, `material.currentValue.*`, `position.currentValue`, `rotation.currentValue`, `scale.currentValue`. Pass `geometry` / `material` in `overrides` on create when possible.

---

## MCP defaults and merge behavior (non-GUI)

Create-time behavior in **`cyango-mcp-server`**:

- **`geometry.currentValue`** is **deep-merged** with MCP defaults per entity type (patch wins over defaults at each leaf).
- **`material.currentValue`**, **`position`**, **`rotation`**, **`scale`**, **`light`** (when applicable), and similar animation tracks are merged the same way — callers can pass **partial** `geometry` / `material` without losing sibling keys.
- After merge, **`geometry.currentValue`** is **normalized**: radius-like fields are coerced to **strings** when passed as numbers; **`width`** / **`height`** are coerced to **numbers** when passed as numeric strings.

### Base geometry template (`geometry.currentValue`)

Before any primitive-specific template, MCP seeds every geometry-capable entity with defaults aligned with `defaultGeometry()` (radii `"0"`, unset segment counts `0`, etc.). Per **`PRIMITIVE_*`** type, MCP then applies an entity-type template (forces `primitive` enum and defaults such as **`PRIMITIVE_SPHERE`** → default `radius: "1"` only where the caller did not supply a radius).

### Hybrid sizing contract

- Prefer **`geometry.currentValue`** dimensions from story data — they persist in JSON and round-trip through MCP.
- **`scale`** remains a reliable way to resize when the viewport or tooling leans on transforms; treat **`geometry`** + **`scale`** as complementary (document intent in complex builds).

### `update_entities`

Patches to **`geometry.currentValue`** run the same scalar normalization server-side before the editor receives them (helps string/number mixtures match shared expectations).

---

## Per-type notes

| Type | `GeometryPrimitive` | Key geometry fields |
|------|---------------------|---------------------|
| `PRIMITIVE_CUBE` | `BOX` | `width`, `height` (depth via scale or third dimension). |
| `PRIMITIVE_SPHERE` | `SPHERE` | `radius` (string), `segmentsWidth`, `segmentsHeight`. `phiLength`/`thetaLength` for partial spheres. |
| `PRIMITIVE_CYLINDER` | `CYLINDER` | `radius` (or top/bottom if truncated), `height`, segments. |
| `PRIMITIVE_PLANE` | `PLANE` | `width`, `height`, segment subdivisions. |
| `PRIMITIVE_CONE` | `CONE` | `radiusBottom`, `radiusTop`, `height`, segments. |
| `PRIMITIVE_RING` | `RING` | Inner/outer radii, `segmentsWidth`, `thetaLength` for partial ring. |
| `PRIMITIVE_CIRCLE` | `CIRCLE` | `radius`, `thetaLength`, `thetaStart`. |
| `PRIMITIVE_ROUNDED_PLANE` | `PLANE` | Same as plane + rounded-corner parameters (check `get_entity` for exact keys). |
| `PRIMITIVE_CURVED_PLANE` | `PLANE` | Same as plane + curvature/arc fields (check `get_entity` for exact keys). |
| `PRIMITIVE_CAPSULE` | *(implied by entityType)* | `radius` (string), `height` (numeric). No `CAPSULE` in `GeometryPrimitive` enum — mesh is built from entityType. Often paired with `physics` for character controllers. |
