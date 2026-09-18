import React, { useEffect } from 'react';
import { Agent, Property } from '../../types/property';
import { getPageSEOMetadata, SITE_URL } from '../../lib/seo';

interface SEOHeadProps {
  activePage: string;
  lang: 'en' | 'es';
  selectedAgent?: Agent | null;
  selectedProperty?: Property | null;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  activePage,
  lang,
  selectedAgent,
  selectedProperty
}) => {
  useEffect(() => {
    const meta = getPageSEOMetadata(activePage, lang, selectedAgent, selectedProperty);

    // 1. Update Title
    document.title = meta.title;

    // 2. Update HTML Language attribute
    document.documentElement.lang = lang;

    // 3. Helper to update or create <meta> tags in <head>
    const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 4. Helper to update or create <link> tags in <head>
    const setLinkTag = (rel: string, href: string) => {
      let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Standard Meta
    setMetaTag('meta[name="description"]', 'name', 'description', meta.description);
    setMetaTag('meta[name="robots"]', 'name', 'robots', meta.robots);
    setLinkTag('canonical', meta.canonicalUrl);

    // Open Graph
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', meta.ogType);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', meta.ogTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', meta.ogDescription);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', meta.ogImage);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', meta.ogUrl);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'New Era Real Estate');
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', lang === 'es' ? 'es_US' : 'en_US');
    setMetaTag('meta[property="og:locale:alternate"]', 'property', 'og:locale:alternate', lang === 'es' ? 'en_US' : 'es_US');

    // Twitter / X Cards
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', meta.twitterCard);
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', meta.twitterTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', meta.twitterDescription);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', meta.twitterImage);

    // 5. Injected JSON-LD Structured Data Graph
    let jsonLdScript = document.head.querySelector<HTMLScriptElement>('#seo-jsonld');
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'seo-jsonld';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(
      Array.isArray(meta.jsonLd)
        ? {
            '@context': 'https://schema.org',
            '@graph': meta.jsonLd
          }
        : meta.jsonLd
    );
  }, [activePage, lang, selectedAgent, selectedProperty]);

  return null; // Head-only injection, zero visual footprint
};
