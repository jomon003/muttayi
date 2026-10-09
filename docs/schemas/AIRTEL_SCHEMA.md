# Airtel Plan JSON Schema Documentation

## Overview
Airtel (Bharti Airtel Limited) is one of India's largest telecommunications operators. The Airtel database contains mobile recharge plans with a focus on data-centric offerings, unlimited calling, and entertainment subscriptions.

**Database File:** `public/db/airtel_db.json` (served at `/db/airtel_db.json`)
**Total Plans:** see [Database Statistics](#database-statistics)
**Unique Characteristics:**
- Simplest schema among all operators (flat, no `plan_details` wrapper)
- **Circle-based since 2026-10** — every plan has `available_circles` (22 Airtel circles)
- Strong focus on entertainment bundles (Netflix, Amazon Prime, Hotstar)
- 5G-ready plans available
- Mix of data packs and full recharge plans

---

## Root Structure

The Airtel database is a **flat array** of plan objects:

```json
[
  {
    "planId": "1",
    "price": 451,
    "category": "Data",
    "validity": { ... },
    "data": { ... },
    "voice": { ... },
    "sms": { ... },
    "isAddOn": true,
    "ott": { ... },
    "fiveG": false,
    "available_circles": ["AP", "AS", ...]
  },
  ...
]
```

---

## Complete TypeScript Interface

```typescript
interface AirtelPlan {
  planId: string;                    // Unique identifier for the plan
  price: number;                     // Plan price in INR (₹)
  category: string;                  // Plan category classification
  validity: {
    days: number | null;             // Validity period in days (null for add-ons)
    unit: string;                    // Always "Calendar Day(s)" or "Same as existing pack"
  };
  data: {
    isUnlimited: boolean;            // Whether data is unlimited
    isPerDay: boolean;               // Whether data is allocated per day
    perDayData: number | null;       // Daily data allocation in GB
    totalData: number | null;        // Total data allocation in GB
    unit: "GB";                      // Always in Gigabytes
  };
  voice: {
    isUnlimited: boolean;            // Whether calls are unlimited
    coverage: string[];              // Call coverage (empty for data-only plans)
  };
  sms: {
    perDay: number | null;           // Daily SMS limit
    total: number | null;            // Total SMS limit
  };
  isAddOn: boolean;                  // Whether this is an add-on pack
  ott: {
    isIncluded: boolean;             // Whether OTT services are included
    services: string[];              // List of OTT service names
  };
  fiveG: boolean;                    // Card/modal mentions 5G
  available_circles: string[];       // Airtel circle codes where this exact plan is offered (2026-10)
}
```

---

## Field Descriptions

### `planId`
- **Type:** `string`
- **Description:** `airtel_<price>_<validityDays>`, with `_2`, `_3`… appended when the same price/validity has circle-specific variants (2026-10; previously a sequential number)
- **Examples:** `"airtel_449_28"`, `"airtel_449_28_2"`, `"airtel_22_1"`
- **Usage:** Unique key (React key, report links)

### `available_circles`
- **Type:** `string[]` (added 2026-10)
- **Description:** Circle codes where this exact plan (same price, validity, data, voice, SMS, OTT, category) is offered
- **Codes (22):** `AP` AP & Telangana · `AS` Assam · `BH` Bihar & Jharkhand · `DL` Delhi NCR · `GJ` Gujarat · `HR` Haryana · `HP` Himachal Pradesh · `JK` J&K · `KA` Karnataka · `KL` Kerala · `KO` Kolkata · `MH` Maharashtra & Goa · `MP` MP & Chhattisgarh · `MU` Mumbai · `NE` North East · `OD` Odisha · `PB` Punjab · `RJ` Rajasthan · `TN` Tamil Nadu · `UE` UP East · `UW` UP West & Uttarakhand · `WB` West Bengal
- **Variants:** when a plan's benefits differ by circle, each variant is a separate record with its own circle list. Example: ₹449 / 28 d is `4 GB/day` in most circles but **no daily cap** ("Unlimited 4G + 5G data") in Kerala and Mumbai.
- **App:** the Airtel page requires a circle; `PlanFilter` keeps plans whose `circles` include it
- **Must match** `AIRTEL_CIRCLES` in `src/constants/circles.ts`

### `price`
- **Type:** `number`
- **Description:** Recharge amount in Indian Rupees (₹)
- **Range:** ₹11 to ₹3999
- **Examples:** `451`, `279`, `3599`
- **Note:** Prices are whole numbers (no decimal places)

### `category`
- **Type:** `string`
- **Description:** Plan classification/type
- **Possible Values:**
  - `"Data"` - Data-only plans or add-on data packs
  - `"Truly Unlimited"` - Full recharge plans with unlimited calling
  - `"Entertainment"` - Plans bundled with premium OTT subscriptions
  - `"Plan Vouchers"` - Standard recharge vouchers
- **Examples:**
  - Data pack for browsing
  - Full plan with calls + data + SMS
  - Entertainment bundle with Netflix

### `validity`
Object containing validity information:

#### `validity.days`
- **Type:** `number | null`
- **Description:** Number of days the plan remains active
- **Range:** 0.04 days (1 hour) to 365 days
- **Special Cases:**
  - `null` - For add-on packs that use existing plan's validity
  - `0.04` - Represents 1 hour validity (₹11 hourly unlimited pack)
- **Common Values:** 1, 2, 7, 24, 28, 30, 56, 77, 84, 90, 365

#### `validity.unit`
- **Type:** `string`
- **Description:** Unit of validity measurement
- **Possible Values:**
  - `"Calendar Day(s)"` - Standard day-based validity
  - `"Same as existing pack"` - Inherits validity from active plan
- **Usage:** Primarily informational for display

### `data`
Object containing data allocation details:

#### `data.isUnlimited`
- **Type:** `boolean`
- **Description:** Indicates if data is unlimited (subject to FUP)
- **Values:**
  - `true` - Unlimited data (may have daily cap or post-FUP speed)
  - `false` - Limited data allocation
- **Examples:**
  - ₹49 plan: `true` (unlimited for 1 day)
  - ₹181 plan: `false` (15GB total)

#### `data.isPerDay`
- **Type:** `boolean`
- **Description:** Whether data is allocated on a daily basis
- **Values:**
  - `true` - Daily data quota (e.g., 2GB/day for 28 days)
  - `false` - Total data quota (e.g., 50GB for entire validity)
- **Impact:** Affects how users consume data

#### `data.perDayData`
- **Type:** `number | null`
- **Description:** Daily data allocation in Gigabytes
- **Range:** 1.0 GB to 3.0 GB
- **Examples:**
  - `1.0` - 1GB per day
  - `2.5` - 2.5GB per day
  - `null` - Not applicable (total data plan)
- **Usage:** Used when `isPerDay: true`

#### `data.totalData`
- **Type:** `number | null`
- **Description:** Total data allocation for entire plan validity
- **Range:** 1.0 GB to 60.0 GB
- **Examples:**
  - `50.0` - 50GB total
  - `25.0` - 25GB total
  - `null` - No specific total (daily allocation or truly unlimited)
- **Note:** Can coexist with `perDayData` for clarity

#### `data.unit`
- **Type:** `"GB"`
- **Description:** Unit of data measurement
- **Always:** Gigabytes (GB)

### `voice`
Object containing voice call information:

#### `voice.isUnlimited`
- **Type:** `boolean`
- **Description:** Whether voice calls are unlimited
- **Values:**
  - `true` - Unlimited calling (typically local + STD + roaming)
  - `false` - No voice benefits (data-only plans)
- **Note:** Airtel doesn't store limited minutes; it's either unlimited or none

#### `voice.coverage`
- **Type:** `string[]`
- **Description:** Types of calls covered
- **Possible Values:**
  - `["local", "STD", "roaming"]` - All India calling
  - `[]` - No voice benefits (data-only plans)
- **Example:** Full recharge plans have complete coverage

### `sms`
Object containing SMS benefits:

#### `sms.perDay`
- **Type:** `number | null`
- **Description:** Daily SMS quota
- **Common Values:**
  - `100` - Standard for Truly Unlimited plans
  - `null` - No SMS benefits
- **Note:** SMS per day is more common than total SMS

#### `sms.total`
- **Type:** `number | null`
- **Description:** Total SMS for entire validity
- **Examples:**
  - `300` - For monthly plans
  - `3600` - For yearly plans
  - `null` - No SMS or uses daily quota
- **Usage:** Typically used in long-validity plans

### `isAddOn`
- **Type:** `boolean`
- **Description:** Indicates if this is an add-on pack
- **Values:**
  - `true` - Add-on data/OTT pack (doesn't provide validity)
  - `false` - Full recharge plan (provides validity + base benefits)
- **Examples:**
  - Data booster packs: `true`
  - Plan vouchers: `false`

### `ott`
Object containing OTT (Over-The-Top) streaming benefits:

#### `ott.isIncluded`
- **Type:** `boolean`
- **Description:** Whether OTT subscriptions are bundled
- **Values:**
  - `true` - Plan includes OTT benefits
  - `false` - No OTT benefits

#### `ott.services`
- **Type:** `string[]`
- **Description:** Array of OTT service names included
- **Examples:**
  ```json
  ["JioHotstar Mobile"]
  ["Netflix Basic", "JioHotstar Super", "Zee5 Premium", "Airtel Xstream Play Premium"]
  ["Amazon Prime Lite", "Airtel Xstream Play Premium"]
  []
  ```
- **Common Services:**
  - `"Netflix Basic"` - Basic Netflix subscription
  - `"Amazon Prime Lite"` - Amazon Prime Lite subscription
  - `"JioHotstar Mobile"` / `"JioHotstar Super"` - Disney+ Hotstar mobile/premium
  - `"Airtel Xstream Play Premium"` - Airtel's own OTT platform
  - `"Zee5 Premium"` / `"Zee5"` - Zee5 subscription

---

## Plan Categories Explained

### 1. **Data** Category
- **Purpose:** Data-only add-on packs
- **Characteristics:**
  - `isAddOn: true`
  - No voice benefits (`voice.isUnlimited: false`)
  - No SMS benefits
  - May include OTT subscriptions
- **Use Case:** Supplementary data for users with active plans
- **Example:**
  ```json
  {
    "planId": "1",
    "price": 451,
    "category": "Data",
    "validity": { "days": 30, "unit": "Calendar Day(s)" },
    "data": {
      "isUnlimited": false,
      "isPerDay": false,
      "perDayData": null,
      "totalData": 50.0,
      "unit": "GB"
    },
    "voice": { "isUnlimited": false, "coverage": [] },
    "sms": { "perDay": null, "total": null },
    "isAddOn": true,
    "ott": { "isIncluded": true, "services": ["JioHotstar Mobile"] }
  }
  ```

### 2. **Truly Unlimited** Category
- **Purpose:** Full-fledged recharge plans
- **Characteristics:**
  - `isAddOn: false`
  - Unlimited calling (`voice.isUnlimited: true`)
  - Daily SMS benefits (usually 100/day)
  - Either unlimited or substantial daily data
- **Use Case:** Primary recharge for regular users
- **Sub-types:**
  - Daily data quota (e.g., 2GB/day)
  - Total data quota (e.g., 60GB total)
  - Truly unlimited with FUP
- **Example:**
  ```json
  {
    "planId": "18",
    "price": 3599,
    "category": "Truly Unlimited",
    "validity": { "days": 365, "unit": "Calendar Day(s)" },
    "data": {
      "isUnlimited": true,
      "isPerDay": true,
      "perDayData": 2.0,
      "totalData": null,
      "unit": "GB"
    },
    "voice": { "isUnlimited": true, "coverage": ["local", "STD", "roaming"] },
    "sms": { "perDay": 100, "total": null },
    "isAddOn": false,
    "ott": { "isIncluded": false, "services": [] }
  }
  ```

### 3. **Entertainment** Category
- **Purpose:** Plans with premium OTT subscriptions
- **Characteristics:**
  - Similar to "Truly Unlimited" but with focus on entertainment
  - Premium OTT services included (Netflix, Prime, etc.)
  - Usually higher-priced than equivalent data plans
- **Use Case:** Users who value streaming content
- **Example:**
  ```json
  {
    "planId": "54",
    "price": 1729,
    "category": "Entertainment",
    "validity": { "days": 84, "unit": "Calendar Day(s)" },
    "data": {
      "isUnlimited": true,
      "isPerDay": true,
      "perDayData": 2.0,
      "totalData": null,
      "unit": "GB"
    },
    "voice": { "isUnlimited": true, "coverage": ["local", "STD", "roaming"] },
    "sms": { "perDay": 100, "total": null },
    "isAddOn": false,
    "ott": {
      "isIncluded": true,
      "services": [
        "Netflix Basic",
        "JioHotstar Super",
        "ZEE5 Premium",
        "Xstream Play Premium"
      ]
    }
  }
  ```

### 4. **Plan Vouchers** Category
- **Purpose:** Standard recharge vouchers
- **Characteristics:**
  - Full recharge plans
  - Balanced mix of data, calls, and SMS
  - May or may not have OTT benefits
- **Use Case:** General purpose recharges
- **Example:**
  ```json
  {
    "planId": "67",
    "price": 609,
    "category": "Plan Vouchers",
    "validity": { "days": 30, "unit": "Calendar Day(s)" },
    "data": {
      "isUnlimited": false,
      "isPerDay": false,
      "perDayData": null,
      "totalData": 60.0,
      "unit": "GB"
    },
    "voice": { "isUnlimited": true, "coverage": ["local", "STD", "roaming"] },
    "sms": { "perDay": null, "total": 300 },
    "isAddOn": false,
    "ott": { "isIncluded": false, "services": [] }
  }
  ```

---

## Data Allocation Patterns

### Pattern 1: **Daily Data Quota**
- `isPerDay: true`
- `perDayData: <number>`
- `totalData: null` or calculated
- **Example:** 2GB/day for 28 days
- **User Benefit:** Consistent daily usage

### Pattern 2: **Total Data Quota**
- `isPerDay: false`
- `perDayData: null`
- `totalData: <number>`
- **Example:** 50GB total for 30 days
- **User Benefit:** Flexibility in usage

### Pattern 3: **Truly Unlimited**
- `isUnlimited: true`
- `isPerDay: false`
- `perDayData: null`
- `totalData: null`
- **Example:** Unlimited for 2 days
- **User Benefit:** No restrictions (subject to FUP)

### Pattern 4: **Unlimited with Daily Cap**
- `isUnlimited: true`
- `isPerDay: true`
- `perDayData: <number>`
- `totalData: null` or calculated
- **Example:** Unlimited data but 2.5GB/day at high speed
- **User Benefit:** High-speed daily quota + unlimited post-FUP

---

## Common Plan Patterns

### Budget Data Packs
```json
{
  "price": 22-181,
  "category": "Data",
  "validity": { "days": 1-30 },
  "data": { "totalData": 1.0-15.0 },
  "isAddOn": true,
  "ott": { "isIncluded": false }
}
```

### Standard Monthly Plans
```json
{
  "price": 299-429,
  "category": "Truly Unlimited",
  "validity": { "days": 28-30 },
  "data": { "isPerDay": true, "perDayData": 1.0-2.5 },
  "voice": { "isUnlimited": true },
  "sms": { "perDay": 100 }
}
```

### Premium Entertainment Plans
```json
{
  "price": 549-1729,
  "category": "Entertainment",
  "validity": { "days": 28-84 },
  "data": { "isUnlimited": true, "perDayData": 2.0-3.0 },
  "voice": { "isUnlimited": true },
  "sms": { "perDay": 100 },
  "ott": { "services": ["Netflix/Prime/Hotstar/Zee5"] }
}
```

### Annual Plans
```json
{
  "price": 3599-3999,
  "category": "Plan Vouchers" or "Truly Unlimited",
  "validity": { "days": 365 },
  "data": { "isPerDay": true, "perDayData": 2.0-2.5 },
  "voice": { "isUnlimited": true },
  "sms": { "perDay": 100 }
}
```

---

## Normalization for Application

The application converts Airtel plans to a `NormalizedPlan` interface:

```typescript
static normalizeAirtelPlan(plan: AirtelPlan, index: number): NormalizedPlan {
  return {
    id: `airtel_${index}`,
    operator: 'airtel',
    price: plan.price,
    validity: plan.validity,
    data: {
      isUnlimited: plan.data.unlimited,
      perDay: plan.data.perDay,
      total: plan.data.total,
    },
    voice: {
      isUnlimited: plan.voice.unlimited,
      minutes: null, // Airtel doesn't specify limited minutes
    },
    sms: {
      perDay: plan.sms.perDay || null,
      total: null,
    },
    fiveG: plan.fiveG,
    ottServices: plan.subscriptions,
    pricePerDay: plan.price / plan.validity,
    pricePerGB: calculatePricePerGB(plan),
  };
}
```

---

## Key Insights for Developers

### Simplicity
- Airtel has the **simplest schema** - flat structure, minimal nesting
- Circle-based since 2026-10 (`available_circles`, 22 circles) — most plans are in all circles, a few are circle-specific
- No special conditions like GP2/JK20 (unlike BSNL)

### Data-Centric
- Strong emphasis on data-only packs
- Wide range of data allocations (1GB to 60GB)
- Clear distinction between per-day and total data

### Entertainment Focus
- Separate "Entertainment" category for OTT bundles
- Partners with Netflix, Amazon Prime, Disney+ Hotstar, Zee5
- Proprietary "Airtel Xstream Play" platform

### 5G Readiness
- Some plans marked with `fiveG: true`
- 5G support is emerging but not universal

### Voice Simplicity
- Either unlimited calling or no calling
- No limited minute plans (unlike BSNL)
- Always includes local + STD + roaming when available

### Validation Rules
1. If `isUnlimited: true`, expect `perDayData` OR neither (truly unlimited)
2. If `isPerDay: true`, expect `perDayData` to be present
3. If `isAddOn: true`, `voice.isUnlimited` is always `false`
4. If `ott.isIncluded: true`, `ott.services` array must not be empty
5. `price` must be positive integer
6. `validity.days` can be fractional (0.04 for hourly plans)

---

## Example Complete Plan

```json
{
  "planId": "28",
  "price": 549,
  "category": "Truly Unlimited",
  "validity": {
    "days": 28,
    "unit": "Calendar Day(s)"
  },
  "data": {
    "isUnlimited": true,
    "isPerDay": true,
    "perDayData": 3.0,
    "totalData": null,
    "unit": "GB"
  },
  "voice": {
    "isUnlimited": true,
    "coverage": ["local", "STD", "roaming"]
  },
  "sms": {
    "perDay": 100,
    "total": null
  },
  "isAddOn": false,
  "ott": {
    "isIncluded": true,
    "services": [
      "JioHotstar Mobile",
      "Airtel Xstream Play Premium",
      "Zee5"
    ]
  }
}
```

**What this plan offers:**
- ₹549 for 28 days
- Unlimited data with 3GB/day high-speed
- Unlimited all-India calling
- 100 SMS per day
- 3 OTT subscriptions included
- 5G ready (if supported in area)

---

## Database Statistics

As of the 2026-10-09 refresh (22 circles scraped):

- **Total records:** 69 (each circle has 37–38 plans; a record = one plan in one or more circles)
- **In all 22 circles:** 11 records
- **Circle-specific variants:** ₹399 / ₹449 / ₹1099 / ₹3999 have no daily cap in 13 circles (BH, GJ, HR, KL, KO, MH, MP, MU, OD, PB, UE, UW, WB) and a daily cap in the other 9 (AP, AS, DL, HP, JK, KA, NE, RJ, TN); ₹348 exists only in those 13 circles; ₹161 is 15 GB / 15 d in TN (12 GB / 30 d elsewhere); ₹219 is 2 GB / 1 month in KA (3 GB / 28 d elsewhere); J&K cards list calls as "local & STD" (no roaming), so most J&K plans are separate records
- **Categories:** Truly Unlimited 56, Data 13
- **Price Range:** ₹22 – ₹3999

---

## Notes for Developers

1. **Pricing Transparency:** All prices are in INR, whole numbers only
2. **Circle Filtering (2026-10):** filter by `available_circles`; same price can appear more than once with different benefits per circle
3. **OTT Naming:** Service names may vary (e.g., "JioHotstar" vs "Hotstar")
4. **Add-On Detection:** Use `isAddOn` field to separate add-ons from plans
5. **Data Display:** Check `isPerDay` to determine how to show data (per day vs total)
6. **Missing Fields:** Some fields can be `null` - handle gracefully
7. **FUP Implications:** "Unlimited" plans may have Fair Usage Policy (not in JSON)

---

## Changelog & Version Info

- **2026-10-09 — v2.0:** added `available_circles` (Airtel now scraped per circle); `planId` changed from a sequence number to `airtel_<price>_<days>[_n]`; `fiveG` documented
- **v1.0:** pan-India flat array
