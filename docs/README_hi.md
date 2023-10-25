<h1 align="">इन्डोनेशियाई क्षेत्र एपीआई</h1>

<p>
  <a href="https://nestjs.com"><img alt="नेस्ट जे एस" src="https://img.shields.io/badge/-NestJS-ea2845?style=flat-square&logo=nestjs&logoColor=white" /></a>
  <a href="https://www.typescriptlang.org"><img alt="टाइप स्क्रिप्ट" src="https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" /></a>
  <a href="https://www.prisma.io"><img alt="प्रिज्मा" src="https://img.shields.io/badge/-Prisma-1B222D?style=flat-square&logo=prisma&logoColor=white" /></a>
  <a href="https://www.mongodb.com"><img alt="मोंगो डी बी" src="https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" /></a>
  <a href="https://www.postgresql.org"><img alt="पोस्टग्रेएसक्यूएल" src="https://img.shields.io/badge/-PostgreSQL-657991?style=flat-square&logo=postgresql&logoColor=white" /></a>
  <a href="https://www.mysql.com"><img alt="माई एसक्यूएल" src="https://img.shields.io/badge/-MySQL-00688F?style=flat-square&logo=mysql&logoColor=white" /></a>
</p>

[English](../README.md) | **हिन्दी** | [Bahasa Indonesia](README_id.md) | [한국어](README_ko.md) | [Tagalog](README_tl.md)

एपीआई जो इंडोनेशिया के **प्रशासनिक क्षेत्रों**, प्रांत, रीजेंसी, जिले से लेकर ग्राम स्तर तक की जानकारी प्रदान करता है। यह [संस्करण 1.1.0](https://github.com/fityannugroho/idn-area/releases/tag/v1.1.0) से द्वीप डेटा भी प्रदान करता है।

[नेस्ट जे एस फ्रेमवर्क](https://nestjs.com) के साथ निर्मित और टाइपस्क्रिप्ट में लिखा गया है। [प्रिज्मा](https://www.prisma.io) का उपयोग किसी भी प्रकार के डेटाबेस के साथ इंटरैक्ट करने के लिए ORM के रूप में किया जाता है(माई एसक्यूएल, पोस्टग्रेएसक्यूएल, और मोंगो डी बी)।

> **⚠️ v3.0.0 में अपग्रेड किया जा रहा है ⚠️**
>
> चूंकि [v3.0.0](https://github.com/fityannugroho/idn-area/releases/tag/v3.0.0), **नोड जे एस v18** या उच्चतर आवश्यक है।

<h2>सामग्री तालिका</h2>

- [शुरू करना](#शुरू-करना)
- [डेटा](#डेटा)
- [प्रलेखन](#प्रलेखन)
- [लाइव डेमो](#लाइव-डेमो)
- [योगदान](#योगदान)
- [समस्या रिपोर्टिंग](#समस्या-रिपोर्टिंग)
  - [बग की रिपोर्ट करना](#बग-की-रिपोर्ट-करना)
  - [एक नई सुविधा का अनुरोध](#एक-नई-सुविधा-का-अनुरोध)
  - [एक प्रश्न पूछना](#एक-प्रश्न-पूछना)
- [इस परियोजना का समर्थन करें](#इस-परियोजना-का-समर्थन-करें)

---

## शुरू करना

कृपया इस ऐप को इंस्टॉल और चलाने के लिए [इंस्टॉलेशन गाइड](installation.md) पढ़ें।

## डेटा

हमारे द्वारा उपयोग किया गया डेटा आधिकारिक स्रोतों पर आधारित है, जिसे [**idn-area-data**](https://github.com/fityannugroho/idn-area-data) रिपॉजिटरी में प्रबंधित किया जाता है और [एन पी एम पैकेज](https://www.npmjs.com/package/idn-area-data) के रूप में वितरित किया जाता है।

> [डेटा](https://github.com/fityannugroho/idn-area-data/tree/main/data)  यहां [ओपन डेटाबेस लाइसेंस (ओडीबीएल)](https://github.com/fityannugroho/idn-area-data/blob/main/data/LICENSE.md) के तहत उपलब्ध कराया गया है।

## प्रलेखन

[दस्तावेज़ीकरण पृष्ठ](https://idn-area.cyclic.app/docs) में एपीआई दस्तावेज़ का नवीनतम संस्करण पढ़ें। यह दस्तावेज़ [`@nestjs/swagger`](https://docs.nestjs.com/openapi/introduction) का उपयोग करके स्वचालित रूप से तैयार किया जाता है।

> आप ऐप चलाकर ([शुरू करना](#शुरू-करना) देखें) अपने ब्राउज़र में http://localhost:3000/docs खोलकर अपने स्थानीय मशीन में दस्तावेज़ तक पहुंच सकते हैं।

## लाइव डेमो

आप इस रिपॉजिटरी विवरण में दिए गए एंडपॉइंट के साथ http://localhost:3000 को प्रतिस्थापित करके एपीआई को आज़मा सकते हैं।

ये कुछ नमूना परियोजनाएं हैं जो इस एपीआई का उपयोग कर रही हैं:

- [सरल क्षेत्र ड्रॉपडाउन](https://github.com/fityannugroho/idn-area-example)
- [आईडीएन-क्षेत्र मानचित्र](https://github.com/fityannugroho/idn-area-map)

## योगदान
यदि आप इस परियोजना में योगदान देना चाहते हैं, तो कृपया [CONTRIBUTING.md](../CONTRIBUTING.md) फ़ाइल पढ़ें और सुनिश्चित करें कि आप [पुल अनुरोध गाइड](../CONTRIBUTING.md#submitting-a-pull-request) का पालन करें.

## समस्या रिपोर्टिंग

हमारे पास प्रत्येक समस्या के लिए अलग-अलग चैनल हैं, कृपया इन शर्तों का पालन करते हुए उनका उपयोग करें:

### बग की रिपोर्ट करना
बग की रिपोर्ट करने के लिए, कृपया [गाइड](../CONTRIBUTING.md#submitting-an-issue) का पालन करते हुए एक नया अंक खोलें.

### एक नई सुविधा का अनुरोध
यदि आपके मन में कोई नई सुविधा है, तो कृपया [गाइड](../CONTRIBUTING.md#submitting-an-issue) का पालन करते हुए एक नया अंक खोलें।

### एक प्रश्न पूछना
यदि आपके पास कोई प्रश्न है, तो आप [GitHub चर्चाएँ Q&A श्रेणी](https://github.com/fityannugroho/idn-area/discussions/categories/q-a) में उत्तर खोज सकते हैं। यदि आपको पहले से कोई प्रासंगिक चर्चा नहीं मिलती है, तो आप एक नई चर्चा खोल सकते हैं।

## इस परियोजना का समर्थन करें

यदि इस परियोजना से आपको मदद मिली तो ⭐️ दें!

आप [GitHub Sponsor](https://github.com/sponsors/fityannugroho), [Trakteer](https://trakteer.id/fityannugroho/tip), या [Saweria](https://saweria.co/fityannugroho) के माध्यम से दान करके इस परियोजना का समर्थन कर सकते हैं।
