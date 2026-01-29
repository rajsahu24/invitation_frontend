import { NextResponse } from 'next/server';

export async function GET() {
    const backendUrl = process.env.NEXT_PUBLIC_APIGATEWAY_URL;

    if (!backendUrl) {
        return NextResponse.json({ message: 'Backend URL not configured' }, { status: 500 });
    }

    // Direct redirect to backend google auth
    return NextResponse.redirect(`${backendUrl}/api/auth/google`);
}
