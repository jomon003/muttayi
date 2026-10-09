# Telecom Operator JSON Schema Documentation

Welcome to the comprehensive JSON schema documentation for the Muttayi Mobile Plan Finder application. This documentation covers the data structures for all four major Indian telecom operators: **Airtel**, **Jio**, **BSNL**, and **Vi**.

---

## 📚 Documentation Structure

This documentation suite consists of five files:

### 1. **Individual Operator Schemas**
Detailed documentation for each operator's unique JSON structure:

- **[AIRTEL_SCHEMA.md](./AIRTEL_SCHEMA.md)** - Bharti Airtel Limited
  - Simplest schema among all operators
  - Focus on data packs and entertainment bundles
  - ~47 plans (2026-07 refresh)
  - 5G support, OTT partnerships

- **[JIO_SCHEMA.md](./JIO_SCHEMA.md)** - Reliance Jio Infocomm Limited
  - Most comprehensive metadata
  - Industry-leading 5G with `unlimited5G` distinction
  - ~74 plans (2026-07 refresh)
  - Plan type flags, JioAICloud, gaming subscriptions

- **[BSNL_SCHEMA.md](./BSNL_SCHEMA.md)** - Bharat Sanchar Nigam Limited
  - Circle-based regional plans (38 circles)
  - GP2 (Government employees) and JK20 (Jammu & Kashmir) special plans
  - Unique "freebies validity" concept
  - ~49 plans (2026-07 refresh)
  - Longest validity (up to 395 days)

- **[VI_SCHEMA.md](./VI_SCHEMA.md)** - Vodafone Idea Limited
  - Most complex schema with unique features
  - Night unlimited data (12AM-12PM)
  - Backup data and weekend rollover
  - ~204 plans (2026-07 refresh, largest database)
  - Vi Movies & TV entertainment platform

### 2. **Master Comparison Document**
- **[SCHEMA_COMPARISON.md](./SCHEMA_COMPARISON.md)** - Complete Cross-Operator Analysis
  - Side-by-side feature comparison
  - Field name mapping across operators
  - Implementation guides and best practices
  - Common pitfalls and solutions
  - Performance considerations

---

## 🚀 Quick Start

### For Developers New to the Codebase

1. **Start Here:** Read [SCHEMA_COMPARISON.md](./SCHEMA_COMPARISON.md) for an overview
2. **Pick an Operator:** Start with [AIRTEL_SCHEMA.md](./AIRTEL_SCHEMA.md) (simplest)
3. **Deep Dive:** Progressively explore Jio → BSNL → Vi schemas
4. **Reference:** Keep comparison doc open for field mappings

### For Implementing a New Operator

1. **Study Existing:** Review normalization logic in [AIRTEL_SCHEMA.md](./AIRTEL_SCHEMA.md)
2. **Map Fields:** Use comparison table in [SCHEMA_COMPARISON.md](./SCHEMA_COMPARISON.md)
3. **Create Normalizer:** Follow pattern in `src/utils/planService.ts`
4. **Test Thoroughly:** See testing recommendations in comparison doc

### For Updating Existing Schemas

1. **Identify Changes:** Compare new JSON with documented schema
2. **Update Type Definitions:** Modify `src/types/index.ts`
3. **Update Normalizer:** Adjust `PlanNormalizer` methods
4. **Update Documentation:** Keep schema docs in sync

---

## 📋 What Each Document Covers

### Individual Schema Documents Include:

- **Complete TypeScript Interface** - Full type definitions
- **Field-by-Field Descriptions** - Meaning, examples, and usage
- **Plan Categories Explained** - Different plan types and patterns
- **Data Allocation Patterns** - How data is structured
- **Normalization Logic** - How to convert to unified format
- **Key Insights** - Developer tips and gotchas
- **Validation Rules** - What to check when parsing
- **Example Complete Plans** - Real-world JSON samples
- **Database Statistics** - Size, range, and coverage info

### Comparison Document Includes:

- **Quick Reference Table** - Feature matrix across all operators
- **Database Structure Comparison** - Root structure differences
- **Field Name Mapping** - Cross-operator field equivalents
- **Unique Features** - Operator-specific innovations
- **Circle Availability** - Regional coverage details
- **Implementation Guide** - When to use each schema
- **Performance Considerations** - Load times and optimization
- **Testing Recommendations** - Test cases per operator

---

## 🎯 Key Concepts

### 1. Normalization Layer
All four operators have different JSON schemas. The application uses a **normalization layer** (`PlanNormalizer` class) to convert operator-specific plans to a unified `NormalizedPlan` interface.

**Never access raw operator fields directly** - always go through the normalizer.

### 2. Operator-Specific Features

Each operator has unique selling points reflected in their schema:

| Operator | Unique Features |
|----------|----------------|
| **Airtel** | Simplest structure, entertainment category |
| **Jio** | Plan type flags, unlimited 5G, JioAICloud |
| **BSNL** | GP2/JK20 plans, freebies validity, 34 circles |
| **Vi** | Night data, backup data, weekend rollover |

### 3. Circle-Based Filtering

**BSNL** and **Vi** require circle selection:
- BSNL: 34 circles (most comprehensive)
- Vi: 23 circles (major markets)
- Airtel/Jio: No circle filtering (pan-India)

### 4. Special Conditions

**BSNL** has special eligibility plans:
- **GP2:** Government Phase 2 employees only
- **JK20:** Jammu & Kashmir residents (20% discount)

**Jio** has device-specific plans:
- **JioPhone:** Feature phone plans
- **JioBharat:** Ultra-affordable segment
- **Gaming:** JioGames Cloud subscriptions

### 5. OTT Implementation Varies

- **Airtel:** Simple array in `ott.services`
- **Jio:** Boolean object with 13+ service flags
- **BSNL:** No OTT bundles
- **Vi:** Separate `ottBenefits` + `entertainment` objects

### 6. Data Complexity Increases

From simplest to most complex data structures:
1. **Airtel:** `perDay` OR `total`
2. **Jio:** `dailyData` + `totalData`
3. **BSNL:** `dailyLimit` + `totalLimit` + freebies validity
4. **Vi:** `perDayData` + `nightData` + `backupData` + `weekendRollover`

---

## 🔧 Technical Reference

### Database File Locations
```
db/
├── airtel_db.json      # 1,973 lines, 68 plans
├── jio_plans_db.json   # 3,177 lines, 120+ plans
├── bsnl_plans_db.json  # 5,996 lines, 250+ plans
└── vi_plans_db.json    # 15,835 lines, 500+ plans
```

### Type Definition Files
```
src/types/
├── index.ts            # All operator interfaces
└── bsnl.ts            # BSNL-specific types
```

### Normalization Logic
```
src/utils/planService.ts
├── PlanNormalizer class
│   ├── normalizeAirtelPlan()
│   ├── normalizeJioPlan()
│   ├── normalizeBSNLPlan()
│   └── normalizeVIPlan()
├── PlanFilter class
│   ├── filterPlans()
│   ├── calculateMatchScore()
│   └── sortResults()
└── PlanDataService class
    └── loadOperatorPlans()
```

---

## 📊 Statistics at a Glance

| Metric | Airtel | Jio | BSNL | Vi | Total |
|--------|--------|-----|------|-----|-------|
| **Plans** | 68 | 120+ | 250+ | 500+ | ~940 |
| **Lines** | 1,973 | 3,177 | 5,996 | 15,835 | 26,981 |
| **Complexity** | ⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | - |
| **Min Price** | ₹11 | ₹48 | ₹107 | ₹99 | ₹11 |
| **Max Price** | ₹3,999 | ₹3,599 | ₹2,399 | ₹3,599 | ₹3,999 |
| **Max Validity** | 365 | 365 | 395 | 365 | 395 |
| **5G Support** | ✅ | ✅ | ❌ | ⚠️ | 3/4 |
| **OTT Bundles** | ✅ | ✅ | ❌ | ✅ | 3/4 |
| **Circle Filter** | ❌ | ❌ | ✅ | ✅ | 2/4 |

---

## 🎓 Learning Path

### Beginner (Week 1)
- [ ] Read [SCHEMA_COMPARISON.md](./SCHEMA_COMPARISON.md) overview
- [ ] Study [AIRTEL_SCHEMA.md](./AIRTEL_SCHEMA.md) completely
- [ ] Implement Airtel plan parsing
- [ ] Test with `normalizeAirtelPlan()`

### Intermediate (Week 2)
- [ ] Study [JIO_SCHEMA.md](./JIO_SCHEMA.md)
- [ ] Understand OTT object-to-array conversion
- [ ] Implement Jio plan type filtering
- [ ] Test 5G logic

### Advanced (Week 3-4)
- [ ] Study [BSNL_SCHEMA.md](./BSNL_SCHEMA.md)
- [ ] Implement circle-based filtering
- [ ] Handle GP2/JK20 special conditions
- [ ] Add freebies validity warnings

### Expert (Week 4-5)
- [ ] Study [VI_SCHEMA.md](./VI_SCHEMA.md)
- [ ] Parse complex nested structures
- [ ] Implement night data, backup data, rollover
- [ ] Handle entertainment tier system

---

## 🛠️ Common Development Tasks

### Task: Add a New Plan to Database
1. Determine operator
2. Follow schema structure from relevant doc
3. Validate against TypeScript interface
4. Test normalization
5. Update statistics in docs

### Task: Add a New Operator
1. Create JSON database following existing patterns
2. Define TypeScript interface in `src/types/index.ts`
3. Create normalizer method in `src/utils/planService.ts`
4. Add operator to constants
5. Document schema in new MD file
6. Update comparison document

### Task: Debug Parsing Issue
1. Check raw JSON structure
2. Compare with schema documentation
3. Verify normalizer logic
4. Check TypeScript types
5. Test with console logs
6. Update docs if schema changed

### Task: Update Filter Logic
1. Review `calculateMatchScore()` method
2. Understand preference-to-plan matching
3. Add new preference type
4. Update scoring algorithm
5. Test with edge cases

---

## 🧪 Testing Guidelines

### Unit Tests Should Cover:
- [ ] Normalization for each operator
- [ ] OTT extraction/conversion
- [ ] Circle filtering (BSNL, Vi)
- [ ] Special conditions (GP2, JK20)
- [ ] Data allocation parsing
- [ ] Edge cases (null values, missing fields)

### Integration Tests Should Cover:
- [ ] End-to-end plan loading
- [ ] Filter application
- [ ] Sorting by different criteria
- [ ] Circle + operator combinations
- [ ] Match score accuracy

### Example Test Case:
```typescript
describe('BSNL Normalization', () => {
  it('should handle freebies validity correctly', () => {
    const plan = /* BSNL plan with separate freebies */;
    const normalized = PlanNormalizer.normalizeBSNLPlan(plan, 0);
    expect(normalized.freebiesValidity).toBe(30);
    expect(normalized.validity).toBe(150);
  });
});
```

---

## 📝 Documentation Maintenance

### When to Update These Docs:

1. **Operator adds new field** → Update relevant schema MD + comparison
2. **Plan structure changes** → Update TypeScript interface + schema MD
3. **New operator added** → Create new schema MD + update comparison
4. **Normalization logic changes** → Update all affected schema docs
5. **Feature added** → Update comparison table

### Documentation Review Checklist:
- [ ] TypeScript interfaces match JSON structure
- [ ] Examples are from actual database
- [ ] Field descriptions are accurate
- [ ] Comparison table is up to date
- [ ] Code snippets are syntactically correct
- [ ] Statistics reflect current database

---

## 🤝 Contributing

### Adding to Documentation:
1. Follow existing format and tone
2. Include code examples
3. Provide real JSON samples
4. Update comparison matrix
5. Test code snippets
6. Use consistent terminology

### Reporting Issues:
- Schema mismatch between docs and JSON
- Incorrect type definitions
- Outdated examples
- Missing features
- Unclear explanations

---

## 📞 Support & Resources

### Internal Resources:
- **Source Code:** `src/utils/planService.ts`
- **Type Definitions:** `src/types/index.ts`
- **Component Usage:** `src/pages/PlansPage.tsx`
- **Filter UI:** `src/components/filters/PlanFilters.tsx`

### External References:
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [JSON Schema Specification](https://json-schema.org/)
- Operator official websites (for plan verification)

---

## 🎯 Best Practices

### Do's ✅
- Always use `PlanNormalizer` for operator data access
- Handle optional fields gracefully
- Validate data before normalization
- Keep documentation in sync with code
- Use TypeScript for type safety
- Test edge cases (null, undefined, empty arrays)

### Don'ts ❌
- Don't access raw operator fields directly in UI
- Don't assume all fields are present
- Don't hardcode operator-specific logic outside normalizers
- Don't skip circle filtering for BSNL/Vi
- Don't show GP2/JK20 plans without user opt-in
- Don't ignore freebies validity for BSNL

---

## 📈 Schema Evolution

### Recent Changes (tracked):
- **Jio:** Added `unlimited5G` flag (v2.0)
- **Vi:** Added `weekendRollover` field (v1.5)
- **BSNL:** Added `isJK20` special condition (v1.4)
- **All:** Standardized `postFUPSpeed` field

### Upcoming Changes (anticipated):
- **BSNL:** 5G launch (new `fiveG` field expected)
- **Vi:** More 5G plans (`fiveG: true` more common)
- **Jio:** Enhanced gaming plan metadata
- **Airtel:** Potential OTT tier information

---

## 🏆 Conclusion

This documentation suite provides everything needed to understand, implement, and maintain the telecom plan JSON schemas across all four Indian operators. Whether you're a new developer getting up to speed or an experienced contributor adding features, these docs serve as your comprehensive reference.

**Remember:** The Indian telecom landscape is dynamic. Plans change, operators merge, and features evolve. Keep these docs updated to maintain their value!

---

**Last Updated:** 2025-11-03
**Documentation Version:** 1.0
**Covers Operators:** Airtel, Jio, BSNL, Vi
**Application:** Muttayi Mobile Plan Finder
