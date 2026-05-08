import { UTCDate } from "@date-fns/utc";
import { format } from "date-fns";
import { parsePhoneNumber } from "libphonenumber-js";

const CentsFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  signDisplay: "auto",
});

/**
 * Formats a cents amount as a USD currency string.
 * @param amount - Amount in cents (e.g. `1000` for $10). Defaults to $0 if NaN.
 * @returns Formatted currency string (e.g. "$10")
 */
function formatCentstoUSD(amount: number) {
  return CentsFormat.format(isNaN(amount) ? 0 : amount / 100);
}

/**
 * Formats an ISO date string as a US-style date string.
 * @param isoDate - ISO 8601 date string (e.g. "2026-03-28T00:00:00Z")
 * @returns Formatted date string (e.g. "3/28/2026")
 * @todo Replace with a date-fns/UTCDate equivalent and remove.
 */
function formatISODate(isoDate: string) {
  const date = new Date(isoDate);

  const month = date.getMonth() + 1; // getMonth() returns 0-11, so add 1
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

/**
 * Formats a UTC timestamp as a readable local date and time string.
 * Note: Uses the user's local timezone, which may cause date shifts for UTC dates.
 * @param timestamp - ISO 8601 UTC string (e.g. "2026-03-28T00:00:00Z")
 * @returns Formatted string (e.g. "3/28/2026 at 8:00:00 PM")
 * @todo Replace with a date-fns/UTCDate equivalent and remove.
 */
function formatTimestampToReadable(timestamp: string): string {
  const date = new Date(timestamp);
  return date
    .toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    .replace(",", " at");
}

/**
 * Formats a date string as a short, localized date — optionally including time.
 * When time is excluded, the date is interpreted in UTC to avoid timezone shifts.
 * When time is included, falls back to the user's local timezone.
 * @param dateString - ISO 8601 date string (e.g. "2026-03-28T00:00:00Z")
 * @param includeTime - If true, appends localized time (e.g. "Mar 28, 2026, 3:00 PM")
 * @returns Formatted date string (e.g. "Mar 28, 2026")
 * @deprecated Use `toDisplayDate` or `toDisplayDateShort` instead.
 */
function formatDateShort(dateString: string, includeTime = false) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: includeTime ? undefined : "UTC",
    hour: includeTime ? "numeric" : undefined,
    minute: includeTime ? "numeric" : undefined,
    hour12: includeTime ? true : undefined,
  });
}

/**
 * Returns the initials of a first and last name.
 * @param firstName - e.g. "Bubba"
 * @param lastName - e.g. "Watson"
 * @returns Uppercase initials (e.g. "BW")
 */
function getInitials(firstName: string, lastName: string): string {
  return [firstName, lastName]
    .map((name) => name.charAt(0).toUpperCase())
    .join("");
}

function formatPhoneNumber(phone?: string): string {
  if (!phone) return "";

  try {
    // Parse as US number and format in national format: (202) 555-1234
    const phoneNumber = parsePhoneNumber(phone, "US");
    if (phoneNumber?.isValid()) {
      return phoneNumber.formatNational();
    }
  } catch {
    // Library couldn't parse it
  }

  // If the library can't format it, return the original
  return phone;
}

/**
 * Formats address fields into a city, state, and zip code string.
 * Supports both city/state/zip_code and locality/region/postal_code naming conventions.
 * @param address - Partial address object
 * @returns Formatted string (e.g. "New York, NY 10001")
 */
function formatCityStateZip(address: {
  city?: string;
  state?: string;
  zip_code?: string;
  locality?: string;
  region?: string;
  postal_code?: string;
}): string {
  // Support both naming conventions: city/state/zip_code and locality/region/postal_code
  const city = address.city || address.locality;
  const state = address.state || address.region;
  const zipCode = address.zip_code || address.postal_code;

  const stateZip = [state, zipCode].filter(Boolean).join(" ");
  return [city, stateZip].filter(Boolean).join(", ");
}

const PercentFormat = new Intl.NumberFormat("en-US", {
  style: "percent",
});

/**
 * Formats a ratio as a percentage string.
 * @param ratio - Decimal ratio (e.g. `0.5` for 50%). Defaults to 0 if NaN.
 * @returns Formatted percentage string (e.g. "50%")
 */
function formatPercent(ratio: number): string {
  return PercentFormat.format(isNaN(ratio) ? 0 : ratio);
}

type AssetType = "USD/2";
interface AssetDetail {
  compactFormat: Intl.NumberFormat;
  toUnitAmount(amount: number): number;
  fromUnitAmount(amount: number): number;
}

const CompactAssetFormats: Record<AssetType | "__default", AssetDetail> = {
  "USD/2": {
    compactFormat: new Intl.NumberFormat("en-US", {
      style: "currency",
      notation: "compact",
      compactDisplay: "short",
      currency: "USD",
    }),
    toUnitAmount: (amount) => amount / 100,
    fromUnitAmount: (unitAmount) => unitAmount * 100,
  },
  __default: {
    compactFormat: new Intl.NumberFormat("en-US"),
    toUnitAmount: (amount) => amount,
    fromUnitAmount: (unitAmount) => unitAmount,
  },
};

export function formatCompactAsset(asset: string, amount: number): string {
  const { compactFormat: numberFormat, toUnitAmount } =
    CompactAssetFormats[asset as AssetType] ?? CompactAssetFormats["__default"];
  const unitAmount = toUnitAmount(amount);
  return numberFormat.format(isNaN(unitAmount) ? 0 : unitAmount);
}

export function toAssetUnitAmount(asset: string, unitAmount: number): number {
  const { toUnitAmount } =
    CompactAssetFormats[asset as AssetType] ?? CompactAssetFormats["__default"];
  return toUnitAmount(unitAmount);
}

export function fromAssetUnitAmount(asset: string, unitAmount: number): number {
  const { fromUnitAmount } =
    CompactAssetFormats[asset as AssetType] ?? CompactAssetFormats["__default"];
  return fromUnitAmount(unitAmount);
}

/**
 * Formats a UTC date as a human-readable string.
 * @param timestamp - ISO 8601 UTC string (e.g. "2026-03-27T00:00:00Z") or Date object
 * @returns Formatted date string (e.g. "Mar 27, 2026")
 */
function toDisplayDate(timestamp: string | Date) {
  return format(new UTCDate(timestamp), "MMM d, yyyy");
}

/**
 * Formats a UTC date as a short human-readable string.
 * @param timestamp - ISO 8601 UTC string (e.g. "2026-03-27T00:00:00Z") or Date object
 * @returns Formatted date string (e.g. "Mar 27")
 */
function toDisplayDateShort(timestamp: string | Date) {
  return format(new UTCDate(timestamp), "MMM d");
}

/**
 * Formats a UTC date as an ISO 8601 date string.
 * @param timestamp - UTC Date object or ISO 8601 string (e.g. "2026-03-28T00:00:00Z")
 * @returns Formatted date string (e.g. "2026-03-28")
 */
function toISODate(timestamp: string | Date) {
  return format(new UTCDate(timestamp), "yyyy-MM-dd");
}

export {
  toDisplayDate,
  toDisplayDateShort,
  toISODate,
  formatCentstoUSD,
  formatCityStateZip,
  formatDateShort,
  formatISODate,
  formatPercent,
  formatPhoneNumber,
  formatTimestampToReadable,
  getInitials,
};
