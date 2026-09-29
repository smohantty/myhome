/* V3 — from the ground-floor sketch in plans/v3-ground-floor-sketch.jpg.
   - Main entrance on the FRONT (south, main road, mountain view) between the garage and the front bedroom.
   - Front block: garage (east half, car from the main road) | foyer | bedroom + bath (west half).
   - Back: kitchen + store room on the side-road side, which is completely closed (no openings or
     design elements on the east wall); dining open to the kitchen; double-height living with pooja;
     second bedroom + bath on the west; dog-leg stair between the two west bedrooms.
   - Kitchen/store wing is single storey with a roof terrace (solid parapet on the side road) and a skylight.
   - First floor: 2 bedrooms, family lounge on the front balcony, large upper lounge + gallery over the living.
   Units/axes as v1: feet, +x = WEST, +z = NORTH, origin = SE corner of the plot. */
registerDesign({
  id: 'v3',
  name: 'V3 · Sketch layout',
  summary: 'From the new sketch: mountain-facing front entrance between garage and front bedroom, kitchen + store on a fully closed side-road wall, double-height living, 2 bedrooms down + 2 up.',
  levels: { G: 0.5, F: 10.5, R: 20.5 },
  spawn: { x: 31.25, z: -9, yaw: Math.PI },      // on the footpath, facing the front door
  center: { x: 32, z: 24 },

  renders: [
    { file: 'renders/front.png', title: 'Front', caption: 'Mountain-facing entrance front from the main road' },
    { file: 'renders/entry.png', title: 'Front door', caption: 'Porch between the garage and the front bedroom' },
    { file: 'renders/side.png', title: 'Side road', caption: 'Closed side-road wall: kitchen and store behind' },
    { file: 'renders/living.png', title: 'Living room', caption: 'Double-height living towards the dining and kitchen' },
  ],

  rooms: [
    // ground floor
    { n: 'Garage', lv: 0, r: [17, 28, 0, 20], f: 'garage', d: "11'×20' · from main road" },
    { n: 'Foyer', lv: 0, r: [28, 34, 0, 12], f: 'stone', d: 'main door · mountain view' },
    { n: 'Bedroom 1', lv: 0, r: [34, 52, 0, 15], f: 'wood', d: "18'×15' · front · SW" },
    { n: 'Dress 1', lv: 0, r: [38, 45, 15, 22], f: 'wood', noLabel: true },
    { n: 'Bath 1', lv: 0, r: [45, 52, 15, 22], f: 'bath', noLabel: true },
    { n: 'Hall', lv: 0, r: [28, 34, 12, 15], f: 'lobby', extra: [[28, 38, 15, 33]] },
    { n: 'Kitchen', lv: 0, r: [0, 17, 22, 33], f: 'kitchen', d: "17'×11' · skylight" },
    { n: 'Store room', lv: 0, r: [0, 17, 33, 45], f: 'garage', d: "17'×12' · NE" },
    { n: 'Dining', lv: 0, r: [17, 28, 20, 33], f: 'living', d: "11'×13' · open kitchen" },
    { n: 'Living', lv: 0, r: [23, 38, 33, 45], f: 'living', d: 'double height', extra: [[17, 23, 33, 39]] },
    { n: 'Pooja', lv: 0, r: [17, 23, 39, 45], f: 'pooja', d: "6'×6'" },
    { n: 'Stair', lv: 0, r: [38, 52, 22, 30], f: 'lobby', noFloor: true, noLabel: true },
    { n: 'Bedroom 2', lv: 0, r: [38, 52, 30, 45], f: 'wood', d: "14'×15' · NW" },
    { n: 'Bath 2', lv: 0, r: [46, 52, 38, 45], f: 'bath', noLabel: true },
    // first floor
    { n: 'Front balcony', lv: 1, r: [17, 52, -4, 0], f: 'stone', d: 'mountain view' },
    { n: 'Bedroom 4', lv: 1, r: [17, 28, 0, 16], f: 'wood', d: "11'×16' · SE" },
    { n: 'DR', lv: 1, r: [17, 21, 16, 21], f: 'wood', noLabel: true },
    { n: 'Bath 4', lv: 1, r: [21, 28, 16, 21], f: 'bath', noLabel: true },
    { n: 'Family lounge', lv: 1, r: [28, 38, 0, 18], f: 'wood', d: "10'×18' · on the balcony" },
    { n: 'Bedroom 3', lv: 1, r: [38, 52, 0, 15], f: 'wood', d: "14'×15' · SW master" },
    { n: 'Dress 3', lv: 1, r: [38, 45, 15, 22], f: 'wood', noLabel: true },
    { n: 'Bath 3', lv: 1, r: [45, 52, 15, 22], f: 'bath', noLabel: true },
    { n: 'Gallery', lv: 1, r: [17, 38, 21, 33], f: 'lobby', extra: [[28, 38, 18, 21], [38, 40, 22, 30]] },
    { n: 'Upper lounge / TV', lv: 1, r: [38, 52, 30, 45], f: 'lobby', d: 'over bedroom 2', extra: [[30, 38, 33, 45]] },
    { n: 'Terrace', lv: 1, r: [0, 17, 22, 45], f: 'stone', d: 'over kitchen + store' },
  ],
  voids: [[17, 30, 33, 45]],
  minimap: { stair: [[40, 28], [50, 28], [50, 24], [41, 24]], voidLabel: [23.5, 38] },

  build(h) {
    const { G, F, R, RT, EXT, INT, M, box, wall, door, win, tall, slide, railing } = h;
    const PAR = F + 4;                              // solid terrace parapet on the closed side-road wing

    // ---------------- slabs
    box(17, 52, 0, G, 0, 45, M.plinth);
    box(0, 17, 0, G, 22, 45, M.plinth);
    // first floor: main block minus stair hole (40..52 × 22..30) and living void (17..30 × 33..45)
    for (const [x1, x2, z1, z2] of [[17, 52, 0, 22], [17, 40, 22, 30], [17, 52, 30, 33], [30, 52, 33, 45]])
      box(x1, x2, F - 0.5, F, z1, z2, M.slab);
    // wing roof = terrace floor, with a skylight over the kitchen
    for (const [x1, x2, z1, z2] of [[0, 17, 22, 26], [0, 5, 26, 29], [11, 17, 26, 29], [0, 17, 29, 45]])
      box(x1, x2, F - 0.5, F, z1, z2, M.slab);
    box(4.7, 11.3, F - 0.5, F + 0.9, 25.7, 26, M.slab); box(4.7, 11.3, F - 0.5, F + 0.9, 29, 29.3, M.slab);  // skylight upstand
    box(4.7, 5, F - 0.5, F + 0.9, 26, 29, M.slab); box(11, 11.3, F - 0.5, F + 0.9, 26, 29, M.slab);
    box(5, 11, F + 0.8, F + 0.9, 26, 29, M.glass);
    box(17, 52, F - 0.5, F, -4, 0, M.slab);       // front balcony = porch roof
    box(17, 52, R, RT, 0, 45, M.slab);            // main roof

    // ---------------- exterior walls
    // South (main road, mountains): garage shutter, MAIN DOOR, big bedroom window
    wall('x', 0, 17, 52, 0, F, EXT,
      [{ a: 18, b: 27, s: 0, h: 8.5, kind: 'open' }, door(29.5, 33), tall(33.2, 33.7, G + 0.5, G + 7.5), tall(37, 50, G + 2, G + 7.5)], M.extWall);
    box(18, 27, 0, 8.5, -0.55, -0.4, M.shutter);                           // closed rolling shutter
    wall('x', 0, 17, 52, F, RT, EXT, [slide(19, 26), slide(29, 37), slide(40, 50)], M.extWall);
    wall('z', 52, 0, 45, 0, RT, EXT, [], M.extWall);                      // west (neighbour side)
    wall('z', 17, 0, 22, 0, RT, EXT, [], M.extWall);                      // against the 2-storey neighbour
    // Side road (east): COMPLETELY CLOSED — plain wall up to a solid terrace parapet
    wall('z', 0, 22, 45, 0, PAR, EXT, [], M.extWall);
    wall('x', 22, 0, 17 - EXT / 2, 0, PAR, EXT, [], M.extWall);          // wing | neighbour
    wall('x', 45, 0, 17 - EXT / 2, 0, PAR, EXT, [win(7, 10, G, 6, 7.5)], M.extWall);   // store: small high vent (north)
    // gallery / living void | terrace: door out, tall glass lighting the double-height living
    wall('z', 17, 22, 45, F, RT, EXT, [slide(24, 29), tall(35, 43, F + 1, F + 8.5)], M.extWall);
    // North: double-height glass to the living, windows to bedroom 2 and the upper lounge
    wall('x', 45, 17 + EXT / 2, 30, 0, RT, EXT, [tall(19, 29, 1.5, 19.5)], M.extWall);
    wall('x', 45, 30, 52, 0, F, EXT, [win(31.5, 36.5), win(41, 45)], M.extWall);
    wall('x', 45, 30, 52, F, RT, EXT, [win(32, 37, F), win(41, 48, F)], M.extWall);
    // main roof parapet
    const P0 = RT, P1 = RT + 3;
    wall('x', 0, 17, 52, P0, P1, 0.5, [], M.parapet);
    wall('z', 52, 0, 45, P0, P1, 0.5, [], M.parapet);
    wall('x', 45, 17, 52, P0, P1, 0.5, [], M.parapet);
    wall('z', 17, 0, 45, P0, P1, 0.5, [], M.parapet);
    // balcony railing
    railing('x', -4, 17, 52, F);
    railing('z', 17, -4, 0, F);
    railing('z', 52, -4, 0, F);

    // ---------------- ground floor interior
    const g0 = G, g1 = F - 0.5;
    wall('z', 28, 0, 20, g0, g1, INT, [door(6, 9)]);                      // garage | foyer & hall (house door)
    wall('x', 20, 17, 28, g0, g1, INT);                                   // garage | dining
    wall('z', 34, 0, 15, g0, g1, INT, [door(12.2, 14.8)]);                // foyer/hall | bedroom 1
    wall('x', 15, 34, 38, g0, g1, INT);                                   // bedroom 1 | hall
    wall('x', 15, 38, 52, g0, g1, INT, [door(40, 43)]);                   // bedroom 1 | dress
    wall('z', 38, 15, 22, g0, g1, INT);                                   // dress | hall
    wall('z', 45, 15, 22, g0, g1, INT, [door(16.5, 19)]);                 // dress | bath
    wall('x', 22, 38, 52, g0, g1, INT);                                   // suite | stair
    wall('x', 30, 38, 52, g0, g1, INT);                                   // stair | bedroom 2
    wall('z', 38, 30, 45, g0, g1, INT, [door(31, 34)]);                   // bedroom 2 door
    wall('x', 38, 46, 52, g0, g1, INT, [door(47, 49.8)]);                 // bath 2
    wall('z', 46, 38, 45, g0, g1, INT);
    wall('z', 17, 22, 45, g0, F, EXT, [door(23.5, 31.5), door(35, 38)]);  // wing: wide kitchen opening + store door
    wall('x', 33, 0, 17 - EXT / 2, g0, g1, INT);                          // kitchen | store
    // pooja (own low ceiling under the double height)
    wall('z', 23, 39, 45, g0, 9, INT, [], M.cabinet);
    wall('x', 39, 17, 23, g0, 9, INT, [door(18.5, 21.5)], M.cabinet);
    box(17, 23, 9, 9.4, 39, 45, M.cabinet);

    // ---------------- dog-leg stair, 18 risers (between the two west bedrooms)
    const RISE = (F - G) / 18;
    for (let i = 0; i < 8; i++) box(40 + i, 41 + i, G, G + (i + 1) * RISE, 26.2, 30, M.tread);
    box(48, 52, G, G + 9 * RISE, 22, 30, M.tread);
    for (let i = 0; i < 8; i++) box(47 - i, 48 - i, G, G + 9 * RISE + (i + 1) * RISE, 22, 25.8, M.tread);
    box(40, 48, G, 9.0, 25.8, 26.2, M.wall);
    railing('z', 40, 26.2, 30, F);

    // ---------------- first floor interior
    const f0 = F, f1 = R;
    wall('z', 28, 0, 21, f0, f1, INT);                                    // bedroom 4 | family lounge
    wall('x', 16, 17, 28, f0, f1, INT, [door(17.6, 20.4, F)]);            // bedroom 4 | DR
    wall('z', 21, 16, 21, f0, f1, INT, [door(17, 20, F)]);                // DR | bath
    wall('x', 21, 17, 28, f0, f1, INT, [door(17.6, 20.4, F)]);            // DR | gallery
    box(28, 30, f0, f1, 17.8, 18.2, M.wall); box(36, 38, f0, f1, 17.8, 18.2, M.wall);   // lounge wall stubs
    wall('z', 38, 0, 22, f0, f1, INT, [door(16.5, 19, F)]);               // into dress 3
    wall('x', 15, 38, 52, f0, f1, INT, [door(40, 43, F)]);
    wall('z', 45, 15, 22, f0, f1, INT, [door(17, 19.8, F)]);
    wall('x', 22, 38, 52, f0, f1, INT);
    wall('x', 30, 40, 52, f0, f1, INT);                                   // stair | TV lounge
    railing('x', 33, 17, 30, F);                                          // void edges
    railing('z', 30, 33, 45, F);

    // ---------------- furniture, ground floor
    let f = h.furnish(G);
    // garage: car nose-in from the main road
    box(19.6, 25.4, G + .6, G + 2.9, 2, 16, M.car); box(20, 25, G + 2.9, G + 4.6, 5.5, 12.5, M.car);
    for (const [x, z] of [[19.4, 4], [25.2, 4], [19.4, 13], [25.2, 13]]) box(x, x + .4, G, G + 1.4, z - 1, z + 1, M.dark, { collide: false });
    // foyer: shoe cabinet + bench
    box(32.9, 33.6, G, G + 3.2, 2.5, 10, M.wood);
    box(28.4, 29.6, G, G + 1.5, 9.5, 11.8, M.wood);
    // bedroom 1 suite (front, mountain view)
    f.bed(44.5, 51.6, 4, 10.5, 'W');
    box(49, 51.6, G, G + 2, 1.3, 3.5, M.wood); box(49, 51.6, G, G + 2, 11, 13.2, M.wood);
    box(35, 37.5, G, G + 2.8, 3, 5.5, M.fabric2);                         // reading chair by the window
    f.wardrobe(38.3, 44.7, 21.2, 21.8);
    f.toilet(50.5, 20.5); f.vanity(45.3, 46.8, 17, 21.5);
    // kitchen (no windows on the side road: skylight above, open to the dining)
    box(0.4, 2.4, G, G + 2.9, 22.4, 32.6, M.cabinet); box(0.4, 2.4, G + 2.9, G + 3.05, 22.4, 32.6, M.counter);
    box(2.4, 12, G, G + 2.9, 22.4, 24.4, M.cabinet); box(2.4, 12, G + 2.9, G + 3.05, 22.4, 24.4, M.counter);
    box(0.4, 1.6, G + 5, G + 7.3, 22.4, 32.6, M.cabinet, { collide: false });
    box(12.5, 14.8, G, G + 6.2, 22.4, 24.6, M.white);                   // fridge
    box(6, 11.5, G, G + 3, 27.5, 30, M.cabinet); box(6, 11.5, G + 3, G + 3.15, 27.5, 30, M.counter);   // island
    // store room shelving
    box(0.4, 2.2, G, G + 7, 33.6, 44.6, M.wood); box(2.2, 16.6, G, G + 7, 43, 44.6, M.wood);
    // dining
    f.table(19.5, 25.5, 24, 29);
    for (const [x, z] of [[19.8, 22.8], [22, 22.8], [24.2, 22.8], [19.8, 29.2], [22, 29.2], [24.2, 29.2]]) box(x, x + 1.4, G, G + 1.5, z, z + 1.2, M.fabric2);
    // living (double height)
    f.sofa(24, 33, 34, 37, 'S');
    f.sofa(35, 37.6, 36, 43, 'W', M.fabric2);
    f.table(25.5, 31.5, 38.5, 41.5, 1.4);
    box(30.5, 37.5, G, G + 1.8, 43.8, 44.6, M.wood);                     // console under the north window
    // pooja altar
    box(17.5, 22.5, G, G + 3, 43.8, 44.6, M.wood); box(19.2, 20.8, G + 3, G + 5, 44, 44.4, M.brass, { collide: false });
    // bedroom 2
    f.bed(41, 47, 30.3, 37.3, 'S');
    f.wardrobe(38.3, 39.2, 36, 44.6);
    f.toilet(50.5, 43.8); f.vanity(46.3, 47.8, 40, 44.5);

    // ---------------- furniture, first floor
    f = h.furnish(F);
    f.bed(22, 27.6, 5, 11, 'W');                                          // bedroom 4
    box(17.4, 18.8, F, F + 2.5, 9, 14, M.wood);
    f.toilet(27, 20); f.vanity(21.3, 22.8, 17, 20.6);
    f.sofa(28.8, 37.2, 12, 15, 'N');                                      // family lounge
    f.table(30.5, 35.5, 7.5, 10, 1.4);
    f.bed(44.5, 51.6, 3.8, 10.2, 'W');                                    // bedroom 3
    f.wardrobe(38.3, 44.7, 21.2, 21.8);
    f.toilet(50.5, 20.5); f.vanity(45.3, 46.8, 17, 21.5);
    // upper lounge / TV
    box(41, 49, F, F + 1.6, 30.3, 31.4, M.wood);
    box(42, 48, F + 2.4, F + 5.8, 30.4, 30.55, M.dark, { collide: false });
    f.sofa(40, 50, 40.5, 43.5, 'N');
    f.sofa(49, 51.8, 33, 40, 'W', M.fabric2);
    f.table(42.5, 47.5, 35.5, 38.5, 1.4);
    f.sofa(31, 34, 36, 43, 'W', M.fabric2);                               // reading nook facing the void
    box(34.5, 37.5, F, F + 7, 44.1, 44.7, M.wood);                        // bookshelf
    // terrace (over kitchen + store): seating and planters
    box(3, 4.5, F, F + 2.8, 34, 35.5, M.fabric2); box(3, 4.5, F, F + 2.8, 38, 39.5, M.fabric2);
    f.table(3.2, 4.3, 35.9, 37.6, 1.8);
    // balcony chairs
    box(31, 32.5, F, F + 2.8, -3, -1.5, M.fabric2); box(33.5, 35, F, F + 2.8, -3, -1.5, M.fabric2);
    f.table(32.6, 33.4, -2.6, -1.9, 1.8);
  },
});
