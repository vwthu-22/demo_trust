/**
 * Trustify Authentication Utility
 * Handles token exchange and authentication for Trustify API
 */

const TRUSTIFY_API_BASE = process.env.NEXT_PUBLIC_TRUSTIFY_API_URL || 'https://trustify.io.vn';
const STATE_TOKEN = process.env.TRUSTIFY_STATE_TOKEN;

interface TokenResponse {
    token: string;
    error?: string;
}

let cachedJwtToken: string | null = null;
let tokenExpiryTime: number | null = null;

/**
 * Exchange state token for JWT token
 */
export async function exchangeStateToken(): Promise<string | null> {
    // Check if we have a valid cached token
    if (cachedJwtToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
        return cachedJwtToken;
    }

    if (!STATE_TOKEN) {
        console.error('TRUSTIFY_STATE_TOKEN is not configured');
        return null;
    }

    try {
        const response = await fetch(`${TRUSTIFY_API_BASE}/exchange-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                state: STATE_TOKEN,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to exchange token:', response.status, errorText);
            return null;
        }

        const data: TokenResponse = await response.json();

        if (data.error) {
            console.error('Token exchange error:', data.error);
            return null;
        }

        // Cache the token (assume it's valid for 1 hour)
        cachedJwtToken = data.token;
        tokenExpiryTime = Date.now() + 60 * 60 * 1000; // 1 hour

        return data.token;
    } catch (error) {
        console.error('Error exchanging state token:', error);
        return null;
    }
}

/**
 * Get authentication headers for API requests
 */
export async function getAuthHeaders(): Promise<HeadersInit> {
    const token = await exchangeStateToken();

    if (!token) {
        return {
            'Content-Type': 'application/json',
        };
    }

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
}

/**
 * Clear cached token (useful for logout or token refresh)
 */
export function clearAuthToken(): void {
    cachedJwtToken = null;
    tokenExpiryTime = null;
}

/**
 * Check if we have a valid authentication token
 */
export function isAuthenticated(): boolean {
    return cachedJwtToken !== null && tokenExpiryTime !== null && Date.now() < tokenExpiryTime;
}

export default {
    exchangeStateToken,
    getAuthHeaders,
    clearAuthToken,
    isAuthenticated,
};
