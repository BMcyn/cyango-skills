# Structure entities

| Type | Role | Notes |
|------|------|-------|
| `GROUP` | General-purpose grouping entity | No renderable mesh. `position`/`rotation`/`scale` define the frame for child entities. Use for composites: multiple 3D objects, GUI with 3D entities, or mixed content. |
| `GROUP_BOX` | Group with box visualization / bounds | Same hierarchy as `GROUP`; may carry `geometry`/`material` for visible wireframe. |
| `NONE` | Non-rendering entity | Anchor for `actions`, `physics` sensors, or template slots. No `geometry` expected. `isPlaceholder` on `IEntity` overlaps this concept. |
