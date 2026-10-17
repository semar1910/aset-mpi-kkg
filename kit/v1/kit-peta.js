/* kit-peta.js
 * Peta tambahan untuk KIT MPI v1.23.0 (hookPeta 1).
 * Versi berkas: 1.6.0 (gabungan)
 * Gaya terdaftar:
 *   "pulau"      (DATA: peta:'pulau')      - pulau kecil di laut, jembatan, peti di pulau besar.
 *   "konstelasi" (DATA: peta:'konstelasi') - langit malam, planet, garis bercahaya, bintang besar.
 *   "sulur"      (DATA: peta:'sulur')      - batang sulur tegak, daun kiri-kanan, kuncup jadi bunga.
 *   "pusaran"    (DATA: peta:'pusaran')    - laut dalam, spiral cangkang, kerang berisi mutiara.
 *   "dahan"      (DATA: peta:'dahan')      - pohon dengan ranting kiri-kanan, sarang telur emas.
 *   "menara"     (DATA: peta:'menara')     - lantai bertumpuk, tangga papan, mahkota di puncak.
 *   "pohon"      (DATA: peta:'pohon')      - batang tumbuh dari tanah, daun besar, buah emas.
 *   "cakrawala"  (DATA: peta:'cakrawala')  - jalan berkelok ke cakrawala senja, rambu makin jauh makin kecil, gerbang dan matahari.
 *   "berliku"    (DATA: peta:'berliku')    - jalan serpentin dua baris di sawah berundak, ubin batu bernomor, gerbang lengkung yang pintunya membuka.
 *   "otomatis"   (DATA: peta:'otomatis')   - memilih salah satu gaya di atas per MPI, tetap dari hashTeks(judul|tema).
 *     Pemetaan tema -> gaya (angka = bobot; yang paling cocok lebih sering terpilih):
 *       emas      : menara 2, cakrawala 1, berliku 1
 *       hutan     : pohon 2, sulur 2, dahan 1, berliku 1
 *       samudra   : pusaran 2, pulau 2, cakrawala 1
 *       antariksa : konstelasi 3, menara 1, cakrawala 1
 *       jingga    : cakrawala 2, berliku 2, dahan 1, pulau 1
 *     Gagal/tak terdaftar -> gaya berikutnya di daftar tema itu; semua gagal -> galat (kit pakai jalur lama).
 * Tanpa import, library luar, jaringan, localStorage, emoji. Semua SVG/CSS.
 */
(function () {
  'use strict';

  var CSS = [
    '.k-pl{position:absolute;left:0;right:0;top:58px}',
    '.k-pl>svg{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible}',
    '.k-pl-titik{cursor:pointer;outline:none}',
    '.k-pl-titik.kunci{cursor:not-allowed}',
    '.k-pl-titik:not(.kunci):hover .k-pl-bulat{filter:brightness(1.08)}',
    '.k-pl-titik:focus-visible .k-pl-bulat{filter:drop-shadow(0 0 6px #fff)}',
    '.k-pl-bulat,.k-pl-cincin,.k-pl-peti,.k-pl-gel,.k-pl-ikan,.k-pl-bob,.k-pl-sinar{transform-box:fill-box;transform-origin:center}',
    '.k-pl-aktif{animation:kPlDenyut 1.6s ease-in-out infinite}',
    '@keyframes kPlDenyut{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}',
    '.k-pl-cincin{animation:kPlCincin 1.8s ease-out infinite}',
    '@keyframes kPlCincin{0%{transform:scale(1);opacity:.9}100%{transform:scale(1.7);opacity:0}}',
    '.k-pl-peti{cursor:pointer;outline:none}',
    '.k-pl-peti.buka{animation:kPlDenyut 1.6s ease-in-out infinite}',
    '.k-pl-sinar,.k-jl-sinar{transform-box:fill-box;transform-origin:center;animation:kPlPutar 9s linear infinite}',
    '@keyframes kPlPutar{to{transform:rotate(360deg)}}',
    '.k-pl-gel{animation:kPlNaik 4s ease-in-out infinite}',
    '@keyframes kPlNaik{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}',
    '.k-pl-ikan{animation:kPlRenang 5s ease-in-out infinite}',
    '@keyframes kPlRenang{0%,100%{transform:translateX(0)}50%{transform:translateX(9px)}}',
    '.k-pl-bob{animation:kPlBob 3.4s ease-in-out infinite}',
    '@keyframes kPlBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}',
    '.k-pl-label{position:absolute;text-align:center;color:#fff;pointer-events:none;',
    'text-shadow:0 2px 0 rgba(var(--gelap),.95),0 0 10px rgba(var(--gelap),.85)}',
    '.k-pl-label .jd{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;',
    'font-family:Fredoka,sans-serif;font-weight:600;font-size:18px;line-height:1.12;word-break:break-word}',
    '.k-pl-label small{display:block;font-weight:800;font-size:14px;opacity:.88;margin-top:3px;letter-spacing:.3px;',
    'white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.k-pl-label.kunci{opacity:.72}',
    '.k-pl-label svg{vertical-align:-3px;margin-right:4px}',
    '@media (prefers-reduced-motion:reduce){.k-pl *{animation:none!important}}'
  ].join('');

  function r1(v) { return Math.round(v * 10) / 10; }

  function gambarPulau(k) {
    var A = k.alat, D = k.D || {};
    var W = k.W || 960, HT = k.tinggi || 482;
    var n = Math.max(1, Math.min(5, k.n || (k.level && k.level.length) || 1));
    var rnd = A.acakBenih(A.hashTeks(D.judul || 'pulau'));
    var bintang = k.bintang || [];
    var i, j;

    function bt(idx) { return bintang[idx] > 0 ? Math.min(3, bintang[idx]) : 0; }
    function buka(idx) {
      if (k.modeGuru) return true;
      if (typeof k.terbuka === 'number') return idx < k.terbuka;
      return idx === 0 || bt(idx - 1) > 0;
    }
    var aktif = typeof k.aktif === 'number' ? k.aktif : -1;
    var semua = !!k.semua;
    var tot = 0;
    for (i = 0; i < n; i++) tot += bt(i);
    if (typeof k.total === 'number') tot = k.total;
    var maks = typeof k.maks === 'number' ? k.maks : n * 3;

    if (k.css) k.css('kit-peta-pulau', CSS);

    /* ── tata letak ── */
    var xf = W - 135, yc = Math.round(HT * 0.49), yf = yc;
    var x0 = 100, xl = xf - 200, avail = xl - x0;
    var sp = n > 1 ? Math.min(200, avail / (n - 1)) : 0;
    var start = x0 + (avail - sp * (n - 1)) / 2;
    var lw = n > 1 ? Math.max(116, Math.min(160, sp - 12)) : 160;
    var arah = rnd() < 0.5 ? 1 : -1;
    var pts = [];
    for (i = 0; i < n; i++) {
      var yy = yc;
      var jit = rnd();
      if (n > 1) yy = yc + arah * (i % 2 ? 1 : -1) * (34 + (jit - 0.5) * 16);
      pts.push({ x: start + sp * i, y: Math.max(185, Math.min(285, yy)) });
    }
    var fin = { x: xf, y: yf };
    var simpul = pts.concat([fin]);

    /* jembatan: kurva ringan antar pusat pulau (digambar di bawah pulau) */
    var jemb = [];
    for (i = 0; i < n; i++) {
      var a = simpul[i], b = simpul[i + 1];
      var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 + (i % 2 ? 10 : -10);
      jemb.push({
        d: 'M' + r1(a.x) + ' ' + r1(a.y) + 'Q' + r1(mx) + ' ' + r1(my) + ' ' + r1(b.x) + ' ' + r1(b.y),
        buka: i === n - 1 ? semua : buka(i + 1),
        lewat: bt(i) > 0,
        a: a, b: b, mx: mx, my: my
      });
    }

    /* ── area terlarang untuk hiasan ── */
    var rects = [];
    for (i = 0; i < n; i++) {
      var half = Math.max(lw / 2 + 6, 66);
      rects.push({ x0: pts[i].x - half, x1: pts[i].x + half, y0: pts[i].y - 104, y1: pts[i].y + 142 });
    }
    rects.push({ x0: xf - 128, x1: xf + 128, y0: yf - 112, y1: yf + 155 });
    var contoh = [];
    jemb.forEach(function (s) {
      for (var t = 0; t <= 12; t++) {
        var u = t / 12, v = 1 - u;
        contoh.push({
          x: v * v * s.a.x + 2 * v * u * s.mx + u * u * s.b.x,
          y: v * v * s.a.y + 2 * v * u * s.my + u * u * s.b.y
        });
      }
    });

    /* ── hiasan laut ── */
    var warnaIkan = ['--aksen', '--c1', '--c2'];
    var JENIS = {
      gel: { b: [-24, 24, -30, 12], kelas: 'k-pl-gel' },
      ikan: { b: [-38, 38, -16, 16], kelas: 'k-pl-ikan' },
      karang: { b: [-26, 26, -44, 12], kelas: '' },
      perahu: { b: [-46, 46, -48, 28], kelas: 'k-pl-bob' }
    };
    function isiHias(jenis, v) {
      var lip = 'style="stroke:var(--lip)"';
      if (jenis === 'gel') {
        return '<circle cx="0" cy="0" r="9" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.75)" stroke-width="2"/>' +
          '<circle cx="16" cy="-14" r="6" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.75)" stroke-width="2"/>' +
          '<circle cx="-6" cy="-24" r="4" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.75)" stroke-width="2"/>' +
          '<circle cx="-3" cy="-3" r="2.5" fill="#fff" opacity=".7"/>';
      }
      if (jenis === 'ikan') {
        var f = 'fill:var(' + warnaIkan[v % 3] + ');stroke:var(--lip)';
        return '<path d="M18 0L36-12L36 12Z" style="' + f + '" stroke-width="2.2" stroke-linejoin="round"/>' +
          '<path d="M-24 0C-14-15 10-15 22 0C10 15-14 15-24 0Z" style="' + f + '" stroke-width="2.2" stroke-linejoin="round"/>' +
          '<circle cx="-12" cy="-3" r="3" fill="#fff"/><circle cx="-12.8" cy="-3" r="1.3" fill="#1E2A33"/>' +
          '<path d="M0-9C4-3 4 3 0 9" fill="none" ' + lip + ' stroke-width="2" opacity=".4"/>';
      }
      if (jenis === 'karang') {
        var d = 'M0 0V-32M0-14L-15-30M0-22L14-38M-15-30L-19-40M14-38L19-44';
        return '<ellipse cx="0" cy="3" rx="24" ry="6" fill="rgba(0,0,0,.22)"/>' +
          '<path d="' + d + '" fill="none" ' + lip + ' stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<path d="' + d + '" fill="none" style="stroke:var(--c1)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>';
      }
      return '<ellipse cx="0" cy="19" rx="46" ry="6" fill="rgba(255,255,255,.35)"/>' +
        '<path d="M3-42L30-8H3Z" style="fill:var(--kertas);stroke:var(--lip)" stroke-width="2.4" stroke-linejoin="round"/>' +
        '<path d="M-3-32L-26-8H-3Z" style="fill:var(--kertas);stroke:var(--lip)" stroke-width="2.4" stroke-linejoin="round"/>' +
        '<path d="M0-46V0" ' + lip + ' stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M-36-2H36L26 18H-26Z" style="fill:var(--c2);stroke:var(--lip)" stroke-width="3" stroke-linejoin="round"/>';
    }
    var hias = [];
    var jumlahJenis = { gel: 0, ikan: 0, karang: 0, perahu: 0 };
    var urut = ['gel', 'ikan', 'karang', 'perahu', 'ikan', 'gel'];
    function bentrok(bx) {
      var r, m = 6, c;
      for (r = 0; r < rects.length; r++) {
        if (!(bx.x1 + m < rects[r].x0 || bx.x0 - m > rects[r].x1 || bx.y1 + m < rects[r].y0 || bx.y0 - m > rects[r].y1)) return true;
      }
      for (c = 0; c < contoh.length; c++) {
        if (contoh[c].x > bx.x0 - 26 && contoh[c].x < bx.x1 + 26 && contoh[c].y > bx.y0 - 26 && contoh[c].y < bx.y1 + 26) return true;
      }
      for (c = 0; c < hias.length; c++) {
        var o = hias[c].bx;
        if (!(bx.x1 + 8 < o.x0 || bx.x0 - 8 > o.x1 || bx.y1 + 8 < o.y0 || bx.y0 - 8 > o.y1)) return true;
      }
      return false;
    }
    var coba = 0;
    while (hias.length < 9 && coba++ < 600) {
      var jenis = urut[Math.floor(rnd() * urut.length)];
      if ((jenis === 'perahu' && jumlahJenis.perahu >= 2) || (jenis === 'karang' && jumlahJenis.karang >= 3)) { rnd(); rnd(); rnd(); continue; }
      var s = 0.85 + rnd() * 0.35;
      var hx = 40 + rnd() * (W - 80), hy;
      if (jenis === 'karang') hy = HT - 18 - rnd() * 8;
      else if (jenis === 'perahu') hy = 62 + rnd() * 70;
      else hy = 30 + rnd() * (HT - 60);
      var bb = JENIS[jenis].b;
      var bx = { x0: hx + bb[0] * s, x1: hx + bb[1] * s, y0: hy + bb[2] * s, y1: hy + bb[3] * s };
      if (bx.x0 < 6 || bx.x1 > W - 6 || bx.y0 < 6 || bx.y1 > HT - 4) continue;
      if (bentrok(bx)) continue;
      hias.push({ j: jenis, x: hx, y: hy, s: s, bx: bx, flip: rnd() < 0.5 ? -1 : 1, dl: rnd() * 4, v: hias.length });
      jumlahJenis[jenis]++;
    }
    hias.sort(function (p, q) { return p.y - q.y; });

    /* ── SVG ── */
    var g = '<defs>' +
      '<linearGradient id="kpl-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--c1)"/><stop offset="1" style="stop-color:var(--c2)"/></linearGradient>' +
      '<linearGradient id="kpl-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgb(70,175,225)" stop-opacity=".10"/><stop offset="1" stop-color="rgb(8,60,130)" stop-opacity=".36"/></linearGradient>' +
      '</defs>';
    g += '<rect x="0" y="0" width="' + W + '" height="' + HT + '" fill="url(#kpl-w)"/>';

    /* riak air */
    for (i = 0; i < 5; i++) {
      var wy = 40 + i * 100 + rnd() * 30, wx = rnd() * W * 0.5, ulang = 5 + Math.floor(rnd() * 4);
      var wd = 'M' + r1(wx) + ' ' + r1(wy) + 'q15-9 30 0';
      for (j = 0; j < ulang; j++) wd += 't30 0';
      g += '<path d="' + wd + '" fill="none" stroke="rgba(255,255,255,.13)" stroke-width="3" stroke-linecap="round"/>';
    }

    hias.forEach(function (h) {
      g += '<g transform="translate(' + r1(h.x) + ' ' + r1(h.y) + ') scale(' + r1(h.flip * h.s) + ' ' + r1(h.s) + ')">' +
        '<g' + (JENIS[h.j].kelas ? ' class="' + JENIS[h.j].kelas + '" style="animation-delay:-' + r1(h.dl) + 's"' : '') + '>' +
        isiHias(h.j, h.v) + '</g></g>';
    });

    /* jembatan atau garis putus-putus */
    jemb.forEach(function (s) {
      if (s.buka) {
        g += '<path d="' + s.d + '" fill="none" stroke="rgba(0,0,0,.22)" stroke-width="18" transform="translate(0 4)"/>' +
          '<path d="' + s.d + '" fill="none" style="stroke:var(--lip)" stroke-width="16"/>' +
          '<path d="' + s.d + '" fill="none" style="stroke:var(--kertas)" stroke-width="11"/>' +
          '<path d="' + s.d + '" fill="none" style="stroke:var(--lip)" stroke-width="11" stroke-dasharray="2.5 9" opacity=".45"/>';
        if (s.lewat) g += '<path d="' + s.d + '" fill="none" style="stroke:var(--c2)" stroke-width="4" stroke-dasharray="10 8" stroke-linecap="round"/>';
      } else {
        g += '<path d="' + s.d + '" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="5" stroke-dasharray="2 12" stroke-linecap="round"/>';
      }
    });

    /* pulau level */
    function pulauSvg(p, idx) {
      var b = buka(idx), st = bt(idx), x = r1(p.x), y = r1(p.y);
      var tepi = b ? 'var(--lip)' : '#5E6770';
      var pasir = b ? 'var(--kertas)' : '#D7DCE1';
      var isi = b ? 'url(#kpl-g)' : '#AEB6BE';
      var h = '<g class="k-pl-titik' + (b ? '' : ' kunci') + '" data-i="' + idx + '" role="button" tabindex="0">' +
        '<ellipse cx="' + x + '" cy="' + (y + 30) + '" rx="58" ry="12" fill="rgba(255,255,255,.2)"/>' +
        '<ellipse cx="' + x + '" cy="' + (y + 26) + '" rx="60" ry="17" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="3"/>';
      if (idx === aktif) h += '<ellipse class="k-pl-cincin" cx="' + x + '" cy="' + (y + 6) + '" rx="46" ry="31" fill="none" style="stroke:var(--aksen)" stroke-width="5"/>';
      h += '<g class="k-pl-bulat' + (idx === aktif ? ' k-pl-aktif' : '') + '">' +
        '<ellipse cx="' + x + '" cy="' + (y + 9) + '" rx="42" ry="28" style="fill:' + tepi + '"/>' +
        '<ellipse cx="' + x + '" cy="' + (y + 6) + '" rx="42" ry="28" style="fill:' + pasir + ';stroke:' + tepi + '" stroke-width="3.5"/>' +
        '<ellipse cx="' + x + '" cy="' + y + '" rx="32" ry="20" style="fill:' + isi + ';stroke:' + tepi + '" stroke-width="3"/>' +
        '<ellipse cx="' + r1(x - 10) + '" cy="' + (y - 9) + '" rx="12" ry="5" fill="#fff" opacity=".42"/>' +
        '<text x="' + x + '" y="' + (y + 10) + '" text-anchor="middle" font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700" font-size="30" style="fill:' + tepi + '">' + (idx + 1) + '</text></g>';
      if (b) h += A.svgBintang(x - 26, y + 47, 10, st >= 1) + A.svgBintang(x, y + 52, 11, st >= 2) + A.svgBintang(x + 26, y + 47, 10, st >= 3);
      else h += A.svgGembok(x + 36, y - 20);
      h += '<circle cx="' + x + '" cy="' + (y + 4) + '" r="52" fill="transparent"/></g>';
      return h;
    }
    pts.forEach(function (p, idx) { g += pulauSvg(p, idx); });

    /* pulau besar + peti */
    g += '<ellipse cx="' + xf + '" cy="' + (yf + 56) + '" rx="128" ry="20" fill="rgba(255,255,255,.2)"/>' +
      '<ellipse cx="' + xf + '" cy="' + (yf + 8) + '" rx="122" ry="72" fill="none" stroke="rgba(255,255,255,.26)" stroke-width="3"/>' +
      '<ellipse cx="' + xf + '" cy="' + (yf + 12) + '" rx="108" ry="62" style="fill:var(--lip)"/>' +
      '<ellipse cx="' + xf + '" cy="' + (yf + 8) + '" rx="108" ry="62" style="fill:var(--kertas);stroke:var(--lip)" stroke-width="4"/>' +
      '<ellipse cx="' + xf + '" cy="' + yf + '" rx="90" ry="48" style="fill:url(#kpl-g);stroke:var(--lip)" stroke-width="3"/>' +
      '<ellipse cx="' + (xf - 40) + '" cy="' + (yf - 26) + '" rx="26" ry="8" fill="#fff" opacity=".35"/>';
    g += A.svgHiasan('pohon', xf + 72, yf - 8, 0.9);
    g += '<g class="k-pl-peti' + (semua ? ' buka' : '') + '" role="button" tabindex="0">' +
      A.svgPeti(xf, yf - 2, semua) +
      '<rect x="' + (xf - 66) + '" y="' + (yf - 62) + '" width="132" height="100" fill="transparent"/></g>';

    var wadah = A.el('div', 'k-pl');
    wadah.style.height = HT + 'px';
    wadah.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + HT + '" preserveAspectRatio="none">' + g + '</svg>';

    /* label */
    function label(cx, top, lebar, jd, kecil, kunci) {
      var d = A.el('div', 'k-pl-label' + (kunci ? ' kunci' : ''), '<span class="jd">' + jd + '</span><small>' + kecil + '</small>');
      d.style.left = r1(cx) + 'px';
      d.style.top = r1(top) + 'px';
      d.style.width = lebar + 'px';
      d.style.marginLeft = (-lebar / 2) + 'px';
      return d;
    }
    pts.forEach(function (p, idx) {
      var judul = (k.judulLevel ? k.judulLevel(idx) : '') || ('Level ' + (idx + 1));
      wadah.appendChild(label(p.x, p.y + 68, lw, A.fmt(judul), A.esc(k.namaMesin ? k.namaMesin(idx) : ''), !buka(idx)));
    });
    wadah.appendChild(label(xf, yf + 86, 176,
      '<svg width="20" height="20" viewBox="0 0 20 20">' + A.svgBintang(10, 11, 9, true) + '</svg>' + tot + ' / ' + maks,
      semua ? 'Ketuk peti harta!' : 'Selesaikan semua level', false));

    /* sentuhan */
    function pasang(elm, fn) {
      elm.addEventListener('click', fn);
      elm.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
      });
    }
    Array.prototype.forEach.call(wadah.querySelectorAll('.k-pl-titik'), function (t) {
      var idx = +t.getAttribute('data-i');
      var jd = (k.judulLevel ? k.judulLevel(idx) : '') || '';
      t.setAttribute('aria-label', 'Level ' + (idx + 1) + (jd ? ': ' + jd : '') + (buka(idx) ? '' : ' (terkunci)'));
      pasang(t, function () { k.pilih(idx, t); });
    });
    var pt = wadah.querySelector('.k-pl-peti');
    if (pt) {
      pt.setAttribute('aria-label', 'Tujuan akhir: peti harta' + (semua ? '' : ' (terkunci)'));
      pasang(pt, function () { k.akhir(pt); });
    }

    k.w.appendChild(wadah);

    /* penanda "kamu di sini": di atas pulau aktif, atau di samping peti bila semua selesai */
    var pos = pts.map(function (p) { return { x: r1(p.x), y: r1(p.y - 20) }; });
    pos.push({ x: r1(xf - 80), y: r1(yf + 6) });
    k.penanda(wadah, pos);
  }

  /* ══════════════ gaya "konstelasi" ══════════════ */

  var CSS_KN = CSS.replace(/k-pl/g, 'k-kn') + [
    '.k-kn-kedip{animation:kKnKedip 3.2s ease-in-out infinite}',
    '@keyframes kKnKedip{0%,100%{opacity:.25}50%{opacity:1}}',
    '.k-kn-kilau{transform-box:fill-box;transform-origin:center;animation:kKnKilau 3.6s ease-in-out infinite}',
    '@keyframes kKnKilau{0%,100%{transform:scale(.8);opacity:.5}50%{transform:scale(1.1);opacity:1}}'
  ].join('');

  function keadaan(k) {
    var s = { A: k.alat, D: k.D || {}, W: k.W || 960, HT: k.tinggi || 482 };
    s.n = Math.max(1, Math.min(5, k.n || (k.level && k.level.length) || 1));
    var bintang = k.bintang || [];
    s.bt = function (idx) { return bintang[idx] > 0 ? Math.min(3, bintang[idx]) : 0; };
    s.buka = function (idx) {
      if (k.modeGuru) return true;
      if (typeof k.terbuka === 'number') return idx < k.terbuka;
      return idx === 0 || s.bt(idx - 1) > 0;
    };
    s.aktif = typeof k.aktif === 'number' ? k.aktif : -1;
    s.semua = !!k.semua;
    var tot = 0, i;
    for (i = 0; i < s.n; i++) tot += s.bt(i);
    s.tot = typeof k.total === 'number' ? k.total : tot;
    s.maks = typeof k.maks === 'number' ? k.maks : s.n * 3;
    return s;
  }

  function buatLabel(A, kelas, cx, top, lebar, jd, kecil, kunci) {
    var d = A.el('div', kelas + (kunci ? ' kunci' : ''), '<span class="jd">' + jd + '</span><small>' + kecil + '</small>');
    d.style.left = r1(cx) + 'px';
    d.style.top = r1(top) + 'px';
    d.style.width = lebar + 'px';
    d.style.marginLeft = (-lebar / 2) + 'px';
    return d;
  }

  function pasangKlik(elm, fn) {
    elm.addEventListener('click', fn);
    elm.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
    });
  }

  function gambarKonstelasi(k) {
    var S = keadaan(k), A = S.A, D = S.D, W = S.W, HT = S.HT, n = S.n;
    var bt = S.bt, buka = S.buka, aktif = S.aktif, semua = S.semua, tot = S.tot, maks = S.maks;
    var rnd = A.acakBenih(A.hashTeks(D.judul || 'konstelasi'));
    var i, j;

    if (k.css) k.css('kit-peta-konstelasi', CSS_KN);

    /* ── tata letak ── */
    var xf = W - 120, yc = Math.round(HT * 0.47), yf = yc;
    var x0 = 100, xl = xf - 170, avail = xl - x0;
    var sp = n > 1 ? Math.min(200, avail / (n - 1)) : 0;
    var start = x0 + (avail - sp * (n - 1)) / 2;
    var lw = n > 1 ? Math.max(116, Math.min(160, sp - 12)) : 160;
    var arah = rnd() < 0.5 ? 1 : -1;
    var pts = [], cincin = [];
    for (i = 0; i < n; i++) {
      var jit = rnd();
      cincin.push(rnd() < 0.5);
      var yy = n > 1 ? yc + arah * (i % 2 ? 1 : -1) * (46 + (jit - 0.5) * 24) : yc;
      pts.push({ x: start + sp * i, y: Math.max(165, Math.min(290, yy)) });
    }
    var simpul = pts.concat([{ x: xf, y: yf }]);

    /* garis rasi: lurus antar pusat planet (digambar di bawah planet) */
    var ruas = [], contoh = [];
    for (i = 0; i < n; i++) {
      var pa = simpul[i], pb = simpul[i + 1];
      ruas.push({ a: pa, b: pb, buka: i === n - 1 ? semua : buka(i + 1), lewat: bt(i) > 0 });
      for (j = 0; j <= 12; j++) contoh.push({ x: pa.x + (pb.x - pa.x) * j / 12, y: pa.y + (pb.y - pa.y) * j / 12 });
    }

    /* area label dan area terlarang untuk hiasan */
    var rects = [], lab = [];
    var half = Math.max(lw / 2 + 6, 64);
    pts.forEach(function (p) {
      rects.push({ x0: p.x - half, x1: p.x + half, y0: p.y - 110, y1: p.y + 134 });
      lab.push([p.x - lw / 2 - 4, p.x + lw / 2 + 4, p.y + 64, p.y + 134]);
    });
    rects.push({ x0: xf - 100, x1: xf + 100, y0: yf - 140, y1: yf + 140 });
    lab.push([xf - 92, xf + 92, yf + 72, yf + 132]);
    function dalamLabel(x, y) {
      for (var q = 0; q < lab.length; q++) if (x > lab[q][0] && x < lab[q][1] && y > lab[q][2] && y < lab[q][3]) return true;
      return false;
    }

    /* ── hiasan langit ── */
    var JENIS = {
      kilau: { b: [-16, 16, -16, 16], kelas: 'k-kn-kilau' },
      bulan: { b: [-24, 24, -22, 22], kelas: '' },
      komet: { b: [-66, 66, -24, 24], kelas: 'k-kn-kedip' },
      planet: { b: [-28, 28, -24, 24], kelas: '' }
    };
    function isiHias(jenis) {
      if (jenis === 'kilau') return '<path d="M0-14Q2-2 14 0Q2 2 0 14Q-2 2-14 0Q-2-2 0-14Z" fill="#fff" opacity=".9"/>';
      if (jenis === 'bulan') return '<mask id="kkn-bm"><rect x="-30" y="-30" width="60" height="60" fill="#fff"/><circle cx="9" cy="-4" r="15" fill="#000"/></mask>' +
        '<circle cx="0" cy="0" r="18" fill="#F4E9B8" mask="url(#kkn-bm)"/>';
      if (jenis === 'komet') return '<path d="M0 0L-62-18" stroke="rgba(255,255,255,.18)" stroke-width="8" stroke-linecap="round"/>' +
        '<path d="M0 0L-62-18" stroke="rgba(255,255,255,.55)" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="0" cy="0" r="5" fill="#fff"/>';
      return '<ellipse cx="0" cy="0" rx="26" ry="7" transform="rotate(-20)" fill="none" style="stroke:var(--aksen)" stroke-width="2.5" opacity=".6"/>' +
        '<circle cx="0" cy="0" r="14" style="fill:var(--c2);stroke:var(--kertas)" stroke-width="1.5" opacity=".7"/>';
    }
    var hias = [];
    var jumlah = { kilau: 0, bulan: 0, komet: 0, planet: 0 };
    var batas = { kilau: 9, bulan: 1, komet: 2, planet: 2 };
    var urut = ['kilau', 'bulan', 'komet', 'planet', 'kilau', 'kilau'];
    function bentrok(bx) {
      var r, m = 6, c;
      for (r = 0; r < rects.length; r++) {
        if (!(bx.x1 + m < rects[r].x0 || bx.x0 - m > rects[r].x1 || bx.y1 + m < rects[r].y0 || bx.y0 - m > rects[r].y1)) return true;
      }
      for (c = 0; c < contoh.length; c++) {
        if (contoh[c].x > bx.x0 - 24 && contoh[c].x < bx.x1 + 24 && contoh[c].y > bx.y0 - 24 && contoh[c].y < bx.y1 + 24) return true;
      }
      for (c = 0; c < hias.length; c++) {
        var o = hias[c].bx;
        if (!(bx.x1 + 8 < o.x0 || bx.x0 - 8 > o.x1 || bx.y1 + 8 < o.y0 || bx.y0 - 8 > o.y1)) return true;
      }
      return false;
    }
    var coba = 0;
    while (hias.length < 7 && coba++ < 600) {
      var jenis = urut[Math.floor(rnd() * urut.length)];
      var sk = 0.85 + rnd() * 0.35;
      var hx = 40 + rnd() * (W - 80);
      var hy = jenis === 'komet' ? 30 + rnd() * 120 : 30 + rnd() * (HT - 60);
      var fl = rnd() < 0.5 ? -1 : 1, dl = rnd() * 4;
      if (jumlah[jenis] >= batas[jenis]) continue;
      var bb = JENIS[jenis].b;
      var bx = { x0: hx + bb[0] * sk, x1: hx + bb[1] * sk, y0: hy + bb[2] * sk, y1: hy + bb[3] * sk };
      if (bx.x0 < 6 || bx.x1 > W - 6 || bx.y0 < 6 || bx.y1 > HT - 4) continue;
      if (bentrok(bx)) continue;
      hias.push({ j: jenis, x: hx, y: hy, s: sk, bx: bx, flip: fl, dl: dl });
      jumlah[jenis]++;
    }
    hias.sort(function (p, q) { return p.y - q.y; });

    /* ── SVG ── */
    var g = '<defs>' +
      '<linearGradient id="kkn-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070B26"/><stop offset="1" stop-color="#1B1D4E"/></linearGradient>' +
      '<radialGradient id="kkn-h"><stop offset="0" style="stop-color:var(--aksen)" stop-opacity=".5"/><stop offset="1" style="stop-color:var(--aksen)" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="kkn-p" cx=".35" cy=".3" r=".85"><stop offset="0" style="stop-color:var(--c1)"/><stop offset="1" style="stop-color:var(--c2)"/></radialGradient>' +
      '<radialGradient id="kkn-n1"><stop offset="0" style="stop-color:var(--c1)" stop-opacity=".3"/><stop offset="1" style="stop-color:var(--c1)" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="kkn-n2"><stop offset="0" style="stop-color:var(--c2)" stop-opacity=".3"/><stop offset="1" style="stop-color:var(--c2)" stop-opacity="0"/></radialGradient>' +
      '</defs>';
    g += '<rect x="0" y="0" width="' + W + '" height="' + HT + '" fill="url(#kkn-s)"/>';

    /* kabut warna */
    for (i = 0; i < 2; i++) {
      var nx = 200 + rnd() * (W - 400), ny = 120 + rnd() * (HT - 240);
      g += '<ellipse cx="' + r1(nx) + '" cy="' + r1(ny) + '" rx="' + r1(150 + rnd() * 40) + '" ry="' + r1(80 + rnd() * 20) + '" fill="url(#kkn-n' + (i + 1) + ')"/>';
    }

    /* debu bintang (tidak menimpa label) */
    for (i = 0; i < 36; i++) {
      var dx = rnd() * W, dy = rnd() * HT, dr = 0.6 + rnd() * 1.0, dop = 0.3 + rnd() * 0.6, dd = rnd() * 3;
      if (dalamLabel(dx, dy)) continue;
      g += '<circle cx="' + r1(dx) + '" cy="' + r1(dy) + '" r="' + r1(dr) + '" fill="#fff" opacity="' + r1(dop) + '"' +
        (i % 4 === 0 ? ' class="k-kn-kedip" style="animation-delay:-' + r1(dd) + 's"' : '') + '/>';
    }

    hias.forEach(function (h) {
      g += '<g transform="translate(' + r1(h.x) + ' ' + r1(h.y) + ') scale(' + r1(h.flip * h.s) + ' ' + r1(h.s) + ')">' +
        '<g' + (JENIS[h.j].kelas ? ' class="' + JENIS[h.j].kelas + '" style="animation-delay:-' + r1(h.dl) + 's"' : '') + '>' +
        isiHias(h.j) + '</g></g>';
    });

    /* garis bercahaya atau putus-putus */
    ruas.forEach(function (s) {
      var d = 'M' + r1(s.a.x) + ' ' + r1(s.a.y) + 'L' + r1(s.b.x) + ' ' + r1(s.b.y);
      if (s.buka) {
        g += '<path d="' + d + '" stroke-width="9" stroke-linecap="round" style="stroke:var(--aksen)" opacity=".22"/>' +
          '<path d="' + d + '" stroke-width="2.5" stroke-linecap="round" style="stroke:var(--aksen)"/>';
        if (s.lewat) g += '<path d="' + d + '" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".9"/>';
      } else {
        g += '<path d="' + d + '" stroke="rgba(255,255,255,.3)" stroke-width="1.5" stroke-dasharray="3 7" stroke-linecap="round"/>';
      }
    });

    /* planet level */
    function planetSvg(p, idx) {
      var b = buka(idx), st = bt(idx), x = r1(p.x), y = r1(p.y), ring = cincin[idx];
      var isi = b ? 'url(#kkn-p)' : '#4A5568', tepi = b ? 'var(--kertas)' : '#8A94A3';
      var rc = b ? 'style="stroke:var(--aksen)"' : 'stroke="#8A94A3"';
      var rg = ' fill="none" ' + rc + ' stroke-width="3" stroke-linecap="round" opacity=".85" transform="rotate(-18 ' + x + ' ' + y + ')"';
      var h = '<g class="k-kn-titik' + (b ? '' : ' kunci') + '" data-i="' + idx + '" role="button" tabindex="0">';
      if (b) h += '<circle cx="' + x + '" cy="' + y + '" r="50" fill="url(#kkn-h)"/>';
      if (idx === aktif) h += '<circle class="k-kn-cincin" cx="' + x + '" cy="' + y + '" r="34" fill="none" style="stroke:var(--aksen)" stroke-width="3"/>';
      h += '<g class="k-kn-bulat' + (idx === aktif ? ' k-kn-aktif' : '') + '">';
      if (ring) h += '<path d="M' + r1(x - 46) + ' ' + y + 'A46 12 0 0 1 ' + r1(x + 46) + ' ' + y + '"' + rg + '/>';
      h += '<circle cx="' + x + '" cy="' + y + '" r="30" style="fill:' + isi + ';stroke:' + tepi + '" stroke-width="2.5"/>' +
        '<ellipse cx="' + r1(x - 9) + '" cy="' + r1(y - 11) + '" rx="10" ry="5" fill="#fff" opacity=".35"/>';
      if (ring) h += '<path d="M' + r1(x - 46) + ' ' + y + 'A46 12 0 0 0 ' + r1(x + 46) + ' ' + y + '"' + rg + '/>';
      h += '<text x="' + x + '" y="' + r1(y + 11) + '" text-anchor="middle" font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700" font-size="30" ' +
        'style="fill:' + (b ? 'var(--lip)' : '#D5DBE3') + ';stroke:' + (b ? 'rgba(255,255,255,.6)' : 'none') + ';stroke-width:3;paint-order:stroke">' + (idx + 1) + '</text></g>';
      if (b) h += A.svgBintang(x - 24, y + 48, 9, st >= 1) + A.svgBintang(x, y + 53, 10, st >= 2) + A.svgBintang(x + 24, y + 48, 9, st >= 3);
      else h += A.svgGembok(x + 32, y - 24);
      h += '<circle cx="' + x + '" cy="' + r1(y + 6) + '" r="54" fill="transparent"/></g>';
      return h;
    }
    pts.forEach(function (p, idx) { g += planetSvg(p, idx); });

    /* tujuan akhir: bintang besar */
    g += '<g class="k-kn-peti' + (semua ? ' buka' : '') + '" role="button" tabindex="0">';
    if (semua) {
      g += '<circle cx="' + xf + '" cy="' + yf + '" r="100" fill="url(#kkn-h)"/><g class="k-kn-sinar">';
      for (i = 0; i < 12; i++) {
        g += '<path d="M' + xf + ' ' + yf + 'L' + (xf - 8) + ' ' + (yf - 96) + 'L' + (xf + 8) + ' ' + (yf - 96) + 'Z" transform="rotate(' + (i * 30) + ' ' + xf + ' ' + yf + ')" style="fill:var(--aksen)" opacity=".3"/>';
      }
      g += '</g>';
    }
    g += A.svgBintang(xf, yf, 54, semua);
    if (semua) g += '<circle cx="' + (xf - 14) + '" cy="' + (yf - 14) + '" r="6" fill="#fff" opacity=".5"/>';
    else g += A.svgGembok(xf, yf + 4);
    g += '<circle cx="' + xf + '" cy="' + yf + '" r="66" fill="transparent"/></g>';

    var wadah = A.el('div', 'k-kn');
    wadah.style.height = HT + 'px';
    wadah.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + HT + '" preserveAspectRatio="none">' + g + '</svg>';

    /* label */
    pts.forEach(function (p, idx) {
      var judul = (k.judulLevel ? k.judulLevel(idx) : '') || ('Level ' + (idx + 1));
      wadah.appendChild(buatLabel(A, 'k-kn-label', p.x, p.y + 68, lw, A.fmt(judul), A.esc(k.namaMesin ? k.namaMesin(idx) : ''), !buka(idx)));
    });
    wadah.appendChild(buatLabel(A, 'k-kn-label', xf, yf + 76, 176,
      '<svg width="20" height="20" viewBox="0 0 20 20">' + A.svgBintang(10, 11, 9, true) + '</svg>' + tot + ' / ' + maks,
      semua ? 'Ketuk bintang besar!' : 'Selesaikan semua level', false));

    /* sentuhan */
    Array.prototype.forEach.call(wadah.querySelectorAll('.k-kn-titik'), function (t) {
      var idx = +t.getAttribute('data-i');
      var jd = (k.judulLevel ? k.judulLevel(idx) : '') || '';
      t.setAttribute('aria-label', 'Level ' + (idx + 1) + (jd ? ': ' + jd : '') + (buka(idx) ? '' : ' (terkunci)'));
      pasangKlik(t, function () { k.pilih(idx, t); });
    });
    var pt = wadah.querySelector('.k-kn-peti');
    if (pt) {
      pt.setAttribute('aria-label', 'Tujuan akhir: bintang besar' + (semua ? '' : ' (terkunci)'));
      pasangKlik(pt, function () { k.akhir(pt); });
    }

    k.w.appendChild(wadah);

    /* penanda: di atas planet aktif, atau di atas bintang besar bila semua selesai */
    var pos = pts.map(function (p) { return { x: r1(p.x), y: r1(p.y - 30) }; });
    pos.push({ x: r1(xf), y: r1(yf - 58) });
    k.penanda(wadah, pos);
  }

  /* ══════════════ gaya "sulur" ══════════════ */

  var CSS_SL = CSS.replace(/k-pl/g, 'k-sl').replace(/kPl/g, 'kSl') + [
    '.k-sl-pk{transform-box:fill-box}',
    '.k-sl-pk.kiri{transform-origin:100% 50%}',
    '.k-sl-pk.kanan{transform-origin:0% 50%}',
    '.k-sl-ayun{animation:kSlAyun 4.4s ease-in-out infinite}',
    '@keyframes kSlAyun{0%,100%{transform:rotate(-2.4deg)}50%{transform:rotate(2.4deg)}}',
    '.k-sl-mekar{animation:kSlMekar .9s cubic-bezier(.2,1.3,.4,1) 1 both}',
    '@keyframes kSlMekar{from{transform:scale(.55);opacity:0}to{transform:scale(1);opacity:1}}',
    '.k-sl-kunang{transform-box:fill-box;transform-origin:center;animation:kSlKunang 5.2s ease-in-out infinite}',
    '@keyframes kSlKunang{0%,100%{transform:translate(0,0);opacity:.25}50%{transform:translate(7px,-9px);opacity:1}}'
  ].join('');

  var FOLHA_BUKA = 'M-46 0C-30-30 18-34 46 0C18 34-30 30-46 0Z';
  var FOLHA_TUTUP = 'M-38 0C-24-22 14-24 38 0C14 24-24 22-38 0Z';

  function gambarSulur(k) {
    var S = keadaan(k), A = S.A, D = S.D, W = S.W, HT = S.HT, n = S.n;
    var bt = S.bt, buka = S.buka, aktif = S.aktif, semua = S.semua, tot = S.tot, maks = S.maks;
    var rnd = A.acakBenih(A.hashTeks(D.judul || 'sulur'));
    var i, j;

    if (k.css) k.css('kit-peta-sulur', CSS_SL);

    /* ── tata letak: batang tegak di tengah, daun bergantian kiri dan kanan ── */
    var cx = Math.round(W / 2);
    var dx = Math.round(Math.max(96, Math.min(124, W * 0.105)));
    var lw = 176;
    var fy = 96;
    var yTop = Math.round(HT * 0.43), yBot = HT - 62;
    var sp = n > 1 ? Math.min(72, (yBot - yTop) / (n - 1)) : 0;
    var mid = (yTop + yBot) / 2;
    var arah = rnd() < 0.5 ? 1 : -1;
    var pts = [];
    for (i = 0; i < n; i++) {
      pts.push({
        sisi: arah * (i % 2 ? -1 : 1),
        y: r1(mid + ((n - 1) / 2 - i) * sp),
        sx: cx + (rnd() - 0.5) * 16,
        dl: rnd() * 4
      });
      pts[i].x = cx + pts[i].sisi * dx;
    }

    /* ── batang: kurva halus dari tanah, lewat tiap level, ke bunga ── */
    var P = [{ x: cx, y: HT - 8 }];
    pts.forEach(function (p) { P.push({ x: p.sx, y: p.y }); });
    P.push({ x: cx, y: fy + 26 });
    var batang = [];
    for (j = 0; j < P.length - 1; j++) {
      var p0 = P[j - 1] || P[j], p1 = P[j], p2 = P[j + 1], p3 = P[j + 2] || p2;
      var c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
      var c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
      batang.push({
        d: 'M' + r1(p1.x) + ' ' + r1(p1.y) + 'C' + r1(c1.x) + ' ' + r1(c1.y) + ' ' + r1(c2.x) + ' ' + r1(c2.y) + ' ' + r1(p2.x) + ' ' + r1(p2.y),
        mx: (p1.x + 3 * c1.x + 3 * c2.x + p2.x) / 8,
        my: (p1.y + 3 * c1.y + 3 * c2.y + p2.y) / 8,
        buka: j < n ? buka(j) : semua,
        lewat: j === 0 || bt(j - 1) > 0
      });
    }

    /* tangkai daun: dari batang ke pangkal daun */
    var jalur = batang.slice();
    pts.forEach(function (p, idx) {
      var bx = p.x - p.sisi * 46;
      jalur.push({
        d: 'M' + r1(p.sx) + ' ' + r1(p.y) + 'Q' + r1((p.sx + bx) / 2) + ' ' + r1(p.y - 16) + ' ' + r1(bx) + ' ' + r1(p.y),
        buka: buka(idx),
        lewat: bt(idx) > 0
      });
    });

    /* ── area terlarang untuk kunang-kunang ── */
    var rects = [
      { x0: cx - 40, x1: cx + 40, y0: 0, y1: HT },
      { x0: cx - 104, x1: cx + 104, y0: 0, y1: fy + 104 },
      { x0: cx + 100, x1: cx + 100 + lw, y0: fy - 36, y1: fy + 36 }
    ];
    pts.forEach(function (p) {
      rects.push({ x0: p.x - 58, x1: p.x + 58, y0: p.y - 40, y1: p.y + 64 });
      var lx = p.sisi < 0 ? p.x - 56 - lw : p.x + 56;
      rects.push({ x0: lx, x1: lx + lw, y0: p.y - 36, y1: p.y + 36 });
    });
    var kunang = [], coba = 0;
    function bentrok(x, y) {
      var r;
      for (r = 0; r < rects.length; r++) {
        if (x > rects[r].x0 - 14 && x < rects[r].x1 + 14 && y > rects[r].y0 - 14 && y < rects[r].y1 + 14) return true;
      }
      for (r = 0; r < kunang.length; r++) {
        if (Math.abs(kunang[r].x - x) < 70 && Math.abs(kunang[r].y - y) < 60) return true;
      }
      return false;
    }
    while (kunang.length < 8 && coba++ < 400) {
      var kx = 24 + rnd() * (W - 48), ky = 24 + rnd() * (HT - 48), kd = rnd() * 5;
      if (bentrok(kx, ky)) continue;
      kunang.push({ x: kx, y: ky, dl: kd });
    }

    /* ── SVG ── */
    var g = '<defs>' +
      '<linearGradient id="ksl-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--c1)"/><stop offset="1" style="stop-color:var(--c2)"/></linearGradient>' +
      '<linearGradient id="ksl-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>' +
      '<radialGradient id="ksl-h"><stop offset="0" style="stop-color:var(--aksen)" stop-opacity=".5"/><stop offset="1" style="stop-color:var(--aksen)" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="ksl-k"><stop offset="0" stop-color="#FFF3A0" stop-opacity=".8"/><stop offset="1" stop-color="#FFF3A0" stop-opacity="0"/></radialGradient>' +
      '</defs>';
    g += '<rect x="0" y="0" width="' + W + '" height="' + HT + '" fill="url(#ksl-w)"/>';

    kunang.forEach(function (f) {
      g += '<g transform="translate(' + r1(f.x) + ' ' + r1(f.y) + ')"><g class="k-sl-kunang" style="animation-delay:-' + r1(f.dl) + 's">' +
        '<circle cx="0" cy="0" r="10" fill="url(#ksl-k)"/><circle cx="0" cy="0" r="2.6" fill="#FFF6B0"/></g></g>';
    });

    /* tanah di pangkal batang */
    g += '<ellipse cx="' + cx + '" cy="' + (HT - 3) + '" rx="64" ry="11" fill="rgba(0,0,0,.3)"/>' +
      '<ellipse cx="' + cx + '" cy="' + (HT - 6) + '" rx="46" ry="7" fill="rgba(255,255,255,.12)"/>';

    /* sulur kecil dan daun kecil di antara level (di bawah batang) */
    for (j = 0; j < n; j++) {
      var ds = (j % 2 ? -1 : 1) * arah, bj = batang[j];
      g += '<g transform="translate(' + r1(bj.mx) + ' ' + r1(bj.my) + ') scale(' + ds + ' 1)">' +
        '<path d="M0 0C10-2 20-8 20-18C20-26 11-27 9-20C8-14 14-12 16-16" fill="none" style="stroke:var(--lip)" stroke-width="6" stroke-linecap="round"/>' +
        '<path d="M0 0C10-2 20-8 20-18C20-26 11-27 9-20C8-14 14-12 16-16" fill="none" style="stroke:var(--c1)" stroke-width="2.6" stroke-linecap="round"/></g>';
      g += '<g transform="translate(' + r1(bj.mx - ds * 5) + ' ' + r1(bj.my + 4) + ') scale(' + (-ds) + ' 1) rotate(-22)">' +
        '<g class="k-sl-pk kanan k-sl-ayun" style="animation-delay:-' + r1(pts[j].dl) + 's">' +
        '<path d="M0 0C8-10 22-10 30 0C22 10 8 10 0 0Z" style="fill:var(--c2);stroke:var(--lip)" stroke-width="2" stroke-linejoin="round"/></g></g>';
    }

    /* batang dan tangkai: garis tepi dulu, lalu isi, supaya persimpangan menyatu */
    jalur.forEach(function (s) {
      if (s.buka) g += '<path d="' + s.d + '" fill="none" style="stroke:var(--lip)" stroke-width="16" stroke-linecap="round"/>';
    });
    jalur.forEach(function (s) {
      if (s.buka) g += '<path d="' + s.d + '" fill="none" style="stroke:var(--c2)" stroke-width="10" stroke-linecap="round"/>' +
        '<path d="' + s.d + '" fill="none" style="stroke:var(--c1)" stroke-width="3" stroke-linecap="round" opacity=".75" transform="translate(-2 0)"/>';
      else g += '<path d="' + s.d + '" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round"/>';
    });
    jalur.forEach(function (s) {
      if (s.buka && s.lewat) g += '<path d="' + s.d + '" fill="none" style="stroke:var(--aksen)" stroke-width="3" stroke-dasharray="9 9" stroke-linecap="round"/>';
    });

    /* daun level */
    function daunSvg(p, idx) {
      var b = buka(idx), st = bt(idx), x = r1(p.x), y = r1(p.y), sisi = p.sisi;
      var kelas = sisi < 0 ? 'kiri' : 'kanan';
      var isi = b ? 'url(#ksl-g)' : '#AEB6BE', tepi = b ? 'var(--lip)' : '#5E6770';
      var bentuk = b ? FOLHA_BUKA : FOLHA_TUTUP;
      var h = '<g class="k-sl-titik' + (b ? '' : ' kunci') + '" data-i="' + idx + '" role="button" tabindex="0">';
      if (idx === aktif) h += '<ellipse class="k-sl-cincin" cx="' + x + '" cy="' + y + '" rx="58" ry="36" fill="none" style="stroke:var(--aksen)" stroke-width="4"/>';
      h += '<g class="k-sl-pk ' + kelas + ' k-sl-ayun" style="animation-delay:-' + r1(p.dl) + 's">';
      if (idx === aktif) h += '<g class="k-sl-pk ' + kelas + ' k-sl-mekar">';
      h += '<g class="k-sl-bulat' + (idx === aktif ? ' k-sl-aktif' : '') + '">' +
        '<g transform="translate(' + x + ' ' + y + ') scale(' + sisi + ' 1)">' +
        '<path d="' + bentuk + '" transform="translate(0 4)" style="fill:' + tepi + '"/>' +
        '<path d="' + bentuk + '" style="fill:' + isi + ';stroke:' + tepi + '" stroke-width="3.5" stroke-linejoin="round"/>';
      if (b) h += '<path d="M-42 0L-17 0M17 0L38 0M-30 0L-22-9M-30 0L-22 9M24 0L32-6M24 0L32 6" fill="none" style="stroke:var(--lip)" stroke-width="2" stroke-linecap="round" opacity=".35"/>' +
        '<ellipse cx="-8" cy="-12" rx="15" ry="4.5" transform="rotate(-8 -8 -12)" fill="#fff" opacity=".42"/>';
      else h += '<path d="M-33 0L-17 0M17 0L33 0" fill="none" stroke="#5E6770" stroke-width="2" stroke-linecap="round" opacity=".5"/>';
      h += '</g><text x="' + x + '" y="' + r1(y + 10) + '" text-anchor="middle" font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700" font-size="30" ' +
        'style="fill:' + (b ? 'var(--lip)' : '#5E6770') + ';stroke:' + (b ? 'rgba(255,255,255,.6)' : 'none') + ';stroke-width:3;paint-order:stroke">' + (idx + 1) + '</text></g>';
      if (idx === aktif) h += '</g>';
      h += '</g>';
      if (b) h += A.svgBintang(r1(x - 24), r1(y + 40), 9, st >= 1) + A.svgBintang(x, r1(y + 45), 10, st >= 2) + A.svgBintang(r1(x + 24), r1(y + 40), 9, st >= 3);
      else h += A.svgGembok(r1(x - sisi * 26), r1(y - 24));
      h += '<circle cx="' + x + '" cy="' + y + '" r="52" fill="transparent"/></g>';
      return h;
    }
    pts.forEach(function (p, idx) { g += daunSvg(p, idx); });

    /* tujuan akhir: kuncup terkunci, mekar menjadi bunga besar bila semua selesai */
    g += '<g class="k-sl-peti' + (semua ? ' buka' : '') + '" role="button" tabindex="0">';
    if (semua) {
      g += '<circle cx="' + cx + '" cy="' + fy + '" r="92" fill="url(#ksl-h)"/><g class="k-sl-sinar">';
      for (i = 0; i < 12; i++) {
        g += '<path d="M' + cx + ' ' + fy + 'L' + (cx - 7) + ' ' + (fy - 84) + 'L' + (cx + 7) + ' ' + (fy - 84) + 'Z" transform="rotate(' + (i * 30) + ' ' + cx + ' ' + fy + ')" style="fill:var(--aksen)" opacity=".3"/>';
      }
      g += '</g>';
      for (i = 0; i < 8; i++) {
        g += '<ellipse cx="' + cx + '" cy="' + (fy - 34) + '" rx="15" ry="30" transform="rotate(' + (i * 45) + ' ' + cx + ' ' + fy + ')" fill="url(#ksl-g)" style="stroke:var(--lip)" stroke-width="2.5"/>';
      }
      for (i = 0; i < 8; i++) {
        g += '<ellipse cx="' + cx + '" cy="' + (fy - 24) + '" rx="11" ry="21" transform="rotate(' + (i * 45 + 22.5) + ' ' + cx + ' ' + fy + ')" style="fill:var(--kertas);stroke:var(--lip)" stroke-width="2"/>';
      }
      g += '<circle cx="' + cx + '" cy="' + fy + '" r="17" style="fill:var(--aksen);stroke:var(--lip)" stroke-width="3"/>' +
        '<circle cx="' + (cx - 5) + '" cy="' + (fy - 6) + '" r="5" fill="#fff" opacity=".55"/>';
    } else {
      g += '<ellipse cx="' + cx + '" cy="' + (fy + 20) + '" rx="34" ry="9" fill="#8F9AA6" stroke="#5E6770" stroke-width="2.5"/>' +
        '<path d="M' + (cx - 30) + ' ' + (fy + 16) + 'C' + (cx - 40) + ' ' + (fy - 20) + ' ' + (cx - 12) + ' ' + (fy - 48) + ' ' + cx + ' ' + (fy - 54) +
        'C' + (cx + 12) + ' ' + (fy - 48) + ' ' + (cx + 40) + ' ' + (fy - 20) + ' ' + (cx + 30) + ' ' + (fy + 16) + 'Z" fill="#AEB6BE" stroke="#5E6770" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="M' + cx + ' ' + (fy - 54) + 'C' + (cx - 10) + ' ' + (fy - 24) + ' ' + (cx - 8) + ' ' + (fy - 2) + ' ' + (cx - 6) + ' ' + (fy + 14) +
        'M' + cx + ' ' + (fy - 54) + 'C' + (cx + 10) + ' ' + (fy - 24) + ' ' + (cx + 8) + ' ' + (fy - 2) + ' ' + (cx + 6) + ' ' + (fy + 14) +
        '" fill="none" stroke="#5E6770" stroke-width="2" opacity=".45"/>' + A.svgGembok(cx, fy - 6);
    }
    g += '<circle cx="' + cx + '" cy="' + fy + '" r="70" fill="transparent"/></g>';

    var wadah = A.el('div', 'k-sl');
    wadah.style.height = HT + 'px';
    wadah.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + HT + '" preserveAspectRatio="none">' + g + '</svg>';

    /* label: di samping daun, sisi luar; rata kanan di kiri, rata kiri di kanan */
    function etiket(kiri, lebar, cy, rata, jd, kecil, kunci) {
      var d = A.el('div', 'k-sl-label' + (kunci ? ' kunci' : ''), '<span class="jd">' + jd + '</span><small>' + kecil + '</small>');
      d.style.left = r1(kiri) + 'px';
      d.style.width = lebar + 'px';
      d.style.top = r1(cy) + 'px';
      d.style.transform = 'translateY(-50%)';
      d.style.textAlign = rata;
      return d;
    }
    pts.forEach(function (p, idx) {
      var judul = (k.judulLevel ? k.judulLevel(idx) : '') || ('Level ' + (idx + 1));
      var kiri = p.sisi < 0;
      wadah.appendChild(etiket(kiri ? p.x - 56 - lw : p.x + 56, lw, p.y, kiri ? 'right' : 'left',
        A.fmt(judul), A.esc(k.namaMesin ? k.namaMesin(idx) : ''), !buka(idx)));
    });
    wadah.appendChild(etiket(cx + 100, lw, fy, 'left',
      '<svg width="20" height="20" viewBox="0 0 20 20">' + A.svgBintang(10, 11, 9, true) + '</svg>' + tot + ' / ' + maks,
      semua ? 'Ketuk bunga!' : 'Selesaikan semua level', false));

    /* sentuhan */
    Array.prototype.forEach.call(wadah.querySelectorAll('.k-sl-titik'), function (t) {
      var idx = +t.getAttribute('data-i');
      var jd = (k.judulLevel ? k.judulLevel(idx) : '') || '';
      t.setAttribute('aria-label', 'Level ' + (idx + 1) + (jd ? ': ' + jd : '') + (buka(idx) ? '' : ' (terkunci)'));
      pasangKlik(t, function () { k.pilih(idx, t); });
    });
    var pt = wadah.querySelector('.k-sl-peti');
    if (pt) {
      pt.setAttribute('aria-label', 'Tujuan akhir: bunga besar' + (semua ? '' : ' (terkunci)'));
      pasangKlik(pt, function () { k.akhir(pt); });
    }

    k.w.appendChild(wadah);

    /* penanda: di pangkal daun aktif (sisi batang, supaya tidak menutupi daun di atasnya), atau di kiri bunga bila semua selesai */
    var pos = pts.map(function (p) { return { x: r1(p.x - p.sisi * 50), y: r1(p.y - 6) }; });
    pos.push({ x: r1(cx - 106), y: r1(fy + 8) });
    k.penanda(wadah, pos);
  }

  /* ══════════════ gaya "pusaran" ══════════════ */

  var CSS_PS = CSS.replace(/k-pl/g, 'k-ps') + [
    '.k-ps-label{background:rgba(var(--gelap),.55);border-radius:14px;padding:4px 8px;box-sizing:border-box}',
    '.k-ps-label.tengah{transform:translateY(-50%)}',
    '.k-ps-label.atas{transform:translateY(-100%)}',
    '.k-ps-label.kanan{text-align:left}',
    '.k-ps-label.kiri{text-align:right}',
    '.k-ps-arus,.k-ps-arus2,.k-ps-naik,.k-ps-rumput,.k-ps-nafas{transform-box:fill-box;transform-origin:center}',
    '.k-ps-arus{animation:kPsPutar 80s linear infinite}',
    '.k-ps-arus2{animation:kPsPutar 110s linear infinite reverse}',
    '@keyframes kPsPutar{to{transform:rotate(360deg)}}',
    '.k-ps-naik{animation:kPsNaik 6s ease-in infinite}',
    '@keyframes kPsNaik{0%{transform:translateY(8px);opacity:0}20%{opacity:.85}100%{transform:translateY(-36px);opacity:0}}',
    '.k-ps-kedip{animation:kPsKedip 6s ease-in-out infinite}',
    '@keyframes kPsKedip{0%,100%{opacity:.3}50%{opacity:1}}',
    '.k-ps-rumput{transform-origin:50% 100%;animation:kPsGoyang 5s ease-in-out infinite}',
    '@keyframes kPsGoyang{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}',
    '.k-ps-nafas{animation:kPsNafas 3.2s ease-in-out infinite}',
    '@keyframes kPsNafas{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.14);opacity:1}}'
  ].join('');

  /* tata letak spiral: simpul bergerak dari lingkar luar ke pusat (tujuan akhir).
     Fungsi murni: hanya hitung posisi, tidak menyentuh DOM. */
  function tata1(W, HT, n, cermin, fase, sIn) {
    var cx = W / 2, cy = Math.round(HT * 0.54);
    var rx = Math.min(W / 2 - 112, 470), ry = Math.round(HT * 0.303);
    var tot = 400 + 35 * (n - 1), du = 1 / n;
    var lw = 150, HL = 66, lwG = 206;
    var nodeU = [], nodeS = [], i, j;
    for (i = 0; i < n; i++) {
      nodeU.push(i * du);
      nodeS.push(n > 1 ? 1 - (1 - sIn) * i / (n - 1) : 0.8);
    }
    var uAkhir = nodeU[n - 1], sAkhir = nodeS[n - 1];

    function skala(u) {
      if (u <= 0) return nodeS[0] + (0 - u) * 0.6;
      if (u >= uAkhir) return sAkhir * Math.max(0, 1 - (u - uAkhir) / (1 - uAkhir));
      var q = u / du, a = Math.min(n - 2, Math.floor(q + 1e-9)), f = q - a;
      return nodeS[a] + (nodeS[a + 1] - nodeS[a]) * f;
    }
    function titik(u) {
      var a = ((u - uAkhir) * tot + fase) * Math.PI / 180, s = skala(u);
      var x = cx + s * rx * Math.cos(a), y = cy + Math.pow(s, 0.65) * ry * Math.sin(a);
      return { x: cermin ? 2 * cx - x : x, y: y };
    }
    function jalur(u0, u1) {
      var m = Math.max(4, Math.ceil((u1 - u0) * tot / 6)), p = [], d, q;
      for (q = 0; q <= m; q++) p.push(titik(u0 + (u1 - u0) * q / m));
      d = 'M' + r1(p[0].x) + ' ' + r1(p[0].y);
      for (q = 1; q < m; q++) {
        d += 'Q' + r1(p[q].x) + ' ' + r1(p[q].y) + ' ' + r1((p[q].x + p[q + 1].x) / 2) + ' ' + r1((p[q].y + p[q + 1].y) / 2);
      }
      return d + 'L' + r1(p[m].x) + ' ' + r1(p[m].y);
    }

    var pts = [], samp = [];
    for (i = 0; i < n; i++) pts.push(titik(nodeU[i]));
    var qm = Math.ceil(1.1 * tot / 5);
    for (i = 0; i <= qm; i++) samp.push(titik(-0.1 + 1.1 * i / qm));
    var goal = { x: cx, y: cy };

    var ruas = [{ d: jalur(-0.1, 0), dari: -1 }];
    for (i = 1; i < n; i++) ruas.push({ d: jalur(nodeU[i - 1], nodeU[i]), dari: i - 1 });
    ruas.push({ d: jalur(uAkhir, 1), dari: n - 1 });

    /* kotak-kotak terlarang */
    function rc(x0, y0, x1, y1) { return { x0: x0, y0: y0, x1: x1, y1: y1 }; }
    function tabrak(a, b, m) { return !(a.x1 + m <= b.x0 || a.x0 - m >= b.x1 || a.y1 + m <= b.y0 || a.y0 - m >= b.y1); }
    var cakram = [], bintang = [], penanda = [];
    pts.forEach(function (p) {
      cakram.push(rc(p.x - 38, p.y - 38, p.x + 38, p.y + 38));
      bintang.push(rc(p.x - 34, p.y + 40, p.x + 34, p.y + 64));
      penanda.push(rc(p.x - 34, p.y - 114, p.x + 34, p.y - 36));
    });
    var badanG = rc(cx - 58, cy - 76, cx + 58, cy + 56), penandaG = rc(cx - 34, cy - 160, cx + 34, cy - 80);
    var batas = rc(8, 4, W - 8, HT - 4);

    function nilai(r, pref, diri, terpasang) {
      var sk = pref, q;
      if (r.x0 < batas.x0 || r.x1 > batas.x1 || r.y0 < batas.y0 || r.y1 > batas.y1) sk += 1000;
      for (q = 0; q < n; q++) {
        if (tabrak(r, cakram[q], 3)) sk += 1000;
        if (q !== diri && tabrak(r, bintang[q], 3)) sk += 1000;
        if (tabrak(r, penanda[q], 0)) sk += 150;
      }
      if (tabrak(r, badanG, 3)) sk += 1000;
      if (tabrak(r, penandaG, 0)) sk += 150;
      for (q = 0; q < terpasang.length; q++) if (tabrak(r, terpasang[q], 4)) sk += 1000;
      for (q = 0; q < samp.length; q++) {
        if (samp[q].x > r.x0 - 4 && samp[q].x < r.x1 + 4 && samp[q].y > r.y0 - 4 && samp[q].y < r.y1 + 4) sk += 3;
      }
      return sk;
    }
    function pilihLabel(opsi, diri, terpasang) {
      var best = null, q, sk;
      for (q = 0; q < opsi.length; q++) {
        sk = nilai(opsi[q].r, opsi[q].pref, diri, terpasang);
        if (!best || sk < best.sk) { best = opsi[q]; best.sk = sk; }
      }
      return best;
    }

    var kotak = [], lab = [], skor = [];
    var og = [
      { sisi: 'bawah', pref: 0, cx: cx, top: cy + 60, lebar: lwG, r: rc(cx - lwG / 2, cy + 60, cx + lwG / 2, cy + 60 + HL) },
      { sisi: 'kanan', pref: 15, cx: cx + 62 + lwG / 2, top: cy, lebar: lwG, r: rc(cx + 62, cy - HL / 2, cx + 62 + lwG, cy + HL / 2) },
      { sisi: 'kiri', pref: 15, cx: cx - 62 - lwG / 2, top: cy, lebar: lwG, r: rc(cx - 62 - lwG, cy - HL / 2, cx - 62, cy + HL / 2) },
      { sisi: 'atas', pref: 60, cx: cx, top: cy - 84, lebar: lwG, r: rc(cx - lwG / 2, cy - 84 - HL, cx + lwG / 2, cy - 84) }
    ];
    var lg = pilihLabel(og, -1, kotak);
    kotak.push(lg.r);
    for (i = 0; i < n; i++) {
      var p = pts[i];
      var oo = [
        { sisi: 'bawah', pref: 0, cx: p.x, top: p.y + 66, lebar: lw, r: rc(p.x - lw / 2, p.y + 66, p.x + lw / 2, p.y + 66 + HL) },
        { sisi: 'kanan', pref: 12, cx: p.x + 44 + lw / 2, top: p.y, lebar: lw, r: rc(p.x + 44, p.y - HL / 2, p.x + 44 + lw, p.y + HL / 2) },
        { sisi: 'kiri', pref: 12, cx: p.x - 44 - lw / 2, top: p.y, lebar: lw, r: rc(p.x - 44 - lw, p.y - HL / 2, p.x - 44, p.y + HL / 2) },
        { sisi: 'atas', pref: 60, cx: p.x, top: p.y - 42, lebar: lw, r: rc(p.x - lw / 2, p.y - 42 - HL, p.x + lw / 2, p.y - 42) }
      ];
      var lb = pilihLabel(oo, i, kotak);
      lab.push(lb); skor.push(lb.sk); kotak.push(lb.r);
    }

    var denda = 0;
    for (i = 0; i < n; i++) {
      if (tabrak(cakram[i], badanG, 6) || tabrak(bintang[i], badanG, 4)) denda += 1000;
      for (j = i + 1; j < n; j++) {
        if (tabrak(cakram[i], cakram[j], 10) || tabrak(cakram[i], bintang[j], 4) || tabrak(bintang[i], cakram[j], 4)) denda += 1000;
      }
    }
    var jumlah = denda + lg.sk;
    for (i = 0; i < n; i++) jumlah += skor[i];

    return {
      jumlah: jumlah, fase: fase,
      cx: cx, cy: cy, pts: pts, goal: goal, ruas: ruas, samp: samp, lab: lab, labG: lg,
      kotak: kotak, cakram: cakram, bintang: bintang, badanG: badanG, skor: skor, rc: rc, tabrak: tabrak
    };
  }

  /* putar spiral ke beberapa fase, ambil tata letak dengan label dan simpul paling lega */
  function tataPusaran(W, HT, n, cermin) {
    var fases = [0, -30, 30, -60, 60, 90, -90, 180, 150, -150, 120, -120], sins = [0.5, 0.56, 0.62];
    var best = null, q, z, t;
    for (z = 0; z < sins.length; z++) {
      for (q = 0; q < fases.length; q++) {
        t = tata1(W, HT, n, cermin, fases[q], sins[z]);
        if (!best || t.jumlah < best.jumlah - 0.5) best = t;
      }
    }
    return best;
  }

  function gambarPusaran(k) {
    var S = keadaan(k), A = S.A, D = S.D, W = S.W, HT = S.HT, n = S.n;
    var bt = S.bt, buka = S.buka, aktif = S.aktif, semua = S.semua, tot = S.tot, maks = S.maks;
    var rnd = A.acakBenih(A.hashTeks(D.judul || 'pusaran'));
    var cermin = rnd() < 0.5;
    var i, j, q;

    if (k.css) k.css('kit-peta-pusaran', CSS_PS);

    var T = tataPusaran(W, HT, n, cermin);
    var cx = T.cx, cy = T.cy, pts = T.pts;

    /* ── hiasan: gelembung dan rumput laut, menjauh dari label dan simpul ── */
    var larang = T.kotak.concat(T.cakram, T.bintang, [T.badanG]);
    function bebas(bx, jarakJalur) {
      var r;
      for (r = 0; r < larang.length; r++) if (T.tabrak(bx, larang[r], 8)) return false;
      for (r = 0; r < T.samp.length; r++) {
        if (T.samp[r].x > bx.x0 - jarakJalur && T.samp[r].x < bx.x1 + jarakJalur &&
            T.samp[r].y > bx.y0 - jarakJalur && T.samp[r].y < bx.y1 + jarakJalur) return false;
      }
      return true;
    }
    var gel = [], coba = 0;
    while (gel.length < 12 && coba++ < 500) {
      var gx = 24 + rnd() * (W - 48), gy = 60 + rnd() * (HT - 90), gr = 3 + rnd() * 4, gd = rnd() * 6, gl = 4.5 + rnd() * 3;
      if (bebas(T.rc(gx - gr - 2, gy - gr - 38, gx + gr + 2, gy + gr + 10), 6)) gel.push({ x: gx, y: gy, r: gr, d: gd, l: gl });
    }
    var rum = [];
    coba = 0;
    while (rum.length < 3 && coba++ < 300) {
      var rxx = 30 + rnd() * (W - 60), rh = 62 + rnd() * 30, rd = rnd() * 5;
      if (bebas(T.rc(rxx - 26, HT - rh - 6, rxx + 26, HT), 10)) rum.push({ x: rxx, h: rh, d: rd });
    }

    /* ── SVG ── */
    var g = '<defs>' +
      '<linearGradient id="kps-a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E6EA8"/><stop offset="1" stop-color="#05243F"/></linearGradient>' +
      '<radialGradient id="kps-t"><stop offset="0" stop-color="#8FE0FF" stop-opacity=".42"/><stop offset="1" stop-color="#8FE0FF" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="kps-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="kps-h"><stop offset="0" style="stop-color:var(--aksen)" stop-opacity=".5"/><stop offset="1" style="stop-color:var(--aksen)" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="kps-n" cx=".35" cy=".3" r=".85"><stop offset="0" style="stop-color:var(--c1)"/><stop offset="1" style="stop-color:var(--c2)"/></radialGradient>' +
      '<radialGradient id="kps-p" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#CFE3F5"/></radialGradient>' +
      '</defs>';
    g += '<rect x="0" y="0" width="' + W + '" height="' + HT + '" fill="url(#kps-a)"/>';
    g += '<circle cx="' + r1(cx) + '" cy="' + cy + '" r="' + r1(Math.min(W * 0.42, 420)) + '" fill="url(#kps-t)"/>';

    /* berkas cahaya dari permukaan */
    for (i = 0; i < 3; i++) {
      var sx = W * (0.2 + 0.3 * i) + (rnd() - 0.5) * 60;
      g += '<polygon class="k-ps-kedip" style="animation-delay:-' + r1(i * 2) + 's" points="' + r1(sx - 24) + ',0 ' + r1(sx + 24) + ',0 ' + r1(sx + 120) + ',' + HT + ' ' + r1(sx - 40) + ',' + HT + '" fill="url(#kps-s)" opacity=".5"/>';
    }

    /* cincin arus berputar pelan di sekeliling pusat */
    g += '<circle class="k-ps-arus" cx="' + r1(cx) + '" cy="' + cy + '" r="88" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="3 14" stroke-linecap="round" opacity=".28"/>' +
      '<circle class="k-ps-arus2" cx="' + r1(cx) + '" cy="' + cy + '" r="150" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="26 40" stroke-linecap="round" opacity=".14"/>' +
      '<circle class="k-ps-arus" cx="' + r1(cx) + '" cy="' + cy + '" r="212" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="4 22" stroke-linecap="round" opacity=".16"/>';

    rum.forEach(function (r) {
      var x = r1(r.x), y = HT, h = r.h;
      g += '<g class="k-ps-rumput" style="animation-delay:-' + r1(r.d) + 's">' +
        '<path d="M' + (x - 10) + ' ' + y + 'C' + (x - 22) + ' ' + r1(y - h * 0.4) + ' ' + (x + 2) + ' ' + r1(y - h * 0.7) + ' ' + (x - 8) + ' ' + r1(y - h * 0.9) + '" fill="none" stroke="#2C9C6A" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="M' + x + ' ' + y + 'C' + (x + 12) + ' ' + r1(y - h * 0.4) + ' ' + (x - 6) + ' ' + r1(y - h * 0.75) + ' ' + (x + 6) + ' ' + r1(y - h) + '" fill="none" stroke="#3DB880" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="M' + (x + 10) + ' ' + y + 'C' + (x + 20) + ' ' + r1(y - h * 0.3) + ' ' + (x + 14) + ' ' + r1(y - h * 0.5) + ' ' + (x + 22) + ' ' + r1(y - h * 0.65) + '" fill="none" stroke="#2C9C6A" stroke-width="6" stroke-linecap="round"/></g>';
    });
    gel.forEach(function (b) {
      g += '<g class="k-ps-naik" style="animation-delay:-' + r1(b.d) + 's;animation-duration:' + r1(b.l) + 's">' +
        '<circle cx="' + r1(b.x) + '" cy="' + r1(b.y) + '" r="' + r1(b.r) + '" fill="rgba(255,255,255,.12)" stroke="#fff" stroke-width="1.5" opacity=".8"/>' +
        '<circle cx="' + r1(b.x - b.r * 0.35) + '" cy="' + r1(b.y - b.r * 0.35) + '" r="' + r1(b.r * 0.28) + '" fill="#fff"/></g>';
    });

    /* arus: jalur spiral. Terbuka menyala, terkunci putus-putus */
    T.ruas.forEach(function (s, idx) {
      var nyala = idx === 0 ? true : (idx === n ? semua : buka(idx));
      var lewat = idx > 0 && bt(idx - 1) > 0;
      if (nyala) {
        g += '<path d="' + s.d + '" fill="none" stroke-width="16" stroke-linecap="round" style="stroke:var(--aksen)" opacity=".2"/>' +
          '<path d="' + s.d + '" fill="none" stroke-width="5" stroke-linecap="round" style="stroke:var(--aksen)"/>';
        if (lewat || idx === 0) g += '<path d="' + s.d + '" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="2 9" opacity=".9"/>';
      } else {
        g += '<path d="' + s.d + '" fill="none" stroke="rgba(255,255,255,.34)" stroke-width="2" stroke-dasharray="3 8" stroke-linecap="round"/>';
      }
    });

    /* simpul level: cangkang bergerigi */
    function simpulSvg(p, idx) {
      var b = buka(idx), st = bt(idx), x = r1(p.x), y = r1(p.y);
      var isi = b ? 'url(#kps-n)' : '#4F5E72', tepi = b ? 'var(--kertas)' : '#9AA5B4', h, a, q2;
      h = '<g class="k-ps-titik' + (b ? '' : ' kunci') + '" data-i="' + idx + '" role="button" tabindex="0">';
      if (b) h += '<circle cx="' + x + '" cy="' + y + '" r="58" fill="url(#kps-h)"/>';
      if (idx === aktif) h += '<circle class="k-ps-cincin" cx="' + x + '" cy="' + y + '" r="40" fill="none" style="stroke:var(--aksen)" stroke-width="3.5"/>';
      h += '<g class="k-ps-bulat' + (idx === aktif ? ' k-ps-aktif' : '') + '">';
      for (q2 = 0; q2 < 10; q2++) {
        a = q2 * Math.PI / 5;
        h += '<circle cx="' + r1(p.x + 31 * Math.cos(a)) + '" cy="' + r1(p.y + 31 * Math.sin(a)) + '" r="6.4" style="fill:' + tepi + '"/>';
      }
      h += '<circle cx="' + x + '" cy="' + y + '" r="29" style="fill:' + isi + ';stroke:' + tepi + '" stroke-width="3"/>';
      for (q2 = 0; q2 < 8; q2++) {
        a = q2 * Math.PI / 4 + Math.PI / 8;
        h += '<path d="M' + r1(p.x + 20 * Math.cos(a)) + ' ' + r1(p.y + 20 * Math.sin(a)) + 'L' + r1(p.x + 26 * Math.cos(a)) + ' ' + r1(p.y + 26 * Math.sin(a)) + '" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".3"/>';
      }
      h += '<ellipse cx="' + r1(p.x - 10) + '" cy="' + r1(p.y - 14) + '" rx="10" ry="5" fill="#fff" opacity=".4"/>' +
        '<text x="' + x + '" y="' + r1(p.y + 10) + '" text-anchor="middle" font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700" font-size="30" ' +
        'style="fill:' + (b ? 'var(--lip)' : '#D5DBE3') + ';stroke:' + (b ? 'rgba(255,255,255,.6)' : 'none') + ';stroke-width:3;paint-order:stroke">' + (idx + 1) + '</text></g>';
      if (b) h += A.svgBintang(p.x - 24, p.y + 50, 9, st >= 1) + A.svgBintang(p.x, p.y + 55, 10, st >= 2) + A.svgBintang(p.x + 24, p.y + 50, 9, st >= 3);
      else h += A.svgGembok(p.x + 33, p.y - 27);
      h += '<circle cx="' + x + '" cy="' + r1(p.y + 6) + '" r="46" fill="transparent"/></g>';
      return h;
    }
    pts.forEach(function (p, idx) { g += simpulSvg(p, idx); });

    /* tujuan akhir: kerang besar berisi mutiara */
    var lurus = function (x1, y1, x2, y2, o) {
      return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="' + o + '"/>';
    };
    g += '<g class="k-ps-peti' + (semua ? ' buka' : '') + '" role="button" tabindex="0">';
    if (semua) {
      g += '<circle cx="' + r1(cx) + '" cy="' + cy + '" r="112" fill="url(#kps-h)"/><g class="k-ps-sinar">';
      for (i = 0; i < 12; i++) {
        g += '<path d="M' + r1(cx) + ' ' + cy + 'L' + r1(cx - 8) + ' ' + (cy - 100) + 'L' + r1(cx + 8) + ' ' + (cy - 100) + 'Z" transform="rotate(' + (i * 30) + ' ' + r1(cx) + ' ' + cy + ')" style="fill:var(--aksen)" opacity=".28"/>';
      }
      g += '</g>';
    }
    g += '<g transform="translate(' + r1(cx) + ' ' + cy + ')">' +
      '<ellipse cx="0" cy="56" rx="54" ry="8" fill="rgba(0,0,0,.28)"/>' +
      '<path d="M-50 4C-50 40-22 54 0 54C22 54 50 40 50 4Z" style="fill:var(--c2);stroke:var(--kertas)" stroke-width="3" stroke-linejoin="round"/>';
    for (q = -3; q <= 3; q++) g += lurus(0, 50, q * 15, 8, 0.32);
    if (semua) {
      g += '<g transform="translate(0 -26) rotate(-5 0 4)"><path d="M-46 4C-46-32-22-46 0-46C22-46 46-32 46 4Z" style="fill:var(--c1);stroke:var(--kertas)" stroke-width="3" stroke-linejoin="round"/>';
      for (q = -3; q <= 3; q++) g += lurus(0, -42, q * 14, 0, 0.32);
      g += '</g>' +
        '<circle class="k-ps-nafas" cx="0" cy="-8" r="30" fill="#fff" opacity=".35"/>' +
        '<circle cx="0" cy="-8" r="17" fill="url(#kps-p)" stroke="rgba(255,255,255,.85)" stroke-width="2"/>' +
        '<ellipse cx="-6" cy="-14" rx="5" ry="3" fill="#fff"/>';
    } else {
      g += '<path d="M-50 4C-50-36-22-50 0-50C22-50 50-36 50 4Z" style="fill:#5E6A7A;stroke:#9AA5B4" stroke-width="3" stroke-linejoin="round"/>';
      for (q = -3; q <= 3; q++) g += lurus(0, -46, q * 15, 0, 0.2);
    }
    g += '</g>';
    if (!semua) g += A.svgGembok(r1(cx), cy + 4);
    g += '<circle cx="' + r1(cx) + '" cy="' + cy + '" r="70" fill="transparent"/></g>';

    var wadah = A.el('div', 'k-ps');
    wadah.style.height = HT + 'px';
    wadah.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + HT + '" preserveAspectRatio="none">' + g + '</svg>';

    /* label */
    function pasangLabel(lb, jd, kecil, kunci) {
      var kelas = 'k-ps-label' + (lb.sisi === 'bawah' ? '' : lb.sisi === 'atas' ? ' atas' : ' tengah ' + lb.sisi);
      wadah.appendChild(buatLabel(A, kelas, lb.cx, lb.top, lb.lebar, jd, kecil, kunci));
    }
    pts.forEach(function (p, idx) {
      var judul = (k.judulLevel ? k.judulLevel(idx) : '') || ('Level ' + (idx + 1));
      pasangLabel(T.lab[idx], A.fmt(judul), A.esc(k.namaMesin ? k.namaMesin(idx) : ''), !buka(idx));
    });
    pasangLabel(T.labG,
      '<svg width="20" height="20" viewBox="0 0 20 20">' + A.svgBintang(10, 11, 9, true) + '</svg>' + tot + ' / ' + maks,
      semua ? 'Ketuk mutiara besar!' : 'Selesaikan semua level', false);

    /* sentuhan */
    Array.prototype.forEach.call(wadah.querySelectorAll('.k-ps-titik'), function (t) {
      var idx = +t.getAttribute('data-i');
      var jd = (k.judulLevel ? k.judulLevel(idx) : '') || '';
      t.setAttribute('aria-label', 'Level ' + (idx + 1) + (jd ? ': ' + jd : '') + (buka(idx) ? '' : ' (terkunci)'));
      pasangKlik(t, function () { k.pilih(idx, t); });
    });
    var pt = wadah.querySelector('.k-ps-peti');
    if (pt) {
      pt.setAttribute('aria-label', 'Tujuan akhir: mutiara besar' + (semua ? '' : ' (terkunci)'));
      pasangKlik(pt, function () { k.akhir(pt); });
    }

    k.w.appendChild(wadah);

    /* penanda: di atas simpul aktif, atau di atas kerang bila semua selesai */
    var pos = pts.map(function (p) { return { x: r1(p.x), y: r1(p.y - 38) }; });
    pos.push({ x: r1(cx), y: r1(cy - 80) });
    k.penanda(wadah, pos);
  }

  /* ══════════════ gaya "dahan" ══════════════ */

  var CSS_DH = [
    '.k-dh{position:absolute;left:0;right:0;top:58px}',
    '.k-dh>svg{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible}',
    '.k-dh-titik{cursor:pointer;outline:none}',
    '.k-dh-titik.kunci{cursor:not-allowed}',
    '.k-dh-titik:not(.kunci):hover .k-dh-bulat{filter:brightness(1.08)}',
    '.k-dh-titik:focus-visible .k-dh-bulat{filter:drop-shadow(0 0 6px #fff)}',
    '.k-dh-peti{cursor:pointer;outline:none}',
    '.k-dh-peti:focus-visible .k-dh-telur{filter:drop-shadow(0 0 6px #fff)}',
    '.k-dh-titik,.k-dh-peti,.k-dh-bulat,.k-dh-cincin,.k-dh-sinar,.k-dh-telur,.k-dh-goyang,.k-dh-kedip,.k-dh-jatuh{transform-box:fill-box;transform-origin:center}',
    '.k-dh-aktif{animation:kDhDenyut 1.6s ease-in-out infinite}',
    '@keyframes kDhDenyut{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}',
    '.k-dh-cincin{animation:kDhCincin 1.8s ease-out infinite}',
    '@keyframes kDhCincin{0%{transform:scale(1);opacity:.9}100%{transform:scale(1.7);opacity:0}}',
    '.k-dh-peti.buka .k-dh-telur{animation:kDhDenyut 1.6s ease-in-out infinite}',
    '.k-dh-sinar{animation:kDhPutar 9s linear infinite}',
    '@keyframes kDhPutar{to{transform:rotate(360deg)}}',
    '.k-dh-goyang{animation:kDhGoyang 5s ease-in-out infinite}',
    '@keyframes kDhGoyang{0%,100%{transform:rotate(-1.6deg)}50%{transform:rotate(1.6deg)}}',
    '.k-dh-kedip{animation:kDhKedip 3.2s ease-in-out infinite}',
    '@keyframes kDhKedip{0%,100%{opacity:.2}50%{opacity:1}}',
    '.k-dh-jatuh{animation:kDhJatuh 7s ease-in-out infinite}',
    '@keyframes kDhJatuh{0%{transform:translate(0,0) rotate(0deg);opacity:0}12%{opacity:.9}',
    '50%{transform:translate(14px,24px) rotate(80deg)}88%{opacity:.9}',
    '100%{transform:translate(-4px,52px) rotate(170deg);opacity:0}}',
    '.k-dh-label{position:absolute;color:#fff;pointer-events:none;',
    'text-shadow:0 2px 0 rgba(var(--gelap),.95),0 0 10px rgba(var(--gelap),.85)}',
    '.k-dh-label.kr{text-align:right}',
    '.k-dh-label.kn{text-align:left}',
    '.k-dh-label .jd{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;',
    'font-family:Fredoka,sans-serif;font-weight:600;font-size:18px;line-height:1.12;word-break:break-word}',
    '.k-dh-label small{display:block;font-weight:800;font-size:14px;opacity:.88;margin-top:3px;letter-spacing:.3px;',
    'white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.k-dh-label.kunci{opacity:.72}',
    '.k-dh-label svg{vertical-align:-3px;margin-right:4px}',
    '@media (prefers-reduced-motion:reduce){.k-dh *{animation:none!important}}'
  ].join('');

  function gambarDahan(k) {
    var S = keadaan(k), A = S.A, D = S.D, W = S.W, HT = S.HT, n = S.n;
    var bt = S.bt, buka = S.buka, aktif = S.aktif, semua = S.semua, tot = S.tot, maks = S.maks;
    var rnd = A.acakBenih(A.hashTeks(D.judul || 'dahan'));
    var i, j, u, v;

    if (k.css) k.css('kit-peta-dahan', CSS_DH);

    /* ── tata letak: batang di tengah, ranting kiri-kanan bergantian, level 1 di pangkal ── */
    var xc = r1(W / 2);
    var bx = r1(Math.max(136, Math.min(200, W * 0.155)));
    var lw = 168, lwM = 180;
    var arah = rnd() < 0.5 ? 1 : -1;
    var atas = 88, yb = HT - 70, R = yb - atas, gapAtas = 40;
    var dy = n > 1 ? Math.min(96, (R - gapAtas) / (n - 1)) : 0;
    var total = (n - 1) * dy + gapAtas;
    var yc = r1(atas + (R - total) / 2);
    var ty = r1(yc + 30);
    var pts = [], cab = [];
    for (i = 0; i < n; i++) {
      var sd = arah * (i % 2 ? -1 : 1);
      var py = r1(yc + gapAtas + (n - 1 - i) * dy);
      var px = r1(xc + sd * bx);
      pts.push({ x: px, y: py, s: sd });
      cab.push({
        sx: xc, sy: r1(py + 60),
        qx: r1(xc + sd * bx * 0.55), qy: r1(py + 58),
        ex: r1(px - sd * 34), ey: r1(py + 14)
      });
    }
    var lado = -pts[n - 1].s;   /* label sarang di sisi yang berlawanan dengan level teratas */
    var hi = -1;
    for (i = 0; i < n; i++) if (buka(i)) hi = i;
    var yVein = semua ? ty : (hi >= 0 ? cab[hi].sy : HT - 8);

    /* ── area terlarang untuk hiasan ── */
    var rects = [{ x0: xc - 44, x1: xc + 44, y0: 0, y1: HT }];
    pts.forEach(function (p) {
      rects.push({ x0: p.x - 52, x1: p.x + 52, y0: p.y - 104, y1: p.y + 44 });
      rects.push(p.s < 0
        ? { x0: p.x - 46 - lw - 6, x1: p.x - 40, y0: p.y - 36, y1: p.y + 38 }
        : { x0: p.x + 40, x1: p.x + 46 + lw + 6, y0: p.y - 36, y1: p.y + 38 });
    });
    rects.push({ x0: xc - 100, x1: xc + 100, y0: yc - 104, y1: yc + 60 });
    rects.push(lado < 0
      ? { x0: xc - 72 - lwM - 6, x1: xc - 60, y0: yc - 78, y1: yc }
      : { x0: xc + 60, x1: xc + 72 + lwM + 6, y0: yc - 78, y1: yc });
    var contoh = [];
    cab.forEach(function (c) {
      for (var t = 0; t <= 12; t++) {
        var uu = t / 12, vv = 1 - uu;
        contoh.push({
          x: vv * vv * c.sx + 2 * vv * uu * c.qx + uu * uu * c.ex,
          y: vv * vv * c.sy + 2 * vv * uu * c.qy + uu * uu * c.ey
        });
      }
    });
    function dalamRect(x, y, m) {
      for (var r = 0; r < rects.length; r++) {
        if (x > rects[r].x0 - m && x < rects[r].x1 + m && y > rects[r].y0 - m && y < rects[r].y1 + m) return true;
      }
      return false;
    }

    /* ── hiasan hutan ── */
    var JENIS = {
      awan: { b: [-48, 48, -26, 22], kelas: '' },
      kunang: { b: [-12, 12, -12, 12], kelas: 'k-dh-kedip' },
      semak: { b: [-32, 32, -24, 12], kelas: '' },
      batu: { b: [-26, 26, -14, 18], kelas: '' },
      jatuh: { b: [-14, 14, -14, 58], kelas: 'k-dh-jatuh' }
    };
    function isiHias(jenis) {
      var lip = 'style="stroke:var(--lip)"';
      if (jenis === 'awan') return A.svgHiasan('awan', 0, 0, 1);
      if (jenis === 'batu') return A.svgHiasan('batu', 0, 0, 1);
      if (jenis === 'kunang') return '<circle cx="0" cy="0" r="11" fill="url(#kdh-h)"/><circle cx="0" cy="0" r="2.8" style="fill:var(--aksen)"/>';
      if (jenis === 'jatuh') return '<path d="M-9 4C-10-6-2-11 10-9C10 1 4 9-3 9C-6 9-8 7-9 4Z" style="fill:var(--c1);stroke:var(--lip)" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="M-7 6C-2 1 3-3 8-7" fill="none" ' + lip + ' stroke-width="1.4" stroke-linecap="round" opacity=".5"/>';
      return '<ellipse cx="0" cy="10" rx="30" ry="5" fill="rgba(0,0,0,.2)"/>' +
        '<circle cx="-14" cy="0" r="12" fill="#4E9F3D" ' + lip + ' stroke-width="2.2"/>' +
        '<circle cx="6" cy="-7" r="15" fill="#4E9F3D" ' + lip + ' stroke-width="2.2"/>' +
        '<circle cx="20" cy="2" r="11" fill="#4E9F3D" ' + lip + ' stroke-width="2.2"/>' +
        '<circle cx="1" cy="-12" r="6" fill="#7CC456" opacity=".9"/>';
    }
    var hias = [], jumlah = { awan: 0, kunang: 0, semak: 0, batu: 0, jatuh: 0 };
    var batas = { awan: 2, kunang: 8, semak: 2, batu: 2, jatuh: 2 };
    var urut = ['kunang', 'awan', 'kunang', 'semak', 'kunang', 'jatuh', 'batu', 'kunang'];
    function bentrok(bb) {
      var r, c, m = 6;
      for (r = 0; r < rects.length; r++) {
        if (!(bb.x1 + m < rects[r].x0 || bb.x0 - m > rects[r].x1 || bb.y1 + m < rects[r].y0 || bb.y0 - m > rects[r].y1)) return true;
      }
      for (c = 0; c < contoh.length; c++) {
        if (contoh[c].x > bb.x0 - 24 && contoh[c].x < bb.x1 + 24 && contoh[c].y > bb.y0 - 24 && contoh[c].y < bb.y1 + 24) return true;
      }
      for (c = 0; c < hias.length; c++) {
        var o = hias[c].bb;
        if (!(bb.x1 + 8 < o.x0 || bb.x0 - 8 > o.x1 || bb.y1 + 8 < o.y0 || bb.y0 - 8 > o.y1)) return true;
      }
      return false;
    }
    var coba = 0;
    while (hias.length < 16 && coba++ < 700) {
      var jenis = urut[Math.floor(rnd() * urut.length)];
      var sk = 0.85 + rnd() * 0.3;
      var hx = 40 + rnd() * (W - 80), hy;
      var dl = rnd() * 4;
      if (jenis === 'awan') hy = 34 + rnd() * 70;
      else if (jenis === 'semak' || jenis === 'batu') hy = HT - 30 - rnd() * 8;
      else if (jenis === 'jatuh') hy = 40 + rnd() * 170;
      else hy = 40 + rnd() * (HT - 130);
      if (jumlah[jenis] >= batas[jenis]) continue;
      var b = JENIS[jenis].b;
      var bb = { x0: hx + b[0] * sk, x1: hx + b[1] * sk, y0: hy + b[2] * sk, y1: hy + b[3] * sk };
      if (bb.x0 < 6 || bb.x1 > W - 6 || bb.y0 < 6 || bb.y1 > HT - 4) continue;
      if (bentrok(bb)) continue;
      hias.push({ j: jenis, x: hx, y: hy, s: sk, bb: bb, dl: dl });
      jumlah[jenis]++;
    }
    hias.sort(function (p, q) { return p.y - q.y; });

    /* ── SVG ── */
    var g = '<defs>' +
      '<linearGradient id="kdh-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--c1)"/><stop offset="1" style="stop-color:var(--c2)"/></linearGradient>' +
      '<linearGradient id="kdh-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="kdh-h"><stop offset="0" style="stop-color:var(--aksen)" stop-opacity=".5"/><stop offset="1" style="stop-color:var(--aksen)" stop-opacity="0"/></radialGradient>' +
      '</defs>';
    g += '<rect x="0" y="0" width="' + W + '" height="' + HT + '" fill="url(#kdh-w)"/>';
    g += '<circle cx="' + xc + '" cy="' + yc + '" r="150" fill="url(#kdh-h)" opacity=".55"/>';

    /* tanah dan rumput */
    var gy = HT - 36;
    var atasTanah = 'M0 ' + r1(gy + 4) + 'Q' + r1(W * 0.18) + ' ' + r1(gy - 10) + ' ' + r1(W * 0.38) + ' ' + r1(gy + 2) +
      'T' + r1(W * 0.7) + ' ' + r1(gy - 2) + 'T' + W + ' ' + r1(gy);
    g += '<path d="' + atasTanah + 'V' + HT + 'H0Z" fill="rgba(70,45,20,.4)"/>' +
      '<path d="' + atasTanah + '" fill="none" stroke="#5FAE45" stroke-width="4" stroke-linecap="round" opacity=".75"/>';
    var rm = '';
    for (var gx = 16; gx < W - 10;) {
      var rt = 7 + rnd() * 9;
      if (!dalamRect(gx, gy - 6, 4)) {
        rm += 'M' + r1(gx) + ' ' + r1(gy + 2) + 'q-2-' + r1(rt * 0.6) + '-6-' + r1(rt) +
          'M' + r1(gx) + ' ' + r1(gy + 2) + 'q1-' + r1(rt * 0.8) + ' 2-' + r1(rt * 1.3) +
          'M' + r1(gx) + ' ' + r1(gy + 2) + 'q3-' + r1(rt * 0.6) + ' 7-' + r1(rt * 0.9);
      }
      gx += 28 + rnd() * 16;
    }
    g += '<path d="' + rm + '" fill="none" stroke="#5FAE45" stroke-width="2.6" stroke-linecap="round" opacity=".8"/>';

    hias.forEach(function (h) {
      g += '<g transform="translate(' + r1(h.x) + ' ' + r1(h.y) + ') scale(' + r1(h.s) + ')">' +
        '<g' + (JENIS[h.j].kelas ? ' class="' + JENIS[h.j].kelas + '" style="animation-delay:-' + r1(h.dl) + 's"' : '') + '>' +
        isiHias(h.j) + '</g></g>';
    });

    /* batang */
    g += '<path d="M' + (xc - 34) + ' ' + HT + 'C' + (xc - 14) + ' ' + (HT - 70) + ' ' + (xc - 13) + ' ' + r1(ty + 80) + ' ' + (xc - 11) + ' ' + ty +
      'L' + (xc + 11) + ' ' + ty + 'C' + (xc + 13) + ' ' + r1(ty + 80) + ' ' + (xc + 14) + ' ' + (HT - 70) + ' ' + (xc + 34) + ' ' + HT +
      'Z" fill="#8A5A2B" style="stroke:var(--lip)" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M' + (xc - 6) + ' ' + (HT - 26) + 'q-3-30 0-60M' + (xc + 5) + ' ' + (HT - 40) + 'q3-26 0-52M' + (xc - 3) + ' ' + (HT - 150) + 'q-2-20 0-44" ' +
      'fill="none" stroke="rgba(0,0,0,.22)" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M' + (xc + 8) + ' ' + (HT - 22) + 'q2-40 0-90" fill="none" stroke="#B98350" stroke-width="3" stroke-linecap="round" opacity=".55"/>';
    var dv = 'M' + xc + ' ' + (HT - 8) + 'L' + xc + ' ' + r1(yVein);
    g += '<path d="' + dv + '" fill="none" style="stroke:var(--aksen)" stroke-width="8" stroke-linecap="round" opacity=".22"/>' +
      '<path d="' + dv + '" fill="none" style="stroke:var(--aksen)" stroke-width="3" stroke-dasharray="9 8" stroke-linecap="round"/>';

    /* ranting: terbuka = kayu dengan getah menyala, terkunci = garis putus-putus */
    cab.forEach(function (c, idx) {
      var d = 'M' + c.sx + ' ' + c.sy + 'Q' + c.qx + ' ' + c.qy + ' ' + c.ex + ' ' + c.ey;
      if (buka(idx)) {
        g += '<path d="' + d + '" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="17" stroke-linecap="round" transform="translate(0 4)"/>' +
          '<path d="' + d + '" fill="none" style="stroke:var(--lip)" stroke-width="16" stroke-linecap="round"/>' +
          '<path d="' + d + '" fill="none" stroke="#9B6A35" stroke-width="11" stroke-linecap="round"/>' +
          '<path d="' + d + '" fill="none" stroke="#B98350" stroke-width="3" stroke-linecap="round" transform="translate(0 -2.5)" opacity=".7"/>' +
          '<path d="' + d + '" fill="none" style="stroke:var(--aksen)" stroke-width="7" stroke-linecap="round" opacity=".2"/>' +
          '<path d="' + d + '" fill="none" style="stroke:var(--aksen)" stroke-width="3" stroke-dasharray="9 8" stroke-linecap="round"/>';
        if (bt(idx) > 0) g += '<path d="' + d + '" fill="none" stroke="#fff" stroke-width="1.4" stroke-dasharray="9 8" stroke-linecap="round" opacity=".9"/>';
      } else {
        g += '<path d="' + d + '" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="5" stroke-dasharray="2 11" stroke-linecap="round"/>';
      }
    });

    /* daun level */
    var DAUN = 'M-34 14C-38-14-14-32 36-28C40 6 14 30-12 28C-24 27-32 22-34 14Z';
    function daunSvg(p, idx) {
      var b = buka(idx), st = bt(idx), x = p.x, y = p.y;
      var tepi = b ? 'var(--lip)' : '#5E6770';
      var isi = b ? 'url(#kdh-g)' : '#AEB6BE';
      var h = '<g class="k-dh-titik' + (b ? '' : ' kunci') + '" data-i="' + idx + '" role="button" tabindex="0">';
      if (idx === aktif) h += '<ellipse class="k-dh-cincin" cx="' + x + '" cy="' + y + '" rx="42" ry="36" fill="none" style="stroke:var(--aksen)" stroke-width="4"/>';
      h += '<g class="k-dh-bulat' + (idx === aktif ? ' k-dh-aktif' : '') + '">' +
        '<g transform="translate(' + x + ' ' + y + ') scale(' + p.s + ' 1)">' +
        '<path d="' + DAUN + '" transform="translate(0 5)" style="fill:' + tepi + '"/>' +
        '<path d="' + DAUN + '" style="fill:' + isi + ';stroke:' + tepi + '" stroke-width="3.5" stroke-linejoin="round"/>' +
        '<path d="M-30 18C-8 6 14-10 34-26" fill="none" style="stroke:' + tepi + '" stroke-width="2.5" stroke-linecap="round" opacity=".4"/>' +
        '<ellipse cx="-4" cy="-12" rx="12" ry="5" transform="rotate(-24 -4 -12)" fill="#fff" opacity=".42"/></g>' +
        '<text x="' + x + '" y="' + r1(y + 11) + '" text-anchor="middle" font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700" font-size="30" style="fill:' + tepi + '">' + (idx + 1) + '</text></g>';
      if (b) {
        /* level aktif yang belum punya bintang: kosong, di situ penanda mendarat */
        if (st > 0 || idx !== aktif) h += A.svgBintang(x - 26, y - 50, 10, st >= 1) + A.svgBintang(x, y - 56, 11, st >= 2) + A.svgBintang(x + 26, y - 50, 10, st >= 3);
      } else h += A.svgGembok(x, y - 44);
      h += '<circle cx="' + x + '" cy="' + y + '" r="48" fill="transparent"/></g>';
      return h;
    }
    pts.forEach(function (p, idx) { g += daunSvg(p, idx); });

    /* mahkota: sarang berisi telur emas */
    var cx = xc, cy = yc;
    g += '<g class="k-dh-peti' + (semua ? ' buka' : '') + '" role="button" tabindex="0">';
    if (semua) {
      g += '<circle cx="' + cx + '" cy="' + cy + '" r="96" fill="url(#kdh-h)"/><g class="k-dh-sinar">';
      for (i = 0; i < 12; i++) {
        g += '<path d="M' + cx + ' ' + cy + 'L' + (cx - 7) + ' ' + (cy - 74) + 'L' + (cx + 7) + ' ' + (cy - 74) + 'Z" transform="rotate(' + (i * 30) + ' ' + cx + ' ' + cy + ')" style="fill:var(--aksen)" opacity=".38"/>';
      }
      g += '</g>';
    }
    var kan = [[-40, 4, 22], [40, 4, 22], [-22, -18, 24], [22, -18, 24], [0, -30, 22]];
    g += '<g class="k-dh-goyang">';
    kan.forEach(function (c) {
      g += '<circle cx="' + (cx + c[0]) + '" cy="' + (cy + c[1]) + '" r="' + c[2] + '" style="fill:var(--c2);stroke:var(--lip)" stroke-width="2.5"/>';
    });
    kan.forEach(function (c) {
      g += '<circle cx="' + (cx + c[0] - 5) + '" cy="' + (cy + c[1] - 6) + '" r="' + r1(c[2] * 0.4) + '" style="fill:var(--c1)" opacity=".85"/>';
    });
    g += '</g>';
    var telur = [[-16, -2, 10, 13], [3, -8, 11, 14], [20, -1, 9, 12]];
    g += '<g class="k-dh-telur">';
    telur.forEach(function (t) {
      g += '<ellipse cx="' + (cx + t[0]) + '" cy="' + (cy + t[1]) + '" rx="' + t[2] + '" ry="' + t[3] + '" style="' +
        (semua ? 'fill:var(--aksen);stroke:var(--lip)' : 'fill:#C9CFD6;stroke:#5E6770') + '" stroke-width="2"/>';
      if (semua) g += '<ellipse cx="' + (cx + t[0] - 3) + '" cy="' + (cy + t[1] - 5) + '" rx="3" ry="4.5" fill="#fff" opacity=".6"/>';
    });
    g += '</g>';
    g += '<path d="M' + (cx - 44) + ' ' + (cy + 2) + 'C' + (cx - 44) + ' ' + (cy + 30) + ' ' + (cx - 22) + ' ' + (cy + 38) + ' ' + cx + ' ' + (cy + 38) +
      'C' + (cx + 22) + ' ' + (cy + 38) + ' ' + (cx + 44) + ' ' + (cy + 30) + ' ' + (cx + 44) + ' ' + (cy + 2) +
      'C' + (cx + 26) + ' ' + (cy + 12) + ' ' + (cx - 26) + ' ' + (cy + 12) + ' ' + (cx - 44) + ' ' + (cy + 2) +
      'Z" fill="#A8723A" style="stroke:var(--lip)" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M' + (cx - 30) + ' ' + (cy + 17) + 'Q' + cx + ' ' + (cy + 23) + ' ' + (cx + 30) + ' ' + (cy + 15) +
      'M' + (cx - 20) + ' ' + (cy + 28) + 'Q' + cx + ' ' + (cy + 32) + ' ' + (cx + 22) + ' ' + (cy + 27) +
      '" fill="none" stroke="#7A4E22" stroke-width="2.5" stroke-linecap="round"/>';
    if (!semua) g += A.svgGembok(cx, cy + 14);
    g += '<circle cx="' + cx + '" cy="' + (cy - 4) + '" r="64" fill="transparent"/></g>';

    var wadah = A.el('div', 'k-dh');
    wadah.style.height = HT + 'px';
    wadah.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + HT + '" preserveAspectRatio="none">' + g + '</svg>';

    /* label */
    function labelDh(kiri, kiriX, top, lebar, jd, kecil, kunci) {
      var d = A.el('div', 'k-dh-label ' + (kiri ? 'kr' : 'kn') + (kunci ? ' kunci' : ''),
        '<span class="jd">' + jd + '</span><small>' + kecil + '</small>');
      d.style.left = r1(kiriX) + 'px';
      d.style.top = r1(top) + 'px';
      d.style.width = lebar + 'px';
      return d;
    }
    pts.forEach(function (p, idx) {
      var judul = (k.judulLevel ? k.judulLevel(idx) : '') || ('Level ' + (idx + 1));
      var kiri = p.s < 0;
      wadah.appendChild(labelDh(kiri, kiri ? p.x - 46 - lw : p.x + 46, p.y - 28, lw,
        A.fmt(judul), A.esc(k.namaMesin ? k.namaMesin(idx) : ''), !buka(idx)));
    });
    wadah.appendChild(labelDh(lado < 0, lado < 0 ? xc - 72 - lwM : xc + 72, yc - 70, lwM,
      '<svg width="20" height="20" viewBox="0 0 20 20">' + A.svgBintang(10, 11, 9, true) + '</svg>' + tot + ' / ' + maks,
      semua ? 'Ketuk sarang emas!' : 'Selesaikan semua level', false));

    /* sentuhan */
    Array.prototype.forEach.call(wadah.querySelectorAll('.k-dh-titik'), function (t) {
      var idx = +t.getAttribute('data-i');
      var jd = (k.judulLevel ? k.judulLevel(idx) : '') || '';
      t.setAttribute('aria-label', 'Level ' + (idx + 1) + (jd ? ': ' + jd : '') + (buka(idx) ? '' : ' (terkunci)'));
      pasangKlik(t, function () { k.pilih(idx, t); });
    });
    var pt = wadah.querySelector('.k-dh-peti');
    if (pt) {
      pt.setAttribute('aria-label', 'Tujuan akhir: sarang telur emas' + (semua ? '' : ' (terkunci)'));
      pasangKlik(pt, function () { k.akhir(pt); });
    }

    k.w.appendChild(wadah);

    /* penanda: di atas daun aktif, atau di samping sarang bila semua selesai */
    var pos = pts.map(function (p) { return { x: r1(p.x), y: r1(p.y - 24) }; });
    pos.push({ x: r1(xc - lado * 78), y: r1(yc + 10) });
    k.penanda(wadah, pos);
  }

  /* ══════════════ gaya "menara" ══════════════
   * Sumbu vertikal: lantai 1 di dasar, tiap level satu lantai bertumpuk ke atas,
   * mahkota di puncak sebagai tujuan akhir. Label diletakkan di samping lantai
   * (kiri-kanan bergantian), bukan di bawah. */

  var CSS_MN = [
    '.k-mn{position:absolute;left:0;right:0;top:58px}',
    '.k-mn>svg{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible}',
    '.k-mn-titik{cursor:pointer;outline:none}',
    '.k-mn-titik.kunci{cursor:not-allowed}',
    '.k-mn-titik:not(.kunci):hover .k-mn-lantai{filter:brightness(1.08)}',
    '.k-mn-titik:focus-visible .k-mn-lantai{filter:drop-shadow(0 0 6px #fff)}',
    '.k-mn-lantai,.k-mn-cincin,.k-mn-mahkota,.k-mn-sinar,.k-mn-awan,.k-mn-burung,.k-mn-kibar,.k-mn-kilau{transform-box:fill-box;transform-origin:center}',
    '.k-mn-aktif{animation:kMnDenyut 1.6s ease-in-out infinite}',
    '@keyframes kMnDenyut{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}',
    '.k-mn-cincin{animation:kMnCincin 1.8s ease-out infinite}',
    '@keyframes kMnCincin{0%{transform:scale(1);opacity:.9}100%{transform:scale(1.2,1.45);opacity:0}}',
    '.k-mn-peti{cursor:pointer;outline:none}',
    '.k-mn-peti.buka .k-mn-mahkota{animation:kMnDenyut 1.6s ease-in-out infinite}',
    '.k-mn-peti:focus-visible .k-mn-mahkota{filter:drop-shadow(0 0 6px #fff)}',
    '.k-mn-sinar{pointer-events:none;animation:kMnPutar 12s linear infinite}',
    '@keyframes kMnPutar{to{transform:rotate(360deg)}}',
    '.k-mn-awan{pointer-events:none;animation:kMnAwan 16s ease-in-out infinite alternate}',
    '@keyframes kMnAwan{from{transform:translateX(-14px)}to{transform:translateX(22px)}}',
    '.k-mn-burung{animation:kMnBob 3s ease-in-out infinite}',
    '@keyframes kMnBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}',
    '.k-mn-kibar{transform-origin:left center;animation:kMnKibar 1.8s ease-in-out infinite alternate}',
    '@keyframes kMnKibar{from{transform:skewY(0)}to{transform:skewY(-9deg)}}',
    '.k-mn-kedip{animation:kMnKedip 2.4s ease-in-out infinite}',
    '@keyframes kMnKedip{0%,100%{opacity:.5}50%{opacity:1}}',
    '.k-mn-kilau{pointer-events:none;animation:kMnKilau 3s ease-in-out infinite}',
    '@keyframes kMnKilau{0%,100%{transform:scale(.7);opacity:.4}50%{transform:scale(1.1);opacity:1}}',
    '.k-mn-label{position:absolute;color:#fff;pointer-events:none;transform:translateY(-50%);',
    'text-shadow:0 2px 0 rgba(var(--gelap),.95),0 0 10px rgba(var(--gelap),.85)}',
    '.k-mn-label .jd{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;',
    'font-family:Fredoka,sans-serif;font-weight:600;font-size:18px;line-height:1.12;word-break:break-word}',
    '.k-mn-label small{display:block;font-weight:800;font-size:14px;opacity:.88;margin-top:3px;letter-spacing:.3px;',
    'white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.k-mn-label.kunci{opacity:.72}',
    '.k-mn-label svg{vertical-align:-3px;margin-right:4px}',
    '@media (prefers-reduced-motion:reduce){.k-mn *{animation:none!important}}'
  ].join('');

  function mahkotaSvg(x, y, terbuka) {
    var isi = terbuka ? 'var(--aksen)' : '#AEB6BE';
    var tepi = terbuka ? 'var(--lip)' : '#5E6770';
    var pita = terbuka ? 'var(--c2)' : '#8E98A2';
    var permata = terbuka ? 'var(--kertas)' : '#D7DCE1';
    var h = '<g transform="translate(' + r1(x) + ' ' + r1(y) + ')">' +
      '<ellipse cx="0" cy="36" rx="54" ry="7" fill="rgba(0,0,0,.28)"/>' +
      '<path d="M-46 26L-54-20L-27-2L0-36L27-2L54-20L46 26Z" style="fill:' + isi + ';stroke:' + tepi + '" stroke-width="3.5" stroke-linejoin="round"/>' +
      '<rect x="-46" y="12" width="92" height="16" rx="4" style="fill:' + pita + ';stroke:' + tepi + '" stroke-width="3"/>' +
      '<path d="M-36 4L-42-12" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>' +
      '<circle cx="-54" cy="-20" r="5.5" style="fill:' + permata + ';stroke:' + tepi + '" stroke-width="2.4"/>' +
      '<circle cx="0" cy="-36" r="6.5" style="fill:' + permata + ';stroke:' + tepi + '" stroke-width="2.4"/>' +
      '<circle cx="54" cy="-20" r="5.5" style="fill:' + permata + ';stroke:' + tepi + '" stroke-width="2.4"/>';
    if (terbuka) h += '<circle cx="0" cy="20" r="4.5" fill="#fff" style="stroke:' + tepi + '" stroke-width="2"/>';
    h += '</g>';
    return h;
  }

  function gambarMenara(k) {
    var S = keadaan(k), A = S.A, D = S.D, W = S.W, HT = S.HT, n = S.n;
    var bt = S.bt, buka = S.buka, aktif = S.aktif, semua = S.semua, tot = S.tot, maks = S.maks;
    var rnd = A.acakBenih(A.hashTeks(D.judul || 'menara'));
    var i;

    if (k.css) k.css('kit-peta-menara', CSS_MN);

    /* ── tata letak: menara di tengah, lantai 1 di dasar, mahkota di puncak ── */
    var cx = Math.round(W / 2), yb = HT - 64, gy = HT - 30;
    var sp = n > 1 ? Math.min(96, (yb - 150) / (n - 1)) : 0;
    var ys = [];
    for (i = 0; i < n; i++) ys.push(r1(yb - sp * i));
    var yg = Math.max(74, ys[n - 1] - 92);
    var par = rnd() < 0.5 ? 0 : 1, sisi = [];
    for (i = 0; i < n; i++) sisi.push((i + par) % 2 ? 1 : -1);
    var lw = 190, off = 146;
    function kiriLabel(idx) { return sisi[idx] > 0 ? cx + off : cx - off - lw; }

    /* area terlarang untuk hiasan: menara, label, penanda, label dan penanda tujuan */
    var rects = [{ x0: cx - 100, x1: cx + 100, y0: 0, y1: HT }];
    for (i = 0; i < n; i++) {
      rects.push({
        x0: sisi[i] > 0 ? cx + 66 : kiriLabel(i), x1: sisi[i] > 0 ? kiriLabel(i) + lw : cx - 66,
        y0: ys[i] - 34, y1: ys[i] + 34
      });
    }
    rects.push({ x0: cx + 60, x1: cx + 76 + 176, y0: yg - 28, y1: yg + 30 });
    rects.push({ x0: cx - 134, x1: cx - 62, y0: yg - 64, y1: yg + 22 });

    /* ── hiasan: awan, burung (langit); pohon, batu, panji (tanah) ── */
    var JENIS = {
      awan: { b: [-38, 38, -24, 18], mak: 4 },
      burung: { b: [-13, 13, -10, 5], mak: 2 },
      pohon: { b: [-23, 23, -29, 32], mak: 3 },
      batu: { b: [-25, 25, -13, 18], mak: 2 },
      panji: { b: [-14, 38, -36, 30], mak: 1 }
    };
    var hias = [], jumlah = { awan: 0, burung: 0, pohon: 0, batu: 0, panji: 0 };
    var urut = ['awan', 'awan', 'burung', 'pohon', 'batu', 'panji', 'pohon', 'awan'];
    function bentrok(bx) {
      var r, c, m = 6;
      for (r = 0; r < rects.length; r++) {
        if (!(bx.x1 + m < rects[r].x0 || bx.x0 - m > rects[r].x1 || bx.y1 + m < rects[r].y0 || bx.y0 - m > rects[r].y1)) return true;
      }
      for (c = 0; c < hias.length; c++) {
        var o = hias[c].bx;
        if (!(bx.x1 + 8 < o.x0 || bx.x0 - 8 > o.x1 || bx.y1 + 8 < o.y0 || bx.y0 - 8 > o.y1)) return true;
      }
      return false;
    }
    var coba = 0;
    while (hias.length < 8 && coba++ < 600) {
      var jenis = urut[Math.floor(rnd() * urut.length)];
      var tanah = jenis === 'pohon' || jenis === 'batu' || jenis === 'panji';
      var sk = tanah ? 0.8 + rnd() * 0.2 : 0.85 + rnd() * 0.35;
      var hx = 40 + rnd() * (W - 80);
      var hy = tanah ? gy - 14 + rnd() * 8 : (jenis === 'burung' ? 40 + rnd() * 150 : 34 + rnd() * 170);
      var dl = rnd() * 4;
      if (jumlah[jenis] >= JENIS[jenis].mak) continue;
      var bb = JENIS[jenis].b;
      var bx = { x0: hx + bb[0] * sk, x1: hx + bb[1] * sk, y0: hy + bb[2] * sk, y1: hy + bb[3] * sk };
      if (bx.x0 < 6 || bx.x1 > W - 6 || bx.y0 < 6 || bx.y1 > HT - 4) continue;
      if (bentrok(bx)) continue;
      hias.push({ j: jenis, x: hx, y: hy, s: sk, bx: bx, dl: dl });
      jumlah[jenis]++;
    }
    hias.sort(function (p, q) { return p.y - q.y; });

    /* ── SVG ── */
    var g = '<defs>' +
      '<linearGradient id="kmn-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--c1)"/><stop offset="1" style="stop-color:var(--c2)"/></linearGradient>' +
      '<linearGradient id="kmn-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="kmn-h"><stop offset="0" style="stop-color:var(--aksen)" stop-opacity=".55"/><stop offset="1" style="stop-color:var(--aksen)" stop-opacity="0"/></radialGradient>' +
      '</defs>';
    g += '<rect x="0" y="0" width="' + W + '" height="' + HT + '" fill="url(#kmn-s)"/>';

    /* cahaya di belakang mahkota; sinar berputar hanya bila semua selesai */
    g += '<circle cx="' + cx + '" cy="' + yg + '" r="120" fill="url(#kmn-h)" opacity="' + (semua ? 1 : 0.35) + '"/>';
    if (semua) {
      g += '<g class="k-mn-sinar">';
      for (i = 0; i < 8; i++) {
        g += '<path d="M' + cx + ' ' + yg + 'L' + (cx - 7) + ' ' + (yg - 66) + 'L' + (cx + 7) + ' ' + (yg - 66) + 'Z" transform="rotate(' + (i * 45) + ' ' + cx + ' ' + yg + ')" style="fill:var(--aksen)" opacity=".28"/>';
      }
      g += '</g>';
    }

    /* tanah */
    g += '<path d="M0 ' + HT + 'V' + r1(gy + 4) + 'Q' + r1(W * 0.2) + ' ' + r1(gy - 10) + ' ' + r1(W * 0.4) + ' ' + gy +
      'T' + r1(W * 0.7) + ' ' + r1(gy - 4) + 'T' + W + ' ' + r1(gy + 2) + 'V' + HT + 'Z" style="fill:rgba(var(--gelap),.42)"/>';

    hias.forEach(function (h) {
      var dly = ' style="animation-delay:-' + r1(h.dl) + 's"';
      if (h.j === 'awan') g += '<g class="k-mn-awan"' + dly + '>' + A.svgHiasan('awan', h.x, h.y, h.s) + '</g>';
      else if (h.j === 'pohon' || h.j === 'batu') g += A.svgHiasan(h.j, h.x, h.y, h.s);
      else if (h.j === 'burung') {
        g += '<g transform="translate(' + r1(h.x) + ' ' + r1(h.y) + ') scale(' + r1(h.s) + ')"><g class="k-mn-burung"' + dly + '>' +
          '<path d="M-11 2Q-5.5-8 0 1Q5.5-8 11 2" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/></g></g>';
      } else {
        g += '<g transform="translate(' + r1(h.x) + ' ' + r1(h.y) + ') scale(' + r1(h.s) + ')">' +
          '<ellipse cx="0" cy="26" rx="14" ry="4" fill="rgba(0,0,0,.22)"/>' +
          '<rect x="-2" y="-34" width="4" height="60" rx="2" style="fill:var(--lip)"/>' +
          '<g class="k-mn-kibar"><path d="M2-33L34-22L2-11Z" style="fill:var(--aksen);stroke:var(--lip)" stroke-width="2.2" stroke-linejoin="round"/></g></g>';
      }
    });

    /* badan menara: poros gelap bergaris bata, alas di dasar */
    var yp = yg + 20;
    g += '<rect x="' + (cx - 46) + '" y="' + yp + '" width="92" height="' + (gy + 8 - yp) + '" rx="6" style="fill:rgba(var(--gelap),.5);stroke:rgba(255,255,255,.14)" stroke-width="2"/>';
    var bata = '';
    for (var by = yp + 18; by < gy; by += 16) bata += 'M' + (cx - 44) + ' ' + r1(by) + 'H' + (cx + 44);
    g += '<path d="' + bata + '" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="2"/>';
    g += '<rect x="' + (cx - 84) + '" y="' + (yb + 22) + '" width="168" height="16" rx="4" style="fill:rgba(var(--gelap),.7);stroke:rgba(255,255,255,.18)" stroke-width="2"/>';

    /* garis penunjuk dari lantai ke label */
    for (i = 0; i < n; i++) {
      g += '<path d="M' + (cx + sisi[i] * 70) + ' ' + ys[i] + 'H' + (cx + sisi[i] * (off - 4)) + '" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2.5" stroke-dasharray="2 7" stroke-linecap="round"/>';
    }

    /* tangga antar lantai: papan (terbuka) atau titik-titik (terkunci) */
    for (i = 0; i < n; i++) {
      var yAtas = i < n - 1 ? ys[i + 1] : yg + 24;
      var d = 'M' + cx + ' ' + ys[i] + 'V' + r1(yAtas);
      var sb = i === n - 1 ? semua : buka(i + 1);
      if (sb) {
        g += '<path d="' + d + '" fill="none" stroke="rgba(0,0,0,.22)" stroke-width="18" transform="translate(3 0)"/>' +
          '<path d="' + d + '" fill="none" style="stroke:var(--lip)" stroke-width="16"/>' +
          '<path d="' + d + '" fill="none" style="stroke:var(--kertas)" stroke-width="11"/>' +
          '<path d="' + d + '" fill="none" style="stroke:var(--lip)" stroke-width="11" stroke-dasharray="2.5 9" opacity=".45"/>';
        if (bt(i) > 0) g += '<path class="k-mn-kedip" d="' + d + '" fill="none" style="stroke:var(--c2)" stroke-width="4" stroke-dasharray="10 8" stroke-linecap="round"/>';
      } else {
        g += '<path d="' + d + '" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round"/>';
      }
    }

    /* lantai level */
    function lantaiSvg(idx) {
      var b = buka(idx), st = bt(idx), x = cx, y = ys[idx];
      var tepi = b ? 'var(--lip)' : '#5E6770';
      var isi = b ? 'url(#kmn-g)' : '#AEB6BE';
      var lencana = b ? 'var(--kertas)' : '#D7DCE1';
      var h = '<g class="k-mn-titik' + (b ? '' : ' kunci') + '" data-i="' + idx + '" role="button" tabindex="0">';
      if (idx === aktif) h += '<rect class="k-mn-cincin" x="' + (x - 66) + '" y="' + (y - 26) + '" width="132" height="52" rx="12" fill="none" style="stroke:var(--aksen)" stroke-width="5"/>';
      h += '<g class="k-mn-lantai' + (idx === aktif ? ' k-mn-aktif' : '') + '">' +
        '<rect x="' + (x - 66) + '" y="' + (y - 20) + '" width="132" height="52" rx="12" style="fill:' + tepi + '"/>' +
        '<rect x="' + (x - 66) + '" y="' + (y - 26) + '" width="132" height="52" rx="12" style="fill:' + isi + ';stroke:' + tepi + '" stroke-width="3.5"/>' +
        '<rect x="' + (x - 56) + '" y="' + (y - 21) + '" width="56" height="6" rx="3" fill="#fff" opacity=".4"/>' +
        '<circle cx="' + (x - 39) + '" cy="' + y + '" r="21" style="fill:' + lencana + ';stroke:' + tepi + '" stroke-width="3"/>' +
        '<text x="' + (x - 39) + '" y="' + (y + 9) + '" text-anchor="middle" font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700" font-size="26" style="fill:' + tepi + '">' + (idx + 1) + '</text>';
      if (b) h += A.svgBintang(x + 8, y + 1, 9, st >= 1) + A.svgBintang(x + 30, y - 3, 10, st >= 2) + A.svgBintang(x + 52, y + 1, 9, st >= 3);
      else h += A.svgGembok(x + 36, y);
      h += '</g><rect x="' + (x - 70) + '" y="' + (y - 31) + '" width="140" height="62" fill="transparent"/></g>';
      return h;
    }
    for (i = 0; i < n; i++) g += lantaiSvg(i);

    /* tujuan akhir: mahkota di puncak */
    g += '<g class="k-mn-peti' + (semua ? ' buka' : '') + '" role="button" tabindex="0">' +
      '<g class="k-mn-mahkota">' + mahkotaSvg(cx, yg, semua);
    if (!semua) g += A.svgGembok(cx, yg + 4);
    g += '</g>';
    if (semua) {
      var kl = [[-34, -50, 0], [36, -46, 1.2], [2, -56, 2.1]];
      kl.forEach(function (q) {
        g += '<g transform="translate(' + (cx + q[0]) + ' ' + (yg + q[1]) + ')"><g class="k-mn-kilau" style="animation-delay:-' + q[2] + 's">' +
          '<path d="M0-12Q2-2 12 0Q2 2 0 12Q-2 2-12 0Q-2-2 0-12Z" fill="#fff"/></g></g>';
      });
    }
    g += '<rect x="' + (cx - 60) + '" y="' + (yg - 44) + '" width="120" height="88" fill="transparent"/></g>';

    var wadah = A.el('div', 'k-mn');
    wadah.style.height = HT + 'px';
    wadah.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + HT + '" preserveAspectRatio="none">' + g + '</svg>';

    /* label: di samping lantai, rata ke arah lantai */
    function labelMn(kiri, atas, lebar, rata, jd, kecil, kunci) {
      var dv = A.el('div', 'k-mn-label' + (kunci ? ' kunci' : ''), '<span class="jd">' + jd + '</span><small>' + kecil + '</small>');
      dv.style.left = r1(kiri) + 'px';
      dv.style.top = r1(atas) + 'px';
      dv.style.width = lebar + 'px';
      dv.style.textAlign = rata;
      return dv;
    }
    for (i = 0; i < n; i++) {
      var judul = (k.judulLevel ? k.judulLevel(i) : '') || ('Level ' + (i + 1));
      wadah.appendChild(labelMn(kiriLabel(i), ys[i], lw, sisi[i] > 0 ? 'left' : 'right',
        A.fmt(judul), A.esc(k.namaMesin ? k.namaMesin(i) : ''), !buka(i)));
    }
    wadah.appendChild(labelMn(cx + 76, yg, 176, 'left',
      '<svg width="20" height="20" viewBox="0 0 20 20">' + A.svgBintang(10, 11, 9, true) + '</svg>' + tot + ' / ' + maks,
      semua ? 'Ketuk mahkota!' : 'Selesaikan semua level', false));

    /* sentuhan */
    Array.prototype.forEach.call(wadah.querySelectorAll('.k-mn-titik'), function (t) {
      var idx = +t.getAttribute('data-i');
      var jd = (k.judulLevel ? k.judulLevel(idx) : '') || '';
      t.setAttribute('aria-label', 'Level ' + (idx + 1) + (jd ? ': ' + jd : '') + (buka(idx) ? '' : ' (terkunci)'));
      pasangKlik(t, function () { k.pilih(idx, t); });
    });
    var pt = wadah.querySelector('.k-mn-peti');
    if (pt) {
      pt.setAttribute('aria-label', 'Tujuan akhir: mahkota' + (semua ? '' : ' (terkunci)'));
      pasangKlik(pt, function () { k.akhir(pt); });
    }

    k.w.appendChild(wadah);

    /* penanda: di samping lantai aktif (sisi label, antara lantai dan label), atau di kiri mahkota bila semua selesai */
    var pos = [];
    for (i = 0; i < n; i++) pos.push({ x: r1(cx + sisi[i] * 104), y: r1(ys[i] + 16) });
    pos.push({ x: r1(cx - 98), y: r1(yg + 16) });
    k.penanda(wadah, pos);
  }

  /* ══════════════ gaya "pohon" ══════════════
   * Batang vertikal di tengah, tumbuh dari tanah ke atas. Level 1 paling bawah,
   * tiap level di ujung ranting yang bergantian kiri-kanan (simpul berbentuk daun
   * besar). Tujuan akhir: buah emas di tajuk paling atas. Jalur mengikuti
   * batang lalu ranting; ranting yang sudah dilalui bertunas.
   */

  var CSS_PH = CSS.replace(/k-pl/g, 'k-ph') + [
    '.k-ph-goyang{transform-box:fill-box;transform-origin:50% 100%;animation:kPhGoyang 5.5s ease-in-out infinite}',
    '@keyframes kPhGoyang{0%,100%{transform:rotate(-1.2deg)}50%{transform:rotate(1.2deg)}}',
    '.k-ph-kunang{animation:kPhKunang 6s ease-in-out infinite}',
    '.k-ph-kunang.b{animation-duration:8s}',
    '.k-ph-kunang.c{animation-duration:4.6s}',
    '@keyframes kPhKunang{0%{transform:translate(0,0);opacity:0}20%{opacity:1}80%{opacity:.9}100%{transform:translate(9px,-30px);opacity:0}}',
    '.k-ph-jatuh{transform-box:fill-box;transform-origin:center;animation:kPhJatuh 9s linear infinite}',
    '@keyframes kPhJatuh{0%{transform:translate(0,0) rotate(0deg);opacity:0}10%{opacity:.9}90%{opacity:.8}100%{transform:translate(-36px,84px) rotate(200deg);opacity:0}}',
    '.k-ph-getah{animation:kPhGetah 3.2s ease-in infinite}',
    '@keyframes kPhGetah{0%{transform:translateY(0);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateY(-30px);opacity:0}}'
  ].join('');

  function gambarPohon(k) {
    var S = keadaan(k), A = S.A, D = S.D, W = S.W, HT = S.HT, n = S.n;
    var bt = S.bt, buka = S.buka, aktif = S.aktif, semua = S.semua, tot = S.tot, maks = S.maks;
    var rnd = A.acakBenih(A.hashTeks(D.judul || 'pohon'));
    var i, c;

    if (k.css) k.css('kit-peta-pohon', CSS_PH);

    /* ── tata letak: batang di tengah, level bergantian kiri-kanan, naik ke atas ── */
    var cx = W / 2, R = 28, lw = 190;
    var dx = 116 + (W - 960) * 0.08;
    var tanah = HT - 22, gy = 74;
    var sp = n > 1 ? Math.min(74, 224 / (n - 1)) : 0;
    var arah = rnd() < 0.5 ? 1 : -1;
    var pts = [];
    for (i = 0; i < n; i++) {
      var sisi = arah * (i % 2 ? -1 : 1);
      var jx = (rnd() - 0.5) * 14;
      var py = 292 + sp * ((n - 1) / 2 - i);
      pts.push({ x: cx + sisi * (dx + jx), y: py, sisi: sisi, yj: py + 26 });
    }

    /* ranting: kurva dari batang (cx, yj) naik ke pusat daun */
    function ranting(p) {
      var da = Math.abs(p.x - cx);
      var a = { x: cx, y: p.yj }, b = { x: cx + p.sisi * da * 0.45, y: p.yj + 2 };
      var d2 = { x: p.x - p.sisi * da * 0.35, y: p.y + 8 }, e = { x: p.x, y: p.y };
      return {
        d: 'M' + r1(a.x) + ' ' + r1(a.y) + 'C' + r1(b.x) + ' ' + r1(b.y) + ' ' + r1(d2.x) + ' ' + r1(d2.y) + ' ' + r1(e.x) + ' ' + r1(e.y),
        at: function (t) {
          var u = 1 - t;
          return {
            x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * d2.x + t * t * t * e.x,
            y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * d2.y + t * t * t * e.y
          };
        }
      };
    }
    var rt = pts.map(ranting);

    /* ── area terlarang untuk hiasan ── */
    var rects = [
      { x0: cx - 32, x1: cx + 32, y0: 0, y1: HT },
      { x0: cx - 122, x1: cx + 122, y0: 0, y1: 126 },
      { x0: cx + 122, x1: cx + 128 + lw, y0: gy - 32, y1: gy + 34 }
    ];
    pts.forEach(function (p) {
      rects.push({ x0: p.x - 46, x1: p.x + 46, y0: p.y - 70, y1: p.y + 46 });
      var tepiDalam = p.x - p.sisi * (R + 14);
      var lx0 = p.sisi > 0 ? p.x + R + 12 : p.x - R - 14 - lw - 2;
      rects.push({ x0: lx0, x1: lx0 + lw + 4, y0: p.y - 36, y1: p.y + 36 });
      rects.push({ x0: Math.min(cx, tepiDalam), x1: Math.max(cx, tepiDalam), y0: p.y - 38, y1: p.yj + 16 });
    });

    /* ── hiasan: kunang-kunang, daun jatuh, semak, pohon jauh ── */
    var JENIS = {
      kunang: { b: [-10, 12, -36, 8], kelas: 'k-ph-kunang' },
      jatuh: { b: [-46, 12, -8, 94], kelas: 'k-ph-jatuh' },
      semak: { b: [-32, 32, -26, 8], kelas: '' },
      jauh: { b: [-28, 28, -66, 6], kelas: '' }
    };
    function isiHias(jenis) {
      if (jenis === 'kunang') {
        return '<circle cx="0" cy="0" r="8" style="fill:var(--aksen)" opacity=".25"/>' +
          '<circle cx="0" cy="0" r="3.2" style="fill:var(--aksen)"/><circle cx="-0.8" cy="-0.8" r="1.3" fill="#fff"/>';
      }
      if (jenis === 'jatuh') {
        return '<path d="M-7 7V0A7 7 0 0 1 0-7H7V0A7 7 0 0 1 0 7Z" style="fill:var(--c1);stroke:var(--lip)" stroke-width="1.6" stroke-linejoin="round"/>';
      }
      if (jenis === 'semak') {
        return '<circle cx="-14" cy="0" r="12" fill="rgba(0,0,0,.24)"/><circle cx="2" cy="-7" r="15" fill="rgba(0,0,0,.24)"/>' +
          '<circle cx="18" cy="-1" r="11" fill="rgba(0,0,0,.24)"/><circle cx="-2" cy="-10" r="6" fill="rgba(255,255,255,.1)"/>';
      }
      return '<rect x="-3" y="-22" width="6" height="26" rx="2" fill="rgba(0,0,0,.22)"/>' +
        '<circle cx="0" cy="-40" r="22" fill="rgba(0,0,0,.22)"/><circle cx="-6" cy="-47" r="8" fill="rgba(255,255,255,.08)"/>';
    }
    var hias = [];
    var jumlah = { kunang: 0, jatuh: 0, semak: 0, jauh: 0 };
    var batas = { kunang: 9, jatuh: 3, semak: 3, jauh: 3 };
    var urut = ['kunang', 'jauh', 'kunang', 'semak', 'jatuh', 'kunang'];
    function bentrok(bx) {
      var r, m = 8;
      for (r = 0; r < rects.length; r++) {
        if (!(bx.x1 + m < rects[r].x0 || bx.x0 - m > rects[r].x1 || bx.y1 + m < rects[r].y0 || bx.y0 - m > rects[r].y1)) return true;
      }
      for (r = 0; r < hias.length; r++) {
        var o = hias[r].bx;
        if (!(bx.x1 + 8 < o.x0 || bx.x0 - 8 > o.x1 || bx.y1 + 8 < o.y0 || bx.y0 - 8 > o.y1)) return true;
      }
      return false;
    }
    var coba = 0;
    while (hias.length < 14 && coba++ < 700) {
      var jenis = urut[Math.floor(rnd() * urut.length)];
      var sk = 0.85 + rnd() * 0.3;
      var hx = 24 + rnd() * (W - 48), hy;
      var r3 = rnd(), r4 = rnd();
      if (jenis === 'semak') hy = HT - 16;
      else if (jenis === 'jauh') hy = HT - 30;
      else if (jenis === 'jatuh') hy = 14 + r3 * 150;
      else hy = 30 + r3 * (HT - 90);
      if (jumlah[jenis] >= batas[jenis]) continue;
      var bb = JENIS[jenis].b, fl = r4 < 0.5 ? -1 : 1;
      var bxa = fl > 0 ? bb[0] : -bb[1], bxb = fl > 0 ? bb[1] : -bb[0];
      var bx = { x0: hx + bxa * sk, x1: hx + bxb * sk, y0: hy + bb[2] * sk, y1: hy + bb[3] * sk };
      if (bx.x0 < 6 || bx.x1 > W - 6 || bx.y0 < 4 || bx.y1 > HT - 2) continue;
      if (bentrok(bx)) continue;
      hias.push({ j: jenis, x: hx, y: hy, s: sk, bx: bx, flip: fl, dl: rnd() * 6, v: hias.length });
      jumlah[jenis]++;
    }
    hias.sort(function (p, q) { return p.y - q.y; });

    /* ── SVG ── */
    var g = '<defs>' +
      '<linearGradient id="kph-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--c1)"/><stop offset="1" style="stop-color:var(--c2)"/></linearGradient>' +
      '<linearGradient id="kph-l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset="1" stop-color="#000" stop-opacity=".30"/></linearGradient>' +
      '<radialGradient id="kph-h"><stop offset="0" style="stop-color:var(--aksen)" stop-opacity=".5"/><stop offset="1" style="stop-color:var(--aksen)" stop-opacity="0"/></radialGradient>' +
      '</defs>';
    g += '<rect x="0" y="0" width="' + W + '" height="' + HT + '" fill="url(#kph-l)"/>';
    g += '<circle cx="' + cx + '" cy="70" r="250" fill="url(#kph-h)" opacity=".7"/>';
    for (i = 0; i < 3; i++) {
      var rx = cx + (i - 1) * 150, lebarAtas = 36, lebarBawah = 120;
      g += '<path d="M' + r1(cx + (i - 1) * 24 - lebarAtas / 2) + ' 0L' + r1(cx + (i - 1) * 24 + lebarAtas / 2) + ' 0L' + r1(rx + lebarBawah / 2) + ' ' + (HT - 40) + 'L' + r1(rx - lebarBawah / 2) + ' ' + (HT - 40) + 'Z" fill="#fff" opacity=".045"/>';
    }

    hias.forEach(function (h) {
      var kls = JENIS[h.j].kelas;
      if (h.j === 'kunang') kls += (h.v % 3 === 1 ? ' b' : h.v % 3 === 2 ? ' c' : '');
      g += '<g class="k-ph-hias" transform="translate(' + r1(h.x) + ' ' + r1(h.y) + ') scale(' + r1(h.flip * h.s) + ' ' + r1(h.s) + ')">' +
        '<g' + (kls ? ' class="' + kls + '" style="animation-delay:-' + r1(h.dl) + 's"' : '') + '>' + isiHias(h.j) + '</g></g>';
    });

    /* tanah */
    g += '<path d="M0 ' + HT + 'V' + (HT - 28) + 'C' + r1(W * 0.2) + ' ' + (HT - 56) + ' ' + r1(W * 0.38) + ' ' + (HT - 44) + ' ' + r1(W * 0.55) + ' ' + (HT - 28) +
      'S' + r1(W * 0.85) + ' ' + (HT - 50) + ' ' + W + ' ' + (HT - 32) + 'V' + HT + 'Z" fill="rgba(0,0,0,.2)"/>';
    g += '<path d="M0 ' + HT + 'V' + (HT - 14) + 'C' + r1(W * 0.25) + ' ' + (HT - 28) + ' ' + r1(W * 0.5) + ' ' + (HT - 8) + ' ' + r1(W * 0.7) + ' ' + (HT - 20) +
      'S' + r1(W * 0.92) + ' ' + (HT - 16) + ' ' + W + ' ' + (HT - 20) + 'V' + HT + 'Z" fill="rgba(0,0,0,.3)"/>';

    /* batang (kayu = warna netral) */
    var dBatang = 'M' + (cx - 20) + ' ' + (tanah + 4) + 'C' + (cx - 14) + ' 380 ' + (cx - 11) + ' 200 ' + (cx - 10) + ' 96L' + (cx + 10) + ' 96C' +
      (cx + 11) + ' 200 ' + (cx + 14) + ' 380 ' + (cx + 20) + ' ' + (tanah + 4) + 'Z';
    g += '<path d="M' + (cx - 18) + ' ' + (tanah - 4) + 'Q' + (cx - 34) + ' ' + (tanah + 2) + ' ' + (cx - 46) + ' ' + (tanah + 12) + 'L' + (cx - 10) + ' ' + (tanah + 10) + 'Z" fill="#8A5A2B" style="stroke:var(--lip)" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M' + (cx + 18) + ' ' + (tanah - 4) + 'Q' + (cx + 34) + ' ' + (tanah + 2) + ' ' + (cx + 46) + ' ' + (tanah + 12) + 'L' + (cx + 10) + ' ' + (tanah + 10) + 'Z" fill="#8A5A2B" style="stroke:var(--lip)" stroke-width="3" stroke-linejoin="round"/>';
    g += '<path d="' + dBatang + '" fill="#8A5A2B" style="stroke:var(--lip)" stroke-width="3.5" stroke-linejoin="round"/>';
    g += '<path d="M' + (cx - 5) + ' ' + (tanah - 6) + 'C' + (cx - 5) + ' 380 ' + (cx - 4) + ' 220 ' + (cx - 4) + ' 110" fill="none" stroke="#B8814A" stroke-width="3" stroke-linecap="round" opacity=".7"/>';

    /* ranting */
    rt.forEach(function (r) {
      g += '<path d="' + r.d + '" fill="none" style="stroke:var(--lip)" stroke-width="15" stroke-linecap="round"/>' +
        '<path d="' + r.d + '" fill="none" stroke="#8A5A2B" stroke-width="10" stroke-linecap="round"/>';
    });

    /* jalur: batang dan ranting menyala bila terbuka, putus-putus bila terkunci */
    function garisTerang(d, lewat) {
      var h = '<path d="' + d + '" fill="none" stroke-width="9" stroke-linecap="round" style="stroke:var(--aksen)" opacity=".25"/>' +
        '<path d="' + d + '" fill="none" stroke-width="3" stroke-linecap="round" style="stroke:var(--aksen)"/>';
      if (lewat) h += '<path d="' + d + '" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity=".9"/>';
      return h;
    }
    function garisKunci(d) {
      return '<path d="' + d + '" fill="none" stroke="rgba(255,255,255,.38)" stroke-width="2.5" stroke-dasharray="3 8" stroke-linecap="round"/>';
    }
    var getah = '';
    function segBatang(yA, yB, bukaSeg, lewat, idx) {
      var d = 'M' + cx + ' ' + r1(yA) + 'L' + cx + ' ' + r1(yB);
      if (!bukaSeg) { g += garisKunci(d); return; }
      g += garisTerang(d, lewat);
      var y0 = Math.min(yA - 4, yB + 32);
      getah += '<g transform="translate(' + cx + ' ' + r1(y0) + ')"><g class="k-ph-getah" style="animation-delay:-' + r1(idx * 0.7) + 's">' +
        '<circle cx="0" cy="0" r="5" style="fill:var(--aksen)" opacity=".35"/><circle cx="0" cy="0" r="2.6" fill="#fff"/></g></g>';
    }
    pts.forEach(function (p, idx) {
      var yA = idx === 0 ? tanah - 4 : pts[idx - 1].yj;
      var b = buka(idx), l = bt(idx) > 0;
      segBatang(yA, p.yj, b, l, idx);
      if (b) g += garisTerang(rt[idx].d, l); else g += garisKunci(rt[idx].d);
      if (l) {
        var t1 = rt[idx].at(0.38), t2 = rt[idx].at(0.66);
        g += '<ellipse cx="' + r1(t1.x) + '" cy="' + r1(t1.y - 9) + '" rx="9" ry="4.5" transform="rotate(' + (p.sisi * -35) + ' ' + r1(t1.x) + ' ' + r1(t1.y - 9) + ')" style="fill:var(--c1);stroke:var(--lip)" stroke-width="1.6"/>' +
          '<ellipse cx="' + r1(t2.x) + '" cy="' + r1(t2.y - 9) + '" rx="9" ry="4.5" transform="rotate(' + (p.sisi * 35) + ' ' + r1(t2.x) + ' ' + r1(t2.y - 9) + ')" style="fill:var(--c1);stroke:var(--lip)" stroke-width="1.6"/>';
      }
    });
    segBatang(pts[n - 1].yj, gy + 30, semua, semua, n);
    g += getah;

    /* tajuk (bergoyang pelan) */
    var blob = [[-82, 22, 30], [-46, 0, 38], [0, -10, 44], [46, 0, 38], [82, 22, 30], [-34, 26, 30], [34, 26, 30]];
    var cy0 = 60;
    g += '<g class="k-ph-goyang">';
    blob.forEach(function (b) { g += '<circle cx="' + r1(cx + b[0]) + '" cy="' + r1(cy0 + b[1]) + '" r="' + b[2] + '" style="fill:var(--lip);stroke:var(--lip)" stroke-width="6"/>'; });
    blob.forEach(function (b) { g += '<circle cx="' + r1(cx + b[0]) + '" cy="' + r1(cy0 + b[1]) + '" r="' + b[2] + '" style="fill:var(--c2)"/>'; });
    blob.forEach(function (b, q) {
      if (q % 2 === 0) g += '<ellipse cx="' + r1(cx + b[0] - b[2] * 0.25) + '" cy="' + r1(cy0 + b[1] - b[2] * 0.35) + '" rx="' + r1(b[2] * 0.5) + '" ry="' + r1(b[2] * 0.28) + '" style="fill:var(--c1)" opacity=".55"/>';
    });
    g += '</g>';

    /* tujuan akhir: buah emas */
    function bintangPutih(px, py, rr) {
      var p = [], q;
      for (q = 0; q < 10; q++) {
        var a = -Math.PI / 2 + q * Math.PI / 5, r5 = q % 2 ? rr * 0.46 : rr;
        p.push(r1(px + r5 * Math.cos(a)) + ',' + r1(py + r5 * Math.sin(a)));
      }
      return '<polygon points="' + p.join(' ') + '" fill="#fff" style="stroke:var(--lip)" stroke-width="2.4" stroke-linejoin="round"/>';
    }
    g += '<g class="k-ph-peti' + (semua ? ' buka' : '') + '" role="button" tabindex="0">';
    if (semua) {
      g += '<circle cx="' + cx + '" cy="' + gy + '" r="86" fill="url(#kph-h)"/><g class="k-ph-sinar">';
      for (i = 0; i < 10; i++) {
        g += '<path d="M' + cx + ' ' + gy + 'L' + (cx - 8) + ' ' + (gy - 70) + 'L' + (cx + 8) + ' ' + (gy - 70) + 'Z" transform="rotate(' + (i * 36) + ' ' + cx + ' ' + gy + ')" style="fill:var(--aksen)" opacity=".34"/>';
      }
      g += '</g>';
    }
    g += '<path d="M' + cx + ' ' + (gy - 30) + 'q0-12 8-17" fill="none" style="stroke:var(--lip)" stroke-width="4" stroke-linecap="round"/>' +
      '<ellipse cx="' + (cx + 14) + '" cy="' + (gy - 46) + '" rx="10" ry="5" transform="rotate(-25 ' + (cx + 14) + ' ' + (gy - 46) + ')" style="fill:var(--c1);stroke:var(--lip)" stroke-width="2"/>';
    g += '<circle cx="' + cx + '" cy="' + (gy + 4) + '" r="32" style="fill:' + (semua ? 'var(--lip)' : '#5E6770') + '"/>' +
      '<circle cx="' + cx + '" cy="' + gy + '" r="32" style="fill:' + (semua ? 'var(--aksen)' : '#AEB6BE') + ';stroke:' + (semua ? 'var(--lip)' : '#5E6770') + '" stroke-width="4"/>' +
      '<ellipse cx="' + (cx - 11) + '" cy="' + (gy - 15) + '" rx="12" ry="6" fill="#fff" opacity=".45"/>';
    g += semua ? bintangPutih(cx, gy + 2, 17) : A.svgGembok(cx, gy + 2);
    g += '<circle cx="' + cx + '" cy="' + gy + '" r="52" fill="transparent"/></g>';

    /* level: daun besar (dua sudut runcing, dua sudut bulat) */
    var DAUN = 'M-28 28V0A28 28 0 0 1 0-28H28V0A28 28 0 0 1 0 28Z';
    function daunSvg(p, idx) {
      var b = buka(idx), st = bt(idx), x = r1(p.x), y = r1(p.y);
      var tepi = b ? 'var(--lip)' : '#5E6770', isi = b ? 'url(#kph-g)' : '#AEB6BE';
      var h = '<g class="k-ph-titik' + (b ? '' : ' kunci') + '" data-i="' + idx + '" role="button" tabindex="0">';
      if (b) h += '<circle cx="' + x + '" cy="' + y + '" r="52" fill="url(#kph-h)"/>';
      if (idx === aktif) h += '<circle class="k-ph-cincin" cx="' + x + '" cy="' + y + '" r="42" fill="none" style="stroke:var(--aksen)" stroke-width="4"/>';
      h += '<g class="k-ph-bulat' + (idx === aktif ? ' k-ph-aktif' : '') + '"><g transform="translate(' + x + ' ' + y + ')">' +
        '<path d="' + DAUN + '" transform="translate(0 5)" style="fill:' + tepi + '" stroke-linejoin="round"/>' +
        '<path d="' + DAUN + '" style="fill:' + isi + ';stroke:' + tepi + '" stroke-width="3.5" stroke-linejoin="round"/>' +
        '<ellipse cx="-8" cy="-14" rx="10" ry="4.5" transform="rotate(-30 -8 -14)" fill="#fff" opacity=".42"/>' +
        '<text x="0" y="10" text-anchor="middle" font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700" font-size="30" style="fill:' + tepi + '">' + (idx + 1) + '</text></g></g>';
      if (b) h += A.svgBintang(r1(p.x - 24), r1(p.y - 44), 9, st >= 1) + A.svgBintang(x, r1(p.y - 50), 10, st >= 2) + A.svgBintang(r1(p.x + 24), r1(p.y - 44), 9, st >= 3);
      else h += A.svgGembok(x, r1(p.y - 46));
      h += '<circle cx="' + x + '" cy="' + y + '" r="40" fill="transparent"/></g>';
      return h;
    }
    pts.forEach(function (p, idx) { g += daunSvg(p, idx); });

    var wadah = A.el('div', 'k-ph');
    wadah.style.height = HT + 'px';
    wadah.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + HT + '" preserveAspectRatio="none">' + g + '</svg>';

    /* label: di samping luar daun, rata ke arah luar */
    function labelSamping(left, top, rata, jd, kecil, kunci) {
      var d = A.el('div', 'k-ph-label' + (kunci ? ' kunci' : ''), '<span class="jd">' + jd + '</span><small>' + kecil + '</small>');
      d.style.left = r1(left) + 'px';
      d.style.top = r1(top) + 'px';
      d.style.width = lw + 'px';
      d.style.textAlign = rata;
      return d;
    }
    pts.forEach(function (p, idx) {
      var judul = (k.judulLevel ? k.judulLevel(idx) : '') || ('Level ' + (idx + 1));
      var kiri = p.sisi > 0 ? p.x + R + 14 : p.x - R - 14 - lw;
      wadah.appendChild(labelSamping(kiri, p.y - 30, p.sisi > 0 ? 'left' : 'right', A.fmt(judul), A.esc(k.namaMesin ? k.namaMesin(idx) : ''), !buka(idx)));
    });
    wadah.appendChild(labelSamping(cx + 126, gy - 26, 'left',
      '<svg width="20" height="20" viewBox="0 0 20 20">' + A.svgBintang(10, 11, 9, true) + '</svg>' + tot + ' / ' + maks,
      semua ? 'Ketuk buah emas!' : 'Selesaikan semua level', false));

    /* sentuhan */
    Array.prototype.forEach.call(wadah.querySelectorAll('.k-ph-titik'), function (t) {
      var idx = +t.getAttribute('data-i');
      var jd = (k.judulLevel ? k.judulLevel(idx) : '') || '';
      t.setAttribute('aria-label', 'Level ' + (idx + 1) + (jd ? ': ' + jd : '') + (buka(idx) ? '' : ' (terkunci)'));
      pasangKlik(t, function () { k.pilih(idx, t); });
    });
    var pt = wadah.querySelector('.k-ph-peti');
    if (pt) {
      pt.setAttribute('aria-label', 'Tujuan akhir: buah emas' + (semua ? '' : ' (terkunci)'));
      pasangKlik(pt, function () { k.akhir(pt); });
    }

    k.w.appendChild(wadah);

    /* penanda: di sisi dalam daun aktif (antara batang dan daun); di kiri tajuk bila semua selesai */
    var pos = pts.map(function (p) { return { x: r1(p.x - p.sisi * 62), y: r1(p.y + 6) }; });
    pos.push({ x: r1(cx - 136), y: r1(gy + 40) });
    k.penanda(wadah, pos);
  }

  /* ══════════════ gaya "cakrawala" ══════════════
   * Jalan berkelok-kelok menuju titik hilang di cakrawala senja. Level 1 paling
   * dekat (besar, di bawah), level berikutnya makin jauh dan kecil (skala dibatasi
   * supaya sasaran ketuk tetap besar). Simpul: rambu bundar di tiang. Tujuan akhir:
   * gerbang di garis cakrawala dengan matahari di belakangnya. Label di samping
   * rambu (sisi luar), ukuran huruf tidak ikut mengecil. */

  var CSS_CK = CSS.replace(/k-pl/g, 'k-ck') + [
    '.k-ck-peti.buka{animation:none}',
    '.k-ck-isi,.k-ck-surya,.k-ck-burung{transform-box:fill-box;transform-origin:center}',
    '.k-ck-peti.buka .k-ck-isi{animation:kPlDenyut 1.6s ease-in-out infinite}',
    '.k-ck-surya{animation:kCkNafas 5s ease-in-out infinite}',
    '@keyframes kCkNafas{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}',
    '.k-ck-awan{pointer-events:none;animation:kCkAwan 20s ease-in-out infinite alternate}',
    '@keyframes kCkAwan{from{transform:translateX(-16px)}to{transform:translateX(24px)}}',
    '.k-ck-burung{animation:kCkBob 3.2s ease-in-out infinite}',
    '@keyframes kCkBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}',
    '.k-ck-kedip{animation:kCkKedip 3s ease-in-out infinite}',
    '@keyframes kCkKedip{0%,100%{opacity:.35}50%{opacity:1}}',
    '.k-ck-label.tengah{transform:translateY(-50%)}',
    '.k-ck-label.kn{text-align:left}',
    '.k-ck-label.kr{text-align:right}'
  ].join('');

  function gambarCakrawala(k) {
    var S = keadaan(k), A = S.A, D = S.D, W = S.W, HT = S.HT, n = S.n;
    var bt = S.bt, buka = S.buka, aktif = S.aktif, semua = S.semua, tot = S.tot, maks = S.maks;
    var rnd = A.acakBenih(A.hashTeks(D.judul || 'cakrawala'));
    var i, j, q;

    if (k.css) k.css('kit-peta-cakrawala', CSS_CK);

    function r3(v) { return Math.round(v * 1000) / 1000; }
    function jepit(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function rc(x0, y0, x1, y1) { return { x0: x0, y0: y0, x1: x1, y1: y1 }; }

    /* ── tata letak: level 1 paling dekat (bawah), makin jauh makin dekat ke cakrawala ── */
    var cx = r1(W / 2), yh = 148, gy = yh + 10;
    var yDekat = HT - 56, yJauh = yh + 84, jarakY = yDekat - yJauh;
    var offDekat = Math.min(190, W * 0.19), offJauh = 116;
    var lw = 170, lwG = 176;
    var arah = rnd() < 0.5 ? 1 : -1;
    function kedalaman(y) { return jepit((yDekat - y) / jarakY, -0.4, 1.2); }
    var pts = [];
    for (i = 0; i < n; i++) {
      var py = n > 1 ? yDekat - jarakY * i / (n - 1) : yDekat - jarakY * 0.42;
      var du = kedalaman(py);
      var sd = arah * (i % 2 ? -1 : 1);
      var px = cx + sd * (offDekat - (offDekat - offJauh) * du + (rnd() - 0.5) * 10);
      pts.push({ x: r1(px), y: r1(py), s: r3(1 - 0.36 * du), sd: sd });
    }
    var sL = pts[n - 1].sd;

    /* ── jalan: kurva berkelok lewat semua rambu, lalu masuk ke gerbang ── */
    var spV = n > 1 ? jarakY / (n - 1) : jarakY;
    var wDasar = Math.min(40, 0.62 * spV);
    function lebarJalan(y) { return wDasar * (1 - 0.5 * kedalaman(y)); }
    function lerp2(p1, p2, t) { return { x: p1.x + (p2.x - p1.x) * t, y: p1.y + (p2.y - p1.y) * t }; }
    function bez(C, t) {
      var m = 1 - t;
      return {
        x: m * m * m * C[0].x + 3 * m * m * t * C[1].x + 3 * m * t * t * C[2].x + t * t * t * C[3].x,
        y: m * m * m * C[0].y + 3 * m * m * t * C[1].y + 3 * m * t * t * C[2].y + t * t * t * C[3].y
      };
    }
    function pecah(C, t) {
      var a1 = lerp2(C[0], C[1], t), b1 = lerp2(C[1], C[2], t), c1 = lerp2(C[2], C[3], t);
      var d1 = lerp2(a1, b1, t), e1 = lerp2(b1, c1, t), f1 = lerp2(d1, e1, t);
      return [[C[0], a1, d1, f1], [f1, e1, c1, C[3]]];
    }
    function potong(C, t0, t1) {
      var kiri = pecah(C, t1)[0];
      return t0 <= 0 ? kiri : pecah(kiri, t0 / t1)[1];
    }
    function dCubic(C) {
      return 'M' + r1(C[0].x) + ' ' + r1(C[0].y) + 'C' + r1(C[1].x) + ' ' + r1(C[1].y) + ' ' +
        r1(C[2].x) + ' ' + r1(C[2].y) + ' ' + r1(C[3].x) + ' ' + r1(C[3].y);
    }
    var awal = { x: pts[0].x - pts[0].sd * 40, y: HT + 18 };
    var P = [awal].concat(pts, [{ x: cx, y: gy + 4 }]);
    var ruas = [], contoh = [];
    for (j = 0; j < P.length - 1; j++) {
      var pa = P[j], pb = P[j + 1], pl = (pa.y - pb.y) * 0.5;
      var CC = [{ x: pa.x, y: pa.y }, { x: pa.x, y: pa.y - pl }, { x: pb.x, y: pb.y + pl }, { x: pb.x, y: pb.y }];
      ruas.push({ C: CC, buka: j === 0 ? true : (j === n ? semua : buka(j)), lewat: j === 0 ? true : bt(j - 1) > 0 });
      for (q = 0; q <= 12; q++) contoh.push(bez(CC, q / 12));
    }
    var M = n >= 4 ? 1 : (n === 1 ? 3 : 2);
    var potongan = [];
    ruas.forEach(function (sg) {
      for (var m = 0; m < M; m++) {
        var sub = M === 1 ? sg.C : potong(sg.C, m / M, (m + 1) / M);
        potongan.push({ d: dCubic(sub), w: lebarJalan(bez(sg.C, (m + 0.5) / M).y), buka: sg.buka });
      }
    });

    /* ── penempatan label dan area terlarang untuk hiasan ── */
    var rects = [], labN = [];
    pts.forEach(function (p) {
      var yc = r1(p.y - 48 * p.s), kanan = p.sd > 0;
      var kiri = r1(kanan ? p.x + 30 * p.s + 26 : p.x - 30 * p.s - 26 - lw);
      labN.push({ kiri: kiri, yc: yc, rata: kanan ? 'kn' : 'kr' });
      rects.push(rc(p.x - 48, p.y - 78 * p.s - 30, p.x + 48, p.y + 14));
      rects.push(rc(kiri - 4, yc - 36, kiri + lw + 4, yc + 36));
      var tx = p.x - p.sd * (30 * p.s + 52);
      rects.push(rc(tx - 34, p.y - 84, tx + 34, p.y - 4));
    });
    var kiriG = r1(-sL > 0 ? cx + 96 : cx - 96 - lwG), ycG = yh - 30;
    rects.push(rc(kiriG - 4, ycG - 34, kiriG + lwG + 4, ycG + 34));
    rects.push(rc(cx - 70, 56, cx + 70, gy + 12));
    rects.push(rc(cx - 112, 0, cx + 112, yh));
    rects.push(rc(cx + sL * 86 - 36, yh - 100, cx + sL * 86 + 36, yh - 18));

    /* ── hiasan: awan dan burung di langit; pohon dan batu di tanah ── */
    var JENIS = {
      awan: { b: [-40, 40, -26, 20], mak: 3, langit: true },
      burung: { b: [-13, 13, -12, 6], mak: 3, langit: true },
      pohon: { b: [-23, 23, -29, 32], mak: 3 },
      batu: { b: [-25, 25, -13, 18], mak: 2 }
    };
    var urut = ['awan', 'burung', 'pohon', 'awan', 'batu', 'burung', 'pohon'];
    var hias = [], jumlah = { awan: 0, burung: 0, pohon: 0, batu: 0 };
    function bentrok(bx) {
      var r, c, m = 8;
      for (r = 0; r < rects.length; r++) {
        if (!(bx.x1 + m < rects[r].x0 || bx.x0 - m > rects[r].x1 || bx.y1 + m < rects[r].y0 || bx.y0 - m > rects[r].y1)) return true;
      }
      for (c = 0; c < contoh.length; c++) {
        if (contoh[c].x > bx.x0 - 44 && contoh[c].x < bx.x1 + 44 && contoh[c].y > bx.y0 - 44 && contoh[c].y < bx.y1 + 44) return true;
      }
      for (c = 0; c < hias.length; c++) {
        var o = hias[c].bx;
        if (!(bx.x1 + 10 < o.x0 || bx.x0 - 10 > o.x1 || bx.y1 + 10 < o.y0 || bx.y0 - 10 > o.y1)) return true;
      }
      return false;
    }
    var coba = 0;
    while (hias.length < 9 && coba++ < 600) {
      var jn = urut[Math.floor(rnd() * urut.length)], jj = JENIS[jn];
      var hx = 30 + rnd() * (W - 60), r5 = rnd(), dl = rnd() * 4, sk, hy;
      if (jj.langit) { hy = 26 + r5 * 96; sk = 0.8 + rnd() * 0.4; }
      else { hy = yh + 30 + r5 * (HT - yh - 70); sk = r3(0.45 + 0.55 * (hy - yh) / (HT - yh)); }
      if (jumlah[jn] >= jj.mak) continue;
      var bb = { x0: hx + jj.b[0] * sk, x1: hx + jj.b[1] * sk, y0: hy + jj.b[2] * sk, y1: hy + jj.b[3] * sk };
      if (bb.x0 < 6 || bb.x1 > W - 6 || bb.y0 < 6 || bb.y1 > HT - 4) continue;
      if (bentrok(bb)) continue;
      hias.push({ j: jn, x: hx, y: hy, s: sk, bx: bb, dl: dl });
      jumlah[jn]++;
    }
    hias.sort(function (p1, p2) { return p1.y - p2.y; });
    var bintik = [];
    coba = 0;
    while (bintik.length < 8 && coba++ < 200) {
      var bx0 = 12 + rnd() * (W - 24), by0 = 10 + rnd() * (yh - 60), br = 0.8 + rnd() * 1.1, bd = rnd() * 3;
      var dalam = false;
      for (q = 0; q < rects.length; q++) {
        if (bx0 > rects[q].x0 - 8 && bx0 < rects[q].x1 + 8 && by0 > rects[q].y0 - 8 && by0 < rects[q].y1 + 8) { dalam = true; break; }
      }
      if (!dalam) bintik.push({ x: bx0, y: by0, r: br, d: bd });
    }

    /* ── SVG ── */
    var g = '<defs>' +
      '<linearGradient id="kck-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#161E57"/><stop offset=".55" stop-color="#4B3586"/><stop offset="1" stop-color="#D1618C"/></linearGradient>' +
      '<linearGradient id="kck-t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#463863"/><stop offset="1" stop-color="#1B1530"/></linearGradient>' +
      '<linearGradient id="kck-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--c1)"/><stop offset="1" style="stop-color:var(--c2)"/></linearGradient>' +
      '<radialGradient id="kck-h"><stop offset="0" style="stop-color:var(--aksen)" stop-opacity=".6"/><stop offset="1" style="stop-color:var(--aksen)" stop-opacity="0"/></radialGradient>' +
      '</defs>';
    g += '<rect x="0" y="0" width="' + W + '" height="' + (yh + 4) + '" fill="url(#kck-s)"/>';
    bintik.forEach(function (b) {
      g += '<circle cx="' + r1(b.x) + '" cy="' + r1(b.y) + '" r="' + r1(b.r) + '" fill="#fff" opacity=".8"' +
        (b.d > 1.2 ? ' class="k-ck-kedip" style="animation-delay:-' + r1(b.d) + 's"' : '') + '/>';
    });

    /* matahari di belakang gerbang; sinar berputar hanya bila semua selesai */
    var sy = yh - 22;
    g += '<circle cx="' + cx + '" cy="' + sy + '" r="140" fill="url(#kck-h)" opacity="' + (semua ? 1 : 0.45) + '"/>';
    if (semua) {
      g += '<g class="k-ck-sinar">';
      for (i = 0; i < 12; i++) {
        g += '<path d="M' + cx + ' ' + sy + 'L' + (cx - 8) + ' ' + (sy - 100) + 'L' + (cx + 8) + ' ' + (sy - 100) + 'Z" transform="rotate(' + (i * 30) + ' ' + cx + ' ' + sy + ')" style="fill:var(--aksen)" opacity=".3"/>';
      }
      g += '</g>';
    }
    g += '<g class="k-ck-surya"><circle cx="' + cx + '" cy="' + sy + '" r="62" style="fill:var(--aksen)" opacity="' + (semua ? 1 : 0.55) + '"/>' +
      '<circle cx="' + cx + '" cy="' + sy + '" r="62" fill="none" stroke="#fff" stroke-width="2" opacity=".3"/></g>';

    /* bukit jauh */
    function bukit(tinggi, banyak, isi) {
      var d = 'M0 ' + (yh + 2) + 'V' + r1(yh - tinggi * (0.4 + rnd() * 0.5)), sg = W / banyak, qq;
      for (qq = 0; qq < banyak; qq++) {
        d += 'Q' + r1(sg * (qq + 0.5)) + ' ' + r1(yh - tinggi * (0.9 + rnd() * 0.6)) + ' ' + r1(sg * (qq + 1)) + ' ' + r1(yh - tinggi * (0.2 + rnd() * 0.6));
      }
      return '<path d="' + d + 'V' + (yh + 2) + 'Z" fill="' + isi + '"/>';
    }
    g += bukit(50, 4, '#3B2C70') + bukit(30, 6, '#2A1E55');

    /* awan dan burung */
    hias.forEach(function (h) {
      if (h.j === 'awan') g += '<g class="k-ck-awan" style="animation-delay:-' + r1(h.dl * 4) + 's">' + A.svgHiasan('awan', r1(h.x), r1(h.y), r1(h.s)) + '</g>';
      else if (h.j === 'burung') {
        g += '<g transform="translate(' + r1(h.x) + ' ' + r1(h.y) + ') scale(' + r1(h.s) + ')"><g class="k-ck-burung" style="animation-delay:-' + r1(h.dl) + 's">' +
          '<path d="M-11 2Q-5.5-8 0 1Q5.5-8 11 2" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/></g></g>';
      }
    });

    /* tanah */
    g += '<rect x="0" y="' + yh + '" width="' + W + '" height="' + (HT - yh) + '" fill="url(#kck-t)"/>' +
      '<rect x="0" y="' + yh + '" width="' + W + '" height="' + (HT - yh) + '" style="fill:var(--c2)" opacity=".16"/>' +
      '<path d="M0 ' + yh + 'H' + W + '" stroke="#fff" stroke-width="2" opacity=".22"/>';
    hias.forEach(function (h) {
      if (h.j === 'pohon' || h.j === 'batu') g += A.svgHiasan(h.j, r1(h.x), r1(h.y), h.s);
    });

    /* jalan: bayangan, tepi, isi (terkunci lebih gelap), lalu garis tengah */
    g += '<g fill="none" stroke-linecap="round" stroke-linejoin="round">';
    potongan.forEach(function (p) {
      g += '<path d="' + p.d + '" stroke="rgba(0,0,0,.3)" stroke-width="' + r1(p.w + 8) + '" transform="translate(0 5)"/>';
    });
    potongan.forEach(function (p) {
      g += '<path d="' + p.d + '" ' + (p.buka ? 'style="stroke:var(--lip)"' : 'stroke="#463F5C"') + ' stroke-width="' + r1(p.w + 6) + '"/>';
    });
    potongan.forEach(function (p) {
      g += '<path d="' + p.d + '" ' + (p.buka ? 'style="stroke:var(--kertas)"' : 'stroke="#8E86A3"') + ' stroke-width="' + r1(p.w) + '"/>';
    });
    ruas.forEach(function (sg) {
      var d = dCubic(sg.C);
      if (sg.buka && sg.lewat) g += '<path class="k-ck-kedip" d="' + d + '" style="stroke:var(--c2)" stroke-width="4" stroke-dasharray="11 9"/>';
      else if (sg.buka) g += '<path d="' + d + '" style="stroke:var(--lip)" stroke-width="3" stroke-dasharray="9 10" opacity=".32"/>';
      else g += '<path d="' + d + '" stroke="rgba(255,255,255,.3)" stroke-width="2.5" stroke-dasharray="3 9"/>';
    });
    g += '</g>';

    /* gerbang di cakrawala */
    var LENG = 'M-44 0V-62A44 30 0 0 1 44 -62V0Z';
    g += '<g class="k-ck-peti' + (semua ? ' buka' : '') + '" role="button" tabindex="0"><g transform="translate(' + cx + ' ' + gy + ') scale(0.74)">' +
      '<ellipse cx="0" cy="4" rx="78" ry="9" fill="rgba(0,0,0,.32)"/>' +
      '<path d="' + LENG + '" fill="#1A1233"/>';
    if (semua) {
      g += '<path d="' + LENG + '" style="fill:var(--aksen)" opacity=".55"/>' +
        '<g class="k-ck-isi">' + A.svgBintang(0, -44, 28, true) + '<circle cx="-8" cy="-54" r="5" fill="#fff" opacity=".6"/></g>';
    } else {
      g += '<path d="' + LENG + '" fill="#7C7094" stroke="#463F5C" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="M0 -90V0M-22 -80V0M22 -80V0" fill="none" stroke="#463F5C" stroke-width="2" opacity=".5"/>' +
        A.svgGembok(0, -38);
    }
    g += '<rect x="-62" y="-62" width="18" height="62" rx="2" style="fill:var(--kertas);stroke:var(--lip)" stroke-width="3.5"/>' +
      '<rect x="44" y="-62" width="18" height="62" rx="2" style="fill:var(--kertas);stroke:var(--lip)" stroke-width="3.5"/>' +
      '<path d="M-62 -62A62 42 0 0 1 62 -62L44 -62A44 30 0 0 0 -44 -62Z" style="fill:var(--kertas);stroke:var(--lip)" stroke-width="3.5" stroke-linejoin="round"/>' +
      '<path d="M-9 -104L9 -104L7 -90L-7 -90Z" style="fill:var(--aksen);stroke:var(--lip)" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<rect x="-72" y="-108" width="144" height="116" fill="transparent"/></g></g>';

    /* rambu level */
    function rambuSvg(p, idx) {
      var b = buka(idx), st = bt(idx), x = p.x, y = p.y, s = p.s, yc = r1(y - 48 * s);
      var tepi = b ? 'var(--lip)' : '#5E6770', isi = b ? 'url(#kck-g)' : '#AEB6BE';
      var h = '<g class="k-ck-titik' + (b ? '' : ' kunci') + '" data-i="' + idx + '" role="button" tabindex="0">' +
        '<ellipse cx="' + x + '" cy="' + r1(y + 3) + '" rx="' + r1(30 * s) + '" ry="' + r1(8 * s) + '" fill="rgba(0,0,0,.35)"/>';
      if (idx === aktif) h += '<circle class="k-ck-cincin" cx="' + x + '" cy="' + yc + '" r="' + r1(36 * s) + '" fill="none" style="stroke:var(--aksen)" stroke-width="4"/>';
      h += '<g class="k-ck-bulat' + (idx === aktif ? ' k-ck-aktif' : '') + '"><g transform="translate(' + x + ' ' + yc + ') scale(' + s + ')">' +
        '<rect x="-5" y="20" width="10" height="30" rx="3" style="fill:' + tepi + '"/>' +
        '<circle cx="0" cy="4" r="30" style="fill:' + tepi + '"/>' +
        '<circle cx="0" cy="0" r="30" style="fill:' + isi + ';stroke:' + tepi + '" stroke-width="3.5"/>' +
        '<circle cx="0" cy="0" r="23.5" fill="none" stroke="#fff" stroke-width="2" opacity="' + (b ? '.5' : '.3') + '"/>' +
        '<ellipse cx="-9" cy="-15" rx="10" ry="4.5" transform="rotate(-22 -9 -15)" fill="#fff" opacity=".4"/>' +
        '<text x="0" y="11" text-anchor="middle" font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700" font-size="32" style="fill:' + tepi + '">' + (idx + 1) + '</text></g></g>';
      if (b) {
        var ys = r1(y - 78 * s - 16);
        h += A.svgBintang(r1(x - 24), r1(ys + 5), 9, st >= 1) + A.svgBintang(x, ys, 11, st >= 2) + A.svgBintang(r1(x + 24), r1(ys + 5), 9, st >= 3);
      } else h += A.svgGembok(r1(x - p.sd * (24 * s + 4)), r1(yc - 22 * s - 8));
      h += '<circle cx="' + x + '" cy="' + yc + '" r="40" fill="transparent"/></g>';
      return h;
    }
    pts.forEach(function (p, idx) { g += rambuSvg(p, idx); });

    var wadah = A.el('div', 'k-ck');
    wadah.style.height = HT + 'px';
    wadah.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + HT + '" preserveAspectRatio="none">' + g + '</svg>';

    /* label: di samping luar rambu, rata ke arah luar; huruf tidak ikut mengecil */
    pts.forEach(function (p, idx) {
      var judul = (k.judulLevel ? k.judulLevel(idx) : '') || ('Level ' + (idx + 1));
      var lb = labN[idx];
      wadah.appendChild(buatLabel(A, 'k-ck-label tengah ' + lb.rata, lb.kiri + lw / 2, lb.yc, lw,
        A.fmt(judul), A.esc(k.namaMesin ? k.namaMesin(idx) : ''), !buka(idx)));
    });
    wadah.appendChild(buatLabel(A, 'k-ck-label tengah ' + (-sL > 0 ? 'kn' : 'kr'), kiriG + lwG / 2, ycG, lwG,
      '<svg width="20" height="20" viewBox="0 0 20 20">' + A.svgBintang(10, 11, 9, true) + '</svg>' + tot + ' / ' + maks,
      semua ? 'Ketuk gerbang!' : 'Selesaikan semua level', false));

    /* sentuhan */
    Array.prototype.forEach.call(wadah.querySelectorAll('.k-ck-titik'), function (t) {
      var idx = +t.getAttribute('data-i');
      var jd = (k.judulLevel ? k.judulLevel(idx) : '') || '';
      t.setAttribute('aria-label', 'Level ' + (idx + 1) + (jd ? ': ' + jd : '') + (buka(idx) ? '' : ' (terkunci)'));
      pasangKlik(t, function () { k.pilih(idx, t); });
    });
    var pt = wadah.querySelector('.k-ck-peti');
    if (pt) {
      pt.setAttribute('aria-label', 'Tujuan akhir: gerbang matahari' + (semua ? '' : ' (terkunci)'));
      pasangKlik(pt, function () { k.akhir(pt); });
    }

    k.w.appendChild(wadah);

    /* penanda: di sisi dalam rambu aktif (dekat jalan); di samping gerbang bila semua selesai */
    var pos = pts.map(function (p) { return { x: r1(p.x - p.sd * (30 * p.s + 52)), y: r1(p.y - 6) }; });
    pos.push({ x: r1(cx + sL * 86), y: r1(yh - 20) });
    k.penanda(wadah, pos);
  }

  /* ══════════════ gaya "berliku" ══════════════
   * Jalan serpentin berundak, dua baris: baris atas berjalan kiri ke kanan, berbelok
   * setengah lingkaran di tepi kanan, baris bawah kembali kanan ke kiri. Simpul berupa
   * ubin batu bersudut membulat (nomor + bintang di dalamnya); label di luar jalan
   * (baris atas di atas, baris bawah di bawah). Tujuan akhir: gerbang lengkung yang
   * pintunya membuka bila semua level selesai. Latar: petak sawah berundak mengikuti jalan.
   * Gerak: jejak langkah menyala bergiliran di ruas menuju level aktif (atau gerbang),
   * awan, burung, jendela gubuk berkedip; saat semua selesai pintu gerbang membuka.
   */
  var CSS_BL = [
    '.k-bl{position:absolute;left:0;right:0;top:58px}',
    '.k-bl>svg{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible}',
    '.k-bl-titik{cursor:pointer;outline:none}',
    '.k-bl-titik.kunci{cursor:not-allowed}',
    '.k-bl-titik:not(.kunci):hover .k-bl-ubin{filter:brightness(1.08)}',
    '.k-bl-titik:focus-visible .k-bl-ubin{filter:drop-shadow(0 0 6px #fff)}',
    '.k-bl-ubin,.k-bl-cincin,.k-bl-pintu,.k-bl-sinar,.k-bl-awan,.k-bl-burung,.k-bl-kilau{transform-box:fill-box;transform-origin:center}',
    '.k-bl-aktif{animation:kBlDenyut 1.6s ease-in-out infinite}',
    '@keyframes kBlDenyut{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}',
    '.k-bl-cincin{animation:kBlCincin 1.8s ease-out infinite}',
    '@keyframes kBlCincin{0%{transform:scale(1);opacity:.9}100%{transform:scale(1.28);opacity:0}}',
    '.k-bl-jejak{opacity:.5;animation:kBlJejak 5s ease-in-out infinite}',
    '@keyframes kBlJejak{0%{opacity:0}6%{opacity:.85}20%{opacity:.85}32%,100%{opacity:0}}',
    '.k-bl-peti{cursor:pointer;outline:none}',
    '.k-bl-peti:focus-visible .k-bl-gerbang{filter:drop-shadow(0 0 6px #fff)}',
    '.k-bl-pintu.kr{transform-origin:left center}',
    '.k-bl-pintu.kn{transform-origin:right center}',
    '.k-bl-peti.buka .k-bl-pintu{transform:scaleX(.16);animation:kBlBuka 1.2s .3s cubic-bezier(.3,1.25,.5,1) both}',
    '@keyframes kBlBuka{from{transform:scaleX(1)}to{transform:scaleX(.16)}}',
    '.k-bl-sinar{pointer-events:none;animation:kBlPutar 12s linear infinite}',
    '@keyframes kBlPutar{to{transform:rotate(360deg)}}',
    '.k-bl-kilau{pointer-events:none;animation:kBlKilau 3s ease-in-out infinite}',
    '@keyframes kBlKilau{0%,100%{transform:scale(.7);opacity:.4}50%{transform:scale(1.1);opacity:1}}',
    '.k-bl-awan{pointer-events:none;animation:kBlAwan 16s ease-in-out infinite alternate}',
    '@keyframes kBlAwan{from{transform:translateX(-14px)}to{transform:translateX(22px)}}',
    '.k-bl-burung{animation:kBlBob 3s ease-in-out infinite}',
    '@keyframes kBlBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}',
    '.k-bl-kedip{animation:kBlKedip 2.6s ease-in-out infinite}',
    '@keyframes kBlKedip{0%,100%{opacity:.55}50%{opacity:1}}',
    '.k-bl-label{position:absolute;color:#fff;pointer-events:none;text-align:center;',
    'text-shadow:0 2px 0 rgba(var(--gelap),.95),0 0 10px rgba(var(--gelap),.85)}',
    '.k-bl-label.atas{transform:translateY(-100%)}',
    '.k-bl-label .jd{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;',
    'font-family:Fredoka,sans-serif;font-weight:600;font-size:18px;line-height:1.12;word-break:break-word}',
    '.k-bl-label small{display:block;font-weight:800;font-size:14px;opacity:.88;margin-top:3px;letter-spacing:.3px;',
    'white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.k-bl-label.kunci{opacity:.72}',
    '.k-bl-label svg{vertical-align:-3px;margin-right:4px}',
    '@media (prefers-reduced-motion:reduce){.k-bl *{animation:none!important}}'
  ].join('');

  function gubukSvg(x, y, s) {
    var t = 'transform="translate(' + r1(x) + ' ' + r1(y) + ') scale(' + r1(s) + ')"';
    return '<g ' + t + '><ellipse cx="0" cy="18" rx="28" ry="5" fill="rgba(0,0,0,.22)"/>' +
      '<rect x="-18" y="-6" width="36" height="24" rx="2" fill="#B9854A" style="stroke:var(--lip)" stroke-width="2.2"/>' +
      '<path d="M-26-4L0-28L26-4Z" style="fill:var(--c2);stroke:var(--lip)" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<rect x="-5" y="4" width="10" height="14" rx="2" style="fill:rgba(var(--gelap),.75)"/>' +
      '<rect class="k-bl-kedip" x="8" y="-1" width="6" height="6" rx="1" fill="#FFE9A8"/></g>';
  }

  /* gerbang lengkung: (x, y) = tengah jalan di dasar gerbang */
  function gerbangSvg(x, y, terbuka) {
    var tepi = terbuka ? 'var(--lip)' : '#5E6770';
    var batu = terbuka ? 'var(--kertas)' : '#D7DCE1';
    var rongga = 'M' + (x - 30) + ' ' + (y + 34) + 'V' + (y - 34) + 'A30 30 0 0 1 ' + (x + 30) + ' ' + (y - 34) + 'V' + (y + 34) + 'Z';
    var luar = 'M' + (x - 48) + ' ' + (y + 34) + 'V' + (y - 34) + 'A48 48 0 0 1 ' + (x + 48) + ' ' + (y - 34) + 'V' + (y + 34) + 'Z';
    var kiri = 'M' + (x - 30) + ' ' + (y + 34) + 'V' + (y - 34) + 'A30 30 0 0 1 ' + x + ' ' + (y - 64) + 'V' + (y + 34) + 'Z';
    var kanan = 'M' + (x + 30) + ' ' + (y + 34) + 'V' + (y - 34) + 'A30 30 0 0 0 ' + x + ' ' + (y - 64) + 'V' + (y + 34) + 'Z';
    var isiPintu = terbuka ? 'var(--c1)' : '#AEB6BE';
    var h = '<g class="k-bl-gerbang">' +
      '<ellipse cx="' + x + '" cy="' + (y + 38) + '" rx="70" ry="8" fill="rgba(0,0,0,.28)"/>' +
      '<path d="' + rongga + '" style="fill:' + (terbuka ? 'var(--aksen)' : 'rgba(var(--gelap),.85)') + '"/>';
    if (terbuka) h += '<ellipse cx="' + x + '" cy="' + (y - 4) + '" rx="17" ry="34" fill="#fff" opacity=".6"/>';
    h += '<g class="k-bl-pintu kr"><path d="' + kiri + '" style="fill:' + isiPintu + ';stroke:' + tepi + '" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M' + (x - 15) + ' ' + (y + 30) + 'V' + (y - 46) + '" stroke="' + tepi + '" stroke-width="2" opacity=".3"/>' +
      '<circle cx="' + (x - 6) + '" cy="' + (y + 6) + '" r="3" style="fill:' + tepi + '"/></g>' +
      '<g class="k-bl-pintu kn"><path d="' + kanan + '" style="fill:' + isiPintu + ';stroke:' + tepi + '" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M' + (x + 15) + ' ' + (y + 30) + 'V' + (y - 46) + '" stroke="' + tepi + '" stroke-width="2" opacity=".3"/>' +
      '<circle cx="' + (x + 6) + '" cy="' + (y + 6) + '" r="3" style="fill:' + tepi + '"/></g>' +
      '<path d="' + luar + rongga + '" fill-rule="evenodd" style="fill:' + batu + ';stroke:' + tepi + '" stroke-width="3.5" stroke-linejoin="round"/>' +
      '<path d="M' + (x - 40) + ' ' + (y + 26) + 'V' + (y - 30) + '" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>' +
      '<path d="M' + (x - 42) + ' ' + (y - 4) + 'h12M' + (x + 30) + ' ' + (y + 12) + 'h12M' + (x - 42) + ' ' + (y + 18) + 'h12M' + (x + 30) + ' ' + (y - 14) + 'h12" stroke="' + tepi + '" stroke-width="2" opacity=".28"/>';
    return h + '</g>';
  }

  function gambarBerliku(k) {
    var S = keadaan(k), A = S.A, D = S.D, W = S.W, HT = S.HT, n = S.n;
    var bt = S.bt, buka = S.buka, aktif = S.aktif, semua = S.semua, tot = S.tot, maks = S.maks;
    var rnd = A.acakBenih(A.hashTeks(D.judul || 'berliku'));
    var i;

    if (k.css) k.css('kit-peta-berliku', CSS_BL);

    /* ── tata letak: dua baris, belokan di kanan; stasiun 0..n-1 level, n gerbang ── */
    var y1 = Math.round(HT * 0.265), y2 = HT - y1, ym = (y1 + y2) / 2, rr = (y2 - y1) / 2;
    var xR = W - 200, LW = 168;
    var sTot = n + 1, nAtas = Math.ceil(sTot / 2), C = Math.max(2, nAtas);
    var xL = C === 2 ? Math.max(150, xR - 520) : 150;
    var sp = (xR - xL) / (C - 1);
    var st = [];
    for (i = 0; i <= n; i++) {
      var baris = i < nAtas ? 0 : 1;
      var kol = baris === 0 ? i : C - 1 - (i - nAtas);
      st.push({ x: r1(xL + sp * kol), y: baris ? y2 : y1, b: baris });
    }
    var mulai = { x: -30, y: y1, b: 0 }, goal = st[n];

    function dRuas(a, b) {
      if (a.b === b.b) return 'M' + r1(a.x) + ' ' + a.y + 'H' + r1(b.x);
      return 'M' + r1(a.x) + ' ' + y1 + 'H' + xR + 'A' + r1(rr) + ' ' + r1(rr) + ' 0 0 1 ' + xR + ' ' + y2 + 'H' + r1(b.x);
    }
    /* titik-titik di sepanjang ruas, searah perjalanan (a = sudut singgung dalam derajat) */
    function titikRuas(a, b, lg) {
      var out = [], d, len;
      function garis(x0, x1, y) {
        var arah = x1 >= x0 ? 1 : -1, pj = Math.abs(x1 - x0), q;
        for (q = 0; q < pj; q += lg) out.push({ x: x0 + arah * q, y: y, a: arah > 0 ? 0 : 180 });
      }
      if (a.b === b.b) garis(a.x, b.x, a.y);
      else {
        garis(a.x, xR, y1);
        len = Math.PI * rr;
        for (d = 0; d < len; d += lg) {
          var th = -Math.PI / 2 + d / rr;
          out.push({ x: xR + rr * Math.cos(th), y: ym + rr * Math.sin(th), a: Math.atan2(Math.cos(th), -Math.sin(th)) * 180 / Math.PI });
        }
        garis(xR, b.x, y2);
      }
      out.push({ x: b.x, y: b.y, a: out.length ? out[out.length - 1].a : 0 });
      return out;
    }

    var jalan = [];
    for (i = 0; i <= n; i++) jalan = jalan.concat(titikRuas(i === 0 ? mulai : st[i - 1], st[i], 8));

    /* ── area terlarang untuk hiasan: ubin, label, gerbang, penanda ── */
    var rects = [];
    function rk(x0, y0, x1, y1) { rects.push({ x0: x0, y0: y0, x1: x1, y1: y1 }); }
    for (i = 0; i < n; i++) {
      var pa = st[i], dir = pa.b === 0 ? 1 : -1;
      rk(pa.x - 46, pa.y - 46, pa.x + 46, pa.y + 52);
      if (pa.b === 0) rk(pa.x - LW / 2, pa.y - 114, pa.x + LW / 2, pa.y - 48);
      else rk(pa.x - LW / 2, pa.y + 56, pa.x + LW / 2, pa.y + 122);
      rk(pa.x + dir * 100 - 36, pa.y - 54, pa.x + dir * 100 + 36, pa.y + 30);
    }
    rk(goal.x - 66, goal.y - 116, goal.x + 66, goal.y + 46);
    rk(goal.x - 94, goal.y + 56, goal.x + 94, goal.y + 122);
    rk(goal.x - 142, goal.y - 54, goal.x - 70, goal.y + 30);

    /* ── hiasan: awan, burung (langit); pohon, batu, gubuk (petak) ── */
    var JENIS = {
      awan: { b: [-38, 38, -24, 18], mak: 3 },
      burung: { b: [-13, 13, -10, 5], mak: 2 },
      pohon: { b: [-23, 23, -29, 32], mak: 4 },
      batu: { b: [-25, 25, -13, 18], mak: 2 },
      gubuk: { b: [-28, 28, -28, 23], mak: 1 }
    };
    var hias = [], jumlah = { awan: 0, burung: 0, pohon: 0, batu: 0, gubuk: 0 };
    var urut = ['awan', 'burung', 'pohon', 'pohon', 'batu', 'gubuk', 'pohon', 'awan'];
    function bentrok(bx) {
      var r, c, q, m = 6;
      for (r = 0; r < rects.length; r++) {
        if (!(bx.x1 + m < rects[r].x0 || bx.x0 - m > rects[r].x1 || bx.y1 + m < rects[r].y0 || bx.y0 - m > rects[r].y1)) return true;
      }
      for (q = 0; q < jalan.length; q++) {
        if (jalan[q].x > bx.x0 - 30 && jalan[q].x < bx.x1 + 30 && jalan[q].y > bx.y0 - 30 && jalan[q].y < bx.y1 + 30) return true;
      }
      for (c = 0; c < hias.length; c++) {
        var o = hias[c].bx;
        if (!(bx.x1 + 8 < o.x0 || bx.x0 - 8 > o.x1 || bx.y1 + 8 < o.y0 || bx.y0 - 8 > o.y1)) return true;
      }
      return false;
    }
    var coba = 0;
    while (hias.length < 9 && coba++ < 700) {
      var jenis = urut[Math.floor(rnd() * urut.length)];
      var langit = jenis === 'awan' || jenis === 'burung';
      var sk = langit ? 0.85 + rnd() * 0.3 : 0.85 + rnd() * 0.25;
      var hx = 30 + rnd() * (W - 60);
      var hy = langit ? 24 + rnd() * 78 : y1 + 62 + rnd() * (y2 - y1 - 124);
      var dl = rnd() * 4;
      if (jumlah[jenis] >= JENIS[jenis].mak) continue;
      var bb = JENIS[jenis].b;
      var bx = { x0: hx + bb[0] * sk, x1: hx + bb[1] * sk, y0: hy + bb[2] * sk, y1: hy + bb[3] * sk };
      if (bx.x0 < 6 || bx.x1 > W - 6 || bx.y0 < 6 || bx.y1 > HT - 4) continue;
      if (bentrok(bx)) continue;
      hias.push({ j: jenis, x: hx, y: hy, s: sk, bx: bx, dl: dl });
      jumlah[jenis]++;
    }
    hias.sort(function (p, q) { return p.y - q.y; });

    /* ── SVG ── */
    var g = '<defs>' +
      '<linearGradient id="kbl-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--c1)"/><stop offset="1" style="stop-color:var(--c2)"/></linearGradient>' +
      '<linearGradient id="kbl-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="kbl-h"><stop offset="0" style="stop-color:var(--aksen)" stop-opacity=".55"/><stop offset="1" style="stop-color:var(--aksen)" stop-opacity="0"/></radialGradient>' +
      '</defs>';
    g += '<rect x="0" y="0" width="' + W + '" height="' + HT + '" fill="url(#kbl-s)"/>';

    /* petak sawah berundak: tiga lapis pita mengikuti jalan, alur bajak melintang */
    var dJalan = dRuas(mulai, goal);
    var gp = ' d="' + dJalan + '" fill="none" stroke-linejoin="round"';
    g += '<path' + gp + ' stroke-linecap="round" style="stroke:rgba(var(--gelap),.12)" stroke-width="188"/>' +
      '<path' + gp + ' stroke-linecap="round" style="stroke:rgba(var(--gelap),.14)" stroke-width="148"/>' +
      '<path' + gp + ' stroke-linecap="round" style="stroke:rgba(var(--gelap),.16)" stroke-width="110"/>' +
      '<path' + gp + ' stroke="rgba(255,255,255,.055)" stroke-width="148" stroke-dasharray="2.5 13"/>';

    /* cahaya di belakang gerbang; sinar berputar hanya bila semua selesai */
    var gy = goal.y - 20;
    g += '<circle cx="' + goal.x + '" cy="' + gy + '" r="130" fill="url(#kbl-h)" opacity="' + (semua ? 1 : 0.3) + '"/>';

    hias.forEach(function (h) {
      var dly = ' style="animation-delay:-' + r1(h.dl) + 's"';
      var isi;
      if (h.j === 'awan') isi = '<g class="k-bl-awan"' + dly + '>' + A.svgHiasan('awan', h.x, h.y, h.s) + '</g>';
      else if (h.j === 'burung') {
        isi = '<g transform="translate(' + r1(h.x) + ' ' + r1(h.y) + ') scale(' + r1(h.s) + ')"><g class="k-bl-burung"' + dly + '>' +
          '<path d="M-11 2Q-5.5-8 0 1Q5.5-8 11 2" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/></g></g>';
      } else if (h.j === 'gubuk') isi = gubukSvg(h.x, h.y, h.s);
      else isi = A.svgHiasan(h.j, h.x, h.y, h.s);
      g += '<g class="k-bl-hias">' + isi + '</g>';
    });

    /* jalan: ruas terbuka berlapis, ruas terkunci titik-titik, ruas yang sudah dilalui bergaris warna */
    var dBuka = '', dLewat = '', dKunci = '';
    for (i = 0; i <= n; i++) {
      var dr = dRuas(i === 0 ? mulai : st[i - 1], st[i]);
      if (i < n ? buka(i) : semua) {
        dBuka += dr;
        if (i > 0 && bt(i - 1) > 0) dLewat += dr;
      } else dKunci += dr;
    }
    if (dKunci) g += '<path d="' + dKunci + '" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round"/>';
    if (dBuka) {
      g += '<path d="' + dBuka + '" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="48" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 5)"/>' +
        '<path d="' + dBuka + '" fill="none" style="stroke:var(--lip)" stroke-width="46" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="' + dBuka + '" fill="none" style="stroke:var(--kertas)" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="' + dBuka + '" fill="none" style="stroke:var(--lip)" stroke-width="4" stroke-dasharray="12 12" stroke-linecap="round" opacity=".28"/>';
    }
    if (dLewat) g += '<path d="' + dLewat + '" fill="none" style="stroke:var(--c2)" stroke-width="7" stroke-dasharray="14 10" stroke-linecap="round" stroke-linejoin="round"/>';

    /* jejak langkah bergiliran di ruas menuju level aktif (atau ke gerbang bila semua selesai) */
    var rj = aktif >= 0 ? aktif : n;
    var P = titikRuas(rj === 0 ? mulai : st[rj - 1], st[rj], 4);
    var idxJ = [], pi;
    for (pi = rj === 0 ? 0 : 14; pi < P.length - 14; pi += 10) if (P[pi].x > 8) idxJ.push(pi);
    var durJ = r1(idxJ.length * 0.2 + 1.6);
    idxJ.forEach(function (ix, u) {
      var p = P[ix], rad = p.a * Math.PI / 180, sg = u % 2 ? 1 : -1;
      var fx = r1(p.x - Math.sin(rad) * 6.5 * sg), fy = r1(p.y + Math.cos(rad) * 6.5 * sg);
      g += '<ellipse class="k-bl-jejak" cx="' + fx + '" cy="' + fy + '" rx="7" ry="4.2" transform="rotate(' + r1(p.a) + ' ' + fx + ' ' + fy + ')" ' +
        'style="fill:var(--lip);animation-delay:' + r1(u * 0.2) + 's;animation-duration:' + durJ + 's"/>';
    });

    if (semua) {
      g += '<g class="k-bl-sinar">';
      for (i = 0; i < 8; i++) {
        g += '<path d="M' + goal.x + ' ' + gy + 'L' + (goal.x - 7) + ' ' + (gy - 84) + 'L' + (goal.x + 7) + ' ' + (gy - 84) + 'Z" transform="rotate(' + (i * 45) + ' ' + goal.x + ' ' + gy + ')" style="fill:var(--aksen)" opacity=".28"/>';
      }
      g += '</g>';
    }

    /* ubin level */
    function ubinSvg(idx) {
      var b = buka(idx), s = bt(idx), x = st[idx].x, y = st[idx].y;
      var tepi = b ? 'var(--lip)' : '#5E6770';
      var isi = b ? 'url(#kbl-g)' : '#AEB6BE';
      var h = '<g class="k-bl-titik' + (b ? '' : ' kunci') + '" data-i="' + idx + '" role="button" tabindex="0">';
      if (idx === aktif) h += '<rect class="k-bl-cincin" x="' + (x - 42) + '" y="' + (y - 42) + '" width="84" height="84" rx="18" fill="none" style="stroke:var(--aksen)" stroke-width="5"/>';
      h += '<g class="k-bl-ubin' + (idx === aktif ? ' k-bl-aktif' : '') + '">' +
        '<ellipse cx="' + x + '" cy="' + (y + 50) + '" rx="40" ry="6" fill="rgba(0,0,0,.28)"/>' +
        '<rect x="' + (x - 42) + '" y="' + (y - 36) + '" width="84" height="84" rx="18" style="fill:' + tepi + '"/>' +
        '<rect x="' + (x - 42) + '" y="' + (y - 42) + '" width="84" height="84" rx="18" style="fill:' + isi + ';stroke:' + tepi + '" stroke-width="3.5"/>' +
        '<rect x="' + (x - 35) + '" y="' + (y - 35) + '" width="70" height="70" rx="12" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="2"/>' +
        '<rect x="' + (x - 30) + '" y="' + (y - 38) + '" width="38" height="5" rx="2.5" fill="#fff" opacity=".42"/>' +
        '<text x="' + x + '" y="' + (y + 2) + '" text-anchor="middle" font-family="Fredoka,Trebuchet MS,sans-serif" font-weight="700" font-size="34" style="fill:' + tepi + '">' + (idx + 1) + '</text>';
      if (b) h += A.svgBintang(x - 24, y + 28, 8.5, s >= 1) + A.svgBintang(x, y + 26, 10, s >= 2) + A.svgBintang(x + 24, y + 28, 8.5, s >= 3);
      else h += A.svgGembok(x, y + 24);
      h += '</g><rect x="' + (x - 46) + '" y="' + (y - 46) + '" width="92" height="98" fill="transparent"/></g>';
      return h;
    }
    for (i = 0; i < n; i++) g += ubinSvg(i);

    /* tujuan akhir: gerbang */
    g += '<g class="k-bl-peti' + (semua ? ' buka' : '') + '" role="button" tabindex="0">' + gerbangSvg(goal.x, goal.y, semua);
    g += '<g class="k-bl-kilau" style="animation-delay:-0.4s"><g transform="translate(' + goal.x + ' ' + (goal.y - 98) + ')">' + A.svgBintang(0, 0, 12, semua) + '</g></g>';
    if (!semua) g += A.svgGembok(goal.x, goal.y + 4);
    else {
      [[-52, -70, 0], [54, -58, 1.2], [4, -126, 2.1]].forEach(function (q) {
        g += '<g transform="translate(' + (goal.x + q[0]) + ' ' + (goal.y + q[1]) + ')"><g class="k-bl-kilau" style="animation-delay:-' + q[2] + 's">' +
          '<path d="M0-12Q2-2 12 0Q2 2 0 12Q-2 2-12 0Q-2-2 0-12Z" fill="#fff"/></g></g>';
      });
    }
    g += '<rect x="' + (goal.x - 56) + '" y="' + (goal.y - 114) + '" width="112" height="158" fill="transparent"/></g>';

    var wadah = A.el('div', 'k-bl');
    wadah.style.height = HT + 'px';
    wadah.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + HT + '" preserveAspectRatio="none">' + g + '</svg>';

    /* label: baris atas di atas ubin, baris bawah di bawah ubin */
    function labelBl(cx, y, atas, jd, kecil, kunci) {
      var dv = A.el('div', 'k-bl-label' + (atas ? ' atas' : '') + (kunci ? ' kunci' : ''), '<span class="jd">' + jd + '</span><small>' + kecil + '</small>');
      dv.style.left = r1(cx - LW / 2) + 'px';
      dv.style.top = r1(y) + 'px';
      dv.style.width = LW + 'px';
      return dv;
    }
    for (i = 0; i < n; i++) {
      var judul = (k.judulLevel ? k.judulLevel(i) : '') || ('Level ' + (i + 1));
      var atas = st[i].b === 0;
      wadah.appendChild(labelBl(st[i].x, atas ? st[i].y - 50 : st[i].y + 60, atas,
        A.fmt(judul), A.esc(k.namaMesin ? k.namaMesin(i) : ''), !buka(i)));
    }
    wadah.appendChild(labelBl(goal.x, goal.y + 60, false,
      '<svg width="20" height="20" viewBox="0 0 20 20">' + A.svgBintang(10, 11, 9, true) + '</svg>' + tot + ' / ' + maks,
      semua ? 'Ketuk gerbang!' : 'Selesaikan semua level', false));

    /* sentuhan */
    Array.prototype.forEach.call(wadah.querySelectorAll('.k-bl-titik'), function (t) {
      var idx = +t.getAttribute('data-i');
      var jd = (k.judulLevel ? k.judulLevel(idx) : '') || '';
      t.setAttribute('aria-label', 'Level ' + (idx + 1) + (jd ? ': ' + jd : '') + (buka(idx) ? '' : ' (terkunci)'));
      pasangKlik(t, function () { k.pilih(idx, t); });
    });
    var pt = wadah.querySelector('.k-bl-peti');
    if (pt) {
      pt.setAttribute('aria-label', 'Tujuan akhir: gerbang' + (semua ? '' : ' (terkunci)'));
      pasangKlik(pt, function () { k.akhir(pt); });
    }

    k.w.appendChild(wadah);

    /* penanda: di jalan, di depan ubin aktif (searah perjalanan); di kiri gerbang bila semua selesai */
    var pos = [];
    for (i = 0; i < n; i++) pos.push({ x: r1(st[i].x + (st[i].b === 0 ? 100 : -100)), y: r1(st[i].y + 28) });
    pos.push({ x: r1(goal.x - 106), y: r1(goal.y + 28) });
    k.penanda(wadah, pos);
  }

  /* ===== AKHIR GAYA BERLIKU ===== */

  /* ===== PENDAFTARAN (BAGIAN C) ===== */

  /* ══════════════ gaya "otomatis" ══════════════
   * Pemilih, bukan gaya gambar: memanggil KIT_PETA[nama](k) untuk gaya terpilih.
   * Pilihan tetap: hashTeks(judul + '|' + tema) -> indeks pada daftar berbobot tema itu.
   * Bila gaya terpilih tidak terdaftar atau melempar galat, dicoba gaya berikutnya dalam
   * daftar tema yang sama (berputar); bila semua gagal, galat dilempar ke kit.
   */
  var PETA_OTOMATIS = {
    emas:      { menara: 2, cakrawala: 1, berliku: 1 },
    hutan:     { pohon: 2, sulur: 2, dahan: 1, berliku: 1 },
    samudra:   { pusaran: 2, pulau: 2, cakrawala: 1 },
    antariksa: { konstelasi: 3, menara: 1, cakrawala: 1 },
    jingga:    { cakrawala: 2, berliku: 2, dahan: 1, pulau: 1 }
  };

  /* urutan percobaan: [terpilih, berikutnya, ...] dari daftar berbobot tema itu */
  function urutanOtomatis(tema, h) {
    var peta = PETA_OTOMATIS[tema] || PETA_OTOMATIS.emas;
    var nama = Object.keys(peta), daftar = [], i, j;
    for (i = 0; i < nama.length; i++) for (j = 0; j < peta[nama[i]]; j++) daftar.push(nama[i]);
    var mulai = nama.indexOf(daftar[(h >>> 0) % daftar.length]);
    var urut = [];
    for (i = 0; i < nama.length; i++) urut.push(nama[(mulai + i) % nama.length]);
    return urut;
  }

  function gambarOtomatis(k) {
    var D = k.D || {}, A = k.alat;
    var tema = String(k.tema || D.tema || A.tema || 'emas');
    var judul = String(D.judul || k.judul || 'otomatis');
    var urut = urutanOtomatis(tema, A.hashTeks(judul + '|' + tema));
    var reg = window.KIT_PETA || {}, galat = null, i;
    for (i = 0; i < urut.length; i++) {
      if (typeof reg[urut[i]] !== 'function') continue;
      var awal = k.w.childNodes.length;
      try { reg[urut[i]](k); return; }
      catch (e) {
        galat = e;
        while (k.w.childNodes.length > awal) k.w.removeChild(k.w.lastChild); /* buang sisa gambar gagal */
      }
    }
    throw galat || new Error('KIT_PETA otomatis: tidak ada gaya terdaftar untuk tema ' + tema);
  }
  gambarOtomatis.urutan = urutanOtomatis;
  gambarOtomatis.peta = PETA_OTOMATIS;

  (window.KIT_PETA = window.KIT_PETA || {}).pulau = function (k) { gambarPulau(k); };
  (window.KIT_PETA = window.KIT_PETA || {}).konstelasi = function (k) { gambarKonstelasi(k); };
  (window.KIT_PETA = window.KIT_PETA || {}).sulur = function (k) { gambarSulur(k); };
  (window.KIT_PETA = window.KIT_PETA || {}).pusaran = function (k) { gambarPusaran(k); };
  (window.KIT_PETA = window.KIT_PETA || {}).dahan = function (k) { gambarDahan(k); };
  (window.KIT_PETA = window.KIT_PETA || {}).menara = function (k) { gambarMenara(k); };
  (window.KIT_PETA = window.KIT_PETA || {}).pohon = function (k) { gambarPohon(k); };
  (window.KIT_PETA = window.KIT_PETA || {}).cakrawala = function (k) { gambarCakrawala(k); };
  (window.KIT_PETA = window.KIT_PETA || {}).berliku = function (k) { gambarBerliku(k); };
  (window.KIT_PETA = window.KIT_PETA || {}).otomatis = gambarOtomatis; /* terakhir: setelah semua gaya terdaftar */
})();
