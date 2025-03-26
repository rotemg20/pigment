
import { ColorPalette, defaultPalette } from './types';
import { toast } from "@/hooks/use-toast";

// Function to generate a color palette using AI
export async function generateAIColorPalette(prompt: string): Promise<ColorPalette | null> {
  try {
    // Format the prompt to get better results
    const enhancedPrompt = `Generate a web color palette with these colors: background (always white), secondaryBg (light shade), secondary (dark shade), primary (main color), text (readable on white), accent (vibrant color), and transparent. Based on this theme: "${prompt}". Return only a JSON object with hex color codes.`;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY || ''}` 
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a color palette generator for websites. Respond only with valid JSON of ColorPalette objects containing hex color codes. The background must always be white (#FFFFFF)."
          },
          {
            role: "user",
            content: enhancedPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate AI color palette');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in AI response');
    }

    // Extract the JSON object from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from AI response');
    }

    const paletteObject = JSON.parse(jsonMatch[0]);
    
    // Ensure all required colors are present
    const requiredColors = ['background', 'secondaryBg', 'secondary', 'primary', 'text', 'accent', 'transparent'];
    for (const color of requiredColors) {
      if (!paletteObject[color]) {
        throw new Error(`Missing color: ${color}`);
      }
    }
    
    // Make sure background is white
    paletteObject.background = "#FFFFFF";
    
    // Make sure transparent is set correctly
    paletteObject.transparent = "#00000000";

    return paletteObject as ColorPalette;
  } catch (error) {
    console.error('AI palette generation error:', error);
    return null;
  }
}

// Fallback function that mimics AI generation but uses our existing logic
export function simulateAIColorPalette(prompt: string, currentPalette: ColorPalette): ColorPalette {
  // Import dynamically to avoid circular dependencies
  const { generateHarmonizedPalette, parseColorPrompt } = require('./colorGeneration');
  const { validatePalette } = require('./colorValidation');
  
  const baseColor = parseColorPrompt(prompt) || currentPalette.primary;
  let generatedPalette = generateHarmonizedPalette(baseColor, prompt);
  
  // Validate the palette and adjust if needed
  if (!validatePalette(generatedPalette)) {
    // Try to fix any contrast issues
    generatedPalette = {
      ...generatedPalette,
      text: "#2D3748", // Use a default dark text color
    };
  }
  
  return generatedPalette;
}
