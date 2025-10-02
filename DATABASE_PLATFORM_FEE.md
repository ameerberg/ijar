# نظام رسوم المنصة في قاعدة البيانات
# Platform Fee System in Database

## 💰 Overview

The database is already configured and supports the platform fee model through the `bookings` table.

---

## 📊 Key Database Fields

### In `bookings` Table:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `daily_rate` | decimal(10,2) | Rate set by host (what they receive) | ₪300 |
| `total_days` | integer | Number of rental days | 3 |
| `subtotal` | decimal(10,2) | Host earnings: daily_rate × days | ₪900 |
| `service_fee` | decimal(10,2) | Platform fee: ₪20 × days | ₪60 |
| `delivery_fee` | decimal(10,2) | Optional delivery fee | ₪0 |
| `total_amount` | decimal(10,2) | Customer pays: subtotal + fees | ₪960 |

---

## 🧮 Calculation Examples

### Example 1: 3-Day Booking

**Host sets:** ₪200/day

```sql
INSERT INTO bookings (
  car_id, renter_id, host_id,
  start_date, end_date,
  daily_rate,      -- ₪200 (host's rate)
  total_days,      -- 3 days
  subtotal,        -- ₪200 × 3 = ₪600 (host receives)
  service_fee,     -- ₪20 × 3 = ₪60 (platform receives)
  total_amount,    -- ₪600 + ₪60 = ₪660 (customer pays)
  status
) VALUES (
  'car-uuid', 'renter-uuid', 'host-uuid',
  '2025-10-01', '2025-10-04',
  200,
  3,
  600,
  60,
  660,
  'pending'
);
```

**Result:**
- 💰 Customer pays: **₪660**
- 👤 Host receives: **₪600**
- 🏢 Platform receives: **₪60**

---

### Example 2: 5-Day Luxury Car with Delivery

**Host sets:** ₪400/day

```sql
INSERT INTO bookings (
  car_id, renter_id, host_id,
  start_date, end_date,
  daily_rate,      -- ₪400
  total_days,      -- 5 days
  subtotal,        -- ₪400 × 5 = ₪2,000
  service_fee,     -- ₪20 × 5 = ₪100
  delivery_fee,    -- ₪50 (one-time)
  total_amount,    -- ₪2,000 + ₪100 + ₪50 = ₪2,150
  status
) VALUES (
  'car-uuid', 'renter-uuid', 'host-uuid',
  '2025-10-05', '2025-10-10',
  400,
  5,
  2000,
  100,
  50,
  2150,
  'confirmed'
);
```

**Result:**
- 💰 Customer pays: **₪2,150**
- 👤 Host receives: **₪2,000**
- 🏢 Platform receives: **₪100**
- 🚗 Delivery: **₪50** (goes to host or platform based on your model)

---

## 📈 Revenue Queries

### Calculate Platform Revenue

```sql
SELECT
  SUM(service_fee) as total_platform_revenue,
  COUNT(*) as total_bookings,
  AVG(service_fee) as avg_fee_per_booking,
  SUM(service_fee) / COUNT(*) as calculated_avg
FROM bookings
WHERE payment_status = 'paid';
```

**Example Result:**
```
total_platform_revenue: ₪12,000
total_bookings: 200
avg_fee_per_booking: ₪60
```

If average is ₪60, that means average booking is **3 days** (₪20 × 3).

---

### Calculate Host Earnings

```sql
SELECT
  p.full_name as host_name,
  SUM(b.subtotal) as total_host_earnings,
  COUNT(*) as total_bookings,
  AVG(b.subtotal) as avg_earning_per_booking,
  SUM(b.service_fee) as platform_earned_from_host
FROM bookings b
JOIN profiles p ON p.id = b.host_id
WHERE b.payment_status = 'paid'
  AND b.host_id = 'specific-host-uuid'
GROUP BY p.full_name;
```

---

### Monthly Revenue Report

```sql
SELECT
  DATE_TRUNC('month', created_at) as month,
  SUM(service_fee) as platform_revenue,
  SUM(subtotal) as host_earnings,
  SUM(total_amount) as total_customer_payments,
  COUNT(*) as total_bookings
FROM bookings
WHERE payment_status = 'paid'
  AND created_at >= NOW() - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
```

---

## 🔄 Integration with Pricing Logic

### From Code (`src/lib/pricing.ts`):

```typescript
import { calculatePrice } from './lib/pricing';

// Calculate for a booking
const pricing = calculatePrice(
  car.daily_rate,  // ₪300 (from cars table)
  3                // 3 days
);

// Insert into database
const { data, error } = await supabase
  .from('bookings')
  .insert({
    car_id: carId,
    renter_id: user.id,
    host_id: car.host_id,
    start_date: startDate,
    end_date: endDate,
    daily_rate: pricing.hostDailyRate,        // ₪300
    total_days: pricing.days,                 // 3
    subtotal: pricing.hostTotal,              // ₪900
    service_fee: pricing.platformFeeTotal,    // ₪60
    delivery_fee: deliveryFee,                // ₪0 or ₪50
    total_amount: pricing.customerTotal + deliveryFee, // ₪960
    status: 'pending',
    payment_status: 'pending'
  });
```

---

## 🎯 Data Consistency

### Always ensure:

1. **subtotal = daily_rate × total_days**
   ```sql
   CHECK (subtotal = daily_rate * total_days)
   ```

2. **service_fee = 20 × total_days**
   ```sql
   CHECK (service_fee = 20 * total_days)
   ```

3. **total_amount = subtotal + service_fee + delivery_fee**
   ```sql
   CHECK (total_amount = subtotal + service_fee + delivery_fee)
   ```

### Add Constraints (Optional):

```sql
ALTER TABLE bookings
ADD CONSTRAINT check_subtotal
  CHECK (subtotal = daily_rate * total_days);

ALTER TABLE bookings
ADD CONSTRAINT check_service_fee
  CHECK (service_fee = 20 * total_days);

ALTER TABLE bookings
ADD CONSTRAINT check_total_amount
  CHECK (total_amount = subtotal + service_fee + delivery_fee + COALESCE(tax, 0));
```

---

## 📊 Sample Data

### Insert Sample Booking:

```sql
-- Sample: Toyota Camry, 3 days, ₪200/day
INSERT INTO bookings (
  id,
  car_id,
  renter_id,
  host_id,
  start_date,
  end_date,
  daily_rate,
  total_days,
  subtotal,
  service_fee,
  delivery_fee,
  total_amount,
  status,
  payment_status
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM cars WHERE make = 'تويوتا' AND model = 'كامري' LIMIT 1),
  (SELECT id FROM profiles WHERE role = 'guest' LIMIT 1),
  (SELECT host_id FROM cars WHERE make = 'تويوتا' LIMIT 1),
  NOW() + INTERVAL '7 days',
  NOW() + INTERVAL '10 days',
  200,  -- daily_rate
  3,    -- total_days
  600,  -- subtotal (200 × 3)
  60,   -- service_fee (20 × 3)
  0,    -- delivery_fee
  660,  -- total_amount (600 + 60)
  'confirmed',
  'paid'
);
```

---

## 🔍 Useful Queries

### 1. All Active Bookings with Fees

```sql
SELECT
  b.id,
  c.make || ' ' || c.model as car,
  p.full_name as renter,
  b.start_date,
  b.end_date,
  b.daily_rate as host_rate,
  b.total_days,
  b.subtotal as host_earns,
  b.service_fee as platform_earns,
  b.total_amount as customer_pays,
  b.status
FROM bookings b
JOIN cars c ON c.id = b.car_id
JOIN profiles p ON p.id = b.renter_id
WHERE b.status IN ('confirmed', 'active')
ORDER BY b.start_date DESC;
```

### 2. Revenue Summary by Car

```sql
SELECT
  c.make || ' ' || c.model || ' ' || c.year as car,
  COUNT(b.id) as total_bookings,
  SUM(b.subtotal) as host_total_earned,
  SUM(b.service_fee) as platform_total_earned,
  AVG(b.total_days) as avg_days_per_booking
FROM cars c
LEFT JOIN bookings b ON b.car_id = c.id AND b.payment_status = 'paid'
WHERE c.host_id = 'specific-host-uuid'
GROUP BY c.id, c.make, c.model, c.year
ORDER BY total_bookings DESC;
```

### 3. Top Earning Hosts

```sql
SELECT
  p.full_name,
  COUNT(b.id) as total_bookings,
  SUM(b.subtotal) as total_host_earnings,
  SUM(b.service_fee) as platform_earned_from_them,
  SUM(b.total_amount) as total_customer_spent
FROM profiles p
JOIN bookings b ON b.host_id = p.id
WHERE b.payment_status = 'paid'
  AND p.role = 'host'
GROUP BY p.id, p.full_name
ORDER BY total_host_earnings DESC
LIMIT 10;
```

---

## ✅ Summary

### Database is Ready:
- ✅ `service_fee` field exists in `bookings` table
- ✅ All calculation fields present
- ✅ RLS policies secure the data
- ✅ Indexes optimize queries

### Platform Fee Model:
- ✅ ₪20 per day stored in `service_fee`
- ✅ Host's `daily_rate` unchanged
- ✅ Customer `total_amount` includes fee
- ✅ Transparent and auditable

### Next Steps:
1. Use `src/lib/pricing.ts` for calculations
2. Store results in `bookings` table
3. Query for reports and analytics
4. Everything is logged and traceable

---

💾 **Database is production-ready!**
