# Vi (Vodafone Idea) Plan JSON Schema Documentation

## Overview
Vi (Vodafone Idea Limited) is one of India's largest private telecom operators formed by the merger of Vodafone India and Idea Cellular. The Vi database features the most complex schema among all operators, with sophisticated entertainment packages, night unlimited data, backup data, weekend rollover, and multi-tier OTT subscriptions.

**Database File:** `db/vi_plans_db.json`
**Total Plans:** 500+ plans (largest database by count)
**Unique Characteristics:**
- **Largest database** (15,835 lines - 3x larger than others)
- **Night Unlimited Data** (12AM-12PM) - unique to Vi
- **Backup Data** (monthly safety net)
- **Weekend Rollover** (unused data rolls over to weekends)
- **Entertainment Tiers** (Vi Movies & TV with Super/VIP tiers)
- **Detailed freebies validity** (separate from plan validity)
- **Night calling** windows with special tariffs
- **Circle-based availability** (23 circles)
- **Talktime benefits** in some plans
- Most granular data specification

---

## Root Structure

The Vi database is a **flat array** of plan objects with nested details:

```json
[
  {
    "plan_details": {
      "category": "popular packs",
      "planName": "STV_859",
      "price": 859,
      "noServiceValidity": false,
      "validity": { ... },
      "freebiesValidity": { ... },
      "data": {
        "nightData": { ... },
        "backupData": { ... },
        "weekendRollover": true,
        ...
      },
      "voice": {
        "nightCalling": { ... },
        ...
      },
      "sms": { ... },
      "ottBenefits": { ... },
      "entertainment": { ... }
    },
    "available_circles": ["AP", "CN", "GJ", ...]
  },
  ...
]
```

---

## Complete TypeScript Interface

```typescript
interface VIPlan {
  plan_details: {
    category: string;                                // Plan category
    planName: string;                                // Plan identifier (e.g., "STV_859")
    price: number;                                   // Plan price in INR (₹)
    noServiceValidity: boolean;                      // Whether plan provides service validity
    validity: {
      days: number;                                  // Plan validity in days
      unit: "Calendar Day(s)";                       // Always "Calendar Day(s)"
    };
    freebiesValidity: {
      days: number;                                  // Freebies validity in days
      unit: "Calendar Day(s)";                       // Always "Calendar Day(s)"
    };
    data: {
      isUnlimited: boolean;                          // Whether data is unlimited
      isPerDay: boolean;                             // Whether data is per day
      perDayData: number | null;                     // Daily data in GB
      totalData: number | null;                      // Total data in GB
      postFUPSpeed: number | null;                   // Speed after FUP in Kbps
      nightData: {                                   // UNIQUE TO VI
        isUnlimited: boolean;                        // Whether night data is unlimited
        timings: {
          from: string;                              // Start time (24h format)
          to: string;                                // End time (24h format)
        };
      } | null;
      backupData: {                                  // UNIQUE TO VI
        amount: number;                              // Backup data amount
        unit: "GB" | "MB";                           // Unit of measurement
        frequency: "monthly" | "weekly";             // How often provided
      } | null;
      weekendRollover?: boolean;                     // UNIQUE TO VI - unused data rolls to weekend
      postQuotaTariff?: number | null;               // Tariff per MB after quota
    };
    voice: {
      isUnlimited: boolean;                          // Whether calls are unlimited
      minutes: number | null;                        // Limited minutes
      coverage: string[];                            // Coverage types
      tariff: number | null;                         // Per-minute tariff
      nightCalling: {                                // UNIQUE TO VI
        timings: {
          from: string;                              // Start time
          to: string;                                // End time
        };
        type: string;                                // Type of night calling benefit
      } | null;
      talktime?: number;                             // Talktime balance in ₹
    };
    sms: {
      perDay: number | null;                         // Daily SMS limit
      total: number | null;                          // Total SMS
      charges: {
        local: number;                               // Local SMS charge per message
        std: number;                                 // STD SMS charge per message
      };
    };
    ottBenefits: {                                   // OTT subscription benefits
      services: string[];                            // List of OTT service names
      details: string;                               // Human-readable description
      validityDays: number;                          // OTT subscription validity
    } | null;
    entertainment: {                                 // Vi Movies & TV package
      type: string;                                  // Service name
      tier: string;                                  // Tier level (Super/VIP/etc)
      features: {
        ottApps: number;                             // Number of OTT apps included
        tvChannels: number;                          // Number of TV channels
        devices: string[];                           // Supported devices
      };
      validityDays?: number;                         // Entertainment validity
    } | null;
    fiveG?: boolean;                                 // 5G availability (optional field)
  };
  available_circles: string[];                       // Array of circle codes
}
```

---

## Field Descriptions

### `plan_details.category`
- **Type:** `string`
- **Description:** Plan classification
- **Values:**
  - `"popular packs"` - Most common recharge plans
  - `"unlimited packs"` - Truly unlimited data plans
  - `"data packs"` - Data-only add-ons
  - `"entertainment packs"` - OTT-focused plans
  - `"combo packs"` - Mixed benefits
  - Others (varies)
- **Usage:** Helps categorize plans for display

### `plan_details.planName`
- **Type:** `string`
- **Description:** Plan identifier
- **Format:** `STV_<price>` (Special Tariff Voucher)
- **Examples:**
  - `"STV_859"` - ₹859 STV plan
  - `"STV_349"` - ₹349 STV plan
  - `"STV_3599"` - ₹3599 annual plan
- **Usage:** Unique identifier and display name

### `plan_details.price`
- **Type:** `number`
- **Description:** Recharge amount in INR (₹)
- **Range:** ₹99 to ₹3599
- **Examples:** `859`, `349`, `2399`, `979`
- **Note:** Always whole numbers

### `plan_details.noServiceValidity`
- **Type:** `boolean`
- **Description:** Whether plan provides service validity
- **Values:**
  - `false` - Provides service validity (full recharge)
  - `true` - Does not provide validity (add-on pack)
- **Usage:** Determines if plan is standalone or add-on
- **Typically:** `false` for most plans

### `plan_details.validity`
Object containing plan validity:

#### `validity.days`
- **Type:** `number`
- **Description:** Total plan validity in calendar days
- **Range:** 28 days to 365 days
- **Common Values:** 28, 56, 84, 90, 180, 365
- **Examples:**
  - `28` - Monthly plans
  - `84` - Quarterly plans
  - `180` - Semi-annual
  - `365` - Annual

#### `validity.unit`
- **Type:** `"Calendar Day(s)"`
- **Description:** Unit of validity
- **Always:** `"Calendar Day(s)"`

### `plan_details.freebiesValidity`
Object containing freebies (benefits) validity:

#### `freebiesValidity.days`
- **Type:** `number`
- **Description:** Validity of data/voice/SMS benefits
- **Examples:**
  - `84` - Same as plan validity (common)
  - `28` - Shorter than plan validity (less common)
- **Critical:** Similar to BSNL, Vi has separate freebies validity
- **Typically:** Matches `validity.days` (most plans)

#### `freebiesValidity.unit`
- **Type:** `"Calendar Day(s)"`
- **Always:** `"Calendar Day(s)"`

### `plan_details.data`
**Most complex data object among all operators:**

#### `data.isUnlimited`
- **Type:** `boolean`
- **Description:** Whether data is marketed as unlimited
- **Values:**
  - `true` - Unlimited data (may have daily cap + night unlimited)
  - `false` - Limited data allocation

#### `data.isPerDay`
- **Type:** `boolean`
- **Description:** Whether data is allocated per day
- **Values:**
  - `true` - Daily quota (e.g., 1.5GB/day)
  - `false` - Total quota or truly unlimited

#### `data.perDayData`
- **Type:** `number | null`
- **Description:** Daily data allocation in GB
- **Range:** 1.5 GB to 2.0 GB (typical)
- **Examples:**
  - `1.5` - 1.5GB per day
  - `2.0` - 2GB per day
  - `null` - Not applicable

#### `data.totalData`
- **Type:** `number | null`
- **Description:** Total data for entire validity
- **Examples:**
  - `null` - Uses daily data or truly unlimited
  - Can be present even with `perDayData`

#### `data.postFUPSpeed`
- **Type:** `number | null`
- **Description:** Speed after Fair Usage Policy in Kbps
- **Common Value:** `64` - 64 Kbps
- **Examples:**
  - Most plans: `64 Kbps`
  - Some plans: `null`

#### `data.nightData` - **UNIQUE TO VI**
- **Type:** `object | null`
- **Description:** Unlimited data during night hours
- **Critical Feature:** Major selling point for Vi

##### `nightData.isUnlimited`
- **Type:** `boolean`
- **Description:** Whether night data is unlimited
- **Values:**
  - `true` - Unlimited data during night window
  - `false` - Not applicable

##### `nightData.timings.from`
- **Type:** `string`
- **Description:** Night data window start time
- **Format:** 24-hour format ("HH:MM")
- **Typical Value:** `"00:00"` (midnight)

##### `nightData.timings.to`
- **Type:** `string`
- **Description:** Night data window end time
- **Format:** 24-hour format ("HH:MM")
- **Typical Value:** `"12:00"` (noon)

**Example:**
```json
{
  "nightData": {
    "isUnlimited": true,
    "timings": {
      "from": "00:00",
      "to": "12:00"
    }
  }
}
```
**Meaning:** Unlimited data from 12 AM to 12 PM daily (12 hours)

**User Benefit:**
- Heavy downloads during night
- Streaming, backups, etc. without using daily quota
- Daily quota (e.g., 1.5GB) preserved for daytime use

#### `data.backupData` - **UNIQUE TO VI**
- **Type:** `object | null`
- **Description:** Safety net data when daily quota exhausted
- **Feature:** Ensures connectivity even after daily data ends

##### `backupData.amount`
- **Type:** `number`
- **Description:** Amount of backup data
- **Common Value:** `2` (2GB monthly)
- **Usage:** Emergency data pool

##### `backupData.unit`
- **Type:** `"GB" | "MB"`
- **Description:** Unit of measurement
- **Typical:** `"GB"`

##### `backupData.frequency`
- **Type:** `"monthly" | "weekly"`
- **Description:** How often backup data is provided
- **Typical:** `"monthly"`

**Example:**
```json
{
  "backupData": {
    "amount": 2,
    "unit": "GB",
    "frequency": "monthly"
  }
}
```
**Meaning:** 2GB backup data provided every month

**User Benefit:**
- If daily 1.5GB runs out, can dip into 2GB backup
- Resets monthly
- Provides peace of mind

#### `data.weekendRollover` - **UNIQUE TO VI**
- **Type:** `boolean` (optional)
- **Description:** Whether unused daily data rolls over to weekends
- **Values:**
  - `true` - Unused weekday data available on Sat/Sun
  - `false` or `undefined` - No rollover
- **Feature:** Maximizes data utilization

**Example Scenario:**
- Daily Quota: 1.5GB/day
- Monday: Used 1GB, 0.5GB unused
- Tuesday: Used 1.2GB, 0.3GB unused
- ...
- Saturday: 1.5GB + (0.5+0.3+... rollover) = Enhanced weekend quota

**User Benefit:**
- Heavy weekend streaming/gaming
- No wasted data
- Flexibility

#### `data.postQuotaTariff`
- **Type:** `number | null` (optional)
- **Description:** Charge per MB after daily quota exhausted
- **Examples:**
  - `null` - Not applicable or no charges
  - Numeric - Paisa per MB

### `plan_details.voice`
Object containing voice call benefits:

#### `voice.isUnlimited`
- **Type:** `boolean`
- **Description:** Whether voice calls are unlimited
- **Values:**
  - `true` - Unlimited calling
  - `false` - Limited or no calling

#### `voice.minutes`
- **Type:** `number | null`
- **Description:** Limited call minutes
- **Examples:**
  - `null` - Unlimited or no voice
  - Numeric - Total minutes for validity

#### `voice.coverage`
- **Type:** `string[]`
- **Description:** Types of calls covered
- **Common Values:**
  ```json
  ["local", "STD", "roaming"]  // All India
  ["local"]                     // Local only (rare)
  []                            // No voice benefit
  ```

#### `voice.tariff`
- **Type:** `number | null`
- **Description:** Per-minute call tariff (paisa/min)
- **Examples:**
  - `null` - Unlimited or not applicable
  - Numeric - Pay-per-minute rate

#### `voice.nightCalling` - **UNIQUE TO VI**
- **Type:** `object | null`
- **Description:** Special calling benefits during night hours

##### `nightCalling.timings`
- **Type:** `{ from: string, to: string }`
- **Description:** Night calling window
- **Example:**
  ```json
  {
    "from": "23:00",
    "to": "06:00"
  }
  ```

##### `nightCalling.type`
- **Type:** `string`
- **Description:** Type of night benefit
- **Examples:**
  - `"Unlimited"` - Unlimited night calls
  - `"Reduced tariff"` - Lower rates

#### `voice.talktime` (optional)
- **Type:** `number`
- **Description:** Talktime balance credited to account in rupees
- **Examples:**
  - `47` - ₹47 talktime
  - Can be used for pay-per-use services

### `plan_details.sms`
Object containing SMS benefits:

#### `sms.perDay`
- **Type:** `number | null`
- **Description:** Daily SMS quota
- **Common Values:**
  - `100` - Standard
  - `null` - No SMS or uses total

#### `sms.total`
- **Type:** `number | null`
- **Description:** Total SMS for entire validity
- **Examples:**
  - `null` - Uses daily quota
  - Numeric - Total count

#### `sms.charges`
Object specifying SMS charges:

##### `sms.charges.local`
- **Type:** `number`
- **Description:** Local SMS charge per message (rupees)
- **Common Value:** `1` - ₹1 per SMS
- **Usage:** If no SMS quota, this is charged

##### `sms.charges.std`
- **Type:** `number`
- **Description:** STD SMS charge per message (rupees)
- **Common Value:** `1.5` - ₹1.50 per SMS

### `plan_details.ottBenefits` - **OPTIONAL**
- **Type:** `object | null`
- **Description:** OTT streaming service subscriptions
- **Present in:** Select premium plans

#### `ottBenefits.services`
- **Type:** `string[]`
- **Description:** Array of OTT service names
- **Examples:**
  ```json
  ["SonyLIV"]
  ["Netflix", "Amazon Prime"]
  ["Zee5", "SonyLIV", "Voot"]
  ```

#### `ottBenefits.details`
- **Type:** `string`
- **Description:** Human-readable benefit description
- **Examples:**
  - `"SonyLIV Mobile subscription for 28 days"`
  - `"Netflix Basic + Amazon Prime for 84 days"`

#### `ottBenefits.validityDays`
- **Type:** `number`
- **Description:** OTT subscription validity in days
- **Examples:**
  - `28` - Monthly OTT
  - `84` - Quarterly OTT
  - May differ from plan validity

### `plan_details.entertainment` - **VI MOVIES & TV**
- **Type:** `object | null`
- **Description:** Vi's proprietary entertainment platform
- **Unique:** Vi's bundled content service

#### `entertainment.type`
- **Type:** `string`
- **Description:** Name of entertainment service
- **Common Value:** `"Vi Movies & TV"`

#### `entertainment.tier`
- **Type:** `string`
- **Description:** Subscription tier level
- **Values:**
  - `"Super"` - Mid-tier (16 OTT apps, 400 channels)
  - `"VIP"` - Premium tier (more content)
  - Others possible

#### `entertainment.features`
Object describing entertainment features:

##### `entertainment.features.ottApps`
- **Type:** `number`
- **Description:** Number of OTT apps included
- **Example:** `16` - 16 OTT platforms

##### `entertainment.features.tvChannels`
- **Type:** `number`
- **Description:** Number of live TV channels
- **Example:** `400` - 400 live channels

##### `entertainment.features.devices`
- **Type:** `string[]`
- **Description:** Supported devices
- **Examples:**
  ```json
  ["Mobile", "TV"]
  ["Mobile", "Tablet", "TV"]
  ```

#### `entertainment.validityDays` (optional)
- **Type:** `number`
- **Description:** Entertainment package validity
- **Examples:**
  - `84` days
  - `180` days

**Example:**
```json
{
  "entertainment": {
    "type": "Vi Movies & TV",
    "tier": "Super",
    "features": {
      "ottApps": 16,
      "tvChannels": 400,
      "devices": ["Mobile", "TV"]
    }
  }
}
```

### `plan_details.fiveG`
- **Type:** `boolean` (optional field)
- **Description:** Whether 5G is available
- **Values:**
  - `true` - 5G enabled
  - `false` or `undefined` - 4G only
- **Note:** Vi's 5G rollout is limited, field often absent

### `available_circles`
- **Type:** `string[]`
- **Description:** Telecom circles where plan is available
- **Vi Circles (23 total):**
  ```
  AP  - Andhra Pradesh        AS  - Assam              CN  - Chennai
  GJ  - Gujarat               HP  - Himachal Pradesh   HR  - Haryana
  JK  - Jammu & Kashmir       KA  - Karnataka          KL  - Kerala
  KO  - Kolkata               MP  - Madhya Pradesh     MH  - Maharashtra
  NE  - North East            OR  - Odisha             PB  - Punjab
  RJ  - Rajasthan             TN  - Tamil Nadu         UE  - UP East
  UW  - UP West               WB  - West Bengal        (varies)
  ```
- **Note:** Vi has fewer circles than BSNL (23 vs 36)
- **Usage:** Circle filtering required for Vi plans

---

## Plan Types Explained

### 1. **Popular Packs (Standard)**
Most common category with full benefits:
```json
{
  "category": "popular packs",
  "price": 859,
  "validity": { "days": 84 },
  "data": {
    "isPerDay": true,
    "perDayData": 1.5,
    "nightData": { "isUnlimited": true, "timings": { "from": "00:00", "to": "12:00" } },
    "backupData": { "amount": 2, "unit": "GB", "frequency": "monthly" },
    "weekendRollover": true
  },
  "voice": { "isUnlimited": true, "coverage": ["local", "STD", "roaming"] },
  "sms": { "perDay": 100 }
}
```
**Features:**
- Daily data + Night unlimited + Backup data
- Weekend rollover
- Unlimited calling
- 100 SMS/day

### 2. **Truly Unlimited Packs**
No daily data cap:
```json
{
  "category": "popular packs",
  "data": {
    "isUnlimited": true,
    "isPerDay": false,
    "perDayData": null,
    "totalData": null,
    "nightData": { "isUnlimited": true, ... }
  }
}
```
**Feature:** Truly unlimited 24/7 (subject to FUP)

### 3. **Entertainment Focused**
With Vi Movies & TV or OTT bundles:
```json
{
  "price": 2399,
  "ottBenefits": null,
  "entertainment": {
    "type": "Vi Movies & TV",
    "tier": "Super",
    "features": { "ottApps": 16, "tvChannels": 400, "devices": ["Mobile", "TV"] }
  }
}
```

### 4. **OTT Bundled Plans**
With external OTT subscriptions:
```json
{
  "price": 408,
  "ottBenefits": {
    "services": ["SonyLIV"],
    "details": "SonyLIV Mobile subscription for 28 days",
    "validityDays": 28
  }
}
```

---

## Unique Vi Features Explained

### Night Unlimited Data
**Timing:** 12 AM to 12 PM (midnight to noon)
**Benefit:** Unlimited data for 12 hours daily
**Use Cases:**
- Large downloads/updates during night
- 4K streaming while sleeping/morning
- Cloud backups
- Gaming patches

**Implementation:**
```typescript
if (plan.data.nightData && plan.data.nightData.isUnlimited) {
  displayNightUnlimitedBadge();
  // Show: "Unlimited Night Data (12AM-12PM)"
}
```

### Backup Data
**Typical:** 2GB per month
**Purpose:** Emergency data pool
**Use Case:** Daily quota exhausted, need urgent connectivity
**Resets:** Monthly

**Implementation:**
```typescript
if (plan.data.backupData) {
  displayBackupDataInfo(plan.data.backupData.amount, plan.data.backupData.frequency);
  // Show: "2GB Backup Data (Monthly)"
}
```

### Weekend Rollover
**Mechanism:** Unused weekday data rolls to Sat/Sun
**Benefit:** No wasted data, enhanced weekend quota
**Example:**
- Mon-Fri: 0.5GB unused each day = 2.5GB rollover
- Saturday: 1.5GB (daily) + 2.5GB (rollover) = 4GB available

**Implementation:**
```typescript
if (plan.data.weekendRollover === true) {
  displayWeekendRolloverBadge();
  // Show: "Weekend Data Rollover"
}
```

---

## Normalization for Application

```typescript
static normalizeVIPlan(plan: VIPlan, index: number): NormalizedPlan {
  const details = plan.plan_details;

  // Extract OTT services
  const ottServices: string[] = [];
  if (details.ottBenefits && details.ottBenefits.services) {
    ottServices.push(...details.ottBenefits.services);
  }

  // Build special features array
  const specialFeatures: string[] = [];
  if (details.data.nightData && details.data.nightData.isUnlimited) {
    specialFeatures.push('Unlimited Night Data');
  }
  if (details.data.backupData) {
    specialFeatures.push(`${details.data.backupData.amount}${details.data.backupData.unit} Backup Data`);
  }
  if (details.data.weekendRollover) {
    specialFeatures.push('Weekend Rollover');
  }

  return {
    id: `vi_${index}`,
    operator: 'vi',
    price: details.price,
    validity: details.validity.days,
    data: {
      isUnlimited: details.data.isUnlimited,
      perDay: details.data.perDayData,
      total: details.data.totalData,
      postFUPSpeed: details.data.postFUPSpeed || undefined,
    },
    voice: {
      isUnlimited: details.voice.isUnlimited,
      minutes: details.voice.minutes,
    },
    sms: {
      perDay: details.sms.perDay,
      total: details.sms.total,
    },
    fiveG: details.fiveG || false,
    ottServices,
    pricePerDay: details.price / details.validity.days,
    pricePerGB: calculatePricePerGB(plan),
    category: details.category,
    circles: plan.available_circles,
    specialFeatures,
  };
}
```

---

## Key Insights for Developers

### Complexity
- **Largest database** - 500+ plans, 15,835 lines
- **Most features** - Night data, backup data, weekend rollover, entertainment tiers
- **Most nested** - Deep object structures for data/voice

### Unique Selling Points
- Night unlimited data (12AM-12PM)
- Backup data safety net
- Weekend rollover (no wasted data)
- Vi Movies & TV entertainment platform
- Night calling windows

### Circle Dependency
- 23 Vi circles (fewer than BSNL's 36)
- Circle selection required
- Some plans limited to specific regions

### Entertainment Strategy
- Vi Movies & TV (proprietary platform)
- OTT partnerships (SonyLIV, Zee5, etc.)
- Multi-tier packages (Super, VIP)
- Device flexibility (Mobile, TV, Tablet)

### Data Flexibility
- Multiple data sources: Daily + Night + Backup
- Weekend rollover maximizes utilization
- Post-quota tariffs for pay-as-you-go

### Validation Rules
1. `nightData` timings should be valid 24h format
2. `backupData.amount` must be positive
3. `entertainment.features.ottApps` should match actual OTT count
4. If `weekendRollover: true`, expect `isPerDay: true`
5. `freebiesValidity.days` usually equals `validity.days` for Vi
6. `available_circles` array should not be empty
7. `sms.charges` always present (for post-quota SMS billing)

---

## Example Complete Plan

```json
{
  "plan_details": {
    "category": "popular packs",
    "planName": "STV_2399",
    "price": 2399,
    "noServiceValidity": false,
    "validity": {
      "days": 180,
      "unit": "Calendar Day(s)"
    },
    "freebiesValidity": {
      "days": 180,
      "unit": "Calendar Day(s)"
    },
    "data": {
      "isUnlimited": false,
      "isPerDay": true,
      "perDayData": 1.5,
      "totalData": null,
      "postFUPSpeed": 64,
      "nightData": {
        "isUnlimited": true,
        "timings": {
          "from": "00:00",
          "to": "12:00"
        }
      },
      "backupData": {
        "amount": 2,
        "unit": "GB",
        "frequency": "monthly"
      },
      "weekendRollover": true,
      "postQuotaTariff": null
    },
    "voice": {
      "isUnlimited": true,
      "minutes": null,
      "coverage": ["local", "STD", "roaming"],
      "tariff": null,
      "nightCalling": null
    },
    "sms": {
      "perDay": 100,
      "total": null,
      "charges": {
        "local": 1,
        "std": 1.5
      }
    },
    "ottBenefits": null,
    "entertainment": {
      "type": "Vi Movies & TV",
      "tier": "Super",
      "features": {
        "ottApps": 16,
        "tvChannels": 400,
        "devices": ["Mobile", "TV"]
      }
    }
  },
  "available_circles": [
    "AP", "CN", "GJ", "HR", "KA", "KL", "KO", "MP",
    "MH", "RJ", "TN", "UE", "UW", "WB"
  ]
}
```

**What this plan offers:**
- ₹2399 for 180 days (6 months)
- **1.5GB/day** high-speed data (270GB total)
- **Unlimited night data** (12AM-12PM) - Extra 12 hours daily
- **2GB backup data** (monthly safety net)
- **Weekend rollover** - Unused data rolls to weekends
- Unlimited all-India calling
- 100 SMS per day
- **Vi Movies & TV Super** - 16 OTT apps + 400 TV channels
- Available in 14 major circles
- ₹13.33 per day

**Effective Data:**
- Daytime: 1.5GB (12PM-12AM)
- Nighttime: Unlimited (12AM-12PM)
- Backup: 2GB/month emergency
- Weekend: Weekday rollover
- **Truly generous data offering**

---

## Database Statistics

- **Total Plans:** 500+ (largest)
- **Database Size:** 15,835 lines (3x larger than Airtel)
- **Price Range:** ₹99 - ₹3599
- **Validity Range:** 28 days to 365 days
- **Plans with Night Data:** 70%+
- **Plans with Backup Data:** 70%+
- **Plans with Weekend Rollover:** 60%+
- **Plans with Vi Movies & TV:** 30%+
- **Plans with OTT:** 20%+
- **5G Plans:** <5% (limited rollout)
- **Circle Availability:** 23 circles

---

## UI Display Recommendations

### Special Feature Badges
```typescript
// Night Unlimited
if (plan.data.nightData?.isUnlimited) {
  <Badge color="purple">
    Unlimited Night Data (12AM-12PM)
  </Badge>
}

// Backup Data
if (plan.data.backupData) {
  <Badge color="blue">
    {plan.data.backupData.amount}GB Backup Data
  </Badge>
}

// Weekend Rollover
if (plan.data.weekendRollover) {
  <Badge color="green">
    Weekend Data Rollover
  </Badge>
}

// Entertainment
if (plan.entertainment) {
  <Badge color="orange">
    {plan.entertainment.type} - {plan.entertainment.tier}
  </Badge>
}
```

### Data Display Strategy
```
Vi plans need special data display:
- "1.5GB/day + Unlimited Night Data + 2GB Backup"
- Show night data timings clearly
- Explain weekend rollover benefit
```

---

## Changelog & Version Info

- **Last Updated:** Based on current database snapshot
- **Schema Version:** 2.0 (Comprehensive with unique features)
- **Breaking Changes:** None expected
- **Unique Features:** Night data, backup data, weekend rollover (industry first)
- **5G Support:** Limited availability
- **Entertainment:** Vi Movies & TV proprietary platform
