
import ColorPaletteGenerator from "@/components/ColorPaletteGenerator";
import WebsitePreview from "@/components/WebsitePreview";
import { defaultPalette } from "@/utils/colorRules";
import { useState } from "react";
import type { ColorPalette } from "@/utils/colorRules";

export default function Index() {
  const [currentPalette, setCurrentPalette] = useState<ColorPalette>(defaultPalette);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Website Color Palette Generator
        </h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <ColorPaletteGenerator />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Live Preview</h2>
            <WebsitePreview palette={currentPalette} />
          </div>
        </div>
      </div>
    </div>
  );
}
