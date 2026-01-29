import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ message: 'Token is required' }, { status: 400 });
        }

        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return NextResponse.json({ message: 'Session established' });
    } catch (error) {
        console.error('Session error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
