"""V1 — Blender extras for the photo-real renders.

Loaded by render/build_scene.py --design v1. Everything the shared pipeline defines is available here
as a global when the hooks run (P, FT, MAT, glass, box_ft, plane_ft, cube, curtain, tank, load_model,
place, place_group, scatter_grass, room_light, pbr, principled, lamp_glow, paving, leafy, shrubs, potted,
col, scene, CAM, arg, ...). Coordinates are the walkthrough's feet (see design.js).

Hooks:  CAMERAS, HOUSE_CENTER, material_for(), skip(), build(), lights(cam)
"""
import math, random
from mathutils import Vector

# camera name -> eye, look-at (feet; eye and look share a height so verticals stay straight),
# lens (mm), vertical lens shift, default exposure
CAMERAS = {
    'front':  dict(eye=(35, 5.2, -50), look=(35, 5.2, 0), lens=24, shift=0.19),
    'corner': dict(eye=(68, 5.2, -42), look=(34, 5.2, 12), lens=22, shift=0.18),
    'entry':  dict(eye=(-26, 5.3, 55), look=(0, 5.3, 31), lens=20, shift=0.16),     # from the side road
    'living': dict(eye=(22.0, 4.6, 44.0), look=(2, 4.6, 29.5), lens=16, shift=0.14, exposure=0.5),
}
HOUSE_CENTER = (26, 22.5)        # cladding faces pointing towards this get interior plaster


def material_for(k, x, y, z):
    """Override a walkthrough material key for one mesh (return None to keep it)."""
    if k == 'extWall' and abs(z) < 0.5 and y > 10.5:      # first-floor front wall -> terracotta
        return 'accent'
    return None


def skip(k, x, y, z):
    """Drop walkthrough meshes that the render replaces with better models."""
    if k == 'shutter':                                     # rolled-up shutter: modelled closed below
        return True
    in_living = -0.5 <= x <= 18 and 25 <= z <= 45 and y < 6 and not (x < 6 and z > 43)
    return in_living and k in ('fabric', 'fabric2', 'wood', 'dark')   # box furniture -> scanned furniture


def build():
    front()
    entrance()
    living_room()


def front():
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
    box_ft(16.7, 52.3, 24.2, 24.4, -0.35, 0.35, MAT['parapet'], col)     # coping on parapet
    # house number plate + wall lights either side of the garage
    box_ft(37.6, 38.6, 6.8, 7.5, -0.45, -0.38, MAT['brass'], col, bevel=0)
    for x in (27.3, 37.7):
        box_ft(x - 0.2, x + 0.2, 7.6, 8.3, -0.6, -0.38, lamp_glow, col, bevel=0)
    # sheer curtains: first-floor sliding doors drawn to the sides, kitchen & master windows
    for a, b in [(19, 25), (28.5, 36.5), (40, 50)]:
        w = b - a
        curtain(a + 0.1, a + w * 0.32, 10.6, 18.3, 0.8)
        curtain(b - w * 0.28, b - 0.1, 10.6, 18.3, 0.8)
    curtain(19.1, 21.5, 4.0, 7.4, 0.8, 8); curtain(40.1, 43.5, 4.0, 7.4, 0.8, 10); curtain(47, 49.9, 4.0, 7.4, 0.8, 9)
    tank(46, 36, 21.2 + 0.2)                                              # our own tank, set back on the roof
    # planters at the apron corners
    planter_mat = pbr('Planter', 'concrete_floor', 1.0, tint=(0.35, 0.33, 0.31))
    for x in (18.2, 51.0):
        box_ft(x - 1, x + 1, 0.47, 2.3, -2.2, -0.2, planter_mat)
        place(random.choice(shrubs), P(x, 2.2, -1.2), 1.1)
    # potted plants on the balcony
    for x in (18.3, 26.8, 38.2, 51.2):
        s = 4.5
        for o in potted:
            place(o, P(x, 10.5, -3.2), s, 0.7)
        place(random.choice(leafy), P(x, 10.5 + 0.16 * s / FT * 0.85, -3.2), 4.2)


def entrance():
    """Main door on the east wall (side road)."""
    teak = MAT['teak']
    black_metal = MAT['black_metal']
    # teak pivot door, swung ~55 degrees into the living room
    a = math.radians(55)
    hinge = Vector((0.0, 31.15))
    c = hinge + 1.85 * Vector((math.sin(a), math.cos(a)))
    door = cube('MainDoor', P(c.x, 0.5 + 3.75, c.y), (0.18 * FT, 3.7 * FT, 7.5 * FT), teak, bevel=0.004)
    door.rotation_euler[2] = a
    hx = hinge + 3.3 * Vector((math.sin(a), math.cos(a)))
    cube('DoorPull', P(hx.x - 0.2 * math.cos(a), 4.2, hx.y + 0.2 * math.sin(a)), (0.08 * FT, 0.08 * FT, 3.0 * FT), MAT['brass'], bevel=0)
    # door frame
    box_ft(-0.4, 0.4, 0.5, 8.2, 30.8, 31.05, teak, col); box_ft(-0.4, 0.4, 0.5, 8.2, 34.95, 35.2, teak, col)
    box_ft(-0.4, 0.4, 7.95, 8.2, 30.8, 35.2, teak, col)
    # canopy, steps, lamps, name plate
    box_ft(-4.2, 0, 8.9, 9.4, 29.6, 36.4, MAT['slab'], col)
    box_ft(-3.2, 0, 0, 0.25, 30.3, 35.7, MAT['plinth'], col)
    box_ft(-1.6, 0, 0.25, 0.5, 30.3, 35.7, MAT['plinth'], col)
    for zz in (30.2, 35.8):
        box_ft(-0.6, -0.38, 6.6, 7.4, zz - 0.2, zz + 0.2, lamp_glow, col, bevel=0)
    box_ft(-0.45, -0.38, 5.0, 5.6, 36.0, 37.4, MAT['brass'], col, bevel=0)
    # low compound wall along the side road, with an open pedestrian gate at the path
    cw = pbr('CompoundWall', 'painted_plaster_wall', 2.0, tint=(0.78, 0.75, 0.69), normal=0.4)
    box_ft(-4.8, -4.3, 0, 3.6, 22.0, 30.2, cw); box_ft(-4.8, -4.3, 0, 3.6, 35.8, 47.0, cw)
    box_ft(-4.95, -4.15, 3.6, 3.8, 22.0, 30.2, MAT['plinth']); box_ft(-4.95, -4.15, 3.6, 3.8, 35.8, 47.0, MAT['plinth'])
    for zz in (30.2, 35.8):
        box_ft(-5.0, -4.1, 0, 4.4, zz - 0.45 if zz < 33 else zz, zz if zz < 33 else zz + 0.45, cw)
    for i in range(9):                       # open gate leaf, swung back against the wall
        box_ft(-4.2 + 0.05, -4.2 + 0.12, 0.3, 3.9, 30.2 - 0.6 - i * 0.55, 30.2 - 0.55 - i * 0.55, black_metal, bevel=0)
    box_ft(-4.18, -4.0, 0.3, 0.45, 25.2, 30.0, black_metal, bevel=0); box_ft(-4.18, -4.0, 3.75, 3.9, 25.2, 30.0, black_metal, bevel=0)
    plane_ft(-4.3, 0, 30.3, 35.7, 0.09, paving)   # path from gate to door
    # plants flanking the entrance
    pb = load_model('planter_box_01', ['planter_box_01'])
    place_group(pb, P(-1.6, 0.06, 28.3), 1.0, math.radians(90))
    place_group(pb, P(-1.6, 0.06, 38.0), 1.0, math.radians(90))
    for zz in (27.0, 28.3, 29.4, 36.9, 38.0, 39.2):
        place(random.choice(leafy), P(-1.6, 0.06 + 1.35, zz), random.uniform(3.2, 4.2))
    scatter_grass(-4.1, -0.5, 22.3, 29.8, 120)
    scatter_grass(-4.1, -0.5, 39.5, 44.8, 90)
    scatter_grass(-6, -0.5, 36, 45, 160)


def living_room():
    """Scanned furniture in the double-height living (replaces the walkthrough's boxes)."""
    L0 = 0.5
    teak, black_metal = MAT['teak'], MAT['black_metal']
    sofa = load_model('sofa_02', ['sofa_02_Base', 'sofa_02_Seat'])
    chair = load_model('modern_arm_chair_01', ['modern_arm_chair_01'])
    ctable = load_model('modern_coffee_table_01', ['modern_coffee_table_01'])
    stable = load_model('side_table_01', ['side_table_01'])
    bigplant = load_model('potted_plant_02', ['potted_plant_02_dirt', 'potted_plant_02_leaves', 'potted_plant_02_pot'])
    pillows = load_model('throw_pillows_01', ['throw_pillows_01_pillow01', 'throw_pillows_01_pillow02'])
    chand = load_model('Chandelier_03', ['Chandelier_03'])
    diya = load_model('brass_diya_lantern', ['brass_diya_lantern', 'brass_diya_lantern_chain', 'brass_diya_lantern_connection'])
    eleph = load_model('carved_wooden_elephant', ['carved_wooden_elephant'])
    frame = load_model('hanging_picture_frame_01', ['hanging_picture_frame_01'])
    place_group(sofa, P(9.5, L0, 27.2), 1.25, math.pi)       # models face -Y (towards the road) by default
    place_group(pillows, P(9.5, L0 + 1.6, 27.0), 1.0, math.pi)
    place_group(chair, P(15.2, L0, 32.0), 1.0, -math.pi / 2)
    place_group(chair, P(15.2, L0, 36.0), 1.0, -math.pi / 2)
    place_group(ctable, P(9.5, L0, 33.0), 1.15, 0)
    place_group(stable, P(3.2, L0, 27.2), 1.0, 0)
    place_group(eleph, P(3.2, L0 + 1.85, 27.2), 2.0, math.radians(30))
    place_group(stable, P(15.8, L0, 27.2), 1.0, 0)
    place_group(bigplant, P(1.8, L0, 24.2), 2.2, 0)
    place_group(bigplant, P(15.8, L0, 43.5), 1.8, 1.0)
    place_group(frame, P(8.5, 6.0, 22.45), 1.6, math.pi)      # on the terracotta wall's inner face
    place_group(chand, P(9.0, 13.5, 33.5), 1.5, 0)             # pendant in the double height
    box_ft(8.95, 9.05, 14.9, 20.5, 33.45, 33.55, black_metal, col, bevel=0)   # drop rod to roof
    place_group(diya, P(3.0, 6.2, 42.6), 2.0, 0)                # brass diya lantern in the pooja
    rug = principled('Rug', (0.55, 0.45, 0.35), rough=1.0, **{'Sheen Weight': 0.6})
    plane_ft(4.5, 14.5, 29.5, 37.0, L0 + 0.06, rug, col)
    box_ft(8, 16, L0, L0 + 1.6, 43.8, 44.6, teak, col)          # low console under the north glass


def lights(cam):
    # warm lights behind the front glass (lived-in look)
    for (x, y, z) in [(22, 9.5, 6), (45, 9.5, 7), (22, 19.8, 7), (32.5, 19.8, 8), (45, 19.8, 7)]:
        room_light(x, y, z)
    if cam == 'living':
        for (x, y, z) in [(8, 20.2, 28), (8, 20.2, 38), (22, 9.8, 34), (22, 9.8, 40)]:
            room_light(x, y, z, power=140, size=2.5)
        point_light(9.0, 14.5, 33.5, 60, soft=0.3)              # chandelier
    if cam == 'entry':
        for zz in (30.2, 35.8):
            point_light(-0.9, 7.0, zz, 25, soft=0.1)            # door lamps
