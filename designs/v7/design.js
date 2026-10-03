/* V7 — Odisha modern: the V6 plan built as a tropical-modern concrete house for Chandikhole, Odisha
   (hot-humid, heavy SW monsoon, Bay of Bengal cyclones; see the Site section of the README).
   Same 4BHK Vastu plan as V6 on site plan v2 (plans/site-plan-v2.png, plans/house-plan-v7.png): S4 main door
   flush on the front beside an open carport (SE), master SW, kitchen in the east wing, pooja in the true NE
   corner of the terrace, floating winder stair in the south climbing clockwise.
   What changes is the architecture, for the climate:
   · a floating board-formed concrete parasol roof over the main block (a ventilated second roof that keeps the
     sun off the main slab and shades the south and west faces; the main block stays tallest in the SW)
   · red Odisha laterite on the ground floor, white lime render above, exposed concrete slab bands
   · deep concrete window hoods on the south, teak fins against the low west sun, a terracotta jaali over the
     south stair window that lets the breeze and light through but not the glare
   · plinth raised to 1½' for monsoon water, ceilings 11' for the heat, a cantilevered concrete canopy over the
     door, roof spouts, a laterite compound wall with the gate
   Units/axes as v1: feet, +x = WEST, +z = NORTH, origin = SE corner of the plot. */
registerDesign({
  id: 'v7',
  name: 'V7 · Odisha modern',
  summary: 'The V6 Vastu plan built for Chandikhole\'s climate: floating concrete parasol roof, red laterite base, white lime render, deep concrete hoods, terracotta jaali over the stair, teak fins on the west, raised plinth and 11\' ceilings. Open carport SE, S4 main door, 1 bedroom down (SW) + 3 up, pooja NE.',
  levels: { G: 1.5, F: 12.5, R: 23.5 },
  spawn: { x: 31, z: -9, yaw: Math.PI },          // on the footpath, facing the gate and the main door
  center: { x: 33, z: 29 },
  renders: [
    { file: 'renders/front.png', title: 'Front', caption: 'Laterite base, lime-white upper floor, concrete hoods, terracotta jaali, floating parasol roof' },
    { file: 'renders/corner.png', title: 'Front 3/4', caption: 'From the south-west: teak fins against the afternoon sun' },
    { file: 'renders/entry.png', title: 'Entry', caption: 'Laterite compound wall, steps up the raised plinth, concrete canopy over the S4 door' },
    { file: 'renders/living.png', title: 'Living', caption: 'Teak TV wall, ceiling fan, floating stair beyond' },
    { file: 'renders/aerial.png', title: 'Aerial', caption: 'Parasol roof over the main block; NE terrace with pergola and pooja kept low' },
  ],

  rooms: [
    // ground floor
    { n: 'Open garage', lv: 0, r: [18, 28.5, 15, 33], f: 'garage', d: "carport · 10½'×18' · SE", at: [27.5, 22] },
    { n: 'Foyer', lv: 0, r: [28.5, 32.5, 15, 26], f: 'stone', d: "4'×11' · S4 main door" },
    { n: 'Stair', lv: 0, r: [32.5, 39, 15, 24.5], f: 'lobby', noFloor: true, noLabel: true, at: [34.1, 25.4] },
    { n: 'Bedroom 1', lv: 0, r: [39, 51, 15, 27.5], f: 'wood', d: "12'×12½' · SW · parents" },
    { n: 'Attached bath', lv: 0, r: [45.5, 51, 27.5, 35.5], f: 'bath', noLabel: true },
    { n: 'Common bath', lv: 0, r: [45.5, 51, 35.5, 44], f: 'bath', d: 'guests' },
    { n: 'Living', lv: 0, r: [28.5, 39, 26, 44], f: 'living', d: "17'×16½' · open to dining", extra: [[39, 45.5, 27.5, 44], [32.5, 39, 24.5, 26]] },
    { n: 'Dining', lv: 0, r: [18, 28.5, 33, 44], f: 'living', d: "10½'×11'" },
    { n: 'Kitchen', lv: 0, r: [4, 18, 23, 36], f: 'kitchen', d: "14'×13' · E wing · cook faces east" },
    { n: 'Store', lv: 0, r: [4, 11, 36, 44], f: 'garage', d: 'pantry · keep light' },
    { n: 'Utility', lv: 0, r: [11, 18, 36, 44], f: 'bath', d: 'wash' },
    // first floor
    { n: 'Bedroom 3', lv: 1, r: [18, 28.5, 15, 26], f: 'wood', d: "10½'×11' · over the carport" },
    { n: 'Bath 3', lv: 1, r: [18, 23, 26, 33], f: 'bath', noLabel: true },
    { n: 'Gallery', lv: 1, r: [28.5, 32.5, 15, 26], f: 'lobby', noLabel: true },
    { n: 'Master bedroom', lv: 1, r: [39, 51, 15, 26], f: 'wood', d: "12'×11' · SW" },
    { n: 'Dress', lv: 1, r: [42.5, 46.5, 26, 33], f: 'wood', noLabel: true },
    { n: 'Master bath', lv: 1, r: [46.5, 51, 26, 33], f: 'bath', noLabel: true, at: [49.7, 28.4] },
    { n: 'Family lounge', lv: 1, r: [23, 42.5, 26, 33], f: 'lobby', d: 'TV + reading', extra: [[28.5, 39, 33, 38], [28.5, 33, 38, 44], [32.5, 39, 24.5, 26]] },
    { n: 'Bath 4', lv: 1, r: [33, 39, 38, 44], f: 'bath', noLabel: true },
    { n: 'Bedroom 4', lv: 1, r: [39, 51, 33, 44], f: 'wood', d: "12'×11' · NW" },
    { n: 'Terrace', lv: 1, r: [4, 18, 23, 38], f: 'stone', d: 'pergola · NE kept open', extra: [[9, 18, 38, 44], [18, 28.5, 33, 44]], at: [7.5, 33] },
    { n: 'Pooja', lv: 1, r: [4, 9, 38, 44], f: 'pooja', d: 'true NE corner' },
  ],
  minimap: { stair: [[34.1, 24], [34.1, 16.5], [37.4, 16.5], [37.4, 24]] },

  build(h) {
    const { G, F, R, RT, EXT, INT, M, box, wall, door, win, tall, slide, railing, blob } = h;
    const PAR = F + 3.5;                            // terrace parapet top
    const PJ = F + 8;                               // pooja roof, kept well below the main block
    const PB = RT + 5.5;                            // underside of the floating parasol roof
    const nc = { collide: false };

    // exterior wall: white inside, a thin outer skin (laterite below, lime render above); out = -1 / +1 toward outside
    function ext(axis, c, a, b, y0, y1, ops, out, skin) {
      wall(axis, c, a, b, y0, y1, EXT, ops, M.wall);
      const e = EXT / 2 + 0.06;
      wall(axis, c + out * e, a - e, b + e, y0, y1, 0.12, ops.map(o => ({ ...o, kind: 'open' })), skin);
    }
    // deep board-formed concrete hood framing a window on the south face (z = 15)
    function hood(a, b, y0, y1, d = 2.2) {
      const z0 = 15 - EXT / 2 - d, z1 = 15 - EXT / 2;
      box(a - 0.5, b + 0.5, y1, y1 + 0.5, z0, z1, M.concrete, nc);
      box(a - 0.5, b + 0.5, y0 - 0.4, y0, z0, z1, M.concrete, nc);
      box(a - 0.5, a, y0, y1, z0, z1, M.concrete, nc); box(b, b + 0.5, y0, y1, z0, z1, M.concrete, nc);
    }

    // ================= site works: compound wall, gate, ramp to the carport, steps to the door
    for (const [a, b] of [[17, 18.3], [33.6, 52]]) {               // laterite compound wall, concrete coping
      box(a, b, 0, 3.4, -0.6, 0, M.laterite); box(a - .05, b + .05, 3.4, 3.65, -0.7, 0.1, M.concrete);
    }
    for (const x of [28.3, 33.1]) box(x, x + .5, 0, 4.4, -0.65, 0.05, M.concrete);   // gate posts
    for (let i = 0; i < 5; i++) box(18.5, 28, 0, (i + 1) * G / 5, 9 + i * 1.2, 15, M.concrete);   // ramp up to the carport
    box(28.8, 32.8, 0, 0.12, 0, 11.5, M.stone);                                    // path to the door
    for (let i = 0; i < 3; i++) box(28.6, 33, 0, (i + 1) * G / 3, 11.5 + i * 1.2, 15, M.stone);   // three steps up
    // garden: coconut palms, a frangipani, a low hedge along the compound wall
    function palm(x, z, ht, lean) {
      for (let i = 0; i < 8; i++) {
        const y = i * ht / 8, dx = lean * (i / 8) ** 2;
        box(x + dx - .32, x + dx + .32, y, y + ht / 8 + .05, z - .32, z + .32, M.trunk);
      }
      const cx = x + lean;
      blob(cx, ht, z, 1.2, 0.8, 1.2, M.leaf);
      for (const [fx, fz] of [[1, 0], [-1, 0], [0, 1], [0, -1], [.7, .7], [-.7, .7], [.7, -.7], [-.7, -.7]])
        blob(cx + fx * 3, ht - 0.8, z + fz * 3, 1.6 + 1.4 * Math.abs(fx), 0.35, 1.6 + 1.4 * Math.abs(fz), M.leaf);
    }
    palm(48.5, 4, 26, 1.5); palm(44.5, 9.5, 21, -1);
    box(39.8, 40.3, 0, 5, 3.3, 3.8, M.trunk); blob(40, 8, 3.5, 3.4, 2.4, 3.4, M.leaf);   // frangipani
    for (let x = 34.5; x < 51.5; x += 2) blob(x, 0.9, 1.2, 1.2, 0.9, 0.8, M.leaf);        // hedge

    // ================= slabs
    box(18, 51, 0, G, 15, 44, M.plinth);
    box(4, 18, 0, G, 23, 44, M.plinth);
    for (const [x1, x2, z1, z2] of [[18, 32.5, 15, 44], [32.5, 39, 24.5, 44], [39, 51, 15, 44], [4, 18, 23, 44]])
      box(x1, x2, F - 0.5, F, z1, z2, M.slab);                           // first floor, minus the stair hole
    box(18, 51, R, RT, 15, 33, M.slab); box(28.5, 51, R, RT, 33, 44, M.slab);   // main roof
    box(3.6, 9.4, PJ, PJ + 0.4, 37.6, 44.4, M.concrete);                // pooja roof
    // exposed concrete slab bands round the main block
    box(17.4, 51.6, F - 0.8, F + 0.2, 14.35, 14.7, M.concrete, nc); box(51.3, 51.65, F - 0.8, F + 0.2, 14.35, 44.65, M.concrete, nc);
    box(17.4, 51.6, R - 0.3, RT + 0.3, 14.35, 14.7, M.concrete, nc); box(51.3, 51.65, R - 0.3, RT + 0.3, 14.35, 44.65, M.concrete, nc);
    box(28.2, 51.6, F - 0.8, F + 0.2, 44.3, 44.65, M.concrete, nc); box(28.2, 51.6, R - 0.3, RT + 0.3, 44.3, 44.65, M.concrete, nc);

    // ================= floating parasol roof: thin concrete slab on slender columns over the main roof
    box(17.2, 51.9, PB, PB + 0.7, 12, 33.5, M.concrete); box(28, 51.9, PB, PB + 0.7, 33.5, 44.7, M.concrete);
    for (const [x, z] of [[18.2, 15.4], [26.2, 15.4], [34.5, 15.4], [42.8, 15.4], [50.4, 15.4], [50.4, 29.5],
      [50.4, 43.6], [39.6, 43.6], [29, 43.6], [29, 33.4], [18.2, 32.6]])
      box(x - .3, x + .3, RT, PB, z - .3, z + .3, M.concrete);
    // roof spouts at the front corners, over pebble pits
    for (const x of [19, 50]) { box(x - .3, x + .3, RT - .2, RT + .3, 12.6, 15, M.concrete, nc); box(x - 1, x + 1, 0, .25, 11, 13, M.stone, nc); }

    // ================= exterior walls
    // south (front): open carport | main door (S4 pada) | stair | bedroom 1
    ext('x', 15, 18, 51, 0, F, [{ a: 18.4, b: 28.1, s: 0, h: F - 0.9, kind: 'open' }, door(29, 32.2), win(33.5, 38, G, 4, 8.5), win(41.5, 48.5, G, 3, 8)], -1, M.laterite);
    ext('x', 15, 18, 51, F, R, [win(20, 27, F, 2, 8.5), win(29, 32, F, 3, 8.5), tall(33.5, 38, F + 1, F + 8.5), win(41.5, 48.5, F, 2, 8.5)], -1, M.render);
    box(27.5, 34, F - 1.6, F - 1.05, 10.8, 14.6, M.concrete, nc);        // cantilevered canopy over the main door
    box(28.6, 32.6, G, F - 0.9, 14.3, 14.5, M.teak, nc);                 // teak-lined door surround
    hood(20, 27, F + 2, F + 8.5); hood(41.5, 48.5, F + 2, F + 8.5);      // deep hoods: bedroom 3, master
    box(41, 49, G + 8, G + 8.4, 12.4, 14.6, M.concrete, nc);             // chajja over bedroom 1
    // terracotta jaali over the stair window: breeze and soft light, no glare
    for (let x = 33.3; x <= 38.3; x += 0.5) box(x - .07, x + .07, G + 3.6, F + 8.7, 14.15, 14.5, M.terracotta, nc);
    for (let y = G + 3.6; y <= F + 8.7; y += 0.5) box(33.2, 38.4, y - .07, y + .07, 14.15, 14.5, M.terracotta, nc);
    // west: high windows below (single-storey neighbour 1' away), teak fins against the afternoon sun above
    ext('z', 51, 15, 44, 0, F, [win(17, 23, G, 3.5, 8), win(29, 31, G, 5.5, 7.5), win(38, 40, G, 5.5, 7.5)], 1, M.laterite);
    ext('z', 51, 15, 44, F, R, [win(17, 23, F), win(28, 30, F, 5.5, 7.5), win(36, 41, F)], 1, M.render);
    for (const [a, b] of [[16.8, 23.3], [35.8, 41.3]]) for (let z = a; z <= b; z += 0.65) box(51.45, 51.95, F + 1, F + 9, z - .09, z + .09, M.teak, nc);
    // north
    ext('x', 44, 4, 51, 0, F, [win(6.5, 9.5, G, 5, 7.5), win(13, 16, G, 5, 7.5), win(21, 26), tall(30, 37, G + 1, G + 8.5), win(47, 49, G, 5.5, 7.5)], 1, M.laterite);
    ext('x', 44, 28.5, 51, F, R, [win(29.5, 32, F), win(34.5, 37, F, 5.5, 7.5), win(42, 48, F)], 1, M.render);
    // east wing: side-road wall with high windows only, and its south wall onto the 1' gap
    ext('z', 4, 23, 44, 0, F, [win(25, 30, G, 4.5, 7.5), door(31, 33.8), win(38, 41, G, 5, 7.5)], -1, M.laterite);
    ext('x', 23, 4, 18, 0, F, [win(7, 13, G, 4.5, 7.5)], -1, M.laterite);
    // against the 2-storey neighbour (east of the carport / bedroom 3)
    ext('z', 18, 15, 23, 0, F, [], -1, M.laterite);
    ext('z', 18, 15, 23, F, RT, [], -1, M.render);
    // first floor walls onto the terrace
    ext('z', 18, 23, 33, F, RT, [win(23.5, 25.5, F), win(28.5, 30.5, F, 5.5, 7.5)], -1, M.render);   // bedroom 3 + bath 3
    ext('x', 33, 18, 28.5, F, RT, [win(19, 21.5, F, 5.5, 7.5), slide(23.6, 28)], 1, M.render);      // bath 3 | lounge → terrace
    ext('z', 28.5, 33, 44, F, RT, [slide(34.5, 37.5), win(39, 43, F)], -1, M.render);              // lounge doors + window onto the terrace
    // terrace parapets (NE kept low) and the pooja room in the NE corner
    wall('z', 4, 23, 38, F, PAR, EXT, [], M.concrete);
    wall('x', 23, 4, 18, F, PAR, EXT, [], M.concrete);
    wall('x', 44, 9, 28.5, F, PAR, EXT, [], M.concrete);
    wall('z', 4, 38, 44, F, PJ, EXT, [win(39.5, 42.5, F, 3, 6.5)], M.render);   // pooja east window: sunrise on the altar
    wall('x', 44, 4, 9, F, PJ, EXT, [], M.render);
    wall('x', 38, 4, 9, F, PJ, INT, [], M.render);
    wall('z', 9, 38, 44, F, PJ, INT, [door(39.5, 42, F)], M.render);
    // roof parapet around the main block
    wall('x', 15, 18, 51, RT, RT + 3, 0.5, [], M.concrete);
    wall('z', 51, 15, 44, RT, RT + 3, 0.5, [], M.concrete);
    wall('x', 44, 28.5, 51, RT, RT + 3, 0.5, [], M.concrete);
    wall('z', 28.5, 33, 44, RT, RT + 3, 0.5, [], M.concrete);
    wall('x', 33, 18, 28.5, RT, RT + 3, 0.5, [], M.concrete);
    wall('z', 18, 15, 33, RT, RT + 3, 0.5, [], M.concrete);

    // ================= ground floor interior
    const g0 = G, g1 = F - 0.5;
    wall('z', 18, 23, 44, g0, g1, INT, [{ a: 33, b: 36, s: g0, h: G + 7.5, kind: 'open' }, door(37, 39.8)]);   // garage | kitchen, dining | kitchen + utility
    wall('z', 28.5, 15, 38, g0, g1, INT, [door(21.5, 24.5)]);            // garage | foyer, lobby; TV wall partition to the dining
    wall('x', 33, 18, 28.5, g0, g1, INT);                                // garage | dining
    wall('z', 32.5, 15, 24.5, g0, g1, INT);                              // foyer | stair
    wall('z', 39, 15, 27.5, g0, g1, INT);                                // stair | bedroom 1
    wall('x', 27.5, 39, 51, g0, g1, INT, [door(39.5, 42.5), door(46.75, 49.25)]);   // bedroom 1 | living, attached bath
    wall('z', 45.5, 27.5, 44, g0, g1, INT, [door(41.2, 43.7)]);          // living | baths
    wall('x', 35.5, 45.5, 51, g0, g1, INT);
    wall('x', 36, 4, 18, g0, g1, INT, [door(6.5, 9)]);                   // kitchen | store, utility
    wall('z', 11, 36, 44, g0, g1, INT);

    // ================= floating dog-leg stair in the south, climbing clockwise
    // open risers (thin teak treads), winders in place of a landing, 19 risers — an odd count, per Vastu.
    const RISE = (F - G) / 19, T1 = 6.5 / 7, T2 = 6.5 / 8, TH = 0.2;
    const tread = (x1, x2, z1, z2, k) => box(x1, x2, G + k * RISE - TH, G + k * RISE, z1, z2, M.tread);
    for (let k = 1; k <= 7; k++) tread(32.5, 35.75, 24.5 - k * T1, 24.5 - (k - 1) * T1, k);        // east flight
    tread(32.5, 35.75, 16.75, 18, 8); tread(32.5, 39, 15, 16.75, 9); tread(35.75, 39, 16.75, 18, 10);   // winders
    for (let k = 11; k <= 18; k++) tread(35.75, 39, 18 + (k - 11) * T2, 18 + (k - 10) * T2, k);     // west flight
    box(35.7, 35.8, G, F - 1, 18, 24.5, M.glass);                                                    // glass between the flights
    box(35.65, 35.85, F - 1.15, F - 1, 18, 24.5, M.rail, nc);
    box(36.4, 38.6, G, G + 1.2, 19.2, 22.5, M.stone); blob(37.5, G + 2.6, 20.85, 0.9, 1.4, 0.9, M.leaf);   // planter under the stair
    railing('x', 24.5, 32.5, 35.75, F);                                  // stair well, first floor
    railing('z', 32.5, 15, 24.5, F);

    // ================= first floor interior
    const f0 = F, f1 = R;
    wall('z', 28.5, 15, 26, f0, f1, INT, [door(21.5, 24.5, F)]);         // bedroom 3 | gallery
    wall('x', 26, 18, 28.5, f0, f1, INT, [door(19, 21.5, F)]);           // bedroom 3 | bath 3, lounge
    wall('z', 23, 26, 33, f0, f1, INT);                                  // bath 3 | lounge
    wall('z', 39, 15, 26, f0, f1, INT);                                  // stair | master
    wall('x', 26, 39, 51, f0, f1, INT, [door(39.5, 42.3, F), { a: 43, b: 46, s: F, h: F + 7.5, kind: 'open' }, door(47.25, 49.75, F)]);
    wall('z', 42.5, 26, 33, f0, f1, INT);                                // lounge | dress
    wall('z', 46.5, 26, 33, f0, f1, INT);                                // dress | master bath
    wall('x', 33, 39, 51, f0, f1, INT, [door(39.5, 42.3, F)]);           // lounge | bedroom 4
    wall('z', 39, 33, 44, f0, f1, INT, [door(39.5, 42, F)]);             // lounge, bath 4 | bedroom 4
    wall('x', 38, 32.5, 39, f0, f1, INT);                                // lounge | bath 4
    wall('z', 33, 38, 44, f0, f1, INT);                                  // lounge corner | bath 4

    // ================= furniture, ground floor
    let f = h.furnish(G);
    box(20.5, 26, G + .6, G + 2.9, 17, 31, M.car); box(21, 25.5, G + 2.9, G + 4.6, 20, 27, M.car);
    for (const [x, z] of [[20.3, 19], [25.8, 19], [20.3, 29], [25.8, 29]]) box(x, x + .4, G, G + 1.4, z - 1, z + 1, M.dark, nc);
    box(31.6, 32.3, G, G + 3.2, 20.5, 25.5, M.wood);                     // foyer shoe + coat wall
    f.bed(44, 50.8, 17.5, 24, 'W');                                      // bedroom 1: head to the west
    box(49, 50.8, G, G + 2, 15.6, 17.3, M.wood); box(49, 50.8, G, G + 2, 24.2, 26, M.wood);
    f.wardrobe(39.4, 40.1, 16, 22.5);
    f.toilet(50, 33.8); f.vanity(46, 47.5, 29, 32.5);                     // attached bath
    f.toilet(50, 42.6); f.vanity(46, 47.5, 36.5, 39.5);                   // common bath
    // kitchen: hob in the SE corner on the east wall (cook faces east), fridge SW
    box(4.4, 6.4, G, G + 2.9, 23.4, 34.5, M.cabinet); box(4.4, 6.4, G + 2.9, G + 3.05, 23.4, 34.5, M.counter);
    box(6.4, 12, G, G + 2.9, 23.4, 25.4, M.cabinet); box(6.4, 12, G + 2.9, G + 3.05, 23.4, 25.4, M.counter);
    box(5, 6, G + 3.05, G + 3.3, 24, 27, M.dark, nc);                     // hob
    box(15.4, 17.6, G, G + 6.2, 23.4, 25.6, M.white);                   // fridge
    box(8, 13, G, G + 3, 29, 31.3, M.cabinet); box(8, 13, G + 3, G + 3.15, 29, 31.3, M.counter);   // island
    box(4.4, 10.6, G, G + 7, 43, 43.6, M.wood); box(4.4, 5, G, G + 7, 37, 43, M.wood);             // store shelving
    box(12, 14.5, G, G + 3, 41.5, 43.6, M.white); box(15, 17.6, G, G + 3, 41.5, 43.6, M.cabinet);  // washer, wash sink
    // dining
    f.table(20, 26.5, 36.5, 40.5);
    for (const [x, z] of [[20.4, 35.2], [22.6, 35.2], [24.8, 35.2], [20.4, 40.8], [22.6, 40.8], [24.8, 40.8]]) box(x, x + 1.4, G, G + 1.5, z, z + 1.2, M.fabric2);
    // living: TV wall on the east, sofa on the west wall facing it, a ceiling fan
    box(28.75, 28.95, G, F - 0.5, 28.0, 36.5, M.teak, nc);                          // teak-slat feature wall
    box(28.95, 30.3, G, G + 1.4, 28.5, 36, M.wood);                                 // low TV console
    box(28.95, 29.15, G + 3, G + 6.2, 29.5, 35, M.dark, nc);                       // TV
    f.sofa(42.5, 45.2, 28.25, 36.25, 'W');                                      // 3-seater on the west wall
    f.table(37.5, 40.5, 30.05, 34.45, 1.4);                                 // coffee table
    box(39.5, 41.5, G, G + 2.6, 37.25, 39.25, M.fabric2);                       // armchair
    box(36.6, 37.4, F - 1.6, F - 0.5, 31.85, 32.65, M.white, nc);               // ceiling fan
    box(33.5, 40.5, F - 1.6, F - 1.5, 32.15, 32.35, M.white, nc); box(36.9, 37.1, F - 1.6, F - 1.5, 28.75, 35.75, M.white, nc);

    // ================= furniture, first floor
    f = h.furnish(F);
    f.bed(44, 50.8, 17, 23.5, 'W');                                      // master: head to the west
    f.wardrobe(42.9, 43.5, 26.5, 32.5);
    f.toilet(50, 31.6); f.vanity(47, 48.5, 27, 30);
    f.bed(18.5, 25.3, 16.5, 22.5, 'E');                                   // bedroom 3
    f.wardrobe(23.6, 28, 25, 25.6);
    f.toilet(19.2, 32); f.vanity(21.2, 22.6, 29.5, 32.5);
    f.bed(44, 50.8, 36, 42.5, 'W');                                      // bedroom 4
    f.wardrobe(46, 50.6, 33.4, 34);
    f.toilet(34.2, 43); f.vanity(37.2, 38.6, 40, 43.4);
    f.sofa(30, 37.5, 34.8, 37.6, 'N');                                   // lounge
    box(23.6, 28, F, F + 1.8, 26.4, 27, M.wood);
    box(29.2, 31.8, F, F + 2.8, 41, 43.6, M.fabric2);                    // reading chair by the north window
    // pooja: altar on the east wall, worship facing east
    box(4.4, 5.4, F, F + 3, 39.5, 42.5, M.wood); box(4.5, 4.9, F + 3, F + 5, 40.4, 41.6, M.brass, nc);
    // terrace: a concrete and teak pergola for evening sitting, potted plants
    for (const [x, z] of [[10.5, 24], [17.2, 24], [10.5, 31], [17.2, 31]]) box(x, x + .5, F, F + 8.5, z, z + .5, M.concrete);
    for (let z = 24; z <= 31.5; z += 0.9) box(10.3, 17.9, F + 8.5, F + 8.9, z, z + .25, M.teak, nc);
    box(12.5, 14, F, F + 2.8, 26.5, 28, M.fabric2); box(12.5, 14, F, F + 2.8, 29.5, 31, M.fabric2);
    f.table(12.7, 13.8, 28.2, 29.3, 1.8);
    for (const [x, z] of [[5, 24], [5, 34.5], [16.8, 42.5]]) { box(x - .6, x + .6, F, F + 1.4, z - .6, z + .6, M.terracotta); blob(x, F + 2.4, z, .9, 1.2, .9, M.leaf); }
  },
});
