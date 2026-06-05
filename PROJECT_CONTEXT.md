# Pazar Muhasebe Proje Bağlamı

## Proje Amacı

Pazar Muhasebe, farklı firmaların muhasebe süreçlerini tek bir panel üzerinden yönetmeyi hedefleyen bir web uygulamasıdır. Kullanıcılar Firebase Authentication ile giriş yapar ve yetkilerine göre dashboard ekranında ilgili firma veya firmalara erişir.

## Roller

- **admin**: Sistemdeki tüm aktif firmaları görebilir. Dashboard firma listesi Firestore `stores` koleksiyonundaki `active = true` kayıtlarından oluşturulur.
- **manager**: Gelecek geliştirmeler için ayrılmış firma yöneticisi rolüdür. Kod yapısı manager kullanıcının yalnızca kendi `storeId` değerine karşılık gelen aktif firmayı göreceği şekilde tasarlanmıştır.

## Firma Yapısı

Firmalar Firestore içinde `stores` koleksiyonunda tutulur. Her firma dokümanında en az aşağıdaki alanların bulunması beklenir:

- `active`: Firmanın dashboard listesinde gösterilip gösterilmeyeceğini belirleyen boolean alan. Yalnızca `true` olan firmalar listelenir.
- `name`: Dashboard'da gösterilecek firma adı. Alternatif ad alanları için `title` veya `companyName` de desteklenir.

Kullanıcı dokümanları Firestore `users` koleksiyonunda Firebase Auth kullanıcı UID'si ile eşleşir. Kullanıcının `role` alanı yetki kapsamını, manager rolü için `storeId` alanı erişilebilecek firmayı belirler.
