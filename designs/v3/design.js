/* V3 — Vastu layout with a mountain-facing showpiece front.
   Program from plans/v3-ground-floor-sketch.jpg (garage | entrance | bedroom on the front, kitchen + store
   on a fully closed side-road wall, second bedroom at the back), re-planned by Vastu:
     S4 (Grihakshat) pada main door · master bedrooms SW · kitchen in the east zone, cook facing east ·
     NE open-to-sky courtyard with tulsi + water (lightest, lowest corner) · pooja NE facing east ·
     stair in the west, climbing clockwise · open Brahmasthan hall · no bedrooms SE/NE · toilets W/NW ·
     heavy, solid south & west; SW overhead tank.
   Facade (south, mountain view): stone base, recessed stone porch with a teak entry wall, cantilevered
   teak "view box" for the first-floor lounge, SW master window in a deep frame behind a terracotta jaali.
   Units/axes as v1: feet, +x = WEST, +z = NORTH, origin = SE corner of the plot. */
registerDesign({
  id: 'v3',
  name: 'V3 · Vastu showpiece',
  summary: 'Vastu plan from the new sketch: S4 main door in a stone porch under a teak view-box lounge, masters in the SW, kitchen east with the cook facing east, NE courtyard with tulsi and water, closed side-road wall.',
  levels: { G: 0.5, F: 10.5, R: 20.5 },
  spawn: { x: 31, z: -9, yaw: Math.PI },          // on the footpath, facing the porch
  center: { x: 33, z: 24 },

  renders: [
    { file: 'renders/front.png', title: 'Front', caption: 'Mountain-facing front: stone base, teak view box, jaali-screened master' },
    { file: 'renders/corner.png', title: 'Front 3/4', caption: 'From the south-west along the main road' },
    { file: 'renders/entry.png', title: 'Porch', caption: 'Recessed stone porch and teak entry wall under the view box' },
    { file: 'renders/living.png', title: 'Living & courtyard', caption: 'Double-height living opening onto the NE courtyard and pooja' },
    { file: 'renders/side.png', title: 'Side road', caption: 'Closed side-road wall (kitchen, store, courtyard behind)' },
  ],

  rooms: [
    // ground floor
    { n: 'Garage', lv: 0, r: [17, 28, 0, 20], f: 'garage', d: "11'×20' · SE" },
    { n: 'Porch', lv: 0, r: [28, 34, 0, 4], f: 'stone', d: 'S4 pada main door' },
    { n: 'Foyer', lv: 0, r: [28, 34, 4, 12], f: 'stone', noLabel: true },
    { n: 'Parents bedroom', lv: 0, r: [34, 52, 0, 15], f: 'wood', d: "18'×15' · SW" },
    { n: 'Dress 1', lv: 0, r: [38, 45, 15, 22], f: 'wood', noLabel: true },
    { n: 'Bath 1', lv: 0, r: [45, 52, 15, 22], f: 'bath', noLabel: true },
    { n: 'Hall', lv: 0, r: [28, 38, 15, 33], f: 'lobby', d: 'Brahmasthan · kept open', extra: [[28, 34, 12, 15]] },
    { n: 'Kitchen', lv: 0, r: [0, 17, 22, 31], f: 'kitchen', d: "17'×9' · E · cook faces east" },
    { n: 'Store', lv: 0, r: [0, 17, 31, 35.5], f: 'garage', d: 'pantry' },
    { n: 'Courtyard', lv: 0, r: [0, 17, 35.5, 45], f: 'stone', d: 'NE · open to sky · tulsi + water' },
    { n: 'Dining', lv: 0, r: [17, 28, 20, 33], f: 'living', d: "11'×13' · by the kitchen" },
    { n: 'Living', lv: 0, r: [23, 38, 33, 45], f: 'living', d: 'double height · N', extra: [[17, 23, 33, 39]] },
    { n: 'Pooja', lv: 0, r: [17, 23, 39, 45], f: 'pooja', d: 'NE · faces east' },
    { n: 'Stair', lv: 0, r: [38, 52, 22, 30], f: 'lobby', noFloor: true, noLabel: true },
    { n: 'Bedroom 2', lv: 0, r: [38, 52, 30, 45], f: 'wood', d: "14'×15' · NW guest" },
    { n: 'Bath 2', lv: 0, r: [46, 52, 38, 45], f: 'bath', noLabel: true },
    // first floor
    { n: 'View lounge', lv: 1, r: [17, 38, 0, 16], f: 'wood', d: 'SE · teak view box on the mountains', extra: [[18, 38, -3.5, 0]] },
    { n: 'Master bedroom', lv: 1, r: [38, 52, 0, 15], f: 'wood', d: "14'×15' · SW" },
    { n: 'Dress 3', lv: 1, r: [38, 45, 15, 22], f: 'wood', noLabel: true },
    { n: 'Bath 3', lv: 1, r: [45, 52, 15, 22], f: 'bath', noLabel: true },
    { n: 'Gallery', lv: 1, r: [17, 38, 16, 33], f: 'lobby', extra: [[38, 40, 22, 30]] },
    { n: 'TV nook', lv: 1, r: [30, 38, 33, 45], f: 'lobby', d: 'over the living' },
    { n: 'Bedroom 4', lv: 1, r: [38, 52, 30, 45], f: 'wood', d: "14'×15' · NW" },
    { n: 'Bath 4', lv: 1, r: [46, 52, 38, 45], f: 'bath', noLabel: true },
    { n: 'Terrace', lv: 1, r: [0, 17, 22, 35.5], f: 'stone', d: 'over kitchen + store' },
  ],
  voids: [[17, 30, 33, 45], [0, 17, 35.5, 45]],
  minimap: { stair: [[40, 24], [50, 24], [50, 28], [41, 28]], voidLabel: [23.5, 38] },

  build(h) {
    const { G, F, R, RT, EXT, INT, M, box, wall, door, win, tall, slide, railing } = h;
    const PAR = F + 4;                              // closed side-road wing: solid wall up to here
    const nc = { collide: false };

    // ================= slabs
    box(17, 52, 0, G, 0, 45, M.plinth);
    box(0, 17, 0, G, 22, 45, M.plinth);
    for (const [x1, x2, z1, z2] of [[17, 52, 0, 22], [17, 40, 22, 30], [17, 52, 30, 33], [30, 52, 33, 45]])
      box(x1, x2, F - 0.5, F, z1, z2, M.slab);                           // minus stair hole + living void
    for (const [x1, x2, z1, z2] of [[0, 17, 22, 25], [0, 5, 25, 28], [11, 17, 25, 28], [0, 17, 28, 35.5]])
      box(x1, x2, F - 0.5, F, z1, z2, M.slab);                           // terrace over kitchen + store
    box(4.7, 11.3, F - 0.5, F + 0.9, 24.7, 25, M.slab); box(4.7, 11.3, F - 0.5, F + 0.9, 28, 28.3, M.slab);   // kitchen skylight
    box(4.7, 5, F - 0.5, F + 0.9, 25, 28, M.slab); box(11, 11.3, F - 0.5, F + 0.9, 25, 28, M.slab);
    box(5, 11, F + 0.8, F + 0.9, 25, 28, M.glass);
    box(17, 52, R, RT, 0, 45, M.slab);                                   // main roof

    // ================= SOUTH: the showpiece front
    // ground floor: garage | recessed porch | parents' bedroom
    wall('x', 0, 17, 28, 0, F, EXT, [{ a: 18, b: 27, s: 0, h: 8.5, kind: 'open' }], M.extWall);
    wall('x', 0, 34, 52, 0, F, EXT, [win(38, 48, G, 2.5, 8)], M.extWall);
    box(18, 27, 0, 8.5, -0.3, -0.1, M.teak);                              // teak-slat garage door (closed)
    wall('x', 4, 28, 34, G, F - 0.5, EXT, [door(29.2, 32.6), tall(32.9, 33.6, G + 0.3, G + 7.5)], M.extWall);   // entry wall
    // stone base cladding (outer skins, so interiors stay plaster)
    const sk = -0.375 - 0.14, sk2 = -0.375;
    box(16.6, 18, 0, F - 1, sk, sk2, M.stone, nc); box(27, 28.2, 0, F - 1, sk, sk2, M.stone, nc); box(18, 27, 8.5, F - 1, sk, sk2, M.stone, nc);
    box(33.8, 38, 0, F - 1, sk, sk2, M.stone, nc); box(48, 52.4, 0, F - 1, sk, sk2, M.stone, nc);
    box(38, 48, 0, G + 2.5, sk, sk2, M.stone, nc); box(38, 48, G + 8, F - 1, sk, sk2, M.stone, nc);
    box(16.6, 52.4, F - 1, F, sk, sk2, M.stone, nc);                      // stone band at the floor line
    // porch: stone side walls, teak-panelled entry wall around the door
    box(28.2, 28.34, G, F - 0.5, 0, 4, M.stone, nc); box(33.66, 33.8, G, F - 0.5, 0, 4, M.stone, nc);
    box(28.2, 29.2, G, F - 0.5, 3.5, 3.62, M.teak, nc); box(33.6, 33.8, G, F - 0.5, 3.5, 3.62, M.teak, nc);
    box(29.2, 33.6, G + 7.5, F - 0.5, 3.5, 3.62, M.teak, nc);
    box(28.6, 33.4, 0, 0.25, -1.6, 0, M.stone);                          // step
    // parents' bedroom window: deep projecting frame
    box(37.4, 48.6, G + 8, G + 8.6, -2, -0.4, M.slab); box(37.4, 48.6, G + 1.9, G + 2.5, -2, -0.4, M.slab);
    box(37.4, 38, G + 2.5, G + 8, -2, -0.4, M.slab); box(48, 48.6, G + 2.5, G + 8, -2, -0.4, M.slab);

    // first floor: open to the view box | SW master (solid, framed window behind a terracotta jaali)
    wall('x', 0, 17, 52, F, RT, EXT, [{ a: 18.3, b: 37.7, s: F, h: R, kind: 'open' }, win(40.5, 49.5, F, 1.5, 8.5)], M.extWall);
    // cantilevered teak view box (lounge floor extends 3.5 ft over the porch)
    box(18, 38, F - 0.5, F, -3.5, 0, M.slab);
    box(17.3, 18.3, F - 0.5, R, -4, 0, M.teak); box(37.7, 38.7, F - 0.5, R, -4, 0, M.teak);   // fins between top and bottom frame
    box(17.3, 38.7, R, R + 1.2, -4, 0, M.teak); box(17.3, 38.7, F - 1, F - 0.5, -4, 0, M.teak);
    box(18.3, 37.7, F, R, -3.45, -3.35, M.glass);
    for (let i = 0; i <= 4; i++) { const x = 18.3 + i * 19.4 / 4; box(x - 0.1, x + 0.1, F, R, -3.5, -3.3, M.frame, nc); }
    box(18.3, 37.7, F + 3.2, F + 3.35, -3.5, -3.3, M.frame, nc);          // transom
    // SW master window: deep white frame + terracotta jaali fins
    box(40, 50, F + 9, F + 9.6, -2.2, -0.4, M.slab); box(40, 50, F + 0.9, F + 1.5, -2.2, -0.4, M.slab);
    box(39.4, 40, F + 0.9, F + 9.6, -2.2, -0.4, M.slab); box(50, 50.6, F + 0.9, F + 9.6, -2.2, -0.4, M.slab);
    for (let x = 40.45; x < 49.6; x += 0.62) box(x, x + 0.26, F + 1.5, F + 9, -1.55, -1.2, M.terracotta, nc);

    // ================= other walls
    wall('z', 52, 0, 45, 0, RT, EXT, [win(4, 10, F), win(34, 38, F)], M.extWall);   // west: small windows upstairs only
    wall('z', 17, 0, 22, 0, RT, EXT, [], M.extWall);                             // against the 2-storey neighbour
    // side road (east): COMPLETELY CLOSED
    wall('z', 0, 22, 45, 0, PAR, EXT, [], M.extWall);
    wall('x', 22, 0, 17 - EXT / 2, 0, PAR, EXT, [], M.extWall);
    wall('x', 45, 0, 17 - EXT / 2, 0, PAR, EXT, [], M.extWall);                  // courtyard north wall
    // wing | house: kitchen opening, store door, glass onto the courtyard (living), pooja east window
    wall('z', 17, 22, 45, 0, F, EXT, [door(23.5, 30.5), door(31.4, 33.4), slide(35.8, 38.8, G), tall(39.6, 44.4, G + 3.2, G + 8)]);
    wall('z', 17, 22, 45, F, RT, EXT, [slide(24, 29), tall(36, 44.4, F + 1, F + 8.5)], M.extWall);
    // north: double-height glass to the living, windows elsewhere
    wall('x', 45, 17 + EXT / 2, 30, 0, RT, EXT, [tall(24, 29.5, 1.5, 19.5)], M.extWall);
    wall('x', 45, 30, 52, 0, F, EXT, [win(31.5, 36.5), win(41, 45)], M.extWall);
    wall('x', 45, 30, 52, F, RT, EXT, [win(32, 37, F), win(41, 46, F)], M.extWall);
    // roof parapet (south and west higher = heavier, per Vastu)
    wall('x', 0, 17, 52, RT, RT + 3.5, 0.5, [], M.parapet);
    wall('z', 52, 0, 45, RT, RT + 3.5, 0.5, [], M.parapet);
    wall('x', 45, 17, 52, RT, RT + 3, 0.5, [], M.parapet);
    wall('z', 17, 0, 45, RT, RT + 3, 0.5, [], M.parapet);

    // ================= ground floor interior
    const g0 = G, g1 = F - 0.5;
    wall('z', 28, 0, 20, g0, g1, INT, [door(6, 9)]);                      // garage | porch, foyer (house door)
    wall('x', 20, 17, 28, g0, g1, INT);                                   // garage | dining
    wall('z', 34, 0, 15, g0, g1, INT, [door(12.2, 14.8)]);                // porch/foyer/hall | parents' bedroom
    wall('x', 15, 34, 38, g0, g1, INT);
    wall('x', 15, 38, 52, g0, g1, INT, [door(40, 43)]);                   // bedroom | dress
    wall('z', 38, 15, 22, g0, g1, INT);
    wall('z', 45, 15, 22, g0, g1, INT, [door(16.5, 19)]);                 // dress | bath (west)
    wall('x', 22, 38, 52, g0, g1, INT);
    wall('x', 30, 38, 52, g0, g1, INT);
    wall('z', 38, 30, 45, g0, g1, INT, [door(31, 34)]);                   // bedroom 2
    wall('x', 38, 46, 52, g0, g1, INT, [door(47, 49.8)]);                 // bath 2 (NW)
    wall('z', 46, 38, 45, g0, g1, INT);
    wall('x', 31, 0, 17 - EXT / 2, g0, g1, INT, [door(12.5, 15.5)]);      // kitchen | store
    wall('x', 35.5, 0, 17 - EXT / 2, g0, F, INT);                         // store | courtyard
    // pooja: NE of the house, altar on the east (worship facing east), own ceiling
    wall('z', 23, 39, 45, g0, 9, INT, [], M.cabinet);
    wall('x', 39, 17, 23, g0, 9, INT, [door(18.5, 21.5)], M.cabinet);
    box(17, 23, 9, 9.4, 39, 45, M.cabinet);

    // ================= dog-leg stair in the west, climbing clockwise (18 risers)
    const RISE = (F - G) / 18;
    for (let i = 0; i < 8; i++) box(40 + i, 41 + i, G, G + (i + 1) * RISE, 22, 25.8, M.tread);        // up, heading west
    box(48, 52, G, G + 9 * RISE, 22, 30, M.tread);                                                        // landing (turn via north)
    for (let i = 0; i < 8; i++) box(47 - i, 48 - i, G, G + 9 * RISE + (i + 1) * RISE, 26.2, 30, M.tread); // up, heading east
    box(40, 48, G, 9.0, 25.8, 26.2, M.wall);
    railing('z', 40, 22, 25.8, F);

    // ================= first floor interior
    const f0 = F, f1 = R;
    wall('z', 38, 0, 22, f0, f1, INT, [door(16.5, 19, F)]);               // into dress 3
    wall('x', 15, 38, 52, f0, f1, INT, [door(40, 43, F)]);
    wall('z', 45, 15, 22, f0, f1, INT, [door(17, 19.8, F)]);
    wall('x', 22, 38, 52, f0, f1, INT);
    wall('x', 30, 38, 52, f0, f1, INT);
    wall('z', 38, 30, 45, f0, f1, INT, [door(31, 34, F)]);                // bedroom 4 (NW)
    wall('x', 38, 46, 52, f0, f1, INT, [door(47, 49.8, F)]);
    wall('z', 46, 38, 45, f0, f1, INT);
    railing('x', 33, 17, 30, F);                                          // living void
    railing('z', 30, 33, 45, F);
    railing('x', 35.5, 0, 17, F);                                         // terrace edge over the courtyard

    // ================= furniture, ground floor
    let f = h.furnish(G);
    box(19.6, 25.4, G + .6, G + 2.9, 2.5, 16.5, M.car); box(20, 25, G + 2.9, G + 4.6, 6, 13, M.car);
    for (const [x, z] of [[19.4, 4.5], [25.2, 4.5], [19.4, 13.5], [25.2, 13.5]]) box(x, x + .4, G, G + 1.4, z - 1, z + 1, M.dark, nc);
    box(32.9, 33.6, G, G + 3.2, 5, 11, M.wood);                          // foyer shoe cabinet
    box(28.4, 29.6, G, G + 1.5, 7, 11, M.wood);                          // bench
    f.bed(44.5, 51.6, 4, 10.5, 'W');                                      // head to the west
    box(49, 51.6, G, G + 2, 1.3, 3.5, M.wood); box(49, 51.6, G, G + 2, 11, 13.2, M.wood);
    box(35, 37.5, G, G + 2.8, 4, 6.5, M.fabric2);
    f.wardrobe(38.3, 44.7, 21.2, 21.8);
    f.toilet(50.5, 20.5); f.vanity(45.3, 46.8, 17, 21.5);
    // kitchen: stove on the east wall (SE of the kitchen), sink to the north, fridge SW
    box(0.4, 2.4, G, G + 2.9, 22.4, 30.6, M.cabinet); box(0.4, 2.4, G + 2.9, G + 3.05, 22.4, 30.6, M.counter);
    box(2.4, 10, G, G + 2.9, 22.4, 24.4, M.cabinet); box(2.4, 10, G + 2.9, G + 3.05, 22.4, 24.4, M.counter);
    box(0.4, 1.6, G + 5, G + 7.3, 22.4, 30.6, M.cabinet, nc);
    box(1.0, 2.0, G + 3.05, G + 3.3, 23, 25.5, M.dark, nc);               // hob
    box(13.5, 15.8, G, G + 6.2, 22.4, 24.6, M.white);                   // fridge
    box(6, 11.5, G, G + 3, 26.5, 28.8, M.cabinet); box(6, 11.5, G + 3, G + 3.15, 26.5, 28.8, M.counter);
    box(0.4, 16.6, G, G + 7, 34.2, 35.1, M.wood); box(0.4, 1.4, G, G + 7, 31.6, 34.2, M.wood);   // store shelving
    // NE courtyard: tulsi planter, water feature
    box(7, 10, G, G + 2.4, 38.5, 41.5, M.stone);
    box(1, 5.5, G, G + 0.8, 40, 44.4, M.stone); box(1.3, 5.2, G + 0.2, G + 0.7, 40.3, 44.1, M.water, nc);
    // dining
    f.table(19.5, 25.5, 23.5, 28.5);
    for (const [x, z] of [[19.8, 22.3], [22, 22.3], [24.2, 22.3], [19.8, 28.7], [22, 28.7], [24.2, 28.7]]) box(x, x + 1.4, G, G + 1.5, z, z + 1.2, M.fabric2);
    // living: seating on the south/west, facing north/east
    f.sofa(24, 33, 34, 37, 'S');
    f.sofa(35, 37.6, 36, 43, 'W', M.fabric2);
    f.table(25.5, 31.5, 38.5, 41.5, 1.4);
    box(30.5, 37.5, G, G + 1.8, 43.8, 44.6, M.wood);
    // pooja altar on the east wall
    box(17.4, 18.4, G, G + 3, 40, 44, M.wood); box(17.5, 17.9, G + 3, G + 5, 41.2, 42.8, M.brass, nc);
    // bedroom 2 (NW guest): head to the south
    f.bed(41, 47, 30.3, 37.3, 'S');
    f.wardrobe(38.3, 39.2, 36, 44.6);
    f.toilet(50.5, 43.8); f.vanity(46.3, 47.8, 40, 44.5);

    // ================= furniture, first floor
    f = h.furnish(F);
    f.sofa(22, 32, 7.5, 10.5, 'N');                                      // view lounge: facing the mountains
    box(33.5, 36, F, F + 2.8, 3, 5.5, M.fabric2); box(20, 22.5, F, F + 2.8, 1.5, 4, M.fabric2);
    f.table(24.5, 29.5, 3, 5.5, 1.4);
    box(17.5, 18.2, F, F + 7, 3, 14, M.wood);                             // library wall (east)
    f.bed(44.5, 51.6, 3.8, 10.2, 'W');                                    // master: head to the west
    f.wardrobe(38.3, 44.7, 21.2, 21.8);
    f.toilet(50.5, 20.5); f.vanity(45.3, 46.8, 17, 21.5);
    f.bed(41, 47, 30.6, 37.6, 'S');                                       // bedroom 4 (NW)
    f.wardrobe(38.3, 39.2, 36.5, 44.6);
    f.toilet(50.5, 43.8); f.vanity(46.3, 47.8, 40, 44.5);
    f.sofa(31, 34, 36, 43, 'W', M.fabric2);                               // TV nook looking over the void
    box(34.5, 37.5, F, F + 5.5, 44.1, 44.7, M.wood);
    box(12, 13.5, F, F + 2.8, 29.5, 31, M.fabric2); box(12, 13.5, F, F + 2.8, 32.5, 34, M.fabric2);   // terrace seating
    f.table(12.2, 13.3, 31.2, 32.3, 1.8);
  },
});
