'use client';

import { useState, useEffect } from 'react';
import './review.css';

// Rating Colors Configuration
// Centralized rating color management for consistent styling across the app

// Star text colors based on rating value
export const STAR_COLORS = {
    excellent: 'text-[#5aa5df]',      // > 3.5 stars
    good: 'text-yellow-500',          // 2.5 - 3.5 stars  
    average: 'text-orange-500',       // 2 stars
    poor: 'text-red-500',             // 1 star
    empty: 'text-gray-300',           // unfilled stars
};

// Star fill colors (for filled stars with fill property)
export const STAR_FILL_COLORS = {
    excellent: 'fill-[#5aa5df] text-[#5aa5df]',
    good: 'fill-yellow-500 text-yellow-500',
    average: 'fill-orange-500 text-orange-500',
    poor: 'fill-red-500 text-red-500',
    empty: 'fill-gray-300 text-gray-300',
};

// Progress bar colors for rating breakdown (by star count)
export const BAR_COLORS = {
    5: 'bg-[#5aa5df]',
    4: 'bg-blue-400',
    3: 'bg-yellow-500',
    2: 'bg-orange-500',
    1: 'bg-red-500',
};

// Get star color based on rating value
export const getStarColor = (rating: number): string => {
    if (rating === 1) return STAR_COLORS.poor;
    if (rating === 2) return STAR_COLORS.average;
    if (rating > 2 && rating <= 3.5) return STAR_COLORS.good;
    if (rating > 3.5) return STAR_COLORS.excellent;
    return STAR_COLORS.empty;
};

// Get star fill color based on rating value (for icons with fill)
export const getStarFillColor = (rating: number): string => {
    if (rating <= 2) return STAR_FILL_COLORS.poor;
    if (rating > 2 && rating <= 3.5) return STAR_FILL_COLORS.good;
    if (rating > 3.5) return STAR_FILL_COLORS.excellent;
    return STAR_FILL_COLORS.empty;
};

// Get individual star fill color based on star position and rating
export const getIndividualStarColor = (starIndex: number, rating: number): string => {
    // starIndex is 0-based (0-4 for 5 stars)
    if (starIndex >= rating) {
        return STAR_FILL_COLORS.empty;
    }
    // Use the overall rating to determine color for filled stars
    return getStarFillColor(rating);
};

// Get progress bar color based on star count (1-5)
export const getBarColor = (stars: number): string => {
    return BAR_COLORS[stars as keyof typeof BAR_COLORS] || 'bg-gray-300';
};

// Get rating label based on rating value
export const getRatingLabel = (rating: number): string => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 3.5) return 'Great';
    if (rating >= 2.5) return 'Average';
    return 'Poor';
};

// API Configuration
const COMPANY_ID = 1;
const API_BASE = '/api'; // Use local API proxy to avoid CORS

interface CompanyRating {
    id: number;
    averageRating: number;
    totalReviews: number;
    fiveStarCount: number;
    fourStarCount: number;
    threeStarCount: number;
    twoStarCount: number;
    oneStarCount: number;
}

interface Review {
    id: number;
    rating: number;
    title: string;
    comment: string;
    userName: string;
    userEmail?: string;
    email?: string;
    createdAt: string;
    verified: boolean;
}

interface ReviewsResponse {
    content: Review[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

// Mock data for fallback
const MOCK_RATING: CompanyRating = {
    id: 1,
    averageRating: 4.5,
    totalReviews: 127,
    fiveStarCount: 85,
    fourStarCount: 30,
    threeStarCount: 8,
    twoStarCount: 3,
    oneStarCount: 1,
};

const MOCK_REVIEWS: Review[] = [
    {
        id: 1,
        rating: 5,
        title: 'Excellent Service!',
        comment: 'I had a wonderful experience with this company. The customer service was outstanding and the product quality exceeded my expectations.',
        userName: 'John Smith',
        userEmail: 'john.smith@example.com',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        verified: true,
    },
    {
        id: 2,
        rating: 4,
        title: 'Great Product',
        comment: 'Very satisfied with my purchase. Fast delivery and good quality. Would recommend to others.',
        userName: 'Sarah Johnson',
        userEmail: 'sarah.j@example.com',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        verified: true,
    },
    {
        id: 3,
        rating: 5,
        title: 'Highly Recommended',
        comment: 'Best decision I made! The team was professional and responsive throughout the entire process.',
        userName: 'Michael Chen',
        userEmail: 'mchen@example.com',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        verified: true,
    },
    {
        id: 4,
        rating: 4,
        title: 'Good Experience',
        comment: 'Overall a positive experience. Minor issues were resolved quickly by their support team.',
        userName: 'Emily Davis',
        userEmail: 'emily.davis@example.com',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        verified: false,
    },
    {
        id: 5,
        rating: 5,
        title: 'Outstanding!',
        comment: 'Exceeded all my expectations. Will definitely be a returning customer!',
        userName: 'David Wilson',
        userEmail: 'd.wilson@example.com',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        verified: true,
    },
];

export default function CustomerReviews() {
    const [rating, setRating] = useState<CompanyRating | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState<string>('all');

    // Fetch rating data
    useEffect(() => {
        fetchRating();
    }, []);

    // Fetch reviews when page changes
    useEffect(() => {
        fetchReviews(currentPage);
    }, [currentPage]);

    const fetchRating = async () => {
        try {
            const res = await fetch(`${API_BASE}/integration/companies/${COMPANY_ID}/rating`);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Failed to fetch rating:', res.status, errorText);
                console.warn('Using mock rating data');
                setRating(MOCK_RATING);
                return;
            }

            const data = await res.json();
            setRating(data);
        } catch (error) {
            console.error('Error fetching rating:', error);
            console.warn('Using mock rating data due to error');
            setRating(MOCK_RATING);
        }
    };

    const fetchReviews = async (page: number, size: number = 5) => {
        try {
            setLoading(true);
            const res = await fetch(
                `${API_BASE}/integration/companies/${COMPANY_ID}/reviews?page=${page}&size=${size}`
            );

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Failed to fetch reviews:', res.status, errorText);
                console.warn('Using mock reviews data');
                setReviews(MOCK_REVIEWS.slice(page * size, (page + 1) * size));
                setTotalPages(Math.ceil(MOCK_REVIEWS.length / size));
                return;
            }

            const data: ReviewsResponse = await res.json();
            setReviews(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            console.warn('Using mock reviews data due to error');
            setReviews(MOCK_REVIEWS.slice(page * size, (page + 1) * size));
            setTotalPages(Math.ceil(MOCK_REVIEWS.length / size));
        } finally {
            setLoading(false);
        }
    };

    const getRatingDistribution = () => {
        if (!rating) return [];

        const total = rating.totalReviews;
        return [
            { stars: 5, label: 'Excellent', count: rating.fiveStarCount, percentage: Math.round((rating.fiveStarCount / total) * 100) },
            { stars: 4, label: 'Great', count: rating.fourStarCount, percentage: Math.round((rating.fourStarCount / total) * 100) },
            { stars: 3, label: 'Average', count: rating.threeStarCount, percentage: Math.round((rating.threeStarCount / total) * 100) },
            { stars: 2, label: 'Poor', count: rating.twoStarCount, percentage: Math.round((rating.twoStarCount / total) * 100) },
            { stars: 1, label: 'Bad', count: rating.oneStarCount, percentage: Math.round((rating.oneStarCount / total) * 100) },
        ];
    };

    const renderStars = (count: number, rating?: number) => {
        // Determine color based on rating value
        const getStarColorHex = (rating: number): string => {
            if (rating <= 2) return '#ef4444'; // red-500
            if (rating > 2 && rating <= 3.5) return '#eab308'; // yellow-500
            if (rating > 3.5) return '#5aa5df'; // blue
            return '#5aa5df'; // default green
        };

        const starColor = rating ? getStarColorHex(rating) : '#5aa5df';

        return (
            <div className="stars">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={i < count ? 'star-filled' : 'star-empty'}
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill={i < count ? starColor : '#dcdce6'}
                    >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                ))}
            </div>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    };

    if (!rating) {
        return <div className="loading">Loading reviews...</div>;
    }

    return (
        <div className="customer-reviews-container">
            <div className="reviews-header">
                <h1 className="reviews-title">CUSTOMER REVIEWS</h1>

                <div className="rating-overview flex justify-between">
                    <div className="trustpilot-badge">
                        <svg width="96" height="24" viewBox="0 0 96 24" fill="none">
                            <path d="M12 2l2.4 7.4h7.8l-6.3 4.6 2.4 7.4L12 16.8l-6.3 4.6 2.4-7.4L1.8 9.4h7.8L12 2z" fill="#5aa5df" />
                            <text x="28" y="16" fill="#191919" fontSize="12" fontWeight="600">Trustify</text>
                        </svg>
                    </div>
                    <div className="rating-stars-display">
                        {renderStars(Math.round(rating.averageRating), rating.averageRating)}
                        <div className="rating-text">
                            <span className="rating-score">{rating.averageRating.toFixed(1)}</span>
                            <span className="rating-divider">/</span>
                            <span className="rating-max">5</span>
                            <span className="rating-bullet">•</span>
                            <span className="rating-count">{rating.totalReviews} reviews</span>
                        </div>
                    </div>

                </div>
            </div>

            <div className="reviews-content">
                <aside className="reviews-sidebar">
                    <div className="reviews-count-header">
                        <h2>Reviews</h2>
                        <span className="count">{rating.totalReviews}</span>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                        <div className="space-y-1.5 sm:space-y-2">
                            {getRatingDistribution().map((filter) => (
                                <label key={filter.stars} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={selectedFilter === filter.label.toLowerCase() || selectedFilter === 'all'}
                                        onChange={() => setSelectedFilter(filter.label.toLowerCase())}
                                    />
                                    <span className="text-xs font-medium w-9 sm:w-10">{filter.stars}-star</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                        <div
                                            className={`h-1.5 rounded-full ${getBarColor(filter.stars)}`}
                                            style={{ width: `${filter.percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-600 w-8 sm:w-10 text-right">{filter.percentage}%</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="reviews-main">
                    {loading ? (
                        <div className="loading">Loading reviews...</div>
                    ) : (
                        <>
                            {reviews.map((review) => {
                                // Get user info from nested user object or direct fields
                                const userName = review.userName || 'User';
                                const userInitial = userName.charAt(0).toUpperCase() || 'U';
                                const userEmail = review.userEmail || review.email || '';

                                return (
                                    <article key={review.id} className="border p-2.5 sm:p-3 border-gray-200 rounded-lg mb-4">
                                        {/* Review Header with Avatar */}
                                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                                            <div className="flex items-start gap-2 sm:gap-3">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0">
                                                    {userInitial}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-semibold text-gray-900 text-xs sm:text-sm">{userName}</h4>
                                                    {userEmail && (
                                                        <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                                                    )}
                                                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(review.createdAt)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex mb-2 sm:mb-3">
                                            {renderStars(review.rating, review.rating)}
                                        </div>

                                        {/* Review Content */}
                                        {review.title && (
                                            <h5 className="font-semibold text-gray-900 text-sm sm:text-base mb-1.5 sm:mb-2">
                                                {review.title}
                                            </h5>
                                        )}

                                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                                            {review.comment}
                                        </p>

                                        {/* Verified Badge */}
                                        {review.verified && (
                                            <div className="flex items-center gap-1.5 mt-2 sm:mt-3 text-xs text-gray-600">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <circle cx="8" cy="8" r="8" fill="#10b981" />
                                                    <path d="M6 8l2 2 4-4" stroke="white" strokeWidth="2" fill="none" />
                                                </svg>
                                                <span className="font-medium">Verified Purchase</span>
                                            </div>
                                        )}
                                    </article>
                                );
                            })}

                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        className="pagination-btn"
                                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                        disabled={currentPage === 0}
                                    >
                                        Previous
                                    </button>

                                    <div className="pagination-info">
                                        Page {currentPage + 1} of {totalPages}
                                    </div>

                                    <button
                                        className="pagination-btn"
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                        disabled={currentPage === totalPages - 1}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div >
        </div >
    );
}
