"""V3 — Blender extras for the photo-real renders (Vastu showpiece front).

Loaded by render/build_scene.py --design v3; shared helpers (P, FT, MAT, box_ft, curtain, place_group, ...)
are injected as globals before the hooks run. Coordinates are the walkthrough's feet (see design.js).
The side-road (east) side is deliberately left plain.
"""
import math, random
from mathutils import Vector

CAMERAS = {
    'front':  dict(eye=(34.5, 5.2, -50), look=(34.5, 5.2, 0), lens=24, shift=0.19),
    'corner': dict(eye=(70, 5.2, -38), look=(34, 5.2, 4), lens=22, shift=0.18),       # 3/4 from the SW
    'entry':  dict(eye=(25.5, 5.0, -15), look=(31, 5.0, 4), lens=20, shift=0.17),     # porch under the view box
    'living': dict(eye=(36.5, 4.6, 33.6), look=(0, 4.6, 39.5), lens=17, shift=0.14, exposure=0.5),
    'side':   dict(eye=(-26, 5.3, 52), look=(0, 5.3, 30), lens=20, shift=0.16),
}
HOUSE_CENTER = (30, 22.5)


def skip(k, x, y, z):
    # box furniture in the living -> scanned furniture (keep the pooja altar)
    in_living = 22 <= x <= 38 and 33 <= z <= 45 and y < 6
    return in_living and k in ('fabric', 'fabric2', 'wood', 'dark')


def build():
    facade()
    front_door()
    courtyard()
    side_road()
    living_room()


def facade():
    # teak-slat garage door: horizontal slats with shadow gaps
    for i in range(16):
        y = 0.5 + i * 0.5
        box_ft(18.1, 26.9, y + 0.06, y + 0.44, -0.42, -0.3, MAT['teak'], col, bevel=0.002)
    box_ft(17.9, 27.1, 8.4, 8.6, -0.5, -0.3, MAT['black_metal'], col, bevel=0)
    # view box: warm soffit strip light over the porch, sheer curtains behind the glass
    box_ft(28.5, 33.5, 9.45, 9.5, 0.4, 3.4, lamp_glow, col, bevel=0)
    for a, b in [(18.6, 22.0), (34.0, 37.4)]:
        curtain(a, b, 10.7, 20.2, -2.9, 10)
    # master (SW) and parents' bedroom curtains behind the framed windows
    curtain(40.7, 44.0, 12.2, 18.8, 0.8, 9); curtain(46.0, 49.3, 12.2, 18.8, 0.8, 9)
    curtain(38.2, 41.5, 3.2, 8.3, 0.8, 9); curtain(44.5, 47.8, 3.2, 8.3, 0.8, 9)
    # roof: SW overhead tank (Vastu), parapet coping
    tank(47, 6, 21.2 + 0.2, r=2.6, h=5.0)
    box_ft(16.7, 52.3, 24.7, 24.9, -0.35, 0.35, MAT['parapet'], col)
    # potted plants inside the view box
    for x in (19.2, 36.8):
        for o in potted:
            place(o, P(x, 10.5, -2.4), 4.5, 0.7)
        place(random.choice(leafy), P(x, 10.5 + 0.16 * 4.5 / FT * 0.85, -2.4), 4.2)
    # front boundary: stone-clad low wall, open car gate, pedestrian gate with lamps
    for a, b in [(34.6, 52.2)]:
        box_ft(a, b, 0.45, 3.6, -5.3, -4.8, MAT['stone'])
        box_ft(a - 0.1, b + 0.1, 3.6, 3.8, -5.4, -4.7, MAT['slab'])
    for x in (16.6, 27.8, 28.8, 34.0):
        box_ft(x, x + 0.8, 0.45, 4.8, -5.45, -4.65, MAT['stone'])
    for x in (28.8, 34.0):
        box_ft(x + 0.1, x + 0.7, 4.8, 5.3, -5.4, -4.7, lamp_glow, bevel=0)
    for i in range(8):
        box_ft(29.6 - 0.04, 29.6 + 0.04, 0.8, 4.0, -4.6 + i * 0.6, -4.55 + i * 0.6, MAT['black_metal'], bevel=0)
    planter_mat = pbr('Planter', 'concrete_floor', 1.0, tint=(0.35, 0.33, 0.31))
    box_ft(35.2, 51.8, 0.45, 1.3, -4.6, -2.6, planter_mat)
    for x in range(36, 51, 2):
        place(random.choice(shrubs), P(x + 0.3, 1.2, -3.6), random.uniform(0.55, 0.75))
    plane_ft(29.0, 34.0, -5.0, -1.6, 0.5, paving, col)


def front_door():
    """Teak pivot door on the S4 pada, in the teak-panelled entry wall at the back of the porch."""
    teak = MAT['teak']
    a = math.radians(50)
    hinge = Vector((29.35, 4.0))
    d = Vector((math.cos(a), math.sin(a)))
    c = hinge + 1.6 * d
    door = cube('MainDoor', P(c.x, 0.5 + 3.75, c.y), (3.2 * FT, 0.18 * FT, 7.5 * FT), teak, bevel=0.004)
    door.rotation_euler[2] = -a
    hx = hinge + 2.9 * d
    cube('DoorPull', P(hx.x + 0.2 * math.sin(a), 4.2, hx.y - 0.2 * math.cos(a)), (0.08 * FT, 0.08 * FT, 3.0 * FT), MAT['brass'], bevel=0)
    box_ft(29.9, 32.3, 0.5, 0.52, 1.6, 3.3, MAT['plinth'], col, bevel=0)          # door mat
    box_ft(34.2, 35.6, 5.0, 5.6, -0.6, -0.52, MAT['brass'], col, bevel=0)           # name plate on the stone
    bigplant = load_model('potted_plant_02', ['potted_plant_02_dirt', 'potted_plant_02_leaves', 'potted_plant_02_pot'])
    place_group(bigplant, P(33.0, 0.5, 1.5), 1.5, 2.0)


def courtyard():
    """NE courtyard: tulsi in the stone planter, water feature, pebbles."""
    place(random.choice(leafy), P(8.5, 2.9, 40.0), 5.0)                         # tulsi
    place(random.choice(leafy), P(8.0, 2.9, 39.4), 3.5)
    scatter_grass(1, 16, 36.5, 44.5, 140, y=0.5)
    bigplant = load_model('potted_plant_02', ['potted_plant_02_dirt', 'potted_plant_02_leaves', 'potted_plant_02_pot'])
    place_group(bigplant, P(14.5, 0.5, 43.5), 1.8, 0.6)


def side_road():
    """Plain, closed side: only a low boundary wall."""
    box_ft(-4.8, -4.3, 0, 3.6, 22.0, 47.0, MAT['stone'])
    box_ft(-4.95, -4.15, 3.6, 3.8, 22.0, 47.0, MAT['slab'])


def living_room():
    L0 = 0.5
    black_metal = MAT['black_metal']
    sofa = load_model('sofa_02', ['sofa_02_Base', 'sofa_02_Seat'])
    chair = load_model('modern_arm_chair_01', ['modern_arm_chair_01'])
    ctable = load_model('modern_coffee_table_01', ['modern_coffee_table_01'])
    stable = load_model('side_table_01', ['side_table_01'])
    bigplant = load_model('potted_plant_02', ['potted_plant_02_dirt', 'potted_plant_02_leaves', 'potted_plant_02_pot'])
    pillows = load_model('throw_pillows_01', ['throw_pillows_01_pillow01', 'throw_pillows_01_pillow02'])
    chand = load_model('Chandelier_03', ['Chandelier_03'])
    diya = load_model('brass_diya_lantern', ['brass_diya_lantern', 'brass_diya_lantern_chain', 'brass_diya_lantern_connection'])
    eleph = load_model('carved_wooden_elephant', ['carved_wooden_elephant'])
    place_group(sofa, P(28.5, L0, 35.3), 1.25, math.pi)        # on the south side, facing north
    place_group(pillows, P(28.5, L0 + 1.6, 35.1), 1.0, math.pi)
    place_group(chair, P(35.8, L0, 38.0), 1.0, -math.pi / 2)  # on the west side, facing east
    place_group(chair, P(35.8, L0, 41.3), 1.0, -math.pi / 2)
    place_group(ctable, P(28.5, L0, 39.8), 1.15, 0)
    place_group(stable, P(24.0, L0, 35.3), 1.0, 0)
    place_group(eleph, P(24.0, L0 + 1.85, 35.3), 2.0, math.radians(30))
    place_group(bigplant, P(29.5, L0, 44.0), 1.8, 1.0)
    place_group(chand, P(23.5, 13.5, 39.0), 1.5, 0)
    box_ft(23.45, 23.55, 14.9, 20.5, 38.95, 39.05, black_metal, col, bevel=0)
    place_group(diya, P(20.0, 6.2, 42.0), 2.0, 0)
    rug = principled('Rug', (0.55, 0.45, 0.35), rough=1.0, **{'Sheen Weight': 0.6})
    plane_ft(24.0, 33.0, 37.0, 42.8, L0 + 0.06, rug, col)
    box_ft(30.5, 37.5, L0, L0 + 1.6, 43.8, 44.6, MAT['teak'], col)


def lights(cam):
    for (x, y, z) in [(45, 9.5, 7), (31, 9.5, 7), (28, 19.8, 6), (22, 19.8, 6), (45, 19.8, 7)]:
        room_light(x, y, z)
    if cam in ('entry', 'front', 'corner'):
        point_light(31, 9.2, 2.0, 30, soft=0.2)                       # porch downlight
        for x in (28.6, 33.4):
            point_light(x, 1.0, 0.8, 12, soft=0.1, color=(1.0, 0.8, 0.55))   # uplights grazing the stone
    if cam == 'living':
        for (x, y, z) in [(23.5, 20.2, 36), (23.5, 20.2, 42), (33, 9.8, 26), (33, 9.8, 40)]:
            room_light(x, y, z, power=140, size=2.5)
        point_light(23.5, 14.5, 39.0, 60, soft=0.3)
        point_light(20, 7.0, 42, 15, soft=0.1)                        # pooja glow
