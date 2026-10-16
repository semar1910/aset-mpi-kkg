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
 * v1.5: progres tersimpan, tombol dengarkan, soal salah diulang, bank soal (jumlah),
 *       mode tim, hasil murid + papan skor (bila diputar dari server KKG).
 */
(function () {
  'use strict';
  var VERSI = '1.19.0';
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
IK.rangkai = '<rect x="3" y="3.5" width="8" height="8" rx="2"/><rect x="13" y="3.5" width="8" height="8" rx="2"/><path d="M5.2 9l1.8-4.2L8.8 9M5.9 7.6h2.2M15.5 4.8v5.4M15.5 4.8h1.6a1.4 1.4 0 0 1 0 2.8h-1.6M15.5 7.6h1.9a1.4 1.4 0 0 1 0 2.6h-1.9M3.5 17h7M13.5 17h7M3.5 20.5h7M13.5 20.5h7"/>';
IK.huruf = '<rect x="2.6" y="6.5" width="8.6" height="11" rx="2.2"/><rect x="12.8" y="6.5" width="8.6" height="11" rx="2.2" stroke-dasharray="2.4 2.6"/><path d="M4.8 14.6 6.9 9.4l2.1 5.2M5.6 13h2.6"/>';
  var IKON_MESIN = { cerita: 'buku', bacaan: 'halaman', sortir: 'keranjang', cocokkan: 'rantai', urutkan: 'urutan', runner: 'jalur', jelajah: 'lup', memori: 'memori', isian: 'papan', garis: 'garis', pecahan: 'pecahan', jam: 'jam', uang: 'uang', timbangan: 'timbangan', petak: 'petak', kuis: 'kuis', tembak: 'tembak', balon: 'balon', pancing: 'pancing', tangkap: 'tangkap', labeli: 'label', rakit: 'rakit', huruf: 'huruf', rangkai: 'rangkai' };
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
    rangkai: 'Ketuk huruf atau kata untuk mengisi kotak jawaban, lalu tekan Periksa. Ketuk kotak untuk mengeluarkannya lagi.'
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
    '.k-rk-bar{display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap}',
    '.k-rk-info{font-weight:800;font-size:18px;color:var(--lip)}',
    '.k-rk-baris{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:8px;min-height:66px}',
    '.k-rk-slot{min-width:62px;height:66px;display:flex;align-items:center;justify-content:center;border:3px dashed var(--lip);border-radius:14px;background:rgba(255,255,255,.78);transition:background .15s,border-color .15s}',
    '.k-rk-slot.isi{border-style:solid;border-color:var(--c2);background:#fff}',
    '.k-rk-slot.ok{border-color:#1E8B4A;background:#DDF7E6}',
    '.k-rk-slot.no{border-color:#C2333A;background:#FFE1E1;animation:kGoyang .45s}',
    '.k-rk-rm{min-width:62px;height:62px;border-radius:14px;background:rgba(0,0,0,.07);display:flex;align-items:center;justify-content:center}',
    '.k-rk-kp{min-width:58px;height:58px;padding:0 12px;border:3px solid var(--lip);border-radius:12px;background:#fff;color:var(--tinta);font-family:Fredoka,sans-serif;font-weight:700;font-size:32px;line-height:1;cursor:pointer;box-shadow:0 4px 0 var(--lip);touch-action:manipulation;-webkit-user-select:none;user-select:none}',
    '.k-rk-kp:active{transform:translateY(3px);box-shadow:0 1px 0 var(--lip)}',
    '.k-rk-kp:focus-visible{outline:4px solid var(--aksen);outline-offset:2px}',
    '.k-rk-kp:disabled{cursor:default;opacity:1}',
    '.k-rk-slot .k-rk-kp{width:100%;height:100%;min-width:0;padding:0 8px;border:0;border-radius:10px;background:transparent;box-shadow:none;animation:kPop .3s both}',
    '.k-rk-slot .k-rk-kp:active{transform:none}',
    '.k-rk-slot.ok .k-rk-kp{color:#12582F}',
    '.k-rk-suku .k-rk-slot,.k-rk-suku .k-rk-rm{min-width:92px}',
    '.k-rk-suku .k-rk-kp{font-size:28px;padding:0 10px}',
    '@media (prefers-reduced-motion:reduce){.k-rk-slot.no,.k-rk-slot .k-rk-kp{animation:none!important}}'
  ].join('\n');

  /* ── mesin huruf ── (kelas sendiri berawalan k-hr-) */
  CSS += '\n' + [
    '.k-ruang>.k-hr-w{position:absolute;inset:12px 18px 8px}',
    '.k-hr-w{--k-hr-u:64px;display:flex;flex-direction:column;justify-content:center;gap:12px}',
    '.k-hr-tny{flex:none;padding:10px 18px;text-align:center;font-weight:800;font-size:24px;line-height:1.3;max-height:130px;overflow:hidden}',
    '.k-hr-info{margin-top:4px;font-family:Fredoka,"Trebuchet MS",sans-serif;font-weight:600;font-size:18px;color:var(--lip)}',
    '.k-hr-slot{display:flex;justify-content:center;gap:8px}',
    '.k-hr-kt{flex:none;width:var(--k-hr-u);height:calc(var(--k-hr-u) * 1.1);display:flex;align-items:center;justify-content:center;border:3px dashed var(--lip);border-radius:14px;background:rgba(255,255,255,.72);transition:background .15s,border-color .15s}',
    '.k-hr-kt.aktif{border-style:solid;border-color:var(--c2);background:#fff;box-shadow:0 0 0 4px rgba(255,255,255,.55)}',
    '.k-hr-kt.betul{border:3px solid #1E8B4A;background:#DDF7E6}',
    '.k-hr-kt.keliru{border:3px solid #C2333A;background:#FFE1E1;animation:kHrGoyang .45s}',
    '.k-hr-kt.tampil{border:3px solid #B7791F;background:#FFF1CC}',
    '.k-hr-baki{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-items:center;padding:10px 14px;background:rgba(255,255,255,.55);border:3px solid var(--lip);border-radius:18px}',
    '.k-hr-sel{flex:none;width:var(--k-hr-u);height:calc(var(--k-hr-u) * 1.1);border-radius:14px;background:rgba(0,0,0,.1)}',
    '.k-hr-ub{display:flex;align-items:center;justify-content:center;width:100%;height:100%;padding:0;border:3px solid var(--lip);border-radius:14px;background:#fff;color:var(--tinta);',
    '  font-family:Fredoka,"Trebuchet MS",sans-serif;font-weight:700;font-size:calc(var(--k-hr-u) * .56);line-height:1;cursor:pointer;box-shadow:0 4px 0 var(--lip);touch-action:manipulation}',
    '.k-hr-ub:active{transform:translateY(3px);box-shadow:0 1px 0 var(--lip)}',
    '.k-hr-ub:focus-visible{outline:4px solid var(--aksen);outline-offset:2px}',
    '.k-hr-kt .k-hr-ub{box-shadow:0 3px 0 var(--lip);animation:kHrPop .25s both}',
    '.k-hr-kt.betul .k-hr-ub{background:#DDF7E6;border-color:#1E8B4A;box-shadow:0 3px 0 #1E8B4A;cursor:default}',
    '.k-hr-kt.keliru .k-hr-ub{background:#FFE1E1;border-color:#C2333A;box-shadow:0 3px 0 #C2333A}',
    '.k-hr-kt.tampil .k-hr-ub{background:#FFF1CC;border-color:#B7791F;box-shadow:0 3px 0 #B7791F;cursor:default}',
    '@keyframes kHrGoyang{20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}',
    '@keyframes kHrPop{from{transform:scale(.6)}to{transform:none}}'
  ].join('\n');

  /* ── mesin rangkai ── */
  CSS += '\n' + [
    '.k-rg-w{position:absolute;inset:12px 18px 8px;display:flex;flex-direction:column;gap:10px}',
    '.k-rg-tny{flex:0 0 auto;display:flex;align-items:center;gap:14px;padding:10px 18px;min-height:64px}',
    '.k-rg-gb{flex:0 0 72px;width:72px;height:72px;border-radius:12px;overflow:hidden;background:#fff;border:2px solid var(--lip)}',
    '.k-rg-gb img,.k-rg-gb .k-fb{width:100%;height:100%;object-fit:contain;display:block;border-radius:0;padding:0}',
    '.k-rg-tx{flex:1;min-width:0;font-weight:800;font-size:23px;line-height:1.3}',
    '.k-rg-jwb{flex:1 1 0;min-height:0;display:flex;flex-wrap:wrap;align-content:center;justify-content:center;gap:8px;padding:6px 4px;overflow-y:auto}',
    '.k-rg-baki{flex:0 1 auto;display:flex;flex-wrap:wrap;justify-content:center;gap:8px;padding:10px 12px;overflow-y:auto}',
    '.k-rg-sl{display:inline-flex;align-items:center;justify-content:center;min-width:64px;height:72px;padding:0 10px;border:3px dashed var(--lip);border-radius:14px;background:rgba(255,255,255,.85);color:var(--tinta);',
    '  font-family:Fredoka,"Trebuchet MS",sans-serif;font-weight:600;font-size:38px;line-height:1;cursor:pointer}',
    '.k-rg-sl.k-rg-isi{border-style:solid;background:#fff;box-shadow:0 4px 0 rgba(0,0,0,.18)}',
    '.k-rg-sl.k-rg-kunci,.k-rg-sl.k-rg-ok{background:#DDF7E6;border:3px solid #1E8B4A;box-shadow:0 4px 0 #1E8B4A;cursor:default}',
    '.k-rg-sl.k-rg-ok{animation:kRgPop .4s both}',
    '.k-rg-sl.k-rg-no{background:#FFE1E1;border:3px solid #C2333A;box-shadow:0 4px 0 #C2333A;animation:kRgGetar .45s}',
    '.k-rg-ub{font-family:Fredoka,"Trebuchet MS",sans-serif;font-weight:600;font-size:34px;line-height:1;min-width:64px;height:64px;padding:0 10px;',
    '  border:3px solid var(--lip);border-radius:14px;color:var(--lip);cursor:pointer;background:linear-gradient(180deg,var(--c1),var(--c2));',
    '  box-shadow:inset 0 3px 0 rgba(255,255,255,.55),0 4px 0 var(--lip);transition:transform .08s,box-shadow .08s,opacity .15s}',
    '.k-rg-ub:active{transform:translateY(3px);box-shadow:inset 0 3px 0 rgba(255,255,255,.55),0 1px 0 var(--lip)}',
    '.k-rg-ub[disabled]{cursor:default;opacity:.55}',
    '.k-rg-ub.k-rg-pakai{opacity:.2;box-shadow:none;transform:none}',
    '.k-rg-ub:focus-visible,.k-rg-sl:focus-visible{outline:4px solid var(--lip);outline-offset:3px}',
    '.k-rg-jwb.k-rg-kt .k-rg-sl{min-width:84px;height:54px;padding:0 14px;font-size:24px}',
    '.k-rg-baki.k-rg-kt .k-rg-ub{min-width:56px;height:54px;padding:0 16px;font-size:24px}',
    '@keyframes kRgPop{0%{transform:scale(.8)}60%{transform:scale(1.1)}100%{transform:scale(1)}}',
    '@keyframes kRgGetar{20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}',
    '@media (prefers-reduced-motion:reduce){.k-rg-sl,.k-rg-ub{animation:none!important;transition:none!important}}',
  ].join('\n');

  /* ════════════════════════════ ALAT ════════════════════════════ */
  var D = null, ROOT, PG, SKALA = 1, LEVEL = [], BINTANG = [], TERBUKA = 1, MODE_GURU = false;
  /* Variasi tampilan dipilih otomatis dari judul MPI, jadi tiap MPI terlihat berbeda
     tanpa ditulis di DATA. Bisa dipaksa lewat DATA.gaya = { judul:0-2, pola:0-3, sudut:0-3 }. */
  var VARIAN = { judul: 0, pola: 0, sudut: 0 };

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  /* teks aman + **tebal** + baris baru */
  function fmt(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
  }
  function acak(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function tunda(ms, fn) { return setTimeout(fn, ms); }
  function src(x) {
    if (!x) return '';
    if (D && D.gambar && D.gambar[x]) return D.gambar[x];
    x = String(x);
    /* nama kunci (mis. "latar") yang tidak didaftarkan di gambar: dianggap kosong */
    return /[\/.:]/.test(x) ? x : '';
  }
  /* gambar dengan cadangan berlabel bila gagal dimuat */
  function gambar(x, label, cls) {
    var u = src(x);
    function cadangan() {
      var f = el('div', 'k-fb ' + (cls || ''));
      f.textContent = label || 'Gambar';
      return f;
    }
    if (!u) return cadangan();
    var i = new Image();
    i.alt = label || '';
    if (cls) i.className = cls;
    i.onerror = function () { if (i.parentNode) i.parentNode.replaceChild(cadangan(), i); };
    i.src = u;
    return i;
  }
  function isiKartu(k, item) {
    if (item && typeof item === 'object') {
      if (item.gambar) k.appendChild(gambar(item.gambar, item.teks || ''));
      if (item.teks) k.appendChild(el('span', null, fmt(item.teks)));
    } else {
      k.innerHTML = fmt(item);
    }
    return k;
  }
  function teksItem(item) {
    return (item && typeof item === 'object') ? (item.teks || '(gambar)') : String(item);
  }

  /* ════════════════════════════ SUARA ════════════════════════════ */
  var Suara = {
    aktif: true, ctx: null,
    siap: function () {
      if (this.ctx) return;
      try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { this.ctx = null; }
    },
    nada: function (f, dur, tipe, vol, jeda) {
      if (!this.aktif || !this.ctx) return;
      try {
        var c = this.ctx, t = c.currentTime + (jeda || 0), o = c.createOscillator(), g = c.createGain();
        o.type = tipe || 'sine'; o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol || 0.18, t + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.02);
      } catch (e) {}
    },
    klik: function () { this.nada(660, 0.07, 'triangle', 0.12); },
    benar: function () { this.nada(660, 0.12, 'triangle'); this.nada(990, 0.2, 'triangle', 0.18, 0.1); },
    salah: function () { this.nada(220, 0.18, 'sawtooth', 0.09); this.nada(170, 0.24, 'sawtooth', 0.08, 0.13); },
    koin: function () { this.nada(1320, 0.07, 'square', 0.07); this.nada(1760, 0.14, 'square', 0.07, 0.06); },
    menang: function () {
      var n = [523, 659, 784, 1047], s = this;
      n.forEach(function (f, i) { s.nada(f, 0.22, 'triangle', 0.16, i * 0.12); });
    }
  };

  /* getar halus di HP (ikut tombol suara: bila suara dimatikan, getar juga mati) */
  function getar(pola) {
    if (!Suara.aktif) return;
    try { if (navigator.vibrate) navigator.vibrate(pola); } catch (e) {}
  }

  /* layar penuh + kunci mendatar; dipanggil saat tombol disentuh (wajib dari sentuhan) */
  function layarPenuh(paksa) {
    var d = document.documentElement;
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) return;
      var f = d.requestFullscreen || d.webkitRequestFullscreen;
      if (!f) return;
      var p = f.call(d, { navigationUI: 'hide' });
      var kunci = function () { try { screen.orientation.lock('landscape').catch(function () {}); } catch (e) {} };
      if (p && p.then) p.then(kunci).catch(function () {}); else kunci();
    } catch (e) {}
  }
  var LAYAR_SENTUH = !!(window.matchMedia && window.matchMedia('(pointer:coarse)').matches);

  /* ════════════════════════════ KONFETI ════════════════════════════ */
  function konfeti(jumlah) {
    var cv = document.getElementById('kit-konfeti');
    if (!cv || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var c = cv.getContext('2d'); cv.width = W; cv.height = H;
    var t = TEMA[D.tema] || TEMA.emas;
    var warna = [t.c1, t.c2, t.aksen, '#ffffff', '#4FD1C5', '#FF6B9A'];
    var p = [];
    for (var i = 0; i < (jumlah || 140); i++) {
      p.push({ x: W / 2 + (Math.random() - .5) * 300, y: H * 0.45, vx: (Math.random() - .5) * 18, vy: -Math.random() * 18 - 6,
        w: 8 + Math.random() * 10, h: 10 + Math.random() * 12, r: Math.random() * 6, vr: (Math.random() - .5) * .4,
        c: warna[i % warna.length] });
    }
    var umur = 0;
    (function jalan() {
      c.clearRect(0, 0, W, H);
      p.forEach(function (q) {
        q.vy += 0.55; q.vx *= 0.99; q.x += q.vx; q.y += q.vy; q.r += q.vr;
        c.save(); c.translate(q.x, q.y); c.rotate(q.r); c.fillStyle = q.c; c.fillRect(-q.w / 2, -q.h / 2, q.w, q.h); c.restore();
      });
      if (++umur < 160) requestAnimationFrame(jalan); else c.clearRect(0, 0, W, H);
    })();
  }

  /* ════════════════════════════ PANGGUNG ════════════════════════════ */
  function pasangPanggung() {
    if (!document.getElementById('kit-css')) {
      var f = document.createElement('link');
      f.rel = 'stylesheet';
      f.href = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@600;700;800&display=swap';
      document.head.appendChild(f);
      var s = document.createElement('style'); s.id = 'kit-css'; s.textContent = CSS;
      document.head.appendChild(s);
      if (!document.querySelector('meta[name=viewport]')) {
        var m = document.createElement('meta'); m.name = 'viewport'; m.content = 'width=device-width,initial-scale=1,viewport-fit=cover';
        document.head.appendChild(m);
      }
    }
    document.body.style.margin = '0';
    ROOT = el('div'); ROOT.id = 'kit';
    PG = el('div'); PG.id = 'kit-pg';
    ROOT.appendChild(PG);
    var putar = el('div', null, '<div class="hp"></div><div>Putar HP ke posisi mendatar<br>supaya tampilannya pas.</div>');
    putar.id = 'kit-putar';
    document.body.appendChild(ROOT);
    document.body.appendChild(putar);
    terapkanTema();
    skala();
    window.addEventListener('resize', skala);
    document.addEventListener('pointerdown', function () { Suara.siap(); if (Suara.ctx && Suara.ctx.state === 'suspended') Suara.ctx.resume(); }, true);
  }
  function terapkanTema() {
    var t = TEMA[D && D.tema] || TEMA.emas;
    ['c1', 'c2', 'lip', 'aksen', 'gelap', 'tinta', 'kertas', 'bg1', 'bg2'].forEach(function (k) {
      PG.style.setProperty('--' + k, t[k]);
    });
    var h = hashTeks(D && D.judul), gy = (D && D.gaya) || {};
    VARIAN = {
      judul: gy.judul != null ? gy.judul % 3 : h % 3,
      pola: gy.pola != null ? gy.pola % 4 : Math.floor(h / 3) % 4,
      sudut: gy.sudut != null ? gy.sudut % 4 : Math.floor(h / 12) % 4
    };
    PG.style.setProperty('--sudut', [160, 125, 200, 105][VARIAN.sudut] + 'deg');
  }
  function skala() {
    var iw = window.innerWidth || W_MIN, ih = window.innerHeight || H;
    W = Math.round(Math.max(W_MIN, Math.min(W_MAX, H * iw / ih)));
    PG.style.width = W + 'px';
    var cv = document.getElementById('kit-konfeti'); if (cv) { cv.width = W; cv.height = H; }
    SKALA = Math.min(iw / W, ih / H);
    PG.style.transform = 'translate(-50%,-50%) scale(' + SKALA + ')';
  }

  /* ganti layar */
  function layar(isi) {
    Bacakan.diam();
    PG.innerHTML = '';
    var l = el('div', 'k-lay');
    l.appendChild(isi);
    PG.appendChild(l);
    var cv = el('canvas'); cv.id = 'kit-konfeti'; cv.width = W; cv.height = H;
    PG.appendChild(cv);
    return l;
  }
  function tombol(teks, kelas, fn) {
    var b = el('button', 'k-btn ' + (kelas || ''), teks);
    b.type = 'button';
    b.addEventListener('click', function (e) { e.stopPropagation(); Suara.klik(); fn && fn(e); });
    return b;
  }
  function latarLayar(wadah, kunciGambar, gelap) {
    if (kunciGambar && src(kunciGambar)) {
      var g = gambar(kunciGambar, '', 'k-bg');
      if (g.tagName === 'IMG') wadah.appendChild(g);
    } else {
      wadah.appendChild(el('div', 'k-pola' + (VARIAN.pola ? ' p' + VARIAN.pola : '')));
    }
    if (gelap !== false) wadah.appendChild(el('div', 'k-gradb'));
  }
  function tombolSudut() {
    var s = el('div', 'k-sudut');
    var bs = tombol(ik(Suara.aktif ? 'suara' : 'bisu'), 'k-ikon sek', function () {
      Suara.aktif = !Suara.aktif; bs.innerHTML = ik(Suara.aktif ? 'suara' : 'bisu');
    });
    bs.title = 'Suara';
    var bf = tombol(ik('penuh'), 'k-ikon sek', function () {
      try {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) layarPenuh();
        else (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } catch (e) {}
    });
    bf.title = 'Layar penuh';
    s.appendChild(bs); s.appendChild(bf);
    return s;
  }

  /* ════════════════════════════ LAYAR UTAMA ════════════════════════════ */
  function layarJudul() {
    var w = el('div', VARIAN.judul ? 'k-vj' + VARIAN.judul : '');
    latarLayar(w, D.gambar && (D.gambar.sampul ? 'sampul' : 'latar'));
    if (D.maskot && D.maskot.gambar) {
      var m = el('div', 'melayang');
      m.style.cssText = 'position:absolute;left:36px;bottom:0;width:32%;height:460px;display:flex;align-items:flex-end;justify-content:center';
      if (VARIAN.judul === 1) { m.style.left = 'auto'; m.style.right = '36px'; }
      if (VARIAN.judul === 2) { m.style.left = 'auto'; m.style.right = '20px'; m.style.width = '24%'; m.style.height = '330px'; }
      var gm = gambar(D.maskot.gambar, D.maskot.nama);
      gm.style.cssText = 'max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 12px 16px rgba(0,0,0,.45))';
      m.appendChild(gm); w.appendChild(m);
    }
    var tj = el('div', 'k-tj');
    tj.appendChild(el('h1', 'k-judul', fmt(D.judul)));
    if (D.subjudul) tj.appendChild(el('p', null, fmt(D.subjudul)));
    var b = tombol(ik('lanjut') + ' ' + esc(D.tombolMulai || 'Mulai'), 'besar k-denyut', function () { if (LAYAR_SENTUH) layarPenuh(); layarKredit(); });
    b.style.marginTop = '22px';
    tj.appendChild(b);
    w.appendChild(tj);
    w.appendChild(tombolSudut());
    var g = el('button', 'k-guru', ik('kunci') + ' Guru');
    g.type = 'button';
    g.addEventListener('click', panelGuru);
    w.appendChild(g);
    layar(w);
  }

  function layarKredit() {
    var I = D.identitas || {};
    var w = el('div');
    latarLayar(w, D.gambar && (D.gambar.sampul ? 'sampul' : 'latar'), false);
    var k = el('div', 'k-kr');
    var baris = [
      '<div class="k-judul" style="font-size:50px;line-height:1.05">' + fmt(D.judul) + '</div>',
      D.subjudul ? '<div style="font-size:23px;opacity:.85;margin-top:6px;font-weight:700">' + fmt(D.subjudul) + '</div>' : '',
      '<div class="k-garis"></div>',
      '<div style="font-size:18px;opacity:.65;letter-spacing:2px">Media Pembelajaran Interaktif</div>',
      I.penyusun ? '<div class="fd" style="font-size:28px;color:var(--aksen);margin-top:8px;font-weight:600">' + esc(I.penyusun) + '</div>' : '',
      I.sekolah ? '<div style="font-size:21px;opacity:.85">' + esc(I.sekolah) + '</div>' : '',
      '<div class="k-garis"></div>',
      '<div style="font-size:19px;opacity:.8">' + esc([I.mapel, I.kelas ? 'Kelas ' + I.kelas : '', I.materi].filter(Boolean).join('  •  ')) + '</div>',
      '<div style="font-size:17px;opacity:.55;margin-top:22px">KKG SD Gugus 2 Cibatok • Cibungbulang</div>',
      '<div style="font-size:19px;color:var(--aksen);margin-top:18px;opacity:.85">Sentuh untuk lanjut</div>'
    ].filter(Boolean);
    baris.forEach(function (h, i) {
      var d = el('div', null, h); d.style.animationDelay = (0.12 + i * 0.18) + 's'; k.appendChild(d);
    });
    w.appendChild(k);
    var lanjut = function () { clearTimeout(t); (D.cerita && D.cerita.length) ? layarCerita(0) : layarPeta(); };
    var t = tunda(5200, lanjut);
    k.addEventListener('click', lanjut);
    layar(w);
  }

  function layarCerita(i) {
    var c = D.cerita[i];
    if (typeof c === 'string') c = { teks: c };
    var w = el('div');
    latarLayar(w, c.gambar || (D.gambar && D.gambar.latar ? 'latar' : ''));
    var tokohGbr = c.tokoh === false ? null : (c.tokohGambar || (D.maskot && D.maskot.gambar));
    if (tokohGbr) {
      var m = el('div');
      m.style.cssText = 'position:absolute;right:50px;bottom:120px;width:300px;height:390px;display:flex;align-items:flex-end;justify-content:center';
      var gm = gambar(tokohGbr, c.nama || (D.maskot && D.maskot.nama));
      gm.style.cssText = 'max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 12px 16px rgba(0,0,0,.5))';
      m.appendChild(gm); w.appendChild(m);
    }
    var box = el('div', 'k-narasi k-vn');
    var nama = c.nama || (D.maskot && D.maskot.nama) || '';
    if (nama) box.appendChild(el('div', 'k-nama', esc(nama)));
    var p = el('div'); box.appendChild(p);
    var aksi = el('div', 'k-vn-aksi');
    var full = String(c.teks || ''), n = 0, ketik = true;
    if (Bacakan.bisa) {
      var bd = tombol(ik('suara') + ' Dengarkan', 'kecil sek', function () { Bacakan.baca(full); });
      bd.style.marginRight = 'auto'; aksi.appendChild(bd);
    }
    aksi.appendChild(tombol('Lewati ' + ik('lewati'), 'kecil sek', layarPeta));
    var lanjut = tombol((i < D.cerita.length - 1 ? 'Lanjut ' : 'Ayo mulai! ') + ik('lanjut'), '', function () {
      if (ketik) { ketik = false; p.innerHTML = fmt(full); return; }
      if (i < D.cerita.length - 1) layarCerita(i + 1); else layarPeta();
    });
    aksi.appendChild(lanjut);
    box.appendChild(aksi);
    w.appendChild(box);
    w.appendChild(tombolSudut());
    layar(w);
    if (Bacakan.otomatis()) Bacakan.baca(full);
    (function tik() {
      if (!ketik) return;
      n += 2; p.innerHTML = fmt(full.slice(0, n));
      if (n < full.length) setTimeout(tik, 22); else ketik = false;
    })();
  }

  /* ════════════════════════════ PETA JALUR ════════════════════════════
     Dipakai bila DATA berisi peta:'jalur'. Tanpa opsi itu, peta tetap kartu. */
  var JL_TERAKHIR = -1;
  function hashTeks(s) {
    var h = 5381; s = String(s || '');
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return h >>> 0;
  }
  function acakBenih(n) {
    return function () {
      n = (n + 0x6D2B79F5) | 0;
      var t = Math.imul(n ^ (n >>> 15), 1 | n);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function r1(v) { return Math.round(v * 10) / 10; }

  /* ── ikon SVG ── */
  function svgBintang(cx, cy, r, nyala) {
    var p = [];
    for (var k = 0; k < 10; k++) {
      var a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * 0.46 : r;
      p.push(r1(cx + rr * Math.cos(a)) + ',' + r1(cy + rr * Math.sin(a)));
    }
    return '<polygon points="' + p.join(' ') + '" stroke-linejoin="round" style="' +
      (nyala ? 'fill:var(--aksen);stroke:var(--lip);stroke-width:2.2' : 'fill:rgba(255,255,255,.28);stroke:rgba(0,0,0,.28);stroke-width:2') + '"/>';
  }
  function svgGembok(cx, cy) {
    return '<g><circle cx="' + cx + '" cy="' + cy + '" r="17" fill="#fff" style="stroke:var(--lip)" stroke-width="3"/>' +
      '<path d="M' + (cx - 5) + ' ' + (cy - 1) + 'v-4a5 5 0 0 1 10 0v4" fill="none" stroke="#5E6770" stroke-width="2.8" stroke-linecap="round"/>' +
      '<rect x="' + (cx - 7.5) + '" y="' + (cy - 2) + '" width="15" height="11.5" rx="2.6" fill="#5E6770"/>' +
      '<circle cx="' + cx + '" cy="' + (cy + 3.2) + '" r="1.8" fill="#fff"/></g>';
  }
  function svgPin() {
    return '<svg width="64" height="76" viewBox="0 0 64 76"><path d="M32 74C32 74 8 46 8 28a24 24 0 0 1 48 0c0 18-24 46-24 46z" ' +
      'style="fill:var(--aksen);stroke:var(--lip)" stroke-width="4" stroke-linejoin="round"/>' +
      '<circle cx="32" cy="28" r="10" fill="#fff" style="stroke:var(--lip)" stroke-width="3"/></svg>';
  }
  function svgHiasan(jenis, x, y, s) {
    var t = 'transform="translate(' + r1(x) + ' ' + r1(y) + ') scale(' + r1(s) + ')"';
    var garis = 'style="stroke:var(--lip)" stroke-width="2.2"';
    if (jenis === 'awan') return '<g ' + t + ' opacity=".85"><ellipse cx="0" cy="6" rx="34" ry="12" fill="#fff"/>' +
      '<circle cx="-12" cy="0" r="14" fill="#fff"/><circle cx="8" cy="-6" r="18" fill="#fff"/><circle cx="24" cy="3" r="11" fill="#fff"/></g>';
    if (jenis === 'batu') return '<g ' + t + '><ellipse cx="0" cy="12" rx="24" ry="5" fill="rgba(0,0,0,.22)"/>' +
      '<path d="M-20 12C-22 0-12-12 0-12S20-4 21 12Z" fill="#A3A9B0" ' + garis + '/>' +
      '<path d="M-8-6C-4-9 2-9 6-7" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".6"/></g>';
    if (jenis === 'bendera') return '<g ' + t + '><ellipse cx="0" cy="22" rx="14" ry="4" fill="rgba(0,0,0,.22)"/>' +
      '<rect x="-2" y="-30" width="4" height="52" rx="2" style="fill:var(--lip)"/>' +
      '<path d="M2-29L30-20L2-11Z" style="fill:var(--aksen);stroke:var(--lip)" stroke-width="2.2" stroke-linejoin="round"/></g>';
    return '<g ' + t + '><ellipse cx="0" cy="26" rx="22" ry="5" fill="rgba(0,0,0,.22)"/>' +
      '<rect x="-4" y="6" width="8" height="20" rx="2" fill="#8A5A2B" ' + garis + '/>' +
      '<circle cx="0" cy="-8" r="20" fill="#4E9F3D" ' + garis + '/>' +
      '<circle cx="-7" cy="-14" r="7" fill="#7CC456" opacity=".9"/></g>';
  }
  function svgPeti(x, y, buka) {
    var h = '';
    if (buka) {
      h += '<g class="k-jl-sinar">';
      for (var k = 0; k < 10; k++) h += '<path d="M' + x + ' ' + (y - 10) + 'L' + (x - 9) + ' ' + (y - 92) + 'L' + (x + 9) + ' ' + (y - 92) + 'Z" ' +
        'transform="rotate(' + (k * 36) + ' ' + x + ' ' + (y - 10) + ')" style="fill:var(--aksen)" opacity=".38"/>';
      h += '</g>';
    }
    h += '<ellipse cx="' + x + '" cy="' + (y + 30) + '" rx="48" ry="9" fill="rgba(0,0,0,.28)"/>';
    var garis = 'style="stroke:var(--lip)" stroke-width="3" stroke-linejoin="round"';
    h += '<rect x="' + (x - 44) + '" y="' + (y - 18) + '" width="88" height="46" rx="8" fill="#B26E2C" ' + garis + '/>';
    h += '<rect x="' + (x - 44) + '" y="' + (y - 2) + '" width="88" height="7" style="fill:var(--aksen)" opacity=".9"/>';
    if (buka) {
      h += '<circle cx="' + (x - 18) + '" cy="' + (y - 20) + '" r="9" style="fill:var(--aksen);stroke:var(--lip)" stroke-width="2"/>' +
        '<circle cx="' + (x + 2) + '" cy="' + (y - 25) + '" r="10" style="fill:var(--aksen);stroke:var(--lip)" stroke-width="2"/>' +
        '<circle cx="' + (x + 20) + '" cy="' + (y - 19) + '" r="8" style="fill:var(--aksen);stroke:var(--lip)" stroke-width="2"/>';
      h += '<g transform="translate(0 -30) rotate(-16 ' + (x - 44) + ' ' + (y - 18) + ')">' +
        '<path d="M' + (x - 47) + ' ' + (y - 16) + 'v-12a14 14 0 0 1 14-14h66a14 14 0 0 1 14 14v12z" fill="#CB843A" ' + garis + '/></g>';
    } else {
      h += '<path d="M' + (x - 47) + ' ' + (y - 16) + 'v-12a14 14 0 0 1 14-14h66a14 14 0 0 1 14 14v12z" fill="#CB843A" ' + garis + '/>';
      h += '<rect x="' + (x - 9) + '" y="' + (y - 22) + '" width="18" height="20" rx="4" style="fill:var(--aksen);stroke:var(--lip)" stroke-width="2.5"/>' +
        '<circle cx="' + x + '" cy="' + (y - 13) + '" r="2.6" style="fill:var(--lip)"/>';
    }
    h += '<path d="M' + (x - 34) + ' ' + (y - 36) + 'h22" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".45"/>';
    return h;
  }

  function petaJalur(w) {
    var rnd = acakBenih(hashTeks(D.judul));
    var n = LEVEL.length, ht = H - 58;
    var x0 = 120, xp = W - 120, jarak = (xp - x0) / n;
    var arah = rnd() < 0.5 ? 1 : -1, amp = 62 + rnd() * 34, tengah = 240;
    var titik = [];
    for (var i = 0; i < n; i++) {
      var y = tengah + arah * (i % 2 ? -1 : 1) * amp * (0.75 + rnd() * 0.5);
      titik.push({ x: x0 + i * jarak + (rnd() - 0.5) * 24, y: Math.max(150, Math.min(318, y)) });
    }
    var peti = { x: xp, y: Math.max(170, Math.min(300, tengah + (rnd() - 0.5) * 70)) };
    var semuaTitik = [{ x: -40, y: titik[0].y + (rnd() < 0.5 ? -60 : 60) }].concat(titik, [peti]);

    /* jalan: kurva halus melewati semua titik (Catmull-Rom → Bezier), per ruas */
    var ruas = [], contoh = [];
    for (var k = 0; k < semuaTitik.length - 1; k++) {
      var p0 = semuaTitik[k - 1] || semuaTitik[k], p1 = semuaTitik[k], p2 = semuaTitik[k + 1], p3 = semuaTitik[k + 2] || p2;
      var c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
      var c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
      ruas.push('M' + r1(p1.x) + ' ' + r1(p1.y) + 'C' + r1(c1.x) + ' ' + r1(c1.y) + ' ' + r1(c2.x) + ' ' + r1(c2.y) + ' ' + r1(p2.x) + ' ' + r1(p2.y));
      for (var s = 0; s <= 10; s++) {
        var t = s / 10, u = 1 - t;
        contoh.push({
          x: u * u * u * p1.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p2.x,
          y: u * u * u * p1.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p2.y
        });
      }
    }
    var dJalan = ruas.join('');

    /* status tiap level */
    var aktif = -1;
    LEVEL.forEach(function (lv, i) {
      var buka = MODE_GURU || i < TERBUKA;
      if (aktif < 0 && buka && !(BINTANG[i] > 0)) aktif = i;
    });
    var semua = BINTANG.filter(function (x) { return x > 0; }).length === n;
    var tot = BINTANG.reduce(function (a, b) { return a + (b || 0); }, 0);

    var g = '<defs><linearGradient id="kjl-g" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" style="stop-color:var(--c1)"/><stop offset="1" style="stop-color:var(--c2)"/></linearGradient></defs>';

    /* hiasan: posisi ikut benih judul, menjauh dari jalan, titik, dan label */
    var hias = [], coba = 0;
    function dekat(x, y) {
      for (var a = 0; a < contoh.length; a++) if (Math.abs(contoh[a].x - x) < 62 && Math.abs(contoh[a].y - y) < 62) return true;
      for (var b = 0; b < titik.length; b++) {
        if (Math.abs(titik[b].x - x) < 100 && y > titik[b].y - 150 && y < titik[b].y + 115) return true;
      }
      if (Math.abs(peti.x - x) < 110 && y > peti.y - 110 && y < peti.y + 100) return true;
      for (var c = 0; c < hias.length; c++) if (Math.abs(hias[c].x - x) < 70 && Math.abs(hias[c].y - y) < 60) return true;
      return false;
    }
    while (hias.length < 9 && coba++ < 400) {
      var hx = 30 + rnd() * (W - 60), hy = 34 + rnd() * (ht - 70);
      if (dekat(hx, hy)) continue;
      var jenis = hy < 100 ? 'awan' : ['pohon', 'pohon', 'batu', 'bendera', 'pohon'][Math.floor(rnd() * 5)];
      if (jenis === 'bendera' && hias.some(function (h) { return h.j === 'bendera'; })) jenis = 'batu';
      hias.push({ x: hx, y: hy, j: jenis, s: 0.8 + rnd() * 0.4 });
    }
    hias.sort(function (a, b) { return a.y - b.y; });
    hias.forEach(function (h) { g += svgHiasan(h.j, h.x, h.y, h.s); });

    /* jalan berlapis + garis tengah, ruas yang sudah dilalui menyala */
    g += '<path d="' + dJalan + '" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="48" stroke-linecap="round" transform="translate(0 5)"/>' +
      '<path d="' + dJalan + '" fill="none" style="stroke:var(--lip)" stroke-width="46" stroke-linecap="round"/>' +
      '<path d="' + dJalan + '" fill="none" style="stroke:var(--kertas)" stroke-width="38" stroke-linecap="round"/>' +
      '<path d="' + dJalan + '" fill="none" style="stroke:var(--lip)" stroke-width="4" stroke-dasharray="12 12" stroke-linecap="round" opacity=".28"/>';
    ruas.forEach(function (d, k) {
      var lewat = k === 0 || BINTANG[k - 1] > 0;
      if (lewat) g += '<path d="' + d + '" fill="none" style="stroke:var(--c2)" stroke-width="7" stroke-dasharray="14 10" stroke-linecap="round"/>';
    });

    /* titik level */
    titik.forEach(function (p, i) {
      var buka = MODE_GURU || i < TERBUKA, b = BINTANG[i] || 0, x = r1(p.x), y = r1(p.y);
      var isi = buka ? 'url(#kjl-g)' : '#AEB6BE', tepi = buka ? 'var(--lip)' : '#5E6770';
      g += '<g class="k-jl-titik' + (buka ? '' : ' kunci') + '" data-i="' + i + '">' +
        '<ellipse cx="' + x + '" cy="' + (y + 34) + '" rx="32" ry="8" fill="rgba(0,0,0,.28)"/>';
      if (i === aktif) g += '<circle class="k-jl-cincin" cx="' + x + '" cy="' + y + '" r="36" fill="none" style="stroke:var(--aksen)" stroke-width="5"/>';
      g += '<g class="k-jl-bulat' + (i === aktif ? ' k-jl-aktif' : '') + '">' +
        '<circle cx="' + x + '" cy="' + (y + 5) + '" r="36" style="fill:' + tepi + '"/>' +
        '<circle cx="' + x + '" cy="' + y + '" r="35" style="fill:' + isi + ';stroke:' + tepi + '" stroke-width="3.5"/>' +
        '<ellipse cx="' + (x - 9) + '" cy="' + (y - 17) + '" rx="15" ry="8" fill="#fff" opacity=".45"/>' +
        '<text x="' + x + '" y="' + (y + 12) + '" text-anchor="middle" font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700" font-size="34" style="fill:' + tepi + '">' + (i + 1) + '</text></g>';
      if (!buka) g += svgGembok(x + 28, y - 26);
      if (b > 0) g += svgBintang(x - 27, y - 50, 12, b >= 1) + svgBintang(x, y - 57, 14, b >= 2) + svgBintang(x + 27, y - 50, 12, b >= 3);
      g += '</g>';
    });
    g += '<g class="k-jl-peti' + (semua ? ' buka' : '') + '">' + svgPeti(r1(peti.x), r1(peti.y), semua) + '</g>';

    var wadah = el('div', 'k-jalur');
    wadah.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + ht + '" preserveAspectRatio="none">' + g + '</svg>';

    /* label judul level (HTML supaya bisa dua baris) */
    titik.forEach(function (p, i) {
      var buka = MODE_GURU || i < TERBUKA;
      var lb = el('div', 'k-jl-label' + (buka ? '' : ' kunci'),
        '<span class="jd">' + fmt(LEVEL[i].judul || ('Level ' + (i + 1))) + '</span><small>' + esc(namaMesin(LEVEL[i].mesin)) + '</small>');
      lb.style.left = p.x + 'px'; lb.style.top = (p.y + 46) + 'px';
      wadah.appendChild(lb);
    });
    var lp = el('div', 'k-jl-label', '<span class="jd">' +
      '<svg width="20" height="20" viewBox="0 0 20 20">' + svgBintang(10, 11, 9, true) + '</svg>' + tot + ' / ' + (n * 3) + '</span>' +
      '<small>' + (semua ? 'Ketuk peti harta!' : 'Selesaikan semua level') + '</small>');
    lp.style.left = peti.x + 'px'; lp.style.top = (peti.y + 44) + 'px';
    wadah.appendChild(lp);

    /* penanda "kamu di sini": maskot bila ada, pin bila tidak */
    var kunciPos = aktif >= 0 ? aktif : n;
    var tuju = aktif >= 0 ? { x: titik[aktif].x, y: titik[aktif].y - 42 } : { x: peti.x - 64, y: peti.y - 40 };
    var pn = el('div', 'k-jl-penanda');
    var adaMaskot = D.maskot && D.maskot.gambar && src(D.maskot.gambar);
    pn.innerHTML = adaMaskot ? '<div class="isi ekor"><div class="bulat"></div></div>' : '<div class="isi">' + svgPin() + '</div>';
    if (adaMaskot) {
      var im = new Image(); im.alt = '';
      im.onerror = function () { pn.innerHTML = '<div class="isi">' + svgPin() + '</div>'; };
      im.src = src(D.maskot.gambar);
      pn.querySelector('.bulat').appendChild(im);
    }
    var dari = null;
    if (JL_TERAKHIR >= 0 && JL_TERAKHIR < kunciPos) {
      dari = JL_TERAKHIR < n ? { x: titik[JL_TERAKHIR].x, y: titik[JL_TERAKHIR].y - 42 } : null;
    }
    var awal = dari || tuju;
    pn.style.left = awal.x + 'px'; pn.style.top = awal.y + 'px';
    wadah.appendChild(pn);
    if (dari) {
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        pn.style.left = tuju.x + 'px'; pn.style.top = tuju.y + 'px';
      }); });
    }
    JL_TERAKHIR = kunciPos;

    /* sentuhan */
    function goyangSvg(e) { e.classList.remove('goyang'); void e.getBoundingClientRect(); e.classList.add('goyang'); }
    wadah.querySelectorAll('.k-jl-titik').forEach(function (t) {
      var i = +t.getAttribute('data-i');
      t.addEventListener('click', function () {
        if (t.classList.contains('kunci')) { goyangSvg(t); Suara.salah(); getar(40); return; }
        Suara.klik(); mainLevel(i);
      });
    });
    var pt = wadah.querySelector('.k-jl-peti');
    pt.addEventListener('click', function () {
      if (semua) { Suara.klik(); layarPenutup(); } else { goyangSvg(pt); Suara.salah(); }
    });
    w.appendChild(wadah);
  }

  function layarPeta() {
    var w = el('div');
    /* Peta jalur dilihat dari atas, latar biasa dari depan: keduanya tidak serasi.
       Peta jalur hanya memakai gambar.peta (pemandangan dari atas); tanpa itu memakai pola warna. */
    if (D.peta === 'jalur') latarLayar(w, D.gambar && D.gambar.peta ? 'peta' : '');
    else latarLayar(w, D.gambar && D.gambar.latar ? 'latar' : '');
    var atas = el('div', 'k-atas');
    atas.appendChild(tombol(ik('rumah'), 'k-ikon sek', layarJudul));
    atas.appendChild(el('div', 't', fmt(D.judul)));
    atas.appendChild(el('div', null)).style.flex = '1';
    var tot = BINTANG.reduce(function (a, b) { return a + (b || 0); }, 0);
    atas.appendChild(el('div', 'k-pil', ikBintang(true) + ' ' + tot + ' / ' + (LEVEL.length * 3)));
    if (TIM) atas.appendChild(papanTim());
    if (server() && !TIM) {
      var bps = el('button', 'k-pil', ik('piala') + ' Skor'); bps.style.cursor = 'pointer';
      bps.addEventListener('click', function () { Suara.klik(); popupPapan(null); }); atas.appendChild(bps);
    }
    var bg = el('button', 'k-pil', ik('kunci') + ' Guru'); bg.style.cursor = 'pointer';
    bg.addEventListener('click', panelGuru); atas.appendChild(bg);
    w.appendChild(atas);
    if (D.peta === 'jalur') { petaJalur(w); layar(w); return; }
    var peta = el('div', 'k-peta');
    LEVEL.forEach(function (lv, i) {
      var buka = MODE_GURU || i < TERBUKA;
      var md = el('div', 'k-kertas k-medal' + (buka ? '' : ' kunci'));
      var b = BINTANG[i] || 0;
      md.innerHTML = '<div class="no">' + (i + 1) + '</div><h3>' + fmt(lv.judul || ('Level ' + (i + 1))) + '</h3>' +
        '<div class="mn">' + ik(IKON_MESIN[lv.mesin] || 'target') + ' ' + esc(namaMesin(lv.mesin)) + '</div>' +
        '<div class="bt">' + deretBintang(b) + '</div>';
      if (buka) md.addEventListener('click', function () { Suara.klik(); mainLevel(i); });
      peta.appendChild(md);
    });
    w.appendChild(peta);
    var semua = BINTANG.filter(function (x) { return x > 0; }).length === LEVEL.length;
    if (semua) {
      var bp = tombol(ik('piala') + ' Lihat hasil akhir', 'besar k-denyut', layarPenutup);
      bp.style.cssText = 'position:absolute;left:50%;bottom:18px;transform:translateX(-50%)';
      w.appendChild(bp);
    }
    layar(w);
  }
  function namaMesin(m) {
    return { cerita: 'Cerita', bacaan: 'Bacaan', sortir: 'Sortir', cocokkan: 'Cocokkan', urutkan: 'Urutkan', runner: 'Lari Jalur', jelajah: 'Jelajah', memori: 'Memori', isian: 'Isian', garis: 'Garis Bilangan', pecahan: 'Pecahan', jam: 'Jam', uang: 'Uang', timbangan: 'Timbangan', petak: 'Bangun Petak', kuis: 'Kuis', tembak: 'Tembak Sasaran', balon: 'Pecahkan Balon', pancing: 'Memancing Jawaban', tangkap: 'Tangkap Jawaban', labeli: 'Labeli Gambar', rakit: 'Rakit Kata', huruf: 'Susun Huruf', rangkai: 'Rangkai Kata' }[m] || 'Tantangan';
  }

  /* ════════════════════════════ LEVEL ════════════════════════════ */
  function mainLevel(i) {
    var lv = LEVEL[i];
    MULAI_LEVEL = Date.now();
    var w = el('div');
    latarLayar(w, lv.latar || (D.gambar && D.gambar.latar ? 'latar' : ''));
    var atas = el('div', 'k-atas');
    atas.appendChild(tombol(ik('peta'), 'k-ikon sek', function () { if (api.berhenti) api.berhenti(); layarPeta(); }));
    atas.appendChild(el('div', 't', 'Level ' + (i + 1) + ': ' + fmt(lv.judul || namaMesin(lv.mesin))));
    atas.appendChild(el('div', null)).style.flex = '1';
    var progEl = el('div', 'k-titik'); atas.appendChild(progEl);
    var statEl = el('div', 'k-pil', ''); statEl.style.display = 'none'; atas.appendChild(statEl);
    var skorEl = el('div', 'k-pil', '0'); skorEl.style.display = 'none'; atas.appendChild(skorEl);
    if (TIM) atas.appendChild(papanTim());
    if (Bacakan.bisa) {
      var bdg = tombol(ik('suara'), 'k-ikon sek', function () { Bacakan.baca(teksLayarLevel(ruang, balon)); });
      bdg.title = 'Dengarkan'; atas.appendChild(bdg);
    }
    w.appendChild(atas);

    var ruang = el('div', 'k-ruang'); w.appendChild(ruang);
    var bawah = el('div', 'k-bawah');
    var mas = el('div', 'k-mas');
    if (D.maskot && D.maskot.gambar) mas.appendChild(gambar(D.maskot.gambar, D.maskot.nama || 'Maskot'));
    else mas.appendChild(el('div', 'k-fb', ik('wajah'))).style.cssText = 'width:76px;height:76px;border-radius:50%;font-size:40px';
    bawah.appendChild(mas);
    var balon = el('div', 'k-balon'); bawah.appendChild(balon);
    balon.addEventListener('click', function () { Bacakan.baca(balon.textContent); });
    var aksi = el('div', 'k-aksi'); bawah.appendChild(aksi);
    w.appendChild(bawah);
    layar(w);

    var keliru = 0, selesai = false;
    var api = {
      lv: lv, area: ruang, acak: acak, el: el, fmt: fmt, esc: esc, gambar: gambar, isiKartu: isiKartu, suara: Suara,
      skala: function () { return SKALA; },
      bicara: function (t, suasana) {
        balon.className = 'k-balon' + (suasana === 'ok' ? ' ok' : suasana === 'no' ? ' no' : '');
        balon.innerHTML = fmt(t);
        mas.classList.remove('lompat', 'goyang'); void mas.offsetWidth;
        if (suasana === 'ok') mas.classList.add('lompat');
        if (suasana === 'no') mas.classList.add('goyang');
        if (Bacakan.otomatis()) Bacakan.baca(balon.textContent);
      },
      benar: function (t) { Suara.benar(); getar(25); api.bicara(t || acak(PUJI)[0], 'ok'); gantiGiliran(true); },
      salah: function (t) { keliru++; Suara.salah(); getar([70, 50, 70]); api.bicara(t || 'Belum tepat. Coba lagi, ya!', 'no'); gantiGiliran(false); },
      giliran: function () { gantiGiliran(false); },
      aksi: function (teks, fn, kelas) { var b = tombol(teks, kelas || '', fn); aksi.appendChild(b); return b; },
      bersihAksi: function () { aksi.innerHTML = ''; },
      progres: function (n, total) {
        progEl.innerHTML = '';
        for (var k = 0; k < total; k++) progEl.appendChild(el('i', k < n ? 'on' : ''));
      },
      nyawa: function (n, maks) {
        statEl.style.display = '';
        var hh = ''; for (var q = 0; q < (maks || 3); q++) hh += ikHati(q < n); statEl.innerHTML = hh;
      },
      skor: function (t) { skorEl.style.display = ''; skorEl.innerHTML = esc(String(t)).replace(/^⭐\s*/, ikBintang(true) + ' '); },
      keliru: function () { return keliru; },
      selesai: function (opsi) {
        if (selesai) return; selesai = true;
        opsi = opsi || {};
        var b = opsi.bintang != null ? opsi.bintang : (keliru === 0 ? 3 : keliru <= 2 ? 2 : 1);
        var info = { s: keliru, d: Math.round((Date.now() - MULAI_LEVEL) / 1000) };
        tunda(opsi.jeda == null ? 900 : opsi.jeda, function () { hasilLevel(i, b, opsi.pesan, info); });
      },
      berhenti: null
    };
    api.bicara(lv.petunjuk || PETUNJUK[lv.mesin] || 'Ayo mulai!');
    try {
      MESIN[lv.mesin](lv, api);
    } catch (e) {
      tampilGalat(['Level ' + (i + 1) + ' (' + lv.mesin + ') gagal dijalankan: ' + e.message]);
      if (window.console) console.error(e);
    }
  }
  var PUJI = ['Hebat, tepat sekali!', 'Betul! Kamu teliti.', 'Mantap!', 'Tepat! Lanjutkan.', 'Wah, pintar!'];

  function hasilLevel(i, b, pesan, info) {
    BINTANG[i] = Math.max(BINTANG[i] || 0, b);
    if (b > 0 && TERBUKA < i + 2) TERBUKA = Math.min(LEVEL.length, i + 2);
    if (info && (!REKAM[i] || b >= (REKAM[i].b || 0))) { REKAM[i] = { b: b, s: info.s, d: info.d }; TERKIRIM = false; }
    simpanProgres();
    var t = el('div', 'k-tirai');
    var p = el('div', 'k-kertas k-pop');
    var gagal = b === 0;
    p.innerHTML = '<h2>' + (gagal ? 'Hampir!' : b === 3 ? 'Sempurna!' : b === 2 ? 'Bagus!' : 'Selesai!') + '</h2>' +
      '<div class="k-bintang">' + [1, 2, 3].map(function (k) {
        return '<span class="' + (k <= b ? 'on' : '') + '" style="animation-delay:' + (k * 0.22) + 's">' + ikBintang(true) + '</span>';
      }).join('') + '</div>' +
      '<p style="font-size:22px;font-weight:700;margin:6px 0 0">' + fmt(pesan || (gagal ? 'Ayo coba sekali lagi, kamu pasti bisa!' :
        b === 3 ? 'Tanpa salah sedikit pun. Luar biasa!' : 'Kamu berhasil menyelesaikan level ini.')) + '</p>';
    var a = el('div', 'aksi');
    a.appendChild(tombol(ik('ulangi') + ' Ulangi', 'sek', function () { mainLevel(i); }));
    var akhir = i === LEVEL.length - 1;
    if (!gagal) a.appendChild(tombol(akhir ? ik('piala') + ' Hasil akhir' : 'Lanjut ' + ik('lanjut'), 'k-denyut', function () {
      if (akhir) layarPenutup(); else layarPeta();
    }));
    else a.appendChild(tombol(ik('peta') + ' Peta level', '', layarPeta));
    p.appendChild(a);
    t.appendChild(p);
    PG.querySelector('.k-lay').appendChild(t);
    if (!gagal) { Suara.menang(); konfeti(b === 3 ? 180 : 110); } else Suara.salah();
  }

  function layarPenutup() {
    var P = D.penutup || {};
    var w = el('div');
    latarLayar(w, D.gambar && (D.gambar.sampul ? 'sampul' : 'latar'));
    var tot = BINTANG.reduce(function (a, b) { return a + (b || 0); }, 0);
    var kiri = el('div');
    kiri.style.cssText = 'position:absolute;left:20px;top:20px;width:32%;bottom:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#fff';
    var menang = TIM ? (TIM.skor[0] === TIM.skor[1] ? 'Seri!' : NAMA_TIM[TIM.skor[0] > TIM.skor[1] ? 0 : 1] + ' menang!') : '';
    kiri.innerHTML = '<div class="melayang" style="line-height:0;filter:drop-shadow(0 10px 12px rgba(0,0,0,.4))">' + pialaBesar() + '</div>' +
      '<div class="k-judul" style="font-size:42px;line-height:1.05;margin-top:8px">' + esc(TIM ? menang : (P.lencana || 'Juara Belajar')) + '</div>' +
      (TIM ? '<div class="k-tim besar" style="margin-top:12px">' + NAMA_TIM.map(function (n, k) {
        return '<div class="k-tim-p"><i style="background:' + WARNA_TIM[k] + '"></i>' + esc(n) + ' <b>' + TIM.skor[k] + '</b></div>'; }).join('') + '</div>' : '') +
      '<div class="k-pil" style="margin-top:12px;font-size:25px;padding:6px 18px">' + ikBintang(true) + ' ' + tot + ' / ' + (LEVEL.length * 3) + '</div>';
    w.appendChild(kiri);
    var kn = el('div', 'k-kertas');
    kn.style.cssText = 'position:absolute;right:20px;top:20px;left:calc(32% + 40px);bottom:20px;padding:20px 24px;display:flex;flex-direction:column';
    var h = '<h2 class="fd" style="margin:0 0 6px;font-size:29px;color:var(--lip)">Yang sudah kamu pelajari</h2><ul style="margin:0 0 10px;padding-left:26px;font-size:20px;line-height:1.45;overflow:auto">' +
      (P.ringkasan || []).map(function (r) { return '<li>' + fmt(r) + '</li>'; }).join('') + '</ul>';
    if (P.refleksi) h += '<div style="background:#fff;border:3px dashed var(--lip);border-radius:16px;padding:10px 14px;font-size:20px;margin-top:auto"><b>' + ik('lampu', '', 'color:var(--lip)') + ' Coba pikirkan:</b> ' + fmt(P.refleksi) + '</div>';
    kn.innerHTML = h;
    if (server() && !TIM) {
      if (TERKIRIM) {
        var sdh = el('div', 'k-form', '<div class="jd">' + ik('centang') + ' Hasilmu sudah tercatat.</div>');
        sdh.appendChild(tombol(ik('piala') + ' Lihat papan skor', 'kecil', function () { popupPapan(null, ambilSimpanan('kitmpi:murid', null)); }));
        kn.appendChild(sdh);
      } else formHasil(kn);
    }
    var a = el('div'); a.style.cssText = 'display:flex;gap:12px;justify-content:flex-end;margin-top:12px';
    a.appendChild(tombol(ik('peta') + ' Peta level', 'sek', layarPeta));
    a.appendChild(tombol(ik('ulangi') + ' Main lagi', '', function () { ulangDariAwal(); layarPeta(); }));
    kn.appendChild(a);
    w.appendChild(kn);
    layar(w);
    Suara.menang(); konfeti(200);
  }

  /* ════════════════════════════ PROGRES TERSIMPAN ════════════════════════════
     Bintang dan level terbuka disimpan di HP murid, per MPI. */
  function kunciSimpan() {
    return 'kitmpi:' + hashTeks((D.judul || '') + '|' + ((D.identitas || {}).penyusun || '') + '|' + LEVEL.length);
  }
  function simpanProgres() {
    try { localStorage.setItem(kunciSimpan(), JSON.stringify({ b: BINTANG, t: TERBUKA, r: REKAM, w: Date.now() })); } catch (e) {}
  }
  function muatProgres() {
    try {
      var s = JSON.parse(localStorage.getItem(kunciSimpan()) || 'null');
      if (s && Array.isArray(s.b)) {
        BINTANG = s.b.slice(0, LEVEL.length).map(function (x) { return Math.max(0, Math.min(3, +x || 0)); });
        TERBUKA = Math.max(1, Math.min(LEVEL.length, +s.t || 1));
        REKAM = Array.isArray(s.r) ? s.r.slice(0, LEVEL.length) : [];
      }
    } catch (e) {}
  }
  function ulangDariAwal() {
    BINTANG = []; TERBUKA = 1; REKAM = []; JL_TERAKHIR = -1; TERKIRIM = false;
    if (TIM) TIM.skor = [0, 0];
    simpanProgres();
  }

  /* ════════════════════════════ DENGARKAN (TEKS DIBACAKAN) ════════════════════════════
     Memakai suara bahasa Indonesia bawaan HP. Untuk kelas 1–2, balon maskot
     dibacakan otomatis (bisa dimatikan dengan DATA.bacakan:false). */
  var Bacakan = {
    bisa: typeof window.speechSynthesis !== 'undefined' && typeof window.SpeechSynthesisUtterance !== 'undefined',
    suara: null,
    pilih: function () {
      try {
        var v = window.speechSynthesis.getVoices() || [];
        this.suara = v.filter(function (x) { return /^id([-_]|$)/i.test(x.lang); })[0] || null;
      } catch (e) {}
    },
    baca: function (teks) {
      if (!this.bisa || !Suara.aktif) return;
      teks = String(teks || '').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
      if (!teks) return;
      try {
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(teks);
        u.lang = 'id-ID'; u.rate = 0.92;
        if (!this.suara) this.pilih();
        if (this.suara) u.voice = this.suara;
        window.speechSynthesis.speak(u);
      } catch (e) {}
    },
    diam: function () { if (this.bisa) try { window.speechSynthesis.cancel(); } catch (e) {} },
    otomatis: function () {
      if (D.bacakan === false) return false;
      if (D.bacakan === true) return true;
      return +((D.identitas || {}).kelas) > 0 && +((D.identitas || {}).kelas) <= 2;
    }
  };
  if (Bacakan.bisa) { try { window.speechSynthesis.onvoiceschanged = function () { Bacakan.pilih(); }; } catch (e) {} }
  function teksLayarLevel(ruang, balon) {
    var bagian = [];
    ['.m-cer .isi', '.m-bac .hal .tx', '.m-bac .akt .tny', '.m-isi .tny', '.m-uang .tny', '.m-run .soal', '.m-ptk .tny', '.m-jel .info'].forEach(function (s) {
      var e = ruang.querySelector(s);
      if (e && e.textContent.trim()) bagian.push(e.textContent.trim());
    });
    if (ruang.querySelector('.m-kuis')) {
      /* kuis: pecahan bertumpuk dibaca "3/4", bukan "34" */
      var teksKuis = function (e) {
        var c = e.cloneNode(true);
        Array.prototype.forEach.call(c.querySelectorAll('.fr'), function (f) { var q = f.querySelectorAll('i'); f.textContent = q[0].textContent + '/' + q[1].textContent; });
        return c.textContent.trim();
      };
      ['.m-kuis .bc', '.m-kuis .tny'].forEach(function (sl) { var e2 = ruang.querySelector(sl); if (e2) bagian.push(teksKuis(e2)); });
      var opsKuis = ruang.querySelectorAll('.m-kuis .pil .tx');
      if (opsKuis.length) bagian.push('Pilihan: ' + Array.prototype.map.call(opsKuis, teksKuis).join('. '));
    }
    if (ruang.querySelector('.m-ss')) {
      var teksTb = function (e) {
        var c = e.cloneNode(true);
        Array.prototype.forEach.call(c.querySelectorAll('.fr'), function (f) { var q = f.querySelectorAll('i'); f.textContent = q[0].textContent + '/' + q[1].textContent; });
        return c.textContent.trim();
      };
      var tq = ruang.querySelector('.m-ss .tny'); if (tq) bagian.push(teksTb(tq));
      var ps = ruang.querySelectorAll('.m-ss .ss-pil:not(.mati) .ss-teks');
      if (ps.length) bagian.push('Pilihan: ' + Array.prototype.map.call(ps, function (x) { return x.textContent; }).join('. '));
    }
    if (balon && balon.textContent.trim()) bagian.push(balon.textContent.trim());
    return bagian.join('. ');
  }

  /* ════════════════════════════ MODE TIM ════════════════════════════
     Untuk TV panel: dua tim menjawab bergantian. Setiap jawaban (benar atau
     salah) memindahkan giliran; jawaban benar menambah skor tim yang menjawab. */
  var TIM = null;
  var NAMA_TIM = ['Tim Merah', 'Tim Biru'], WARNA_TIM = ['#E5484D', '#1F8FD6'];
  function papanTim() {
    var d = el('div', 'k-tim');
    if (!TIM) return d;
    NAMA_TIM.forEach(function (n, k) {
      d.appendChild(el('div', 'k-tim-p' + (TIM.giliran === k ? ' giliran' : ''),
        '<i style="background:' + WARNA_TIM[k] + '"></i>' + esc(n) + ' <b>' + TIM.skor[k] + '</b>'));
    });
    return d;
  }
  function segarkanTim() {
    var lama = PG.querySelector('.k-tim');
    if (lama) lama.parentNode.replaceChild(papanTim(), lama);
  }
  function gantiGiliran(benar) {
    if (!TIM) return;
    if (benar) TIM.skor[TIM.giliran]++;
    TIM.giliran = 1 - TIM.giliran;
    segarkanTim();
  }

  /* ════════════════════════════ HASIL & PAPAN SKOR ════════════════════════════
     Aktif bila MPI diputar dari server KKG, yang menitipkan
     window.KIT_SERVER = { url, id, sekolah:[...] }. Tanpa itu, fitur ini diam. */
  var REKAM = [], TERKIRIM = false, MULAI_LEVEL = 0;
  function server() {
    var s = window.KIT_SERVER;
    return s && /^https:\/\//.test(s.url || '') && s.id ? s : null;
  }
  function ambilSimpanan(k, bawaan) {
    try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? bawaan : v; } catch (e) { return bawaan; }
  }
  function taruhSimpanan(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function kirimKeServer(muatan) {
    var S = server();
    return fetch(S.url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(muatan) })
      .then(function (r) { return r.json(); });
  }
  /* hasil yang gagal terkirim (offline) disimpan, dikirim lagi saat MPI dibuka */
  function kirimAntrean() {
    if (!server()) return;
    var antre = ambilSimpanan('kitmpi:antre', []);
    if (!antre.length) return;
    taruhSimpanan('kitmpi:antre', []);
    antre.forEach(function (m) {
      kirimKeServer(m).catch(function () {
        var a = ambilSimpanan('kitmpi:antre', []); a.push(m); taruhSimpanan('kitmpi:antre', a.slice(-20));
      });
    });
  }
  function tabelPapan(papan, sorot) {
    if (!papan || !papan.length) return '<p style="text-align:center;font-weight:700;opacity:.75;margin:30px 0">Belum ada yang menyelesaikan MPI ini. Jadilah yang pertama!</p>';
    return '<table class="k-papan"><tbody>' + papan.map(function (p, i) {
      var menit = Math.floor((+p.detik || 0) / 60), detik = (+p.detik || 0) % 60;
      var milik = sorot && String(p.nama).toLowerCase() === String(sorot.nama).toLowerCase() && p.sekolah === sorot.sekolah;
      return '<tr' + (milik ? ' class="milik"' : '') + '><td class="no">' + (i < 3 ? '<span class="md m' + (i + 1) + '">' + (i + 1) + '</span>' : (i + 1)) + '</td>' +
        '<td class="nm"><b>' + esc(p.nama) + '</b><small>' + esc(p.sekolah || '') + '</small></td>' +
        '<td class="bt">' + ikBintang(true) + ' ' + esc(p.bintang) + '</td>' +
        '<td class="wk">' + menit + ':' + (detik < 10 ? '0' : '') + detik + '</td></tr>';
    }).join('') + '</tbody></table>';
  }
  function popupPapan(papan, sorot) {
    var t = el('div', 'k-tirai');
    var p = el('div', 'k-kertas k-pop k-pop-papan');
    p.innerHTML = '<h2>' + ik('piala') + ' Papan Skor</h2><p class="sub">' + esc(D.judul) + '</p>';
    var isi = el('div', 'isi', papan ? tabelPapan(papan, sorot) : '<p style="text-align:center;margin:30px 0;font-weight:700">Memuat…</p>');
    p.appendChild(isi);
    var a = el('div', 'aksi');
    a.appendChild(tombol(ik('tutup') + ' Tutup', 'sek', function () { t.remove(); }));
    p.appendChild(a);
    t.appendChild(p);
    t.addEventListener('click', function (e) { if (e.target === t) t.remove(); });
    PG.querySelector('.k-lay').appendChild(t);
    if (!papan) {
      var S = server();
      fetch(S.url + (S.url.indexOf('?') < 0 ? '?' : '&') + 'aksi=papan&id=' + encodeURIComponent(S.id))
        .then(function (r) { return r.json(); })
        .then(function (j) { isi.innerHTML = tabelPapan(j.papan || []); })
        .catch(function () { isi.innerHTML = '<p style="text-align:center;margin:30px 0;font-weight:700">Papan skor belum bisa dimuat. Periksa koneksi internet.</p>'; });
    }
  }
  function formHasil(wadah) {
    var S = server();
    var ingat = ambilSimpanan('kitmpi:murid', {});
    var f = el('div', 'k-form');
    f.innerHTML = '<div class="jd">' + ik('piala') + ' Masuk papan skor</div>' +
      '<div class="baris"><input class="nm" maxlength="20" placeholder="Nama panggilanmu" autocomplete="off">' +
      '<select class="sk"><option value="">Pilih sekolah</option>' + (S.sekolah || []).map(function (s) {
        return '<option>' + esc(s) + '</option>';
      }).join('') + '<option value="Sekolah lain">Sekolah lain</option></select></div>';
    var nm = f.querySelector('.nm'), sk = f.querySelector('.sk');
    if (ingat.nama) nm.value = ingat.nama;
    if (ingat.sekolah) sk.value = ingat.sekolah;
    ['pointerdown', 'keydown'].forEach(function (ev) { nm.addEventListener(ev, function (e) { e.stopPropagation(); }); });
    var info = el('div', 'info');
    var kirim = tombol(ik('lanjut') + ' Kirim', 'kecil k-denyut', function () {
      var nama = nm.value.replace(/[^A-Za-z0-9 .'\-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 20);
      var sekolah = sk.value;
      if (nama.length < 2) { info.textContent = 'Tulis nama panggilanmu dulu, ya.'; goyang(nm); return; }
      if (!sekolah) { info.textContent = 'Pilih sekolahmu dulu.'; goyang(sk); return; }
      taruhSimpanan('kitmpi:murid', { nama: nama, sekolah: sekolah });
      var I = D.identitas || {};
      var tot = BINTANG.reduce(function (a, b) { return a + (b || 0); }, 0);
      var detik = REKAM.reduce(function (a, r) { return a + ((r && r.d) || 0); }, 0);
      var muatan = {
        aksi: 'hasil', id: S.id, judul: String(D.judul || '').slice(0, 120), guru: I.penyusun || '', sekolah_guru: I.sekolah || '',
        nama: nama, sekolah: sekolah, bintang: tot, maks: LEVEL.length * 3, detik: detik,
        rincian: REKAM.map(function (r, i) { return { level: i + 1, bintang: (r && r.b) || 0, salah: (r && r.s) || 0, detik: (r && r.d) || 0 }; })
      };
      kirim.disabled = true; info.textContent = 'Mengirim…';
      kirimKeServer(muatan).then(function (j) {
        if (!j || !j.ok) throw new Error((j && j.pesan) || 'gagal');
        TERKIRIM = true; simpanProgres();
        f.innerHTML = '<div class="jd">' + ik('centang') + ' Hasilmu sudah tercatat' + (j.peringkat ? ', peringkat ' + j.peringkat : '') + '!</div>';
        var bp = tombol(ik('piala') + ' Lihat papan skor', 'kecil', function () { popupPapan(j.papan || null, { nama: nama, sekolah: sekolah }); });
        f.appendChild(bp);
        popupPapan(j.papan || null, { nama: nama, sekolah: sekolah });
      }).catch(function () {
        var a = ambilSimpanan('kitmpi:antre', []); a.push(muatan); taruhSimpanan('kitmpi:antre', a.slice(-20));
        TERKIRIM = true; simpanProgres();
        f.innerHTML = '<div class="jd">' + ik('centang') + ' Hasilmu disimpan di HP ini</div>' +
          '<div class="info">Belum ada internet. Hasil akan terkirim otomatis saat MPI ini dibuka lagi.</div>';
      });
    });
    f.querySelector('.baris').appendChild(kirim);
    f.appendChild(info);
    wadah.appendChild(f);
  }

  /* ════════════════════════════ PANEL GURU ════════════════════════════ */
  function kunciLevel(lv) {
    var h = '';
    var ul = function (a) { return '<ul>' + a.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>'; };
    try {
      if (lv.mesin === 'cerita') {
        h = ul((lv.adegan || []).filter(function (a) { return a.pilihan; }).map(function (a) {
          var p = a.pilihan.filter(function (x) { return x.benar; })[0];
          return fmt(a.tanya || a.teks).slice(0, 140) + ' → <b>' + fmt(p ? p.teks : '-') + '</b>';
        }));
      } else if (lv.mesin === 'bacaan') {
        h = ul((lv.halaman || []).map(function (hl, i) {
          var a = hl.aktivitas;
          if (!a) return 'Halaman ' + (i + 1) + ': (tanpa aktivitas)';
          if (a.jenis === 'bukti') return 'Hal. ' + (i + 1) + ' bukti: kalimat yang memuat “' + esc(a.kunci) + '”';
          if (a.jenis === 'rumpang') return 'Hal. ' + (i + 1) + ' rumpang: ' + esc(a.kalimat).replace(/\[(.+?)\]/g, '<b>$1</b>');
          if (a.jenis === 'pilih') return 'Hal. ' + (i + 1) + ': ' + fmt(a.tanya) + ' → <b>' + fmt(a.pilihan[a.benar]) + '</b>';
          if (a.jenis === 'tebak') return 'Hal. ' + (i + 1) + ': tebakan (semua jawaban diterima)';
          return '';
        }));
      } else if (lv.mesin === 'sortir') {
        h = ul((lv.kategori || []).map(function (k, i) {
          var nm = typeof k === 'object' ? k.nama : k;
          return '<b>' + esc(nm) + ':</b> ' + (lv.kartu || []).filter(function (c) { return c.ke === i; }).map(function (c) { return esc(teksItem(c)); }).join(', ');
        }));
      } else if (lv.mesin === 'cocokkan') {
        h = ul((lv.pasangan || []).map(function (p) { return esc(teksItem(p[0])) + ' ↔ <b>' + esc(teksItem(p[1])) + '</b>'; }));
      } else if (lv.mesin === 'urutkan') {
        h = '<ol>' + (lv.urutan || []).map(function (u) { return '<li>' + esc(teksItem(u)) + '</li>'; }).join('') + '</ol>';
      } else if (lv.mesin === 'runner') {
        h = lv.soal ? ul(lv.soal.map(function (s) { return fmt(s.tanya) + ' → <b>' + esc(s.pilihan[s.benar]) + '</b>'; }))
          : '<p>Soal dibuat acak otomatis setiap permainan; kunci dihitung oleh MPI.</p>';
      } else if (lv.mesin === 'memori') {
        h = ul((lv.pasangan || []).map(function (p) { return esc(teksItem(p[0])) + ' ↔ <b>' + esc(teksItem(p[1])) + '</b>'; }));
      } else if (lv.mesin === 'isian') {
        h = lv.soal ? ul(lv.soal.map(function (s) { return fmt(s.tanya) + ' → <b>' + esc((s.depan ? s.depan + ' ' : '') + teksJawab(Array.isArray(s.jawab) ? s.jawab[0] : s.jawab) + (s.belakang ? ' ' + s.belakang : '')) + '</b>'; }))
          : '<p>Soal dibuat acak otomatis setiap permainan; kunci dihitung oleh MPI.</p>';
      } else if (lv.mesin === 'garis') {
        h = lv.soal ? ul(lv.soal.map(function (s) { return fmt(s.tanya) + ' → <b>' + esc(teksJawab(s.jawab)) + '</b>'; }))
          : '<p>Soal dibuat acak otomatis setiap permainan; kunci dihitung oleh MPI.</p>';
      } else if (lv.mesin === 'pecahan') {
        h = lv.soal ? ul(lv.soal.map(function (s) {
          var jn = s.jenis || lv.jenis || 'warnai', bg = s.bagi != null ? s.bagi : lv.bagi;
          return fmt(s.tanya) + ' → <b>' + (jn === 'baca' ? esc(String(s.pilihan[s.benar])) : esc(s.jawab + '/' + bg) + ' (warnai ' + esc(s.jawab) + ' dari ' + esc(bg) + ' bagian)') + '</b>';
        })) : '<p>Soal dibuat acak otomatis setiap permainan; kunci dihitung oleh MPI.</p>';
      } else if (lv.mesin === 'jam') {
        h = lv.soal ? ul(lv.soal.map(function (s) {
          var jn = s.jenis || lv.jenis || 'putar';
          return fmt(s.tanya) + ' → <b>' + (jn === 'baca' ? esc(String(s.pilihan[s.benar])) : esc(teksJam(s.jawab))) + '</b>';
        })) : '<p>Soal dibuat acak otomatis setiap permainan; kunci dihitung oleh MPI.</p>';
      } else if (lv.mesin === 'uang') {
        h = lv.soal ? ul(lv.soal.map(function (s) {
          return fmt(s.tanya) + ' → <b>' + (jenisUang(lv, s) === 'kembalian'
            ? 'kembalian ' + esc(rp(s.bayar - s.harga)) + ' (' + esc(rp(s.bayar)) + ' − ' + esc(rp(s.harga)) + ')'
            : esc(rp(s.target))) + ' (kombinasi pecahan apa pun yang jumlahnya pas)</b>';
        })) : '<p>Soal dibuat acak otomatis setiap permainan; kunci dihitung oleh MPI.</p>';
      } else if (lv.mesin === 'timbangan') {
        h = lv.soal ? ul(lv.soal.map(function (s) {
          var sat = satuanTim(lv, s);
          return fmt(s.tanya) + ' → <b>' + (jenisTim(lv, s) === 'cari'
            ? esc(jawabTim(s) + ' ' + sat) + ' (' + esc(s.total + ' − ' + s.tetap) + ')'
            : 'piring kanan ' + esc(jumlahTim(s.kiri) + ' ' + sat) + ' (kombinasi anak timbang apa pun yang jumlahnya pas)') + '</b>';
        })) : '<p>Soal dibuat acak otomatis setiap permainan; kunci dihitung oleh MPI.</p>';
      } else if (lv.mesin === 'petak') {
        h = lv.soal ? ul(lv.soal.map(function (s) {
          var jn = jenisPtk(lv, s), sat = satuanPtk(lv, s);
          if (jn === 'hitung') {
            var a = analisisPetak(normPetak(s.bentuk).sel);
            return fmt(s.tanya) + ' → <b>' + (ukurPtk(lv, s) === 'keliling' ? 'keliling ' + esc(a.keliling + ' ' + unitKel(sat)) : 'luas ' + esc(a.luas + ' ' + unitLuas(sat))) + '</b>';
          }
          var u = ukuranPtk(lv, s), c = contohPetak(u[0], u[1], s.luas, s.keliling), t = [];
          if (s.luas != null) t.push('luas ' + s.luas + ' ' + unitLuas(sat));
          if (s.keliling != null) t.push('keliling ' + s.keliling + ' ' + unitKel(sat));
          return fmt(s.tanya) + ' → <b>' + esc(t.join(' dan ')) + '</b> (bangun apa pun yang menyambung dan tidak berlubang' +
            (c ? '; contoh selebar ' + c.w + ' dan setinggi ' + c.h + ' petak' : '') + ')';
        })) : '<p>Soal dibuat acak otomatis setiap permainan; kunci dihitung oleh MPI.</p>';
      } else if (lv.mesin === 'kuis') {
        h = lv.soal ? ul(lv.soal.map(function (s) {
          var jn = kuisJenis(lv, s), bs = kuisBenar(jn, s).slice().sort(function (a, b) { return a - b; });
          return fmt(s.tanya) + ' → <b>' + bs.map(function (k) { return esc(kuisTeks(s.pilihan[k])); }).join('; ') + '</b>' +
            (jn === 'jamak' ? ' (pilih semua yang benar)' : '');
        })) : '<p>Soal dibuat acak otomatis setiap permainan; kunci dihitung oleh MPI.</p>';
      } else if (famSasaran(lv.mesin)) {
        h = lv.soal ? ul(lv.soal.map(function (s) {
          return fmt(s.tanya) + ' → <b>' + esc(kuisTeks(s.pilihan[s.benar])) + '</b>';
        })) : '<p>Soal dibuat acak otomatis setiap permainan; kunci dihitung oleh MPI.</p>';
      } else if (lv.mesin === 'rakit') {
        h = ul((lv.soal || []).map(function (s) {
          return fmt(s.tanya) + ' → <b>' + esc(String(s.jawab).toLowerCase()) + '</b>' +
            (rakit_jenis(lv, s) === 'suku' && Array.isArray(s.suku) ? ' (' + esc(s.suku.join('-')) + ')' : '');
        }));
      } else if (lv.mesin === 'huruf') {
        h = ul((lv.soal || []).map(function (s) {
          return fmt(s.tanya) + ' → <b>' + esc(String(s.jawab).trim().toUpperCase()) + '</b>';
        }));
      } else if (lv.mesin === 'rangkai') {
        h = lv.soal ? ul(lv.soal.map(function (s) {
          return fmt(s.tanya) + ' → <b>' + esc(s.jawab) + '</b>';
        })) : '';
      } else if (lv.mesin === 'jelajah') {
        h = ul((lv.titik || []).map(function (t, i) { return (i + 1) + '. <b>' + esc(t.nama) + '</b>: ' + fmt(t.info || ''); }));
      } else if (lv.mesin === 'labeli') {
        h = ul((lv.pasangan || []).map(function (p) {
          var g = p[0] && typeof p[0] === 'object' ? p[0].gambar : p[0], nm = p[1] && typeof p[1] === 'object' ? p[1].teks : p[1];
          return 'gambar “' + esc(g) + '” ↔ <b>' + esc(nm) + '</b>';
        }));
      }
    } catch (e) { h = '<p>(kunci tidak bisa disusun otomatis)</p>'; }
    return h;
  }

  function panelGuru() {
    var G = D.guru || {}, I = D.identitas || {};
    var t = el('div', 'k-tirai');
    var p = el('div', 'k-kertas k-gp');
    p.innerHTML = '<div style="display:flex;align-items:center;gap:14px"><h2 class="fd" style="margin:0;font-size:32px;color:var(--lip);flex:1">' + ik('kunci') + ' Info Guru</h2></div>';
    var tutup = tombol(ik('tutup') + ' Tutup', 'kecil sek', function () { t.remove(); });
    p.firstChild.appendChild(tutup);
    var tab = el('div', 'k-tab'), isi = el('div', 'k-gisi');
    var bagian = {
      'Rencana': '<h4>Identitas</h4><p>' + esc([I.mapel, I.kelas ? 'Kelas ' + I.kelas : '', I.materi].filter(Boolean).join(' • ')) +
        (I.penyusun ? '<br>Penyusun: ' + esc(I.penyusun) + (I.sekolah ? ', ' + esc(I.sekolah) : '') : '') + '</p>' +
        (G.tujuan ? '<h4>Tujuan pembelajaran</h4><p>' + fmt(G.tujuan) + '</p>' : '') +
        (G.durasi ? '<h4>Durasi</h4><p>' + fmt(G.durasi) + '</p>' : '') +
        (G.langkah && G.langkah.length ? '<h4>Langkah penggunaan di kelas</h4><ol>' + G.langkah.map(function (l) { return '<li>' + fmt(l) + '</li>'; }).join('') + '</ol>' : '') +
        (G.catatan ? '<h4>Catatan</h4><p>' + fmt(G.catatan) + '</p>' : ''),
      'Kunci jawaban': LEVEL.map(function (lv, i) {
        return '<h4>Level ' + (i + 1) + ': ' + fmt(lv.judul || namaMesin(lv.mesin)) + '</h4>' + kunciLevel(lv);
      }).join(''),
      'Buka semua level': '<p>Untuk demonstrasi di kelas, guru dapat membuka semua level tanpa harus menyelesaikan level sebelumnya.</p>',
      'Mode tim': '<p>Untuk dimainkan bersama di TV panel. Kelas dibagi menjadi <b>Tim Merah</b> dan <b>Tim Biru</b> yang menjawab bergantian. ' +
        'Setiap jawaban memindahkan giliran, dan jawaban benar menambah skor tim yang sedang menjawab. Skor tampil di bilah atas.</p>'
    };
    Object.keys(bagian).forEach(function (k, n) {
      var b = el('button', n === 0 ? 'on' : '', esc(k)); b.type = 'button';
      b.addEventListener('click', function () {
        tab.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on'); isi.innerHTML = bagian[k];
        if (k === 'Buka semua level') {
          isi.appendChild(tombol(MODE_GURU ? ik('gembok') + ' Kunci kembali' : ik('gembokBuka') + ' Buka semua level', '', function () {
            MODE_GURU = !MODE_GURU; t.remove(); layarPeta();
          }));
        }
        if (k === 'Mode tim') {
          isi.appendChild(tombol(TIM ? ik('tutup') + ' Matikan mode tim' : ik('bendera') + ' Mulai mode tim', '', function () {
            TIM = TIM ? null : { skor: [0, 0], giliran: 0 }; t.remove(); layarPeta();
          }));
        }
      });
      tab.appendChild(b);
    });
    isi.innerHTML = bagian.Rencana;
    p.appendChild(tab); p.appendChild(isi);
    t.appendChild(p);
    t.addEventListener('click', function (e) { if (e.target === t) t.remove(); });
    PG.querySelector('.k-lay').appendChild(t);
  }

  /* ════════════════════════════ SERET / KETUK ════════════════════════════
     Kartu bisa diseret ke sasaran, atau diketuk lalu ketuk sasarannya.
     opsi.sasaran() → daftar elemen sasaran; opsi.taruh(kartu, sasaran) */
  function buatSeret(api, opsi) {
    var terpilih = null;
    function sasaranDi(x, y) {
      var s = opsi.sasaran();
      for (var i = 0; i < s.length; i++) {
        var r = s[i].getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return s[i];
      }
      return null;
    }
    function lepasPilih() { if (terpilih) terpilih.classList.remove('pilih'); terpilih = null; }
    function sorot(t) {
      opsi.sasaran().forEach(function (s) { s.classList.toggle('siap', s === t); });
    }
    return {
      kartu: function (k) {
        k.addEventListener('pointerdown', function (e) {
          if (k.dataset.kunci) return;
          e.preventDefault();
          var x0 = e.clientX, y0 = e.clientY, gerak = false, id = e.pointerId;
          try { k.setPointerCapture(id); } catch (er) {}
          function mv(ev) {
            var dx = (ev.clientX - x0) / SKALA, dy = (ev.clientY - y0) / SKALA;
            if (!gerak && Math.abs(dx) + Math.abs(dy) > 8) { gerak = true; k.classList.add('seret'); lepasPilih(); }
            if (gerak) { k.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(2deg)'; sorot(sasaranDi(ev.clientX, ev.clientY)); }
          }
          function up(ev) {
            k.removeEventListener('pointermove', mv); k.removeEventListener('pointerup', up); k.removeEventListener('pointercancel', up);
            sorot(null);
            if (gerak) {
              k.classList.remove('seret'); k.style.transform = '';
              var s = sasaranDi(ev.clientX, ev.clientY);
              if (s) opsi.taruh(k, s);
            } else {
              Suara.klik();
              if (opsi.ketuk && opsi.ketuk(k)) { lepasPilih(); return; }
              if (terpilih === k) lepasPilih();
              else { lepasPilih(); terpilih = k; k.classList.add('pilih'); }
            }
          }
          k.addEventListener('pointermove', mv); k.addEventListener('pointerup', up); k.addEventListener('pointercancel', up);
        });
      },
      sasaran: function (s) {
        s.addEventListener('click', function (e) {
          if (!terpilih || e.target.closest('.k-kartu') === terpilih) return;
          var k = terpilih; lepasPilih(); opsi.taruh(k, s);
        });
      },
      batal: lepasPilih
    };
  }
  function goyang(e) { e.classList.remove('goyang'); void e.offsetWidth; e.classList.add('goyang'); }

  /* ════════════════════════════ MESIN ════════════════════════════ */
  var MESIN = {};

  /* 1. CERITA — adegan berurutan, sebagian berisi pilihan */
  MESIN.cerita = function (lv, api) {
    var ad = lv.adegan, i = 0;
    var w = el('div', 'm-cer');
    var jend = el('div', 'jendela'); w.appendChild(jend);
    var tk = el('div', 'k-kertas teks'); w.appendChild(tk);
    var isi = el('div', 'isi'); tk.appendChild(isi);
    var pil = el('div', 'pil'); tk.appendChild(pil);
    api.area.appendChild(w);
    function tampil() {
      var a = ad[i];
      api.progres(i, ad.length);
      jend.innerHTML = '';
      jend.appendChild(gambar(a.gambar || lv.gambar || (D.gambar && D.gambar.latar ? 'latar' : ''), a.nama || 'Ilustrasi cerita'));
      isi.innerHTML = (a.nama ? '<div class="nm">' + esc(a.nama) + '</div>' : '') + fmt(a.teks);
      if (a.tanya) isi.innerHTML += '<p style="font-weight:800;margin:8px 0 0">' + fmt(a.tanya) + '</p>';
      pil.innerHTML = ''; api.bersihAksi();
      if (a.pilihan && a.pilihan.length) {
        api.bicara(a.petunjuk || 'Pilih jawaban yang tepat.');
        acak(a.pilihan).forEach(function (p) {
          var b = tombol(fmt(p.teks), 'sek', function () {
            if (p.benar) {
              b.style.background = '#BFF0CF'; b.style.borderColor = '#1E8B4A';
              pil.querySelectorAll('button').forEach(function (x) { x.disabled = x !== b; });
              api.benar(p.tanggapan);
              api.aksi(i < ad.length - 1 ? 'Lanjut ' + ik('lanjut') : 'Selesai ' + ik('centang'), function () { maju(); });
            } else {
              b.disabled = true; goyang(b);
              api.salah(p.tanggapan);
            }
          });
          pil.appendChild(b);
        });
      } else {
        if (i > 0) api.bicara(a.komentar || 'Lanjutkan ceritanya.');
        api.aksi(i < ad.length - 1 ? 'Lanjut ' + ik('lanjut') : 'Selesai ' + ik('centang'), maju);
      }
    }
    function maju() { i++; if (i >= ad.length) { api.progres(ad.length, ad.length); api.selesai(); } else tampil(); }
    tampil();
  };

  /* ── bacaan gaya buku (gaya:'buku') ──────────────────────────────────
     Membungkus tampilan MESIN.bacaan menjadi buku cerita terbuka. Logika
     aktivitas, glosarium, penguncian tebak, bukti, dan progres tetap milik
     MESIN.bacaan (tidak disalin); fungsi di bawah hanya menata wadah, mengisi
     halaman kiri (gambar), dan menganimasikan perpindahan halaman. */
  var bukuLambat = false, bukuTerukur = false;   /* bukuLambat: HP terukur lambat pada flip pertama → seterusnya fade */

  /* true bila animasi besar harus diganti memudar (fade) */
  function bukuGerakKurang(lv) {
    if (lv.animasi === false || bukuLambat) return true;
    try { if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true; } catch (e) {}
    return typeof Element.prototype.animate !== 'function';
  }

  /* ukur durasi antar-frame selama animasi a (hanya sekali, pada flip pertama);
     rata-rata > 50 ms → bukuLambat = true */
  function bukuUkur(a) {
    if (bukuTerukur || !window.requestAnimationFrame) return;
    bukuTerukur = true;
    var prev = 0, jum = 0, n = 0, usai = false;
    a.addEventListener('finish', function () { usai = true; });
    window.requestAnimationFrame(function tik(t) {
      if (prev) { jum += t - prev; n++; }
      prev = t;
      if (!usai) window.requestAnimationFrame(tik);
      else if (n >= 3 && jum / n > 50) bukuLambat = true;
    });
  }

  /* menyusun rangka buku di dalam w; kiri (judul+teks) dan kanan (aktivitas)
     milik MESIN.bacaan dipindah ke halaman kanan */
  function bukuRakit(w, kiri, kanan) {
    w.classList.add('m-buku');
    var buku = el('div', 'bk-buku');
    var hk = el('div', 'bk-hal bk-kiri');
    var hn = el('div', 'bk-hal bk-kanan');
    var no = el('div', 'bk-no');
    hn.appendChild(kiri); hn.appendChild(kanan);
    hn.appendChild(el('div', 'bk-pita')); hn.appendChild(no);
    buku.appendChild(hk); buku.appendChild(hn); buku.appendChild(el('div', 'bk-lipat'));
    w.appendChild(buku);
    /* penanda gulir: bila teks halaman lebih panjang dari ruangnya, tampil panah kecil */
    var tandai = function () {
      var tx = kiri.querySelector('.tx');
      kiri.classList.toggle('gulir', !!tx && tx.scrollHeight > tx.clientHeight + 3 && tx.scrollTop + tx.clientHeight < tx.scrollHeight - 3);
    };
    kiri.addEventListener('scroll', tandai, true);
    if (window.MutationObserver) new MutationObserver(function () { setTimeout(tandai, 0); }).observe(kiri, { childList: true, subtree: true });
    return { w: w, buku: buku, hk: hk, hn: hn, kn: kanan, no: no, sibuk: false };
  }

  /* mengisi halaman kiri (gambar besar atau grid 2–4 gambar) dan nomor halaman */
  function bukuHalaman(bk, h, i, total, api) {
    var g = h.gambar, hk = bk.hk;
    hk.innerHTML = '';
    if (h.adegan) {
      var fa = el('div', 'bk-bingkai bk-adegan'); adegan(fa, h.adegan, api); hk.appendChild(fa);
    } else if (Array.isArray(g)) {
      var nama = Array.isArray(h.namaGambar) ? h.namaGambar : [];
      var grid = el('div', 'bk-grid n' + g.length);
      g.forEach(function (x, k) {
        var fig = el('figure', 'bk-fig');
        var fr = el('div', 'bk-bingkai');
        fr.appendChild(gambar(x, nama[k] || ('Gambar ' + (k + 1))));
        fig.appendChild(fr);
        if (nama[k]) fig.appendChild(el('figcaption', null, fmt(nama[k])));
        grid.appendChild(fig);
      });
      hk.appendChild(grid);
    } else if (g) {
      var fr1 = el('div', 'bk-bingkai'); fr1.appendChild(gambar(g, 'Ilustrasi')); hk.appendChild(fr1);
    } else {
      hk.appendChild(el('div', 'bk-kosong', ik('buku')));
    }
    bk.no.textContent = String(i + 1);
    bk.kn.classList.toggle('tanpa', !h.aktivitas);
  }

  /* pindah halaman. ganti() = render halaman berikutnya milik MESIN.bacaan.
     Halaman baru langsung dirender di bawah, lalu lembar lama (salinan) dibalik
     atau dipudarkan di atasnya. Hanya transform dan opacity yang dianimasikan. */
  function bukuBalik(bk, lv, ganti) {
    var fade = bukuGerakKurang(lv);
    if (bk.sibuk || (fade && typeof Element.prototype.animate !== 'function')) { ganti(); return; }
    var lamaSemua = fade ? bk.buku.cloneNode(true) : null;
    var lamaKiri = fade ? null : bk.hk.cloneNode(true);
    var lamaKanan = fade ? null : bk.hn.cloneNode(true);
    ganti();
    var tirai = el('div', 'bk-tirai' + (fade ? ' fade' : ''));
    bk.buku.appendChild(tirai); bk.sibuk = true;
    var usai = function () { if (tirai.parentNode) tirai.parentNode.removeChild(tirai); bk.sibuk = false; };
    if (fade) {
      tirai.appendChild(lamaSemua);
      var f = tirai.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 280, easing: 'ease-out', fill: 'forwards' });
      f.addEventListener('finish', usai);
      return;
    }
    var lama = el('div', 'bk-lama'); lama.appendChild(lamaKiri);
    var daun = el('div', 'bk-daun');
    var muka = el('div', 'bk-muka'); muka.appendChild(lamaKanan);
    var balik = el('div', 'bk-balik'); balik.appendChild(bk.hk.cloneNode(true));
    daun.appendChild(muka); daun.appendChild(balik);
    var bayang = el('div', 'bk-bayang');
    tirai.appendChild(lama); tirai.appendChild(bayang); tirai.appendChild(daun);
    var a = daun.animate([{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(-180deg)' }], { duration: 600, easing: 'ease-in-out', fill: 'forwards' });
    bayang.animate([{ opacity: 0.55 }, { opacity: 0 }], { duration: 600, easing: 'ease-in', fill: 'forwards' });
    a.addEventListener('finish', usai);
    bukuUkur(a);
  }

  /* sampul: tampil dulu, "Buka buku" merender halaman 1 lalu sampul dibuka */
  function bukuSampul(bk, lv, api, mulai) {
    var S = lv.sampul || {};
    bk.buku.style.visibility = 'hidden';
    api.progres(0, lv.halaman.length);
    api.bicara('Ayo buka bukunya dan baca ceritanya!');
    var tirai = el('div', 'bk-tirai bk-tsampul'), sp = el('div', 'bk-sampul');
    var gk = S.gambar || ((D.gambar && D.gambar.sampul) ? 'sampul' : '');
    if (gk) { var fr = el('div', 'bk-sgb'); fr.appendChild(gambar(gk, 'Sampul')); sp.appendChild(fr); }
    var sj = el('div', 'bk-sjd'); sj.appendChild(el('h2', 'k-judul', fmt(S.judul || lv.judul || 'Bacaan'))); sp.appendChild(sj);
    if (D.maskot && D.maskot.gambar) { var m = el('div', 'bk-smas'); m.appendChild(gambar(D.maskot.gambar, D.maskot.nama || 'Maskot')); sp.appendChild(m); }
    tirai.appendChild(sp); bk.w.appendChild(tirai);
    var dibuka = false;
    function buka() {
      if (dibuka) return; dibuka = true;
      bk.buku.style.visibility = '';
      mulai();
      api.bicara(lv.petunjuk || PETUNJUK.bacaan);
      var usai = function () { if (tirai.parentNode) tirai.parentNode.removeChild(tirai); };
      if (typeof sp.animate !== 'function') { usai(); return; }
      var a;
      if (bukuGerakKurang(lv)) a = sp.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 280, fill: 'forwards' });
      else { a = sp.animate([{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(-180deg)' }], { duration: 700, easing: 'ease-in-out', fill: 'forwards' }); bukuUkur(a); }
      a.addEventListener('finish', usai);
    }
    sp.addEventListener('click', buka);
    api.aksi('Buka buku ' + ik('lanjut'), buka, 'k-denyut');
  }

  /* ── ADEGAN: ilustrasi buku cerita dari latar + objek + maskot ── */
  var ADEGAN_POSISI = ['kiri', 'tengah', 'kanan'];
  var ADEGAN_MASKOT = ['biasa', 'senang', 'berpikir'];
  function adeganMaskotSrc(pose) {
    var m = D && D.maskot;
    if (!m) return '';
    var p = pose && pose !== 'biasa' && m.pose && typeof m.pose[pose] === 'string' && m.pose[pose] ? m.pose[pose] : '';
    return src(p) || src(m.gambar) || '';
  }
  /* letak tengah tiap objek (persen lebar), dijepit agar tidak terpotong; sisi = 'kiri'|'kanan'|'' (sisi maskot dikosongkan) */
  function adeganLetak(objek, lebar, sisi) {
    var n = objek.length, peta = { kiri: 20, tengah: 50, kanan: 80 }, k;
    var lo = lebar / 2 + 2, hi = 100 - lo;
    if (sisi === 'kiri') lo = Math.max(lo, 27 + lebar / 2);
    if (sisi === 'kanan') hi = Math.min(hi, 73 - lebar / 2);
    if (hi < lo) hi = lo;
    var pos = [];
    for (k = 0; k < n; k++) pos.push(n === 1 ? (lo + hi) / 2 : lo + (hi - lo) * k / (n - 1));
    if (objek.some(function (o) { return o.posisi; })) {
      for (k = 0; k < n; k++) if (objek[k].posisi) pos[k] = peta[objek[k].posisi];
      if (n > 1) {
        var idx = pos.map(function (q, i) { return i; }).sort(function (x, y) { return pos[x] - pos[y]; });
        var jarak = Math.min(lebar + 1, (hi - lo) / (n - 1));
        for (k = 1; k < n; k++) if (pos[idx[k]] - pos[idx[k - 1]] < jarak) pos[idx[k]] = pos[idx[k - 1]] + jarak;
      }
      for (k = 0; k < n; k++) pos[k] = Math.max(lebar / 2 + 2, Math.min(100 - lebar / 2 - 2, pos[k]));
    }
    return pos;
  }
  function adegan(wadah, spek, api) {
    spek = spek || {};
    var objek = Array.isArray(spek.objek) ? spek.objek.slice(0, 5) : [];
    wadah.innerHTML = '';
    var kotak = el('div', 'm-adegan');
    wadah.appendChild(kotak);
    var pola = el('div', 'm-adegan-pola' + (VARIAN.pola ? ' p' + VARIAN.pola : ''));
    kotak.appendChild(pola);
    var uL = src(spek.latar);
    if (uL) {
      var li = new Image(); li.alt = ''; li.className = 'm-adegan-latar';
      li.onerror = function () { if (li.parentNode) li.parentNode.removeChild(li); };
      li.src = uL; kotak.appendChild(li);
    }
    kotak.appendChild(el('div', 'm-adegan-gradb'));
    var n = objek.length;
    var lebar = n === 1 ? 46 : n === 2 ? 34 : n === 3 ? 28 : n === 4 ? 23 : 19;
    var tinggi = n === 1 ? 62 : n <= 3 ? 52 : 46;
    var tampil = [];
    var maskotPose = spek.maskot === false || spek.maskot == null ? null : spek.maskot;
    var gm = maskotPose ? adeganMaskotSrc(maskotPose) : '';
    var rata = adeganLetak(objek, lebar, '').reduce(function (s, q) { return s + q; }, 0) / (n || 1);
    var sisi = gm ? (rata > 50 ? 'kiri' : 'kanan') : '';
    if (gm) lebar = Math.round(lebar * 0.86);
    var pos = adeganLetak(objek, lebar, sisi);
    if (gm) {
      var mw = el('div', 'm-adegan-maskot ' + sisi);
      var mi = new Image(); mi.alt = '';
      mi.onerror = function () { if (mw.parentNode) mw.parentNode.removeChild(mw); };
      mi.src = gm; mw.appendChild(mi); kotak.appendChild(mw);
    }
    objek.forEach(function (o, k) {
      var w = el('div', 'm-adegan-obj');
      w.setAttribute('role', 'button'); w.tabIndex = 0;
      w.style.left = pos[k] + '%'; w.style.width = lebar + '%'; w.style.height = tinggi + '%';
      w.style.animationDelay = (k * 120) + 'ms';
      w.setAttribute('aria-label', o.nama);
      w.appendChild(el('div', 'm-adegan-bayang'));
      var gb = el('div', 'm-adegan-gb');
      var im = new Image(); im.alt = o.nama; im.draggable = false;
      im.onerror = function () {
        var f = el('div', 'k-fb', esc(o.nama));
        if (im.parentNode) im.parentNode.replaceChild(f, im);
        chip.style.display = 'none';
      };
      im.src = src(o.gambar);
      gb.appendChild(im); w.appendChild(gb);
      var chip = el('div', 'm-adegan-nama', esc(o.nama)); w.appendChild(chip);
      w.addEventListener('click', function (e) {
        e.stopPropagation();
        Suara.klik();
        w.classList.remove('sentuh'); void w.offsetWidth; w.classList.add('sentuh');
        if (api && typeof api.bicara === 'function') api.bicara(o.nama);
      });
      w.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); w.click(); } });
      kotak.appendChild(w); tampil.push(w);
    });
    return kotak;
  }

  /* 2. BACAAN — halaman buku + glosarium + satu aktivitas per halaman */
  MESIN.bacaan = function (lv, api) {
    var hal = lv.halaman, i = 0;
    var glos = lv.glosarium || D.glosarium || {};
    var BK = lv.gaya === 'buku';
    var w = el('div', 'm-bac');
    var kiri = el('div', 'k-kertas hal'); w.appendChild(kiri);
    var kanan = el('div', 'kn'); w.appendChild(kanan);
    var bk = BK ? bukuRakit(w, kiri, kanan) : null;
    api.area.appendChild(w);
    var pop = null;
    function tutupPop() { if (pop) { pop.remove(); pop = null; } }
    api.area.addEventListener('click', function (e) { if (!e.target.closest('.glos') && !e.target.closest('.k-glpop')) tutupPop(); });

    function kalimat(teks) {
      return String(teks).split(/\n+/).map(function (par) {
        return (par.match(/[^.!?]+[.!?]*["”']?\s*/g) || [par]).map(function (s) { return s; });
      });
    }
    function tandaiGlosarium(html) {
      Object.keys(glos).forEach(function (kata) {
        var re = new RegExp('(^|[^\\wÀ-ÿ])(' + kata.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(?=[^\\wÀ-ÿ]|$)', 'i');
        html = html.replace(re, function (m, a, b) { return a + '<span class="glos" data-k="' + esc(kata) + '">' + b + '</span>'; });
      });
      return html;
    }
    function render() {
      var h = hal[i]; tutupPop();
      api.progres(i + 1, hal.length);
      kiri.innerHTML = ''; kanan.innerHTML = ''; api.bersihAksi();
      kiri.appendChild(el('h3', null, fmt(h.judul || (lv.judul || 'Bacaan'))));
      var tx = el('div', 'tx'); kiri.appendChild(tx);
      var a = h.aktivitas;
      var terkunci = a && a.jenis === 'tebak';
      var kal = kalimat(h.teks || '');
      function tulisTeks(bisaKlik) {
        var n = 0;
        tx.innerHTML = kal.map(function (par) {
          return '<p>' + par.map(function (s) {
            return '<span class="kal' + (bisaKlik ? ' bisa' : '') + '" data-n="' + (n++) + '">' + tandaiGlosarium(fmt(s)) + '</span>';
          }).join('') + '</p>';
        }).join('');
        tx.querySelectorAll('.glos').forEach(function (g) {
          g.addEventListener('click', function (e) {
            e.stopPropagation(); tutupPop(); Suara.klik();
            var k = g.dataset.k, arti = glos[k] || glos[k.toLowerCase()];
            pop = el('div', 'k-kertas k-glpop', '<b class="fd" style="font-size:21px;color:var(--lip)">' + esc(k) + '</b><br>' + fmt(typeof arti === 'object' ? arti.arti : arti) +
              (arti && arti.contoh ? '<br><i>Contoh: ' + fmt(arti.contoh) + '</i>' : ''));
            var r = g.getBoundingClientRect(), ra = api.area.getBoundingClientRect();
            pop.style.left = Math.min(Math.max(0, (r.left - ra.left) / SKALA - 40), W - 380) + 'px';
            var atas = (r.bottom - ra.top) / SKALA + 8;
            if (atas > H - 58 - 92 - 120) atas = (r.top - ra.top) / SKALA - 130;
            pop.style.top = atas + 'px';
            api.area.appendChild(pop);
          });
        });
      }
      if (BK) bukuHalaman(bk, h, i, hal.length, api);
      else if (h.adegan) {
        var il = el('div', 'ilus ilus-adegan'); adegan(il, h.adegan, api); kanan.appendChild(il);
      } else if (h.gambar) {
        var il = el('div', 'ilus'); il.appendChild(gambar(h.gambar, 'Ilustrasi')); kanan.appendChild(il);
      }
      var akt = el('div', 'k-kertas akt'); kanan.appendChild(akt);
      var lanjut = api.aksi(i < hal.length - 1 ? 'Halaman berikutnya ' + ik('lanjut') : 'Selesai ' + ik('centang'), function () {
        i++; if (i >= hal.length) api.selesai(); else if (BK) bukuBalik(bk, lv, render); else render();
      });
      function bolehLanjut() { lanjut.disabled = false; lanjut.classList.add('k-denyut'); }
      lanjut.disabled = !!a;

      if (terkunci) {
        tx.innerHTML = '<div class="kunci"><div class="gb">' + ik('gembok') + '</div>Bacaan ini masih terkunci.<br>Tebak dulu isinya!</div>';
        akt.innerHTML = '<div class="tny">' + ik('tanya') + ' ' + fmt(a.tanya) + '</div>';
        var o = el('div', 'opsi'); akt.appendChild(o);
        api.bicara('Tebak dulu! Semua tebakan boleh, nanti kita cek di bacaan.');
        a.pilihan.forEach(function (p) {
          o.appendChild(tombol(fmt(p), 'sek', function () {
            Suara.benar(); tulisTeks(false);
            akt.innerHTML = '<div class="tny">Tebakanmu: <b>' + fmt(p) + '</b></div><p style="margin:0">' + fmt(a.ulasan || 'Sekarang baca, lalu cocokkan dengan tebakanmu.') + '</p>';
            api.bicara('Bacaan terbuka! Bandingkan dengan tebakanmu.', 'ok');
            bolehLanjut();
          }));
        });
        return;
      }
      tulisTeks(a && a.jenis === 'bukti');
      if (!a) { akt.innerHTML = '<p style="margin:0;font-weight:700">Baca dengan teliti, lalu tekan halaman berikutnya.</p>'; return; }

      if (a.jenis === 'bukti') {
        akt.innerHTML = '<div class="tny">' + ik('lup') + ' ' + fmt(a.tanya) + '</div><p style="margin:0;opacity:.8">Sentuh kalimat di bacaan yang menjadi buktinya.</p>';
        api.bicara('Cari buktinya di bacaan, lalu sentuh kalimatnya.');
        var beres = false;
        tx.querySelectorAll('.kal').forEach(function (s) {
          s.addEventListener('click', function (e) {
            if (beres || e.target.closest('.glos')) return;
            if (s.textContent.toLowerCase().indexOf(String(a.kunci).toLowerCase()) >= 0) {
              beres = true; s.classList.add('betul');
              tx.querySelectorAll('.kal').forEach(function (x) { x.classList.remove('bisa'); });
              api.benar(a.ulasan); bolehLanjut();
            } else {
              s.classList.add('keliru'); setTimeout(function () { s.classList.remove('keliru'); }, 900);
              api.salah(a.petunjuk || 'Kalimat itu belum menjawab pertanyaannya. Baca lagi pelan-pelan.');
            }
          });
        });
      } else if (a.jenis === 'pilih') {
        akt.innerHTML = '<div class="tny">' + fmt(a.tanya) + '</div>';
        var o2 = el('div', 'opsi'); akt.appendChild(o2);
        a.pilihan.forEach(function (p, n) {
          var b = tombol(fmt(p), 'sek', function () {
            if (n === a.benar) {
              b.style.background = '#BFF0CF'; o2.querySelectorAll('button').forEach(function (x) { x.disabled = true; });
              api.benar(a.ulasan); bolehLanjut();
            } else { b.disabled = true; goyang(b); api.salah(a.petunjuk); }
          });
          o2.appendChild(b);
        });
      } else if (a.jenis === 'rumpang') {
        akt.innerHTML = '<div class="tny">' + fmt(a.tanya || 'Lengkapi kalimat dengan kata yang tepat.') + '</div>';
        var rp = el('div', 'rump'); akt.appendChild(rp);
        var jawab = [];
        rp.innerHTML = esc(a.kalimat).replace(/\[(.+?)\]/g, function (m, k) {
          jawab.push(k); return '<span class="k-slot" data-j="' + esc(k) + '"></span>';
        });
        var baki = el('div', 'baki'); akt.appendChild(baki);
        var sr = buatSeret(api, {
          sasaran: function () { return [].slice.call(rp.querySelectorAll('.k-slot')).filter(function (s) { return !s.firstChild; }); },
          taruh: function (k, s) {
            if (k.dataset.v.toLowerCase() === s.dataset.j.toLowerCase()) {
              s.appendChild(k); k.classList.add('betul'); k.dataset.kunci = 1; Suara.benar();
              if (!rp.querySelector('.k-slot:empty')) { api.benar(a.ulasan); bolehLanjut(); }
              else api.bicara('Betul! Lanjutkan.', 'ok');
            } else { goyang(k); api.salah(a.petunjuk || 'Kata itu belum cocok di sana. Cari petunjuknya di bacaan.'); }
          }
        });
        acak(jawab.concat(a.pengecoh || [])).forEach(function (v) {
          var k = el('div', 'k-kartu', esc(v)); k.dataset.v = v; baki.appendChild(k); sr.kartu(k);
        });
        rp.querySelectorAll('.k-slot').forEach(function (s) { sr.sasaran(s); });
        api.bicara('Seret kata ke kotak kosong, atau sentuh kata lalu sentuh kotaknya.');
      }
    }
    if (BK && lv.sampul) bukuSampul(bk, lv, api, render); else render();
  };

  /* 3. SORTIR — seret kartu ke kategori */
  MESIN.sortir = function (lv, api) {
    var w = el('div', 'm-sor');
    var baki = el('div', 'baki'); w.appendChild(baki);
    var waktuEl = null;
    if (lv.waktu) { waktuEl = el('div', 'waktu', '<i></i>'); w.appendChild(waktuEl); }
    var kotak = el('div', 'kotak'); w.appendChild(kotak);
    api.area.appendChild(w);
    var kat = (lv.kategori || []).map(function (k, n) {
      var obj = typeof k === 'object' ? k : { nama: k };
      var d = el('div', 'k-kertas kat k-slot');
      d.style.borderStyle = 'solid';
      var h4 = el('h4');
      if (obj.gambar) h4.appendChild(gambar(obj.gambar, ''));
      h4.appendChild(el('span', null, fmt(obj.nama)));
      d.appendChild(h4);
      d.appendChild(el('div', 'isi'));
      d.dataset.n = n;
      kotak.appendChild(d);
      return d;
    });
    var total = lv.kartu.length, beres = 0;
    api.progres(0, total);
    var sr = buatSeret(api, {
      sasaran: function () { return kat; },
      taruh: function (k, s) {
        if (+k.dataset.ke === +s.dataset.n) {
          k.classList.remove('pilih'); k.classList.add('betul'); k.dataset.kunci = 1;
          s.querySelector('.isi').appendChild(k);
          beres++; api.progres(beres, total);
          if (beres === total) { berhenti(); api.benar('Semua kartu sudah di tempat yang tepat!'); api.selesai(); }
          else api.benar(k.dataset.ul || null);
        } else {
          k.classList.add('keliru'); goyang(k);
          setTimeout(function () { k.classList.remove('keliru'); }, 700);
          api.salah(k.dataset.sal || 'Belum tepat. Pikirkan lagi kartu itu termasuk kelompok mana.');
        }
      }
    });
    acak(lv.kartu).forEach(function (c) {
      var k = isiKartu(el('div', 'k-kartu'), c);
      k.dataset.ke = c.ke;
      if (c.ulasan) k.dataset.ul = c.ulasan;
      if (c.petunjuk) k.dataset.sal = c.petunjuk;
      baki.appendChild(k); sr.kartu(k);
    });
    kat.forEach(function (s) { sr.sasaran(s); });
    var tm = null;
    function berhenti() { if (tm) cancelAnimationFrame(tm); tm = null; }
    if (lv.waktu) {
      var t0 = performance.now(), dur = lv.waktu * 1000, bar = waktuEl.firstChild;
      (function jalan(t) {
        var sisa = 1 - (t - t0) / dur;
        bar.style.transform = 'scaleX(' + Math.max(0, sisa) + ')';
        if (sisa <= 0) {
          var kurang = total - beres;
          berhenti();
          api.salah('Waktu habis! Masih ada ' + kurang + ' kartu.');
          baki.querySelectorAll('.k-kartu').forEach(function (k) { k.dataset.kunci = 1; });
          api.selesai({ bintang: kurang === 0 ? 3 : kurang <= 2 ? 2 : 1, pesan: 'Waktu habis. ' + beres + ' dari ' + total + ' kartu berhasil dikelompokkan.' });
          return;
        }
        tm = requestAnimationFrame(jalan);
      })(t0);
    }
    api.berhenti = berhenti;
  };

  /* 4. COCOKKAN — ketuk kiri lalu kanan, garis menghubungkan pasangan */
  MESIN.cocokkan = function (lv, api) {
    var w = el('div', 'm-coc');
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    w.appendChild(svg);
    var kl = el('div', 'kol'), kn = el('div', 'kol');
    w.appendChild(kl); w.appendChild(kn);
    api.area.appendChild(w);
    var ps = lv.jumlah && lv.jumlah < lv.pasangan.length ? acak(lv.pasangan).slice(0, lv.jumlah) : lv.pasangan;
    var beres = 0, pilihKiri = null;
    api.progres(0, ps.length);
    var warna = ['#E8642C', '#1FA9D6', '#5DBB2F', '#8A5CF5', '#F5A623', '#E5484D', '#2E8B57', '#FF6B9A'];
    function garis(a, b, c) {
      var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(), rw = w.getBoundingClientRect();
      var x1 = (ra.right - rw.left) / SKALA, y1 = (ra.top + ra.height / 2 - rw.top) / SKALA;
      var x2 = (rb.left - rw.left) / SKALA, y2 = (rb.top + rb.height / 2 - rw.top) / SKALA;
      var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      var mx = (x1 + x2) / 2;
      p.setAttribute('d', 'M' + x1 + ',' + y1 + ' C' + mx + ',' + y1 + ' ' + mx + ',' + y2 + ' ' + x2 + ',' + y2);
      p.setAttribute('stroke', c); p.setAttribute('stroke-width', '6'); p.setAttribute('fill', 'none'); p.setAttribute('stroke-linecap', 'round');
      svg.appendChild(p);
    }
    var kiri = ps.map(function (p, n) { var k = isiKartu(el('div', 'k-kartu'), p[0]); k.dataset.n = n; return k; });
    var kanan = ps.map(function (p, n) { var k = isiKartu(el('div', 'k-kartu'), p[1]); k.dataset.n = n; return k; });
    acak(kiri).forEach(function (k) { kl.appendChild(k); });
    acak(kanan).forEach(function (k) { kn.appendChild(k); });
    kiri.forEach(function (k) {
      k.addEventListener('click', function () {
        if (k.dataset.kunci) return; Suara.klik();
        if (pilihKiri) pilihKiri.classList.remove('pilih');
        pilihKiri = k; k.classList.add('pilih');
        api.bicara('Sekarang sentuh pasangannya di kanan.');
      });
    });
    kanan.forEach(function (k) {
      k.addEventListener('click', function () {
        if (k.dataset.kunci) return;
        if (!pilihKiri) { Suara.klik(); goyang(k); api.bicara('Pilih dulu kartu di sebelah kiri.'); return; }
        if (pilihKiri.dataset.n === k.dataset.n) {
          var c = warna[beres % warna.length];
          [pilihKiri, k].forEach(function (x) {
            x.classList.remove('pilih'); x.classList.add('betul'); x.dataset.kunci = 1;
            x.style.borderColor = c; x.style.boxShadow = '0 4px 0 ' + c;
            x.appendChild(el('div', 'tanda', ik('centang'))).style.background = c;
          });
          garis(pilihKiri, k, c);
          pilihKiri = null; beres++; api.progres(beres, ps.length);
          var ul = ps[+k.dataset.n][2];
          if (beres === ps.length) { api.benar('Semua pasangan sudah cocok!'); api.selesai(); } else api.benar(ul);
        } else {
          goyang(k); goyang(pilihKiri);
          api.salah('Itu belum pasangannya. Coba yang lain!');
        }
      });
    });
  };

  /* 5. URUTKAN — isi kotak bernomor sesuai urutan */
  MESIN.urutkan = function (lv, api) {
    var ur = lv.urutan, n = ur.length;
    var w = el('div', 'm-uru');
    var baris = el('div', 'slot-baris'); w.appendChild(baris);
    var baki = el('div', 'baki'); w.appendChild(baki);
    api.area.appendChild(w);
    var slot = [], panah = [];
    var lebar = Math.min(190, Math.floor(((api.area.clientWidth || W) - 40 - (n - 1) * 36) / n));
    ur.forEach(function (u, i) {
      if (i) { var pa = el('div', 'panah', ik('panah')); baris.appendChild(pa); panah.push(pa); }
      var s = el('div', 'k-slot'); s.style.width = lebar + 'px'; s.style.flexBasis = lebar + 'px';
      s.appendChild(el('div', 'nom', String(i + 1)));
      s.dataset.i = i; baris.appendChild(s); slot.push(s);
    });
    api.progres(0, n);
    function kosong() { return slot.filter(function (s) { return !s.querySelector('.k-kartu'); }); }
    var sr = buatSeret(api, {
      sasaran: kosong,
      taruh: function (k, s) {
        s.appendChild(k); Suara.klik();
        api.progres(n - kosong().length, n);
        if (!kosong().length) periksa.disabled = false;
      },
      /* ketuk kartu yang sudah di kotak untuk mengembalikannya ke baki */
      ketuk: function (k) {
        if (k.parentNode && k.parentNode.classList.contains('k-slot')) {
          baki.appendChild(k); periksa.disabled = true; api.progres(n - kosong().length, n); return true;
        }
        return false;
      }
    });
    slot.forEach(function (s) { sr.sasaran(s); });
    function buatKartu(u, i) {
      var k = isiKartu(el('div', 'k-kartu'), u);
      k.style.width = (lebar - 10) + 'px';
      k.dataset.i = i; sr.kartu(k);
      return k;
    }
    acak(ur.map(function (u, i) { return { u: u, i: i }; })).forEach(function (o) { baki.appendChild(buatKartu(o.u, o.i)); });
    var periksa = api.aksi(ik('centang') + ' Periksa', function () {
      var salahN = 0;
      slot.forEach(function (s) {
        var k = s.querySelector('.k-kartu');
        if (!k || k.dataset.kunci) return;
        if (+k.dataset.i === +s.dataset.i) { k.classList.add('betul'); k.dataset.kunci = 1; }
        else { salahN++; k.classList.add('keliru'); goyang(k); (function (kk) { setTimeout(function () { kk.classList.remove('keliru'); baki.appendChild(kk); }, 800); })(k); }
      });
      periksa.disabled = true;
      if (salahN) { api.salah(salahN + ' kartu belum di urutan yang tepat. Yang hijau sudah benar.'); }
      else {
        api.benar(lv.ulasan || 'Urutannya benar semua!');
        panah.forEach(function (p, i) { setTimeout(function () { p.classList.add('nyala'); Suara.koin(); }, i * 220); });
        api.selesai({ jeda: 400 + panah.length * 220 });
      }
    });
    periksa.disabled = true;
  };

  /* 6. RUNNER — lari di 3 jalur, masuk gerbang jawaban yang benar */
  MESIN.runner = function (lv, api) {
    var jumlah = lv.jumlah || (lv.soal ? lv.soal.length : 8), maksNyawa = lv.nyawa || 3, nyawa = maksNyawa;
    var bank = lv.soal ? acak(lv.soal) : null, ke = 0, benarN = 0;
    var jumlahAwal = jumlah, antreUlang = [];
    var w = el('div', 'm-run');
    var jalan = el('div', 'jalan'); w.appendChild(jalan);
    [1, 2].forEach(function (m) { var mk = el('div', 'marka'); mk.style.left = (m * 33.333) + '%'; jalan.appendChild(mk); });
    var lajur = 1;
    var pelari = el('div', 'pelari');
    var gp = D.maskot && D.maskot.gambar ? gambar(D.maskot.gambar, D.maskot.nama || 'Pelari') : el('div', 'k-fb', ik('wajah'));
    pelari.appendChild(gp); jalan.appendChild(pelari);
    var samping = el('div', 'samping'); w.appendChild(samping);
    var soalEl = el('div', 'k-kertas soal'); samping.appendChild(soalEl);
    var statEl = el('div', 'k-kertas stat'); samping.appendChild(statEl);
    var kd = el('div', 'kendali'); samping.appendChild(kd);
    api.area.appendChild(w);
    function posisi() { pelari.style.left = (lajur * 33.333 + 16.667) + '%'; }
    function geser(d) { lajur = Math.max(0, Math.min(2, lajur + d)); posisi(); Suara.klik(); }
    kd.appendChild(tombol(ik('kiri'), 'besar', function () { geser(-1); }));
    kd.appendChild(tombol(ik('lanjut'), 'besar', function () { geser(1); }));
    for (var l = 0; l < 3; l++) {
      (function (l) {
        var z = el('div', 'lajur'); z.style.left = (l * 33.333) + '%';
        z.addEventListener('pointerdown', function () { lajur = l; posisi(); });
        jalan.appendChild(z);
      })(l);
    }
    function kunci(e) {
      if (e.key === 'ArrowLeft') geser(-1);
      if (e.key === 'ArrowRight') geser(1);
    }
    document.addEventListener('keydown', kunci);
    posisi();
    api.nyawa(nyawa, maksNyawa);
    function stat() { statEl.innerHTML = '<span>' + ik('centang') + ' ' + benarN + '</span><span>' + ik('target') + ' ' + ke + '/' + jumlah + '</span>'; }
    var g = null, y = 0, cepat = lv.kecepatan || 1, soal = null, raf = null, jeda = false;
    var naik = lv.naik != null ? lv.naik : 0.12, batas = lv.batas != null ? lv.batas : 2.2;
    batas = Math.max(batas, cepat); /* pengaman: batas tidak pernah di bawah kecepatan awal */
    var yPelari = 300;
    function soalBaru() {
      yPelari = (jalan.clientHeight || 360) - 12 - 110;
      if (ke >= jumlah || nyawa <= 0) return akhir();
      soal = ke >= jumlahAwal && antreUlang.length ? antreUlang.shift() : (bank ? bank[ke % bank.length] : lv.buatSoal(ke));
      var pil = soal.pilihan.map(function (p, i) { return { p: p, b: i === soal.benar }; });
      pil = acak(pil);
      soalEl.innerHTML = fmt(soal.tanya);
      if (g) g.remove();
      g = el('div', 'gerbang');
      pil.forEach(function (o) { var d = el('div', null, esc(o.p)); d.dataset.b = o.b ? 1 : ''; g.appendChild(d); });
      jalan.appendChild(g);
      y = -90; g.style.top = y + 'px'; stat();
    }
    var tAkhir = null;
    function langkah(t) {
      if (jeda) return;
      if (tAkhir == null) tAkhir = t;
      var dt = Math.min(50, t - tAkhir); tAkhir = t;
      y += dt * 0.07 * cepat;
      g.style.top = y + 'px';
      if (y + 76 >= yPelari + 24) {
        var kot = g.children[lajur];
        jeda = true;
        if (kot.dataset.b) {
          kot.classList.add('betul'); benarN++; cepat = Math.min(batas, cepat + naik);
          Suara.koin(); api.benar(soal.ulasan || acak(PUJI)[0]); pelari.classList.add('lompat');
        } else {
          kot.classList.add('keliru'); nyawa--; api.nyawa(nyawa, maksNyawa);
          var ben = [].filter.call(g.children, function (x) { return x.dataset.b; })[0];
          if (ben) ben.classList.add('betul');
          var ulangR = !soal._ulang && antreUlang.length + (jumlah - jumlahAwal) < 3 && nyawa > 0;
          if (ulangR) { var sr2 = {}; Object.keys(soal).forEach(function (k) { sr2[k] = soal[k]; }); sr2._ulang = true; antreUlang.push(sr2); jumlah++; }
          api.salah((soal.penjelasan || ('Jawaban yang benar: ' + soal.pilihan[soal.benar])) + (ulangR ? ' Soal ini akan datang lagi.' : ''));
          goyang(pelari);
        }
        ke++; stat();
        setTimeout(function () { pelari.classList.remove('lompat', 'goyang'); jeda = false; soalBaru(); if (g && ke < jumlah && nyawa > 0) { tAkhir = null; raf = requestAnimationFrame(langkah); } }, 1300);
        return;
      }
      raf = requestAnimationFrame(langkah);
    }
    function akhir() {
      berhenti();
      if (g) g.remove();
      if (nyawa <= 0) { soalEl.innerHTML = ik('hatiPatah') + ' Nyawa habis'; api.selesai({ bintang: 0, pesan: 'Nyawamu habis. Ayo coba lagi, pelan-pelan saja!' }); }
      else { soalEl.innerHTML = ik('bendera') + ' Finis!'; api.selesai({ bintang: nyawa >= maksNyawa ? 3 : nyawa >= maksNyawa - 1 ? 2 : 1 }); }
    }
    function berhenti() { jeda = true; if (raf) cancelAnimationFrame(raf); document.removeEventListener('keydown', kunci); }
    api.berhenti = berhenti;
    soalBaru();
    soalEl.innerHTML = '<div>Siap?<br><small>Gerbang pertama datang 3 detik lagi…</small></div>';
    var mulai = setTimeout(function () { soalEl.innerHTML = fmt(soal.tanya); raf = requestAnimationFrame(langkah); }, 2600);
    api.berhenti = function () { clearTimeout(mulai); berhenti(); };
  };

  /* 7. JELAJAH — sentuh titik pada gambar, lalu pasang label */
  MESIN.jelajah = function (lv, api) {
    var tt = lv.titik;
    var w = el('div', 'm-jel');
    var bk = el('div', 'bingkai'); w.appendChild(bk);
    var gb = el('div', 'gbr'); bk.appendChild(gb);
    var kn = el('div', 'kn'); w.appendChild(kn);
    var info = el('div', 'k-kertas info', '<h3>Ayo jelajahi!</h3><p>Sentuh titik berkedip pada gambar untuk mengenal setiap bagiannya.</p>');
    kn.appendChild(info);
    api.area.appendChild(w);
    function ukur(rasio) {
      var MAXW = (bk.clientWidth || 560) - 8, MAXH = (bk.clientHeight || 360) - 8;
      var lw = MAXW, lh = lw / rasio;
      if (lh > MAXH) { lh = MAXH; lw = lh * rasio; }
      gb.style.width = lw + 'px'; gb.style.height = lh + 'px';
    }
    var img = gambar(lv.gambar, lv.namaGambar || 'Gambar jelajah');
    gb.appendChild(img);
    ukur(lv.rasio || 4 / 3);
    if (img.tagName === 'IMG') img.addEventListener('load', function () { if (!lv.rasio && img.naturalWidth) ukur(img.naturalWidth / img.naturalHeight); });
    var lihat = 0, fase = 'jelajah';
    api.progres(0, tt.length);
    var titikEl = tt.map(function (t, n) {
      var d = el('div', 'tt', String(n + 1));
      d.style.left = t.x + '%'; d.style.top = t.y + '%';
      d.addEventListener('click', function () {
        if (fase !== 'jelajah') return;
        Suara.klik();
        titikEl.forEach(function (x) { x.classList.remove('aktif'); });
        d.classList.add('aktif');
        info.innerHTML = '<h3>' + fmt(t.nama) + '</h3><p>' + fmt(t.info || '') + '</p>';
        if (!d.classList.contains('lihat')) {
          d.classList.add('lihat'); lihat++; api.progres(lihat, tt.length);
          if (lihat === tt.length) {
            if (lv.label === false) { api.benar('Kamu sudah menjelajahi semua bagian!'); api.aksi('Selesai ' + ik('centang'), function () { api.selesai(); }); }
            else { api.bicara('Semua bagian sudah kamu jelajahi. Sekarang uji ingatanmu!', 'ok'); api.aksi('Pasang label ' + ik('lanjut'), faseLabel, 'k-denyut'); }
          } else api.bicara('Bagus! Masih ada ' + (tt.length - lihat) + ' titik lagi.');
        }
      });
      gb.appendChild(d);
      return d;
    });
    function faseLabel() {
      fase = 'label'; api.bersihAksi(); api.progres(0, tt.length);
      info.innerHTML = '<h3>Pasang label</h3><p>Seret setiap nama ke titik yang tepat, atau sentuh nama lalu sentuh titiknya.</p>';
      var baki = el('div', 'k-kertas baki'); baki.style.padding = '10px'; kn.appendChild(baki);
      var slots = tt.map(function (t, n) {
        titikEl[n].classList.remove('lihat', 'aktif'); titikEl[n].style.animation = 'kTitik 1.6s infinite';
        titikEl[n].textContent = '?';
        titikEl[n].dataset.n = n;
        return titikEl[n];
      });
      var pas = 0;
      var sr = buatSeret(api, {
        sasaran: function () { return slots.filter(function (s) { return !s.dataset.isi; }); },
        taruh: function (k, s) {
          if (k.dataset.n === s.dataset.n) {
            s.dataset.isi = 1; s.classList.add('lihat'); s.innerHTML = ik('centang');
            var lb = el('div', 'lbl'); lb.style.left = s.style.left; lb.style.top = 'calc(' + s.style.top + ' + 36px)';
            k.classList.add('betul'); k.dataset.kunci = 1; lb.appendChild(k); gb.appendChild(lb);
            pas++; api.progres(pas, tt.length);
            if (pas === tt.length) { api.benar('Semua label sudah terpasang dengan benar!'); api.selesai(); } else api.benar();
          } else { goyang(k); api.salah('Belum tepat. Ingat lagi bagian yang tadi kamu jelajahi.'); }
        }
      });
      slots.forEach(function (s) { sr.sasaran(s); });
      acak(tt.map(function (t, n) { return { t: t, n: n }; })).forEach(function (o) {
        var k = el('div', 'k-kartu', fmt(o.t.nama)); k.dataset.n = o.n; baki.appendChild(k); sr.kartu(k);
      });
    }
  };

  /* 7b. LABELI — seret nama ke gambar yang sesuai, atau seret gambar ke kotak nama.
     Data seperti cocokkan: pasangan:[[gambar, nama, ulasan, petunjuk], ...]; arah:'nama-ke-gambar' (bawaan) atau 'gambar-ke-nama'. */
  MESIN.labeli = function (lv, api) {
    var ps = lv.jumlah && lv.jumlah < lv.pasangan.length ? acak(lv.pasangan).slice(0, lv.jumlah) : lv.pasangan;
    var jml = ps.length, arah = lv.arah === 'gambar-ke-nama' ? 'gb2nm' : 'nm2gb';
    var gbDari = function (x) { return (x && typeof x === 'object') ? x.gambar : x; };
    var nmDari = function (x) { return (x && typeof x === 'object') ? x.teks : x; };
    var w = el('div', 'm-lab ' + arah);
    var baris = el('div', 'baris'); w.appendChild(baris);
    var baki = el('div', 'k-kertas baki'); w.appendChild(baki);
    api.area.appendChild(w);
    var pas = 0;
    api.progres(0, jml);
    /* label cadangan gambar sengaja netral ("Gambar 2"), supaya tidak membocorkan nama */
    function isiGambar(k, n) { k.appendChild(gambar(gbDari(ps[n][0]), 'Gambar ' + (n + 1))); return k; }
    var tile = ps.map(function (p, n) {
      var t = el('div', 'tl'); t.dataset.n = n;
      var tetap = el('div', 'tetap'), slot = el('div', 'slot', '?');
      if (arah === 'nm2gb') isiGambar(tetap, n); else tetap.innerHTML = fmt(nmDari(p[1]));
      t.appendChild(tetap); t.appendChild(slot);
      return t;
    });
    acak(tile).forEach(function (t) { baris.appendChild(t); });
    var sr = buatSeret(api, {
      sasaran: function () { return tile.filter(function (t) { return !t.dataset.isi; }); },
      taruh: function (k, t) {
        if (k.dataset.kunci || t.dataset.isi) return;
        var p = ps[+t.dataset.n];
        if (k.dataset.n === t.dataset.n) {
          t.dataset.isi = 1; t.classList.remove('siap'); t.classList.add('ok');
          var slot = t.querySelector('.slot'); slot.innerHTML = ''; slot.classList.add('terisi');
          k.dataset.kunci = 1; k.classList.remove('pilih'); k.classList.add('betul'); slot.appendChild(k);
          pas++; api.progres(pas, jml);
          if (pas === jml) {
            baki.style.visibility = 'hidden';
            api.benar(lv.ulasan || p[2] || 'Semua pasangan sudah benar!');
            api.selesai({ jeda: 900 });
          } else api.benar(p[2] || null);
        } else {
          goyang(k); t.classList.add('salah');
          setTimeout(function () { t.classList.remove('salah'); }, 700);
          api.salah(p[3] || lv.petunjukSalah || 'Belum tepat. Perhatikan lagi, lalu coba pasangan yang lain.');
        }
      }
    });
    tile.forEach(function (t) { sr.sasaran(t); });
    var kartu = ps.map(function (p, n) {
      var k = el('div', 'k-kartu' + (arah === 'gb2nm' ? ' gb' : '')); k.dataset.n = n;
      if (arah === 'gb2nm') isiGambar(k, n); else k.innerHTML = fmt(nmDari(p[1]));
      return k;
    });
    acak(kartu).forEach(function (k) { baki.appendChild(k); sr.kartu(k); });
  };

  /* ── mesin rakit ── (fungsi bantu berawalan rakit_) */
  function rakit_jenis(lv, s) { return (s && s.jenis) || (lv && lv.jenis) || 'huruf'; }
  /* kepingan kunci (huruf kecil), urut dari kiri ke kanan; hanya dipanggil setelah rakit_galat lolos */
  function rakit_potong(lv, s) {
    return rakit_jenis(lv, s) === 'suku'
      ? s.suku.map(function (x) { return String(x).toLowerCase(); })
      : String(s.jawab).toLowerCase().split('');
  }
  /* Mengembalikan teks galat (kosong bila soal sah). Dipakai periksaData. */
  function rakit_galat(lv, s, label) {
    var huruf = /^[A-Za-z]+$/, jn, k, ps, sdh, pc, kecil, mk, bt;
    if (!s || typeof s !== 'object' || Array.isArray(s)) return label + ' harus berbentuk { tanya:\'...\', jawab:\'kata\' }.';
    if (typeof s.tanya !== 'string' || !s.tanya.trim()) return label + ': tanya belum diisi. Tulis petunjuk untuk kata yang dicari, misalnya \'Hewan yang suka mengeong.\'.';
    if (s.tanya.length > 150) return label + ': tanya terlalu panjang (' + s.tanya.length + ' huruf). Maksimal 150 huruf, ringkas kalimatnya.';
    jn = rakit_jenis(lv, s);
    if (jn !== 'huruf' && jn !== 'suku') return label + ': jenis harus \'huruf\' atau \'suku\' (sekarang ' + jn + ').';
    if (typeof s.jawab !== 'string' || !huruf.test(s.jawab)) return label + ': jawab harus satu kata berisi huruf a–z saja, tanpa spasi, angka, strip, atau tanda baca (sekarang \'' + String(s.jawab) + '\'). Pilih kata tunggal; kata ulang seperti anak-anak tidak bisa dipakai.';
    if (jn === 'huruf' && (s.jawab.length < 3 || s.jawab.length > 9)) return label + ': jawab \'' + s.jawab + '\' berisi ' + s.jawab.length + ' huruf. Jenis \'huruf\' hanya untuk kata 3–9 huruf; untuk kata lebih panjang pakai jenis \'suku\' dan tulis suku.';
    if (jn === 'suku' && (s.jawab.length < 3 || s.jawab.length > 12)) return label + ': jawab \'' + s.jawab + '\' berisi ' + s.jawab.length + ' huruf. Jenis \'suku\' hanya untuk kata 3–12 huruf.';
    if (jn === 'huruf') {
      if (s.suku != null) return label + ': suku hanya dipakai pada jenis \'suku\'. Tulis jenis:\'suku\' pada soal ini, atau hapus suku.';
    } else {
      if (!Array.isArray(s.suku) || s.suku.length < 2 || s.suku.length > 5) return label + ': jenis \'suku\' membutuhkan suku berupa daftar 2–5 suku kata, misalnya suku:[\'ma\',\'ta\',\'ha\',\'ri\'].';
      for (k = 0; k < s.suku.length; k++) {
        if (typeof s.suku[k] !== 'string' || !huruf.test(s.suku[k]) || s.suku[k].length > 4) return label + ': suku ke-' + (k + 1) + ' (\'' + String(s.suku[k]) + '\') harus teks berisi 1–4 huruf a–z.';
      }
      if (s.suku.join('').toLowerCase() !== s.jawab.toLowerCase()) return label + ': gabungan suku (' + s.suku.join('-') + ') tidak sama dengan jawab (' + s.jawab + '). Perbaiki suku atau jawab supaya bila disambung hasilnya sama persis.';
    }
    ps = rakit_potong(lv, s);
    if (s.pengecoh != null) {
      if (!Array.isArray(s.pengecoh) || s.pengecoh.length > 3) return label + ': pengecoh harus berupa daftar paling banyak 3 item, misalnya pengecoh:[\'x\',\'z\'].';
      sdh = []; mk = jn === 'suku' ? 4 : 1;
      for (k = 0; k < s.pengecoh.length; k++) {
        pc = s.pengecoh[k];
        if (typeof pc !== 'string' || !huruf.test(pc) || pc.length > mk) return label + ': pengecoh ke-' + (k + 1) + ' (\'' + String(pc) + '\') harus berisi ' + (jn === 'suku' ? '1–4 huruf a–z (satu suku kata)' : 'tepat 1 huruf a–z') + '.';
        kecil = pc.toLowerCase();
        if (ps.indexOf(kecil) >= 0) return label + ': pengecoh \'' + pc + '\' sudah dipakai kata ini. Pilih ' + (jn === 'suku' ? 'suku kata' : 'huruf') + ' lain yang tidak ada di kata \'' + s.jawab + '\'.';
        if (sdh.indexOf(kecil) >= 0) return label + ': pengecoh \'' + pc + '\' kembar. Setiap pengecoh harus berbeda.';
        sdh.push(kecil);
      }
    }
    bt = ['petunjuk', 'ulasan'];
    for (k = 0; k < bt.length; k++) {
      if (s[bt[k]] != null && (typeof s[bt[k]] !== 'string' || s[bt[k]].length > 140)) return label + ': ' + bt[k] + ' harus teks paling banyak 140 huruf.';
    }
    return '';
  }

  /* RAKIT — ketuk kepingan huruf (atau suku kata) untuk menyusun kata yang ditanyakan */
  MESIN.rakit = function (lv, api) {
    var daftar = ambilSoal(lv), jp = null, jenis = 'huruf', bagian = [], kepingan = [], isi = [], slotEl = [], tahan = false;
    var w = api.el('div', 'k-rk-w'), kartu = api.el('div', 'k-kertas k-rk-kartu'), tny = api.el('div', 'k-rk-tny');
    var bar = api.el('div', 'k-rk-bar'), info = api.el('div', 'k-rk-info'), baris = api.el('div', 'k-rk-baris'), baki = api.el('div', 'k-rk-baris');
    function terkunci() { return tahan || !jp || jp.selesai(); }
    function segarkan() { if (jp) jp.perbarui(); }
    function slotKosong() { for (var q = 0; q < isi.length; q++) if (!isi[q]) return q; return -1; }
    function taruhKe(kp, q) {
      isi[q] = kp; kp.slot = q; slotEl[q].appendChild(kp.el); slotEl[q].classList.add('isi');
    }
    function kembalikan(kp) {
      var q = kp.slot;
      if (q == null) return;
      isi[q] = null; kp.slot = null;
      slotEl[q].classList.remove('isi', 'ok', 'no');
      kp.rumah.appendChild(kp.el);
    }
    /* semua = true juga mengembalikan kepingan yang sudah dikunci hijau */
    function kosongkan(semua) {
      kepingan.forEach(function (kp) {
        if (kp.slot == null || (kp.kunci && !semua)) return;
        kembalikan(kp);
        if (semua) { kp.kunci = false; kp.el.disabled = false; }
      });
    }
    function kunciDi(kp, q) { kp.kunci = true; kp.el.disabled = true; slotEl[q].classList.remove('no'); slotEl[q].classList.add('ok'); }
    function ketuk(kp) {
      if (terkunci() || kp.kunci) return;
      api.suara.klik();
      if (kp.slot != null) kembalikan(kp);
      else {
        var q = slotKosong();
        if (q < 0) { goyang(baris); return; }
        taruhKe(kp, q);
      }
      segarkan();
    }
    function buatKp(t) {
      var b = api.el('button', 'k-rk-kp'), kp = { t: t, el: b, rumah: null, slot: null, kunci: false };
      b.type = 'button'; b.textContent = t;
      b.setAttribute('aria-label', (jenis === 'suku' ? 'Suku kata ' : 'Huruf ') + t);
      b.addEventListener('click', function () { ketuk(kp); });
      return kp;
    }
    var hapus = tombol(ik('hapus') + ' Ulangi susun', 'kecil sek', function () {
      if (terkunci()) return;
      kosongkan(false); segarkan();
    });
    bar.appendChild(info); bar.appendChild(hapus);
    kartu.appendChild(tny); kartu.appendChild(bar); kartu.appendChild(baris); kartu.appendChild(baki);
    w.appendChild(kartu); api.area.appendChild(w);

    jp = jalurSoal(api, daftar, {
      tampil: function (s) {
        var urut, tc = 0, teks;
        jenis = rakit_jenis(lv, s); tahan = false;
        bagian = rakit_potong(lv, s);
        w.className = 'k-rk-w k-rk-' + jenis;
        tny.innerHTML = api.fmt(s.tanya);
        info.textContent = 'Kata ini terdiri dari ' + bagian.length + (jenis === 'suku' ? ' suku kata.' : ' huruf.');
        baris.innerHTML = ''; baki.innerHTML = '';
        slotEl = []; isi = [];
        bagian.forEach(function (t, q) {
          var sl = api.el('div', 'k-rk-slot'); sl.setAttribute('aria-label', 'Kotak ' + (q + 1));
          baris.appendChild(sl); slotEl.push(sl); isi.push(null);
        });
        teks = bagian.concat((s.pengecoh || []).map(function (x) { return String(x).toLowerCase(); }));
        kepingan = teks.map(buatKp);
        urut = api.acak(kepingan);
        /* tanpa pengecoh, hindari susunan awal yang sudah benar */
        while (!(s.pengecoh && s.pengecoh.length) && tc < 6 && urut.map(function (x) { return x.t; }).join('|') === bagian.join('|')) { urut = api.acak(kepingan); tc++; }
        urut.forEach(function (kp) {
          var rm = api.el('div', 'k-rk-rm'); rm.appendChild(kp.el); baki.appendChild(rm); kp.rumah = rm;
        });
        api.bicara(lv.petunjuk || (jenis === 'suku' ? 'Ketuk suku kata untuk menyusun kata, lalu tekan Periksa.' : PETUNJUK.rakit));
      },
      siap: function () { return isi.length > 0 && isi.every(Boolean); },
      benar: function (s) { return isi.map(function (kp) { return kp.t; }).join('') === String(s.jawab).toLowerCase(); },
      tandai: function (ok) {
        if (ok) { isi.forEach(function (kp, q) { kunciDi(kp, q); }); return; }
        tahan = true;
        isi.forEach(function (kp, q) {
          if (kp.kunci) return;
          if (kp.t === bagian[q]) kunciDi(kp, q);
          else slotEl[q].classList.add('no');
        });
        goyang(baris);
      },
      ulangi: function () { kosongkan(false); tahan = false; },
      teksBenar: function (s) {
        var j = String(s.jawab).toLowerCase();
        return rakit_jenis(lv, s) === 'suku' ? j + ' (' + rakit_potong(lv, s).join('-') + ')' : j;
      },
      tampilkanBenar: function () {
        tahan = true; kosongkan(true);
        bagian.forEach(function (t, q) {
          var kp = kepingan.filter(function (x) { return x.slot == null && x.t === t; })[0];
          if (kp) { taruhKe(kp, q); kunciDi(kp, q); }
        });
      }
    });
    jp.mulai();
  };

  /* 22. HURUF — susun huruf acak menjadi satu kata */
  MESIN.huruf = function (lv, api) {
    var el = api.el, esc = api.esc, fmt = api.fmt, acak = api.acak;
    function svg(d) { return '<svg class="k-ik" viewBox="0 0 24 24" aria-hidden="true">' + d + '</svg>'; }
    var IK_HAPUS = svg('<path d="M9 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-6-7z"/><path d="m12.5 9.5 5 5M17.5 9.5l-5 5"/>');
    var IK_CEK = svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>');
    var IK_LANJUT = svg('<path d="M5 12h14M13 6l6 6-6 6"/>');

    var pakaiBank = lv.jumlah && lv.jumlah < lv.soal.length;
    var jumlah = pakaiBank ? lv.jumlah : lv.soal.length;
    var daftar = (pakaiBank ? acak(lv.soal) : lv.soal.slice()).slice(0, jumlah);
    var i = 0, salahKe = 0, tambahan = 0, kunci = false, pewaktu = [];
    var kata = '', kotak = [], ubin = [], btnPeriksa = null, btnHapus = null;

    var w = el('div', 'k-hr-w');
    var kartu = el('div', 'k-kertas k-hr-tny');
    var baris = el('div', 'k-hr-slot');
    var baki = el('div', 'k-hr-baki');
    w.appendChild(kartu); w.appendChild(baris); w.appendChild(baki);
    api.area.appendChild(w);

    function tunda(fn, ms) { pewaktu.push(setTimeout(fn, ms)); }
    api.berhenti = function () { pewaktu.forEach(clearTimeout); pewaktu = []; };

    function perbarui() {
      var penuh = kotak.every(function (k) { return k.h; });
      var aktif = -1;
      kotak.forEach(function (k, q) {
        k.el.classList.remove('aktif');
        if (aktif < 0 && !k.h) aktif = q;
      });
      if (aktif >= 0 && !kunci) kotak[aktif].el.classList.add('aktif');
      if (btnPeriksa) btnPeriksa.disabled = kunci || !penuh;
      if (btnHapus) btnHapus.disabled = kunci || !kotak.some(function (k) { return k.h && !k.tetap; });
    }
    function taruhDi(h, q) {
      kotak[q].h = h; h.di = q; kotak[q].el.appendChild(h.el);
    }
    function taruh(h) {
      for (var q = 0; q < kotak.length; q++) if (!kotak[q].h) { taruhDi(h, q); return; }
    }
    function kembalikan(h) {
      var k = kotak[h.di];
      k.h = null; h.di = -1; h.sel.appendChild(h.el);
      k.el.className = 'k-hr-kt';
    }
    function ketuk(h) {
      if (kunci) return;
      if (h.di >= 0 && kotak[h.di].tetap) return;
      api.suara.klik();
      if (h.di >= 0) kembalikan(h); else taruh(h);
      perbarui();
    }
    function hapus() {
      if (kunci) return;
      for (var q = kotak.length - 1; q >= 0; q--) {
        if (kotak[q].h && !kotak[q].tetap) { kembalikan(kotak[q].h); break; }
      }
      perbarui();
    }
    function lanjutTombol() {
      api.bersihAksi(); btnPeriksa = null; btnHapus = null;
      api.aksi((i < jumlah - 1 ? 'Lanjut ' + IK_LANJUT : 'Selesai ' + IK_CEK), function () {
        i++;
        if (i >= jumlah) { api.berhenti(); api.progres(jumlah, jumlah); api.selesai(); } else tampil();
      }, 'k-denyut');
    }
    function cek() {
      if (kunci || !kotak.every(function (k) { return k.h; })) return;
      var s = daftar[i];
      var rakit = kotak.map(function (k) { return k.h.ch; }).join('');
      if (rakit === kata) {
        kunci = true;
        kotak.forEach(function (k) { k.tetap = true; k.el.classList.add('betul'); });
        perbarui();
        api.benar(s.ulasan || null);
        lanjutTombol();
        return;
      }
      salahKe++;
      var pas = 0, salahKotak = [];
      kotak.forEach(function (k, q) {
        if (k.h.ch === kata.charAt(q)) { k.tetap = true; k.el.classList.add('betul'); pas++; }
        else { k.el.classList.add('keliru'); salahKotak.push(k); }
      });
      kunci = true;
      if (salahKe >= 2) {
        var ulang = !s._ulang && tambahan < 3;
        if (ulang) {
          var salin = {}; Object.keys(s).forEach(function (k) { salin[k] = s[k]; }); salin._ulang = true;
          daftar.push(salin); jumlah++; tambahan++;
        }
        api.salah('Jawaban yang benar: **' + kata + '**. ' + (s.ulasan || '') + (ulang ? ' Soal ini akan muncul lagi nanti.' : ''));
        tunda(function () {
          salahKotak.forEach(function (k) { kembalikan(k.h); });
          kotak.forEach(function (k, q) {
            if (k.h) return;
            var h = ubin.filter(function (u) { return u.di < 0 && u.ch === kata.charAt(q); })[0];
            if (h) { taruhDi(h, q); k.el.className = 'k-hr-kt tampil'; }
            k.tetap = true;
          });
          perbarui();
        }, 750);
        lanjutTombol();
      } else {
        api.salah((s.petunjuk ? s.petunjuk + ' ' : 'Belum tepat. ') +
          (pas ? 'Huruf yang sudah pas dikunci hijau.' : 'Coba susun ulang hurufnya.'));
        tunda(function () {
          salahKotak.forEach(function (k) { kembalikan(k.h); });
          kunci = false; perbarui();
        }, 750);
      }
      perbarui();
    }
    function tampil() {
      var s = daftar[i];
      kata = String(s.jawab).trim().toUpperCase();
      salahKe = 0; kunci = false;
      api.progres(i, jumlah);
      var extra = String(s.pengecoh || '').toUpperCase().split('').filter(Boolean);
      var total = kata.length + extra.length;
      w.style.setProperty('--k-hr-u', (total <= 8 ? 72 : total <= 12 ? 64 : 56) + 'px');
      kartu.innerHTML = fmt(s.tanya) + '<div class="k-hr-info">' + kata.length + ' huruf</div>';
      baris.innerHTML = ''; baki.innerHTML = '';
      kotak = kata.split('').map(function () {
        var k = { el: el('div', 'k-hr-kt'), h: null, tetap: false };
        baris.appendChild(k.el);
        return k;
      });
      ubin = kata.split('').concat(extra).map(function (ch) {
        var h = { ch: ch, di: -1, el: el('button', 'k-hr-ub', esc(ch)), sel: el('div', 'k-hr-sel') };
        h.el.type = 'button';
        h.el.addEventListener('click', function () { ketuk(h); });
        h.sel.appendChild(h.el);
        return h;
      });
      var urut = acak(ubin);
      /* hindari susunan yang langsung benar */
      for (var t = 0; t < 8 && urut.map(function (u) { return u.ch; }).join('') === kata; t++) urut = acak(ubin);
      urut.forEach(function (h) { baki.appendChild(h.sel); });
      api.bersihAksi();
      btnHapus = api.aksi(IK_HAPUS + ' Hapus', hapus, 'sek');
      btnPeriksa = api.aksi(IK_CEK + ' Periksa', cek);
      perbarui();
      if (i > 0) api.bicara(lv.petunjuk || 'Ketuk huruf untuk menyusun kata yang tepat, lalu tekan Periksa.');
    }
    tampil();
  };

  MESIN.rangkai = function (lv, api) {
    var el = api.el, fmt = api.fmt, acak = api.acak;
    var SV = '<svg class="k-ik" viewBox="0 0 24 24" aria-hidden="true">';
    var IKON_CEK = SV + '<path d="M5 12.5 9.5 17 19 7"/></svg>';
    var IKON_LANJUT = SV + '<path d="M7.5 4.5 19.5 12l-12 7.5z" fill="currentColor"/></svg>';
    var IKON_ULANG = SV + '<path d="M20 12a8 8 0 1 1-2.4-5.7M20 4.5v4.8h-4.8"/></svg>';
    var hidup = true, timer = [];
    function tunda(ms, fn) { timer.push(setTimeout(function () { if (hidup) fn(); }, ms)); }
    api.berhenti = function () { hidup = false; timer.forEach(clearTimeout); };

    /* bank soal: jumlah memilih acak tiap main */
    var bank = lv.soal.slice();
    var daftar = lv.jumlah && lv.jumlah < bank.length ? acak(bank).slice(0, lv.jumlah) : bank;
    var i = 0, jumlah = daftar.length, tambahan = 0;
    var s, jn, kunci, slot, tile, salahKe, beres, sibuk, tbl, tblUlang;

    var w = el('div', 'k-rg-w');
    var tny = el('div', 'k-rg-tny k-kertas');
    var jwb = el('div', 'k-rg-jwb');
    var baki = el('div', 'k-rg-baki k-kertas');
    w.appendChild(tny); w.appendChild(jwb); w.appendChild(baki);
    api.area.appendChild(w);

    function jenisSoal(x) { return x.jenis || lv.jenis || 'huruf'; }
    function pecahKunci(x, j) { return j === 'kata' ? String(x.jawab).trim().split(/\s+/) : String(x.jawab).trim().toUpperCase().split(''); }
    function pecahPengecoh(x, j) { return (x.pengecoh || []).map(function (p) { return j === 'kata' ? String(p).trim() : String(p).trim().toUpperCase(); }); }
    function urutanSama(urut) {
      if (urut.length !== kunci.length) return false;
      return urut.every(function (t, k) { return t.t === kunci[k]; });
    }
    function teksBenar() { return kunci.join(jn === 'kata' ? ' ' : ''); }
    function penuh() { return slot.every(function (sl) { return sl.tile; }); }

    function segar() {
      slot.forEach(function (sl) {
        sl.btn.textContent = sl.tile ? sl.tile.t : '';
        sl.btn.className = 'k-rg-sl' + (sl.tile ? ' k-rg-isi' : '') + (sl.kunci ? ' k-rg-kunci' : '') + (sl.status ? ' k-rg-' + sl.status : '');
      });
      tile.forEach(function (tl) {
        tl.btn.classList.toggle('k-rg-pakai', tl.pakai);
        tl.btn.disabled = tl.pakai || beres || sibuk;
      });
      if (tbl) tbl.disabled = !penuh() || beres || sibuk;
      if (tblUlang) tblUlang.disabled = beres || sibuk || !slot.some(function (sl) { return sl.tile && !sl.kunci; });
    }

    function taruh(tl) {
      if (beres || sibuk || tl.pakai) return;
      var k = -1;
      for (var q = 0; q < slot.length; q++) { if (!slot[q].tile) { k = q; break; } }
      if (k < 0) return;
      if (api.suara && api.suara.klik) api.suara.klik();
      slot[k].tile = tl; tl.pakai = true;
      segar();
    }
    function lepas(k) {
      var sl = slot[k];
      if (beres || sibuk || !sl.tile || sl.kunci) return;
      if (api.suara && api.suara.klik) api.suara.klik();
      sl.tile.pakai = false; sl.tile = null;
      segar();
    }
    function kosongkan() {
      if (beres || sibuk) return;
      slot.forEach(function (sl) {
        if (sl.tile && !sl.kunci) { sl.tile.pakai = false; sl.tile = null; }
      });
      segar();
    }

    function lanjut() {
      api.bersihAksi(); tbl = null; tblUlang = null;
      var akhir = i >= jumlah - 1;
      api.aksi((akhir ? 'Selesai ' + IKON_CEK : 'Lanjut ' + IKON_LANJUT), function () {
        i++;
        if (i >= jumlah) { api.progres(jumlah, jumlah); api.selesai(); } else mulai();
      }, 'k-denyut');
    }

    /* dipanggil setelah salah kedua: isi semua kotak dengan susunan benar */
    function tampilkanBenar() {
      tile.forEach(function (tl) {
        var terkunci = slot.some(function (sl) { return sl.kunci && sl.tile === tl; });
        if (!terkunci) tl.pakai = false;
      });
      slot.forEach(function (sl, k) {
        if (sl.kunci) { sl.status = 'ok'; return; }
        var tl = tile.filter(function (x) { return !x.pakai && x.t === kunci[k]; })[0];
        sl.tile = tl; tl.pakai = true; sl.kunci = true; sl.status = 'ok';
      });
      segar();
    }

    function periksa() {
      if (beres || sibuk || !penuh()) return;
      var salahPos = [];
      kunci.forEach(function (t, k) { if (slot[k].tile.t !== t) salahPos.push(k); });
      if (!salahPos.length) {
        beres = true;
        slot.forEach(function (sl) { sl.status = 'ok'; });
        segar();
        api.benar(s.ulasan || null);
        lanjut();
        return;
      }
      salahKe++;
      slot.forEach(function (sl, k) {
        if (salahPos.indexOf(k) < 0) sl.kunci = true; else sl.status = 'no';
      });
      sibuk = true; segar();
      if (salahKe >= 2) {
        var ulang = !s._ulang && tambahan < 3;
        if (ulang) {
          var salin = {};
          Object.keys(s).forEach(function (q) { salin[q] = s[q]; });
          salin._ulang = true; daftar.push(salin); jumlah++; tambahan++;
        }
        beres = true;
        api.salah('Jawaban yang benar: **' + teksBenar() + '**. ' + (s.ulasan || '') + (ulang ? ' Soal ini akan muncul lagi nanti.' : ''));
        lanjut();
        tunda(700, tampilkanBenar);
      } else {
        api.salah(s.petunjuk || (salahPos.length < kunci.length
          ? 'Belum tepat. Yang hijau sudah benar dan dikunci. Susun sisanya lagi, ya!'
          : 'Belum tepat. Coba susun lagi dengan teliti.'));
        tunda(800, function () {
          slot.forEach(function (sl) {
            if (sl.status === 'no') { sl.tile.pakai = false; sl.tile = null; sl.status = null; }
          });
          sibuk = false; segar();
        });
      }
    }

    function mulai() {
      s = daftar[i]; jn = jenisSoal(s); kunci = pecahKunci(s, jn);
      salahKe = 0; beres = false; sibuk = false;
      slot = kunci.map(function () { return { tile: null, kunci: false, status: null, btn: null }; });
      var semua = kunci.concat(pecahPengecoh(s, jn)).map(function (t) { return { t: t, pakai: false, btn: null }; });
      var urut = acak(semua), coba = 0;
      while (coba < 8 && urutanSama(urut)) { urut = acak(semua); coba++; }
      tile = urut;

      api.progres(i, jumlah); api.bersihAksi();
      var mod = jn === 'kata' ? ' k-rg-kt' : ' k-rg-hr';
      tny.innerHTML = ''; jwb.innerHTML = ''; baki.innerHTML = '';
      jwb.className = 'k-rg-jwb' + mod;
      baki.className = 'k-rg-baki k-kertas' + mod;
      if (s.gambar) {
        var gb = el('div', 'k-rg-gb');
        gb.appendChild(api.gambar(s.gambar, 'Gambar'));
        tny.appendChild(gb);
      }
      tny.appendChild(el('div', 'k-rg-tx', fmt(s.tanya)));
      slot.forEach(function (sl, k) {
        var b = el('button', 'k-rg-sl'); b.type = 'button';
        b.setAttribute('aria-label', 'Kotak jawaban ' + (k + 1));
        b.addEventListener('click', function () { lepas(k); });
        sl.btn = b; jwb.appendChild(b);
      });
      tile.forEach(function (tl) {
        var b = el('button', 'k-rg-ub'); b.type = 'button';
        b.textContent = tl.t;
        b.addEventListener('click', function () { taruh(tl); });
        tl.btn = b; baki.appendChild(b);
      });
      tbl = api.aksi(IKON_CEK + ' Periksa', periksa);
      tblUlang = api.aksi(IKON_ULANG + ' Kosongkan', kosongkan, 'sek');
      api.bicara(s.petunjukAwal || lv.petunjuk || (jn === 'kata'
        ? 'Ketuk kata-kata untuk menyusun kalimat, lalu tekan Periksa.'
        : 'Ketuk huruf untuk menyusun kata, lalu tekan Periksa.'));
      segar();
    }
    mulai();
  };

  /* 8. MEMORI — buka dua kartu tertutup, cari pasangannya (data sama dengan cocokkan) */
  MESIN.memori = function (lv, api) {
    var ps = lv.jumlah && lv.jumlah < lv.pasangan.length ? acak(lv.pasangan).slice(0, lv.jumlah) : lv.pasangan;
    var n = ps.length, total = n * 2;
    var w = el('div', 'm-mem'), grid = el('div', 'grid');
    w.appendChild(grid); api.area.appendChild(w);
    var baris = total <= 10 ? 2 : 3, kol = Math.ceil(total / baris), jarak = 12;
    var lebarArea = (api.area.clientWidth || W) - 36, tinggiArea = (api.area.clientHeight || 370) - 20;
    var kw = Math.min(200, Math.floor((lebarArea - jarak * (kol - 1)) / kol));
    var kh = Math.min(150, Math.floor((tinggiArea - jarak * (baris - 1)) / baris));
    grid.style.gridTemplateColumns = 'repeat(' + kol + ',' + kw + 'px)';
    grid.style.gridAutoRows = kh + 'px';
    var kartu = [];
    ps.forEach(function (p, i) { kartu.push({ isi: p[0], n: i }); kartu.push({ isi: p[1], n: i }); });
    var terbuka = [], beres = 0, meleset = 0, sibuk = false;
    api.progres(0, n);
    acak(kartu).forEach(function (k) {
      var kt = el('div', 'kt'), dlm = el('div', 'dlm');
      var blk = el('div', 'blk', ik('tanya'));
      var muka = isiKartu(el('div', 'k-kartu muka'), k.isi);
      dlm.appendChild(blk); dlm.appendChild(muka); kt.appendChild(dlm); grid.appendChild(kt);
      kt.addEventListener('click', function () {
        if (sibuk || kt.classList.contains('buka')) return;
        Suara.klik();
        kt.classList.add('buka');
        terbuka.push({ kt: kt, muka: muka, n: k.n });
        if (terbuka.length < 2) { api.bicara('Sekarang buka satu kartu lagi.'); return; }
        var a = terbuka[0], b = terbuka[1];
        terbuka = [];
        if (a.n === b.n) {
          a.muka.classList.add('betul'); b.muka.classList.add('betul');
          beres++; api.progres(beres, n);
          if (beres === n) {
            api.benar('Semua pasangan sudah ditemukan!');
            api.selesai({ bintang: meleset <= n ? 3 : meleset <= n * 2 ? 2 : 1, pesan: meleset ? 'Semua pasangan ketemu, dengan ' + meleset + ' kali meleset.' : 'Semua pasangan ketemu tanpa meleset. Ingatanmu tajam!' });
          } else api.benar(ps[a.n][2] || null);
        } else {
          meleset++; sibuk = true;
          a.muka.classList.add('keliru'); b.muka.classList.add('keliru');
          api.bicara('Belum cocok. Ingat letaknya, lalu coba lagi!', 'no');
          if (api.giliran) api.giliran();
          setTimeout(function () {
            [a, b].forEach(function (x) { x.muka.classList.remove('keliru'); x.kt.classList.remove('buka'); });
            sibuk = false;
          }, 1000);
        }
      });
    });
  };

  /* 9. ISIAN — ketik jawaban angka dengan papan tombol (untuk numerasi) */
  function angkaDari(s) {
    s = String(s == null ? '' : s).trim().replace(/\s/g, '').replace(/^Rp\.?/i, '');
    if (s.indexOf('/') >= 0) {
      var p = s.split('/');
      if (p.length !== 2) return NaN;
      var a = angkaDari(p[0]), b = angkaDari(p[1]);
      return b ? a / b : NaN;
    }
    if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, '');
    s = s.replace(',', '.');
    return s === '' || s === '-' || isNaN(+s) ? NaN : +s;
  }
  function teksJawab(j) {
    if (typeof j === 'number') return j.toLocaleString('id-ID');
    return String(j);
  }
  MESIN.isian = function (lv, api) {
    var pakaiBank = lv.soal && lv.jumlah && lv.jumlah < lv.soal.length;
    var jumlah = lv.soal ? (pakaiBank ? lv.jumlah : lv.soal.length) : (lv.jumlah || 5);
    var bank = lv.soal ? (pakaiBank ? acak(lv.soal) : lv.soal.slice()) : null, tambahan = 0;
    var daftar = [];
    for (var q = 0; q < jumlah; q++) daftar.push(bank ? bank[q] : lv.buatSoal(q));
    /* tombol tambahan hanya muncul bila ada jawaban yang membutuhkannya */
    var semuaJ = [];
    daftar.forEach(function (s) { semuaJ = semuaJ.concat(Array.isArray(s.jawab) ? s.jawab : [s.jawab]); });
    var teksJ = semuaJ.map(String).join(' ');
    var ekstra = [];
    if (/[.,]\d/.test(teksJ.replace(/\d{1,3}(\.\d{3})+/g, '0'))) ekstra.push(',');
    if (teksJ.indexOf('/') >= 0) ekstra.push('/');
    if (/(^|\s)-/.test(teksJ)) ekstra.push('-');

    var w = el('div', 'm-isi');
    var kiri = el('div', 'k-kertas kiri'); w.appendChild(kiri);
    var tny = el('div', 'tny'); kiri.appendChild(tny);
    var jwb = el('div', 'jwb'); kiri.appendChild(jwb);
    var depan = el('span'), layarEl = el('div', 'layar'), belakang = el('span');
    jwb.appendChild(depan); jwb.appendChild(layarEl); jwb.appendChild(belakang);
    var papan = el('div', 'papan'); w.appendChild(papan);
    api.area.appendChild(w);

    var i = 0, isi = '', salahKe = 0, kunci = false, periksa = null;
    function tampilIsi() {
      var t = /^\d+$/.test(isi) && isi.length > 3 ? (+isi).toLocaleString('id-ID') : isi;
      layarEl.innerHTML = esc(t) + (kunci ? '' : '<i class="kursor"></i>');
      if (periksa) periksa.disabled = kunci || !isi;
    }
    function ketik(c) {
      if (kunci) return;
      if (c === 'hapus') isi = isi.slice(0, -1);
      else if (c === 'C') isi = '';
      else if (c === '-') { if (!isi) isi = '-'; }
      else if (c === ',' || c === '/') { if (isi && isi !== '-' && isi.indexOf(',') < 0 && isi.indexOf('/') < 0) isi += c; }
      else if (isi.replace(/\D/g, '').length < 10) isi += c;
      layarEl.classList.remove('keliru');
      tampilIsi();
    }
    var urut = ['7', '8', '9', '4', '5', '6', '1', '2', '3'];
    if (ekstra.length) { urut = urut.concat(ekstra); while (urut.length % 3) urut.push(''); }
    urut = urut.concat(['C', '0', 'hapus']);
    urut.forEach(function (c) {
      if (!c) { papan.appendChild(el('div')); return; }
      var b = tombol(c === 'hapus' ? ik('hapus') : esc(c), 'sek', function () { ketik(c); });
      if (c === 'C' || c === 'hapus') b.classList.add('kecil-tx');
      papan.appendChild(b);
    });
    function tekanKey(e) {
      if (/^[0-9]$/.test(e.key)) ketik(e.key);
      else if (e.key === 'Backspace') ketik('hapus');
      else if ((e.key === ',' || e.key === '.') && ekstra.indexOf(',') >= 0) ketik(',');
      else if (e.key === '/' && ekstra.indexOf('/') >= 0) ketik('/');
      else if (e.key === '-' && ekstra.indexOf('-') >= 0) ketik('-');
      else if (e.key === 'Enter' && periksa && !periksa.disabled) periksa.click();
      else return;
      e.preventDefault();
    }
    document.addEventListener('keydown', tekanKey);
    api.berhenti = function () { document.removeEventListener('keydown', tekanKey); };

    function cocok(s, masuk) {
      var daftarJ = Array.isArray(s.jawab) ? s.jawab : [s.jawab];
      return daftarJ.some(function (j) {
        if (s.persis) return String(j).replace(/\s/g, '') === masuk.replace(/\s/g, '');
        var a = angkaDari(j), b = angkaDari(masuk);
        return !isNaN(a) && !isNaN(b) && Math.abs(a - b) < 1e-9;
      });
    }
    function lanjutTombol() {
      api.bersihAksi(); periksa = null;
      api.aksi(i < jumlah - 1 ? 'Lanjut ' + ik('lanjut') : 'Selesai ' + ik('centang'), function () {
        i++;
        if (i >= jumlah) { api.berhenti(); api.progres(jumlah, jumlah); api.selesai(); } else tampil();
      }, 'k-denyut');
    }
    function cek() {
      var s = daftar[i];
      if (cocok(s, isi)) {
        kunci = true; layarEl.classList.add('betul'); tampilIsi();
        api.benar(s.ulasan || null); lanjutTombol();
        return;
      }
      salahKe++;
      layarEl.classList.add('keliru'); goyang(layarEl);
      if (salahKe >= 2) {
        var ulang = !s._ulang && tambahan < 3;
        if (ulang) {
          var salin = {}; Object.keys(s).forEach(function (k) { salin[k] = s[k]; }); salin._ulang = true;
          daftar.push(salin); jumlah++; tambahan++;
        }
        api.salah('Jawaban yang benar: **' + teksJawab(Array.isArray(s.jawab) ? s.jawab[0] : s.jawab) + '**. ' + (s.ulasan || '') +
          (ulang ? ' Soal ini akan muncul lagi nanti.' : ''));
        kunci = true;
        setTimeout(function () {
          layarEl.classList.remove('keliru'); layarEl.classList.add('betul');
          isi = String(Array.isArray(s.jawab) ? s.jawab[0] : s.jawab);
          layarEl.innerHTML = esc(teksJawab(Array.isArray(s.jawab) ? s.jawab[0] : s.jawab));
        }, 700);
        lanjutTombol();
      } else {
        api.salah(s.petunjuk || 'Belum tepat. Coba hitung sekali lagi dengan teliti.');
        setTimeout(function () { if (!kunci) { isi = ''; tampilIsi(); } }, 800);
      }
    }
    function tampil() {
      var s = daftar[i];
      api.progres(i, jumlah);
      isi = ''; salahKe = 0; kunci = false;
      layarEl.className = 'layar';
      tny.innerHTML = fmt(s.tanya);
      depan.innerHTML = s.depan ? esc(s.depan) : '';
      belakang.innerHTML = s.belakang ? esc(s.belakang) : '';
      api.bersihAksi();
      periksa = api.aksi(ik('centang') + ' Periksa', cek);
      tampilIsi();
      api.bicara(s.petunjukAwal || lv.petunjuk || PETUNJUK.isian);
    }
    tampil();
  };


  /* 10–11. MESIN VISUAL NUMERASI — garis bilangan dan pecahan.
     Dua mesin ini memakai satu alur soal: periksa, petunjuk pada salah pertama,
     jawaban + soal diulang pada salah kedua (sama seperti isian). */
  function ambilSoal(lv) {
    var bank = lv.soal ? lv.soal.slice() : null;
    var pakai = bank && lv.jumlah && lv.jumlah < bank.length;
    if (pakai) bank = acak(bank);
    var n = bank ? (pakai ? lv.jumlah : bank.length) : (lv.jumlah || 5);
    var d = [];
    for (var q = 0; q < n; q++) d.push(bank ? bank[q] : lv.buatSoal(q));
    return d;
  }
  function jalurSoal(api, daftar, h) {
    var i = 0, jumlah = daftar.length, salahKe = 0, tambahan = 0, beres = false, tbl = null;
    var jp = {
      selesai: function () { return beres; },
      perbarui: function () { if (tbl) tbl.disabled = beres || !h.siap(); },
      mulai: function () {
        var s = daftar[i];
        api.progres(i, jumlah); salahKe = 0; beres = false; api.bersihAksi(); tbl = null;
        h.tampil(s);
        if (!h.tanpaTombol) tbl = api.aksi(ik('centang') + ' Periksa', function () { jp.periksa(); });
        jp.perbarui();
      },
      periksa: function () {
        var s = daftar[i];
        if (beres || !h.siap()) return;
        if (h.benar(s)) { beres = true; h.tandai(true); api.benar(s.ulasan || null); lanjut(); return; }
        salahKe++; h.tandai(false);
        if (salahKe >= 2) {
          var ulang = !s._ulang && tambahan < 3;
          if (ulang) { var salin = {}; Object.keys(s).forEach(function (k) { salin[k] = s[k]; }); salin._ulang = true; daftar.push(salin); jumlah++; tambahan++; }
          beres = true;
          api.salah('Jawaban yang benar: **' + h.teksBenar(s) + '**. ' + (s.ulasan || '') + (ulang ? ' Soal ini akan muncul lagi nanti.' : ''));
          setTimeout(function () { h.tampilkanBenar(s); jp.perbarui(); }, 700);
          lanjut();
        } else {
          api.salah(s.petunjuk || 'Belum tepat. Coba lihat sekali lagi dengan teliti.');
          setTimeout(function () { if (!beres) { h.ulangi(s); jp.perbarui(); } }, 800);
        }
      }
    };
    function lanjut() {
      api.bersihAksi(); tbl = null;
      api.aksi(i < jumlah - 1 ? 'Lanjut ' + ik('lanjut') : 'Selesai ' + ik('centang'), function () {
        i++;
        if (i >= jumlah) { if (h.berhenti) h.berhenti(); api.progres(jumlah, jumlah); api.selesai(); } else jp.mulai();
      }, 'k-denyut');
    }
    return jp;
  }
  function tanyaHtml(t) { return fmt(t).replace(/(\d+)\/(\d+)/g, '<span class="fr"><i>$1</i><i>$2</i></span>'); }
  function pecahHtml(t) {
    var m = /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(String(t));
    return m ? '<span class="fr"><i>' + m[1] + '</i><i>' + m[2] + '</i></span>' : esc(String(t));
  }

  /* 10. GARIS — taruh penanda di garis bilangan */
  function cfgGaris(lv, s) {
    var c = { dari: 0, sampai: 10, langkah: 1, bagi: 1 };
    ['dari', 'sampai', 'langkah', 'bagi'].forEach(function (k) {
      if (s && s[k] != null) c[k] = +s[k]; else if (lv && lv[k] != null) c[k] = +lv[k];
    });
    c.sel = c.langkah / c.bagi;
    c.n = Math.round((c.sampai - c.dari) / c.sel);
    return c;
  }
  MESIN.garis = function (lv, api) {
    var daftar = ambilSoal(lv);
    var NS = 'http://www.w3.org/2000/svg';
    var w = el('div', 'm-gar'), kt = el('div', 'k-kertas tny');
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 900 210');
    w.appendChild(kt); w.appendChild(svg); api.area.appendChild(w);
    var X0 = 50, X1 = 850, Y = 140, c, idx = null, pin = null, nil = null, tampilNilai = true, seret = false, jp;
    function xDi(k) { return X0 + (X1 - X0) * k / c.n; }
    function lab(v) { v = Math.round(v * 1e6) / 1e6; return v.toLocaleString('id-ID', { maximumFractionDigits: 6 }); }
    function nilaiDi(k) { return c.dari + k * c.sel; }
    function gambarGaris(s) {
      c = cfgGaris(lv, s);
      var pakai = s.nilai != null ? s.nilai : lv.nilai;
      tampilNilai = pakai != null ? !!pakai : c.bagi === 1;
      var ujung = (s.label || lv.label) === 'ujung';
      var h = '<line class="gl" x1="' + X0 + '" y1="' + Y + '" x2="' + X1 + '" y2="' + Y + '"/>';
      for (var k = 0; k <= c.n; k++) {
        var besar = k % c.bagi === 0, x = xDi(k);
        h += '<line class="tk" x1="' + x + '" x2="' + x + '" y1="' + (Y - (besar ? 17 : 9)) + '" y2="' + (Y + (besar ? 17 : 9)) + '"/>';
        if (besar && (!ujung || k === 0 || k === c.n)) h += '<text class="lb" x="' + x + '" y="' + (Y + 52) + '">' + esc(lab(nilaiDi(k))) + '</text>';
      }
      h += '<g class="pin" style="display:none"><polygon points="0,' + (Y - 6) + ' -13,' + (Y - 36) + ' 13,' + (Y - 36) + '"/><circle cx="0" cy="' + (Y - 50) + '" r="18"/><text class="nil" y="' + (Y - 82) + '"></text></g>';
      svg.innerHTML = h;
      pin = svg.querySelector('.pin'); nil = svg.querySelector('.nil'); idx = null;
    }
    function taruh(k) {
      idx = k; pin.style.display = '';
      pin.setAttribute('transform', 'translate(' + xDi(k) + ',0)');
      nil.textContent = tampilNilai ? lab(nilaiDi(k)) : '';
      if (jp) jp.perbarui();
    }
    function kePosisi(e) {
      var m = svg.getScreenCTM(); if (!m) return null;
      var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      var p = pt.matrixTransform(m.inverse());
      return Math.max(0, Math.min(c.n, Math.round((p.x - X0) / (X1 - X0) * c.n)));
    }
    svg.addEventListener('pointerdown', function (e) {
      if (jp.selesai()) return;
      seret = true; try { svg.setPointerCapture(e.pointerId); } catch (x) {}
      var k = kePosisi(e); if (k != null) taruh(k);
      e.preventDefault();
    });
    svg.addEventListener('pointermove', function (e) {
      if (!seret || jp.selesai()) return;
      var k = kePosisi(e); if (k != null && k !== idx) taruh(k);
    });
    ['pointerup', 'pointercancel'].forEach(function (nm) { svg.addEventListener(nm, function () { seret = false; }); });
    function tekanKey(e) {
      if (jp.selesai()) return;
      if (e.key === 'ArrowLeft') taruh(idx == null ? 0 : Math.max(0, idx - 1));
      else if (e.key === 'ArrowRight') taruh(idx == null ? 0 : Math.min(c.n, idx + 1));
      else if (e.key === 'Enter' && idx != null) jp.periksa();
      else return;
      e.preventDefault();
    }
    document.addEventListener('keydown', tekanKey);
    api.berhenti = function () { document.removeEventListener('keydown', tekanKey); };
    function indeksBenar(s) { return Math.round((angkaDari(s.jawab) - c.dari) / c.sel); }
    jp = jalurSoal(api, daftar, {
      tampil: function (s) {
        kt.innerHTML = tanyaHtml(s.tanya); gambarGaris(s);
        api.bicara(s.petunjukAwal || lv.petunjuk || PETUNJUK.garis);
      },
      siap: function () { return idx != null; },
      benar: function (s) { return idx === indeksBenar(s); },
      tandai: function (ok) { pin.classList.remove('betul', 'keliru'); pin.classList.add(ok ? 'betul' : 'keliru'); if (!ok) goyang(svg); },
      ulangi: function () { pin.classList.remove('keliru'); },
      teksBenar: function (s) { return typeof s.jawab === 'string' ? s.jawab : lab(s.jawab); },
      tampilkanBenar: function (s) { taruh(indeksBenar(s)); pin.classList.remove('keliru'); pin.classList.add('betul'); },
      berhenti: api.berhenti
    });
    jp.mulai();
  };

  /* 11. PECAHAN — warnai bagian gambar, atau baca pecahan dari gambar */
  MESIN.pecahan = function (lv, api) {
    var daftar = ambilSoal(lv);
    var NS = 'http://www.w3.org/2000/svg';
    var w = el('div', 'm-pec'), kiri = el('div', 'k-kertas kiri'), tny = el('div', 'tny'), pil = el('div', 'pil');
    var kn = el('div', 'kn'), svg = document.createElementNS(NS, 'svg'), info = el('div', 'info');
    kiri.appendChild(tny); kiri.appendChild(pil); kn.appendChild(svg); kn.appendChild(info);
    w.appendChild(kiri); w.appendChild(kn); api.area.appendChild(w);
    var bentuk, bagi, jenis, sel = [], dipilih = null, tombolPil = [], jp;
    function jumlahSel() { return sel.filter(Boolean).length; }
    function bagianPath(k) {
      var cx = 160, cy = 160, r = 145, a0 = (-90 + 360 * k / bagi) * Math.PI / 180, a1 = (-90 + 360 * (k + 1) / bagi) * Math.PI / 180;
      return 'M' + cx + ' ' + cy + 'L' + (cx + r * Math.cos(a0)) + ' ' + (cy + r * Math.sin(a0)) + 'A' + r + ' ' + r + ' 0 0 1 ' + (cx + r * Math.cos(a1)) + ' ' + (cy + r * Math.sin(a1)) + 'Z';
    }
    function gambar(kelas) {
      svg.setAttribute('viewBox', bentuk === 'lingkaran' ? '0 0 320 320' : '0 0 440 170');
      var h = '';
      for (var k = 0; k < bagi; k++) {
        var cl = 'bg' + (sel[k] ? ' ' + (kelas || 'on') : '');
        if (bentuk === 'lingkaran') h += '<path class="' + cl + '" data-k="' + k + '" d="' + bagianPath(k) + '"/>';
        else h += '<rect class="' + cl + '" data-k="' + k + '" x="' + (10 + 420 * k / bagi) + '" y="20" width="' + (420 / bagi) + '" height="130"/>';
      }
      svg.innerHTML = h;
      if (jenis === 'warnai') info.innerHTML = '<b>' + jumlahSel() + '</b> dari <b>' + bagi + '</b> bagian diwarnai';
    }
    svg.addEventListener('click', function (e) {
      if (jenis !== 'warnai' || jp.selesai()) return;
      var k = e.target.getAttribute && e.target.getAttribute('data-k');
      if (k == null) return;
      sel[+k] = !sel[+k]; gambar(); jp.perbarui();
    });
    function tandaiPil(i, kelas) { if (tombolPil[i]) tombolPil[i].classList.add(kelas); }
    jp = jalurSoal(api, daftar, {
      get tanpaTombol() { return jenis === 'baca'; },
      tampil: function (s) {
        bentuk = s.bentuk || lv.bentuk || 'batang'; bagi = s.bagi != null ? s.bagi : lv.bagi; jenis = s.jenis || lv.jenis || 'warnai';
        dipilih = null; tombolPil = []; pil.innerHTML = ''; sel = [];
        for (var k = 0; k < bagi; k++) sel.push(jenis === 'baca' ? k < s.warna : false);
        kn.classList.toggle('main', jenis === 'warnai');
        tny.innerHTML = tanyaHtml(s.tanya);
        if (jenis === 'baca') {
          info.innerHTML = '';
          s.pilihan.forEach(function (p, ix) {
            var b = tombol(pecahHtml(p), 'sek', function () { if (jp.selesai() || b.disabled) return; dipilih = ix; jp.periksa(); });
            tombolPil.push(b); pil.appendChild(b);
          });
        }
        gambar(jenis === 'baca' ? 'on' : null);
        api.bicara(s.petunjukAwal || lv.petunjuk || (jenis === 'baca' ? 'Lihat gambarnya, lalu pilih pecahan yang tepat.' : PETUNJUK.pecahan));
      },
      siap: function () { return jenis === 'baca' ? dipilih != null : jumlahSel() > 0; },
      benar: function (s) { return jenis === 'baca' ? dipilih === s.benar : jumlahSel() === s.jawab; },
      tandai: function (ok) {
        if (jenis === 'baca') { tandaiPil(dipilih, ok ? 'betul' : 'keliru'); if (!ok) goyang(pil); }
        else { gambar(ok ? 'ok' : 'no'); if (!ok) goyang(svg); }
      },
      ulangi: function () {
        if (jenis === 'baca') { if (tombolPil[dipilih]) tombolPil[dipilih].disabled = true; dipilih = null; }
        else { for (var k = 0; k < bagi; k++) sel[k] = false; gambar(); }
      },
      teksBenar: function (s) { return jenis === 'baca' ? String(s.pilihan[s.benar]) : s.jawab + '/' + bagi + ' (' + s.jawab + ' dari ' + bagi + ' bagian)'; },
      tampilkanBenar: function (s) {
        if (jenis === 'baca') { tombolPil.forEach(function (b) { b.disabled = true; }); tandaiPil(s.benar, 'betul'); tombolPil[s.benar].disabled = false; }
        else { for (var k = 0; k < bagi; k++) sel[k] = k < s.jawab; gambar('ok'); }
      }
    });
    jp.mulai();
  };

  /* 12. JAM — putar jarum menit ke waktu di soal, atau baca jam analog lalu pilih waktunya */
  function waktuMenit(t) {
    var m = /^\s*(\d{1,2})\s*[:.]\s*(\d{2})\s*$/.exec(String(t == null ? '' : t));
    if (!m || +m[1] > 23 || +m[2] > 59) return NaN;
    return ((+m[1] % 12) * 60 + (+m[2])) % 720;
  }
  function teksJam(t) {
    var m = /^\s*(\d{1,2})\s*[:.]\s*(\d{2})\s*$/.exec(String(t == null ? '' : t));
    return m ? (+m[1] < 10 ? '0' : '') + (+m[1]) + '.' + m[2] : String(t);
  }
  function jamDigital(menit) {
    var h = Math.floor(menit / 60) % 12, mm = menit % 60;
    if (h === 0) h = 12;
    return (h < 10 ? '0' : '') + h + '.' + (mm < 10 ? '0' : '') + mm;
  }
  MESIN.jam = function (lv, api) {
    var daftar = ambilSoal(lv);
    var NS = 'http://www.w3.org/2000/svg';
    var w = el('div', 'm-jam'), kiri = el('div', 'k-kertas kiri'), tny = el('div', 'tny'), pil = el('div', 'pil');
    var kn = el('div', 'kn'), svg = document.createElementNS(NS, 'svg'), dig = el('div', 'dig');
    kiri.appendChild(tny); kiri.appendChild(pil); kn.appendChild(svg); kn.appendChild(dig);
    w.appendChild(kiri); w.appendChild(kn); api.area.appendChild(w);
    var jenis = 'putar', langkah = 5, pakaiDigital = false, t = 0, raw = 0, sudutAwal = 0;
    var diubah = false, seret = false, dipilih = null, tombolPil = [], jp, tgJ, tgM, tgK;
    (function muka() {
      var h = '<circle class="fc" cx="160" cy="160" r="148"/>', k, a, b, n;
      for (k = 0; k < 60; k++) {
        a = k * 6 * Math.PI / 180; b = k % 5 === 0;
        var r1 = b ? 124 : 132, r2 = 140;
        h += '<line class="tk' + (b ? ' bs' : '') + '" x1="' + (160 + r1 * Math.sin(a)).toFixed(2) + '" y1="' + (160 - r1 * Math.cos(a)).toFixed(2) +
          '" x2="' + (160 + r2 * Math.sin(a)).toFixed(2) + '" y2="' + (160 - r2 * Math.cos(a)).toFixed(2) + '"/>';
      }
      /* urutan gambar: jarum dulu, lalu angka (berhalo) supaya angka yang ditunjuk jarum tetap terbaca,
         lalu pegangan geser dan tutup tengah di paling atas */
      h += '<g class="hj"><line x1="160" y1="160" x2="160" y2="98"/></g>' +
        '<g class="mn"><line class="ol" x1="160" y1="160" x2="160" y2="44"/><line class="is" x1="160" y1="160" x2="160" y2="44"/></g>';
      for (n = 1; n <= 12; n++) {
        a = n * 30 * Math.PI / 180;
        h += '<text class="nm" x="' + (160 + 100 * Math.sin(a)).toFixed(2) + '" y="' + (160 - 100 * Math.cos(a) + 10).toFixed(2) + '">' + n + '</text>';
      }
      h += '<g class="mk"><circle class="kp" cx="160" cy="44" r="15"/></g><circle class="cap" cx="160" cy="160" r="10"/>';
      svg.setAttribute('viewBox', '0 0 320 320');
      svg.innerHTML = h;
      tgJ = svg.querySelector('.hj'); tgM = svg.querySelector('.mn'); tgK = svg.querySelector('.mk');
    })();
    function pasang() {
      tgJ.setAttribute('transform', 'rotate(' + (t / 2) + ' 160 160)');
      tgM.setAttribute('transform', 'rotate(' + ((t % 60) * 6) + ' 160 160)');
      tgK.setAttribute('transform', 'rotate(' + ((t % 60) * 6) + ' 160 160)');
      if (pakaiDigital) dig.textContent = jamDigital(t);
    }
    function atur(menit) {
      t = ((menit % 720) + 720) % 720; diubah = true;
      kn.classList.remove('ok', 'no'); pasang();
      if (jp) jp.perbarui();
    }
    function setT(menit) { raw = menit; atur(Math.round(menit / langkah) * langkah); }
    function sudut(e) {
      var m = svg.getScreenCTM(); if (!m) return null;
      var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      var p = pt.matrixTransform(m.inverse()), dx = p.x - 160, dy = p.y - 160;
      if (dx * dx + dy * dy < 400) return null;
      return (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
    }
    function geser(a) {
      var d = a - sudutAwal;
      while (d > 180) d -= 360;
      while (d <= -180) d += 360;
      sudutAwal = a; raw += d / 6;
      atur(Math.round(raw / langkah) * langkah);
    }
    svg.addEventListener('pointerdown', function (e) {
      if (jenis !== 'putar' || jp.selesai()) return;
      var a = sudut(e); if (a == null) return;
      seret = true; try { svg.setPointerCapture(e.pointerId); } catch (x) {}
      raw = t; sudutAwal = (t % 60) * 6; geser(a);
      e.preventDefault();
    });
    svg.addEventListener('pointermove', function (e) {
      if (!seret || jp.selesai()) return;
      var a = sudut(e); if (a != null) geser(a);
    });
    ['pointerup', 'pointercancel'].forEach(function (nm) { svg.addEventListener(nm, function () { seret = false; }); });
    function tekanKey(e) {
      if (jenis !== 'putar' || jp.selesai()) return;
      if (e.key === 'ArrowLeft') setT(t - langkah);
      else if (e.key === 'ArrowRight') setT(t + langkah);
      else if (e.key === 'ArrowDown') setT(t - 60);
      else if (e.key === 'ArrowUp') setT(t + 60);
      else if (e.key === 'Enter' && diubah) jp.periksa();
      else return;
      e.preventDefault();
    }
    document.addEventListener('keydown', tekanKey);
    api.berhenti = function () { document.removeEventListener('keydown', tekanKey); };
    function tandaiPil(i, kelas) { if (tombolPil[i]) tombolPil[i].classList.add(kelas); }
    jp = jalurSoal(api, daftar, {
      get tanpaTombol() { return jenis === 'baca'; },
      tampil: function (s) {
        jenis = s.jenis || lv.jenis || 'putar';
        langkah = +(s.langkah != null ? s.langkah : (lv.langkah != null ? lv.langkah : 5));
        pakaiDigital = !!(s.digital != null ? s.digital : lv.digital);
        dipilih = null; tombolPil = []; pil.innerHTML = ''; diubah = false; seret = false;
        kn.classList.remove('ok', 'no'); kn.classList.toggle('main', jenis === 'putar');
        dig.style.display = pakaiDigital ? '' : 'none';
        tny.innerHTML = tanyaHtml(s.tanya);
        if (jenis === 'baca') {
          t = raw = waktuMenit(s.jam);
          s.pilihan.forEach(function (p, ix) {
            var b = tombol(esc(String(p)), 'sek', function () { if (jp.selesai() || b.disabled) return; dipilih = ix; jp.periksa(); });
            tombolPil.push(b); pil.appendChild(b);
          });
        } else {
          t = raw = 0;
          pil.appendChild(tombol(ik('kiri') + ' 1 jam', 'sek kecil', function () { if (!jp.selesai()) setT(t - 60); }));
          pil.appendChild(tombol('1 jam ' + ik('lanjut'), 'sek kecil', function () { if (!jp.selesai()) setT(t + 60); }));
        }
        pasang();
        api.bicara(s.petunjukAwal || lv.petunjuk || (jenis === 'baca' ? 'Lihat jamnya, lalu pilih waktu yang tepat.' : PETUNJUK.jam));
      },
      siap: function () { return jenis === 'baca' ? dipilih != null : diubah; },
      benar: function (s) { return jenis === 'baca' ? dipilih === s.benar : t === waktuMenit(s.jawab); },
      tandai: function (ok) {
        if (jenis === 'baca') { tandaiPil(dipilih, ok ? 'betul' : 'keliru'); if (!ok) goyang(pil); }
        else { kn.classList.remove('ok', 'no'); kn.classList.add(ok ? 'ok' : 'no'); if (!ok) goyang(svg); }
      },
      ulangi: function () {
        if (jenis === 'baca') { if (tombolPil[dipilih]) tombolPil[dipilih].disabled = true; dipilih = null; }
        else kn.classList.remove('no');
      },
      teksBenar: function (s) { return jenis === 'baca' ? String(s.pilihan[s.benar]) : 'pukul ' + teksJam(s.jawab); },
      tampilkanBenar: function (s) {
        if (jenis === 'baca') { tombolPil.forEach(function (b) { b.disabled = true; }); tandaiPil(s.benar, 'betul'); tombolPil[s.benar].disabled = false; }
        else { t = raw = waktuMenit(s.jawab); kn.classList.remove('no'); kn.classList.add('ok'); pasang(); }
      },
      berhenti: api.berhenti
    });
    jp.mulai();
  };

  /* 13. UANG — susun nominal dari pecahan uang. Gambar uang buatan sendiri (kotak warna + nominal), bukan uang asli.
     jenis 'susun': murid mengetuk pecahan sampai jumlah dompet = target.
     jenis 'kembalian': soal memberi harga dan bayar; murid menghitung lalu menyusun uang kembaliannya.
     Benar bila jumlah dompet persis sama dengan target (kombinasi pecahan apa pun yang pas diterima).
     Ketuk lembar di dompet untuk mengeluarkannya (tombol hapus per lembar). Dompet maksimal 12 lembar. */
  var UANG_DEFAULT = [500, 1000, 2000, 5000], UANG_MAKS = 12;
  var UANG_WARNA = { 100: '#E9E3FA', 200: '#D9ECFB', 500: '#D7F1E1', 1000: '#FFF1B5', 2000: '#FFD8C0', 5000: '#F9D2E6', 10000: '#CFF3F0', 20000: '#E6F4B8', 50000: '#F6DDF8', 100000: '#FFE0A8' };
  var UANG_CADANGAN = ['#E9E3FA', '#D9ECFB', '#D7F1E1', '#FFF1B5', '#FFD8C0', '#F9D2E6'];
  function titik(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function rp(n) { return 'Rp ' + titik(n); }
  function jenisUang(lv, s) {
    if (s && s.jenis) return s.jenis;
    if (lv && lv.jenis) return lv.jenis;
    return s && (s.harga != null || s.bayar != null) ? 'kembalian' : 'susun';
  }
  function targetUang(lv, s) { return jenisUang(lv, s) === 'kembalian' ? s.bayar - s.harga : s.target; }
  function pecahanUang(lv, s) { return s && s.pecahan != null ? s.pecahan : (lv && lv.pecahan != null ? lv.pecahan : UANG_DEFAULT); }
  function gcdUang(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
  /* kombinasi paling sedikit lembar yang jumlahnya = target (urut besar ke kecil); null bila mustahil dalam maks lembar */
  function susunUang(target, pecahan, maks) {
    if (typeof target !== 'number' || !(target > 0) || target !== Math.floor(target) || !Array.isArray(pecahan) || !pecahan.length) return null;
    var g = 0, a, k;
    pecahan.forEach(function (p) { g = gcdUang(g, p); });
    if (!g || target % g) return null;
    var T = target / g, u = pecahan.map(function (p) { return p / g; });
    if (T > maks * Math.max.apply(null, u)) return null;
    var cnt = [0], pil = [0];
    for (a = 1; a <= T; a++) {
      cnt[a] = -1;
      for (k = 0; k < u.length; k++) {
        if (u[k] <= a && cnt[a - u[k]] >= 0 && (cnt[a] < 0 || cnt[a - u[k]] + 1 < cnt[a])) { cnt[a] = cnt[a - u[k]] + 1; pil[a] = k; }
      }
    }
    if (cnt[T] < 0 || cnt[T] > maks) return null;
    var hasil = [], sisa = T;
    while (sisa > 0) { hasil.push(pecahan[pil[sisa]]); sisa -= u[pil[sisa]]; }
    return hasil.sort(function (x, y) { return y - x; });
  }
  function gambarUang(n) {
    var len = titik(n).length, fs = Math.max(20, Math.min(34, Math.floor(100 / (len * 0.62))));
    var wr = UANG_WARNA[n] || UANG_CADANGAN[Math.floor(n / 100) % UANG_CADANGAN.length];
    return '<svg viewBox="0 0 120 72" aria-hidden="true">' +
      '<rect x="3" y="3" width="114" height="66" rx="10" fill="' + wr + '" style="stroke:var(--lip)" stroke-width="4"/>' +
      '<rect x="11" y="11" width="98" height="50" rx="6" fill="none" stroke="rgba(0,0,0,.3)" stroke-width="2" stroke-dasharray="6 4"/>' +
      '<circle cx="20" cy="20" r="4" fill="rgba(255,255,255,.85)"/><circle cx="100" cy="52" r="4" fill="rgba(255,255,255,.85)"/>' +
      '<text class="rp" x="60" y="25" font-size="15">Rp</text>' +
      '<text class="nom" x="60" y="56" font-size="' + fs + '">' + titik(n) + '</text></svg>';
  }
  MESIN.uang = function (lv, api) {
    var daftar = ambilSoal(lv).map(function (s) { var c = {}; Object.keys(s).forEach(function (k) { c[k] = s[k]; }); return c; });
    var w = el('div', 'm-uang'), kiri = el('div', 'k-kertas kiri'), tny = el('div', 'tny'), info = el('div', 'tgt');
    var kn = el('div', 'kn'), dmp = el('div', 'dmp'), dh = el('div', 'dh'), isi = el('div', 'isi'), jml = el('span', 'jml');
    var nmp = el('div', 'nmp'), cap = el('div', 'cap', 'Ketuk uang untuk memasukkannya ke dompet'), baris = el('div', 'baris');
    dh.appendChild(el('span', null, 'Dompetmu')); dh.appendChild(jml);
    dmp.appendChild(dh); dmp.appendChild(isi); nmp.appendChild(cap); nmp.appendChild(baris);
    kiri.appendChild(tny); kiri.appendChild(info); kn.appendChild(dmp); kn.appendChild(nmp);
    w.appendChild(kiri); w.appendChild(kn); api.area.appendChild(w);
    var cur = null, target = 0, solusi = [], dompet = [], tombolUang = [], jp;
    function totalDompet() { var j = 0; dompet.forEach(function (n) { j += n; }); return j; }
    function bar(lab, nilai, kls) { return '<div class="bar' + (kls ? ' ' + kls : '') + '"><span>' + esc(lab) + '</span><b>' + esc(nilai) + '</b></div>'; }
    /* kartu soal tidak boleh bergulir: kecilkan huruf (22 -> 16) bila teks + kotak info melebihi tinggi kartu */
    function muatkanTeks() {
      var fs = 22, maks = kiri.clientHeight - 28 - info.offsetHeight - 12;
      tny.style.fontSize = fs + 'px';
      while (fs > 16 && tny.scrollHeight > maks) { fs--; tny.style.fontSize = fs + 'px'; }
    }
    function kunciDompet() { dmp.classList.add('kunci'); tombolUang.forEach(function (b) { b.disabled = true; }); }
    function gambarDompet(baru) {
      isi.innerHTML = '';
      if (!dompet.length) isi.appendChild(el('div', 'kosong', 'Dompetmu masih kosong'));
      dompet.forEach(function (n, k) {
        var b = el('button', 'lb' + (baru && k === dompet.length - 1 ? ' baru' : ''), gambarUang(n) + '<span class="x">' + ik('tutup') + '</span>');
        b.type = 'button';
        b.setAttribute('aria-label', 'Keluarkan ' + rp(n) + ' dari dompet');
        b.addEventListener('click', function () { keluar(k); });
        isi.appendChild(b);
      });
      jml.textContent = rp(totalDompet());
      if (jp) jp.perbarui();
    }
    function keluar(k) {
      if (jp.selesai() || dmp.classList.contains('kunci')) return;
      dompet.splice(k, 1); dmp.classList.remove('ok', 'no'); gambarDompet(false);
    }
    function masuk(n) {
      if (jp.selesai()) return;
      if (dompet.length >= UANG_MAKS) {
        goyang(dmp);
        api.bicara('Dompetnya sudah penuh, maksimal ' + UANG_MAKS + ' lembar. Ketuk uang di dompet untuk mengeluarkannya.');
        return;
      }
      dompet.push(n); dmp.classList.remove('ok', 'no'); gambarDompet(true);
    }
    function tekanKey(e) {
      if (jp.selesai()) return;
      if ((e.key === 'Backspace' || e.key === 'Delete') && dompet.length) { keluar(dompet.length - 1); e.preventDefault(); }
    }
    document.addEventListener('keydown', tekanKey);
    api.berhenti = function () { document.removeEventListener('keydown', tekanKey); };
    function petunjukAuto() {
      var t = totalDompet(), kurang = t < target;
      if (jenisUang(lv, cur) === 'kembalian')
        return 'Uang di dompetmu ' + (kurang ? 'masih kurang' : 'terlalu banyak') + '. Hitung lagi: bayar dikurangi harga.';
      return 'Uangmu ' + rp(t) + ', target ' + rp(target) + ': ' + (kurang ? 'masih kurang ' + rp(target - t) + '. Tambahkan uang lagi.' : 'kelebihan ' + rp(t - target) + '. Keluarkan sebagian uangnya.');
    }
    jp = jalurSoal(api, daftar, {
      tampil: function (s) {
        cur = s;
        var jn = jenisUang(lv, s), pc = pecahanUang(lv, s).slice().sort(function (a, b) { return a - b; });
        target = targetUang(lv, s);
        solusi = susunUang(target, pc, UANG_MAKS) || [];
        dompet = []; dmp.classList.remove('ok', 'no', 'kunci');
        tny.innerHTML = tanyaHtml(s.tanya);
        info.innerHTML = jn === 'kembalian' ? bar('Harga', rp(s.harga)) + bar('Bayar', rp(s.bayar)) + bar('Kembalian', '?', 'tanya') : bar('Target', rp(target));
        baris.innerHTML = ''; tombolUang = [];
        pc.forEach(function (n) {
          var b = el('button', 'uc', gambarUang(n));
          b.type = 'button';
          b.setAttribute('aria-label', 'Ambil ' + rp(n));
          b.addEventListener('click', function () { masuk(n); });
          baris.appendChild(b); tombolUang.push(b);
        });
        gambarDompet(false);
        muatkanTeks();
        api.bicara(s.petunjukAwal || lv.petunjuk || (jn === 'kembalian' ? 'Hitung kembaliannya (bayar dikurangi harga), lalu susun uang kembalian itu di dompet.' : PETUNJUK.uang));
      },
      siap: function () { return dompet.length > 0; },
      benar: function () { return totalDompet() === target; },
      tandai: function (ok) {
        dmp.classList.remove('ok', 'no'); dmp.classList.add(ok ? 'ok' : 'no');
        if (ok) { kunciDompet(); return; }
        goyang(dmp);
        if (cur && (cur.petunjuk == null || cur._pAuto)) { cur.petunjuk = petunjukAuto(); cur._pAuto = true; }
      },
      ulangi: function () { dmp.classList.remove('no'); },
      teksBenar: function (s) {
        var cara = solusi.map(function (n) { return titik(n); }).join(' + ');
        if (jenisUang(lv, s) === 'kembalian') return 'kembaliannya ' + rp(target) + ' (' + rp(s.bayar) + ' − ' + rp(s.harga) + '), misalnya ' + cara;
        return rp(target) + ', misalnya ' + cara;
      },
      tampilkanBenar: function () {
        dompet = solusi.slice(); dmp.classList.remove('no'); dmp.classList.add('ok');
        kunciDompet(); gambarDompet(false);
      },
      berhenti: api.berhenti
    });
    jp.mulai();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (cur && w.isConnected) muatkanTeks(); });
  };

  /* 14. TIMBANGAN — neraca dua lengan yang miring sesuai selisih berat (satuan: kg / gram / ons, dst.)
     jenis 'seimbang': isi piring kiri tetap (kiri:[5,3]); murid mengetuk anak timbang untuk menaruhnya di piring kanan
       sampai neraca seimbang. Benar bila jumlah anak timbang di kanan persis sama dengan jumlah isi kiri
       (kombinasi anak timbang apa pun yang pas diterima). Ketuk anak timbang di piring untuk mengambilnya lagi. Maksimal 8 di piring.
     jenis 'cari': soal berbentuk "? + tetap = total"; murid memilih SATU anak timbang pengganti tanda tanya.
       jawab dihitung otomatis (total − tetap) dan harus salah satu anak timbang.
     Kemiringan neraca mengikuti selisih berat kanan − kiri (makin besar selisih makin miring, ada batas miring). */
  var TIM_ANAK = [1, 2, 5, 10], TIM_MAKS = 8, TIM_MAKS_BERAT = 200;
  function jenisTim(lv, s) { return (s && s.jenis) || (lv && lv.jenis) || 'seimbang'; }
  function anakTim(lv, s) {
    var a = s && s.anak != null ? s.anak : (lv && lv.anak != null ? lv.anak : TIM_ANAK);
    return (Array.isArray(a) ? a : TIM_ANAK).slice().sort(function (x, y) { return x - y; });
  }
  function satuanTim(lv, s) { return (s && s.satuan) || (lv && lv.satuan) || 'kg'; }
  function jumlahTim(a) { var j = 0; (a || []).forEach(function (n) { j += n; }); return j; }
  function targetTim(lv, s) { return jenisTim(lv, s) === 'cari' ? s.total : jumlahTim(s.kiri); }
  function jawabTim(s) { return s.total - s.tetap; }
  /* susunan anak timbang dengan jumlah anak paling sedikit; null bila tidak bisa atau melebihi maks */
  function susunTim(target, anak, maks) {
    var best = [0], dari = [-1], t, k;
    for (t = 1; t <= target; t++) {
      best[t] = Infinity; dari[t] = -1;
      for (k = 0; k < anak.length; k++) {
        if (anak[k] <= t && best[t - anak[k]] + 1 < best[t]) { best[t] = best[t - anak[k]] + 1; dari[t] = anak[k]; }
      }
    }
    if (!(best[target] <= maks)) return null;
    var hasil = [];
    for (t = target; t > 0; t -= dari[t]) hasil.push(dari[t]);
    return hasil.sort(function (x, y) { return y - x; });
  }
  MESIN.timbangan = function (lv, api) {
    var daftar = ambilSoal(lv).map(function (s) { var c = {}; Object.keys(s).forEach(function (k) { c[k] = s[k]; }); return c; });
    var NS = 'http://www.w3.org/2000/svg';
    var PX = 320, PY = 58, AL = 205, TALI = 112, SUDUT_MAKS = 11;
    var w = el('div', 'm-tim'), kiri = el('div', 'k-kertas kiri'), tny = el('div', 'tny'), info = el('div', 'tgt'), cap = el('div', 'cap');
    var kn = el('div', 'kn'), svg = document.createElementNS(NS, 'svg'), tray = el('div', 'nmp');
    svg.setAttribute('viewBox', '0 0 640 262'); svg.setAttribute('class', 'neraca'); svg.setAttribute('role', 'img');
    kiri.appendChild(tny); kiri.appendChild(info); kiri.appendChild(cap);
    kn.appendChild(svg); kn.appendChild(tray);
    w.appendChild(kiri); w.appendChild(kn); api.area.appendChild(w);
    svg.innerHTML =
      '<path class="tg" d="M313 66L308 240H332L327 66Z"/><rect class="tg" x="258" y="236" width="124" height="18" rx="9"/>' +
      '<line class="tl"/><line class="tl"/><line class="tl"/><line class="tl"/>' +
      '<g class="pan"><path class="dish" d="M-104 0H104C98 26 66 32 0 32C-66 32-98 26-104 0Z"/><g class="isi"></g></g>' +
      '<g class="pan"><path class="dish" d="M-104 0H104C98 26 66 32 0 32C-66 32-98 26-104 0Z"/><g class="isi"></g></g>' +
      '<g class="bm"><rect x="-219" y="-7" width="438" height="14" rx="7"/><circle cx="-205" cy="0" r="9"/><circle cx="205" cy="0" r="9"/></g>' +
      '<circle class="pv" cx="' + PX + '" cy="' + PY + '" r="13"/>';
    var tali = svg.querySelectorAll('.tl'), pans = svg.querySelectorAll('.pan'), beam = svg.querySelector('.bm');
    var isiKi = pans[0].querySelector('.isi'), isiKa = pans[1].querySelector('.isi');
    var cur = null, jn = 'seimbang', satuan = 'kg', anak = [], solusi = [], kanan = [], pilih = null, jp;
    var tombolAnak = [], kvEl = null, pqEl = null, ang = 0, tgt = 0, raf = null;
    var minta = window.requestAnimationFrame ? function (f) { return window.requestAnimationFrame(f); } : function (f) { return setTimeout(f, 16); };
    var batal = window.cancelAnimationFrame ? function (h) { window.cancelAnimationFrame(h); } : function (h) { clearTimeout(h); };

    /* gambar benda dan anak timbang (kotak 48 × 46) */
    function labelSvg(n, kls, y) {
      n = String(n);
      return '<text class="' + kls + (n.length > 2 ? ' k3' : '') + '" x="24" y="' + y + '">' + esc(n) + '</text>';
    }
    function isiBobot(n) { return '<path class="bt" d="M18 2.5h12a2.5 2.5 0 0 1 2.5 2.5v4h-17V5a2.5 2.5 0 0 1 2.5-2.5zM13 9h22l10.5 35.5h-43z"/>' + labelSvg(n, 'nb', 38); }
    function isiBenda(n) { return '<rect class="bd" x="1.5" y="1.5" width="45" height="43" rx="9"/>' + labelSvg(n, 'nb', 31); }
    function isiSlot(n) {
      return n == null ? '<rect class="sl" x="1.5" y="1.5" width="45" height="43" rx="9"/>' + labelSvg('?', 'sq', 33) : isiBobot(n);
    }
    function tata(items, pakaiHit) {
      var h = '', c = items.length, i, baris, kolom, dalam, x, y;
      for (i = 0; i < c; i++) {
        baris = Math.floor(i / 4); kolom = i % 4; dalam = Math.min(4, c - baris * 4);
        x = -(dalam * 48 + (dalam - 1) * 5) / 2 + kolom * 53; y = -baris * 49 - 47;
        h += '<g class="' + (pakaiHit ? 'pc' : 'ps') + '" ' + (pakaiHit ? 'data-k="' + i + '" ' : '') + 'transform="translate(' + x + ' ' + y + ')"><rect class="hit" x="-2.5" y="-1.5" width="53" height="49"/>' + items[i] + '</g>';
      }
      return h;
    }
    function beratKiri() { return jn === 'cari' ? cur.tetap + (pilih == null ? 0 : pilih) : jumlahTim(cur.kiri); }
    function beratKanan() { return jn === 'cari' ? cur.total : jumlahTim(kanan); }
    function gambarPiring() {
      var ki = [], ka = [];
      if (jn === 'cari') {
        ki.push(isiSlot(pilih)); ki.push(isiBenda(cur.tetap)); ka.push(isiBenda(cur.total));
      } else {
        cur.kiri.forEach(function (n) { ki.push(isiBenda(n)); });
        kanan.forEach(function (n) { ka.push(isiBobot(n)); });
      }
      isiKi.innerHTML = tata(ki, false).replace(/class="ps"/, jn === 'cari' ? 'class="ps sl0"' : 'class="ps"');
      isiKa.innerHTML = tata(ka, jn === 'seimbang');
    }
    /* neraca bergerak halus; sudut positif = piring kanan lebih berat (turun) */
    function pasang(a) {
      ang = a;
      var r = a * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
      var lx = PX - AL * c, ly = PY - AL * s, rx = PX + AL * c, ry = PY + AL * s;
      beam.setAttribute('transform', 'translate(' + PX + ' ' + PY + ') rotate(' + a + ')');
      pans[0].setAttribute('transform', 'translate(' + lx + ' ' + (ly + TALI) + ')');
      pans[1].setAttribute('transform', 'translate(' + rx + ' ' + (ry + TALI) + ')');
      [[lx, ly, -104], [lx, ly, 104], [rx, ry, -104], [rx, ry, 104]].forEach(function (p, k) {
        tali[k].setAttribute('x1', p[0]); tali[k].setAttribute('y1', p[1]);
        tali[k].setAttribute('x2', p[0] + p[2]); tali[k].setAttribute('y2', p[1] + TALI);
      });
    }
    function gerak() {
      raf = null;
      if (!w.isConnected) return;
      var d = tgt - ang;
      if (Math.abs(d) < 0.08) { pasang(tgt); return; }
      pasang(ang + d * 0.18);
      raf = minta(gerak);
    }
    function sudutDari(selisih) {
      if (selisih === 0) return 0;
      return (selisih > 0 ? 1 : -1) * Math.min(SUDUT_MAKS, 3 + 1.4 * Math.abs(selisih));
    }
    function tuju(a, langsung) {
      tgt = a;
      if (langsung) { if (raf != null) { batal(raf); raf = null; } pasang(a); return; }
      if (raf == null) raf = minta(gerak);
    }
    function muatkanTeks() {
      var pe = info.querySelector('.pers');
      if (pe) { var pf = 38; pe.style.fontSize = pf + 'px'; while (pf > 20 && pe.scrollWidth > pe.clientWidth) { pf -= 2; pe.style.fontSize = pf + 'px'; } }
      var fs = 22, maks = kiri.clientHeight - 32 - info.offsetHeight - cap.offsetHeight - 24;
      tny.style.fontSize = fs + 'px';
      while (fs > 16 && tny.scrollHeight > maks) { fs--; tny.style.fontSize = fs + 'px'; }
    }
    function kunciTray() { tombolAnak.forEach(function (b) { b.disabled = true; }); }
    function segarkan() {
      var L = beratKiri(), R = beratKanan();
      tuju(sudutDari(R - L));
      if (kvEl) kvEl.textContent = R + ' ' + satuan;
      if (pqEl) { pqEl.textContent = pilih == null ? '?' : String(pilih); pqEl.classList.toggle('isi', pilih != null); }
      svg.setAttribute('aria-label', 'Neraca. Piring kiri ' + L + ' ' + satuan + ', piring kanan ' + R + ' ' + satuan + (L === R ? ', seimbang.' : (R > L ? ', kanan lebih berat.' : ', kiri lebih berat.')));
      if (jp) jp.perbarui();
    }
    function taruh(n) {
      if (jp.selesai()) return;
      if (jn === 'cari') {
        pilih = pilih === n ? null : n;
        tombolAnak.forEach(function (b) { b.classList.toggle('pilih', pilih != null && +b.getAttribute('data-n') === pilih); });
        svg.classList.remove('keliru'); gambarPiring(); segarkan();
        return;
      }
      if (kanan.length >= TIM_MAKS) {
        goyang(svg);
        api.bicara('Piringnya sudah penuh, maksimal ' + TIM_MAKS + ' anak timbang. Ketuk anak timbang di piring untuk mengambilnya.');
        return;
      }
      kanan.push(n); kanan.sort(function (a, b) { return b - a; });
      svg.classList.remove('keliru'); gambarPiring(); segarkan();
    }
    function ambil(k) {
      if (jp.selesai() || jn !== 'seimbang' || k < 0 || k >= kanan.length) return;
      kanan.splice(k, 1); svg.classList.remove('keliru'); gambarPiring(); segarkan();
    }
    function lepas() {
      if (jp.selesai()) return;
      if (jn === 'cari') { if (pilih != null) taruh(pilih); } else ambil(kanan.length - 1);
    }
    svg.addEventListener('click', function (e) {
      var n = e.target;
      while (n && n !== svg) {
        if (n.getAttribute && n.getAttribute('data-k') != null) { ambil(+n.getAttribute('data-k')); return; }
        if (n.getAttribute && n.getAttribute('class') === 'ps sl0') { lepas(); return; }
        n = n.parentNode;
      }
    });
    function tekanKey(e) {
      if (jp.selesai()) return;
      if (e.key === 'Backspace' || e.key === 'Delete') lepas();
      else if (e.key === 'Enter' && !(e.target && e.target.tagName === 'BUTTON')) jp.periksa();
      else return;
      e.preventDefault();
    }
    document.addEventListener('keydown', tekanKey);
    api.berhenti = function () {
      document.removeEventListener('keydown', tekanKey);
      if (raf != null) { batal(raf); raf = null; }
    };
    function petunjukAuto() {
      if (jn === 'cari') {
        return 'Anak timbang yang kamu pilih ' + (pilih < jawabTim(cur) ? 'masih terlalu ringan' : 'terlalu berat') + '. Ingat: ? + ' + cur.tetap + ' harus sama dengan ' + cur.total + '.';
      }
      var d = beratKiri() - beratKanan();
      return d > 0 ? 'Piring kanan masih lebih ringan ' + d + ' ' + satuan + '. Tambahkan anak timbang lagi.'
        : 'Piring kanan terlalu berat, lebih ' + (-d) + ' ' + satuan + '. Ketuk anak timbang di piring untuk mengambilnya.';
    }
    jp = jalurSoal(api, daftar, {
      tampil: function (s) {
        cur = s; jn = jenisTim(lv, s); satuan = satuanTim(lv, s); anak = anakTim(lv, s);
        solusi = jn === 'cari' ? [jawabTim(s)] : (susunTim(jumlahTim(s.kiri), anak, TIM_MAKS) || []);
        kanan = []; pilih = null; svg.classList.remove('betul', 'keliru');
        tny.innerHTML = tanyaHtml(s.tanya);
        if (jn === 'cari') {
          info.innerHTML = '<div class="pers"><span class="pq">?</span> + ' + esc(String(s.tetap)) + ' = ' + esc(String(s.total)) + ' <small>' + esc(satuan) + '</small></div>';
          cap.textContent = 'Ketuk anak timbang untuk memilihnya. Ketuk lagi untuk melepasnya.';
        } else {
          info.innerHTML = '<div class="bar"><span>Piring kiri</span><b>' + esc(jumlahTim(s.kiri) + ' ' + satuan) + '</b></div>' +
            '<div class="bar"><span>Piring kanan</span><b class="kv"></b></div>';
          cap.textContent = 'Ketuk anak timbang di piring untuk mengambilnya kembali.';
        }
        kvEl = info.querySelector('.kv'); pqEl = info.querySelector('.pq');
        tray.innerHTML = '<span class="lab">Anak timbang</span>'; tombolAnak = [];
        anak.forEach(function (n) {
          var b = tombol('<svg viewBox="0 0 48 46" aria-hidden="true">' + isiBobot(n) + '</svg>', 'sek ak', function () { if (!b.disabled) taruh(n); });
          b.setAttribute('data-n', String(n)); b.setAttribute('aria-label', (jn === 'cari' ? 'Pilih ' : 'Taruh ') + n + ' ' + satuan);
          tombolAnak.push(b); tray.appendChild(b);
        });
        gambarPiring();
        pasang(0); segarkan();
        muatkanTeks();
        api.bicara(s.petunjukAwal || lv.petunjuk || (jn === 'cari' ? 'Pilih anak timbang yang cocok menggantikan tanda tanya agar neraca seimbang, lalu tekan Periksa.' : PETUNJUK.timbangan));
      },
      siap: function () { return jn === 'cari' ? pilih != null : kanan.length > 0; },
      benar: function (s) { return jn === 'cari' ? pilih === jawabTim(s) : jumlahTim(kanan) === jumlahTim(s.kiri); },
      tandai: function (ok) {
        svg.classList.remove('betul', 'keliru'); svg.classList.add(ok ? 'betul' : 'keliru');
        if (ok) { kunciTray(); return; }
        goyang(svg);
        if (cur && (cur.petunjuk == null || cur._pAuto)) { cur.petunjuk = petunjukAuto(); cur._pAuto = true; }
      },
      ulangi: function () {
        svg.classList.remove('keliru');
        if (jn === 'cari' && pilih != null) {
          tombolAnak.forEach(function (b) { if (+b.getAttribute('data-n') === pilih) { b.disabled = true; b.classList.remove('pilih'); } });
          pilih = null; gambarPiring(); segarkan();
        }
      },
      teksBenar: function (s) {
        if (jn === 'cari') return jawabTim(s) + ' ' + satuan + ' (' + s.total + ' − ' + s.tetap + ')';
        return 'piring kanan harus ' + jumlahTim(s.kiri) + ' ' + satuan + ', misalnya ' + solusi.join(' + ');
      },
      tampilkanBenar: function (s) {
        if (jn === 'cari') { pilih = jawabTim(s); tombolAnak.forEach(function (b) { b.classList.toggle('pilih', +b.getAttribute('data-n') === pilih); }); }
        else kanan = solusi.slice();
        svg.classList.remove('keliru'); svg.classList.add('betul');
        kunciTray(); gambarPiring(); segarkan();
      },
      berhenti: api.berhenti
    });
    jp.mulai();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (cur && w.isConnected) muatkanTeks(); });
  };

  /* 15. PETAK — bangun datar di kotak berpetak (luas dan keliling).
     Satu petak = persegi 1 × 1 satuan. Luas = banyak petak; keliling = banyak sisi petak yang berada di tepi luar bangun.
     jenis 'warnai': murid mewarnai petak (ketuk atau seret) sampai luas dan/atau keliling sesuai soal.
       Soal: { tanya, luas:12 }, { tanya, keliling:14 }, atau keduanya. Benar bila bangunnya menyambung (sisi ke sisi),
       tidak berlubang, dan angkanya persis sama (bentuk apa pun yang memenuhi diterima).
     jenis 'hitung': bentuk ditampilkan dari daftar petak, murid memilih jawaban luas atau keliling.
       Soal: { tanya, bentuk:['##.','###'], ukur:'luas' | 'keliling' }; pilihan dan benar boleh dikosongkan (dibuat otomatis,
       jawaban dihitung MPI sendiri sehingga tidak bisa keliru hitung). Bila pilihan diisi, dicek sama dengan hasil hitung. */
  var PTK_KOL = [3, 10], PTK_BAR = [3, 6], PTK_HIT_KOL = 10, PTK_HIT_BAR = 7;
  function jenisPtk(lv, s) {
    if (s && s.jenis) return s.jenis;
    if (lv && lv.jenis) return lv.jenis;
    return s && s.bentuk != null ? 'hitung' : 'warnai';
  }
  function ukuranPtk(lv, s) { return s && s.ukuran != null ? s.ukuran : (lv && lv.ukuran != null ? lv.ukuran : [8, 6]); }
  function satuanPtk(lv, s) {
    var t = s && s.satuan != null ? s.satuan : (lv && lv.satuan != null ? lv.satuan : null);
    return t != null && t !== '' ? t : null;
  }
  function bantuPtk(lv, s) { return s && s.bantu != null ? s.bantu : (lv && lv.bantu != null ? lv.bantu : false); }
  function ukurPtk(lv, s) { return (s && s.ukur) || (lv && lv.ukur) || 'luas'; }
  function unitLuas(sat) { return sat ? sat + '²' : 'petak'; }
  function unitKel(sat) { return sat || 'satuan'; }
  function angkaPilih(p) {
    if (typeof p === 'number') return p;
    var m = /-?\d+(?:[.,]\d+)?/.exec(String(p == null ? '' : p));
    return m ? angkaDari(m[0]) : NaN;
  }
  /* bentuk → kisi benar/salah. Menerima baris teks ('#' berwarna, '.' kosong) atau pasangan [kolom, baris] (mulai 0). */
  function normPetak(b) {
    var pts = [], i, j, ch, p;
    if (!Array.isArray(b) || !b.length) return { galat: "bentuk harus berupa daftar baris teks (contoh ['##.', '###']) atau daftar pasangan [kolom, baris]." };
    if (typeof b[0] === 'string') {
      for (i = 0; i < b.length; i++) {
        if (typeof b[i] !== 'string') return { galat: 'bentuk tidak boleh mencampur baris teks dan pasangan angka.' };
        for (j = 0; j < b[i].length; j++) {
          ch = b[i].charAt(j);
          if (ch === '#' || ch === 'X' || ch === 'x') pts.push([j, i]);
          else if (ch !== '.' && ch !== '_' && ch !== ' ') return { galat: "bentuk memuat karakter '" + ch + "'. Pakai # untuk petak berwarna dan . untuk petak kosong." };
        }
      }
    } else {
      for (i = 0; i < b.length; i++) {
        p = b[i];
        if (!Array.isArray(p) || p.length !== 2 || typeof p[0] !== 'number' || typeof p[1] !== 'number' ||
          p[0] < 0 || p[1] < 0 || p[0] !== Math.floor(p[0]) || p[1] !== Math.floor(p[1])) {
          return { galat: 'setiap petak pada bentuk harus pasangan [kolom, baris] berupa bilangan bulat 0 atau lebih, tanpa tanda petik.' };
        }
        pts.push([p[0], p[1]]);
      }
    }
    if (!pts.length) return { galat: 'bentuk belum punya petak berwarna.' };
    var c0 = 1e9, c1 = -1, r0 = 1e9, r1 = -1;
    pts.forEach(function (q) { c0 = Math.min(c0, q[0]); c1 = Math.max(c1, q[0]); r0 = Math.min(r0, q[1]); r1 = Math.max(r1, q[1]); });
    if (c1 - c0 > 60 || r1 - r0 > 60) return { galat: 'bentuk terlalu besar.' };
    var cols = c1 - c0 + 1, rows = r1 - r0 + 1, sel = [], r, c;
    for (r = 0; r < rows; r++) { sel.push([]); for (c = 0; c < cols; c++) sel[r].push(false); }
    pts.forEach(function (q) { sel[q[1] - r0][q[0] - c0] = true; });
    return { sel: sel, cols: cols, rows: rows };
  }
  /* luas, keliling, apakah menyambung (sisi ke sisi), apakah berlubang */
  function analisisPetak(sel) {
    var rows = sel.length, cols = rows ? sel[0].length : 0, r, c, luas = 0, kel = 0, mulai = null;
    for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) {
      if (!sel[r][c]) continue;
      luas++; if (!mulai) mulai = [c, r];
      if (!(r > 0 && sel[r - 1][c])) kel++;
      if (!(r < rows - 1 && sel[r + 1][c])) kel++;
      if (!(c > 0 && sel[r][c - 1])) kel++;
      if (!(c < cols - 1 && sel[r][c + 1])) kel++;
    }
    var tersambung = false, berlubang = false, tum, seen, q, k, d, nr, nc;
    var dr = [-1, 1, 0, 0], dc = [0, 0, -1, 1];
    if (luas) {
      seen = {}; tum = [mulai]; seen[mulai[1] + ',' + mulai[0]] = 1; k = 0;
      while (tum.length) {
        q = tum.pop(); k++;
        for (d = 0; d < 4; d++) {
          nr = q[1] + dr[d]; nc = q[0] + dc[d];
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || !sel[nr][nc] || seen[nr + ',' + nc]) continue;
          seen[nr + ',' + nc] = 1; tum.push([nc, nr]);
        }
      }
      tersambung = k === luas;
      /* lubang: petak kosong yang tidak terjangkau dari luar kisi (kisi diberi bingkai kosong 1 petak) */
      var lr = rows + 2, lc = cols + 2, lihat = {};
      tum = [[0, 0]]; lihat['0,0'] = 1;
      while (tum.length) {
        q = tum.pop();
        for (d = 0; d < 4; d++) {
          nr = q[1] + dr[d]; nc = q[0] + dc[d];
          if (nr < 0 || nc < 0 || nr >= lr || nc >= lc || lihat[nr + ',' + nc]) continue;
          if (nr >= 1 && nr <= rows && nc >= 1 && nc <= cols && sel[nr - 1][nc - 1]) continue;
          lihat[nr + ',' + nc] = 1; tum.push([nc, nr]);
        }
      }
      for (r = 0; r < rows && !berlubang; r++) for (c = 0; c < cols; c++) {
        if (!sel[r][c] && !lihat[(r + 1) + ',' + (c + 1)]) { berlubang = true; break; }
      }
    }
    return { luas: luas, keliling: kel, tersambung: tersambung, berlubang: berlubang };
  }
  /* contoh bangun yang memenuhi syarat (dipakai untuk kunci, jawaban setelah salah dua kali, dan validasi).
     Keluarga bangun: persegi panjang pembungkus w × h dengan keliling = 2(w + h) dan luas antara w + h − 1 dan w × h.
     Karena itu keliling dibatasi 2 × (kolom + baris). Mengembalikan { sel, w, h } atau null bila tidak terbukti bisa. */
  function contohPetak(cols, rows, luas, kel) {
    var w, h, A, r, c, n = 0, sel = [], opsi = [];
    for (r = 0; r < rows; r++) { sel.push([]); for (c = 0; c < cols; c++) sel[r].push(false); }
    if (kel != null) {
      if (kel % 2 || kel < 4) return null;
      var half = kel / 2;
      for (w = 1; w <= cols; w++) {
        h = half - w;
        if (h < 1 || h > rows) continue;
        if (luas != null && (luas < w + h - 1 || luas > w * h)) continue;
        opsi.push([w, h]);
      }
      if (!opsi.length) return null;
      opsi.sort(function (a, b) { return Math.abs(a[0] - a[1]) - Math.abs(b[0] - b[1]); });
      w = opsi[0][0]; h = opsi[0][1]; A = luas != null ? luas : w * h;
      /* huruf L (lajur kiri + baris atas) lalu isi bagian dalam baris demi baris: tetap cembung, kelilingnya 2(w + h) */
      for (r = 0; r < h; r++) { sel[r][0] = true; n++; }
      for (c = 1; c < w; c++) { sel[0][c] = true; n++; }
      for (r = 1; r < h && n < A; r++) for (c = 1; c < w && n < A; c++) { sel[r][c] = true; n++; }
      return { sel: sel, w: w, h: h };
    }
    if (luas == null || luas < 1 || luas > cols * rows) return null;
    for (w = Math.max(1, Math.min(cols, Math.ceil(Math.sqrt(luas)))); w <= cols; w++) { if (Math.ceil(luas / w) <= rows) break; }
    if (w > cols) return null;
    h = Math.ceil(luas / w);
    for (r = 0; r < h && n < luas; r++) for (c = 0; c < w && n < luas; c++) { sel[r][c] = true; n++; }
    return { sel: sel, w: w, h: h };
  }
  /* pilihan jawaban jenis 'hitung': dari soal bila diisi, otomatis bila kosong; disimpan di soal agar tetap sama saat soal diulang */
  function pilPetak(lv, s) {
    if (s._pil) return s._pil;
    var sat = satuanPtk(lv, s), uk = ukurPtk(lv, s), a = analisisPetak(normPetak(s.bentuk).sel);
    var v = uk === 'keliling' ? a.keliling : a.luas, lain = uk === 'keliling' ? a.luas : a.keliling;
    var u = uk === 'keliling' ? unitKel(sat) : unitLuas(sat);
    var lab = function (x) { return x + ' ' + u; };
    if (Array.isArray(s.pilihan)) {
      s._pil = { lab: s.pilihan.map(function (p) { return typeof p === 'number' ? lab(p) : String(p); }), benar: s.benar };
      return s._pil;
    }
    var step = uk === 'keliling' ? 2 : 1, uniq = [];
    [lain, v + step, v - step, v + 2 * step, v - 2 * step].forEach(function (x) { if (x > 0 && x !== v && uniq.indexOf(x) < 0) uniq.push(x); });
    var pil = acak([v].concat(acak(uniq.slice(0, 4)).slice(0, 2)));
    s._pil = { lab: pil.map(lab), benar: pil.indexOf(v) };
    return s._pil;
  }
  MESIN.petak = function (lv, api) {
    var daftar = ambilSoal(lv).map(function (s) { var c = {}; Object.keys(s).forEach(function (k) { c[k] = s[k]; }); return c; });
    var NS = 'http://www.w3.org/2000/svg', S = 60, PAD = 14;
    var w = el('div', 'm-ptk'), kiri = el('div', 'k-kertas kiri'), tny = el('div', 'tny'), info = el('div', 'tgt'), pil = el('div', 'pil');
    var kn = el('div', 'kn'), svg = document.createElementNS(NS, 'svg'), ket = el('div', 'info');
    svg.setAttribute('class', 'pt-svg'); svg.setAttribute('role', 'img');
    kiri.appendChild(tny); kiri.appendChild(info); kiri.appendChild(pil);
    kn.appendChild(svg); kn.appendChild(ket);
    w.appendChild(kiri); w.appendChild(kn); api.area.appendChild(w);
    var cur = null, jenis = 'warnai', cols = 0, rows = 0, sel = [], sat = null, bantu = false, uk = 'luas';
    var kursor = null, seret = false, mode = true, dipilih = null, tombolPil = [], pd = null, cells = [], jp;
    function bar(lab, nilai) { return '<div class="bar"><span>' + esc(lab) + '</span><b>' + esc(nilai) + '</b></div>'; }
    function kisiKosong(c, r) {
      var k = [], i, j;
      for (i = 0; i < r; i++) { k.push([]); for (j = 0; j < c; j++) k[i].push(false); }
      return k;
    }
    /* kartu soal tidak boleh bergulir: kecilkan huruf (22 -> 16) bila teks + kotak info melebihi tinggi kartu */
    function muatkanTeks() {
      var fs = 22, maks = kiri.clientHeight - 28 - info.offsetHeight - pil.offsetHeight - 24;
      tny.style.fontSize = fs + 'px';
      while (fs > 16 && tny.scrollHeight > maks) { fs--; tny.style.fontSize = fs + 'px'; }
    }
    /* kelas: 'on' (biasa), 'ok' (benar), 'no' (salah); angka = beri nomor tiap petak (luas); garis = tebalkan tepi luar (keliling) */
    function gambar(kelas, angka, garis) {
      svg.setAttribute('viewBox', '0 0 ' + (cols * S + PAD * 2) + ' ' + (rows * S + PAD * 2));
      var h = '', r, c, n = 0, x, y;
      for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) {
        x = PAD + c * S; y = PAD + r * S;
        h += '<rect class="pt' + (sel[r][c] ? ' ' + (kelas || 'on') : (jenis === 'hitung' ? ' gr' : '')) + '" data-c="' + c + '" data-r="' + r +
          '" x="' + x + '" y="' + y + '" width="' + S + '" height="' + S + '"/>';
      }
      if (garis) {
        for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) {
          if (!sel[r][c]) continue;
          x = PAD + c * S; y = PAD + r * S;
          if (r === 0 || !sel[r - 1][c]) h += '<line class="tp" x1="' + x + '" y1="' + y + '" x2="' + (x + S) + '" y2="' + y + '"/>';
          if (r === rows - 1 || !sel[r + 1][c]) h += '<line class="tp" x1="' + x + '" y1="' + (y + S) + '" x2="' + (x + S) + '" y2="' + (y + S) + '"/>';
          if (c === 0 || !sel[r][c - 1]) h += '<line class="tp" x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + (y + S) + '"/>';
          if (c === cols - 1 || !sel[r][c + 1]) h += '<line class="tp" x1="' + (x + S) + '" y1="' + y + '" x2="' + (x + S) + '" y2="' + (y + S) + '"/>';
        }
      }
      if (angka) {
        for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) {
          if (sel[r][c]) { n++; h += '<text class="ang" x="' + (PAD + c * S + S / 2) + '" y="' + (PAD + r * S + S / 2 + 9) + '">' + n + '</text>'; }
        }
      }
      if (kursor && jenis === 'warnai') h += '<rect class="kr" x="' + (PAD + kursor.c * S + 3) + '" y="' + (PAD + kursor.r * S + 3) + '" width="' + (S - 6) + '" height="' + (S - 6) + '" rx="6"/>';
      svg.innerHTML = h;
      cells = [].slice.call(svg.querySelectorAll('rect.pt'));
    }
    function segarkan() {
      if (jenis !== 'warnai') return;
      var a = analisisPetak(sel), t = a.luas + ' petak diwarnai';
      if (bantu) t += ' · keliling ' + a.keliling + ' ' + unitKel(sat);
      ket.textContent = t;
      svg.setAttribute('aria-label', 'Kotak berpetak ' + cols + ' kali ' + rows + '. ' + a.luas + ' petak diwarnai.');
      if (jp) jp.perbarui();
    }
    function cat(c, r, v) {
      if (jp.selesai() || sel[r][c] === v) return;
      sel[r][c] = v;
      var e = cells[r * cols + c];
      if (e) e.setAttribute('class', 'pt' + (v ? ' on' : ''));
      segarkan();
    }
    function posisi(e) {
      var t = e.target;
      if (t && t.getAttribute && t.getAttribute('data-c') != null) return { c: +t.getAttribute('data-c'), r: +t.getAttribute('data-r') };
      var m = svg.getScreenCTM && svg.getScreenCTM();
      if (!m || e.clientX == null) return null;
      var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      var p = pt.matrixTransform(m.inverse()), c = Math.floor((p.x - PAD) / S), r = Math.floor((p.y - PAD) / S);
      return c < 0 || r < 0 || c >= cols || r >= rows ? null : { c: c, r: r };
    }
    svg.addEventListener('pointerdown', function (e) {
      if (jenis !== 'warnai' || jp.selesai()) return;
      var p = posisi(e); if (!p) return;
      seret = true; mode = !sel[p.r][p.c];
      try { svg.setPointerCapture(e.pointerId); } catch (x) {}
      Suara.klik(); cat(p.c, p.r, mode);
      e.preventDefault();
    });
    svg.addEventListener('pointermove', function (e) {
      if (!seret || jp.selesai()) return;
      var p = posisi(e); if (p) cat(p.c, p.r, mode);
    });
    ['pointerup', 'pointercancel'].forEach(function (nm) { svg.addEventListener(nm, function () { seret = false; }); });
    function tekanKey(e) {
      if (jenis !== 'warnai' || jp.selesai()) return;
      var k = e.key, d = null, tg = e.target && e.target.tagName;
      if (k === 'ArrowLeft') d = [-1, 0]; else if (k === 'ArrowRight') d = [1, 0];
      else if (k === 'ArrowUp') d = [0, -1]; else if (k === 'ArrowDown') d = [0, 1];
      if (d) {
        kursor = kursor ? { c: Math.max(0, Math.min(cols - 1, kursor.c + d[0])), r: Math.max(0, Math.min(rows - 1, kursor.r + d[1])) } : { c: 0, r: 0 };
        gambar(); e.preventDefault(); return;
      }
      if (tg === 'BUTTON') return;
      if (k === ' ' && kursor) { cat(kursor.c, kursor.r, !sel[kursor.r][kursor.c]); e.preventDefault(); }
      else if (k === 'Enter') { if (analisisPetak(sel).luas > 0) jp.periksa(); e.preventDefault(); }
    }
    document.addEventListener('keydown', tekanKey);
    api.berhenti = function () { document.removeEventListener('keydown', tekanKey); };
    function pakaiAngka() { return jenis === 'hitung' ? uk === 'luas' : cur.luas != null; }
    function pakaiGaris() { return jenis === 'hitung' ? uk === 'keliling' : cur.keliling != null; }
    function tandaiPil(i, kelas) { if (tombolPil[i]) tombolPil[i].classList.add(kelas); }
    function petunjukAuto() {
      if (jenis === 'hitung') {
        return uk === 'keliling'
          ? 'Keliling adalah panjang seluruh sisi di tepi luar bangun. Hitung sisi petak yang menghadap keluar, satu per satu.'
          : 'Luas adalah banyaknya petak yang berwarna. Hitung petaknya satu per satu.';
      }
      var a = analisisPetak(sel);
      if (!a.tersambung) return 'Petak yang diwarnai harus menyambung sisi ke sisi, jadi satu bangun.';
      if (a.berlubang) return 'Bangun tidak boleh berlubang di tengahnya. Warnai petak yang bolong atau kosongkan petak di sekitarnya.';
      if (cur.luas != null && a.luas !== cur.luas) {
        return 'Luasmu sekarang ' + a.luas + ' petak, yang diminta ' + cur.luas + ': ' +
          (a.luas < cur.luas ? 'masih kurang ' + (cur.luas - a.luas) + ' petak.' : 'kelebihan ' + (a.luas - cur.luas) + ' petak.');
      }
      return 'Kelilingnya masih ' + (a.keliling < cur.keliling ? 'terlalu pendek' : 'terlalu panjang') + '. Hitung sisi petak yang berada di tepi luar bangun.';
    }
    jp = jalurSoal(api, daftar, {
      get tanpaTombol() { return jenis === 'hitung'; },
      tampil: function (s) {
        cur = s; jenis = jenisPtk(lv, s); sat = satuanPtk(lv, s); bantu = !!bantuPtk(lv, s); uk = ukurPtk(lv, s);
        seret = false; kursor = null; dipilih = null; tombolPil = []; pil.innerHTML = ''; info.innerHTML = '';
        tny.innerHTML = tanyaHtml(s.tanya);
        var cap = '<div class="cap">' + (sat ? 'Sisi tiap petak = 1 ' + esc(sat) : 'Sisi tiap petak = 1 satuan') + '</div>';
        if (jenis === 'hitung') {
          var nb = normPetak(s.bentuk); sel = nb.sel; cols = nb.cols; rows = nb.rows;
          pd = pilPetak(lv, s);
          info.innerHTML = bar('Ditanya', uk === 'keliling' ? 'Keliling' : 'Luas') + cap;
          pd.lab.forEach(function (t, ix) {
            var b = tombol(esc(t), 'sek', function () { if (jp.selesai() || b.disabled) return; dipilih = ix; jp.periksa(); });
            tombolPil.push(b); pil.appendChild(b);
          });
          ket.textContent = 'Hitung ' + (uk === 'keliling' ? 'kelilingnya' : 'luasnya') + ', lalu pilih jawabannya.';
          gambar('on');
        } else {
          var u = ukuranPtk(lv, s); cols = u[0]; rows = u[1]; sel = kisiKosong(cols, rows);
          info.innerHTML = (s.luas != null ? bar('Luas diminta', s.luas + ' ' + unitLuas(sat)) : '') +
            (s.keliling != null ? bar('Keliling diminta', s.keliling + ' ' + unitKel(sat)) : '') + cap;
          pil.appendChild(tombol(ik('hapus') + ' Hapus semua', 'sek kecil', function () {
            if (jp.selesai()) return;
            sel = kisiKosong(cols, rows); gambar(); segarkan();
          }));
          gambar(); segarkan();
        }
        kn.classList.toggle('main', jenis === 'warnai');
        muatkanTeks();
        api.bicara(s.petunjukAwal || lv.petunjuk || (jenis === 'hitung'
          ? 'Lihat bangunnya, lalu pilih ' + (uk === 'keliling' ? 'keliling' : 'luas') + ' yang tepat.' : PETUNJUK.petak));
      },
      siap: function () { return jenis === 'hitung' ? dipilih != null : analisisPetak(sel).luas > 0; },
      benar: function (s) {
        if (jenis === 'hitung') return dipilih === pd.benar;
        var a = analisisPetak(sel);
        return a.tersambung && !a.berlubang && (s.luas == null || a.luas === s.luas) && (s.keliling == null || a.keliling === s.keliling);
      },
      tandai: function (ok) {
        if (jenis === 'hitung') {
          tandaiPil(dipilih, ok ? 'betul' : 'keliru');
          if (ok) gambar('on', pakaiAngka(), pakaiGaris()); else goyang(pil);
        } else {
          gambar(ok ? 'ok' : 'no', ok && pakaiAngka(), ok && pakaiGaris());
          if (ok) kn.classList.remove('main'); else goyang(svg);
        }
        if (!ok && cur && (cur.petunjuk == null || cur._pAuto)) { cur.petunjuk = petunjukAuto(); cur._pAuto = true; }
      },
      ulangi: function () {
        if (jenis === 'hitung') { if (tombolPil[dipilih]) tombolPil[dipilih].disabled = true; dipilih = null; }
        else gambar();
      },
      teksBenar: function (s) {
        if (jenis === 'hitung') return pd.lab[pd.benar];
        var t = [], c = contohPetak(cols, rows, s.luas, s.keliling);
        if (s.luas != null) t.push('luas ' + s.luas + ' ' + unitLuas(sat));
        if (s.keliling != null) t.push('keliling ' + s.keliling + ' ' + unitKel(sat));
        return t.join(' dan ') + (c ? ', misalnya bangun selebar ' + c.w + ' petak dan setinggi ' + c.h + ' petak' : '');
      },
      tampilkanBenar: function (s) {
        if (jenis === 'hitung') {
          tombolPil.forEach(function (b) { b.disabled = true; });
          tandaiPil(pd.benar, 'betul'); tombolPil[pd.benar].disabled = false;
          gambar('on', pakaiAngka(), pakaiGaris());
        } else {
          var c = contohPetak(cols, rows, s.luas, s.keliling);
          if (c) sel = c.sel;
          kn.classList.remove('main');
          gambar('ok', pakaiAngka(), pakaiGaris()); segarkan();
        }
      },
      berhenti: api.berhenti
    });
    jp.mulai();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (cur && w.isConnected) muatkanTeks(); });
  };

  /* 16. KUIS — pilihan ganda fleksibel (tunggal / jamak), pilihan panjang, bacaan dan gambar opsional.
     Murid memilih lalu menekan Periksa. Urutan pilihan diacak tiap soal tampil; kunci dilacak lewat
     indeks asli, jadi guru tetap menulis dalam urutan aslinya. */
  var KUIS_HURUF = 'ABCDE';
  function kuisTeks(p) { return p && typeof p === 'object' ? String(p.teks == null ? '' : p.teks) : String(p == null ? '' : p); }
  function kuisTanggapan(p) { return p && typeof p === 'object' && p.tanggapan ? String(p.tanggapan) : ''; }
  function kuisJenis(lv, s) { return (s && s.jenis) || (lv && lv.jenis) || 'tunggal'; }
  function kuisBenar(jn, s) { return jn === 'jamak' ? (Array.isArray(s.benar) ? s.benar.slice() : []) : [s.benar]; }
  function kuisHtml(t) {
    return fmt(t).replace(/(^|[^\d\/])(\d{1,3})\/(\d{1,3})(?![\d\/])/g, function (m, a, n, d) {
      return a + '<span class="fr"><i>' + n + '</i><i>' + d + '</i></span>';
    });
  }
  var KUIS_RUJUK = [
    /^(semua|keduanya|kedua)( (jawaban|pilihan))?( di atas)?( (benar|salah|tepat))?[.!]?$/i,
    /^(benar|salah) semua[.!]?$/i,
    /^tidak ada (jawaban|pilihan|yang)( yang)? (benar|tepat)[.!]?$/i,
    /^[A-E]((, | dan | & | atau )[A-E])+( (benar|tepat|saja))?[.!]?$/
  ];
  /* Mengembalikan teks galat (kosong bila soal sah). Dipakai periksaData. */
  function kuisGalat(lv, s, label) {
    var kata = function (t) { return String(t || '').split(/\s+/).filter(Boolean).length; };
    if (!s || typeof s !== 'object' || !s.tanya) return label + ' belum punya tanya.';
    var jn = kuisJenis(lv, s);
    if (jn !== 'tunggal' && jn !== 'jamak') return label + ': jenis harus \'tunggal\' atau \'jamak\' (sekarang ' + jn + ').';
    if (String(s.tanya).length > 200) return label + ': tanya terlalu panjang (' + String(s.tanya).length + ' huruf). Maksimal 200 huruf; pindahkan teks panjang ke bacaan.';
    var p = s.pilihan, mk = jn === 'jamak' ? 5 : 4;
    if (!Array.isArray(p) || p.length < 2 || p.length > mk) return label + ': jenis ' + jn + ' harus punya 2–' + mk + ' pilihan (sekarang ' + (Array.isArray(p) ? p.length : 0) + ').';
    var teks = [], k;
    for (k = 0; k < p.length; k++) {
      if (p[k] && typeof p[k] === 'object' && (typeof p[k].teks !== 'string' && typeof p[k].teks !== 'number')) return label + ': pilihan ' + (k + 1) + ' berbentuk objek, tulis {teks:\'...\', tanggapan:\'...\'}.';
      if (p[k] && typeof p[k] === 'object' && p[k].tanggapan != null && typeof p[k].tanggapan !== 'string') return label + ': tanggapan pada pilihan ' + (k + 1) + ' harus berupa teks.';
      var t = kuisTeks(p[k]).trim();
      if (!t) return label + ': pilihan ' + (k + 1) + ' kosong.';
      if (t.length > 60) return label + ': pilihan ' + (k + 1) + ' terlalu panjang (' + t.length + ' huruf). Maksimal 60 huruf: "' + t.slice(0, 30) + '…"';
      teks.push(t.toLowerCase());
    }
    for (k = 0; k < teks.length; k++) if (teks.indexOf(teks[k]) !== k) return label + ': pilihan ' + (k + 1) + ' sama dengan pilihan lain ("' + kuisTeks(p[k]) + '"), jadi jawabannya ambigu.';
    var bs;
    if (jn === 'jamak') {
      if (!Array.isArray(s.benar)) return label + ': untuk jenis jamak, benar harus daftar indeks, contoh benar:[0,2] (mulai dari 0). Sekarang: ' + s.benar;
      bs = s.benar;
      if (!bs.length) return label + ': benar belum diisi (minimal satu indeks).';
      for (k = 0; k < bs.length; k++) if (typeof bs[k] !== 'number' || bs[k] !== Math.floor(bs[k]) || bs[k] < 0 || bs[k] >= p.length) return label + ': indeks benar ' + bs[k] + ' tidak sesuai pilihan (harus 0 sampai ' + (p.length - 1) + ').';
      if (new Set(bs).size !== bs.length) return label + ': indeks benar tidak boleh kembar (' + bs.join(', ') + ').';
      if (bs.length >= p.length) return label + ': semua pilihan ditandai benar. Soal jamak butuh minimal satu pilihan yang salah.';
    } else {
      if (Array.isArray(s.benar)) return label + ': untuk jenis tunggal, benar berupa satu angka indeks (mulai dari 0), bukan daftar. Pakai jenis:\'jamak\' bila jawabannya lebih dari satu.';
      if (typeof s.benar !== 'number' || s.benar !== Math.floor(s.benar) || s.benar < 0 || s.benar >= p.length) return label + ': indeks benar tidak sesuai pilihan (harus bilangan bulat 0 sampai ' + (p.length - 1) + '; sekarang ' + s.benar + ').';
      bs = [s.benar];
    }
    for (k = 0; k < p.length; k++) if (bs.indexOf(k) >= 0 && kuisTanggapan(p[k])) return label + ': pilihan ' + (k + 1) + ' memuat tanggapan padahal ditandai benar. Tanggapan hanya untuk pilihan yang salah; periksa indeks benar.';
    if (s.bacaan != null) {
      if (typeof s.bacaan !== 'string' || !s.bacaan.trim()) return label + ': bacaan harus berupa teks.';
      if (kata(s.bacaan) > 60) return label + ': bacaan terlalu panjang (' + kata(s.bacaan) + ' kata). Maksimal 60 kata.';
    }
    if (s.gambar != null && !src(s.gambar)) return label + ': gambar \'' + s.gambar + '\' bukan alamat gambar (harus memuat titik atau garis miring, contoh \'gambar/peta.png\') dan bukan nama kunci di DATA.gambar.';
    if (jn === 'jamak' && p.length === 5 && (s.bacaan || s.gambar)) {
      if (String(s.tanya).length > 100) return label + ': soal jamak 5 pilihan yang memakai bacaan atau gambar harus punya tanya maksimal 100 huruf (sekarang ' + String(s.tanya).length + ') supaya semua pilihan muat di layar HP. Pendekkan tanya atau kurangi jumlah pilihan.';
      for (k = 0; k < p.length; k++) if (kuisTeks(p[k]).trim().length > 50) return label + ': soal jamak 5 pilihan yang memakai bacaan atau gambar harus punya pilihan maksimal 50 huruf (pilihan ' + (k + 1) + ' berisi ' + kuisTeks(p[k]).trim().length + ') supaya semua pilihan muat di layar HP. Pendekkan pilihan atau kurangi jumlah pilihan.';
    }
    if (s.acak != null && typeof s.acak !== 'boolean') return label + ': acak harus true atau false (tanpa tanda petik).';
    if (s.acak !== false && lv.acak !== false) {
      for (k = 0; k < p.length; k++) {
        var tt = kuisTeks(p[k]).trim();
        if (KUIS_RUJUK.some(function (re) { return re.test(tt); })) return label + ': pilihan ' + (k + 1) + ' ("' + tt + '") merujuk pilihan lain, padahal urutan pilihan diacak. Ganti kalimatnya, atau tulis acak:false pada soal itu.';
      }
    }
    return '';
  }
  MESIN.kuis = function (lv, api) {
    var daftar = ambilSoal(lv).map(function (s) {
      var c = {}; Object.keys(s).forEach(function (k) { c[k] = s[k]; });
      c._pj0 = s.petunjuk;
      return c;
    });
    var w = el('div', 'm-kuis'), sisi = null, kn = el('div', 'kn'), tny = el('div', 'k-kertas tny'), pil = el('div', 'pil');
    api.area.appendChild(w);
    var jenis = 'tunggal', urut = [], tombolPil = [], dipilih = [], benarAsli = [], teksMaks = 0, jp;
    var UKURAN = [[24, 21, 19], [22, 19, 17], [20, 17, 15.5], [18, 16, 14]];
    function sama(a, b) {
      var x = a.slice().sort(), y = b.slice().sort();
      return x.length === y.length && x.every(function (v, k) { return v === y[k]; });
    }
    function segarkan() {
      tombolPil.forEach(function (b, p) {
        var on = dipilih.indexOf(urut[p]) >= 0;
        b.classList.toggle('pilih', on);
        b.setAttribute('aria-checked', on ? 'true' : 'false');
        b.firstChild.innerHTML = on ? ik('centang') : KUIS_HURUF[p];
      });
    }
    function pilihKe(p) {
      if (jp.selesai() || !tombolPil[p] || tombolPil[p].classList.contains('coret')) return;
      var o = urut[p];
      if (jenis === 'jamak') { var k = dipilih.indexOf(o); if (k >= 0) dipilih.splice(k, 1); else dipilih.push(o); }
      else dipilih = [o];
      segarkan(); jp.perbarui();
    }
    /* Pilih ukuran huruf dan jumlah kolom terbesar yang masih muat tanpa scroll. */
    function pasang(L, kol) {
      var u = UKURAN[L];
      w.style.setProperty('--kt', u[0] + 'px'); w.style.setProperty('--kp', u[1] + 'px'); w.style.setProperty('--kb', u[2] + 'px');
      pil.classList.toggle('c2', kol === 2);
    }
    function muat() {
      if (!kn.isConnected) return;
      var n = tombolPil.length, kolom = n >= 3 ? (teksMaks > 28 ? [1, 2] : [2, 1]) : [1];
      for (var L = 0; L < UKURAN.length; L++) {
        for (var q = 0; q < kolom.length; q++) {
          pasang(L, kolom[q]);
          if (kn.scrollHeight <= kn.clientHeight + 1 && (!sisi || sisi.scrollHeight <= sisi.clientHeight + 1)) return;
        }
      }
    }
    function tekanKey(e) {
      if (jp.selesai() || e.ctrlKey || e.metaKey || e.altKey || !e.key || e.key.length !== 1) return;
      var k = '12345'.indexOf(e.key);
      if (k < 0 || k >= tombolPil.length) return;
      pilihKe(k); e.preventDefault();
    }
    document.addEventListener('keydown', tekanKey);
    api.berhenti = function () { document.removeEventListener('keydown', tekanKey); };
    function petunjukSalah(s) {
      var terpilih = urut.filter(function (o) { return dipilih.indexOf(o) >= 0 && benarAsli.indexOf(o) < 0; });
      for (var k = 0; k < terpilih.length; k++) { var tg = kuisTanggapan(s.pilihan[terpilih[k]]); if (tg) return tg; }
      if (s._pj0) return s._pj0;
      if (jenis === 'jamak') return terpilih.length ? 'Ada pilihan yang belum tepat. Baca lagi dengan teliti, lalu periksa tiap pilihan.' : 'Jawabanmu belum lengkap. Masih ada pilihan benar lain yang belum kamu pilih.';
      return 'Belum tepat. Baca soalnya sekali lagi dengan teliti.';
    }
    jp = jalurSoal(api, daftar, {
      tampil: function (s) {
        jenis = kuisJenis(lv, s);
        var idx = []; for (var k = 0; k < s.pilihan.length; k++) idx.push(k);
        urut = (s.acak !== false && lv.acak !== false) ? acak(idx) : idx;
        benarAsli = kuisBenar(jenis, s); dipilih = []; tombolPil = []; teksMaks = 0;
        w.innerHTML = ''; pil.innerHTML = ''; pil.className = 'pil';
        sisi = null;
        if (s.bacaan || s.gambar) {
          sisi = el('div', 'sisi');
          if (s.gambar) { var gb = el('div', 'gb'); gb.appendChild(api.gambar(s.gambar, 'Gambar soal')); sisi.appendChild(gb); }
          if (s.bacaan) { var bw = el('div', 'k-kertas bc-w', '<div class="bc-h">' + ik('buku') + ' Bacaan</div>'); bw.appendChild(el('div', 'bc', kuisHtml(s.bacaan))); sisi.appendChild(bw); }
          w.appendChild(sisi);
        }
        kn.className = 'kn' + (jenis === 'jamak' ? ' jm' : '');
        tny.innerHTML = (jenis === 'jamak' ? '<div class="jn">Pilih semua jawaban yang benar</div>' : '') + kuisHtml(s.tanya);
        pil.setAttribute('role', jenis === 'jamak' ? 'group' : 'radiogroup');
        urut.forEach(function (o, p) {
          var t = kuisTeks(s.pilihan[o]);
          if (t.length > teksMaks) teksMaks = t.length;
          var b = tombol('<span class="lb">' + KUIS_HURUF[p] + '</span><span class="tx">' + kuisHtml(t) + '</span>', 'sek ops' + (jenis === 'jamak' ? ' jmk' : ''), function () { pilihKe(p); });
          b.setAttribute('role', jenis === 'jamak' ? 'checkbox' : 'radio'); b.setAttribute('aria-checked', 'false');
          tombolPil.push(b); pil.appendChild(b);
        });
        kn.appendChild(tny); kn.appendChild(pil); w.appendChild(kn);
        api.bicara(s.petunjukAwal || lv.petunjuk || (jenis === 'jamak' ? 'Pilih SEMUA jawaban yang benar, lalu tekan Periksa.' : PETUNJUK.kuis));
        muat();
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (kn.isConnected && !jp.selesai()) muat(); });
      },
      siap: function () { return dipilih.length > 0; },
      benar: function (s) {
        var ok = sama(dipilih, benarAsli);
        if (!ok) s.petunjuk = petunjukSalah(s);
        return ok;
      },
      tandai: function (ok) {
        if (ok) {
          tombolPil.forEach(function (b, p) {
            if (dipilih.indexOf(urut[p]) >= 0) { b.classList.remove('pilih'); b.classList.add('betul'); } else b.classList.add('redup');
          });
          pil.classList.add('mati');
          return;
        }
        if (jenis !== 'jamak') tombolPil.forEach(function (b, p) { if (dipilih.indexOf(urut[p]) >= 0) { b.classList.remove('pilih'); b.classList.add('keliru'); } });
        goyang(pil);
      },
      ulangi: function () {
        if (jenis !== 'jamak') { tombolPil.forEach(function (b) { if (b.classList.contains('keliru')) b.classList.add('coret'); }); dipilih = []; segarkan(); }
      },
      teksBenar: function (s) {
        var hs = benarAsli.map(function (o) { return KUIS_HURUF[urut.indexOf(o)]; }).sort();
        var h = hs.length > 1 ? hs.slice(0, -1).join(', ') + ' dan ' + hs[hs.length - 1] : hs[0];
        var tt = kuisTeks(s.pilihan[benarAsli[0]]).replace(/\*/g, '');
        return 'pilihan ' + h + (jenis !== 'jamak' && tt.length <= 40 ? ' (' + tt + ')' : '');
      },
      tampilkanBenar: function () {
        pil.classList.add('mati');
        tombolPil.forEach(function (b, p) {
          var o = urut[p], benar = benarAsli.indexOf(o) >= 0, pernah = dipilih.indexOf(o) >= 0 || b.classList.contains('keliru');
          b.classList.remove('pilih', 'keliru', 'coret', 'redup', 'betul');
          b.classList.add(benar ? 'betul' : pernah ? 'keliru' : 'redup');
          b.firstChild.innerHTML = KUIS_HURUF[p];
        });
      },
      berhenti: api.berhenti
    });
    jp.mulai();
  };

  /* 17. KELUARGA SASARAN (tembak, dan mesin sasaran berikutnya): soal + 3–4 pilihan + SATU jawaban benar.
     Fondasi jalankanSasaran mengurus soal demi soal, acak, hati (lv.nyawa, bawaan 3), bintang (penuh 3, kurang satu 2, lainnya 1),
     petunjuk, ulasan, bank soal; periksaSasaran memeriksa data. Mesin hanya menulis TAMPILAN.
     Benar: soal selesai, tombol Lanjut. Salah: hati −1, sasaran itu 'mati', boleh memilih lagi. Hati habis: bintang 0.
     CARA MENAMBAH MESIN SASARAN BARU: (1) tulis tampilanX(ctx) yang mengembalikan { mulai(soal, urut, st), tandai(k, status),
     hapus(), ukurUlang()? } ; (2) daftarkan di KELUARGA_SASARAN ; (3) tambah ikon di IK, IKON_MESIN, namaMesin, PETUNJUK ; (4) CSS berawalan sendiri.
     ctx: wadah, api, tunggu(ms, fn), aktif(), lapor(k) saat murid memilih sasaran k, teks(asli), muatkanTeks().
     status tandai: betul | keliru | mati | sorot | ulang | selesai. Beri tiap sasaran class 'ss-pil' (+ 'mati') dan teksnya 'ss-teks'
     agar tombol Dengarkan bisa membacanya. Tampilan melepas semua listener/animasi di hapus(). */
  var TB_SUDUT = 80, TB_TW = 200, TB_TH = 76, TB_LARAS = 80, TB_LAJU = 1.3, TB_PY = 52;
  function periksaSasaran(lv, s, label) {
    if (!s || typeof s !== 'object' || s.tanya == null || String(s.tanya).trim() === '') return label + ' belum punya tanya.';
    if (String(s.tanya).length > 150) return label + ': tanya terlalu panjang (' + String(s.tanya).length + ' huruf). Maksimal 150 huruf supaya muat di layar HP.';
    var p = s.pilihan, k, teks = [], t;
    if (!Array.isArray(p) || p.length < 3 || p.length > 4) return label + ': pilihan harus 3–4 item (sekarang ' + (Array.isArray(p) ? p.length : 0) + ').';
    for (k = 0; k < p.length; k++) {
      if (typeof p[k] !== 'string' && typeof p[k] !== 'number') return label + ': pilihan ' + (k + 1) + ' harus berupa teks atau angka (sasaran tidak mendukung gambar atau objek).';
      t = String(p[k]).replace(/\*/g, '').trim();
      if (!t) return label + ': pilihan ' + (k + 1) + ' kosong.';
      if (t.length > 14) return label + ': pilihan ' + (k + 1) + ' terlalu panjang (' + t.length + ' huruf). Maksimal 14 huruf supaya muat di sasaran: "' + t + '"';
      teks.push(t.toLowerCase());
    }
    for (k = 0; k < teks.length; k++) if (teks.indexOf(teks[k]) !== k) return label + ': pilihan ' + (k + 1) + ' sama dengan pilihan lain ("' + String(p[k]) + '"), jadi jawabannya ambigu.';
    if (Array.isArray(s.benar)) return label + ': benar berupa satu angka indeks (mulai dari 0), bukan daftar. Mesin sasaran hanya punya satu jawaban benar.';
    if (typeof s.benar !== 'number' || s.benar !== Math.floor(s.benar) || s.benar < 0 || s.benar >= p.length) return label + ': indeks benar tidak sesuai pilihan (harus bilangan bulat 0 sampai ' + (p.length - 1) + ', tanpa tanda petik; sekarang ' + (typeof s.benar === 'string' ? '"' + s.benar + '"' : s.benar) + ').';
    var tk = ['petunjuk', 'ulasan', 'petunjukAwal'];
    for (k = 0; k < tk.length; k++) if (s[tk[k]] != null && typeof s[tk[k]] !== 'string') return label + ': ' + tk[k] + ' harus berupa teks.';
    if (s.acak != null && typeof s.acak !== 'boolean') return label + ': acak harus true atau false (tanpa tanda petik).';
    if (s.acak !== false && lv.acak !== false) {
      for (k = 0; k < p.length; k++) {
        var tt = String(p[k]).trim();
        if (KUIS_RUJUK.some(function (re) { return re.test(tt); })) return label + ': pilihan ' + (k + 1) + ' ("' + tt + '") merujuk pilihan lain, padahal urutan sasaran diacak. Ganti kalimatnya, atau tulis acak:false pada soal itu.';
      }
    }
    return '';
  }
  function tampilanTembak(ctx) {
    var api = ctx.api, tunggu = ctx.tunggu, teksP = ctx.teks;
    var NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'k-tb-svg'); svg.setAttribute('role', 'img');
    ctx.wadah.appendChild(svg);
    var soal = null, urut = [], st = [];
    var VW = 918, VH = 266, CX = 0, CY = 0, TW = 190, px = [];
    var sudut = 0, siap = false, pernahBidik = false, membidik = false, terbang = false;
    var raf = null, tbl = null, gLaras = null, eBidik = null, eSilang = null, gPel = null, gEf = null;
    function bisaBidik() { return ctx.aktif() && !terbang; }
    function hapus() {
      if (raf != null) { cancelAnimationFrame(raf); raf = null; }
      document.removeEventListener('keydown', tekanKey);
    }

    /* ukuran medan = ukuran kotak svg saat ini (1 satuan = 1 piksel tata letak) */
    function ukur() {
      var cw = svg.clientWidth, ch = svg.clientHeight, n = soal.pilihan.length, k;
      VW = cw > 200 ? cw : (api.area.clientWidth || W) - 42;
      VH = ch > 150 ? ch : 266;
      CX = VW / 2; CY = VH - 46;
      TW = Math.min(TB_TW, Math.floor(VW / n) - 36);
      px = []; for (k = 0; k < n; k++) px.push(VW * (k + 0.5) / n);
      svg.setAttribute('viewBox', '0 0 ' + VW + ' ' + VH);
    }
    /* sinar bidik: berjalan dari poros sampai mengenai sasaran hidup atau keluar medan */
    function sinar(a) {
      var r = a * Math.PI / 180, sx = Math.sin(r), sy = -Math.cos(r), t, x = CX, y = CY, k, n = px.length;
      for (t = TB_LARAS - 20; t < 2400; t += 3) {
        x = CX + sx * t; y = CY + sy * t;
        if (x < -10 || x > VW + 10 || y < -10) return { x: x, y: y, k: -1 };
        for (k = 0; k < n; k++) {
          if (st[k] === 'mati') continue;
          if (Math.abs(x - px[k]) <= TW / 2 + 6 && Math.abs(y - TB_PY) <= TB_TH / 2 + 6) return { x: x, y: y, k: k };
        }
      }
      return { x: x, y: y, k: -1 };
    }
    function pasangArah() {
      var r = sudut * Math.PI / 180, e = sinar(sudut);
      if (!gLaras) return e;
      gLaras.setAttribute('transform', 'rotate(' + sudut + ')');
      eBidik.setAttribute('x1', CX + Math.sin(r) * TB_LARAS); eBidik.setAttribute('y1', CY - Math.cos(r) * TB_LARAS);
      eBidik.setAttribute('x2', e.x); eBidik.setAttribute('y2', e.y);
      eSilang.setAttribute('cx', e.x); eSilang.setAttribute('cy', e.y);
      svg.querySelectorAll('.k-tb-sas').forEach(function (g, k) { g.classList.toggle('bidik', k === e.k); });
      return e;
    }
    function susun() {
      var n = px.length, h = '', k, t, fs;
      h += '<line class="k-tb-bidik" x1="' + CX + '" y1="' + (CY - TB_LARAS) + '" x2="' + CX + '" y2="' + (CY - 300) + '"/>' +
        '<circle class="k-tb-silang" r="11" cx="' + CX + '" cy="' + (CY - 300) + '"/>';
      for (k = 0; k < n; k++) {
        t = teksP(urut[k]);
        fs = Math.max(14, Math.min(26, Math.floor((TW - 36) / (Math.max(t.length, 1) * 0.6))));
        h += '<g class="k-tb-sas ss-pil' + (st[k] ? ' ' + st[k] : '') + '" data-k="' + k + '" transform="translate(' + r1(px[k]) + ' ' + TB_PY + ')"><g class="k-tb-in">' +
          '<line class="k-tb-tiang" x1="0" y1="' + (TB_TH / 2) + '" x2="0" y2="' + (TB_TH / 2 + 22) + '"/>' +
          '<rect class="k-tb-plat" x="' + (-TW / 2) + '" y="' + (-TB_TH / 2) + '" width="' + TW + '" height="' + TB_TH + '" rx="16"/>' +
          '<rect class="k-tb-garis" x="' + (-TW / 2 + 7) + '" y="' + (-TB_TH / 2 + 7) + '" width="' + (TW - 14) + '" height="' + (TB_TH - 14) + '" rx="10"/>' +
          '<text class="k-tb-teks ss-teks" x="0" y="' + r1(fs * 0.35 + 2) + '" font-size="' + fs + '">' + esc(t) + '</text>' +
          '<g class="k-tb-lencana"><circle cx="' + (-TW / 2 + 6) + '" cy="' + (-TB_TH / 2 + 6) + '" r="16"/><text x="' + (-TW / 2 + 6) + '" y="' + (-TB_TH / 2 + 12.5) + '">' + KUIS_HURUF[k] + '</text></g>' +
          '</g></g>';
      }
      h += '<g transform="translate(' + CX + ' ' + CY + ')">' +
        '<path class="k-tb-roda" d="M-62 40L-44 8H44L62 40Z"/>' +
        '<circle class="k-tb-roda" cx="-46" cy="28" r="16"/><circle class="k-tb-roda" cx="46" cy="28" r="16"/>' +
        '<g class="k-tb-laras"><rect x="-17" y="-70" width="34" height="70" rx="8"/><rect x="-23" y="-' + TB_LARAS + '" width="46" height="18" rx="7"/><path d="M-8 -58V-14"/></g>' +
        '<circle class="k-tb-poros" r="21"/></g>' +
        '<g class="k-tb-pel"></g><g class="k-tb-ef"></g>';
      svg.innerHTML = h;
      svg.setAttribute('aria-label', 'Medan tembak dengan ' + n + ' sasaran. Sentuh atau geser untuk membidik, lalu tekan Tembak.');
      gLaras = svg.querySelector('.k-tb-laras'); eBidik = svg.querySelector('.k-tb-bidik'); eSilang = svg.querySelector('.k-tb-silang');
      gPel = svg.querySelector('.k-tb-pel'); gEf = svg.querySelector('.k-tb-ef');
      pasangArah();
    }
    function segarTombol() {
      if (!tbl) return;
      var on = siap && bisaBidik();
      tbl.disabled = !on; tbl.classList.toggle('k-denyut', on);
    }
    function setSudut(a) {
      sudut = Math.max(-TB_SUDUT, Math.min(TB_SUDUT, a));
      if (!siap) { siap = true; if (!pernahBidik) { pernahBidik = true; api.bicara('Sudah pas? Tekan Tembak!'); } segarTombol(); }
      pasangArah();
    }

    /* ── masukan: sentuh/seret/mouse dan papan ketik ── */
    function sudutDari(ev) {
      var m = svg.getScreenCTM(); if (!m) return null;
      var pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
      var p = pt.matrixTransform(m.inverse());
      return Math.atan2(p.x - CX, Math.max(CY - p.y, 1)) * 180 / Math.PI;
    }
    svg.addEventListener('pointerdown', function (ev) {
      if (!bisaBidik() || (ev.pointerType === 'mouse' && ev.button !== 0)) return;
      var a = sudutDari(ev); if (a == null) return;
      membidik = true; try { svg.setPointerCapture(ev.pointerId); } catch (x) {}
      setSudut(a); ev.preventDefault();
    });
    svg.addEventListener('pointermove', function (ev) {
      if (!membidik || !bisaBidik()) return;
      var a = sudutDari(ev); if (a != null) setSudut(a);
    });
    ['pointerup', 'pointercancel'].forEach(function (nm) { svg.addEventListener(nm, function () { membidik = false; }); });
    function tekanKey(ev) {
      if (!bisaBidik() || ev.ctrlKey || ev.metaKey || ev.altKey) return;
      var tg = ev.target && ev.target.tagName, k;
      if (ev.key === 'ArrowLeft') setSudut(sudut - 2);
      else if (ev.key === 'ArrowRight') setSudut(sudut + 2);
      else if ((ev.key === 'Enter' || ev.key === ' ') && tg !== 'BUTTON') tembak();
      else if (/^[1-4]$/.test(ev.key) && +ev.key <= px.length) { k = +ev.key - 1; setSudut(Math.atan2(px[k] - CX, CY - TB_PY) * 180 / Math.PI); }
      else return;
      ev.preventDefault();
    }
    document.addEventListener('keydown', tekanKey);

    /* ── tembak ── */
    function tembak() {
      if (!siap || !bisaBidik()) return;
      terbang = true; svg.classList.add('terbang'); segarTombol();
      Suara.nada(160, 0.14, 'sawtooth', 0.12); Suara.nada(420, 0.08, 'square', 0.06, 0.02); getar(15);
      var r = sudut * Math.PI / 180, e = sinar(sudut);
      var sx = CX + Math.sin(r) * TB_LARAS, sy = CY - Math.cos(r) * TB_LARAS;
      var jarak = Math.sqrt((e.x - sx) * (e.x - sx) + (e.y - sy) * (e.y - sy)), dur = Math.max(160, jarak / TB_LAJU);
      var pel = document.createElementNS(NS, 'circle');
      pel.setAttribute('class', 'k-tb-peluru'); pel.setAttribute('r', '9'); pel.setAttribute('cx', sx); pel.setAttribute('cy', sy);
      var kl = document.createElementNS(NS, 'circle');
      kl.setAttribute('class', 'k-tb-kilat'); kl.setAttribute('r', '16'); kl.setAttribute('cx', sx); kl.setAttribute('cy', sy);
      gPel.appendChild(kl); gPel.appendChild(pel);
      tunggu(300, function () { if (kl.parentNode) kl.parentNode.removeChild(kl); });
      var t0 = null;
      function langkah(now) {
        raf = null;
        if (!ctx.aktif()) return;
        if (t0 == null) t0 = now;
        var f = Math.min(1, (now - t0) / dur);
        pel.setAttribute('cx', sx + (e.x - sx) * f); pel.setAttribute('cy', sy + (e.y - sy) * f);
        if (f < 1) { raf = requestAnimationFrame(langkah); return; }
        if (pel.parentNode) pel.parentNode.removeChild(pel);
        terbang = false; svg.classList.remove('terbang');
        kena(e.k);
      }
      raf = requestAnimationFrame(langkah);
    }
    function pecah(x) {
      var h = '', k, a, d, wr = ['var(--aksen)', 'var(--c2)', '#fff', '#5DBB2F'];
      for (k = 0; k < 12; k++) {
        a = k * 30 * Math.PI / 180; d = 50 + (k % 3) * 22;
        h += '<circle class="k-tb-serpih" cx="' + r1(x) + '" cy="' + TB_PY + '" r="' + (5 + (k % 3) * 2) + '" style="--dx:' + r1(Math.sin(a) * d) + 'px;--dy:' + r1(-Math.cos(a) * d) + 'px;fill:' + wr[k % 4] + ';stroke:var(--lip);stroke-width:2"/>';
      }
      gEf.innerHTML = h;
      tunggu(900, function () { gEf.innerHTML = ''; });
    }
    function kena(k) {
      if (k < 0) {                                   /* meleset: tidak mengurangi hati */
        Suara.klik(); api.bicara('Tembakanmu meleset. Bidik salah satu sasaran, lalu tembak lagi.');
        segarTombol(); pasangArah(); return;
      }
      ctx.lapor(k);
    }
    function tandai(k, s) {
      var g = k >= 0 ? svg.querySelector('.k-tb-sas[data-k="' + k + '"]') : null;
      if (s === 'betul') {
        svg.classList.add('selesai'); segarTombol();
        if (g) { g.classList.remove('bidik'); g.classList.add('betul', 'nyala'); }
        pecah(px[k]);
      } else if (s === 'keliru') {
        if (g) { g.classList.remove('bidik'); g.classList.add('keliru', 'getar'); }
      } else if (s === 'mati') {
        if (g) { g.classList.remove('keliru'); g.classList.add('mati'); }
        pasangArah();
      } else if (s === 'sorot') {
        if (g) g.classList.add('betul');
      } else if (s === 'ulang') {
        pasangArah(); segarTombol();
      } else if (s === 'selesai') {
        svg.classList.add('selesai'); segarTombol();
      }
    }
    function mulai(so, ur, s) {
      soal = so; urut = ur; st = s;
      sudut = 0; siap = false; membidik = false; terbang = false;
      svg.setAttribute('class', 'k-tb-svg');
      ukur(); susun();
      api.bersihAksi();
      tbl = api.aksi(ik('tembak') + ' Tembak', tembak, 'besar');
      segarTombol();
    }
    function ukurUlang() {
      if (terbang || !soal) return;
      var ow = VW, oh = VH;
      ukur();
      if (ow !== VW || oh !== VH) susun();
    }
    return { mulai: mulai, tandai: tandai, hapus: hapus, ukurUlang: ukurUlang };
  }
  /* BALON: balon melayang di tempat, ketuk balon yang jawabannya benar. Tanpa tombol; tanpa waktu. */
  function tampilanBalon(ctx) {
    var api = ctx.api, tunggu = ctx.tunggu, NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'k-bl-svg'); svg.setAttribute('role', 'img');
    ctx.wadah.appendChild(svg);
    var WR = ['var(--c1)', 'var(--c2)', 'var(--aksen)', 'var(--kertas)'];
    var urut = [], st = [], gone = [], gen = 0, fin = false, sorotK = -1, VW = 0, VH = 0, rx = 0, ry = 0, px = [], py = [];
    function hapus() { document.removeEventListener('keydown', tekanKey); }
    function ukur() {
      var n = urut.length, cw = svg.clientWidth, ch = svg.clientHeight, k, f;
      VW = cw > 200 ? cw : (api.area.clientWidth || W) - 42; VH = ch > 150 ? ch : 266;
      rx = Math.max(24, Math.min(76, VW / n / 2 - 14)); ry = rx * 1.14;
      if (ry > (VH - 96) / 2) { ry = Math.max(28, (VH - 96) / 2); rx = Math.max(24, ry / 1.14); }
      f = Math.max(0, Math.min(24, VH - 2 * ry - 78)); px = []; py = [];
      for (k = 0; k < n; k++) { px.push(VW * (k + 0.5) / n); py.push(14 + ry + f * ((k * 0.37) % 1)); }
      svg.setAttribute('viewBox', '0 0 ' + VW + ' ' + VH);
    }
    function susun() {
      var n = px.length, a = r1(rx), b = r1(ry), yc = r1(-0.1 * b), h = '', k, t, fs, lw;
      for (k = 0; k < n; k++) {
        t = ctx.teks(urut[k]);
        fs = Math.max(13, Math.min(28, Math.floor(1.7 * a / (Math.max(t.length, 1) * 0.6)))); lw = Math.min(1.78 * a, t.length * fs * 0.6 + 16);
        h += '<g class="k-bl-sas ss-pil' + (gone[k] ? ' mati' : k === sorotK ? ' betul nyala' : '') + '" data-k="' + k + '" transform="translate(' + r1(px[k]) + ' ' + r1(py[k]) + ')">' +
          '<g class="k-bl-ay" style="--d:' + (3.6 + k * 0.55) + 's;--l:' + (-k * 0.9) + 's"><g class="k-bl-in">' +
          '<path class="k-bl-tali" d="M0 ' + (b + 8) + 'C12 ' + (b + 22) + ' -12 ' + (b + 36) + ' 0 ' + (b + 52) + '"/>' +
          '<path class="k-bl-badan" style="fill:' + WR[k] + '" d="M-8 ' + (b + 11) + 'L0 ' + (b - 3) + 'L8 ' + (b + 11) + 'Z"/>' +
          '<ellipse class="k-bl-badan" style="fill:' + WR[k] + '" rx="' + a + '" ry="' + b + '"/>' +
          '<ellipse class="k-bl-kilau" cx="' + r1(0.42 * a) + '" cy="' + r1(-0.5 * b) + '" rx="' + r1(0.12 * a) + '" ry="' + r1(0.2 * b) + '"/>' +
          '<rect class="k-bl-plat" x="' + r1(-lw / 2) + '" y="' + r1(yc - fs / 2 - 6) + '" width="' + r1(lw) + '" height="' + (fs + 12) + '" rx="10"/>' +
          '<text class="k-tb-teks ss-teks" y="' + r1(yc + fs * 0.35) + '" font-size="' + fs + '">' + esc(t) + '</text>' +
          '<g class="k-tb-lencana"><circle cx="' + r1(-0.62 * a) + '" cy="' + r1(-0.66 * b) + '" r="15"/><text x="' + r1(-0.62 * a) + '" y="' + r1(-0.66 * b + 6.5) + '">' + KUIS_HURUF[k] + '</text></g></g></g></g>';
      }
      svg.innerHTML = h + '<g class="k-bl-ef"></g>';
      svg.setAttribute('aria-label', 'Ada ' + n + ' balon. Ketuk balon yang jawabannya benar.');
    }
    function pecah(k, efek) {
      var g = svg.querySelector('.k-bl-sas[data-k="' + k + '"]'), e = svg.querySelector('.k-bl-ef'), h = '', i, r, d, s;
      gone[k] = true;
      if (!g) return;
      if (efek && e) {
        for (i = 0; i < 12; i++) {
          r = i * Math.PI / 6; d = 50 + (i % 3) * 22;
          h += '<circle class="k-tb-serpih" cx="' + r1(px[k]) + '" cy="' + r1(py[k]) + '" r="' + (5 + (i % 3) * 2) + '" style="--dx:' + r1(Math.sin(r) * d) + 'px;--dy:' + r1(-Math.cos(r) * d) +
            'px;fill:' + [WR[k], 'var(--aksen)', '#fff'][i % 3] + ';stroke:var(--lip);stroke-width:2"/>';
        }
        s = document.createElementNS(NS, 'g'); s.innerHTML = h; e.appendChild(s);
        tunggu(900, function () { if (s.parentNode) s.parentNode.removeChild(s); });
      }
      g.classList.add('mati');
    }
    function tandai(k, s) {
      var g = k >= 0 ? svg.querySelector('.k-bl-sas[data-k="' + k + '"]') : null, gn = gen;
      if (s === 'betul' && g) { fin = true; gone[k] = true; svg.classList.add('selesai'); g.classList.add('betul', 'nyala'); tunggu(260, function () { if (gn === gen) pecah(k, true); }); }
      else if (s === 'keliru' && g) { gone[k] = true; g.classList.add('getar'); tunggu(450, function () { if (gn === gen) pecah(k, true); }); }
      else if (s === 'mati' && st[k] === 'mati') pecah(k, false);
      else if (s === 'sorot' && g) { sorotK = k; g.classList.add('betul', 'nyala'); }
      else if (s === 'selesai') { fin = true; svg.classList.add('selesai'); }
    }
    function pilih(k) { if (ctx.aktif() && !fin && !gone[k] && st[k] !== 'mati') ctx.lapor(k); }
    svg.addEventListener('click', function (ev) {
      var g = ev.target.closest && ev.target.closest('.k-bl-sas');
      if (g) pilih(+g.getAttribute('data-k'));
    });
    function tekanKey(ev) {
      var k = ev.key && ev.key.length === 1 ? '1234'.indexOf(ev.key) : -1;
      if (k < 0 || k >= px.length || ev.ctrlKey || ev.metaKey || ev.altKey) return;
      pilih(k); ev.preventDefault();
    }
    document.addEventListener('keydown', tekanKey);
    function mulai(so, ur, s) {
      gen++; urut = ur; st = s; gone = []; fin = false; sorotK = -1;
      svg.setAttribute('class', 'k-bl-svg'); ukur(); susun(); api.bersihAksi();
    }
    function ukurUlang() { if (!urut.length) return; var ow = VW, oh = VH; ukur(); if (ow !== VW || oh !== VH) susun(); }
    return { mulai: mulai, tandai: tandai, hapus: hapus, ukurUlang: ukurUlang };
  }

  /* PANCING: ikan diam (hanya bergoyang). Geser kail ke atas ikan, tekan Pancing; kail turun dan menangkap ikan di bawahnya. Tanpa waktu. */
  function tampilanPancing(ctx) {
    var api = ctx.api, tunggu = ctx.tunggu, NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'k-pc-svg'); svg.setAttribute('role', 'img');
    ctx.wadah.appendChild(svg);
    var WR = ['var(--c1)', 'var(--c2)', 'var(--aksen)', 'var(--kertas)'], Y0 = 58, LAJU = 0.28;
    var urut = [], st = [], gone = [], gen = 0, fin = false, busy = false, siap = false, pernah = false, geser = false, sorotK = -1;
    var VW = 918, VH = 266, fw = 190, rx = 68, ry = 33, px = [], py = [], hx = 0, yh = Y0, raf = null, tbl = null, eTali = null, gKail = null, gPerahu = null, gEf = null;

    function batalRaf() { if (raf != null) { cancelAnimationFrame(raf); raf = null; } }
    function hapus() { batalRaf(); document.removeEventListener('keydown', tekanKey); }
    function bisa() { return ctx.aktif() && !fin && !busy; }
    function segarTombol() {
      if (!tbl) return;
      var on = siap && bisa();
      tbl.disabled = !on; tbl.classList.toggle('k-denyut', on);
    }
    function ukur() {
      var n = urut.length, cw = svg.clientWidth, ch = svg.clientHeight, k, base;
      VW = cw > 200 ? cw : (api.area.clientWidth || W) - 42; VH = ch > 150 ? ch : 266;
      fw = Math.max(100, Math.min(190, VW / n - 28)); rx = fw * 0.36; ry = Math.min(34, Math.max(22, (VH - 56) * 0.17));
      base = Math.min(Math.round(VH * 0.58), VH - ry - 30); px = []; py = [];
      for (k = 0; k < n; k++) { px.push(VW * (k + 0.5) / n); py.push(Math.min(VH - ry - 12, base + 20 * ((k * 0.37) % 1))); }
      svg.setAttribute('viewBox', '0 0 ' + VW + ' ' + VH);
    }
    function ikanDi(x) {
      for (var k = 0; k < px.length; k++) if (!gone[k] && st[k] !== 'mati' && Math.abs(x - px[k]) <= fw / 2) return k;
      return -1;
    }
    function pasangSorot() {
      var k = siap && !fin ? ikanDi(hx) : -1;
      svg.querySelectorAll('.k-pc-ikan').forEach(function (g, i) { g.classList.toggle('bidik', i === k); });
    }
    function pasangKail() {
      gPerahu.setAttribute('transform', 'translate(' + r1(hx) + ' 0)');
      eTali.setAttribute('y2', r1(yh));
      gKail.setAttribute('transform', 'translate(' + r1(hx) + ' ' + r1(yh) + ')');
    }
    function susun() {
      var n = px.length, cx = fw * 0.14, h = '', k, t, fs, lw, wave = 'M0 56q15-6 30 0' + new Array(Math.ceil(VW / 30)).join('t30 0');
      h += '<rect class="k-pc-air" x="0" y="56" width="' + VW + '" height="' + (VH - 56) + '"/><path class="k-pc-ombak" d="' + wave + '"/>';
      for (k = 0; k < n; k++) {
        t = ctx.teks(urut[k]);
        fs = Math.max(11, Math.min(24, Math.floor(1.5 * rx / (Math.max(t.length, 1) * 0.6))));
        lw = Math.min(rx * 1.75, t.length * fs * 0.6 + 14);
        h += '<g class="k-pc-ikan ss-pil' + (gone[k] ? ' mati' : k === sorotK ? ' betul nyala' : '') + '" data-k="' + k + '" transform="translate(' + r1(px[k]) + ' ' + r1(py[k]) + ')">' +
          '<g class="k-pc-ay" style="--d:' + (3 + k * 0.5) + 's;--l:' + (-k * 0.8) + 's"><g class="k-pc-in">' +
          '<path class="k-pc-ekor k-pc-badan" style="fill:' + WR[k] + '" d="M' + r1(cx - rx + 6) + ' 0L' + r1(-fw / 2) + ' ' + r1(-ry * 0.8) + 'L' + r1(-fw / 2) + ' ' + r1(ry * 0.8) + 'Z"/>' +
          '<ellipse class="k-pc-badan" style="fill:' + WR[k] + '" cx="' + r1(cx) + '" rx="' + r1(rx) + '" ry="' + r1(ry) + '"/>' +
          '<circle class="k-pc-mata" cx="' + r1(cx + rx * 0.7) + '" cy="' + r1(-ry * 0.55) + '" r="4"/>' +
          '<rect class="k-pc-plat" x="' + r1(cx - lw / 2) + '" y="' + r1(-(fs + 10) / 2) + '" width="' + r1(lw) + '" height="' + (fs + 10) + '" rx="9"/>' +
          '<text class="k-pc-teks ss-teks" x="' + r1(cx) + '" y="' + r1(fs * 0.35) + '" font-size="' + fs + '">' + esc(t) + '</text>' +
          '<g class="k-pc-lencana"><circle cx="' + r1(cx - rx * 0.5) + '" cy="' + r1(-ry * 0.92) + '" r="13"/><text x="' + r1(cx - rx * 0.5) + '" y="' + r1(-ry * 0.92 + 6) + '">' + KUIS_HURUF[k] + '</text></g>' +
          '</g></g></g>';
      }
      h += '<g class="k-pc-perahu"><path d="M-36 32H36L25 54H-25Z"/><line class="k-pc-tali" x1="0" y1="40" x2="0" y2="' + Y0 + '"/></g>' +
        '<g><path class="k-pc-kail" d="M0 0v13a6.5 6.5 0 0 1-13 0M-13 13l-4-4"/></g><g class="k-pc-ef"></g>';
      svg.innerHTML = h;
      svg.setAttribute('aria-label', 'Ada ' + n + ' ikan. Geser kail ke ikan yang jawabannya benar, lalu tekan Pancing.');
      gPerahu = svg.querySelector('.k-pc-perahu'); eTali = svg.querySelector('.k-pc-tali'); gKail = svg.querySelector('.k-pc-kail').parentNode; gEf = svg.querySelector('.k-pc-ef');
    }
    function setHx(x) {
      hx = Math.max(24, Math.min(VW - 24, x));
      if (!siap) { siap = true; if (!pernah) { pernah = true; api.bicara('Sudah pas? Tekan Pancing!'); } }
      pasangKail(); pasangSorot(); segarTombol();
    }

    /* gerak lurus dengan requestAnimationFrame; berhenti bila soal berganti (gen) atau tampilan lepas */
    function gerak(dur, langkah, akhir) {
      var gn = gen, t0 = null;
      function f(now) {
        raf = null;
        if (gn !== gen || !svg.isConnected) return;
        if (t0 == null) t0 = now;
        var p = Math.min(1, (now - t0) / dur);
        langkah(p);
        if (p < 1) raf = requestAnimationFrame(f); else akhir();
      }
      raf = requestAnimationFrame(f);
    }
    function tarik(akhir) {
      var a = yh;
      gerak(Math.max(300, (a - Y0) / LAJU * 0.8), function (p) { yh = a + (Y0 - a) * p; pasangKail(); }, akhir);
    }
    function pulih() { busy = false; svg.classList.remove('turun'); segarTombol(); pasangSorot(); }
    function gel(x, y) {
      var h = '', i, a, s;
      for (i = 0; i < 8; i++) {
        a = i * Math.PI / 4;
        h += '<circle class="k-pc-gel" cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + (4 + (i % 3) * 2) + '" style="--dx:' + r1(Math.sin(a) * 40) + 'px;--dy:' + r1(-30 - (i % 3) * 14) + 'px"/>';
      }
      s = document.createElementNS(NS, 'g'); s.innerHTML = h; gEf.appendChild(s);
      tunggu(1000, function () { if (s.parentNode) s.parentNode.removeChild(s); });
    }
    function hilang(k, efek) {
      var g = svg.querySelector('.k-pc-ikan[data-k="' + k + '"]');
      gone[k] = true;
      if (g) { g.classList.remove('bidik'); g.classList.add('mati'); if (efek) gel(px[k], py[k]); }
    }
    function pancing() {
      if (!siap || !bisa()) return;
      busy = true; segarTombol(); svg.classList.add('turun');
      Suara.nada(520, 0.1, 'sine', 0.08); Suara.nada(300, 0.12, 'sine', 0.06, 0.08); getar(12);
      var k = ikanDi(hx), x0 = hx, tx = k >= 0 ? px[k] : hx, y1 = k >= 0 ? py[k] - ry + 2 : VH - 22;
      gerak(Math.max(380, (y1 - Y0) / LAJU), function (p) { hx = x0 + (tx - x0) * p; yh = Y0 + (y1 - Y0) * p; pasangKail(); }, function () {
        if (k >= 0) { ctx.lapor(k); return; }
        Suara.klik(); api.bicara('Kailnya jatuh ke air kosong. Geser ke atas ikan, lalu pancing lagi.');
        tarik(pulih);
      });
    }
    function tandai(k, s) {
      var g = k >= 0 ? svg.querySelector('.k-pc-ikan[data-k="' + k + '"]') : null, gn = gen, a, b;
      if (s === 'betul' && g) {
        fin = true; busy = true; svg.classList.add('selesai'); segarTombol();
        g.classList.remove('bidik'); g.classList.add('betul', 'nyala');
        a = yh; b = Y0 + 4;
        gerak(Math.max(420, (a - b) / 0.3), function (p) {
          yh = a + (b - a) * p; pasangKail();
          g.setAttribute('transform', 'translate(' + r1(hx) + ' ' + r1(yh + ry - 2) + ')');
        }, function () { gel(hx, yh + ry); busy = false; });
      } else if (s === 'keliru' && g) {
        gone[k] = true; g.classList.remove('bidik'); g.classList.add('getar');
        tunggu(450, function () { if (gn === gen) hilang(k, true); });
        tarik(pulih);
      } else if (s === 'mati' && k >= 0 && st[k] === 'mati') hilang(k, false);
      else if (s === 'sorot' && g) { sorotK = k; g.classList.add('betul', 'nyala'); }
      else if (s === 'ulang') { pasangSorot(); segarTombol(); }
      else if (s === 'selesai') { fin = true; svg.classList.add('selesai'); batalRaf(); busy = false; yh = Y0; if (eTali) pasangKail(); segarTombol(); }
    }

    /* ── masukan: sentuh/seret/mouse menggeser kail; papan ketik ── */
    function xDari(ev) {
      var m = svg.getScreenCTM(); if (!m) return null;
      var pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
      return pt.matrixTransform(m.inverse()).x;
    }
    svg.addEventListener('pointerdown', function (ev) {
      if (!bisa() || (ev.pointerType === 'mouse' && ev.button !== 0)) return;
      var x = xDari(ev); if (x == null) return;
      geser = true; try { svg.setPointerCapture(ev.pointerId); } catch (e) {}
      setHx(x); ev.preventDefault();
    });
    svg.addEventListener('pointermove', function (ev) {
      if (!geser || !bisa()) return;
      var x = xDari(ev); if (x != null) setHx(x);
    });
    ['pointerup', 'pointercancel'].forEach(function (nm) { svg.addEventListener(nm, function () { geser = false; }); });
    function tekanKey(ev) {
      if (!bisa() || ev.ctrlKey || ev.metaKey || ev.altKey) return;
      var tg = ev.target && ev.target.tagName, k;
      if (ev.key === 'ArrowLeft') setHx(hx - 16);
      else if (ev.key === 'ArrowRight') setHx(hx + 16);
      else if ((ev.key === 'Enter' || ev.key === ' ') && tg !== 'BUTTON') pancing();
      else if (/^[1-4]$/.test(ev.key) && +ev.key <= px.length) { k = +ev.key - 1; setHx(px[k]); }
      else return;
      ev.preventDefault();
    }
    document.addEventListener('keydown', tekanKey);

    function mulai(so, ur, s) {
      batalRaf(); gen++; urut = ur; st = s; gone = []; fin = false; busy = false; siap = false; geser = false; sorotK = -1; yh = Y0;
      svg.setAttribute('class', 'k-pc-svg'); ukur(); hx = VW / 2; susun(); pasangKail(); api.bersihAksi();
      tbl = api.aksi(ik('pancing') + ' Pancing', pancing, 'besar'); segarTombol();
    }
    function ukurUlang() {
      if (!urut.length || busy || fin) return;
      var ow = VW, oh = VH; ukur();
      if (ow !== VW || oh !== VH) { hx = Math.max(24, Math.min(VW - 24, hx * VW / ow)); susun(); pasangKail(); pasangSorot(); }
    }
    return { mulai: mulai, tandai: tandai, hapus: hapus, ukurUlang: ukurUlang };
  }
  /* TANGKAP: jawaban jatuh pelan dari atas, tiap jawaban di jalurnya sendiri, berulang tanpa batas waktu dan tanpa hukuman bila terlewat.
     Geser keranjang ke bawah satu jawaban dan tahan sampai jawaban itu jatuh masuk. Keranjang yang sedang bergerak tidak menangkap. */
  function tampilanTangkap(ctx) {
    var api = ctx.api, tunggu = ctx.tunggu, NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'k-ct-svg'); svg.setAttribute('role', 'img');
    ctx.wadah.appendChild(svg);
    var WR = ['var(--c1)', 'var(--c2)', 'var(--aksen)', 'var(--kertas)'], DIAM = 250;
    var LAJU = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches ? 0.04 : 0.07;
    var urut = [], st = [], gone = [], caught = [], ys = [], gen = 0, fin = false, tahan = false, siap = false, pernah = false, geser = false, sorotK = -1, diam = 0, raf = null, last = null;
    var VW = 918, VH = 266, tw = 150, ih = 56, bw = 174, bx = 0, bxt = 0, ym = 204, px = [], gIt = [], gKr = null, gEf = null;

    function batalRaf() { if (raf != null) { cancelAnimationFrame(raf); raf = null; } }
    function hapus() { batalRaf(); document.removeEventListener('keydown', tekanKey); }
    function bisa() { return ctx.aktif() && !fin; }
    function ukur() {
      var n = urut.length, cw = svg.clientWidth, ch = svg.clientHeight, k;
      VW = cw > 200 ? cw : (api.area.clientWidth || W) - 42; VH = ch > 150 ? ch : 266;
      tw = Math.max(90, Math.min(150, VW / n - 24)); bw = tw + 24; ym = VH - 62; px = [];
      for (k = 0; k < n; k++) px.push(VW * (k + 0.5) / n);
      svg.setAttribute('viewBox', '0 0 ' + VW + ' ' + VH);
    }
    function pasangItem(k) { gIt[k].setAttribute('transform', 'translate(' + r1(px[k]) + ' ' + r1(ys[k]) + ')'); }
    function pasangKr() { gKr.setAttribute('transform', 'translate(' + r1(bx) + ' ' + r1(ym) + ')'); }
    function susun() {
      var n = px.length, h = '', k, t, fs, a = r1(bw * 0.25);
      h += '<rect class="k-ct-tanah" x="0" y="' + (VH - 14) + '" width="' + VW + '" height="14"/>';
      for (k = 0; k < n; k++) {
        t = ctx.teks(urut[k]);
        fs = Math.max(11, Math.min(22, Math.floor((tw - 20) / (Math.max(t.length, 1) * 0.6))));
        h += '<g class="k-ct-item ss-pil' + (gone[k] ? ' mati' : k === sorotK ? ' betul nyala' : '') + '" data-k="' + k + '"><g class="k-ct-in" style="--w:' + WR[k] + '">' +
          '<rect class="k-ct-kartu" x="' + r1(-tw / 2) + '" y="' + r1(-ih / 2) + '" width="' + r1(tw) + '" height="' + ih + '" rx="14"/>' +
          '<text class="k-ct-teks ss-teks" y="' + r1(fs * 0.35) + '" font-size="' + fs + '">' + esc(t) + '</text>' +
          '<g class="k-ct-lencana"><circle cx="' + r1(-tw / 2 + 6) + '" cy="' + r1(-ih / 2 + 6) + '" r="13"/><text x="' + r1(-tw / 2 + 6) + '" y="' + r1(-ih / 2 + 12) + '">' + KUIS_HURUF[k] + '</text></g>' +
          '</g></g>';
      }
      h += '<g class="k-ct-kr"><path d="M' + r1(-bw / 2) + ' 0H' + r1(bw / 2) + 'L' + r1(bw / 2 - 12) + ' 44H' + r1(-bw / 2 + 12) + 'Z"/>' +
        '<path class="k-ct-anyam" d="M' + (-a) + ' 6V40M0 6V40M' + a + ' 6V40M' + r1(-bw / 2 + 4) + ' 20H' + r1(bw / 2 - 4) + '"/></g><g class="k-ct-ef"></g>';
      svg.innerHTML = h;
      svg.setAttribute('aria-label', 'Ada ' + n + ' jawaban yang jatuh pelan. Geser keranjang ke bawah jawaban yang benar dan tahan.');
      gIt = [].slice.call(svg.querySelectorAll('.k-ct-item')); gKr = svg.querySelector('.k-ct-kr'); gEf = svg.querySelector('.k-ct-ef');
      for (k = 0; k < n; k++) pasangItem(k);
      pasangKr();
    }
    function setBx(x) {
      bxt = Math.max(bw / 2 + 4, Math.min(VW - bw / 2 - 4, x));
      if (!siap) { siap = true; if (!pernah) { pernah = true; api.bicara('Tahan keranjang di bawah jawabannya sampai jatuh masuk!'); } }
    }
    function gel(x, y) {
      var h = '', i, a, s;
      for (i = 0; i < 8; i++) {
        a = i * Math.PI / 4;
        h += '<circle class="k-ct-gel" cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + (4 + (i % 3) * 2) + '" style="--dx:' + r1(Math.sin(a) * 40) + 'px;--dy:' + r1(-30 - (i % 3) * 14) + 'px"/>';
      }
      s = document.createElementNS(NS, 'g'); s.innerHTML = h; gEf.appendChild(s);
      tunggu(1000, function () { if (s.parentNode) s.parentNode.removeChild(s); });
    }
    function hilang(k, efek) {
      gone[k] = true; gIt[k].classList.remove('masuk'); gIt[k].classList.add('mati');
      if (efek) gel(px[k], ys[k]);
    }
    function tangkap(k) {
      caught[k] = true; ys[k] = ym + 14; pasangItem(k); gIt[k].classList.add('masuk');
      Suara.nada(660, 0.08, 'sine', 0.08); getar(12);
      ctx.lapor(k);
    }
    /* putaran gerak: keranjang menyusul sasaran, jawaban jatuh (terlewat = muncul lagi dari atas), tangkap bila keranjang sudah diam di bawahnya */
    function loop(now) {
      raf = null;
      if (!svg.isConnected || fin) return;
      var dt = last == null ? 16 : Math.min(now - last, 50), k, d = bxt - bx;
      last = now;
      if (Math.abs(d) > 1.5) { bx += d * Math.min(1, dt / 70); diam = 0; } else { bx = bxt; diam += dt; }
      pasangKr();
      for (k = 0; k < px.length; k++) {
        if (gone[k] || caught[k]) continue;
        ys[k] += LAJU * dt; if (ys[k] > VH + ih / 2 + 4) ys[k] = -ih / 2 - 4;
        pasangItem(k);
        if (siap && !tahan && diam >= DIAM && ys[k] >= ym - 10 && ys[k] <= ym + 24 && Math.abs(px[k] - bx) <= bw / 2 - 6) { tangkap(k); break; }
      }
      if (fin) return;
      raf = requestAnimationFrame(loop);
    }
    function tandai(k, s) {
      var g = k >= 0 ? gIt[k] : null, gn = gen;
      if (s === 'betul' && g) { fin = true; batalRaf(); svg.classList.add('selesai'); g.classList.add('betul', 'nyala'); gel(px[k], ys[k]); }
      else if (s === 'keliru' && g) {
        tahan = true; g.classList.add('getar');
        tunggu(450, function () { if (gn === gen) { hilang(k, true); tahan = false; } });
      } else if (s === 'mati' && k >= 0 && st[k] === 'mati') hilang(k, false);
      else if (s === 'sorot' && g) { sorotK = k; ys[k] = VH * 0.36; pasangItem(k); g.classList.remove('masuk'); g.classList.add('betul', 'nyala'); }
      else if (s === 'selesai') { fin = true; batalRaf(); svg.classList.add('selesai'); }
    }

    /* ── masukan: sentuh/seret/mouse dan papan ketik menggeser keranjang ── */
    function xDari(ev) {
      var m = svg.getScreenCTM(); if (!m) return null;
      var pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
      return pt.matrixTransform(m.inverse()).x;
    }
    svg.addEventListener('pointerdown', function (ev) {
      if (!bisa() || (ev.pointerType === 'mouse' && ev.button !== 0)) return;
      var x = xDari(ev); if (x == null) return;
      geser = true; try { svg.setPointerCapture(ev.pointerId); } catch (e) {}
      setBx(x); ev.preventDefault();
    });
    svg.addEventListener('pointermove', function (ev) {
      if (!geser || !bisa()) return;
      var x = xDari(ev); if (x != null) setBx(x);
    });
    ['pointerup', 'pointercancel'].forEach(function (nm) { svg.addEventListener(nm, function () { geser = false; }); });
    function tekanKey(ev) {
      if (!bisa() || ev.ctrlKey || ev.metaKey || ev.altKey) return;
      if (ev.key === 'ArrowLeft') setBx(bxt - 24);
      else if (ev.key === 'ArrowRight') setBx(bxt + 24);
      else if (/^[1-4]$/.test(ev.key) && +ev.key <= px.length) setBx(px[+ev.key - 1]);
      else return;
      ev.preventDefault();
    }
    document.addEventListener('keydown', tekanKey);

    function mulai(so, ur, s) {
      batalRaf(); gen++; urut = ur; st = s; gone = []; caught = []; ys = []; fin = false; tahan = false; siap = false; geser = false; sorotK = -1; diam = 0; last = null;
      svg.setAttribute('class', 'k-ct-svg'); ukur();
      for (var k = 0; k < px.length; k++) ys.push(10 + ((k * 0.61) % 1) * 120);
      bx = bxt = VW / 2; susun(); api.bersihAksi();
      raf = requestAnimationFrame(loop);
    }
    function ukurUlang() {
      if (!urut.length || fin || tahan) return;
      var ow = VW, oh = VH, k; ukur();
      if (ow !== VW || oh !== VH) {
        for (k = 0; k < ys.length; k++) ys[k] = ys[k] * VH / oh;
        bx = bxt = Math.max(bw / 2 + 4, Math.min(VW - bw / 2 - 4, bxt * VW / ow)); susun();
      }
    }
    return { mulai: mulai, tandai: tandai, hapus: hapus, ukurUlang: ukurUlang };
  }
  function famSasaran(m) { return Object.prototype.hasOwnProperty.call(KELUARGA_SASARAN, m) ? KELUARGA_SASARAN[m] : null; }
  function jalankanSasaran(lv, api, def) {
    var daftar = ambilSoal(lv).map(function (s) { var c = {}; Object.keys(s).forEach(function (k) { c[k] = s[k]; }); return c; });
    var w = el('div', 'm-ss'), tny = el('div', 'k-kertas tny'), tp = null;
    w.appendChild(tny);
    var maksNyawa = lv.nyawa || 3, nyawa = maksNyawa;
    var ke = 0, soal = null, urut = [], benarAsli = -1, st = [], tuntas = false, hidup = true, tm = [];   /* st[k]: '' | 'mati' */

    function tunggu(ms, fn) {
      var id = setTimeout(function () { if (hidup && w.isConnected) fn(); }, ms);
      tm.push(id); return id;
    }
    function bersih() {
      hidup = false;
      tm.forEach(clearTimeout); tm = [];
      if (tp) tp.hapus();
    }
    api.berhenti = bersih;
    function teksP(o) { return String(soal.pilihan[o]).replace(/\*/g, ''); }
    /* kartu soal tidak boleh bergulir: kecilkan huruf (24 → 17) bila teks melebihi tinggi kartu */
    function muatkanTeks() {
      var fs = 24; tny.style.fontSize = fs + 'px';
      while (fs > 17 && tny.scrollHeight > tny.clientHeight + 1) { fs--; tny.style.fontSize = fs + 'px'; }
    }
    /* murid memilih satu sasaran (indeks tampilan). Benar: soal selesai. Salah: hati −1, sasaran itu mati. */
    function lapor(k) {
      if (!hidup || tuntas || k < 0 || k >= st.length || st[k] === 'mati') return;
      if (urut[k] === benarAsli) {
        tuntas = true; tp.tandai(k, 'betul');
        api.benar(soal.ulasan || null);
        api.bersihAksi();
        api.aksi(ke < daftar.length - 1 ? 'Lanjut ' + ik('lanjut') : 'Selesai ' + ik('centang'), lanjut, 'k-denyut');
        return;
      }
      st[k] = 'mati'; tp.tandai(k, 'keliru');
      nyawa--; api.nyawa(nyawa, maksNyawa);
      if (nyawa <= 0) {                              /* hati habis */
        var bk = urut.indexOf(benarAsli);
        tuntas = true; tp.tandai(-1, 'selesai'); api.bersihAksi(); tp.hapus();
        api.salah((soal.petunjuk ? soal.petunjuk + ' ' : '') + 'Jawaban yang benar: **' + teksP(benarAsli) + '**.');
        tunggu(700, function () { tp.tandai(bk, 'sorot'); });
        api.selesai({ bintang: 0, pesan: 'Nyawamu habis. Ayo coba lagi, pelan-pelan saja!', jeda: 2200 });
        return;
      }
      api.salah(soal.petunjuk || 'Belum tepat. Baca soalnya lagi, lalu coba pilihan yang lain.');
      tunggu(700, function () { tp.tandai(k, 'mati'); });
      tp.tandai(-1, 'ulang');
    }
    function lanjut() {
      ke++;
      if (ke >= daftar.length) {
        api.bersihAksi(); tp.hapus(); api.progres(daftar.length, daftar.length);
        api.selesai({ bintang: nyawa >= maksNyawa ? 3 : nyawa >= maksNyawa - 1 ? 2 : 1 });
      } else mulaiSoal();
    }
    function mulaiSoal() {
      soal = daftar[ke];
      var idx = [], k; for (k = 0; k < soal.pilihan.length; k++) idx.push(k);
      urut = (soal.acak !== false && lv.acak !== false) ? acak(idx) : idx;
      benarAsli = soal.benar;
      st = urut.map(function () { return ''; });
      tuntas = false;
      api.progres(ke, daftar.length);
      tny.innerHTML = kuisHtml(soal.tanya); muatkanTeks();
      tp.mulai(soal, urut, st);
      api.bicara(soal.petunjukAwal || lv.petunjuk || PETUNJUK[lv.mesin]);
    }
    tp = def.tampilan({ wadah: w, api: api, tunggu: tunggu, aktif: function () { return hidup && w.isConnected && !tuntas; }, lapor: lapor, teks: teksP, muatkanTeks: muatkanTeks });
    api.area.appendChild(w);
    api.nyawa(nyawa, maksNyawa);
    mulaiSoal();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () {
      if (!hidup || !w.isConnected || !soal) return;
      muatkanTeks(); if (tp.ukurUlang) tp.ukurUlang();
    });
  }
  var KELUARGA_SASARAN = { tembak: { tampilan: tampilanTembak }, balon: { tampilan: tampilanBalon }, pancing: { tampilan: tampilanPancing }, tangkap: { tampilan: tampilanTangkap } };
  Object.keys(KELUARGA_SASARAN).forEach(function (n) {
    MESIN[n] = function (lv, api) { jalankanSasaran(lv, api, KELUARGA_SASARAN[n]); };
  });


  /* ════════════════════════════ VALIDASI ════════════════════════════ */
  /* bacaan gaya:'buku' — dipanggil dari periksaData untuk tiap level bacaan.
     d = DATA, lv = level, n = awalan pesan "Level N: ", e = daftar galat, kata = penghitung kata */
  function bukuPeriksa(d, lv, n, e, kata) {
    var buku = lv.gaya === 'buku';
    if (lv.gaya != null && !buku) e.push(n + 'gaya "' + lv.gaya + '" tidak dikenal. Satu-satunya pilihan: "buku" (atau hapus gaya untuk bacaan biasa).');
    if (lv.gaya == null) ['sampul', 'animasi'].forEach(function (k) {
      if (lv[k] !== undefined) e.push(n + k + ' hanya berlaku bila gaya:"buku".');
    });
    if (buku) {
      if (lv.animasi !== undefined && typeof lv.animasi !== 'boolean') e.push(n + 'animasi harus true atau false (tanpa tanda petik).');
      if (lv.sampul !== undefined) {
        var S = lv.sampul;
        if (!S || typeof S !== 'object' || Array.isArray(S)) e.push(n + 'sampul harus berupa objek { judul:"...", gambar:"link" } (gambar boleh dihilangkan).');
        else {
          if (typeof S.judul !== 'string' || !S.judul.trim()) e.push(n + 'sampul.judul belum diisi.');
          else if (kata(S.judul) > 10) e.push(n + 'sampul.judul terlalu panjang (' + kata(S.judul) + ' kata). Maksimal 10 kata.');
          if (S.gambar !== undefined && (typeof S.gambar !== 'string' || !S.gambar.trim())) e.push(n + 'sampul.gambar harus berupa teks (link atau nama kunci di DATA.gambar).');
        }
      }
    }
    var kelasMaks = { 1: 25, 2: 40, 3: 55, 4: 65 }[+((d.identitas || {}).kelas)];
    (lv.halaman || []).forEach(function (h, j) {
      h = h || {};
      var p = n + 'halaman ' + (j + 1) + ': ', g = h.gambar;
      if (!buku) {
        if (Array.isArray(g)) e.push(p + 'gambar berupa daftar hanya untuk gaya:"buku". Pakai satu gambar (teks) atau tambahkan gaya:"buku".');
        if (h.namaGambar !== undefined) e.push(p + 'namaGambar hanya berlaku bila gaya:"buku".');
        return;
      }
      /* batas kata gaya buku = min(batas lama, 45); batas lama sudah dilaporkan periksaData bila terlampaui dan lebih kecil */
      var lama = (g || h.adegan) ? 55 : 70;
      if (kelasMaks && kelasMaks < lama) lama = kelasMaks;
      var kt = kata(h.teks);
      if (kt > 45 && !(lama <= 45 && kt > lama)) e.push(p + 'teks terlalu panjang untuk gaya buku (' + kt + ' kata). Maksimal 45 kata per halaman, pecah jadi dua halaman.');
      if (g != null && typeof g !== 'string' && !Array.isArray(g)) e.push(p + 'gambar harus teks (satu gambar) atau daftar 2–4 teks.');
      if (Array.isArray(g)) {
        if (g.length < 2) e.push(p + 'daftar gambar minimal 2. Untuk satu gambar tulis teks biasa, bukan daftar.');
        else if (g.length > 4) e.push(p + 'gambar maksimal 4 per halaman (sekarang ' + g.length + ').');
        if (g.some(function (x) { return typeof x !== 'string' || !x.trim(); })) e.push(p + 'tiap gambar harus berupa teks (link atau nama kunci di DATA.gambar) yang tidak kosong.');
      }
      if (h.namaGambar !== undefined) {
        if (!Array.isArray(g)) e.push(p + 'namaGambar hanya dipakai bila gambar berupa daftar.');
        else if (!Array.isArray(h.namaGambar) || h.namaGambar.length !== g.length) e.push(p + 'namaGambar harus daftar teks dengan jumlah sama dengan gambar (' + g.length + ' nama).');
        else h.namaGambar.forEach(function (nm, k) {
          if (typeof nm !== 'string' || !nm.trim()) e.push(p + 'namaGambar ke-' + (k + 1) + ' kosong.');
          else if (kata(nm) > 3) e.push(p + 'namaGambar ke-' + (k + 1) + ' terlalu panjang (' + kata(nm) + ' kata). Maksimal 3 kata.');
        });
      }
    });
  }

  function periksaData(d) {
    var e = [];
    if (!d || typeof d !== 'object') return ['DATA tidak ditemukan. Panggil KIT.mulai({ ... }).'];
    if (!d.judul) e.push('judul belum diisi.');
    if (d.tema && !TEMA[d.tema]) e.push('tema "' + d.tema + '" tidak dikenal. Pilih: ' + Object.keys(TEMA).join(', ') + '.');
    if (d.maskot && d.maskot.pose != null) {
      var po = d.maskot.pose;
      if (typeof po !== 'object' || Array.isArray(po)) e.push('maskot.pose harus berbentuk { senang:\'link\', berpikir:\'link\' }.');
      else Object.keys(po).forEach(function (k) {
        if (k !== 'senang' && k !== 'berpikir') e.push('maskot.pose hanya boleh berisi kunci senang atau berpikir (ada "' + k + '").');
        else if (typeof po[k] !== 'string' || !po[k]) e.push('maskot.pose.' + k + ' harus berupa alamat gambar (teks).');
      });
    }
    if (!Array.isArray(d.level) || !d.level.length) { e.push('level belum diisi (minimal 1 level).'); return e; }
    /* Batas isi per layar supaya tetap terbaca di layar HP */
    var kata = function (t) { return String(t || '').split(/\s+/).filter(Boolean).length; };
    if (d.level.length > 5) e.push('level terlalu banyak (' + d.level.length + '). Maksimal 5 level.');
    if (d.cerita && d.cerita.length > 5) e.push('cerita pembuka maksimal 5 adegan (sekarang ' + d.cerita.length + ').');
    (d.cerita || []).forEach(function (c, j) {
      var t = typeof c === 'string' ? c : (c && c.teks);
      if (kata(t) > 40) e.push('cerita pembuka adegan ' + (j + 1) + ' terlalu panjang (' + kata(t) + ' kata). Maksimal 40 kata, pecah jadi dua adegan.');
    });
    d.level.forEach(function (lv, i) {
      var n = 'Level ' + (i + 1) + ': ';
      var maks = function (k, m, satuan) { if (Array.isArray(lv[k]) && lv[k].length > m) e.push(n + k + ' maksimal ' + m + ' ' + (satuan || 'item') + ' supaya muat di layar HP (sekarang ' + lv[k].length + ').'); };
      if (!MESIN[lv.mesin]) { e.push(n + 'mesin "' + lv.mesin + '" tidak dikenal. Pilih: ' + Object.keys(MESIN).join(', ') + '.'); return; }
      var arr = function (k, min) { if (!Array.isArray(lv[k]) || lv[k].length < (min || 1)) e.push(n + k + ' harus berisi minimal ' + (min || 1) + ' item.'); };
      if (lv.mesin === 'cerita') {
        arr('adegan');
        (lv.adegan || []).forEach(function (a, j) {
          if (a.pilihan && !a.pilihan.some(function (p) { return p.benar; })) e.push(n + 'adegan ' + (j + 1) + ' tidak punya pilihan yang benar.');
          if (a.pilihan && a.pilihan.length > 3) e.push(n + 'adegan ' + (j + 1) + ' maksimal 3 pilihan.');
          var bt = a.pilihan ? 45 : 60;
          if (kata(a.teks) + kata(a.tanya) > bt) e.push(n + 'adegan ' + (j + 1) + ' terlalu panjang (' + (kata(a.teks) + kata(a.tanya)) + ' kata). Maksimal ' + bt + ' kata, pecah jadi dua adegan.');
        });
      }
      if (lv.mesin === 'bacaan') {
        arr('halaman');
        (lv.halaman || []).forEach(function (h, j) {
          var a = h.aktivitas;
          if (!h.teks) e.push(n + 'halaman ' + (j + 1) + ' belum ada teksnya.');
          if (h.adegan != null) {
            var ad = h.adegan, np = n + 'halaman ' + (j + 1) + ' adegan: ';
            if (typeof ad !== 'object' || Array.isArray(ad)) e.push(np + 'harus berbentuk { latar, objek:[...], maskot }.');
            else {
              if (ad.latar != null && (typeof ad.latar !== 'string' || !ad.latar)) e.push(np + 'latar harus berupa alamat gambar (teks).');
              if (!Array.isArray(ad.objek) || ad.objek.length < 1 || ad.objek.length > 5) e.push(np + 'objek harus berisi 1–5 item (sekarang ' + (Array.isArray(ad.objek) ? ad.objek.length : 0) + ').');
              else ad.objek.forEach(function (o, q) {
                var no = np + 'objek ' + (q + 1) + ' ';
                if (!o || typeof o !== 'object') { e.push(no + 'harus berbentuk { gambar, nama }.'); return; }
                if (typeof o.gambar !== 'string' || !o.gambar) e.push(no + 'belum punya gambar (alamat gambar berupa teks).');
                if (typeof o.nama !== 'string' || !o.nama.trim()) e.push(no + 'belum punya nama.');
                else if (o.nama.trim().split(/\s+/).length > 3) e.push(no + 'nama terlalu panjang ("' + o.nama + '"). Maksimal 3 kata.');
                if (o.posisi != null && ADEGAN_POSISI.indexOf(o.posisi) < 0) e.push(no + 'posisi "' + o.posisi + '" tidak dikenal. Pilih: kiri, tengah, atau kanan.');
              });
              if (ad.maskot != null && ad.maskot !== false && ADEGAN_MASKOT.indexOf(ad.maskot) < 0) e.push(np + 'maskot "' + ad.maskot + '" tidak dikenal. Pilih: biasa, senang, berpikir, atau false.');
            }
          }
          var bk = (h.gambar || h.adegan) ? 55 : 70;
          var bkKelas = { 1: 25, 2: 40, 3: 55, 4: 65 }[+((d.identitas || {}).kelas)];
          if (bkKelas && bkKelas < bk) bk = bkKelas;
          if (kata(h.teks) > bk) e.push(n + 'halaman ' + (j + 1) + ' terlalu panjang (' + kata(h.teks) + ' kata). Maksimal ' + bk + ' kata per halaman, pecah jadi dua halaman.');
          if (a && a.pilihan && a.pilihan.length > 3) e.push(n + 'halaman ' + (j + 1) + ': pilihan maksimal 3.');
          if (a && a.jenis === 'bukti' && h.teks && h.teks.toLowerCase().indexOf(String(a.kunci).toLowerCase()) < 0)
            e.push(n + 'halaman ' + (j + 1) + ': kunci bukti "' + a.kunci + '" tidak ada di teks.');
          if (a && a.jenis === 'rumpang' && !/\[.+?\]/.test(a.kalimat || '')) e.push(n + 'halaman ' + (j + 1) + ': kalimat rumpang belum punya [kata].');
          if (a && a.jenis === 'pilih' && (!a.pilihan || a.pilihan[a.benar] == null)) e.push(n + 'halaman ' + (j + 1) + ': indeks benar tidak sesuai pilihan.');
        });
      }
      if (lv.mesin === 'bacaan') bukuPeriksa(d, lv, n, e, kata);
      if (lv.mesin === 'sortir') {
        arr('kategori', 2); arr('kartu', 2); maks('kategori', 3); maks('kartu', 10, 'kartu');
        (lv.kartu || []).forEach(function (k, j) { if (!(lv.kategori || [])[k.ke]) e.push(n + 'kartu ' + (j + 1) + ' menunjuk kategori ke-' + k.ke + ' yang tidak ada (mulai dari 0).'); });
      }
      var maksBank = function (k, m, satuan) {
        var tampil = lv.jumlah && Array.isArray(lv[k]) ? Math.min(lv.jumlah, lv[k].length) : (Array.isArray(lv[k]) ? lv[k].length : 0);
        if (tampil > m) e.push(n + k + ' maksimal ' + m + ' ' + satuan + ' sekali main (pakai jumlah:' + m + ' bila ingin bank soal lebih banyak).');
        if (Array.isArray(lv[k]) && lv[k].length > 15) e.push(n + k + ' maksimal 15 ' + satuan + ' di bank soal.');
      };
      if (lv.mesin === 'cocokkan') { arr('pasangan', 2); maksBank('pasangan', 5, 'pasang'); }
      if (lv.mesin === 'urutkan') { arr('urutan', 3); maks('urutan', 5, 'langkah'); }
      if (lv.mesin === 'runner') {
        if (!lv.soal && typeof lv.buatSoal !== 'function') e.push(n + 'isi soal (daftar) atau buatSoal (fungsi).');
        (lv.soal || []).forEach(function (s, j) {
          if (!s.pilihan || s.pilihan.length !== 3) e.push(n + 'soal ' + (j + 1) + ' harus punya tepat 3 pilihan.');
          else if (s.pilihan[s.benar] == null) e.push(n + 'soal ' + (j + 1) + ': indeks benar tidak sesuai.');
          else if (s.pilihan.some(function (x) { return String(x).length > 14; })) e.push(n + 'soal ' + (j + 1) + ': teks pilihan maksimal 14 huruf supaya muat di gerbang.');
        });
        if (typeof lv.buatSoal === 'function') {
          try {
            for (var q = 0; q < 5; q++) {
              var s = lv.buatSoal(q);
              if (!s || !s.pilihan || s.pilihan.length !== 3 || s.pilihan[s.benar] == null) { e.push(n + 'buatSoal harus mengembalikan {tanya, pilihan:[3], benar}.'); break; }
              if (new Set(s.pilihan.map(String)).size !== 3) { e.push(n + 'buatSoal menghasilkan pilihan kembar: ' + s.pilihan.join(', ')); break; }
              if (s.pilihan.some(function (x) { return String(x).length > 14; })) { e.push(n + 'buatSoal: teks pilihan maksimal 14 huruf (' + s.pilihan.join(', ') + ').'); break; }
            }
          } catch (er) { e.push(n + 'buatSoal error: ' + er.message); }
        }
        [['kecepatan', 0.3, 2], ['naik', 0, 0.3], ['batas', 0.5, 2.2]].forEach(function (c) {
          var v = lv[c[0]];
          if (v == null) return;
          if (typeof v !== 'number' || !isFinite(v) || v < c[1] || v > c[2]) e.push(n + c[0] + ' harus angka ' + c[1] + '–' + c[2] + ' tanpa tanda petik (sekarang ' + (typeof v === 'string' ? '"' + v + '"' : String(v)) + ').');
        });
      }
      if (lv.mesin === 'memori') { arr('pasangan', 2); maksBank('pasangan', 6, 'pasang'); }
      if (lv.mesin === 'isian') {
        if (!lv.soal && typeof lv.buatSoal !== 'function') e.push(n + 'isi soal (daftar) atau buatSoal (fungsi).');
        maksBank('soal', 8, 'soal');
        var cekIsian = function (s, label) {
          if (!s || !s.tanya) { e.push(n + label + ' belum punya tanya.'); return false; }
          var js = Array.isArray(s.jawab) ? s.jawab : [s.jawab];
          if (s.jawab == null || !js.length) { e.push(n + label + ' belum punya jawab.'); return false; }
          if (!s.persis && js.some(function (j) { return isNaN(angkaDari(j)); })) { e.push(n + label + ': jawab harus berupa angka (contoh 75000, 2,5, atau 3/4). Sekarang: ' + js.join(', ')); return false; }
          return true;
        };
        (lv.soal || []).forEach(function (s, j) { cekIsian(s, 'soal ' + (j + 1)); });
        if (!lv.soal && typeof lv.buatSoal === 'function') {
          try { for (var q2 = 0; q2 < 5; q2++) if (!cekIsian(lv.buatSoal(q2), 'buatSoal(' + q2 + ')')) break; }
          catch (er) { e.push(n + 'buatSoal error: ' + er.message); }
        }
      }
      if (lv.mesin === 'garis') {
        if (!lv.soal && typeof lv.buatSoal !== 'function') e.push(n + 'isi soal (daftar) atau buatSoal (fungsi).');
        maksBank('soal', 8, 'soal');
        var cekGaris = function (s, label) {
          if (!s || !s.tanya) { e.push(n + label + ' belum punya tanya.'); return false; }
          var c = cfgGaris(lv, s), j = angkaDari(s.jawab);
          if (!(c.sampai > c.dari) || !(c.langkah > 0) || !(c.bagi >= 1 && c.bagi <= 10 && c.bagi === Math.floor(c.bagi))) { e.push(n + label + ': pengaturan garis tidak benar (dari < sampai, langkah > 0, bagi bilangan bulat 1–10).'); return false; }
          var tk = (c.sampai - c.dari) * c.bagi / c.langkah;
          if (Math.abs(tk - Math.round(tk)) > 1e-6) { e.push(n + label + ': (sampai − dari) harus habis dibagi langkah.'); return false; }
          if (Math.round(tk) > 40) { e.push(n + label + ': garis terlalu rapat (' + Math.round(tk) + ' tanda). Maksimal 40; perbesar langkah atau kurangi bagi.'); return false; }
          if (isNaN(j)) { e.push(n + label + ': jawab harus berupa angka (contoh 7, 0,5, atau 3/4). Sekarang: ' + s.jawab); return false; }
          var pos = (j - c.dari) / c.sel;
          if (pos < -1e-6 || pos > c.n + 1e-6 || Math.abs(pos - Math.round(pos)) > 1e-6) { e.push(n + label + ': jawab ' + s.jawab + ' tidak jatuh di tanda garis (dari ' + c.dari + ' sampai ' + c.sampai + ', tiap ' + c.sel + ').'); return false; }
          return true;
        };
        (lv.soal || []).forEach(function (s, j) { cekGaris(s, 'soal ' + (j + 1)); });
        if (!lv.soal && typeof lv.buatSoal === 'function') {
          try { for (var qg = 0; qg < 5; qg++) if (!cekGaris(lv.buatSoal(qg), 'buatSoal(' + qg + ')')) break; }
          catch (er) { e.push(n + 'buatSoal error: ' + er.message); }
        }
      }
      if (lv.mesin === 'pecahan') {
        if (!lv.soal && typeof lv.buatSoal !== 'function') e.push(n + 'isi soal (daftar) atau buatSoal (fungsi).');
        maksBank('soal', 8, 'soal');
        var bulat = function (x, a, b) { return typeof x === 'number' && x >= a && x <= b && x === Math.floor(x); };
        var cekPec = function (s, label) {
          if (!s || !s.tanya) { e.push(n + label + ' belum punya tanya.'); return false; }
          var bg = s.bagi != null ? s.bagi : lv.bagi, jn = s.jenis || lv.jenis || 'warnai', bt = s.bentuk || lv.bentuk || 'batang';
          if (!bulat(bg, 2, 12)) { e.push(n + label + ': bagi harus bilangan bulat 2–12 (sekarang ' + bg + ').'); return false; }
          if (bt !== 'batang' && bt !== 'lingkaran') { e.push(n + label + ': bentuk harus \'batang\' atau \'lingkaran\'.'); return false; }
          if (jn !== 'warnai' && jn !== 'baca') { e.push(n + label + ': jenis harus \'warnai\' atau \'baca\'.'); return false; }
          if (jn === 'warnai' && !bulat(s.jawab, 1, bg)) { e.push(n + label + ': jawab = banyak bagian yang diwarnai (bilangan bulat 1 sampai ' + bg + ').'); return false; }
          if (jn === 'baca') {
            if (!bulat(s.warna, 1, bg)) { e.push(n + label + ': warna = banyak bagian yang sudah berwarna (bilangan bulat 1 sampai ' + bg + ').'); return false; }
            if (!Array.isArray(s.pilihan) || s.pilihan.length < 2 || s.pilihan.length > 4) { e.push(n + label + ': pilihan harus 2–4 item.'); return false; }
            if (s.pilihan[s.benar] == null) { e.push(n + label + ': indeks benar tidak sesuai pilihan.'); return false; }
          }
          return true;
        };
        (lv.soal || []).forEach(function (s, j) { cekPec(s, 'soal ' + (j + 1)); });
        if (!lv.soal && typeof lv.buatSoal === 'function') {
          try { for (var qp = 0; qp < 5; qp++) if (!cekPec(lv.buatSoal(qp), 'buatSoal(' + qp + ')')) break; }
          catch (er) { e.push(n + 'buatSoal error: ' + er.message); }
        }
      }
      if (lv.mesin === 'jam') {
        if (!lv.soal && typeof lv.buatSoal !== 'function') e.push(n + 'isi soal (daftar) atau buatSoal (fungsi).');
        maksBank('soal', 8, 'soal');
        var cekJam = function (s, label) {
          if (!s || !s.tanya) { e.push(n + label + ' belum punya tanya.'); return false; }
          var jn = s.jenis || lv.jenis || 'putar', lg = s.langkah != null ? s.langkah : (lv.langkah != null ? lv.langkah : 5);
          var dg = s.digital != null ? s.digital : lv.digital;
          var bentukJam = function (x) { return /^\d{1,2}:\d{2}$/.test(String(x == null ? '' : x).trim()) && !isNaN(waktuMenit(x)); };
          if (jn !== 'putar' && jn !== 'baca') { e.push(n + label + ': jenis harus \'putar\' atau \'baca\' (sekarang ' + jn + ').'); return false; }
          if ([1, 5, 15, 30].indexOf(lg) < 0) { e.push(n + label + ': langkah harus 1, 5, 15, atau 30 menit (sekarang ' + lg + ').'); return false; }
          if (dg != null && typeof dg !== 'boolean') { e.push(n + label + ': digital harus true atau false (tanpa tanda petik).'); return false; }
          if (jn === 'putar') {
            if (!bentukJam(s.jawab)) { e.push(n + label + ': jawab harus berbentuk \'JJ:MM\' dengan jam 0–23 dan menit 00–59 (contoh \'03:15\'). Sekarang: ' + s.jawab); return false; }
            var mn = +String(s.jawab).trim().split(':')[1];
            if (mn % lg !== 0) { e.push(n + label + ': menit pada jawab ' + s.jawab + ' tidak bisa dicapai jarum dengan langkah ' + lg + '. Pakai menit kelipatan ' + lg + ' atau ubah langkah.'); return false; }
          } else {
            if (!bentukJam(s.jam)) { e.push(n + label + ': jam (waktu yang ditampilkan) harus berbentuk \'JJ:MM\' dengan jam 0–23 dan menit 00–59 (contoh \'03:15\'). Sekarang: ' + s.jam); return false; }
            if (!Array.isArray(s.pilihan) || s.pilihan.length < 2 || s.pilihan.length > 4) { e.push(n + label + ': pilihan harus 2–4 item.'); return false; }
            if (typeof s.benar !== 'number' || s.benar !== Math.floor(s.benar) || s.pilihan[s.benar] == null) { e.push(n + label + ': indeks benar tidak sesuai pilihan (mulai dari 0).'); return false; }
            if (s.pilihan.some(function (x) { return String(x).length > 14; })) { e.push(n + label + ': teks pilihan maksimal 14 huruf supaya muat di tombol.'); return false; }
            if (new Set(s.pilihan.map(function (x) { return String(x).trim(); })).size !== s.pilihan.length) { e.push(n + label + ': pilihan tidak boleh kembar (' + s.pilihan.join(', ') + ').'); return false; }
            var tm = waktuMenit(s.jam);
            for (var pj = 0; pj < s.pilihan.length; pj++) {
              var wp = waktuMenit(s.pilihan[pj]);
              if (isNaN(wp)) continue;
              if (pj === s.benar && wp !== tm) { e.push(n + label + ': pilihan benar (' + s.pilihan[pj] + ') tidak sama dengan jam yang ditampilkan (' + teksJam(s.jam) + ').'); return false; }
              if (pj !== s.benar && wp === tm) { e.push(n + label + ': pilihan ' + (pj + 1) + ' (' + s.pilihan[pj] + ') juga sama dengan jam yang ditampilkan, jadi ada dua jawaban benar.'); return false; }
            }
          }
          return true;
        };
        (lv.soal || []).forEach(function (s, j) { cekJam(s, 'soal ' + (j + 1)); });
        if (!lv.soal && typeof lv.buatSoal === 'function') {
          try { for (var qj = 0; qj < 5; qj++) if (!cekJam(lv.buatSoal(qj), 'buatSoal(' + qj + ')')) break; }
          catch (er) { e.push(n + 'buatSoal error: ' + er.message); }
        }
      }
      if (lv.mesin === 'uang') {
        if (!lv.soal && typeof lv.buatSoal !== 'function') e.push(n + 'isi soal (daftar) atau buatSoal (fungsi).');
        maksBank('soal', 8, 'soal');
        var bulatUang = function (x, a, b) { return typeof x === 'number' && isFinite(x) && x === Math.floor(x) && x >= a && x <= b; };
        var cekUang = function (s, label) {
          if (!s || !s.tanya) { e.push(n + label + ' belum punya tanya.'); return false; }
          var jn = jenisUang(lv, s), pc = pecahanUang(lv, s), tg;
          if (String(s.tanya).length > 150) { e.push(n + label + ': tanya terlalu panjang (' + String(s.tanya).length + ' huruf). Maksimal 150 huruf supaya muat di layar HP.'); return false; }
          if (jn !== 'susun' && jn !== 'kembalian') { e.push(n + label + ': jenis harus \'susun\' atau \'kembalian\' (sekarang ' + jn + ').'); return false; }
          if (!Array.isArray(pc) || pc.length < 2 || pc.length > 6) { e.push(n + label + ': pecahan harus berisi 2–6 nominal (contoh [500, 1000, 2000, 5000]).'); return false; }
          if (pc.some(function (p) { return !bulatUang(p, 100, 100000); })) { e.push(n + label + ': setiap nominal pecahan harus bilangan bulat 100–100000, tanpa titik dan tanpa tanda petik. Sekarang: ' + pc.join(', ')); return false; }
          if (new Set(pc).size !== pc.length) { e.push(n + label + ': pecahan tidak boleh kembar (' + pc.join(', ') + ').'); return false; }
          if (jn === 'susun') {
            if (!bulatUang(s.target, 1, 1000000)) { e.push(n + label + ': target harus bilangan bulat 1–1000000, tanpa titik dan tanpa tanda petik (contoh 7500). Sekarang: ' + s.target); return false; }
            tg = s.target;
          } else {
            if (!bulatUang(s.harga, 1, 1000000) || !bulatUang(s.bayar, 1, 1000000)) { e.push(n + label + ': jenis kembalian butuh harga dan bayar berupa bilangan bulat 1–1000000, tanpa titik dan tanpa tanda petik (contoh harga: 8500, bayar: 10000). Sekarang: harga ' + (s.harga == null ? '(kosong)' : s.harga) + ', bayar ' + (s.bayar == null ? '(kosong)' : s.bayar)); return false; }
            if (s.bayar <= s.harga) { e.push(n + label + ': bayar (' + s.bayar + ') harus lebih besar dari harga (' + s.harga + ') supaya ada kembalian.'); return false; }
            tg = s.bayar - s.harga;
            if (s.target != null && s.target !== tg) { e.push(n + label + ': target (' + s.target + ') tidak sama dengan bayar − harga (' + tg + '). Hapus target; MPI menghitung kembalian sendiri.'); return false; }
          }
          if (!susunUang(tg, pc, UANG_MAKS)) { e.push(n + label + ': ' + (jn === 'kembalian' ? 'kembalian ' : 'target ') + tg + ' tidak bisa disusun dari pecahan ' + pc.join(', ') + ' dengan paling banyak ' + UANG_MAKS + ' lembar. Ubah angkanya atau ganti pecahannya.'); return false; }
          return true;
        };
        (lv.soal || []).forEach(function (s, j) { cekUang(s, 'soal ' + (j + 1)); });
        if (!lv.soal && typeof lv.buatSoal === 'function') {
          try { for (var qu = 0; qu < 5; qu++) if (!cekUang(lv.buatSoal(qu), 'buatSoal(' + qu + ')')) break; }
          catch (er) { e.push(n + 'buatSoal error: ' + er.message); }
        }
      }
      if (lv.mesin === 'timbangan') {
        if (!lv.soal && typeof lv.buatSoal !== 'function') e.push(n + 'isi soal (daftar) atau buatSoal (fungsi).');
        maksBank('soal', 8, 'soal');
        var bulatTim = function (x, a, b) { return typeof x === 'number' && isFinite(x) && x === Math.floor(x) && x >= a && x <= b; };
        var cekTim = function (s, label) {
          if (!s || !s.tanya) { e.push(n + label + ' belum punya tanya.'); return false; }
          if (String(s.tanya).length > 150) { e.push(n + label + ': tanya terlalu panjang (' + String(s.tanya).length + ' huruf). Maksimal 150 huruf supaya muat di layar HP.'); return false; }
          var jt = jenisTim(lv, s), ak = s.anak != null ? s.anak : (lv.anak != null ? lv.anak : TIM_ANAK), st = satuanTim(lv, s);
          if (jt !== 'seimbang' && jt !== 'cari') { e.push(n + label + ': jenis harus \'seimbang\' atau \'cari\' (sekarang ' + jt + ').'); return false; }
          if (!Array.isArray(ak) || ak.length < 2 || ak.length > 5 || ak.some(function (x) { return !bulatTim(x, 1, 100); }) || new Set(ak).size !== ak.length) {
            e.push(n + label + ': anak (anak timbang) harus berisi 2–5 bilangan bulat 1–100 yang tidak kembar, tanpa tanda petik (contoh [1, 2, 5, 10]). Sekarang: ' + (Array.isArray(ak) ? ak.join(', ') : ak)); return false;
          }
          if (typeof st !== 'string' || st.length > 6) { e.push(n + label + ': satuan harus teks paling banyak 6 huruf (contoh \'kg\' atau \'gram\').'); return false; }
          var urut = ak.slice().sort(function (a, b) { return a - b; });
          if (jt === 'seimbang') {
            if (!Array.isArray(s.kiri) || s.kiri.length < 1 || s.kiri.length > 4 || s.kiri.some(function (x) { return !bulatTim(x, 1, 100); })) {
              e.push(n + label + ': kiri harus daftar 1–4 bilangan bulat 1–100 (isi piring kiri), tanpa tanda petik (contoh [5, 3]). Sekarang: ' + (Array.isArray(s.kiri) ? s.kiri.join(', ') : (s.kiri == null ? '(kosong)' : s.kiri))); return false;
            }
            var tk = jumlahTim(s.kiri);
            if (tk > TIM_MAKS_BERAT) { e.push(n + label + ': jumlah isi kiri ' + tk + ' terlalu besar. Maksimal ' + TIM_MAKS_BERAT + '.'); return false; }
            if (!susunTim(tk, urut, TIM_MAKS)) { e.push(n + label + ': berat kiri ' + tk + ' tidak bisa diseimbangkan dengan anak timbang ' + urut.join(', ') + ' (paling banyak ' + TIM_MAKS + ' anak timbang di piring kanan). Ubah angkanya atau ganti anak timbangnya.'); return false; }
          } else {
            if (!bulatTim(s.tetap, 1, 100)) { e.push(n + label + ': jenis cari butuh tetap (bilangan bulat 1–100, tanpa tanda petik). Sekarang: ' + (s.tetap == null ? '(kosong)' : s.tetap)); return false; }
            if (!bulatTim(s.total, 2, TIM_MAKS_BERAT)) { e.push(n + label + ': jenis cari butuh total (bilangan bulat 2–' + TIM_MAKS_BERAT + ', tanpa tanda petik). Sekarang: ' + (s.total == null ? '(kosong)' : s.total)); return false; }
            if (s.total <= s.tetap) { e.push(n + label + ': total (' + s.total + ') harus lebih besar dari tetap (' + s.tetap + ').'); return false; }
            var jw = s.total - s.tetap;
            if (s.jawab != null && s.jawab !== jw) { e.push(n + label + ': jawab (' + s.jawab + ') tidak sama dengan total − tetap (' + jw + '). Hapus jawab; MPI menghitungnya sendiri.'); return false; }
            if (ak.indexOf(jw) < 0) { e.push(n + label + ': jawaban ' + jw + ' (total − tetap) harus salah satu anak timbang (' + urut.join(', ') + '). Ubah angkanya atau tambahkan ' + jw + ' ke anak.'); return false; }
          }
          return true;
        };
        (lv.soal || []).forEach(function (s, j) { cekTim(s, 'soal ' + (j + 1)); });
        if (!lv.soal && typeof lv.buatSoal === 'function') {
          try { for (var qt = 0; qt < 5; qt++) if (!cekTim(lv.buatSoal(qt), 'buatSoal(' + qt + ')')) break; }
          catch (er) { e.push(n + 'buatSoal error: ' + er.message); }
        }
      }
      if (lv.mesin === 'petak') {
        if (!lv.soal && typeof lv.buatSoal !== 'function') e.push(n + 'isi soal (daftar) atau buatSoal (fungsi).');
        maksBank('soal', 8, 'soal');
        var bulatPtk = function (x, a, b) { return typeof x === 'number' && isFinite(x) && x === Math.floor(x) && x >= a && x <= b; };
        var cekPetak = function (s, label) {
          if (!s || !s.tanya) { e.push(n + label + ' belum punya tanya.'); return false; }
          if (String(s.tanya).length > 150) { e.push(n + label + ': tanya terlalu panjang (' + String(s.tanya).length + ' huruf). Maksimal 150 huruf supaya muat di layar HP.'); return false; }
          var jn = jenisPtk(lv, s), rawSat = s.satuan != null ? s.satuan : lv.satuan, bn = bantuPtk(lv, s);
          if (jn !== 'warnai' && jn !== 'hitung') { e.push(n + label + ': jenis harus \'warnai\' atau \'hitung\' (sekarang ' + jn + ').'); return false; }
          if (rawSat != null && (typeof rawSat !== 'string' || !rawSat.length || rawSat.length > 6)) { e.push(n + label + ': satuan harus teks 1–6 huruf (contoh \'cm\'), bukan angka. Sekarang: ' + rawSat); return false; }
          if (bn != null && typeof bn !== 'boolean') { e.push(n + label + ': bantu harus true atau false (tanpa tanda petik).'); return false; }
          if (jn === 'warnai') {
            var uu = ukuranPtk(lv, s);
            if (!Array.isArray(uu) || uu.length !== 2 || !bulatPtk(uu[0], PTK_KOL[0], PTK_KOL[1]) || !bulatPtk(uu[1], PTK_BAR[0], PTK_BAR[1])) {
              e.push(n + label + ': ukuran harus [kolom, baris] dengan kolom ' + PTK_KOL[0] + '–' + PTK_KOL[1] + ' dan baris ' + PTK_BAR[0] + '–' + PTK_BAR[1] +
                ', bilangan bulat tanpa tanda petik (contoh [8, 6]). Sekarang: ' + (Array.isArray(uu) ? '[' + uu.join(', ') + ']' : uu)); return false;
            }
            if (s.luas == null && s.keliling == null) { e.push(n + label + ': jenis warnai butuh luas, keliling, atau keduanya (bilangan bulat tanpa tanda petik, contoh luas: 12).'); return false; }
            var mk = uu[0] * uu[1], mkel = 2 * (uu[0] + uu[1]);
            if (s.luas != null && !bulatPtk(s.luas, 1, mk)) { e.push(n + label + ': luas harus bilangan bulat 1–' + mk + ' (isi kotak ' + uu[0] + ' × ' + uu[1] + '), tanpa tanda petik. Sekarang: ' + s.luas); return false; }
            if (s.keliling != null && (!bulatPtk(s.keliling, 4, mkel) || s.keliling % 2)) { e.push(n + label + ': keliling harus bilangan genap 4–' + mkel + ' (maksimal 2 × (kolom + baris)), tanpa tanda petik. Sekarang: ' + s.keliling); return false; }
            if (!contohPetak(uu[0], uu[1], s.luas, s.keliling)) {
              e.push(n + label + ': luas ' + s.luas + ' dan keliling ' + s.keliling + ' tidak bisa dibuat bersamaan di kotak ' + uu[0] + ' × ' + uu[1] +
                '. Keliling = 2 × (lebar + tinggi) bangun, dan luas harus antara (lebar + tinggi − 1) dan (lebar × tinggi). Ubah angkanya atau perbesar ukuran kotak.'); return false;
            }
            return true;
          }
          var nb = normPetak(s.bentuk);
          if (nb.galat) { e.push(n + label + ': ' + nb.galat); return false; }
          if (nb.cols > PTK_HIT_KOL || nb.rows > PTK_HIT_BAR) { e.push(n + label + ': bentuk terlalu besar (' + nb.cols + ' × ' + nb.rows + ' petak). Maksimal ' + PTK_HIT_KOL + ' kolom dan ' + PTK_HIT_BAR + ' baris.'); return false; }
          var an = analisisPetak(nb.sel), uk2 = ukurPtk(lv, s);
          if (!an.tersambung) { e.push(n + label + ': bentuk harus menyambung sisi ke sisi (petak yang hanya bersentuhan di sudut tidak dihitung menyambung).'); return false; }
          if (an.berlubang) { e.push(n + label + ': bentuk tidak boleh berlubang di tengahnya (keliling jadi membingungkan untuk siswa SD).'); return false; }
          if (uk2 !== 'luas' && uk2 !== 'keliling') { e.push(n + label + ': ukur harus \'luas\' atau \'keliling\' (sekarang ' + uk2 + ').'); return false; }
          var nilai = uk2 === 'keliling' ? an.keliling : an.luas;
          if (s.pilihan == null) {
            if (s.benar != null) { e.push(n + label + ': benar hanya dipakai bersama pilihan. Hapus benar, atau isi pilihan juga.'); return false; }
            return true;
          }
          if (!Array.isArray(s.pilihan) || s.pilihan.length < 2 || s.pilihan.length > 4) { e.push(n + label + ': pilihan harus 2–4 item.'); return false; }
          if (typeof s.benar !== 'number' || s.benar !== Math.floor(s.benar) || s.pilihan[s.benar] == null) { e.push(n + label + ': indeks benar tidak sesuai pilihan (mulai dari 0).'); return false; }
          if (s.pilihan.some(function (x) { return String(x).length > 14; })) { e.push(n + label + ': teks pilihan maksimal 14 huruf supaya muat di tombol.'); return false; }
          if (new Set(s.pilihan.map(function (x) { return String(x).trim(); })).size !== s.pilihan.length) { e.push(n + label + ': pilihan tidak boleh kembar (' + s.pilihan.join(', ') + ').'); return false; }
          for (var pj = 0; pj < s.pilihan.length; pj++) {
            var np = angkaPilih(s.pilihan[pj]);
            if (isNaN(np)) { e.push(n + label + ': pilihan ' + (pj + 1) + ' (' + s.pilihan[pj] + ') harus memuat angka.'); return false; }
            if (pj === s.benar && np !== nilai) { e.push(n + label + ': pilihan benar (' + s.pilihan[pj] + ') tidak sama dengan ' + uk2 + ' bentuk yang dihitung MPI, yaitu ' + nilai + '. Perbaiki pilihan atau hapus pilihan agar dibuat otomatis.'); return false; }
            if (pj !== s.benar && np === nilai) { e.push(n + label + ': pilihan ' + (pj + 1) + ' (' + s.pilihan[pj] + ') juga sama dengan ' + uk2 + ' yang benar (' + nilai + '), jadi ada dua jawaban benar.'); return false; }
          }
          return true;
        };
        (lv.soal || []).forEach(function (s, j) { cekPetak(s, 'soal ' + (j + 1)); });
        if (!lv.soal && typeof lv.buatSoal === 'function') {
          try { for (var qpt = 0; qpt < 5; qpt++) if (!cekPetak(lv.buatSoal(qpt), 'buatSoal(' + qpt + ')')) break; }
          catch (er) { e.push(n + 'buatSoal error: ' + er.message); }
        }
      }
      if (lv.mesin === 'kuis') {
        if (lv.soal != null && !Array.isArray(lv.soal)) e.push(n + 'soal harus berupa daftar [ ... ].');
        else if (Array.isArray(lv.soal) && !lv.soal.length) e.push(n + 'soal harus berisi minimal 1 soal.');
        if (!lv.soal && typeof lv.buatSoal !== 'function') e.push(n + 'isi soal (daftar) atau buatSoal (fungsi).');
        if (lv.jenis != null && lv.jenis !== 'tunggal' && lv.jenis !== 'jamak') e.push(n + 'jenis harus \'tunggal\' atau \'jamak\' (sekarang ' + lv.jenis + ').');
        if (lv.acak != null && typeof lv.acak !== 'boolean') e.push(n + 'acak harus true atau false (tanpa tanda petik).');
        if (Array.isArray(lv.soal)) maksBank('soal', 8, 'soal');
        if (!lv.soal && lv.jumlah != null && !(lv.jumlah >= 1 && lv.jumlah <= 8 && lv.jumlah === Math.floor(lv.jumlah))) e.push(n + 'jumlah harus bilangan bulat 1–8 (soal acak maksimal 8 sekali main).');
        if (Array.isArray(lv.soal)) lv.soal.forEach(function (s, j) { var g = kuisGalat(lv, s, 'soal ' + (j + 1)); if (g) e.push(n + g); });
        if (!lv.soal && typeof lv.buatSoal === 'function') {
          try {
            for (var qk = 0; qk < 5; qk++) { var gk = kuisGalat(lv, lv.buatSoal(qk), 'buatSoal(' + qk + ')'); if (gk) { e.push(n + gk); break; } }
          } catch (er) { e.push(n + 'buatSoal error: ' + er.message); }
        }
      }
      var kelSs = famSasaran(lv.mesin);
      if (kelSs) {
        if (lv.soal != null && !Array.isArray(lv.soal)) e.push(n + 'soal harus berupa daftar [ ... ].');
        else if (Array.isArray(lv.soal) && !lv.soal.length) e.push(n + 'soal harus berisi minimal 1 soal.');
        if (!lv.soal && typeof lv.buatSoal !== 'function') e.push(n + 'isi soal (daftar) atau buatSoal (fungsi).');
        if (lv.acak != null && typeof lv.acak !== 'boolean') e.push(n + 'acak harus true atau false (tanpa tanda petik).');
        if (lv.nyawa != null && !(typeof lv.nyawa === 'number' && lv.nyawa >= 1 && lv.nyawa <= 5 && lv.nyawa === Math.floor(lv.nyawa))) e.push(n + 'nyawa harus bilangan bulat 1–5 tanpa tanda petik (sekarang ' + (typeof lv.nyawa === 'string' ? '"' + lv.nyawa + '"' : String(lv.nyawa)) + ').');
        if (lv.jumlah != null && !(typeof lv.jumlah === 'number' && lv.jumlah >= 1 && lv.jumlah === Math.floor(lv.jumlah))) e.push(n + 'jumlah harus bilangan bulat 1 atau lebih, tanpa tanda petik.');
        if (Array.isArray(lv.soal)) maksBank('soal', 8, 'soal');
        if (!lv.soal && lv.jumlah != null && lv.jumlah > 8) e.push(n + 'jumlah maksimal 8 (soal acak maksimal 8 sekali main).');
        if (Array.isArray(lv.soal)) lv.soal.forEach(function (s, j) { var g = periksaSasaran(lv, s, 'soal ' + (j + 1)); if (g) e.push(n + g); });
        if (!lv.soal && typeof lv.buatSoal === 'function') {
          try {
            for (var qb = 0; qb < 5; qb++) { var gt = periksaSasaran(lv, lv.buatSoal(qb), 'buatSoal(' + qb + ')'); if (gt) { e.push(n + gt); break; } }
          } catch (er) { e.push(n + 'buatSoal error: ' + er.message); }
        }
        if (kelSs.periksaLv) kelSs.periksaLv(lv, n, e);
      }
      if (lv.mesin === 'jelajah') {
        arr('titik', 2); maks('titik', 8, 'titik');
        (lv.titik || []).forEach(function (t, j) { if (!(t.x >= 0 && t.x <= 100 && t.y >= 0 && t.y <= 100)) e.push(n + 'titik ' + (j + 1) + ' harus punya x dan y antara 0–100 (persen).'); });
      }
      if (lv.mesin === 'labeli') {
        arr('pasangan', 2); maksBank('pasangan', 5, 'pasang');
        if (lv.arah != null && lv.arah !== 'nama-ke-gambar' && lv.arah !== 'gambar-ke-nama') e.push(n + 'arah harus \'nama-ke-gambar\' atau \'gambar-ke-nama\' (sekarang ' + lv.arah + ').');
        var namaLab = [], gbLab = [];
        (lv.pasangan || []).forEach(function (p, j) {
          var no = n + 'pasangan ' + (j + 1) + ': ';
          if (!Array.isArray(p) || p.length < 2) { e.push(no + 'harus berbentuk [gambar, nama] (boleh ditambah ulasan dan petunjuk).'); return; }
          var g = p[0] && typeof p[0] === 'object' ? p[0].gambar : p[0], nm = p[1] && typeof p[1] === 'object' ? p[1].teks : p[1];
          if (typeof g !== 'string' || !src(g)) e.push(no + 'gambar \"' + g + '\" tidak ditemukan. Isi dengan nama kunci yang didaftarkan di DATA.gambar atau alamat gambar. Urutan pasangan: [gambar, nama].');
          else gbLab.push(g);
          if (typeof nm !== 'string' || !nm.trim()) e.push(no + 'nama belum diisi.');
          else if (nm.length > 24) e.push(no + 'nama terlalu panjang (\"' + nm + '\"). Maksimal 24 huruf supaya muat di kotak.');
          else namaLab.push(nm.trim().toLowerCase());
          [[2, 'ulasan'], [3, 'petunjuk']].forEach(function (q) {
            if (p[q[0]] != null && (typeof p[q[0]] !== 'string' || p[q[0]].length > 140)) e.push(no + q[1] + ' harus teks paling banyak 140 huruf.');
          });
        });
        if (new Set(namaLab).size !== namaLab.length) e.push(n + 'ada nama kembar. Setiap pasangan harus punya nama yang berbeda.');
        if (new Set(gbLab).size !== gbLab.length) e.push(n + 'ada gambar kembar. Setiap pasangan harus punya gambar yang berbeda.');
      }
      if (lv.mesin === 'rakit') {
        var rakit_ada = {}, rakit_lv = { jenis: (lv.jenis === 'huruf' || lv.jenis === 'suku') ? lv.jenis : null };
        if (lv.buatSoal != null) e.push(n + 'mesin rakit memakai soal (daftar), bukan buatSoal. Tulis soal:[ { tanya:\'...\', jawab:\'kata\' }, ... ].');
        if (lv.jenis != null && lv.jenis !== 'huruf' && lv.jenis !== 'suku') e.push(n + 'jenis harus \'huruf\' atau \'suku\' (sekarang ' + lv.jenis + ').');
        if (lv.jumlah != null && !(typeof lv.jumlah === 'number' && lv.jumlah >= 1 && lv.jumlah === Math.floor(lv.jumlah))) e.push(n + 'jumlah harus bilangan bulat 1 atau lebih, tanpa tanda petik.');
        if (!Array.isArray(lv.soal)) e.push(n + 'soal harus berupa daftar dengan minimal 3 soal, contoh soal:[ { tanya:\'Hewan yang suka mengeong.\', jawab:\'kucing\' }, ... ].');
        else {
          arr('soal', 3); maksBank('soal', 8, 'soal');
          lv.soal.forEach(function (s, j) {
            var g = rakit_galat(rakit_lv, s, 'soal ' + (j + 1)), kj;
            if (g) { e.push(n + g); return; }
            kj = String(s.jawab).toLowerCase();
            if (rakit_ada[kj] != null) e.push(n + 'soal ' + (j + 1) + ' memakai jawab \'' + s.jawab + '\' yang sama dengan soal ' + (rakit_ada[kj] + 1) + '. Setiap soal harus punya jawab berbeda.');
            else rakit_ada[kj] = j;
          });
        }
      }
      if (lv.mesin === 'huruf') {
        arr('soal'); maksBank('soal', 8, 'soal');
        if (lv.jumlah != null && !(typeof lv.jumlah === 'number' && lv.jumlah >= 1 && lv.jumlah <= 8 && lv.jumlah === Math.floor(lv.jumlah)))
          e.push(n + 'jumlah harus bilangan bulat 1–8 tanpa tanda petik (sekarang ' + lv.jumlah + ').');
        var jwHuruf = [];
        (Array.isArray(lv.soal) ? lv.soal : []).forEach(function (s, j) {
          var no = n + 'soal ' + (j + 1) + ': ';
          if (!s || typeof s !== 'object' || Array.isArray(s)) { e.push(no + 'harus berbentuk { tanya:\'...\', jawab:\'KATA\' }.'); return; }
          if (typeof s.tanya !== 'string' || !s.tanya.trim()) e.push(no + 'tanya belum diisi. Tulis petunjuk kata yang dicari (maksimal 120 huruf).');
          else if (s.tanya.length > 120) e.push(no + 'tanya terlalu panjang (' + s.tanya.length + ' huruf). Maksimal 120 huruf; persingkat kalimatnya.');
          if (typeof s.jawab !== 'string' || !s.jawab.trim()) e.push(no + 'jawab belum diisi. Tulis satu kata, contoh jawab:\'KUCING\'.');
          else {
            var jw = s.jawab.trim();
            if (!/^[A-Za-z]+$/.test(jw)) e.push(no + 'jawab "' + s.jawab + '" hanya boleh berisi huruf A–Z tanpa spasi, angka, atau tanda baca. Tulis satu kata (kata majemuk ditulis sambung atau pilih kata lain).');
            else if (jw.length < 3 || jw.length > 12) e.push(no + 'jawab "' + jw + '" punya ' + jw.length + ' huruf. Harus 3–12 huruf supaya muat di layar HP.');
            else {
              if (jwHuruf.indexOf(jw.toUpperCase()) >= 0) e.push(no + 'jawab "' + jw + '" kembar dengan soal lain. Setiap soal harus punya jawab yang berbeda.');
              jwHuruf.push(jw.toUpperCase());
              if (typeof s.tanya === 'string' && new RegExp('(^|[^a-z])' + jw.toLowerCase() + '([^a-z]|$)').test(s.tanya.toLowerCase()))
                e.push(no + 'tanya memuat kata jawabannya ("' + jw + '"). Hapus katanya dari tanya atau ganti dengan titik-titik.');
            }
          }
          if (s.pengecoh != null && (typeof s.pengecoh !== 'string' || !/^[A-Za-z]{1,3}$/.test(s.pengecoh)))
            e.push(no + 'pengecoh harus teks berisi 1–3 huruf A–Z tanpa spasi, contoh pengecoh:\'AE\' (sekarang "' + s.pengecoh + '").');
          ['petunjuk', 'ulasan'].forEach(function (f) {
            if (s[f] != null && (typeof s[f] !== 'string' || s[f].length > 140)) e.push(no + f + ' harus teks paling banyak 140 huruf.');
          });
        });
      }
      if (lv.mesin === 'rangkai') {
        (function () {
          var bentuk = Array.isArray(lv.soal);
          if (!bentuk || lv.soal.length < 3) {
            e.push(n + 'soal harus berupa daftar [ ... ] dengan minimal 3 soal (sekarang ' + (bentuk ? lv.soal.length + ' soal' : 'bukan daftar') + '). Mesin rangkai tidak memakai buatSoal: tulis soalnya satu per satu.');
            return;
          }
          if (lv.jenis != null && lv.jenis !== 'huruf' && lv.jenis !== 'kata') e.push(n + 'jenis harus \'huruf\' atau \'kata\' (sekarang ' + lv.jenis + ').');
          if (lv.jumlah != null && !(typeof lv.jumlah === 'number' && lv.jumlah >= 1 && lv.jumlah <= 8 && lv.jumlah === Math.floor(lv.jumlah))) e.push(n + 'jumlah harus bilangan bulat 1–8 tanpa tanda petik (sekarang ' + (typeof lv.jumlah === 'string' ? '"' + lv.jumlah + '"' : String(lv.jumlah)) + ').');
          maksBank('soal', 8, 'soal');
          var adaJawab = Object.create(null);
          lv.soal.forEach(function (x, j) {
            var p = n + 'soal ' + (j + 1) + ': ';
            if (!x || typeof x !== 'object' || Array.isArray(x)) { e.push(p + 'harus berbentuk { tanya, jawab }.'); return; }
            if (x.jenis != null && x.jenis !== 'huruf' && x.jenis !== 'kata') { e.push(p + 'jenis harus \'huruf\' atau \'kata\' (sekarang ' + x.jenis + ').'); return; }
            var jn = x.jenis || (lv.jenis === 'kata' ? 'kata' : 'huruf');
            if (typeof x.tanya !== 'string' || !x.tanya.trim()) e.push(p + 'tanya belum diisi (teks petunjuk atau definisi).');
            else if (x.tanya.length > 120) e.push(p + 'tanya terlalu panjang (' + x.tanya.length + ' huruf). Maksimal 120 huruf supaya muat di layar HP; persingkat kalimatnya.');
            if (typeof x.jawab !== 'string' || !x.jawab.trim()) { e.push(p + 'jawab belum diisi. Tulis satu kata (jenis huruf) atau satu kalimat (jenis kata) berupa teks.'); return; }
            var jw = x.jawab.trim(), kt = jw.split(/\s+/), jwk = jw.toLowerCase().replace(/\s+/g, ' ');
            if (jn === 'huruf') {
              if (!/^[A-Za-z]{2,10}$/.test(jw)) e.push(p + 'jawab "' + x.jawab + '" harus satu kata 2–10 huruf a–z, tanpa spasi, angka, atau tanda baca. Untuk kalimat tulis jenis:\'kata\'; untuk kata yang terlalu panjang, pilih kata lain.');
              else {
                if (new Set(jw.toLowerCase().split('')).size < 2) e.push(p + 'jawab "' + x.jawab + '" harus memuat minimal 2 huruf yang berbeda supaya ada yang bisa diacak.');
                if (typeof x.tanya === 'string' && new RegExp('(^|[^a-z])' + jw.toLowerCase() + '([^a-z]|$)').test(x.tanya.toLowerCase())) e.push(p + 'tanya memuat jawabannya ("' + x.jawab + '"). Ubah tanya menjadi definisi atau petunjuk tanpa menyebut kata itu.');
              }
            } else {
              if (kt.length < 3 || kt.length > 7) e.push(p + 'jawab harus kalimat 3–7 kata (sekarang ' + kt.length + ' kata). Pendekkan atau pecah menjadi dua soal.');
              kt.forEach(function (t) { if (t.length > 12) e.push(p + 'kata "' + t + '" terlalu panjang (' + t.length + ' huruf). Maksimal 12 huruf per kata supaya muat di kartu; ganti dengan kata yang lebih pendek.'); });
              if (new Set(kt.map(function (t) { return t.toLowerCase(); })).size < 2) e.push(p + 'jawab harus memuat minimal 2 kata yang berbeda.');
            }
            if (adaJawab[jwk]) e.push(p + 'jawab sama dengan soal ' + adaJawab[jwk] + '. Setiap soal harus punya jawab yang berbeda.');
            else adaJawab[jwk] = j + 1;
            if (x.pengecoh != null) {
              if (!Array.isArray(x.pengecoh) || x.pengecoh.length > 2) e.push(p + 'pengecoh harus daftar [ ... ] berisi 0–2 teks (sekarang ' + (Array.isArray(x.pengecoh) ? x.pengecoh.length + ' item' : 'bukan daftar') + '). Hapus kelebihannya atau hapus field pengecoh.');
              else {
                var adaCoh = Object.create(null);
                x.pengecoh.forEach(function (c, q) {
                  var pc = p + 'pengecoh ke-' + (q + 1) + ' ';
                  if (typeof c !== 'string' || !c.trim()) { e.push(pc + 'harus teks yang tidak kosong.'); return; }
                  var ck = c.trim().toLowerCase();
                  if (jn === 'huruf') {
                    if (!/^[a-z]$/.test(ck)) e.push(pc + '("' + c + '") harus satu huruf a–z.');
                    else if (jw.toLowerCase().indexOf(ck) >= 0) e.push(pc + '("' + c + '") sudah ada di jawab "' + x.jawab + '", jadi ada dua huruf yang sama. Pilih huruf yang tidak ada di jawab.');
                  } else {
                    var polos = function (t) { return t.toLowerCase().replace(/[.,!?;:]/g, ''); };
                    if (/\s/.test(c.trim()) || c.trim().length > 12) e.push(pc + '("' + c + '") harus satu kata, maksimal 12 huruf.');
                    else if (kt.some(function (t) { return polos(t) === polos(ck); })) e.push(pc + '("' + c + '") sudah ada di kalimat jawab, jadi ada dua kartu yang sama. Ganti dengan kata lain.');
                  }
                  if (adaCoh[ck]) e.push(pc + '("' + c + '") kembar dengan pengecoh lain. Setiap pengecoh harus berbeda.');
                  adaCoh[ck] = 1;
                });
              }
            }
            ['petunjuk', 'ulasan'].forEach(function (f) {
              if (x[f] != null && (typeof x[f] !== 'string' || x[f].length > 140)) e.push(p + f + ' harus teks paling banyak 140 huruf.');
            });
            if (x.gambar != null && (typeof x.gambar !== 'string' || !src(x.gambar))) e.push(p + 'gambar "' + x.gambar + '" tidak ditemukan. Isi dengan nama kunci yang didaftarkan di DATA.gambar atau alamat gambar (mengandung titik atau garis miring), atau hapus field gambar.');
          });
        })();
      }
    });
    return e;
  }
  function tampilGalat(e) {
    var w = el('div');
    var k = el('div', 'k-kertas k-galat');
    k.innerHTML = '<h2 class="fd" style="margin:0 0 8px;color:#C2333A;font-size:30px">MPI belum bisa dijalankan</h2>' +
      '<p style="margin:0 0 10px">Ada bagian DATA yang perlu diperbaiki. Salin daftar ini dan kirim ke Claude dengan pesan <b>“perbaiki DATA berikut”</b>:</p><ol>' +
      e.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>';
    w.appendChild(k);
    layar(w);
  }

  /* ════════════════════════════ MULAI ════════════════════════════ */
  window.KIT = {
    versi: VERSI,
    tema: Object.keys(TEMA),
    mesin: Object.keys(MESIN),
    mulai: function (data) {
      D = data || {};
      D.gambar = D.gambar || {};
      /* ?tema=hutan di alamat halaman mengganti tema (untuk mencoba warna lain) */
      try { var qt = new URLSearchParams(location.search).get('tema'); if (qt && TEMA[qt]) D.tema = qt; } catch (e) {}
      if (D.maskot && D.maskot.gambar && !D.gambar.maskot) D.gambar.maskot = D.maskot.gambar;
      var jalan = function () {
        pasangPanggung();
        var e = periksaData(D);
        if (e.length) return tampilGalat(e);
        LEVEL = D.level; BINTANG = []; TERBUKA = 1; REKAM = [];
        muatProgres();
        try { if (new URLSearchParams(location.search).get('tim') === '1') TIM = { skor: [0, 0], giliran: 0 }; } catch (er) {}
        kirimAntrean();
        layarJudul();
      };
      if (document.body) jalan(); else document.addEventListener('DOMContentLoaded', jalan);
    }
  };
})();
