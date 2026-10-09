# BSNL Plan JSON Schema Documentation

## Overview
BSNL (Bharat Sanchar Nigam Limited) is India's state-owned telecommunications operator with the widest network coverage, including remote areas. The BSNL database features extensive regional (circle-based) plans, special government employee schemes (GP2), regional discounts (JK20), and unique "freebies validity" concepts.

**Database File:** `db/bsnl_plans_db.json`
**Total Plans:** ~250+ plans (as per current database)
**Unique Characteristics:**
- **Circle-based availability** (34 telecom circles across India)
- **GP2 Plans** (Government Phase 2 - exclusive for government employees)
- **JK20 Plans** (20% discount for Jammu & Kashmir residents)
- **Freebies Validity** (separate from plan validity - unique to BSNL)
- **Post-FUP data limits** (50MB/day after freebies expire)
- **MTNL integration** (coverage includes MTNL networks)
- Most detailed voice coverage specifications
- Longest validity plans (up to 395 days)

---

## Root Structure

The BSNL database is a **flat array** of plan objects with circle availability:

```json
[
  {
    "plan_details": {
      "planName": "PV-2399",
      "price": 2399,
      "validity": { ... },
      "data": { ... },
      "voice": { ... },
      "sms": { ... },
      "additionalBenefits": { ... },
      "specialConditions": { ... },
      "freebiesValidity": { ... }
    },
    "available_circles": ["AP", "AR", "AS", ...]
  },
  ...
]
```

---

## Complete TypeScript Interface

```typescript
interface BSNLPlan {
  plan_details: {
    planName: string;                              // Plan identifier (e.g., "PV-2399")
    price: number;                                 // Plan price in INR (₹)
    validity: {
      days: number;                                // Plan validity in days
      unit: "days";                                // Always "days"
      isCalendarMonth: boolean;                    // Whether it's calendar month based
    };
    data: {
      isUnlimited: boolean;                        // Whether data is unlimited
      dailyLimit: {                                // Daily data limit
        amount: number;                            // Amount in GB
        unit: "GB";                                // Always "GB"
      } | null;
      totalLimit: {                                // Total data limit
        amount: number;                            // Amount in GB
        unit: "GB";                                // Always "GB"
      } | null;
      postFUPSpeed: number | null;                 // Speed after FUP in Kbps
      hasSpeedReduction: boolean;                  // Whether speed reduces after FUP
    };
    voice: {
      isUnlimited: boolean;                        // Whether calls are unlimited
      minutes: number | null;                      // Limited call minutes
      coverage: {
        local: boolean;                            // Local calls included
        std: boolean;                              // STD calls included
        roaming: boolean;                          // Roaming calls included
        mtnlIncluded: boolean;                     // MTNL network included
      };
    };
    sms: {
      dailyLimit: number | null;                   // Daily SMS limit (BSNL uses "perDay")
      total: number | null;                        // Total SMS
      isRoamingIncluded: boolean;                  // SMS roaming included
    };
    additionalBenefits: {
      talkValue: number | null;                    // Talk time value in ₹
      bsnlTunes: boolean;                          // BSNL Tunes subscription
    };
    specialConditions: {
      isForInactiveCustomers: boolean;             // For inactive/churned customers
      isGP2: boolean;                              // Government Phase 2 exclusive
      isJK20?: boolean;                            // Jammu & Kashmir 20% discount
      multipleRechargeAllowed: boolean;            // Can recharge multiple times
    };
    freebiesValidity: {
      days: number;                                // Freebies validity in days
      isSameAsPlanValidity: boolean;               // Whether freebies = plan validity
    } | null;
  };
  available_circles: string[];                     // Array of circle codes
}
```

---

## Field Descriptions

### `plan_details.planName`
- **Type:** `string`
- **Description:** Unique plan identifier following BSNL naming convention
- **Format:** `PV-<price>` or `STV-<price>`
- **Examples:**
  - `"PV-2399"` - Plan Voucher for ₹2399
  - `"PV-397"` - Plan Voucher for ₹397
  - `"PV-1199"` - GP2 exclusive ₹1199 plan
- **Components:**
  - `PV` = Plan Voucher (full recharge)
  - `STV` = Special Tariff Voucher (add-on/special purpose)
  - Number = Price in rupees
- **Usage:** Display name and unique identifier

### `plan_details.price`
- **Type:** `number`
- **Description:** Recharge amount in Indian Rupees (₹)
- **Range:** ₹107 to ₹2399 (BSNL focuses on budget-friendly)
- **Examples:** `2399`, `1999`, `397`, `107`
- **Note:** Whole numbers only

### `plan_details.validity`
Object containing plan validity information:

#### `validity.days`
- **Type:** `number`
- **Description:** Total plan validity in days
- **Range:** 26 days to 395 days
- **Common Values:** 26, 30, 82, 150, 180, 336, 365, 395
- **Special Cases:**
  - `395 days` - Longest validity in the industry (13 months)
  - `336 days` - Common for annual-like plans
  - `82 days` - Quarterly plans
- **Note:** BSNL uses exact day counts, not "months"

#### `validity.unit`
- **Type:** `"days"`
- **Description:** Unit of validity
- **Always:** `"days"` (never "months" or other units)

#### `validity.isCalendarMonth`
- **Type:** `boolean`
- **Description:** Whether validity follows calendar months
- **Values:**
  - `false` - Standard (days from recharge date)
  - `true` - Rare, follows calendar month boundaries
- **Usage:** Affects recharge timing strategy

### `plan_details.data`
Object containing data allocation details:

#### `data.isUnlimited`
- **Type:** `boolean`
- **Description:** Whether data is marketed as unlimited
- **Values:**
  - `true` - Unlimited data (subject to daily caps and freebies validity)
  - `false` - Limited data allocation
- **BSNL Special:** "Unlimited" often has daily caps AND freebies validity limits

#### `data.dailyLimit`
- **Type:** `{ amount: number, unit: "GB" } | null`
- **Description:** Daily high-speed data quota
- **Examples:**
  - `{ "amount": 2, "unit": "GB" }` - 2GB per day
  - `{ "amount": 0, "unit": "GB" }` - Effectively no daily data (uses total)
  - `{ "amount": 0.05, "unit": "GB" }` - 50MB per day (post-freebies)
  - `null` - No daily limit
- **Range:** 0 to 2 GB (BSNL caps at 2GB/day typically)
- **Critical:** Check `freebiesValidity` for actual high-speed duration

#### `data.totalLimit`
- **Type:** `{ amount: number, unit: "GB" } | null`
- **Description:** Total data allocation
- **Examples:**
  - `{ "amount": 24, "unit": "GB" }` - 24GB total
  - `{ "amount": 600, "unit": "GB" }` - 600GB total (annual plans)
  - `{ "amount": 0.05, "unit": "GB" }` - 50MB total (minimal)
  - `null` - Not applicable
- **Usage:** Used when no daily limit specified
- **Note:** Can coexist with `dailyLimit` for complex plans

#### `data.postFUPSpeed`
- **Type:** `number | null`
- **Description:** Internet speed (in Kbps) after Fair Usage Policy exhausted
- **Common Values:**
  - `40` - 40 Kbps (0.04 Mbps) - BSNL standard
  - `null` - No FUP or not applicable
- **Examples:**
  - Most unlimited plans: `40 Kbps`
  - Limited data plans: `null`
- **Context:** At 40 Kbps, only very basic browsing is possible
- **BSNL Special:** After freebies expire, users get **50MB/day at normal speed**

#### `data.hasSpeedReduction`
- **Type:** `boolean`
- **Description:** Whether speed is reduced after quota exhaustion
- **Values:**
  - `true` - Speed reduces to `postFUPSpeed`
  - `false` - No speed reduction (data stops or continues at same speed)
- **Usage:** Determines post-FUP behavior

### `plan_details.voice`
Object containing voice call benefits (most detailed among all operators):

#### `voice.isUnlimited`
- **Type:** `boolean`
- **Description:** Whether voice calls are unlimited
- **Values:**
  - `true` - Unlimited calling (check coverage for limitations)
  - `false` - Limited minutes specified

#### `voice.minutes`
- **Type:** `number | null`
- **Description:** Limited call minutes for entire validity
- **Examples:**
  - `3600` - 3600 minutes (60 hours) for annual plans
  - `null` - Unlimited or no voice benefit
- **Usage:** Total minutes, not per day
- **Calculation:** For 365-day plan with 3600 min: ~10 min/day average

#### `voice.coverage`
Object specifying call coverage types:

##### `voice.coverage.local`
- **Type:** `boolean`
- **Description:** Local (within same circle) calls included
- **Always:** `true` for plans with voice benefits

##### `voice.coverage.std`
- **Type:** `boolean`
- **Description:** STD (inter-circle within India) calls included
- **Values:**
  - `true` - All India calling
  - `false` - Only local calls (rare)

##### `voice.coverage.roaming`
- **Type:** `boolean`
- **Description:** Calls while roaming included
- **Values:**
  - `true` - Roaming calls free
  - `false` - Roaming charges apply

##### `voice.coverage.mtnlIncluded`
- **Type:** `boolean`
- **Description:** MTNL (Mumbai/Delhi) network included
- **Values:**
  - `true` - Can call MTNL numbers (unique to BSNL)
  - `false` - MTNL excluded
- **Context:** MTNL is separate operator in Mumbai/Delhi, BSNL often includes it
- **Unique:** Only BSNL tracks this explicitly

### `plan_details.sms`
Object containing SMS benefits:

#### `sms.dailyLimit`
- **Type:** `number | null`
- **Description:** Daily SMS quota (BSNL uses "dailyLimit", others use "perDay")
- **Common Values:**
  - `100` - Standard for full recharge plans
  - `null` - No SMS or uses total count
- **Note:** Field name is `dailyLimit` but represents per-day allocation

#### `sms.total`
- **Type:** `number | null`
- **Description:** Total SMS for entire validity
- **Examples:**
  - `360` - For annual plans
  - `null` - Uses daily limit
- **Usage:** Less common than daily limit

#### `sms.isRoamingIncluded`
- **Type:** `boolean`
- **Description:** Whether SMS works while roaming
- **Values:**
  - `true` - SMS valid in roaming
  - `false` - Roaming SMS not included
- **Unique:** Only BSNL tracks SMS roaming explicitly

### `plan_details.additionalBenefits`
Object containing extra perks:

#### `additionalBenefits.talkValue`
- **Type:** `number | null`
- **Description:** Talk time value in rupees
- **Examples:**
  - `null` - Most plans (no separate talk value)
  - Can be numeric for specific plans
- **Legacy:** Older plan type, rarely used now
- **Usage:** Additional balance for pay-per-use services

#### `additionalBenefits.bsnlTunes`
- **Type:** `boolean`
- **Description:** BSNL Tunes (caller tune) subscription
- **Values:**
  - `true` - BSNL Tunes included
  - `false` - No BSNL Tunes
- **Typically:** `false` in current database

### `plan_details.specialConditions`
Object containing special eligibility/conditions - **MOST UNIQUE TO BSNL**:

#### `specialConditions.isForInactiveCustomers`
- **Type:** `boolean`
- **Description:** Plan exclusively for inactive/churned customers
- **Values:**
  - `true` - Only for customers whose plan expired
  - `false` - Available to all
- **Use Case:** Re-activation plans for dormant numbers
- **Unique:** Only BSNL tracks customer status in plan definition

#### `specialConditions.isGP2`
- **Type:** `boolean`
- **Description:** Government Phase 2 exclusive plan
- **Values:**
  - `true` - Only for central/state government employees
  - `false` - Public plans
- **Examples:** PV-1199 (GP2 exclusive), PV-1499 (GP2 version exists)
- **Benefits:** Same features as regular plans at 20-25% lower price
- **Eligibility:** Requires government employee ID verification
- **Critical Filter:** Application must filter GP2 plans unless user opts in
- **Unique:** Only BSNL has government employee exclusive plans

#### `specialConditions.isJK20`
- **Type:** `boolean` (optional field)
- **Description:** Jammu & Kashmir 20% discount plan
- **Values:**
  - `true` - 20% discount for J&K circle residents
  - `undefined` or `false` - Not a JK20 plan
- **Examples:** Special pricing for Jammu & Kashmir telecom circle
- **Eligibility:** Only for numbers in JK circle
- **Context:** Part of government initiative for J&K region
- **Critical Filter:** Only show if user selects JK circle + enables JK20
- **Unique:** Only BSNL has region-specific discount programs

#### `specialConditions.multipleRechargeAllowed`
- **Type:** `boolean`
- **Description:** Whether user can recharge with same plan multiple times
- **Values:**
  - `true` - Can stack/renew
  - `false` - One-time recharge only
- **Typically:** `false` for most plans
- **Use Case:** Prevents abuse of special offer plans

### `plan_details.freebiesValidity`
**MOST CRITICAL AND UNIQUE BSNL FEATURE**

- **Type:** `{ days: number, isSameAsPlanValidity: boolean } | null`
- **Description:** Validity duration for high-speed data and unlimited calls
- **BSNL Unique:** Freebies (data + calls) may expire BEFORE plan validity ends

#### `freebiesValidity.days`
- **Type:** `number`
- **Description:** Number of days freebies are available
- **Examples:**
  - `30` - Freebies for 30 days
  - `395` - Freebies for full 395 days
  - `150` - Freebies for 150 days (plan might be 150+ days)
- **Critical:** User must know when high-speed data ends

#### `freebiesValidity.isSameAsPlanValidity`
- **Type:** `boolean`
- **Description:** Whether freebies last for entire plan validity
- **Values:**
  - `true` - Freebies = Plan validity (simple case)
  - `false` - **ALERT:** Freebies end earlier than plan validity
- **Examples:**
  - Plan PV-397: Freebies 30 days, Plan validity 150 days
    - After 30 days: No high-speed data, calls become pay-per-use
    - Plan stays active for 120 more days (for incoming calls, recharge)

#### **After Freebies Expire:**
According to application code comments:
- **Data:** 50MB/day high-speed data available (if originally unlimited)
- **Voice:** Pay-per-use or no calling
- **SMS:** Typically not available
- **Purpose:** Keeps number active for incoming calls and recharges

#### **Example Scenario:**
```json
{
  "planName": "PV-397",
  "price": 397,
  "validity": { "days": 150 },
  "data": {
    "isUnlimited": true,
    "dailyLimit": { "amount": 2, "unit": "GB" }
  },
  "freebiesValidity": {
    "days": 30,
    "isSameAsPlanValidity": false
  }
}
```
**User Experience:**
- **Days 1-30:** 2GB/day high-speed + unlimited calls
- **Days 31-150:** 50MB/day data + number remains active (no calls)
- **Day 151+:** Plan expired, need recharge

### `available_circles`
- **Type:** `string[]`
- **Description:** Array of telecom circle codes where plan is available
- **Format:** Two-letter state/UT codes
- **All Possible Codes (34 circles):**
  ```
  AP  - Andhra Pradesh        AR  - Arunachal Pradesh    AS  - Assam
  BR  - Bihar                 CG  - Chhattisgarh        CH  - Chandigarh
  CN  - Chennai               DD  - Daman & Diu         DN  - Delhi NCR
  GA  - Goa                   GJ  - Gujarat             HP  - Himachal Pradesh
  HR  - Haryana               JH  - Jharkhand           JK  - Jammu & Kashmir
  KA  - Karnataka             KL  - Kerala             KO  - Kolkata
  LD  - Lakshadweep           MH  - Maharashtra        ML  - Meghalaya
  MN  - Manipur               MP  - Madhya Pradesh     MZ  - Mizoram
  NL  - Nagaland              OR  - Odisha             PB  - Punjab
  PY  - Puducherry            RJ  - Rajasthan          SK  - Sikkim
  TN  - Tamil Nadu            TR  - Tripura            TS  - Telangana
  UA  - Uttarakhand           UE  - UP East            UW  - UP West
  WB  - West Bengal
  ```
- **Examples:**
  ```json
  ["AP", "KA", "TN", "KL"]  // South India only
  ["AP", "AR", "AS", ...]    // All 36 circles (pan-India)
  ["JK"]                     // JK20 exclusive plans
  ```
- **Usage:** Critical for circle-based filtering
- **Note:** BSNL and Vi require circle selection; Airtel and Jio don't

---

## Plan Categories & Patterns

### 1. **Full Unlimited Plans (Freebies = Plan Validity)**
```json
{
  "planName": "PV-2399",
  "price": 2399,
  "validity": { "days": 395 },
  "data": {
    "isUnlimited": true,
    "dailyLimit": { "amount": 2, "unit": "GB" }
  },
  "voice": { "isUnlimited": true },
  "freebiesValidity": {
    "days": 395,
    "isSameAsPlanValidity": true
  }
}
```
**Benefits:** Full benefits for entire validity

### 2. **Limited Freebies Plans (Freebies < Plan Validity)**
```json
{
  "planName": "PV-397",
  "price": 397,
  "validity": { "days": 150 },
  "data": {
    "isUnlimited": true,
    "dailyLimit": { "amount": 2, "unit": "GB" }
  },
  "freebiesValidity": {
    "days": 30,
    "isSameAsPlanValidity": false
  }
}
```
**Benefits:** High-speed data + calls for 30 days, then 50MB/day for 120 days

### 3. **GP2 Exclusive Plans**
```json
{
  "planName": "PV-1199",
  "price": 1199,
  "validity": { "days": 336 },
  "specialConditions": {
    "isGP2": true,
    "isForInactiveCustomers": true
  }
}
```
**Eligibility:** Government employees only

### 4. **JK20 Discount Plans**
```json
{
  "planName": "PV-XXX",
  "price": <discounted>,
  "specialConditions": {
    "isJK20": true
  },
  "available_circles": ["JK"]
}
```
**Eligibility:** Jammu & Kashmir circle only

### 5. **Limited Voice Plans (No Unlimited Calling)**
```json
{
  "planName": "PV-1198",
  "price": 1198,
  "validity": { "days": 365 },
  "data": {
    "isUnlimited": false,
    "totalLimit": { "amount": 36, "unit": "GB" }
  },
  "voice": {
    "isUnlimited": false,
    "minutes": 3600  // 3600 minutes for 365 days
  }
}
```
**Use Case:** Budget-conscious users with low call usage

### 6. **Total Data Plans (No Daily Cap)**
```json
{
  "price": 1999,
  "validity": { "days": 365 },
  "data": {
    "isUnlimited": true,
    "dailyLimit": { "amount": 0, "unit": "GB" },
    "totalLimit": { "amount": 600, "unit": "GB" }
  }
}
```
**Flexibility:** 600GB usable anytime within 365 days

---

## Circle-Based Filtering

### Implementation Logic
```typescript
// Filter by selected circle
if (preferences.circle && plan.available_circles) {
  if (!plan.available_circles.includes(preferences.circle)) {
    return 0; // Exclude plan
  }
}

// GP2 filtering
if (plan.specialConditions.isGP2 && !preferences.isGP2) {
  return 0; // Exclude GP2 plans unless user is government employee
}

// JK20 filtering
if (plan.specialConditions.isJK20 && !preferences.isJK20) {
  return 0; // Exclude JK20 unless user in JK circle with JK20 enabled
}
```

### Circle Selection Rules
1. **Mandatory:** User must select circle for BSNL plans
2. **JK Circle Special:** Shows JK20 toggle when JK selected
3. **Pan-India Plans:** Plans available in all 36 circles
4. **Regional Plans:** Limited to specific circles

---

## Normalization for Application

```typescript
static normalizeBSNLPlan(plan: BSNLPlan, index: number): NormalizedPlan {
  const details = plan.plan_details;
  const perDayData = details.data.dailyLimit?.amount || null;
  const totalData = details.data.totalLimit?.amount || null;

  return {
    id: `bsnl_${index}`,
    operator: 'bsnl',
    price: details.price,
    validity: details.validity.days,
    data: {
      isUnlimited: details.data.isUnlimited,
      perDay: perDayData,
      total: totalData,
      postFUPSpeed: details.data.postFUPSpeed,
    },
    voice: {
      isUnlimited: details.voice.isUnlimited,
      minutes: details.voice.minutes,
    },
    sms: {
      perDay: details.sms.dailyLimit,  // Note: field name is dailyLimit
      total: details.sms.totalLimit,
    },
    fiveG: false, // BSNL doesn't have 5G yet
    ottServices: [], // BSNL doesn't bundle OTT services
    pricePerDay: details.price / details.validity.days,
    pricePerGB: calculatePricePerGB(plan),
    isGP2Only: details.specialConditions.isGP2,
    isJK20: details.specialConditions.isJK20,
    circles: plan.available_circles,
    freebiesValidity: details.freebiesValidity?.isSameAsPlanValidity
      ? details.validity.days
      : details.freebiesValidity?.days || null
  };
}
```

---

## Key Insights for Developers

### Complexity
- **Most complex regional structure** - 34 circles with varying availability
- **Special conditions** - GP2, JK20, inactive customers
- **Freebies validity** - Unique dual-validity concept

### Government Focus
- GP2 plans for government employees (20-25% discount)
- JK20 regional development initiative
- State-owned operator with social objectives

### Freebies Validity Critical
- **MUST display freebies validity separately** from plan validity
- **Warning required:** "Data/calls available only for X days"
- **Post-freebies:** 50MB/day for unlimited plans
- **User confusion risk:** High if not explained clearly

### No 5G, No OTT
- BSNL doesn't have 5G network yet (`fiveG: false` always)
- No OTT bundles (`ottServices: []` always)
- Focus on basic connectivity at low prices

### Circle Dependency
- Circle selection **mandatory** for BSNL
- Some plans available in limited circles only
- JK circle has special JK20 plans

### Validation Rules
1. If `isGP2: true`, hide from general users unless opted in
2. If `isJK20: true`, only show for JK circle with JK20 enabled
3. If `freebiesValidity.isSameAsPlanValidity: false`, display warning
4. Check `available_circles` array is not empty
5. `voice.minutes` and `voice.isUnlimited` are mutually exclusive
6. `postFUPSpeed` should be `40` or `null` (never other values for BSNL)
7. `sms.dailyLimit` used, not `sms.perDay` (different field name)

---

## Example Complete Plan

```json
{
  "plan_details": {
    "planName": "PV-2399",
    "price": 2399,
    "validity": {
      "days": 395,
      "unit": "days",
      "isCalendarMonth": false
    },
    "data": {
      "isUnlimited": true,
      "dailyLimit": {
        "amount": 2,
        "unit": "GB"
      },
      "totalLimit": null,
      "postFUPSpeed": 40,
      "hasSpeedReduction": true
    },
    "voice": {
      "isUnlimited": true,
      "minutes": null,
      "coverage": {
        "local": true,
        "std": true,
        "roaming": true,
        "mtnlIncluded": true
      }
    },
    "sms": {
      "dailyLimit": 100,
      "total": null,
      "isRoamingIncluded": true
    },
    "additionalBenefits": {
      "talkValue": null,
      "bsnlTunes": false
    },
    "specialConditions": {
      "isForInactiveCustomers": false,
      "isGP2": false,
      "multipleRechargeAllowed": false
    },
    "freebiesValidity": {
      "days": 395,
      "isSameAsPlanValidity": true
    }
  },
  "available_circles": [
    "AP", "AR", "AS", "BR", "CG", "CH", "CN", "DD", "DN", "GA",
    "GJ", "HP", "HR", "JH", "KA", "KL", "KO", "LD", "MH", "ML",
    "MN", "MP", "MZ", "NL", "OR", "PB", "PY", "RJ", "SK", "TN",
    "TR", "TS", "UA", "UE", "UW", "WB"
  ]
}
```

**What this plan offers:**
- ₹2399 for 395 days (13 months - longest in industry)
- 2GB/day high-speed data (entire 395 days)
- Unlimited all-India calling (local + STD + roaming + MTNL)
- 100 SMS per day
- Post-FUP: 40 Kbps
- Available in all 36 BSNL circles
- Freebies valid for full 395 days
- ₹6.07 per day (best value in market)

---

## Database Statistics

- **Total Plans:** 250+
- **Price Range:** ₹107 - ₹2399
- **Validity Range:** 26 days to 395 days (longest)
- **GP2 Exclusive Plans:** ~20-30
- **JK20 Plans:** ~10-15
- **Pan-India Plans:** ~60-70%
- **Circle-Specific Plans:** ~30-40%
- **Plans with Separate Freebies Validity:** ~40%
- **5G Plans:** 0 (not launched yet)
- **OTT Bundles:** 0 (not offered)

---

## UI Warnings Required

### Critical User Warnings

1. **Freebies Validity Warning:**
   ```
   Note: The above mentioned data and calls are available only during
   freebies period (30 days). But the SIM plan validity will be 150 days.
   Beyond freebies period, 50MB/day high speed data is available for BSNL
   if the data is unlimited.
   ```

2. **GP2 Plan Badge:**
   ```
   GP2 Only - This plan is exclusively for Government Phase 2 employees.
   ```

3. **JK20 Plan Badge:**
   ```
   JK20 - This plan has 20% discount for Jammu & Kashmir circle residents.
   ```

4. **Circle Selection Required:**
   ```
   Please select your telecom circle to view BSNL plans.
   ```

---

## Changelog & Version Info

- **Last Updated:** Based on current database snapshot
- **Schema Version:** 1.5 (Stable with GP2/JK20 enhancements)
- **Breaking Changes:** None expected
- **5G Support:** Not available (BSNL hasn't launched 5G yet)
- **OTT Support:** Not available (BSNL doesn't bundle OTT services)
