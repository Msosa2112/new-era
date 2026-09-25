import { Agent, Property } from '../types/property';
import { BROKERAGE_DATA } from '../data/agentsData';

export const SITE_URL = 'https://newerarealestateky.com';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/hero-desktop-poster.jpg`;

export interface SEOMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: string;
  ogType: 'website' | 'article' | 'profile';
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  twitterCard: 'summary_large_image' | 'summary';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  jsonLd: Record<string, any> | Record<string, any>[];
  lang: 'en' | 'es';
}

/**
 * Returns structured LocalBusiness / RealEstateAgent / Organization JSON-LD for New Era Real Estate
 */
export const getBrokerageSchema = () => ({
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'Organization'],
  '@id': `${SITE_URL}/#brokerage`,
  name: BROKERAGE_DATA.name,
  legalName: BROKERAGE_DATA.legalName,
  url: SITE_URL,
  logo: `${SITE_URL}/assets/branding/logo-white.svg`,
  image: DEFAULT_OG_IMAGE,
  telephone: '+1-502-500-0409',
  email: BROKERAGE_DATA.email,
  priceRange: '$$$',
  currenciesAccepted: 'USD',
  paymentAccepted: 'Cash, Credit Card, Wire Transfer, Mortgage Financing',
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${BROKERAGE_DATA.address.street}, ${BROKERAGE_DATA.address.suite}`,
    addressLocality: BROKERAGE_DATA.address.city,
    addressRegion: BROKERAGE_DATA.address.state,
    postalCode: BROKERAGE_DATA.address.zip,
    addressCountry: 'US'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 38.1631,
    longitude: -85.6985
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:30'
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday'],
      opens: '10:00',
      closes: '16:00'
    }
  ],
  areaServed: [
    {
      '@type': 'AdministrativeArea',
      name: 'Greater Louisville'
    },
    {
      '@type': 'AdministrativeArea',
      name: 'Jefferson County, KY'
    },
    {
      '@type': 'AdministrativeArea',
      name: 'Oldham County, KY'
    },
    {
      '@type': 'AdministrativeArea',
      name: 'Shelby County, KY'
    },
    {
      '@type': 'AdministrativeArea',
      name: 'Bullitt County, KY'
    }
  ],
  knowsLanguage: ['en', 'es'],
  founder: {
    '@type': 'Person',
    name: 'Yeilen Contreras',
    jobTitle: 'Principal Broker & Founder'
  },
  sameAs: [
    'https://www.instagram.com',
    'https://www.facebook.com',
    'https://www.linkedin.com'
  ]
});

/**
 * Generates Schema.org Person & RealEstateAgent for an individual advisor
 */
export const getAgentSchema = (agent: Agent, canonicalUrl: string) => ({
  '@context': 'https://schema.org',
  '@type': ['Person', 'RealEstateAgent'],
  '@id': `${canonicalUrl}/#agent`,
  name: agent.name,
  jobTitle: agent.title,
  worksFor: {
    '@type': 'RealEstateAgent',
    '@id': `${SITE_URL}/#brokerage`,
    name: BROKERAGE_DATA.name,
    url: SITE_URL
  },
  telephone: agent.phone,
  email: agent.email,
  image: agent.photoUrl.startsWith('http') ? agent.photoUrl : `${SITE_URL}${agent.photoUrl}`,
  url: canonicalUrl,
  description: agent.bio,
  knowsLanguage: agent.languages || ['English', 'Spanish'],
  hasCredential: agent.licenseNumber ? {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'License',
    recognizedBy: {
      '@type': 'GovernmentOrganization',
      name: 'Kentucky Real Estate Commission'
    },
    identifier: agent.licenseNumber
  } : undefined,
  areaServed: [
    'Greater Louisville, KY',
    'Kentucky'
  ]
});

/**
 * Generates Schema.org SingleFamilyResidence / RealEstateListing for a property
 */
export const getPropertySchema = (property: Property, canonicalUrl: string, agent?: Agent | null) => ({
  '@context': 'https://schema.org',
  '@type': ['SingleFamilyResidence', 'RealEstateListing'],
  '@id': `${canonicalUrl}/#property`,
  name: property.title,
  description: property.description,
  url: canonicalUrl,
  image: property.media?.map(m => m.url) || [],
  address: {
    '@type': 'PostalAddress',
    streetAddress: property.location.address,
    addressLocality: property.location.city,
    addressRegion: property.location.state,
    postalCode: property.location.zip,
    addressCountry: 'US'
  },
  geo: property.location.latitude && property.location.longitude ? {
    '@type': 'GeoCoordinates',
    latitude: property.location.latitude,
    longitude: property.location.longitude
  } : undefined,
  numberOfBedrooms: property.bedrooms,
  numberOfBathroomsTotal: property.bathrooms,
  floorSize: {
    '@type': 'QuantitativeValue',
    value: property.sqft,
    unitCode: 'FTK'
  },
  offers: {
    '@type': 'Offer',
    price: property.price,
    priceCurrency: 'USD',
    availability: property.status === 'Sold' ? 'https://schema.org/Sold' : 'https://schema.org/InStock',
    validFrom: property.listedAt || '2026-01-01',
    offeredBy: agent ? {
      '@type': 'Person',
      name: agent.name,
      telephone: agent.phone,
      email: agent.email
    } : {
      '@type': 'RealEstateAgent',
      name: BROKERAGE_DATA.name,
      telephone: BROKERAGE_DATA.phone
    }
  }
});

/**
 * Generates BreadcrumbList schema
 */
export const getBreadcrumbSchema = (items: { name: string; item: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: crumb.item
  }))
});

/**
 * Resolves full page metadata based on current active page, language, and selected entity
 */
export const getPageSEOMetadata = (
  activePage: string,
  lang: 'en' | 'es',
  selectedAgent?: Agent | null,
  selectedProperty?: Property | null
): SEOMetadata => {
  const isEs = lang === 'es';

  // 1. DYNAMIC PROPERTY DETAIL VIEW
  if (selectedProperty) {
    const canonical = `${SITE_URL}/#/properties/${selectedProperty.slug}`;
    const primaryImg = selectedProperty.media?.[0]?.url || DEFAULT_OG_IMAGE;
    const title = isEs
      ? `${selectedProperty.title} en ${selectedProperty.location.city}, KY | New Era Real Estate`
      : `${selectedProperty.title} in ${selectedProperty.location.city}, KY | New Era Real Estate`;
    const description = isEs
      ? `Propiedad exclusiva en ${selectedProperty.location.address}, ${selectedProperty.location.city}. ${selectedProperty.bedrooms} habs, ${selectedProperty.bathrooms} baños, ${selectedProperty.sqft.toLocaleString()} sqft por $${selectedProperty.price.toLocaleString()}. Asesoría inmobiliaria New Era.`
      : `Exclusive listing at ${selectedProperty.location.address}, ${selectedProperty.location.city}. ${selectedProperty.bedrooms} beds, ${selectedProperty.bathrooms} baths, ${selectedProperty.sqft.toLocaleString()} sqft listed for $${selectedProperty.price.toLocaleString()}. New Era Real Estate.`;

    const breadcrumbs = getBreadcrumbSchema([
      { name: isEs ? 'Inicio' : 'Home', item: `${SITE_URL}/` },
      { name: isEs ? 'Propiedades' : 'Properties', item: `${SITE_URL}/#/properties` },
      { name: selectedProperty.title, item: canonical }
    ]);

    const propertySchema = getPropertySchema(selectedProperty, canonical, selectedAgent);

    return {
      title,
      description,
      canonicalUrl: canonical,
      robots: 'index, follow',
      ogType: 'article',
      ogTitle: title,
      ogDescription: description,
      ogImage: primaryImg,
      ogUrl: canonical,
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: primaryImg,
      jsonLd: [breadcrumbs, propertySchema],
      lang
    };
  }

  // 2. DYNAMIC ADVISOR PROFILE
  if (activePage === 'agent-profile' && selectedAgent) {
    const canonical = `${SITE_URL}/#/agents/${selectedAgent.id}`;
    const agentPhoto = selectedAgent.photoUrl.startsWith('http')
      ? selectedAgent.photoUrl
      : `${SITE_URL}${selectedAgent.photoUrl}`;
    const title = isEs
      ? `${selectedAgent.name} - Asesor Inmobiliario | New Era Real Estate`
      : `${selectedAgent.name} - Real Estate Advisor | New Era Real Estate`;
    const description = isEs
      ? `Conoce a ${selectedAgent.name}, ${selectedAgent.title} en New Era Real Estate. Asesoría bilingüe de compra y venta en Greater Louisville y Kentucky. Teléfono: ${selectedAgent.phone}.`
      : `Connect with ${selectedAgent.name}, ${selectedAgent.title} at New Era Real Estate. Elite residential representation across Greater Louisville and Kentucky. Call ${selectedAgent.phone}.`;

    const breadcrumbs = getBreadcrumbSchema([
      { name: isEs ? 'Inicio' : 'Home', item: `${SITE_URL}/` },
      { name: isEs ? 'Asesores' : 'Advisors', item: `${SITE_URL}/#/agents` },
      { name: selectedAgent.name, item: canonical }
    ]);

    const agentSchema = getAgentSchema(selectedAgent, canonical);

    return {
      title,
      description,
      canonicalUrl: canonical,
      robots: 'index, follow',
      ogType: 'profile',
      ogTitle: title,
      ogDescription: description,
      ogImage: agentPhoto,
      ogUrl: canonical,
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: agentPhoto,
      jsonLd: [breadcrumbs, agentSchema],
      lang
    };
  }

  // 3. STATIC AND CORE PAGES
  switch (activePage) {
    case 'properties': {
      const canonical = `${SITE_URL}/#/properties`;
      const title = isEs
        ? 'Casas y Propiedades en Venta en Louisville KY | New Era Real Estate'
        : 'Homes & Real Estate for Sale in Louisville KY | New Era Real Estate';
      const description = isEs
        ? 'Explora el inventario exclusivo de propiedades residenciales y de lujo en Louisville, Prospect, Norton Commons y Greater Louisville con New Era Real Estate.'
        : 'Explore exclusive residential and luxury homes for sale in Greater Louisville, Prospect, Norton Commons, and Kentucky with New Era Real Estate.';

      return {
        title,
        description,
        canonicalUrl: canonical,
        robots: 'index, follow',
        ogType: 'website',
        ogTitle: title,
        ogDescription: description,
        ogImage: DEFAULT_OG_IMAGE,
        ogUrl: canonical,
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: DEFAULT_OG_IMAGE,
        jsonLd: [
          getBreadcrumbSchema([
            { name: isEs ? 'Inicio' : 'Home', item: `${SITE_URL}/` },
            { name: isEs ? 'Propiedades' : 'Properties', item: canonical }
          ])
        ],
        lang
      };
    }

    case 'buy': {
      const canonical = `${SITE_URL}/#/buy`;
      const title = isEs
        ? 'Guía y Asesoría para Comprar Casa en Louisville KY | New Era Real Estate'
        : 'Home Buying Advisory & Representation in Louisville KY | New Era Real Estate';
      const description = isEs
        ? 'Asesoría especializada de compra residencial en Kentucky. Búsqueda de inventario off-market, negociación estratégica y acompañamiento en todo el proceso.'
        : 'Strategic homebuyer advisory and representation in Greater Louisville and Kentucky. Access off-market properties, competitive negotiation, and seamless closing milestones.';

      return {
        title,
        description,
        canonicalUrl: canonical,
        robots: 'index, follow',
        ogType: 'website',
        ogTitle: title,
        ogDescription: description,
        ogImage: DEFAULT_OG_IMAGE,
        ogUrl: canonical,
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: DEFAULT_OG_IMAGE,
        jsonLd: [
          getBreadcrumbSchema([
            { name: isEs ? 'Inicio' : 'Home', item: `${SITE_URL}/` },
            { name: isEs ? 'Comprar' : 'Buy', item: canonical }
          ])
        ],
        lang
      };
    }

    case 'sell': {
      const canonical = `${SITE_URL}/#/sell`;
      const title = isEs
        ? 'Vende Tu Propiedad y Valuación Inmobiliaria en Louisville | New Era Real Estate'
        : 'Sell Your Home & Real Estate Valuation in Louisville KY | New Era Real Estate';
      const description = isEs
        ? 'Maximiza el valor de tu propiedad con marketing arquitectónico de alta gama, análisis comparativo de mercado y representación de élite en Greater Louisville y Kentucky.'
        : 'Maximize your property value with bespoke architectural marketing, comparative market intelligence, and elite listing representation in Greater Louisville and Kentucky.';

      return {
        title,
        description,
        canonicalUrl: canonical,
        robots: 'index, follow',
        ogType: 'website',
        ogTitle: title,
        ogDescription: description,
        ogImage: DEFAULT_OG_IMAGE,
        ogUrl: canonical,
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: DEFAULT_OG_IMAGE,
        jsonLd: [
          getBreadcrumbSchema([
            { name: isEs ? 'Inicio' : 'Home', item: `${SITE_URL}/` },
            { name: isEs ? 'Vender' : 'Sell', item: canonical }
          ])
        ],
        lang
      };
    }

    case 'agents': {
      const canonical = `${SITE_URL}/#/agents`;
      const title = isEs
        ? 'Equipo de Asesores Inmobiliarios | New Era Real Estate Louisville'
        : 'Real Estate Advisors & Brokers | New Era Real Estate Louisville';
      const description = isEs
        ? 'Conoce a nuestro equipo bilingüe de REALTORS® y asesores inmobiliarios con licencia en Kentucky, liderados por la Principal Broker Yeilen Contreras.'
        : 'Meet our bilingual team of licensed REALTORS® and real estate advisors serving Greater Louisville and Kentucky, led by Principal Broker Yeilen Contreras.';

      return {
        title,
        description,
        canonicalUrl: canonical,
        robots: 'index, follow',
        ogType: 'website',
        ogTitle: title,
        ogDescription: description,
        ogImage: DEFAULT_OG_IMAGE,
        ogUrl: canonical,
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: DEFAULT_OG_IMAGE,
        jsonLd: [
          getBreadcrumbSchema([
            { name: isEs ? 'Inicio' : 'Home', item: `${SITE_URL}/` },
            { name: isEs ? 'Asesores' : 'Advisors', item: canonical }
          ])
        ],
        lang
      };
    }

    case 'about': {
      const canonical = `${SITE_URL}/#/about`;
      const title = isEs
        ? 'Sobre Nosotros y Filosofía Inmobiliaria | New Era Real Estate'
        : 'About Us & Brokerage Philosophy | New Era Real Estate';
      const description = isEs
        ? 'New Era Real Estate es una agencia inmobiliaria moderna con sede en Louisville, KY, con licencia en Kentucky. Distinción arquitectónica y rigor analítico.'
        : 'New Era Real Estate is a modern brokerage headquartered in Louisville, KY, holding licensure in Kentucky. Driven by architectural distinction and market precision.';

      return {
        title,
        description,
        canonicalUrl: canonical,
        robots: 'index, follow',
        ogType: 'website',
        ogTitle: title,
        ogDescription: description,
        ogImage: DEFAULT_OG_IMAGE,
        ogUrl: canonical,
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: DEFAULT_OG_IMAGE,
        jsonLd: [
          getBreadcrumbSchema([
            { name: isEs ? 'Inicio' : 'Home', item: `${SITE_URL}/` },
            { name: isEs ? 'Nosotros' : 'About', item: canonical }
          ]),
          getBrokerageSchema()
        ],
        lang
      };
    }

    case 'contact': {
      const canonical = `${SITE_URL}/#/contact`;
      const title = isEs
        ? 'Contacto y Ubicación de Oficinas | New Era Real Estate Louisville'
        : 'Contact Us & Office Location | New Era Real Estate Louisville';
      const description = isEs
        ? 'Ponte en contacto con New Era Real Estate. Oficinas en 6501 Shepherdsville Road, Suite 119, Louisville, KY 40219. Teléfono: (502) 500-0409.'
        : 'Contact New Era Real Estate. Headquarters located at 6501 Shepherdsville Road, Suite 119, Louisville, KY 40219. Call (502) 500-0409.';

      return {
        title,
        description,
        canonicalUrl: canonical,
        robots: 'index, follow',
        ogType: 'website',
        ogTitle: title,
        ogDescription: description,
        ogImage: DEFAULT_OG_IMAGE,
        ogUrl: canonical,
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: DEFAULT_OG_IMAGE,
        jsonLd: [
          getBreadcrumbSchema([
            { name: isEs ? 'Inicio' : 'Home', item: `${SITE_URL}/` },
            { name: isEs ? 'Contacto' : 'Contact', item: canonical }
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            url: canonical,
            name: title,
            description,
            mainEntity: getBrokerageSchema()
          }
        ],
        lang
      };
    }

    case 'home':
    default: {
      const canonical = `${SITE_URL}/`;
      const title = isEs
        ? 'New Era Real Estate | Bienes Raíces en Louisville y Kentucky'
        : 'New Era Real Estate | Real Estate Brokerage in Louisville & Greater Kentucky';
      const description = isEs
        ? 'Agencia inmobiliaria líder en Greater Louisville y Kentucky. Representación de lujo, compra y venta de propiedades residenciales con asesoría bilingüe experta.'
        : 'Premier real estate brokerage serving Greater Louisville and Kentucky. Modern architecture, data-driven intelligence, and bespoke bilingual property representation.';

      return {
        title,
        description,
        canonicalUrl: canonical,
        robots: 'index, follow',
        ogType: 'website',
        ogTitle: title,
        ogDescription: description,
        ogImage: DEFAULT_OG_IMAGE,
        ogUrl: canonical,
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: DEFAULT_OG_IMAGE,
        jsonLd: [
          getBrokerageSchema(),
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            url: SITE_URL,
            name: BROKERAGE_DATA.name,
            description,
            inLanguage: ['en', 'es'],
            publisher: {
              '@id': `${SITE_URL}/#brokerage`
            }
          }
        ],
        lang
      };
    }
  }
};
