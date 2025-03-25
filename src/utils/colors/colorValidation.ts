
import { ColorPalette } from './types';
import { hexToRgb } from './colorConversion';

// Calculate relative luminance of a color
export function calculateLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;
  
  const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(val => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Check if a color meets contrast requirements (WCAG AA)
export function checkContrast(color1: string, color2: string): boolean {
  const luminance1 = calculateLuminance(color1);
  const luminance2 = calculateLuminance(color2);
  
  const ratio = (Math.max(luminance1, luminance2) + 0.05) /
                (Math.min(luminance1, luminance2) + 0.05);
  
  return ratio >= 4.5; // WCAG AA standard for normal text
}

// Get contrast ratio between two colors (for UI display)
export function getContrastRatio(color1: string, color2: string): number {
  const luminance1 = calculateLuminance(color1);
  const luminance2 = calculateLuminance(color2);
  
  return ((Math.max(luminance1, luminance2) + 0.05) /
         (Math.min(luminance1, luminance2) + 0.05)).toFixed(2) as unknown as number;
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
