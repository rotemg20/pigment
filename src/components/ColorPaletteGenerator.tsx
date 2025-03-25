
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  ColorPalette, 
  defaultPalette,
  validatePalette, 
  checkContrast,
  parseColorPrompt,
  generateHarmonizedPalette,
  getContrastRatio
} from '@/utils/colorRules';
import { toast } from "@/hooks/use-toast";
import { Wand2, AlertTriangle, Check, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface ColorPaletteGeneratorProps {
  currentPalette: ColorPalette;
  onChange: (palette: ColorPalette) => void;
}

export default function ColorPaletteGenerator({ 
  currentPalette, 
  onChange 
}: ColorPaletteGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generatePalette = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      // Parse the prompt to extract color information
      const baseColor = parseColorPrompt(prompt);
      
      // Generate a harmonized palette based on the extracted color or a default
      let newPalette: ColorPalette;
      
      if (baseColor) {
        newPalette = generateHarmonizedPalette(baseColor);
      } else {
        // If no specific color was extracted, create a default palette with slight variations
        newPalette = {
          background: "#FFFFFF", // Main background always white per requirements
          secondaryBg: "#F5F7FA", // Light secondary background
          secondary: "#1A202C", // Dark background for containers
          primary: "#2C5282", // For headings and important elements
          text: "#2D3748", // Body text
          accent: "#3182CE", // Interactive elements
          transparent: "#00000000" // Required by specs
        };
      }
      
      // Validate the palette against accessibility rules
      if (!validatePalette(newPalette)) {
        toast({
          title: "Warning",
          description: "Generated palette has contrast issues. Adjusting for better accessibility.",
          variant: "default",
        });
        
        // If validation fails, adjust to ensure contrast
        
        // First try to darken the text if needed
        if (!checkContrast(newPalette.background, newPalette.text)) {
          newPalette.text = "#2D3748"; // Darker text for better contrast
        }
        
        // Make primary color more contrasty if needed
        if (!checkContrast(newPalette.background, newPalette.primary)) {
          newPalette.primary = "#2C5282"; // Darker primary for better contrast
        }
        
        // Adjust accent for better contrast
        if (!checkContrast(newPalette.background, newPalette.accent)) {
          newPalette.accent = "#3182CE"; // Better contrast accent
        }
      }
      
      onChange(newPalette);
      
      toast({
        title: "Palette Generated",
        description: "New color palette has been created based on your prompt",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate palette",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleColorChange = (key: keyof ColorPalette, value: string) => {
    const updated = { ...currentPalette, [key]: value };
    onChange(updated);
  };

  // Check contrast for a specific color against backgrounds
  const getContrastStatus = (color: string, background: string) => {
    const ratio = getContrastRatio(color, background);
    const passes = checkContrast(color, background);
    
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs">{ratio}:1</span>
        {passes ? (
          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200 text-xs">
            <Check className="w-3 h-3 mr-1" /> AA
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200 text-xs">
            <X className="w-3 h-3 mr-1" /> Fail
          </Badge>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Color Palette</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prompt">Describe your desired color palette</Label>
          <div className="flex gap-2">
            <Input
              id="prompt"
              placeholder="e.g., blue professional theme, vibrant orange, pastel green..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button onClick={generatePalette} disabled={isGenerating}>
              <Wand2 className="mr-2 h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {Object.entries(currentPalette).map(([name, color]) => (
            <div key={name} className="space-y-2">
              <div 
                className="h-20 rounded-lg border"
                style={{ 
                  backgroundColor: color,
                  boxShadow: "inset 0 2px 4px 0 rgba(0,0,0,0.06)"
                }}
              />
              <div className="text-sm">
                <p className="font-medium capitalize">{name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground">{color}</p>
                  <Input 
                    type="color" 
                    value={color}
                    className="w-6 h-6 p-0 border-0" 
                    onChange={(e) => handleColorChange(name as keyof ColorPalette, e.target.value)}
                  />
                </div>
                
                {/* Only show contrast info for relevant colors */}
                {name !== 'transparent' && name !== 'background' && (
                  <div className="mt-1 text-xs">
                    <p className="text-muted-foreground mb-1">Contrast with background:</p>
                    {getContrastStatus(color, currentPalette.background)}
                  </div>
                )}
                
                {/* Only show secondary background contrast for text and interactive elements */}
                {(name === 'text' || name === 'primary' || name === 'accent') && (
                  <div className="mt-1 text-xs">
                    <p className="text-muted-foreground mb-1">Contrast with secondary bg:</p>
                    {getContrastStatus(color, currentPalette.secondaryBg)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {!validatePalette(currentPalette) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-4 flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800">Contrast Warning</h4>
              <p className="text-sm text-yellow-700">
                Some colors in this palette don't meet WCAG AA contrast requirements. 
                This may affect readability and accessibility.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
