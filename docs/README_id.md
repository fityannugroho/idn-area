<h1 align="">API Wilayah Indonesia</h1>

<p>
  <a href="https://nestjs.com"><img alt="NestJS" src="https://img.shields.io/badge/-NestJS-ea2845?style=flat-square&logo=nestjs&logoColor=white" /></a>
  <a href="https://www.typescriptlang.org"><img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" /></a>
  <a href="https://www.prisma.io"><img alt="Prisma" src="https://img.shields.io/badge/-Prisma-1B222D?style=flat-square&logo=prisma&logoColor=white" /></a>
  <a href="https://www.mongodb.com"><img alt="MongoDB" src="https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" /></a>
  <a href="https://www.postgresql.org"><img alt="PostgreSQL" src="https://img.shields.io/badge/-PostgreSQL-657991?style=flat-square&logo=postgresql&logoColor=white" /></a>
  <a href="https://www.mysql.com"><img alt="MySQL" src="https://img.shields.io/badge/-MySQL-00688F?style=flat-square&logo=mysql&logoColor=white" /></a>
</p>

[English](../README.md) | [हिन्दी](README_hi.md) | **Bahasa Indonesia** | [한국어](README_ko.md) | [Tagalog](README_tl.md)

API yang menyediakan informasi tentang **wilayah administratif Indonesia**, mulai dari tingkat provinsi, kabupaten, kecamatan, hingga tingkat desa. API ini juga menyediakan data pulau sejak [versi 1.1.0](https://github.com/fityannugroho/idn-area/releases/tag/v1.1.0).

Dibuat dengan [NestJS framework](https://nestjs.com) dan ditulis dengan bahasa pemrograman TypeScript. [Prisma](https://www.prisma.io) digunakan sebagai ORM untuk berinteraksi dengan berbagai macam jenis database (MySQL, PostgreSQL, dan MongoDB).

> **⚠️ Meningkatkan ke v3.0.0 ⚠️**
>
> Sejak [v3.0.0](https://github.com/fityannugroho/idn-area/releases/tag/v3.0.0), diperlukan **Node.js v18** atau versi yang lebih tinggi.

## Memulai

Tolong baca [panduan instalasi](installation.md) untuk memasang dan menjalankan aplikasi ini.

## Data

Data yang kami gunakan menggunakan sumber yang resmi, dikelola di repositori [**idn-area-data**](https://github.com/fityannugroho/idn-area-data) dan didistribusikan sebagai sebuah [npm package](https://www.npmjs.com/package/idn-area-data).

> [Data](https://github.com/fityannugroho/idn-area-data/tree/main/data) tersebut tersedia dibawah [Open Database License (ODbL)](https://github.com/fityannugroho/idn-area-data/blob/main/data/LICENSE.md).

## Dokumentasi

Baca versi terbaru dokumentasi API di [halaman dokumentasi](https://idn-area.up.railway.app/docs). Dokumentasi ini dibuat secara otomatis menggunakan [`@nestjs/swagger`](https://docs.nestjs.com/openapi/introduction).

> Anda juga dapat mengakses dokumentasinya di perangkat lokal Anda dengan menjalankan aplikasi ini (lihat [Memulai](#memulai)) dan buka http://localhost:3000/docs di browser Anda.

## Demo

Anda dapat mencoba API ini dengan mengganti http://localhost:3000 dengan endpoint yang disediakan dalam deskripsi repositori ini.

Berikut adalah beberapa proyek contoh yang menggunakan API ini:

- [idn-area Map](https://github.com/fityannugroho/idn-area-map)

## Kontribusi

Jika Anda ingin berkontribusi pada proyek ini, harap baca file [CONTRIBUTING.md](../CONTRIBUTING.md) dan pastikan Anda mengikuti aturan yang ada di [Panduan Pull Request](../CONTRIBUTING.md#submitting-a-pull-request).

## Melaporkan Masalah

Kami memiliki berbagai kanal yang berbeda untuk setiap masalah, harap gunakan kanal dengan mengikuti syarat-syarat ini:

### Melaporkan Bug

Untuk melaporkan bug, silahkan buka isu baru dengan mengikuti [panduan](../CONTRIBUTING.md#submitting-an-issue).

### Meminta Fitur Baru

Jika Anda punya ide untuk fitur baru, silahkan buka isu baru dengan mengikuti [panduan](../CONTRIBUTING.md#submitting-an-issue).

### Mengajukan Pertanyaan

Jika Anda punya pertanyaan, silahkan cari jawabanya di [Diskusi GitHub Kategori Tanya Jawab](https://github.com/fityannugroho/idn-area/discussions/categories/q-a). Jika Anda tidak menemukan diskusi yang relevan, Anda dapat membuka diskusi yang baru.

## Dukung Proyek Ini

Berikan ⭐️ jika proyek ini membantu Anda!

Harap pertimbangkan juga untuk mendukung proyek ini dengan donasi. Donasi Anda akan membantu kami mempertahankan dan mengembangkan proyek ini dan memberi Anda dukungan yang lebih baik.
