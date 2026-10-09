import {
  Operator,
  AirtelPlan,
  JioPlan,
  BSNLPlan,
  VIPlan,
  NormalizedPlan,
  BaseUserPreferences,
  SortOption
} from '../types';

// Normalize plans from different operators into a unified format
export class PlanNormalizer {
  static normalizeAirtelPlan(plan: AirtelPlan, index: number): NormalizedPlan {
    const perDayData = plan.data.perDayData;
    const totalData = plan.data.totalData;
    const validityDays = plan.validity.days || 0;
    const pricePerDay = validityDays > 0 ? plan.price / validityDays : 0;

    // Calculate price per GB based on daily data or total data
    let pricePerGB: number | null = null;
    if (perDayData) {
      // Use daily data calculation if available
      pricePerGB = pricePerDay > 0 ? pricePerDay / perDayData : null;
    } else if (totalData) {
      // Use total data for both unlimited and non-unlimited plans
      pricePerGB = plan.price / totalData;
    } else if (plan.data.isUnlimited && validityDays > 0) {
      // For truly unlimited plans (no daily cap), assume 10GB/day for price per GB calculation
      const assumedDailyData = 10; // 10GB/day assumption for calculation only
      pricePerGB = pricePerDay / assumedDailyData;
    }

    return {
      id: plan.planId || `airtel_${index}`,
      operator: 'airtel',
      price: plan.price,
      validity: validityDays,
      data: {
        isUnlimited: plan.data.isUnlimited,
        perDay: perDayData,
        total: totalData,
      },
      voice: {
        isUnlimited: plan.voice.isUnlimited,
        minutes: null,
      },
      sms: {
        perDay: plan.sms.perDay || null,
        total: plan.sms.total || null,
      },
      fiveG: plan.fiveG,
      ottServices: plan.ott.services,
      pricePerDay,
      pricePerGB,
      isDataAddon: plan.isAddOn,
      category: plan.category,
    };
  }

  static normalizeJioPlan(plan: JioPlan): NormalizedPlan {
    // Values are true or a tier string (e.g. netflix: "Basic" / "Mobile") — both mean included
    const ottServices = Object.entries(plan.ottSubscriptions)
      .filter(([_, enabled]) => enabled === true || (typeof enabled === 'string' && enabled.trim() !== ''))
      .map(([service, _]) => service);

    // For data packs with 0 validity (like Rs.11 plan), treat as 1 day
    const effectiveValidity = plan.validityDays === 0 ? 1 : plan.validityDays;

    const totalData = plan.totalData?.amount || (plan.dailyData ? plan.dailyData.amount * effectiveValidity : null);
    const pricePerDay = plan.price / effectiveValidity;

    // Calculate price per GB based on daily data or total data
    let pricePerGB: number | null = null;
    if (plan.dailyData) {
      // Use daily data calculation if available
      pricePerGB = pricePerDay / plan.dailyData.amount;
    } else if (totalData) {
      // Use total data for both unlimited and non-unlimited plans
      pricePerGB = plan.price / totalData;
    } else if (plan.unlimited5G && effectiveValidity > 0) {
      // For truly unlimited plans (no daily cap), assume 10GB/day FUP for price per GB calculation
      const assumedDailyData = 10; // 10GB/day FUP assumption for calculation only
      pricePerGB = pricePerDay / assumedDailyData;
    }

    // Determine category - prioritize planType flags for consistency
    let category: string;

    if (plan.planType?.isDataPack) {
      category = 'Data';
    } else if (plan.planType?.isJioPhone) {
      category = 'JioPhone';
    } else if (plan.planType?.isJioPhonePrima) {
      category = 'JioPhone Prima';
    } else if (plan.planType?.isJioBharatPhone) {
      category = 'JioBharat';
    } else if (plan.planType?.isGaming) {
      category = 'Gaming';
    } else if (plan.planType?.isJioPhoneDataAddon) {
      category = 'JioPhone Addon';
    } else {
      // For isRecharge plans, preserve original category
      category = plan.category || 'Regular';
    }

    // For Jio, a plan is "unlimited" if:
    // 1. It has dailyData (daily FUP cap) - means unlimited at reduced speed after cap
    // 2. It's in "True 5G Unlimited Plans" category
    // Data-only packs with just totalData are NOT unlimited
    const isUnlimitedData = !!(plan.dailyData?.amount) ||
                            plan.category === 'True 5G Unlimited Plans' ||
                            (plan.unlimited5G && plan.voice?.isUnlimited);

    return {
      id: plan.id,
      operator: 'jio',
      price: plan.price,
      validity: plan.validityDays,  // Show actual validity (0 for Rs.11 plan)
      data: {
        isUnlimited: isUnlimitedData,
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
      pricePerDay,
      pricePerGB,
      category,
      isCalendarMonth: plan.isCalendarMonth || false,
      isDataPack: plan.planType?.isDataPack || false,
    };
  }
  static normalizeBSNLPlan(plan: BSNLPlan, index: number): NormalizedPlan {
    const details = plan.plan_details;
    const perDayData = details.data.dailyLimit?.amount || null;
    const totalData = details.data.totalLimit?.amount || null;
    const pricePerDay = details.price / details.validity.days;

    // Calculate price per GB based on daily data or total data
    let pricePerGB: number | null = null;
    if (perDayData) {
      // Use daily data calculation if available
      pricePerGB = pricePerDay / perDayData;
    } else if (totalData) {
      // Use total data for both unlimited and non-unlimited plans if no daily limit
      pricePerGB = details.price / totalData;
    }

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
        perDay: details.sms.dailyLimit,
        total: details.sms.totalLimit,
      },
      fiveG: false, // BSNL doesn't have 5G yet
      ottServices: [],
      pricePerDay,
      pricePerGB,
      isGP2Only: details.specialConditions.isGP2,
      isJK20: details.specialConditions.isJK20,
      isCUGPolice: details.specialConditions.isCUGPolice,
      circles: plan.available_circles,
      freebiesValidity: details.freebiesValidity?.isSameAsPlanValidity ? details.validity.days : details.freebiesValidity?.days || null
    };
  }
  static normalizeVIPlan(plan: VIPlan, index: number): NormalizedPlan {
    const details = plan.plan_details;
    const perDayData = details.data.perDayData;
    const totalData = details.data.totalData;
    const validityDays = details.validity.days;
    const pricePerDay = validityDays > 0 ? details.price / validityDays : 0;

    // For Vi, a plan is "unlimited" if:
    // 1. It has postFUPSpeed (means data continues at reduced speed after high-speed cap)
    // 2. It's already marked as isUnlimited in source data
    // 3. It has perDayData with voice unlimited (typical unlimited recharge pattern)
    // Plans with only totalData (like data packs) are NOT unlimited
    const isUnlimitedData = details.data.isUnlimited ||
                            !!(details.data.postFUPSpeed) ||
                            (perDayData !== null && details.voice.isUnlimited);

    // Calculate price per GB based on daily data or total data
    let pricePerGB: number | null = null;
    if (perDayData) {
      // Use daily data calculation if available
      pricePerGB = pricePerDay / perDayData;
    } else if (totalData) {
      // Use total data for both unlimited and non-unlimited plans
      pricePerGB = details.price / totalData;
    } else if (isUnlimitedData && validityDays > 0) {
      // For truly unlimited plans (no daily cap), assume 10GB/day FUP for price per GB calculation
      const assumedDailyData = 10; // 10GB/day FUP assumption for calculation only
      pricePerGB = pricePerDay / assumedDailyData;
    }

    // Extract OTT services from ottBenefits field if available
    const ottServices: string[] = [];
    if (details.ottBenefits && details.ottBenefits.services) {
      ottServices.push(...details.ottBenefits.services);
    }

    const specialFeatures: string[] = [];
    if (details.data.nightData && details.data.nightData.isUnlimited) {
      specialFeatures.push('Unlimited Night Data');
    }
    if (details.data.backupData) {
      specialFeatures.push(`${details.data.backupData.amount}${details.data.backupData.unit} Backup Data`);
    }

    return {
      id: `vi_${index}`,
      operator: 'vi',
      price: details.price,
      validity: details.validity.days,
      data: {
        isUnlimited: isUnlimitedData,
        perDay: perDayData,
        total: totalData,
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
      pricePerDay,
      pricePerGB,
      category: details.category,
      circles: plan.available_circles,
      specialFeatures,
      noServiceValidity: details.noServiceValidity,
    };
  }
}

// Filter plans based on user preferences
export class PlanFilter {
  private static createPlanKey(plan: NormalizedPlan): string {
    // Create a unique key based on all relevant plan details
    return JSON.stringify({
      price: plan.price,
      validity: plan.validity,
      data: {
        isUnlimited: plan.data.isUnlimited,
        perDay: plan.data.perDay,
        total: plan.data.total,
        postFUPSpeed: plan.data.postFUPSpeed
      },
      voice: {
        isUnlimited: plan.voice.isUnlimited,
        minutes: plan.voice.minutes
      },
      sms: {
        perDay: plan.sms.perDay,
        total: plan.sms.total
      },
      fiveG: plan.fiveG,
      ottServices: plan.ottServices.sort(), // Sort to ensure consistent comparison
      isGP2Only: plan.isGP2Only,
      isJK20: plan.isJK20,
      freebiesValidity: plan.freebiesValidity
    });
  }


  static filterPlans(
    plans: NormalizedPlan[],
    preferences: BaseUserPreferences
  ): NormalizedPlan[] {
    const filteredPlans = plans.filter(plan =>
      this.shouldIncludePlan(plan, preferences)
    );

    return this.removeDuplicatePlans(filteredPlans);
  }

  private static removeDuplicatePlans(plans: NormalizedPlan[]): NormalizedPlan[] {
    const uniquePlans = new Map<string, NormalizedPlan>();

    for (const plan of plans) {
      const key = this.createPlanKey(plan);
      if (!uniquePlans.has(key)) {
        uniquePlans.set(key, plan);
      }
    }

    return Array.from(uniquePlans.values());
  }

  private static shouldIncludePlan(
    plan: NormalizedPlan,
    preferences: BaseUserPreferences
  ): boolean {
    // Operator must match
    if (plan.operator !== preferences.operator) {
      return false;
    }

    // Circle filtering for BSNL and VI
    if (preferences.circle && plan.circles) {
      if (!plan.circles.includes(preferences.circle)) {
        return false;
      }
    }

    // GP2 and JK20 restrictions (hard requirements)
    if (plan.isGP2Only && !preferences.isGP2) {
      return false;
    }
    if (plan.isJK20 && !preferences.isJK20) {
      return false;
    }

    // CUG Police plans filtering (excluded by default, only for BSNL in CN/PY/TN circles)
    if (plan.isCUGPolice && !preferences.includeCUGPolicePlans) {
      return false;
    }

    // Night Unlimited Only restriction for VI operator
    if (preferences.nightUnlimitedOnly && plan.operator === 'vi') {
      const hasNightUnlimited = plan.specialFeatures?.some(feature =>
        feature.startsWith('Night Unlimited')
      );
      if (!hasNightUnlimited) {
        return false;
      }
    }

    // Jio special category filtering
    if (plan.operator === 'jio' && plan.category) {
      // If "Show Only Selected Categories" mode is enabled
      if (preferences.showOnlySpecialCategories) {
        // EXCLUSIVE MODE: Only show enabled special categories
        const isDataPackEnabled = plan.isDataPack && preferences.includeDataPacks;
        const isJioPhoneEnabled = plan.category === 'JioPhone' && preferences.includeJioPhone;
        const isJioPhonePrimaEnabled = plan.category === 'JioPhone Prima' && preferences.includeJioPhonePrima;
        const isJioBharatEnabled = plan.category === 'JioBharat' && preferences.includeJioBharat;
        const isJioPhoneAddonEnabled = plan.category === 'JioPhone Addon' && preferences.includeJioPhoneAddon;

        const isEnabledSpecialCategory =
          isDataPackEnabled || isJioPhoneEnabled || isJioPhonePrimaEnabled ||
          isJioBharatEnabled || isJioPhoneAddonEnabled;

        if (!isEnabledSpecialCategory) {
          return false;
        }
      } else {
        // NORMAL MODE: Hide special categories unless explicitly enabled
        if (plan.isDataPack && !preferences.includeDataPacks) {
          return false;
        }
        if (plan.category === 'JioPhone' && !preferences.includeJioPhone) {
          return false;
        }
        if (plan.category === 'JioPhone Prima' && !preferences.includeJioPhonePrima) {
          return false;
        }
        if (plan.category === 'JioBharat' && !preferences.includeJioBharat) {
          return false;
        }
        if (plan.category === 'JioPhone Addon' && !preferences.includeJioPhoneAddon) {
          return false;
        }
      }
    }

    // VI add-on packs filtering (plans without service validity)
    if (plan.operator === 'vi' && plan.noServiceValidity) {
      if (!preferences.includeNoValidityPlans) {
        return false;
      }
    }

    // Airtel data add-on packs filtering
    if (plan.operator === 'airtel' && plan.isDataAddon) {
      if (!preferences.includeAirtelDataPacks) {
        return false;
      }
    }

    // DATA FILTERING - Use operator-specific logic
    if (!this.filterByDataPreference(plan, preferences)) {
      return false;
    }

    // VOICE/CALLS FILTERING - Hard filtering logic
    if (preferences.callPreference === 'unlimited') {
      // User wants unlimited calls - HARD requirement (truly unlimited)
      if (!plan.voice.isUnlimited) {
        return false;
      }
    } else if (preferences.callPreference === 'limited' && preferences.callMinutes) {
      // User wants limited calls with minimum minutes
      // Calculate daily equivalent
      const planDailyMinutes = plan.voice.minutes && plan.validity > 0
        ? plan.voice.minutes / plan.validity
        : null;

      if (!planDailyMinutes) {
        // If plan has unlimited, it's a bonus (more than needed)
        if (!plan.voice.isUnlimited) {
          return false;
        }
      } else {
        // Plan must have at least the specified minutes per day
        if (planDailyMinutes < preferences.callMinutes) {
          return false;
        }
      }
    }
    // If callPreference is undefined/null (no preference), don't filter

    // 5G FILTERING - Bonus feature logic
    if (preferences.fiveGPreference === 'yes') {
      // User requires 5G - HARD requirement
      if (!plan.fiveG) {
        return false;
      }
    }
    // If fiveGPreference is 'no' or undefined, 5G is a bonus - don't filter

    // SMS FILTERING - Bonus feature logic
    if (preferences.smsPreference === 'with' && preferences.smsPerDay) {
      // User wants SMS with minimum amount
      // Calculate daily equivalent
      const planDailySMS = plan.sms.perDay ||
        (plan.sms.total && plan.validity > 0 ? plan.sms.total / plan.validity : null);

      if (!planDailySMS) {
        return false; // Exclude plans without SMS when user wants it
      }

      // Plan must have at least the specified SMS per day
      if (planDailySMS < preferences.smsPerDay) {
        return false;
      }
    } else if (preferences.smsPreference === 'with' && !preferences.smsPerDay) {
      // User wants SMS but no specific amount - just check if plan has any SMS
      if (!plan.sms.perDay && !plan.sms.total) {
        return false;
      }
    }
    // If smsPreference is 'without' or undefined, SMS is a bonus - don't filter

    // OTT FILTERING - Bonus feature logic
    if (preferences.ottPreference === 'yes') {
      // User wants OTT services
      if (plan.ottServices.length === 0) {
        return false;
      }

      // If specific OTT services are selected, check if plan has ALL of them (AND logic)
      if (preferences.selectedOTT && preferences.selectedOTT.length > 0) {
        // Normalize function to create comparable keys (remove spaces and special chars)
        const normalizeOTT = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

        // Check if plan has ALL selected OTT services (AND logic)
        const hasAllSelectedOTT = preferences.selectedOTT.every(ott =>
          plan.ottServices.some(service =>
            normalizeOTT(service) === normalizeOTT(ott) ||
            normalizeOTT(service).includes(normalizeOTT(ott)) ||
            normalizeOTT(ott).includes(normalizeOTT(service))
          )
        );
        if (!hasAllSelectedOTT) {
          return false;
        }
      }
    }
    // If ottPreference is 'no' or undefined, OTT is a bonus - don't filter

    return true;
  }

  /**
   * DATA FILTERING - Operator-specific logic
   *
   * Philosophy: Filter shows plans that MEET OR EXCEED user requirements
   * - "With Daily Cap": Show plans with caps + truly unlimited (which exceeds the requirement)
   * - "Without Daily Cap": Only show truly unlimited (plans with caps don't meet requirement)
   * - "Limited Data X GB": Show limited plans >= X + unlimited plans with >= X high-speed
   */
  private static filterByDataPreference(
    plan: NormalizedPlan,
    preferences: BaseUserPreferences
  ): boolean {
    // Route to operator-specific filter
    switch (plan.operator) {
      case 'jio':
        return this.filterJioDataPreference(plan, preferences);
      case 'airtel':
        return this.filterAirtelDataPreference(plan, preferences);
      case 'vi':
        return this.filterViDataPreference(plan, preferences);
      case 'bsnl':
        return this.filterBsnlDataPreference(plan, preferences);
      default:
        return true;
    }
  }

  /**
   * JIO Data Filtering
   * - Jio unlimited = plans with dailyData (FUP cap) OR True 5G Unlimited category
   * - Plans with dailyData provide unlimited at reduced speed after cap
   */
  private static filterJioDataPreference(
    plan: NormalizedPlan,
    preferences: BaseUserPreferences
  ): boolean {
    if (preferences.dataPreference === 'unlimited') {
      // User wants unlimited data
      if (!plan.data.isUnlimited) {
        return false;
      }

      if (preferences.unlimitedDataType === 'with_cap') {
        // "With Daily Cap" - show plans with caps + truly unlimited (exceeds requirement)
        // All unlimited plans qualify (with or without caps)
        // If user specified min daily amount, check it for plans with caps
        if (plan.data.perDay && preferences.dailyDataAmount) {
          if (plan.data.perDay < preferences.dailyDataAmount) {
            return false;
          }
        }
      } else if (preferences.unlimitedDataType === 'without_cap') {
        // "Without Daily Cap" - only plans without daily FUP cap
        if (plan.data.perDay) {
          return false;
        }
        // For plans with total high-speed pool (no daily cap), check average meets requirement
        if (preferences.dailyDataAmount && plan.data.total && plan.validity > 0) {
          const avgDailyData = plan.data.total / plan.validity;
          if (avgDailyData < preferences.dailyDataAmount) {
            return false;
          }
        }
        // Truly unlimited (no total, no perDay) always qualifies
      }
      // 'any'/null - show all unlimited plans
    } else if (preferences.dataPreference === 'limited' && preferences.dailyDataAmount) {
      // User wants limited data with X GB/day minimum
      // Show: limited plans >= X + unlimited plans with >= X high-speed (exceeds requirement)
      const planDailyData = plan.data.perDay ||
        (plan.data.total && plan.validity > 0 ? plan.data.total / plan.validity : null);

      if (plan.data.isUnlimited) {
        // Unlimited plans with sufficient daily high-speed data also qualify
        if (planDailyData && planDailyData >= preferences.dailyDataAmount) {
          return true;
        }
        // Truly unlimited (no cap) always exceeds any limited requirement
        if (!plan.data.perDay && !plan.data.total) {
          return true;
        }
        return false;
      } else {
        // Limited plans must have at least the specified amount
        if (!planDailyData || planDailyData < preferences.dailyDataAmount) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * AIRTEL Data Filtering
   * - Similar structure to Jio
   * - isUnlimited flag from source data
   */
  private static filterAirtelDataPreference(
    plan: NormalizedPlan,
    preferences: BaseUserPreferences
  ): boolean {
    if (preferences.dataPreference === 'unlimited') {
      if (!plan.data.isUnlimited) {
        return false;
      }

      if (preferences.unlimitedDataType === 'with_cap') {
        // Show plans with caps + truly unlimited
        if (plan.data.perDay && preferences.dailyDataAmount) {
          if (plan.data.perDay < preferences.dailyDataAmount) {
            return false;
          }
        }
      } else if (preferences.unlimitedDataType === 'without_cap') {
        // "Without Daily Cap" - only plans without daily FUP cap
        if (plan.data.perDay) {
          return false;
        }
        // For plans with total high-speed pool, check average meets requirement
        if (preferences.dailyDataAmount && plan.data.total && plan.validity > 0) {
          const avgDailyData = plan.data.total / plan.validity;
          if (avgDailyData < preferences.dailyDataAmount) {
            return false;
          }
        }
      }
    } else if (preferences.dataPreference === 'limited' && preferences.dailyDataAmount) {
      const planDailyData = plan.data.perDay ||
        (plan.data.total && plan.validity > 0 ? plan.data.total / plan.validity : null);

      if (plan.data.isUnlimited) {
        if (planDailyData && planDailyData >= preferences.dailyDataAmount) {
          return true;
        }
        if (!plan.data.perDay && !plan.data.total) {
          return true;
        }
        return false;
      } else {
        if (!planDailyData || planDailyData < preferences.dailyDataAmount) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * VI Data Filtering
   * - Vi has unique features like night data and backup data
   * - isUnlimited from source, perDayData for FUP
   */
  private static filterViDataPreference(
    plan: NormalizedPlan,
    preferences: BaseUserPreferences
  ): boolean {
    if (preferences.dataPreference === 'unlimited') {
      if (!plan.data.isUnlimited) {
        return false;
      }

      if (preferences.unlimitedDataType === 'with_cap') {
        // Show plans with caps + truly unlimited
        if (plan.data.perDay && preferences.dailyDataAmount) {
          if (plan.data.perDay < preferences.dailyDataAmount) {
            return false;
          }
        }
      } else if (preferences.unlimitedDataType === 'without_cap') {
        // "Without Daily Cap" - only plans without daily FUP cap
        if (plan.data.perDay) {
          return false;
        }
        // For plans with total high-speed pool, check average meets requirement
        if (preferences.dailyDataAmount && plan.data.total && plan.validity > 0) {
          const avgDailyData = plan.data.total / plan.validity;
          if (avgDailyData < preferences.dailyDataAmount) {
            return false;
          }
        }
      }
    } else if (preferences.dataPreference === 'limited' && preferences.dailyDataAmount) {
      const planDailyData = plan.data.perDay ||
        (plan.data.total && plan.validity > 0 ? plan.data.total / plan.validity : null);

      if (plan.data.isUnlimited) {
        if (planDailyData && planDailyData >= preferences.dailyDataAmount) {
          return true;
        }
        if (!plan.data.perDay && !plan.data.total) {
          return true;
        }
        return false;
      } else {
        if (!planDailyData || planDailyData < preferences.dailyDataAmount) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * BSNL Data Filtering
   * - BSNL has dailyLimit and totalLimit structure
   * - isUnlimited flag with postFUPSpeed info
   * - Some plans have totalLimit without dailyLimit (e.g., 32GB/30 days = ~1GB/day avg)
   */
  private static filterBsnlDataPreference(
    plan: NormalizedPlan,
    preferences: BaseUserPreferences
  ): boolean {
    if (preferences.dataPreference === 'unlimited') {
      if (!plan.data.isUnlimited) {
        return false;
      }

      if (preferences.unlimitedDataType === 'with_cap') {
        // Show plans with caps + truly unlimited
        if (plan.data.perDay && preferences.dailyDataAmount) {
          if (plan.data.perDay < preferences.dailyDataAmount) {
            return false;
          }
        }
      } else if (preferences.unlimitedDataType === 'without_cap') {
        // "Without Daily Cap" - only plans without daily FUP cap
        if (plan.data.perDay) {
          return false;
        }
        // For plans with total high-speed pool (like 32GB/30 days), check average meets requirement
        if (preferences.dailyDataAmount && plan.data.total && plan.validity > 0) {
          const avgDailyData = plan.data.total / plan.validity;
          if (avgDailyData < preferences.dailyDataAmount) {
            return false;
          }
        }
      }
    } else if (preferences.dataPreference === 'limited' && preferences.dailyDataAmount) {
      const planDailyData = plan.data.perDay ||
        (plan.data.total && plan.validity > 0 ? plan.data.total / plan.validity : null);

      if (plan.data.isUnlimited) {
        if (planDailyData && planDailyData >= preferences.dailyDataAmount) {
          return true;
        }
        if (!plan.data.perDay && !plan.data.total) {
          return true;
        }
        return false;
      } else {
        if (!planDailyData || planDailyData < preferences.dailyDataAmount) {
          return false;
        }
      }
    }
    return true;
  }

  // Helper to get effective price per GB for sorting
  // Truly unlimited plans (no daily cap) get very low price per GB (best value)
  private static getEffectivePricePerGB(plan: NormalizedPlan): number {
    // Truly unlimited plans (unlimited data without daily caps) = best value
    if (plan.data.isUnlimited && !plan.data.perDay) {
      return 0.01;
    }
    return plan.pricePerGB || Infinity;
  }

  // Helper to get effective data per day for sorting
  // Truly unlimited plans get very high data value
  private static getEffectiveDataPerDay(plan: NormalizedPlan): number {
    // Truly unlimited plans (unlimited data without daily caps) = highest data
    if (plan.data.isUnlimited && !plan.data.perDay) {
      return 999999;
    }
    return plan.data.perDay || 0;
  }

  static sortResults(results: NormalizedPlan[], sortBy: SortOption, ascending: boolean = true): NormalizedPlan[] {
    const multiplier = ascending ? 1 : -1;
    return [...results].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'pricePerDay':
          comparison = a.pricePerDay - b.pricePerDay;
          break;
        case 'validity':
          comparison = a.validity - b.validity;
          break;
        case 'dataPerDay':
          const aData = this.getEffectiveDataPerDay(a);
          const bData = this.getEffectiveDataPerDay(b);
          comparison = aData - bData;
          break;
        case 'pricePerGB':
          const aPricePerGB = this.getEffectivePricePerGB(a);
          const bPricePerGB = this.getEffectivePricePerGB(b);
          comparison = aPricePerGB - bPricePerGB;
          break;
        default:
          comparison = a.pricePerDay - b.pricePerDay;
      }
      return comparison * multiplier;
    });
  }
}

// Data loading service
export class PlanDataService {
  private static cache: Map<Operator, any[]> = new Map();

  static async loadOperatorPlans(operator: Operator): Promise<NormalizedPlan[]> {
    // Always clear cache for BSNL plans to ensure fresh data
    if (operator === 'bsnl') {
      this.cache.delete(operator);
    }
    
    if (this.cache.has(operator)) {
      return this.normalizeOperatorPlans(operator, this.cache.get(operator)!);
    }

    try {
      let data;
      switch (operator) {
        case 'airtel':
          data = await this.loadJSON('/db/airtel_db.json');
          break;
        case 'jio':
          data = await this.loadJSON('/db/jio_plans_db.json');
          break;
        case 'bsnl':
          data = await this.loadJSON('/db/bsnl_db.json');
          break;
        case 'vi':
          data = await this.loadJSON('/db/vi_plans_db.json');
          break;
        default:
          throw new Error(`Unknown operator: ${operator}`);
      }

      // Handle both direct array format and wrapped format
      const plans = Array.isArray(data) ? data : (data.plans || data);
      this.cache.set(operator, plans);
      return this.normalizeOperatorPlans(operator, plans);
    } catch {
      return [];
    }
  }

  private static async loadJSON(path: string): Promise<any> {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load ${path}: ${response.statusText}`);
    }
    return response.json();
  }

  private static normalizeOperatorPlans(operator: Operator, plans: any[]): NormalizedPlan[] {
    switch (operator) {
      case 'airtel':
        return plans.map((plan, index) => PlanNormalizer.normalizeAirtelPlan(plan, index));
      case 'jio':
        return plans.map(plan => PlanNormalizer.normalizeJioPlan(plan));
      case 'bsnl':
        return plans.map((plan, index) => PlanNormalizer.normalizeBSNLPlan(plan, index));
      case 'vi':
        return plans.map((plan, index) => PlanNormalizer.normalizeVIPlan(plan, index));
      default:
        return [];
    }
  }

  static clearCache(): void {
    this.cache.clear();
  }

  // Extract unique OTT services from loaded plans (case-insensitive deduplication)
  static extractOTTServicesFromPlans(plans: NormalizedPlan[]): string[] {
    // Use a Map with normalized keys to deduplicate case-insensitively
    const ottMap = new Map<string, string>();

    for (const plan of plans) {
      if (plan.ottServices && plan.ottServices.length > 0) {
        plan.ottServices.forEach(service => {
          const normalizedKey = service.toLowerCase().replace(/[^a-z0-9]/g, '');
          // Keep the first occurrence of each service
          if (!ottMap.has(normalizedKey)) {
            ottMap.set(normalizedKey, service);
          }
        });
      }
    }

    return Array.from(ottMap.values()).sort();
  }
}
