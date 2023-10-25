<h1 align="">인도네시아 지역 API</h1>

<p>
  <a href="https://nestjs.com"><img alt="NestJS" src="https://img.shields.io/badge/-NestJS-ea2845?style=flat-square&logo=nestjs&logoColor=white" /></a>
  <a href="https://www.typescriptlang.org"><img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" /></a>
  <a href="https://www.prisma.io"><img alt="Prisma" src="https://img.shields.io/badge/-Prisma-1B222D?style=flat-square&logo=prisma&logoColor=white" /></a>
  <a href="https://www.mongodb.com"><img alt="MongoDB" src="https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" /></a>
  <a href="https://www.postgresql.org"><img alt="PostgreSQL" src="https://img.shields.io/badge/-PostgreSQL-657991?style=flat-square&logo=postgresql&logoColor=white" /></a>
  <a href="https://www.mysql.com"><img alt="MySQL" src="https://img.shields.io/badge/-MySQL-00688F?style=flat-square&logo=mysql&logoColor=white" /></a>
</p>

[English](../README.md) | [हिन्दी](README_hi.md) | [Bahasa Indonesia](README_id.md) | **한국어** | [Tagalog](README_tl.md)

인도네시아의 행정 구역 정보를 제공하는 API입니다. 이 API는 성, 지방, 지구 및 마을 수준의 정보뿐만 아니라 [버전 1.1.0](https://github.com/fityannugroho/idn-area/releases/tag/v1.1.0)부터는 섬 데이터도 제공합니다.

이 API는 [NestJS 프레임워크](https://nestjs.com)로 구축되었으며 TypeScript로 작성되었습니다. 데이터베이스와 상호 작용하기 위해 [Prisma](https://www.prisma.io)를 ORM으로 사용합니다. 이 API는 MySQL, PostgreSQL 및 MongoDB와 같은 다양한 종류의 데이터베이스와 상호 작용할 수 있습니다.

> **⚠️ v3.0.0 로 업데이트 됐습니다. ⚠️**
>
> [v3.0.0](https://github.com/fityannugroho/idn-area/releases/tag/v3.0.0) 부터, **Node.js v18** 또는 그 이상의 버전이 요구됩니다.

<h2>목차</h2>

- [시작하기](#시작하기)
- [데이터](#데이터)
- [문서](#문서)
- [라이브 데모](#라이브-데모)
- [기여](#기여)
- [문제 보고](#문제-보고)
  - [버그 보고](#버그-보고)
  - [새로운 기능 요청](#새로운-기능-요청)
  - [질문하기](#질문하기)
- [이 프로젝트 지원하기](#이-프로젝트-지원하기)

---

## 시작하기

이 앱을 설치하고 실행하려면 [설치 가이드](./installation.md)를 읽어보세요.

## 데이터

우리가 사용한 데이터는 공식 소스를 기반으로 하며 [**idn-area-data**](https://github.com/fityannugroho/idn-area-data) 리포지토리에서 관리되며 [npm 패키지](https://www.npmjs.com/package/idn-area-data)로 배포됩니다.

> [데이터](https://github.com/fityannugroho/idn-area-data/tree/main/data)는 [Open Database License (ODbL)](https://github.com/fityannugroho/idn-area-data/blob/main/data/LICENSE.md) 하에 제공됩니다.

## 문서

최신 API 문서를 [문서 페이지](https://idn-area.cyclic.app/docs)에서 확인하세요. 이 문서는 자동으로 [`@nestjs/swagger`](https://docs.nestjs.com/openapi/introduction)를 사용하여 생성됩니다.

> 또한 앱을 실행하고 브라우저에서 http://localhost:3000/docs를 열어 로컬 머신에서 문서에 액세스할 수도 있습니다. (자세한 내용은 [시작하기](#시작하기) 참조)

## 라이브 데모

이 API를 사용하는 몇 가지 샘플 프로젝트입니다:

- [간단한 지역 드롭다운](https://github.com/fityannugroho/idn-area-example)
- [idn-area 지도](https://github.com/fityannugroho/idn-area-map)

## 기여

이 프로젝트에 기여하고 싶다면 [CONTRIBUTING.md](../CONTRIBUTING.md) 파일을 읽고 [풀 리퀘스트 가이드](../CONTRIBUTING.md#submitting-a-pull-request)를 따르도록 하세요.

## 문제 보고

다른 문제에 대해 각각 다른 채널을 가지고 있으니, 다음 조건에 따라 사용해주세요:

### 버그 보고
버그를 보고하려면 [가이드](../CONTRIBUTING.md#submitting-an-issue)를 따라 새 이슈를 열어주세요.

### 새로운 기능 요청
새로운 기능을 원한다면 [가이드](../CONTRIBUTING.md#submitting-an-issue)를 따라 새 이슈를 열어주세요.

### 질문하기
질문이 있을 경우, [GitHub Discussions Q&A 카테고리](https://github.com/fityannugroho/idn-area/discussions/categories/q-a)에서 답변을 찾을 수 있습니다. 이미 관련된 토론이 없다면 새 토론을 열 수 있습니다.

## 이 프로젝트 지원하기

이 프로젝트가 도움이 되었다면 ⭐️를 눌러주세요!

이 프로젝트를 지원하려면 [GitHub Sponsor](https://github.com/sponsors/fityannugroho), [Trakteer](https://trakteer.id/fityannugroho/tip) 또는 [Saweria](https://saweria.co/fityannugroho)를 통해 기부할 수 있습니다.
