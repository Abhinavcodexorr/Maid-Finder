/**
 * Everything that differs by country in provider registration: phone format, region lists and the
 * government IDs a provider may upload. The codes match the backend's countries (IN, AU).
 *
 * To change which IDs a country accepts, edit its `ids` list — the registration screen is built from it.
 */
export type CountryCode = "IN" | "AU";

export interface IdDocument {
  /** Stable key, also sent to the backend as part of `idType` (e.g. "passport_front"). */
  key: string;
  label: string;
  /** One upload tile per side, in order. */
  sides: string[];
  /** India's Aadhaar and PAN already have dedicated backend fields (and admin-panel previews). */
  legacy?: "aadhaar" | "pan";
}

export interface CountryConfig {
  code: CountryCode;
  name: string;
  flag: string;
  dialCode: string;
  /** National mobile number as typed, without the dial code. */
  mobilePattern: RegExp;
  mobileLength: number;
  mobilePlaceholder: string;
  regionLabel: string;
  postalLabel: string;
  postalLength: number;
  /** India's states and cities come from the geo API; other countries use this fixed list and a typed city. */
  states: string[] | null;
  ids: IdDocument[];
}

export const COUNTRIES: Record<CountryCode, CountryConfig> = {
  IN: {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    dialCode: "+91",
    mobilePattern: /^[6-9]\d{9}$/,
    mobileLength: 10,
    mobilePlaceholder: "98765 XXXXX",
    regionLabel: "State",
    postalLabel: "Pincode",
    postalLength: 6,
    states: null,
    ids: [
      { key: "aadhaar", label: "Aadhaar Card", sides: ["Front", "Back"], legacy: "aadhaar" },
      { key: "pan", label: "PAN Card", sides: ["Front"], legacy: "pan" },
      { key: "passport", label: "Passport", sides: ["Front", "Back"] },
      { key: "driving_licence", label: "Driving Licence", sides: ["Front", "Back"] },
      { key: "voter_id", label: "Voter ID", sides: ["Front", "Back"] },
    ],
  },
  AU: {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    dialCode: "+61",
    mobilePattern: /^4\d{8}$/,
    mobileLength: 9,
    mobilePlaceholder: "4XX XXX XXX",
    regionLabel: "State / Territory",
    postalLabel: "Postcode",
    postalLength: 4,
    states: [
      "Australian Capital Territory",
      "New South Wales",
      "Northern Territory",
      "Queensland",
      "South Australia",
      "Tasmania",
      "Victoria",
      "Western Australia",
    ],
    ids: [
      { key: "driver_licence", label: "Driver Licence", sides: ["Front", "Back"] },
      { key: "passport", label: "Passport", sides: ["Photo page"] },
      { key: "photo_card", label: "Photo Card", sides: ["Front", "Back"] },
    ],
  },
};

export const COUNTRY_LIST: CountryConfig[] = [COUNTRIES.IN, COUNTRIES.AU];
export const DEFAULT_COUNTRY: CountryCode = "IN";

export function isCountryCode(value: unknown): value is CountryCode {
  return value === "IN" || value === "AU";
}

/**
 * Cleans what someone typed or pasted into the national mobile number: digits only, and without the
 * trunk "0" Australians write first (0412 345 678) or a pasted country prefix (+61 / +91).
 */
export function normalizeMobile(code: CountryCode, raw: string): string {
  const { dialCode, mobileLength } = COUNTRIES[code];
  let digits = raw.replace(/\D/g, "");
  const prefix = dialCode.replace("+", "");
  if (digits.startsWith(prefix) && digits.length > mobileLength) digits = digits.slice(prefix.length);
  if (code === "AU" && digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, mobileLength);
}
