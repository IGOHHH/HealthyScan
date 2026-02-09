import React, { useState } from 'react';
import { Header } from './components/Header';
import { Scanner } from './components/Scanner';
import { AnalysisView } from './components/AnalysisView';
import { Reviews } from './components/Reviews';
import { analyzeProductImage } from './services/gemini';
import { ProductState, Review } from './types';
import { RefreshCcw } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<ProductState>({
    image: null,
    isAnalyzing: false,
    result: null,
    error: null,
    reviews: []
  });

  const handleImageSelected = async (base64: string) => {
    setState(prev => ({ ...prev, image: base64, isAnalyzing: true, error: null, result: null, reviews: [] }));
    
    try {
      const result = await analyzeProductImage(base64);
      
      // Initialize with a mock review to make it look alive if empty
      const initialReviews: Review[] = [
        {
          id: '1',
          user: 'AI Assistant',
          rating: result.healthScore > 80 ? 5 : result.healthScore > 50 ? 3 : 1,
          comment: `Based on initial analysis, this product scores ${result.healthScore}/100. ${result.summary}`,
          timestamp: new Date(),
          avatarUrl: `https://picsum.photos/seed/ai/50/50`
        }
      ];

      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        result,
        reviews: initialReviews
      }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        error: error.message || "Something went wrong" 
      }));
    }
  };

  const handleAddReview = (newReview: Omit<Review, 'id' | 'timestamp' | 'avatarUrl'>) => {
    const review: Review = {
      ...newReview,
      id: Date.now().toString(),
      timestamp: new Date(),
      avatarUrl: `https://picsum.photos/seed/${newReview.user}/50/50`
    };

    setState(prev => ({
      ...prev,
      reviews: [review, ...prev.reviews]
    }));
  };

  const handleReset = () => {
    setState({
      image: null,
      isAnalyzing: false,
      result: null,
      error: null,
      reviews: []
    });
  };

  return (
    <div className="min-h-screen pb-12 flex flex-col">
      <Header />

      <main className="flex-grow">
        {!state.result ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-b from-white to-emerald-50/30">
            <div className="text-center px-4 mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                Is it <span className="text-emerald-600">Healthy</span> or <span className="text-rose-500">Toxic</span>?
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Upload a picture of any beauty product, food, or medicine to reveal the hidden truth about its ingredients.
              </p>
            </div>
            
            <Scanner 
              onImageSelected={handleImageSelected} 
              isAnalyzing={state.isAnalyzing} 
            />

            {state.error && (
              <div className="mt-8 p-4 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 flex items-center animate-in fade-in slide-in-from-top-2">
                <span className="font-medium">{state.error}</span>
                <button 
                  onClick={handleReset}
                  className="ml-4 text-sm underline hover:text-rose-800"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 min-h-screen pb-12">
             <div className="sticky top-16 z-40 bg-white/80 backdrop-blur border-b border-slate-200 shadow-sm py-2 px-4 flex justify-center mb-8">
               <button 
                 onClick={handleReset}
                 className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
               >
                 <RefreshCcw className="w-4 h-4" />
                 Scan New Product
               </button>
             </div>

             <AnalysisView 
               result={state.result} 
               image={state.image || ''} 
             />

             <Reviews 
               reviews={state.reviews} 
               onAddReview={handleAddReview} 
             />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 py-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} PureLens. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
}