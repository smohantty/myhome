"""V2 — Blender extras for the photo-real renders (front entrance, side garage).

Loaded by render/build_scene.py --design v2; shared helpers (P, FT, MAT, box_ft, curtain, place_group, ...)
are injected as globals before the hooks run. Coordinates are the walkthrough's feet (see design.js).
"""
import math, random
from mathutils import Vector

CAMERAS = {
    'front':  dict(eye=(35, 5.2, -50), look=(35, 5.2, 0), lens=24, shift=0.19),
    'entry':  dict(eye=(22, 5.2, -21), look=(33, 5.2, 0), lens=22, shift=0.16),      # porch & front door
    'garage': dict(eye=(-26, 5.3, 50), look=(0, 5.3, 29), lens=20, shift=0.16),     # from the side road
    'living': dict(eye=(24.5, 4.6, 44.2), look=(2, 4.6, 35), lens=16, shift=0.14, exposure=0.5),
}
HOUSE_CENTER = (26, 22.5)


def material_for(k, x, y, z):
    if k == 'extWall' and abs(z) < 0.5 and y > 10.5:      # first-floor front wall -> terracotta
        return 'accent'
    return None


def skip(k, x, y, z):
    # box furniture in the double-height living -> scanned furniture (keep the pooja altar)
    in_living = -0.5 <= x <= 21 and 32 <= z <= 45 and y < 6 and not (x < 6 and z > 43)
    return in_living and k in ('fabric', 'fabric2', 'wood', 'dark')


def build():
    front()
    front_door()
    garage_side()
    living_room()


def front():
    # fully glaze the first-floor sliding doors (the walkthrough leaves half open)
    for a, b in [(19, 25), (28.5, 36.5), (40, 50)]:
        mid = (a + b) / 2
        box_ft(mid, b, 10.5, 18.5, -0.04, 0.04, glass, col, bevel=0)
        for x in (a, mid, b):
            box_ft(x - 0.12, x + 0.12, 10.5, 18.5, -0.1, 0.1, MAT['frame'], col, bevel=0)
    # roof canopy over the balcony, sunshades over the ground-floor windows, parapet coping
    box_ft(16.5, 52.5, 20.5, 21.2, -4.5, 0, MAT['slab'], col)
    box_ft(16.5, 52.5, 20.0, 22.2, -4.9, -4.5, MAT['slab'], col)
    box_ft(18.5, 25.5, 7.7, 8.0, -1.8, 0, MAT['slab'], col)
    box_ft(39.5, 50.5, 7.7, 8.0, -1.8, 0, MAT['slab'], col)
    box_ft(16.7, 52.3, 24.2, 24.4, -0.35, 0.35, MAT['parapet'], col)
    # curtains
    for a, b in [(19, 25), (28.5, 36.5), (40, 50)]:
        w = b - a
        curtain(a + 0.1, a + w * 0.32, 10.6, 18.3, 0.8)
        curtain(b - w * 0.28, b - 0.1, 10.6, 18.3, 0.8)
    curtain(19.1, 21.5, 4.0, 7.4, 0.8, 8); curtain(40.1, 43.5, 4.0, 7.4, 0.8, 10); curtain(47, 49.9, 4.0, 7.4, 0.8, 9)
    tank(46, 36, 21.2 + 0.2)
    # potted plants on the balcony
    for x in (18.3, 26.8, 45.5, 51.2):
        s = 4.5
        for o in potted:
            place(o, P(x, 10.5, -3.2), s, 0.7)
        place(random.choice(leafy), P(x, 10.5 + 0.16 * s / FT * 0.85, -3.2), 4.2)
    # low front compound wall on the plot line with a pedestrian gate at the path
    cw = pbr('CompoundWall', 'painted_plaster_wall', 2.0, tint=(0.78, 0.75, 0.69), normal=0.4)
    for a, b in [(16.8, 29.6), (35.4, 52.2)]:
        box_ft(a, b, 0.45, 3.9, -5.3, -4.8, cw)
        box_ft(a - 0.1, b + 0.1, 3.9, 4.1, -5.4, -4.7, MAT['plinth'])
    for x in (29.6, 35.4):                                   # gate pillars with lamps
        box_ft(x - 0.45 if x < 32 else x, x if x < 32 else x + 0.45, 0.45, 4.8, -5.45, -4.65, cw)
        box_ft(x - 0.4 if x < 32 else x + 0.05, x - 0.05 if x < 32 else x + 0.4, 4.8, 5.3, -5.4, -4.7, lamp_glow, bevel=0)
    for i in range(8):                                       # gate leaf swung open inwards
        box_ft(29.6 - 0.04, 29.6 + 0.04, 0.8, 4.0, -4.6 + i * 0.6, -4.55 + i * 0.6, MAT['black_metal'], bevel=0)
    # garden beds either side of the path, behind the wall
    planter_mat = pbr('Planter', 'concrete_floor', 1.0, tint=(0.35, 0.33, 0.31))
    for a, b in [(17.4, 28.4), (36.6, 51.6)]:
        box_ft(a, b, 0.45, 1.3, -4.6, -2.6, planter_mat)
        for x in range(int(a) + 1, int(b), 2):
            place(random.choice(shrubs), P(x + 0.3, 1.2, -3.6), random.uniform(0.55, 0.75))


def front_door():
    """Teak pivot door in the middle of the front, under the balcony (porch)."""
    teak = MAT['teak']
    a = math.radians(50)                                 # swung into the foyer
    hinge = Vector((30.65, 0.0))
    d = Vector((math.cos(a), math.sin(a)))
    c = hinge + 1.85 * d
    door = cube('MainDoor', P(c.x, 0.5 + 3.75, c.y), (3.7 * FT, 0.18 * FT, 7.5 * FT), teak, bevel=0.004)
    door.rotation_euler[2] = -a
    hx = hinge + 3.3 * d
    cube('DoorPull', P(hx.x + 0.2 * math.sin(a), 4.2, hx.y - 0.2 * math.cos(a)), (0.08 * FT, 0.08 * FT, 3.0 * FT), MAT['brass'], bevel=0)
    # frame, porch lamps either side of the side-lights, name plate, door mat
    box_ft(30.3, 30.55, 0.5, 8.2, -0.4, 0.4, teak, col); box_ft(34.45, 34.7, 0.5, 8.2, -0.4, 0.4, teak, col)
    box_ft(30.3, 34.7, 7.95, 8.2, -0.4, 0.4, teak, col)
    for x in (27.6, 37.4):
        box_ft(x - 0.2, x + 0.2, 6.6, 7.4, -0.6, -0.38, lamp_glow, col, bevel=0)
    box_ft(37.8, 39.2, 5.0, 5.6, -0.45, -0.38, MAT['brass'], col, bevel=0)
    box_ft(31.0, 34.0, 0.47, 0.5, -2.2, -0.6, MAT['plinth'], col, bevel=0)
    plane_ft(30.0, 35.0, -5.0, -0.2, 0.5, paving, col)                  # path from the gate
    # a scanned plant either side of the door
    bigplant = load_model('potted_plant_02', ['potted_plant_02_dirt', 'potted_plant_02_leaves', 'potted_plant_02_pot'])
    place_group(bigplant, P(28.9, 0.47, -1.2), 1.6, 0.3)
    place_group(bigplant, P(36.1, 0.47, -1.2), 1.6, 2.0)


def garage_side():
    """East side: garage off the side road, terrace above, living behind."""
    box_ft(-1.0, -0.35, 8.5, 9.3, 23.2, 31.8, MAT['frame'], col, bevel=0.004)          # shutter hood
    box_ft(-0.6, -0.35, 0.5, 8.6, 23.1, 23.4, MAT['frame'], col, bevel=0)
    box_ft(-0.6, -0.35, 0.5, 8.6, 31.6, 31.9, MAT['frame'], col, bevel=0)
    box_ft(-0.6, -0.38, 7.6, 8.3, 32.3, 32.7, lamp_glow, col, bevel=0)
    plane_ft(-6, 0, 22.2, 33, 0.08, paving)                             # driveway
    # compound wall along the side road beside the living, planters under the tall glass
    cw = pbr('CompoundWall2', 'painted_plaster_wall', 2.0, tint=(0.78, 0.75, 0.69), normal=0.4)
    box_ft(-4.8, -4.3, 0, 3.6, 33.5, 47.0, cw); box_ft(-4.95, -4.15, 3.6, 3.8, 33.5, 47.0, MAT['plinth'])
    box_ft(-5.0, -4.1, 0, 4.4, 33.0, 33.5, cw)
    pb = load_model('planter_box_01', ['planter_box_01'])
    for zz in (36.5, 41.5):
        place_group(pb, P(-1.6, 0.06, zz), 1.0, math.radians(90))
    for zz in (35.4, 36.6, 37.8, 40.4, 41.6, 42.8):
        place(random.choice(leafy), P(-1.6, 0.06 + 1.35, zz), random.uniform(3.2, 4.2))
    scatter_grass(-4.1, -0.5, 33.8, 44.8, 150)
    # planters on the terrace
    for x, z in [(1.5, 23.2), (15.2, 23.2), (1.5, 31.8)]:
        for o in potted:
            place(o, P(x, 10.5, z), 4.5, 0.7)
        place(random.choice(leafy), P(x, 10.5 + 0.16 * 4.5 / FT * 0.85, z), 4.2)


def living_room():
    """Scanned furniture in the double-height living (NE wing, behind the garage)."""
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
    place_group(sofa, P(9.5, L0, 35.4), 1.25, math.pi)        # faces north, towards the console & glass
    place_group(pillows, P(9.5, L0 + 1.6, 35.2), 1.0, math.pi)
    place_group(chair, P(16.0, L0, 38.0), 1.0, -math.pi / 2)
    place_group(chair, P(16.0, L0, 41.3), 1.0, -math.pi / 2)
    place_group(ctable, P(9.5, L0, 40.0), 1.15, 0)
    place_group(stable, P(3.4, L0, 35.4), 1.0, 0)
    place_group(eleph, P(3.4, L0 + 1.85, 35.4), 2.0, math.radians(30))
    place_group(stable, P(15.6, L0, 35.0), 1.0, 0)
    place_group(bigplant, P(1.6, L0, 34.4), 2.0, 0)
    place_group(bigplant, P(16.0, L0, 34.2), 1.8, 1.0)
    place_group(frame, P(9.5, 7.5, 33.45), 1.6, math.pi)      # on the wall towards the garage
    place_group(chand, P(9.0, 13.5, 39.0), 1.5, 0)
    box_ft(8.95, 9.05, 14.9, 20.5, 38.95, 39.05, black_metal, col, bevel=0)
    place_group(diya, P(3.0, 6.2, 42.6), 2.0, 0)
    rug = principled('Rug', (0.55, 0.45, 0.35), rough=1.0, **{'Sheen Weight': 0.6})
    plane_ft(5.0, 14.0, 37.2, 43.0, L0 + 0.06, rug, col)
    box_ft(8, 16, L0, L0 + 1.6, 43.8, 44.6, teak, col)          # low console under the north glass


def lights(cam):
    for (x, y, z) in [(22, 9.5, 6), (45, 9.5, 7), (32.5, 9.5, 5), (22, 19.8, 7), (32.5, 19.8, 8), (45, 19.8, 7)]:
        room_light(x, y, z)
    if cam == 'living':
        for (x, y, z) in [(8, 20.2, 36), (8, 20.2, 42), (22, 9.8, 30), (22, 9.8, 40)]:
            room_light(x, y, z, power=140, size=2.5)
        point_light(9.0, 14.5, 39.0, 60, soft=0.3)
    if cam == 'entry':
        for x in (27.6, 37.4):
            point_light(x, 7.0, -0.9, 25, soft=0.1)
    if cam == 'garage':
        point_light(-0.9, 8.0, 32.5, 20, soft=0.1)
