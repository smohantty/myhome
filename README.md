# Duplex · 4 bedrooms — design versions

Concept 3D models of our duplex, built from the hand-drawn plans in [`plans/`](plans). Each design version
is a tab in the viewer: walk through it in 3D, or flip to its photo-real renders.

**▶ Open the viewer: https://smohantty.github.io/myhome/** (`#v1` for a version, `#v1/renders` for its renders)

![Front of the house (v1)](designs/v1/renders/front.png)

## Layout

| Path | What it is |
|---|---|
| `index.html` | Viewer: a tab per version · 3D overview with floor cut-aways · first-person walk (WASD + mouse, stairs work) · room jump list · minimap · `.glb`/`.obj` export · renders gallery |
| `designs/manifest.js` | Which versions appear as tabs, in order |
| `designs/<id>/design.js` | The version's layout: rooms, walls, openings, stair, furniture |
| `designs/<id>/render.py` | The version's Blender extras (entrance, furniture models, curtains, lights) and cameras |
| `designs/<id>/renders/*.png` | Photo-real renders shown in the Renders tab |
| `designs/<id>/house_geometry.json` | Geometry exported from `design.js`, so renders match the walkthrough |
| `render/build_scene.py` | Shared Blender pipeline: materials, site, trees, sky, render settings |
| `render/fetch_assets.py` | Downloads the free CC0 [Poly Haven](https://polyhaven.com) sky, textures, plants and furniture (~300 MB, not committed) |
| `tools/export_geometry.mjs` | Exports `design.js` geometry for Blender (needs `npm i -g puppeteer` + Chrome) |
| `plans/` | Original site plan and floor plan sketches |

The viewer also works opened straight from disk (double-click `index.html`).

## Add a new version

1. Copy a version: `cp -r designs/v1 designs/v2`, delete `designs/v2/renders/*.png`.
2. In `designs/v2/design.js` change `id: 'v2'` and `name`, then edit the layout (`rooms` drive floor colours,
   labels, minimap and the room list; `build()` places walls, stair and furniture).
3. Add `'v2'` to `designs/manifest.js` — it now has its own tab.
4. For renders: adjust `designs/v2/render.py` (cameras, extras), then
   ```sh
   node tools/export_geometry.mjs v2
   /Applications/Blender.app/Contents/MacOS/Blender -b -P render/build_scene.py -- --design v2 --cam front
   ```

## Render a version

```sh
python3 render/fetch_assets.py            # once: sky HDRI, scanned textures, trees, furniture
node tools/export_geometry.mjs v1         # after editing design.js
/Applications/Blender.app/Contents/MacOS/Blender -b -P render/build_scene.py -- \
  --design v1 --cam front                 # cameras: see CAMERAS in designs/v1/render.py
                                          # options: --samples 256 --res 1920x1200 --exposure 0 --out file.png
```
Output goes to `designs/<id>/renders/<cam>.png`; the Blender scene is saved as `designs/<id>/scene.blend` (not committed).

## V1 assumptions

- Floor-to-floor 10′, plinth 6″; drawings not exactly to scale, labelled room sizes used.
- Door positions inferred where the sketch was unclear (master suite via dress off the lobby; bedroom 4 via DR off the gallery).
- Terracotta cladding, balcony canopy, window sunshades, entrance canopy are design suggestions, not from the sketch.
- Neighbours are placeholder blocks. Concept only — have a local architect check structure and bye-laws.
