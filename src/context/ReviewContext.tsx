import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Review } from '../types';
import { MOCK_REVIEWS } from '../constants';

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Review) => void;
  getProductReviews: (productId: string) => Review[];
  getAverageRating: (productId: string) => number;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);

  const addReview = (review: Review) => {
    setReviews(prev => [review, ...prev]);
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter(r => r.productId === productId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getAverageRating = (productId: string) => {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0) return 0;
    const sum = productReviews.reduce((acc, curr) => acc + curr.rating, 0);
    return sum / productReviews.length;
  };

  return (
    <ReviewContext.Provider value={{ reviews, addReview, getProductReviews, getAverageRating }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) throw new Error('useReviews must be used within ReviewProvider');
  return context;
};
