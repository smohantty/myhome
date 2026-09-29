"""V3 — Blender extras for the photo-real renders (sketch layout, mountain-facing entrance).

Loaded by render/build_scene.py --design v3; shared helpers (P, FT, MAT, box_ft, curtain, place_group, ...)
are injected as globals before the hooks run. Coordinates are the walkthrough's feet (see design.js).
The side-road (east) side is deliberately left plain: no lights, planters or cladding there.
"""
import math, random
from mathutils import Vector

CAMERAS = {
    'front':  dict(eye=(34.5, 5.2, -50), look=(34.5, 5.2, 0), lens=24, shift=0.19),
    'entry':  dict(eye=(21, 5.2, -21), look=(31.5, 5.2, 0), lens=22, shift=0.16),     # porch & front door
    'side':   dict(eye=(-26, 5.3, 52), look=(0, 5.3, 30), lens=20, shift=0.16),      # closed side-road wall
    'living': dict(eye=(36.6, 4.6, 44.2), look=(17, 4.6, 26), lens=16, shift=0.14, exposure=0.5),
}
HOUSE_CENTER = (30, 22.5)


def material_for(k, x, y, z):
    if k == 'extWall' and abs(z) < 0.5 and y > 10.5:      # first-floor front wall -> terracotta
        return 'accent'
    return None


def skip(k, x, y, z):
    # box furniture in the living -> scanned furniture (keep the pooja altar)
    in_living = 22 <= x <= 38 and 33 <= z <= 45 and y < 6 and not (x < 23 and z > 43)
    return in_living and k in ('fabric', 'fabric2', 'wood', 'dark')


def build():
    front()
    front_door()
    side_road()
    living_room()


def front():
    for a, b in [(19, 26), (29, 37), (40, 50)]:            # glaze the balcony sliders fully
        mid = (a + b) / 2
        box_ft(mid, b, 10.5, 18.5, -0.04, 0.04, glass, col, bevel=0)
        for x in (a, mid, b):
            box_ft(x - 0.12, x + 0.12, 10.5, 18.5, -0.1, 0.1, MAT['frame'], col, bevel=0)
    # roof canopy over the balcony, sunshade over the bedroom window, parapet coping
    box_ft(16.5, 52.5, 20.5, 21.2, -4.5, 0, MAT['slab'], col)
    box_ft(16.5, 52.5, 20.0, 22.2, -4.9, -4.5, MAT['slab'], col)
    box_ft(36.5, 50.5, 8.2, 8.5, -1.8, 0, MAT['slab'], col)
    box_ft(16.7, 52.3, 24.2, 24.4, -0.35, 0.35, MAT['parapet'], col)
    # garage shutter rails + hood
    box_ft(17.8, 27.2, 8.5, 9.3, -1.0, -0.35, MAT['frame'], col, bevel=0.004)
    box_ft(17.8, 18.1, 0.5, 8.6, -0.6, -0.35, MAT['frame'], col, bevel=0)
    box_ft(26.9, 27.2, 0.5, 8.6, -0.6, -0.35, MAT['frame'], col, bevel=0)
    # curtains
    for a, b in [(19, 26), (29, 37), (40, 50)]:
        w = b - a
        curtain(a + 0.1, a + w * 0.32, 10.6, 18.3, 0.8)
        curtain(b - w * 0.28, b - 0.1, 10.6, 18.3, 0.8)
    curtain(37.1, 40.5, 2.6, 7.9, 0.8, 10); curtain(46.5, 49.9, 2.6, 7.9, 0.8, 10)
    tank(46, 38, 21.2 + 0.2)
    for x in (18.3, 27.5, 38.2, 51.2):                     # potted plants on the balcony
        for o in potted:
            place(o, P(x, 10.5, -3.2), 4.5, 0.7)
        place(random.choice(leafy), P(x, 10.5 + 0.16 * 4.5 / FT * 0.85, -3.2), 4.2)
    # front compound wall: open car gate at the garage, pedestrian gate at the door
    cw = pbr('CompoundWall', 'painted_plaster_wall', 2.0, tint=(0.78, 0.75, 0.69), normal=0.4)
    for a, b in [(34.6, 52.2)]:
        box_ft(a, b, 0.45, 3.9, -5.3, -4.8, cw)
        box_ft(a - 0.1, b + 0.1, 3.9, 4.1, -5.4, -4.7, MAT['plinth'])
    for x in (16.6, 27.8, 28.8, 34.6):                     # gate pillars
        box_ft(x, x + 0.8, 0.45, 4.8, -5.45, -4.65, cw)
    for x in (28.8, 34.6):                                 # pillar lamps at the pedestrian gate
        box_ft(x + 0.1, x + 0.7, 4.8, 5.3, -5.4, -4.7, lamp_glow, bevel=0)
    for i in range(8):                                     # pedestrian gate leaf, swung open
        box_ft(29.6 - 0.04, 29.6 + 0.04, 0.8, 4.0, -4.6 + i * 0.6, -4.55 + i * 0.6, MAT['black_metal'], bevel=0)
    planter_mat = pbr('Planter', 'concrete_floor', 1.0, tint=(0.35, 0.33, 0.31))
    box_ft(35.4, 51.6, 0.45, 1.3, -4.6, -2.6, planter_mat)
    for x in range(36, 51, 2):
        place(random.choice(shrubs), P(x + 0.3, 1.2, -3.6), random.uniform(0.55, 0.75))


def front_door():
    """Teak pivot door between the garage and the front bedroom, under the balcony."""
    teak = MAT['teak']
    a = math.radians(50)
    hinge = Vector((29.65, 0.0))
    d = Vector((math.cos(a), math.sin(a)))
    c = hinge + 1.6 * d
    door = cube('MainDoor', P(c.x, 0.5 + 3.75, c.y), (3.2 * FT, 0.18 * FT, 7.5 * FT), teak, bevel=0.004)
    door.rotation_euler[2] = -a
    hx = hinge + 2.9 * d
    cube('DoorPull', P(hx.x + 0.2 * math.sin(a), 4.2, hx.y - 0.2 * math.cos(a)), (0.08 * FT, 0.08 * FT, 3.0 * FT), MAT['brass'], bevel=0)
    box_ft(29.25, 29.5, 0.5, 8.2, -0.4, 0.4, teak, col); box_ft(33.0, 33.2, 0.5, 8.2, -0.4, 0.4, teak, col)
    box_ft(29.25, 33.2, 7.95, 8.2, -0.4, 0.4, teak, col)
    box_ft(28.35, 29.0, 6.6, 7.4, -0.6, -0.38, lamp_glow, col, bevel=0)      # porch lamps
    box_ft(34.1, 34.5, 6.6, 7.4, -0.6, -0.38, lamp_glow, col, bevel=0)
    box_ft(35.0, 36.4, 5.0, 5.6, -0.45, -0.38, MAT['brass'], col, bevel=0)   # name plate
    box_ft(29.8, 32.8, 0.47, 0.5, -2.2, -0.6, MAT['plinth'], col, bevel=0)   # door mat
    plane_ft(29.0, 34.0, -5.0, -0.2, 0.5, paving, col)
    bigplant = load_model('potted_plant_02', ['potted_plant_02_dirt', 'potted_plant_02_leaves', 'potted_plant_02_pot'])
    place_group(bigplant, P(34.6, 0.47, -1.2), 1.6, 2.0)


def side_road():
    """Plain, closed side: just a low boundary wall along the side road."""
    cw = pbr('CompoundWall2', 'painted_plaster_wall', 2.0, tint=(0.78, 0.75, 0.69), normal=0.4)
    box_ft(-4.8, -4.3, 0, 3.6, 22.0, 47.0, cw)
    box_ft(-4.95, -4.15, 3.6, 3.8, 22.0, 47.0, MAT['plinth'])
    # terrace life (behind the solid parapet, only tree tops peek over)
    for x, z in [(1.5, 23.2), (15.2, 44), (1.5, 44)]:
        for o in potted:
            place(o, P(x, 10.5, z), 4.5, 0.7)
        place(random.choice(leafy), P(x, 10.5 + 0.16 * 4.5 / FT * 0.85, z), 4.2)


def living_room():
    """Scanned furniture in the double-height living."""
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
    place_group(sofa, P(28.5, L0, 35.3), 1.25, math.pi)        # faces north, to the tall glass
    place_group(pillows, P(28.5, L0 + 1.6, 35.1), 1.0, math.pi)
    place_group(chair, P(35.8, L0, 38.0), 1.0, -math.pi / 2)
    place_group(chair, P(35.8, L0, 41.3), 1.0, -math.pi / 2)
    place_group(ctable, P(28.5, L0, 39.8), 1.15, 0)
    place_group(stable, P(24.0, L0, 35.3), 1.0, 0)
    place_group(eleph, P(24.0, L0 + 1.85, 35.3), 2.0, math.radians(30))
    place_group(bigplant, P(36.5, L0, 34.3), 1.8, 1.0)
    place_group(bigplant, P(24.2, L0, 44.0), 1.8, 0.2)
    place_group(frame, P(17.45, 6.0, 41.5), 1.6, math.pi / 2)  # on the store wall, facing into the living
    place_group(chand, P(23.5, 13.5, 39.0), 1.5, 0)
    box_ft(23.45, 23.55, 14.9, 20.5, 38.95, 39.05, black_metal, col, bevel=0)
    place_group(diya, P(20.0, 6.2, 42.6), 2.0, 0)
    rug = principled('Rug', (0.55, 0.45, 0.35), rough=1.0, **{'Sheen Weight': 0.6})
    plane_ft(24.0, 33.0, 37.0, 42.8, L0 + 0.06, rug, col)
    box_ft(30.5, 37.5, L0, L0 + 1.6, 43.8, 44.6, teak, col)


def lights(cam):
    for (x, y, z) in [(45, 9.5, 7), (31, 9.5, 5), (22, 19.8, 7), (33, 19.8, 8), (45, 19.8, 7)]:
        room_light(x, y, z)
    if cam == 'living':
        for (x, y, z) in [(23.5, 20.2, 36), (23.5, 20.2, 42), (8, 9.8, 27.5), (33, 9.8, 26), (33, 9.8, 40)]:
            room_light(x, y, z, power=140, size=2.5)
        point_light(23.5, 14.5, 39.0, 60, soft=0.3)
    if cam == 'entry':
        for x in (28.7, 34.3):
            point_light(x, 7.0, -0.9, 25, soft=0.1)
