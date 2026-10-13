# Panduan Kit MPI v1.1

Kit ini menyediakan **bingkai, tema warna, dan 7 mesin permainan** untuk MPI kelas SD.
Pembuat MPI (guru atau Claude) cukup menulis **DATA**. Satu MPI = satu berkas HTML pendek:

```html
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Judul MPI</title>
<script src="https://cdn.jsdelivr.net/gh/semar1910/aset-mpi-kkg@main/kit/v1/kit-mpi.js"></script>
</head>
<body>
<script>
KIT.mulai({ /* DATA di sini */ });
</script>
</body>
</html>
```

Alur yang otomatis dibuat kit: **Judul → Kredit → Cerita pembuka → Peta level → Level → Hasil akhir**,
ditambah tombol **🔑 Guru** (rencana, kunci jawaban otomatis, buka semua level), tombol suara,
layar penuh, dan pemaksa posisi mendatar di HP.

Contoh lengkap: `demo/numerasi.html`, `demo/ipa.html`, `demo/literasi.html`.

**MPI dirancang untuk HP posisi mendatar**, lalu ikut membesar di laptop, proyektor, dan TV.
Di HP, MPI otomatis masuk layar penuh saat tombol Mulai disentuh. Posisi tegak tidak didukung.

### Batas isi (dicek otomatis oleh kit)

| Bagian | Batas |
|---|---|
| Jumlah level | maks 5 (disarankan 3) |
| Cerita pembuka | maks 5 adegan, tiap adegan maks 40 kata |
| `cerita` (level) | maks 3 pilihan; teks + tanya maks 45 kata (60 kata bila tanpa pilihan) |
| `bacaan` | maks 70 kata per halaman (55 kata bila ada gambar), maks 3 pilihan |
| `sortir` | 2–3 kategori, maks 10 kartu |
| `cocokkan` | maks 5 pasang |
| `urutkan` | 3–5 langkah |
| `runner` | tepat 3 pilihan, tiap pilihan maks 14 huruf |
| `jelajah` | maks 8 titik |

Kalimat pendek, kata sederhana. Teks yang lebih panjang dipecah jadi beberapa halaman atau adegan.

---

## 1. Kerangka DATA

| Kunci | Wajib | Isi |
|---|---|---|
| `judul` | ya | Judul besar di layar pembuka |
| `subjudul` | – | Satu baris di bawah judul |
| `tema` | – | `emas`, `hutan`, `samudra`, `antariksa`, `jingga` (bawaan `emas`) |
| `identitas` | – | `{ mapel, kelas, materi, penyusun, sekolah }` |
| `gambar` | – | Daftar gambar bernama: `{ latar:'url', sampul:'url', paru:'url', ... }` |
| `maskot` | – | `{ nama:'Pak Hasan', gambar:'url' }`. Tanpa gambar, kit memakai wajah 🙂 |
| `cerita` | – | Daftar adegan pembuka. Teks biasa, atau `{ nama, teks, gambar, tokoh:false }` |
| `glosarium` | – | `{ 'kata': 'arti' }`. Kata ini bisa disentuh di mesin bacaan |
| `level` | ya | Daftar level, 3 level disarankan, maks 5 (lihat bagian 2) |
| `penutup` | – | `{ lencana, ringkasan:[...], refleksi }` |
| `guru` | – | `{ tujuan, durasi, langkah:[...], catatan }` |

Aturan teks: `**tebal**` untuk menebalkan, `\n` untuk baris baru. Gambar boleh ditulis
sebagai nama dari `gambar` (mis. `'paru'`) atau alamat langsung.
Gambar yang gagal dimuat diganti kotak berlabel, jadi MPI tetap jalan.

Setiap level boleh punya `judul` dan `petunjuk` (kalimat maskot di awal level).

---

## 2. Tujuh mesin

### `cerita`: kisah bergambar dengan pilihan
```js
{ mesin:'cerita', judul:'Lapak Pertama',
  adegan:[
    { nama:'Pak Hasan', teks:'Aku membeli gula seharga Rp50.000 ...', gambar:'latar' },
    { teks:'...', tanya:'Untung atau rugi?',
      pilihan:[ { teks:'Untung Rp15.000', benar:true, tanggapan:'Tepat! ...' },
                { teks:'Rugi Rp15.000', tanggapan:'Rugi terjadi kalau ...' } ] } ] }
```
Setiap adegan yang punya `pilihan` wajib punya satu `benar:true`. `tanggapan` salah berisi petunjuk, bukan jawaban.

### `bacaan`: buku halaman demi halaman
```js
{ mesin:'bacaan', judul:'Kancil dan Buaya',
  halaman:[
    { judul:'...', teks:'...', gambar:'opsional',
      aktivitas:{ jenis:'tebak', tanya:'...', pilihan:['...','...','...'], ulasan:'...' } },
    { teks:'... Para buaya percaya dan ...',
      aktivitas:{ jenis:'bukti', tanya:'Mengapa ...?', kunci:'Para buaya percaya', ulasan:'...', petunjuk:'...' } },
    { teks:'...',
      aktivitas:{ jenis:'rumpang', kalimat:'Kancil itu [cerdik] tetapi [licik].', pengecoh:['jujur','malas'] } },
    { teks:'...',
      aktivitas:{ jenis:'pilih', tanya:'...', pilihan:['A','B','C'], benar:0, ulasan:'...', petunjuk:'...' } } ] }
```
- `tebak`: teks terkunci sampai murid menebak (semua tebakan diterima).
- `bukti`: murid menyentuh kalimat bukti. `kunci` harus **persis ada** di `teks`.
- `rumpang`: kata dalam `[ ]` jadi kotak kosong, murid menyeret kata ke sana.
- `pilih`: pilihan ganda, `benar` = nomor urut mulai 0.

### `sortir`: kelompokkan kartu
```js
{ mesin:'sortir', judul:'...', waktu:60,   // waktu opsional, detik
  kategori:[ { nama:'📈 Untung' }, { nama:'📉 Rugi', gambar:'opsional' } ],
  kartu:[ { teks:'Modal Rp20.000\nLaku Rp25.000', ke:0 },
          { gambar:'botol', teks:'Botol', ke:1, petunjuk:'opsional, muncul saat salah' } ] }
```
`ke` = nomor kategori mulai 0. 6–8 kartu disarankan.

### `cocokkan`: tarik garis pasangan
```js
{ mesin:'cocokkan', pasangan:[ ['Hidung','Menyaring udara','ulasan opsional'], ['Alveolus','Pertukaran gas'] ] }
```
Isi kiri/kanan boleh teks atau `{ gambar, teks }`. 3–5 pasangan.

### `urutkan`: susun urutan yang benar
```js
{ mesin:'urutkan', urutan:['Hidung','Tenggorokan','Bronkus','Alveolus'], ulasan:'...' }
```
Tulis dalam urutan **benar**; kit yang mengacak. 3–5 langkah.

### `runner`: lari ke gerbang jawaban
```js
{ mesin:'runner', jumlah:8, nyawa:3, kecepatan:1,
  soal:[ { tanya:'7 × 8 = ?', pilihan:['56','54','64'], benar:0, penjelasan:'7 × 8 = 56' } ] }
// atau soal acak:
{ mesin:'runner', jumlah:8,
  buatSoal:function(ke){ var a=2+Math.floor(Math.random()*8), b=2+Math.floor(Math.random()*8);
    return { tanya:a+' × '+b+' = ?', pilihan:[a*b, a*b+b, a*b-1].map(String), benar:0 }; } }
```
Tepat **3 pilihan**, tidak boleh kembar. `ke` = nomor soal (0, 1, 2...), bisa dipakai untuk menaikkan kesulitan.

### `jelajah`: sentuh titik pada gambar, lalu pasang label
```js
{ mesin:'jelajah', gambar:'paru', rasio:4/3, label:true,
  titik:[ { x:50, y:21, nama:'Hidung', info:'Menyaring debu ...' }, ... ] }
```
`x`, `y` dalam persen (0–100) dari kiri-atas gambar. `label:false` untuk melewati tahap pasang label.

---

## 3. Bila DATA keliru

Kit memeriksa DATA sebelum berjalan. Jika ada yang salah, muncul layar
**"MPI belum bisa dijalankan"** beserta daftar masalahnya. Salin daftar itu ke Claude
dengan pesan *"perbaiki DATA berikut"*.

## 4. Mencoba tema

Tambahkan `?tema=hutan` (atau tema lain) di alamat halaman untuk melihat MPI dengan warna lain
tanpa mengubah berkasnya.
