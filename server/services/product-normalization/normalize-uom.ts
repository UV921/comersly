import { normalizeText } from "./normalize-text";

const SAFE_UOM_MAP: Record<string, string> = {
  // Length
  "in.": "in",
  inch: "in",
  inches: "in",
  in: "in",

  "ft.": "ft",
  foot: "ft",
  feet: "ft",
  ft: "ft",

  "mm.": "mm",
  millimeter: "mm",
  millimeters: "mm",
  mm: "mm",

  "cm.": "cm",
  centimeter: "cm",
  centimeters: "cm",
  cm: "cm",

  // Electrical
  v: "V",
  volt: "V",
  volts: "V",

  a: "A",
  amp: "A",
  amps: "A",
  ampere: "A",
  amperes: "A",

  w: "W",
  watt: "W",
  watts: "W",

  hz: "Hz",
  hertz: "Hz",

  // Speed
  rpm: "RPM",

  // Weight
  lb: "lb",
  "lbs.": "lb",
  lbs: "lb",
  pound: "lb",
  pounds: "lb",

  oz: "oz",
  ounce: "oz",
  ounces: "oz",

  kg: "kg",
  kilogram: "kg",
  kilograms: "kg",

  g: "g",
  gram: "g",
  grams: "g",

  // Capacity / volume
  gal: "gal",
  gallon: "gal",
  gallons: "gal",

  l: "L",
  liter: "L",
  liters: "L",
  litre: "L",
  litres: "L",

  ml: "mL",
  milliliter: "mL",
  milliliters: "mL",

  // Temperature
  "°f": "°F",
  fahrenheit: "°F",

  "°c": "°C",
  celsius: "°C",

  // Noise
  dba: "dBA",
};

export function normalizeUom(
  uom: string | null,
): string | null {
  if (!uom) {
    return null;
  }

  const cleaned = normalizeText(uom);

  const normalized =
    SAFE_UOM_MAP[cleaned.toLowerCase()];

  return normalized ?? cleaned;
}