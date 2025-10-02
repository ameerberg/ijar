# إعداد المصادقة بالهاتف - Phone Authentication Setup

## حالة المصادقة الحالية

✅ **جاهز للاستخدام** - نظام المصادقة بالهاتف تم إعداده بالكامل!

---

## 🔐 ما تم إنجازه

### 1. **قاعدة البيانات (Supabase)**
- ✅ جدول `profiles` يدعم حقل `phone`
- ✅ Row Level Security (RLS) مفعّل
- ✅ السياسات الأمنية مطبقة
- ✅ الربط مع `auth.users` جاهز

### 2. **المصادقة (Authentication Context)**
الموقع في: `src/contexts/AuthContext.tsx`

**الدوال المتاحة:**
```typescript
- signUp(phone, password, fullName)     // تسجيل بكلمة مرور
- signIn(phone, password)                // دخول بكلمة مرور
- signInWithOTP(phone)                   // إرسال OTP
- verifyOTP(phone, otp)                  // التحقق من OTP
- signOut()                              // تسجيل خروج
```

### 3. **صفحات المصادقة**
- ✅ `SignUpPage.tsx` - تسجيل جديد (OTP + كلمة مرور)
- ✅ `LoginPage.tsx` - تسجيل دخول (OTP + كلمة مرور)
- ✅ محسّنة للهاتف المحمول
- ✅ كل النصوص بالعربية
- ✅ دعم أرقام فلسطينية (+972)

---

## 📱 تنسيقات الهواتف المدعومة

النظام يقبل ويحوّل تلقائياً:

```
0591234567      →  +972591234567
+972591234567   →  +972591234567
972591234567    →  +972591234567
591234567       →  +972591234567
```

---

## 🚀 كيفية تفعيل OTP (SMS)

### الخطوات المطلوبة:

#### 1. إنشاء حساب Twilio
1. اذهب إلى: https://www.twilio.com/try-twilio
2. سجّل حساب جديد مجاناً
3. احصل على رصيد تجريبي ($15)

#### 2. الحصول على البيانات المطلوبة
من Twilio Console:
- **Account SID** (معرّف الحساب)
- **Auth Token** (رمز المصادقة)
- **Messaging Service SID** (معرّف خدمة الرسائل)

#### 3. إعداد Supabase
1. اذهب إلى Supabase Dashboard
2. اختر مشروعك
3. **Authentication** → **Providers**
4. فعّل **Phone**
5. اختر **Twilio** كمزود الخدمة
6. أدخل:
   - Account SID
   - Auth Token
   - Messaging Service SID
7. احفظ التغييرات

#### 4. اختبار OTP
- في Twilio Console → Phone Numbers
- اشترِ رقم هاتف (مجاني في فترة التجربة)
- جرب إرسال OTP من التطبيق

---

## 🔧 المصادقة بكلمة المرور (جاهزة الآن!)

المصادقة بكلمة المرور **تعمل فوراً** بدون أي إعداد إضافي:

```typescript
// التسجيل
await signUp('+972591234567', 'password123', 'محمد أحمد');

// تسجيل الدخول
await signIn('+972591234567', 'password123');
```

---

## 🗄️ هيكل قاعدة البيانات

### جدول المستخدمين (profiles)

```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  full_name text,
  phone text,
  avatar_url text,
  role text DEFAULT 'guest',
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### كيفية الوصول للبيانات

```typescript
import { supabase } from './lib/supabase';

// جلب معلومات المستخدم الحالي
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();

// تحديث معلومات المستخدم
await supabase
  .from('profiles')
  .update({ full_name: 'الاسم الجديد' })
  .eq('id', user.id);
```

---

## 🔒 الأمان (Row Level Security)

### السياسات المطبقة:

```sql
-- المستخدمون يمكنهم قراءة بياناتهم فقط
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- المستخدمون يمكنهم تحديث بياناتهم فقط
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

---

## 🧪 اختبار المصادقة

### 1. اختبار محلي (Local Testing)

```bash
# شغّل المشروع
npm run dev

# افتح المتصفح على
http://localhost:5173/signup
```

### 2. اختبار على الهاتف

```bash
# احصل على IP الخاص بجهازك
ipconfig  # Windows
ifconfig  # Mac/Linux

# شغّل بـ host
npm run dev -- --host

# افتح على الهاتف
http://[YOUR-IP]:5173
```

---

## ❗ استكشاف الأخطاء

### خطأ: "Invalid phone number"
**الحل:**
- تأكد من أن الرقم يبدأ بـ +972
- جرب التنسيق: +972591234567

### خطأ: "Failed to send OTP"
**الحل:**
1. تأكد من إعداد Twilio في Supabase
2. تحقق من رصيد حساب Twilio
3. تأكد من أن الرقم ليس محظوراً

### خطأ: "Invalid OTP"
**الحل:**
- تحقق من صحة الرمز المرسل
- الرمز صالح لـ 5 دقائق فقط
- لا تستخدم نفس الرمز مرتين

### المصادقة بكلمة المرور لا تعمل
**الحل:**
1. تحقق من Supabase Dashboard → Authentication
2. تأكد من أن Phone Auth مفعّل
3. حاول إعادة بناء المشروع: `npm run build`

---

## 📚 موارد إضافية

### وثائق Supabase
- Phone Auth: https://supabase.com/docs/guides/auth/phone-login
- RLS: https://supabase.com/docs/guides/auth/row-level-security

### وثائق Twilio
- Quick Start: https://www.twilio.com/docs/sms/quickstart
- Phone Numbers: https://www.twilio.com/docs/phone-numbers

---

## ✅ قائمة التحقق

قبل النشر (Production):

- [ ] إعداد Twilio واختبار OTP
- [ ] تجربة التسجيل بكلمة مرور
- [ ] اختبار على أنواع هواتف مختلفة
- [ ] التأكد من عمل RLS بشكل صحيح
- [ ] اختبار تسجيل الخروج
- [ ] مراجعة سياسات الأمان

---

## 🎯 الخلاصة

**ما يعمل الآن:**
✅ التسجيل بكلمة مرور
✅ تسجيل الدخول بكلمة مرور
✅ تسجيل الخروج
✅ حفظ بيانات المستخدم في قاعدة البيانات
✅ RLS وسياسات الأمان

**ما يحتاج إعداد إضافي:**
⚠️ إرسال OTP عبر SMS (يحتاج Twilio)

**الاستخدام الموصى به حالياً:**
استخدم **المصادقة بكلمة المرور** - جاهزة 100% وتعمل بدون أي إعداد إضافي!

بعد إعداد Twilio، سيكون لديك خياران:
1. التسجيل/الدخول بكلمة مرور
2. التسجيل/الدخول برمز OTP

---

💡 **نصيحة**: ابدأ باستخدام كلمة المرور أولاً، ثم فعّل OTP لاحقاً عند الحاجة!