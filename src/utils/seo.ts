/**
 * Dynamic SEO, Meta Tags, JSON-LD Schema, XML Sitemap, and Robots.txt utility
 */

import { Category, Subcategory, Calculator, BreadcrumbItem, SiteSettings } from '../types';
import { getCategoryUrl, getSubcategoryUrl, getCalculatorUrl } from './slug';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  schema?: Record<string, any>;
}

/**
 * Update document head metadata dynamically
 */
export function updateSEO({
  title,
  description,
  keywords,
  canonicalUrl,
  ogType = 'website',
  publishedTime,
  modifiedTime,
  schema,
}: SEOProps) {
  if (typeof document === 'undefined') return;

  // Title
  if (title) {
    document.title = title;
    updateMetaTag('og:title', title);
    updateMetaTag('twitter:title', title);
  }

  // Description
  if (description) {
    updateMetaTag('description', description, 'name');
    updateMetaTag('og:description', description);
    updateMetaTag('twitter:description', description);
  }

  // Keywords
  if (keywords && keywords.length > 0) {
    updateMetaTag('keywords', keywords.join(', '), 'name');
  }

  // Type
  updateMetaTag('og:type', ogType);

  // Dates
  if (publishedTime) {
    updateMetaTag('article:published_time', publishedTime);
  }
  if (modifiedTime) {
    updateMetaTag('article:modified_time', modifiedTime);
  }

  // Canonical Link
  if (canonicalUrl) {
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
    updateMetaTag('og:url', canonicalUrl);
  }

  // Schema JSON-LD
  if (schema) {
    let scriptTag = document.getElementById('schema-json-ld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'schema-json-ld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(schema);
  }
}

function updateMetaTag(key: string, value: string, attributeName: 'property' | 'name' = 'property') {
  let element = document.querySelector(`meta[${attributeName}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', value);
}

/**
 * Build BreadcrumbList Schema
 */
export function buildBreadcrumbsSchema(breadcrumbs: BreadcrumbItem[], baseUrl: string = window.location.origin) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.label,
      item: crumb.href ? (crumb.href.startsWith('http') ? crumb.href : `${baseUrl}${crumb.href}`) : undefined,
    })),
  };
}

/**
 * Build WebSite / Calculator Schema
 */
export function buildCalculatorSchema(
  calc: Calculator,
  category: Category | undefined,
  baseUrl: string = window.location.origin
) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: calc.name,
    description: calc.shortDescription || calc.seoDescription,
    applicationCategory: category?.name || 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    datePublished: calc.createdAt,
    dateModified: calc.updatedAt,
  };

  if (calc.config.faqs && calc.config.faqs.length > 0) {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        schema,
        {
          '@type': 'FAQPage',
          mainEntity: calc.config.faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        },
      ],
    };
  }

  return schema;
}

/**
 * Generate XML Sitemap string from active categories, subcategories, and calculators only
 */
export function generateXmlSitemap(
  categories: Category[],
  subcategories: Subcategory[],
  calculators: Calculator[],
  baseUrl: string = (typeof window !== 'undefined' ? window.location.origin : 'https://example.com')
): string {
  const activeCategories = categories.filter(c => c.isActive);
  const activeCategoryIds = new Set(activeCategories.map(c => c.id));

  const activeSubcategories = subcategories.filter(s => s.isActive && activeCategoryIds.has(s.categoryId));
  const activeSubcategoryIds = new Set(activeSubcategories.map(s => s.id));

  const activeCalculators = calculators.filter(c => {
    if (!c.isActive) return false;
    if (!activeCategoryIds.has(c.categoryId)) return false;
    if (c.subcategoryId && !activeSubcategoryIds.has(c.subcategoryId)) return false;
    return true;
  });

  const urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> = [];

  // Home Page
  urls.push({
    loc: `${baseUrl}/`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: '1.0',
  });

  // Active Categories
  activeCategories.forEach(cat => {
    urls.push({
      loc: `${baseUrl}${getCategoryUrl(cat.slug)}`,
      lastmod: (cat.updatedAt || cat.createdAt || new Date().toISOString()).split('T')[0],
      changefreq: 'weekly',
      priority: '0.8',
    });
  });

  // Active Subcategories
  activeSubcategories.forEach(sub => {
    const parentCat = activeCategories.find(c => c.id === sub.categoryId);
    if (parentCat) {
      urls.push({
        loc: `${baseUrl}${getSubcategoryUrl(parentCat.slug, sub.slug)}`,
        lastmod: (sub.updatedAt || sub.createdAt || new Date().toISOString()).split('T')[0],
        changefreq: 'weekly',
        priority: '0.7',
      });
    }
  });

  // Active Calculators
  activeCalculators.forEach(calc => {
    const parentCat = activeCategories.find(c => c.id === calc.categoryId);
    const parentSub = subcategories.find(s => s.id === calc.subcategoryId);
    if (parentCat) {
      urls.push({
        loc: `${baseUrl}${getCalculatorUrl(parentCat.slug, parentSub?.slug, calc.slug)}`,
        lastmod: (calc.updatedAt || calc.createdAt || new Date().toISOString()).split('T')[0],
        changefreq: 'monthly',
        priority: '0.9',
      });
    }
  });

  const xmlEntries = urls
    .map(
      u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;
}
