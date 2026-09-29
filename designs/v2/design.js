/* V2 — front entrance facing the mountains, garage on the side road, 2 bedrooms upstairs.
   Changes from v1:
   - Main door moves to the FRONT (south, main road / mountain view): a foyer where v1's garage was.
   - Garage moves to the EAST wing (side road), where v1's main door was; its roof is a first-floor terrace.
   - Double-height living + pooja stay in the NE, behind the garage.
   - First floor keeps only Bedroom 3 and Bedroom 4; the home theatre/study and its bath become one large lounge.
   Units/axes as v1: feet, +x = WEST, +z = NORTH, origin = SE corner of the plot. */
registerDesign({
  id: 'v2',
  name: 'V2 · Front entrance',
  summary: 'Main door on the road/mountain side through a front foyer, garage off the side road with a terrace above, 2 bedrooms down + 2 up with a large family lounge.',
  levels: { G: 0.5, F: 10.5, R: 20.5 },
  spawn: { x: 32.5, z: -9, yaw: Math.PI },       // on the footpath, facing the front door
  center: { x: 30, z: 22 },

  renders: [
    { file: 'renders/front.png', title: 'Front', caption: 'Main entrance facing the road and the mountains' },
    { file: 'renders/entry.png', title: 'Front door', caption: 'Porch and foyer under the balcony' },
    { file: 'renders/garage.png', title: 'Side & garage', caption: 'East side from the side road: garage with terrace above' },
    { file: 'renders/living.png', title: 'Living room', caption: 'Double-height living, looking towards the side-road glass and pooja' },
  ],

  rooms: [
    // ground floor
    { n: 'Kitchen', lv: 0, r: [17, 27, 0, 13], f: 'kitchen', d: "10'×13' · SE" },
    { n: 'Foyer', lv: 0, r: [27, 38, 0, 10], f: 'stone', d: 'main door · faces mountains' },
    { n: 'Dining', lv: 0, r: [17, 27, 13, 23], f: 'living', d: "10'×10'" },
    { n: 'WC', lv: 0, r: [27, 32, 19, 24], f: 'bath', d: "5'×5'", noLabel: true },
    { n: 'Lobby', lv: 0, r: [27, 38, 24, 35], f: 'lobby', extra: [[27, 38, 10, 19], [32, 38, 19, 24]] },
    { n: 'Family sitting', lv: 0, r: [27, 38, 35, 45], f: 'living' },
    { n: 'Garage', lv: 0, r: [0, 17, 22, 33], f: 'garage', d: "17'×11' · from side road" },
    { n: 'Living', lv: 0, r: [0, 17, 33, 45], f: 'living', d: 'double height · NE', extra: [[17, 27, 23, 45]] },
    { n: 'Pooja', lv: 0, r: [0, 6, 39, 45], f: 'pooja', d: "6'×6' · NE" },
    { n: 'Master bedroom', lv: 0, r: [38, 52, 0, 15], f: 'wood', d: "14'×15' · SW" },
    { n: 'Dress', lv: 0, r: [38, 45, 15, 22], f: 'wood', noLabel: true },
    { n: 'Master bath', lv: 0, r: [45, 52, 15, 22], f: 'bath', noLabel: true },
    { n: 'Stair', lv: 0, r: [38, 52, 22, 30], f: 'lobby', noFloor: true, noLabel: true },
    { n: 'Bedroom 2', lv: 0, r: [38, 52, 30, 45], f: 'wood', d: "14'×15' · NW" },
    { n: 'Bath 2', lv: 0, r: [46, 52, 38, 45], f: 'bath', noLabel: true },
    // first floor
    { n: 'Front balcony', lv: 1, r: [17, 52, -4, 0], f: 'stone', d: 'mountain view' },
    { n: 'Bedroom 4', lv: 1, r: [17, 27, 0, 16], f: 'wood', d: "10'×16' · SE" },
    { n: 'DR', lv: 1, r: [17, 21, 16, 21], f: 'wood', noLabel: true },
    { n: 'Bath 4', lv: 1, r: [21, 27, 16, 21], f: 'bath', noLabel: true },
    { n: 'Gallery', lv: 1, r: [17, 27, 21, 29], f: 'lobby' },
    { n: 'Terrace', lv: 1, r: [0, 17, 22, 33], f: 'stone', d: 'over the garage' },
    { n: 'Family lounge', lv: 1, r: [27, 38, 0, 18], f: 'wood', d: "11'×18' · over foyer" },
    { n: 'Upper lounge / TV', lv: 1, r: [27, 38, 18, 45], f: 'lobby', d: 'was theatre + study', extra: [[38, 40, 22, 30], [38, 52, 30, 45]] },
    { n: 'Bedroom 3', lv: 1, r: [38, 52, 0, 15], f: 'wood', d: "14'×15' · SW master" },
    { n: 'Dress 3', lv: 1, r: [38, 45, 15, 22], f: 'wood', noLabel: true },
    { n: 'Bath 3', lv: 1, r: [45, 52, 15, 22], f: 'bath', noLabel: true },
  ],
  voids: [[0, 17, 33, 45], [17, 27, 29, 45]],
  minimap: { stair: [[40, 28], [50, 28], [50, 24], [41, 24]], voidLabel: [11, 40] },

  build(h) {
    const { G, F, R, RT, EXT, INT, M, box, wall, door, win, tall, slide, railing } = h;

    // ---------------- slabs
    box(17, 52, 0, G, 0, 45, M.plinth);          // main block plinth
    box(0, 17, 0, G, 22, 45, M.plinth);          // east wing plinth (garage + living)
    // first floor: main block minus void + stair hole, plus the terrace over the garage
    for (const [x1, x2, z1, z2] of [[17, 52, 0, 22], [17, 27, 22, 29], [27, 40, 22, 30], [27, 52, 30, 45], [0, 17, 22, 33]])
      box(x1, x2, F - 0.5, F, z1, z2, M.slab);
    box(17, 52, F - 0.5, F, -4, 0, M.slab);      // front balcony = porch roof over the main door
    box(17, 52, R, RT, 0, 45, M.slab);           // roof
    box(0, 17, R, RT, 33, 45, M.slab);           // roof over the double-height living only

    // ---------------- exterior walls
    // South (road), ground floor: kitchen window, MAIN DOOR with glass side-lights, master window
    wall('x', 0, 17, 52, 0, F, EXT,
      [win(19, 25), tall(28.2, 30.2, G + 0.5, G + 7.5), door(30.5, 34.5), tall(34.8, 36.8, G + 0.5, G + 7.5), win(40, 50)], M.extWall);
    // South, first floor: sliding doors to the front balcony
    wall('x', 0, 17, 52, F, RT, EXT, [slide(19, 25), slide(28.5, 36.5), slide(40, 50)], M.extWall);
    wall('z', 52, 0, 45, 0, RT, EXT, [], M.extWall);                     // west (neighbour side)
    wall('z', 17, 0, 22, 0, RT, EXT, [], M.extWall);                     // against the 2-storey neighbour
    // East (side road): garage shutter (single storey, terrace parapet above), then the tall living
    wall('z', 0, 22, 33, 0, F + 3.5, EXT, [{ a: 23.5, b: 31.5, s: 0, h: 8.5, kind: 'open' }], M.accent);
    box(-0.55, -0.4, 0, 8.5, 23.4, 31.6, M.shutter);                     // closed rolling shutter
    wall('z', 0, 33, 45, 0, RT, EXT, [tall(35, 43.5, 1.5, 19.5)], M.accent);
    wall('x', 22, 0, 17 - EXT / 2, 0, F + 3.5, EXT, [], M.accent);       // garage | neighbour (terrace parapet above)
    // terrace | double-height living: solid below, glass above the terrace
    wall('x', 33, 0, 17 - EXT / 2, 0, RT, EXT, [tall(3, 14, F + 1, F + 8.5)], M.extWall);
    // gallery | terrace: sliding door out onto the terrace
    wall('z', 17, 22, 33, F, RT, EXT, [slide(23.5, 28.5)], M.extWall);
    wall('x', 45, 0, 17 - EXT / 2, 0, RT, EXT, [tall(8, 16, 1.5, 19.5)], M.accent);   // north, wing
    wall('x', 45, 17 + EXT / 2, 52, 0, F, EXT, [tall(18, 26, 1.5, 9.5), win(29, 36), win(41, 45)], M.extWall);
    wall('x', 45, 17 + EXT / 2, 52, F, RT, EXT, [tall(18, 26, F + 1, F + 9), win(29, 36, F), win(41, 45, F)], M.extWall);

    // parapet on the main roof
    const P0 = RT, P1 = RT + 3;
    wall('x', 0, 17, 52, P0, P1, 0.5, [], M.parapet);
    wall('z', 52, 0, 45, P0, P1, 0.5, [], M.parapet);
    wall('x', 45, 0, 52, P0, P1, 0.5, [], M.parapet);
    wall('z', 0, 33, 45, P0, P1, 0.5, [], M.parapet);
    wall('x', 33, 0, 17, P0, P1, 0.5, [], M.parapet);
    wall('z', 17, 0, 33, P0, P1, 0.5, [], M.parapet);

    // balcony railing (the balcony doubles as the porch roof)
    railing('x', -4, 17, 52, F);
    railing('z', 17, -4, 0, F);
    railing('z', 52, -4, 0, F);

    // ---------------- ground floor interior
    const g0 = G, g1 = F - 0.5;
    wall('z', 27, 0, 19, g0, g1, INT, [door(14.5, 17.5)]);                // kitchen/dining | foyer & lobby
    wall('z', 27, 19, 24, g0, g1, INT);                                    // WC side
    wall('x', 13, 17, 27, g0, g1, INT, [door(18.5, 25.5)]);               // kitchen | dining (wide opening)
    box(27, 29.5, g0, g1, 9.8, 10.2, M.wall); box(35.5, 38, g0, g1, 9.8, 10.2, M.wall);   // foyer | lobby: wide opening
    wall('x', 19, 27, 32, g0, g1, INT);                                    // WC
    wall('z', 32, 19, 24, g0, g1, INT, [door(20, 22.8)]);
    wall('x', 24, 27, 32, g0, g1, INT);
    wall('z', 38, 0, 22, g0, g1, INT, [door(19.2, 21.8)]);                // master suite entry (via dress)
    wall('z', 38, 30, 45, g0, g1, INT, [door(31, 34)]);                   // bedroom 2 door
    wall('x', 15, 38, 52, g0, g1, INT, [door(40, 43)]);                   // master | dress
    wall('z', 45, 15, 22, g0, g1, INT, [door(16.5, 19)]);                 // dress | bath
    wall('x', 22, 38, 52, g0, g1, INT);                                   // suite | stair
    wall('x', 30, 38, 52, g0, g1, INT);                                   // stair | bedroom 2
    wall('x', 38, 46, 52, g0, g1, INT, [door(47, 49.8)]);                 // bath 2
    wall('z', 46, 38, 45, g0, g1, INT);
    wall('z', 17, 22, 33, g0, g1, INT, [door(28.5, 31.5)]);               // garage | living (house door)
    // pooja (own low ceiling inside the double-height living)
    wall('x', 39, 0, 6, g0, 9, INT, [door(1.5, 4.5)], M.cabinet);
    wall('z', 6, 39, 45, g0, 9, INT, [], M.cabinet);
    box(0, 6, 9, 9.4, 39, 45, M.cabinet);

    // ---------------- dog-leg stair, 18 risers (same place as v1)
    const RISE = (F - G) / 18;
    for (let i = 0; i < 8; i++) box(40 + i, 41 + i, G, G + (i + 1) * RISE, 26.2, 30, M.tread);
    box(48, 52, G, G + 9 * RISE, 22, 30, M.tread);
    for (let i = 0; i < 8; i++) box(47 - i, 48 - i, G, G + 9 * RISE + (i + 1) * RISE, 22, 25.8, M.tread);
    box(40, 48, G, 9.0, 25.8, 26.2, M.wall);
    railing('z', 40, 26.2, 30, F);

    // ---------------- first floor interior (2 bedrooms + one big lounge)
    const f0 = F, f1 = R;
    wall('z', 27, 0, 21, f0, f1, INT);                                    // bedroom 4 | family lounge
    wall('x', 16, 17, 27, f0, f1, INT, [door(17.6, 20.4, F)]);            // bedroom 4 | DR
    wall('z', 21, 16, 21, f0, f1, INT, [door(17, 20, F)]);                // DR | bath
    wall('x', 21, 17, 27, f0, f1, INT, [door(17.6, 20.4, F)]);            // DR | gallery
    box(27, 29, f0, f1, 17.8, 18.2, M.wall); box(36, 38, f0, f1, 17.8, 18.2, M.wall); // lounge wall stubs
    wall('z', 38, 0, 22, f0, f1, INT, [door(16.5, 19, F)]);               // into dress 3
    wall('x', 15, 38, 52, f0, f1, INT, [door(40, 43, F)]);
    wall('z', 45, 15, 22, f0, f1, INT, [door(17, 19.8, F)]);
    wall('x', 22, 38, 52, f0, f1, INT);
    wall('x', 30, 38, 52, f0, f1, INT);                                   // stair | lounge (TV wall)
    // railings around the double-height void (the terrace has a parapet wall)
    railing('x', 29, 17, 27, F);
    railing('z', 27, 29, 45, F);

    // ---------------- furniture, ground floor
    let f = h.furnish(G);
    // kitchen
    box(17.4, 26.6, G, G + 2.9, 0.4, 2.4, M.cabinet); box(17.4, 26.6, G + 2.9, G + 3.05, 0.4, 2.4, M.counter);
    box(17.4, 19.4, G, G + 2.9, 2.4, 10, M.cabinet); box(17.4, 19.4, G + 2.9, G + 3.05, 2.4, 10, M.counter);
    box(17.4, 26.6, G + 5, G + 7.3, 0.4, 1.6, M.cabinet, { collide: false });
    box(24.3, 26.6, G, G + 6.2, 10.6, 12.6, M.white);                    // fridge
    // dining
    f.table(19.5, 24.5, 15.5, 19.5);
    for (const [x, z] of [[20, 14.5], [23, 14.5], [20, 19.7], [23, 19.7]]) box(x, x + 1.4, G, G + 1.5, z, z + 1.3, M.fabric2);
    // foyer: shoe cabinet + bench
    box(27.4, 28.6, G, G + 3.2, 1.5, 8.5, M.wood);
    box(36.2, 37.6, G, G + 1.5, 2, 7, M.wood);
    f.toilet(29.5, 23);                                                  // WC
    // garage: car facing the side road
    box(2, 16, G + .6, G + 2.9, 24.2, 30.8, M.car); box(5.5, 12.5, G + 2.9, G + 4.6, 24.6, 30.4, M.car);
    for (const [x, z] of [[4, 24], [4, 30.6], [13, 24], [13, 30.6]]) box(x - 1, x + 1, G, G + 1.4, z, z + 0.4, M.dark, { collide: false });
    // living (double height)
    f.sofa(5, 14, 34, 37, 'S');
    f.sofa(17.5, 20.5, 33, 40, 'W', M.fabric2);
    f.table(8, 13, 38.5, 41.5, 1.4);
    box(8, 16, G, G + 1.8, 43.6, 44.6, M.wood);                          // low console by the north glazing
    box(9.5, 14.5, G + 1.8, G + 4.8, 44, 44.2, M.dark, { collide: false });
    // pooja altar
    box(0.5, 5.5, G, G + 3, 43.8, 44.6, M.wood); box(2.2, 3.8, G + 3, G + 5, 44, 44.4, M.brass, { collide: false });
    // family sitting
    f.sofa(28.5, 36.5, 42, 44.6, 'N', M.fabric2);
    f.table(30, 35, 38.5, 40.5, 1.4);
    box(27.3, 28.3, G, G + 2.8, 27, 31, M.wood);                          // lobby console
    // master suite
    f.bed(44.5, 51.6, 3.8, 10.2, 'W');
    box(49, 51.6, G, G + 2, 1, 3.3, M.wood); box(49, 51.6, G, G + 2, 10.7, 13, M.wood);
    f.wardrobe(38.3, 44.7, 21.2, 21.8);
    f.toilet(50.5, 20.5); f.vanity(45.3, 46.8, 17, 21.5);
    // bedroom 2
    f.bed(41, 47, 30.3, 37.3, 'S');
    f.wardrobe(38.3, 39.2, 36, 44.6);
    f.toilet(50.5, 43.8); f.vanity(46.3, 47.8, 40, 44.5);

    // ---------------- furniture, first floor
    f = h.furnish(F);
    f.bed(21, 26.6, 5, 11, 'W');                                          // bedroom 4
    box(17.4, 18.8, F, F + 2.5, 9, 14, M.wood);                           // study desk
    f.toilet(26, 20); f.vanity(21.3, 22.8, 17, 20.6);
    f.sofa(28.3, 36.7, 12, 15, 'N');                                      // family lounge
    f.table(30, 35, 7.5, 10, 1.4);
    f.bed(44.5, 51.6, 3.8, 10.2, 'W');                                    // bedroom 3
    f.wardrobe(38.3, 44.7, 21.2, 21.8);
    f.toilet(50.5, 20.5); f.vanity(45.3, 46.8, 17, 21.5);
    // big upper lounge / TV (was theatre + study)
    box(41, 49, F, F + 1.6, 30.3, 31.4, M.wood);                          // TV unit on the stair wall
    box(42, 48, F + 2.4, F + 5.8, 30.4, 30.55, M.dark, { collide: false });
    f.sofa(40, 50, 40.5, 43.5, 'N');
    f.sofa(49, 51.8, 33, 40, 'W', M.fabric2);
    f.table(42.5, 47.5, 35.5, 38.5, 1.4);
    f.sofa(28.2, 31.2, 36, 43, 'E', M.fabric2);                           // reading corner over the gallery
    box(29, 36, F, F + 7, 44.1, 44.7, M.wood);                            // bookshelf
    // terrace furniture
    box(4, 5.5, F, F + 2.8, 25, 26.5, M.fabric2); box(4, 5.5, F, F + 2.8, 28.5, 30, M.fabric2);
    f.table(4.2, 5.3, 26.9, 28.1, 1.8);
    // balcony chairs
    box(40, 41.5, F, F + 2.8, -3, -1.5, M.fabric2); box(42.5, 44, F, F + 2.8, -3, -1.5, M.fabric2);
    f.table(41.6, 42.4, -2.6, -1.9, 1.8);
  },
});
