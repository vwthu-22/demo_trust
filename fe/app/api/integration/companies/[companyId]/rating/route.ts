import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'https://trustify.io.vn';
const STATE_TOKEN = process.env.TRUSTIFY_STATE_TOKEN;

interface TokenResponse {
    token: string;
    error?: string;
}

async function getAuthToken(): Promise<string | null> {
    if (!STATE_TOKEN) {
        console.error('TRUSTIFY_STATE_TOKEN is not configured');
        return null;
    }

    try {
        const response = await fetch(`${API_BASE}/exchange-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                state: STATE_TOKEN,
            }),
        });

        if (!response.ok) {
            return null;
        }

        const data: TokenResponse = await response.json();
        return data.error ? null : data.token;
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ companyId: string }> }
) {
    try {
        const { companyId } = await params;

        // Get authentication token
        const authToken = await getAuthToken();

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await fetch(
            `${API_BASE}/integration/companies/${companyId}/rating`,
            {
                method: 'GET',
                headers,
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend error:', errorText);
            return NextResponse.json(
                { error: 'Failed to fetch rating' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error proxying rating request:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
