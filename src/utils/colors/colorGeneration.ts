import { ColorPalette } from './types';
import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex, adjustBrightness } from './colorConversion';
import { checkContrast } from './colorValidation';
import { getAdditionalColors } from './promptParsing';
import { 
  detectHarmonyPattern, 
  createHarmonyColor, 
  applyColorRelationshipRules,
  HarmonyPattern 
} from './colorHarmonyRules';

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

// Create a monochromatic accent color
function createMonochromaticAccent(baseColor: string): string {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return "#467FF7"; // Default
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  // Keep the same hue, increase saturation, adjust lightness
  const newSat = Math.min(100, hsl.s + 20);
  const newLight = hsl.l > 50 ? Math.max(30, hsl.l - 25) : Math.min(85, hsl.l + 25);
  
  const newRgb = hslToRgb(hsl.h, newSat, newLight);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

// Create an analogous accent color (adjacent on color wheel)
function createAnalogousAccent(baseColor: string): string {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return "#467FF7"; // Default
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  // Shift hue by 30 degrees
  const newHue = (hsl.h + 30) % 360;
  const newSat = Math.min(100, hsl.s + 10);
  const newLight = Math.min(Math.max(45, hsl.l), 65);
  
  const newRgb = hslToRgb(newHue, newSat, newLight);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

// Create a triadic accent color (120 degrees on color wheel)
function createTriadicAccent(baseColor: string): string {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return "#467FF7"; // Default
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  // Shift hue by 120 degrees
  const newHue = (hsl.h + 120) % 360;
  const newSat = Math.min(100, hsl.s + 5);
  const newLight = Math.min(Math.max(45, hsl.l + 5), 65);
  
  const newRgb = hslToRgb(newHue, newSat, newLight);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

// Create a tetradic accent color (rectangle on color wheel)
function createTetradicAccent(baseColor: string): string {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return "#467FF7"; // Default
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  // Shift hue by 60 degrees
  const newHue = (hsl.h + 60) % 360;
  const newSat = Math.min(100, hsl.s + 10);
  const newLight = Math.min(Math.max(45, hsl.l), 65);
  
  const newRgb = hslToRgb(newHue, newSat, newLight);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

// Create a complementary accent color (opposite on color wheel)
function createComplementaryAccent(baseColor: string): string {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return "#467FF7"; // Default
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  // Shift hue by 180 degrees for complementary
  const newHue = (hsl.h + 180) % 360;
  const newSat = Math.min(100, hsl.s + 15);
  const newLight = Math.min(Math.max(45, hsl.l + 10), 65);
  
  const newRgb = hslToRgb(newHue, newSat, newLight);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

// Create an accent color that complements the base color
function createAccentColor(baseColor: string, prompt: string = ''): string {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return "#467FF7"; // Default to our accent color
  
  // Detect themes and harmony patterns from prompt
  const harmonyPattern = detectHarmonyPattern(prompt);
  
  // Detect specific theme requests
  const isMinimalist = prompt.match(/(minimalist|simple|clean)/gi);
  const isBlackWhite = prompt.match(/(black[\s-]?and[\s-]?white|monochrome|grayscale|b&w)/gi);
  const isColorful = prompt.match(/(colorful|vibrant|multi-?colored|bright)/gi);
  const isPastel = prompt.match(/(pastel|soft|gentle|light)/gi);
  
  // Apply theme-based color strategies
  if (isBlackWhite) {
    return "#000000"; // Black accent for black and white themes
  }
  
  if (isPastel) {
    // Create a pastel accent
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const newHue = (hsl.h + 35) % 360;
    const newRgb = hslToRgb(newHue, 55, 80);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  }
  
  if (isColorful) {
    // Create a more saturated, vibrant accent
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const newHue = (hsl.h + 120) % 360;
    const newRgb = hslToRgb(newHue, 90, 60);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  }
  
  // Check for any additional colors mentioned in the prompt
  const additionalColors = getAdditionalColors(prompt);
  if (additionalColors.length > 1) {
    // If multiple colors are mentioned, use the second one as accent
    return additionalColors[1];
  }
  
  // Create a harmony color based on the detected pattern
  return createHarmonyColor(baseColor, harmonyPattern);
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
export function generateHarmonizedPalette(baseColor: string, prompt: string = ''): ColorPalette {
  const baseRgb = hexToRgb(baseColor) || { r: 44, g: 82, b: 130 }; // Default to navy blue
  
  // First try to use our structured color relationship rules
  const relationshipPalette = applyColorRelationshipRules(baseColor, prompt);
  
  // Get multiple colors from the prompt if available
  const additionalColors = getAdditionalColors(prompt);
  
  // Customize the palette based on additional colors or prompt instructions
  let palette = { ...relationshipPalette };
  
  // Use a secondary mentioned color for accent if available,
  // otherwise use the one from relationship rules
  if (additionalColors.length > 1) {
    palette.accent = additionalColors[1];
  }
  
  // Ensure good contrast for all combinations
  palette = ensureContrastRequirements(palette);
  
  return palette;
}
