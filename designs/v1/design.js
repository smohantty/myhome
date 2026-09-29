/* V1 — the original hand sketch (site plan + ground/first floor drawings in /plans).
   Units: feet. Axes follow the drawings: +x = WEST (right on the plan), +z = NORTH (down on the plan).
   Origin = SE corner of the plot (the neighbour's cut-out corner). Main road at z < 0, side road at x < 0.

   To make a new version: copy this folder to designs/vN, change id/name below, edit the layout,
   and add 'vN' to designs/manifest.js. */
registerDesign({
  id: 'v1',
  name: 'V1 · Original sketch',
  summary: 'Dog-leg stair by the lobby, double-height NE living, 2 bedrooms per floor, front balcony facing the mountains.',
  levels: { G: 0.5, F: 10.5, R: 20.5 },          // ground floor, first floor, underside of roof (ft)
  spawn: { x: -8, z: 33, yaw: -Math.PI / 2 },   // walk mode starts outside the main door, facing it
  center: { x: 30, z: 25 },                     // "jump to room" looks from here outward

  renders: [
    { file: 'renders/front.png', title: 'Front', caption: 'South elevation from the main road' },
    { file: 'renders/corner.png', title: 'Corner', caption: '3/4 view from the south-west' },
    { file: 'renders/entry.png', title: 'Main entrance', caption: 'East side, from the side road' },
    { file: 'renders/living.png', title: 'Living room', caption: 'Double-height living, looking back at the main door' },
  ],

  // floor finish keys: living wood bath kitchen garage pooja stone lobby theatre
  rooms: [
    // ground floor
    { n: 'Kitchen', lv: 0, r: [17, 27, 0, 13], f: 'kitchen', d: "10'×13' · SE" },
    { n: 'Dining', lv: 0, r: [17, 27, 13, 23], f: 'living', d: "10'×10'" },
    { n: 'Garage', lv: 0, r: [27, 38, 0, 19], f: 'garage', d: "11'×19'" },
    { n: 'WC', lv: 0, r: [27, 32, 19, 24], f: 'bath', d: "5'×5'", noLabel: true },
    { n: 'Lobby', lv: 0, r: [27, 38, 24, 35], f: 'lobby', extra: [[32, 38, 19, 24]] },
    { n: 'Family sitting', lv: 0, r: [27, 38, 35, 45], f: 'living' },
    { n: 'Living', lv: 0, r: [0, 17, 22, 45], f: 'living', d: 'double height · NE', extra: [[17, 27, 23, 45]] },
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
    { n: 'Family lounge', lv: 1, r: [27, 38, 0, 18], f: 'wood', d: "11'×18' · over garage" },
    { n: 'Upper lounge', lv: 1, r: [27, 38, 18, 45], f: 'lobby', d: 'gallery over living', extra: [[38, 40, 22, 30]] },
    { n: 'Bedroom 3', lv: 1, r: [38, 52, 0, 15], f: 'wood', d: "14'×15' · SW master" },
    { n: 'Dress 3', lv: 1, r: [38, 45, 15, 22], f: 'wood', noLabel: true },
    { n: 'Bath 3', lv: 1, r: [45, 52, 15, 22], f: 'bath', noLabel: true },
    { n: 'Home theatre / study', lv: 1, r: [38, 52, 30, 45], f: 'theatre', d: "14'×15' · NW" },
    { n: 'Bath (theatre)', lv: 1, r: [46, 52, 38, 45], f: 'bath', noLabel: true },
  ],
  voids: [[0, 17, 22, 45], [17, 27, 29, 45]],          // double-height, shown on the first-floor minimap
  minimap: { stair: [[40, 28], [50, 28], [50, 24], [41, 24]], voidLabel: [12, 38] },

  build(h) {
    const { G, F, R, RT, EXT, INT, M, box, wall, door, win, tall, slide, railing } = h;

    // ---------------- slabs
    box(17, 52, 0, G, 0, 45, M.plinth);          // main block plinth
    box(0, 17, 0, G, 22, 45, M.plinth);          // east wing plinth
    // first-floor slab minus the double-height void and the stair hole
    for (const [x1, x2, z1, z2] of [[17, 52, 0, 22], [17, 27, 22, 29], [27, 40, 22, 30], [27, 52, 30, 45]])
      box(x1, x2, F - 0.5, F, z1, z2, M.slab);
    box(17, 52, F - 0.5, F, -4, 0, M.slab);      // balcony slab
    box(17, 52, R, RT, 0, 45, M.slab);           // roof
    box(0, 17, R, RT, 22, 45, M.slab);

    // ---------------- exterior walls
    // South (road), ground floor: kitchen window, garage shutter, master window
    wall('x', 0, 17, 52, 0, F, EXT, [win(19, 25), { a: 28, b: 37, s: 0, h: 8.5, kind: 'open' }, win(40, 50)], M.extWall);
    box(28, 37, 8.5, 9.4, -0.8, -0.2, M.shutter);                        // shutter rolled up
    // South, first floor: sliding doors to the front balcony
    wall('x', 0, 17, 52, F, RT, EXT, [slide(19, 25), slide(28.5, 36.5), slide(40, 50)], M.extWall);
    wall('z', 52, 0, 45, 0, RT, EXT, [], M.extWall);                     // west (neighbour side)
    wall('z', 17, 0, 22, 0, RT, EXT, [], M.extWall);                     // against the 2-storey neighbour
    wall('x', 22, 0, 17 - EXT / 2, 0, RT, EXT, [], M.accent);
    // East (side road): double-height wing with tall glazing + main door
    wall('z', 0, 22, 45, 0, RT, EXT, [tall(23, 29, 1.5, 19.5), door(31, 35), tall(36, 38.5, 1.5, 19.5)], M.accent);
    wall('x', 45, 0, 17 - EXT / 2, 0, RT, EXT, [tall(8, 16, 1.5, 19.5)], M.accent);   // north, wing
    wall('x', 45, 17 + EXT / 2, 52, 0, F, EXT, [tall(18, 26, 1.5, 9.5), win(29, 36), win(41, 45)], M.extWall);
    wall('x', 45, 17 + EXT / 2, 52, F, RT, EXT, [tall(18, 26, F + 1, F + 9), win(29, 36, F), win(41, 45, F)], M.extWall);

    // parapet
    const P0 = RT, P1 = RT + 3;
    wall('x', 0, 17, 52, P0, P1, 0.5, [], M.parapet);
    wall('z', 52, 0, 45, P0, P1, 0.5, [], M.parapet);
    wall('x', 45, 0, 52, P0, P1, 0.5, [], M.parapet);
    wall('z', 0, 22, 45, P0, P1, 0.5, [], M.parapet);
    wall('x', 22, 0, 17, P0, P1, 0.5, [], M.parapet);
    wall('z', 17, 0, 22, P0, P1, 0.5, [], M.parapet);

    // balcony railing
    railing('x', -4, 17, 52, F);
    railing('z', 17, -4, 0, F);
    railing('z', 52, -4, 0, F);

    // ---------------- ground floor interior
    const g0 = G, g1 = F - 0.5;
    wall('z', 27, 0, 24, g0, g1, INT);                                    // kitchen/dining | garage, WC
    wall('x', 13, 17, 27, g0, g1, INT, [door(18.5, 25.5)]);               // kitchen | dining (wide opening)
    wall('x', 19, 27, 38, g0, g1, INT, [door(33, 36)]);                   // garage | lobby
    wall('z', 32, 19, 24, g0, g1, INT, [door(20, 22.8)]);                 // WC door
    wall('x', 24, 27, 32, g0, g1, INT);
    wall('z', 38, 0, 22, g0, g1, INT, [door(19.2, 21.8)]);                // master suite entry (via dress)
    wall('z', 38, 30, 45, g0, g1, INT, [door(31, 34)]);                   // bedroom 2 door
    wall('x', 15, 38, 52, g0, g1, INT, [door(40, 43)]);                   // master | dress
    wall('z', 45, 15, 22, g0, g1, INT, [door(16.5, 19)]);                 // dress | bath
    wall('x', 22, 38, 52, g0, g1, INT);                                   // suite | stair
    wall('x', 30, 38, 52, g0, g1, INT);                                   // stair | bedroom 2
    wall('x', 38, 46, 52, g0, g1, INT, [door(47, 49.8)]);                 // bath 2
    wall('z', 46, 38, 45, g0, g1, INT);
    // pooja (own low ceiling inside the double-height living)
    wall('x', 39, 0, 6, g0, 9, INT, [door(1.5, 4.5)], M.cabinet);
    wall('z', 6, 39, 45, g0, 9, INT, [], M.cabinet);
    box(0, 6, 9, 9.4, 39, 45, M.cabinet);

    // ---------------- dog-leg stair, 18 risers
    const RISE = (F - G) / 18;
    for (let i = 0; i < 8; i++) box(40 + i, 41 + i, G, G + (i + 1) * RISE, 26.2, 30, M.tread);        // flight 1 → west
    box(48, 52, G, G + 9 * RISE, 22, 30, M.tread);                                                        // landing
    for (let i = 0; i < 8; i++) box(47 - i, 48 - i, G, G + 9 * RISE + (i + 1) * RISE, 22, 25.8, M.tread); // flight 2 → east
    box(40, 48, G, 9.0, 25.8, 26.2, M.wall);                                                               // centre wall
    railing('z', 40, 26.2, 30, F);                                                                         // guard at top

    // ---------------- first floor interior
    const f0 = F, f1 = R;
    wall('z', 27, 0, 21, f0, f1, INT);                                    // bedroom 4 | family lounge
    wall('x', 16, 17, 27, f0, f1, INT, [door(17.6, 20.4, F)]);            // bedroom 4 | DR
    wall('z', 21, 16, 21, f0, f1, INT, [door(17, 20, F)]);                // DR | bath
    wall('x', 21, 17, 27, f0, f1, INT, [door(17.6, 20.4, F)]);            // DR | gallery
    box(27, 29, f0, f1, 17.8, 18.2, M.wall); box(36, 38, f0, f1, 17.8, 18.2, M.wall); // lounge wall stubs
    wall('z', 38, 0, 22, f0, f1, INT, [door(16.5, 19, F)]);               // into dress 3
    wall('z', 38, 30, 45, f0, f1, INT, [door(31, 34, F)]);                // theatre door
    wall('x', 15, 38, 52, f0, f1, INT, [door(40, 43, F)]);
    wall('z', 45, 15, 22, f0, f1, INT, [door(17, 19.8, F)]);
    wall('x', 22, 38, 52, f0, f1, INT);
    wall('x', 30, 38, 52, f0, f1, INT);
    wall('x', 38, 46, 52, f0, f1, INT, [door(47, 49.8, F)]);
    wall('z', 46, 38, 45, f0, f1, INT);
    // railings around the double-height void
    railing('x', 29, 17, 27, F);
    railing('z', 27, 29, 45, F);
    railing('z', 17, 22, 29, F);

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
    // garage: car
    box(29.6, 35.4, G + .6, G + 2.9, 2, 16, M.car); box(30, 35, G + 2.9, G + 4.6, 5.5, 12.5, M.car);
    for (const [x, z] of [[29.4, 4], [35.2, 4], [29.4, 13], [35.2, 13]]) box(x, x + .4, G, G + 1.4, z - 1, z + 1, M.dark, { collide: false });
    f.toilet(29.5, 23);                                                  // WC
    // living (double height)
    f.sofa(5, 14, 26.5, 29.5, 'S');
    f.sofa(14.5, 17.5, 30, 36, 'W', M.fabric2);
    f.table(7, 12, 31.5, 34.5, 1.4);
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
    f.sofa(28.2, 31.2, 36, 43, 'E', M.fabric2);                           // upper lounge
    box(37, 37.8, F, F + 7, 36, 44.5, M.wood);                            // bookshelf
    f.bed(44.5, 51.6, 3.8, 10.2, 'W');                                    // bedroom 3
    f.wardrobe(38.3, 44.7, 21.2, 21.8);
    f.toilet(50.5, 20.5); f.vanity(45.3, 46.8, 17, 21.5);
    box(40, 50, F + 1.8, F + 7.2, 30.25, 30.4, M.dark, { collide: false }); // theatre screen
    for (let i = 0; i < 3; i++) f.sofa(39.5 + i * 2.2, 41.5 + i * 2.2, 35.5, 38.2, 'N', M.dark);
    box(38.5, 42.5, F, F + 2.5, 42.5, 44.5, M.wood);                      // study desk
    f.toilet(50.5, 43.8); f.vanity(46.3, 47.8, 40, 44.5);
    // balcony chairs
    box(33, 34.5, F, F + 2.8, -3, -1.5, M.fabric2); box(35.5, 37, F, F + 2.8, -3, -1.5, M.fabric2);
    f.table(34.6, 35.4, -2.6, -1.9, 1.8);
  },
});
