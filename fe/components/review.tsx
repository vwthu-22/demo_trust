'use client';

import { useState, useEffect } from 'react';
import './review.css';

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
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        verified: true,
    },
    {
        id: 2,
        rating: 4,
        title: 'Great Product',
        comment: 'Very satisfied with my purchase. Fast delivery and good quality. Would recommend to others.',
        userName: 'Sarah Johnson',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        verified: true,
    },
    {
        id: 3,
        rating: 5,
        title: 'Highly Recommended',
        comment: 'Best decision I made! The team was professional and responsive throughout the entire process.',
        userName: 'Michael Chen',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        verified: true,
    },
    {
        id: 4,
        rating: 4,
        title: 'Good Experience',
        comment: 'Overall a positive experience. Minor issues were resolved quickly by their support team.',
        userName: 'Emily Davis',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        verified: false,
    },
    {
        id: 5,
        rating: 5,
        title: 'Outstanding!',
        comment: 'Exceeded all my expectations. Will definitely be a returning customer!',
        userName: 'David Wilson',
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
            { label: 'Excellent', count: rating.fiveStarCount, percentage: (rating.fiveStarCount / total) * 100 },
            { label: 'Great', count: rating.fourStarCount, percentage: (rating.fourStarCount / total) * 100 },
            { label: 'Average', count: rating.threeStarCount, percentage: (rating.threeStarCount / total) * 100 },
            { label: 'Poor', count: rating.twoStarCount, percentage: (rating.twoStarCount / total) * 100 },
            { label: 'Bad', count: rating.oneStarCount, percentage: (rating.oneStarCount / total) * 100 },
        ];
    };

    const renderStars = (count: number, filled: boolean = true) => {
        return (
            <div className="stars">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={i < count ? 'star-filled' : 'star-empty'}
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill={i < count ? '#00B67A' : '#dcdce6'}
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

                <div className="rating-overview">
                    <div className="rating-stars-display">
                        {renderStars(Math.round(rating.averageRating))}
                        <div className="rating-text">
                            <span className="rating-score">{rating.averageRating.toFixed(1)}</span>
                            <span className="rating-divider">/</span>
                            <span className="rating-max">5</span>
                            <span className="rating-bullet">•</span>
                            <span className="rating-count">{rating.totalReviews} reviews</span>
                        </div>
                    </div>

                    <div className="trustpilot-badge">
                        <svg width="96" height="24" viewBox="0 0 96 24" fill="none">
                            <path d="M12 2l2.4 7.4h7.8l-6.3 4.6 2.4 7.4L12 16.8l-6.3 4.6 2.4-7.4L1.8 9.4h7.8L12 2z" fill="#00B67A" />
                            <text x="28" y="16" fill="#191919" fontSize="12" fontWeight="600">Trustify</text>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="reviews-content">
                <aside className="reviews-sidebar">
                    <div className="reviews-count-header">
                        <h2>Reviews</h2>
                        <span className="count">{rating.totalReviews}</span>
                    </div>

                    <div className="rating-distribution">
                        {getRatingDistribution().map((item, index) => (
                            <div key={index} className="rating-row">
                                <input
                                    type="checkbox"
                                    id={`filter-${item.label}`}
                                    checked={selectedFilter === item.label.toLowerCase() || selectedFilter === 'all'}
                                    onChange={() => setSelectedFilter(item.label.toLowerCase())}
                                />
                                <label htmlFor={`filter-${item.label}`}>{item.label}</label>
                                <div className="progress-bar-container">
                                    <div
                                        className="progress-bar-fill"
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                                <span className="percentage">{Math.round(item.percentage)}%</span>
                            </div>
                        ))}
                    </div>
                </aside>

                <main className="reviews-main">
                    {loading ? (
                        <div className="loading">Loading reviews...</div>
                    ) : (
                        <>
                            {reviews.map((review) => (
                                <article key={review.id} className="review-card">
                                    <div className="review-header">
                                        <div className="review-author">
                                            <span className="author-name">{review.userName}</span>
                                            <span className="review-date">{formatDate(review.createdAt)}</span>
                                        </div>
                                    </div>

                                    <div className="review-rating">
                                        {renderStars(review.rating)}
                                    </div>

                                    {review.title && (
                                        <h3 className="review-title">{review.title}</h3>
                                    )}

                                    <p className="review-comment">{review.comment}</p>

                                    {review.verified && (
                                        <div className="review-verified">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <circle cx="8" cy="8" r="8" fill="#191919" />
                                                <path d="M6 8l2 2 4-4" stroke="white" strokeWidth="2" fill="none" />
                                            </svg>
                                            <span>Verified, collected by Naisu</span>
                                        </div>
                                    )}
                                </article>
                            ))}

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
            </div>
        </div>
    );
}
