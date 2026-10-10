import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.APP_ORIGIN ?? 'https://gumnly.tech';
  return ['', '/products', '/services', '/about', '/contact', '/privacy'].map(path => ({
    url: base + path,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.7,
  }));
}
