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
