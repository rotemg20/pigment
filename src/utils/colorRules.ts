import { type ClassValue } from "clsx";

export interface ColorPalette {
  background: string;      // Main background (white)
  secondaryBg: string;    // Secondary background (light)
  secondary: string;      // Dark background for containers
  primary: string;        // Headings and important elements
  text: string;          // Body text
  accent: string;        // Interactive elements
  transparent: string;   // Transparent elements
}

export const defaultPalette: ColorPalette = {
  background: "#FFFFFF",   // Always white per requirements
  secondaryBg: "#F5F7FA",  // Light secondary background
  secondary: "#1A202C",    // Dark background for containers
  primary: "#2C5282",      // Navy blue for headings and important elements
  text: "#2D3748",         // Dark slate for body text
  accent: "#467FF7",       // Updated accent color
  transparent: "#00000000" // Required by specs
};

// Check if a color meets contrast requirements (WCAG AA)
export function checkContrast(color1: string, color2: string): boolean {
  const luminance1 = calculateLuminance(color1);
  const luminance2 = calculateLuminance(color2);
  
  const ratio = (Math.max(luminance1, luminance2) + 0.05) /
                (Math.min(luminance1, luminance2) + 0.05);
  
  return ratio >= 4.5; // WCAG AA standard for normal text
}

// Calculate relative luminance of a color
function calculateLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;
  
  const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(val => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Convert hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

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

// Helper function to convert RGB to HSL
function rgbToHsl(r: number, g: number, b: number): { h: number, s: number, l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h *= 60;
  }
  
  return { h, s: s * 100, l: l * 100 };
}

// Helper function to convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): { r: number, g: number, b: number } {
  s /= 100;
  l /= 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  
  let r = 0, g = 0, b = 0;
  
  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
  
  return { 
    r: Math.round((r + m) * 255), 
    g: Math.round((g + m) * 255), 
    b: Math.round((b + m) * 255) 
  };
}

// Helper function to convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
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

// Adjust brightness of a hex color
function adjustBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = percent / 100;
  
  let r = rgb.r;
  let g = rgb.g;
  let b = rgb.b;
  
  if (factor > 0) {
    // Brighter
    r = r + (255 - r) * factor;
    g = g + (255 - g) * factor;
    b = b + (255 - b) * factor;
  } else {
    // Darker
    r = r * (1 + factor);
    g = g * (1 + factor);
    b = b * (1 + factor);
  }
  
  r = Math.min(255, Math.max(0, Math.round(r)));
  g = Math.min(255, Math.max(0, Math.round(g)));
  b = Math.min(255, Math.max(0, Math.round(b)));
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Validate a color palette against the rules
export function validatePalette(palette: ColorPalette): boolean {
  // Main background should be white
  if (palette.background !== "#FFFFFF") {
    return false;
  }
  
  // Check text contrasts against backgrounds
  const textOnMainBg = checkContrast(palette.background, palette.text);
  const textOnSecondaryBg = checkContrast(palette.secondaryBg, palette.text);
  
  // Check primary contrasts against backgrounds
  const primaryOnMainBg = checkContrast(palette.background, palette.primary);
  const primaryOnSecondaryBg = checkContrast(palette.secondaryBg, palette.primary);
  
  // Check accent contrasts against backgrounds
  const accentOnMainBg = checkContrast(palette.background, palette.accent);
  
  return textOnMainBg && textOnSecondaryBg && 
         primaryOnMainBg && primaryOnSecondaryBg && 
         accentOnMainBg;
}

// Get contrast ratio between two colors (for UI display)
export function getContrastRatio(color1: string, color2: string): number {
  const luminance1 = calculateLuminance(color1);
  const luminance2 = calculateLuminance(color2);
  
  return ((Math.max(luminance1, luminance2) + 0.05) /
         (Math.min(luminance1, luminance2) + 0.05)).toFixed(2) as unknown as number;
}

// Parse an input prompt to extract color information
export function parseColorPrompt(prompt: string): string | null {
  // Enhanced color detection
  const colorMentions = prompt.match(/(blue|navy|aqua|turquoise|teal|cyan|azure|indigo|red|maroon|crimson|ruby|scarlet|green|emerald|lime|olive|mint|purple|violet|lavender|lilac|magenta|pink|rose|fuschia|orange|coral|peach|amber|yellow|gold|brown|tan|beige|sienna|black|white|gray|grey|silver|dark|light|bright|pastel|vibrant|muted|cool|warm)/gi);
  
  if (!colorMentions || colorMentions.length === 0) {
    return null;
  }
  
  // Enhanced accent color detection - check if user specifically mentions accent colors
  const accentMention = prompt.match(/(accent|highlight|button|interactive) (color|tone|shade)? (of|as|like|should be) (blue|navy|aqua|turquoise|teal|cyan|azure|indigo|red|maroon|crimson|ruby|scarlet|green|emerald|lime|olive|mint|purple|violet|lavender|lilac|magenta|pink|rose|fuschia|orange|coral|peach|amber|yellow|gold|brown|tan|beige|sienna|black|white|gray|grey|silver)/i);
  
  if (accentMention) {
    // If user specifically requests an accent color, use that
    const accentColorName = accentMention[4].toLowerCase();
    const accentColorMap: Record<string, string> = {
      blue: "#467FF7", // Our new default accent
      navy: "#3B5998",
      aqua: "#00D1B2",
      turquoise: "#0DB4B9",
      teal: "#20C997",
      cyan: "#17A2B8",
      azure: "#0078D7",
      indigo: "#6610F2",
      red: "#E53E3E",
      maroon: "#85182A",
      crimson: "#DC2626",
      ruby: "#9B1C1C",
      scarlet: "#E53E3E",
      green: "#38A169",
      emerald: "#059669",
      lime: "#84CC16",
      olive: "#3D9970",
      mint: "#10B981",
      purple: "#805AD5",
      violet: "#7C3AED",
      lavender: "#9F7AEA",
      lilac: "#A78BFA",
      magenta: "#D53F8C",
      pink: "#EC4899",
      rose: "#F43F5E",
      fuschia: "#D946EF",
      orange: "#ED8936",
      coral: "#F97316",
      peach: "#FDBA74",
      amber: "#F59E0B",
      yellow: "#ECC94B",
      gold: "#D69E2E"
    };
    
    return accentColorMap[accentColorName] || "#467FF7";
  }
  
  // Expanded color mapping
  const colorMap: Record<string, string> = {
    // Blues
    blue: "#2B6CB0",
    navy: "#1A365D",
    aqua: "#00B5D8",
    turquoise: "#0D9488",
    teal: "#319795",
    cyan: "#00A3C4",
    azure: "#4299E1",
    indigo: "#4C51BF",
    
    // Reds
    red: "#C53030",
    maroon: "#85182A",
    crimson: "#DC2626",
    ruby: "#9B1C1C",
    scarlet: "#E53E3E",
    
    // Greens
    green: "#2F855A",
    emerald: "#047857",
    lime: "#65A30D",
    olive: "#5F9EA0",
    mint: "#10B981",
    
    // Purples
    purple: "#6B46C1",
    violet: "#7C3AED",
    lavender: "#8B5CF6",
    lilac: "#A78BFA",
    magenta: "#B83280",
    
    // Pinks
    pink: "#D53F8C",
    rose: "#F43F5E",
    fuschia: "#D946EF",
    
    // Oranges and Yellows
    orange: "#DD6B20",
    coral: "#F97316",
    peach: "#FDBA74",
    amber: "#F59E0B",
    yellow: "#D69E2E",
    gold: "#B7791F",
    
    // Browns
    brown: "#8B4513",
    tan: "#D2B48C",
    beige: "#F5F5DC",
    sienna: "#A0522D",
    
    // Neutrals
    black: "#1A202C",
    white: "#FFFFFF",
    gray: "#718096",
    grey: "#718096",
    silver: "#CBD5E0"
  };
  
  // Analyze modifiers
  const isDark = prompt.match(/(dark|deep|rich|midnight|charcoal)/gi);
  const isLight = prompt.match(/(light|pale|soft|pastel)/gi);
  const isVibrant = prompt.match(/(vibrant|bright|bold|vivid|intense|saturated)/gi);
  const isPastel = prompt.match(/(pastel|gentle|subtle|muted|soft)/gi);
  const isCool = prompt.match(/(cool|cold|icy|winter)/gi);
  const isWarm = prompt.match(/(warm|hot|fiery|summer)/gi);
  
  // Analyze theme requests
  const isCorporate = prompt.match(/(corporate|professional|business|formal)/gi);
  const isPlayful = prompt.match(/(playful|fun|cheerful|happy|joyful)/gi);
  const isCalm = prompt.match(/(calm|peaceful|relaxing|serene|tranquil)/gi);
  const isEnergetic = prompt.match(/(energetic|dynamic|active|lively)/gi);
  
  // Get the primary color mention
  let baseColor = colorMentions[0].toLowerCase();
  let hexColor = colorMap[baseColor] || "#2B6CB0"; // Default to blue
  
  // Apply modifiers
  if (isDark) {
    hexColor = adjustBrightness(hexColor, -30);
  } else if (isLight) {
    hexColor = adjustBrightness(hexColor, 30);
  }
  
  if (isVibrant) {
    // Increase saturation
    const rgb = hexToRgb(hexColor);
    if (rgb) {
      // Find the average and adjust values to increase saturation
      const avg = (rgb.r + rgb.g + rgb.b) / 3;
      rgb.r = Math.min(255, Math.max(0, rgb.r > avg ? rgb.r + 30 : rgb.r - 20));
      rgb.g = Math.min(255, Math.max(0, rgb.g > avg ? rgb.g + 30 : rgb.g - 20));
      rgb.b = Math.min(255, Math.max(0, rgb.b > avg ? rgb.b + 30 : rgb.b - 20));
      hexColor = `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)}`;
    }
  } else if (isPastel) {
    // Make it pastel (mix with white)
    const rgb = hexToRgb(hexColor);
    if (rgb) {
      rgb.r = Math.round(rgb.r * 0.6 + 255 * 0.4);
      rgb.g = Math.round(rgb.g * 0.6 + 255 * 0.4);
      rgb.b = Math.round(rgb.b * 0.6 + 255 * 0.4);
      hexColor = `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)}`;
    }
  }
  
  // Apply cool/warm adjustments
  if (isCool) {
    // Shift towards blue
    const rgb = hexToRgb(hexColor);
    if (rgb) {
      rgb.r = Math.max(0, rgb.r - 20);
      rgb.b = Math.min(255, rgb.b + 20);
      hexColor = `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)}`;
    }
  } else if (isWarm) {
    // Shift towards red/yellow
    const rgb = hexToRgb(hexColor);
    if (rgb) {
      rgb.r = Math.min(255, rgb.r + 20);
      rgb.g = Math.min(255, rgb.g + 10);
      rgb.b = Math.max(0, rgb.b - 10);
      hexColor = `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)}`;
    }
  }
  
  return hexColor;
}
