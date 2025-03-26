import React, { useState } from 'react';
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
} from '@/utils/colors';
import { toast } from "@/hooks/use-toast";
import { Wand2, AlertTriangle, Check, X, Info } from 'lucide-react';
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
  const [usedPrompt, setUsedPrompt] = useState<string | null>(null);
  
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
      
      const baseColor = parseColorPrompt(prompt);
      
      let newPalette: ColorPalette;
      let toastMessage = "";
      
      if (baseColor) {
        // Set what prompt was used to generate this palette
        setUsedPrompt(prompt);
        
        // Check if there's a hex code in the prompt
        const hexMatch = prompt.match(/#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/g);
        if (hexMatch) {
          toastMessage = "Generated palette based on hex color: " + hexMatch[0];
        }
        
        // Check if a theme was detected
        const themeWords = [
          'forest', 'ocean', 'sunset', 'girly', 'monochrome', 'earthy', 
          'autumn', 'winter', 'spring', 'summer', 'neon', 'pastel', 
          'retro', 'cyberpunk'
        ];
        
        const detectedTheme = themeWords.find(theme => 
          prompt.toLowerCase().includes(theme)
        );
        
        if (detectedTheme) {
          toastMessage = `Generated "${detectedTheme}" themed palette`;
        }
        
        // Pass the entire prompt to the palette generator for better theme detection
        newPalette = generateHarmonizedPalette(baseColor, prompt);
      } else {
        // ... keep existing code (fallback palette generation)
      }
      
      onChange(newPalette);
      
      if (validatePalette(newPalette)) {
        toast({
          title: toastMessage || "Palette Generated",
          description: "New color palette meets all accessibility standards",
        });
      } else {
        toast({
          title: toastMessage || "Palette Generated with Warnings",
          description: "Some colors may not meet optimal contrast requirements",
          variant: "default",
        });
      }
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
              placeholder="e.g., forest themed, #FF70E5, girly theme, sunset colors..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button onClick={generatePalette} disabled={isGenerating}>
              <Wand2 className="mr-2 h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </div>
          {usedPrompt && (
            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <Info className="h-3.5 w-3.5 mr-1" />
              <span>Generated from: "{usedPrompt}"</span>
            </div>
          )}
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
                
                {name !== 'transparent' && name !== 'background' && name !== 'secondaryBg' && (
                  <div className="mt-1 text-xs">
                    <p className="text-muted-foreground mb-1">Contrast with background:</p>
                    {getContrastStatus(color, currentPalette.background)}
                  </div>
                )}
                
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
