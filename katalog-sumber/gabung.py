"""Menggabungkan katalog mapel literasi tambahan (hasil Sonnet) ke katalog-materi.json.
Pakai: python3 katalog-sumber/gabung.py"""
import json, re, os, glob
R = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(R, '..', 'katalog-materi.json')
K = json.load(open(P))
FASE = {'1':'A','2':'A','3':'B','4':'B','5':'C','6':'C'}
MAPEL = {
 'pancasila': {'nama': 'Pendidikan Pancasila', 'kode': 'pan',
   'aturan': ['Tokoh sejarah nyata (misalnya perumus Pancasila) boleh disebut, tetapi fakta tentangnya HANYA yang umum diajarkan di buku kelas ini; jangan mengarang ucapan atau peristiwa. Maskot pemandu tetap tokoh rekaan.']},
 'pjok': {'nama': 'Pendidikan Jasmani, Olahraga, dan Kesehatan', 'kode': 'pjk',
   'aturan': ['Ini MPI literasi tentang gerak dan kesehatan: murid membaca, memilah, mengurutkan, dan memilih sikap, bukan memperagakan gerakan di layar.',
              'Informasi kesehatan dan pertolongan pertama harus aman dan sesuai buku; bila ragu, anjurkan meminta bantuan orang dewasa atau guru.']},
}
def slug(s):
    s = re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-'); return '-'.join(s.split('-')[:4])
out = {'bahasa-indonesia': {'nama': 'Bahasa Indonesia', 'katalog': 'fokus.literasi'}}
for key, info in MAPEL.items():
    kelas = {}
    for f in sorted(glob.glob(os.path.join(R, key, 'kelas*.json'))):
        d = json.load(open(f)); k = str(d['kelas'])
        mat = []
        for m in d['materi']:
            mid = f"{info['kode']}-{k}-bab{m['bab']}"
            subs = []
            for s in m['sub']:
                s = dict(s); s['id'] = mid + '--' + slug(s['nama']); s['jenisTeks'] = m['jenisTeks']
                subs.append(s)
            mm = {'id': mid, 'bab': m['bab'], 'nama': m['nama'], 'domain': 'Literasi ' + info['nama'],
                  'jenisTeksBab': m['jenisTeks'], 'tema': m['tema'], 'sub': subs}
            if any(s.get('perluDicek') for s in subs): mm['perluDicek'] = True
            mat.append(mm)
        kelas[k] = {'fase': FASE[k], 'buku': d['buku'], 'materi': mat}
    out[key] = {'nama': info['nama'], 'aturan': info['aturan'], 'kelas': kelas}
K['mapelLiterasi'] = out
K['versi'] = '2.1'
json.dump(K, open(P, 'w'), ensure_ascii=False, indent=1)
n = sum(len(m['sub']) for x in out.values() if 'kelas' in x for kk in x['kelas'].values() for m in kk['materi'])
print('mapel literasi tambahan:', [k for k in out if k != 'bahasa-indonesia'], 'sub:', n)
