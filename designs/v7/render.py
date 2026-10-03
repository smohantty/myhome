"""V7 — Blender extras for the photo-real renders (Odisha modern).

Loaded by render/build_scene.py --design v7; shared helpers (P, FT, MAT, box_ft, place, place_group, tank, ...)
are injected as globals before the hooks run. Coordinates are the walkthrough's feet (see design.js).
The viewer's low-poly palms, hedge, pot plants, box car and box living furniture are swapped for scanned models.
"""
import math, random

CAMERAS = {
    'front':  dict(eye=(34.5, 5.5, -42), look=(34.5, 5.5, 0), lens=22, shift=0.2),
    'corner': dict(eye=(66, 5.5, -30), look=(32, 5.5, 22), lens=22, shift=0.18),       # 3/4 from the SW
    'entry':  dict(eye=(31.5, 5.3, -7), look=(31.5, 5.3, 15), lens=20, shift=0.2),     # gate, steps, canopy, jaali
    'living': dict(eye=(44.6, 6.2, 42.2), look=(29.5, 6.2, 28), lens=16, shift=0.08, exposure=0.6),
    'aerial': dict(eye=(-12, 62, -42), look=(30, 12, 28), lens=28, shift=0.0),
}
HOUSE_CENTER = (33, 29)
G, F, RT = 1.5, 12.5, 24.2


def skip(k, x, y, z):
    if k in ('leaf', 'trunk', 'car'):
        return True
    if k == 'dark' and 18 <= x <= 28.5 and 15 <= z <= 33 and y < G + 1.5:        # car wheels
        return True
    in_living = 37 <= x <= 46 and 27 <= z <= 40 and y < G + 4                       # box sofa + armchair
    return in_living and k in ('fabric', 'fabric2')


def build():
    garden()
    living()
    tank(47, 40, RT, r=2.4, h=4.5)                                   # black overhead tank under the parasol roof


def garden():
    for (x, z, s) in [(48.5, 4.0, 1.5), (44.5, 9.5, 1.15), (40.0, 3.5, 0.9)]:
        place(tree, P(x, 0, z), s)
    for x in range(35, 52, 2):
        place(random.choice(shrubs), P(x + random.uniform(-.3, .3), 0, 1.2), random.uniform(0.55, 0.75))
    scatter_grass(34, 51.5, 2.2, 12.5, 420)
    for (x, z) in [(37.5, 20.85)]:                                   # planter under the stair
        place(random.choice(leafy), P(x, G + 1.2, z), 3.0)
    for (x, z) in [(5, 24), (5, 34.5), (16.8, 42.5)]:                # terracotta pots on the terrace
        place(random.choice(leafy), P(x, F + 1.4, z), 3.2)


def living():
    sofa = load_model('sofa_02', ['sofa_02_Base', 'sofa_02_Seat'])
    chair = load_model('modern_arm_chair_01', ['modern_arm_chair_01'])
    pillows = load_model('throw_pillows_01', ['throw_pillows_01_pillow01', 'throw_pillows_01_pillow02'])
    bigplant = load_model('potted_plant_02', ['potted_plant_02_dirt', 'potted_plant_02_leaves', 'potted_plant_02_pot'])
    place_group(sofa, P(43.9, G, 32.25), 1.25, -math.pi / 2)        # on the west wall, facing the TV
    place_group(pillows, P(43.7, G + 1.6, 32.25), 1.0, -math.pi / 2)
    place_group(chair, P(40.5, G, 38.3), 1.0, math.radians(-150))
    place_group(bigplant, P(29.8, G, 42.8), 1.7, 0.8)
    rug = principled('Durrie', (0.55, 0.30, 0.18), rough=1.0, **{'Sheen Weight': 0.5})
    plane_ft(33.5, 42, 28.8, 36, G + 0.06, rug, col)


def lights(cam):
    for (x, y, z) in [(34, G + 9, 33), (24, G + 9, 38), (11, G + 9, 29), (45, G + 9, 21), (30.5, G + 9, 21),
                      (45, F + 9.5, 20.5), (23, F + 9.5, 20.5), (35, F + 9.5, 30), (45, F + 9.5, 38.5)]:
        room_light(x, y, z, power=70 if cam == 'living' else 40)
    if cam in ('front', 'corner', 'entry'):
        point_light(30.6, F - 1.8, 13.0, 30, soft=0.2)                 # downlight in the door canopy
        for x in (28.6, 33.3):
            point_light(x, 4.7, -0.3, 8, soft=0.1)                       # gate-post lamps
