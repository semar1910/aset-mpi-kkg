/*! KIT MPI - kit-kelompok.js v1.1 (Ular Tangga lengkap: pengaturan, papan, giliran, dadu interaktif, juara, cara main, tombol ?, opsi lisan)
 *  Kebutuhan: kit-mpi.js v1.25+ (hookKelompok 1). Dipanggil lewat KIT_KELOMPOK.mulai(k).
 *  Permainan: Ular Tangga (papan lain, mis. ludo dan monopoli, dapat ditambahkan pada cangkang yang sama).
 *  Dadu: dilempar siswa (sentil atau ketuk; Spasi/Enter untuk TV tanpa sentuh), angka dari crypto.getRandomValues, auto-lempar 12 detik.
 *  Tahap 3: lembar cara main bergambar, tombol "?" saat bermain, opsi jawab lisan (guru menekan Benar, Salah, atau Lewati).
 *  Tahap 1: pengaturan (jumlah pemain, nama, karakter, panjang papan) dan papan SVG dengan bidak.
 *  Tahap 2: giliran bergantian, k.tantang, dadu, bidak maju/tangga/ular, layar juara.
 */
(function () {
  'use strict';
  var KATALOG = 'https://cdn.jsdelivr.net/gh/semar1910/aset-mpi-kkg@main/katalog-aset.json';
  var WARNA = ['#E5484D', '#2F7DE1', '#30A46C', '#F5A524', '#8E4EC6'];
  var NAMA_WARNA = ['merah', 'biru', 'hijau', 'kuning', 'ungu'];
  var NAMA_BENTUK = ['bulat', 'kotak', 'segitiga', 'bintang', 'hati'];
  var NS = 'http://www.w3.org/2000/svg';
  var XL = 'http://www.w3.org/1999/xlink';
  var FONT = "Fredoka,'Trebuchet MS',sans-serif"; /* tanda kutip tunggal agar aman di dalam atribut HTML */
  /* panjang papan: 4 baris x kolom. Petak = baris x kolom (24, 32, 40) */
  var PANJANG = [
    { id: 'pendek', label: 'Pendek', baris: 4, kolom: 6, tangga: 3, ular: 3 },
    { id: 'sedang', label: 'Sedang', baris: 4, kolom: 8, tangga: 4, ular: 4 },
    { id: 'panjang', label: 'Panjang', baris: 4, kolom: 10, tangga: 5, ular: 5 }
  ];
  var ULAR_WARNA = [['#1F7A44', '#52C47E'], ['#B35F0B', '#F5A524'], ['#6A35A0', '#B07FE0'], ['#A92B36', '#EE7A83'], ['#1F5BB0', '#6AA6F2']];
  var katalogCache = null;
  var cacheGambar = {};
  var CSS = '@keyframes kkMelayang{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}' +
    '@keyframes kkGoyang{0%{transform:rotate(-2.2deg)}100%{transform:rotate(2.2deg)}}' +
    '@keyframes kkKedip{0%,100%{opacity:.3;transform:scale(.7)}50%{opacity:1;transform:scale(1.15)}}' +
    '@keyframes kkPutar{to{transform:rotate(360deg)}}' +
    '@keyframes kkDenyut{0%{transform:scale(.85);opacity:.95}100%{transform:scale(1.4);opacity:0}}' +
    '@keyframes kkSayap{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.3)}}' +
    '@keyframes kkGeser{0%,100%{transform:translateX(0)}50%{transform:translateX(16px)}}' +
    '@keyframes kkLompatKecil{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}' +
    '@keyframes kkTombol{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}' +
    '@keyframes kkAngguk{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}' +
    '@keyframes kkLidah{0%,64%,100%{transform:rotate(0)}72%{transform:rotate(-22deg)}80%{transform:rotate(22deg)}90%{transform:rotate(-10deg)}}' +
    '@keyframes kkMata{0%,90%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}' +
    '@keyframes kkBayang{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(.78);opacity:.65}}' +
    '@keyframes kkTerbang{0%{transform:translateX(-12vw)}100%{transform:translateX(112vw)}}' +
    '@keyframes kkKilat{0%,55%{transform:translateX(0)}100%{transform:translateX(1500px)}}' +
    '@keyframes kkMengambang{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-14px) rotate(3deg)}}' +
    '@keyframes kkJatuh{0%{transform:translate(0,-24px) rotate(0);opacity:0}10%{opacity:1}100%{transform:translate(46px,420px) rotate(320deg);opacity:0}}' +
    '@keyframes kkKepak{0%{transform:scaleY(1)}100%{transform:scaleY(-.6)}}' +
    '@keyframes kkAsap{0%{transform:translate(0,0) scale(.5);opacity:.85}100%{transform:translate(8px,-28px) scale(1.5);opacity:0}}' +
    '@keyframes kkKocok{0%,100%{transform:translate(0,0) rotate(0)}20%{transform:translate(-8px,-6px) rotate(-16deg)}40%{transform:translate(8px,4px) rotate(14deg)}60%{transform:translate(-6px,6px) rotate(-10deg)}80%{transform:translate(6px,-4px) rotate(12deg)}}' +
    '@keyframes kkMuncul{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.18);opacity:1}100%{transform:scale(1);opacity:1}}' +
    '@keyframes kkLonjak{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}' +
    '@keyframes kkLempar{0%{transform:translate(var(--x0),var(--y0)) rotate(0deg) scale(1);animation-timing-function:ease-out}' +
      '28%{transform:translate(calc(var(--x0)*.4 + var(--dx)*.5),calc(var(--y0)*.3 + var(--dy)*.4 - 110px)) rotate(calc(var(--rot)*.45)) scale(1.5);animation-timing-function:ease-in}' +
      '52%{transform:translate(calc(var(--dx)*.9),var(--dy)) rotate(calc(var(--rot)*.8)) scale(1);animation-timing-function:ease-out}' +
      '66%{transform:translate(calc(var(--dx)*1.06),calc(var(--dy) - 46px)) rotate(calc(var(--rot)*.93)) scale(1.1);animation-timing-function:ease-in}' +
      '78%{transform:translate(calc(var(--dx)*1.12),var(--dy)) rotate(calc(var(--rot)*.98)) scale(1);animation-timing-function:ease-out}' +
      '88%{transform:translate(calc(var(--dx)*1.15),calc(var(--dy) - 14px)) rotate(var(--rot)) scale(1.03);animation-timing-function:ease-in}' +
      '100%{transform:translate(calc(var(--dx)*1.16),var(--dy)) rotate(var(--rot)) scale(1)}}' +
    '@keyframes kkBayangLempar{0%{transform:translate(var(--x0),calc(var(--y0) + 56px)) scale(1);opacity:.35}' +
      '28%{transform:translate(calc(var(--x0)*.4 + var(--dx)*.5),calc(var(--y0)*.3 + var(--dy)*.7 + 56px)) scale(.55);opacity:.14}' +
      '52%{transform:translate(calc(var(--dx)*.9),calc(var(--dy) + 56px)) scale(1);opacity:.35}' +
      '66%{transform:translate(calc(var(--dx)*1.06),calc(var(--dy) + 56px)) scale(.8);opacity:.22}' +
      '78%{transform:translate(calc(var(--dx)*1.12),calc(var(--dy) + 56px)) scale(1);opacity:.35}' +
      '88%{transform:translate(calc(var(--dx)*1.15),calc(var(--dy) + 56px)) scale(.92);opacity:.28}' +
      '100%{transform:translate(calc(var(--dx)*1.16),calc(var(--dy) + 56px)) scale(1);opacity:.35}}' +
    '@keyframes kkPercik{0%{transform:translate(0,0) scale(1);opacity:.95}100%{transform:translate(var(--px),var(--py)) scale(.2);opacity:0}}' +
    '@keyframes kkHabis{0%{transform:scaleX(1)}100%{transform:scaleX(0)}}' +
    '@keyframes kkGetar{0%,100%{transform:translate(0,0)}25%{transform:translate(-4px,3px)}50%{transform:translate(4px,-3px)}75%{transform:translate(-2px,2px)}}' +
    '.kk-a{transform-box:fill-box;transform-origin:50% 50%;animation-timing-function:ease-in-out;animation-iteration-count:infinite}' +
    '@media (prefers-reduced-motion:reduce){.kk-a{animation:none!important}}';
  function pasangCss() {
    try {
      if (document.getElementById('kk-css')) return;
      var st = document.createElement('style'); st.id = 'kk-css'; st.textContent = CSS;
      document.head.appendChild(st);
    } catch (e) {}
  }
  /* animasi CSS hanya transform dan opacity; mati otomatis bila prefers-reduced-motion */
  function animasi(e, nama, dur, tunda, alt, asal) {
    try {
      e.classList.add('kk-a');
      e.style.animationName = nama; e.style.animationDuration = dur + 's'; e.style.animationDelay = (-tunda) + 's';
      e.style.animationDirection = alt ? 'alternate' : 'normal';
      if (asal) e.style.transformOrigin = asal;
      if (nama === 'kkPutar' || nama === 'kkTerbang' || nama === 'kkJatuh' || nama === 'kkKilat') e.style.animationTimingFunction = 'linear';
    } catch (x) {}
  }

  /* ---------- pembantu umum ---------- */
  function kurangGerak() {
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; }
  }
  /* angka dadu 1..6. Beberapa sumber acak digabung (XOR setelah diaduk): hasilnya seragam selama SATU sumber saja
     masih baik. Jadi tetap adil walau Math.random atau crypto diganti/dibekukan oleh halaman atau kit. */
  var cacahDadu = 0, garam = 0x9E3779B9;
  function aduk(x) {
    x = x >>> 0;
    x ^= x >>> 16; x = Math.imul(x, 0x85EBCA6B) >>> 0;
    x ^= x >>> 13; x = Math.imul(x, 0xC2B2AE35) >>> 0;
    x ^= x >>> 16;
    return x >>> 0;
  }
  function kata32() {
    var c, a, h = 0, t = 0, w = 0;
    try { c = window.crypto || window.msCrypto; if (c && c.getRandomValues) { a = new Uint32Array(1); c.getRandomValues(a); w = a[0] >>> 0; } } catch (e) {}
    try { h = Math.floor(Math.random() * 4294967296) >>> 0; } catch (e1) {}
    try { t = Math.floor((window.performance && performance.now ? performance.now() : 0) * 1000) >>> 0; } catch (e2) {}
    cacahDadu = (cacahDadu + 1) >>> 0;
    garam = aduk(garam + t + (new Date().getTime() >>> 0) + Math.imul(cacahDadu, 0x27D4EB2F));
    return (w ^ aduk(h + 0x1234567) ^ garam) >>> 0;
  }
  function acakDadu() {
    var x, batas = 4294967292;
    do { x = kata32(); } while (x >= batas);
    return 1 + (x % 6);
  }
  /* bilangan acak 0..1 untuk tampilan (arah lempar, percikan); juga lewat crypto bila ada */
  function acak01() {
    var c, a;
    try { c = window.crypto || window.msCrypto; if (c && c.getRandomValues) { a = new Uint32Array(1); c.getRandomValues(a); return a[0] / 4294967296; } } catch (e) {}
    return Math.random();
  }
  /* teks pemain untuk balon maskot (kit mungkin memakai innerHTML atau textContent): buang karakter markup */
  function aman(t) { return String(t == null ? '' : t).replace(/[<>&"'`]/g, ''); }
  function sv(tag, attr, induk) {
    var e = document.createElementNS(NS, tag), a;
    if (attr) for (a in attr) if (Object.prototype.hasOwnProperty.call(attr, a)) e.setAttribute(a, attr[a]);
    if (induk) induk.appendChild(e);
    return e;
  }
  function teksSvg(induk, x, y, isi, ukuran, isiWarna, jangkar) {
    var t = sv('text', {
      x: x, y: y, 'font-size': ukuran, 'font-weight': 700, fill: isiWarna, 'text-anchor': jangkar || 'start',
      'font-family': FONT, stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke', 'stroke-linejoin': 'round'
    }, induk);
    t.textContent = isi;
    return t;
  }
  var BINTANG = (function () {
    var s = [], i, r, a;
    for (i = 0; i < 10; i++) {
      r = i % 2 ? 16 : 40; a = (-90 + i * 36) * Math.PI / 180;
      s.push((r * Math.cos(a)).toFixed(1) + ',' + (r * Math.sin(a)).toFixed(1));
    }
    return s.join(' ');
  })();
  /* bentuk cadangan, titik pusat (0,0), muat di kotak -50..50 */
  function bentukSvg(idx, warna) {
    var g = 'fill="' + warna + '" stroke="#fff" stroke-width="6" stroke-linejoin="round"';
    switch (idx % 5) {
      case 0: return '<circle r="36" ' + g + '/>';
      case 1: return '<rect x="-32" y="-32" width="64" height="64" rx="10" ' + g + '/>';
      case 2: return '<polygon points="0,-38 38,30 -38,30" ' + g + '/>';
      case 3: return '<polygon points="' + BINTANG + '" ' + g + '/>';
      default: return '<path d="M0 34 C-50 -2 -32 -38 0 -14 C32 -38 50 -2 0 34Z" ' + g + '/>';
    }
  }
  /* muat gambar dengan batas waktu; cb(true|false). Tidak pernah menahan permainan. */
  function muat(src, cb) {
    if (!src) { cb(false); return; }
    if (cacheGambar[src] === true || cacheGambar[src] === false) { cb(cacheGambar[src]); return; }
    var selesai = false, tm, im;
    function akhir(ok, simpan) {
      if (selesai) return;
      selesai = true; clearTimeout(tm);
      if (simpan) cacheGambar[src] = ok;
      try { cb(ok); } catch (e) {}
    }
    try {
      im = new Image();
      im.onload = function () { akhir(true, true); };
      im.onerror = function () { akhir(false, true); };
      tm = setTimeout(function () { akhir(false, false); }, 5000);
      im.src = src;
    } catch (e) { akhir(false, false); }
  }
  /* pembangkit acak deterministik */
  function benih(teks) {
    var h = 2166136261, i;
    for (i = 0; i < teks.length; i++) { h ^= teks.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h >>> 0;
  }
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      var t;
      a = (a + 0x6D2B79F5) >>> 0; t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function seedPapan(k, id) {
    var j = '', h = null, s;
    try { j = String(k.D && k.D.judul != null ? k.D.judul : ''); } catch (e) {}
    try { h = k.alat.hashTeks(j); } catch (e2) { h = null; }
    s = (typeof h === 'number' && isFinite(h)) ? (h >>> 0) : benih(String(h === null || h === undefined ? j : h));
    return (s ^ benih('papan:' + id)) >>> 0;
  }
  /* pasangan tangga dan ular. Semua ujung berbeda, tidak di petak 1 atau akhir.
   * Naik 1 atau 2 baris, geser paling jauh 2 kolom, tidak saling silang dan tidak berimpitan (agar terbaca di TV). */
  function buatLompatan(N, cols, jmlT, jmlU, r) {
    var rows = Math.round(N / cols), dipakai = {}, hasil = [], seg = [], i, maks = Math.max(jmlT, jmlU);
    dipakai[1] = true; dipakai[N] = true;
    function kolBaris(n) {
      var idx = n - 1, rb = Math.floor(idx / cols), c = idx % cols;
      if (rb % 2 === 1) c = cols - 1 - c;
      return { rb: rb, c: c };
    }
    function petak(rb, c) { return rb * cols + (rb % 2 === 1 ? cols - 1 - c : c) + 1; }
    function titik(n) { var s = kolBaris(n); return { x: s.c + 0.5, y: s.rb + 0.5 }; }
    function arah(a, b, c) { return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x); }
    function silang(a, b, c, d) {
      var d1 = arah(a, b, c), d2 = arah(a, b, d), d3 = arah(c, d, a), d4 = arah(c, d, b);
      return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0));
    }
    function jarak(p, a, b) {
      var dx = b.x - a.x, dy = b.y - a.y, l2 = dx * dx + dy * dy, t = l2 ? ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2 : 0;
      t = Math.max(0, Math.min(1, t));
      return Math.sqrt(Math.pow(p.x - (a.x + t * dx), 2) + Math.pow(p.y - (a.y + t * dy), 2));
    }
    function coba(jenis) {
      var t, a, b, sa, rb2, c2, A, B, ok, j;
      for (t = 0; t < 300; t++) {
        a = 2 + Math.floor(r() * (N - 3));
        sa = kolBaris(a);
        rb2 = sa.rb + 1 + (r() < 0.35 ? 1 : 0);
        c2 = sa.c + Math.floor(r() * 5) - 2;
        if (rb2 > rows - 1 || c2 < 0 || c2 >= cols) continue;
        b = petak(rb2, c2);
        if (b > N - 1 || dipakai[a] || dipakai[b]) continue;
        A = titik(a); B = titik(b); ok = true;
        for (j = 0; j < seg.length && ok; j++) {
          if (silang(A, B, seg[j][0], seg[j][1])) ok = false;
          else if (jarak(A, seg[j][0], seg[j][1]) < 0.6 || jarak(B, seg[j][0], seg[j][1]) < 0.6 ||
                   jarak(seg[j][0], A, B) < 0.6 || jarak(seg[j][1], A, B) < 0.6) ok = false;
        }
        if (!ok) continue;
        dipakai[a] = true; dipakai[b] = true; seg.push([A, B]);
        hasil.push(jenis === 'tangga' ? { dari: a, ke: b, jenis: jenis } : { dari: b, ke: a, jenis: jenis });
        return;
      }
    }
    for (i = 0; i < maks; i++) {
      if (i < jmlT) coba('tangga');
      if (i < jmlU) coba('ular');
    }
    return hasil;
  }

  /* animasi berporos pada titik asal koordinat lokal (untuk memutar kepala, lidah, dll.) */
  function animasiSumbu(e, nama, dur, tunda, alt) {
    animasi(e, nama, dur, tunda, alt);
    try { e.style.transformBox = 'view-box'; e.style.transformOrigin = '0px 0px'; } catch (x) {}
  }
  /* elemen bertanda data-an="nama,durasi,tunda,alt(1|0),asal" diberi animasi */
  function animasiData(root) {
    var l = root.querySelectorAll('[data-an]'), i, q;
    for (i = 0; i < l.length; i++) {
      q = l[i].getAttribute('data-an').split(',');
      animasi(l[i], q[0], parseFloat(q[1]) || 3, parseFloat(q[2]) || 0, q[3] === '1', q[4] || '');
    }
  }

  /* ---------- hiasan: bunga, tunas, bintang, jamur ---------- */
  function bunga(g, x, y, col) {
    var i, a;
    for (i = 0; i < 5; i++) {
      a = i * 72 * Math.PI / 180;
      sv('circle', { cx: (x + 5.2 * Math.sin(a)).toFixed(1), cy: (y - 5.2 * Math.cos(a)).toFixed(1), r: 4.2, fill: col }, g);
    }
    sv('circle', { cx: x, cy: y, r: 3, fill: '#FFD54A' }, g);
  }
  function tunas(g, x, y) {
    sv('line', { x1: x, y1: y + 9, x2: x, y2: y + 1, stroke: '#3E9A58', 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
    sv('ellipse', { cx: x - 5, cy: y, rx: 8, ry: 3.8, fill: '#4CB86A', transform: 'rotate(-35 ' + (x - 5) + ' ' + y + ')' }, g);
    sv('ellipse', { cx: x + 5, cy: y - 1, rx: 8, ry: 3.8, fill: '#6FD07F', transform: 'rotate(35 ' + (x + 5) + ' ' + (y - 1) + ')' }, g);
  }
  function bintangKecil(g, x, y, r) {
    var s = [], i, rr, a;
    for (i = 0; i < 10; i++) {
      rr = i % 2 ? r * 0.42 : r; a = (-90 + i * 36) * Math.PI / 180;
      s.push((x + rr * Math.cos(a)).toFixed(1) + ',' + (y + rr * Math.sin(a)).toFixed(1));
    }
    return sv('polygon', { points: s.join(' '), fill: '#FFC933', stroke: '#E59E00', 'stroke-width': 1.2, 'stroke-linejoin': 'round' }, g);
  }
  function jamur(g, x, y) {
    sv('rect', { x: x - 3, y: y, width: 6, height: 8, rx: 2, fill: '#FFF6E5' }, g);
    sv('path', { d: 'M' + (x - 9) + ' ' + (y + 1) + ' A9 9 0 0 1 ' + (x + 9) + ' ' + (y + 1) + ' Z', fill: '#E5484D' }, g);
    sv('circle', { cx: x - 3.5, cy: y - 3, r: 1.8, fill: '#fff' }, g);
    sv('circle', { cx: x + 3.5, cy: y - 4.5, r: 1.5, fill: '#fff' }, g);
  }
  function awanSvg(induk, x, y, skala) {
    var g = sv('g', { transform: 'translate(' + x + ' ' + y + ') scale(' + skala + ')' }, induk), d = sv('g', { fill: '#fff', opacity: 0.95 }, g);
    sv('ellipse', { cx: 0, cy: 8, rx: 24, ry: 10 }, d); sv('ellipse', { cx: 20, cy: 4, rx: 20, ry: 11 }, d);
    sv('ellipse', { cx: 38, cy: 9, rx: 16, ry: 8 }, d); sv('ellipse', { cx: 10, cy: -2, rx: 14, ry: 9 }, d);
    return g;
  }
  function grad(d, id, stops) {
    var lg = sv('linearGradient', { id: id, x1: 0, y1: 0, x2: 0, y2: 1 }, d);
    stops.forEach(function (s) { sv('stop', { offset: s[0], 'stop-color': s[1] }, lg); });
  }

  /* ---------- gambar tangga dan ular ---------- */
  function gTangga(induk, a, b) {
    var dx = b.x - a.x, dy = b.y - a.y, L = Math.sqrt(dx * dx + dy * dy);
    var ux = dx / L, uy = dy / L, nx = -uy * 9, ny = ux * 9, t, ps, i;
    var g = sv('g', null, induk);
    function garis(x1, y1, x2, y2, w, c, o) {
      sv('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: c, 'stroke-width': w, 'stroke-linecap': 'round', opacity: o || 1 }, g);
    }
    ps = [];
    for (t = 16; t < L - 10; t += 20) ps.push(t);
    /* bayangan */
    garis(a.x + nx + 2, a.y + ny + 4, b.x + nx + 2, b.y + ny + 4, 9, '#000', 0.2);
    garis(a.x - nx + 2, a.y - ny + 4, b.x - nx + 2, b.y - ny + 4, 9, '#000', 0.2);
    [[7.5, '#5A3513'], [4, '#D9A05B']].forEach(function (lap) {
      garis(a.x + nx, a.y + ny, b.x + nx, b.y + ny, lap[0] + 1.5, lap[1]);
      garis(a.x - nx, a.y - ny, b.x - nx, b.y - ny, lap[0] + 1.5, lap[1]);
      for (i = 0; i < ps.length; i++) {
        garis(a.x + ux * ps[i] + nx, a.y + uy * ps[i] + ny, a.x + ux * ps[i] - nx, a.y + uy * ps[i] - ny, lap[0], lap[1]);
      }
    });
    /* baut di ujung rel */
    [[a, 1], [a, -1], [b, 1], [b, -1]].forEach(function (q) {
      sv('circle', { cx: q[0].x + nx * q[1], cy: q[0].y + ny * q[1], r: 2.2, fill: '#FFE9B8' }, g);
    });
  }
  function gUlar(induk, a, b, wr, urut) {
    var dx = b.x - a.x, dy = b.y - a.y, L = Math.sqrt(dx * dx + dy * dy);
    var nx = -dy / L, ny = dx / L, gel = Math.max(2, Math.round(L / 100)), amp = 14, m = 32;
    var pts = [], i, s, o, d, g = sv('g', null, induk), hx, hy, hl, px, py, kepala, kg, ki, ld, tx, ty;
    for (i = 0; i <= m; i++) {
      s = i / m; o = amp * Math.sin(s * gel * Math.PI);
      pts.push([a.x + dx * s + nx * o, a.y + dy * s + ny * o]);
    }
    d = 'M' + pts.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' L');
    hx = pts[0][0] - pts[1][0]; hy = pts[0][1] - pts[1][1]; hl = Math.sqrt(hx * hx + hy * hy) || 1; hx /= hl; hy /= hl;
    px = -hy; py = hx;
    kepala = pts[0];
    sv('path', { d: d, transform: 'translate(2 4)', fill: 'none', stroke: '#000', 'stroke-width': 17, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.2 }, g);
    sv('path', { d: d, fill: 'none', stroke: wr[0], 'stroke-width': 17, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    sv('path', { d: d, fill: 'none', stroke: wr[1], 'stroke-width': 12, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    sv('path', { d: d, fill: 'none', stroke: wr[0], 'stroke-width': 5, 'stroke-dasharray': '0.1 15', 'stroke-linecap': 'round', opacity: 0.55 }, g);
    sv('path', { d: d, fill: 'none', stroke: '#fff', 'stroke-width': 2.5, 'stroke-dasharray': '7 22', 'stroke-linecap': 'round', opacity: 0.5, transform: 'translate(-2.5 -2.5)' }, g);
    /* kepala: koordinat lokal berpusat di kepala; mengangguk, lidah menjulur, mata berkedip */
    kg = sv('g', { transform: 'translate(' + kepala[0].toFixed(1) + ' ' + kepala[1].toFixed(1) + ')' }, g);
    ki = sv('g', null, kg);
    animasiSumbu(ki, 'kkAngguk', 2.4 + (urut % 3) * 0.5, urut * 0.5, true);
    ld = sv('g', null, ki);
    animasiSumbu(ld, 'kkLidah', 4 + (urut % 3), urut * 0.9, false);
    tx = hx * 13; ty = hy * 13;
    sv('path', { d: 'M' + tx.toFixed(1) + ' ' + ty.toFixed(1) + ' L' + (tx + hx * 9).toFixed(1) + ' ' + (ty + hy * 9).toFixed(1) +
      ' M' + (tx + hx * 9).toFixed(1) + ' ' + (ty + hy * 9).toFixed(1) + ' l' + (hx * 4 + px * 4).toFixed(1) + ' ' + (hy * 4 + py * 4).toFixed(1) +
      ' M' + (tx + hx * 9).toFixed(1) + ' ' + (ty + hy * 9).toFixed(1) + ' l' + (hx * 4 - px * 4).toFixed(1) + ' ' + (hy * 4 - py * 4).toFixed(1),
      fill: 'none', stroke: '#E5484D', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, ld);
    sv('circle', { cx: 0, cy: 0, r: 14, fill: wr[0] }, ki);
    sv('circle', { cx: 0, cy: 0, r: 11.2, fill: wr[1] }, ki);
    [-1, 1].forEach(function (sd, j) {
      var ex = hx * 2 + px * 6 * sd, ey = hy * 2 + py * 6 * sd, mt = sv('g', null, ki);
      sv('circle', { cx: ex, cy: ey, r: 4.8, fill: '#fff', stroke: wr[0], 'stroke-width': 1 }, mt);
      sv('circle', { cx: ex + hx * 1.2, cy: ey + hy * 1.2, r: 2.5, fill: '#222' }, mt);
      sv('circle', { cx: ex + hx * 0.5 - px * 0.8 * sd, cy: ey + hy * 0.5 - py * 0.8 * sd, r: 0.9, fill: '#fff' }, mt);
      animasi(mt, 'kkMata', 5 + (urut % 2), urut * 1.3 + j * 0.05, false);
    });
    sv('circle', { cx: hx * 9, cy: hy * 9, r: 1.1, fill: wr[0] }, ki);
    animasi(g, 'kkGoyang', 2.6 + (urut % 3) * 0.6, urut * 0.8, true);
    return g;
  }

  /* adegan di kolom kiri (petak kosong di sisi MULAI): langit, matahari, awan, pohon, bukit */
  function adegan(induk, defs, Hs, S) {
    var g = sv('g', null, induk), i, a, sinar, kn, tajuk, pohon;
    var cp = sv('clipPath', { id: 'kkclipAdegan' }, defs);
    sv('rect', { x: 3, y: 3, width: S - 6, height: Hs - 4, rx: 14 }, cp);
    grad(defs, 'kkgLangit', [['0', '#8FD3FF'], ['1', '#E4F6FF']]);
    grad(defs, 'kkgBukit', [['0', '#7DD88C'], ['1', '#3BAA58']]);
    var sc = sv('g', { 'clip-path': 'url(#kkclipAdegan)' }, g);
    sv('rect', { x: 0, y: 0, width: S, height: Hs, fill: 'url(#kkgLangit)' }, sc);
    /* matahari berputar pelan */
    sinar = sv('g', null, sc);
    for (i = 0; i < 12; i++) {
      a = i * 30 * Math.PI / 180;
      sv('line', { x1: (50 + 31 * Math.cos(a)).toFixed(1), y1: (Hs * 0.37 + 31 * Math.sin(a)).toFixed(1), x2: (50 + 42 * Math.cos(a)).toFixed(1), y2: (Hs * 0.37 + 42 * Math.sin(a)).toFixed(1), stroke: '#FFC933', 'stroke-width': 5, 'stroke-linecap': 'round' }, sinar);
    }
    animasi(sinar, 'kkPutar', 40, 0, false);
    var sy = Hs * 0.37;
    sv('circle', { cx: 50, cy: sy, r: 25, fill: '#FFD54A', stroke: '#F5A524', 'stroke-width': 3 }, sc);
    sv('circle', { cx: 42, cy: sy - 3, r: 2.6, fill: '#6B3E00' }, sc); sv('circle', { cx: 58, cy: sy - 3, r: 2.6, fill: '#6B3E00' }, sc);
    sv('path', { d: 'M40 ' + (sy + 6) + ' Q50 ' + (sy + 16) + ' 60 ' + (sy + 6), fill: 'none', stroke: '#6B3E00', 'stroke-width': 2.6, 'stroke-linecap': 'round' }, sc);
    sv('circle', { cx: 35, cy: sy + 6, r: 4, fill: '#FF9F80', opacity: 0.6 }, sc); sv('circle', { cx: 65, cy: sy + 6, r: 4, fill: '#FF9F80', opacity: 0.6 }, sc);
    /* awan */
    kn = awanSvg(sc, 14, 46, 0.62); animasi(kn, 'kkGeser', 7, 0, true);
    kn = awanSvg(sc, 52, 22, 0.42); animasi(kn, 'kkGeser', 9, 3, true);
    /* bukit */
    sv('ellipse', { cx: 50, cy: Hs + 34, rx: 80, ry: 62, fill: 'url(#kkgBukit)' }, sc);
    sv('ellipse', { cx: 14, cy: Hs - 6, rx: 22, ry: 10, fill: '#52C268' }, sc);
    /* pohon bergoyang */
    pohon = sv('g', null, sc);
    sv('path', { d: 'M44 ' + (Hs - 24) + ' L46 ' + (Hs - 84) + ' L56 ' + (Hs - 84) + ' L58 ' + (Hs - 24) + ' Z', fill: '#8A5A2B' }, pohon);
    tajuk = sv('g', null, pohon);
    sv('circle', { cx: 50, cy: Hs - 112, r: 28, fill: '#3FAF5B' }, tajuk);
    sv('circle', { cx: 31, cy: Hs - 92, r: 20, fill: '#37A154' }, tajuk);
    sv('circle', { cx: 69, cy: Hs - 92, r: 20, fill: '#37A154' }, tajuk);
    sv('circle', { cx: 42, cy: Hs - 122, r: 11, fill: '#6FD07F', opacity: 0.75 }, tajuk);
    [[40, 100], [62, 104], [52, 88], [30, 90], [70, 90]].forEach(function (q) { sv('circle', { cx: q[0], cy: Hs - q[1], r: 4.2, fill: '#E5484D', stroke: '#B8323A', 'stroke-width': 1 }, tajuk); });
    animasi(tajuk, 'kkGoyang', 4.5, 0, true, '50% 100%');
    /* burung melayang dan rumput bergoyang */
    [[26, 18, 0], [78, 76, 1.6]].forEach(function (q, ib) {
      var w = sv('g', { transform: 'translate(' + q[0] + ' ' + q[1] + ')' }, sc), dr = sv('g', null, w);
      animasi(dr, 'kkGeser', 6 + ib * 2, q[2], true);
      animasi(sv('path', { d: 'M-8 0 Q-4 -6 0 0 Q4 -6 8 0', fill: 'none', stroke: '#3A4A6B', 'stroke-width': 2, 'stroke-linecap': 'round' }, dr), 'kkKepak', 0.7, ib * 0.3, true);
    });
    [[30, Hs - 3], [64, Hs - 5], [90, Hs - 9], [8, Hs - 9]].forEach(function (q, ir) {
      var t = sv('path', { d: 'M' + q[0] + ' ' + q[1] + ' q-2 -12 -6 -14 M' + q[0] + ' ' + q[1] + ' q0 -14 0 -18 M' + q[0] + ' ' + q[1] + ' q2 -12 6 -14', fill: 'none', stroke: '#2E8F4A', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, sc);
      animasi(t, 'kkGoyang', 2.4 + ir * 0.4, ir * 0.5, true, '50% 100%');
    });
    /* bunga di rumput */
    bunga(sc, 16, Hs - 16, '#FF8FA3'); bunga(sc, 84, Hs - 12, '#FFFFFF'); bunga(sc, 74, Hs - 22, '#FFB347');
    return g;
  }

  /* ---------- papan ular tangga ---------- */
  /* Mengembalikan { svg, N, pos, lompat, pindah(p, n), tata(), sorot(p) }.
   * Cangkang untuk papan lain (ludo, monopoli) dapat memakai pola yang sama: bangun papan, kembalikan pusat(n) dan bidak. */
  function bangunPapan(k, panj, pemain) {
    var cols = panj.kolom, rows = panj.baris, N = cols * rows, S = 100, W = (cols + 1) * S, H = rows * S, Hs = (rows - 1) * S;
    var seed = seedPapan(k, panj.id);
    var r = rng(seed), rd = rng((seed ^ 0x9E3779B9) >>> 0);
    var lomp = buatLompatan(N, cols, panj.tangga, panj.ular, r);
    var peta = {}, pos = [], pion = [], p, n, u = 0;
    lomp.forEach(function (l) { peta[l.dari] = l.ke; });
    function sel(m) {
      var idx, rb, c;
      if (m <= 0) return { c: 0, b: rows - 1 };
      if (m > N) m = N;
      idx = m - 1; rb = Math.floor(idx / cols); c = idx % cols;
      if (rb % 2 === 1) c = cols - 1 - c;
      return { c: c + 1, b: rows - 1 - rb };
    }
    function pusat(m) { var s = sel(m); return { x: s.c * S + S / 2, y: s.b * S + S / 2 }; }
    var svg = sv('svg', { viewBox: '-6 -8 ' + (W + 12) + ' ' + (H + 18), preserveAspectRatio: 'xMidYMid meet', role: 'img', 'aria-label': 'Papan ular tangga ' + N + ' petak' });
    svg.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;display:block';
    var defs = sv('defs', null, svg);
    grad(defs, 'kkgA', [['0', '#FFF9E3'], ['1', '#FFE7A0']]);
    grad(defs, 'kkgB', [['0', '#EDFAF2'], ['1', '#BCE6CB']]);
    grad(defs, 'kkgF', [['0', '#FFE98F'], ['1', '#FFC21A']]);
    grad(defs, 'kkgS', [['0', '#D6EEFF'], ['1', '#9CCFF3']]);
    var lapBingkai = sv('g', null, svg), lapAdegan = sv('g', null, svg), lapPetak = sv('g', null, svg), lapDekor = sv('g', null, svg);
    var lapLompat = sv('g', null, svg), lapAngka = sv('g', null, svg), lapPion = sv('g', null, svg), lapKilat = sv('g', { 'pointer-events': 'none' }, svg);
    /* bingkai papan */
    sv('rect', { x: -3, y: 1, width: W + 6, height: H + 6, rx: 22, fill: 'rgba(0,0,0,.25)' }, lapBingkai);
    sv('rect', { x: -3, y: -3, width: W + 6, height: H + 6, rx: 22, fill: 'rgba(255,255,255,.2)', stroke: 'rgba(255,255,255,.75)', 'stroke-width': 3 }, lapBingkai);
    if (rows > 1) adegan(lapAdegan, defs, Hs, S);
    /* petak */
    var s0 = sel(0), nBintang = 0;
    sv('rect', { x: s0.c * S + 2, y: s0.b * S + 6, width: S - 4, height: S - 4, rx: 14, fill: 'rgba(0,0,0,.2)' }, lapPetak);
    sv('rect', { x: s0.c * S + 2, y: s0.b * S + 2, width: S - 4, height: S - 4, rx: 14, fill: 'url(#kkgS)', stroke: '#4D8FC4', 'stroke-width': 2.5 }, lapPetak);
    teksSvg(lapAngka, s0.c * S + S / 2, s0.b * S + 26, 'MULAI', 20, '#1D4E89', 'middle');
    for (n = 1; n <= N; n++) {
      var s = sel(n), akhir = n === N, x0 = s.c * S, y0 = s.b * S, tipe;
      sv('rect', { x: x0 + 2, y: y0 + 6, width: S - 4, height: S - 4, rx: 14, fill: 'rgba(0,0,0,.2)' }, lapPetak);
      sv('rect', {
        x: x0 + 2, y: y0 + 2, width: S - 4, height: S - 4, rx: 14,
        fill: akhir ? 'url(#kkgF)' : ((s.c + s.b) % 2 ? 'url(#kkgB)' : 'url(#kkgA)'),
        stroke: akhir ? '#D99A00' : 'rgba(0,0,0,.2)', 'stroke-width': akhir ? 3 : 2
      }, lapPetak);
      sv('rect', { x: x0 + 12, y: y0 + 6, width: S - 24, height: 5, rx: 2.5, fill: 'rgba(255,255,255,.65)' }, lapPetak);
      teksSvg(lapAngka, x0 + 9, y0 + 30, String(n), 24, '#4A2F12', 'start');
      if (akhir) {
        var cpF = sv('clipPath', { id: 'kkclipF' }, defs), gF, sinarF, ia, aF, tr;
        sv('rect', { x: x0 + 2, y: y0 + 2, width: S - 4, height: S - 4, rx: 14 }, cpF);
        gF = sv('g', { 'clip-path': 'url(#kkclipF)' }, lapDekor); sinarF = sv('g', null, gF);
        for (ia = 0; ia < 12; ia++) {
          aF = ia * 30 * Math.PI / 180;
          sv('polygon', { points: (x0 + 50) + ',' + (y0 + 50) + ' ' + (x0 + 50 + 80 * Math.cos(aF - 0.14)).toFixed(1) + ',' + (y0 + 50 + 80 * Math.sin(aF - 0.14)).toFixed(1) + ' ' + (x0 + 50 + 80 * Math.cos(aF + 0.14)).toFixed(1) + ',' + (y0 + 50 + 80 * Math.sin(aF + 0.14)).toFixed(1), fill: 'rgba(255,255,255,.34)' }, sinarF);
        }
        animasi(sinarF, 'kkPutar', 16, 0, false);
        tr = sv('g', { transform: 'translate(' + (x0 + 78) + ' ' + (y0 + 52) + ') scale(.62)' }, lapDekor);
        sv('path', { d: 'M-14 -12 Q-25 -12 -22 -2 Q-20 6 -12 4 M14 -12 Q25 -12 22 -2 Q20 6 12 4', fill: 'none', stroke: '#C98A00', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, tr);
        sv('path', { d: 'M-14 -16 H14 V-4 Q14 10 0 12 Q-14 10 -14 -4 Z', fill: '#FFD54A', stroke: '#C98A00', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, tr);
        sv('path', { d: 'M-8 -12 V-3 Q-8 4 -3 6', fill: 'none', stroke: '#fff', 'stroke-width': 2.5, 'stroke-linecap': 'round', opacity: 0.8 }, tr);
        sv('rect', { x: -3, y: 12, width: 6, height: 8, fill: '#E5A800' }, tr);
        sv('rect', { x: -10, y: 20, width: 20, height: 5, rx: 2, fill: '#C98A00' }, tr);
        teksSvg(lapAngka, x0 + S - 8, y0 + 28, 'FINIS', 15, '#9A5B00', 'end');
        var i2, j2;
        for (j2 = 0; j2 < 2; j2++) for (i2 = 0; i2 < 8; i2++) sv('rect', { x: x0 + 10 + i2 * 10, y: y0 + 82 + j2 * 6, width: 10, height: 6, fill: (i2 + j2) % 2 ? '#222' : '#fff' }, lapDekor);
        var b1 = bintangKecil(lapDekor, x0 + 84, y0 + 44, 8); animasi(b1, 'kkKedip', 1.8, 0, false);
        b1 = bintangKecil(lapDekor, x0 + 16, y0 + 60, 6); animasi(b1, 'kkKedip', 2.2, 0.9, false);
      } else if (rd() < 0.42) {
        tipe = Math.floor(rd() * 4);
        if (tipe === 0) bunga(lapDekor, x0 + 80, y0 + 28, ['#FF8FA3', '#FFFFFF', '#FFB347', '#B58CE8'][Math.floor(rd() * 4)]);
        else if (tipe === 1) tunas(lapDekor, x0 + 80, y0 + 28);
        else if (tipe === 2) { var bk = bintangKecil(lapDekor, x0 + 80, y0 + 28, 9); if (nBintang < 6) { animasi(bk, 'kkKedip', 2 + (nBintang % 3) * 0.5, nBintang * 0.7, false); nBintang++; } }
        else jamur(lapDekor, x0 + 80, y0 + 22);
      }
    }
    /* tangga dan ular */
    lomp.forEach(function (l) {
      if (l.jenis === 'tangga') gTangga(lapLompat, pusat(l.dari), pusat(l.ke));
      else { gUlar(lapLompat, pusat(l.dari), pusat(l.ke), ULAR_WARNA[u % ULAR_WARNA.length], u); u++; }
    });
    /* bidak */
    function buatPion(q) {
      var pm = pemain[q], g = sv('g', null, lapPion), isi, badge, id = 'kkclip' + q, ring, bob;
      animasi(sv('ellipse', { cx: 0, cy: 33, rx: 22, ry: 6, fill: 'rgba(0,0,0,.28)' }, g), 'kkBayang', 1.8, q * 0.35, false);
      ring = sv('circle', { r: 37, fill: 'none', stroke: pm.warna, 'stroke-width': 5, display: 'none' }, g);
      animasi(ring, 'kkDenyut', 1.2, 0, false);
      ring.style.animationTimingFunction = 'ease-out';
      bob = sv('g', null, g);
      animasi(bob, 'kkLompatKecil', 1.8, q * 0.35, false);
      sv('circle', { r: 30, fill: '#fff', stroke: pm.warna, 'stroke-width': 7 }, bob);
      isi = sv('g', null, bob);
      isi.innerHTML = '<g transform="scale(.55)">' + bentukSvg(q, pm.warna) + '</g>';
      if (pm.src) muat(pm.src, function (ok) {
        var cp, im;
        if (!ok) return;
        isi.innerHTML = '';
        cp = sv('clipPath', { id: id }, isi); sv('circle', { r: 26 }, cp);
        im = sv('image', { x: -26, y: -26, width: 52, height: 52, preserveAspectRatio: 'xMidYMid slice', 'clip-path': 'url(#' + id + ')' }, isi);
        im.setAttribute('href', pm.src); im.setAttributeNS(XL, 'xlink:href', pm.src);
      });
      badge = sv('g', null, bob);
      sv('circle', { cx: 22, cy: 22, r: 11, fill: pm.warna, stroke: '#fff', 'stroke-width': 2.5 }, badge);
      var tb = sv('text', { x: 22, y: 27, 'font-size': 14, 'font-weight': 700, fill: '#fff', 'text-anchor': 'middle', 'font-family': FONT }, badge);
      tb.textContent = String(q + 1);
      return { g: g, badge: badge, ring: ring };
    }
    for (p = 0; p < pemain.length; p++) { pos.push(0); pion.push(buatPion(p)); }
    var SLOT1 = [[0.5, 0.64]], SLOT2 = [[0.3, 0.64], [0.7, 0.64]];
    var SLOT5 = [[0.2, 0.56], [0.5, 0.56], [0.8, 0.56], [0.35, 0.82], [0.65, 0.82]];
    function tata() {
      var grup = {}, q, key;
      for (q = 0; q < pemain.length; q++) { key = pos[q]; (grup[key] = grup[key] || []).push(q); }
      Object.keys(grup).forEach(function (kk) {
        var arr = grup[kk], jml = arr.length, sl = jml === 1 ? SLOT1 : (jml === 2 ? SLOT2 : SLOT5);
        var sk = jml === 1 ? 0.85 : (jml === 2 ? 0.62 : 0.46), st = sel(+kk);
        arr.forEach(function (qq, i) {
          var x = st.c * S + sl[i][0] * S, y = st.b * S + sl[i][1] * S;
          pion[qq].g.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + sk + ')';
          pion[qq].badge.setAttribute('display', jml >= 3 ? 'none' : 'inline');
        });
      });
    }
    var cpK = sv('clipPath', { id: 'kkclipPapan' }, defs), lgK = sv('linearGradient', { id: 'kkgKilat', x1: 0, y1: 0, x2: 1, y2: 0 }, defs), gK, skK, rK;
    sv('rect', { x: -3, y: -3, width: W + 6, height: H + 6, rx: 22 }, cpK);
    sv('stop', { offset: 0, 'stop-color': '#fff', 'stop-opacity': 0 }, lgK);
    sv('stop', { offset: 0.5, 'stop-color': '#fff', 'stop-opacity': 0.4 }, lgK);
    sv('stop', { offset: 1, 'stop-color': '#fff', 'stop-opacity': 0 }, lgK);
    gK = sv('g', { 'clip-path': 'url(#kkclipPapan)' }, lapKilat); skK = sv('g', { transform: 'skewX(-20)' }, gK);
    rK = sv('rect', { x: -220, y: -10, width: 130, height: H + 20, fill: 'url(#kkgKilat)' }, skK);
    animasi(rK, 'kkKilat', 9, 2, false);
    tata();
    function durasi(ms) {
      var j, v = (kurangGerak() || !ms) ? '' : 'transform ' + ms + 'ms ease-in-out';
      for (j = 0; j < pion.length; j++) pion[j].g.style.transition = v;
    }
    durasi(300);
    return {
      svg: svg, N: N, pos: pos, lompat: peta, daftarLompat: lomp, pusat: pusat,
      tata: tata, durasi: durasi,
      depan: function (q) { try { lapPion.appendChild(pion[q].g); } catch (e) {} },
      sorot: function (q) { var i; for (i = 0; i < pion.length; i++) pion[i].ring.setAttribute('display', i === q ? 'inline' : 'none'); },
      pindah: function (q, m) { pos[q] = Math.max(0, Math.min(N, m)); tata(); }
    };
  }

  /* ilustrasi kecil (string SVG); elemen ber-data-an diberi animasi oleh animasiData */
  function pohonSvg(w) {
    return '<svg viewBox="0 0 60 84" width="' + w + '" height="' + Math.round(w * 84 / 60) + '" style="display:block"><path d="M26 82 L28 46 L34 46 L36 82Z" fill="#8A5A2B"/><g data-an="kkGoyang,4.2,0,1,50% 100%"><circle cx="30" cy="32" r="22" fill="#3FAF5B"/><circle cx="16" cy="44" r="15" fill="#37A154"/><circle cx="44" cy="44" r="15" fill="#37A154"/><circle cx="24" cy="26" r="8" fill="#6FD07F" opacity=".75"/><circle cx="26" cy="38" r="3.4" fill="#E5484D"/><circle cx="40" cy="30" r="3.4" fill="#E5484D"/><circle cx="34" cy="48" r="3.4" fill="#E5484D"/></g></svg>';
  }
  function semakSvg(w) {
    return '<svg viewBox="0 0 80 44" width="' + w + '" height="' + Math.round(w * 44 / 80) + '" style="display:block"><g data-an="kkGoyang,3.6,0,1,50% 100%"><ellipse cx="22" cy="30" rx="20" ry="12" fill="#37A154"/><ellipse cx="46" cy="28" rx="24" ry="14" fill="#3FAF5B"/><ellipse cx="64" cy="33" rx="14" ry="9" fill="#52C268"/><circle cx="16" cy="24" r="4" fill="#FF8FA3"/><circle cx="34" cy="18" r="4" fill="#fff"/><circle cx="52" cy="20" r="4" fill="#FFB347"/><circle cx="68" cy="28" r="3.6" fill="#FF8FA3"/></g></svg>';
  }
  function rumahSvg(w) {
    return '<svg viewBox="0 0 80 72" width="' + w + '" height="' + Math.round(w * 72 / 80) + '" style="display:block;overflow:visible"><circle data-an="kkAsap,3,0,0" cx="57" cy="10" r="4" fill="#fff" opacity=".85"/><circle data-an="kkAsap,3,1.5,0" cx="57" cy="10" r="4" fill="#fff" opacity=".85"/><rect x="52" y="12" width="9" height="18" fill="#B8323A"/><polygon points="0,36 34,10 68,36" fill="#E5484D"/><rect x="6" y="34" width="56" height="34" rx="3" fill="#FFE9B8" stroke="#C98A45" stroke-width="2"/><rect x="28" y="46" width="13" height="22" rx="2" fill="#8A5A2B"/><rect x="45" y="42" width="12" height="12" fill="#FFE27A" stroke="#C98A45" stroke-width="2"/><line x1="51" y1="42" x2="51" y2="54" stroke="#C98A45" stroke-width="1.5"/><rect x="10" y="42" width="12" height="12" fill="#FFE27A" stroke="#C98A45" stroke-width="2"/></svg>';
  }
  function balonSvg() {
    return '<svg viewBox="0 0 56 88" width="54" height="85"><path d="M28 2 C6 2 2 24 10 38 C14 46 20 52 22 58 H34 C36 52 42 46 46 38 C54 24 50 2 28 2Z" fill="#FF6B6B"/><path d="M28 2 C16 8 16 40 22 58 H34 C40 40 40 8 28 2Z" fill="#FFD54A"/><path d="M28 2 C24 14 24 44 26 58 H30 C32 44 32 14 28 2Z" fill="#fff" opacity=".7"/><line x1="22" y1="58" x2="22" y2="72" stroke="#8A5A2B" stroke-width="1.6"/><line x1="34" y1="58" x2="34" y2="72" stroke="#8A5A2B" stroke-width="1.6"/><rect x="19" y="72" width="18" height="12" rx="3" fill="#B7793A"/></svg>';
  }

  /* hiasan latar di tepi layar: bukit, rumah berasap, pohon, balon, burung, awan, kupu-kupu, kelopak, kilau (CSS: transform dan opacity saja) */
  function dekorLatar(induk) {
    var d = document.createElement('div'), bukit;
    d.setAttribute('aria-hidden', 'true');
    d.style.cssText = 'position:absolute;left:0;top:0;right:0;bottom:0;pointer-events:none;overflow:hidden';
    bukit = document.createElement('div');
    bukit.style.cssText = 'position:absolute;left:0;right:0;bottom:0;height:96px';
    bukit.innerHTML = '<svg viewBox="0 0 1200 100" preserveAspectRatio="none" width="100%" height="96" style="display:block"><path d="M0 52 Q150 6 320 44 T640 38 T960 50 T1200 30 V100 H0Z" fill="#2E9A54"/><path d="M0 72 Q200 32 420 66 T820 60 T1200 58 V100 H0Z" fill="#43B866"/></svg>';
    d.appendChild(bukit);
    function taruh(css, html, nama, dur, tunda, alt) {
      var e = document.createElement('div');
      e.style.cssText = 'position:absolute;' + css; e.innerHTML = html;
      if (nama) animasi(e, nama, dur, tunda, alt);
      animasiData(e);
      d.appendChild(e);
    }
    function awan(w) { return '<svg viewBox="-30 -16 90 40" width="' + w + '" height="' + Math.round(w * 40 / 90) + '"><g fill="#fff" opacity=".92"><ellipse cx="0" cy="8" rx="24" ry="10"/><ellipse cx="20" cy="4" rx="20" ry="11"/><ellipse cx="38" cy="9" rx="16" ry="8"/><ellipse cx="10" cy="-2" rx="14" ry="9"/></g></svg>'; }
    function kupu(c1, c2) { return '<svg viewBox="-20 -18 40 36" width="46" height="41"><g data-an="kkSayap,0.45,0,0"><ellipse cx="-9" cy="-6" rx="10" ry="8" fill="' + c1 + '"/><ellipse cx="9" cy="-6" rx="10" ry="8" fill="' + c1 + '"/><ellipse cx="-7" cy="7" rx="7" ry="6" fill="' + c2 + '"/><ellipse cx="7" cy="7" rx="7" ry="6" fill="' + c2 + '"/></g><rect x="-1.3" y="-10" width="2.6" height="21" rx="1.3" fill="#4A2F12"/><path d="M0 -10 Q-5 -17 -8 -16 M0 -10 Q5 -17 8 -16" stroke="#4A2F12" fill="none" stroke-width="1.3"/></svg>'; }
    function kilau(c) { return '<svg viewBox="-12 -12 24 24" width="22" height="22"><path d="M0 -10 Q1.5 -1.5 10 0 Q1.5 1.5 0 10 Q-1.5 1.5 -10 0 Q-1.5 -1.5 0 -10Z" fill="' + c + '"/></svg>'; }
    function burung() { return '<svg viewBox="-12 -8 24 14" width="30" height="18"><path data-an="kkKepak,0.6,0,1" d="M-10 0 Q-5 -8 0 0 Q5 -8 10 0" fill="none" stroke="#3A4A6B" stroke-width="2.2" stroke-linecap="round"/></svg>'; }
    function kelopak() { return '<svg viewBox="-6 -6 12 12" width="14" height="14"><ellipse rx="5" ry="3" fill="#FFB6C8" transform="rotate(30)"/></svg>'; }
    taruh('left:1%;top:4%', awan(120), 'kkGeser', 11, 0, true);
    taruh('right:1.5%;top:34%', awan(92), 'kkGeser', 13, 4, true);
    taruh('right:6%;top:3%', balonSvg(), 'kkMengambang', 7, 0, true);
    taruh('left:0;top:12%', burung(), 'kkTerbang', 28, 0, false);
    taruh('left:0;top:24%', burung(), 'kkTerbang', 36, 14, false);
    taruh('left:4%;top:44%', kupu('#FF8FA3', '#FFD54A'), 'kkMelayang', 4.6, 0, true);
    taruh('right:4%;top:60%', kupu('#8FD3FF', '#FFFFFF'), 'kkMelayang', 5.4, 2, true);
    taruh('left:13%;top:22%', kilau('#FFE27A'), 'kkKedip', 2.2, 0, false);
    taruh('right:15%;top:16%', kilau('#FFFFFF'), 'kkKedip', 2.6, 1, false);
    taruh('left:2%;top:70%', kilau('#FFE27A'), 'kkKedip', 2.4, 0.5, false);
    taruh('right:13%;top:50%', kilau('#FFFFFF'), 'kkKedip', 2, 1.4, false);
    taruh('left:1.5%;bottom:14px', rumahSvg(84), null);
    taruh('left:9%;bottom:10px', pohonSvg(44), null);
    taruh('right:2.5%;bottom:12px', pohonSvg(56), null);
    taruh('right:10%;bottom:8px', semakSvg(78), null);
    [[6, 10, 0], [19, 13, 4], [78, 11, 7], [90, 14, 2], [68, 12, 9]].forEach(function (q) {
      taruh('left:' + q[0] + '%;top:0', kelopak(), 'kkJatuh', q[1], q[2], false);
    });
    induk.appendChild(d);
    return d;
  }

  /* ---------- katalog karakter ---------- */
  function urai(j) {
    var dasar, hasil = [], lihat = {};
    if (!j || typeof j.dasar !== 'string' || !j.aset || !j.aset.length) return [];
    dasar = j.dasar;
    if (dasar.indexOf('https://') !== 0) return [];
    if (dasar.charAt(dasar.length - 1) !== '/') dasar += '/';
    j.aset.forEach(function (a, i) {
      var src, id;
      try {
        if (!a || a.jenis !== 'maskot' || typeof a.file !== 'string' || !a.file) return;
        src = dasar + a.file.replace(/^\/+/, '');
        id = String(a.id != null ? a.id : src);
        if (lihat[id] || src.indexOf('https://') !== 0) return;
        lihat[id] = true;
        hasil.push({
          id: id, nama: String(a.nama || ('Karakter ' + (i + 1))).slice(0, 20), src: src,
          senang: (a.pose && typeof a.pose.senang === 'string') ? dasar + a.pose.senang.replace(/^\/+/, '') : '',
          berpikir: (a.pose && typeof a.pose.berpikir === 'string') ? dasar + a.pose.berpikir.replace(/^\/+/, '') : ''
        });
      } catch (e) {}
    });
    return hasil;
  }
  function ambilKatalog(selesai, tunda) {
    var sudah = false, tm;
    function akhir(d) {
      if (sudah) return;
      sudah = true; clearTimeout(tm);
      if (d && d.length) katalogCache = d;
      selesai(d || []);
    }
    if (katalogCache) { selesai(katalogCache); return; }
    tm = setTimeout(function () { akhir([]); }, 4000);
    try {
      if (typeof fetch !== 'function') { akhir([]); return; }
      fetch(KATALOG).then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); })
        .then(function (j) { akhir(urai(j)); })
        .catch(function () { akhir([]); });
    } catch (e) { akhir([]); }
  }

  /* ---------- masuk dari kit ---------- */
  /* alat uji: sebaran n lemparan, mis. KIT_KELOMPOK.diagDadu(600) -> {1:..,...,6:..} */
  (window.KIT_KELOMPOK = window.KIT_KELOMPOK || {}).diagDadu = function (n) {
    var h = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }, i;
    for (i = 0; i < (n || 600); i++) h[acakDadu()]++;
    return h;
  };
  window.KIT_KELOMPOK.mulai = function (k) {
    var el = k.alat.el, tombol = k.alat.tombol, esc = k.alat.esc;
    var waktu = [];
    pasangCss();
    var tp = { jml: 2, panjang: 'sedang', lisan: false, nama: [], kar: [], manual: [], aktif: 0, opsi: [] };
    var i;
    for (i = 0; i < 5; i++) { tp.nama.push('Pemain ' + (i + 1)); tp.kar.push(-1); tp.manual.push(false); }

    /* pewaktu yang bisa dijeda (menu jeda bingkai HUD): tunda() mengembalikan catatan; batalTunda(catatan) membatalkannya */
    var terjeda = false;
    function jalankanTunda(r) {
      r.mulai = new Date().getTime();
      r.t = setTimeout(function () {
        var ix = waktu.indexOf(r);
        if (ix >= 0) waktu.splice(ix, 1);
        r.selesai = true;
        try { r.fn(); } catch (e) {}
      }, r.sisa);
    }
    function tunda(fn, ms) {
      var r = { fn: fn, sisa: ms, t: 0, mulai: 0, selesai: false };
      waktu.push(r);
      if (!terjeda) jalankanTunda(r);
      return r;
    }
    function batalTunda(r) {
      var ix;
      if (!r) return;
      clearTimeout(r.t); r.selesai = true;
      ix = waktu.indexOf(r);
      if (ix >= 0) waktu.splice(ix, 1);
    }
    function bersihWaktu() { while (waktu.length) clearTimeout(waktu.pop().t); }
    function jedaWaktu(jeda) {
      var i, r, kini = new Date().getTime();
      if (jeda === terjeda) return;
      terjeda = jeda;
      for (i = 0; i < waktu.length; i++) {
        r = waktu[i];
        if (jeda) { clearTimeout(r.t); r.sisa = Math.max(0, r.sisa - (kini - r.mulai)); }
        else jalankanTunda(r);
      }
    }

    /* karakter maskot MPI (k.D.maskot): bentuk datanya belum diketahui pasti, jadi dicoba beberapa cara dan aman bila gagal */
    function maskotMpi() {
      var m = k.D && k.D.maskot, nama = 'Maskot kita', alamat = '', s;
      if (!m) return null;
      try {
        if (typeof m === 'string') alamat = m;
        else if (typeof m === 'object') {
          nama = String(m.nama || m.name || nama);
          alamat = m.src || m.gambar || m.file || m.url || m.senang || '';
          if (typeof alamat !== 'string') alamat = '';
        }
        if (alamat && !/^(https?:|data:|blob:)/.test(alamat) && k.alat.src) {
          s = k.alat.src(alamat); if (typeof s === 'string' && s) alamat = s;
        }
        if (!alamat && k.alat.src) {
          s = k.alat.src(typeof m === 'string' ? m : 'maskot'); if (typeof s === 'string' && s) alamat = s;
        }
        if (!alamat && k.alat.gambar) {
          s = k.alat.gambar(typeof m === 'string' ? m : 'maskot', ''); if (s && typeof s.src === 'string') alamat = s.src;
        }
      } catch (e) { alamat = ''; }
      if (!alamat) return null;
      return { id: 'mpi', nama: nama.slice(0, 20), src: alamat, senang: '', berpikir: '' };
    }
    var mpi = maskotMpi();
    tp.opsi = mpi ? [mpi] : [];

    function dipakai(idx, kecuali) {
      var q;
      for (q = 0; q < tp.jml; q++) if (q !== kecuali && tp.kar[q] === idx) return q;
      return -1;
    }
    function bereskan() {
      var p, q, idx;
      if (tp.aktif >= tp.jml) tp.aktif = 0;
      for (p = 0; p < tp.jml; p++) {
        if (tp.kar[p] >= tp.opsi.length) tp.kar[p] = -1;
        if (tp.kar[p] >= 0) for (q = 0; q < p; q++) if (tp.kar[q] === tp.kar[p]) { tp.kar[p] = -1; tp.manual[p] = false; break; }
      }
      for (p = 0; p < tp.jml; p++) {
        if (tp.manual[p] || tp.kar[p] !== -1) continue;
        for (idx = 0; idx < tp.opsi.length; idx++) if (dipakai(idx, p) < 0) { tp.kar[p] = idx; break; }
      }
    }
    bereskan();

    function namaBersih(p) {
      var t = String(tp.nama[p] || '').replace(/\s+/g, ' ').replace(/^ | $/g, '').slice(0, 12);
      return t || ('Pemain ' + (p + 1));
    }
    function panjangDipilih() {
      var j;
      for (j = 0; j < PANJANG.length; j++) if (PANJANG[j].id === tp.panjang) return PANJANG[j];
      return PANJANG[1];
    }
    function bulat(src, uk, wb, cad) {
      var d = el('div', null, cad);
      d.style.cssText = 'width:' + uk + 'px;height:' + uk + 'px;flex:none;border-radius:50%;box-sizing:border-box;border:4px solid ' + wb + ';background:#fff;overflow:hidden;display:flex;align-items:center;justify-content:center';
      if (src) muat(src, function (ok) {
        var im;
        if (!ok) return;
        im = el('img'); im.alt = ''; im.src = src;
        im.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block';
        d.innerHTML = ''; d.appendChild(im);
      });
      return d;
    }
    function svgBentuk(p) {
      return '<svg viewBox="-50 -50 100 100" style="width:70%;height:70%" aria-hidden="true">' + bentukSvg(p, WARNA[p]) + '</svg>';
    }
    function jadikanKlik(e, fn) {
      e.setAttribute('role', 'button'); e.tabIndex = 0;
      e.addEventListener('click', fn);
      e.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); fn(); } });
    }

    /* ----- layar pengaturan ----- */
    function bukaPengaturan() {
      var tutup = false;
      var w = el('div');
      k.latar(w, k.D && k.D.gambar && k.D.gambar.latar ? 'latar' : '');
      var kartu = el('div', 'k-kertas k-pop');
      kartu.style.cssText = 'position:absolute;left:2%;right:2%;top:2%;bottom:2%;box-sizing:border-box;padding:10px 16px;display:flex;flex-direction:column;gap:8px;overflow-y:auto;text-align:center';
      var judul = el('div', null, '<b style="font-size:26px">Ular Tangga</b> <span style="font-weight:700;opacity:.7;margin-left:8px">Soal tersedia: ' + esc(String(k.jumlahSoal)) + '</span>');
      kartu.appendChild(judul);
      /* hiasan sudut kartu: tangga di kiri, ular di kanan, kilau di dekat judul */
      var hias = el('div', null,
        '<svg viewBox="0 0 44 64" width="44" height="64" style="position:absolute;left:22px;top:12px"><g class="h1"><g transform="rotate(-12 22 32)"><line x1="12" y1="2" x2="12" y2="62" stroke="#5A3513" stroke-width="7" stroke-linecap="round"/><line x1="32" y1="2" x2="32" y2="62" stroke="#5A3513" stroke-width="7" stroke-linecap="round"/><line x1="12" y1="2" x2="12" y2="62" stroke="#D9A05B" stroke-width="3.5" stroke-linecap="round"/><line x1="32" y1="2" x2="32" y2="62" stroke="#D9A05B" stroke-width="3.5" stroke-linecap="round"/><g stroke="#5A3513" stroke-width="6" stroke-linecap="round"><line x1="12" y1="14" x2="32" y2="14"/><line x1="12" y1="30" x2="32" y2="30"/><line x1="12" y1="46" x2="32" y2="46"/></g><g stroke="#D9A05B" stroke-width="3" stroke-linecap="round"><line x1="12" y1="14" x2="32" y2="14"/><line x1="12" y1="30" x2="32" y2="30"/><line x1="12" y1="46" x2="32" y2="46"/></g></g></g></svg>' +
        '<svg viewBox="0 0 60 64" width="60" height="64" style="position:absolute;right:22px;top:10px"><g class="h2"><path d="M44 10 C10 16 52 34 18 44 C2 48 22 60 36 58" fill="none" stroke="#1F7A44" stroke-width="13" stroke-linecap="round"/><path d="M44 10 C10 16 52 34 18 44 C2 48 22 60 36 58" fill="none" stroke="#52C47E" stroke-width="9" stroke-linecap="round"/><circle cx="46" cy="9" r="10" fill="#1F7A44"/><circle cx="46" cy="9" r="8" fill="#52C47E"/><circle cx="42" cy="6" r="3.4" fill="#fff"/><circle cx="51" cy="6" r="3.4" fill="#fff"/><circle cx="42.6" cy="6.6" r="1.7" fill="#222"/><circle cx="51.6" cy="6.6" r="1.7" fill="#222"/></g></svg>' +
        '<svg viewBox="-12 -12 24 24" width="20" height="20" style="position:absolute;left:30%;top:10px"><g class="h3"><path d="M0 -10 Q1.5 -1.5 10 0 Q1.5 1.5 0 10 Q-1.5 1.5 -10 0 Q-1.5 -1.5 0 -10Z" fill="#F5A524"/></g></svg>' +
        '<svg viewBox="-12 -12 24 24" width="16" height="16" style="position:absolute;right:30%;top:22px"><g class="h4"><path d="M0 -10 Q1.5 -1.5 10 0 Q1.5 1.5 0 10 Q-1.5 1.5 -10 0 Q-1.5 -1.5 0 -10Z" fill="#F5A524"/></g></svg>');
      hias.setAttribute('aria-hidden', 'true');
      hias.style.cssText = 'position:absolute;left:0;top:0;right:0;height:0;pointer-events:none';
      animasi(hias.querySelector('.h1'), 'kkGoyang', 3, 0, true);
      animasi(hias.querySelector('.h2'), 'kkGoyang', 3.4, 1, true);
      animasi(hias.querySelector('.h3'), 'kkKedip', 2.2, 0, false);
      animasi(hias.querySelector('.h4'), 'kkKedip', 2.6, 1, false);
      kartu.appendChild(hias);
      var hias2 = el('div', null, '<div style="position:absolute;left:14px;bottom:8px">' + semakSvg(96) + '</div><div style="position:absolute;right:18px;bottom:6px">' + pohonSvg(46) + '</div>');
      hias2.setAttribute('aria-hidden', 'true');
      hias2.style.cssText = 'position:absolute;left:0;right:0;bottom:0;height:0;pointer-events:none';
      animasiData(hias2);
      kartu.appendChild(hias2);

      var barisAtur = el('div');
      barisAtur.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px 28px;justify-content:center;align-items:center';
      var gJml = el('div'), gPj = el('div'), gMd = el('div');
      gJml.style.cssText = gPj.style.cssText = gMd.style.cssText = 'display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center';
      barisAtur.style.gap = '6px 20px';
      barisAtur.appendChild(gJml); barisAtur.appendChild(gPj);
      kartu.appendChild(barisAtur);

      function grup(induk, label, items, nilai, pilih) {
        var lb = el('span', null, esc(label));
        lb.style.cssText = 'font:700 18px ' + FONT;
        induk.innerHTML = ''; induk.appendChild(lb);
        items.forEach(function (it) {
          var b = tombol(esc(it.teks), 'sek', function () { pilih(it.nilai); });
          b.style.minWidth = '56px'; b.style.minHeight = '56px'; b.style.paddingLeft = '14px'; b.style.paddingRight = '14px';
          b.setAttribute('aria-pressed', it.nilai === nilai ? 'true' : 'false');
          if (it.nilai === nilai) { b.style.background = '#FFD54A'; b.style.boxShadow = '0 0 0 4px #111'; }
          induk.appendChild(b);
        });
      }
      function segarkanAtur() {
        grup(gJml, 'Pemain', [2, 3, 4, 5].map(function (n) { return { teks: String(n), nilai: n }; }), tp.jml, function (n) {
          tp.jml = n; bereskan(); bangunKolom(); segarkanAtur(); segarkanSemua();
        });
        grup(gPj, 'Papan', PANJANG.map(function (pj) { return { teks: pj.label, nilai: pj.id }; }), tp.panjang, function (id) {
          tp.panjang = id; segarkanAtur();
        });
        grup(gMd, 'Jawab', [{ teks: 'Di layar', nilai: false }, { teks: 'Lisan', nilai: true }], tp.lisan, function (v) {
          tp.lisan = v; segarkanAtur();
        });
        gMd.title = 'Di layar: murid menjawab di layar. Lisan: guru menekan Benar atau Salah.';
      }

      var barisPemain = el('div');
      barisPemain.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;justify-content:center';
      kartu.appendChild(barisPemain);
      var kolom = [], wadahAv = [], inputNama = [];
      function jadikanAktif(p) { if (tp.aktif === p) return; tp.aktif = p; segarkanSemua(); }
      function bangunKolom() {
        barisPemain.innerHTML = ''; kolom = []; wadahAv = []; inputNama = [];
        var p;
        for (p = 0; p < tp.jml; p++) (function (p) {
          var c = el('div'), av = el('div'), inp = el('input');
          c.style.cssText = 'flex:1 1 150px;max-width:200px;min-width:130px;display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px;border-radius:14px;background:rgba(255,255,255,.75);border:4px solid ' + WARNA[p] + ';box-sizing:border-box;cursor:pointer';
          inp.type = 'text'; inp.maxLength = 12; inp.value = tp.nama[p];
          inp.setAttribute('aria-label', 'Nama pemain ' + (p + 1));
          inp.style.cssText = 'width:100%;min-height:56px;box-sizing:border-box;font:700 20px ' + FONT + ';text-align:center;border:2px solid rgba(0,0,0,.3);border-radius:10px;padding:0 6px;background:#fff;color:#222';
          inp.addEventListener('input', function () { tp.nama[p] = inp.value; segarkanLabel(); });
          inp.addEventListener('focus', function () { jadikanAktif(p); });
          c.addEventListener('click', function () { jadikanAktif(p); });
          c.appendChild(av); c.appendChild(inp); barisPemain.appendChild(c);
          kolom.push(c); wadahAv.push(av); inputNama.push(inp);
        })(p);
      }
      function avatarPemain(p, uk) {
        var o = tp.kar[p] >= 0 ? tp.opsi[tp.kar[p]] : null;
        return bulat(o ? o.src : '', uk, WARNA[p], svgBentuk(p));
      }
      function segarkanPemain() {
        var p;
        for (p = 0; p < tp.jml; p++) {
          kolom[p].style.boxShadow = p === tp.aktif ? '0 0 0 4px #111, 0 6px 0 rgba(0,0,0,.3)' : 'none';
          kolom[p].style.background = p === tp.aktif ? '#FFF6CC' : 'rgba(255,255,255,.75)';
          wadahAv[p].innerHTML = ''; wadahAv[p].appendChild(avatarPemain(p, 64));
          if (p === tp.aktif) animasi(wadahAv[p], 'kkLompatKecil', 1.1, 0, false); else wadahAv[p].style.animationName = 'none';
        }
      }

      var labelGaleri = el('div');
      labelGaleri.style.cssText = 'font:700 18px ' + FONT;
      var galeri = el('div');
      galeri.style.cssText = 'overflow-x:auto;padding:6px 4px';
      var galeriDalam = el('div');
      galeriDalam.style.cssText = 'display:flex;gap:8px;margin:0 auto;width:max-content;max-width:none';
      galeri.appendChild(galeriDalam);
      kartu.appendChild(labelGaleri); kartu.appendChild(galeri);
      function segarkanLabel() {
        labelGaleri.innerHTML = 'Pilih karakter untuk <span style="color:' + WARNA[tp.aktif] + ';text-shadow:0 0 1px #000">' + esc(namaBersih(tp.aktif)) + '</span> (' + NAMA_WARNA[tp.aktif] + ')';
      }
      function kartuPilihan(teks, pratinjau, terpilih, pemilik, klik) {
        var kd = el('div');
        kd.style.cssText = 'flex:none;width:88px;min-height:96px;box-sizing:border-box;padding:4px;border-radius:12px;background:#fff;border:4px solid ' + (terpilih ? WARNA[tp.aktif] : '#C9C9C9') + ';display:flex;flex-direction:column;align-items:center;gap:2px;cursor:' + (pemilik >= 0 ? 'not-allowed' : 'pointer') + ';opacity:' + (pemilik >= 0 ? '.45' : '1');
        if (terpilih) kd.style.boxShadow = '0 0 0 3px #111';
        kd.appendChild(pratinjau);
        var tk = el('div', null, esc(teks));
        tk.style.cssText = 'font:700 13px ' + FONT + ';line-height:1.1;overflow:hidden;max-width:100%;color:#222';
        kd.appendChild(tk);
        if (pemilik >= 0) {
          var dp = el('div', null, 'dipakai ' + (pemilik + 1));
          dp.style.cssText = 'font:700 11px sans-serif;color:' + WARNA[pemilik];
          kd.appendChild(dp);
          kd.setAttribute('aria-disabled', 'true');
        } else jadikanKlik(kd, klik);
        return kd;
      }
      function segarkanGaleri() {
        segarkanLabel();
        galeriDalam.innerHTML = '';
        tp.opsi.forEach(function (o, idx) {
          var pem = dipakai(idx, tp.aktif);
          galeriDalam.appendChild(kartuPilihan(o.nama, bulat(o.src, 52, '#BDBDBD', '<b style="font:700 22px ' + FONT + ';color:#777">' + esc(o.nama.charAt(0) || '?') + '</b>'), tp.kar[tp.aktif] === idx, pem, function () {
            tp.kar[tp.aktif] = idx; tp.manual[tp.aktif] = true; segarkanSemua();
          }));
        });
        galeriDalam.appendChild(kartuPilihan('Bentuk ' + NAMA_BENTUK[tp.aktif], bulat('', 52, WARNA[tp.aktif], svgBentuk(tp.aktif)), tp.kar[tp.aktif] === -1, -1, function () {
          tp.kar[tp.aktif] = -1; tp.manual[tp.aktif] = true; segarkanSemua();
        }));
      }
      function segarkanSemua() { if (tutup) return; segarkanPemain(); segarkanGaleri(); }

      /* tombol bawah */
      var bawah = el('div');
      bawah.style.cssText = 'display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:auto;padding-top:4px';
      var bKembali = tombol('Kembali', 'sek', function () { tutup = true; bersihWaktu(); k.keluar(); });
      var bCara = tombol('Cara main', 'sek', function () { lembarCara(w, tp.lisan); });
      var bMulai = tombol('Mulai Main', 'besar', function () {
        var pemain = [], p, o;
        tutup = true; bersihWaktu();
        for (p = 0; p < tp.jml; p++) {
          o = tp.kar[p] >= 0 ? tp.opsi[tp.kar[p]] : null;
          pemain.push({ nama: namaBersih(p), warna: WARNA[p], namaWarna: NAMA_WARNA[p], bentuk: p, src: o ? o.src : '', senang: o ? o.senang : '', berpikir: o ? o.berpikir : '' });
        }
        mainUlarTangga(pemain, panjangDipilih(), tp.lisan);
      });
      animasi(bMulai, 'kkTombol', 1.8, 0, false);
      [bKembali, bCara, gMd, bMulai].forEach(function (b) { b.style.minHeight = '56px'; bawah.appendChild(b); });
      kartu.appendChild(bawah);
      /* semua blok tetap setinggi isinya (tidak menyusut); bila layar pendek, kartu bergulir */
      Array.prototype.forEach.call(kartu.children, function (c) { c.style.flex = 'none'; });
      bawah.style.marginTop = 'auto';
      w.appendChild(kartu);

      segarkanAtur(); bangunKolom(); segarkanSemua();
      k.layar(w);

      /* katalog dibaca saat layar dibuka; gagal = tetap jalan dengan bentuk */
      ambilKatalog(function (daftar) {
        var gabung = mpi ? [mpi] : [], lihat = {};
        if (mpi) { lihat[mpi.src] = true; lihat['n:' + mpi.nama.toLowerCase()] = true; }
        daftar.forEach(function (d) {
          if (lihat[d.src] || lihat['n:' + d.nama.toLowerCase()]) return;
          lihat[d.src] = true; gabung.push(d);
        });
        tp.opsi = gabung;
        if (tutup) return;
        bereskan(); segarkanSemua();
      }, tunda);
    }

    /* lembar cara main bergambar; dipakai di layar pengaturan dan lewat tombol "?" saat bermain. Mengembalikan fungsi penutup. */
    function lembarCara(induk, lisan, saatTutup) {
      var tab = el('div'), kt = el('div', 'k-kertas k-pop'), baris = el('div'), tertutup = false, bt, i;
      var IK = {
        giliran: '<svg viewBox="-40 -40 80 80" width="100%" height="100%"><circle r="35" fill="none" stroke="#FFE27A" stroke-width="6"/><circle r="26" fill="#E5484D" stroke="#fff" stroke-width="5"/><text y="9" font-size="26" font-weight="700" fill="#fff" text-anchor="middle" font-family="' + FONT + '">1</text></svg>',
        soal: '<svg viewBox="-40 -40 80 80" width="100%" height="100%"><path d="M-30 -28 H30 Q36 -28 36 -22 V10 Q36 16 30 16 H0 L-14 30 V16 H-30 Q-36 16 -36 10 V-22 Q-36 -28 -30 -28Z" fill="#FFD54A" stroke="#C98A00" stroke-width="4" stroke-linejoin="round"/><text y="6" font-size="34" font-weight="700" fill="#5A3513" text-anchor="middle" font-family="' + FONT + '">?</text></svg>',
        dadu: wajahDadu(5),
        lompat: '<svg viewBox="-40 -40 80 80" width="100%" height="100%"><g stroke-linecap="round"><line x1="-30" y1="30" x2="-12" y2="-30" stroke="#5A3513" stroke-width="7"/><line x1="-12" y1="30" x2="6" y2="-30" stroke="#5A3513" stroke-width="7"/><line x1="-30" y1="30" x2="-12" y2="-30" stroke="#D9A05B" stroke-width="3.5"/><line x1="-12" y1="30" x2="6" y2="-30" stroke="#D9A05B" stroke-width="3.5"/><g stroke="#5A3513" stroke-width="5"><line x1="-26" y1="16" x2="-8" y2="16"/><line x1="-22" y1="0" x2="-4" y2="0"/><line x1="-18" y1="-16" x2="0" y2="-16"/></g></g><path d="M30 -28 C8 -18 40 -2 18 10 C6 18 26 28 34 30" fill="none" stroke="#1F7A44" stroke-width="11" stroke-linecap="round"/><path d="M30 -28 C8 -18 40 -2 18 10 C6 18 26 28 34 30" fill="none" stroke="#52C47E" stroke-width="7" stroke-linecap="round"/><circle cx="31" cy="-30" r="7" fill="#52C47E" stroke="#1F7A44" stroke-width="2"/><circle cx="29" cy="-32" r="2" fill="#222"/><circle cx="34" cy="-32" r="2" fill="#222"/></svg>',
        finis: '<svg viewBox="-40 -40 80 80" width="100%" height="100%"><path d="M-24 -20 Q-38 -20 -34 -6 Q-30 6 -18 4 M24 -20 Q38 -20 34 -6 Q30 6 18 4" fill="none" stroke="#C98A00" stroke-width="5" stroke-linecap="round"/><path d="M-22 -26 H22 V-6 Q22 16 0 20 Q-22 16 -22 -6 Z" fill="#FFD54A" stroke="#C98A00" stroke-width="4" stroke-linejoin="round"/><rect x="-5" y="20" width="10" height="10" fill="#E5A800"/><rect x="-16" y="30" width="32" height="8" rx="3" fill="#C98A00"/></svg>'
      };
      var LANGKAH = [
        [IK.giliran, 'Giliran', 'Pemain yang disorot menekan "Jawab soal".'],
        [IK.soal, 'Jawab soal', lisan ? 'Jawab lisan. Guru menekan Benar atau Salah.' : 'Jawab dengan benar untuk mendapat hadiah.'],
        [IK.dadu, 'Lempar dadu', 'Benar: sentil atau ketuk dadu untuk melemparnya, bidak maju. Salah: bidak diam, giliran pindah.'],
        [IK.lompat, 'Tangga dan ular', 'Tangga membawa naik. Ular membawa turun.'],
        [IK.finis, 'FINIS', 'Yang lebih dulu sampai FINIS menang. Langkah berlebih memantul mundur.']
      ];
      function tutup() {
        if (tertutup) return;
        tertutup = true;
        if (tab.parentNode) tab.parentNode.removeChild(tab);
        if (saatTutup) { try { saatTutup(); } catch (e) {} }
      }
      tab.style.cssText = 'position:absolute;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:30;padding:6px;box-sizing:border-box';
      tab.setAttribute('role', 'dialog'); tab.setAttribute('aria-label', 'Cara main Ular Tangga');
      kt.style.cssText = 'width:96%;max-width:940px;max-height:100%;overflow-y:auto;text-align:center;padding:12px 16px;box-sizing:border-box';
      kt.appendChild(el('div', null, '<b style="font:700 26px ' + FONT + '">Cara main Ular Tangga</b>'));
      baris.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:8px 0';
      for (i = 0; i < LANGKAH.length; i++) (function (l, n) {
        var c = el('div'), ik = el('div'), jd = el('div'), tk = el('div');
        c.style.cssText = 'flex:1 1 150px;max-width:176px;box-sizing:border-box;padding:8px 8px 10px;border-radius:16px;background:rgba(255,255,255,.85);border:3px solid rgba(0,0,0,.12);display:flex;flex-direction:column;align-items:center;gap:4px';
        ik.style.cssText = 'width:64px;height:64px;flex:none';
        ik.innerHTML = l[0];
        animasi(ik, 'kkMelayang', 2.2, n * 0.4, true);
        jd.style.cssText = 'font:700 18px ' + FONT + ';color:#222';
        jd.textContent = (n + 1) + '. ' + l[1];
        tk.style.cssText = 'font:700 15px ' + FONT + ';color:#555;line-height:1.25';
        tk.textContent = l[2];
        c.appendChild(ik); c.appendChild(jd); c.appendChild(tk); baris.appendChild(c);
      })(LANGKAH[i], i);
      kt.appendChild(baris);
      if (lisan) {
        var tip = el('div'); tip.style.cssText = 'font:700 15px ' + FONT + ';color:#7A4B00;margin-bottom:8px';
        tip.textContent = 'Mode lisan: guru menekan Benar, Salah, atau Lewati (papan ketik: B, S, atau L).';
        kt.appendChild(tip);
      }
      bt = tombol('Mengerti', 'besar', tutup);
      bt.style.minHeight = '56px';
      kt.appendChild(bt); tab.appendChild(kt); induk.appendChild(tab);
      tab.addEventListener('click', function (e) { if (e.target === tab) tutup(); });
      tab.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); tutup(); } });
      try { bt.focus(); } catch (e0) {}
      return tutup;
    }

    /* ----- suara sederhana (WebAudio), dibuat saat tombol ditekan agar diizinkan peramban; gagal = diam ----- */
    var ctxA = null;
    function ac() {
      try {
        if (!ctxA) { var AC = window.AudioContext || window.webkitAudioContext; if (AC) ctxA = new AC(); }
        if (ctxA && ctxA.state === 'suspended' && ctxA.resume) ctxA.resume();
      } catch (e) { ctxA = null; }
      return ctxA;
    }
    function tutupAudio() { try { if (ctxA && ctxA.close) ctxA.close(); } catch (e) {} ctxA = null; }
    function nada(f, d, tipe, v, tnd, ke) {
      var c = ac(), t, o, g;
      if (!c) return;
      try {
        t = c.currentTime + (tnd || 0); o = c.createOscillator(); g = c.createGain();
        o.type = tipe || 'sine'; o.frequency.setValueAtTime(f, t);
        if (ke) o.frequency.exponentialRampToValueAtTime(ke, t + d);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v || 0.12, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + 0.03);
      } catch (e) {}
    }
    var bunyi = {
      lempar: function () { nada(260, 0.4, 'sawtooth', 0.05, 0, 900); },
      pantul: function (v) { nada(170, 0.09, 'square', v || 0.12); nada(90, 0.12, 'triangle', (v || 0.12) * 0.8, 0.02); },
      tik: function () { nada(700 + acak01() * 500, 0.05, 'square', 0.04); },
      langkah: function (i) { nada(380 + i * 45, 0.09, 'triangle', 0.12); },
      hasil: function () { nada(523, 0.12, 'triangle', 0.14); nada(784, 0.22, 'triangle', 0.14, 0.1); },
      tangga: function () { [392, 494, 587, 784].forEach(function (f, i) { nada(f, 0.14, 'triangle', 0.13, i * 0.1); }); },
      ular: function () { nada(520, 0.7, 'sawtooth', 0.09, 0, 110); },
      menang: function () { [523, 659, 784, 1046, 784, 1046].forEach(function (f, i) { nada(f, 0.2, 'triangle', 0.14, i * 0.13); }); }
    };
    var PIP = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
    function wajahDadu(v) {
      var h = '<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true"><rect x="4" y="4" width="92" height="92" rx="20" fill="#fff" stroke="#C9C9C9" stroke-width="3"/><rect x="12" y="10" width="76" height="26" rx="13" fill="rgba(0,0,0,.04)"/>';
      PIP[v].forEach(function (c) { h += '<circle cx="' + (26 + (c % 3) * 24) + '" cy="' + (26 + Math.floor(c / 3) * 24) + '" r="8.5" fill="' + (v === 1 ? '#E5484D' : '#222') + '"/>'; });
      return h + '</svg>';
    }

    /* ----- layar juara: peringkat, konfeti, Main lagi / Ganti pemain / Kembali ----- */
    function layarJuara(pemain, panj, pos, menang, N, lisan) {
      var w = el('div'), kartu = el('div', 'k-kertas k-pop'), kiri = el('div'), kanan = el('div'), urut, rank = [], mk;
      k.latar(w, k.D && k.D.gambar && k.D.gambar.latar ? 'latar' : '');
      try { dekorLatar(w); } catch (e0) {}
      kartu.style.cssText = 'position:absolute;left:3%;right:3%;top:3%;bottom:3%;box-sizing:border-box;padding:12px 18px;display:flex;flex-direction:column;gap:8px;overflow-y:auto;overflow-x:hidden;text-align:center';
      urut = pemain.map(function (pm, i) { return { i: i, pos: pos[i] }; });
      urut.sort(function (a, b) { if (a.i === menang) return -1; if (b.i === menang) return 1; return (b.pos - a.pos) || (a.i - b.i); });
      urut.forEach(function (u, j) { rank[j] = (j > 1 && u.pos === urut[j - 1].pos) ? rank[j - 1] : j + 1; });
      var isi = el('div');
      isi.style.cssText = 'display:flex;flex-wrap:wrap;gap:12px 28px;align-items:center;justify-content:center;flex:1 1 auto;min-height:0';
      kiri.style.cssText = 'flex:0 1 300px;display:flex;flex-direction:column;align-items:center;gap:2px';
      kanan.style.cssText = 'flex:1 1 320px;max-width:460px;display:flex;flex-direction:column;gap:6px';
      var wm = pemain[menang], mahkota = el('div', null, '<svg viewBox="0 0 60 40" width="64" height="43" aria-hidden="true"><path d="M6 34 L2 8 L18 20 L30 4 L42 20 L58 8 L54 34 Z" fill="#FFD54A" stroke="#C98A00" stroke-width="3" stroke-linejoin="round"/><circle cx="2" cy="8" r="4" fill="#E5484D"/><circle cx="30" cy="4" r="4" fill="#E5484D"/><circle cx="58" cy="8" r="4" fill="#E5484D"/><rect x="8" y="30" width="44" height="6" rx="3" fill="#E5A800"/></svg>');
      mahkota.style.cssText = 'height:43px';
      var av = bulat(wm.src, 112, wm.warna, svgBentuk(menang)), gAv = el('div');
      gAv.style.cssText = 'display:flex;flex-direction:column;align-items:center;position:relative';
      var rays = '', ir, ar;
      for (ir = 0; ir < 12; ir++) {
        ar = ir * 30 * Math.PI / 180;
        rays += '<polygon points="0,0 ' + (110 * Math.cos(ar - 0.13)).toFixed(1) + ',' + (110 * Math.sin(ar - 0.13)).toFixed(1) + ' ' + (110 * Math.cos(ar + 0.13)).toFixed(1) + ',' + (110 * Math.sin(ar + 0.13)).toFixed(1) + '" fill="rgba(255,205,60,.5)"/>';
      }
      var sinarJ = el('div', null, '<svg viewBox="-110 -110 220 220" width="220" height="220" aria-hidden="true">' + rays + '</svg>');
      sinarJ.style.cssText = 'position:absolute;left:50%;top:99px;margin:-110px 0 0 -110px;pointer-events:none;z-index:0';
      animasi(sinarJ, 'kkPutar', 22, 0, false);
      gAv.appendChild(sinarJ);
      [[-78, 40, 0, 20], [74, 30, 0.7, 24], [-62, 130, 1.3, 16], [70, 120, 0.4, 18]].forEach(function (q) {
        var bt = el('div', null, '<svg viewBox="-12 -12 24 24" width="' + q[3] + '" height="' + q[3] + '" aria-hidden="true"><path d="M0 -10 Q1.5 -1.5 10 0 Q1.5 1.5 0 10 Q-1.5 1.5 -10 0 Q-1.5 -1.5 0 -10Z" fill="#FFC933"/></svg>');
        bt.style.cssText = 'position:absolute;left:50%;top:' + q[1] + 'px;margin-left:' + q[0] + 'px;pointer-events:none;z-index:1';
        animasi(bt, 'kkKedip', 1.8, q[2], false); gAv.appendChild(bt);
      });
      mahkota.style.position = 'relative'; mahkota.style.zIndex = '1'; av.style.position = 'relative'; av.style.zIndex = '1';
      gAv.appendChild(mahkota); gAv.appendChild(av);
      animasi(mahkota, 'kkLonjak', 1.4, 0, false);
      var jd = el('div', null, 'Juara!'); jd.style.cssText = 'margin-top:12px;position:relative;z-index:1;font:700 40px ' + FONT + ';color:#C98A00;text-shadow:0 2px 0 #fff;line-height:1.1';
      var nmw = el('div', null, esc(wm.nama)); nmw.style.cssText = 'font:700 30px ' + FONT + ';color:#222;max-width:100%;overflow:hidden';
      var sl = el('div', null, 'Selamat, kamu sampai FINIS!'); sl.style.cssText = 'font:700 17px ' + FONT + ';color:#555';
      kiri.appendChild(gAv); kiri.appendChild(jd); kiri.appendChild(nmw); kiri.appendChild(sl);
      var wRank = el('div', null, 'Peringkat'); wRank.style.cssText = 'font:700 20px ' + FONT + ';color:#333';
      kanan.appendChild(wRank);
      urut.forEach(function (u, j) {
        var pm = pemain[u.i], baris = el('div'), md = el('div'), nm = el('div'), ket = el('div');
        baris.style.cssText = 'display:flex;align-items:center;gap:10px;padding:4px 12px 4px 6px;border-radius:999px;box-sizing:border-box;background:' + (j === 0 ? '#FFF1B8' : 'rgba(255,255,255,.9)') + ';border:3px solid ' + pm.warna + ';min-height:56px';
        mk = rank[j] === 1 ? '#FFC933' : (rank[j] === 2 ? '#CBD3DB' : (rank[j] === 3 ? '#D9955A' : '#E6E6E6'));
        md.style.cssText = 'width:36px;height:36px;flex:none;border-radius:50%;background:' + mk + ';border:3px solid rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;font:700 19px ' + FONT + ';color:#4A2F12;box-sizing:border-box';
        md.textContent = String(rank[j]);
        nm.style.cssText = 'flex:1 1 auto;text-align:left;font:700 20px ' + FONT + ';color:#222;overflow:hidden;white-space:nowrap;text-overflow:ellipsis';
        nm.innerHTML = esc(pm.nama);
        ket.style.cssText = 'flex:none;font:700 16px ' + FONT + ';color:#555';
        ket.textContent = u.pos >= N ? 'FINIS' : (u.pos <= 0 ? 'di MULAI' : 'petak ' + u.pos);
        baris.appendChild(md); baris.appendChild(bulat(pm.src, 44, pm.warna, svgBentuk(u.i))); baris.appendChild(nm); baris.appendChild(ket);
        kanan.appendChild(baris);
      });
      isi.appendChild(kiri); isi.appendChild(kanan); kartu.appendChild(isi);
      var bawah = el('div');
      bawah.style.cssText = 'display:flex;gap:12px;justify-content:center;flex-wrap:wrap;flex:none';
      var bLagi = tombol('Main lagi', 'besar', function () { bersihWaktu(); mainUlarTangga(pemain, panj, lisan); });
      var bGanti = tombol('Ganti pemain', 'sek', function () { bersihWaktu(); tutupAudio(); bukaPengaturan(); });
      var bKem = tombol('Kembali', 'sek', function () { bersihWaktu(); tutupAudio(); k.keluar(); });
      animasi(bLagi, 'kkTombol', 1.8, 0, false);
      [bLagi, bGanti, bKem].forEach(function (b) { b.style.minHeight = '56px'; bawah.appendChild(b); });
      kartu.appendChild(bawah);
      Array.prototype.forEach.call(kartu.children, function (c) { c.style.flex = c === isi ? '1 1 auto' : 'none'; });
      w.appendChild(kartu);
      k.layar(w);
      try { k.alat.konfeti(150); } catch (e1) {}
      tunda(function () { try { k.alat.konfeti(90); } catch (e2) {} }, 1500);
      tunda(function () { try { k.alat.konfeti(90); } catch (e3) {} }, 3000);
    }

    /* ----- permainan: ular tangga (Tahap 2: giliran, soal, dadu, gerak, juara) ----- */
    function mainUlarTangga(pemain, panj, lisan) {
      var HUD = !!k.hud, api = k.bingkai('Ular Tangga', HUD ? { gaya: 'hud' } : undefined), zn = null, sisiHud = 0, bawahHud = 0, tapPx = 56, badan = null, kotakAksi = null, letak = '';
      var usai = false, papan = null, chips = [], giliran = 0, tantang = null, tok = 0, tutupBantuan = null, kunciAktif = null;
      lisan = !!lisan;
      pasangCss();
      var wad = el('div');
      /* bingkai HUD: tombol menu dan "?" melayang di pojok atas, tombol aksi melayang di bawah tengah. Sisakan ruangnya. */
      if (HUD) {
        try { zn = api.zonaAman(); } catch (eZ) { zn = null; }
        sisiHud = zn && zn.kiriAtas && zn.kiriAtas.w ? zn.kiriAtas.w : 80;
        tapPx = Math.max(56, sisiHud - 24);
        bawahHud = 4;   /* tombol aksi melayang di atas papan (tidak menyisakan bilah bawah); papan memakai tinggi penuh */
      }
      wad.style.cssText = 'position:absolute;left:0;top:0;right:0;bottom:0;display:flex;flex-direction:column;gap:4px;padding:' + (HUD ? '4px 8px ' + bawahHud + 'px' : '4px 8px') + ';box-sizing:border-box';
      var strip = el('div');
      strip.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;justify-content:center;align-items:center;min-height:' + (HUD ? Math.max(40, sisiHud - 20) : 40) + 'px;padding:0 ' + (HUD ? sisiHud + 4 : 64) + 'px';
      pemain.forEach(function (pm, p) {
        var cip = el('div');
        cip.style.cssText = 'display:flex;align-items:center;gap:6px;padding:2px 12px 2px 2px;border-radius:999px;background:rgba(255,255,255,.92);border:3px solid ' + pm.warna + ';box-sizing:border-box';
        var av = el('div');
        av.style.cssText = 'width:32px;height:32px;flex:none;border-radius:50%;box-sizing:border-box;border:3px solid ' + pm.warna + ';background:#fff;overflow:hidden;display:flex;align-items:center;justify-content:center';
        av.innerHTML = '<svg viewBox="-50 -50 100 100" style="width:78%;height:78%" aria-hidden="true">' + bentukSvg(p, pm.warna) + '</svg>';
        if (pm.src) muat(pm.src, function (ok) {
          var im;
          if (!ok) return;
          im = el('img'); im.alt = ''; im.src = pm.src;
          im.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block';
          av.innerHTML = ''; av.appendChild(im);
        });
        var nm = el('span', null, esc(pm.nama));
        nm.style.cssText = 'font:700 17px ' + FONT + ';color:#222';
        cip.style.transition = 'transform .25s ease, box-shadow .25s ease, opacity .25s ease';
        cip.appendChild(av); cip.appendChild(nm); strip.appendChild(cip); chips.push(cip);
      });
      var tempat = el('div');
      tempat.style.cssText = 'flex:1 1 auto;min-height:0;position:relative';
      if (HUD) {
        /* papan memakai tinggi penuh; tombol "Jawab soal" ditaruh di kolom samping bila papan menyisakan ruang di samping, bila tidak di jalur tipis di bawah */
        badan = el('div');
        badan.style.cssText = 'flex:1 1 auto;min-height:0;display:flex;gap:6px;align-items:stretch';
        tempat.style.minWidth = '0';
        try { dekorLatar(wad); } catch (eD) {}
        badan.appendChild(tempat); wad.appendChild(strip); wad.appendChild(badan);
      } else { wad.appendChild(strip); wad.appendChild(tempat); }
      /* tombol "?" (cara main) */
      var bTanya = el('button', null, '?');
      bTanya.type = 'button'; bTanya.setAttribute('aria-label', 'Cara main');
      bTanya.style.cssText = 'position:absolute;right:6px;top:0;width:56px;height:56px;padding:0;border-radius:50%;border:4px solid #fff;background:#FFD54A;color:#5A3513;font:700 32px/1 ' + FONT + ';box-shadow:0 4px 0 rgba(0,0,0,.3);cursor:pointer;z-index:9';
      bTanya.addEventListener('click', function () {
        if (tutupBantuan) { tutupBantuan(); return; }
        tutupBantuan = lembarCara(wad, lisan, function () { tutupBantuan = null; });
      });
      if (!HUD) wad.appendChild(bTanya);
      api.area.appendChild(wad);
      if (HUD) {
        /* "?" dan "Ubah pengaturan" dipegang kit (tombol "?" dan menu jeda); kit menjeda game selama lembar terbuka */
        api.petunjuk = function (tutup) {
          if (tutupBantuan) { tutupBantuan(); try { tutup(); } catch (eT0) {} return; }   /* "?" lagi = tutup */
          tutupBantuan = lembarCara(wad, lisan, function () { tutupBantuan = null; try { tutup(); } catch (eT) {} });
        };
        api.pengaturan = function () { api.berhenti(); bukaPengaturan(); };
        api.saatJeda = function (j) {
          if (usai) return;
          jedaWaktu(!!j);
          try { if (ctxA) { if (j && ctxA.suspend) ctxA.suspend(); else if (!j && ctxA.resume) ctxA.resume(); } } catch (eA) {}
        };
      }
      function pasangKunci(peta) {
        lepasKunci();
        kunciAktif = function (ev) {
          var t = ev.target;
          if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
          if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
          var f = peta[String(ev.key).toLowerCase()];
          if (f) { ev.preventDefault(); f(); }
        };
        document.addEventListener('keydown', kunciAktif);
      }
      function lepasKunci() { if (kunciAktif) { document.removeEventListener('keydown', kunciAktif); kunciAktif = null; } }
      /* setelah tantangan dibatalkan dari sisi kita (mode lisan): pastikan papan tampil lagi dan tidak ada lapisan sisa */
      function pulihkanArea() {
        var c, i, sisa = [];
        try {
          c = api.area.children;
          for (i = 0; i < c.length; i++) if (c[i] !== wad) sisa.push(c[i]);
          if (wad.parentNode !== api.area) api.area.appendChild(wad);
          sisa.forEach(function (e) { if (e.parentNode) e.parentNode.removeChild(e); });
          wad.style.display = 'flex'; wad.style.visibility = 'visible';
        } catch (e) {}
      }
      /* letak tombol "Jawab soal" (HUD): samping bila ada ruang, jalur bawah bila tidak */
      function aturLetak() {
        var vb, ar, tw, th, KOL = 148;
        try {
          vb = String(papan.svg.getAttribute('viewBox') || '').split(' ').map(Number);
          ar = vb[2] / vb[3]; tw = tempat.clientWidth; th = tempat.clientHeight;
        } catch (eL) { ar = 0; }
        kotakAksi = el('div');
        kotakAksi.style.cssText = 'display:flex;gap:10px;align-items:center;justify-content:center;z-index:45;position:relative';
        if (ar && tw > 0 && th > 0 && th * ar <= tw - KOL - 6) {
          letak = 'samping';
          kotakAksi.style.flex = '0 0 ' + KOL + 'px'; kotakAksi.style.flexDirection = 'column';
          badan.appendChild(kotakAksi);
        } else {
          letak = 'bawah';
          wad.style.paddingBottom = (tapPx + 14) + 'px';
          kotakAksi.style.position = 'absolute'; kotakAksi.style.left = '50%'; kotakAksi.style.bottom = '6px'; kotakAksi.style.transform = 'translateX(-50%)';
          wad.appendChild(kotakAksi);
        }
      }
      /* tombol giliran ("Jawab soal"): milik game (HUD) supaya tidak menimpa papan; tombol penilaian lisan tetap lewat api.aksi */
      function aksiGiliran(teks, fn) {
        var b;
        if (!kotakAksi) return api.aksi(teks, fn);
        b = tombol(teks, '', fn);
        b.style.minHeight = tapPx + 'px'; b.style.fontSize = (letak === 'samping' ? 22 : 24) + 'px'; b.style.padding = '6px 10px'; b.style.lineHeight = '1.1'; b.style.whiteSpace = 'normal';
        if (letak === 'samping') b.style.width = '100%';
        kotakAksi.appendChild(b);
        return b;
      }
      function bersih() { if (kotakAksi) kotakAksi.innerHTML = ''; api.bersihAksi(); }
      function segarkanChip() {
        chips.forEach(function (c, i) {
          var aktif = i === giliran;
          c.style.transform = aktif ? 'scale(1.12)' : 'scale(1)';
          c.style.boxShadow = aktif ? '0 0 0 4px #FFE27A, 0 4px 14px rgba(0,0,0,.45)' : 'none';
          c.style.opacity = aktif ? '1' : '.75';
        });
        if (papan) papan.sorot(giliran);
      }
      if (!HUD) { try { dekorLatar(tempat); } catch (e0) {} }
      try {
        papan = bangunPapan(k, panj, pemain);
        tempat.appendChild(papan.svg);
        if (HUD) aturLetak();
      } catch (e) {
        papan = null;
        tempat.innerHTML = '<div style="color:#fff;font:700 22px sans-serif;text-align:center;padding:30px">Papan gagal dibuat. Tekan Ubah pengaturan.</div>';
      }
      api.berhenti = function () {
        usai = true; tok++; bersihWaktu(); terjeda = false; lepasKunci();
        if (tantang) { try { if (tantang.batal) tantang.batal(); } catch (e1) {} tantang = null; }
        tutupAudio();
      };
      if (!papan) {
        api.bicara('Papan gagal dibuat.', 'no');
        api.aksi('Ubah pengaturan', function () { api.berhenti(); bersih(); bukaPengaturan(); });
        return;
      }

      function gantiGiliran() {
        if (usai) return;
        giliran = (giliran + 1) % pemain.length;
        tunggu();
      }
      function tunggu() {
        if (usai) return;
        segarkanChip();
        papan.depan(giliran);
        bersih();
        if (!HUD) api.bicara(aman(pemain[giliran].nama) + ', giliran kamu! Tekan Jawab soal' + (lisan ? ', lalu guru menilai.' : '.'));   /* HUD: giliran ditandai chip dan tombol; balon akan menutup petak awal */
        aksiGiliran('Jawab soal', jawab);
      }
      function jawab() {
        var sudah = false, minta, h = null;
        if (usai || tantang) return;
        if (tutupBantuan) tutupBantuan();
        bersih(); ac();
        minta = ++tok;
        function selesai(benar) {
          if (sudah || usai || minta !== tok) return;
          sudah = true; tantang = null;
          hasil(benar);
        }
        /* mode lisan: guru menilai (Benar, Salah, Lewati). Soal tetap ditampilkan oleh k.tantang; tantangan dihentikan saat guru menilai. */
        function nilai(v) {
          var t;
          if (sudah || usai || minta !== tok) return;
          sudah = true; t = tantang; tantang = null;
          if (t) { try { if (t.batal) t.batal(); } catch (e) {} }
          pulihkanArea();
          hasil(v, true);
        }
        try { h = k.tantang(selesai); } catch (e) { h = null; selesai(null); }
        if (!sudah) tantang = h;
        if (lisan && !sudah) {
          tunda(function () {
            if (sudah || usai || minta !== tok) return;
            bersih();
            api.aksi('Benar', function () { nilai(true); });
            api.aksi('Salah', function () { nilai(false); });
            api.aksi('Lewati', function () { nilai(null); });
            if (!HUD) api.bicara(aman(pemain[giliran].nama) + ' menjawab lisan. Guru, tekan Benar atau Salah.');
          }, 80);
          pasangKunci({ b: function () { nilai(true); }, s: function () { nilai(false); }, l: function () { nilai(null); } });
        }
      }
      function hasil(benar, guru) {
        var nm = aman(pemain[giliran].nama);
        lepasKunci(); bersih();
        if (benar === true) {
          api.bicara('Benar! ' + nm + ' melempar dadu.', 'ok');
          tunda(lempar, 600);
        } else if (benar === false) {
          api.bicara('Belum tepat. ' + nm + ' tidak maju, giliran pindah.', 'no');
          tunda(gantiGiliran, 2000);
        } else {
          api.bicara(guru ? 'Giliran ' + nm + ' dilewati.' : 'Soal tidak bisa dibuka. Giliran dilewati.', 'no');
          tunda(gantiGiliran, 2000);
        }
      }
      /* ----- dadu: dilempar siswa (sentil atau ketuk), angka ditentukan saat dilempar ----- */
      function lempar() {
        if (usai) return;
        var pm = pemain[giliran], fase = 'tunggu', nilai = 0, cepat = kurangGerak(), idAuto = null, drag = null, UKURAN = 104, DETIK_AUTO = 12;
        var ov = el('div'), kt = el('div'), meja = el('div'), bawah = el('div'), jw = el('div'), cincin = el('div'), bay = el('div'), jd = el('div'), wajah = el('div');
        var tk = el('div'), tk2 = el('div'), trek = el('div'), bar = el('div'), lbl = el('div'), bL;
        ov.style.cssText = 'position:absolute;left:0;top:0;right:0;bottom:0;z-index:6;display:flex;flex-direction:column;align-items:center;background:rgba(10,30,20,.5);border-radius:14px;overflow:hidden';
        kt.style.cssText = 'margin-top:6px;padding:4px 20px;border-radius:18px;background:rgba(255,255,255,.96);border:5px solid ' + pm.warna + ';box-shadow:0 6px 18px rgba(0,0,0,.4);text-align:center;flex:none;max-width:94%;box-sizing:border-box';
        tk.style.cssText = 'font:700 26px ' + FONT + ';color:#222;line-height:1.15;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
        tk.textContent = pm.nama + ', lempar dadunya!';
        tk2.style.cssText = 'font:700 16px ' + FONT + ';color:#666;min-height:20px';
        tk2.textContent = 'Sentil dadu ke arah mana saja, atau ketuk dadunya.';
        kt.appendChild(tk); kt.appendChild(tk2);
        meja.style.cssText = 'position:relative;flex:1 1 auto;min-height:0;width:100%';
        jw.style.cssText = 'position:absolute;left:50%;top:50%;width:' + UKURAN + 'px;height:' + UKURAN + 'px;margin:' + (-UKURAN / 2) + 'px 0 0 ' + (-UKURAN / 2) + 'px';
        cincin.style.cssText = 'position:absolute;left:-14px;top:-14px;right:-14px;bottom:-14px;border-radius:30px;border:5px solid ' + pm.warna + ';pointer-events:none';
        bay.style.cssText = 'position:absolute;left:50%;top:50%;width:76px;height:18px;margin:-9px 0 0 -38px;border-radius:50%;background:rgba(0,0,0,.35);pointer-events:none;transform:translate(var(--x0,0px),calc(var(--y0,0px) + 56px))';
        jd.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;cursor:grab;touch-action:none;filter:drop-shadow(0 6px 4px rgba(0,0,0,.3));transform:translate(var(--x0,0px),var(--y0,0px)) rotate(var(--g,0deg))';
        jd.setAttribute('role', 'button'); jd.setAttribute('aria-label', 'Dadu: ketuk atau sentil untuk melempar'); jd.tabIndex = 0;
        wajah.style.cssText = 'width:100%;height:100%';
        wajah.innerHTML = wajahDadu(acakDadu());
        jd.appendChild(wajah); jw.appendChild(cincin); jw.appendChild(jd); meja.appendChild(bay); meja.appendChild(jw);
        bawah.style.cssText = 'flex:none;display:flex;align-items:center;justify-content:center;gap:14px;margin:0 0 8px;flex-wrap:wrap';
        bL = tombol('Lempar!', 'besar', function () { tap(); });
        bL.style.minHeight = '56px';
        trek.style.cssText = 'width:150px;height:8px;border-radius:4px;background:rgba(255,255,255,.35);overflow:hidden';
        bar.style.cssText = 'width:100%;height:100%;background:#FFD54A;border-radius:4px';
        trek.appendChild(bar);
        lbl.style.cssText = 'font:700 13px ' + FONT + ';color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.6)';
        lbl.textContent = 'dilempar otomatis bila didiamkan';
        bawah.appendChild(bL); bawah.appendChild(trek); bawah.appendChild(lbl);
        ov.appendChild(kt); ov.appendChild(meja); ov.appendChild(bawah); tempat.appendChild(ov);
        if (!cepat) {
          animasi(jw, 'kkMelayang', 1.6, 0, true);
          animasi(cincin, 'kkDenyut', 1.3, 0, false);
          animasi(bL, 'kkTombol', 1.6, 0, false);
          animasi(bar, 'kkHabis', DETIK_AUTO, 0, false);
          bar.style.animationIterationCount = '1'; bar.style.animationFillMode = 'forwards'; bar.style.animationTimingFunction = 'linear'; bar.style.transformOrigin = 'left center';
        }

        function setVar(n, v) { jd.style.setProperty(n, v); bay.style.setProperty(n, v); }
        function percik(x, y, jml, warna, bintang) {
          var i, e, a, r;
          for (i = 0; i < jml; i++) {
            a = (i / jml) * Math.PI * 2 + acak01() * 0.5; r = 34 + acak01() * 40;
            e = el('div');
            e.style.cssText = 'position:absolute;left:calc(50% + ' + x.toFixed(1) + 'px);top:calc(50% + ' + (y + 40).toFixed(1) + 'px);width:' + (bintang ? 12 : 9) + 'px;height:' + (bintang ? 12 : 9) + 'px;margin:-5px 0 0 -5px;border-radius:' + (bintang ? '2px' : '50%') + ';background:' + warna + ';pointer-events:none;' + (bintang ? 'transform:rotate(45deg);' : '');
            e.style.setProperty('--px', (Math.cos(a) * r).toFixed(1) + 'px');
            e.style.setProperty('--py', (Math.sin(a) * r * 0.55 - (bintang ? 24 : 6)).toFixed(1) + 'px');
            animasi(e, 'kkPercik', 0.65, 0, false);
            e.style.animationIterationCount = '1'; e.style.animationFillMode = 'both'; e.style.animationTimingFunction = 'ease-out';
            e.addEventListener('animationend', function (ev) { if (ev.target.parentNode) ev.target.parentNode.removeChild(ev.target); });
            meja.appendChild(e);
          }
        }
        function selesai() {
          if (usai) return;
          if (ov.parentNode) ov.parentNode.removeChild(ov);
          gerak(nilai);
        }
        function lemparkan(vx, vy, x0, y0, kuat) {
          var dx, dy, rot, arah, tt = 0, wk;
          if (usai || fase !== 'tunggu') return;
          fase = 'terbang'; lepasKunci();
          if (idAuto) { batalTunda(idAuto); idAuto = null; }
          nilai = acakDadu();
          bL.style.display = 'none'; trek.style.display = 'none'; lbl.style.display = 'none'; cincin.style.display = 'none';
          jw.style.animationName = 'none';
          tk.textContent = pm.nama + ' melempar dadu...'; tk2.textContent = '';
          if (cepat) {
            jd.style.setProperty('--g', '0deg');
            wajah.innerHTML = wajahDadu(nilai);
            tk.textContent = pm.nama + ' dapat ' + nilai + '!';
            bunyi.hasil();
            tunda(selesai, 900);
            return;
          }
          dx = Math.max(-170, Math.min(170, vx * 1.3)); dy = Math.max(-50, Math.min(70, vy * 0.5 + 20));
          arah = vx < 0 ? -1 : (vx > 0 ? 1 : (acak01() < 0.5 ? -1 : 1));
          rot = arah * (kuat > 0.7 ? 1080 : 720);
          setVar('--x0', x0.toFixed(1) + 'px'); setVar('--y0', y0.toFixed(1) + 'px');
          setVar('--dx', dx.toFixed(1) + 'px'); setVar('--dy', dy.toFixed(1) + 'px'); setVar('--rot', rot + 'deg');
          jd.style.setProperty('--g', '0deg'); jd.style.cursor = 'default';
          animasi(jd, 'kkLempar', 1.5, 0, false);
          jd.style.animationIterationCount = '1'; jd.style.animationFillMode = 'both';
          animasi(bay, 'kkBayangLempar', 1.5, 0, false);
          bay.style.animationIterationCount = '1'; bay.style.animationFillMode = 'both';
          bunyi.lempar();
          (function balik() {
            var lama, f;
            if (usai || tt >= 1100) return;
            do { f = acakDadu(); } while (wajah.getAttribute('data-f') === String(f));
            wajah.setAttribute('data-f', String(f)); wajah.innerHTML = wajahDadu(f); bunyi.tik();
            lama = 70 + tt * 0.08; tt += lama;
            tunda(balik, lama);
          })();
          tunda(function () { bunyi.pantul(0.16); percik(dx * 0.9, dy, 7, '#E8E0C8', false); }, 780);
          tunda(function () { bunyi.pantul(0.1); percik(dx * 1.06, dy, 5, '#E8E0C8', false); }, 990);
          tunda(function () {
            wajah.innerHTML = wajahDadu(nilai);
            animasi(wajah, 'kkMuncul', 0.4, 0, false);
            wajah.style.animationIterationCount = '1'; wajah.style.animationFillMode = 'both';
            bunyi.pantul(0.12); bunyi.hasil();
            percik(dx * 1.12, dy, 10, pm.warna, true);
            animasi(meja, 'kkGetar', 0.3, 0, false);
            meja.style.animationIterationCount = '1';
            tk.textContent = pm.nama + ' dapat ' + nilai + '!';
          }, 1170);
          tunda(selesai, 1170 + 1300);
        }
        /* ketuk (tanpa sentilan) atau tombol "Lempar!" / Spasi / Enter: arah acak */
        function tap() { lemparkan((acak01() - 0.5) * 170, (acak01() - 0.5) * 70, 0, 0, 0.3); }
        jd.addEventListener('pointerdown', function (e) {
          if (usai || fase !== 'tunggu') return;
          try { jd.setPointerCapture(e.pointerId); } catch (x) {}
          drag = { x: e.clientX, y: e.clientY, ox: 0, oy: 0, pts: [{ x: e.clientX, y: e.clientY, t: e.timeStamp }] };
          jd.style.cursor = 'grabbing';
        });
        jd.addEventListener('pointermove', function (e) {
          if (!drag || usai || fase !== 'tunggu') return;
          drag.ox = Math.max(-150, Math.min(150, e.clientX - drag.x)); drag.oy = Math.max(-80, Math.min(80, e.clientY - drag.y));
          drag.pts.push({ x: e.clientX, y: e.clientY, t: e.timeStamp });
          if (drag.pts.length > 12) drag.pts.shift();
          jd.style.setProperty('--x0', drag.ox + 'px'); jd.style.setProperty('--y0', drag.oy + 'px');
          jd.style.setProperty('--g', (drag.ox * 0.15).toFixed(1) + 'deg');
          bay.style.setProperty('--x0', drag.ox + 'px'); bay.style.setProperty('--y0', drag.oy + 'px');
        });
        function lepasDrag(e) {
          var d = drag, p0, i, vx, vy, mag, total, tdx, tdy;
          if (!d) return;
          drag = null; jd.style.cursor = 'grab';
          if (usai || fase !== 'tunggu') return;
          p0 = d.pts[0];
          for (i = 0; i < d.pts.length; i++) if (e.timeStamp - d.pts[i].t <= 140) { p0 = d.pts[i]; break; }
          vx = e.clientX - p0.x; vy = e.clientY - p0.y; mag = Math.sqrt(vx * vx + vy * vy);
          tdx = e.clientX - d.x; tdy = e.clientY - d.y; total = Math.sqrt(tdx * tdx + tdy * tdy);
          if (total < 12 && mag < 14) { jd.style.setProperty('--x0', '0px'); jd.style.setProperty('--y0', '0px'); jd.style.setProperty('--g', '0deg'); tap(); return; }
          if (mag < 24) { vx = tdx * 0.7; vy = tdy * 0.7; mag = Math.sqrt(vx * vx + vy * vy); }
          lemparkan(vx, vy, d.ox, d.oy, Math.min(1, mag / 120));
        }
        jd.addEventListener('pointerup', lepasDrag);
        jd.addEventListener('pointercancel', function () {
          drag = null;
          if (fase === 'tunggu') { jd.style.setProperty('--x0', '0px'); jd.style.setProperty('--y0', '0px'); jd.style.setProperty('--g', '0deg'); bay.style.setProperty('--x0', '0px'); bay.style.setProperty('--y0', '0px'); }
        });
        pasangKunci({ ' ': tap, 'enter': tap });
        idAuto = tunda(tap, DETIK_AUTO * 1000);
        try { bL.focus(); } catch (e0) {}
      }
      function gerak(lang) {
        if (usai) return;
        var q = giliran, N = papan.N, m = papan.pos[q], jalur = [], arah = 1, i, langkah = 0, cepat = kurangGerak();
        for (i = 0; i < lang; i++) { if (m === N) arah = -1; m += arah; jalur.push(m); }
        papan.durasi(300);
        api.bicara(aman(pemain[q].nama) + ' maju ' + lang + ' petak.');
        function maju() {
          if (usai) return;
          if (langkah < jalur.length) {
            papan.pindah(q, jalur[langkah]); bunyi.langkah(langkah); langkah++;
            tunda(maju, cepat ? 140 : 340);
            return;
          }
          tiba(q);
        }
        maju();
      }
      function tiba(q) {
        if (usai) return;
        var m = papan.pos[q], ke = papan.lompat[m], naik, cepat = kurangGerak();
        if (m === papan.N) { menang(q); return; }
        if (ke) {
          naik = ke > m;
          api.bicara(naik ? 'Hore! Ada tangga, naik ke petak ' + ke + '!' : 'Aduh! Ada ular, turun ke petak ' + ke + '.', naik ? 'ok' : 'no');
          tunda(function () {
            if (usai) return;
            papan.durasi(1000); papan.pindah(q, ke);
            if (naik) bunyi.tangga(); else bunyi.ular();
            tunda(function () { papan.durasi(300); gantiGiliran(); }, cepat ? 500 : 1500);
          }, cepat ? 500 : 900);
          return;
        }
        tunda(gantiGiliran, 700);
      }
      function menang(q) {
        api.bicara(aman(pemain[q].nama) + ' sampai FINIS dan menang!', 'ok');
        bersih();
        bunyi.menang();
        try { k.alat.konfeti(120); } catch (e) {}
        tunda(function () {
          if (usai) return;
          usai = true;
          layarJuara(pemain, panj, papan.pos.slice(), q, papan.N, lisan);
        }, 2200);
      }
      tunggu();
    }

    bukaPengaturan();
  };
})();
