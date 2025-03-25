
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
  if (!rgb) return "#3182CE"; // Default accent
  
  // Create a complementary or analogous color
  // This is a simplified approach - could be improved with HSL conversions
  
  // Get the dominant channel
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  
  // If red is dominant, create a blue-green accent
  if (max === rgb.r) {
    return `#${((1 << 24) + (50 << 16) + (150 << 8) + 220).toString(16).slice(1)}`;
  }
  // If green is dominant, create a purple accent
  else if (max === rgb.g) {
    return `#${((1 << 24) + (180 << 16) + (80 << 8) + 220).toString(16).slice(1)}`;
  }
  // If blue is dominant, create an orange-yellow accent
  else {
    return `#${((1 << 24) + (240 << 16) + (150 << 8) + 50).toString(16).slice(1)}`;
  }
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
