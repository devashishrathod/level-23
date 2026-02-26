module.exports = {
  ROLES: Object.freeze({
    ADMIN: "admin",
    SALESMAN: "salesman",
    USER: "user",
    PARTNER: "partner",
  }),

  LOGIN_TYPES: Object.freeze({
    EMAIL: "email",
    MOBILE: "mobile",
    GOOGLE: "google",
    PASSWORD: "password",
    OTHER: "other",
  }),

  PLATFORMS: Object.freeze({
    WEB: "web",
    ANDROID: "android",
    IOS: "ios",
  }),

  SUBSCRIPTION_TYPES: Object.freeze({
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    QUATERLY: "quarterly",
    HALF_YEARLY: "half_yearly",
    YEARLY: "yearly",
  }),

  DURATION_MAP: Object.freeze({
    weekly: 7,
    monthly: 30,
    quarterly: 90,
    half_yearly: 180,
    yearly: 365,
  }),

  SUBSCRIPTION_PLANS: Object.freeze({
    FREE: "free",
    BASIC: "basic",
    PREMIUM: "premium",
    Family: "family",
  }),

  PRODUCT_TYPES: Object.freeze({
    GROCERY: "grocery",
    ELECTRONICS: "electronics",
    CLOTHING: "clothing",
  }),

  INVENTORY_STATUS: Object.freeze({
    AVAILABLE: "available",
    RESERVED: "reserved",
    SOLD: "sold",
  }),

  BOOKING_TYPES: Object.freeze({
    NEW: "new",
    RESALE: "resale",
  }),

  BOOKING_STATUS: Object.freeze({
    PENDING: "pending",
    PROCESSING: "processing",
    CONFIRMED: "confirmed",
    CANCELLED: "cancelled",
    REJECTED: "rejected",
  }),

  PAYMENT_METHODS: Object.freeze({
    CHEQUE: "cheque",
    RTGS_NEFT: "rtgs/neft",
    CASH: "cash",
    UPI: "upi",
    DEBIT_CREDIT_CARD: "debit/credit card",
  }),

  PARTNER_TYPES: Object.freeze({
    BROKER: "broker",
    AGENT: "agent",
    CONSULTANT: "consultant",
    BUILDER: "builder",
  }),

  PARTNER_STATUS: Object.freeze({
    ACTIVE: "active",
    INACTIVE: "inactive",
    PENDING: "pending",
  }),

  RERA_TYPES: Object.freeze({
    RERA: "rera",
    PERMISSION: "permission",
    BROCHURE: "brochure",
    TERMS: "terms",
  }),

  UNIT_STATUS: Object.freeze({
    AVAILABLE: "available",
    SOLD: "sold",
    HOLD: "hold",
  }),

  UNIT_TYPES: Object.freeze({
    ONE_BHK: "1bhk",
    TWO_BHK: "2bhk",
    THREE_BHK: "3bhk",
    FOUR_BHK: "4bhk",
    STUDIO: "studio",
    PENTHOUSE: "penthouse",
    SHOP: "shop",
    OFFICE: "office",
  }),

  UNIT_FACING: Object.freeze({
    NORTH: "north",
    SOUTH: "south",
    EAST: "east",
    WEST: "west",
    NORTH_EAST: "north-east",
    NORTH_WEST: "north-west",
    SOUTH_EAST: "south-east",
    SOUTH_WEST: "south-west",
  }),

  ZIP_CODE_REGEX_MAP: Object.freeze({
    IN: /^[1-9][0-9]{5}$/, // India (6 digits)
    US: /^\d{5}(-\d{4})?$/, // USA (ZIP or ZIP+4)
    CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, // Canada (A1A 1A1)
    UK: /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i, // United Kingdom (SW1A 1AA)
    AU: /^\d{4}$/, // Australia (4 digits)
    DE: /^\d{5}$/, // Germany
    FR: /^\d{5}$/, // France
    IT: /^\d{5}$/, // Italy
    ES: /^\d{5}$/, // Spain
    BR: /^\d{5}-?\d{3}$/, // Brazil (12345-678 or 12345678)
    RU: /^\d{6}$/, // Russia
  }),

  COUNTRY_NAME_TO_ISO: Object.freeze({
    india: "IN",
    unitedstates: "US",
    usa: "US",
    canada: "CA",
    uk: "UK",
    unitedkingdom: "UK",
    australia: "AU",
    germany: "DE",
    france: "FR",
    italy: "IT",
    spain: "ES",
    brazil: "BR",
    russia: "RU",
  }),

  DEFAULT_IMAGES: Object.freeze({
    CATEGORY:
      "https://callwave.com/wp-content/uploads/2023/11/image-166-1024x523.png",
    MOVIE:
      "https://cdn.prod.website-files.com/619cb1d12095e3f3cdddaeb2/68483b208c04ea886b01c757_Best%20OTT%20Platforms%20for%20Movie%20Buffs.png",
    // BANNER: "",
  }),
};
