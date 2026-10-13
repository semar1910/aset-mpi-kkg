"""Menyusun prompt v2 dari katalog-materi.json.
Pakai: python3 prompt/buat-prompt.py <id-sub> [jumlahLevel] > prompt.txt
"""
import json, sys, os
R = os.path.dirname(os.path.abspath(__file__))
K = json.load(open(os.path.join(R, '..', 'katalog-materi.json')))
KIT = 'https://cdn.jsdelivr.net/gh/semar1910/aset-mpi-kkg@main/kit/v1/kit-mpi.js'

def cari(sid):
    for fk, F in K['fokus'].items():
        for kls, Kk in F['kelas'].items():
            for m in Kk['materi']:
                for s in m['sub']:
                    if s['id'] == sid: return fk, F, kls, Kk, m, s
    sys.exit('id tidak ditemukan: ' + sid)

MESIN = {
 'cerita': """cerita — kisah bergambar dengan pertanyaan
  { mesin:'cerita', judul:'...', adegan:[
      { nama:'Tokoh', teks:'...' },
      { nama:'Tokoh', teks:'...', tanya:'...?', pilihan:[
          { teks:'...', benar:true, tanggapan:'pujian + alasan' },
          { teks:'...', tanggapan:'petunjuk, bukan jawaban' } ] } ] }
  Maks 3 pilihan. teks+tanya maks 45 kata.""",
 'bacaan': """bacaan — buku halaman demi halaman, satu aktivitas per halaman
  { mesin:'bacaan', judul:'...', halaman:[
      { judul:'...', teks:'...', aktivitas:{ jenis:'tebak', tanya:'...?', pilihan:['..','..','..'], ulasan:'...' } },
      { judul:'...', teks:'... kalimat bukti ...', aktivitas:{ jenis:'bukti', tanya:'...?', kunci:'potongan kalimat PERSIS dari teks', ulasan:'...', petunjuk:'...' } },
      { judul:'...', teks:'...', aktivitas:{ jenis:'rumpang', kalimat:'Kata [jawaban] di dalam kurung siku.', pengecoh:['..','..'], ulasan:'...' } },
      { judul:'...', teks:'...', aktivitas:{ jenis:'pilih', tanya:'...?', pilihan:['..','..','..'], benar:0, ulasan:'...', petunjuk:'...' } } ] }
  Paragraf dipisah \\n. Boleh tambah glosarium:{ 'kata':'arti' } di DATA utama.""",
 'sortir': """sortir — seret kartu ke kategori
  { mesin:'sortir', judul:'...', kategori:[ { nama:'🅰 ...' }, { nama:'🅱 ...' } ],
    kartu:[ { teks:'...', ke:0 }, { teks:'...', ke:1, petunjuk:'muncul bila salah' } ] }
  2–3 kategori, 6–8 kartu (maks 10). ke = nomor kategori mulai 0.""",
 'cocokkan': """cocokkan — pasangkan kiri dan kanan
  { mesin:'cocokkan', judul:'...', pasangan:[ ['kiri','kanan','ulasan opsional'], ... ] }
  3–5 pasangan.""",
 'urutkan': """urutkan — susun urutan yang benar
  { mesin:'urutkan', judul:'...', urutan:['langkah 1','langkah 2','langkah 3','langkah 4'], ulasan:'...' }
  Tulis dalam urutan BENAR (kit yang mengacak). 3–5 langkah, tiap langkah maks 6 kata.""",
 'runner': """runner — lari ke gerbang jawaban benar
  { mesin:'runner', judul:'...', jumlah:8, nyawa:3, kecepatan:1,
    soal:[ { tanya:'...?', pilihan:['A','B','C'], benar:0, penjelasan:'...' }, ... ] }
  ATAU soal acak: buatSoal:function(ke){ ...; return { tanya, pilihan:[3 teks], benar, penjelasan }; }
  Tepat 3 pilihan, tidak kembar, tiap pilihan maks 14 huruf. tanya maks 12 kata.""",
 'jelajah': """jelajah — sentuh titik pada gambar, lalu pasang label
  { mesin:'jelajah', judul:'...', gambar:'namaGambar', rasio:4/3,
    titik:[ { x:50, y:20, nama:'...', info:'...' }, ... ] }
  x,y = persen dari kiri-atas gambar. Maks 8 titik. HANYA dipakai bila gambarnya disediakan guru.""",
}

def prompt(sid, nLevel=3):
    fk, F, kls, Kk, m, s = cari(sid)
    A = K['aturanKelas'][kls]
    lit = fk == 'literasi'
    mesin = list(s['mesin'])
    for x in ['cerita', 'sortir', 'cocokkan', 'urutkan']:
        if len(mesin) >= 4: break
        if x not in mesin and not (x == 'jelajah'): mesin.append(x)
    if 'jelajah' in mesin: mesin.remove('jelajah')  # tanpa gambar guru, jelajah tidak dipakai
    baris = []
    t = baris.append
    t('Kamu adalah perancang media pembelajaran interaktif (MPI) untuk anak SD di Indonesia.')
    t('Buat SATU berkas HTML lengkap yang memakai KIT MPI. Tampilan, tombol, suara, dan permainan sudah disediakan kit.')
    t('Tugasmu HANYA menulis DATA pelajaran yang benar, menarik, dan sesuai kelas.')
    t('')
    t('## MATERI')
    t(f"- Fokus: {F['nama']} ({F['mapel']}), Kelas {kls} (Fase {Kk['fase']})")
    t(f"- Buku: {Kk['buku']}, Bab {m['bab']}: {m['nama']}")
    t(f"- Sub-materi: {s['nama']}")
    t(f"- Tujuan: {s['tujuan']}")
    t(f"- Konsep inti (wajib benar): " + '; '.join(s['konsep']))
    t(f"- Miskonsepsi murid (pakai sebagai pilihan pengecoh dan sasaran tanggapan): " + '; '.join(s['miskonsepsi']))
    if s.get('rentang'): t(f"- Rentang angka: {s['rentang']}")
    if lit: t(f"- Jenis teks: {m.get('jenisTeksBab','')}; kompetensi membaca: {', '.join(s['kompetensi'])}")
    t(f"- Ide konteks cerita (dari tema bab): " + '; '.join(s['konteks']))
    t('')
    t('## ATURAN BAHASA KELAS ' + kls)
    t(f"- Maks {A['kataPerHalaman']} kata per halaman/adegan, maks {A['kataPerKalimat']} kata per kalimat.")
    t(f"- Bahasa: {A['bahasa']}.")
    if not lit: t(f"- Bilangan: {A['angka']}.")
    if A.get('catatan'): t(f"- {A['catatan']}.")
    t('- Bahasa Indonesia baku yang ramah anak. Sapa murid dengan "kamu".')
    t('')
    t('## RANCANGAN')
    t(f'- Buat {nLevel} level yang naik bertahap: kenali → latih → terapkan. Tiap level memakai mesin berbeda.')
    t('- Mesin yang disarankan untuk materi ini: ' + ', '.join(mesin) + '.')
    t('- Satu tokoh pemandu (maskot) rekaan yang menemani dari awal sampai akhir. Beri nama yang mudah diingat.')
    t('- Cerita pembuka 2–3 adegan pendek yang membuat murid penasaran dan memberi misi.')
    t('- Jawaban salah dibalas petunjuk yang membantu berpikir, bukan langsung jawabannya.')
    t('- Bacaan, cerita, dan soal ditulis BARU. Jangan menyalin teks buku. Jangan memakai tokoh nyata; pakai tokoh rekaan.')
    t('- Semua fakta harus benar secara ilmiah dan sesuai buku kelas ini. Jangan menambah materi di luar konsep inti.')
    t('')
    t('## FORMAT BERKAS (ikuti persis)')
    t('```html')
    t('<!DOCTYPE html>\n<html lang="id">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">')
    t('<title>JUDUL MPI</title>')
    t(f'<script src="{KIT}"></script>')
    t('</head>\n<body>\n<script>\nKIT.mulai({ /* DATA */ });\n</script>\n</body>\n</html>')
    t('```')
    t('Jangan menulis CSS, HTML lain, atau JavaScript lain selain isi KIT.mulai (kecuali fungsi buatSoal bila memakai runner acak).')
    t('')
    t('## KERANGKA DATA')
    t('```js')
    t("KIT.mulai({\n  judul: 'Judul pendek dan menarik',\n  subjudul: 'Satu baris tentang isinya',")
    t(f"  tema: '{m['tema']}',   // pilihan: emas, hutan, samudra, antariksa, jingga")
    t(f"  identitas: {{ mapel:'{F['mapel']}', kelas:{kls}, materi:'{s['nama']}', penyusun:'NAMA GURU', sekolah:'NAMA SEKOLAH' }},")
    t("  maskot: { nama:'Nama Maskot' },")
    t("  cerita: [ { nama:'Nama Maskot', teks:'...' }, ... ],   // 2–3 adegan, maks 40 kata")
    t("  level: [ /* lihat MESIN di bawah */ ],")
    t("  penutup: { lencana:'Gelar untuk murid', ringkasan:['3 poin inti'], refleksi:'Satu pertanyaan reflektif' },")
    t("  guru: { tujuan:'...', durasi:'2 × 35 menit', langkah:['3–4 langkah memakai MPI di kelas'] }\n});")
    t('```')
    t('Teks boleh memakai **tebal** dan \\n untuk baris baru. Jangan tulis bagian `gambar` kecuali guru memberi alamat gambar.')
    t('')
    t('## MESIN YANG TERSEDIA')
    for x in ['cerita', 'bacaan', 'sortir', 'cocokkan', 'urutkan', 'runner']:
        t('- ' + MESIN[x])
    t('')
    t('## PERIKSA SEBELUM MENGIRIM')
    t('1. Setiap pilihan/kartu/pasangan sudah dicek benar-salahnya; indeks `benar` dan `ke` mulai dari 0.')
    t('2. Kunci `bukti` muncul PERSIS di teks halamannya. Kata dalam [ ] pada rumpang muncul di bacaan.')
    t('3. Batas kata kelas ini dipatuhi; runner tepat 3 pilihan, maks 14 huruf, tidak kembar.')
    t("4. Kode JavaScript valid: koma, tanda petik, dan kurung lengkap. Teks yang memuat tanda petik satu (') ditulis di dalam petik dua.")
    t('')
    t('Kirim sebagai SATU berkas HTML siap unduh. Setelah berkas, tulis satu baris: NAMA FILE: <judul-pendek>.html')
    return '\n'.join(baris)

if __name__ == '__main__':
    print(prompt(sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 3))
