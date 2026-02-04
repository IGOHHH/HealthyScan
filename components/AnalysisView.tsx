import React from 'react';
import { AnalysisResult, HealthRating, ProductCategory } from '../types';
import { 
  AlertTriangle, 
  CheckCircle, 
  Leaf, 
  Pill, 
  Utensils, 
  Droplets,
  Activity,
  AlertOctagon,
  ThumbsUp,
  Sparkles
} from 'lucide-react';
import { Cell, Pie, PieChart } from 'recharts';

interface AnalysisViewProps {
  result: AnalysisResult;
  image: string;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ result, image }) => {
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 50) return "text-yellow-600";
    return "text-rose-600";
  };
  
  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-rose-500";
  };

  const getCategoryIcon = (category: ProductCategory) => {
    switch(category) {
      case ProductCategory.FOOD: return <Utensils className="w-5 h-5" />;
      case ProductCategory.MEDICINE: return <Pill className="w-5 h-5" />;
      case ProductCategory.BEAUTY: return <Droplets className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  // Data for the radial chart
  const data = [
    { name: 'Score', value: result.healthScore },
    { name: 'Remaining', value: 100 - result.healthScore }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Top Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 mb-8">
        <div className="grid md:grid-cols-2 gap-0">
          
          {/* Image Side */}
          <div className="relative h-64 md:h-auto bg-slate-100 flex items-center justify-center overflow-hidden">
            <img 
              src={image} 
              alt="Scanned Product" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-semibold text-slate-700 shadow-sm">
              {getCategoryIcon(result.category)}
              <span>{result.category}</span>
            </div>
          </div>

          {/* Score & Summary Side */}
          <div className="p-8 flex flex-col justify-center relative">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{result.productName}</h2>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${
                  result.healthScore >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  result.healthScore >= 50 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {result.rating === HealthRating.EXCELLENT && <Leaf className="w-4 h-4" />}
                  {result.rating === HealthRating.TOXIC && <AlertOctagon className="w-4 h-4" />}
                  <span>{result.rating}</span>
                </div>
              </div>

              {/* Score Chart */}
              <div className="relative w-24 h-24 flex-shrink-0">
                <PieChart width={96} height={96}>
                  <Pie
                    data={data}
                    innerRadius={35}
                    outerRadius={45}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill={result.healthScore >= 80 ? '#10b981' : result.healthScore >= 50 ? '#eab308' : '#f43f5e'} />
                    <Cell fill="#e2e8f0" />
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className={`text-2xl font-bold ${getScoreColor(result.healthScore)}`}>
                    {result.healthScore}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>
                </div>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed mb-6">
              {result.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Pros & Cons */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-emerald-500" />
              Positive Highlights
            </h3>
            <ul className="space-y-3">
              {result.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 min-w-[1.25rem]">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="text-slate-600 text-sm">{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              Potential Concerns
            </h3>
            <ul className="space-y-3">
              {result.cons.length > 0 ? result.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 min-w-[1.25rem]">
                    <AlertOctagon className="w-5 h-5 text-rose-500" />
                  </div>
                  <span className="text-slate-600 text-sm">{con}</span>
                </li>
              )) : (
                <p className="text-slate-500 italic">No major concerns detected.</p>
              )}
            </ul>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Key Ingredients
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.ingredients && result.ingredients.length > 0 ? (
              result.ingredients.map((ing, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">
                  {ing}
                </span>
              ))
            ) : (
              <p className="text-slate-500 text-sm italic">Ingredients could not be clearly extracted from the image.</p>
            )}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
             <h4 className="text-blue-800 text-sm font-bold mb-1">AI Disclaimer</h4>
             <p className="text-blue-600 text-xs leading-relaxed">
               This analysis is generated by Gemini 3 and is for informational purposes only. It does not constitute medical advice. Always consult with a professional and read the physical product label.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};