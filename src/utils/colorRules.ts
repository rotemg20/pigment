
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
  background: "#FFFFFF",
  secondaryBg: "#F8F9FA",
  secondary: "#212529",
  primary: "#0D6EFD",
  text: "#212529",
  accent: "#0D6EFD",
  transparent: "#00000000"
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

// Validate a color palette against the rules
export function validatePalette(palette: ColorPalette): boolean {
  // Check background contrasts
  const backgroundChecks = checkContrast(palette.background, palette.text) &&
                          checkContrast(palette.background, palette.primary) &&
                          checkContrast(palette.background, palette.accent);

  // Check secondary background contrasts
  const secondaryBgChecks = checkContrast(palette.secondaryBg, palette.text) &&
                           checkContrast(palette.secondaryBg, palette.primary);

  // Check secondary contrasts
  const secondaryChecks = checkContrast(palette.secondary, palette.background) &&
                         checkContrast(palette.secondary, palette.secondaryBg);

  return backgroundChecks && secondaryBgChecks && secondaryChecks;
}
