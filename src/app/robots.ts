import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/private/', '/api/'],
        },
        sitemap: 'https://gayatri-pariwar-bhiwandi.vercel.app/sitemap.xml',
    };
}
