# Duplex · 4 bedrooms — 3D model

Concept 3D model of the duplex, built from the hand-drawn plans in this folder.

## What's here

| File | What it is |
|---|---|
| `Site plan & directions@1x.png`, `Ground floor@1x.png`, `First floor@1x (1).png` | Source plans |
| `duplex-3d.html` | Interactive 3D model — open in Chrome. Overview with floor cut-aways, first-person walk-through (WASD + mouse, stairs work), room jump list, minimap, `.glb`/`.obj` export |
| `render/duplex_front.png` | Photo-real render of the front (south, road side) |
| `render/duplex_scene.blend` | Blender scene for the render |
| `render/build_scene.py` | Rebuilds the Blender scene from `house_geometry.json` and renders |
| `render/house_geometry.json` | Geometry exported from `duplex-3d.html`, so the render matches the walk-through |

## Re-render the front

```sh
/Applications/Blender.app/Contents/MacOS/Blender -b -P render/build_scene.py -- \
  --samples 128 --res 1920x1200 --out render/duplex_front.png   # add --cam corner for a 3/4 view
```

## Assumptions (v1)

- Floor-to-floor 10′, plinth 6″; drawings not exactly to scale, labelled room sizes used.
- Door positions inferred where the sketch was unclear (master suite via dress off the lobby; bedroom 4 via DR off the gallery).
- Terracotta cladding, balcony canopy, window sunshades are design suggestions, not from the sketch.
- Neighbours are placeholder blocks. Concept only — have a local architect check structure and bye-laws.
