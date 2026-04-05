# عكة برجر - AKAH BURGER 🍔

تطبيق ويب حديث لطلب الوجبات مسبقاً من مطعم "عكة برجر".

## المميزات
- واجهة مستخدم حديثة وسريعة (Modern Fast-Food UI).
- دعم كامل للغة العربية (RTL).
- صفحة ترحيب لجمع بيانات العميل والسيارة.
- قائمة طعام مصنفة (Menu Categories).
- نظام سلة مشتريات متكامل.
- شاشة مطبخ للتحديث اللحظي للطلبات (Socket.io).
- لوحة تحكم للمسؤول لإدارة الأصناف والأسعار.
- تصميم متجاوب تماماً مع الجوال (Mobile-First).

## التقنيات المستخدمة
- **Frontend**: React, TailwindCSS, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, Socket.io.
- **Database**: MongoDB.

## طريقة التشغيل محلياً

### 1. المتطلبات
- Node.js مثبت على جهازك.
- MongoDB مثبت ويعمل محلياً (أو استخدام MongoDB Atlas).

### 2. التثبيت
من المجلد الرئيسي للمشروع، قم بتشغيل:
```bash
npm run install-all
```

### 3. التشغيل
لتشغيل الـ Backend والـ Frontend معاً:
```bash
npm run dev
```
- الـ Frontend سيعمل على: `http://localhost:3000`
- الـ Backend سيعمل على: `http://localhost:5000`

---

## ملاحظة حول النشر على Cloudflare

لقد طلبت النشر على Cloudflare بدون الاستعانة بأي موقع خارجي. ولكن، هناك بعض النقاط التقنية الهامة:

1. **MongoDB**: لا تدعم Cloudflare تشغيل قاعدة بيانات MongoDB مباشرة داخلها. للالتزام ببيئة Cloudflare بالكامل، يُفضل استخدام **Cloudflare D1** (SQL) بدلاً من MongoDB.
2. **Socket.io**: التحديث اللحظي في Cloudflare يتطلب استخدام **Cloudflare Durable Objects** مع WebSockets، حيث أن Socket.io التقليدي يحتاج لبيئة Node.js مستمرة.
3. **Backend**: يمكنك استخدام **Cloudflare Workers** (مع Hono.js مثلاً) لتشغيل الـ API.

**إذا كنت ترغب في تشغيل هذا الكود كما هو (Node.js + MongoDB + Socket.io) على Cloudflare، ستحتاج إلى:**
- تحويل الـ Backend إلى **Cloudflare Pages Functions** (مع استبدال Socket.io بـ WebSockets العادية أو استخدام Durable Objects).
- استخدام قاعدة بيانات سحابية (مثل MongoDB Atlas) لأن Cloudflare لا تستضيف MongoDB.

**الحل الأبسط للنشر (إذا كنت لا تمانع استخدام Render أو Heroku):**
يمكنك رفع الـ Backend على Render.com والـ Frontend على Cloudflare Pages، وهذا هو الخيار الأكثر شيوعاً وسهولة.
