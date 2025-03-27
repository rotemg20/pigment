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

// NEW FUNCTION: Adjust a color to meet contrast requirements with a background
export function adjustColorForContrast(color: string, backgroundColor: string, minContrastRatio: number = 4.5): string {
  const colorRgb = hexToRgb(color);
  const bgRgb = hexToRgb(backgroundColor);
  
  if (!colorRgb || !bgRgb) return color;
  
  const initialRatio = getContrastRatio(color, backgroundColor);
  
  // If already meets requirements, return unchanged
  if (initialRatio >= minContrastRatio) return color;
  
  const bgLuminance = calculateLuminance(backgroundColor);
  
  // Determine if we need to darken or lighten the color
  const shouldDarken = bgLuminance > 0.5;
  
  let adjustedColor = color;
  let currentRatio = initialRatio;
  let attempts = 0;
  const maxAttempts = 20; // Prevent infinite loops
  
  // Step size for RGB adjustments
  const step = shouldDarken ? -5 : 5;
  
  // Clone the RGB values
  let r = colorRgb.r;
  let g = colorRgb.g;
  let b = colorRgb.b;
  
  // Incrementally adjust the color until it meets contrast requirements
  while (currentRatio < minContrastRatio && attempts < maxAttempts) {
    // Adjust RGB values
    r = Math.max(0, Math.min(255, r + step));
    g = Math.max(0, Math.min(255, g + step));
    b = Math.max(0, Math.min(255, b + step));
    
    // Convert back to hex
    adjustedColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    
    // Recalculate contrast ratio
    currentRatio = getContrastRatio(adjustedColor, backgroundColor);
    attempts++;
  }
  
  return adjustedColor;
}

// NEW FUNCTION: Fix all color accessibility issues in a palette
export function fixPaletteAccessibility(palette: ColorPalette): ColorPalette {
  const fixedPalette = { ...palette };
  
  // Ensure background is white (required by specs)
  fixedPalette.background = "#FFFFFF";
  
  // Fix text contrast against both backgrounds
  fixedPalette.text = adjustColorForContrast(palette.text, palette.background);
  if (!checkContrast(fixedPalette.text, palette.secondaryBg)) {
    // If text needs adjustment for secondary background too, find a color that works for both
    const textForSecondaryBg = adjustColorForContrast(fixedPalette.text, palette.secondaryBg);
    // Choose the darkest option to ensure contrast with both backgrounds
    fixedPalette.text = calculateLuminance(fixedPalette.text) < calculateLuminance(textForSecondaryBg) 
      ? fixedPalette.text : textForSecondaryBg;
  }
  
  // Fix primary color contrast
  fixedPalette.primary = adjustColorForContrast(palette.primary, palette.background);
  if (!checkContrast(fixedPalette.primary, palette.secondaryBg)) {
    const primaryForSecondaryBg = adjustColorForContrast(fixedPalette.primary, palette.secondaryBg);
    fixedPalette.primary = calculateLuminance(fixedPalette.primary) < calculateLuminance(primaryForSecondaryBg) 
      ? fixedPalette.primary : primaryForSecondaryBg;
  }
  
  // Fix accent color contrast
  fixedPalette.accent = adjustColorForContrast(palette.accent, palette.background);
  
  return fixedPalette;
}
