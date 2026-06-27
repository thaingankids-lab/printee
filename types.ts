export interface StyleAnalysis {
  overallStyle: string;
  fonts: Array<{
    style: string;
    weight: string;
    effects: string;
  }>;
  colorPalette: string[];
  colorBlending: string;
  colorEffects: string;
}

export interface ColorLayer {
  name: string;
  channel: 'Cyan' | 'Magenta' | 'Yellow' | 'Black';
  imageData: string | null;
  isLoading: boolean;
}