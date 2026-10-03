/* V7 — Nordic gable. No Vastu or room-count constraints: the most beautiful house that fits site plan v2.
   Same construction L (plans/site-plan-v2.png, plans/house-plan-v7.png): main block 33'×29' (x 18–51, z 15–44)
   + east wing 14'×21' (x 4–18, z 23–44), nothing built in the 15' front open space except a ground-level deck.
   The main block is one black-clad Scandinavian gable: 38° standing-seam roof, ridge running north–south, so the
   gable end faces the road and the mountains. That gable is glazed from the floor to the ridge over a 21' × 14½'
   double-height great room, with a floating oak stair behind a full-height oak slat screen and a wood stove whose
   flue rises through the void. The east wing is a white rendered box with a sauna and guest suite below and a
   pergola sky deck with a hot tub above. 4 bedrooms (guest down, 3 up), all first-floor rooms vaulted to the roof.
   Units/axes as v1: feet, +x = WEST, +z = NORTH, origin = SE corner of the plot. */
registerDesign({
  id: 'v7',
  name: 'V7 · Nordic gable',
  summary: 'No constraints: a black Scandinavian gable with its glass end facing the mountains, over a double-height great room with a floating oak stair and a wood stove. Kitchen, dining and library behind; white east wing with sauna + guest suite, and a pergola sky deck with a hot tub. 4 bedrooms (1 down, 3 up), vaulted ceilings upstairs.',
  levels: { G: 0.5, F: 10.5, R: 19 },              // R = eave line of the gable
  spawn: { x: 24, z: -9, yaw: Math.PI },           // on the footpath, facing the front door
  center: { x: 30, z: 29 },
  renders: [],
  voids: [[18, 39, 15, 29.5]],                      // double-height great room + stair
  minimap: { stair: [[19.95, 18.2], [19.95, 31.2]], voidLabel: [30, 22.5] },

  rooms: [
    // ground floor
    { n: 'Entry', lv: 0, r: [18, 26.4, 15, 21], f: 'stone', d: 'oak door · coat wall' },
    { n: 'Great room', lv: 0, r: [26.4, 39, 15, 29.5], f: 'oak', d: 'double height · glass gable', extra: [[18, 26.4, 21, 29.5]] },
    { n: 'Snug', lv: 0, r: [39, 51, 15, 29.5], f: 'oak', d: "12'×14½' · window seat" },
    { n: 'Kitchen', lv: 0, r: [18, 30, 29.5, 44], f: 'oak', d: "12'×14½' · island" },
    { n: 'Dining', lv: 0, r: [30, 42, 29.5, 44], f: 'oak', d: "12'×14½' · table for 8", extra: [[42, 46, 29.5, 34]] },
    { n: 'WC', lv: 0, r: [46, 51, 29.5, 34], f: 'bath', noLabel: true },
    { n: 'Library', lv: 0, r: [42, 51, 34, 44], f: 'oak', d: "9'×10' · desk + daybed" },
    { n: 'Boot room', lv: 0, r: [4, 18, 23, 30], f: 'stone', d: 'laundry · side door' },
    { n: 'Wing hall', lv: 0, r: [13, 18, 30, 36], f: 'stone', noLabel: true },
    { n: 'Guest bedroom', lv: 0, r: [4, 13, 30, 44], f: 'oak', d: "9'×14'" },
    { n: 'Guest bath', lv: 0, r: [13, 18, 36, 40.5], f: 'bath', noLabel: true },
    { n: 'Sauna', lv: 0, r: [13, 18, 40.5, 44], f: 'deck', d: 'cedar' },
    // first floor
    { n: 'Gallery', lv: 1, r: [21.5, 39, 29.5, 34], f: 'oak', d: 'over the great room', extra: [[18, 21.5, 31.5, 34]] },
    { n: 'Master bedroom', lv: 1, r: [39, 51, 15, 30], f: 'oak', d: "12'×15' · mountain view" },
    { n: 'Dressing', lv: 1, r: [39, 51, 30, 34], f: 'oak', noLabel: true },
    { n: 'Master bath', lv: 1, r: [39, 51, 34, 44], f: 'bath', d: "12'×10' · tub + shower" },
    { n: 'Bedroom 2', lv: 1, r: [18, 29, 34, 44], f: 'oak', d: "11'×10' · vaulted" },
    { n: 'Bath 2', lv: 1, r: [29, 34, 34, 44], f: 'bath', noLabel: true },
    { n: 'Study', lv: 1, r: [34, 39, 34, 44], f: 'oak', d: 'desk nook' },
    { n: 'Sky deck', lv: 1, r: [4, 18, 23, 30], f: 'deck', d: 'hot tub · pergola' },
    { n: 'Bedroom 3', lv: 1, r: [4, 13, 30, 44], f: 'oak', d: "9'×14' · onto the deck" },
    { n: 'Wing landing', lv: 1, r: [13, 18, 30, 36], f: 'oak', noLabel: true },
    { n: 'Bath 3', lv: 1, r: [13, 18, 36, 44], f: 'bath', noLabel: true },
  ],

  build(h) {
    const { G, F, R, EXT, INT, M, box, wall, door, win, tall, slide, railing, prism, blob } = h;
    const nc = { collide: false };
    const open = (a, b, top = G + 8.2) => ({ a, b, s: 0, h: top, kind: 'open' });
    // gable: eaves at R on x = 18 and x = 51, ridge over x = 34.5
    const TAN = Math.tan(38 * Math.PI / 180), RX = 34.5, RIDGE = R + (RX - 18) * TAN, TH = 0.75;
    const ryE = x => R + (x - 18) * TAN, ryW = x => R + (51 - x) * TAN;   // underside of each roof plane
    const ry = x => Math.min(ryE(x), ryW(x));
    const WR = 18.4;                                                     // wing roof (flat, white)

    // black-clad exterior wall: white inside, a thin black timber skin outside (out = -1 / +1 toward the outside)
    function clad(axis, c, a, b, y0, y1, ops, out, ext = [true, true]) {
      wall(axis, c, a, b, y0, y1, EXT, ops, M.wall);
      const e = EXT / 2 + 0.06;
      wall(axis, c + out * e, a - (ext[0] ? e : -0.06), b + (ext[1] ? e : -0.06), y0, y1, 0.12,
        ops.map(o => ({ ...o, kind: 'open' })), M.clad);
    }
    // the part of an x-running wall above the eave line, up to the roof (pts between x = a and x = b)
    const gablePts = (a, b) => [[a, R], [b, R], [b, ry(b)], ...(a < RX && b > RX ? [[RX, RIDGE]] : []), [a, ry(a)]];
    // first-floor partition along x at z = c, full height to the vaulted roof
    function xwall(c, a, b, ops = []) {
      wall('x', c, a, b, F, R, INT, ops);
      prism(gablePts(a, b), c - INT / 2, c + INT / 2, M.wall);
    }

    // ================= garden, inside the plot
    box(17.6, 23, 0, 0.06, 0, 14.6, M.stone);                            // gravel car apron
    for (let z = 0.6; z < 14; z += 1.7) box(23.4, 25.9, 0, 0.12, z, z + 1.1, M.parapet);   // stepping stones to the door
    box(26.4, 51.6, 0, G - 0.05, 9.6, 14.62, M.oak);                     // ground-level oak deck facing the mountains
    for (const [x1, z1] of [[44, 10.6], [47, 10.6]]) box(x1, x1 + 2.2, G - 0.05, G + 1.1, z1, z1 + 2.8, M.oak);   // deck loungers
    box(17.9, 23, 0.6, 2.9, 1.6, 14, M.car); box(18.4, 22.5, 2.9, 4.5, 4.6, 11, M.car);   // car on the apron
    for (const [x, z] of [[17.8, 4], [22.7, 4], [17.8, 11.5], [22.7, 11.5]]) box(x, x + .4, 0, 1.4, z - 1, z + 1, M.dark, nc);
    // birches: white trunks with dark marks, light low-poly canopies
    function birch(x, z, ht, s = 1) {
      box(x - .22, x + .22, 0, ht, z - .22, z + .22, M.birch);
      for (const y of [1.6, 3.1, 4.2, 6.0, 7.7, 9.4]) if (y < ht - 1) box(x - .23, x + .23, y, y + .14, z - .23, z + .1, M.dark, nc);
      blob(x, ht * 0.86, z, 2.8 * s, 4.2 * s, 2.8 * s, M.leaf);
      blob(x + 1.3 * s, ht * 0.7, z - 0.6, 2 * s, 2.6 * s, 2 * s, M.leaf2);
      blob(x - 1 * s, ht * 1.0, z + 0.5, 1.8 * s, 2.4 * s, 1.8 * s, M.leaf);
    }
    birch(27.6, 1.6, 16, 0.75); birch(47.5, 1.4, 21, 1); birch(50.6, 6, 15, 0.7);   // framing the glass, not in front of it
    for (const [x, z] of [[27.5, 8.4], [33, 8.6], [40, 8.4], [27, 2], [47, 7.8]]) blob(x, 0.8, z, 1.3, 0.9, 1.1, M.fabric);   // low grasses

    // ================= slabs
    box(18, 51, 0, G, 15, 44, M.plinth);
    box(4, 18, 0, G, 23, 44, M.plinth);
    box(21.5, 39, F - 0.5, F, 29.5, 44, M.slab);                         // first floor: north rooms + gallery
    box(18, 21.5, F - 0.5, F, 31.5, 44, M.slab);                         //   stair landing
    box(39, 51, F - 0.5, F, 15, 44, M.slab);                             //   master suite
    box(4, 18, F - 0.5, F, 23, 44, M.slab);                              //   wing + sky deck
    box(3.6, 18, WR, WR + 0.5, 29.6, 44.4, M.render);                    // wing roof

    // ================= the gable roof: two standing-seam planes, oak-lined underneath
    const EV = 0.6;                                                      // side eave overhang
    prism([[18 - EV, ryE(18 - EV)], [RX, RIDGE], [RX, RIDGE + TH], [18 - EV, ryE(18 - EV) + TH]], 13.6, 45, M.roof);
    prism([[RX, RIDGE], [51 + EV, ryW(51 + EV)], [51 + EV, ryW(51 + EV) + TH], [RX, RIDGE + TH]], 13.6, 45, M.roof);
    prism([[18.4, ryE(18.4) - 0.15], [RX, RIDGE - 0.15], [RX, RIDGE], [18.4, ryE(18.4)]], 15.4, 43.6, M.oak);   // pine/oak ceiling
    prism([[RX, RIDGE - 0.15], [50.6, ryW(50.6) - 0.15], [50.6, ryW(50.6)], [RX, RIDGE]], 15.4, 43.6, M.oak);
    for (let z = 14.1; z < 44.9; z += 1.5) {                             // seams
      prism([[18 - EV, ryE(18 - EV) + TH], [RX, RIDGE + TH], [RX, RIDGE + TH + .12], [18 - EV, ryE(18 - EV) + TH + .12]], z, z + .07, M.roof, { shadow: false });
      prism([[RX, RIDGE + TH], [51 + EV, ryW(51 + EV) + TH], [51 + EV, ryW(51 + EV) + TH + .12], [RX, RIDGE + TH + .12]], z, z + .07, M.roof, { shadow: false });
    }
    box(RX - .3, RX + .3, RIDGE + TH - .1, RIDGE + TH + .22, 13.6, 45, M.roof, nc);   // ridge cap

    // ================= south gable: glass from the floor to the ridge over the great room
    clad('x', 15, 18, 51, 0, F, [tall(18.6, 21.8, G, F), door(22.3, 25.8), { a: 26.3, b: 39, s: G, h: F, kind: 'slide' },
      win(41, 49, G, 1.5, 7.5)], -1);
    clad('x', 15, 18, 51, F, R, [tall(18.6, 39, F, R), tall(40.5, 49.5, F + 0.3, R - 0.3)], -1);
    prism([[18.6, R], [39, R], [39, ry(39)], [RX, RIDGE], [18.6, ry(18.6)]], 14.96, 15.04, M.glass);
    for (const pts of [[[18, R], [18.6, R], [18.6, ry(18.6)]], [[39, R], [51, R], [39, ry(39)]]]) {
      prism(pts, 14.505, 14.625, M.clad); prism(pts, 14.625, 15.375, M.wall);
    }
    for (const x of [22.05, 26.3, 30.4, RX, 39]) box(x - .08, x + .08, x < 26 ? F : G, ry(x), 14.86, 15.14, M.frame, nc);   // mullions
    box(18.6, 39, R - .07, R + .07, 14.86, 15.14, M.frame, nc);
    box(25.6, 25.8, G, G + 7.5, 15.4, 18.9, M.oak, nc);                  // oak front door, swung open
    box(21.9, 26.4, 8.6, 8.9, 12.6, 14.6, M.oak, nc);                    // oak canopy over the door

    // north gable
    clad('x', 44, 18, 51, 0, F, [win(20.5, 28.5, G, 4, 7.5), win(32, 40, G, 2, 8), win(44, 49, G, 3, 7.5)], 1, [false, true]);
    clad('x', 44, 18, 51, F, R, [win(21, 27, F, 3, 7.5), win(30.5, 32.5, F, 5, 7.5), win(35, 38, F, 3, 7.5), win(42, 49, F, 3.5, 7.5)], 1, [false, true]);
    prism([[18, R], [51, R], [RX, RIDGE]], 43.625, 44.375, M.wall);
    prism([[18, R], [51, R], [RX, RIDGE]], 44.375, 44.495, M.clad);
    // west side (1' gap to the single-storey west neighbour: high windows below, full ones above it)
    clad('z', 51, 15, 44, 0, F, [win(18, 27, G, 4, 7.5), win(31, 33, G, 5, 7.5), win(36, 42, G, 3, 7.5)], 1);
    clad('z', 51, 15, 44, F, R, [win(18, 27, F, 2, 7.5), win(38, 43, F, 4.5, 7.5)], 1);
    // east side: blank against the 2-storey neighbour, a tall window over the sky deck into the stair void
    clad('z', 18, 15, 23, 0, F, [], -1, [true, false]);
    clad('z', 18, 15, 30, F, R, [tall(24, 29.4, F + 1, R - 0.4)], -1, [true, false]);
    wall('z', 18, 23, 44, 0, F, EXT, [door(32, 34.5)]);                 // main block | wing, ground floor
    wall('z', 18, 30, 44, F, WR, EXT, [door(31.8, 34, F)]);              // main block | wing, first floor

    // ================= east wing: white render
    wall('z', 4, 23, 44, 0, F, EXT, [door(25, 28), win(35, 42, G, 4, 7.5)], M.render);   // side-road wall, side door
    wall('x', 23, 4, 18, 0, F, EXT, [win(6, 12, G, 4.5, 7.5)], M.render);
    wall('x', 44, 4, 18, 0, F, EXT, [win(6, 11, G, 4.5, 7.5), win(14, 16.5, G, 5, 7.5)], M.render);
    wall('z', 4, 30, 44, F, WR, EXT, [win(33, 42, F, 2.5, 7.5)], M.render);
    wall('x', 44, 4, 18, F, WR, EXT, [win(6, 11, F, 3.5, 7.5), win(14, 16.5, F, 5, 7.5)], M.render);
    wall('x', 30, 4, 18, F, WR, EXT, [slide(5, 11, F), door(14, 16.5, F)], M.render);   // onto the sky deck
    railing('z', 4, 23, 30, F); railing('x', 23, 4, 18, F);
    // pergola over the sky deck
    for (const [x, z] of [[4.1, 23.1], [4.1, 29.4]]) box(x, x + .4, F, WR, z, z + .4, M.oak);
    box(4.1, 17.6, WR - .45, WR, 23.1, 23.5, M.oak, nc);
    for (let x = 4.4; x < 17.6; x += 0.7) box(x, x + .18, WR, WR + .35, 23.1, 30, M.oak, nc);

    // ================= ground floor interior
    const g1 = F - 0.5;
    wall('x', 29.5, 21.5, 51, G, g1, INT, [open(22, 29.6), open(31, 41.4), door(42.5, 45.5)]);   // great room | kitchen, dining, lobby
    wall('z', 46, 29.5, 34, G, g1, INT, [door(30.3, 32.8)]);            // lobby | WC
    wall('x', 34, 42, 51, G, g1, INT, [door(43, 45.5)]);                // lobby, WC | library
    wall('z', 42, 34, 44, G, g1, INT);                                  // dining | library
    wall('x', 30, 4, 13, G, g1, INT);                                   // boot room | guest
    wall('z', 13, 30, 44, G, g1, INT, [door(31, 33.5)]);                // wing hall | guest
    wall('x', 36, 13, 18, G, g1, INT, [door(14, 16.5)]);                // wing hall | guest bath
    wall('x', 40.5, 13, 18, G, g1, INT, [{ a: 14, b: 16.5, s: G, h: G + 6.8, kind: 'glass' }]);   // glass sauna door

    // ================= floating oak stair, straight up the east wall, behind a full-height oak slat screen
    // 17 risers of 7", 16 open treads of 10¼"; foot by the front door, top on the gallery landing
    const RISE = (F - G) / 17, TD = 0.85, Z0 = 17.9;
    for (let k = 1; k <= 16; k++) box(18.45, 21.45, G + k * RISE - 0.2, G + k * RISE, Z0 + (k - 1) * TD, Z0 + k * TD, M.oak);
    for (let z = 18.4; z < 29.4; z += 0.42) box(21.48, 21.72, G, F + 3.6, z, z + .12, M.oak);
    box(18.45, 21.4, G, G + 2.5, 21.5, 24.8, M.wood);                   // firewood stack under the stair
    box(18.45, 21.4, G, 5.2, 25, 29.4, M.oak);                          // oak storage under the stair
    railing('x', 29.5, 21.5, 39, F);                                     // gallery edge
    railing('z', 21.5, 29.5, 31.5, F);

    // ================= first floor interior (rooms vaulted to the roof)
    wall('z', 39, 15, 44, F, ry(39), INT, [door(30.5, 33, F)]);          // void, gallery, study | master suite
    xwall(30, 39, 51, [{ a: 42, b: 46, s: F, h: F + 7.5, kind: 'open' }]);   // master | dressing
    xwall(34, 39, 51, [door(47, 49.5, F)]);                              // dressing | master bath
    xwall(34, 18, 39, [door(22.5, 25, F), door(30, 32.5, F), { a: 34.5, b: 38.5, s: F, h: F + 7.5, kind: 'open' }]);
    wall('z', 29, 34, 44, F, ry(29), INT);                               // bedroom 2 | bath 2
    wall('z', 34, 34, 44, F, ry(34), INT);                               // bath 2 | study
    wall('z', 13, 30, 44, F, WR, INT, [door(31, 33.5, F)]);              // wing landing | bedroom 3
    wall('x', 36, 13, 18, F, WR, INT, [door(14, 16.5, F)]);              // wing landing | bath 3

    // ================= furniture, ground floor
    let f = h.furnish(G);
    // great room: two sofas facing each other between the glass and the stove
    box(28.5, 37, G, G + .04, 17.5, 26.5, M.linen, nc);                  // wool rug
    f.sofa(27.2, 30, 18.5, 25.5, 'E', M.fabric);
    f.sofa(35.6, 38.4, 18.5, 25.5, 'W', M.fabric2);
    f.table(31.3, 34.3, 20.2, 23.8, 1.3, M.oak);
    box(31, 34, G, G + .3, 26.6, 29.1, M.stone);                         // hearth
    box(31.8, 33.2, G + .3, G + 3.3, 27.2, 28.6, M.stove);               // wood stove
    box(32.35, 32.65, G + 3.3, ryE(32.5) + 3, 27.75, 28.05, M.stove, nc);   // flue up through the void and the roof
    box(32.15, 32.85, ryE(32.5) + 3, ryE(32.5) + 3.3, 27.55, 28.25, M.stove, nc);
    box(26.4, 27, G, G + 7, 17, 21, M.oak);                              // freestanding oak coat wall, screens the entry
    box(37.4, 38.4, G, G + 1.2, 15.6, 16.6, M.white); blob(37.9, G + 2.6, 16.1, 0.9, 1.5, 0.9, M.leaf);   // fig in a pot
    // snug: window seat under the front window, armchairs, bookcase
    box(41, 49, G, G + 1.4, 15.4, 17.3, M.oak); box(41.1, 48.9, G + 1.4, G + 1.75, 15.5, 17.2, M.linen, nc);
    box(42, 44.6, G, G + 2.6, 22, 24.6, M.fabric2); box(46.4, 49, G, G + 2.6, 22, 24.6, M.fabric);
    f.table(44.9, 46.1, 22.7, 23.9, 1.8, M.oak);
    box(45.5, 50.6, G, G + 7, 28.7, 29.25, M.oak);
    // kitchen: white handleless run under the north window, oak tall wall, island with the hob
    box(18.45, 21.4, G, G + 8, 29.6, 31.4, M.white);                    // tall cupboard under the stair top
    box(18.5, 29.6, G, G + 2.9, 42.9, 43.6, M.white); box(18.5, 29.6, G + 2.9, G + 3.05, 42.7, 43.6, M.counter);
    box(18.45, 20.4, G, G + 7.5, 35.5, 42.7, M.oak);                     // fridge + ovens behind oak
    box(22, 28.5, G, G + 2.9, 35.5, 38.3, M.white); box(21.8, 28.7, G + 2.9, G + 3.05, 35.3, 38.5, M.counter);
    box(24.2, 26.2, G + 3.05, G + 3.12, 36.2, 37.6, M.dark, nc);
    for (const x of [22.4, 24.4, 26.4]) box(x, x + 1.2, G, G + 2.4, 33.9, 35, M.oak);   // stools
    // dining: long oak table for 8 under three paper pendants
    f.table(32.3, 39.7, 35.3, 39.2, 2.5, M.oak);
    for (const x of [32.6, 34.4, 36.2, 38]) for (const [z, bz] of [[33.8, 33.8], [39.6, 40.7]]) {
      box(x, x + 1.3, G, G + 1.5, z, z + 1.3, M.oak); box(x, x + 1.3, G + 1.5, G + 2.9, bz, bz + .2, M.oak, nc);
    }
    for (const x of [33.5, 36, 38.5]) {
      box(x - .02, x + .02, G + 6.3, F - .5, 37.23, 37.27, M.dark, nc); blob(x, G + 6.2, 37.25, 0.8, 0.4, 0.8, M.white);
    }
    // library + WC
    box(42.25, 43, G, G + 8, 34.6, 43.5, M.oak);                         // floor-to-ceiling books
    box(48.8, 50.6, G, G + 2.5, 36, 41, M.oak); box(47.4, 48.6, G, G + 1.5, 37.8, 39.2, M.fabric);
    box(43.4, 46.4, G, G + 1.5, 40.6, 43.6, M.linen);                    // daybed
    f.toilet(50, 31.6); f.vanity(47, 49, 33, 33.7);
    // wing: boot room, guest suite, guest bath, sauna
    box(5, 10, G, G + 1.5, 23.5, 24.6, M.oak); box(5, 10, G + 4, G + 6.5, 23.45, 23.6, M.oak);   // bench + peg rail
    box(13, 15.3, G, G + 3, 23.5, 25.5, M.white); box(15.5, 17.6, G, G + 3, 23.5, 25.5, M.white);  // washer, dryer
    f.bed(4.4, 11, 36, 41.5, 'E'); f.wardrobe(4.5, 9, 30.4, 32);
    box(4.4, 5.9, G, G + 1.8, 34, 35.6, M.oak); box(4.4, 5.9, G, G + 1.8, 41.9, 43.5, M.oak);
    f.vanity(13.4, 14.8, 37.5, 40); f.toilet(17.1, 39.2);
    box(13.4, 17.6, G, G + 1.6, 42.2, 43.6, M.oak); box(13.4, 17.6, G + 1.6, G + 3.2, 43, 43.6, M.oak);   // sauna benches
    box(13.4, 14.4, G, G + 2.5, 40.9, 41.9, M.stove);

    // ================= furniture, first floor
    f = h.furnish(F);
    f.bed(42.5, 49, 23, 29.6, 'N');                                      // master: bed faces the mountains
    box(40.8, 42.3, F, F + 1.8, 28, 29.6, M.oak); box(49.2, 50.7, F, F + 1.8, 28, 29.6, M.oak);
    box(40, 42.4, F, F + 2.6, 16, 18.4, M.fabric2);                      // armchair by the window
    box(42, 49.5, F, F + .04, 19.5, 28, M.linen, nc);
    f.wardrobe(39.6, 46.6, 32.1, 33.6);
    box(42.5, 48, F, F + 1.9, 40.6, 43.3, M.white); box(42.8, 47.7, F + 1.4, F + 1.75, 40.9, 43, M.water, nc);   // tub under the window
    f.vanity(39.4, 40.9, 35, 40); f.toilet(50.1, 36.2);
    box(48.4, 48.5, F, F + 7, 39.6, 43.6, M.glass);                      // walk-in shower screen
    f.bed(18.5, 25, 37.5, 43, 'E'); f.wardrobe(27.3, 28.6, 35, 42);      // bedroom 2
    f.vanity(29.4, 30.8, 35.5, 38.5); f.toilet(30.1, 41.8);              // bath 2
    box(31.4, 31.5, F, F + 7, 39.6, 43.6, M.glass);
    box(34.4, 38.6, F, F + 2.5, 42.3, 43.6, M.oak); box(35.8, 37.2, F, F + 1.5, 40.5, 41.9, M.fabric);   // study
    box(25, 30, F, F + 1.4, 32.6, 33.6, M.oak); box(25.1, 29.9, F + 1.4, F + 1.7, 32.7, 33.5, M.linen, nc);   // gallery bench
    f.bed(4.4, 11, 36.5, 42, 'E'); f.wardrobe(12, 12.75, 35, 43);        // bedroom 3
    f.vanity(13.4, 14.8, 38, 41); f.toilet(17.1, 42.8);                  // bath 3
    // sky deck: cedar hot tub + loungers under the pergola
    box(11.5, 17.3, F, F + 3, 23.6, 28.8, M.oak); box(11.8, 17, F + 2.2, F + 2.7, 23.9, 28.5, M.water, nc);
    box(5, 7.2, F, F + 1.2, 24, 29, M.oak); box(7.8, 10, F, F + 1.2, 24, 29, M.oak);
  },
});
