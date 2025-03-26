
import { ColorPalette, defaultPalette } from './types';
import { toast } from "@/hooks/use-toast";

// Your OpenAI API key (consider moving this to an environment variable for production)
const OPENAI_API_KEY = "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";

// Function to generate a color palette using AI
export async function generateAIColorPalette(prompt: string): Promise<ColorPalette | null> {
  try {
    // Format the prompt to get better results
    const enhancedPrompt = `Generate a web color palette with these colors: background (always white), secondaryBg (light shade), secondary (dark shade), primary (main color), text (readable on white), accent (vibrant color), and transparent. Based on this theme: "${prompt}". Return only a JSON object with hex color codes.`;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}` 
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
      const errorData = await response.json();
      console.error('API error:', errorData);
      throw new Error(`Failed to generate AI color palette: ${response.status} ${response.statusText}`);
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
    toast({
      title: "AI Error",
      description: `Failed to generate palette: ${(error as Error).message}`,
      variant: "destructive",
    });
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
