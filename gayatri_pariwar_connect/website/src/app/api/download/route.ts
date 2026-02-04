import { NextRequest, NextResponse } from 'next/server';

const mimeToExt: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'application/pdf': '.pdf',
};

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    let url = searchParams.get('url');
    let filename = searchParams.get('name') || 'download';

    if (!url) {
        return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
    }

    // Resolve relative URLs (like /logo.png) to absolute URLs
    if (url.startsWith('/')) {
        url = new URL(url, request.url).toString();
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        const blob = await response.blob();

        // Check for extension
        const ext = mimeToExt[contentType] || '.jpg';
        if (!filename.toLowerCase().endsWith(ext)) {
            const hasAnyExtension = /\.[a-zA-Z0-9]{3,4}$/.test(filename);
            if (!hasAnyExtension) {
                filename += ext;
            }
        }

        const headers = new Headers();
        headers.set('Content-Type', contentType);

        // Handle Unicode filenames using RFC 5987 standard
        // This fixes the "TypeError: Cannot convert argument to a ByteString..." error
        // Encode the filename and escape regex characters
        const encodedFilename = encodeURIComponent(filename).replace(/['()]/g, escape).replace(/\*/g, '%2A');
        headers.set('Content-Disposition', `attachment; filename*=UTF-8''${encodedFilename}`);

        return new NextResponse(blob, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Download proxy error:', error);
        return NextResponse.json({ error: 'Failed to download image' }, { status: 500 });
    }
}
