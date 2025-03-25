
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ColorPalette, defaultPalette } from '@/utils/colorRules';
import { toast } from "@/hooks/use-toast";
import { Wand2 } from 'lucide-react';

export default function ColorPaletteGenerator() {
  const [prompt, setPrompt] = useState('');
  const [currentPalette, setCurrentPalette] = useState<ColorPalette>(defaultPalette);
  
  const generatePalette = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt first",
        variant: "destructive",
      });
      return;
    }

    // For now, we'll just use the default palette
    // TODO: Integrate with an AI service to generate palettes based on prompts
    toast({
      title: "Palette Generated",
      description: "New color palette has been created based on your prompt",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
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
                placeholder="e.g., pastel colors like a spring morning..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button onClick={generatePalette}>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
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
                  <p className="text-muted-foreground">{color}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
