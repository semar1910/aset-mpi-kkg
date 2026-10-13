/*!
 * KIT MPI v1 — KKG SD Gugus 2 Cibatok
 * Bingkai tampilan + mesin permainan untuk Media Pembelajaran Interaktif.
 * Pakai:  <script src=".../kit-mpi.js"></script>
 *         <script> KIT.mulai({ ...DATA... }); </script>
 * Panduan lengkap: PANDUAN.md di repo aset-mpi-kkg.
 * v1.3: ikon SVG (tanpa emoji), variasi tampilan otomatis dari judul
 *       (layar judul, pola latar, arah gradasi), opsi peta:'jalur'.
 * v1.4: mesin baru memori (data seperti cocokkan) dan isian (papan angka).
 * v1.5: progres tersimpan, tombol dengarkan, soal salah diulang, bank soal (jumlah),
 *       mode tim, hasil murid + papan skor (bila diputar dari server KKG).
 */
(function () {
  'use strict';
  var VERSI = '1.5.0';
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
    hapus: '<path d="M9 5h11v14H9l-6-7z"/><path d="m12 9.5 5 5M17 9.5l-5 5"/>'
  };
  var IKON_MESIN = { cerita: 'buku', bacaan: 'halaman', sortir: 'keranjang', cocokkan: 'rantai', urutkan: 'urutan', runner: 'jalur', jelajah: 'lup', memori: 'memori', isian: 'papan' };
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
    isian: 'Hitung, lalu ketik jawabanmu dengan tombol angka.'
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
    '.k-ruang>.m-cer,.k-ruang>.m-bac,.k-ruang>.m-sor,.k-ruang>.m-coc,.k-ruang>.m-uru,.k-ruang>.m-run,.k-ruang>.m-jel{position:absolute;inset:12px 18px 8px}',
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
    '.m-isi .papan .k-btn .k-ik{width:30px;height:30px}'
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
    latarLayar(w, D.gambar && D.gambar.latar ? 'latar' : '');
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
    return { cerita: 'Cerita', bacaan: 'Bacaan', sortir: 'Sortir', cocokkan: 'Cocokkan', urutkan: 'Urutkan', runner: 'Lari Jalur', jelajah: 'Jelajah', memori: 'Memori', isian: 'Isian' }[m] || 'Tantangan';
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
    ['.m-cer .isi', '.m-bac .hal .tx', '.m-bac .akt .tny', '.m-isi .tny', '.m-run .soal', '.m-jel .info'].forEach(function (s) {
      var e = ruang.querySelector(s);
      if (e && e.textContent.trim()) bagian.push(e.textContent.trim());
    });
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
      } else if (lv.mesin === 'jelajah') {
        h = ul((lv.titik || []).map(function (t, i) { return (i + 1) + '. <b>' + esc(t.nama) + '</b>: ' + fmt(t.info || ''); }));
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

  /* 2. BACAAN — halaman buku + glosarium + satu aktivitas per halaman */
  MESIN.bacaan = function (lv, api) {
    var hal = lv.halaman, i = 0;
    var glos = lv.glosarium || D.glosarium || {};
    var w = el('div', 'm-bac');
    var kiri = el('div', 'k-kertas hal'); w.appendChild(kiri);
    var kanan = el('div', 'kn'); w.appendChild(kanan);
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
      if (h.gambar) {
        var il = el('div', 'ilus'); il.appendChild(gambar(h.gambar, 'Ilustrasi')); kanan.appendChild(il);
      }
      var akt = el('div', 'k-kertas akt'); kanan.appendChild(akt);
      var lanjut = api.aksi(i < hal.length - 1 ? 'Halaman berikutnya ' + ik('lanjut') : 'Selesai ' + ik('centang'), function () {
        i++; if (i >= hal.length) api.selesai(); else render();
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
    render();
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
          kot.classList.add('betul'); benarN++; cepat = Math.min(2.2, cepat + 0.12);
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

  /* ════════════════════════════ VALIDASI ════════════════════════════ */
  function periksaData(d) {
    var e = [];
    if (!d || typeof d !== 'object') return ['DATA tidak ditemukan. Panggil KIT.mulai({ ... }).'];
    if (!d.judul) e.push('judul belum diisi.');
    if (d.tema && !TEMA[d.tema]) e.push('tema "' + d.tema + '" tidak dikenal. Pilih: ' + Object.keys(TEMA).join(', ') + '.');
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
          var bk = h.gambar ? 55 : 70;
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
      if (lv.mesin === 'jelajah') {
        arr('titik', 2); maks('titik', 8, 'titik');
        (lv.titik || []).forEach(function (t, j) { if (!(t.x >= 0 && t.x <= 100 && t.y >= 0 && t.y <= 100)) e.push(n + 'titik ' + (j + 1) + ' harus punya x dan y antara 0–100 (persen).'); });
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
