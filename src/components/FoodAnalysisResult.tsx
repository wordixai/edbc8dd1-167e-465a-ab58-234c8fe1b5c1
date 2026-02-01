import { Flame, Beef, Wheat, Droplets, Info } from 'lucide-react';
import { NutritionRing } from './NutritionRing';
import { Badge } from '@/components/ui/badge';

export interface FoodItem {
  name: string;
  portion: string;
  calories: number;
  confidence: number;
}

export interface NutritionData {
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  foods: FoodItem[];
}

interface FoodAnalysisResultProps {
  data: NutritionData;
}

export function FoodAnalysisResult({ data }: FoodAnalysisResultProps) {
  return (
    <div className="w-full max-w-xl mx-auto space-y-6 slide-up">
      {/* Total Calories Card */}
      <div className="result-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-calories/10 flex items-center justify-center">
              <Flame className="w-6 h-6 text-calories" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">总卡路里</h3>
              <p className="text-3xl font-bold text-foreground">
                {data.totalCalories}
                <span className="text-lg font-normal text-muted-foreground ml-1">kcal</span>
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
            已分析
          </Badge>
        </div>

        {/* Nutrition Rings */}
        <div className="grid grid-cols-3 gap-4">
          <NutritionRing
            value={data.protein}
            max={50}
            label="蛋白质"
            unit="g"
            color="hsl(var(--protein))"
          />
          <NutritionRing
            value={data.carbs}
            max={100}
            label="碳水化合物"
            unit="g"
            color="hsl(var(--carbs))"
          />
          <NutritionRing
            value={data.fat}
            max={65}
            label="脂肪"
            unit="g"
            color="hsl(var(--fat))"
          />
        </div>
      </div>

      {/* Nutrition Details */}
      <div className="result-card p-6">
        <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          营养详情
        </h4>

        <div className="space-y-3">
          <NutritionBar
            icon={<Beef className="w-4 h-4" />}
            label="蛋白质"
            value={data.protein}
            unit="g"
            color="bg-protein"
            percent={(data.protein / 50) * 100}
          />
          <NutritionBar
            icon={<Wheat className="w-4 h-4" />}
            label="碳水化合物"
            value={data.carbs}
            unit="g"
            color="bg-carbs"
            percent={(data.carbs / 100) * 100}
          />
          <NutritionBar
            icon={<Droplets className="w-4 h-4" />}
            label="脂肪"
            value={data.fat}
            unit="g"
            color="bg-fat"
            percent={(data.fat / 65) * 100}
          />
        </div>
      </div>

      {/* Detected Foods */}
      <div className="result-card p-6">
        <h4 className="text-sm font-semibold text-foreground mb-4">识别的食物</h4>
        <div className="space-y-3">
          {data.foods.map((food, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg">
                  🍽️
                </div>
                <div>
                  <p className="font-medium text-foreground">{food.name}</p>
                  <p className="text-xs text-muted-foreground">{food.portion}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">{food.calories} kcal</p>
                <p className="text-xs text-muted-foreground">
                  置信度 {Math.round(food.confidence * 100)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface NutritionBarProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  color: string;
  percent: number;
}

function NutritionBar({ icon, label, value, unit, color, percent }: NutritionBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span className="text-sm">{label}</span>
        </div>
        <span className="text-sm font-medium text-foreground">
          {value}{unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
}
