import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'https://trustify.io.vn';

export async function GET(
    request: NextRequest,
    { params }: { params: { companyId: string } }
) {
    try {
        const { companyId } = params;
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '5';

        const response = await fetch(
            `${API_BASE}/integration/companies/${companyId}/reviews?page=${page}&size=${size}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
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
