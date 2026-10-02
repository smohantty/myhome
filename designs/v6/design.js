/* V6 — V4 without a portico: open garage (carport) with the main door right beside it.
   Same 4BHK on the Vastu setback site plan (plans/site-plan-v2.png, plans/house-plan-v2.png).
   Construction is the L inside the plot: main block 33'×29' (x 18–51, z 15–44) + east wing 14'×21'
   (x 4–18, z 23–44), 1' gaps on the sides and back, 4' at the wing's side-road end, 15' open at the front.
   S4 pada main door flush on the front wall, next to an open carport (no shutter) that also has a side door
   into the foyer for a covered entry; nothing is built in the 15' front open space.
   Carport SE · one SW bedroom down with an attached bath + a common bath · kitchen, store and utility in the
   east wing (hob in the kitchen's SE, cook faces east) · dog-leg stair in the south climbing clockwise · master SW, bedrooms 3 and 4 up · pooja in the
   true NE corner on the terrace over the store; the rest of the NE stays open terrace.
   Units/axes as v1: feet, +x = WEST, +z = NORTH, origin = SE corner of the plot. */
registerDesign({
  id: 'v6',
  name: 'V6 · Open garage',
  summary: 'V4 without a portico: open carport SE with the S4 main door right beside it (plus a covered side door into the foyer). Inside the setback L, 1 bedroom down (SW) + 3 up, kitchen and store in the east wing, pooja in the NE corner of the terrace.',
  levels: { G: 0.5, F: 10.5, R: 20.5 },
  spawn: { x: 31, z: -9, yaw: Math.PI },          // on the footpath, facing the main door
  center: { x: 33, z: 29 },
  renders: [],

  rooms: [
    // ground floor
    { n: 'Open garage', lv: 0, r: [18, 28.5, 15, 33], f: 'garage', d: "carport · 10½'×18' · SE" },
    { n: 'Foyer', lv: 0, r: [28.5, 32.5, 15, 26], f: 'stone', d: "4'×11' · S4 main door" },
    { n: 'Stair', lv: 0, r: [32.5, 39, 15, 26], f: 'lobby', noFloor: true, noLabel: true },
    { n: 'Bedroom 1', lv: 0, r: [39, 51, 15, 27.5], f: 'wood', d: "12'×12½' · SW · parents" },
    { n: 'Attached bath', lv: 0, r: [45.5, 51, 27.5, 35.5], f: 'bath', noLabel: true },
    { n: 'Common bath', lv: 0, r: [45.5, 51, 35.5, 44], f: 'bath', d: 'guests' },
    { n: 'Living', lv: 0, r: [28.5, 39, 26, 44], f: 'living', d: "17'×16½' · open to dining", extra: [[39, 45.5, 27.5, 44]] },
    { n: 'Dining', lv: 0, r: [18, 28.5, 33, 44], f: 'living', d: "10½'×11'" },
    { n: 'Kitchen', lv: 0, r: [4, 18, 23, 36], f: 'kitchen', d: "14'×13' · E wing · cook faces east" },
    { n: 'Store', lv: 0, r: [4, 11, 36, 44], f: 'garage', d: 'pantry · keep light' },
    { n: 'Utility', lv: 0, r: [11, 18, 36, 44], f: 'bath', d: 'wash' },
    // first floor
    { n: 'Bedroom 3', lv: 1, r: [18, 28.5, 15, 26], f: 'wood', d: "10½'×11' · over the garage" },
    { n: 'Bath 3', lv: 1, r: [18, 23, 26, 33], f: 'bath', noLabel: true },
    { n: 'Gallery', lv: 1, r: [28.5, 32.5, 15, 26], f: 'lobby', noLabel: true },
    { n: 'Master bedroom', lv: 1, r: [39, 51, 15, 26], f: 'wood', d: "12'×11' · SW" },
    { n: 'Dress', lv: 1, r: [42.5, 46.5, 26, 33], f: 'wood', noLabel: true },
    { n: 'Master bath', lv: 1, r: [46.5, 51, 26, 33], f: 'bath', noLabel: true },
    { n: 'Family lounge', lv: 1, r: [23, 42.5, 26, 33], f: 'lobby', d: 'TV + reading', extra: [[28.5, 39, 33, 38], [28.5, 33, 38, 44]] },
    { n: 'Bath 4', lv: 1, r: [33, 39, 38, 44], f: 'bath', noLabel: true },
    { n: 'Bedroom 4', lv: 1, r: [39, 51, 33, 44], f: 'wood', d: "12'×11' · NW" },
    { n: 'Terrace', lv: 1, r: [4, 18, 23, 38], f: 'stone', d: 'over the kitchen + dining · NE kept open', extra: [[9, 18, 38, 44], [18, 28.5, 33, 44]] },
    { n: 'Pooja', lv: 1, r: [4, 9, 38, 44], f: 'pooja', d: 'true NE corner' },
  ],
  minimap: { stair: [[34.1, 25.5], [34.1, 17], [37.4, 17], [37.4, 25.5]] },

  build(h) {
    const { G, F, R, RT, EXT, INT, M, box, wall, door, win, tall, slide, railing } = h;
    const PAR = F + 3.5;                            // terrace parapet top
    const PJ = F + 8;                               // pooja roof, kept well below the main block
    const nc = { collide: false };

    // ================= site works inside the plot
    box(18.5, 28, 0, 0.1, 0, 15, M.stone);                               // driveway to the garage
    box(29, 32, 0, 0.1, 0, 15, M.stone);                                 // path to the main door (paving only)

    // ================= slabs
    box(18, 51, 0, G, 15, 44, M.plinth);
    box(4, 18, 0, G, 23, 44, M.plinth);
    for (const [x1, x2, z1, z2] of [[18, 32.5, 15, 44], [32.5, 39, 26, 44], [39, 51, 15, 44], [4, 18, 23, 44]])
      box(x1, x2, F - 0.5, F, z1, z2, M.slab);                           // first floor, minus the stair hole
    box(18, 51, R, RT, 15, 33, M.slab); box(28.5, 51, R, RT, 33, 44, M.slab);   // main roof
    box(3.6, 9.4, PJ, PJ + 0.4, 37.6, 44.4, M.slab);                     // pooja roof


    // ================= exterior walls
    // south (front): open carport | main door (S4 pada) | stair | bedroom 1
    wall('x', 15, 18, 51, 0, F, EXT, [{ a: 18.4, b: 28.1, s: 0, h: F - 0.9, kind: 'open' }, door(29, 32.2), win(41.5, 48.5)], M.extWall);
    box(28.6, 32.6, G, F - 0.9, 14.3, 14.62, M.stone, nc);              // stone surround framing the main door
    wall('x', 15, 18, 51, F, RT, EXT, [win(20, 27, F), win(29, 32, F), tall(33.5, 38, F + 1, F + 8.5), win(41.5, 48.5, F)], M.extWall);
    // west
    wall('z', 51, 15, 44, 0, F, EXT, [win(17, 23), win(29, 31, G, 5.5, 7.5), win(38, 40, G, 5.5, 7.5)], M.extWall);
    wall('z', 51, 15, 44, F, RT, EXT, [win(17, 23, F), win(28, 30, F, 5.5, 7.5), win(36, 41, F)], M.extWall);
    // north
    wall('x', 44, 4, 51, 0, F, EXT, [win(6.5, 9.5, G, 5, 7.5), win(13, 16, G, 5, 7.5), win(21, 26), tall(30, 37, G + 1, G + 8.5), win(47, 49, G, 5.5, 7.5)], M.extWall);
    wall('x', 44, 28.5, 51, F, RT, EXT, [win(29.5, 32, F), win(34.5, 37, F, 5.5, 7.5), win(42, 48, F)], M.extWall);
    // east wing: side-road wall with high windows only, and its south wall onto the 1' gap
    wall('z', 4, 23, 44, 0, F, EXT, [win(25, 30, G, 4.5, 7.5), door(31, 33.8), win(38, 41, G, 5, 7.5)], M.extWall);
    wall('x', 23, 4, 18, 0, F, EXT, [win(7, 13, G, 4.5, 7.5)], M.extWall);
    // against the 2-storey neighbour (east of the garage / bedroom 3)
    wall('z', 18, 15, 23, 0, RT, EXT, [], M.extWall);
    // first floor walls onto the terrace
    wall('z', 18, 23, 33, F, RT, EXT, [win(23.5, 25.5, F), win(28.5, 30.5, F, 5.5, 7.5)], M.extWall);   // bedroom 3 + bath 3
    wall('x', 33, 18, 28.5, F, RT, EXT, [win(19, 21.5, F, 5.5, 7.5), slide(23.6, 28)], M.extWall);    // bath 3 | lounge → terrace
    wall('z', 28.5, 33, 44, F, RT, EXT, [slide(34.5, 37.5), win(39, 43, F)], M.extWall);              // lounge doors + window onto the terrace
    // terrace parapets (NE kept low) and the pooja room in the NE corner
    wall('z', 4, 23, 38, F, PAR, EXT, [], M.parapet);
    wall('x', 23, 4, 18, F, PAR, EXT, [], M.parapet);
    wall('x', 44, 9, 28.5, F, PAR, EXT, [], M.parapet);
    wall('z', 4, 38, 44, F, PJ, EXT, [win(39.5, 42.5, F, 3, 6.5)], M.extWall);   // pooja east window: sunrise on the altar
    wall('x', 44, 4, 9, F, PJ, EXT, [], M.extWall);
    wall('x', 38, 4, 9, F, PJ, INT, [], M.extWall);
    wall('z', 9, 38, 44, F, PJ, INT, [door(39.5, 42, F)], M.extWall);
    // roof parapet around the main block
    wall('x', 15, 18, 51, RT, RT + 3, 0.5, [], M.parapet);
    wall('z', 51, 15, 44, RT, RT + 3, 0.5, [], M.parapet);
    wall('x', 44, 28.5, 51, RT, RT + 3, 0.5, [], M.parapet);
    wall('z', 28.5, 33, 44, RT, RT + 3, 0.5, [], M.parapet);
    wall('x', 33, 18, 28.5, RT, RT + 3, 0.5, [], M.parapet);
    wall('z', 18, 15, 33, RT, RT + 3, 0.5, [], M.parapet);

    // ================= ground floor interior
    const g0 = G, g1 = F - 0.5;
    wall('z', 18, 23, 44, g0, g1, INT, [{ a: 33, b: 36, s: g0, h: G + 7.5, kind: 'open' }, door(37, 39.8)]);   // garage | kitchen, dining | kitchen + utility
    wall('z', 28.5, 15, 33, g0, g1, INT, [door(21.5, 24.5)]);            // garage | foyer, lobby
    wall('x', 33, 18, 28.5, g0, g1, INT);                                // garage | dining
    wall('z', 32.5, 15, 26, g0, g1, INT);                                // foyer | stair
    wall('z', 39, 15, 27.5, g0, g1, INT);                                // stair | bedroom 1
    wall('x', 27.5, 39, 51, g0, g1, INT, [door(39.5, 42.5), door(46.75, 49.25)]);   // bedroom 1 | living, attached bath
    wall('z', 45.5, 27.5, 44, g0, g1, INT, [door(41.2, 43.7)]);          // living | baths
    wall('x', 35.5, 45.5, 51, g0, g1, INT);
    wall('x', 36, 4, 18, g0, g1, INT, [door(6.5, 9)]);                   // kitchen | store, utility
    wall('z', 11, 36, 44, g0, g1, INT);

    // ================= dog-leg stair in the south, climbing clockwise (18 risers)
    // from the lobby south up the east flight, turn on the landing by the front wall, north up the west flight
    const RISE = (F - G) / 18, T = 7.5 / 8;
    for (let i = 0; i < 8; i++) box(32.5, 35.75, G, G + (i + 1) * RISE, 26 - (i + 1) * T, 26 - i * T, M.tread);
    box(32.5, 39, G, G + 9 * RISE, 15, 18.5, M.tread);                                                       // landing
    for (let i = 0; i < 8; i++) box(35.75, 39, G, G + (10 + i) * RISE, 18.5 + i * T, 18.5 + (i + 1) * T, M.tread);
    box(35.65, 35.85, G, F - 1, 18.5, 26, M.wall);
    railing('x', 26, 32.5, 35.75, F);                                    // stair well, first floor
    railing('z', 32.5, 15, 26, F);

    // ================= first floor interior
    const f0 = F, f1 = R;
    wall('z', 28.5, 15, 26, f0, f1, INT, [door(21.5, 24.5, F)], M.extWall);   // bedroom 3 | balcony, gallery
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
    // kitchen: hob in the SE corner on the east wall (cook faces east), sink below the window, fridge SW
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
    // living: L-sofa facing the TV wall on the east (garage) side
    f.sofa(36, 44.8, 40.5, 43.4, 'N');
    f.sofa(42, 44.8, 31, 40.5, 'W', M.fabric2);
    f.table(36.5, 41, 34.5, 38.5, 1.4);
    box(29, 29.6, G, G + 1.8, 34, 42, M.wood);                           // TV unit

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
    // terrace seating
    box(13, 14.5, F, F + 2.8, 27, 28.5, M.fabric2); box(13, 14.5, F, F + 2.8, 30, 31.5, M.fabric2);
    f.table(13.2, 14.3, 28.7, 29.8, 1.8);
  },
});
