
import { hexToRgb, adjustBrightness, rgbToHex, rgbToHsl, hslToRgb } from './colorConversion';

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
