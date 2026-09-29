"""Download the free CC0 Poly Haven assets used by build_scene.py into render/assets/.

Run once:  python3 render/fetch_assets.py
Everything comes from https://polyhaven.com (CC0 — free for any use).
"""
import json, os, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'assets')
API = 'https://api.polyhaven.com/files/'

HDRI = ('kloofendal_48d_partly_cloudy_puresky', '4k')
TEXTURES = {  # id: resolution
    'painted_plaster_wall': '2k',   # our walls
    'clay_plaster': '2k',           # terracotta cladding micro-detail
    'grey_plaster': '2k',           # neighbours
    'asphalt_02': '2k',
    'rectangular_paving': '2k',     # car apron / entry
    'concrete_floor': '2k',         # footpath, kerb
    'granite_wall': '1k',           # plinth
    'aerial_grass_rock': '2k',
    'marble_tiles': '2k',           # living / entry floor
    'wood_floor': '2k',             # teak main door, deck
}
MODELS = {'tree_small_02': '1k', 'shrub_02': '1k', 'shrub_04': '1k', 'potted_plant_04': '1k', 'grass_medium_01': '1k',
          # living room (interior render)
          'sofa_02': '2k', 'modern_arm_chair_01': '2k', 'modern_coffee_table_01': '2k', 'side_table_01': '2k',
          'potted_plant_02': '1k', 'throw_pillows_01': '1k', 'Chandelier_03': '1k', 'brass_diya_lantern': '1k',
          'carved_wooden_elephant': '1k', 'hanging_picture_frame_01': '1k', 'planter_box_01': '1k'}
MAPS = ('Diffuse', 'nor_gl', 'Rough')

def get(url, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    print('  ↓', os.path.relpath(dest, OUT), flush=True)
    req = urllib.request.Request(url, headers={'User-Agent': 'myhome-render/1.0'})
    with urllib.request.urlopen(req) as r, open(dest + '.part', 'wb') as f:
        while chunk := r.read(1 << 20):
            f.write(chunk)
    os.replace(dest + '.part', dest)

def files(asset):
    req = urllib.request.Request(API + asset, headers={'User-Agent': 'myhome-render/1.0'})
    return json.load(urllib.request.urlopen(req))

def main():
    hid, res = HDRI
    print('HDRI', hid)
    get(files(hid)['hdri'][res]['hdr']['url'], os.path.join(OUT, 'hdri', f'{hid}.hdr'))
    for tid, res in TEXTURES.items():
        print('texture', tid)
        f = files(tid)
        for m in MAPS:
            if m in f:
                get(f[m][res]['jpg']['url'], os.path.join(OUT, 'textures', tid, f'{m}.jpg'))
    for mid, res in MODELS.items():
        print('model', mid)
        b = files(mid)['blend'][res]['blend']
        base = os.path.join(OUT, 'models', mid)
        get(b['url'], os.path.join(base, f'{mid}.blend'))
        for rel, inc in b.get('include', {}).items():
            get(inc['url'], os.path.join(base, rel))
    print('done ->', OUT)

if __name__ == '__main__':
    sys.exit(main())
