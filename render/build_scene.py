"""Build a photo-real Blender scene of the duplex from house_geometry.json and render the front.

Run:  /Applications/Blender.app/Contents/MacOS/Blender -b -P render/build_scene.py -- \
        --samples 256 --res 1920x1200 --out render/front.png [--cam front|corner]

Geometry comes from duplex-3d.html (feet, three.js axes: +x west, +y up, +z north).
Blender axes here: +X west, +Y south (towards the road), +Z up, metres.
"""
import bpy, bmesh, json, math, os, sys
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
def arg(name, default):
    return argv[argv.index(name) + 1] if name in argv else default
SAMPLES = int(arg('--samples', '256'))
RES = [int(v) for v in arg('--res', '1920x1200').split('x')]
OUT = os.path.abspath(arg('--out', 'render/front.png'))
CAM = arg('--cam', 'front')
HERE = os.path.dirname(os.path.abspath(__file__))

FT = 0.3048
def P(x, y, z):            # three.js feet -> blender metres
    return Vector((x * FT, -z * FT, y * FT))

# ---------------------------------------------------------------- reset
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
col = bpy.data.collections.new('Duplex'); scene.collection.children.link(col)
site = bpy.data.collections.new('Site'); scene.collection.children.link(site)

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

def add_noise_bump(m, scale=40.0, strength=0.08, color_var=None, detail=8.0):
    """Plaster-like micro bump and optional colour variation."""
    nt = m.node_tree; b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord')
    nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = scale; nz.inputs['Detail'].default_value = detail
    nt.links.new(tc.outputs['Object'], nz.inputs['Vector'])
    bump = nt.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = strength
    nt.links.new(nz.outputs['Fac'], bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
    if color_var:
        ramp = nt.nodes.new('ShaderNodeValToRGB')
        ramp.color_ramp.elements[0].color = (*color_var[0], 1)
        ramp.color_ramp.elements[1].color = (*color_var[1], 1)
        nz2 = nt.nodes.new('ShaderNodeTexNoise'); nz2.inputs['Scale'].default_value = scale / 12
        nt.links.new(tc.outputs['Object'], nz2.inputs['Vector'])
        nt.links.new(nz2.outputs['Fac'], ramp.inputs['Fac'])
        nt.links.new(ramp.outputs['Color'], b.inputs['Base Color'])
    return m

def cladding(name):
    """Terracotta tile cladding for the double-height east wing / accents."""
    m = principled(name, (0.45, 0.16, 0.08), rough=0.75)
    nt = m.node_tree; b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord')
    br = nt.nodes.new('ShaderNodeTexBrick')
    br.inputs['Scale'].default_value = 3.0
    br.inputs['Mortar Size'].default_value = 0.012
    br.inputs['Brick Width'].default_value = 0.9
    br.inputs['Row Height'].default_value = 0.12
    br.inputs['Color1'].default_value = (0.50, 0.18, 0.09, 1)
    br.inputs['Color2'].default_value = (0.38, 0.13, 0.06, 1)
    br.inputs['Mortar'].default_value = (0.55, 0.48, 0.42, 1)
    br.offset = 0.5
    nt.links.new(tc.outputs['Object'], br.inputs['Vector'])
    nt.links.new(br.outputs['Color'], b.inputs['Base Color'])
    bump = nt.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.25
    nt.links.new(br.outputs['Fac'], bump.inputs['Height'])
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
    m = principled('Shutter', (0.42, 0.44, 0.45), rough=0.4, metal=0.7)
    nt = m.node_tree; b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord')
    wv = nt.nodes.new('ShaderNodeTexWave'); wv.wave_type = 'BANDS'; wv.bands_direction = 'Z'
    wv.inputs['Scale'].default_value = 18
    nt.links.new(tc.outputs['Object'], wv.inputs['Vector'])
    bump = nt.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.4
    nt.links.new(wv.outputs['Fac'], bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
    return m

glass = principled('Glass', (0.85, 0.92, 0.95), rough=0.0, **{'Transmission Weight': 1.0, 'IOR': 1.5})
MAT = {
    'extWall': add_noise_bump(principled('Plaster', (0.80, 0.77, 0.71), rough=0.9), 30, 0.05,
                              [(0.78, 0.75, 0.69), (0.83, 0.80, 0.74)]),
    'parapet': add_noise_bump(principled('Parapet', (0.70, 0.67, 0.62), rough=0.9), 30, 0.05),
    'slab': add_noise_bump(principled('Slab', (0.82, 0.80, 0.76), rough=0.85), 30, 0.03),
    'wall': principled('InteriorWall', (0.80, 0.77, 0.72), rough=0.9),
    'accent': cladding('Terracotta'),
    'plinth': add_noise_bump(principled('Stone', (0.20, 0.19, 0.18), rough=0.7), 12, 0.2),
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
def floor_mat(hexcol):
    key = 'floor:' + hexcol
    if key not in MAT:
        c = tuple(int(hexcol[i:i + 2], 16) / 255 for i in (0, 2, 4))
        c = tuple(v ** 2.2 for v in c)            # sRGB -> linear
        MAT[key] = principled('Floor_' + hexcol, c, rough=0.35)
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
        # skip the rolled-up shutter box; we model the shutter closed below
        if k == 'shutter':
            continue
        bev = 0 if k in ('glass', 'frame') else 0.006
        # first-floor front wall (between the balcony openings) -> terracotta cladding
        if k == 'extWall' and abs(z) < 0.5 and y > 10.5:
            m = MAT['accent']
        cube(f'{k}_{i}', P(x, y, z), (w * FT, dd * FT, h * FT), m, bevel=bev)
    else:
        w, dd = d['s']
        cube(f'{k}_{i}', P(x, y, z), (w * FT, dd * FT, 0.004), m, bevel=0)

# closed rolling shutter over the garage opening + guide rails
box_ft(28, 37, 0.5, 8.5, -0.55, -0.4, MAT['shutter'], col, bevel=0)
box_ft(27.8, 28.1, 0.5, 8.6, -0.6, -0.35, MAT['frame'], col, bevel=0)
box_ft(36.9, 37.2, 0.5, 8.6, -0.6, -0.35, MAT['frame'], col, bevel=0)
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
# house number / wall light near garage
box_ft(37.6, 38.6, 6.8, 7.5, -0.45, -0.38, MAT['brass'], col, bevel=0)

# ---------------------------------------------------------------- site
grass = add_noise_bump(principled('Grass', (0.12, 0.20, 0.05), rough=0.95), 60, 0.3,
                       [(0.10, 0.17, 0.04), (0.17, 0.24, 0.07)])
asphalt = add_noise_bump(principled('Asphalt', (0.05, 0.05, 0.05), rough=0.85), 200, 0.15,
                         [(0.045, 0.045, 0.045), (0.07, 0.068, 0.065)])
paving = add_noise_bump(principled('Paving', (0.42, 0.39, 0.35), rough=0.8), 90, 0.1)
kerb = principled('Kerb', (0.55, 0.53, 0.50), rough=0.8)
paint = principled('RoadPaint', (0.8, 0.8, 0.75), rough=0.6)
neigh = add_noise_bump(principled('NeighbourPlaster', (0.62, 0.58, 0.52), rough=0.9), 30, 0.05,
                       [(0.58, 0.54, 0.48), (0.66, 0.62, 0.56)])
neigh2 = add_noise_bump(principled('NeighbourPlaster2', (0.70, 0.66, 0.58), rough=0.9), 30, 0.05)
darkwin = principled('NeighbourWindow', (0.02, 0.025, 0.03), rough=0.05, **{'Specular IOR Level': 0.8})

plane_ft(-400, 400, -400, 400, 0.0, grass)
plane_ft(-22, 120, -30, -9, 0.03, asphalt)             # main road (south)
plane_ft(-22, -6, -30, 120, 0.035, asphalt)            # side road (east)
box_ft(-6, 120, 0, 0.45, -9, -5, paving)               # footpath along main road
box_ft(-6, 120, 0, 0.5, -9.3, -9, kerb, bevel=0.01)
plane_ft(17, 52, -5, 0, 0.06, paving)                  # car apron
plane_ft(-6, 0, 22, 45, 0.06, paving)                  # entry strip
box_ft(-4, 0, 0, 0.25, 31, 35, paving)                 # door step
for x in range(-20, 120, 10):
    plane_ft(x, x + 5, -19.7, -19.3, 0.05, paint)

def neighbour(x1, x2, z1, z2, h, mat, front_windows=True, floors=1):
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

neighbour(0, 16.55, 0.2, 21.6, 21, neigh, floors=2)      # 2-storey neighbour in the SE cut-out
neighbour(54, 75, 2, 45, 11, neigh2)                      # single-storey west
neighbour(-60, -26, 5, 60, 31, neigh, front_windows=False)
neighbour(17, 52, 47, 70, 11, neigh2, front_windows=False)
neighbour(80, 110, 0, 40, 21, neigh, floors=2)
neighbour(-60, -30, -80, -40, 21, neigh2, front_windows=False)

# ---- vegetation (simple but convincing at this distance)
leaf = principled('Leaves', (0.06, 0.14, 0.03), rough=0.7, **{'Subsurface Weight': 0.2})
leaf2 = principled('Leaves2', (0.09, 0.17, 0.04), rough=0.7)
bark = principled('Bark', (0.10, 0.07, 0.05), rough=0.9)
pot = principled('Planter', (0.25, 0.23, 0.21), rough=0.8)
tex_leaf = bpy.data.textures.new('leafnoise', 'VORONOI'); tex_leaf.noise_scale = 0.25

def blob(name, center, r, mat, squash=1.0):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=4, radius=r, location=center)
    ob = bpy.context.active_object; ob.name = name
    for c in ob.users_collection: c.objects.unlink(ob)
    site.objects.link(ob)
    ob.scale.z = squash
    md = ob.modifiers.new('Disp', 'DISPLACE'); md.texture = tex_leaf; md.strength = r * 0.35
    ob.data.materials.append(mat)
    bpy.ops.object.shade_smooth() if bpy.context.active_object else None
    return ob

def tree(x, z, h=18, r=7):
    base = P(x, 0, z)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.35 * FT * 1.2, depth=h * 0.6 * FT, location=base + Vector((0, 0, h * 0.3 * FT)))
    t = bpy.context.active_object
    for c in t.users_collection: c.objects.unlink(t)
    site.objects.link(t); t.data.materials.append(bark)
    for dx, dz, dy, rr, m in [(0, 0, 0, 1.0, leaf), (2.5, 1, -1.5, .75, leaf2), (-2.5, -1, -1, .7, leaf2), (0.5, -2, 1.8, .6, leaf)]:
        blob('crown', P(x + dx, h * 0.72 + dy, z + dz), r * rr * FT, m, 0.85)

def planter(x, z, y=0.0, w=2.0, bush=1.6):
    box_ft(x - w / 2, x + w / 2, y, y + 1.8, z - w / 2, z + w / 2, pot)
    blob('bush', P(x, y + 1.8 + bush * 0.6, z), bush * FT, leaf2, 0.9)

tree(8, -7, 20, 8)
tree(62, -7, 17, 7)
tree(-14, 60, 22, 8)
planter(51, -1.2, 0.45)
planter(18, -1.2, 0.45, 1.6, 1.2)
planter(18.2, -3, 10.5, 1.4, 1.2)                         # balcony pots
planter(51, -3, 10.5, 1.4, 1.3)
for x in range(-4, 17, 3):                                # hedge by the entry strip / neighbour front
    blob('hedge', P(x, 1.2, -3.5), 1.6 * FT, leaf, 0.7)

# ---------------------------------------------------------------- lighting
world = bpy.data.worlds.new('Sky'); scene.world = world; world.use_nodes = True
wn = world.node_tree.nodes; wl = world.node_tree.links
sky = wn.new('ShaderNodeTexSky'); sky.sky_type = 'MULTIPLE_SCATTERING'
sun_el, sun_az = math.radians(28), math.radians(215)     # late afternoon, from the south-west
sky.sun_elevation = sun_el; sky.sun_rotation = sun_az; sky.sun_disc = False
bg = wn['Background']; bg.inputs['Strength'].default_value = 0.22
wl.new(sky.outputs['Color'], bg.inputs['Color'])

# Sun lamp: direction from house towards the sun (south-west & up)
to_sun = Vector((0.55, 0.75, math.tan(sun_el) * 0.93)).normalized()
sun = bpy.data.lights.new('Sun', 'SUN'); sun.energy = 3.2; sun.angle = math.radians(0.8)
sun.color = (1.0, 0.86, 0.70)
so = bpy.data.objects.new('Sun', sun); scene.collection.objects.link(so)
so.rotation_euler = (-to_sun).to_track_quat('-Z', 'Y').to_euler()

# warm interior lights behind the front glass
def room_light(x, y, z, power=60, size=1.5):
    l = bpy.data.lights.new('Room', 'AREA'); l.energy = power; l.size = size * FT * 3; l.color = (1.0, 0.78, 0.55)
    o = bpy.data.objects.new('Room', l); o.location = P(x, y, z); o.visible_camera = False; o.visible_transmission = False; o.visible_glossy = False; scene.collection.objects.link(o)
for (x, y, z) in [(22, 9.5, 6), (45, 9.5, 7), (22, 19.8, 7), (32.5, 19.8, 8), (45, 19.8, 7)]:
    room_light(x, y, z)

# ---------------------------------------------------------------- camera
cam = bpy.data.cameras.new('Cam'); co = bpy.data.objects.new('Cam', cam); scene.collection.objects.link(co)
scene.camera = co
cam.sensor_width = 36
if CAM == 'corner':
    eye, look, cam.lens, shift = P(66, 5.4, -40), P(34, 5.4, 12), 22, 0.18
else:
    eye, look, cam.lens, shift = P(33, 5.4, -46), P(33, 5.4, 0), 24, 0.2
co.location = eye
d = look - eye
co.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()   # level camera -> straight verticals
cam.shift_y = shift

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
scene.view_settings.exposure = -0.35

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, 'duplex_scene.blend'))
bpy.ops.render.render(write_still=True)
print('RENDERED', OUT)
