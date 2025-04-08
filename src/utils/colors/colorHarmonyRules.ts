
import { ColorPalette } from './types';
import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex } from './colorConversion';

/**
 * Rules for Color Harmony
 * 
 * This file contains the rules and instructions for creating harmonious color palettes.
 * It defines different color harmony patterns and how they relate to each other on the color wheel.
 */

// Color Harmony Pattern Types
export enum HarmonyPattern {
  MONOCHROMATIC = 'monochromatic',
  ANALOGOUS = 'analogous',
  TRIADIC = 'triadic',
  TETRADIC = 'tetradic',
  COMPLEMENTARY = 'complementary',
  SPLIT_COMPLEMENTARY = 'split-complementary'
}

// Rules for color relationship angles on the color wheel
export const harmonyAngles = {
  [HarmonyPattern.MONOCHROMATIC]: 0,      // Same hue, different saturation/lightness
  [HarmonyPattern.ANALOGOUS]: 30,         // Adjacent colors (30° apart)
  [HarmonyPattern.TRIADIC]: 120,          // Three evenly spaced colors (120° apart)
  [HarmonyPattern.TETRADIC]: 60,          // Rectangle pattern on the color wheel
  [HarmonyPattern.COMPLEMENTARY]: 180,    // Opposite colors on the color wheel
  [HarmonyPattern.SPLIT_COMPLEMENTARY]: 150 // Complementary with 30° offset
};

// Theme keywords that map to harmony patterns
export const themeToHarmonyMapping = {
  // Monochromatic patterns
  monochromatic: HarmonyPattern.MONOCHROMATIC,
  monochrome: HarmonyPattern.MONOCHROMATIC,
  'same color': HarmonyPattern.MONOCHROMATIC,
  similar: HarmonyPattern.MONOCHROMATIC,
  shades: HarmonyPattern.MONOCHROMATIC,
  'single color': HarmonyPattern.MONOCHROMATIC,
  
  // Analogous patterns
  analogous: HarmonyPattern.ANALOGOUS,
  adjacent: HarmonyPattern.ANALOGOUS,
  harmonious: HarmonyPattern.ANALOGOUS,
  'side by side': HarmonyPattern.ANALOGOUS,
  
  // Triadic patterns
  triadic: HarmonyPattern.TRIADIC,
  three: HarmonyPattern.TRIADIC,
  triplet: HarmonyPattern.TRIADIC,
  triangle: HarmonyPattern.TRIADIC,
  
  // Tetradic patterns
  tetradic: HarmonyPattern.TETRADIC,
  square: HarmonyPattern.TETRADIC,
  rectangle: HarmonyPattern.TETRADIC,
  four: HarmonyPattern.TETRADIC,
  
  // Complementary patterns
  complementary: HarmonyPattern.COMPLEMENTARY,
  opposite: HarmonyPattern.COMPLEMENTARY,
  contrast: HarmonyPattern.COMPLEMENTARY,
  opposing: HarmonyPattern.COMPLEMENTARY,
  
  // Split complementary patterns
  'split complementary': HarmonyPattern.SPLIT_COMPLEMENTARY,
  'split': HarmonyPattern.SPLIT_COMPLEMENTARY
};

// Style patterns mapping to their corresponding harmony patterns
export const styleToHarmonyMapping = {
  minimalist: HarmonyPattern.MONOCHROMATIC,
  clean: HarmonyPattern.MONOCHROMATIC,
  simple: HarmonyPattern.MONOCHROMATIC,
  elegant: HarmonyPattern.ANALOGOUS,
  sophisticated: HarmonyPattern.ANALOGOUS,
  vibrant: HarmonyPattern.TRIADIC,
  colorful: HarmonyPattern.TRIADIC,
  energetic: HarmonyPattern.COMPLEMENTARY,
  dynamic: HarmonyPattern.COMPLEMENTARY,
  balanced: HarmonyPattern.ANALOGOUS
};

/**
 * Detect harmony pattern from a text prompt
 * Analyzes keywords to determine the intended color relationship
 */
export function detectHarmonyPattern(prompt: string): HarmonyPattern {
  // Convert to lowercase for case-insensitive matching
  const lowercasePrompt = prompt.toLowerCase();
  
  // Check for direct harmony pattern mentions
  for (const [keyword, pattern] of Object.entries(themeToHarmonyMapping)) {
    if (lowercasePrompt.includes(keyword)) {
      return pattern;
    }
  }
  
  // Check for style pattern mentions
  for (const [style, pattern] of Object.entries(styleToHarmonyMapping)) {
    if (lowercasePrompt.includes(style)) {
      return pattern;
    }
  }
  
  // Default to a balanced pattern if no specific pattern is detected
  return HarmonyPattern.ANALOGOUS;
}

/**
 * Create a color following a specific harmony pattern relative to the base color
 */
export function createHarmonyColor(baseColor: string, pattern: HarmonyPattern): string {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return "#467FF7"; // Default to our accent color
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  // Apply the specific angle shift based on the harmony pattern
  const angle = harmonyAngles[pattern];
  const newHue = (hsl.h + angle) % 360;
  
  // Adjust saturation and lightness based on the pattern
  let newSat = hsl.s;
  let newLight = hsl.l;
  
  switch(pattern) {
    case HarmonyPattern.MONOCHROMATIC:
      // Same hue, adjust saturation and lightness
      newSat = Math.min(100, hsl.s + 15);
      newLight = hsl.l > 50 ? Math.max(35, hsl.l - 20) : Math.min(75, hsl.l + 20);
      break;
      
    case HarmonyPattern.ANALOGOUS:
      // Similar hue, slight saturation increase
      newSat = Math.min(100, hsl.s + 10);
      newLight = Math.min(Math.max(45, hsl.l), 65);
      break;
      
    case HarmonyPattern.TRIADIC:
      // Higher saturation for triadic
      newSat = Math.min(100, hsl.s + 15);
      newLight = Math.min(Math.max(40, hsl.l + 5), 65);
      break;
      
    case HarmonyPattern.TETRADIC:
      // Balanced saturation for tetradic
      newSat = Math.min(100, hsl.s + 5);
      newLight = Math.min(Math.max(40, hsl.l), 70);
      break;
      
    case HarmonyPattern.COMPLEMENTARY:
      // Higher saturation for complementary
      newSat = Math.min(100, hsl.s + 20);
      newLight = Math.min(Math.max(45, hsl.l), 60);
      break;
      
    case HarmonyPattern.SPLIT_COMPLEMENTARY:
      // Moderate saturation for split complementary
      newSat = Math.min(100, hsl.s + 15);
      newLight = Math.min(Math.max(40, hsl.l + 10), 65);
      break;
  }
  
  const newRgb = hslToRgb(newHue, newSat, newLight);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Apply color palette relationship rules based on a primary color
 * This generates related colors following color theory principles
 */
export function applyColorRelationshipRules(primaryColor: string, prompt: string = ''): ColorPalette {
  // Detect the desired harmony pattern from the prompt
  const harmonyPattern = detectHarmonyPattern(prompt);
  
  // Create colors based on color theory relationships
  const accent = createHarmonyColor(primaryColor, harmonyPattern);
  
  // Always use white for the main background (per requirements)
  const background = "#FFFFFF";
  
  // Create a light version for secondary background with subtle connection to primary
  const primaryRgb = hexToRgb(primaryColor) || { r: 44, g: 82, b: 130 };
  const secondaryBgRgb = {
    r: Math.round(primaryRgb.r * 0.1 + 255 * 0.9),
    g: Math.round(primaryRgb.g * 0.1 + 255 * 0.9),
    b: Math.round(primaryRgb.b * 0.1 + 255 * 0.9)
  };
  const secondaryBg = rgbToHex(secondaryBgRgb.r, secondaryBgRgb.g, secondaryBgRgb.b);
  
  // Create a dark version for secondary (following color relationship rules)
  let secondary;
  
  if (harmonyPattern === HarmonyPattern.MONOCHROMATIC) {
    // For monochromatic, derive from primary but much darker
    const primaryHsl = rgbToHsl(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    const secondaryRgb = hslToRgb(primaryHsl.h, primaryHsl.s * 0.9, primaryHsl.l * 0.3);
    secondary = rgbToHex(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
  } else {
    // For other patterns, use a neutral dark that still has hint of primary
    secondary = "#1A202C"; // Start with dark slate
    
    // Add a subtle hint of the primary hue
    const primaryHsl = rgbToHsl(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    const secondaryRgb = hslToRgb(primaryHsl.h, 20, 15); // Low saturation, very dark
    secondary = rgbToHex(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
  }
  
  // Text color - neutral dark with connection to primary
  const primaryHsl = rgbToHsl(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  const textRgb = hslToRgb(primaryHsl.h, 10, 20); // Very low saturation, dark
  const text = rgbToHex(textRgb.r, textRgb.g, textRgb.b);
  
  return {
    background,
    secondaryBg,
    secondary,
    primary: primaryColor,
    text,
    accent,
    transparent: "#00000000"
  };
}
