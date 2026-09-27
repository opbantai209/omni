/**
 * Slug & URL utility functions for SEO-friendly routing
 */

export function generateSlug(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // swap spaces and underscores for a single dash
    .replace(/^-+|-+$/g, ''); // remove leading and trailing dashes
}

export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;
  // Must be lowercase alphanumeric with hyphens, not starting or ending with hyphen
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

export function formatUrlPath(path: string): string {
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  return path;
}

export function getCategoryUrl(categorySlug: string): string {
  return `/${categorySlug}`;
}

export function getSubcategoryUrl(categorySlug: string, subcategorySlug: string): string {
  return `/${categorySlug}/${subcategorySlug}`;
}

export function getCalculatorUrl(categorySlug: string, subcategorySlug: string | undefined | null, calculatorSlug: string): string {
  if (subcategorySlug) {
    return `/${categorySlug}/${subcategorySlug}/${calculatorSlug}`;
  }
  return `/${categorySlug}/${calculatorSlug}`;
}
