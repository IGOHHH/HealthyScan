import React, { useState } from 'react';
import { Review } from '../types';
import { Star, User, Send } from 'lucide-react';

interface ReviewsProps {
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'timestamp' | 'avatarUrl'>) => void;
}

export const Reviews: React.FC<ReviewsProps> = ({ reviews, onAddReview }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !name.trim()) return;

    onAddReview({
      user: name,
      rating,
      comment
    });

    setComment('');
    setName('');
    setRating(5);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-16">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-900">Community Reviews</h3>
          <p className="text-sm text-slate-500">Share your experience with this product</p>
        </div>

        {/* Review List */}
        <div className="p-6 space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p>No reviews yet. Be the first to share!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="flex-shrink-0">
                  <img src={review.avatarUrl} alt={review.user} className="w-10 h-10 rounded-full bg-slate-200" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-slate-900">{review.user}</h4>
                    <span className="text-xs text-slate-400">{review.timestamp.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Review Form */}
        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <h4 className="font-semibold text-slate-900 mb-4">Add your rating</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`w-6 h-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} 
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm font-medium text-slate-600">
                  {rating === 1 ? 'Very Bad / Toxic' : 
                   rating === 2 ? 'Bad' : 
                   rating === 3 ? 'Average' : 
                   rating === 4 ? 'Good' : 'Excellent / Healthy'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What was your experience with this product?"
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              Post Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};