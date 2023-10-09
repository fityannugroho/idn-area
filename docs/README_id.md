<h1 align="">API Wilayah Indonesia</h1>

<p>
  <a href="https://nestjs.com"><img alt="NestJS" src="https://img.shields.io/badge/-NestJS-ea2845?style=flat-square&logo=nestjs&logoColor=white" /></a>
  <a href="https://www.typescriptlang.org"><img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" /></a>
  <a href="https://www.prisma.io"><img alt="Prisma" src="https://img.shields.io/badge/-Prisma-1B222D?style=flat-square&logo=prisma&logoColor=white" /></a>
  <a href="https://www.mongodb.com"><img alt="MongoDB" src="https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" /></a>
  <a href="https://www.postgresql.org"><img alt="PostgreSQL" src="https://img.shields.io/badge/-PostgreSQL-657991?style=flat-square&logo=postgresql&logoColor=white" /></a>
  <a href="https://www.mysql.com"><img alt="MySQL" src="https://img.shields.io/badge/-MySQL-00688F?style=flat-square&logo=mysql&logoColor=white" /></a>
</p>

[English](README.md) | [हिन्दी](docs/README_hi.md) | [Tagalog](docs/README_tl.md) | **Indonesia**

API yang memberikan informasi tentang **wilayah administratif Indonesia**, mulai dari tingkat provinsi, kabupaten, kecamatan, hingga tingkat desa. Dan juga menyediakan data pulau sejak [version 1.1.0](https://github.com/fityannugroho/idn-area/releases/tag/v1.1.0).

Dibuat dengan [NestJS framework](https://nestjs.com) dan ditulis dengan bahasa TypeScript. [Prisma](https://www.prisma.io) digunakan sebagai ORM untuk berinteraksi dengan berbagai macam databases (MySQL, PostgreSQL, and MongoDB).

> **⚠️ Upgrading to v3.0.0 ⚠️**
>
> Sejak [v3.0.0](https://github.com/fityannugroho/idn-area/releases/tag/v3.0.0), harus menggunakan **Node.js v18** atau versi yang lebih tinggi.

<h2>Daftar Isi</h2>

- [Panduan Awal](#panduan-awal)
- [Data](#data)
- [Dokumentasi](#dokumentasi)
- [Demo di Lokal](#demo-di-lokal)
- [Kontribusi](#kontribusi)
- [Laporan Masalah](#laporan-masalah)
  - [Lapor Error](#lapor-error)
  - [Meminta Fitur Baru](#meminta-fitur-baru)
  - [Pertanyaan](#pertanyaan)
- [Dukung Proyek Ini](#dukung-proyek-ini)

---

## Panduan Awal

Tolong baca [panduan install](docs/installation.md) untuk menginstall dan menjalankan aplikasi ini.

## Data
Data yang kami gunakan menggunakan sumber yang resmi, dikelola oleh [**idn-area-data**](https://github.com/fityannugroho/idn-area-data) repositori dan didistribusikan sebagai sebuah [npm package](https://www.npmjs.com/package/idn-area-data).

> [data](https://github.com/fityannugroho/idn-area-data/tree/main/data) ini tersedia dibawah [Open Database License (ODbL)](https://github.com/fityannugroho/idn-area-data/blob/main/data/LICENSE.md).

## Dokumentasi

Baca versi terbaru dokumentasi API di [documentation page](https://idn-area.cyclic.app/docs). Dokumentasi ini otomatis dibuat menggunakan [`@nestjs/swagger`](https://docs.nestjs.com/openapi/introduction).

> Anda juga dapat mengakses dokumentasi di lokal anda dengan menjalankan aplikasi ini. (lihat [Getting Started](#getting-started)) dan buka http://localhost:3000/docs di internet browser.

## Demo di Lokal

Anda dapat mencoba API ini dengan mengganti http://localhost:3000 dengan endpoint yang disediakan dalam deskripsi repositori ini.

Berikut adalah beberapa proyek contoh yang menggunakan API ini:

- [Simple area dropdown](https://github.com/fityannugroho/idn-area-example)
- [idn-area Map](https://github.com/fityannugroho/idn-area-map)

## Kontribusi

Jika anda ingin berkontribusi pada proyek ini, harap baca file [CONTRIBUTING.md](CONTRIBUTING.md) dan pastikan anda mengikuti aturan yang ada di [Pull Request guide](CONTRIBUTING.md#submitting-a-pull-request).

## Laporan Masalah

Kami memiliki berbagai kanal yang berbeda untuk setiap masalah, harap gunakan kanel dengan mengikuti syarat-syarat ini:

### Lapor Error
Untuk melaporkan error, silahkan buka isu baru dengan mengikuti [panduan](CONTRIBUTING.md#submitting-an-issue).

### Meminta Fitur Baru
Jika anda punya ide untuk fitur baru, silahkan buka isu baru dengan mengikuti [panduan](CONTRIBUTING.md#submitting-an-issue).

### Pertanyaan
Jika anda punya pertanyaan, silahkan cari jawabanya di [GitHub Discussions Q&A category](https://github.com/fityannugroho/idn-area/discussions/categories/q-a). Jika anda tidak menemukan diskusi yang relevan, anda dapat membuka diskusi yang baru.

## Dukung Proyek Ini

<a href="https://trakteer.id/fityannugroho/tip" target="_blank"><img id="wse-buttons-preview" src="https://cdn.trakteer.id/images/embed/trbtn-red-6.png" style="border: 0px none; height: 36px; --darkreader-inline-border-top: currentcolor; --darkreader-inline-border-right: currentcolor; --darkreader-inline-border-bottom: currentcolor; --darkreader-inline-border-left: currentcolor;" alt="Trakteer Saya" data-darkreader-inline-border-top="" data-darkreader-inline-border-right="" data-darkreader-inline-border-bottom="" data-darkreader-inline-border-left="" height="40"></a>

Anda dapat mendukung proyek ini dengan berdonasi melalui [GitHub Sponsor](https://github.com/sponsors/fityannugroho), [Trakteer](https://trakteer.id/fityannugroho/tip), or [Saweria](https://saweria.co/fityannugroho).
