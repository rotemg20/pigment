
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
