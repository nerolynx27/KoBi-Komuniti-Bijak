# KoBi — Komuniti Bijak: Senarai UI dan Aset MVP

**Status:** Senarai kerja, bukan inventori yang sudah dihasilkan.  
**Rujukan skop:** [TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md).  
**Urutan pelaksanaan:** [PROJECT_TIMELINE.md](PROJECT_TIMELINE.md).

**Current design/language decision — 16 October 2026:** Follow [product.md](product.md), the authoritative Pixel Stickers system. All app UI is English. The English UI-01–UI-20 action inventory there supersedes historical Malay labels below. UI controls use reusable inline SVG/CSS and live HTML text; PNG is for world artwork and photos. No new button generation is required.

**Palette/typography revision — 19 October 2026, subsequently implemented:** the five-colour UI palette and Bungee/Yanone Kaffeesatz specification in product.md supersede older colour/font instructions. The palette exempts future pixel-world artwork; the two-font rule applies throughout the project. The subsequent user request authorized replacing and applying the fonts; AS-19 files/licenses and the provenance/manifest/ledger now reflect that replacement. The later approved colour plan has also been executed; shared UI tokens, state treatments and editor previews now use only the specified five colours.

`Wajib` means required for the frontend prototype; `Kemudian` means deferred. All screens use English, are mobile-first, and include loading, empty, failure and success states where applicable. The older Malay prose remains product context, not final UI copy.

**Urutan 16 Oktober 2026:** Semua UI shell dahulu → uji → dunia pixel → editor dan simulasi visual → QA/demo. Backend sangat pilihan selepas frontend lengkap. Keperluan sesi sah, role backend, RPC, signed URL, upload dan conflict pelayan dalam UI-01 hingga UI-17 ialah kontrak integrasi pilihan. Untuk prototaip, sediakan UI/state dan data demo berlabel, tanpa mendakwa operasi sebenar.

Simulasi akaun Penduduk/SDP bukan kawalan akses sebenar. Simpan rekod contoh dan layout dalam browser berversi dengan Reset Demo; gambar boleh dipratonton setempat tanpa jaminan kekal selepas reload. Jangan simpan kata laluan. Backend gagal tidak boleh bertukar secara senyap kepada demo berjaya.

## 1. Gaya dan ukuran bersama

- Pixel art bandar pandangan atas bersudut: bumbung serta muka hadapan bangunan kelihatan; bukan grid berlian isometrik.
- Rujukan: [gambar pengguna](../../references/pixel-art-town-reference.png). Ambil prinsip perspektif, skala dan palet; jangan salin keseluruhan bandar atau tanda dagangan.
- Tile asas **32×32 px**, peta **32×24 tile / 1024×768 px**.
- Semua ukuran aset di bawah ialah ukuran **fail runtime**; hasil generasi asal boleh lebih besar dan perlu diproses.
- Bangunan serta pokok menggunakan pivot tapak tengah `(0.5,1)`; tapak/footprint diletakkan pada grid. Avatar menggunakan kedudukan kaki tengah sebagai pivot.
- Outline gelap lembut, palet kejiranan yang konsisten, cahaya dari kiri atas dan bayang yang searah. Kekalkan skala pintu, manusia dan perabot.
- PNG objek mempunyai alpha sebenar, bukan gambar corak checkerboard atau latar putih. Tileset tanah legap dan seamless pada sambungan yang digunakan.
- Kekalkan resolusi asal runtime, nearest-neighbor, tiada blur dan tiada pembesaran AI selepas aset diluluskan.
- Current typography specification: Bungee 400 for all titles, section headers, wordmark and button labels; Yanone Kaffeesatz 400/700 for descriptions, body/supporting text, labels and form values across the whole project, including future world text. Follow the acquisition/fallback plan in `docs/product/product.md`. The subsequent font-replacement request applies these font roles in the current build.
- Current UI palette: only `#6C1A21`, `#B92C2C`, `#CEA257`, `#D1BF9A` and `#E5E0CD` from the user's 19 October 2026 reference. Future pixel-world artwork is exempt; UI/editor controls and overlays use this palette. No additional UI tints, shades, gradients or font families. The earlier concept sheets remain geometry references.
- Sebelum produksi penuh, pilih satu palet dan rekod warna sebenar dalam `src/styles/tokens.css` serta ledger seni.

## 2. Senarai skrin dan komponen UI wajib

### UI-01 — Log masuk

- Medan e-mel dan kata laluan; tunjuk/sembunyi kata laluan.
- Butang Log masuk, pautan Daftar akaun.
- Pending menyekat penghantaran berganda; error tidak memadam e-mel.
- Sesi sah membuka aplikasi; tiada pemilihan role staff oleh pengguna.
- Tiada social login atau password-reset flow dalam MVP. Akaun demo diuji sebelum rakaman.

### UI-02 — Daftar akaun

- Nama paparan, e-mel, kata laluan, pengesahan kata laluan.
- Maklumat bahawa akaun digunakan untuk township pilot contoh.
- Validasi sebelum hantar dan arahan pengesahan e-mel jika diaktifkan dalam Supabase.
- Pautan kembali log masuk. Role resident ditentukan backend.

### UI-03 — Peta kejiranan

- Fasa shell: ruang sementara dengan butang lampu, rumah, taman, dewan, bangku dan kitar semula yang membuka panel sama. Rumah memberi maklumat asas sahaja, tanpa feature penduduk baharu.
- Fasa dunia: peta pixel art dengan rumah, jalan, taman, dewan, bangku, lampu dan pusat kitar semula.
- Seret, butang zum tambah/tolak, reset pandangan dan pilihan objek.
- Label township, petunjuk penggunaan ringkas dan penunjuk data sedang dikemas kini.
- Penanda fasiliti beraduan dan lokasi aktiviti. Lokasi dengan beberapa aktiviti membuka pilihan senarai, bukan memilih aktiviti secara rawak.
- Highlight fasiliti apabila dipilih; penanda tidak menutup kawasan sentuhan objek.
- Pekerja dipaparkan berdasarkan keadaan fasiliti; tiada joystick/avatar pemain.
- Jika grafik gagal dimuatkan, beri retry dan akses kepada tab Aduan/Aktiviti.

### UI-04 — Panel fasiliti apabila ditekan

- Nama, jenis dan lokasi fasiliti; keadaan umum normal/dilaporkan/dalam tindakan.
- Butang Buat Aduan untuk fasiliti reportable dan butang Lihat Aktiviti apabila relevan.
- Tiada nama, gambar atau teks aduan penduduk lain dalam panel umum.
- Panel bawah boleh ditutup; kamera dan pilihan peta dipelihara.

### UI-05 — Borang aduan

- Fasiliti praisi daripada peta; pemilih senarai jika dibuka dari tab Aduan.
- Penerangan 10–1000 aksara dan satu gambar pilihan.
- Pilih daripada galeri atau kamera jika tersedia; preview, buang/ganti gambar, saiz/format error.
- Butang Hantar Aduan dengan status upload dan simpan.
- Jika gagal, kekalkan input dan beri cuba semula; jika berjaya, buka butiran laporan sebenar.
- Konfirmasi jika meninggalkan form yang belum dihantar. Tiada draf tersimpan offline.

### UI-06 — Aduan saya

- Senarai laporan milik pengguna: fasiliti, tarikh dan label status.
- Penapis Semua, Diterima, Dalam tindakan, Selesai.
- Butang Buat Aduan, muat semula dan state tiada laporan.
- Ketik item untuk UI-07. Tiada feed awam semua aduan.

### UI-07 — Butiran aduan

- ID laporan, fasiliti, masa hantar, penerangan dan gambar jika ada.
- Status semasa dan sejarah tindakan mengikut masa.
- Catatan SDP dan gambar bukti selesai dengan signed URL yang boleh diperbaharui.
- Butang Lihat di Peta; kembali ke senarai.
- Tiada butang mengubah status untuk penduduk atau chat dengan petugas.

### UI-08 — Senarai aktiviti

- Penapis Semua, Komuniti, Kitar Semula dan Disertai.
- Kad tajuk, kategori, lokasi, tarikh/masa, status dan label Sudah disertai apabila berkenaan.
- Aktiviti cancelled kekal jelas; aktiviti draft tidak kelihatan kepada penduduk.
- Aktiviti masa hadapan disusun dahulu. Senarai Disertai masih menunjukkan cancellation dan aktiviti yang telah bermula.
- State kosong, loading, retry dan refresh. Poster bukan syarat untuk menerbitkan aktiviti.

### UI-09 — Butiran aktiviti dan penyertaan

- Tajuk, kategori, penerangan, tarikh/masa, lokasi dan arahan.
- Jumlah peserta tanpa mendedahkan senarai nama penduduk.
- Butang Sertai Aktiviti atau Batal Penyertaan; konfirmasi pembatalan.
- Pending menyekat ketikan berganda; selepas berjaya, UI mengambil status sebenar daripada backend.
- Status Aktiviti dibatalkan / Telah bermula menyekat penyertaan baharu.
- Pengguna boleh batal penyertaan sebelum masa mula, termasuk selepas acara dibatalkan.
- Butang Lihat Lokasi membuka peta dan memfokus fasiliti.

### UI-10 — Profil

- Nama paparan boleh disunting; e-mel dan township baca sahaja.
- Label akaun penduduk atau petugas berdasarkan backend.
- Pautan Tetapan dan Log keluar.
- Staff mempunyai pintu masuk Pengurusan SDP; pengguna biasa tidak mempunyai pautan itu.

### UI-11 — Tetapan asas

- Panduan ringkas seret/zum/pilih objek.
- Maklumat versi aplikasi dan penanda data pilot/contoh.
- Pautan kembali dan Log keluar jika tidak sudah jelas di profil.
- Tiada suis bunyi, notifikasi, bahasa atau tetapan lain yang belum berfungsi.

### UI-12 — Navigasi aplikasi

- Bottom navigation: Peta, Aduan, Aktiviti, Profil.
- Tab aktif mempunyai ikon dan label. Butang kembali/tutup konsisten.
- Panel/form boleh scroll tanpa menutup tindakan utama; keyboard tidak menghalang hantar.
- Sasaran sentuhan minimum 44×44 CSS px dan safe-area padding.
- Staff boleh masuk/keluar paparan pengurusan dalam aplikasi yang sama; tiada aplikasi admin kedua.

### UI-13 — State dan dialog bersama

- Loading aplikasi/aset, loading data dan butang pending.
- Senarai kosong, data tidak ditemui, tiada akses, sesi tamat dan rangkaian terputus.
- Mesej hantar/simpan/sertai/batal berjaya atau gagal.
- Konfirmasi buang input belum disimpan, log keluar, batal penyertaan dan batal aktiviti.
- Error inline bagi medan; feedback ringkas yang turut boleh dibaca pembaca skrin.
- Tiada kejayaan palsu apabila operasi backend gagal.

### UI-14 — Senarai aduan petugas SDP

- Aduan township staff, dengan ID, fasiliti, masa dan status.
- Penapis status, refresh dan pilihan laporan.
- Tiada statistik kompleks, peta heatmap atau assignment kepada jabatan.

### UI-15 — Butiran dan tindakan petugas

- Butiran laporan serta sejarah yang sama dengan UI-07, ditambah maklumat pelapor yang diperlukan operasi.
- Pilih peralihan sah Diterima → Dalam tindakan → Selesai.
- Catatan tindakan wajib; gambar bukti wajib apabila selesai.
- Pending, retry dan konflik versi: muat semula rekod sebelum meneruskan.
- Petugas boleh lihat lokasi pada peta; perubahan tidak bergantung pada animasi selesai.

### UI-16 — Pengurusan aktiviti petugas

- Senarai draft, published dan cancelled bagi township sendiri.
- Tajuk, kategori, masa, lokasi, status dan jumlah peserta.
- Butang Tambah, Sunting, Pratonton dan Batal Aktiviti.
- Konfirmasi cancellation; tiada delete kekal atau e-mel/push automatik.
- Jumlah peserta mencukupi untuk MVP; eksport senarai dan daftar hadir ditangguhkan.

### UI-17 — Borang aktiviti petugas

- Tajuk, kategori Komuniti/Kitar Semula, penerangan dan arahan.
- Lokasi: taman, dewan atau pusat kitar semula pilot.
- Tarikh/masa mula dan tamat; paparan Malaysia, simpan UTC.
- Simpan Draf dan Terbitkan; validasi masa, lokasi dan medan wajib.
- Sunting dengan semakan version dan perlindungan input belum disimpan.
- Tiada medan kapasiti, poster wajib, bayaran atau ganjaran.

### UI-18 — Pengurusan dunia SDP

- Pintu masuk melalui profil/paparan SDP, dalam aplikasi sama. Paparan demo dilabelkan.
- Masuk/keluar mod sunting; arahan sentuhan dan tindakan Tambah Komponen, Pilih, Alih dan Buang.
- Ringkasan simpanan setempat dan Reset Demo dengan pengesahan; jelaskan bahawa perubahan hanya pada browser/peranti ini.
- Keluar membatalkan pratonton tertunda; panel menghalang input menembusi ke peta.
- Shell menggunakan simulasi kedudukan dahulu; canvas sebenar menyusul selepas dunia pixel.

### UI-19 — Katalog dan peletakan komponen

- Katalog aset tersedia: rumah, dewan, taman, lampu, bangku, pokok dan kitar semula.
- Kad nama/preview dan pilihan komponen; tiada upload aset atau jenis komponen baharu.
- Ghost/pratonton kedudukan, snap grid dan penunjuk sah/tidak sah bersama sebab.
- Sahkan Letak dan Batal. Kedudukan mesti dalam bounds, footprint tidak bertindih dan laluan kerja diperlukan kekal sah.
- Setiap salinan mendapat objectId unik; facilityId hanya bagi komponen relevan. Rumah hiasan tidak automatik menjadi fasiliti aduan.

### UI-20 — Pilih, alih dan buang objek

- Highlight objek, nama/jenis serta tindakan Alih dan Buang.
- Alih mengekalkan ID; pratonton, validasi, sahkan dan batal memulihkan kedudukan asal.
- Buang memerlukan pengesahan. Fasiliti yang dirujuk aduan/aktiviti demo tidak boleh dibuang; jelaskan sebab dan sediakan Reset Demo melalui UI-18.
- Simpan tindakan sah dalam browser; kegagalan simpan dimaklumkan.
- Selaraskan marker/hit area, fokus dan laluan/posisi pekerja; objek dibuang tidak meninggalkan panel atau pilihan lama.
- Bezakan drag objek dalam mod sunting daripada drag kamera; kawalan biasa pulih selepas keluar.

## 3. Aliran UI yang mesti lengkap

| Aliran | Urutan |
|---|---|
| Akaun | UI-01/UI-02 → UI-03 → UI-10/UI-11 |
| Laporan melalui peta | UI-03 → UI-04 → UI-05 → UI-07 → UI-06 |
| Laporan tanpa peta | UI-06 → UI-05 dengan pemilih fasiliti → UI-07 |
| Tindakan SDP | UI-10 → UI-14 → UI-15 → perubahan terlihat di UI-07/UI-03 |
| Aktiviti penduduk | UI-08 atau penanda UI-03 → UI-09 → sertai/batal → penapis Disertai |
| Hebahan SDP | UI-10 → UI-16 → UI-17 → terbit → UI-08/UI-03 |
| Dunia SDP: tambah | UI-10 → UI-18 → UI-19 → pratonton → sahkan/batal → UI-03 |
| Dunia SDP: alih/buang | UI-18 → pilih objek → UI-20 → alih/sahkan/batal atau buang/konfirmasi → UI-03 |
| Reset demo | UI-18 → Reset Demo → pengesahan → layout dan rekod contoh asal |

UI-12 dan UI-13 digunakan merentas semua aliran. Setiap langkah mesti boleh dipulihkan selepas error yang munasabah.

## 4. Inventori aset runtime wajib

Semua fail di bawah belum dihasilkan. Nama fail ialah kontrak supaya Codex tidak meneka path. Format PNG melainkan dinyatakan lain. Kuantiti ialah minimum; objek sama boleh diulang dalam peta.

| ID | Aset / fail relatif kepada `public/assets/` | Ukuran | Kandungan minimum |
|---|---|---|---|
| AS-01 | `terrain/town-tiles.png` | 256×64, grid 8×2 tile | 16 tile 32×32 untuk rumput, pavement, jalan dan laluan taman |
| AS-02 | `buildings/house-a.png` | 96×128 | Satu jenis rumah; boleh diulang |
| AS-03 | `buildings/community-hall.png` | 128×128 | Dewan komuniti yang boleh dikenal pasti |
| AS-04 | `props/playground.png` | 96×96 | Satu set permainan sebagai titik taman |
| AS-05 | `props/tree-a.png` | 64×96 | Satu pokok |
| AS-06 | `props/bush-a.png` | 32×32 | Satu semak |
| AS-07 | `props/bench.png` | 64×32 | Satu bangku |
| AS-08 | `props/lamp-normal.png` | 32×64 | Lampu normal |
| AS-09 | `props/lamp-reported.png` | 32×64 | Lampu rosak dengan bentuk asas sama |
| AS-10 | `props/lamp-repairing.png` | 32×64 | Lampu dalam tindakan; tanpa pekerja digabungkan ke dalam gambar |
| AS-11 | `props/recycling-bins.png` | 96×64 | Satu set tong berbeza warna; label teks dibuat UI |
| AS-12 | `characters/worker-idle.png` | 32×48 | Pekerja SDP generik berdiri; tiada logo rasmi yang tidak dibenarkan |
| AS-13 | `characters/worker-walk.png` | 128×192 | Grid 4 kolum × 4 baris; setiap frame 32×48 |
| AS-14 | `characters/worker-repair.png` | 128×48 | 4 frame 32×48, menghadap kanan |
| AS-15 | `markers/report.png` | 24×24 | Penanda aduan aktif |
| AS-16 | `markers/community.png` | 24×24 | Penanda aktiviti komuniti |
| AS-17 | `markers/recycling.png` | 24×24 | Penanda aktiviti kitar semula |
| AS-18 | `ui/icons.svg` | 20×20 viewBox per symbol | Code-authored pixel SVG sprite; IDs and recipe in `docs/product/product.md` |
| AS-19 | `ui/bungee-regular.ttf`, `ui/yanone-kaffeesatz-variable.ttf` | Bungee 400; Yanone Kaffeesatz variable 200–700, UI uses 400/700 | Replacement acquired and self-hosted; official licensed TTF files, with sources/licenses/fallback in `docs/product/product.md` |

Bungee also supplies the brand wordmark; no third brand font is selected. Runtime licenses: `ui/licenses/bungee-OFL.txt` and `ui/licenses/yanone-kaffeesatz-OFL.txt`. These replacement files were acquired on 19 October 2026 with SHA-256 provenance. The active Play/Press Start 2P source/runtime fonts and licenses were removed; the manifest and ledger list the replacements. Historical test artifacts are retained. PixelFrame is code-generated decoration and has no raster asset ID; the original 2K button sheet is reference-only.

Highlight pilihan dan penanda sedang dibaiki boleh dilukis oleh Phaser menggunakan bentuk ringkas; tidak memerlukan generasi imej tambahan. Label status, butang, kad dan panel dibuat dengan React/CSS.

### 4.1 Indeks tile AS-01

| Indeks | Nama | Indeks | Nama |
|---|---|---|---|
| 0 | grass | 8 | road-corner-se |
| 1 | grass-detail | 9 | road-corner-sw |
| 2 | pavement | 10 | road-cross |
| 3 | pavement-edge | 11 | road-tee-n |
| 4 | road-horizontal | 12 | road-tee-s |
| 5 | road-vertical | 13 | crossing-horizontal |
| 6 | road-corner-ne | 14 | crossing-vertical |
| 7 | road-corner-nw | 15 | park-path |

Indeks dibaca kiri ke kanan, kemudian baris seterusnya, tanpa margin/gap. Layout pilot menggunakan sambungan yang tersedia; jangan menjanjikan editor bandar dengan semua konfigurasi jalan.

### 4.2 Avatar dan sprite state

- Walk: baris 0 bawah, 1 kiri, 2 kanan, 3 atas; setiap baris mengandungi 4 frame berurutan. Nilai awal 6 FPS dan diselaraskan selepas semakan visual.
- Idle: satu frame; kostum dan proporsi sama dengan walk/repair.
- Repair: menghadap kanan, 4 frame pada 6 FPS awal; titik kerja di sebelah kiri lampu supaya pose masuk akal.
- Semua frame 32×48, kaki pada garis yang sama, kamera dan skala tidak berubah.
- Tiada frame berteks, latar, crop kepala/peralatan atau badan yang berubah identiti.
- Animasi berhenti berdasarkan status demo setempat; selepas backend pilihan diintegrasikan, ikut status backend. Satu loop tidak menentukan kerja selesai.

### 4.3 Ikon UI AS-18

Peta, Aduan, Aktiviti, Profil, Tetapan, Kamera, Gambar, Lokasi, Kalendar, Masa, Kembali, Tutup, Tambah, Tolak/Zum keluar, Reset peta, Refresh, Tanda semak, Amaran, Sunting, Log keluar, Tunjuk/Sembunyi kata laluan, Katalog, Alih, Buang dan Reset Demo.

AS-18 is a single code-authored 20×20 SVG symbol family, rendered at 20 or 40 px. Use the exact symbol inventory in `docs/product/product.md`; do not substitute per-icon PNG generations. Font assets are licensed files, not AI lettering. The descriptive Malay icon list above maps to the English symbol IDs in the design specification.

### 4.4 Fail sokongan wajib yang bukan aset generatif

| ID | Fail | Kegunaan |
|---|---|---|
| DATA-01 | `public/assets/manifest.json` | Path, key, jenis, dimensi, frame dan pivot aset |
| DATA-02 | `public/maps/pilot-map.json` | Tile, objek, facilityId, hit area, laluan pekerja dan spawn |
| DATA-03 | `art/ASSET_LEDGER.csv` | Sumber, prompt, model, hak penggunaan, versi dan semakan |
| DATA-04 | `src/styles/tokens.css` | Warna, tipografi, spacing, radius dan touch target |
| DATA-05 | `references/pixel-art-town-reference.png` | Rujukan visual pengguna; tidak dibundel sebagai peta aplikasi |
| DATA-06 | `src/features/world-editor/componentCatalog.js` | Katalog assetKey/jenis/footprint dan sifat fasiliti; guna semula aset tersedia |
| DATA-07 | `src/lib/demoStore.js` | Rekod/layout demo, versi simpanan browser, pemulihan dan Reset Demo |

Contoh kontrak satu entry manifest:

```json
{
  "key": "worker-walk",
  "path": "/assets/characters/worker-walk.png",
  "type": "spritesheet",
  "width": 128,
  "height": 192,
  "frameWidth": 32,
  "frameHeight": 48,
  "frameCount": 16,
  "origin": [0.5, 1]
}
```

Manifest sebenar ialah array entry mengikut kontrak ini, ditambah `key/path/type/width/height/origin` bagi imej dan parameter tile bagi AS-01. SVG/font dicatat sebagai `svg`/`font`, tanpa berpura-pura mempunyai frame.

## 5. Penggunaan minimum dalam peta pilot

- Beberapa salinan AS-02 sebagai rumah hiasan; tidak memerlukan fungsi rumah individu.
- Satu dewan HALL-001, satu taman PARK-001 dan satu lokasi tong RECYCLE-001.
- Satu bangku BENCH-001 dan satu lampu LAMP-001 sebagai fasiliti yang boleh dilaporkan.
- Aduan lampu mendapat demonstrasi sprite tiga keadaan. Bangku boleh menggunakan sprite sama dengan penanda dan pekerja; tidak memerlukan tiga variasi tambahan.
- Pokok/semak diulang secukupnya; pastikan laluan avatar dan kawasan sentuhan tidak terlindung.
- Lokasi aktiviti mengguna semula taman, dewan dan tong; tidak memerlukan bangunan baharu bagi setiap aktiviti.
- Jika beberapa aktiviti menggunakan satu lokasi, marker agregat membuka senarai aktiviti lokasi itu.

## 6. Pipeline Higgsfield → aset siap guna

### 6.1 Persediaan

1. Tetapkan perspektif, palet, skala 32 px dan arah cahaya.
2. Sediakan sampel rumah, lampu dan pekerja; periksa bersama pada skala telefon.
3. Rekod prompt dan rujukan yang diluluskan; guna semula untuk keluarga aset.
4. Semak model Higgsfield yang tersedia dan input/output yang disokong ketika produksi. Jangan menganggap model boleh terus menghasilkan alpha atau spritesheet tepat.

### 6.2 Generasi

1. Jana satu keluarga aset pada satu masa; kekalkan rujukan gaya.
2. Simpan hasil asal dalam `art/source/`, berasingan daripada `public/assets/`.
3. Bagi lampu, ubah hanya keadaan; bentuk, skala, tapak dan arah cahaya kekal.
4. Bagi pekerja, kunci reka bentuk watak sebelum meminta pose/frame seterusnya.
5. Jika spritesheet generatif tidak konsisten, hasilkan/baiki frame terpilih dan susun melalui preprocessing. Jangan terima grid yang salah semata-mata kerana gambarnya cantik.

Templat brief produksi, bukan jaminan hasil:

```text
Aset: [ID dan nama]. Untuk township pixel art 2D pandangan atas bersudut.
Ikut rujukan gaya yang diluluskan, palet sama dan cahaya kiri atas.
Objek penuh, tapak tengah, margin cukup, tiada teks/watermark.
Kegunaan runtime: [ukuran/pivot/frame], disediakan selepas semakan.
Kekalkan perspektif, proporsi dan reka bentuk antara semua variasi.
```

### 6.3 Penyediaan teknikal

1. Periksa hasil asal; crop dan bersihkan latar jika perlu.
2. Sediakan alpha sebenar, kuantiti warna yang konsisten dan ukuran runtime.
3. Susun tile/frame pada grid tepat, tanpa scaling pecahan atau ruang tidak disengajakan.
4. Simpan PNG/spritesheet runtime mengikut nama dalam inventori.
5. Bina manifest; label status setiap aset sebagai raw, processed, reviewed atau integrated.
6. Uji render sebenar pada latar cerah dan gelap, sambungan tile dan animasi pada skala 1× serta skala paparan.

Skrip preprocessing boleh mengurus crop/saiz/packing; keputusan seni dan pembetulan identiti frame masih memerlukan pemeriksaan. Dokumentasi ini tidak menghasilkan atau membelanjakan kredit untuk aset.

### 6.4 Ledger setiap aset

Medan minimum: `asset_id`, `runtime_path`, `source_path`, `source_type`, `source_url_or_job_id`, `model_if_known`, `prompt_or_prompt_path`, `reference`, `usage_terms`, `dimensions`, `frame_layout`, `review_status`, `review_notes`.

Jika terma/hak belum jelas, tulis status belum disahkan dan jangan anggap aset boleh diedarkan. Gambar pengguna ialah rujukan, bukan bukti hak pengedaran.

## 7. Checklist penerimaan aset dan UI

- [ ] AS-01 hingga AS-19 tersedia dan ledger lengkap.
- [ ] DATA-01 hingga DATA-07 disediakan mengikut fasa berkaitan; ikon/font/token dan store demo tersedia dalam shell tanpa menunggu aset pixel.
- [ ] Semua path manifest wujud, ukuran sepadan dan key tidak berganda.
- [ ] PNG objek transparent sebenar; tiada latar checkerboard, halo atau teks terselit.
- [ ] Tile boleh diulang tanpa jahitan mengganggu pada layout pilot.
- [ ] Walk/repair tidak bergegar dan pivot kaki konsisten.
- [ ] Peta mempunyai facilityId dan hit area yang tepat, termasuk selepas zoom.
- [x] UI-01–UI-20 local shell workflows and labeled failure/success states are implemented and verified; actual permissions remain an optional backend phase. Evidence: `docs/verification/PART_2.md`.
- [x] Temporary editor add/move/remove/confirm/cancel, browser persistence and coherent Reset demo passed reference-safety checks. Final canvas/art footprints and worker routes remain deferred.
- [ ] UI boleh dibaca pada 360 CSS px, panel tidak tersekat keyboard dan status bukan warna sahaja.
- [ ] Gambar aduan/bukti demo disediakan secara berasingan; jika dipentaskan atau generatif, dilabelkan sebagai data contoh.

## 8. Ditangguhkan dengan sengaja

Kereta bergerak, bas, NPC penduduk, avatar pemain, dalaman rumah, variasi rumah tambahan, siang/malam, hujan, air pancut beranimasi, haiwan, bunyi latar, coin, pakaian, kedai, papan tanda rumah boleh dihias, poster unik setiap aktiviti dan peta township kedua.

Satu lagi variasi rumah, poster atau animasi hiasan hanya ditambah selepas semua aliran wajib berfungsi. Ketiadaan aset hiasan tidak boleh menghalang MVP.
