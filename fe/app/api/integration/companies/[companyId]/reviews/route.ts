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
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '5';

        // Get authentication token
        const authToken = await getAuthToken();

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await fetch(
            `${API_BASE}/integration/companies/${companyId}/reviews?page=${page}&size=${size}`,
            {
                method: 'GET',
                headers,
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend error:', errorText);
            return NextResponse.json(
                { error: 'Failed to fetch reviews' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error proxying reviews request:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
