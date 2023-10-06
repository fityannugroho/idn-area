<h1 align="">Indonesyanong API ng Lugar (<i>API Wilayah Indonesia</i>)</h1>

<p>
  <a href="https://nestjs.com"><img alt="NestJS" src="https://img.shields.io/badge/-NestJS-ea2845?style=flat-square&logo=nestjs&logoColor=white" /></a>
  <a href="https://www.typescriptlang.org"><img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" /></a>
  <a href="https://www.prisma.io"><img alt="Prisma" src="https://img.shields.io/badge/-Prisma-1B222D?style=flat-square&logo=prisma&logoColor=white" /></a>
  <a href="https://www.mongodb.com"><img alt="MongoDB" src="https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" /></a>
  <a href="https://www.postgresql.org"><img alt="PostgreSQL" src="https://img.shields.io/badge/-PostgreSQL-657991?style=flat-square&logo=postgresql&logoColor=white" /></a>
  <a href="https://www.mysql.com"><img alt="MySQL" src="https://img.shields.io/badge/-MySQL-00688F?style=flat-square&logo=mysql&logoColor=white" /></a>
</p>

API na nagbibigay ng impormasyon tungkol sa **Mga administratibong lugar sa Indonesia**, sa antas ng lalawigan, bayan, distrito, hanggang sa mga barangay. Isinasama rin nito ang datos tungkol sa mga isla simula [bersyon 1.1.0](https://github.com/fityannugroho/idn-area/releases/tag/v1.1.0).

Ginawa gamit ang [NestJS framework](https://nestjs.com) At isinulat sa TypeScript. [Prisma](https://www.prisma.io) ay ginagamit bilang ORM upang makipag-ugnay sa anumang uri ng mga database (MySQL, PostgreSQL, at MongoDB).

> **⚠️ Pag-a-upgrade sa v3.0.0 ⚠️**
>
> Simula [v3.0.0](https://github.com/fityannugroho/idn-area/releases/tag/v3.0.0),kinakailangan ang **Node.js v18** o mas mataas na bersyon.

<h2>Talaan ng Nilalaman</h2>

- [Pagsisimula](#pagsisimula)
- [Data](#data)
- [Dokumentasyon](#dokumentasyon)
- [Live na pagpapakita](#live-na-pagpapakita)
- [Nagbibigay ng kontribusyon](#nagbibigay-ng-kontribusyon)
- [Ulat ng Problema](#ulat-ng-problema)
  - [Pag-uulat ng Isang Bug](#pag-uulat-ng-isang-bug)
  - [Humihiling ng Bagong Tampok](#humihiling-ng-bagong-tampok)
  - [Nagtatanong ng Tanong](#nagtatanong-ng-tanong)
- [Suportahan ang Proyektong Ito](#suportahan-ang-proyektong-ito)

---

## Pagsisimula

Pakibasa ang [installation guide](docs/installation.md) upang i-install at patakbuhin ang aplikasyong ito.

## Data

Ang datos na aming ginamit ay batay sa opisyal na pinagkukunan na kinakalagaan sa loob ng [**idn-area-data**](https://github.com/fityannugroho/idn-area-data) repositoriyo at Ipinapamahagi bilang isang [npm package](https://www.npmjs.com/package/idn-area-data).

> Ang [data](https://github.com/fityannugroho/idn-area-data/tree/main/data) Ipinapamahagi dito sa ilalim ng [Open Database License (ODbL)](https://github.com/fityannugroho/idn-area-data/blob/main/data/LICENSE.md).

## Documentation

Basahin ang pinakabagong bersyon ng dokumentasyon ng API sa [documentation page](https://idn-area.cyclic.app/docs). Ang dokumentasyong ito ay awtomatikong nalilikha gamit ang [`@nestjs/swagger`](https://docs.nestjs.com/openapi/introduction).

> Puwede rin kayong mag-access sa dokumentasyon sa inyong lokal na makina sa pamamagitan ng pagsisimula ng aplikasyon (makita [Pagsisimula](#pagsisimula)) at buksan ang http://localhost:3000/docs sa iyong browser.

## Live na pagpapakita

Maaari mong subukan ang API sa pamamagitan ng pagpapalit ng http://localhost:3000 sa endpoint na ibinigay sa deskripsyon ng repositoriyo na ito.

Ito ay ilang halimbawang proyekto na gumagamit ng API na ito :

- [Simpleng area dropdown](https://github.com/fityannugroho/idn-area-example)
- [idn-area Map](https://github.com/fityannugroho/idn-area-map)

## Nagbibigay ng kontribusyon

Kung nais mong mag-ambag sa proyektong ito, mangyaring basahin ang [CONTRIBUTING.md](CONTRIBUTING.md) na file at Siguruhing sumusunod ka sa [Pull Request guide](CONTRIBUTING.md#submitting-a-pull-request)

## Ulat ng Problema

May iba't-ibang mga channel para sa bawat problema, mangyaring gamitin ang mga ito sa pamamagitan ng pagsunod sa mga kondisyon na ito :

### Pag-uulat ng Isang Bug
Upang mag-ulat ng bug, mangyaring buksan ang isang bagong isyu ayon sa [guide](CONTRIBUTING.md#submitting-an-issue).

### Humihiling ng Bagong Tampok
Kung mayroon kang bagong tampok sa isip, mangyaring buksan ang isang bagong isyu ayon sa [guide](CONTRIBUTING.md#submitting-an-issue).

### Nagtatanong ng Tanong
Kung mayroon kang tanong, maaari kang maghanap ng mga sagot sa [GitHub Discussions Q&A category](https://github.com/fityannugroho/idn-area/discussions/categories/q-a). Kung wala kang makitang kaugnay na pag-uusap na umiiral na, maari kang magbukas ng isang bagong pag-uusap.

## Suportahan ang Proyektong Ito

<a href="https://trakteer.id/fityannugroho/tip" target="_blank"><img id="wse-buttons-preview" src="https://cdn.trakteer.id/images/embed/trbtn-red-6.png" style="border: 0px none; height: 36px; --darkreader-inline-border-top: currentcolor; --darkreader-inline-border-right: currentcolor; --darkreader-inline-border-bottom: currentcolor; --darkreader-inline-border-left: currentcolor;" alt="Trakteer Saya" data-darkreader-inline-border-top="" data-darkreader-inline-border-right="" data-darkreader-inline-border-bottom="" data-darkreader-inline-border-left="" height="40"></a>

Maari kang mag-suporta sa proyektong ito sa pamamagitan ng pag-donate sa pamamagitan ng  [GitHub Sponsor](https://github.com/sponsors/fityannugroho), [Trakteer](https://trakteer.id/fityannugroho/tip), o [Saweria](https://saweria.co/fityannugroho).
