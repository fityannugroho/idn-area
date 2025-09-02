<h1 align="">Indonesyanong API ng Lugar</h1>

<p>
  <a href="https://nestjs.com"><img alt="NestJS" src="https://img.shields.io/badge/-NestJS-ea2845?style=flat-square&logo=nestjs&logoColor=white" /></a>
  <a href="https://www.typescriptlang.org"><img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" /></a>
  <a href="https://www.prisma.io"><img alt="Prisma" src="https://img.shields.io/badge/-Prisma-1B222D?style=flat-square&logo=prisma&logoColor=white" /></a>
  <a href="https://www.mongodb.com"><img alt="MongoDB" src="https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" /></a>
  <a href="https://www.postgresql.org"><img alt="PostgreSQL" src="https://img.shields.io/badge/-PostgreSQL-657991?style=flat-square&logo=postgresql&logoColor=white" /></a>
  <a href="https://www.mysql.com"><img alt="MySQL" src="https://img.shields.io/badge/-MySQL-00688F?style=flat-square&logo=mysql&logoColor=white" /></a>
</p>

[English](../README.md) | [हिन्दी](README_hi.md) | [Bahasa Indonesia](README_id.md) | [한국어](README_ko.md) | **Tagalog**

API na nagbibigay ng impormasyon tungkol sa **Mga administratibong lugar sa Indonesia**, sa antas ng lalawigan, bayan, distrito, hanggang sa mga barangay. Isinasama rin nito ang datos tungkol sa mga isla simula [bersyon 1.1.0](https://github.com/fityannugroho/idn-area/releases/tag/v1.1.0).

Ginawa gamit ang [NestJS framework](https://nestjs.com) At isinulat sa TypeScript. [Prisma](https://www.prisma.io) ay ginagamit bilang ORM upang makipag-ugnay sa anumang uri ng mga database (MySQL, PostgreSQL, at MongoDB).

> **⚠️ Pag-a-upgrade sa v3.0.0 ⚠️**
>
> Simula [v3.0.0](https://github.com/fityannugroho/idn-area/releases/tag/v3.0.0),kinakailangan ang **Node.js v18** o mas mataas na bersyon.

## Pagsisimula

Pakibasa ang [gabay sa Pag-Install](installation.md) upang i-install at patakbuhin ang aplikasyong ito.

## Data

Ang datos na aming ginamit ay batay sa opisyal na pinagkukunan na kinakalagaan sa loob ng [**idn-area-data**](https://github.com/fityannugroho/idn-area-data) repositoriyo at Ipinapamahagi bilang isang [npm package](https://www.npmjs.com/package/idn-area-data).

> Ang [data](https://github.com/fityannugroho/idn-area-data/tree/main/data) Ipinapamahagi dito sa ilalim ng [Lisensiyang Buksan ang Database](https://github.com/fityannugroho/idn-area-data/blob/main/data/LICENSE.md).

## Dokumentasyon

Basahin ang pinakabagong bersyon ng dokumentasyon ng API sa [Pahina ng dokumentasyon](https://idn-area.up.railway.app). Ang dokumentasyong ito ay awtomatikong nalilikha gamit ang [`@nestjs/swagger`](https://docs.nestjs.com/openapi/introduction).

> Puwede rin kayong mag-access sa dokumentasyon sa inyong lokal na makina sa pamamagitan ng pagsisimula ng aplikasyon (makita [Pagsisimula](#pagsisimula)) at buksan ang http://localhost:9206 sa iyong browser.

## Live na pagpapakita

Maaari mong subukan ang API sa pamamagitan ng pagpapalit ng http://localhost:9206 sa endpoint na ibinigay sa deskripsyon ng repositoriyo na ito.

Ito ay ilang halimbawang proyekto na gumagamit ng API na ito :

- [Mapa ng idn-area](https://github.com/fityannugroho/idn-area-map)

## Nagbibigay ng kontribusyon

Kung nais mong mag-ambag sa proyektong ito, mangyaring basahin ang [CONTRIBUTING.md](../CONTRIBUTING.md) na file at Siguruhing sumusunod ka sa [Gabay sa Pull Request](../CONTRIBUTING.md#submitting-a-pull-request).

## Ulat ng Problema

May iba't-ibang mga channel para sa bawat problema, mangyaring gamitin ang mga ito sa pamamagitan ng pagsunod sa mga kondisyon na ito :

### Pag-uulat ng Isang Bug

Upang mag-ulat ng bug, mangyaring buksan ang isang bagong isyu ayon sa [gabay](../CONTRIBUTING.md#submitting-an-issue).

### Humihiling ng Bagong Tampok

Kung mayroon kang bagong tampok sa isip, mangyaring buksan ang isang bagong isyu ayon sa [gabay](../CONTRIBUTING.md#submitting-an-issue).

### Nagtatanong ng Tanong

Kung mayroon kang tanong, maaari kang maghanap ng mga sagot sa [Kategorya ng GitHub Discussions Q&A](https://github.com/fityannugroho/idn-area/discussions/categories/q-a). Kung wala kang makitang kaugnay na pag-uusap na umiiral na, maari kang magbukas ng isang bagong pag-uusap.

## Suportahan ang Proyektong Ito

Magbigay ng ⭐️ kung nakatulong sa iyo ang proyektong ito!

Mangyaring isaalang-alang din ang pagsuporta sa proyektong ito sa pamamagitan ng isang donasyon. Ang iyong donasyon ay makakatulong sa amin na mapanatili at bumuo ng proyektong ito at magbigay sa iyo ng mas mahusay na suporta.
