
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
  accent: "#3182CE",       // Blue for interactive elements
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
  
  // Create a light version for secondary background
  const secondaryBg = createLightColor(baseRgb, 0.95);
  
  // Create a dark version for secondary (dark containers)
  const secondary = createDarkColor(baseRgb, 0.2);
  
  // Text color - neutral dark shade
  const text = createDarkColor(baseRgb, 0.25);
  
  // Accent color - slightly brighter version of primary or complementary
  const accent = adjustBrightness(baseColor, 20);
  
  const transparent = "#00000000";
  
  // Return the palette
  return {
    background,
    secondaryBg,
    secondary,
    primary,
    text, 
    accent,
    transparent
  };
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
  
  // Check secondary against other backgrounds
  const secondaryContrast = checkContrast(palette.secondary, palette.background) &&
                           checkContrast(palette.secondary, palette.secondaryBg);
  
  return textOnMainBg && textOnSecondaryBg && 
         primaryOnMainBg && primaryOnSecondaryBg && 
         accentOnMainBg && secondaryContrast;
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
  // Look for specific color mentions
  const colorMentions = prompt.match(/(blue|red|green|purple|pink|orange|yellow|teal|cyan|magenta|brown|gray|black|white|dark|light|bright|pastel|vibrant|muted)/gi);
  
  if (!colorMentions || colorMentions.length === 0) {
    return null;
  }
  
  // Basic color mapping
  const colorMap: Record<string, string> = {
    blue: "#2B6CB0",
    red: "#C53030",
    green: "#2F855A",
    purple: "#6B46C1",
    pink: "#D53F8C",
    orange: "#DD6B20",
    yellow: "#D69E2E",
    teal: "#319795",
    cyan: "#00A3C4",
    magenta: "#B83280",
    brown: "#8B4513",
    gray: "#718096",
    black: "#1A202C",
    white: "#FFFFFF"
  };
  
  // Modifiers
  const isDark = prompt.match(/(dark|deep|rich)/gi);
  const isLight = prompt.match(/(light|pale|soft)/gi);
  const isVibrant = prompt.match(/(vibrant|bright|bold)/gi);
  const isPastel = prompt.match(/(pastel|gentle|subtle)/gi);
  
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
    // Increase saturation (simplified approach)
    const rgb = hexToRgb(hexColor);
    if (rgb) {
      // Find the average and adjust values to increase saturation
      const avg = (rgb.r + rgb.g + rgb.b) / 3;
      rgb.r = Math.min(255, Math.max(0, rgb.r > avg ? rgb.r + 20 : rgb.r - 20));
      rgb.g = Math.min(255, Math.max(0, rgb.g > avg ? rgb.g + 20 : rgb.g - 20));
      rgb.b = Math.min(255, Math.max(0, rgb.b > avg ? rgb.b + 20 : rgb.b - 20));
      hexColor = `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)}`;
    }
  } else if (isPastel) {
    // Make it pastel (mix with white)
    const rgb = hexToRgb(hexColor);
    if (rgb) {
      rgb.r = Math.round(rgb.r * 0.7 + 255 * 0.3);
      rgb.g = Math.round(rgb.g * 0.7 + 255 * 0.3);
      rgb.b = Math.round(rgb.b * 0.7 + 255 * 0.3);
      hexColor = `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)}`;
    }
  }
  
  return hexColor;
}
