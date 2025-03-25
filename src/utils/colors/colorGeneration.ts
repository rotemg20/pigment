
import { ColorPalette } from './types';
import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex, adjustBrightness } from './colorConversion';
import { checkContrast } from './colorValidation';

// Generate complementary color
export function getComplementaryColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  // Get complementary color by inverting RGB values
  const r = 255 - rgb.r;
  const g = 255 - rgb.g;
  const b = 255 - rgb.b;
  
  // Convert back to hex
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Create a lighter version of a color
function createLightColor(rgb: { r: number, g: number, b: number }, factor: number): string {
  // Mix with white
  const r = Math.round(rgb.r + (255 - rgb.r) * factor);
  const g = Math.round(rgb.g + (255 - rgb.g) * factor);
  const b = Math.round(rgb.b + (255 - rgb.b) * factor);
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Create a darker version of a color
function createDarkColor(rgb: { r: number, g: number, b: number }, factor: number): string {
  // Mix with black
  const r = Math.round(rgb.r * factor);
  const g = Math.round(rgb.g * factor);
  const b = Math.round(rgb.b * factor);
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Create a neutral dark color that works well for text
function createNeutralDarkColor(baseRgb: { r: number, g: number, b: number }): string {
  // Create a dark neutral color based on the base color but with less saturation
  const avg = (baseRgb.r + baseRgb.g + baseRgb.b) / 3;
  let r = Math.round(baseRgb.r * 0.2 + avg * 0.1);
  let g = Math.round(baseRgb.g * 0.2 + avg * 0.1);
  let b = Math.round(baseRgb.b * 0.2 + avg * 0.1);
  
  // Ensure it's not too dark
  r = Math.max(20, r);
  g = Math.max(20, g);
  b = Math.max(20, b);
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Create an accent color that complements the base color
function createAccentColor(baseColor: string): string {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return "#467FF7"; // Default to our new accent color
  
  // Convert RGB to HSL for better color adjustments
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  // Create a complementary or harmony color based on HSL
  // Shift the hue by 180 degrees for complementary, or use other values for analogous or triadic
  let newHue = (hsl.h + 180) % 360; // Complementary color
  
  // For analogous, uncomment this:
  // let newHue = (hsl.h + 30) % 360; // 30 degree shift for analogous
  
  // Increase saturation for more vivid accent
  const newSat = Math.min(100, hsl.s + 15);
  
  // Adjust lightness - make it brighter than the primary to stand out
  const newLight = Math.min(Math.max(45, hsl.l + 10), 65);
  
  // Convert back to RGB
  const newRgb = hslToRgb(newHue, newSat, newLight);
  
  // Convert to hex and return
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

// Ensure all colors in the palette meet contrast requirements
function ensureContrastRequirements(palette: ColorPalette): ColorPalette {
  const result = { ...palette };
  
  // Background is fixed to white, so adjust other colors to ensure contrast
  
  // Make sure text has good contrast with background and secondaryBg
  if (!checkContrast(palette.background, palette.text)) {
    result.text = "#2D3748"; // Darker text for better contrast
  }
  
  if (!checkContrast(palette.secondaryBg, palette.text)) {
    // Either darken text or lighten secondaryBg
    result.text = adjustBrightness(palette.text, -20);
  }
  
  // Make sure primary has good contrast with backgrounds
  if (!checkContrast(palette.background, palette.primary)) {
    result.primary = adjustBrightness(palette.primary, -20);
  }
  
  if (!checkContrast(palette.secondaryBg, palette.primary)) {
    result.primary = adjustBrightness(palette.primary, -15);
  }
  
  // Ensure accent has good contrast
  if (!checkContrast(palette.background, palette.accent)) {
    result.accent = adjustBrightness(palette.accent, -20);
  }
  
  return result;
}

// Generate a color palette based on a base color
export function generateHarmonizedPalette(baseColor: string): ColorPalette {
  const baseRgb = hexToRgb(baseColor) || { r: 44, g: 82, b: 130 }; // Default to navy blue
  
  // Create variations based on the base color
  const primary = baseColor;
  
  // Always use white for the main background
  const background = "#FFFFFF";
  
  // Create a light version for secondary background (more contrast with text)
  const secondaryBg = createLightColor(baseRgb, 0.92);
  
  // Create a dark version for secondary (dark containers)
  const secondary = createDarkColor(baseRgb, 0.15);
  
  // Text color - neutral dark shade with better contrast
  const text = createNeutralDarkColor(baseRgb);
  
  // Accent color - complementary or analogous for better visual interest
  const accent = createAccentColor(baseColor);
  
  const transparent = "#00000000";
  
  // Create initial palette
  let palette = {
    background,
    secondaryBg,
    secondary,
    primary,
    text, 
    accent,
    transparent
  };
  
  // Ensure good contrast for all combinations
  palette = ensureContrastRequirements(palette);
  
  return palette;
}
