"""Build a photo-real Blender scene of the duplex from house_geometry.json and render the front.

One-time:  python3 render/fetch_assets.py          (free CC0 textures, sky & plants from Poly Haven)
Render:    /Applications/Blender.app/Contents/MacOS/Blender -b -P render/build_scene.py -- \
             --samples 256 --res 1920x1200 --out render/duplex_front.png [--cam front|corner]

Geometry comes from duplex-3d.html (feet, three.js axes: +x west, +y up, +z north).
Blender axes here: +X west, +Y south (towards the road), +Z up, metres.
"""
import bpy, bmesh, json, math, os, random, sys
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
def arg(name, default):
    return argv[argv.index(name) + 1] if name in argv else default
SAMPLES = int(arg('--samples', '256'))
RES = [int(v) for v in arg('--res', '1920x1200').split('x')]
OUT = os.path.abspath(arg('--out', 'render/front.png'))
CAM = arg('--cam', 'front')
HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, 'assets')
if not os.path.isdir(ASSETS):
    sys.exit('Missing render/assets — run: python3 render/fetch_assets.py')
random.seed(7)

FT = 0.3048
def P(x, y, z):            # three.js feet -> blender metres
    return Vector((x * FT, -z * FT, y * FT))

# ---------------------------------------------------------------- reset
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
col = bpy.data.collections.new('Duplex'); scene.collection.children.link(col)
site = bpy.data.collections.new('Site'); scene.collection.children.link(site)
lib = bpy.data.collections.new('AssetLibrary'); scene.collection.children.link(lib)
bpy.context.view_layer.layer_collection.children['AssetLibrary'].exclude = True

# ---------------------------------------------------------------- materials
def principled(name, color, rough=0.5, metal=0.0, **kw):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    for k, v in kw.items():
        b.inputs[k].default_value = v
    return m

_imgs = {}
def img(tex, mapname, noncolor):
    path = os.path.join(ASSETS, 'textures', tex, mapname + '.jpg')
    if path not in _imgs:
        im = bpy.data.images.load(path)
        im.colorspace_settings.name = 'Non-Color' if noncolor else 'sRGB'
        _imgs[path] = im
    return _imgs[path]

def pbr(name, tex, size_m, tint=None, rough_mul=1.0, normal=1.0, contrast=(0.85, 1.15)):
    """Photo-scanned PBR material, box-projected in WORLD space so the grain is continuous
    across walls and true to scale (size_m = metres covered by one texture tile).
    tint: recolour the scan while keeping its light/dark variation."""
    m = principled(name, (0.8, 0.8, 0.8)); nt = m.node_tree; b = nt.nodes['Principled BSDF']
    geo = nt.nodes.new('ShaderNodeNewGeometry')
    mp = nt.nodes.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (1 / size_m,) * 3
    nt.links.new(geo.outputs['Position'], mp.inputs['Vector'])
    def tex_node(mapname, noncolor):
        t = nt.nodes.new('ShaderNodeTexImage'); t.image = img(tex, mapname, noncolor)
        t.projection = 'BOX'; t.projection_blend = 0.25
        nt.links.new(mp.outputs['Vector'], t.inputs['Vector'])
        return t
    diff = tex_node('Diffuse', False)
    if tint:
        bw = nt.nodes.new('ShaderNodeRGBToBW'); nt.links.new(diff.outputs['Color'], bw.inputs['Color'])
        mr = nt.nodes.new('ShaderNodeMapRange')
        mr.inputs['From Min'].default_value, mr.inputs['From Max'].default_value = 0.0, 1.0
        # centre the scan's brightness on the tint
        mr.inputs['To Min'].default_value, mr.inputs['To Max'].default_value = contrast[0] - 0.35, contrast[1] + 0.35
        nt.links.new(bw.outputs['Val'], mr.inputs['Value'])
        mix = nt.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.blend_type = 'MULTIPLY'
        mix.inputs[0].default_value = 1.0
        mix.inputs[6].default_value = (*tint, 1)             # colour A
        nt.links.new(mr.outputs['Result'], mix.inputs[7])    # colour B
        nt.links.new(mix.outputs[2], b.inputs['Base Color'])
    else:
        nt.links.new(diff.outputs['Color'], b.inputs['Base Color'])
    if os.path.exists(os.path.join(ASSETS, 'textures', tex, 'Rough.jpg')):
        r = tex_node('Rough', True)
        rm = nt.nodes.new('ShaderNodeMath'); rm.operation = 'MULTIPLY'; rm.inputs[1].default_value = rough_mul
        nt.links.new(r.outputs['Color'], rm.inputs[0]); nt.links.new(rm.outputs['Value'], b.inputs['Roughness'])
    n = tex_node('nor_gl', True)
    nm = nt.nodes.new('ShaderNodeNormalMap'); nm.inputs['Strength'].default_value = normal
    nt.links.new(n.outputs['Color'], nm.inputs['Color']); nt.links.new(nm.outputs['Normal'], b.inputs['Normal'])
    return m

def cladding(name):
    """Vertical terracotta baguette cladding: procedural tiles + scanned clay micro-detail."""
    m = pbr(name, 'clay_plaster', 1.2, tint=(0.46, 0.17, 0.08), normal=0.6)
    nt = m.node_tree; b = nt.nodes['Principled BSDF']
    geo = nt.nodes.new('ShaderNodeNewGeometry')
    br = nt.nodes.new('ShaderNodeTexBrick'); br.offset = 0.5
    for k, v in {'Scale': 3.0, 'Mortar Size': 0.012, 'Brick Width': 0.9, 'Row Height': 0.12,
                 'Color1': (1, 1, 1, 1), 'Color2': (0.8, 0.8, 0.8, 1), 'Mortar': (0.9, 0.85, 0.8, 1)}.items():
        br.inputs[k].default_value = v
    nt.links.new(geo.outputs['Position'], br.inputs['Vector'])
    base = b.inputs['Base Color'].links[0].from_socket
    mul = nt.nodes.new('ShaderNodeMix'); mul.data_type = 'RGBA'; mul.blend_type = 'MULTIPLY'
    mul.inputs[0].default_value = 1.0
    nt.links.new(base, mul.inputs[6]); nt.links.new(br.outputs['Color'], mul.inputs[7])
    nt.links.new(mul.outputs[2], b.inputs['Base Color'])
    # grooves between tiles via bump on top of the scanned normal
    nrm = b.inputs['Normal'].links[0].from_socket
    bump = nt.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.35; bump.invert = True
    nt.links.new(br.outputs['Fac'], bump.inputs['Height']); nt.links.new(nrm, bump.inputs['Normal'])
    nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
    return m

def wood(name, c1, c2, scale=6.0):
    m = principled(name, c1, rough=0.45)
    nt = m.node_tree; b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord')
    mp = nt.nodes.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (1, 1, 12)
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector'])
    wv = nt.nodes.new('ShaderNodeTexWave'); wv.inputs['Scale'].default_value = scale; wv.inputs['Distortion'].default_value = 6
    nt.links.new(mp.outputs['Vector'], wv.inputs['Vector'])
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].color = (*c1, 1); ramp.color_ramp.elements[1].color = (*c2, 1)
    nt.links.new(wv.outputs['Fac'], ramp.inputs['Fac'])
    nt.links.new(ramp.outputs['Color'], b.inputs['Base Color'])
    return m

def shutter_mat():
    m = principled('Shutter', (0.30, 0.32, 0.33), rough=0.35, metal=0.8)
    nt = m.node_tree; b = nt.nodes['Principled BSDF']
    geo = nt.nodes.new('ShaderNodeNewGeometry')
    wv = nt.nodes.new('ShaderNodeTexWave'); wv.wave_type = 'BANDS'; wv.bands_direction = 'Z'
    wv.inputs['Scale'].default_value = 12
    nt.links.new(geo.outputs['Position'], wv.inputs['Vector'])
    bump = nt.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.5
    nt.links.new(wv.outputs['Fac'], bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
    return m

def curtain_mat():
    m = bpy.data.materials.new('SheerCurtain'); m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    tl = nt.nodes.new('ShaderNodeBsdfTranslucent'); tl.inputs['Color'].default_value = (0.95, 0.9, 0.82, 1)
    df = nt.nodes.new('ShaderNodeBsdfDiffuse'); df.inputs['Color'].default_value = (0.9, 0.86, 0.8, 1)
    tr = nt.nodes.new('ShaderNodeBsdfTransparent')
    m1 = nt.nodes.new('ShaderNodeMixShader'); m1.inputs['Fac'].default_value = 0.5
    m2 = nt.nodes.new('ShaderNodeMixShader'); m2.inputs['Fac'].default_value = 0.45
    nt.links.new(df.outputs[0], m1.inputs[1]); nt.links.new(tl.outputs[0], m1.inputs[2])
    nt.links.new(m1.outputs[0], m2.inputs[1]); nt.links.new(tr.outputs[0], m2.inputs[2])
    nt.links.new(m2.outputs[0], out.inputs['Surface'])
    return m

PLASTER_TINT = (0.80, 0.77, 0.71)
glass = principled('Glass', (0.80, 0.90, 0.88), rough=0.0, **{'Transmission Weight': 1.0, 'IOR': 1.52})
MAT = {
    'extWall': pbr('Plaster', 'painted_plaster_wall', 2.0, tint=PLASTER_TINT, normal=0.35),
    'parapet': pbr('Parapet', 'painted_plaster_wall', 2.0, tint=(0.72, 0.69, 0.64), normal=0.35),
    'slab': pbr('Slab', 'painted_plaster_wall', 2.0, tint=(0.83, 0.81, 0.77), normal=0.25),
    'wall': principled('InteriorWall', (0.80, 0.76, 0.70), rough=0.9),
    'accent': cladding('Terracotta'),
    'plinth': pbr('Stone', 'granite_wall', 1.0, tint=(0.16, 0.15, 0.14)),
    'glass': glass,
    'frame': principled('Aluminium', (0.03, 0.03, 0.03), rough=0.35, metal=0.9),
    'rail': principled('Steel', (0.05, 0.05, 0.05), rough=0.3, metal=0.9),
    'shutter': shutter_mat(),
    'wood': wood('Teak', (0.30, 0.15, 0.07), (0.18, 0.08, 0.03)),
    'tread': wood('StairWood', (0.25, 0.13, 0.06), (0.15, 0.07, 0.03)),
    'cabinet': principled('Cabinet', (0.62, 0.55, 0.45), rough=0.5),
    'counter': principled('Granite', (0.05, 0.05, 0.05), rough=0.2),
    'white': principled('Ceramic', (0.85, 0.85, 0.83), rough=0.15),
    'dark': principled('Dark', (0.02, 0.02, 0.02), rough=0.4),
    'fabric': principled('Fabric', (0.20, 0.26, 0.20), rough=1.0, **{'Sheen Weight': 0.4}),
    'fabric2': principled('Fabric2', (0.55, 0.47, 0.36), rough=1.0, **{'Sheen Weight': 0.4}),
    'linen': principled('Linen', (0.85, 0.83, 0.78), rough=1.0),
    'car': principled('CarPaint', (0.12, 0.20, 0.28), rough=0.2, metal=0.6, **{'Coat Weight': 1.0}),
    'brass': principled('Brass', (0.8, 0.6, 0.25), rough=0.25, metal=1.0),
}
CURTAIN = curtain_mat()
def floor_mat(hexcol):
    key = 'floor:' + hexcol
    if key not in MAT:
        c = tuple((int(hexcol[i:i + 2], 16) / 255) ** 2.2 for i in (0, 2, 4))
        MAT[key] = principled('Floor_' + hexcol, c, rough=0.3)
    return MAT[key]

# ---------------------------------------------------------------- geometry helpers
def cube(name, center, size, mat, coll=col, bevel=0.006):
    """center/size in blender metres. size = (dx, dy, dz)."""
    me = bpy.data.meshes.new(name)
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector((v.co.x * size[0], v.co.y * size[1], v.co.z * size[2]))
    bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); ob.location = center
    me.materials.append(mat); coll.objects.link(ob)
    if bevel and min(size) > bevel * 3:
        md = ob.modifiers.new('Bevel', 'BEVEL'); md.width = bevel; md.segments = 2; md.limit_method = 'ANGLE'
    return ob

def box_ft(x1, x2, y1, y2, z1, z2, mat, coll=site, bevel=0.006):
    c = P((x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2)
    return cube('b', c, ((x2 - x1) * FT, (z2 - z1) * FT, (y2 - y1) * FT), mat, coll, bevel)

def plane_ft(x1, x2, z1, z2, y, mat, coll=site):
    return box_ft(x1, x2, y - 0.02, y, z1, z2, mat, coll, bevel=0)

# ---------------------------------------------------------------- house from json
data = json.load(open(os.path.join(HERE, 'house_geometry.json')))
for i, d in enumerate(data):
    k = d['k']
    m = floor_mat(k[6:]) if k.startswith('floor:') else MAT.get(k, MAT['wall'])
    x, y, z = d['p']
    if d['t'] == 'box':
        w, h, dd = d['s']
        if k == 'shutter':          # rolled-up shutter box: we model the shutter closed below
            continue
        bev = 0 if k in ('glass', 'frame') else 0.006
        if k == 'extWall' and abs(z) < 0.5 and y > 10.5:   # first-floor front wall -> terracotta
            m = MAT['accent']
        cube(f'{k}_{i}', P(x, y, z), (w * FT, dd * FT, h * FT), m, bevel=bev)
    else:
        w, dd = d['s']
        cube(f'{k}_{i}', P(x, y, z), (w * FT, dd * FT, 0.004), m, bevel=0)

# closed rolling shutter + guide rails + hood
box_ft(28, 37, 0.5, 8.5, -0.55, -0.4, MAT['shutter'], col, bevel=0)
box_ft(27.8, 28.1, 0.5, 8.6, -0.6, -0.35, MAT['frame'], col, bevel=0)
box_ft(36.9, 37.2, 0.5, 8.6, -0.6, -0.35, MAT['frame'], col, bevel=0)
box_ft(27.8, 37.2, 8.5, 9.3, -1.0, -0.35, MAT['frame'], col, bevel=0.004)
# fully glaze the first-floor sliding doors (the walkthrough leaves half open)
for a, b in [(19, 25), (28.5, 36.5), (40, 50)]:
    mid = (a + b) / 2
    box_ft(mid, b, 10.5, 18.5, -0.04, 0.04, glass, col, bevel=0)
    for x in (a, mid, b):
        box_ft(x - 0.12, x + 0.12, 10.5, 18.5, -0.1, 0.1, MAT['frame'], col, bevel=0)
# roof canopy over the front balcony, with a deep fascia
box_ft(16.5, 52.5, 20.5, 21.2, -4.5, 0, MAT['slab'], col)
box_ft(16.5, 52.5, 20.0, 22.2, -4.9, -4.5, MAT['slab'], col)
# sunshade chajjas over the ground-floor windows
box_ft(18.5, 25.5, 7.7, 8.0, -1.8, 0, MAT['slab'], col)
box_ft(39.5, 50.5, 7.7, 8.0, -1.8, 0, MAT['slab'], col)
# coping on parapet
box_ft(16.7, 52.3, 24.2, 24.4, -0.35, 0.35, MAT['parapet'], col)
# house number plate + wall lights either side of the garage
box_ft(37.6, 38.6, 6.8, 7.5, -0.45, -0.38, MAT['brass'], col, bevel=0)
lamp_glow = principled('LampGlow', (1, 0.8, 0.55), **{'Emission Color': (1, 0.75, 0.45, 1), 'Emission Strength': 6.0})
for x in (27.3, 37.7):
    box_ft(x - 0.2, x + 0.2, 7.6, 8.3, -0.6, -0.38, lamp_glow, col, bevel=0)

# sheer curtains just inside the glass (hide the simple interiors, add life)
def curtain(x1, x2, y1, y2, z, folds=14):
    me = bpy.data.meshes.new('curtain'); bm = bmesh.new()
    nx, ny = 60, 2
    verts = []
    for j in range(ny + 1):
        row = []
        for i in range(nx + 1):
            t = i / nx
            x = x1 + (x2 - x1) * t
            dz = 0.18 * math.sin(t * folds * math.pi)
            row.append(bm.verts.new(P(x, y1 + (y2 - y1) * j / ny, z + dz)))
        verts.append(row)
    for j in range(ny):
        for i in range(nx):
            bm.faces.new((verts[j][i], verts[j][i + 1], verts[j + 1][i + 1], verts[j + 1][i]))
    bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new('curtain', me); me.materials.append(CURTAIN); col.objects.link(ob)
    for p in me.polygons: p.use_smooth = True
# first-floor sliding doors: curtains drawn to the sides
for a, b in [(19, 25), (28.5, 36.5), (40, 50)]:
    w = b - a
    curtain(a + 0.1, a + w * 0.32, 10.6, 18.3, 0.8)
    curtain(b - w * 0.28, b - 0.1, 10.6, 18.3, 0.8)
# ground-floor kitchen & master windows
curtain(19.1, 21.5, 4.0, 7.4, 0.8, 8); curtain(40.1, 43.5, 4.0, 7.4, 0.8, 10); curtain(47, 49.9, 4.0, 7.4, 0.8, 9)

# ---------------------------------------------------------------- site
grass = pbr('Grass', 'aerial_grass_rock', 3.0, normal=0.8)
asphalt = pbr('Asphalt', 'asphalt_02', 3.0, normal=0.8)
paving = pbr('Paving', 'rectangular_paving', 1.6, normal=0.8)
footpath = pbr('Footpath', 'concrete_floor', 2.0, tint=(0.52, 0.50, 0.47), normal=0.7)
kerb = pbr('Kerb', 'concrete_floor', 1.0, tint=(0.62, 0.60, 0.57))
paint = principled('RoadPaint', (0.75, 0.75, 0.70), rough=0.7)
neigh = pbr('NeighbourPlaster', 'grey_plaster', 2.5, tint=(0.66, 0.60, 0.52), normal=0.7)
neigh2 = pbr('NeighbourPlaster2', 'grey_plaster', 2.5, tint=(0.74, 0.70, 0.62), normal=0.7)
darkwin = principled('NeighbourWindow', (0.02, 0.025, 0.03), rough=0.05, **{'Specular IOR Level': 0.8})
tankmat = principled('WaterTank', (0.015, 0.015, 0.015), rough=0.45)

plane_ft(-400, 400, -400, 400, 0.0, grass)
plane_ft(-22, 120, -30, -9.3, 0.03, asphalt)           # main road (south)
plane_ft(-22, -6, -30, 120, 0.035, asphalt)            # side road (east)
box_ft(-6, 120, 0, 0.45, -9, -5, footpath)             # footpath along main road
box_ft(-6, 120, 0, 0.5, -9.3, -9, kerb, bevel=0.01)
box_ft(17, 52, 0, 0.47, -5, 0, paving, bevel=0)        # car apron, flush with footpath
plane_ft(-6, 0, 22, 45, 0.06, paving)                  # entry strip
box_ft(-4, 0, 0, 0.25, 31, 35, paving)                 # door step
for x in range(-20, 120, 10):
    plane_ft(x, x + 5, -19.7, -19.3, 0.05, paint)

def tank(x, z, y, r=2.2, h=4.5):
    """Black rooftop water tank (a Sintex-style tank, ubiquitous on Indian roofs)."""
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=r * FT, depth=h * FT, location=P(x, y + h / 2, z))
    t = bpy.context.active_object
    for c in t.users_collection: c.objects.unlink(t)
    site.objects.link(t); t.data.materials.append(tankmat)
    bpy.ops.object.shade_smooth()
    md = t.modifiers.new('Bevel', 'BEVEL'); md.width = 0.08; md.segments = 4

def neighbour(x1, x2, z1, z2, h, mat, front_windows=True, floors=1, water_tank=True):
    box_ft(x1, x2, 0, h, z1, z2, mat, coll=site, bevel=0.02)
    box_ft(x1 - 0.3, x2 + 0.3, h, h + 0.4, z1 - 0.3, z2 + 0.3, neigh2, coll=site)
    if front_windows:
        for f in range(floors):
            y0 = 3.5 + f * 10.5
            n = max(1, int((x2 - x1) // 8))
            for j in range(n):
                cx = x1 + (j + 0.5) * (x2 - x1) / n
                box_ft(cx - 2, cx + 2, y0, y0 + 4, z1 - 0.08, z1 + 0.2, darkwin, coll=site, bevel=0)
                box_ft(cx - 2.3, cx + 2.3, y0 + 4, y0 + 4.3, z1 - 1.0, z1 + 0.2, neigh2, coll=site)
    if water_tank:
        tank(x1 + (x2 - x1) * 0.7, z1 + (z2 - z1) * 0.6, h + 0.4)

neighbour(0, 16.55, 0.2, 21.6, 21, neigh, floors=2)      # 2-storey neighbour in the SE cut-out
neighbour(54, 75, 2, 45, 11, neigh2)                      # single-storey west
neighbour(-60, -26, 5, 60, 31, neigh, front_windows=False)
neighbour(17, 52, 47, 70, 11, neigh2, front_windows=False)
neighbour(80, 110, 0, 40, 21, neigh, floors=2)
neighbour(-60, -30, -80, -40, 21, neigh2, front_windows=False)
tank(46, 36, 21.2 + 0.2)                                  # our own tank, set back on the roof

# ---------------------------------------------------------------- scanned vegetation (Poly Haven)
def load_model(name, objects):
    path = os.path.join(ASSETS, 'models', name, name + '.blend')
    with bpy.data.libraries.load(path, link=False) as (src, dst):
        dst.objects = [o for o in src.objects if o in objects]
    for o in dst.objects:
        lib.objects.link(o); o.location = (0, 0, 0)
    # appended images keep '//textures/..' relative to the source file: make them absolute
    for im in bpy.data.images:
        if im.filepath.startswith('//') and not os.path.exists(bpy.path.abspath(im.filepath)):
            cand = os.path.join(ASSETS, 'models', name, 'textures', os.path.basename(im.filepath))
            if os.path.exists(cand):
                im.filepath = cand
    return dst.objects

def place(src, loc, scale=1.0, rot=None):
    o = bpy.data.objects.new(src.name + '_inst', src.data)   # linked duplicate: shares mesh
    o.location = loc; o.scale = (scale,) * 3
    o.rotation_euler = (0, 0, rot if rot is not None else random.uniform(0, 2 * math.pi))
    site.objects.link(o)
    return o

tree = load_model('tree_small_02', ['tree_small_02_LOD1'])[0]
shrubs = load_model('shrub_02', ['shrub_02_a_LOD1', 'shrub_02_b_LOD1', 'shrub_02_c_LOD1', 'shrub_02_d_LOD1'])
potted = load_model('potted_plant_04', ['potted_plant_04_dirt', 'potted_plant_04_pot'])
leafy = load_model('shrub_04', ['shrub_04_c_LOD1', 'shrub_04_d_LOD1'])
grass_objs = load_model('grass_medium_01', [f'grass_medium_01_{s}_LOD1' for s in
                        ('large_a', 'large_b', 'large_c', 'mid_a', 'mid_b', 'mid_c', 'small_a', 'tall_a', 'tall_b')])

# street trees framing the house, on the footpath edge
place(tree, P(7, 0.45, -7.2), 1.55, math.radians(30))
place(tree, P(63, 0.45, -7.2), 1.4, math.radians(200))
place(tree, P(-14, 0, 62), 1.7)
# planters at the apron corners & shrubs in front of the neighbours
planter_mat = pbr('Planter', 'concrete_floor', 1.0, tint=(0.35, 0.33, 0.31))
for x in (18.2, 51.0):
    box_ft(x - 1, x + 1, 0.47, 2.3, -2.2, -0.2, planter_mat)
    place(random.choice(shrubs), P(x, 2.2, -1.2), 1.1)
for i, x in enumerate(range(1, 16, 3)):
    place(shrubs[i % 4], P(x + random.uniform(-.5, .5), 0.3, -3.4), random.uniform(0.9, 1.2))
for x in range(56, 74, 3):
    place(shrubs[x % 4], P(x, 0.3, -2.2), random.uniform(0.8, 1.1))
# potted plants on the balcony
def pot(x, z, s=4.5):
    for o in potted:
        place(o, P(x, 10.5, z), s, 0.7)
    place(random.choice(leafy), P(x, 10.5 + 0.16 * s / FT * 0.85, z), 4.2)
for x in (18.3, 26.8, 38.2, 51.2):
    pot(x, -3.2)
# grass tufts scattered on the verges (in front of the neighbours and the side strip)
def scatter_grass(x1, x2, z1, z2, n, y=0.0):
    for _ in range(n):
        o = place(random.choice(grass_objs), P(random.uniform(x1, x2), y, random.uniform(z1, z2)),
                  random.uniform(1.2, 2.2))
scatter_grass(0, 16.5, -4.9, -0.4, 420)
scatter_grass(53, 76, -4.9, 1.8, 520)
scatter_grass(-6, -0.5, 36, 45, 160)

# ---------------------------------------------------------------- lighting: real sky (HDRI) + sun
world = bpy.data.worlds.new('Sky'); scene.world = world; world.use_nodes = True
wn = world.node_tree.nodes; wl = world.node_tree.links
hdr = bpy.data.images.load(os.path.join(ASSETS, 'hdri', 'kloofendal_48d_partly_cloudy_puresky.hdr'))
env = wn.new('ShaderNodeTexEnvironment'); env.image = hdr
tc = wn.new('ShaderNodeTexCoord'); mp = wn.new('ShaderNodeMapping')
wl.new(tc.outputs['Generated'], mp.inputs['Vector']); wl.new(mp.outputs['Vector'], env.inputs['Vector'])
bg = wn['Background']; wl.new(env.outputs['Color'], bg.inputs['Color'])

# locate the sun in the HDRI (brightest pixel) and rotate the sky so it sits south-west,
# raking across the front facade
import numpy as np
w, h = hdr.size
px = np.empty(w * h * 4, dtype=np.float32); hdr.pixels.foreach_get(px)
lum = px.reshape(h, w, 4)[..., :3].sum(axis=2)
vy, ux = np.unravel_index(np.argmax(lum), lum.shape)
u, v = (ux + 0.5) / w, (vy + 0.5) / h
sun_el = (v - 0.5) * math.pi
hdr_az = -(u - 0.5) * 2 * math.pi              # blender equirect: u = -atan2(d.y, d.x) / 2pi + 0.5
want_az = math.atan2(0.75, 0.55)               # towards +Y (south) and +X (west)
mp.inputs['Rotation'].default_value[2] = hdr_az - want_az
print(f'HDRI sun elevation {math.degrees(sun_el):.1f} deg, rotated {math.degrees(hdr_az - want_az):.1f} deg')
bg.inputs['Strength'].default_value = 1.0

# warm interior lights behind the front glass (lived-in look)
def room_light(x, y, z, power=45, size=1.5):
    l = bpy.data.lights.new('Room', 'AREA'); l.energy = power; l.size = size * FT * 3; l.color = (1.0, 0.78, 0.55)
    o = bpy.data.objects.new('Room', l); o.location = P(x, y, z)
    o.visible_camera = False; o.visible_transmission = False; o.visible_glossy = False
    scene.collection.objects.link(o)
for (x, y, z) in [(22, 9.5, 6), (45, 9.5, 7), (22, 19.8, 7), (32.5, 19.8, 8), (45, 19.8, 7)]:
    room_light(x, y, z)

# ---------------------------------------------------------------- camera
cam = bpy.data.cameras.new('Cam'); co = bpy.data.objects.new('Cam', cam); scene.collection.objects.link(co)
scene.camera = co
cam.sensor_width = 36
if CAM == 'corner':
    eye, look, cam.lens, shift = P(68, 5.2, -42), P(34, 5.2, 12), 22, 0.18
else:
    eye, look, cam.lens, shift = P(35, 5.2, -50), P(35, 5.2, 0), 24, 0.19
co.location = eye
co.rotation_euler = (look - eye).to_track_quat('-Z', 'Y').to_euler()   # level camera -> straight verticals
cam.shift_y = shift
cam.dof.use_dof = True; cam.dof.focus_distance = (eye - P(35, 8, 0)).length; cam.dof.aperture_fstop = 8

# ---------------------------------------------------------------- render settings
scene.render.engine = 'CYCLES'
prefs = bpy.context.preferences.addons['cycles'].preferences
try:
    prefs.compute_device_type = 'METAL'; prefs.get_devices()
    for dv in prefs.devices: dv.use = True
    scene.cycles.device = 'GPU'
except Exception as e:
    print('GPU unavailable, using CPU:', e)
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 8
scene.cycles.transparent_max_bounces = 16
scene.render.resolution_x, scene.render.resolution_y = RES
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.filepath = OUT
for vt in ('AgX', 'Filmic'):
    try:
        scene.view_settings.view_transform = vt; break
    except Exception:
        pass
for look in ('AgX - Medium High Contrast', 'Medium High Contrast'):
    try:
        scene.view_settings.look = look; break
    except Exception:
        pass
scene.view_settings.exposure = float(arg('--exposure', '0'))

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, 'duplex_scene.blend'))
bpy.ops.render.render(write_still=True)
print('RENDERED', OUT)
