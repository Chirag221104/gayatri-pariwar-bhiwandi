import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://gayatri-pariwar-bhiwandi.vercel.app';

    // Core routes for all locales
    const routes = [
        '',
        '/about',
        '/contact',
        '/events',
        '/news',
        '/resources',
        '/spiritual',
        '/media',
        '/terms-of-service',
        '/privacy-policy',
    ];

    const locales = ['en', 'hi', 'gu', 'mr'];

    return routes.flatMap((route) =>
        locales.map((locale) => ({
            url: `${baseUrl}/${locale}${route}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: route === '' ? 1 : 0.8,
        }))
    );
}
