/*!
 * KIT MPI v1 — KKG SD Gugus 2 Cibatok
 * Bingkai tampilan + mesin permainan untuk Media Pembelajaran Interaktif.
 * Pakai:  <script src=".../kit-mpi.js"></script>
 *         <script> KIT.mulai({ ...DATA... }); </script>
 * Panduan lengkap: PANDUAN.md di repo aset-mpi-kkg.
 * v1.3: ikon SVG (tanpa emoji), variasi tampilan otomatis dari judul
 *       (layar judul, pola latar, arah gradasi), opsi peta:'jalur'.
 * v1.4: mesin baru memori (data seperti cocokkan) dan isian (papan angka).
 * v1.6: mesin visual numerasi garis (garis bilangan) dan pecahan (warnai / baca gambar).
 * v1.7: mesin visual numerasi jam (putar jarum menit / baca jam analog, tampilan digital opsional).
 * v1.8: mesin visual numerasi uang (susun nominal dari pecahan / susun kembalian; gambar uang buatan sendiri,
 *       tombol hapus per lembar, dompet maksimal 12 lembar). Mesin lama tidak diubah.
 * v1.9: mesin visual numerasi timbangan (neraca dua lengan miring sesuai selisih berat; jenis 'seimbang' = taruh anak timbang
 *       sampai seimbang, jenis 'cari' = pilih anak timbang pengganti tanda tanya). Mesin lama tidak diubah.
 * v1.10: mesin visual numerasi petak (bangun datar di kotak berpetak; jenis 'warnai' = warnai petak sampai luas atau
 *       keliling sesuai soal, jenis 'hitung' = baca bentuk lalu pilih luas atau keliling; kunci dihitung MPI). Mesin lama tidak diubah.
 * v1.11: mesin visual numerasi kuis (pilihan ganda fleksibel: jenis 'tunggal' 2–4 pilihan satu benar, jenis 'jamak' 2–5 pilihan pilih semua
 *       yang benar; pilihan panjang sampai 60 huruf, bacaan dan gambar opsional di sisi kiri, pilihan diacak tiap main dengan kunci dihitung
 *       ulang, tanggapan khusus per pengecoh). Menutup keterbatasan runner. Mesin lama tidak diubah.
 * v1.12: peta jalur tidak lagi memakai gambar.latar (pemandangan depan, tidak serasi dengan jalan dari atas);
 *        ia memakai gambar.peta (pemandangan dari atas) bila ada, bila tidak memakai pola warna. Peta kartu tetap memakai latar.
 * v1.13: bacaan gaya buku (gaya:'buku': buku cerita terbuka, sampul, balik halaman 3D, gambar tunggal/daftar) dan adegan
 *        (halaman.adegan: latar + 1–5 objek + maskot berpose; dipakai di bacaan biasa dan di halaman kiri gaya buku).
 *        Bacaan tanpa gaya dan tanpa adegan tidak berubah.
 * v1.14: runner: opsi level naik (kenaikan kecepatan per jawaban benar, bawaan 0.12, 0 = kecepatan tetap) dan batas (kecepatan
 *        maksimal, bawaan 2.2); batas otomatis tidak di bawah kecepatan awal; periksaData memeriksa kecepatan 0.3–2, naik 0–0.3,
 *        batas 0.5–2.2 (angka tanpa tanda petik). Tanpa opsi baru perilaku lama tidak berubah.
 * v1.15: fondasi keluarga sasaran (jalankanSasaran, periksaSasaran) + mesin tembak (arahkan meriam ke sasaran berisi pilihan
 *        jawaban, lalu tekan Tembak; hati, bintang, bank soal sama dengan runner dan kuis). Mesin lama tidak diubah.
 * v1.16: tampilan balon pada keluarga sasaran (ketuk balon yang jawabannya benar; data sama dengan tembak). Mesin lama tidak diubah.
 * v1.17: tampilan pancing pada keluarga sasaran (geser kail ke atas ikan, tekan Pancing; ikan diam; data sama dengan tembak). Mesin lama tidak diubah.
 * v1.18: tampilan tangkap pada keluarga sasaran (jawaban jatuh pelan, geser keranjang dan tahan di bawah jawaban yang benar; terlewat tidak menghukum); pesan salah fondasi dibuat netral.
 * v1.19: mesin labeli (seret nama ke gambar yang sesuai, atau seret gambar ke kotak nama; arah:'nama-ke-gambar' bawaan atau
 *        'gambar-ke-nama'; data berbentuk pasangan [gambar, nama, ulasan, petunjuk], bank soal jumlah). Mesin lama tidak diubah.
 * v1.21: robot punya mode jawab (jenis:'jawab'): papan berisi kotak pilihan A–D di baris atas, murid menyusun perintah
 *        atas/bawah/kiri/kanan agar robot masuk ke kotak jawaban benar tanpa menyentuh batu, kayu, atau monster. Robot tegak, menghadap kiri/kanan.
 *        Contoh: { mesin:'robot', jenis:'jawab', soal:[ { tanya:'...', pilihan:['a','b','c'], benar:1 } ] }. Mode bendera tidak berubah.
 * v1.20: penambahan sembilan mesin: penyunting, sudut, grafik, silang, robot, carikata, jejak, sorot, tandai.
 *        robot = susun perintah (maju/belok) agar robot sampai ke bendera di kotak-kotak (kolom 3-7, baris 3-5, rintangan,
 *        batas perintah 'maks'; tanpa 'jawab', jalur terpendek dihitung otomatis). Pesan galat robot kini menyebut
 *        mulai/tujuan yang belum diisi. Soal robot tanpa mulai/tujuan/rintangan dibuat acak otomatis (ada batu, belokan, dan bintang yang harus diambil dulu; bintang:0 untuk mematikan). Mesin lama tidak diubah.
 * v1.22: PENGAIT PETA KHUSUS (hookPeta 1). Berkas terpisah kit-peta.js boleh mendaftarkan gaya peta level lewat
 *        (window.KIT_PETA = window.KIT_PETA || {}).nama = function (k) { ... }. DATA memakai peta:'nama'. Urutan muat
 *        dua berkas bebas. peta:'otomatis' tanpa gaya terdaftar jatuh ke peta jalur lama; gaya yang melempar galat
 *        juga jatuh ke peta jalur lama. Peta jalur dan peta kartu tidak diubah.
 * v1.23: PEMUAT kit-peta.js. Bila DATA memakai peta selain 'jalur'/'kartu', kit memuat kit-peta.js dari folder yang sama
 *        dengan dirinya (alamat diturunkan dari alamat skrip kit, jadi pin versi lewat tag ikut berlaku).
 *        Terlambat (> 1,5 detik) atau gagal → peta jalur lama. MPI dengan peta:'jalur' atau 'kartu' tidak mengunduh apa pun.
 * v1.24: PENGAIT MESIN LUAR (hookMesin 1) untuk permainan kelompok/papan di berkas kit-kelompok.js. Mesin luar mendaftar lewat
 *        (window.KIT_MESIN = window.KIT_MESIN || {}).nama = { jalan:function(lv, api, k){}, periksa:function(lv, n, e, k){}, nama:'..' }.
 *        Bila ada level bermesin yang tidak dikenal, kit memuat kit-kelompok.js lebih dulu (maks 5 detik). Fungsi k.jalankanTantangan
 *        menjalankan SATU soal dari mesin kit yang sudah ada (kuis, tembak, rangkai, dst.) dan melaporkan benar atau salah; k.periksaLevel
 *        memakai pemeriksa data yang sama. Mesin dan peta lama tidak diubah.
 * v1.25: MAIN BERSAMA (hookKelompok 1). Tombol "Main Bersama" di layar judul (bila soal MPI cukup, minimal 6) memuat kit-kelompok.js lalu memanggil
 *        (window.KIT_KELOMPOK).mulai(k). Kit mengumpulkan soal dari SEMUA level (pilihan, jawab kata, mesin khusus) dan k.tantang(cb) menjalankan
 *        satu soal acak, didandani ke mesin lain yang cocok (kuis, tembak, balon, pancing, tangkap, runner; rangkai, huruf, rakit) bila lolos aturan,
 *        jika tidak memakai mesin aslinya. Tanpa level, bintang, atau progres. Data AI tidak berubah.
 * v1.26: BINGKAI HUD (opsional) untuk permainan kelompok: k.bingkai(judul, { gaya:'hud' }). Adegan penuh (api.area setinggi bingkai), tombol menu
 *        bulat + tombol "?" melayang, menu jeda, tombol aksi melayang di bawah tengah, maskot + balon sementara di kiri bawah, judul besar 2 detik,
 *        api.zonaAman(), api.jeda()/api.lanjutkan hook api.saatJeda(bool), api.petunjuk(tutup) dan api.pengaturan(tutup). Tanpa opsi, bingkai lama tidak berubah.
 * v1.26.3: PANEL GALAT lebih berguna. Tiap masalah ditulis dengan BAGIAN (level, mesin, nomor soal), MASALAH, dan PERBAIKAN. Tombol "Salin untuk AI"
 *        menyalin pesan siap kirim (perintah perbaiki + daftar masalah + versi kit), dengan kotak teks cadangan bila penyalinan otomatis ditolak.
 * v1.5: progres tersimpan, tombol dengarkan, soal salah diulang, bank soal (jumlah),
 *       mode tim, hasil murid + papan skor (bila diputar dari server KKG).
 */
(function () {
  'use strict';
  var VERSI = '1.26.3';
  /* Panggung dirancang untuk HP mendatar: tinggi tetap 540, lebar mengikuti layar (960–1200). */
  var H = 540, W_MIN = 960, W_MAX = 1200, W = W_MIN;

  /* ════════════════════════════ TEMA ════════════════════════════ */
  var TEMA = {
    emas:      { c1: '#FFD54A', c2: '#F5A623', lip: '#7A4512', aksen: '#FFD54A', gelap: '42,26,14',  tinta: '#3B2410', kertas: '#FFF6DC', bg1: '#3B2412', bg2: '#9A5B1E', nama: 'Emas Nusantara' },
    hutan:     { c1: '#B4EC6A', c2: '#5DBB2F', lip: '#1F5A1A', aksen: '#FFE066', gelap: '16,44,26',  tinta: '#173A1F', kertas: '#F2FBE7', bg1: '#123F24', bg2: '#2E8B57', nama: 'Hutan Ceria' },
    samudra:   { c1: '#7FE6F5', c2: '#1FA9D6', lip: '#0B4A6E', aksen: '#FFE066', gelap: '10,36,54',  tinta: '#0D3550', kertas: '#EAF9FD', bg1: '#0E3D5C', bg2: '#1F8FB3', nama: 'Samudra' },
    antariksa: { c1: '#D2ADFF', c2: '#8A5CF5', lip: '#35196F', aksen: '#FFD1F0', gelap: '26,18,64',  tinta: '#2A1658', kertas: '#F4EEFF', bg1: '#1B1446', bg2: '#5B34A8', nama: 'Antariksa' },
    jingga:    { c1: '#FFC062', c2: '#FF7A3D', lip: '#8A2E12', aksen: '#FFE066', gelap: '58,23,12',  tinta: '#4A1C0C', kertas: '#FFF2E6', bg1: '#7A2810', bg2: '#E8642C', nama: 'Jingga Ceria' }
  };

  /* ════════════════════════════ IKON SVG ════════════════════════════
     Semua ikon kit berupa SVG garis (warna ikut teks), bukan emoji,
     supaya tampil sama di semua HP dan selaras dengan tema. */
  var IK = {
    rumah: '<path d="M3 11.5 12 4l9 7.5M5.5 10v10h4.5v-6h4v6h4.5V10"/>',
    peta: '<path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20zM9 4v13.5M15 6.5V20"/>',
    kunci: '<circle cx="8" cy="15" r="4.2"/><path d="m11 12 9-9M16.5 6.5l3 3M14 9l2 2"/>',
    gembok: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2.5"/>',
    gembokBuka: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 7.6-1.8M12 14.5v2.5"/>',
    suara: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9.5a3.5 3.5 0 0 1 0 5M18 7a7 7 0 0 1 0 10"/>',
    bisu: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>',
    penuh: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    lewati: '<path d="M4 5.5 11.5 12 4 18.5zM12 5.5l7.5 6.5-7.5 6.5z" fill="currentColor"/>',
    lanjut: '<path d="M7.5 4.5 19.5 12l-12 7.5z" fill="currentColor"/>',
    kiri: '<path d="M16.5 4.5 4.5 12l12 7.5z" fill="currentColor"/>',
    ulangi: '<path d="M20 12a8 8 0 1 1-2.4-5.7M20 4.5v4.8h-4.8"/>',
    piala: '<path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0zM7.5 6H4.5a3 3 0 0 0 3.6 3.9M16.5 6h3a3 3 0 0 1-3.6 3.9M12 13.5V17M8 20.5h8M9.5 17h5v3.5h-5z"/>',
    tutup: '<path d="M6 6l12 12M18 6 6 18"/>',
    centang: '<path d="M5 12.5 9.5 17 19 7"/>',
    panah: '<path d="M4 12h15M13 6l6 6-6 6"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
    wajah: '<circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r="1.2" fill="currentColor"/><circle cx="15" cy="10" r="1.2" fill="currentColor"/><path d="M8.5 14a4 4 0 0 0 7 0"/>',
    bendera: '<path d="M5.5 21V3.5M5.5 4h11l-2.5 4 2.5 4h-11"/>',
    hatiPatah: '<path d="M12 20s-7-4.4-9-9a4.8 4.8 0 0 1 9-3 4.8 4.8 0 0 1 9 3c-2 4.6-9 9-9 9z"/><path d="m12 8-2 3.5 3 2-1 3.5"/>',
    lampu: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2v.5h5V16c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
    lup: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    gir: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
    tanya: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.6a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.6"/><circle cx="12" cy="17" r="1.1" fill="currentColor"/>',
    buku: '<path d="M3 5.5c3-1.2 6-1.2 9 .8 3-2 6-2 9-.8V19c-3-1.2-6-1.2-9 .8-3-2-6-2-9-.8zM12 6.3v13.5"/>',
    halaman: '<path d="M6 3h9l4 4v14H6zM14.5 3v4.5H19M9 12h7M9 16h7"/>',
    keranjang: '<path d="M3 10h18l-2 10H5zM7.5 10l4-6M16.5 10l-4-6M9.5 13.5v3.5M14.5 13.5v3.5"/>',
    rantai: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    urutan: '<path d="M10 6h10M10 12h10M10 18h10M4 5l1.5-1V8M3.5 11.3a1.4 1.4 0 0 1 2.6.8L3.5 15.5h2.8"/>',
    jalur: '<path d="M4.5 20.5 9 3.5M19.5 20.5 15 3.5M12 5.5v2M12 10.5v2.5M12 16.5v3"/>',
    memori: '<rect x="3" y="6" width="10" height="14" rx="2"/><path d="M13 4.5h6a2 2 0 0 1 2 2V16a2 2 0 0 1-2 2h-6M8 11.5v.01M8 14.5v.01"/>',
    papan: '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8.5 8h.01M12 8h.01M15.5 8h.01M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h7"/>',
    garis: '<path d="M3 15h18M5 12v6M10 13v4M15 13v4M19 12v6M10 4.5l2 3.5 2-3.5z"/>',
    pecahan: '<circle cx="12" cy="12" r="9"/><path d="M12 12V3M12 12l7.8 4.5M12 12l-7.8 4.5"/>',
    jam: '<circle cx="12" cy="12" r="9"/><path d="M12 6.5V12l3.8 2.3"/>',
    uang: '<rect x="2.5" y="6" width="19" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.8"/><path d="M6 12h.01M18 12h.01"/>',
    hapus: '<path d="M9 5h11v14H9l-6-7z"/><path d="m12 9.5 5 5M17 9.5l-5 5"/>',
    timbangan: '<path d="M12 3.5v16M7.5 20.5h9M4 7h16M4 7l-2.3 6.5h4.6zM20 7l-2.3 6.5h4.6z"/>',
    label: '<path d="M3 3h8.2l9.5 9.5a1.6 1.6 0 0 1 0 2.2l-5.9 5.9a1.6 1.6 0 0 1-2.2 0L3 11.2z"/><circle cx="7.6" cy="7.6" r="1.5" fill="currentColor"/>',
    kuis: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M7 9l1.4 1.4L11 7.6M7 15.6l1.4 1.4 2.6-2.8M14 9h3.5M14 16h3.5"/>',
    petak: '<rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/><path d="M3 15h12v6H3zM9 9h6v6H9z" fill="currentColor"/>',
    tembak: '<circle cx="12" cy="12" r="7"/><path d="M12 2.5v5M12 16.5v5M2.5 12h5M16.5 12h5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>'
  };
  IK.balon = '<path d="M12 2.8c3.6 0 6 2.6 6 6 0 3.7-3 6.3-6 7.2-3-.9-6-3.5-6-7.2 0-3.4 2.4-6 6-6z"/><path d="M10.6 18.2h2.8l-1.4-1.8zM12 18.2c-1.6 1.2 1.6 2.2 0 3.8"/>';
  IK.pancing = '<path d="M12 3v12.2a3.3 3.3 0 0 1-6.6 0"/><path d="M5.4 15.2l-1.8-1.8"/><circle cx="12" cy="3" r="0.9" fill="currentColor"/>';
  IK.tangkap = '<path d="M3.5 11h17l-2 8.5h-13z"/><path d="M8 11l.9 8.5M12 11v8.5M16 11l-.9 8.5"/><circle cx="12" cy="5.2" r="2.2" fill="currentColor"/>';
  IK.rakit = '<rect x="2" y="8" width="6" height="8" rx="1.6"/><rect x="9" y="8" width="6" height="8" rx="1.6"/><rect x="16" y="8" width="6" height="8" rx="1.6"/><path d="M3.9 14l1.1-3.2L6.1 14M4.3 12.8h1.4M10.6 10.8h2.8M12 10.8v3.4M17.7 14.2v-3.4h1.6a1.1 1.1 0 0 1 0 2.2h-1.6M2 19.5h20"/>';
IK.tandai = '<path d="M3 6h18M3 18h8M16 18h5"/><rect x="5" y="9.5" width="10" height="5.5" rx="1.6"/><path d="M15.5 11.5l5.5 2.3-2.3 1.2 1.5 2.7-1.4.8-1.5-2.7-1.8 1.7z"/>';
IK.sorot = '<path d="M15 4.2l4.8 4.8-8.6 8.6-5.5.7.7-5.5z"/><path d="M12.6 6.6l4.8 4.8M3.5 21h9"/>';
IK.jejak = '<path d="M4.5 18.5c3 2 7 0 7-5s3-6.5 7.5-5" stroke-dasharray="2.6 2.6"/><circle cx="4.5" cy="18.5" r="1.6" fill="currentColor"/><path d="M16.5 4.5 20 8l-4.6 1.6"/>';
IK.carikata = '<rect x="2.5" y="3" width="14.5" height="14.5" rx="2.5"/><path d="M6.5 7.5h.01M10 7.5h.01M13.5 7.5h.01M6.5 10.8h.01M10 10.8h.01M13.5 10.8h.01M6 14h8"/><circle cx="16.5" cy="16.5" r="3.6"/><path d="m19.2 19.2 2.3 2.3"/>';
IK.robot = '<rect x="5" y="8.5" width="14" height="11" rx="3"/><path d="M12 8.5V5M12 5h.01M9.2 13.2h.01M14.8 13.2h.01M9.5 16.6h5M3 12v4M21 12v4"/>';
IK.silang = '<rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/><path d="M15 3h6v6h-6zM3 15h6v6H3z" fill="currentColor"/>';
IK.grafik = '<path d="M3.5 3.5v17h17M8 16.5v-5M12.5 16.5V7.5M17 16.5v-7"/>';
IK.sudut = '<path d="M4 19.5h16M4 19.5 15.5 6M9 19.5a5 5 0 0 0-1.7-3.8"/>';
IK.penyunting = '<path d="M3 6.5h9M3 11.5h5.5M3 16.5h6"/><path d="M13.5 19l.8-3.3 5.9-5.9a1.4 1.4 0 0 1 2 0l.5.5a1.4 1.4 0 0 1 0 2l-5.9 5.9z"/>';
IK.rangkai = '<rect x="3" y="3.5" width="8" height="8" rx="2"/><rect x="13" y="3.5" width="8" height="8" rx="2"/><path d="M5.2 9l1.8-4.2L8.8 9M5.9 7.6h2.2M15.5 4.8v5.4M15.5 4.8h1.6a1.4 1.4 0 0 1 0 2.8h-1.6M15.5 7.6h1.9a1.4 1.4 0 0 1 0 2.6h-1.9M3.5 17h7M13.5 17h7M3.5 20.5h7M13.5 20.5h7"/>';
IK.huruf = '<rect x="2.6" y="6.5" width="8.6" height="11" rx="2.2"/><rect x="12.8" y="6.5" width="8.6" height="11" rx="2.2" stroke-dasharray="2.4 2.6"/><path d="M4.8 14.6 6.9 9.4l2.1 5.2M5.6 13h2.6"/>';
  var IKON_MESIN = { cerita: 'buku', bacaan: 'halaman', sortir: 'keranjang', cocokkan: 'rantai', urutkan: 'urutan', runner: 'jalur', jelajah: 'lup', memori: 'memori', isian: 'papan', garis: 'garis', pecahan: 'pecahan', jam: 'jam', uang: 'uang', timbangan: 'timbangan', petak: 'petak', kuis: 'kuis', tembak: 'tembak', balon: 'balon', pancing: 'pancing', tangkap: 'tangkap', labeli: 'label', rakit: 'rakit', huruf: 'huruf', rangkai: 'rangkai', penyunting: 'penyunting', sudut: 'sudut', grafik: 'grafik', silang: 'silang', robot: 'robot', carikata: 'carikata', jejak: 'jejak', sorot: 'sorot', tandai: 'tandai' };
  var BENTUK_BINTANG = 'M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 17.4l-5.8 3 1.1-6.4-4.7-4.6 6.5-.9z';
  var BENTUK_HATI = 'M12 20.5s-7.4-4.6-9.4-9.4A5 5 0 0 1 12 7.6a5 5 0 0 1 9.4 3.5c-2 4.8-9.4 9.4-9.4 9.4z';
  function ik(nama, kelas, gaya) {
    return '<svg class="k-ik' + (kelas ? ' ' + kelas : '') + '" viewBox="0 0 24 24" aria-hidden="true"' +
      (gaya ? ' style="' + gaya + '"' : '') + '>' + (IK[nama] || IK.target) + '</svg>';
  }
  function ikBintang(nyala, gaya) {
    return '<svg class="k-ik bt' + (nyala ? '' : ' mati') + '" viewBox="0 0 24 24" aria-hidden="true"' +
      (gaya ? ' style="' + gaya + '"' : '') + '><path d="' + BENTUK_BINTANG + '"/></svg>';
  }
  function ikHati(nyala) {
    return '<svg class="k-ik ht' + (nyala ? '' : ' mati') + '" viewBox="0 0 24 24" aria-hidden="true"><path d="' + BENTUK_HATI + '"/></svg>';
  }
  function deretBintang(b) {
    var h = '';
    for (var k = 1; k <= 3; k++) h += ikBintang(k <= b);
    return h;
  }
  function pialaBesar() {
    return '<svg viewBox="0 0 120 120" width="170" height="170" aria-hidden="true" style="overflow:visible">' +
      '<path d="M36 18h48v30a24 24 0 0 1-48 0z" style="fill:var(--aksen);stroke:var(--lip)" stroke-width="5" stroke-linejoin="round"/>' +
      '<path d="M36 28H22a14 14 0 0 0 17 18M84 28h14a14 14 0 0 1-17 18" fill="none" style="stroke:var(--lip)" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M54 70h12v16H54z" style="fill:var(--c2);stroke:var(--lip)" stroke-width="5" stroke-linejoin="round"/>' +
      '<rect x="38" y="86" width="44" height="16" rx="5" style="fill:var(--c2);stroke:var(--lip)" stroke-width="5"/>' +
      '<path d="M47 26v18" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".55"/>' +
      '<path d="' + BENTUK_BINTANG + '" transform="translate(48 26) scale(1)" fill="#fff" opacity=".9"/></svg>';
  }
  var GEMBOK_URL = 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#5E6770" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2.5"/></svg>') + '")';
  var PETUNJUK = {
    cerita: 'Baca ceritanya, lalu pilih jawaban yang tepat.',
    bacaan: 'Baca halaman ini. Sentuh kata bergaris titik untuk melihat artinya.',
    sortir: 'Seret setiap kartu ke keranjang yang tepat.',
    cocokkan: 'Sentuh kartu di kiri, lalu sentuh pasangannya di kanan.',
    urutkan: 'Susun kartu ke kotak bernomor sesuai urutan yang benar.',
    runner: 'Geser ke jalur yang jawabannya benar. Pakai tombol panah atau sentuh jalurnya.',
    jelajah: 'Sentuh setiap titik yang berkedip untuk menjelajah.',
    memori: 'Buka dua kartu. Cari pasangan yang cocok, ingat letaknya!',
    isian: 'Hitung, lalu ketik jawabanmu dengan tombol angka.',
    garis: 'Sentuh atau geser garis bilangan untuk menaruh penanda, lalu tekan Periksa.',
    pecahan: 'Sentuh bagian gambar untuk mewarnainya, lalu tekan Periksa.',
    jam: 'Geser jarum menit sampai jam menunjukkan waktu di soal, lalu tekan Periksa.',
    uang: 'Ketuk uang untuk memasukkannya ke dompet sampai jumlahnya pas. Ketuk uang di dompet untuk mengeluarkannya, lalu tekan Periksa.',
    timbangan: 'Taruh anak timbang di piring kanan sampai neraca seimbang, lalu tekan Periksa.',
    petak: 'Warnai petak (ketuk atau seret) sampai bangunnya sesuai permintaan soal, lalu tekan Periksa.',
    kuis: 'Baca soalnya, pilih satu jawaban yang paling tepat, lalu tekan Periksa.',
    tembak: 'Sentuh atau geser di panggung untuk membidik sasaran yang jawabannya benar, lalu tekan Tembak.',
    balon: 'Ketuk balon yang jawabannya benar.',
    pancing: 'Geser kail ke ikan yang jawabannya benar, lalu tekan Pancing.',
    tangkap: 'Geser keranjang ke bawah jawaban yang benar dan tahan sampai jawabannya jatuh masuk.',
    labeli: 'Seret ke pasangannya yang tepat, atau sentuh dulu lalu sentuh pasangannya.',
    rakit: 'Ketuk kepingan untuk menyusun kata yang dicari. Ketuk kepingan di kotak untuk mengembalikannya, lalu tekan Periksa.',
    huruf: 'Ketuk huruf untuk menyusun kata yang tepat, lalu tekan Periksa.',
    rangkai: 'Ketuk huruf atau kata untuk mengisi kotak jawaban, lalu tekan Periksa. Ketuk kotak untuk mengeluarkannya lagi.',
    penyunting: 'Baca tulisan ini. Ketuk bagian yang keliru, lalu pilih perbaikannya.',
    sudut: 'Pasang busur pada sudut lalu baca besarnya, atau tarik lengan untuk membuat sudut yang diminta.',
    grafik: 'Baca grafik batang dengan teliti. Ketuk batang lalu tekan Periksa, atau pilih jawaban yang tepat.',
    silang: 'Sentuh kotak, baca petunjuk mendatar atau menurun, lalu ketuk huruf untuk mengisi. Tekan Periksa bila semua kotak sudah terisi.',
    robot: 'Susun perintah panah agar robot sampai ke bendera, lalu tekan Jalankan.',
    carikata: 'Cari kata di kotak huruf. Geser jarimu lurus dari huruf pertama sampai huruf terakhir, atau sentuh huruf pertama lalu huruf terakhir.',
    jejak: 'Sentuh titik yang berkedip, lalu seret jarimu mengikuti garis sampai ujung. Ulangi untuk tiap huruf.',
    sorot: 'Pilih stabilo, lalu ketuk bagian teks yang cocok. Ketuk lagi untuk menghapus tandanya, lalu tekan Periksa.',
    tandai: 'Ketuk kata yang sesuai perintah, lalu tekan Periksa. Ketuk lagi untuk membatalkan.'
  };

  /* ════════════════════════════ GAYA ════════════════════════════ */
  var CSS = [
    '#kit{position:fixed;inset:0;background:#120c06;overflow:hidden;touch-action:manipulation;-webkit-tap-highlight-color:transparent}',
    '#kit *{box-sizing:border-box}',
    '#kit-pg{position:absolute;left:50%;top:50%;height:' + H + 'px;overflow:hidden;transform-origin:center;',
    '  font-family:Nunito,"Trebuchet MS",system-ui,sans-serif;font-size:22px;line-height:1.4;color:var(--tinta);',
    '  background:linear-gradient(var(--sudut,160deg),var(--bg1),var(--bg2));user-select:none;-webkit-user-select:none}',
    '#kit-pg .fd{font-family:Fredoka,"Trebuchet MS",system-ui,sans-serif}',
    '.k-lay{position:absolute;inset:0;animation:kMasuk .38s ease-out}',
    '@keyframes kMasuk{from{opacity:0;transform:scale(1.015)}to{opacity:1;transform:none}}',
    '.k-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}',
    '.k-pola{position:absolute;inset:0;opacity:.08;background-image:repeating-linear-gradient(45deg,var(--aksen) 0 2px,transparent 2px 28px),repeating-linear-gradient(-45deg,var(--aksen) 0 2px,transparent 2px 28px)}',
    '.k-gradb{position:absolute;inset:0;background:linear-gradient(to top,rgba(var(--gelap),.88) 0%,rgba(var(--gelap),.25) 45%,rgba(var(--gelap),.1) 70%,rgba(var(--gelap),.45) 100%)}',
    /* tombol permen 3D — tinggi minimal 54 (≈36px di HP kecil) */
    '.k-btn{font-family:Fredoka,"Trebuchet MS",sans-serif;font-weight:600;font-size:23px;line-height:1.05;padding:12px 22px;min-height:56px;',
    '  border:3px solid var(--lip);border-radius:16px;color:var(--lip);cursor:pointer;',
    '  background:linear-gradient(180deg,var(--c1),var(--c2));box-shadow:inset 0 3px 0 rgba(255,255,255,.55),0 5px 0 var(--lip),0 10px 14px rgba(0,0,0,.28);',
    '  transition:transform .08s,box-shadow .08s,filter .15s;display:inline-flex;align-items:center;justify-content:center;gap:8px}',
    '.k-btn:hover{filter:brightness(1.06)}',
    '.k-btn:active{transform:translateY(4px);box-shadow:inset 0 3px 0 rgba(255,255,255,.55),0 1px 0 var(--lip),0 3px 6px rgba(0,0,0,.25)}',
    '.k-btn:focus-visible{outline:4px solid #fff;outline-offset:3px}',
    '.k-btn[disabled]{filter:grayscale(.85) brightness(.9);cursor:not-allowed;transform:none}',
    '.k-btn.besar{font-size:30px;padding:14px 36px;min-height:68px;border-radius:20px}',
    '.k-btn.sek{background:linear-gradient(180deg,#fff,var(--kertas))}',
    '.k-btn.kecil{font-size:19px;padding:8px 16px;min-height:48px;border-radius:13px}',
    '.k-ikon{width:50px;height:50px;min-height:50px;padding:0;border-radius:50%;font-size:23px}',
    '.k-denyut{animation:kDenyut 1.6s ease-in-out infinite}',
    '@keyframes kDenyut{0%,100%{box-shadow:inset 0 3px 0 rgba(255,255,255,.55),0 5px 0 var(--lip),0 0 0 0 rgba(255,214,80,.7)}50%{box-shadow:inset 0 3px 0 rgba(255,255,255,.55),0 5px 0 var(--lip),0 0 0 14px rgba(255,214,80,0)}}',
    /* panel */
    '.k-kertas{background:var(--kertas);border:3px solid var(--lip);border-radius:20px;color:var(--tinta);',
    '  box-shadow:inset 0 3px 0 rgba(255,255,255,.7),0 6px 0 rgba(0,0,0,.18),0 14px 26px rgba(0,0,0,.28)}',
    '.k-narasi{background:linear-gradient(180deg,rgba(var(--gelap),.93),rgba(var(--gelap),.98));border:3px solid var(--aksen);border-radius:18px;color:#fff;',
    '  box-shadow:0 0 24px rgba(255,214,80,.22),inset 0 0 34px rgba(0,0,0,.4)}',
    '.k-nama{position:absolute;top:-19px;left:22px;background:var(--aksen);color:var(--lip);border:3px solid var(--lip);border-radius:999px;padding:3px 16px;font-family:Fredoka,sans-serif;font-weight:600;font-size:20px}',
    '.k-judul{font-family:Fredoka,"Trebuchet MS",sans-serif;font-weight:700;color:var(--aksen);letter-spacing:.5px;',
    '  text-shadow:3px 3px 0 var(--lip),6px 7px 12px rgba(0,0,0,.45)}',
    /* bilah atas */
    '.k-atas{position:absolute;left:0;right:0;top:0;height:58px;display:flex;align-items:center;gap:12px;padding:0 14px;z-index:5;',
    '  background:rgba(var(--gelap),.82);border-bottom:3px solid var(--aksen);color:#fff;backdrop-filter:blur(6px)}',
    '.k-atas .k-ikon{width:44px;height:44px;min-height:44px;font-size:20px}',
    '.k-atas .t{font-family:Fredoka,sans-serif;font-weight:600;font-size:23px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.k-pil{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.14);border:2px solid rgba(255,255,255,.28);border-radius:999px;padding:4px 12px;font-weight:800;font-size:19px;white-space:nowrap;color:inherit;font-family:inherit}',
    '.k-titik{display:flex;gap:6px}.k-titik i{width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.3)}.k-titik i.on{background:var(--aksen)}',
    '.k-ruang{position:absolute;left:0;right:0;top:58px;bottom:92px}',
    '.k-ruang>.m-cer,.k-ruang>.m-bac,.k-ruang>.m-sor,.k-ruang>.m-coc,.k-ruang>.m-uru,.k-ruang>.m-run,.k-ruang>.m-jel,.k-ruang>.m-lab{position:absolute;inset:12px 18px 8px}',
    /* bilah bawah: maskot + balon */
    '.k-bawah{position:absolute;left:0;right:0;bottom:0;height:92px;display:flex;align-items:center;gap:12px;padding:0 14px 0 108px;z-index:4;',
    '  background:linear-gradient(180deg,rgba(var(--gelap),.0),rgba(var(--gelap),.75) 30%,rgba(var(--gelap),.92))}',
    '.k-mas{position:absolute;left:4px;bottom:2px;width:100px;height:140px;display:flex;align-items:flex-end;justify-content:center}',
    '.k-mas img,.k-mas .k-fb{max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 5px 7px rgba(0,0,0,.4))}',
    '.k-balon{flex:1;min-height:62px;max-height:80px;overflow:hidden;background:#fff;color:var(--tinta);border:3px solid var(--aksen);border-radius:18px;padding:6px 16px;',
    '  font-size:20px;font-weight:700;line-height:1.25;display:flex;align-items:center;position:relative}',
    '.k-balon:before{content:"";position:absolute;left:-14px;bottom:14px;border:9px solid transparent;border-right:12px solid var(--aksen)}',
    '.k-balon.ok{border-color:#2FB560}.k-balon.ok:before{border-right-color:#2FB560}',
    '.k-balon.no{border-color:#E5484D}.k-balon.no:before{border-right-color:#E5484D}',
    '.k-aksi{display:flex;gap:10px}',
    /* ── bingkai HUD (k.bingkai(judul, { gaya:'hud' })) ── */
    '.k-ruang.k-ruang-hud{top:0;bottom:0}',
    '.k-hud{--k-tap:56px}',
    '.k-hud .k-hud-tb{position:absolute;top:12px;width:var(--k-tap);height:var(--k-tap);min-height:var(--k-tap);padding:0;border-radius:50%;z-index:60}',
    '.k-hud .k-hud-tb.kiri{left:12px}.k-hud .k-hud-tb.kanan{right:12px}',
    '.k-hud .k-hud-tb .k-ik{width:60%;height:60%}',
    '.k-hud-judul{position:absolute;left:50%;top:18px;transform:translateX(-50%);max-width:calc(100% - 300px);z-index:50;pointer-events:none;text-align:center;',
    '  font-family:Fredoka,"Trebuchet MS",sans-serif;font-weight:700;font-size:46px;line-height:1.1;color:var(--aksen);text-shadow:3px 3px 0 var(--lip),6px 7px 12px rgba(0,0,0,.45);transition:opacity .5s}',
    '.k-hud-judul.pudar{opacity:0}',
    '.k-hud-aksi{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);display:flex;gap:12px;z-index:45;pointer-events:none;max-width:calc(100% - 140px);justify-content:center}',
    '.k-hud-aksi .k-btn{pointer-events:auto;min-height:var(--k-tap);min-width:var(--k-tap);font-size:24px;padding:8px 26px}',
    '.k-hud-bicara{position:absolute;left:12px;bottom:12px;display:flex;align-items:flex-end;gap:14px;z-index:44;opacity:0;pointer-events:none;transition:opacity .4s}',
    '.k-hud.ada-aksi .k-hud-bicara{bottom:calc(var(--k-tap) + 28px)}',
    '.k-hud-bicara.tampil{opacity:1;pointer-events:auto}',
    '.k-hud-mas{flex:none;width:64px;height:84px;display:flex;align-items:flex-end;justify-content:center}',
    '.k-hud-mas img,.k-hud-mas .k-fb{max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 4px 6px rgba(0,0,0,.4))}',
    '.k-hud-balon{flex:none;display:block;max-width:320px;min-height:48px;max-height:120px;font-size:17px;line-height:1.25;padding:8px 14px;overflow:hidden}',
    '.k-tirai.k-hud-tirai{z-index:80}',
    '.k-hud.ada-aksi .k-ov-hud{bottom:calc(var(--k-tap) + 28px)!important}',
    '.k-hud-menu{width:420px;padding:22px 26px 22px;overflow:auto}',
    '.k-hud-menu h2{font-size:34px;margin:0 0 14px;overflow:hidden;text-overflow:ellipsis}',
    '.k-hud-daftar{display:flex;flex-direction:column;gap:12px}',
    '.k-hud-daftar .k-btn{width:100%;min-height:var(--k-tap);justify-content:center}',
    '.k-hud.k-jeda .k-ruang *{animation-play-state:paused!important}',
    '.lompat{animation:kLompat .55s ease}@keyframes kLompat{30%{transform:translateY(-22px)}60%{transform:translateY(0)}75%{transform:translateY(-6px)}}',
    '.goyang{animation:kGoyang .45s}@keyframes kGoyang{20%{transform:translateX(-8px) rotate(-3deg)}40%{transform:translateX(8px) rotate(3deg)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}',
    '.melayang{animation:kMelayang 3.2s ease-in-out infinite}@keyframes kMelayang{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-10px) rotate(1.5deg)}}',
    /* kartu seret */
    '.k-kartu{background:#fff;border:3px solid var(--lip);border-radius:14px;padding:8px 14px;min-height:56px;font-weight:800;font-size:21px;line-height:1.15;',
    '  color:var(--tinta);display:flex;align-items:center;justify-content:center;text-align:center;gap:8px;cursor:grab;touch-action:none;',
    '  box-shadow:0 4px 0 var(--lip),0 7px 12px rgba(0,0,0,.18);transition:transform .18s,box-shadow .18s,background .2s;position:relative}',
    '.k-kartu img{max-height:64px;max-width:96px;object-fit:contain}',
    '.k-kartu.pilih{outline:4px solid var(--aksen);outline-offset:2px;transform:translateY(-4px)}',
    '.k-kartu.seret{z-index:50;transition:none;cursor:grabbing;box-shadow:0 12px 22px rgba(0,0,0,.35)}',
    '.k-kartu.betul{background:#DDF7E6;border-color:#1E8B4A;box-shadow:0 4px 0 #1E8B4A;cursor:default}',
    '.k-kartu.keliru{background:#FFE1E1;border-color:#C2333A;box-shadow:0 4px 0 #C2333A}',
    '.k-slot{border:3px dashed var(--lip);border-radius:16px;background:rgba(255,255,255,.78);transition:background .15s,transform .15s}',
    '.k-slot.siap{background:rgba(255,255,255,.95);transform:scale(1.03);border-style:solid;border-color:var(--c2)}',
    /* layar judul */
    '.k-tj{position:absolute;right:40px;bottom:96px;text-align:right;max-width:64%}',
    '.k-tj h1{font-size:60px;line-height:1.02;margin:0 0 10px}',
    '.k-tj p{margin:0;color:#fff;font-size:25px;font-weight:700;text-shadow:2px 2px 6px rgba(0,0,0,.8)}',
    '.k-sudut{position:absolute;top:12px;right:12px;display:flex;gap:10px;z-index:6}',
    '.k-guru{position:absolute;left:12px;bottom:12px;z-index:6;background:rgba(0,0,0,.5);color:#fff;border:2px solid rgba(255,255,255,.35);border-radius:999px;padding:8px 16px;font-weight:800;font-size:18px;cursor:pointer;font-family:inherit}',
    /* kredit */
    '.k-kr{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#fff;cursor:pointer;padding:0 40px;',
    '  background:radial-gradient(ellipse at center,rgba(var(--gelap),.75),rgba(0,0,0,.96))}',
    '.k-kr>*{opacity:0;animation:kNaik .7s ease-out forwards}',
    '@keyframes kNaik{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}',
    '.k-garis{width:150px;height:3px;margin:16px auto;background:linear-gradient(90deg,transparent,var(--aksen),transparent)}',
    /* narasi cerita */
    '.k-vn{position:absolute;left:36px;right:36px;bottom:20px;min-height:150px;padding:28px 26px 14px;font-size:24px;line-height:1.45}',
    '.k-vn-aksi{display:flex;justify-content:flex-end;gap:12px;margin-top:10px}',
    /* peta level */
    '.k-peta{position:absolute;left:24px;right:24px;top:84px;bottom:24px;display:flex;align-items:center;justify-content:center;gap:24px}',
    '.k-medal{flex:0 1 240px;min-width:0;padding:22px 12px 16px;text-align:center;position:relative;cursor:pointer;transition:transform .15s}',
    '.k-medal:hover{transform:translateY(-6px)}',
    '.k-medal .no{width:62px;height:62px;margin:-52px auto 8px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:Fredoka,sans-serif;font-weight:700;font-size:32px;',
    '  background:linear-gradient(180deg,var(--c1),var(--c2));border:3px solid var(--lip);color:var(--lip);box-shadow:0 4px 0 var(--lip)}',
    '.k-medal h3{font-family:Fredoka,sans-serif;font-weight:600;font-size:23px;margin:2px 0 4px;line-height:1.15}',
    '.k-medal .mn{font-size:17px;font-weight:700;opacity:.75}',
    '.k-medal .bt{font-size:28px;letter-spacing:3px;margin-top:6px}',
    '.k-medal.kunci{filter:grayscale(.9);opacity:.75;cursor:not-allowed}',
    '.k-medal.kunci:after{content:"";position:absolute;top:-14px;right:-10px;width:48px;height:48px;display:flex;align-items:center;justify-content:center;background:#fff ' + GEMBOK_URL + ' center/28px no-repeat;border:3px solid var(--lip);border-radius:50%;filter:none}',
    /* popup */
    '.k-tirai{position:absolute;inset:0;z-index:30;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;animation:kMasuk .25s}',
    '.k-pop{position:relative;width:580px;max-width:92%;max-height:94%;padding:30px 30px 24px;text-align:center}',
    '.k-pop h2{font-family:Fredoka,sans-serif;font-weight:700;font-size:40px;margin:0 0 4px;color:var(--aksen);text-shadow:3px 3px 0 var(--lip)}',
    '.k-bintang{font-size:64px;letter-spacing:8px;margin:4px 0 2px}',
    '.k-bintang span{display:inline-block;opacity:.22;filter:grayscale(1)}',
    '.k-bintang span.on{opacity:1;filter:none;animation:kPop .45s cubic-bezier(.3,1.7,.6,1) both}',
    '@keyframes kPop{from{transform:scale(0) rotate(-40deg)}to{transform:none}}',
    '.k-pop .aksi{display:flex;gap:14px;justify-content:center;margin-top:18px}',
    /* panel guru */
    '.k-gp{width:94%;height:92%;display:flex;flex-direction:column;padding:20px 24px 16px;text-align:left}',
    '.k-tab{display:flex;gap:8px;margin:8px 0 10px;flex-wrap:wrap}',
    '.k-tab button{font-family:Fredoka,sans-serif;font-weight:600;font-size:19px;padding:7px 16px;min-height:44px;border-radius:999px;border:3px solid var(--lip);background:#fff;color:var(--lip);cursor:pointer}',
    '.k-tab button.on{background:var(--c1)}',
    '.k-gisi{flex:1;overflow:auto;font-size:19px;line-height:1.5;padding-right:8px;user-select:text;-webkit-user-select:text}',
    '.k-gisi h4{font-family:Fredoka,sans-serif;font-weight:600;font-size:21px;margin:12px 0 4px;color:var(--lip)}',
    '.k-gisi ol,.k-gisi ul{margin:4px 0;padding-left:26px}',
    /* galat */
    '.k-galat{position:absolute;inset:20px;padding:24px 28px;overflow:auto;font-size:19px;user-select:text;-webkit-user-select:text}',
    /* putar HP */
    '#kit-putar{display:none;position:fixed;inset:0;z-index:99;background:#1b120a;color:#fff;flex-direction:column;align-items:center;justify-content:center;gap:22px;',
    '  font:700 22px/1.4 Nunito,system-ui,sans-serif;text-align:center;padding:24px}',
    '#kit-putar .hp{width:64px;height:106px;border:6px solid #fff;border-radius:14px;animation:kPutar 2.4s ease-in-out infinite}',
    '@keyframes kPutar{0%,25%{transform:rotate(0)}55%,100%{transform:rotate(-90deg)}}',
    '@media (orientation:portrait) and (max-width:1000px){#kit-putar{display:flex}}',
    /* gambar cadangan */
    '.k-fb{display:flex;align-items:center;justify-content:center;text-align:center;padding:8px;border-radius:14px;font-weight:800;font-size:18px;',
    '  color:var(--lip);background:repeating-linear-gradient(45deg,rgba(255,255,255,.5) 0 10px,rgba(255,255,255,.25) 10px 20px),var(--c1);border:3px dashed var(--lip)}',
    '#kit-konfeti{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:40}',
    '@media (prefers-reduced-motion:reduce){#kit *{animation-duration:.01ms!important;animation-iteration-count:1!important;transition:none!important}}',

    /* ── mesin: cerita ── */
    '.m-cer{display:flex;gap:18px;align-items:stretch}',
    '.m-cer .jendela{flex:0 0 44%;border-radius:20px;overflow:hidden;border:4px solid var(--lip);box-shadow:0 8px 0 rgba(0,0,0,.2);background:var(--kertas);position:relative}',
    '.m-cer .jendela img,.m-cer .jendela .k-fb{width:100%;height:100%;object-fit:cover;border-radius:0;border:0}',
    '.m-cer .teks{flex:1;padding:16px 20px;display:flex;flex-direction:column;min-width:0}',
    '.m-cer .teks .isi{font-size:22px;line-height:1.45;flex:1;overflow:auto}',
    '.m-cer .nm{font-family:Fredoka,sans-serif;font-weight:600;color:var(--lip);font-size:22px;margin-bottom:4px}',
    '.m-cer .pil{display:flex;flex-direction:column;gap:8px;margin-top:8px}',
    '.m-cer .pil .k-btn{justify-content:flex-start;text-align:left;font-family:Nunito,sans-serif;font-weight:800;font-size:20px;padding:8px 14px;min-height:52px}',
    /* ── mesin: bacaan ── */
    '.m-bac{display:flex;gap:16px}',
    '.m-bac .hal{flex:0 0 56%;padding:16px 22px;display:flex;flex-direction:column;overflow:hidden}',
    '.m-bac .hal h3{font-family:Fredoka,sans-serif;font-weight:600;font-size:25px;margin:0 0 6px;color:var(--lip)}',
    '.m-bac .hal .tx{font-size:22px;line-height:1.5;overflow:auto;flex:1}',
    '.m-bac .hal .tx p{margin:0 0 8px}',
    '.m-bac .kn{flex:1;display:flex;flex-direction:column;gap:12px;min-width:0}',
    '.m-bac .ilus{height:130px;flex:0 0 130px;border-radius:16px;overflow:hidden;border:3px solid var(--lip)}',
    '.m-bac .ilus img,.m-bac .ilus .k-fb{width:100%;height:100%;object-fit:cover;border:0;border-radius:0}',
    '.m-bac .ilus.ilus-adegan{height:190px;flex:0 0 190px;position:relative}',
    '.m-adegan{position:absolute;inset:0;overflow:hidden;border-radius:inherit;background:linear-gradient(var(--sudut,160deg),var(--bg1),var(--bg2));contain:layout paint}',
    '.m-adegan-pola{position:absolute;inset:0;opacity:.1;background-image:repeating-linear-gradient(45deg,var(--aksen) 0 2px,transparent 2px 24px)}',
    '.m-adegan-pola.p1{opacity:.16;background-image:radial-gradient(var(--aksen) 2.4px,transparent 3px);background-size:26px 26px}',
    '.m-adegan-pola.p2{opacity:.12;background-image:repeating-radial-gradient(circle at 0 100%,transparent 0 14px,var(--aksen) 14px 17px);background-size:54px 54px}',
    '.m-adegan-pola.p3{opacity:.1;background-image:radial-gradient(ellipse 10px 18px at 50% 0,var(--aksen) 96%,transparent),radial-gradient(ellipse 18px 10px at 0 50%,var(--aksen) 96%,transparent);background-size:44px 44px}',
    '.m-adegan .m-adegan-latar{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border:0;border-radius:0}',
    '.m-adegan-gradb{position:absolute;left:0;right:0;bottom:0;height:46%;background:linear-gradient(to top,rgba(var(--gelap),.82),rgba(var(--gelap),0));pointer-events:none}',
    '.m-adegan-obj{position:absolute;bottom:3%;margin:0;padding:0;border:0;background:none;transform:translateX(-50%);cursor:pointer;touch-action:manipulation;-webkit-appearance:none;appearance:none;',
    '  display:flex;flex-direction:column;align-items:center;justify-content:flex-end;font-family:inherit;color:inherit;animation:adeganMasuk .4s cubic-bezier(.3,1.5,.6,1) both}',
    '.m-adegan-obj:focus-visible{outline:3px solid var(--aksen);outline-offset:2px;border-radius:10px}',
    '.m-adegan-gb{position:relative;flex:1 1 0;min-height:0;width:100%;display:flex;align-items:flex-end;justify-content:center;transform-origin:50% 100%;transition:transform .15s}',
    '.m-adegan-obj.sentuh .m-adegan-gb{animation:adeganSentuh .35s ease-out}',
    '.m-adegan .m-adegan-gb img{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:contain!important;object-position:50% 100%!important;border:0;filter:drop-shadow(0 3px 3px rgba(0,0,0,.25))}',
    '.m-adegan .m-adegan-gb .k-fb{position:absolute;left:0;bottom:0;width:100%;height:80%;border:0;filter:drop-shadow(0 3px 3px rgba(0,0,0,.25))}',
    '.m-adegan .m-adegan-gb .k-fb{font-size:15px;line-height:1.1;border:2px dashed var(--lip);border-radius:12px}',
    '.m-adegan-bayang{position:absolute;left:12%;right:12%;bottom:15px;height:12px;border-radius:50%;background:rgba(0,0,0,.32);filter:blur(3px)}',
    '.m-adegan-nama{flex:0 0 auto;margin-top:3px;max-width:140%;padding:1px 8px;border-radius:999px;background:rgba(var(--gelap),.78);color:#fff;font-family:Fredoka,"Trebuchet MS",sans-serif;font-weight:600;font-size:13px;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.m-adegan-maskot{position:absolute;bottom:2%;height:45%;display:flex;align-items:flex-end;pointer-events:none;animation:adeganMasukM .4s ease-out both;animation-delay:.1s}',
    '.m-adegan-maskot.kiri{left:1%}.m-adegan-maskot.kanan{right:1%;justify-content:flex-end}',
    '.m-adegan-maskot img{height:100%;width:auto;max-width:none;object-fit:contain;filter:drop-shadow(0 3px 4px rgba(0,0,0,.35))}',
    '.m-adegan-maskot.kanan img{transform:scaleX(-1)}',
    '@keyframes adeganMasuk{from{opacity:0;transform:translateX(-50%) scale(.6)}to{opacity:1;transform:translateX(-50%) scale(1)}}',
    '@keyframes adeganMasukM{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}',
    '@keyframes adeganSentuh{0%{transform:scale(1)}40%{transform:scale(1.12)}100%{transform:scale(1)}}',
    '@media (prefers-reduced-motion:reduce){.m-adegan-obj,.m-adegan-maskot,.m-adegan-obj.sentuh .m-adegan-gb{animation:none!important}}',
    '.m-bac .akt{flex:1;padding:12px 14px;overflow:auto;font-size:20px}',
    '.m-bac .akt .tny{font-weight:800;margin-bottom:8px;line-height:1.25}',
    '.m-bac .glos{border-bottom:3px dotted var(--c2);color:var(--lip);font-weight:800;cursor:pointer}',
    '.m-bac .kal{border-radius:6px;padding:1px 2px;transition:background .15s}',
    '.m-bac .kal.bisa{cursor:pointer;background:rgba(255,214,80,.18)}',
    '.m-bac .kal.bisa:hover{background:rgba(255,214,80,.45)}',
    '.m-bac .kal.betul{background:#BFF0CF}.m-bac .kal.keliru{background:#FFC9C9}',
    '.m-bac .kunci{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;gap:6px;font-weight:800;opacity:.7;font-size:22px}',
    '.m-bac .kunci .gb{font-size:56px}',
    '.m-bac .rump{line-height:2.2}',
    '.m-bac .rump .k-slot{display:inline-flex;vertical-align:middle;min-width:120px;min-height:48px;margin:0 3px;align-items:center;justify-content:center}',
    '.m-bac .rump .k-slot .k-kartu{min-height:40px;padding:3px 10px;font-size:19px;box-shadow:0 3px 0 var(--lip)}',
    '.m-bac .baki{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}',
    '.m-bac .baki .k-kartu{min-height:48px;padding:5px 12px;font-size:20px}',
    '.m-bac .opsi{display:flex;flex-direction:column;gap:8px}',
    '.m-bac .opsi .k-btn{justify-content:flex-start;font-family:Nunito,sans-serif;font-weight:800;font-size:20px;padding:8px 14px;min-height:52px;text-align:left}',
    /* ── mesin: bacaan gaya buku (.m-buku) ── */
    '.m-buku{display:block}',
    '.k-ruang>.m-buku{inset:6px 14px 4px}',
    '.m-buku .bk-buku{position:absolute;inset:0;display:flex;padding:8px;box-sizing:border-box;border-radius:20px;background:var(--lip);box-shadow:0 6px 0 rgba(0,0,0,.22),0 14px 26px rgba(0,0,0,.3)}',
    '.m-buku .bk-hal{position:relative;flex:1 1 0;min-width:0;overflow:hidden;display:flex;flex-direction:column;box-sizing:border-box;color:var(--tinta);background-color:var(--kertas);background-image:linear-gradient(rgba(255,232,180,.38),rgba(255,232,180,.38))}',
    '.m-buku .bk-kiri{border-radius:14px 0 0 14px}',
    '.m-buku .bk-kiri::after,.m-buku .bk-kanan::before{content:"";position:absolute;top:0;bottom:0;width:36px;pointer-events:none;z-index:2}',
    '.m-buku .bk-kiri::after{right:0;background:linear-gradient(to right,rgba(0,0,0,0),rgba(0,0,0,.16))}',
    '.m-buku .bk-kanan::before{left:0;background:linear-gradient(to left,rgba(0,0,0,0),rgba(0,0,0,.16))}',
    '.m-buku .bk-kanan{border-radius:0 14px 14px 0;padding:8px 20px 22px 28px}',
    '.m-buku .bk-lipat{position:absolute;top:8px;bottom:8px;left:50%;width:2px;margin-left:-1px;background:rgba(0,0,0,.3);pointer-events:none;z-index:3}',
    '.m-buku .bk-pita{position:absolute;top:0;right:22px;width:22px;height:44px;background:var(--c2);clip-path:polygon(0 0,100% 0,100% 100%,50% 76%,0 100%);z-index:3}',
    '.m-buku .bk-no{position:absolute;right:18px;bottom:0;font-family:Fredoka,sans-serif;font-weight:500;font-size:22px;line-height:22px;color:var(--lip);opacity:.55}',
    /* halaman kiri: gambar */
    '.m-buku .bk-bingkai{position:absolute;inset:16px 18px 16px 20px;box-sizing:border-box;padding:6px;background:#fff;border:3px solid var(--lip);border-radius:12px;box-shadow:0 4px 0 rgba(0,0,0,.16)}',
    '.m-buku .bk-bingkai img,.m-buku .bk-bingkai .k-fb{display:block;width:100%;height:100%;object-fit:cover;border:0;border-radius:6px}',
    '.m-buku .bk-bingkai.bk-adegan{padding:0;overflow:hidden;background:none}',
    '.m-buku .bk-kosong{margin:auto;font-size:96px;color:var(--lip);opacity:.22}',
    '.m-buku .bk-grid{position:absolute;inset:14px 18px 14px 18px;display:grid;gap:8px}',
    '.m-buku .bk-grid.n2{grid-template-columns:1fr;grid-template-rows:1fr 1fr}',
    '.m-buku .bk-grid.n3{grid-template-columns:1fr 1fr;grid-template-rows:1.15fr 1fr}',
    '.m-buku .bk-grid.n3 .bk-fig:first-child{grid-column:1/3}',
    '.m-buku .bk-grid.n4{grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr}',
    '.m-buku .bk-fig{margin:0;min-width:0;min-height:0;display:flex;flex-direction:column;gap:2px}',
    '.m-buku .bk-fig .bk-bingkai{position:relative;inset:auto;flex:1 1 0;min-height:0;padding:4px;border-width:3px;border-radius:10px}',
    '.m-buku .bk-fig figcaption{flex:none;font-family:Fredoka,sans-serif;font-weight:500;font-size:22px;line-height:1.15;text-align:center;color:var(--lip);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    /* halaman kanan: judul + teks + kartu tempel */
    '.m-buku .bk-kanan>.hal{position:relative;flex:1 1 0;min-height:60px;padding:0;background:none;border:0;border-radius:0;box-shadow:none;overflow:hidden}',
    '.m-buku .bk-kanan>.hal h3{font-size:25px;line-height:1.15;margin:0 0 5px;padding:0 34px 3px 0;border-bottom:3px double rgba(0,0,0,.2)}',
    '.m-buku .bk-kanan>.hal .tx{font-size:22px;line-height:1.36;flex:1 1 auto;min-height:0;overflow:auto;padding-bottom:4px}',
    '.m-buku .bk-kanan>.hal .tx p{margin:0 0 6px}',
    '.m-buku .bk-kanan>.hal.gulir::after{content:"";position:absolute;right:2px;bottom:2px;width:28px;height:28px;border-radius:50%;opacity:.92;pointer-events:none;background:var(--c2) url(data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%23fff%22%20stroke-width=%223%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Cpath%20d=%22M6%209l6%206%206-6%22/%3E%3C/svg%3E) center/18px no-repeat}',
    '.m-buku .kunci{flex-direction:row;gap:12px;height:auto;padding:6px 0;text-align:left;font-size:22px}',
    '.m-buku .kunci .gb{flex:none;font-size:44px}',
    '.m-buku .tx p:first-child::first-letter{font-family:Fredoka,sans-serif;font-weight:600;font-size:1.75em;line-height:.9;color:var(--lip)}',
    '.m-buku .kn{position:relative;flex:0 0 auto;max-height:68%;margin-top:9px;display:flex;flex-direction:column;gap:0}',
    '.m-buku .kn.tanpa{display:none}',
    '.m-buku .kn::before{content:"";position:absolute;top:-8px;left:50%;width:76px;height:15px;margin-left:-38px;background:rgba(255,255,255,.7);border:1px solid rgba(0,0,0,.12);transform:rotate(-2deg);z-index:2;pointer-events:none}',
    '.m-buku .akt{flex:0 1 auto;min-height:0;padding:10px 12px 6px;border-radius:14px;background-color:var(--aksen);background-image:linear-gradient(rgba(255,255,255,.62),rgba(255,255,255,.62))}',
    '.m-buku .opsi{flex-direction:row;flex-wrap:wrap;gap:6px}',
    '.m-buku .opsi .k-btn{flex:1 1 auto;min-height:48px;padding:6px 12px}',
    '.m-buku .akt .tny{margin-bottom:5px;line-height:1.2}',
    '.m-buku .rump{line-height:1.5}',
    '.m-buku .rump .k-slot{min-width:96px}',
    '.m-buku .baki{gap:6px;margin-top:6px}',
    /* animasi balik halaman / fade / sampul */
    '.m-buku .bk-tirai{position:absolute;inset:0;z-index:6;perspective:1800px}',
    '.m-buku .bk-tirai.fade{pointer-events:none}',
    '.m-buku .bk-lama{position:absolute;left:8px;top:8px;bottom:8px;width:calc(50% - 8px)}',
    '.m-buku .bk-lama>.bk-hal,.m-buku .bk-muka>.bk-hal,.m-buku .bk-balik>.bk-hal{position:absolute;inset:0;flex:none}',
    '.m-buku .bk-daun{position:absolute;left:50%;top:8px;bottom:8px;width:calc(50% - 8px);transform-origin:0 50%;transform-style:preserve-3d;will-change:transform}',
    '.m-buku .bk-muka,.m-buku .bk-balik{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden}',
    '.m-buku .bk-balik{transform:rotateY(180deg)}',
    '.m-buku .bk-bayang{position:absolute;left:50%;top:8px;bottom:8px;width:calc(50% - 8px);border-radius:0 14px 14px 0;background:linear-gradient(to right,rgba(0,0,0,.3),rgba(0,0,0,0) 65%);pointer-events:none}',
    '.m-buku .bk-sampul{position:absolute;inset:0;box-sizing:border-box;display:flex;align-items:center;gap:22px;padding:24px 34px 24px 46px;border-radius:20px;color:#fff;background:linear-gradient(135deg,var(--c2),var(--lip));border:5px solid var(--aksen);box-shadow:inset 0 0 0 4px var(--lip),0 6px 0 rgba(0,0,0,.22),0 14px 26px rgba(0,0,0,.3);transform-origin:0 50%;backface-visibility:hidden;-webkit-backface-visibility:hidden;cursor:pointer}',
    '.m-buku .bk-sampul::before{content:"";position:absolute;left:0;top:0;bottom:0;width:26px;background:linear-gradient(to right,rgba(0,0,0,.35),rgba(0,0,0,0));border-radius:16px 0 0 16px}',
    '.m-buku .bk-sgb{flex:0 0 42%;height:100%;box-sizing:border-box;padding:7px;background:#fff;border:4px solid var(--aksen);border-radius:14px;box-shadow:0 5px 0 rgba(0,0,0,.25)}',
    '.m-buku .bk-sgb img,.m-buku .bk-sgb .k-fb{display:block;width:100%;height:100%;object-fit:cover;border:0;border-radius:8px}',
    '.m-buku .bk-sjd{flex:1;min-width:0;text-align:center}',
    '.m-buku .bk-sjd .k-judul{margin:0;font-size:44px;line-height:1.1}',
    '.m-buku .bk-smas{position:absolute;right:24px;bottom:10px;width:130px;height:130px;display:flex;align-items:flex-end;justify-content:center;pointer-events:none}',
    '.m-buku .bk-smas img,.m-buku .bk-smas .k-fb{max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 6px 8px rgba(0,0,0,.4))}',
    '.k-glpop{position:absolute;z-index:20;width:340px;padding:12px 16px;font-size:19px;line-height:1.35}',
    /* ── mesin: sortir ── */
    '.m-sor{display:flex;flex-direction:column;gap:12px}',
    '.m-sor .baki{flex:1;display:flex;flex-wrap:wrap;align-content:center;justify-content:center;gap:10px;padding:4px}',
    '.m-sor .baki .k-kartu{min-width:140px;max-width:250px}',
    '.m-sor .kotak{display:flex;gap:14px;flex:0 0 170px}',
    '.m-sor .kat{flex:1;display:flex;flex-direction:column;align-items:center;padding:8px 10px 10px;position:relative;overflow:hidden;background:var(--kertas);border-style:solid}',
    '.m-sor .kat.siap{background:#fff}',
    '.m-sor .kat h4{font-family:Fredoka,sans-serif;font-weight:600;font-size:23px;margin:0 0 4px;display:flex;align-items:center;gap:8px}',
    '.m-sor .kat h4 img{height:36px}',
    '.m-sor .kat .isi{flex:1;width:100%;display:flex;flex-wrap:wrap;align-content:flex-start;justify-content:center;gap:5px;overflow:hidden}',
    '.m-sor .kat .isi .k-kartu{min-height:32px;padding:2px 8px;font-size:16px;border-width:2px;box-shadow:0 2px 0 #1E8B4A}',
    '.m-sor .kat .isi .k-kartu img{max-height:28px}',
    '.m-sor .waktu{height:12px;flex:0 0 12px;border-radius:99px;background:rgba(255,255,255,.35);overflow:hidden;border:2px solid var(--lip)}',
    '.m-sor .waktu i{display:block;height:100%;background:linear-gradient(90deg,var(--c1),var(--c2));transform-origin:left}',
    /* ── mesin: cocokkan ── */
    '.m-coc{display:flex;justify-content:space-between;align-items:stretch}',
    '.m-coc .kol{width:40%;display:flex;flex-direction:column;justify-content:center;gap:10px;z-index:2}',
    '.m-coc .k-kartu{cursor:pointer;min-height:56px}',
    '.m-coc svg{position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none}',
    '.m-coc .tanda{position:absolute;top:-10px;right:-10px;width:28px;height:28px;border-radius:50%;background:#1E8B4A;color:#fff;font-size:15px;display:flex;align-items:center;justify-content:center;border:2px solid #fff}',
    /* ── mesin: urutkan ── */
    '.m-uru{display:flex;flex-direction:column;justify-content:center;gap:26px}',
    '.m-uru .slot-baris{display:flex;justify-content:center;align-items:center;gap:6px}',
    '.m-uru .k-slot{height:98px;display:flex;align-items:center;justify-content:center;position:relative;flex:0 0 auto}',
    '.m-uru .k-slot .nom{position:absolute;top:-15px;left:-10px;width:34px;height:34px;border-radius:50%;background:var(--c1);border:3px solid var(--lip);color:var(--lip);',
    '  font-family:Fredoka,sans-serif;font-weight:700;font-size:19px;display:flex;align-items:center;justify-content:center;z-index:3}',
    '.m-uru .k-kartu{min-height:86px;font-size:20px;padding:5px 8px}',
    '.m-uru .panah{font-size:24px;color:#fff;text-shadow:0 2px 4px rgba(0,0,0,.4);flex:0 0 24px;text-align:center}',
    '.m-uru .panah.nyala{color:var(--aksen);animation:kPop .4s both}',
    '.m-uru .baki{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;min-height:92px}',
    /* ── mesin: runner ── */
    '.m-run{display:flex;gap:16px}',
    '.m-run .jalan{position:relative;flex:0 0 56%;height:100%;border-radius:20px;overflow:hidden;border:4px solid var(--lip);',
    '  background:linear-gradient(90deg,#6b6b6b,#7d7d7d 50%,#6b6b6b)}',
    '.m-run .lajur{position:absolute;top:0;bottom:0;width:33.333%;cursor:pointer}',
    '.m-run .marka{position:absolute;top:0;bottom:0;width:7px;margin-left:-3px;background:repeating-linear-gradient(180deg,#fff 0 34px,transparent 34px 68px);opacity:.8;animation:kMarka .8s linear infinite}',
    '@keyframes kMarka{from{background-position:0 0}to{background-position:0 68px}}',
    '.m-run .gerbang{position:absolute;left:0;right:0;height:76px;display:flex}',
    '.m-run .gerbang div{flex:1;margin:0 8px;border-radius:14px;background:#fff;border:3px solid var(--lip);display:flex;align-items:center;justify-content:center;text-align:center;line-height:1.05;padding:0 4px;',
    '  font-family:Fredoka,sans-serif;font-weight:600;font-size:25px;color:var(--tinta);box-shadow:0 5px 0 var(--lip)}',
    '.m-run .gerbang div.betul{background:#BFF0CF;border-color:#1E8B4A}.m-run .gerbang div.keliru{background:#FFC9C9;border-color:#C2333A}',
    '.m-run .pelari{position:absolute;bottom:12px;width:110px;height:110px;margin-left:-55px;transition:left .18s ease-out;display:flex;align-items:flex-end;justify-content:center}',
    '.m-run .pelari img,.m-run .pelari .k-fb{max-width:100px;max-height:106px;object-fit:contain}',
    '.m-run .pelari .k-fb{width:84px;height:84px;border-radius:50%;font-size:40px}',
    '.m-run .samping{flex:1;display:flex;flex-direction:column;gap:10px;min-width:0}',
    '.m-run .soal{padding:14px 16px;font-family:Fredoka,sans-serif;font-weight:600;font-size:27px;line-height:1.2;text-align:center;flex:1;display:flex;align-items:center;justify-content:center}',
    '.m-run .soal small{display:block;font-size:20px;font-family:Nunito,sans-serif;margin-top:6px}',
    '.m-run .stat{display:flex;justify-content:space-around;font-size:23px;font-weight:800;padding:6px}',
    '.m-run .kendali{display:flex;gap:14px;justify-content:center}',
    '.m-run .kendali .k-btn{flex:1;min-height:72px;font-size:32px}',
    /* ── mesin: jelajah ── */
    '.m-jel{display:flex;gap:16px}',
    '.m-jel .bingkai{flex:0 0 58%;position:relative;display:flex;align-items:center;justify-content:center;min-height:0}',
    '.m-jel .gbr{position:relative;border-radius:18px;overflow:visible}',
    '.m-jel .gbr>img,.m-jel .gbr>.k-fb{width:100%;height:100%;object-fit:contain;display:block;border-radius:18px;background:#fff;border:4px solid var(--lip)}',
    '.m-jel .tt{position:absolute;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;background:var(--c1);border:3px solid var(--lip);color:var(--lip);',
    '  font-family:Fredoka,sans-serif;font-weight:700;font-size:21px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:3;',
    '  box-shadow:0 0 0 0 rgba(255,214,80,.9);animation:kTitik 1.6s infinite}',
    '.m-jel .tt:after{content:"";position:absolute;inset:-10px}',
    '@keyframes kTitik{0%{box-shadow:0 0 0 0 rgba(255,214,80,.9)}70%{box-shadow:0 0 0 18px rgba(255,214,80,0)}100%{box-shadow:0 0 0 0 rgba(255,214,80,0)}}',
    '.m-jel .tt.lihat{background:#BFF0CF;border-color:#1E8B4A;color:#1E8B4A;animation:none}',
    '.m-jel .tt.aktif{transform:scale(1.2)}',
    '.m-jel .lbl{position:absolute;transform:translate(-50%,-50%);z-index:2;pointer-events:none;display:flex;align-items:center;justify-content:center;white-space:nowrap}',
    '.m-jel .lbl .k-kartu{min-height:32px;padding:2px 10px;font-size:17px;border-width:2px;box-shadow:0 2px 0 #1E8B4A}',
    '.m-jel .kn{flex:1;display:flex;flex-direction:column;gap:12px;min-width:0}',
    '.m-jel .info{flex:1;padding:16px 18px;overflow:auto}',
    '.m-jel .info h3{font-family:Fredoka,sans-serif;font-weight:600;font-size:27px;margin:0 0 6px;color:var(--lip)}',
    '.m-jel .info p{margin:0;font-size:21px;line-height:1.45}',
    '.m-jel .baki{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}',
    '.m-jel .baki .k-kartu{min-height:48px;padding:5px 12px;font-size:20px}',
    /* ── mesin: labeli ── */
    '.m-lab{display:flex;flex-direction:column;justify-content:center;gap:16px}',
    '.m-lab .baris{display:flex;justify-content:center;gap:12px}',
    '.m-lab .tl{flex:0 1 176px;min-width:0;display:flex;flex-direction:column;gap:8px;padding:8px;background:rgba(255,255,255,.88);border:3px solid var(--lip);border-radius:18px;transition:transform .15s,background .15s}',
    '.m-lab .tl.siap{transform:scale(1.05);background:#fff;border-color:var(--c2)}',
    '.m-lab .tl.salah{animation:kGoyang .45s;background:#FFE1E1;border-color:#C2333A}',
    '.m-lab .tl.ok{background:#DDF7E6;border-color:#1E8B4A}',
    '.m-lab .tetap{display:flex;align-items:center;justify-content:center;border-radius:12px;overflow:hidden;background:#fff;font-weight:800;font-size:22px;line-height:1.1;text-align:center;color:var(--tinta);padding:2px}',
    '.m-lab .tetap>img,.m-lab .tetap>.k-fb{width:100%;height:100%;object-fit:contain;display:block;border-radius:10px}',
    '.m-lab .slot{display:flex;align-items:center;justify-content:center;border:3px dashed var(--lip);border-radius:12px;background:rgba(255,255,255,.7);color:var(--lip);font-family:Fredoka,sans-serif;font-weight:700;font-size:24px;overflow:hidden}',
    '.m-lab .slot.terisi{border:0;background:none}',
    '.m-lab.nm2gb .tetap{height:104px}.m-lab.nm2gb .slot{height:50px}',
    '.m-lab.gb2nm .tetap{height:50px}.m-lab.gb2nm .slot{height:104px}',
    '.m-lab .slot .k-kartu{width:100%;height:100%;min-height:0;box-sizing:border-box;margin:0;padding:3px 6px;font-size:19px;border-width:2px;box-shadow:0 2px 0 #1E8B4A;animation:kPop .4s both;cursor:default}',
    '.m-lab .baki{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;align-items:center;min-height:92px;padding:10px 14px}',
    '.m-lab .baki .k-kartu{min-height:52px;padding:6px 16px;font-size:22px}',
    '.m-lab .baki .k-kartu.gb{padding:4px;width:116px;height:84px;min-height:0}',
    '.m-lab .k-kartu.gb img,.m-lab .k-kartu.gb .k-fb{width:100%;height:100%;max-width:100%;max-height:100%;object-fit:contain;display:block}',
    /* ── mesin: memori ── */
    '.k-ruang>.m-mem,.k-ruang>.m-isi{position:absolute;inset:12px 18px 8px}',
    '.m-mem{display:flex;align-items:center;justify-content:center}',
    '.m-mem .grid{display:grid;gap:12px;justify-content:center;align-content:center}',
    '.m-mem .kt{perspective:900px;cursor:pointer}',
    '.m-mem .dlm{position:relative;width:100%;height:100%;transition:transform .45s;transform-style:preserve-3d}',
    '.m-mem .kt.buka .dlm{transform:rotateY(180deg)}',
    '.m-mem .blk,.m-mem .muka{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:16px}',
    '.m-mem .blk{background:linear-gradient(160deg,var(--c1),var(--c2));border:3px solid var(--lip);box-shadow:0 5px 0 var(--lip);display:flex;align-items:center;justify-content:center;color:var(--lip)}',
    '.m-mem .blk:before{content:"";position:absolute;inset:8px;border:2px dashed rgba(255,255,255,.65);border-radius:10px}',
    '.m-mem .blk .k-ik{width:48px;height:48px;opacity:.6}',
    '.m-mem .kt:hover .blk{filter:brightness(1.06)}',
    '.m-mem .muka{transform:rotateY(180deg);min-height:0;cursor:pointer;touch-action:manipulation;font-size:19px;padding:6px 10px;overflow:hidden}',
    /* ── mesin: isian ── */
    '.m-isi{display:flex;gap:18px}',
    '.m-isi .kiri{flex:1;padding:18px 22px;display:flex;flex-direction:column;justify-content:center;gap:18px;min-width:0}',
    '.m-isi .tny{font-family:Fredoka,sans-serif;font-weight:600;font-size:27px;line-height:1.28;text-align:center;overflow:auto}',
    '.m-isi .jwb{display:flex;align-items:center;justify-content:center;gap:10px;font-family:Fredoka,sans-serif;font-weight:700;font-size:38px;color:var(--lip)}',
    '.m-isi .layar{min-width:230px;max-width:100%;height:74px;padding:0 18px;border:3px solid var(--lip);border-radius:16px;background:#fff;display:flex;align-items:center;justify-content:center;color:var(--tinta);overflow:hidden;white-space:nowrap;transition:background .2s}',
    '.m-isi .layar .kursor{display:inline-block;width:3px;height:42px;margin-left:3px;background:var(--lip);animation:kKedip 1s steps(1) infinite}',
    '@keyframes kKedip{50%{opacity:0}}',
    '.m-isi .layar.betul{background:#DDF7E6;border-color:#1E8B4A;color:#1E6B3A}',
    '.m-isi .layar.keliru{background:#FFE1E1;border-color:#C2333A}',
    '.m-isi .papan{flex:0 0 320px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;align-content:center}',
    '.m-isi .papan .k-btn{min-height:60px;font-size:30px;padding:0}',
    '.m-isi .papan .k-btn.kecil-tx{font-size:24px}',
    '.m-isi .papan .k-btn .k-ik{width:30px;height:30px}',
    /* ── mesin: garis bilangan dan pecahan ── */
    '.k-ruang>.m-gar,.k-ruang>.m-pec,.k-ruang>.m-jam{position:absolute;inset:12px 18px 8px}',
    '.m-gar{display:flex;flex-direction:column;gap:10px}',
    '.m-gar .tny{padding:14px 22px;font-family:Fredoka,sans-serif;font-weight:600;font-size:26px;line-height:1.28;text-align:center}',
    '.m-gar svg{flex:1;min-height:0;width:100%;touch-action:none;cursor:pointer;user-select:none;-webkit-user-select:none;background:var(--kertas);border:3px solid var(--lip);border-radius:20px;box-sizing:border-box}',
    '.m-gar .gl{stroke:var(--lip);stroke-width:6;stroke-linecap:round}',
    '.m-gar .tk{stroke:var(--lip);stroke-width:3.5;stroke-linecap:round}',
    '.m-gar .lb{font-family:Fredoka,sans-serif;font-weight:600;font-size:26px;fill:var(--tinta);text-anchor:middle}',
    '.m-gar .nil{font-family:Fredoka,sans-serif;font-weight:700;font-size:30px;fill:var(--lip);text-anchor:middle}',
    '.m-gar .pin circle,.m-gar .pin polygon{fill:var(--aksen);stroke:var(--lip);stroke-width:3.5;stroke-linejoin:round}',
    '.m-gar .pin.betul circle,.m-gar .pin.betul polygon{fill:#5DBB2F}',
    '.m-gar .pin.keliru circle,.m-gar .pin.keliru polygon{fill:#E5484D}',
    '.m-pec{display:flex;gap:18px}',
    '.m-pec .kiri{flex:1;padding:18px 22px;display:flex;flex-direction:column;justify-content:center;gap:18px;min-width:0}',
    '.m-pec .tny{font-family:Fredoka,sans-serif;font-weight:600;font-size:27px;line-height:1.28;text-align:center;overflow:auto}',
    '.m-pec .pil{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}',
    '.m-pec .pil .k-btn{min-width:96px;font-size:30px;padding:8px 18px}',
    '.m-pec .pil .k-btn.betul{background:#5DBB2F;color:#fff;border-color:#1E6B3A}',
    '.m-pec .pil .k-btn.keliru{background:#FFD1D1;border-color:#C2333A}',
    '.m-pec .kn{flex:0 0 470px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;min-width:0}',
    '.m-pec .kn svg{width:100%;flex:1;min-height:0}',
    '.m-pec .bg{fill:#fff;stroke:var(--lip);stroke-width:4;stroke-linejoin:round;transition:fill .15s}',
    '.m-pec .bg.on{fill:var(--c2)}',
    '.m-pec .bg.ok{fill:#5DBB2F}',
    '.m-pec .bg.no{fill:#E5484D}',
    '.m-pec .kn.main .bg{cursor:pointer}',
    '.m-pec .info{font-family:Fredoka,sans-serif;font-weight:600;font-size:23px;color:#fff;min-height:30px;text-shadow:0 2px 0 var(--lip),0 0 8px var(--lip)}',
    '.m-jam{display:flex;gap:18px}',
    '.m-jam .kiri{flex:1;padding:18px 22px;display:flex;flex-direction:column;justify-content:center;gap:18px;min-width:0}',
    '.m-jam .tny{font-family:Fredoka,sans-serif;font-weight:600;font-size:27px;line-height:1.28;text-align:center;overflow:auto}',
    '.m-jam .pil{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}',
    '.m-jam .pil .k-btn{min-width:96px;font-size:30px;padding:8px 18px}',
    '.m-jam .pil .k-btn.kecil{min-width:0;font-size:21px;padding:8px 16px}',
    '.m-jam .pil .k-btn.betul{background:#5DBB2F;color:#0B3318;border-color:#1E6B3A}',
    '.m-jam .pil .k-btn.keliru{background:#FFD1D1;border-color:#C2333A}',
    '.m-jam .kn{flex:0 0 400px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;min-width:0}',
    '.m-jam .kn svg{width:100%;flex:1;min-height:0;touch-action:none;user-select:none;-webkit-user-select:none}',
    '.m-jam .kn.main svg{cursor:pointer}',
    '.m-jam .fc{fill:#fff;stroke:var(--lip);stroke-width:7}',
    '.m-jam .kn.ok .fc{fill:#E4F6DA;stroke:#1E6B3A}',
    '.m-jam .kn.no .fc{fill:#FFE3E3;stroke:#C2333A}',
    '.m-jam .tk{stroke:var(--tinta);stroke-width:2.5;stroke-linecap:round}',
    '.m-jam .tk.bs{stroke:var(--lip);stroke-width:5}',
    '.m-jam .nm{font-family:Fredoka,sans-serif;font-weight:600;font-size:28px;fill:var(--tinta);text-anchor:middle;paint-order:stroke;stroke:#fff;stroke-width:6;stroke-linejoin:round}',
    '.m-jam .kn.ok .nm{stroke:#E4F6DA}',
    '.m-jam .kn.no .nm{stroke:#FFE3E3}',
    '.m-jam .hj line{stroke:var(--lip);stroke-width:12;stroke-linecap:round}',
    '.m-jam .mn .ol{stroke:var(--lip);stroke-width:12;stroke-linecap:round}',
    '.m-jam .mn .is{stroke:var(--c2);stroke-width:5;stroke-linecap:round}',
    '.m-jam .kp{display:none;fill:var(--aksen);stroke:var(--lip);stroke-width:4}',
    '.m-jam .kn.main .kp{display:block}',
    '.m-jam .cap{fill:var(--lip)}',
    '.m-jam .dig{font-family:Fredoka,sans-serif;font-weight:700;font-size:38px;line-height:1;color:var(--lip);background:#fff;border:3px solid var(--lip);border-radius:14px;padding:5px 22px;letter-spacing:2px}',
    /* ── mesin uang ── */
    '.k-ruang>.m-uang{position:absolute;inset:12px 18px 8px}',
    '.m-uang{display:flex;gap:16px}',
    '.m-uang .kiri{flex:0 0 316px;padding:14px 18px;display:flex;flex-direction:column;justify-content:center;gap:12px;min-width:0}',
    '.m-uang .tny{font-family:Fredoka,sans-serif;font-weight:600;font-size:22px;line-height:1.28;text-align:center}',
    '.m-uang .tgt{display:flex;flex-direction:column;gap:6px}',
    '.m-uang .bar{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:40px;padding:3px 14px;background:#fff;border:3px solid var(--lip);border-radius:14px;font-family:Fredoka,sans-serif;font-weight:600;font-size:19px;color:var(--tinta)}',
    '.m-uang .bar b{font-weight:700;font-size:25px;line-height:1.1;color:var(--lip)}',
    '.m-uang .bar.tanya b{color:#C2333A}',
    '.m-uang .kn{flex:1;display:flex;flex-direction:column;gap:10px;min-width:0}',
    '.m-uang .dmp{flex:1;min-height:0;display:flex;flex-direction:column;gap:6px;padding:8px 14px 10px;background:var(--kertas);border:3px solid var(--lip);border-radius:20px;transition:background .15s,border-color .15s}',
    '.m-uang .dmp.ok{background:#E4F6DA;border-color:#1E6B3A}',
    '.m-uang .dmp.no{background:#FFE3E3;border-color:#C2333A}',
    '.m-uang .dh{display:flex;align-items:center;justify-content:space-between;gap:10px;font-family:Fredoka,sans-serif;font-weight:600;font-size:22px;color:var(--lip)}',
    '.m-uang .dh .jml{font-weight:700;font-size:32px;line-height:1.1;color:var(--tinta)}',
    '.m-uang .isi{flex:1;min-height:0;display:flex;flex-wrap:wrap;align-content:flex-start;gap:6px;padding-top:6px}',
    '.m-uang .isi .kosong{margin:auto;font-family:Fredoka,sans-serif;font-weight:500;font-size:20px;color:var(--tinta);opacity:.7}',
    '.m-uang .lb{position:relative;flex:0 0 auto;width:84px;height:50px;padding:0;border:0;background:none;cursor:pointer;touch-action:manipulation;-webkit-appearance:none;appearance:none;border-radius:10px}',
    '.m-uang .lb.baru{animation:kUangMasuk .22s ease-out}',
    '.m-uang .lb svg{display:block;width:100%;height:100%}',
    '.m-uang .lb .x{position:absolute;right:-6px;top:-8px;width:24px;height:24px;border-radius:50%;background:#E5484D;border:2px solid #fff;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,.35);pointer-events:none}',
    '.m-uang .lb .x .k-ik{width:13px;height:13px;stroke-width:3.6}',
    '.m-uang .lb:focus-visible,.m-uang .uc:focus-visible{outline:4px solid var(--lip);outline-offset:2px}',
    '.m-uang .dmp.kunci .lb{cursor:default}',
    '.m-uang .dmp.kunci .lb .x{display:none}',
    '.m-uang .nmp{flex:0 0 auto;display:flex;flex-direction:column;gap:4px;padding:8px 12px 10px;background:var(--kertas);border:3px solid var(--lip);border-radius:20px}',
    '.m-uang .cap{font-family:Fredoka,sans-serif;font-weight:500;font-size:18px;line-height:1.2;text-align:center;color:var(--tinta)}',
    '.m-uang .baris{display:flex;gap:8px;justify-content:center}',
    '.m-uang .uc{flex:1 1 0;min-width:0;max-width:150px;padding:0;border:0;background:none;cursor:pointer;touch-action:manipulation;border-radius:12px;transition:transform .08s;-webkit-appearance:none;appearance:none}',
    '.m-uang .uc svg{display:block;width:100%;height:auto;filter:drop-shadow(0 3px 0 rgba(0,0,0,.2))}',
    '.m-uang .uc:active{transform:translateY(3px) scale(.97)}',
    '.m-uang .uc[disabled]{opacity:.45;cursor:not-allowed}',
    '.m-uang .nom{font-family:Fredoka,"Trebuchet MS",sans-serif;font-weight:700;fill:var(--tinta);text-anchor:middle;paint-order:stroke;stroke:rgba(255,255,255,.85);stroke-width:4;stroke-linejoin:round}',
    '.m-uang .rp{font-family:Fredoka,"Trebuchet MS",sans-serif;font-weight:600;fill:var(--tinta);text-anchor:middle;opacity:.85}',
    '@keyframes kUangMasuk{from{opacity:0;transform:translateY(-14px) scale(.85)}to{opacity:1;transform:none}}',
    '.k-ruang>.m-tim{position:absolute;inset:12px 18px 8px}',
    '.m-tim{display:flex;gap:14px}',
    '.m-tim .kiri{flex:0 0 272px;padding:14px 16px;display:flex;flex-direction:column;justify-content:center;gap:12px;min-width:0}',
    '.m-tim .tny{font-family:Fredoka,sans-serif;font-weight:600;font-size:22px;line-height:1.28;text-align:center}',
    '.m-tim .tgt{display:flex;flex-direction:column;gap:6px}',
    '.m-tim .bar{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:40px;padding:3px 14px;background:#fff;border:3px solid var(--lip);border-radius:14px;font-family:Fredoka,sans-serif;font-weight:600;font-size:19px;color:var(--tinta)}',
    '.m-tim .bar b{font-weight:700;font-size:25px;line-height:1.1;color:var(--lip)}',
    '.m-tim .pers{display:flex;align-items:baseline;justify-content:center;gap:10px;padding:6px 10px;background:#fff;border:3px solid var(--lip);border-radius:14px;font-family:Fredoka,sans-serif;font-weight:700;font-size:38px;line-height:1.15;color:var(--lip);white-space:nowrap}',
    '.m-tim .pers .pq{color:#C2333A}',
    '.m-tim .pers .pq.isi{color:var(--tinta)}',
    '.m-tim .pers small{font-weight:600;font-size:.58em;color:var(--tinta)}',
    '.m-tim .cap{font-family:Fredoka,sans-serif;font-weight:500;font-size:17px;line-height:1.25;text-align:center;color:var(--tinta)}',
    '.m-tim .kn{flex:1;display:flex;flex-direction:column;gap:10px;min-width:0}',
    '.m-tim .neraca{flex:1;min-height:0;width:100%;touch-action:manipulation;user-select:none;-webkit-user-select:none;background:var(--kertas);border:3px solid var(--lip);border-radius:20px;box-sizing:border-box}',
    '.m-tim .tg{fill:var(--c2);stroke:var(--lip);stroke-width:4;stroke-linejoin:round}',
    '.m-tim .tl{stroke:var(--lip);stroke-width:3;stroke-linecap:round}',
    '.m-tim .bm rect,.m-tim .bm circle{fill:var(--lip)}',
    '.m-tim .pv{fill:var(--aksen);stroke:var(--lip);stroke-width:4}',
    '.m-tim .dish{fill:var(--c2);stroke:var(--lip);stroke-width:4;stroke-linejoin:round;transition:fill .2s}',
    '.m-tim .neraca.betul .dish{fill:#5DBB2F}',
    '.m-tim .neraca.keliru .dish{fill:#F4A0A3}',
    '.m-tim .bd{fill:#fff;stroke:var(--lip);stroke-width:3.5}',
    '.m-tim .bt{fill:var(--c1);stroke:var(--lip);stroke-width:3;stroke-linejoin:round}',
    '.m-tim .sl{fill:#fff;stroke:#C2333A;stroke-width:3.5;stroke-dasharray:7 5}',
    '.m-tim .nb,.m-tim .sq{font-family:Fredoka,sans-serif;font-weight:700;font-size:24px;text-anchor:middle;fill:var(--tinta)}',
    '.m-tim .nb.k3{font-size:19px}',
    '.m-tim .sq{fill:#C2333A;font-size:30px}',
    '.m-tim .pc,.m-tim .sl0{cursor:pointer}',
    '.m-tim .hit{fill:transparent}',
    '.m-tim .nmp{flex:0 0 auto;display:flex;align-items:center;justify-content:center;gap:10px;padding:6px 12px 10px;background:var(--kertas);border:3px solid var(--lip);border-radius:20px}',
    '.m-tim .nmp .lab{font-family:Fredoka,sans-serif;font-weight:600;font-size:19px;color:var(--tinta);margin-right:6px}',
    '.m-tim .ak{min-width:80px;min-height:64px;padding:4px 10px;border-radius:14px}',
    '.m-tim .ak svg{width:52px;height:50px;overflow:visible;display:block}',
    '.m-tim .ak.pilih{outline:4px solid var(--lip);outline-offset:2px;background:linear-gradient(180deg,var(--c1),var(--c2))}',
    '.fr{display:inline-flex;flex-direction:column;align-items:center;line-height:1.05;vertical-align:middle}',
    '.fr i{font-style:normal;padding:0 6px}',
    '.fr i:first-child{border-bottom:3px solid currentColor;padding-bottom:2px}'
  ].join('\n');

  /* ── variasi otomatis + ikon SVG ── */
  CSS += '\n' + [
    '.k-ik{width:1.05em;height:1.05em;flex:0 0 auto;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;vertical-align:-.16em;overflow:visible}',
    '.k-ik.bt path{fill:var(--aksen);stroke:var(--lip);stroke-width:1.7}',
    '.k-ik.bt.mati path{fill:rgba(0,0,0,.12);stroke:rgba(0,0,0,.22)}',
    '.k-ik.ht path{fill:#E5484D;stroke:#fff;stroke-width:1.7}',
    '.k-ik.ht.mati path{fill:rgba(255,255,255,.15);stroke:rgba(255,255,255,.75)}',
    '.k-bintang .k-ik{width:1em;height:1em}',
    '.k-medal .bt{display:flex;justify-content:center;gap:4px}',
    '.k-ikon .k-ik{width:24px;height:24px}',
    '.m-coc .tanda .k-ik{width:17px;height:17px;stroke-width:3.2}',
    '.m-uru .panah .k-ik{width:26px;height:26px;stroke-width:3}',
    '.k-fb .k-ik{width:1em;height:1em}',
    '.k-pola.p1{opacity:.14;background-image:radial-gradient(var(--aksen) 2.6px,transparent 3.3px);background-size:30px 30px}',
    '.k-pola.p2{opacity:.1;background-image:repeating-radial-gradient(circle at 0 100%,transparent 0 15px,var(--aksen) 15px 18px);background-size:60px 60px}',
    '.k-pola.p3{opacity:.08;background-image:radial-gradient(ellipse 11px 20px at 50% 0,var(--aksen) 96%,transparent),radial-gradient(ellipse 11px 20px at 50% 100%,var(--aksen) 96%,transparent),radial-gradient(ellipse 20px 11px at 0 50%,var(--aksen) 96%,transparent),radial-gradient(ellipse 20px 11px at 100% 50%,var(--aksen) 96%,transparent);background-size:48px 48px}',
    '.k-vj1 .k-tj{right:auto;left:44px;text-align:left}',
    '.k-vj2 .k-tj{right:auto;left:50%;transform:translateX(-50%);bottom:auto;top:76px;text-align:center;max-width:62%}',
    '.k-vj2 .k-tj h1{font-size:56px}'
  ].join('\n');
  /* ── dengarkan, mode tim, papan skor ── */
  CSS += '\n' + [
    '.k-balon{cursor:pointer}',
    '.k-tim{display:flex;gap:6px}',
    '.k-tim-p{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.12);border:2px solid rgba(255,255,255,.25);border-radius:999px;padding:3px 12px;font-weight:800;font-size:17px;white-space:nowrap;color:#fff;transition:transform .2s}',
    '.k-tim-p i{width:12px;height:12px;border-radius:50%;display:inline-block}',
    '.k-tim-p b{font-family:Fredoka,sans-serif;font-size:20px}',
    '.k-tim-p.giliran{background:#fff;color:var(--tinta);border-color:var(--aksen);transform:scale(1.08);box-shadow:0 0 0 3px rgba(255,214,80,.5)}',
    '.k-tim.besar{justify-content:center;flex-wrap:wrap}.k-tim.besar .k-tim-p{font-size:21px;padding:6px 16px}',
    '.k-form{margin-top:10px;background:#fff;border:3px solid var(--c2);border-radius:16px;padding:10px 14px}',
    '.k-form .jd{font-family:Fredoka,sans-serif;font-weight:600;font-size:21px;color:var(--lip);margin-bottom:8px}',
    '.k-form .baris{display:flex;gap:8px;align-items:center}',
    '.k-form input,.k-form select{flex:1;min-width:0;height:48px;font:700 19px Nunito,system-ui,sans-serif;color:var(--tinta);background:var(--kertas);border:2px solid var(--lip);border-radius:12px;padding:0 12px;user-select:text;-webkit-user-select:text}',
    '.k-form select{flex:0 1 230px}',
    '.k-form .info{font-size:16px;font-weight:700;color:#C2333A;margin-top:6px;min-height:0}',
    '.k-form>.k-btn{margin-top:4px}',
    '.k-pop-papan{width:640px;padding:22px 26px 18px}',
    '.k-pop-papan h2{font-size:34px}.k-pop-papan h2 .k-ik{width:34px;height:34px;vertical-align:-4px}',
    '.k-pop-papan .sub{margin:0 0 8px;font-weight:700;opacity:.7;font-size:17px}',
    '.k-pop-papan .isi{max-height:300px;overflow:auto;text-align:left}',
    '.k-papan{width:100%;border-collapse:collapse;font-size:19px}',
    '.k-papan td{padding:6px 8px;border-bottom:2px dashed rgba(0,0,0,.08)}',
    '.k-papan tr.milik td{background:rgba(255,214,80,.35)}',
    '.k-papan .no{width:44px;text-align:center;font-weight:800}',
    '.k-papan .md{display:inline-flex;width:32px;height:32px;border-radius:50%;align-items:center;justify-content:center;color:#fff;font-family:Fredoka,sans-serif;border:2px solid rgba(0,0,0,.2)}',
    '.k-papan .md.m1{background:#E8B020}.k-papan .md.m2{background:#9AA6B2}.k-papan .md.m3{background:#C07A3A}',
    '.k-papan .nm b{display:block;line-height:1.1}.k-papan .nm small{display:block;font-size:14px;opacity:.65;font-weight:700}',
    '.k-papan .bt,.k-papan .wk{text-align:right;white-space:nowrap;font-weight:800}',
    '.k-papan .wk{opacity:.6;font-size:16px}'
  ].join('\n');
  /* ── peta jalur (opsi peta:'jalur') ── */
  CSS += '\n' + [
    '.k-jalur{position:absolute;left:0;right:0;top:58px;bottom:0}',
    '.k-jalur>svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}',
    '.k-jl-titik{cursor:pointer;transform-box:fill-box;transform-origin:center}',
    '.k-jl-titik.kunci{cursor:not-allowed}',
    '.k-jl-titik:not(.kunci):hover .k-jl-bulat{filter:brightness(1.08)}',
    '.k-jl-aktif{transform-box:fill-box;transform-origin:center;animation:kJlDenyut 1.6s ease-in-out infinite}',
    '@keyframes kJlDenyut{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}',
    '.k-jl-cincin{transform-box:fill-box;transform-origin:center;animation:kJlCincin 1.8s ease-out infinite}',
    '@keyframes kJlCincin{0%{transform:scale(1);opacity:.9}100%{transform:scale(1.75);opacity:0}}',
    '.k-jl-label{position:absolute;width:176px;margin-left:-88px;text-align:center;color:#fff;pointer-events:none;',
    '  text-shadow:0 2px 0 rgba(var(--gelap),.95),0 0 10px rgba(var(--gelap),.85)}',
    '.k-jl-label .jd{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-family:Fredoka,sans-serif;font-weight:600;font-size:21px;line-height:1.12}',
    '.k-jl-label small{display:block;font-weight:800;font-size:15px;opacity:.85;margin-top:3px;letter-spacing:.3px}',
    '.k-jl-label.kunci{opacity:.72}',
    '.k-jl-label svg{vertical-align:-3px;margin-right:4px}',
    '.k-jl-penanda{position:absolute;width:64px;height:76px;margin:-76px 0 0 -32px;z-index:3;pointer-events:none;transition:left 1.1s ease-in-out,top 1.1s ease-in-out}',
    '.k-jl-penanda .isi{position:relative;width:64px;height:76px;animation:kJlMelayang 1.5s ease-in-out infinite}',
    '@keyframes kJlMelayang{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}',
    '.k-jl-penanda .bulat{width:64px;height:64px;border-radius:50%;background:var(--kertas);border:4px solid var(--aksen);overflow:hidden;',
    '  box-shadow:0 4px 0 var(--lip),0 8px 14px rgba(0,0,0,.35)}',
    '.k-jl-penanda .bulat img{width:100%;height:130%;object-fit:cover;object-position:50% 0}',
    '.k-jl-penanda .isi.ekor:after{content:"";position:absolute;left:50%;top:62px;margin-left:-9px;border:9px solid transparent;border-top:12px solid var(--aksen)}',
    '.k-jl-peti{transform-box:fill-box;transform-origin:center}',
    '.k-jl-peti.buka{cursor:pointer;animation:kJlDenyut 1.6s ease-in-out infinite}',
    '.k-jl-sinar{transform-box:fill-box;transform-origin:center;animation:kJlPutar 9s linear infinite}',
    '@keyframes kJlPutar{to{transform:rotate(360deg)}}'
  ].join('\n');

  /* ── mesin petak ── */
  CSS += '\n' + [
    '.k-ruang>.m-ptk{position:absolute;inset:12px 18px 8px}',
    '.m-ptk{display:flex;gap:18px}',
    '.m-ptk .kiri{flex:1;padding:14px 18px;display:flex;flex-direction:column;justify-content:center;gap:12px;min-width:0}',
    '.m-ptk .tny{font-family:Fredoka,"Trebuchet MS",sans-serif;font-weight:600;font-size:22px;line-height:1.28;text-align:center}',
    '.m-ptk .tgt{display:flex;flex-direction:column;gap:6px}',
    '.m-ptk .bar{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:40px;padding:3px 14px;background:#fff;border:3px solid var(--lip);border-radius:14px;font-family:Fredoka,sans-serif;font-weight:600;font-size:19px;color:var(--tinta)}',
    '.m-ptk .bar b{font-weight:700;font-size:25px;line-height:1.1;color:var(--lip)}',
    '.m-ptk .cap{font-family:Fredoka,sans-serif;font-weight:500;font-size:17px;line-height:1.25;text-align:center;color:var(--tinta)}',
    '.m-ptk .pil{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}',
    '.m-ptk .pil .k-btn{min-width:96px;font-size:26px;padding:8px 16px}',
    '.m-ptk .pil .k-btn.kecil{min-width:0;font-size:20px;padding:8px 16px}',
    '.m-ptk .pil .k-btn.betul{background:#5DBB2F;color:#0B3318;border-color:#1E6B3A}',
    '.m-ptk .pil .k-btn.keliru{background:#FFD1D1;border-color:#C2333A}',
    '.m-ptk .kn{flex:0 0 540px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;min-width:0}',
    '.m-ptk .pt-svg{width:100%;flex:1;min-height:0;touch-action:none;user-select:none;-webkit-user-select:none;background:var(--kertas);border:3px solid var(--lip);border-radius:20px;box-sizing:border-box}',
    '.m-ptk .kn.main .pt-svg{cursor:pointer}',
    '.m-ptk .pt{fill:#fff;stroke:var(--lip);stroke-width:2;stroke-opacity:.4;transition:fill .15s}',
    '.m-ptk .pt.gr{fill:none;stroke-dasharray:4 5;stroke-opacity:.25}',
    '.m-ptk .pt.on{fill:var(--c2);stroke-opacity:.85}',
    '.m-ptk .pt.ok{fill:#5DBB2F;stroke-opacity:.85}',
    '.m-ptk .pt.no{fill:#E5484D;stroke-opacity:.85}',
    '.m-ptk .tp{stroke:var(--lip);stroke-width:7;stroke-linecap:round;pointer-events:none}',
    '.m-ptk .kr{fill:none;stroke:var(--lip);stroke-width:5;stroke-dasharray:10 6;pointer-events:none}',
    '.m-ptk .ang{font-family:Fredoka,"Trebuchet MS",sans-serif;font-weight:700;font-size:26px;fill:var(--tinta);text-anchor:middle;paint-order:stroke;stroke:#fff;stroke-width:5;stroke-linejoin:round;pointer-events:none}',
    '.m-ptk .info{font-family:Fredoka,sans-serif;font-weight:600;font-size:22px;color:#fff;min-height:30px;text-align:center;text-shadow:0 2px 0 var(--lip),0 0 8px var(--lip)}'
  ].join('\n');


  /* ── mesin kuis ── */
  CSS += '\n' + [
    '.k-ruang>.m-kuis{position:absolute;inset:12px 18px 8px}',
    '.m-kuis{display:flex;gap:14px}',
    '.m-kuis .sisi{flex:0 0 340px;display:flex;flex-direction:column;gap:10px;min-width:0;min-height:0;padding-bottom:6px}',
    '.m-kuis .gb{position:relative;flex:1 1 0;min-height:70px;background:#fff;border:3px solid var(--lip);border-radius:18px;overflow:hidden;box-shadow:0 5px 0 rgba(0,0,0,.18)}',
    '.m-kuis .gb img,.m-kuis .gb .k-fb{position:absolute;left:6px;top:6px;width:calc(100% - 12px);height:calc(100% - 12px);max-width:none;max-height:none;object-fit:contain;border:0;border-radius:10px;color:var(--tinta)}',
    '.m-kuis .bc-w{flex:none;margin:auto 0;padding:10px 14px 12px}',
    '.m-kuis .bc-h{display:flex;align-items:center;gap:6px;margin-bottom:4px;font-family:Fredoka,"Trebuchet MS",sans-serif;font-weight:600;font-size:15px;line-height:1.2;color:var(--lip)}',
    '.m-kuis .bc-h .k-ik{width:18px;height:18px}',
    '.m-kuis .bc{font-family:Nunito,"Trebuchet MS",system-ui,sans-serif;font-weight:700;font-size:var(--kb,18px);line-height:1.3;color:var(--tinta)}',
    '.m-kuis .kn{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;gap:10px}',
    '.m-kuis .kn.jm{padding-top:14px}',
    '.m-kuis .kn.jm .tny{padding-top:15px}',
    '.m-kuis .tny{position:relative;flex:none;margin-top:auto;padding:8px 16px;font-family:Fredoka,"Trebuchet MS",sans-serif;font-weight:600;font-size:var(--kt,24px);line-height:1.25;text-align:center}',
    '.m-kuis .jn{position:absolute;top:-15px;left:50%;transform:translateX(-50%);white-space:nowrap;padding:0 14px;border:2px solid var(--lip);border-radius:999px;background:var(--aksen);color:var(--lip);font-size:15px;font-weight:600;line-height:1.55}',
    '.m-kuis .pil{flex:none;margin-bottom:auto;display:grid;grid-template-columns:1fr;gap:10px;padding:0 3px 8px}',
    '.m-kuis .pil.c2{grid-template-columns:1fr 1fr}',
    '.m-kuis .pil .k-btn.ops{width:100%;min-height:48px;padding:6px 12px 6px 8px;gap:10px;justify-content:flex-start;text-align:left;font-family:Nunito,"Trebuchet MS",system-ui,sans-serif;font-weight:800;font-size:var(--kp,21px);line-height:1.2;color:var(--tinta)}',
    '.m-kuis .ops .lb{flex:0 0 auto;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--lip);color:#fff;font-family:Fredoka,"Trebuchet MS",sans-serif;font-weight:700;font-size:18px;line-height:1}',
    '.m-kuis .ops.jmk .lb{border-radius:9px}',
    '.m-kuis .ops .lb .k-ik{width:20px;height:20px;stroke-width:3.4}',
    '.m-kuis .ops .tx{flex:1;min-width:0;overflow-wrap:anywhere}',
    '.m-kuis .ops.pilih{background:var(--aksen);box-shadow:inset 0 3px 0 rgba(255,255,255,.55),0 5px 0 var(--lip),0 0 0 4px rgba(255,255,255,.92),0 10px 14px rgba(0,0,0,.28)}',
    '.m-kuis .ops.betul{background:#5DBB2F;color:#0B3318;border-color:#1E6B3A}',
    '.m-kuis .ops.betul .lb{background:#1E6B3A}',
    '.m-kuis .ops.keliru{background:#FFD1D1;border-color:#C2333A;color:#5A1015}',
    '.m-kuis .ops.keliru .lb{background:#C2333A}',
    '.m-kuis .ops.coret{pointer-events:none}',
    '.m-kuis .ops.coret .tx{text-decoration:line-through;text-decoration-thickness:2px}',
    '.m-kuis .ops.redup{opacity:.55}',
    '.m-kuis .pil.mati .ops{pointer-events:none}'
  ].join('\n');

  /* ── mesin tembak ── */
  CSS += '\n' + [
    '.k-ruang>.m-ss{position:absolute;inset:12px 18px 8px}',
    '.m-ss{display:flex;flex-direction:column;gap:8px}',
    '.m-ss .tny{flex:none;max-height:100px;overflow:hidden;padding:8px 18px;font-family:Fredoka,"Trebuchet MS",sans-serif;font-weight:600;font-size:24px;line-height:1.22;text-align:center}',
    '.k-tb-svg{flex:1;min-height:0;width:100%;display:block;touch-action:none;cursor:crosshair;user-select:none;-webkit-user-select:none;box-sizing:border-box;',
    '  border:3px solid var(--aksen);border-radius:20px;background:rgba(var(--gelap),.4)}',
    '.k-tb-bidik{fill:none;stroke:var(--aksen);stroke-width:5;stroke-dasharray:12 10;stroke-linecap:round;opacity:.95;pointer-events:none}',
    '.k-tb-silang{fill:none;stroke:var(--aksen);stroke-width:4;pointer-events:none}',
    '.k-tb-svg.terbang .k-tb-bidik,.k-tb-svg.terbang .k-tb-silang,.k-tb-svg.selesai .k-tb-bidik,.k-tb-svg.selesai .k-tb-silang{display:none}',
    '.k-tb-in{transform-box:fill-box;transform-origin:center}',
    '.k-tb-tiang{stroke:var(--lip);stroke-width:7;stroke-linecap:round}',
    '.k-tb-plat{fill:#fff;stroke:var(--lip);stroke-width:4;transition:fill .15s}',
    '.k-tb-garis{fill:none;stroke:var(--c2);stroke-width:2.5;stroke-dasharray:6 5;pointer-events:none}',
    '.k-tb-teks{font-family:Nunito,"Trebuchet MS",system-ui,sans-serif;font-weight:800;fill:var(--tinta);text-anchor:middle;pointer-events:none}',
    '.k-tb-lencana circle{fill:var(--lip);stroke:#fff;stroke-width:2.5}',
    '.k-tb-lencana text{font-family:Fredoka,"Trebuchet MS",sans-serif;font-weight:700;font-size:19px;fill:#fff;text-anchor:middle;pointer-events:none}',
    '.k-tb-sas.bidik .k-tb-plat{fill:var(--kertas);stroke:var(--aksen);stroke-width:7}',
    '.k-tb-sas.betul .k-tb-plat{fill:#BFF0CF;stroke:#1E8B4A}',
    '.k-tb-sas.keliru .k-tb-plat{fill:#FFD1D1;stroke:#C2333A}',
    '.k-tb-sas.mati{opacity:.5}',
    '.k-tb-sas.mati .k-tb-plat{fill:#E6E1E1;stroke:#8A8A8A}',
    '.k-tb-sas.mati .k-tb-teks{text-decoration:line-through}',
    '.k-tb-sas.nyala .k-tb-in{animation:kTbNyala .5s ease-out}',
    '.k-tb-sas.getar .k-tb-in{animation:kTbGetar .45s}',
    '@keyframes kTbNyala{0%{transform:scale(1)}40%{transform:scale(1.14)}100%{transform:scale(1)}}',
    '@keyframes kTbGetar{20%{transform:translateX(-9px) rotate(-3deg)}40%{transform:translateX(9px) rotate(3deg)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}',
    '.k-tb-roda{fill:var(--c1);stroke:var(--lip);stroke-width:4;stroke-linejoin:round}',
    '.k-tb-laras rect{fill:var(--c2);stroke:var(--lip);stroke-width:4;stroke-linejoin:round}',
    '.k-tb-laras path{fill:none;stroke:#fff;stroke-width:5;stroke-linecap:round;opacity:.45}',
    '.k-tb-poros{fill:var(--aksen);stroke:var(--lip);stroke-width:4}',
    '.k-tb-peluru{fill:var(--aksen);stroke:var(--lip);stroke-width:3.5}',
    '.k-tb-kilat{fill:#fff;transform-box:fill-box;transform-origin:center;animation:kTbKilat .25s ease-out forwards}',
    '@keyframes kTbKilat{from{opacity:1;transform:scale(.4)}to{opacity:0;transform:scale(1.7)}}',
    '.k-tb-serpih{transform-box:fill-box;transform-origin:center;animation:kTbSerpih .7s ease-out forwards}',
    '@keyframes kTbSerpih{from{opacity:1;transform:translate(0,0) scale(1)}to{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.2)}}'
  ].join('\n');

  /* ── mesin balon ── (memakai ulang k-tb-lencana, k-tb-teks, k-tb-serpih, kTbSerpih, kTbNyala milik tembak) */
  CSS += '\n' + [
    '.k-bl-svg{flex:1;min-height:0;width:100%;display:block;touch-action:manipulation;user-select:none;-webkit-user-select:none;box-sizing:border-box;border:3px solid var(--aksen);border-radius:20px;background:rgba(var(--gelap),.4)}',
    '.k-bl-sas{cursor:pointer}',
    '.k-bl-ay,.k-bl-in{transform-box:fill-box;transform-origin:50% 100%}',
    '.k-bl-in{transform-origin:center}',
    '.k-bl-ay{animation:kBlLayang var(--d,4s) ease-in-out var(--l,0s) infinite alternate}',
    '@keyframes kBlLayang{from{transform:translateY(0) rotate(-2.5deg)}to{transform:translateY(-9px) rotate(2.5deg)}}',
    '.k-bl-svg.selesai .k-bl-ay{animation:none}',
    '.k-bl-svg.selesai .k-bl-sas{pointer-events:none}',
    '.k-bl-sas.getar .k-bl-ay{animation:kBlGetar .45s}',
    '@keyframes kBlGetar{20%{transform:translateX(-9px) rotate(-4deg)}40%{transform:translateX(9px) rotate(4deg)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}',
    '.k-bl-sas.nyala .k-bl-in{animation:kTbNyala .5s ease-out}',
    '.k-bl-sas.mati{display:none}',
    '.k-bl-badan{stroke:var(--lip);stroke-width:3.5;stroke-linejoin:round}',
    '.k-bl-sas.betul .k-bl-badan{stroke:#1E8B4A;stroke-width:6}',
    '.k-bl-tali{fill:none;stroke:var(--lip);stroke-width:2.5;stroke-linecap:round;opacity:.8}',
    '.k-bl-kilau{fill:#fff;opacity:.45;pointer-events:none}',
    '.k-bl-plat{fill:#fff;opacity:.92;pointer-events:none}',
    '.k-bl-ef{pointer-events:none}',
    '@media (prefers-reduced-motion:reduce){.k-bl-ay,.k-bl-in{animation:none!important}}'
  ].join('\n');

  /* ── mesin pancing ── (kelas sendiri berawalan k-pc-; tidak memakai CSS tembak/balon) */
  CSS += '\n' + [
    '.k-pc-svg{flex:1;min-height:0;width:100%;display:block;touch-action:none;cursor:ew-resize;user-select:none;-webkit-user-select:none;box-sizing:border-box;border:3px solid var(--aksen);border-radius:20px;background:rgba(var(--gelap),.4)}',
    '.k-pc-air{fill:var(--c1);opacity:.22;pointer-events:none}',
    '.k-pc-ombak{fill:none;stroke:var(--aksen);stroke-width:3;stroke-linecap:round;opacity:.85;pointer-events:none}',
    '.k-pc-perahu path{fill:var(--c2);stroke:var(--lip);stroke-width:3.5;stroke-linejoin:round}',
    '.k-pc-tali{stroke:var(--lip);stroke-width:2.5;stroke-linecap:round;pointer-events:none}',
    '.k-pc-kail{fill:none;stroke:var(--lip);stroke-width:3.5;stroke-linecap:round;pointer-events:none}',
    '.k-pc-ay{animation:kPcGoyang var(--d,3.4s) ease-in-out var(--l,0s) infinite alternate}',
    '@keyframes kPcGoyang{from{transform:translateY(0) rotate(-1.5deg)}to{transform:translateY(-6px) rotate(1.5deg)}}',
    '.k-pc-ekor{transform-box:fill-box;transform-origin:100% 50%;animation:kPcEkor .8s ease-in-out infinite alternate}',
    '@keyframes kPcEkor{from{transform:rotate(-9deg)}to{transform:rotate(9deg)}}',
    '.k-pc-in{transform-box:fill-box;transform-origin:center}',
    '.k-pc-badan{stroke:var(--lip);stroke-width:3.5;stroke-linejoin:round}',
    '.k-pc-ikan.bidik .k-pc-badan{stroke:var(--aksen);stroke-width:7}',
    '.k-pc-ikan.betul .k-pc-badan{stroke:#1E8B4A;stroke-width:6}',
    '.k-pc-ikan.nyala .k-pc-in{animation:kPcNyala .5s ease-out}',
    '@keyframes kPcNyala{0%{transform:scale(1)}40%{transform:scale(1.14)}100%{transform:scale(1)}}',
    '.k-pc-ikan.getar .k-pc-ay{animation:kPcGetar .45s}',
    '@keyframes kPcGetar{20%{transform:translateX(-9px) rotate(-4deg)}40%{transform:translateX(9px) rotate(4deg)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}',
    '.k-pc-ikan.mati{display:none}',
    '.k-pc-svg.selesai .k-pc-ay,.k-pc-svg.selesai .k-pc-ekor{animation:none}',
    '.k-pc-mata{fill:#222;pointer-events:none}',
    '.k-pc-plat{fill:#fff;opacity:.92;pointer-events:none}',
    '.k-pc-teks{font-family:Nunito,"Trebuchet MS",system-ui,sans-serif;font-weight:800;fill:var(--tinta);text-anchor:middle;pointer-events:none}',
    '.k-pc-lencana circle{fill:var(--lip);stroke:#fff;stroke-width:2.5}',
    '.k-pc-lencana text{font-family:Fredoka,"Trebuchet MS",sans-serif;font-weight:700;font-size:17px;fill:#fff;text-anchor:middle;pointer-events:none}',
    '.k-pc-ef{pointer-events:none}',
    '.k-pc-gel{fill:none;stroke:var(--aksen);stroke-width:3;transform-box:fill-box;transform-origin:center;animation:kPcGel .9s ease-out forwards}',
    '@keyframes kPcGel{from{opacity:1;transform:translate(0,0) scale(.5)}to{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.2)}}',
    '@media (prefers-reduced-motion:reduce){.k-pc-ay,.k-pc-ekor,.k-pc-in{animation:none!important}}'
  ].join('\n');

  /* ── mesin tangkap ── (kelas sendiri berawalan k-ct-) */
  CSS += '\n' + [
    '.k-ct-svg{flex:1;min-height:0;width:100%;display:block;touch-action:none;cursor:ew-resize;user-select:none;-webkit-user-select:none;box-sizing:border-box;border:3px solid var(--aksen);border-radius:20px;background:rgba(var(--gelap),.4)}',
    '.k-ct-tanah{fill:var(--c1);opacity:.2;pointer-events:none}',
    '.k-ct-in{transform-box:fill-box;transform-origin:center}',
    '.k-ct-kartu{fill:#fff;stroke:var(--w);stroke-width:5}',
    '.k-ct-teks{font-family:Nunito,"Trebuchet MS",system-ui,sans-serif;font-weight:800;fill:var(--tinta);text-anchor:middle;pointer-events:none}',
    '.k-ct-lencana circle{fill:var(--lip);stroke:#fff;stroke-width:2.5}',
    '.k-ct-lencana text{font-family:Fredoka,"Trebuchet MS",sans-serif;font-weight:700;font-size:17px;fill:#fff;text-anchor:middle;pointer-events:none}',
    '.k-ct-item{pointer-events:none}',
    '.k-ct-item.mati{display:none}',
    '.k-ct-item.masuk .k-ct-in{transform:scale(.86)}',
    '.k-ct-item.betul .k-ct-kartu{stroke:#1E8B4A;stroke-width:7}',
    '.k-ct-item.nyala .k-ct-in{animation:kCtNyala .5s ease-out}',
    '.k-ct-item.getar .k-ct-in{animation:kCtGetar .45s}',
    '@keyframes kCtNyala{0%{transform:scale(1)}40%{transform:scale(1.16)}100%{transform:scale(1)}}',
    '@keyframes kCtGetar{20%{transform:translateX(-9px) rotate(-4deg)}40%{transform:translateX(9px) rotate(4deg)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}',
    '.k-ct-kr path{fill:var(--c2);stroke:var(--lip);stroke-width:3.5;stroke-linejoin:round;stroke-linecap:round}',
    '.k-ct-kr .k-ct-anyam{fill:none;stroke-width:2.5;opacity:.55}',
    '.k-ct-ef{pointer-events:none}',
    '.k-ct-gel{fill:none;stroke:var(--aksen);stroke-width:3;transform-box:fill-box;transform-origin:center;animation:kCtGel .9s ease-out forwards}',
    '@keyframes kCtGel{from{opacity:1;transform:translate(0,0) scale(.5)}to{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.2)}}',
    '@media (prefers-reduced-motion:reduce){.k-ct-in{animation:none!important}}'
  ].join('\n');

  /* ── mesin rakit ── (kelas sendiri berawalan k-rk-) */
  CSS += '\n' + [
    '.k-ruang>.k-rk-w{position:absolute;inset:12px 18px 8px;display:flex}',
    '.k-rk-kartu{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:10px;padding:12px 22px;overflow:auto}',
    '.k-rk-tny{flex:0 0 auto;font-family:Fredoka,sans-serif;font-weight:600;font-size:26px;line-height:1.25;text-align:center;max-height:96px;overflow:auto}',
    '.k-r
