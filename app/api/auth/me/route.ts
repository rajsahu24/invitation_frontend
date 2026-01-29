import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_APIGATEWAY_URL;
        console.log("hello")
        if (!backendUrl) {
            return NextResponse.json({ message: 'Backend URL not configured' }, { status: 500 });
        }

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'No token found' }, { status: 401 });
        }

        const response = await fetch(`${backendUrl}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Me proxy error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
