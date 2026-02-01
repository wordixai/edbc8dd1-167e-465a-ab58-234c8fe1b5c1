import { useState } from 'react';
import { Sparkles, Utensils } from 'lucide-react';
import { ImageUploader } from '@/components/ImageUploader';
import { FoodAnalysisResult, NutritionData } from '@/components/FoodAnalysisResult';
import { Button } from '@/components/ui/button';

// Simulated AI analysis function
const analyzeFood = async (_imageData: string): Promise<NutritionData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2500));

  // Return simulated analysis result
  return {
    totalCalories: 520,
    protein: 25,
    carbs: 45,
    fat: 22,
    fiber: 8,
    foods: [
      { name: '鸡胸肉', portion: '约 150g', calories: 248, confidence: 0.94 },
      { name: '米饭', portion: '约 100g', calories: 130, confidence: 0.91 },
      { name: '西兰花', portion: '约 80g', calories: 28, confidence: 0.88 },
      { name: '橄榄油', portion: '约 1 汤匙', calories: 114, confidence: 0.75 },
    ],
  };
};

export default function Index() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<NutritionData | null>(null);
  const [hasImage, setHasImage] = useState(false);

  const handleImageSelect = async (file: File, preview: string) => {
    setHasImage(true);
    setAnalysisResult(null);
    console.log('Selected file:', file.name);

    // Auto-analyze when image is selected
    setIsAnalyzing(true);
    try {
      const result = await analyzeFood(preview);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setHasImage(false);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Utensils className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            AI 食物卡路里分析
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            上传食物图片，AI 将自动识别食物并分析其营养成分和卡路里
          </p>
        </header>

        {/* Upload Area */}
        <ImageUploader
          onImageSelect={handleImageSelect}
          isAnalyzing={isAnalyzing}
        />

        {/* Analysis Result */}
        {analysisResult && (
          <div className="mt-8">
            <FoodAnalysisResult data={analysisResult} />

            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={handleReset}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                分析新图片
              </Button>
            </div>
          </div>
        )}

        {/* Tips Section */}
        {!hasImage && (
          <div className="mt-10 fade-in">
            <h3 className="text-sm font-semibold text-foreground mb-4 text-center">
              使用技巧
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TipCard
                emoji="📸"
                title="清晰拍摄"
                description="确保图片清晰，光线充足"
              />
              <TipCard
                emoji="🍽️"
                title="完整展示"
                description="让所有食物都在画面中可见"
              />
              <TipCard
                emoji="📐"
                title="合适角度"
                description="俯拍45度角效果最佳"
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>AI 分析结果仅供参考，实际营养成分可能因烹饪方式有所不同</p>
        </footer>
      </div>
    </div>
  );
}

interface TipCardProps {
  emoji: string;
  title: string;
  description: string;
}

function TipCard({ emoji, title, description }: TipCardProps) {
  return (
    <div className="nutrition-card text-center">
      <span className="text-2xl mb-2 block">{emoji}</span>
      <h4 className="font-medium text-foreground text-sm mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
