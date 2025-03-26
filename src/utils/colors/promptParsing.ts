
import { hexToRgb, adjustBrightness, rgbToHex, rgbToHsl, hslToRgb } from './colorConversion';

// Create a global variable to store mentioned colors
export let allMentionedColors: string[] = [];

// Parse an input prompt to extract color information
export function parseColorPrompt(prompt: string): string | null {
  // Check if the user provided a specific hex code
  const hexMatch = prompt.match(/#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/g);
  if (hexMatch) {
    // Use the first hex code mentioned as the primary color
    const hexColor = hexMatch[0];
    
    // Store all hex codes for palette generation
    allMentionedColors = hexMatch.map(hex => {
      // Normalize 3-digit hex to 6-digit if needed
      if (hex.length === 4) {
        const r = hex[1], g = hex[2], b = hex[3];
        return `#${r}${r}${g}${g}${b}${b}`;
      }
      return hex;
    });
    
    return hexColor;
  }
  
  // Check for themed color palettes
  const themeMatch = parseTheme(prompt);
  if (themeMatch) {
    return themeMatch;
  }
  
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
  
  // If multiple colors are mentioned, return the first one for primary
  // We'll handle the multiple colors in the palette generation function
  
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
  
  // Get all distinct color names from the prompt (excluding modifiers)
  const distinctColorNames = colorMentions.filter(color => 
    !['dark', 'light', 'bright', 'pastel', 'vibrant', 'muted', 'cool', 'warm'].includes(color.toLowerCase())
  );
  
  // Store all distinct colors for palette generation
  allMentionedColors = distinctColorNames.map(name => 
    colorMap[name.toLowerCase()] || "#2B6CB0"
  );
  
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
  let baseColor = distinctColorNames[0]?.toLowerCase() || "blue";
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

// Helper function to detect and process themed color palettes
function parseTheme(prompt: string): string | null {
  // Theme patterns to recognize
  const themes = [
    {
      name: 'forest',
      pattern: /(forest|woodland|jungle|nature|trees|woods)/gi,
      primary: '#2D6A4F',
      colors: ['#2D6A4F', '#40916C', '#52B788', '#74C69D', '#95D5B2', '#081C15', '#1B4332']
    },
    {
      name: 'ocean',
      pattern: /(ocean|sea|marine|beach|coastal|aquatic|water)/gi,
      primary: '#1A73E8',
      colors: ['#1A73E8', '#03045E', '#0077B6', '#00B4D8', '#90E0EF', '#CAF0F8', '#023E8A']
    },
    {
      name: 'sunset',
      pattern: /(sunset|dusk|evening|twilight)/gi,
      primary: '#FF7B00',
      colors: ['#FF7B00', '#FFB703', '#FB8500', '#F48C06', '#E85D04', '#DC2F02', '#6A040F']
    },
    {
      name: 'girly',
      pattern: /(girly|feminine|cute|princess|pink)/gi,
      primary: '#FF70E5',
      colors: ['#FF70E5', '#FFB3DA', '#FEC5E5', '#FBD3E9', '#FF9CEE', '#F195D3', '#CB6CE6']
    },
    {
      name: 'monochrome',
      pattern: /(monochrome|greyscale|black and white|b&w)/gi,
      primary: '#333333',
      colors: ['#333333', '#4F4F4F', '#828282', '#BDBDBD', '#E0E0E0', '#F2F2F2', '#000000']
    },
    {
      name: 'earthy',
      pattern: /(earthy|earth|soil|clay|terracotta|natural|organic)/gi,
      primary: '#6B705C',
      colors: ['#6B705C', '#A5A58D', '#B7B7A4', '#CB997E', '#DDBEA9', '#FFE8D6', '#5F4842']
    },
    {
      name: 'autumn',
      pattern: /(autumn|fall|harvest|leaves)/gi,
      primary: '#9C6644',
      colors: ['#9C6644', '#BC6C25', '#DDA15E', '#FEFAE0', '#FAEDCD', '#D4A373', '#E76F51']
    },
    {
      name: 'winter',
      pattern: /(winter|snow|ice|cold|frost|freezing)/gi,
      primary: '#CAF0F8',
      colors: ['#CAF0F8', '#ADE8F4', '#90E0EF', '#48CAE4', '#00B4D8', '#0096C7', '#023E8A']
    },
    {
      name: 'spring',
      pattern: /(spring|bloom|blossom|floral|flower)/gi,
      primary: '#95D5B2',
      colors: ['#95D5B2', '#74C69D', '#52B788', '#B5E48C', '#D9ED92', '#FFD166', '#FF99C8']
    },
    {
      name: 'summer',
      pattern: /(summer|sunny|sunshine|hot|warm)/gi,
      primary: '#FFB703',
      colors: ['#FFB703', '#FB8500', '#F48C06', '#FDC500', '#FED9B7', '#00AFB9', '#0081A7']
    },
    {
      name: 'neon',
      pattern: /(neon|glow|glowing|bright|vibrant|electric)/gi,
      primary: '#39FF14',
      colors: ['#39FF14', '#00FFFF', '#FF00FF', '#FE00FE', '#FF3131', '#FFFF00', '#FF10F0']
    },
    {
      name: 'pastel',
      pattern: /(pastel|soft|gentle|light)/gi,
      primary: '#FFD1DC',
      colors: ['#FFD1DC', '#FFCAD4', '#F3ABB6', '#FAE0E4', '#B4F8C8', '#A0E7E5', '#B8C0FF']
    },
    {
      name: 'retro',
      pattern: /(retro|vintage|old-?school|classic|80s|90s)/gi,
      primary: '#FFB347',
      colors: ['#FFB347', '#E4572E', '#FFC914', '#FFF689', '#A0E8AF', '#75B9BE', '#5A189A']
    },
    {
      name: 'cyberpunk',
      pattern: /(cyberpunk|cyber|neon|futurist|tech)/gi,
      primary: '#F706CF',
      colors: ['#F706CF', '#903BF7', '#00FFFF', '#14F2E0', '#720AF5', '#3209DB', '#000000']
    },
    // New themes below
    {
      name: 'hippie',
      pattern: /(hippie|60s|sixties|psychedelic|tie-?dye|bohemian|boho)/gi,
      primary: '#FF6B35',
      colors: ['#FF6B35', '#F7C59F', '#EFEFD0', '#004E89', '#1A659E', '#7AE7C7', '#D64161']
    },
    {
      name: 'tropical',
      pattern: /(tropical|caribbean|island|hawaii|exotic)/gi,
      primary: '#FF9A3C',
      colors: ['#FF9A3C', '#FF5A5F', '#F15BB5', '#00BBF9', '#00F5D4', '#9EF01A', '#FCBF49']
    },
    {
      name: 'minimalist',
      pattern: /(minimalist|simple|clean|modern|sleek|minimal)/gi,
      primary: '#2F2F2F',
      colors: ['#2F2F2F', '#555555', '#E0E0E0', '#FFFFFF', '#AAAAAA', '#CCCCCC', '#999999']
    },
    {
      name: 'gothic',
      pattern: /(gothic|dark|goth|vampire|horror|spooky|halloween)/gi,
      primary: '#0C0032',
      colors: ['#0C0032', '#190061', '#240090', '#3500D3', '#282828', '#400080', '#721121']
    },
    {
      name: 'elegant',
      pattern: /(elegant|classy|luxury|premium|sophisticated|upscale|fancy)/gi,
      primary: '#2C3639',
      colors: ['#2C3639', '#3F4E4F', '#A27B5C', '#DCD7C9', '#090909', '#CD7F32', '#F1F1F1']
    },
    {
      name: 'space',
      pattern: /(space|galaxy|cosmic|universe|stars|astronaut|astronomy|nebula)/gi,
      primary: '#2D3047',
      colors: ['#2D3047', '#419D78', '#E0A458', '#FFDBB5', '#93B7BE', '#093A3E', '#3066BE']
    },
    {
      name: 'western',
      pattern: /(western|cowboy|desert|ranch|wild west|frontier)/gi,
      primary: '#A85751',
      colors: ['#A85751', '#DEA681', '#EFD9B4', '#D6A2AD', '#816271', '#883955', '#E5D1D0']
    },
    {
      name: 'industrial',
      pattern: /(industrial|factory|machine|metal|steel|iron|mechanical)/gi,
      primary: '#393E46',
      colors: ['#393E46', '#222831', '#00ADB5', '#EEEEEE', '#4A6D7C', '#FFD369', '#6E6E6E']
    },
    {
      name: 'scandinavian',
      pattern: /(scandinavian|nordic|swedish|danish|norway)/gi,
      primary: '#FFFFFF',
      colors: ['#FFFFFF', '#E5E9EC', '#D8DEE9', '#4C566A', '#88C0D0', '#5E81AC', '#EBCB8B']
    },
    {
      name: 'japanese',
      pattern: /(japanese|japan|zen|kimono|sakura|cherry blossom)/gi,
      primary: '#D9A0A0',
      colors: ['#D9A0A0', '#9F9F92', '#717C89', '#424C55', '#372C2E', '#BAB4A9', '#FFFFFF']
    },
    {
      name: 'coffee',
      pattern: /(coffee|espresso|latte|mocha|cafe|brown)/gi,
      primary: '#6F4E37',
      colors: ['#6F4E37', '#B87333', '#DAA06D', '#E8D0B9', '#392613', '#FCEEE3', '#2E1503']
    },
    {
      name: 'wine',
      pattern: /(wine|burgundy|merlot|grape|vineyard)/gi,
      primary: '#722F37',
      colors: ['#722F37', '#A63446', '#450920', '#281C2D', '#DEB841', '#3B1F2B', '#8D0033']
    },
    {
      name: 'gaming',
      pattern: /(gaming|gamer|video games|esports|arcade)/gi,
      primary: '#121212',
      colors: ['#121212', '#BB86FC', '#3700B3', '#03DAC5', '#CF6679', '#018786', '#1DE9B6']
    },
    {
      name: 'christmas',
      pattern: /(christmas|xmas|santa|holiday|festive|winter holiday)/gi,
      primary: '#D41E1E',
      colors: ['#D41E1E', '#146B3A', '#F8B229', '#FFFFFF', '#1A3C2E', '#EA4630', '#165B33']
    },
    {
      name: 'halloween',
      pattern: /(halloween|spooky|scary|pumpkin|october)/gi,
      primary: '#FF6700',
      colors: ['#FF6700', '#000000', '#662E9B', '#4D0099', '#EA6363', '#59057B', '#F7F7F7']
    },
    {
      name: 'rainbow',
      pattern: /(rainbow|multicolor|colorful|spectrum|pride)/gi,
      primary: '#FF0000',
      colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF']
    },
    {
      name: 'watermelon',
      pattern: /(watermelon|summer fruit|melon)/gi,
      primary: '#FF6B6B',
      colors: ['#FF6B6B', '#4ECDC4', '#1A535C', '#41B3A3', '#69DC9E', '#FF595E', '#042A2B']
    },
    {
      name: 'cotton candy',
      pattern: /(cotton candy|fairy floss|carnival|fun fair)/gi,
      primary: '#FFB6C1',
      colors: ['#FFB6C1', '#AEDFF7', '#FFC0CB', '#87CEEB', '#F8C8DC', '#77BFA3', '#E6A4B4']
    },
    {
      name: 'nautical',
      pattern: /(nautical|sailor|navy|maritime|sailing|boat)/gi,
      primary: '#003366',
      colors: ['#003366', '#FFFFFF', '#CC0000', '#FFC72C', '#0066CC', '#D6001C', '#F0F0F0']
    }
  ];

  // Convert the prompt to lowercase for easier matching
  const lowercasePrompt = prompt.toLowerCase();

  // First, try to find direct matches with the patterns
  for (const theme of themes) {
    if (lowercasePrompt.match(theme.pattern)) {
      // Store theme colors for palette generation
      allMentionedColors = [...theme.colors];
      return theme.primary;
    }
  }

  // If no direct match, try to detect themes based on context or similar words
  // This handles cases like "hippie color's 60's" or other variations
  const contextualThemeMap = [
    { keywords: ['hippy', 'hipster', 'hippies', '60', 'psychedelic', 'tie dye'], theme: 'hippie' },
    { keywords: ['sea', 'blue', 'water', 'wave', 'deep', 'aqua'], theme: 'ocean' },
    { keywords: ['tree', 'green', 'leaf', 'plant', 'nature'], theme: 'forest' },
    { keywords: ['girl', 'feminine', 'woman', 'lady', 'princess'], theme: 'girly' },
    { keywords: ['sun', 'dawn', 'dusk', 'horizon', 'orange sky'], theme: 'sunset' },
    { keywords: ['dirt', 'mud', 'ground', 'natural', 'organic'], theme: 'earthy' },
    { keywords: ['tech', 'futuristic', 'sci-fi', 'neon', 'digital'], theme: 'cyberpunk' },
    { keywords: ['vintage', 'old', 'classic', 'retro', 'nostalgia'], theme: 'retro' },
    { keywords: ['light', 'soft', 'pastel', 'gentle', 'baby'], theme: 'pastel' },
    { keywords: ['bright', 'glow', 'vibrant', 'intense', 'flashy'], theme: 'neon' }
  ];

  for (const contextMap of contextualThemeMap) {
    for (const keyword of contextMap.keywords) {
      if (lowercasePrompt.includes(keyword)) {
        // Find the matching theme
        const matchedTheme = themes.find(t => t.name === contextMap.theme);
        if (matchedTheme) {
          allMentionedColors = [...matchedTheme.colors];
          return matchedTheme.primary;
        }
      }
    }
  }

  // If still no match found, check for descriptive phrases
  if (
    lowercasePrompt.includes('like the beach') || 
    lowercasePrompt.includes('like the sea') || 
    lowercasePrompt.includes('blue water')
  ) {
    const oceanTheme = themes.find(t => t.name === 'ocean');
    if (oceanTheme) {
      allMentionedColors = [...oceanTheme.colors];
      return oceanTheme.primary;
    }
  }

  if (
    lowercasePrompt.includes('like a forest') || 
    lowercasePrompt.includes('green nature') || 
    lowercasePrompt.includes('trees and')
  ) {
    const forestTheme = themes.find(t => t.name === 'forest');
    if (forestTheme) {
      allMentionedColors = [...forestTheme.colors];
      return forestTheme.primary;
    }
  }

  // No theme match found
  return null;
}

// Get all unique colors mentioned in the prompt
export function getAdditionalColors(prompt: string): string[] {
  // Reset the global array first
  allMentionedColors = [];
  
  // Call parseColorPrompt to populate allMentionedColors
  parseColorPrompt(prompt);
  
  return allMentionedColors;
}
