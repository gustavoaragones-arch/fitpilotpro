// Unit system utility — single source of truth for all measurement conversions
//
// Storage format: IMPERIAL (lbs, inches) — matching DB schema column names:
//   progress_records.weight_lbs, .waist_in, .chest_in, .skeletal_muscle_mass_lbs, etc.
//
// Display format: metric or imperial based on trainer's unit_system preference
// All `stored*` params are in imperial (lbs / inches) — values read from DB
// `storeWeight` / `storeMeasurement` output imperial values to write back to DB

export type UnitSystem = "metric" | "imperial";

// ── Weight ──────────────────────────────────────────────────────────────────
export const lbsToKg = (lbs: number): number =>
  Math.round(lbs * 0.453592 * 10) / 10;
export const kgToLbs = (kg: number): number =>
  Math.round(kg * 2.20462 * 10) / 10;

/** Convert stored lbs value to display unit */
export function displayWeight(storedLbs: number, units: UnitSystem): number {
  return units === "imperial"
    ? Math.round(storedLbs * 10) / 10
    : lbsToKg(storedLbs);
}

/** Convert user-entered value (in their preferred unit) to lbs for DB storage */
export function storeWeight(inputValue: number, units: UnitSystem): number {
  return units === "imperial" ? inputValue : kgToLbs(inputValue);
}

export function weightUnit(units: UnitSystem): string {
  return units === "imperial" ? "lbs" : "kg";
}

// ── Length / measurements ────────────────────────────────────────────────────
export const inToCm = (inches: number): number =>
  Math.round(inches * 2.54 * 10) / 10;
export const cmToIn = (cm: number): number =>
  Math.round((cm / 2.54) * 10) / 10;

/** Convert stored inches value to display unit */
export function displayMeasurement(storedIn: number, units: UnitSystem): number {
  return units === "imperial"
    ? Math.round(storedIn * 10) / 10
    : inToCm(storedIn);
}

/** Convert user-entered value (in their preferred unit) to inches for DB storage */
export function storeMeasurement(inputValue: number, units: UnitSystem): number {
  return units === "imperial" ? inputValue : cmToIn(inputValue);
}

export function measurementUnit(units: UnitSystem): string {
  return units === "imperial" ? "in" : "cm";
}

// ── Percentage fields (body fat, muscle %) — unitless ───────────────────────
// No conversion needed — stored and displayed as-is

// ── Currency formatting ──────────────────────────────────────────────────────
export type Currency = "USD" | "CAD";

export function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
