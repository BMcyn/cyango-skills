# Map entities

Both use **`mapProperties?: IEntityMapProperties`** for geo anchor.

## `IEntityMapProperties`

| Field | Notes |
|-------|-------|
| `latitude` / `longitude` / `altitude` | WGS84-style anchor. |
| `geolocationPinAssetId` | Asset id for the map pin graphic. |

Transform offsets the map frame in the scene; tiles/engine specifics are product-side.

| Type | Role |
|------|------|
| `MAP_2D` | 2D map view (slippy tiles / flat map plane). |
| `MAP_3D` | 3D map (terrain / globe / extruded buildings). Position/scale frame the volume. |
