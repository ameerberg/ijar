# دليل التخصيص - ijar.ps Customization Guide

## نظرة عامة
هذا الدليل يشرح كيفية تخصيص منصة ijar.ps حسب احتياجاتك.

---

## 🎨 تغيير الألوان والتصميم

### تغيير اللون الأساسي (الأخضر الزمردي)
حالياً اللون الأساسي هو `emerald-600`. لتغييره:

**الطريقة 1: استبدال اللون في جميع الملفات**
```bash
# في الـ Terminal
find src -type f -name "*.tsx" -exec sed -i 's/emerald-600/blue-600/g' {} \;
find src -type f -name "*.tsx" -exec sed -i 's/emerald-700/blue-700/g' {} \;
find src -type f -name "*.tsx" -exec sed -i 's/emerald-500/blue-500/g' {} \;
```

**الطريقة 2: تخصيص الألوان في Tailwind**
عدّل ملف `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          // ... أضف درجات اللون هنا
          600: '#16a34a', // اللون الأساسي
          700: '#15803d',
        }
      }
    }
  }
}
```

ثم استبدل `emerald-600` بـ `primary-600` في جميع الملفات.

---

## 📝 تعديل النصوص

### تغيير اسم المنصة
ابحث عن `ijar.ps` في المشروع واستبدله:

```bash
# في الـ Terminal
grep -r "ijar.ps" src/
```

الملفات الرئيسية:
- `src/components/Header.tsx` - الترويسة
- `src/pages/SignUpPage.tsx` - صفحة التسجيل
- `src/pages/LoginPage.tsx` - صفحة تسجيل الدخول
- `index.html` - العنوان الرئيسي

---

## 🌍 تعديل المدن

### إضافة أو تعديل مدن الضفة الغربية

عدّل ملف `src/constants/cities.ts`:

```typescript
export const WEST_BANK_CITIES = [
  'رام الله',
  'نابلس',
  'الخليل',
  // أضف مدناً جديدة هنا
  'طوباس',
  'أريحا'
];
```

---

## 📱 إعدادات الهاتف

### تغيير رمز الدولة الافتراضي

في ملفات `SignUpPage.tsx` و `LoginPage.tsx`، عدّل دالة `formatPhoneNumber`:

```typescript
const formatPhoneNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, '');

  // غيّر 972 إلى رمز دولتك
  if (cleaned.startsWith('972')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('05')) {
    return `+972${cleaned.substring(1)}`;
  }
  // ... بقية الكود
};
```

---

## 🔐 إعدادات Supabase

### تفعيل المصادقة بالهاتف (OTP)

1. افتح Supabase Dashboard
2. اذهب إلى **Authentication** → **Providers**
3. فعّل **Phone**
4. أضف بيانات Twilio:
   - Account SID
   - Auth Token
   - Messaging Service SID

### رابط التوثيق:
https://supabase.com/docs/guides/auth/phone-login

---

## 🗄️ تعديل قاعدة البيانات

### إضافة حقول جديدة للمستخدمين

أنشئ migration جديدة:

```sql
-- supabase/migrations/new_migration.sql

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS national_id text,
ADD COLUMN IF NOT EXISTS driver_license text;
```

طبّق التغييرات باستخدام Supabase CLI أو أداة mcp.

---

## 🎨 تغيير الخط

### استخدام خط عربي مختلف

عدّل ملف `index.html`:

```html
<!-- استبدل خط Cairo بخط آخر -->
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;600;700&display=swap" rel="stylesheet">
```

ثم عدّل `src/index.css`:

```css
body {
  font-family: 'Tajawal', sans-serif;
}
```

### خطوط عربية موصى بها:
- **Cairo** - حديث ونظيف (الحالي)
- **Tajawal** - واضح ومناسب للويب
- **Almarai** - عصري وأنيق
- **IBM Plex Sans Arabic** - احترافي
- **Noto Sans Arabic** - متعدد الأوزان

---

## 📸 تخصيص الصور

### تغيير صور السيارات الافتراضية

في `src/pages/HomePage.tsx`، ابحث عن `mockCars` وعدّل الروابط:

```typescript
images: [
  'https://your-image-url.com/car1.jpg',
  'https://your-image-url.com/car2.jpg'
]
```

### مصادر صور مجانية:
- Pexels: https://www.pexels.com
- Unsplash: https://unsplash.com
- Pixabay: https://pixabay.com

---

## 🔧 ملفات التخصيص الرئيسية

| الملف | الوظيفة |
|------|---------|
| `src/components/Header.tsx` | القائمة العلوية والشعار |
| `src/components/SearchBar.tsx` | شريط البحث والمدن |
| `src/pages/HomePage.tsx` | الصفحة الرئيسية |
| `src/pages/SignUpPage.tsx` | صفحة التسجيل |
| `src/pages/LoginPage.tsx` | صفحة تسجيل الدخول |
| `src/constants/cities.ts` | قائمة المدن |
| `src/index.css` | الأنماط العامة |
| `tailwind.config.js` | إعدادات Tailwind |
| `index.html` | الصفحة الأساسية والخطوط |

---

## 🚀 تطبيق التغييرات

بعد إجراء أي تعديلات:

```bash
# تحقق من عدم وجود أخطاء
npm run build

# شغّل المشروع محلياً
npm run dev
```

---

## 📱 تحسينات الهاتف المحمول

التطبيق محسّن تلقائياً للهواتف المحمولة باستخدام:
- Responsive classes: `sm:`, `md:`, `lg:`
- Mobile-first approach
- Touch-friendly buttons (min 44x44px)
- Readable font sizes (text-sm, text-base)

لتخصيص أكثر، عدّل الـ breakpoints في `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
    }
  }
}
```

---

## 🆘 الدعم والمساعدة

### وثائق مفيدة:
- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Supabase**: https://supabase.com/docs
- **TypeScript**: https://www.typescriptlang.org

### أدوات مساعدة:
- **Tailwind Play**: https://play.tailwindcss.com (لتجربة الأنماط)
- **Color Palette Generator**: https://coolors.co
- **Arabic Typography**: https://29lt.com

---

## 📋 قائمة مرجعية للتخصيص

- [ ] تغيير اسم المنصة من ijar.ps
- [ ] تعديل الألوان الأساسية
- [ ] تحديث قائمة المدن
- [ ] تفعيل Twilio للـ OTP
- [ ] إضافة شعار مخصص
- [ ] تعديل النصوص والترجمات
- [ ] اختبار على الهاتف المحمول
- [ ] إضافة صور سيارات حقيقية
- [ ] تخصيص الصفحة الرئيسية
- [ ] إعداد قاعدة البيانات

---

✨ **نصيحة**: ابدأ بتغييرات صغيرة واختبر كل تغيير قبل الانتقال للتالي!