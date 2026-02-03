export enum HealthRating {
  TOXIC = 'Toxic/Avoid',
  BAD = 'Bad',
  NEUTRAL = 'Neutral',
  GOOD = 'Good',
  EXCELLENT = 'Excellent'
}

export enum ProductCategory {
  FOOD = 'Food',
  BEAUTY = 'Beauty/Skincare',
  MEDICINE = 'Medicine/Supplement',
  UNKNOWN = 'Unknown'
}

export interface AnalysisResult {
  productName: string;
  category: ProductCategory;
  healthScore: number; // 0-100
  summary: string;
  pros: string[];
  cons: string[];
  ingredients: string[];
  rating: HealthRating;
  detectedText?: string;
}

export interface Review {
  id: string;
  user: string;
  rating: number; // 1-5
  comment: string;
  timestamp: Date;
  avatarUrl: string;
}

export interface ProductState {
  image: string | null; // Base64
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
  reviews: Review[];
}