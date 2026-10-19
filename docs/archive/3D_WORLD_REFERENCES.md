# Rujukan Dunia 3D untuk Idea Township SDP

Tarikh semakan: 13 Oktober 2026.

Dokumen ini mengumpulkan projek, library, aset dan tutorial yang boleh mengurangkan kerja membina dunia 3D dari kosong. Cadangan penyesuaian di bawah ialah penilaian untuk idea kita, bukan ciri yang sudah tersedia dalam semua projek tersebut.

## 1. Konteks idea kita

- Dunia 3D kartun yang menggambarkan kawasan perumahan, dengan rumah dan fasiliti yang boleh diklik.
- Aduan dihantar kepada Sime Darby Property (SDP), yang mengurus pemeriksaan, pembaikan dan kemas kini status.
- Avatar pekerja menggambarkan aktiviti pemeriksaan atau pembaikan berdasarkan status yang disahkan oleh SDP.
- Unsur seperti permainan tertumpu pada antaramuka dan interaksi. Ganjaran, mata, pembelian pakaian dan ekonomi permainan bukan keperluan sekarang.
- Penyelidikan ini tertumpu pada dunia 3D. Sistem aduan dan sambungan operasi SDP masih perlu dibangunkan.

## 2. Pilihan yang patut dilihat dahulu

| Rujukan | Apa yang sudah tersedia | Kegunaan untuk kita | Lesen / batas utama |
| --- | --- | --- | --- |
| CitySim.js / SimCity Three.js Clone | Bandar 3D, kamera dan pemilihan objek | Asas paling langsung untuk peta township | MIT; README menyatakan belum menyokong telefon |
| Claw3D | Pejabat 3D dan avatar yang menunjukkan aktiviti kerja | Rujukan utama untuk status kerja → pergerakan / aktiviti avatar | MIT bagi kod projek; aplikasi keseluruhan mempunyai banyak fungsi AI yang perlu dipisahkan |
| Wawa Sensei: siri Sims dengan R3F | Tutorial dunia ala Sims, grid, avatar dan pencarian laluan | Belajar bagaimana objek, avatar dan pergerakan digabungkan | Kod awam tersedia; lesen guna semula belum dapat disahkan |
| Hubs Foundation | Platform ruang 3D bersama, untuk desktop, telefon dan VR | Rujukan virtual space yang lebih lengkap | MPL-2.0 bagi klien; pemasangan keseluruhan lebih rumit |

**Cadangan awal:** cuba asas CitySim.js untuk prototaip peta paling cepat. Gunakan Claw3D dan siri Wawa sebagai rujukan mekanisme avatar. Jika pasukan mahu aplikasi React sejak awal, React Three Fiber + Drei + aset Kenney ialah pilihan yang munasabah, tetapi ia masih memerlukan kita menyusun peta sendiri.

## 3. CitySim.js — asas bandar 3D yang paling dekat

Projek Daniel Greenheck / Coffee Code Create menggunakan Three.js. Ada kod sumber, demo dan siri tutorial YouTube. Kod kamera menggunakan `OrthographicCamera`, yang sesuai untuk pandangan bandar dari sudut atas. Kod `game.js` juga sudah menggunakan `Raycaster` untuk mengenal pasti objek dan menyerlahkan pilihan pengguna.

- [Kod sumber](https://github.com/dgreenheck/simcity-threejs-clone)
- [Demo](https://dgreenheck.github.io/simcity-threejs-clone/)
- [Siri YouTube: Building a SimCity Clone with Three.js](https://www.youtube.com/playlist?list=PLtzt35QOXmkJ9unmoeA5gXHcscQHJVQpW)
- [Lesen MIT](https://github.com/dgreenheck/simcity-threejs-clone/blob/main/LICENSE)
- [Kod kamera](https://github.com/dgreenheck/simcity-threejs-clone/blob/main/src/scripts/camera.js)
- [Kod scene dan pemilihan objek](https://github.com/dgreenheck/simcity-threejs-clone/blob/main/src/scripts/game.js)

Penyesuaian yang dicadangkan: gunakan susun atur kejiranan tetap, tambah ID fasiliti dan panel aduan apabila objek dipilih. Fungsi ekonomi dan pembinaan bandar boleh dikeluarkan daripada pengalaman penduduk.

**Batas:** avatar pembaikan bukan fungsi sedia ada yang disahkan. README menyatakan demo belum menyokong telefon; kawalan sentuh perlu ditambah. `package.json` masih merujuk Three.js `^0.155.0` dan Vite `^4.4.5`, jadi cuba versi asal dahulu sebelum menaik taraf. [Sumber versi](https://github.com/dgreenheck/simcity-threejs-clone/blob/main/package.json).

## 4. Claw3D — contoh kerja sebenar diterjemahkan kepada aktiviti avatar

Claw3D ialah aplikasi pejabat 3D untuk memvisualkan kerja agen AI. Ia relevan kerana dunia 3D menerima keadaan kerja daripada lapisan lain, kemudian menghasilkan aktiviti dan pergerakan avatar. Untuk kita, sumber keadaan itu boleh diganti dengan rekod kerja penyelenggaraan SDP.

- [Repositori asal](https://github.com/iamlukethedev/Claw3D)
- [Lesen MIT](https://github.com/iamlukethedev/Claw3D/blob/main/LICENSE)
- [Panduan struktur kod](https://github.com/iamlukethedev/Claw3D/blob/main/CODE_DOCUMENTATION.md)
- [Kod pencetus animasi](https://github.com/iamlukethedev/Claw3D/blob/main/src/lib/office/eventTriggers.ts)
- [Kod dunia 3D](https://github.com/iamlukethedev/Claw3D/blob/main/src/features/retro-office/RetroOffice3D.tsx)
- [Kod navigasi](https://github.com/iamlukethedev/Claw3D/blob/main/src/features/retro-office/core/navigation.ts)

Menurut dokumentasi, alirannya ialah peristiwa kerja → keadaan animasi → destinasi dan aktiviti dalam scene. Ini rujukan yang kuat untuk vision avatar kau.

Repositori menyediakan mod demo melalui `npm run demo-gateway` dan `npm run dev`, dijalankan dalam dua terminal. Mod ini membolehkan penerokaan pejabat tanpa memasang OpenClaw atau Hermes. [Arahan rasmi](https://github.com/iamlukethedev/Claw3D#demo-mode).

**Batas:** ia bukan komponen township yang terus boleh dipasang. Mengambil keseluruhan aplikasi membawa banyak fungsi operasi agen yang tidak diperlukan. Panduan kod juga membezakan scene React Three Fiber daripada editor berasaskan Phaser; kedua-duanya bukan runtime yang sama. Lesen aset pihak ketiga perlu diperiksa berasingan apabila memilih fail untuk digunakan.

## 5. Wawa Sensei — rujukan tutorial paling sesuai untuk avatar dan dunia interaktif

Siri tujuh bahagian ini membina pengalaman ala Sims / Animal Crossing menggunakan React Three Fiber dan Socket.io. Bahagian paling berguna untuk kita ialah pergerakan asas, grid, pencarian laluan dan susunan objek.

- [Bahagian 1: komunikasi dan pergerakan asas](https://wawasensei.dev/tuto/build-a-multiplayer-game-with-react-three-fiber-and-socket-io)
- [Bahagian 2: sistem grid](https://wawasensei.dev/tuto/multiplayer-game-tutorial-with-r3f-and-socket-io-grid-system)
- [Bahagian 3: pencarian laluan](https://wawasensei.dev/tuto/multiplayer-game-tutorial-with-r3f-and-socket-io-pathfinding)
- [Bahagian 4: Room Builder](https://wawasensei.dev/tuto/multiplayer-game-tutorial-with-r3f-and-socket-io-room-builder)
- [Bahagian akhir dan pautan demo](https://wawasensei.dev/tuto/i-build-a-multiplayer-sims-game-with-javascript)
- [Repositori yang dipautkan oleh tutorial](https://github.com/wass08/r3f-sims-online)

Halaman tutorial mengandungi video YouTube. Pencarian laluan menggunakan grid dan PathFinding.js untuk mengelakkan halangan; ini sesuai sebagai rujukan avatar pekerja yang bergerak menuju fasiliti.

**Penemuan kod:** branch `main` repositori yang dipautkan masih menunjukkan contoh asas, bukan semua ciri tujuh episod. `Experience.jsx` menghantar koordinat klik lantai; `AnimatedWoman.jsx` memuatkan model, mengklon rangka dan menukar animasi antara `Run` dan `Idle`.

- [Scene asas](https://github.com/wass08/r3f-sims-online/blob/main/client/src/components/Experience.jsx)
- [Avatar dan animasi](https://github.com/wass08/r3f-sims-online/blob/main/client/src/components/AnimatedWoman.jsx)

**Batas:** tiada lesen projek yang dapat disahkan daripada semakan ini. Gunakan sebagai rujukan pembelajaran dahulu; jangan anggap kod awam itu automatik boleh disalin. Animasi membaiki juga masih perlu dipilih atau dihasilkan.

## 6. Hubs Foundation — ruang maya lengkap

Hubs ialah platform kolaborasi 3D dengan klien untuk desktop, telefon dan VR, dibina menggunakan A-Frame. Ekosistemnya turut mempunyai Spoke untuk penyuntingan scene dan Reticulum untuk pelayan.

- [Kod klien dan lesen MPL-2.0](https://github.com/Hubs-Foundation/hubs)
- [Editor scene Spoke](https://github.com/Hubs-Foundation/spoke)
- [Panduan Community Edition](https://github.com/Hubs-Foundation/hubs-cloud/blob/master/community-edition/readme.md)
- [Persekitaran pembangunan Docker Compose](https://github.com/Hubs-Foundation/hubs-compose)

**Penilaian:** berguna jika kita mahu ruang sosial yang ramai orang boleh masuk bersama. Untuk peta aduan dan avatar penyelenggaraan, beban pemasangan platform ini mungkin melebihi manfaatnya. Community Edition memerlukan konfigurasi infrastruktur, dan Hubs Compose dinyatakan sebagai persediaan pembangunan, bukan produksi.

## 7. Library dan aset yang menjimatkan kerja

| Komponen | Peranan | Lesen yang ditunjukkan sumber | Pautan |
| --- | --- | --- | --- |
| React Three Fiber | Memaparkan scene Three.js sebagai komponen React | MIT | [GitHub](https://github.com/pmndrs/react-three-fiber) |
| Drei | Pembantu kamera, pemuatan model dan animasi | MIT | [GitHub](https://github.com/pmndrs/drei) |
| gltfjsx | Menukar model GLTF / GLB kepada komponen JSX | MIT | [GitHub](https://github.com/pmndrs/gltfjsx) |
| PathFinding.js | Mengira laluan atas grid | MIT | [GitHub](https://github.com/qiao/PathFinding.js) |
| Ecctrl | Kawalan watak dengan fizik dan input sentuh | MIT | [GitHub](https://github.com/pmndrs/ecctrl) · [Demo](https://ecctrl.app/) |
| Kenney City Kit (Suburban) | Model bangunan kawasan perumahan; 40 fail disenaraikan | CC0 | [Aset](https://kenney.nl/assets/city-kit-suburban) |
| Quaternius Ultimate Animated Character Pack | Watak beranimasi; 52 model disenaraikan | CC0 | [Aset](https://quaternius.com/packs/ultimatedanimatedcharacter.html) |

Library bukan dunia siap. Kenney dan Quaternius pula menyediakan model, bukan sistem aplikasi. Gabungan inilah yang membolehkan kita menyusun dunia dengan bahan sedia ada.

Ecctrl boleh ditangguhkan jika penduduk hanya memusingkan peta dan mengklik fasiliti. Avatar pekerja yang bergerak secara automatik lebih memerlukan laluan dan pertukaran animasi berbanding kawalan watak oleh pengguna.

Model Quaternius disenaraikan dalam format FBX, OBJ dan Blend. Jika memilihnya untuk web, eksport kepada GLB perlu dirancang. Jangan anggap semua model mempunyai klip `repair`; semak animasi sebenar sebelum menjanjikannya.

Untuk aplikasi React, dokumentasi menyatakan R3F 8 dipadankan dengan React 18, manakala R3F 9 dengan React 19. Semak versi projek asas sebelum menggabungkan pakej. [Rujukan keserasian](https://github.com/pmndrs/react-three-fiber#readme).

## 8. Cara orang menggunakan kod dan prompt

### Kaedah berasaskan kod yang boleh kita pelajari

1. CitySim: asingkan kamera, input, pemilihan objek dan data bandar.
2. Wawa: muatkan model beranimasi, tentukan destinasi, kemudian tukar animasi mengikut pergerakan.
3. Claw3D: tentukan keadaan kerja dahulu, kemudian terbitkan aktiviti avatar daripada keadaan tersebut.
4. gltfjsx: hasilkan komponen model secara automatik supaya tidak perlu menulis struktur mesh satu demi satu.

Untuk memilih fasiliti dalam React, R3F menyediakan peristiwa seperti `onClick` dan `onPointerOver`. Ini membolehkan panel aduan dihubungkan dengan objek 3D. [Dokumentasi peristiwa](https://r3f.docs.pmnd.rs/api/events).

### Contoh penggunaan AI daripada pencipta tutorial

Wawa Sensei mempunyai tutorial **Vibe Code a 3D Carousel with Claude Code & Three.js**. Ia menunjukkan pendekatan arahan berperingkat untuk membina dan memperhalus interaksi 3D. Projeknya sebuah carousel, jadi manfaatnya untuk kita ialah cara memberi arahan dan membuat pembetulan, bukan dunia township siap.

- [Tutorial dengan video YouTube](https://wawasensei.dev/tuto/how-to-vibe-code-a-carousel)
- [Kod projek](https://github.com/wass08/r3f-carousel-slider)

Semakan ini membaca penerangan pencipta dan sumber kod terpilih; ia tidak menonton keseluruhan video atau mendapatkan transkrip. Tiada prompt asal lengkap yang disahkan. Contoh berikut ialah prompt cadangan kita sendiri.

### Prompt A — fahamkan projek sebelum ubah

```text
Baca repositori asas ini dahulu. Terangkan fail yang mengurus scene,
kamera, aset, pemilihan objek dan pergerakan watak. Semak lesen kod
dan model yang akan digunakan. Cadangkan bahagian minimum yang boleh
diguna semula untuk peta township 3D. Jangan ubah kod dalam langkah ini.

Konteks: aplikasi milik Sime Darby Property. Penduduk mengklik fasiliti
untuk menghantar aduan. Antaramuka kelihatan seperti permainan, dengan
model kartun dan avatar pekerja. Fokus sekarang ialah pelaporan masalah
dan paparan status kerja; tiada sistem ganjaran atau pembelian.
```

### Prompt B — ubah asas bandar kepada satu aliran aduan

```text
Gunakan scene dan kamera projek asas yang dipilih. Kekalkan stack dan
versi asal untuk perubahan pertama. Sediakan satu kejiranan kecil dengan
susun atur tetap, rumah, jalan, pokok dan tiga lampu jalan yang boleh
dipilih. Setiap lampu mempunyai facilityId yang stabil.

Apabila lampu diklik, serlahkan objek dan buka panel Bahasa Melayu dengan
nama fasiliti, lokasi dan butang Laporkan Masalah. Gunakan data contoh
yang jelas dilabelkan. Fasiliti ini dalam skop penyelenggaraan SDP.

Buktikan aliran memilih fasiliti dan membuka panel berfungsi dahulu.
Selepas itu, tambah kawalan sentuh dan semak prestasi pada telefon.
```

### Prompt C — sambungkan status SDP kepada avatar

```text
Tambah satu avatar pekerja menggunakan aset berlesen yang disahkan.
Keadaan kerja datang daripada rekod penyelenggaraan, bukan pemasa animasi.

Status baharu / diterima: tunjuk penanda aduan.
Status pemeriksaan di lokasi: avatar dipaparkan di fasiliti dengan label
Sedang diperiksa selepas pengesahan petugas.
Status pembaikan: avatar menunjukkan aktiviti kerja di fasiliti.
Status menunggu alat ganti: hentikan aktiviti kerja dan paparkan sebab.
Status selesai: paparkan keadaan fasiliti yang pulih serta bukti selesai.

Jika avatar berjalan menuju fasiliti, gunakan laluan yang mengelak rumah.
Pergerakan itu ialah visualisasi, bukan GPS langsung petugas.
Semak klip animasi sebenar dalam aset. Jika tiada klip membaiki, gunakan
aksi sementara yang dilabelkan untuk prototaip dan catat kerja yang tinggal.
Jangan menandakan aduan selesai hanya kerana animasi sudah tamat.
```

## 9. Keputusan praktikal untuk langkah seterusnya

**Laluan prototaip paling cepat:** nilai CitySim.js dahulu, gunakan kamera dan pemilihan objeknya, kemudian tambah satu fasiliti yang boleh dilaporkan. Selepas aliran itu berfungsi, tambah seorang avatar yang bertindak mengikut status SDP.

**Laluan aplikasi React:** gunakan R3F + Drei, model kejiranan Kenney dan watak berlesen. Ambil pola pergerakan daripada tutorial Wawa dan pola keadaan kerja daripada Claw3D. Jangan cuba menggabungkan keseluruhan aplikasi tersebut sekali gus.

Peta contoh tidak automatik menjadi salinan township sebenar. Susun atur, ID fasiliti, lokasi dan tanggungjawab penyelenggaraan perlu dipadankan dengan data SDP kemudian.

**Tahap semakan:** repositori, dokumentasi, lesen yang dinyatakan dan beberapa fail kod telah diperiksa. Halaman demo CitySim boleh dicapai melalui alat web, tetapi rendering 3D dan interaksinya belum diuji dalam browser. Tiada repositori diklon, dipasang atau dijalankan pada komputer ini. Cadangan prestasi dan usaha penyesuaian masih perlu dibuktikan melalui percubaan kecil.
