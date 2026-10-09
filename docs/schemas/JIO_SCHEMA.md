# Jio Plan JSON Schema Documentation

## Overview
Jio (Reliance Jio Infocomm Limited) is India's largest 4G/5G telecom operator with the most extensive subscriber base. The Jio database features comprehensive plan categorization, extensive 5G support, and rich metadata including cloud storage and gaming subscriptions.

**Database File:** `db/jio_plans_db.json`
**Total Plans:** ~120+ plans (as per current database)
**Unique Characteristics:**
- Most comprehensive schema with detailed categorization
- Industry-leading 5G coverage with `unlimited5G` support
- Extensive OTT ecosystem (JioTV, JioCinema, JioSaavn, etc.)
- Special plan types (JioPhone, JioBharat, Gaming plans)
- JioAICloud storage benefits
- Detailed plan type flags for filtering

---

## Root Structure

The Jio database has a **wrapped structure** with plans array:

```json
{
  "plans": [
    {
      "id": "pop_100",
      "price": 100,
      "validityDays": 90,
      "dailyData": null,
      "totalData": { "amount": 5.0 },
      "voice": { ... },
      "sms": { ... },
      "has5G": false,
      "unlimited5G": false,
      "ottSubscriptions": { ... },
      "planType": { ... },
      "additionalBenefits": [ ... ],
      "postFUPSpeed": "64 Kbps"
    },
    ...
  ]
}
```

---

## Complete TypeScript Interface

```typescript
interface JioPlansDatabase {
  plans: JioPlan[];
}

interface JioPlan {
  id: string;                                  // Unique plan identifier (e.g., "pop_100")
  price: number;                               // Plan price in INR (₹)
  validityDays: number;                        // Validity period in days
  dailyData: DailyDataObj | null;              // Daily data allocation
  totalData: TotalDataObj | null;              // Total data allocation
  voice: {
    isUnlimited: boolean;                      // Whether calls are unlimited
    minutes: number | null;                    // Limited minutes (if not unlimited)
  };
  sms: {
    dailyLimit: number | null;                 // Daily SMS quota
    totalCount: number | null;                 // Total SMS count
  };
  has5G: boolean;                              // Whether 5G is available
  unlimited5G: boolean;                        // Whether 5G is truly unlimited
  ottSubscriptions: {
    netflix: string | boolean | null;          // Netflix subscription tier
    amazonPrime: string | boolean | null;      // Amazon Prime tier
    hotstar: boolean;                          // Disney+ Hotstar
    sonyliv: boolean;                          // Sony LIV
    zee5: boolean;                             // Zee5
    jioTV: boolean;                            // JioTV
    jioCinema: boolean;                        // JioCinema
    jioSaavn: boolean;                         // JioSaavn music
    fancode: boolean;                          // FanCode sports
    discoveryPlus: boolean;                    // Discovery+
    sunNxt: boolean;                           // Sun NXT
    lionsgate: boolean;                        // Lionsgate Play
    hoichoi: boolean;                          // Hoichoi Bengali
  };
  planType: {
    isJioPhone: boolean;                       // For JioPhone devices
    isDataPack: boolean;                       // Data-only add-on pack
    isJioPhoneDataAddon: boolean;              // JioPhone data add-on
    isJioBharatPhone: boolean;                 // For JioBharat phones
    isGaming: boolean;                         // Gaming subscription plan
  };
  additionalBenefits: string[];                // Array of benefit descriptions
  postFUPSpeed: string | null;                 // Speed after Fair Usage Policy
}

interface DailyDataObj {
  amount: number;                              // GB per day
}

interface TotalDataObj {
  amount: number;                              // Total GB
}
```

---

## Field Descriptions

### `id`
- **Type:** `string`
- **Description:** Unique plan identifier with prefix
- **Format:** `pop_<price>` for popular plans, or custom identifiers
- **Examples:**
  - `"pop_100"` - Popular ₹100 plan
  - `"pop_3599"` - Popular ₹3599 plan
  - `"pop_48"` - Gaming plan (₹48)
  - `"pop_999"` - ₹999 quarterly plan
- **Usage:** Used as primary key and for plan tracking
- **Note:** "pop" likely stands for "popular" or "prepaid option"

### `price`
- **Type:** `number`
- **Description:** Recharge amount in Indian Rupees (₹)
- **Range:** ₹48 to ₹3599 (extendable)
- **Examples:** `100`, `349`, `1299`, `3599`
- **Note:** Always whole numbers (integers)

### `validityDays`
- **Type:** `number`
- **Description:** Plan validity in calendar days
- **Range:** 3 days to 365 days
- **Common Values:** 3, 28, 84, 90, 98, 365
- **Examples:**
  - `3` - Short-term gaming/trial plans
  - `28` - Standard monthly plans
  - `84` - Quarterly plans (3 months)
  - `98` - Extended quarterly (98 days)
  - `365` - Annual plans
- **Note:** Jio uses actual days, not "calendar months"

### `dailyData`
- **Type:** `{ amount: number } | null`
- **Description:** Daily high-speed data quota object
- **Examples:**
  - `{ "amount": 2.0 }` - 2GB per day
  - `{ "amount": 2.5 }` - 2.5GB per day
  - `null` - No daily allocation (uses total data or no data)
- **Usage:** When present, data resets daily
- **Range:** 2.0 GB to 2.5 GB per day (typical)

### `totalData`
- **Type:** `{ amount: number } | null`
- **Description:** Total data allocation for entire validity
- **Examples:**
  - `{ "amount": 5.0 }` - 5GB total
  - `{ "amount": 200.0 }` - 200GB total
  - `{ "amount": 912.5 }` - 912.5GB (365 days × 2.5GB/day)
  - `{ "amount": 0.0 }` - No data (gaming-only plans)
  - `null` - Not applicable or truly unlimited
- **Note:** Often calculated from `dailyData × validityDays`
- **Special Case:** `0.0` for non-data plans (e.g., gaming subscriptions)

### `voice`
Object containing voice call benefits:

#### `voice.isUnlimited`
- **Type:** `boolean`
- **Description:** Whether voice calls are unlimited
- **Values:**
  - `true` - Unlimited calls (local + STD + roaming)
  - `false` - No voice or limited voice
- **Note:** Jio's unlimited means truly unlimited without daily caps

#### `voice.minutes`
- **Type:** `number | null`
- **Description:** Limited call minutes (if not unlimited)
- **Examples:**
  - `null` - Either unlimited or no voice benefit
  - Rarely used in Jio plans (most are unlimited or none)
- **Usage:** Reserved for future limited-minute plans

### `sms`
Object containing SMS benefits:

#### `sms.dailyLimit`
- **Type:** `number | null`
- **Description:** Daily SMS quota
- **Common Values:**
  - `100` - Standard for full recharge plans
  - `null` - No SMS benefit
- **Usage:** Resets every day

#### `sms.totalCount`
- **Type:** `number | null`
- **Description:** Total SMS count for entire validity
- **Examples:**
  - `null` - Uses daily limit or no SMS
  - Rarely used alongside dailyLimit
- **Note:** Most plans use `dailyLimit` instead

### `has5G`
- **Type:** `boolean`
- **Description:** Whether plan includes 5G access
- **Values:**
  - `true` - 5G network access enabled
  - `false` - 4G-only plan
- **Coverage:** Available in 5G-enabled circles
- **Note:** Separate from `unlimited5G`

### `unlimited5G`
- **Type:** `boolean`
- **Description:** Whether 5G data is truly unlimited
- **Values:**
  - `true` - Unlimited 5G data (no daily cap at 5G speeds)
  - `false` - 5G available but with same data caps as 4G
- **Impact:** Critical for heavy data users in 5G areas
- **Examples:**
  - `has5G: true, unlimited5G: true` - Best experience
  - `has5G: true, unlimited5G: false` - 5G with daily cap
  - `has5G: false, unlimited5G: false` - 4G only

### `ottSubscriptions`
Object containing OTT platform subscriptions:

#### `netflix`
- **Type:** `string | boolean | null`
- **Description:** Netflix subscription tier
- **Values:**
  - `"Mobile"` - Netflix Mobile plan (₹149/month standalone)
  - `true` - Netflix included (tier unspecified)
  - `null` - No Netflix
- **Example Plans:** ₹1299 plan includes Netflix Mobile

#### `amazonPrime`
- **Type:** `string | boolean | null`
- **Description:** Amazon Prime subscription tier
- **Values:**
  - `"Lite"` - Prime Lite (limited to mobile, ₹299/year)
  - `true` - Full Prime included
  - `null` - No Amazon Prime
- **Example Plans:** ₹1029 plan includes Prime Lite

#### `hotstar`
- **Type:** `boolean`
- **Description:** Disney+ Hotstar subscription
- **Values:**
  - `true` - JioHotstar Mobile or TV subscription included
  - `false` - No Hotstar
- **Details:** Usually "JioHotstar Mobile/TV subscription for 90 Days"
- **Note:** Most popular OTT benefit in Jio plans

#### `sonyliv`
- **Type:** `boolean`
- **Description:** Sony LIV subscription
- **Values:**
  - `true` - Sony LIV included
  - `false` - No Sony LIV
- **Use Case:** Sports and entertainment content

#### `zee5`
- **Type:** `boolean`
- **Description:** Zee5 subscription
- **Values:**
  - `true` - Zee5 Premium included
  - `false` - No Zee5

#### `jioTV`
- **Type:** `boolean`
- **Description:** JioTV live TV subscription
- **Values:**
  - `true` - JioTV access included
  - `false` - No JioTV
- **Content:** Live TV channels
- **Note:** Proprietary Jio service

#### `jioCinema`
- **Type:** `boolean`
- **Description:** JioCinema streaming service
- **Values:**
  - `true` - JioCinema access included
  - `false` - No JioCinema
- **Content:** Movies and shows

#### `jioSaavn`
- **Type:** `boolean`
- **Description:** JioSaavn music streaming
- **Values:**
  - `true` - JioSaavn Pro included
  - `false` - No JioSaavn
- **Content:** Music streaming platform

#### `fancode`
- **Type:** `boolean`
- **Description:** FanCode sports streaming
- **Values:**
  - `true` - FanCode subscription included
  - `false` - No FanCode
- **Content:** Live sports events

#### `discoveryPlus`
- **Type:** `boolean`
- **Description:** Discovery+ subscription
- **Values:**
  - `true` - Discovery+ included
  - `false` - No Discovery+

#### `sunNxt`
- **Type:** `boolean`
- **Description:** Sun NXT regional content platform
- **Values:**
  - `true` - Sun NXT included
  - `false` - No Sun NXT

#### `lionsgate`
- **Type:** `boolean`
- **Description:** Lionsgate Play subscription
- **Values:**
  - `true` - Lionsgate Play included
  - `false` - No Lionsgate

#### `hoichoi`
- **Type:** `boolean`
- **Description:** Hoichoi Bengali content platform
- **Values:**
  - `true` - Hoichoi included
  - `false` - No Hoichoi

### `planType`
Object containing plan type flags:

#### `planType.isJioPhone`
- **Type:** `boolean`
- **Description:** Plan designed for JioPhone feature phones
- **Values:**
  - `true` - JioPhone-specific plan
  - `false` - Regular smartphone plan
- **Usage:** Filter for JioPhone users

#### `planType.isDataPack`
- **Type:** `boolean`
- **Description:** Data-only add-on pack
- **Values:**
  - `true` - Add-on data booster
  - `false` - Full recharge plan
- **Note:** Data packs don't provide validity

#### `planType.isJioPhoneDataAddon`
- **Type:** `boolean`
- **Description:** Data add-on specifically for JioPhone
- **Values:**
  - `true` - JioPhone data add-on
  - `false` - Not a JioPhone add-on

#### `planType.isJioBharatPhone`
- **Type:** `boolean`
- **Description:** Plan for JioBharat (ultra-affordable) phones
- **Values:**
  - `true` - JioBharat-specific plan
  - `false` - Regular plan
- **Target:** Entry-level market segment

#### `planType.isGaming`
- **Type:** `boolean`
- **Description:** Gaming subscription plan
- **Values:**
  - `true` - JioGames Cloud subscription
  - `false` - Regular plan
- **Example:** ₹48 plan with 3-day gaming access
- **Benefits:** "500+ High Definition Premium Games", cloud gaming access

### `additionalBenefits`
- **Type:** `string[]`
- **Description:** Array of human-readable benefit descriptions
- **Examples:**
  ```json
  [
    "Free 50 GB JioAICloud storage",
    "JioHotstar Mobile/TV subscription for 90 Days"
  ]
  ```
  ```json
  [
    "JioGames Cloud Subscription for 3 Days",
    "500+ High Definition Premium Games",
    "Play on PC, Laptop, Mobile or Jio set-top box instantly"
  ]
  ```
  ```json
  [
    "Swiggy One Lite 3 months subscription",
    "₹50 cashback on subsequent recharge"
  ]
  ```
- **Common Benefits:**
  - **JioAICloud:** 50GB free cloud storage
  - **JioHotstar:** 90-day subscription (most common)
  - **Additional Data:** Bonus data beyond standard allocation
  - **Cashback:** Subsequent recharge cashback offers
  - **Swiggy One Lite:** Food delivery benefits
  - **Gaming:** JioGames Cloud access
- **Usage:** Displayed to users as extra perks

### `postFUPSpeed`
- **Type:** `string | null`
- **Description:** Internet speed after Fair Usage Policy exhausted
- **Common Values:**
  - `"64 Kbps"` - Standard post-FUP speed (0.064 Mbps)
  - `null` - Not applicable or no FUP
- **Examples:**
  - Most unlimited plans: `"64 Kbps"`
  - Gaming-only plans: `null`
- **Note:** At 64 Kbps, only basic browsing is viable

---

## Plan Types Explained

### 1. **Standard Recharge Plans**
- **Characteristics:**
  - All `planType` flags are `false`
  - `isUnlimited: true` for voice
  - Daily data allocation (2-2.5GB/day)
  - 100 SMS/day
  - 5G support in most cases
- **Example:**
  ```json
  {
    "id": "pop_349",
    "price": 349,
    "validityDays": 28,
    "dailyData": { "amount": 2.0 },
    "totalData": { "amount": 56.0 },
    "voice": { "isUnlimited": true, "minutes": null },
    "sms": { "dailyLimit": 100, "totalCount": null },
    "has5G": true,
    "unlimited5G": true,
    "ottSubscriptions": { "hotstar": true, "jioTV": true, ... },
    "planType": { "isJioPhone": false, "isDataPack": false, ... },
    "additionalBenefits": [
      "Free 50 GB JioAICloud storage",
      "JioHotstar Mobile/TV subscription for 90 Days"
    ],
    "postFUPSpeed": "64 Kbps"
  }
  ```

### 2. **Premium Entertainment Plans**
- **Characteristics:**
  - Netflix, Amazon Prime, or multiple OTT services
  - Higher price points (₹1029+)
  - Same data/voice benefits as standard plans
  - Longer validity (84 days typical)
- **Example:**
  ```json
  {
    "id": "pop_1299",
    "price": 1299,
    "validityDays": 84,
    "ottSubscriptions": {
      "netflix": "Mobile",
      "hotstar": true,
      "jioTV": true,
      ...
    },
    "additionalBenefits": [
      "Netflix Mobile subscription",
      "JioHotstar Mobile/TV subscription for 90 Days"
    ]
  }
  ```

### 3. **Annual Plans**
- **Characteristics:**
  - 365 days validity
  - Highest total data (912.5GB)
  - Best value per day (₹9.86/day for ₹3599 plan)
  - Premium OTT benefits
- **Example:**
  ```json
  {
    "id": "pop_3599",
    "price": 3599,
    "validityDays": 365,
    "dailyData": { "amount": 2.5 },
    "totalData": { "amount": 912.5 },
    "has5G": true,
    "unlimited5G": true
  }
  ```

### 4. **Gaming Plans**
- **Characteristics:**
  - `planType.isGaming: true`
  - No data or very minimal data
  - Short validity (3 days)
  - JioGames Cloud subscription
  - Low price (₹48)
- **Example:**
  ```json
  {
    "id": "pop_48",
    "price": 48,
    "validityDays": 3,
    "dailyData": null,
    "totalData": { "amount": 0.0 },
    "voice": { "isUnlimited": false, "minutes": null },
    "planType": { "isGaming": true, ... },
    "additionalBenefits": [
      "JioGames Cloud Subscription for 3 Days",
      "500+ High Definition Premium Games"
    ],
    "postFUPSpeed": null
  }
  ```

### 5. **Data-Only Add-On Packs**
- **Characteristics:**
  - `planType.isDataPack: true`
  - No voice/SMS benefits
  - Total data allocation (no daily quota)
  - May include OTT subscriptions
  - Validity: 30-90 days
- **Example:**
  ```json
  {
    "id": "pop_100",
    "price": 100,
    "validityDays": 90,
    "dailyData": null,
    "totalData": { "amount": 5.0 },
    "voice": { "isUnlimited": false, "minutes": null },
    "sms": { "dailyLimit": null, "totalCount": null },
    "planType": { "isDataPack": true, ... },
    "ottSubscriptions": { "hotstar": true, ... }
  }
  ```

### 6. **JioPhone Plans**
- **Characteristics:**
  - `planType.isJioPhone: true` or `planType.isJioPhoneDataAddon: true`
  - Tailored for feature phones
  - Lower data allocations
  - Basic OTT support (JioTV, JioCinema)

### 7. **JioBharat Plans**
- **Characteristics:**
  - `planType.isJioBharatPhone: true`
  - Ultra-affordable segment
  - Minimal data/voice
  - Entry-level pricing

---

## OTT Subscription Patterns

### Pattern 1: **Basic Jio Ecosystem**
```json
{
  "hotstar": true,
  "jioTV": true,
  "jioCinema": false,
  "jioSaavn": false,
  "others": false
}
```
- **Plans:** Most standard recharge plans (₹349-₹999)
- **Benefits:** JioHotstar + JioTV

### Pattern 2: **Premium Multi-OTT Bundle**
```json
{
  "netflix": "Mobile",
  "hotstar": true,
  "jioTV": true,
  "all_others": false
}
```
- **Plans:** ₹1299 plan
- **Benefits:** Netflix Mobile + JioHotstar + JioTV

### Pattern 3: **Ultra Premium Bundle**
```json
{
  "netflix": null,
  "amazonPrime": null,
  "hotstar": true,
  "sonyliv": true,
  "zee5": true,
  "jioTV": true
}
```
- **Plans:** ₹1049 plan
- **Benefits:** SonyLIV + Zee5 + JioHotstar + JioTV

### Pattern 4: **Prime Combo**
```json
{
  "amazonPrime": "Lite",
  "hotstar": true,
  "jioTV": true
}
```
- **Plans:** ₹1029 plan
- **Benefits:** Amazon Prime Lite + JioHotstar + JioTV

### Pattern 5: **No OTT**
```json
{
  "all_false": false
}
```
- **Plans:** Budget plans, add-on packs
- **Focus:** Basic connectivity

---

## Data Allocation Patterns

### Pattern 1: **Daily Quota Standard**
```json
{
  "dailyData": { "amount": 2.0 },
  "totalData": { "amount": 56.0 }
}
```
- **Plans:** 28-day standard plans
- **Calculation:** 2GB/day × 28 days = 56GB
- **Usage:** Data resets daily at midnight

### Pattern 2: **Daily Quota Premium**
```json
{
  "dailyData": { "amount": 2.5 },
  "totalData": { "amount": 912.5 }
}
```
- **Plans:** 365-day annual plans
- **Calculation:** 2.5GB/day × 365 days = 912.5GB
- **Usage:** Best for heavy daily users

### Pattern 3: **Total Allocation (No Daily Cap)**
```json
{
  "dailyData": null,
  "totalData": { "amount": 5.0 }
}
```
- **Plans:** Add-on data packs
- **Usage:** Flexible consumption, no daily reset
- **Example:** 5GB usable anytime within validity

### Pattern 4: **No Data (Gaming/Voice-Only)**
```json
{
  "dailyData": null,
  "totalData": { "amount": 0.0 }
}
```
- **Plans:** Gaming subscriptions
- **Purpose:** Non-data services

---

## 5G Implementation

Jio has the most comprehensive 5G flags:

### Scenario 1: **Full 5G with Unlimited**
```json
{
  "has5G": true,
  "unlimited5G": true,
  "dailyData": { "amount": 2.5 }
}
```
- **Meaning:** 2.5GB/day at full 5G speeds, then unlimited 5G (no throttle)
- **Best:** For 5G areas with heavy usage

### Scenario 2: **5G with FUP**
```json
{
  "has5G": true,
  "unlimited5G": false,
  "dailyData": { "amount": 2.0 },
  "postFUPSpeed": "64 Kbps"
}
```
- **Meaning:** 2GB/day at 5G speeds, then throttled to 64 Kbps
- **Standard:** Most plans

### Scenario 3: **4G Only**
```json
{
  "has5G": false,
  "unlimited5G": false
}
```
- **Meaning:** 4G network only
- **Plans:** Budget/legacy plans

---

## Normalization for Application

The application converts Jio plans:

```typescript
static normalizeJioPlan(plan: JioPlan): NormalizedPlan {
  // Extract OTT services from object to array
  const ottServices = Object.entries(plan.ottSubscriptions)
    .filter(([_, enabled]) => enabled === true)
    .map(([service, _]) => service);

  const totalData = plan.totalData?.amount ||
    (plan.dailyData ? plan.dailyData.amount * plan.validityDays : null);

  return {
    id: plan.id,
    operator: 'jio',
    price: plan.price,
    validity: plan.validityDays,
    data: {
      isUnlimited: plan.unlimited5G,
      perDay: plan.dailyData?.amount || null,
      total: totalData,
    },
    voice: {
      isUnlimited: plan.voice.isUnlimited,
      minutes: plan.voice.minutes,
    },
    sms: {
      perDay: plan.sms.dailyLimit,
      total: plan.sms.totalCount,
    },
    fiveG: plan.has5G,
    ottServices,
    pricePerDay: plan.price / plan.validityDays,
    pricePerGB: calculatePricePerGB(plan),
  };
}
```

---

## Key Insights for Developers

### Complexity
- **Most complex schema** among all operators
- Rich metadata (additional benefits, plan types)
- Boolean-heavy OTT subscriptions object

### 5G Leadership
- Only operator with `unlimited5G` flag
- Extensive 5G coverage across plans
- Clear distinction between 5G access and unlimited 5G

### Jio Ecosystem
- Proprietary services: JioTV, JioCinema, JioSaavn, JioAICloud
- Tight integration with Jio apps
- Gaming platform (JioGames Cloud)

### Plan Segmentation
- Dedicated flags for JioPhone, JioBharat, Gaming
- Easy filtering by use case
- Clear separation of add-ons vs full plans

### OTT Strategy
- Partnerships: Netflix, Amazon Prime, Disney+ Hotstar
- Proprietary platforms dominate bundle
- 90-day Hotstar subscription standard across many plans

### Validation Rules
1. If `dailyData` is present, `totalData` should be calculated
2. If `unlimited5G: true`, then `has5G` must be `true`
3. OTT values are `true`/`false` except `netflix` and `amazonPrime` (can be strings)
4. If `planType.isGaming: true`, expect `totalData.amount: 0.0`
5. `additionalBenefits` array should not be empty for premium plans
6. `postFUPSpeed` is `"64 Kbps"` for most plans with data

---

## Example Complete Plan

```json
{
  "id": "pop_1029",
  "price": 1029,
  "validityDays": 84,
  "dailyData": {
    "amount": 2.0
  },
  "totalData": {
    "amount": 168.0
  },
  "voice": {
    "isUnlimited": true,
    "minutes": null
  },
  "sms": {
    "dailyLimit": 100,
    "totalCount": null
  },
  "has5G": true,
  "unlimited5G": true,
  "ottSubscriptions": {
    "netflix": null,
    "amazonPrime": "Lite",
    "hotstar": true,
    "sonyliv": false,
    "zee5": false,
    "jioTV": true,
    "jioCinema": false,
    "jioSaavn": false,
    "fancode": false,
    "discoveryPlus": false,
    "sunNxt": false,
    "lionsgate": false,
    "hoichoi": false
  },
  "planType": {
    "isJioPhone": false,
    "isDataPack": false,
    "isJioPhoneDataAddon": false,
    "isJioBharatPhone": false,
    "isGaming": false
  },
  "additionalBenefits": [
    "Free 50 GB JioAICloud storage",
    "Amazon Prime Lite subscription for 84 days",
    "JioHotstar Mobile/TV subscription for 90 Days"
  ],
  "postFUPSpeed": "64 Kbps"
}
```

**What this plan offers:**
- ₹1029 for 84 days (quarterly)
- 2GB/day high-speed data (168GB total)
- Unlimited 5G (truly unlimited, no throttle)
- Unlimited all-India calling
- 100 SMS per day
- Amazon Prime Lite (84 days)
- JioHotstar Mobile/TV (90 days)
- JioTV access
- 50GB JioAICloud storage
- Post-FUP: 64 Kbps

---

## Database Statistics

- **Total Plans:** 120+ (largest database)
- **Price Range:** ₹48 - ₹3599
- **Validity Range:** 3 days to 365 days
- **5G Plans:** 90%+ (industry leading)
- **Unlimited 5G Plans:** 80%+
- **Plans with OTT:** 95%+ (JioTV/Hotstar common)
- **Gaming Plans:** 1-2 (specialized)
- **JioPhone Plans:** 5-10 (legacy support)

---

## Notes for Developers

1. **OTT Object:** Boolean-heavy object, not array. Convert to array when needed
2. **Netflix/Prime Tiers:** Can be `string | boolean | null` - handle all types
3. **Plan Type Flags:** Use for filtering/categorization
4. **5G Distinction:** `has5G` ≠ `unlimited5G` - check both
5. **Daily Data Calc:** `totalData` often equals `dailyData × validityDays`
6. **Additional Benefits:** Parse for display, rich user-facing content
7. **Post-FUP Speed:** Always `"64 Kbps"` or `null`, never varies
8. **ID Format:** `pop_` prefix common but not universal
9. **JioAICloud:** Mentioned in benefits, not separate field
10. **Validity:** Always in days, never months (use 28/84/365 for monthly/quarterly/annual)

---

## Changelog & Version Info

- **Last Updated:** Based on current database snapshot
- **Schema Version:** 2.0 (Mature, with 5G enhancements)
- **Breaking Changes:** None expected - schema stable
- **5G Support:** Fully integrated (industry first)
