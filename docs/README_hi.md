<h1 align="">इन्डोनेशियाई क्षेत्र एपीआई (<i>API Wilayah Indonesia</i>)</h1>

<p>
  <a href="https://nestjs.com"><img alt="नेस्ट जे एस" src="https://img.shields.io/badge/-NestJS-ea2845?style=flat-square&logo=nestjs&logoColor=white" /></a>
  <a href="https://www.typescriptlang.org"><img alt="टाइप स्क्रिप्ट" src="https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" /></a>
  <a href="https://www.prisma.io"><img alt="प्रिज्मा" src="https://img.shields.io/badge/-Prisma-1B222D?style=flat-square&logo=prisma&logoColor=white" /></a>
  <a href="https://www.mongodb.com"><img alt="मोंगो डी बी" src="https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" /></a>
  <a href="https://www.postgresql.org"><img alt="पोस्टग्रेएसक्यूएल" src="https://img.shields.io/badge/-PostgreSQL-657991?style=flat-square&logo=postgresql&logoColor=white" /></a>
  <a href="https://www.mysql.com"><img alt="माई एसक्यूएल" src="https://img.shields.io/badge/-MySQL-00688F?style=flat-square&logo=mysql&logoColor=white" /></a>
</p>

एपीआई जो इंडोनेशिया के **प्रशासनिक क्षेत्रों**, प्रांत, रीजेंसी, जिले से लेकर ग्राम स्तर तक की जानकारी प्रदान करता है। यह [संस्करण 1.1.0] से द्वीप डेटा भी प्रदान करता है (https://github.com/fityannugroho/idn-area/releases/tag/v1.1.0)।

[नेस्ट जे एस फ्रेमवर्क](https://nestjs.com) के साथ निर्मित और टाइपस्क्रिप्ट में लिखा गया है। [प्रिज्मा](https://www.prisma.io) का उपयोग किसी भी प्रकार के डेटाबेस के साथ इंटरैक्ट करने के लिए ORM के रूप में किया जाता है(माई एसक्यूएल, पोस्टग्रेएसक्यूएल, और मोंगो डी बी)।

> **⚠️ v3.0.0 में अपग्रेड किया जा रहा है ⚠️**
>
> चूंकि [v3.0.0](https://github.com/fityannugroho/idn-area/releases/tag/v3.0.0), **नोड जे एस v18** या उच्चतर आवश्यक है।

<h2>सामग्री तालिका</h2>

- [शुरू करना](#शुरू-करना)
- [डेटा](#डेटा)
- [एपीआई-एंडपॉइंट](#एपीआई-एंडपॉइंट)
  - [दस्तावेज़ीकरण](#दस्तावेज़ीकरण)
  - [प्रांत प्राप्त करें](#प्रांत-प्राप्त-करें)
  - [विशिष्ट प्रांत प्राप्त करें](#विशिष्ट-प्रांत-प्राप्त-करें)
  - [नाम से रीजेंसी प्राप्त करें](#नाम-से-रीजेंसी-प्राप्त-करें)
  - [विशिष्ट रीजेंसी प्राप्त करें](#विशिष्ट-रीजेंसी-प्राप्त-करें)
  - [एक प्रांत में सभी रीजेंसी प्राप्त करें](#एक-प्रांत-में-सभी-रीजेंसी-प्राप्त-करें)
  - [जिलों को नाम से प्राप्त करें](#जिलों-को-नाम-से-प्राप्त-करें)
  - [विशिष्ट जिला प्राप्त करें](#विशिष्ट-जिला-प्राप्त-करें)
  - [एक रीजेंसी में सभी जिलों को प्राप्त करें](#एक-रीजेंसी-में-सभी-जिलों-को-प्राप्त-करें)
  - [गाँवों को नाम से प्राप्त करें](#गाँवों-को-नाम-से-प्राप्त-करें)
  - [विशिष्ट गांव प्राप्त करें](#विशिष्ट-गांव-प्राप्त-करें)
  - [जिले के सभी गाँव प्राप्त करें](#जिले-के-सभी-गाँव-प्राप्त-करें)
  - [द्वीपों को नाम से प्राप्त करें](#द्वीपों-को-नाम-से-प्राप्त-करें)
  - [विशिष्ट द्वीप प्राप्त करें](#विशिष्ट-द्वीप-प्राप्त-करें)
  - [सभी द्वीपों को एक रीजेंसी में प्राप्त करें](#सभी-द्वीपों-को-एक-रीजेंसी-में-प्राप्त-करें)
- [क्वेरी पैरामीटर्स](#क्वेरी-पैरामीटर्स)
  - [`sortBy`](#sortBy)
  - [`sortOrder`](#sortOrder)
- [लाइव डेमो](#लाइव-डेमो)
- [योगदान](#योगदान)
- [समस्या रिपोर्टिंग](#समस्या-रिपोर्टिंग)
  - [बग की रिपोर्ट करना](#बग-की-रिपोर्ट-करना)
  - [एक नई सुविधा का अनुरोध](#एक-नई-सुविधा-का-अनुरोध)
  - [एक प्रश्न पूछना](#एक-प्रश्न-पूछना)
- [इस परियोजना का समर्थन करें](#इस-परियोजना-का-समर्थन-करें)

---

## शुरू करना

कृपया इस ऐप को इंस्टॉल और चलाने के लिए [इंस्टॉलेशन गाइड](docs/installation.md) पढ़ें।

## डेटा

हमारे द्वारा उपयोग किया गया डेटा आधिकारिक स्रोतों पर आधारित है, जिसे [**idn-area-data**](https://github.com/fityannugroho/idn-area-data) रिपॉजिटरी में प्रबंधित किया जाता है और [एन पी एम पैकेज](https://www.npmjs.com/package/idn-area-data) के रूप में वितरित किया जाता है।

> [डेटा](https://github.com/fityannugroho/idn-area-data/tree/main/data)  यहां [ओपन डेटाबेस लाइसेंस (ओडीबीएल)](https://github.com/fityannugroho/idn-area-data/blob/main/data/LICENSE.md) के तहत उपलब्ध कराया गया है।

## एपीआई एंडपॉइंट

[sortby-query]: #sortby
[sortorder-query]: #sortorder

### दस्तावेज़ीकरण

```
GET /docs
```

- **एपीआई दस्तावेज़** उत्पन्न करने के लिए इस एंडपॉइंट का उपयोग करें।

### प्रांत प्राप्त करें

```
GET /provinces
```

- **सभी प्रांतों को प्राप्त करने** के लिए इस एंडपॉइंट का उपयोग करें।
- यह एंडपॉइंट प्रांत की एक सरणी लौटाएगा।
- उपयोग उदाहरण: http://localhost:3000/provinces

**प्रांतों को `name` से फ़िल्टर करें**

```
GET /provinces?name={provinceName}
```

- **filter the provinces by its name** में `name` क्वेरी जोड़ें।
- उदाहरण के लिए, यदि आप `{provinceName}` को "jawa" से प्रतिस्थापित करते हैं तो आपको वे सभी प्रांत मिलेंगे जिनके नाम में "jawa" शब्द है।
- `{provinceName}` **कम से कम 3 अक्षर**, अधिकतम 255 अक्षर होना चाहिए, और इसमें कोई प्रतीक नहीं होना चाहिए। यदि नहीं, तो आपको 400 Bad Request` प्रतिक्रिया मिलेगी।
- यदि `{provinceName}` से मेल खाने वाला कोई प्रांत नहीं है तो प्रतिक्रिया एक **खाली सरणी** `[]` होगी।
- उपयोग उदाहरण: http://localhost:3000/provinces?name=jawa

> यह एंडपॉइंट [`sortBy`][sortby-query] और [`sortOrder`][sortorder-query] क्वेरीज़ का भी समर्थन करता है।

### विशिष्ट प्रांत प्राप्त करें

```
GET /provinces/{provinceCode}
```
- **get a specific province** के लिए इस एंडपॉइंट का उपयोग करें।
- `{provinceCode}` **2 संख्यात्मक अक्षर** होना चाहिए। यदि नहीं, तो आपको `400 ख़राब अनुरोध'' प्रतिक्रिया मिलेगी।
- यह एंडपॉइंट `{provinceCode}` के समान कोड के साथ प्रांत को **वापस** करेगा। अन्यथा, आपको `400 Bad Request` प्रतिक्रिया मिलेगी।
- उपयोग उदाहरण: http://localhost:3000/provinces/32

### नाम से रीजेंसी प्राप्त करें

```
GET /regencies?name={regencyName}
```

- **get the regencies by its name** के लिए इस एंडपॉइंट का उपयोग करें।
- `{regencyName}` **आवश्यक** है और **कम से कम 3 अक्षर**, अधिकतम 255 अक्षर होना चाहिए, और इसमें कोई प्रतीक नहीं है। यदि नहीं, तो आपको `400 Bad Request` प्रतिक्रिया मिलेगी।
- यह एंडपॉइंट रीजेंसी की एक सरणी **लौटाएगा**।
- उपयोग उदाहरण: http://localhost:3000/regencies?name=bandung

> यह एंडपॉइंट [`sortBy`][sortby-query] और [`sortOrder`][sortorder-query] क्वेरीज़ का भी समर्थन करता है।

### विशिष्ट रीजेंसी प्राप्त करें

```
GET /regencies/{regencyCode}
```

- **get a specific regency** के लिए इस एंडपॉइंट का उपयोग करें।
- `{regencyCode}` **4 संख्यात्मक वर्ण** होना चाहिए। यदि नहीं, तो आपको `400 ख़राब अनुरोध'' प्रतिक्रिया मिलेगी।
- यह एंडपॉइंट `{regencyCode}` के समान कोड के साथ रीजेंसी को **वापस** करेगा। अन्यथा, आपको `404 Not Found` प्रतिक्रिया मिलेगी।
- उपयोग उदाहरण: http://localhost:3000/regencies/3273

### एक प्रांत में सभी रीजेंसी प्राप्त करें

```
GET /provinces/{provinceCode}/regencies
```

- **get all regencies in a province** के लिए इस एंडपॉइंट का उपयोग करें।
- `{provinceCode}` **2 संख्यात्मक वर्ण** होना चाहिए। यदि नहीं, तो आपको `400 Bad Request` प्रतिक्रिया मिलेगी।
- यदि `{provinceCode}` मौजूद है तो यह एंडपॉइंट **रीजेंसी की सरणी** लौटाएगा। अन्यथा, आपको `404 Not Found` प्रतिक्रिया मिलेगी।
- उपयोग उदाहरण: http://localhost:3000/provinces/32/regencies

> यह एंडपॉइंट [`sortBy`][sortby-query] और [`sortOrder`][sortorder-query] क्वेरीज़ का भी समर्थन करता है।

### जिलों को नाम से प्राप्त करें

```
GET /districts?name={districtName}
```

- **get the districts by its name** के लिए इस एंडपॉइंट का उपयोग करें।
- `{districtName}` **आवश्यक** है और इसमें **कम से कम 3 अक्षर**, अधिकतम 255 अक्षर होने चाहिए, और इसमें `'()-./` के अलावा कोई अन्य प्रतीक नहीं है। यदि नहीं, तो आपको `400 Bad Request` प्रतिक्रिया मिलेगी।
- यदि `{districtName}` से मेल खाने वाला कोई जिला नहीं है, तो यह एंडपॉइंट **जिले की एक सरणी, या एक **खाली सरणी** `[]` लौटाएगा।
- उपयोग उदाहरण: http://localhost:3000/districts?name=regol

> यह एंडपॉइंट [`sortBy`][sortby-query] और [`sortOrder`][sortorder-query] क्वेरीज़ का भी समर्थन करता है।

### विशिष्ट जिला प्राप्त करें

```
GET /districts/{districtCode}
```

- के लिए इस एंडपॉइंट का उपयोग करें**get a specific district**।
- `{districtCode}` **6 संख्यात्मक वर्ण** होना चाहिए। यदि नहीं, तो आपको `400 Bad Request` प्रतिक्रिया मिलेगी।
- यह एंडपॉइंट `{districtCode}` के समान कोड के साथ जिले को **वापस** करेगा। अन्यथा, आपको `404 नहीं मिला` प्रतिक्रिया मिलेगी।
- उपयोग उदाहरण: http://localhost:3000/districts/327311

### एक रीजेंसी में सभी जिलों को प्राप्त करें


```
GET /regencies/{regencyCode}/districts
```

- **get all districts in a regency** के लिए इस एंडपॉइंट का उपयोग करें।
- `{regencyCode}` **4 संख्यात्मक वर्ण** होना चाहिए। यदि नहीं, तो आपको `400 Bad Request` प्रतिक्रिया मिलेगी।
- यदि `{regencyCode}` मौजूद है तो यह एंडपॉइंट **जिले की सरणी** लौटाएगा। अन्यथा, आपको `404 Not Found` प्रतिक्रिया मिलेगी।
- उपयोग उदाहरण: http://localhost:3000/regencies/3273/districts

> यह एंडपॉइंट [`sortBy`][sortby-query] और [`sortOrder`][sortorder-query] क्वेरीज़ का भी समर्थन करता है।

### गाँवों को नाम से प्राप्त करें

```
GET /villages?name={villageName}
```

- **get the villages by its name** के लिए इस एंडपॉइंट का उपयोग करें।
- `{villageName}` **आवश्यक** है और इसमें **कम से कम 3 अक्षर**, अधिकतम 255 अक्षर होने चाहिए, और इसमें `'()-./` के अलावा कोई अन्य प्रतीक नहीं है। यदि नहीं, तो आपको `400 Bad Request` प्रतिक्रिया मिलेगी।
- यह एंडपॉइंट **गांव की एक सरणी, या एक **खाली सरणी** `[]` लौटाएगा यदि `{villageName}` के साथ कोई गांव मेल नहीं खाता है।
- उपयोग उदाहरण: http://localhost:3000/villages?name=balong

> यह एंडपॉइंट [`sortBy`][sortby-query] और [`sortOrder`][sortorder-query] क्वेरीज़ का भी समर्थन करता है।

### विशिष्ट गांव प्राप्त करें

```
GET /villages/{villageCode}
```

- **get a specific village** के लिए इस एंडपॉइंट का उपयोग करें।
- `{villageCode}` **10 संख्यात्मक अक्षर** होना चाहिए। यदि नहीं, तो आपको `400 Bad Request` प्रतिक्रिया मिलेगी।
- यह एंडपॉइंट `{villageCode}` के समान कोड के साथ **गाँव वापस** आएगा। अन्यथा, आपको `404 Not Found` प्रतिक्रिया मिलेगी।
- उपयोग उदाहरण: http://localhost:3000/villages/3273111004

### जिले के सभी गाँव प्राप्त करें

```
GET /districts/{districtCode}/villages
```

- **get all villages in a district** के लिए इस एंडपॉइंट का उपयोग करें।
- `{districtCode}` **6 संख्यात्मक अक्षर** होना चाहिए। यदि नहीं, तो आपको `400 Bad Request` प्रतिक्रिया मिलेगी।
- यदि `{districtCode}` मौजूद है तो यह एंडपॉइंट **गाँव की सरणी** लौटाएगा। अन्यथा, आपको `404 Not Found` प्रतिक्रिया मिलेगी।
- उपयोग उदाहरण: http://localhost:3000/districts/327311/villages

> यह एंडपॉइंट [`sortBy`][sortby-query] और [`sortOrder`][sortorder-query] क्वेरीज़ का भी समर्थन करता है।

### द्वीपों को नाम से प्राप्त करें

```
GET /islands?name={islandName}
```

- **get the islands by its name** के लिए इस एंडपॉइंट का उपयोग करें।
- `{द्वीपनाम}` **आवश्यक** है और इसमें **कम से कम 3 अक्षर**, अधिकतम 255 अक्षर होने चाहिए, और इसमें `'-/` के अलावा कोई अन्य प्रतीक नहीं है। यदि नहीं, तो आपको `400 Bad Request` प्रतिक्रिया मिलेगी।
- यह एंडपॉइंट **द्वीप की एक सरणी, या एक **खाली सरणी** `[]` लौटाएगा यदि `{द्वीपनाम}` के साथ कोई द्वीप मेल नहीं खाता है।
- उपयोग उदाहरण: http://localhost:3000/islands?name=java

> यह एंडपॉइंट [`sortBy`][sortby-query] और [`sortOrder`][sortorder-query] क्वेरीज़ का भी समर्थन करता है।

### विशिष्ट द्वीप प्राप्त करें

```
GET /islands/{islandCode}
```

- **get a specific island** के लिए इस एंडपॉइंट का उपयोग करें।
- `{islandCode}` **9 संख्यात्मक वर्ण** होना चाहिए। यदि नहीं, तो आपको `400 Bad Request` प्रतिक्रिया मिलेगी।
- यह एंडपॉइंट `{islandCode}` के समान कोड के साथ **द्वीप को लौटाएगा**। अन्यथा, आपको `404 Not Found` प्रतिक्रिया मिलेगी।
- उपयोग उदाहरण: http://localhost:3000/islands/110140001

### सभी द्वीपों को एक रीजेंसी में प्राप्त करें

```
GET /regencies/{regencyCode}/islands
```

- **get all islands in a regency** के लिए इस एंडपॉइंट का उपयोग करें।
- `{regencyCode}` **4 संख्यात्मक वर्ण** होना चाहिए। यदि नहीं, तो आपको `400 Bad Request` प्रतिक्रिया मिलेगी।
- यदि `{regencyCode}` मौजूद है तो यह एंडपॉइंट **द्वीप की सरणी** लौटाएगा। अन्यथा, आपको `404 Not Found` प्रतिक्रिया मिलेगी।
- उपयोग उदाहरण: http://localhost:3000/regencies/1101/islands

> यह एंडपॉइंट [`sortBy`][sortby-query] और [`sortOrder`][sortorder-query] क्वेरीज़ का भी समर्थन करता है।

## क्वेरी पैरामीटर्स

एंडपॉइंट प्रतिक्रियाओं में कौन सा डेटा लौटाया जाता है, इसे नियंत्रित करने के लिए आप क्वेरी पैरामीटर का उपयोग कर सकते हैं।

### `sortBy`

```
GET /...?sortBy={code|name}
```

- `code` या `name` के आधार पर **परिणाम को क्रमबद्ध करने** में `sortBy` क्वेरी जोड़ें।
- `sortBy` **केवल `code` या `name` द्वारा भरा जा सकता है**। यदि नहीं, तो आपको `400 Bad Request` प्रतिक्रिया मिलेगी।
- यदि `sortBy` ** सेट नहीं है**, तो `कोड` द्वारा सॉर्टिंग की जाएगी।
- उपयोग उदाहरण :
  - [`provinces`](#get-provinces) पर एंडपॉइंट: http://localhost:3000/provinces?sortBy=name
  - [`regencies`](#get-regencies-by-name) पर एंडपॉइंट: http://localhost:3000/regencies?name=bandung&sortBy=code

### `sortOrder`

```
GET /...?sortOrder={asc|desc}
```

- ** सॉर्ट ऑर्डर निर्दिष्ट करने के लिए `sortOrder` क्वेरी जोड़ें** चाहे आरोही `asc` हो या अवरोही `desc`।
- `sortOrder` **केवल `asc` या `desc` द्वारा भरा जा सकता है**। यदि नहीं, तो आपको `400 Bad Request` प्रतिक्रिया मिलेगी।
- यदि `sortOrder` **सेट नहीं है**, तो सॉर्टिंग `asc` क्रम में की जाएगी।
- उपयोग उदाहरण :
  - [`districts`](#get-districts-by-name) पर एंडपॉइंट: http://localhost:3000/districts?name=regol&sortOrder=desc
  - [`villages`](#get-villages-by-name) पर एंडपॉइंट: http://localhost:3000/villages?name=balong&sortOrder=asc

> इन क्वय्रीस को `&` से जुड़े अन्य प्रश्नों के साथ जोड़ा जा सकता है।
>
> उदाहरण के लिए: http://localhost:3000/provinces?name=jawa&sortBy=name&sortOrder=asc

## लाइव डेमो

आप इस रिपॉजिटरी विवरण में दिए गए एंडपॉइंट के साथ http://localhost:3000 को प्रतिस्थापित करके एपीआई को आज़मा सकते हैं।

ये कुछ नमूना परियोजनाएं हैं जो इस एपीआई का उपयोग कर रही हैं:

- [सरल क्षेत्र ड्रॉपडाउन](https://github.com/fityannugroho/idn-area-example)
- [आईडीएन-क्षेत्र मानचित्र](https://github.com/fityannugroho/idn-area-map)

## योगदान
यदि आप इस परियोजना में योगदान देना चाहते हैं, तो कृपया [CONTRIBUTING.md](CONTRIBUTING.md) फ़ाइल पढ़ें और सुनिश्चित करें कि आप [पुल अनुरोध गाइड](CONTRIBUTING.md#submitting-a-pull-request) का पालन करें

## समस्या रिपोर्टिंग

हमारे पास प्रत्येक समस्या के लिए अलग-अलग चैनल हैं, कृपया इन शर्तों का पालन करते हुए उनका उपयोग करें:

### बग की रिपोर्ट करना
बग की रिपोर्ट करने के लिए, कृपया [गाइड](CONTRIBUTING.md#submitting-an-issue) का पालन करते हुए एक नया अंक खोलें.

### एक नई सुविधा का अनुरोध
यदि आपके मन में कोई नई सुविधा है, तो कृपया [गाइड](CONTRIBUTING.md#submitting-an-issue) का पालन करते हुए एक नया अंक खोलें।

### एक प्रश्न पूछना
यदि आपके पास कोई प्रश्न है, तो आप [GitHub चर्चाएँ Q&A श्रेणी](https://github.com/fityannugroho/idn-area/discussions/categories/q-a) में उत्तर खोज सकते हैं। यदि आपको पहले से कोई प्रासंगिक चर्चा नहीं मिलती है, तो आप एक नई चर्चा खोल सकते हैं।

## इस परियोजना का समर्थन करें

<a href="https://trakteer.id/fityannugroho/tip" target="_blank"><img id="wse-buttons-preview" src="https://cdn.trakteer.id/images/embed/trbtn-red-6.png" style="border: 0px none; height: 36px; --darkreader-inline-border-top: currentcolor; --darkreader-inline-border-right: currentcolor; --darkreader-inline-border-bottom: currentcolor; --darkreader-inline-border-left: currentcolor;" alt="Trakteer Saya" data-darkreader-inline-border-top="" data-darkreader-inline-border-right="" data-darkreader-inline-border-bottom="" data-darkreader-inline-border-left="" height="40"></a>

आप [GitHub Sponsor](https://github.com/sponsors/fityannugroho), [Trakteer](https://trakteer.id/fityannugroho/tip), या [Saweria](https://saweria.co/fityannugroho) के माध्यम से दान करके इस परियोजना का समर्थन कर सकते हैं।
