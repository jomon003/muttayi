// Operator types
export type Operator = 'airtel' | 'jio' | 'bsnl' | 'vi';

// Common interfaces
export interface BaseUserPreferences {
  operator: Operator;
  circle?: string;
  dataPreference?: 'unlimited' | 'limited' | null;
  dailyDataAmount?: number;
  hasDailyCaps?: boolean;
  unlimitedDataType?: 'with_cap' | 'without_cap' | 'any' | null;
  fiveGPreference?: 'yes' | 'no' | null;
  callPreference?: 'unlimited' | 'limited' | null;
  callMinutes?: number;
  smsPreference?: 'with' | 'without' | null;
  smsPerDay?: number;
  ottPreference?: 'yes' | 'no' | null;
  selectedOTT?: string[];
  isGP2?: boolean;
  isJK20?: boolean;
  nightUnlimitedOnly?: boolean;
  // Jio special category filters
  includeDataPacks?: boolean;  // Jio data-only packs AND add-ons/memberships
  includeJioPhone?: boolean;
  includeJioPhonePrima?: boolean;
  includeJioBharat?: boolean;
  includeJioPhoneAddon?: boolean;
  showOnlySpecialCategories?: boolean;
  // VI filters
  includeNoValidityPlans?: boolean;
  // Airtel filters
  includeAirtelDataPacks?: boolean;
  // BSNL filters
  includeCUGPolicePlans?: boolean;  // Show Police CUG plans (only for TN/CN/PY circles)
}

// Airtel Plan Structure
export interface AirtelPlan {
  planId: string;
  price: number;
  category: string;
  validity: {
    days: number | null;
    unit: string;
  };
  data: {
    isUnlimited: boolean;
    isPerDay: boolean;
    perDayData: number | null;
    totalData: number | null;
    unit: string;
  };
  voice: {
    isUnlimited: boolean;
    coverage: string[];
  };
  sms: {
    perDay: number | null;
    total: number | null;
  };
  isAddOn: boolean;
  ott: {
    isIncluded: boolean;
    services: string[];
  };
  fiveG: boolean;
  available_circles: string[];  // Airtel circle codes (2026-10: plans vary by circle)
}

// Jio Plan Structure
export interface JioPlan {
  id: string;
  price: number;
  validityDays: number;
  isCalendarMonth?: boolean;  // True if validity is "Calendar Month" (recharge on same day each month)
  category?: string;  // Original category from extraction (e.g., "Popular Plans", "Gaming")
  dailyData: {
    amount: number;
  } | null;
  totalData: {
    amount: number;
  } | null;
  voice: {
    isUnlimited: boolean;
    minutes: number | null;
  };
  sms: {
    dailyLimit: number | null;
    totalCount: number | null;
  };
  has5G: boolean;
  unlimited5G: boolean;
  ottSubscriptions: {
    netflix: boolean | string | null;  // Can be "Basic", "Standard", "Premium" or boolean
    amazonPrime: boolean | string | null;  // Can be "Mobile", "Lite" or boolean
    hotstar: boolean;
    sonyliv: boolean;
    zee5: boolean;
    jioTV: boolean;
    jioCinema: boolean;
    jioSaavn: boolean;
    fancode: boolean;
    discoveryPlus: boolean;
  };
  planType: {
    isRecharge: boolean;
    isDataPack: boolean;
    isJioPhone: boolean;
    isJioPhonePrima: boolean;  // Jio Phone Prima (separate from JioPhone)
    isJioPhoneDataAddon: boolean;
    isJioBharatPhone: boolean;
    isGaming: boolean;
    isAddOn?: boolean;  // No calls and no data: membership / service add-on (e.g. JIO PRIME)
  };
}

// BSNL Plan Structure
export interface BSNLPlan {
  plan_details: {
    planName: string;
    price: number;
    validity: {
      days: number;
      unit: string;
      isCalendarMonth: boolean;
    };
    data: {
      isUnlimited: boolean;
      dailyLimit: {
        amount: number;
        unit: string;
      } | null;
      totalLimit: {
        amount: number;
        unit: string;
      } | null;
      postFUPSpeed: number;
      hasSpeedReduction: boolean;
    };
    voice: {
      isUnlimited: boolean;
      minutes: number | null;
      coverage: {
        local: boolean;
        std: boolean;
        roaming: boolean;
        mtnlIncluded: boolean;
      };
    };
    sms: {
      dailyLimit: number | null;
      totalLimit: number | null;
    };
    specialConditions: {
      isGP2: boolean;
      isJK20?: boolean;
      isCUGPolice?: boolean;
    };
    freebiesValidity?: {
      days: number;
      isSameAsPlanValidity: boolean;
    } | null;
  };
  available_circles: string[];
}

// VI Plan Structure
export interface VIPlan {
  plan_details: {
    category: string;
    planName: string;
    price: number;
    noServiceValidity: boolean;
    validity: {
      days: number;
      unit: string;
    };
    freebiesValidity: {
      days: number;
      unit: string;
    };
    data: {
      isUnlimited: boolean;
      isPerDay: boolean;
      perDayData: number | null;
      totalData: number | null;
      postFUPSpeed: number | null;
      nightData: {
        isUnlimited: boolean;
        timings: {
          from: string;
          to: string;
        };
      } | null;
      backupData: {
        amount: number;
        unit: string;
        frequency: string;
      } | null;
      weekendRollover?: boolean;
      postQuotaTariff?: number | null;
    };
    voice: {
      isUnlimited: boolean;
      minutes: number | null;
      coverage: string[];
      tariff: number | null;
      nightCalling: {
        timings: {
          from: string;
          to: string;
        };
        type: string;
      } | null;
      talktime?: number;
    };
    sms: {
      perDay: number | null;
      total: number | null;
      charges: {
        local: number;
        std: number;
      };
    };
    ottBenefits: {
      services: string[];
      details: string;
      validityDays: number;
    } | null;
    entertainment: {
      type: string;
      tier: string;
      features: {
        ottApps: number;
        tvChannels: number;
        devices: string[];
      };
      validityDays?: number;
    } | null;
    fiveG?: boolean;
  };
  available_circles: string[];
}

// Normalized plan interface for unified processing
export interface NormalizedPlan {
  id: string;
  operator: Operator;
  price: number;
  validity: number; // days
  freebiesValidity?: number | null; // for BSNL plans
  data: {
    isUnlimited: boolean;
    perDay: number | null; // GB
    total: number | null; // GB
    postFUPSpeed?: number;
  };
  voice: {
    isUnlimited: boolean;
    minutes: number | null;
  };
  sms: {
    perDay: number | null;
    total: number | null;
  };
  fiveG: boolean;
  ottServices: string[];
  pricePerDay: number;
  pricePerGB: number | null;
  category?: string;
  isGP2Only?: boolean;
  isJK20?: boolean;
  circles?: string[];
  specialFeatures?: string[];
  noServiceValidity?: boolean;
  isCalendarMonth?: boolean;  // Jio plans with "Calendar Month" validity
  isDataAddon?: boolean;  // Airtel data-only add-on plans
  isDataPack?: boolean;  // Jio data-only packs (no voice, requires active plan)
  isAddOn?: boolean;  // Jio memberships / service add-ons (no calls, no data)
  has5G?: boolean;  // Alias for fiveG for cleaner access
  isCUGPolice?: boolean;  // BSNL CUG Police plans (for TN Police)
}

// Sort options
export type SortOption = 'pricePerDay' | 'price' | 'validity' | 'dataPerDay' | 'pricePerGB';

// Circle interface
export interface Circle {
  code: string;
  name: string;
  hasJK20?: boolean;
}

// OTT service interface
export interface OTTService {
  id: string;
  name: string;
  operators: Operator[];
  icon?: string;
}
