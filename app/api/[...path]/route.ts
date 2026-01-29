import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxyRequest(request, path);
}

export async function POST(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxyRequest(request, path);
}

export async function PUT(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxyRequest(request, path);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxyRequest(request, path);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxyRequest(request, path);
}

async function proxyRequest(request: Request, path: string[]) {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_APIGATEWAY_URL;
        if (!backendUrl) {
            return NextResponse.json({ message: 'Backend URL not configured' }, { status: 500 });
        }

        const fullPath = path.join('/');
        const searchParams = new URL(request.url).searchParams;
        const url = `${backendUrl}/api/${fullPath}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        const headers = new Headers(request.headers);
        headers.delete('host');
        headers.delete('connection');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        const options: RequestInit = {
            method: request.method,
            headers: headers,
        };

        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
            try {
                const body = await request.clone().text();
                if (body) {
                    options.body = body;
                }
            } catch (e) {
                // No body or unreadable body
            }
        }

        const response = await fetch(url, options);

        // Check if we got a 401 from backend, might need to clear cookie
        if (response.status === 401) {
            // Optional: clear cookie on 401? For now let's just pass it through
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        } else {
            const data = await response.blob();
            return new NextResponse(data, {
                status: response.status,
                headers: {
                    'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
                },
            });
        }
    } catch (error) {
        console.error(`Proxy error for ${path.join('/')}:`, error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
