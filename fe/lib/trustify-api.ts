/**
 * Trustify API Integration Service
 * Handles all API calls to Trustify backend
 */

const API_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_TRUSTIFY_API_URL || 'https://trustify.io.vn',
    companyId: process.env.NEXT_PUBLIC_COMPANY_ID || '1',
    timeout: 10000, // 10 seconds
};

export interface CompanyRating {
    id: number;
    averageRating: number;
    totalReviews: number;
    fiveStarCount: number;
    fourStarCount: number;
    threeStarCount: number;
    twoStarCount: number;
    oneStarCount: number;
}

export interface Review {
    id: number;
    rating: number;
    title: string;
    comment: string;
    userName: string;
    createdAt: string;
    verified: boolean;
}

export interface ReviewsResponse {
    content: Review[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export interface IntegrationManifest {
    sendInviteApi: string;
    ratingApi: string;
    reviewsApi: string;
    companyRating: CompanyRating;
}

export interface SendInviteRequest {
    email: string;
    name: string;
}

/**
 * Base fetch wrapper with timeout and error handling
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        clearTimeout(timeout);
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
        throw new Error('Unknown error occurred');
    }
}

/**
 * Get integration manifest and current rating
 */
export async function getIntegrationManifest(): Promise<IntegrationManifest> {
    const url = `${API_CONFIG.baseUrl}/integration/companies/${API_CONFIG.companyId}`;
    const response = await fetchWithTimeout(url);
    return response.json();
}

/**
 * Get company rating statistics
 */
export async function getCompanyRating(): Promise<CompanyRating> {
    const url = `${API_CONFIG.baseUrl}/integration/companies/${API_CONFIG.companyId}/rating`;
    const response = await fetchWithTimeout(url);
    return response.json();
}

/**
 * Get company reviews with pagination
 */
export async function getCompanyReviews(
    page: number = 0,
    size: number = 5,
    rating?: number
): Promise<ReviewsResponse> {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });

    if (rating) {
        params.append('rating', rating.toString());
    }

    const url = `${API_CONFIG.baseUrl}/integration/companies/${API_CONFIG.companyId}/reviews?${params}`;
    const response = await fetchWithTimeout(url);
    return response.json();
}

/**
 * Send review invitation to customer
 */
export async function sendReviewInvitation(data: SendInviteRequest): Promise<void> {
    const url = `${API_CONFIG.baseUrl}/integration/companies/${API_CONFIG.companyId}/send-invite`;

    await fetchWithTimeout(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

/**
 * Cache manager for API responses
 */
class CacheManager {
    private cache: Map<string, { data: any; timestamp: number }> = new Map();
    private readonly TTL = 5 * 60 * 1000; // 5 minutes

    set(key: string, data: any): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }

    get(key: string): any | null {
        const cached = this.cache.get(key);
        if (!cached) return null;

        const isExpired = Date.now() - cached.timestamp > this.TTL;
        if (isExpired) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    clear(): void {
        this.cache.clear();
    }
}

export const apiCache = new CacheManager();

/**
 * Get company rating with caching
 */
export async function getCachedCompanyRating(): Promise<CompanyRating> {
    const cacheKey = `rating_${API_CONFIG.companyId}`;
    const cached = apiCache.get(cacheKey);

    if (cached) {
        return cached;
    }

    const data = await getCompanyRating();
    apiCache.set(cacheKey, data);
    return data;
}

/**
 * Get company reviews with caching
 */
export async function getCachedCompanyReviews(
    page: number = 0,
    size: number = 5,
    rating?: number
): Promise<ReviewsResponse> {
    const cacheKey = `reviews_${API_CONFIG.companyId}_${page}_${size}_${rating || 'all'}`;
    const cached = apiCache.get(cacheKey);

    if (cached) {
        return cached;
    }

    const data = await getCompanyReviews(page, size, rating);
    apiCache.set(cacheKey, data);
    return data;
}

/**
 * Format date to readable string
 */
export function formatReviewDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

/**
 * Calculate rating percentage
 */
export function calculateRatingPercentage(count: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
}

/**
 * Get rating label
 */
export function getRatingLabel(rating: number): string {
    const labels: { [key: number]: string } = {
        5: 'Excellent',
        4: 'Great',
        3: 'Average',
        2: 'Poor',
        1: 'Bad',
    };
    return labels[rating] || 'Unknown';
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export default {
    getIntegrationManifest,
    getCompanyRating,
    getCompanyReviews,
    sendReviewInvitation,
    getCachedCompanyRating,
    getCachedCompanyReviews,
    formatReviewDate,
    calculateRatingPercentage,
    getRatingLabel,
    isValidEmail,
};
