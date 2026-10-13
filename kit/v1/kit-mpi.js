/*!
 * KIT MPI v1 — KKG SD Gugus 2 Cibatok
 * Bingkai tampilan + mesin permainan untuk Media Pembelajaran Interaktif.
 * Pakai:  <script src=".../kit-mpi.js"></script>
 *         <script> KIT.mulai({ ...DATA... }); </script>
 * Panduan lengkap: PANDUAN.md di repo aset-mpi-kkg.
 */
(function () {
  'use strict';
  var VERSI = '1.1.0';
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

  var IKON_MESIN = { cerita: '📖', bacaan: '📚', sortir: '🧺', cocokkan: '🔗', urutkan: '🔢', runner: '🏃', jelajah: '🔍' };
  var PETUNJUK = {
    cerita: 'Baca ceritanya, lalu pilih jawaban yang tepat.',
    bacaan: 'Baca halaman ini. Sentuh kata bergaris titik untuk melihat artinya.',
    sortir: 'Seret setiap kartu ke keranjang yang tepat.',
    cocokkan: 'Sentuh kartu di kiri, lalu sentuh pasangannya di kanan.',
    urutkan: 'Susun kartu ke kotak bernomor sesuai urutan yang benar.',
    runner: 'Geser ke jalur yang jawabannya benar. Pakai tombol ◀ ▶ atau sentuh jalurnya.',
    jelajah: 'Sentuh setiap titik yang berkedip untuk menjelajah.'
  };

  /* ════════════════════════════ GAYA ════════════════════════════ */
  var CSS = [
    '#kit{position:fixed;inset:0;background:#120c06;overflow:hidden;touch-action:manipulation;-webkit-tap-highlight-color:transparent}',
    '#kit *{box-sizing:border-box}',
    '#kit-pg{position:absolute;left:50%;top:50%;height:' + H + 'px;overflow:hidden;transform-origin:center;',
    '  font-family:Nunito,"Trebuchet MS",system-ui,sans-serif;font-size:22px;line-height:1.4;color:var(--tinta);',
    '  background:linear-gradient(160deg,var(--bg1),var(--bg2));user-select:none;-webkit-user-select:none}',
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
    '.k-medal.kunci:after{content:"🔒";position:absolute;top:-14px;right:-10px;width:48px;height:48px;display:flex;align-items:center;justify-content:center;font-size:24px;background:#fff;border:3px solid var(--lip);border-radius:50%;filter:none}',
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
    '.m-jel .baki .k-kartu{min-height:48px;padding:5px 12px;font-size:20px}'
  ].join('\n');

  /* ════════════════════════════ ALAT ════════════════════════════ */
  var D = null, ROOT, PG, SKALA = 1, LEVEL = [], BINTANG = [], TERBUKA = 1, MODE_GURU = false;

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
      wadah.appendChild(el('div', 'k-pola'));
    }
    if (gelap !== false) wadah.appendChild(el('div', 'k-gradb'));
  }
  function tombolSudut() {
    var s = el('div', 'k-sudut');
    var bs = tombol(Suara.aktif ? '🔊' : '🔇', 'k-ikon sek', function () {
      Suara.aktif = !Suara.aktif; bs.innerHTML = Suara.aktif ? '🔊' : '🔇';
    });
    bs.title = 'Suara';
    var bf = tombol('⛶', 'k-ikon sek', function () {
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
    var w = el('div');
    latarLayar(w, D.gambar && (D.gambar.sampul ? 'sampul' : 'latar'));
    if (D.maskot && D.maskot.gambar) {
      var m = el('div', 'melayang');
      m.style.cssText = 'position:absolute;left:36px;bottom:0;width:32%;height:460px;display:flex;align-items:flex-end;justify-content:center';
      var gm = gambar(D.maskot.gambar, D.maskot.nama);
      gm.style.cssText = 'max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 12px 16px rgba(0,0,0,.45))';
      m.appendChild(gm); w.appendChild(m);
    }
    var tj = el('div', 'k-tj');
    tj.appendChild(el('h1', 'k-judul', fmt(D.judul)));
    if (D.subjudul) tj.appendChild(el('p', null, fmt(D.subjudul)));
    var b = tombol('▶ ' + esc(D.tombolMulai || 'Mulai'), 'besar k-denyut', function () { if (LAYAR_SENTUH) layarPenuh(); layarKredit(); });
    b.style.marginTop = '22px';
    tj.appendChild(b);
    w.appendChild(tj);
    w.appendChild(tombolSudut());
    var g = el('button', 'k-guru', '🔑 Guru');
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
    aksi.appendChild(tombol('Lewati ⏭', 'kecil sek', layarPeta));
    var full = String(c.teks || ''), n = 0, ketik = true;
    var lanjut = tombol(i < D.cerita.length - 1 ? 'Lanjut ▶' : 'Ayo mulai! ▶', '', function () {
      if (ketik) { ketik = false; p.innerHTML = fmt(full); return; }
      if (i < D.cerita.length - 1) layarCerita(i + 1); else layarPeta();
    });
    aksi.appendChild(lanjut);
    box.appendChild(aksi);
    w.appendChild(box);
    w.appendChild(tombolSudut());
    layar(w);
    (function tik() {
      if (!ketik) return;
      n += 2; p.innerHTML = fmt(full.slice(0, n));
      if (n < full.length) setTimeout(tik, 22); else ketik = false;
    })();
  }

  function layarPeta() {
    var w = el('div');
    latarLayar(w, D.gambar && D.gambar.latar ? 'latar' : '');
    var atas = el('div', 'k-atas');
    atas.appendChild(tombol('🏠', 'k-ikon sek', layarJudul));
    atas.appendChild(el('div', 't', fmt(D.judul)));
    atas.appendChild(el('div', null)).style.flex = '1';
    var tot = BINTANG.reduce(function (a, b) { return a + (b || 0); }, 0);
    atas.appendChild(el('div', 'k-pil', '⭐ ' + tot + ' / ' + (LEVEL.length * 3)));
    var bg = el('button', 'k-pil', '🔑 Guru'); bg.style.cursor = 'pointer';
    bg.addEventListener('click', panelGuru); atas.appendChild(bg);
    w.appendChild(atas);
    var peta = el('div', 'k-peta');
    LEVEL.forEach(function (lv, i) {
      var buka = MODE_GURU || i < TERBUKA;
      var md = el('div', 'k-kertas k-medal' + (buka ? '' : ' kunci'));
      var b = BINTANG[i] || 0;
      md.innerHTML = '<div class="no">' + (i + 1) + '</div><h3>' + fmt(lv.judul || ('Level ' + (i + 1))) + '</h3>' +
        '<div class="mn">' + (IKON_MESIN[lv.mesin] || '🎯') + ' ' + esc(namaMesin(lv.mesin)) + '</div>' +
        '<div class="bt">' + '⭐⭐⭐'.slice(0, b * 2) + '<span style="opacity:.25">' + '⭐⭐⭐'.slice(0, (3 - b) * 2) + '</span></div>';
      if (buka) md.addEventListener('click', function () { Suara.klik(); mainLevel(i); });
      peta.appendChild(md);
    });
    w.appendChild(peta);
    var semua = BINTANG.filter(function (x) { return x > 0; }).length === LEVEL.length;
    if (semua) {
      var bp = tombol('🏆 Lihat hasil akhir', 'besar k-denyut', layarPenutup);
      bp.style.cssText = 'position:absolute;left:50%;bottom:18px;transform:translateX(-50%)';
      w.appendChild(bp);
    }
    layar(w);
  }
  function namaMesin(m) {
    return { cerita: 'Cerita', bacaan: 'Bacaan', sortir: 'Sortir', cocokkan: 'Cocokkan', urutkan: 'Urutkan', runner: 'Lari Jalur', jelajah: 'Jelajah' }[m] || 'Tantangan';
  }

  /* ════════════════════════════ LEVEL ════════════════════════════ */
  function mainLevel(i) {
    var lv = LEVEL[i];
    var w = el('div');
    latarLayar(w, lv.latar || (D.gambar && D.gambar.latar ? 'latar' : ''));
    var atas = el('div', 'k-atas');
    atas.appendChild(tombol('🗺', 'k-ikon sek', function () { if (api.berhenti) api.berhenti(); layarPeta(); }));
    atas.appendChild(el('div', 't', 'Level ' + (i + 1) + ': ' + fmt(lv.judul || namaMesin(lv.mesin))));
    atas.appendChild(el('div', null)).style.flex = '1';
    var progEl = el('div', 'k-titik'); atas.appendChild(progEl);
    var statEl = el('div', 'k-pil', '❤️❤️❤️'); statEl.style.display = 'none'; atas.appendChild(statEl);
    var skorEl = el('div', 'k-pil', '⭐ 0'); skorEl.style.display = 'none'; atas.appendChild(skorEl);
    w.appendChild(atas);

    var ruang = el('div', 'k-ruang'); w.appendChild(ruang);
    var bawah = el('div', 'k-bawah');
    var mas = el('div', 'k-mas');
    if (D.maskot && D.maskot.gambar) mas.appendChild(gambar(D.maskot.gambar, D.maskot.nama || 'Maskot'));
    else mas.appendChild(el('div', 'k-fb', '🙂')).style.cssText = 'width:76px;height:76px;border-radius:50%;font-size:40px';
    bawah.appendChild(mas);
    var balon = el('div', 'k-balon'); bawah.appendChild(balon);
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
      },
      benar: function (t) { Suara.benar(); getar(25); api.bicara(t || acak(PUJI)[0], 'ok'); },
      salah: function (t) { keliru++; Suara.salah(); getar([70, 50, 70]); api.bicara(t || 'Belum tepat. Coba lagi, ya!', 'no'); },
      aksi: function (teks, fn, kelas) { var b = tombol(teks, kelas || '', fn); aksi.appendChild(b); return b; },
      bersihAksi: function () { aksi.innerHTML = ''; },
      progres: function (n, total) {
        progEl.innerHTML = '';
        for (var k = 0; k < total; k++) progEl.appendChild(el('i', k < n ? 'on' : ''));
      },
      nyawa: function (n, maks) {
        statEl.style.display = '';
        statEl.textContent = '❤️'.repeat(Math.max(0, n)) + '🤍'.repeat(Math.max(0, (maks || 3) - n));
      },
      skor: function (t) { skorEl.style.display = ''; skorEl.textContent = t; },
      keliru: function () { return keliru; },
      selesai: function (opsi) {
        if (selesai) return; selesai = true;
        opsi = opsi || {};
        var b = opsi.bintang != null ? opsi.bintang : (keliru === 0 ? 3 : keliru <= 2 ? 2 : 1);
        tunda(opsi.jeda == null ? 900 : opsi.jeda, function () { hasilLevel(i, b, opsi.pesan); });
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

  function hasilLevel(i, b, pesan) {
    BINTANG[i] = Math.max(BINTANG[i] || 0, b);
    if (b > 0 && TERBUKA < i + 2) TERBUKA = i + 2;
    var t = el('div', 'k-tirai');
    var p = el('div', 'k-kertas k-pop');
    var gagal = b === 0;
    p.innerHTML = '<h2>' + (gagal ? 'Hampir!' : b === 3 ? 'Sempurna!' : b === 2 ? 'Bagus!' : 'Selesai!') + '</h2>' +
      '<div class="k-bintang">' + [1, 2, 3].map(function (k) {
        return '<span class="' + (k <= b ? 'on' : '') + '" style="animation-delay:' + (k * 0.22) + 's">⭐</span>';
      }).join('') + '</div>' +
      '<p style="font-size:22px;font-weight:700;margin:6px 0 0">' + fmt(pesan || (gagal ? 'Ayo coba sekali lagi, kamu pasti bisa!' :
        b === 3 ? 'Tanpa salah sedikit pun. Luar biasa!' : 'Kamu berhasil menyelesaikan level ini.')) + '</p>';
    var a = el('div', 'aksi');
    a.appendChild(tombol('↻ Ulangi', 'sek', function () { mainLevel(i); }));
    var akhir = i === LEVEL.length - 1;
    if (!gagal) a.appendChild(tombol(akhir ? '🏆 Hasil akhir' : 'Lanjut ▶', 'k-denyut', function () {
      if (akhir) layarPenutup(); else layarPeta();
    }));
    else a.appendChild(tombol('🗺 Peta level', '', layarPeta));
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
    kiri.innerHTML = '<div class="melayang" style="font-size:110px;line-height:1;filter:drop-shadow(0 10px 12px rgba(0,0,0,.4))">🏆</div>' +
      '<div class="k-judul" style="font-size:42px;line-height:1.05;margin-top:8px">' + esc(P.lencana || 'Juara Belajar') + '</div>' +
      '<div class="k-pil" style="margin-top:12px;font-size:25px;padding:6px 18px">⭐ ' + tot + ' / ' + (LEVEL.length * 3) + '</div>';
    w.appendChild(kiri);
    var kn = el('div', 'k-kertas');
    kn.style.cssText = 'position:absolute;right:20px;top:20px;left:calc(32% + 40px);bottom:20px;padding:20px 24px;display:flex;flex-direction:column';
    var h = '<h2 class="fd" style="margin:0 0 6px;font-size:29px;color:var(--lip)">Yang sudah kamu pelajari</h2><ul style="margin:0 0 10px;padding-left:26px;font-size:20px;line-height:1.45;overflow:auto">' +
      (P.ringkasan || []).map(function (r) { return '<li>' + fmt(r) + '</li>'; }).join('') + '</ul>';
    if (P.refleksi) h += '<div style="background:#fff;border:3px dashed var(--lip);border-radius:16px;padding:10px 14px;font-size:20px;margin-top:auto"><b>💭 Coba pikirkan:</b> ' + fmt(P.refleksi) + '</div>';
    kn.innerHTML = h;
    var a = el('div'); a.style.cssText = 'display:flex;gap:12px;justify-content:flex-end;margin-top:12px';
    a.appendChild(tombol('🗺 Peta level', 'sek', layarPeta));
    a.appendChild(tombol('↻ Main lagi', '', function () { BINTANG = []; TERBUKA = 1; layarPeta(); }));
    kn.appendChild(a);
    w.appendChild(kn);
    layar(w);
    Suara.menang(); konfeti(200);
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
    p.innerHTML = '<div style="display:flex;align-items:center;gap:14px"><h2 class="fd" style="margin:0;font-size:32px;color:var(--lip);flex:1">🔑 Info Guru</h2></div>';
    var tutup = tombol('✕ Tutup', 'kecil sek', function () { t.remove(); });
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
      'Buka semua level': '<p>Untuk demonstrasi di kelas, guru dapat membuka semua level tanpa harus menyelesaikan level sebelumnya.</p>'
    };
    Object.keys(bagian).forEach(function (k, n) {
      var b = el('button', n === 0 ? 'on' : '', esc(k)); b.type = 'button';
      b.addEventListener('click', function () {
        tab.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on'); isi.innerHTML = bagian[k];
        if (k === 'Buka semua level') {
          isi.appendChild(tombol(MODE_GURU ? '🔒 Kunci kembali' : '🔓 Buka semua level', '', function () {
            MODE_GURU = !MODE_GURU; t.remove(); layarPeta();
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
              api.aksi(i < ad.length - 1 ? 'Lanjut ▶' : 'Selesai ✔', function () { maju(); });
            } else {
              b.disabled = true; goyang(b);
              api.salah(p.tanggapan);
            }
          });
          pil.appendChild(b);
        });
      } else {
        if (i > 0) api.bicara(a.komentar || 'Lanjutkan ceritanya.');
        api.aksi(i < ad.length - 1 ? 'Lanjut ▶' : 'Selesai ✔', maju);
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
      var lanjut = api.aksi(i < hal.length - 1 ? 'Halaman berikutnya ▶' : 'Selesai ✔', function () {
        i++; if (i >= hal.length) api.selesai(); else render();
      });
      function bolehLanjut() { lanjut.disabled = false; lanjut.classList.add('k-denyut'); }
      lanjut.disabled = !!a;

      if (terkunci) {
        tx.innerHTML = '<div class="kunci"><div class="gb">🔒</div>Bacaan ini masih terkunci.<br>Tebak dulu isinya!</div>';
        akt.innerHTML = '<div class="tny">🤔 ' + fmt(a.tanya) + '</div>';
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
        akt.innerHTML = '<div class="tny">🔎 ' + fmt(a.tanya) + '</div><p style="margin:0;opacity:.8">Sentuh kalimat di bacaan yang menjadi buktinya.</p>';
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
    var ps = lv.pasangan, beres = 0, pilihKiri = null;
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
            x.appendChild(el('div', 'tanda', '✓')).style.background = c;
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
      if (i) { var pa = el('div', 'panah', '➜'); baris.appendChild(pa); panah.push(pa); }
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
    var periksa = api.aksi('✔ Periksa', function () {
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
    var w = el('div', 'm-run');
    var jalan = el('div', 'jalan'); w.appendChild(jalan);
    [1, 2].forEach(function (m) { var mk = el('div', 'marka'); mk.style.left = (m * 33.333) + '%'; jalan.appendChild(mk); });
    var lajur = 1;
    var pelari = el('div', 'pelari');
    var gp = D.maskot && D.maskot.gambar ? gambar(D.maskot.gambar, '🏃') : el('div', 'k-fb', '🏃');
    pelari.appendChild(gp); jalan.appendChild(pelari);
    var samping = el('div', 'samping'); w.appendChild(samping);
    var soalEl = el('div', 'k-kertas soal'); samping.appendChild(soalEl);
    var statEl = el('div', 'k-kertas stat'); samping.appendChild(statEl);
    var kd = el('div', 'kendali'); samping.appendChild(kd);
    api.area.appendChild(w);
    function posisi() { pelari.style.left = (lajur * 33.333 + 16.667) + '%'; }
    function geser(d) { lajur = Math.max(0, Math.min(2, lajur + d)); posisi(); Suara.klik(); }
    kd.appendChild(tombol('◀', 'besar', function () { geser(-1); }));
    kd.appendChild(tombol('▶', 'besar', function () { geser(1); }));
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
    function stat() { statEl.innerHTML = '<span>✅ ' + benarN + '</span><span>🎯 ' + ke + '/' + jumlah + '</span>'; }
    var g = null, y = 0, cepat = lv.kecepatan || 1, soal = null, raf = null, jeda = false;
    var yPelari = 300;
    function soalBaru() {
      yPelari = (jalan.clientHeight || 360) - 12 - 110;
      if (ke >= jumlah || nyawa <= 0) return akhir();
      soal = bank ? bank[ke % bank.length] : lv.buatSoal(ke);
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
          api.salah(soal.penjelasan || ('Jawaban yang benar: ' + soal.pilihan[soal.benar]));
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
      if (nyawa <= 0) { soalEl.innerHTML = '💔 Nyawa habis'; api.selesai({ bintang: 0, pesan: 'Nyawamu habis. Ayo coba lagi, pelan-pelan saja!' }); }
      else { soalEl.innerHTML = '🏁 Finis!'; api.selesai({ bintang: nyawa >= maksNyawa ? 3 : nyawa >= maksNyawa - 1 ? 2 : 1 }); }
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
            if (lv.label === false) { api.benar('Kamu sudah menjelajahi semua bagian!'); api.aksi('Selesai ✔', function () { api.selesai(); }); }
            else { api.bicara('Semua bagian sudah kamu jelajahi. Sekarang uji ingatanmu!', 'ok'); api.aksi('Pasang label ▶', faseLabel, 'k-denyut'); }
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
            s.dataset.isi = 1; s.classList.add('lihat'); s.textContent = '✓';
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
      if (lv.mesin === 'cocokkan') { arr('pasangan', 2); maks('pasangan', 5, 'pasang'); }
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
        LEVEL = D.level; BINTANG = []; TERBUKA = 1;
        layarJudul();
      };
      if (document.body) jalan(); else document.addEventListener('DOMContentLoaded', jalan);
    }
  };
})();
