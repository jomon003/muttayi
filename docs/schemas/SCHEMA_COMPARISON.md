# Indian Telecom Operators: Complete JSON Schema Comparison

## Overview
This document provides a comprehensive comparison of JSON schemas across all four major Indian telecom operators supported by the Muttayi Mobile Plan Finder application.

**Operators Covered:**
1. **Airtel** (Bharti Airtel Limited)
2. **Jio** (Reliance Jio Infocomm Limited)
3. **BSNL** (Bharat Sanchar Nigam Limited)
4. **Vi** (Vodafone Idea Limited)

---

## Quick Reference Table

| Feature | Airtel | Jio | BSNL | Vi |
|---------|--------|-----|------|-----|
| **Database Size** | 68 plans | 120+ plans | 250+ plans | 500+ plans |
| **Lines of Code** | 1,973 | 3,177 | 5,996 | 15,835 |
| **Schema Complexity** | ⭐ Simple | ⭐⭐⭐ Complex | ⭐⭐⭐⭐ Very Complex | ⭐⭐⭐⭐⭐ Most Complex |
| **Root Structure** | Flat array | Wrapped object | Flat array | Flat array |
| **Circle Filtering** | ✅ Yes (22 circles, since 2026-10) | ❌ No | ✅ Yes (38 circles) | ✅ Yes (23 circles) |
| **5G Support** | ✅ Yes | ✅ Yes (unlimited5G) | ❌ No | ⚠️ Limited |
| **OTT Bundles** | ✅ Yes (array) | ✅ Yes (object) | ❌ No | ✅ Yes (object) |
| **Freebies Validity** | ❌ No | ❌ No | ✅ Yes (critical) | ✅ Yes (usually same) |
| **Night Data** | ❌ No | ❌ No | ❌ No | ✅ Yes (unique) |
| **Backup Data** | ❌ No | ❌ No | ❌ No | ✅ Yes (unique) |
| **Weekend Rollover** | ❌ No | ❌ No | ❌ No | ✅ Yes (unique) |
| **Special Plans** | ❌ No | ⚠️ Gaming/JioPhone | ✅ GP2/JK20 | ❌ No |
| **Entertainment Platform** | Xstream Play | JioTV/Cinema | ❌ No | Vi Movies & TV |
| **Price Range** | ₹11 - ₹3999 | ₹48 - ₹3599 | ₹107 - ₹2399 | ₹99 - ₹3599 |
| **Max Validity** | 365 days | 365 days | 395 days | 365 days |
| **Voice Coverage Detail** | Low | Medium | High | High |
| **SMS Roaming Info** | ❌ No | ❌ No | ✅ Yes | ❌ No |

---

## Database Structure Comparison

### Airtel: Flat Simple Array
```json
[
  {
    "planId": "1",
    "price": 451,
    "category": "Data",
    "validity": { "days": 30, "unit": "Calendar Day(s)" },
    "data": { "isUnlimited": false, ... },
    "voice": { "isUnlimited": false, ... },
    "sms": { "perDay": null, "total": null },
    "isAddOn": true,
    "ott": { "isIncluded": true, "services": [...] }
  }
]
```
**Characteristics:**
- Simplest structure
- No nesting beyond 2 levels
- Direct field access
- OTT as simple object with array

### Jio: Wrapped with Rich Metadata
```json
{
  "plans": [
    {
      "id": "pop_100",
      "price": 100,
      "validityDays": 90,
      "dailyData": { "amount": 5.0 },
      "ottSubscriptions": { "netflix": null, "hotstar": true, ... },
      "planType": { "isJioPhone": false, "isGaming": false, ... },
      "additionalBenefits": [ "JioAICloud", ... ],
      "has5G": false,
      "unlimited5G": false
    }
  ]
}
```
**Characteristics:**
- Wrapped in `plans` object
- Rich boolean-heavy `ottSubscriptions`
- Dedicated `planType` flags
- 5G distinction (has5G vs unlimited5G)
- Human-readable `additionalBenefits`

### BSNL: Circle-Based with Special Conditions
```json
[
  {
    "plan_details": {
      "planName": "PV-2399",
      "price": 2399,
      "validity": { "days": 395, "isCalendarMonth": false },
      "data": { "dailyLimit": { "amount": 2, "unit": "GB" }, ... },
      "voice": {
        "coverage": {
          "local": true,
          "std": true,
          "mtnlIncluded": true
        }
      },
      "specialConditions": { "isGP2": false, "isJK20": false },
      "freebiesValidity": { "days": 395, "isSameAsPlanValidity": true }
    },
    "available_circles": ["AP", "AR", ...]
  }
]
```
**Characteristics:**
- Nested `plan_details` wrapper
- Most detailed voice coverage
- Special conditions (GP2, JK20, inactive customers)
- **Freebies validity** (unique concept)
- Circle availability array

### Vi: Most Complex with Unique Features
```json
[
  {
    "plan_details": {
      "category": "popular packs",
      "planName": "STV_859",
      "data": {
        "nightData": {
          "isUnlimited": true,
          "timings": { "from": "00:00", "to": "12:00" }
        },
        "backupData": { "amount": 2, "unit": "GB", "frequency": "monthly" },
        "weekendRollover": true
      },
      "voice": {
        "nightCalling": { "timings": {...}, "type": "..." }
      },
      "ottBenefits": { "services": [...], "details": "..." },
      "entertainment": {
        "type": "Vi Movies & TV",
        "tier": "Super",
        "features": { "ottApps": 16, "tvChannels": 400 }
      }
    },
    "available_circles": ["AP", "CN", ...]
  }
]
```
**Characteristics:**
- Deepest nesting (4+ levels)
- Most unique features (night data, backup, rollover)
- Entertainment tier system
- Night calling windows
- Most verbose (15,835 lines)

---

## Field Name Mapping

| Concept | Airtel | Jio | BSNL | Vi |
|---------|--------|-----|------|-----|
| **Plan ID** | `planId` | `id` | `planName` | `planName` |
| **Price** | `price` | `price` | `price` | `price` |
| **Validity** | `validity` | `validityDays` | `validity.days` | `validity.days` |
| **Daily Data** | `data.perDay` | `dailyData.amount` | `data.dailyLimit.amount` | `data.perDayData` |
| **Total Data** | `data.total` | `totalData.amount` | `data.totalLimit.amount` | `data.totalData` |
| **Unlimited Data** | `data.unlimited` | `unlimited5G` | `data.isUnlimited` | `data.isUnlimited` |
| **Unlimited Voice** | `voice.unlimited` | `voice.isUnlimited` | `voice.isUnlimited` | `voice.isUnlimited` |
| **Voice Minutes** | N/A | `voice.minutes` | `voice.minutes` | `voice.minutes` |
| **Daily SMS** | `sms.perDay` | `sms.dailyLimit` | `sms.dailyLimit` | `sms.perDay` |
| **5G Flag** | `fiveG` | `has5G` | N/A | `fiveG` |
| **OTT Services** | `ott.services` (array) | `ottSubscriptions` (object) | N/A | `ottBenefits.services` |
| **Post-FUP Speed** | N/A | `postFUPSpeed` | `data.postFUPSpeed` | `data.postFUPSpeed` |

---

## Data Allocation Patterns

### Airtel: Simple Dual Pattern
1. **Per Day:** `data.perDay: 2.0` + `data.isPerDay: true`
2. **Total:** `data.total: 50.0` + `data.isPerDay: false`
3. **Unlimited:** `data.unlimited: true`

### Jio: Three-Level Pattern
1. **Daily:** `dailyData: { amount: 2.0 }` + `totalData: { amount: 56.0 }`
2. **Total Only:** `dailyData: null` + `totalData: { amount: 5.0 }`
3. **Unlimited:** `unlimited5G: true`

### BSNL: Nested Object Pattern
1. **Daily:** `data.dailyLimit: { amount: 2, unit: "GB" }`
2. **Total:** `data.totalLimit: { amount: 600, unit: "GB" }`
3. **Unlimited:** `data.isUnlimited: true` (with possible daily cap)

### Vi: Most Comprehensive
1. **Per Day:** `data.perDayData: 1.5` + `data.isPerDay: true`
2. **Night Unlimited:** `data.nightData: { isUnlimited: true, timings: {...} }`
3. **Backup:** `data.backupData: { amount: 2, unit: "GB", frequency: "monthly" }`
4. **Weekend Rollover:** `data.weekendRollover: true`

---

## OTT Implementation Comparison

### Airtel: Simple Array
```json
{
  "ott": {
    "isIncluded": true,
    "services": [
      "Netflix Basic",
      "Amazon Prime Lite",
      "JioHotstar Mobile"
    ]
  }
}
```
**Pros:** Easy to parse, straightforward
**Cons:** No tier information (Basic, Lite, etc.)

### Jio: Boolean Object
```json
{
  "ottSubscriptions": {
    "netflix": "Mobile",
    "amazonPrime": "Lite",
    "hotstar": true,
    "sonyliv": true,
    "zee5": false,
    "jioTV": true,
    ...
  }
}
```
**Pros:** Easy filtering, tier info for premium services
**Cons:** Mixed types (boolean | string | null), large object

### BSNL: No OTT
```json
// No OTT field
```
**Note:** BSNL doesn't bundle OTT services

### Vi: Detailed Object + Entertainment
```json
{
  "ottBenefits": {
    "services": ["SonyLIV"],
    "details": "SonyLIV Mobile subscription for 28 days",
    "validityDays": 28
  },
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
**Pros:** Most detailed, proprietary platform info
**Cons:** Complex parsing, two separate OTT structures

---

## Unique Features by Operator

### Airtel Unique Features
1. **Simplest schema** - easiest to implement
2. **Add-on flag** - `isAddOn: boolean` (explicit)
3. **Entertainment category** - separate from other categories
4. **Hourly plans** - `validity.days: 0.04` (1 hour for ₹11)

### Jio Unique Features
1. **Plan type flags** - `planType.isJioPhone`, `isGaming`, `isJioBharat`
2. **Unlimited 5G distinction** - `has5G` vs `unlimited5G`
3. **Additional benefits array** - Human-readable perks
4. **JioAICloud storage** - 50GB cloud storage benefit
5. **Gaming plans** - JioGames Cloud subscriptions
6. **Swiggy integration** - Food delivery benefits

### BSNL Unique Features
1. **GP2 plans** - Government employee exclusive (`specialConditions.isGP2`)
2. **JK20 plans** - Jammu & Kashmir 20% discount (`specialConditions.isJK20`)
3. **Freebies validity** - Separate from plan validity (critical)
4. **MTNL coverage** - `voice.coverage.mtnlIncluded`
5. **SMS roaming** - `sms.isRoamingIncluded`
6. **Inactive customer plans** - `specialConditions.isForInactiveCustomers`
7. **Longest validity** - Up to 395 days (13 months)
8. **Post-freebies data** - 50MB/day after freebies expire

### Vi Unique Features
1. **Night unlimited data** - `data.nightData` (12AM-12PM)
2. **Backup data** - `data.backupData` (monthly safety net)
3. **Weekend rollover** - `data.weekendRollover` (unused data rolls to weekends)
4. **Night calling** - `voice.nightCalling` with timings
5. **Vi Movies & TV** - Proprietary entertainment platform
6. **Entertainment tiers** - Super, VIP with feature counts
7. **Post-quota tariff** - `data.postQuotaTariff`
8. **Talktime in plan** - `voice.talktime`

---

## Circle Availability

### Operators WITHOUT Circle Filtering
- **Jio:** Pan-India plans (no circle field)

### Airtel: 22 Circles (since 2026-10)
Top-level `available_circles: string[]` on every plan (same pattern as BSNL/Vi, but Airtel plans are flat — no `plan_details` wrapper). Codes: AP, AS, BH, DL, GJ, HR, HP, JK, KA, KL, KO, MH, MP, MU, NE, OD, PB, RJ, TN, UE, UW, WB (`src/constants/circles.ts` `AIRTEL_CIRCLES`). A plan that differs by circle (e.g. ₹449 is 4 GB/day in Delhi but no-cap in Kerala) appears as separate records with disjoint circle lists.

### Operators WITH Circle Filtering

#### BSNL: 38 Circles
```
AN, AP, AR, AS, BR, CH, CN, CT, DD, DN, GA, GJ, HP, HR,
JH, JK, KA, KL, KO, LD, MH, ML, MN, MP, MZ, NL, OR, PB,
PY, RJ, SK, TN, TR, TS, UE, UK, UW, WB
```
**Coverage:** Most comprehensive (includes smaller UTs like Lakshadweep)

#### Vi: 23 Circles
```
AP, AS, BH, CN, DL, GJ, HP, HR, JK, KA, KL, KO, MH, MP,
MU, NE, OD, PB, RJ, TN, UE, UW, WB (varies by plan)
```
**Coverage:** Major circles only (merged Vodafone + Idea footprint)

---

## Post-FUP Speed Comparison

| Operator | Post-FUP Speed | Field Name |
|----------|---------------|------------|
| **Airtel** | Not specified | N/A |
| **Jio** | 64 Kbps | `postFUPSpeed: "64 Kbps"` |
| **BSNL** | 40 Kbps | `data.postFUPSpeed: 40` |
| **Vi** | 64 Kbps | `data.postFUPSpeed: 64` |

**Note:** BSNL has slowest post-FUP speed but offers 50MB/day post-freebies for unlimited plans.

---

## Validity Comparison

| Operator | Minimum | Maximum | Special Cases |
|----------|---------|---------|---------------|
| **Airtel** | 0.04 days (1 hour) | 365 days | Hourly gaming pack |
| **Jio** | 3 days | 365 days | Gaming plans (3 days) |
| **BSNL** | 26 days | 395 days | Longest in industry (13 months) |
| **Vi** | 28 days | 365 days | Standard monthly+ |

---

## Price Range Comparison

| Operator | Budget Plans | Mid-Range | Premium | Max Price |
|----------|--------------|-----------|---------|-----------|
| **Airtel** | ₹11 - ₹100 | ₹199 - ₹549 | ₹600 - ₹1729 | ₹3999 |
| **Jio** | ₹48 - ₹100 | ₹349 - ₹899 | ₹999 - ₹1299 | ₹3599 |
| **BSNL** | ₹107 - ₹200 | ₹300 - ₹600 | ₹800 - ₹1999 | ₹2399 |
| **Vi** | ₹99 - ₹200 | ₹300 - ₹900 | ₹1000 - ₹2399 | ₹3599 |

**Best Value:** BSNL (₹2399 for 395 days = ₹6.07/day)

---

## Normalization Complexity

### Easiest to Normalize: Airtel
```typescript
// Minimal field mapping
{
  price: plan.price,
  validity: plan.validity,
  data: { isUnlimited: plan.data.unlimited, ... }
}
```

### Moderate: Jio
```typescript
// OTT object → array conversion
// totalData calculation from dailyData
```

### Complex: BSNL
```typescript
// Nested data.dailyLimit.amount extraction
// Freebies validity logic
// Special conditions filtering (GP2, JK20)
```

### Most Complex: Vi
```typescript
// Night data extraction
// Backup data parsing
// Weekend rollover flag
// Entertainment tier normalization
// Special features array construction
```

---

## Developer Implementation Guide

### When to Use Each Schema

#### Use Airtel Schema As Reference For:
- Simple plan structures
- Quick prototyping
- Minimal complexity requirements
- OTT service arrays

#### Use Jio Schema For:
- Plan type categorization
- 5G distinction requirements
- Boolean-based OTT filtering
- Additional benefits display

#### Use BSNL Schema For:
- Circle-based filtering
- Special condition handling
- Freebies validity logic
- Government scheme plans
- Detailed voice coverage

#### Use Vi Schema For:
- Advanced data features (night, backup, rollover)
- Entertainment platform integration
- Time-based benefits (night data/calling)
- Multi-source data allocation

---

## Common Pitfalls & Solutions

### Pitfall 1: Assuming Uniform Field Names
**Problem:** `dailyData` (Jio) vs `perDayData` (Vi) vs `perDay` (Airtel)
**Solution:** Use normalization layer (`PlanNormalizer` class)

### Pitfall 2: Boolean vs String OTT Values
**Problem:** Jio's `netflix: "Mobile"` vs `hotstar: true`
**Solution:**
```typescript
const isEnabled = value === true || typeof value === 'string';
```

### Pitfall 3: Ignoring Freebies Validity
**Problem:** Users expect benefits for full plan validity
**Solution:** Always check `freebiesValidity` for BSNL/Vi, display warnings

### Pitfall 4: Circle Filtering
**Problem:** Showing Airtel/BSNL/Vi plans without circle selection
**Solution:** Mandatory circle picker for Airtel/BSNL/Vi

### Pitfall 5: GP2/JK20 Plans Leaking
**Problem:** Showing exclusive plans to ineligible users
**Solution:**
```typescript
if (plan.isGP2Only && !preferences.isGP2) return 0; // Hide
```

### Pitfall 6: Night Data Misrepresentation
**Problem:** Counting night data in daily quota
**Solution:** Display separately: "1.5GB/day + Unlimited Night (12AM-12PM)"

---

## Schema Evolution & Future-Proofing

### Expected Changes

#### Airtel
- Possible 5G expansion (more `fiveG: true` plans)
- New OTT partnerships

#### Jio
- More gaming plans (`planType.isGaming`)
- Enhanced cloud storage benefits
- 5G everywhere (`unlimited5G: true` standard)

#### BSNL
- 5G launch (new `fiveG` field)
- Potential OTT partnerships
- More GP2/JK20 variants

#### Vi
- Expansion of entertainment tiers
- More night data offerings
- 5G rollout (`fiveG: true` more common)

### Future-Proof Recommendations
1. **Use TypeScript interfaces** - Catch schema changes at compile time
2. **Implement versioning** - Track schema versions in JSON
3. **Graceful degradation** - Handle missing fields elegantly
4. **Normalization layer** - Abstract operator differences
5. **Validation** - Use JSON Schema validators
6. **Logging** - Log unknown fields for detection

---

## Performance Considerations

### Database Size Impact
| Operator | Lines | Load Time (est.) | Memory (est.) |
|----------|-------|------------------|---------------|
| Airtel | 1,973 | 50ms | 100KB |
| Jio | 3,177 | 80ms | 150KB |
| BSNL | 5,996 | 150ms | 300KB |
| Vi | 15,835 | 400ms | 800KB |

**Recommendation:** Implement caching (as done in `PlanDataService.cache`)

### Parsing Complexity
- **Airtel:** O(n) - Simple flat structure
- **Jio:** O(n × k) - k = OTT services count
- **BSNL:** O(n × m) - m = available circles
- **Vi:** O(n × p) - p = nested feature extraction

---

## Testing Recommendations

### Test Cases Per Operator

#### Airtel
- [ ] Parse add-on vs full recharge plans
- [ ] Handle `validity.days: null` (add-ons)
- [ ] Parse OTT service arrays
- [ ] Handle fractional validity (0.04 days)

#### Jio
- [ ] Convert OTT object to array
- [ ] Handle mixed OTT types (string | boolean)
- [ ] Filter by plan type flags
- [ ] Calculate totalData from dailyData
- [ ] Handle gaming plans (0 data)

#### BSNL
- [ ] Filter by circle
- [ ] Handle GP2 plans (hide/show)
- [ ] Handle JK20 plans (circle-specific)
- [ ] Parse freebies validity warnings
- [ ] Extract nested data amounts (dailyLimit.amount)

#### Vi
- [ ] Parse night data timings
- [ ] Extract backup data
- [ ] Handle weekend rollover
- [ ] Parse entertainment tier features
- [ ] Build special features array

---

## Summary Matrix

|  | Airtel | Jio | BSNL | Vi |
|--|--------|-----|------|-----|
| **For Beginners** | ✅ Best | ⚠️ Moderate | ❌ Complex | ❌ Very Complex |
| **For 5G Users** | ✅ Good | ✅ Excellent | ❌ Not Available | ⚠️ Limited |
| **For Budget Users** | ⚠️ Moderate | ⚠️ Moderate | ✅ Excellent | ⚠️ Moderate |
| **For OTT Lovers** | ✅ Good | ✅ Excellent | ❌ None | ✅ Good |
| **For Data Hungry** | ⚠️ Moderate | ✅ Good | ⚠️ Moderate | ✅ Excellent (Night) |
| **For Government Employees** | ❌ No | ❌ No | ✅ GP2 Plans | ❌ No |
| **For Rural Areas** | ⚠️ Moderate | ✅ Good | ✅ Excellent | ⚠️ Limited |
| **Implementation Ease** | ✅ Easy | ⚠️ Moderate | ❌ Hard | ❌ Very Hard |

---

## Quick Start for New Developers

### Step 1: Start with Airtel
- Simplest schema
- Learn basic normalization
- Understand flat structure

### Step 2: Add Jio
- Learn object-to-array OTT conversion
- Handle plan type flags
- Implement 5G logic

### Step 3: Add BSNL
- Implement circle filtering
- Handle special conditions (GP2, JK20)
- Add freebies validity warnings

### Step 4: Add Vi
- Parse complex nested structures
- Handle unique features (night, backup, rollover)
- Implement entertainment tiers

---

## Useful Resources

### Schema Locations
- **Airtel:** `db/airtel_db.json`
- **Jio:** `db/jio_plans_db.json`
- **BSNL:** `db/bsnl_plans_db.json`
- **Vi:** `db/vi_plans_db.json`

### Type Definitions
- **All Operators:** `src/types/index.ts`
- **BSNL Specific:** `src/types/bsnl.ts`

### Normalization Logic
- **All Normalizers:** `src/utils/planService.ts`
  - `PlanNormalizer.normalizeAirtelPlan()`
  - `PlanNormalizer.normalizeJioPlan()`
  - `PlanNormalizer.normalizeBSNLPlan()`
  - `PlanNormalizer.normalizeVIPlan()`

### Filter Logic
- **Unified Filtering:** `src/utils/planService.ts` - `PlanFilter.filterPlans()`
- **Scoring Algorithm:** `PlanFilter.calculateMatchScore()`

---

## Conclusion

The four Indian telecom operators have vastly different JSON schemas, reflecting their distinct strategies:

- **Airtel:** Simplicity and ease of use
- **Jio:** Comprehensive metadata and 5G leadership
- **BSNL:** Government schemes and rural focus
- **Vi:** Maximum features and flexibility

The Muttayi application successfully normalizes these diverse schemas into a unified interface, providing users with a consistent experience across all operators while preserving operator-specific features.

**Key Takeaway:** Always use the normalization layer (`PlanNormalizer`) rather than directly accessing operator-specific fields. This ensures maintainability and allows for easy schema updates.
