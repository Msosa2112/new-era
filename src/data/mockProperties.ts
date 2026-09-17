import { Property } from '../types/property';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-001',
    slug: 'the-glass-pavilion-at-harrods-creek',
    title: 'The Modern Pavilion at Harrods Creek',
    price: 1475000,
    status: 'Exclusive',
    transactionType: 'Buy',
    propertyType: 'Luxury Estate',
    location: {
      address: '6804 River Road',
      city: 'Prospect',
      state: 'KY',
      zip: '40059',
      neighborhood: 'Harrods Creek',
      county: 'Jefferson',
      latitude: 38.3312,
      longitude: -85.6219,
      schoolDistrict: 'Oldham / Jefferson County Public'
    },
    bedrooms: 5,
    bathrooms: 5,
    halfBaths: 1,
    sqft: 5820,
    lotSizeAcres: 2.14,
    garageSpaces: 3,
    description: 'An architectural masterpiece overlooking the Ohio River valley. Featuring floor-to-ceiling structural glass, cantilevered cedar overhangs, bespoke European walnut cabinetry, and a private infinity pool that melts into the tree canopy.',
    highlightStory: 'Commissioned by a renowned regional architect, this estate bridges brutalist concrete warmth with fluid organic light.',
    featured: true,
    architecturalStyle: 'Contemporary Organic Modern',
    media: [
      {
        id: 'm1',
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85',
        caption: 'Front architectural facade at twilight',
        isPrimary: true,
        type: 'image'
      },
      {
        id: 'm2',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
        caption: 'Great room with 22-foot glass wall',
        type: 'image'
      },
      {
        id: 'm3',
        url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1800&q=85',
        caption: 'Chef kitchen with waterfall quartzite island',
        type: 'image'
      },
      {
        id: 'm4',
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85',
        caption: 'Primary suite with private river terrace',
        type: 'image'
      }
    ],
    features: [
      {
        category: 'Interior Highlights',
        items: ['22-ft ceiling heights', 'Sub-Zero & Wolf appliance suite', 'Temp-controlled 450-bottle wine cellar', 'Radiant heated terrazzo flooring', 'Smart home automation system']
      },
      {
        category: 'Exterior & Grounds',
        items: ['Heated saltwater infinity pool', 'Covered outdoor kitchen & fire pit', 'Private walking trail to creek', '3-car conditioned garage', 'Irrigated native landscape design']
      }
    ],
    mls: {
      mlsId: 'KY-2026-9921',
      mlsSource: 'INTERNAL_MOCK',
      parcelNumber: '028B-0045-0000',
      taxAnnualAmount: 14200,
      hoaFee: 150,
      yearBuilt: 2023,
      daysOnMarket: 14
    },
    agentId: 'yeilen-contreras',
    listedAt: '2026-09-02',
    updatedAt: '2026-09-15'
  },
  {
    id: 'prop-002',
    slug: 'the-cherokee-triangle-brownstone',
    title: 'The Historic Residence on Cherokee Parkway',
    price: 895000,
    status: 'Active',
    transactionType: 'Buy',
    propertyType: 'Single Family',
    location: {
      address: '1418 Cherokee Parkway',
      city: 'Louisville',
      state: 'KY',
      zip: '40204',
      neighborhood: 'Cherokee Triangle / Highlands',
      county: 'Jefferson',
      latitude: 38.2395,
      longitude: -85.7118
    },
    bedrooms: 4,
    bathrooms: 3,
    halfBaths: 1,
    sqft: 3640,
    lotSizeAcres: 0.28,
    garageSpaces: 2,
    description: 'Impeccably restored 1912 Victorian revival directly facing Olmsted-designed Cherokee Park. Intricate original millwork, soaring pocket doors, paired with a newly completed state-of-the-art chef’s kitchen and private rear carriage house.',
    highlightStory: 'Timeless architectural heritage updated with modern energy systems and luxury finishes.',
    featured: true,
    architecturalStyle: 'Turn-of-the-Century Victorian Revival',
    media: [
      {
        id: 'm2-1',
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=85',
        caption: 'Historic brick exterior with grand wraparound porch',
        isPrimary: true,
        type: 'image'
      },
      {
        id: 'm2-2',
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85',
        caption: 'Formal living room with original marble fireplace',
        type: 'image'
      },
      {
        id: 'm2-3',
        url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1800&q=85',
        caption: 'Remodeled master bathroom with freestanding soaking tub',
        type: 'image'
      }
    ],
    features: [
      {
        category: 'Heritage Details',
        items: ['Hand-carved oak staircase', 'Restored stained glass transoms', 'Four working fireplaces', 'Heart-pine hardwood floors']
      },
      {
        category: 'Modern Amenities',
        items: ['Geothermal HVAC dual-zone', 'EV charging station in carriage house', 'Custom pantry with prep sink', 'Security monitoring suite']
      }
    ],
    mls: {
      mlsId: 'KY-2026-8419',
      mlsSource: 'INTERNAL_MOCK',
      taxAnnualAmount: 8900,
      yearBuilt: 1912,
      daysOnMarket: 9
    },
    agentId: 'claudiakyrealtor',
    listedAt: '2026-09-08',
    updatedAt: '2026-09-16'
  },
  {
    id: 'prop-003',
    slug: 'the-monolith-at-norton-commons',
    title: 'The Contemporary Villa at Norton Commons',
    price: 765000,
    status: 'New',
    transactionType: 'Buy',
    propertyType: 'Single Family',
    location: {
      address: '9412 Bergamot Drive',
      city: 'Prospect',
      state: 'KY',
      zip: '40059',
      neighborhood: 'Norton Commons',
      county: 'Jefferson',
      latitude: 38.3184,
      longitude: -85.5521
    },
    bedrooms: 4,
    bathrooms: 3,
    halfBaths: 1,
    sqft: 3120,
    lotSizeAcres: 0.18,
    garageSpaces: 2,
    description: 'Walkable luxury living at its zenith. Crisp monolithic lines, expansive courtyard with outdoor fireplace, geothermal heating/cooling, and steps from boutique dining, amphitheaters, and parks.',
    highlightStory: 'A modern sanctuary designed for low-maintenance elegance and vibrant community connection.',
    featured: true,
    architecturalStyle: 'Modern Neo-Traditional',
    media: [
      {
        id: 'm3-1',
        url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=85',
        caption: 'Front courtyard with architectural gas lanterns',
        isPrimary: true,
        type: 'image'
      },
      {
        id: 'm3-2',
        url: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1800&q=85',
        caption: 'Open concept living and dining zone',
        type: 'image'
      }
    ],
    features: [
      {
        category: 'Key Features',
        items: ['Geothermal 100% efficient HVAC', 'Private central courtyard with pergola', 'Finished basement with guest suite', 'Walk to shops and pools']
      }
    ],
    mls: {
      mlsId: 'KY-2026-7201',
      mlsSource: 'INTERNAL_MOCK',
      taxAnnualAmount: 7100,
      hoaFee: 95,
      yearBuilt: 2024,
      daysOnMarket: 3
    },
    agentId: 'dianelis-rodriguez',
    listedAt: '2026-09-14',
    updatedAt: '2026-09-17'
  },
  {
    id: 'prop-004',
    slug: 'the-anchorage-woodland-sanctuary',
    title: 'The Woodland Sanctuary in Historic Anchorage',
    price: 1980000,
    status: 'Exclusive',
    transactionType: 'Buy',
    propertyType: 'Luxury Estate',
    location: {
      address: '11405 Evergreen Road',
      city: 'Anchorage',
      state: 'KY',
      zip: '40223',
      neighborhood: 'Anchorage Trail Estate',
      county: 'Jefferson',
      latitude: 38.2711,
      longitude: -85.5398
    },
    bedrooms: 6,
    bathrooms: 6,
    halfBaths: 2,
    sqft: 7200,
    lotSizeAcres: 4.8,
    garageSpaces: 4,
    description: 'Surrounded by century-old oak and maple trees, this private gated retreat offers unprecedented quietude just 20 minutes from downtown Louisville. Features tennis court, guest cottage, and equestrian-ready grounds.',
    highlightStory: 'A multi-generational country estate within one of Kentucky’s most coveted school districts.',
    featured: true,
    architecturalStyle: 'Kentucky Transitional Manor',
    media: [
      {
        id: 'm4-1',
        url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85',
        caption: 'Stately stone facade and private drive',
        isPrimary: true,
        type: 'image'
      },
      {
        id: 'm4-2',
        url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=85',
        caption: 'Bespoke library with floor-to-ceiling millwork',
        type: 'image'
      }
    ],
    features: [
      {
        category: 'Estate Amenities',
        items: ['Gated 4.8 acre parcel', 'Independent guest house (1,200 sqft)', 'Full private regulation tennis court', 'Heated 4-car garage with workshop']
      }
    ],
    mls: {
      mlsId: 'KY-2026-3392',
      mlsSource: 'INTERNAL_MOCK',
      taxAnnualAmount: 18400,
      yearBuilt: 2021,
      daysOnMarket: 21
    },
    agentId: 'yeilen-contreras',
    listedAt: '2026-08-27',
    updatedAt: '2026-09-10'
  },
  {
    id: 'prop-005',
    slug: 'st-matthews-modern-craftsman',
    title: 'Modern Craftsman on Grandview Avenue',
    price: 529000,
    status: 'Active',
    transactionType: 'Buy',
    propertyType: 'Single Family',
    location: {
      address: '3718 Grandview Avenue',
      city: 'Louisville',
      state: 'KY',
      zip: '40207',
      neighborhood: 'St. Matthews',
      county: 'Jefferson',
      latitude: 38.2523,
      longitude: -85.6481
    },
    bedrooms: 3,
    bathrooms: 2,
    halfBaths: 1,
    sqft: 2280,
    lotSizeAcres: 0.22,
    garageSpaces: 2,
    description: 'Charming character meets modern minimalist renovation. Seamless open layout, quartz kitchen counters, primary suite on main level, and an entertainer’s backyard patio under mature shaded trees.',
    highlightStory: 'Prime St. Matthews location, minutes from Seneca Park, shopping, and local bistros.',
    featured: false,
    architecturalStyle: 'Renovated Craftsman',
    media: [
      {
        id: 'm5-1',
        url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1800&q=85',
        caption: 'Front exterior with slate walkway and native garden',
        isPrimary: true,
        type: 'image'
      }
    ],
    features: [
      {
        category: 'Highlights',
        items: ['Main-level master suite', 'Custom kitchen banquette', 'Fenced level yard with cedar deck', 'New roof and energy-rated windows']
      }
    ],
    mls: {
      mlsId: 'KY-2026-5510',
      mlsSource: 'INTERNAL_MOCK',
      taxAnnualAmount: 4900,
      yearBuilt: 1954,
      daysOnMarket: 11
    },
    agentId: 'geraldine-sanchez',
    listedAt: '2026-09-06',
    updatedAt: '2026-09-14'
  },
  {
    id: 'prop-006',
    slug: 'the-river-ridge-condominiums',
    title: 'Skyline Penthouse at River Ridge',
    price: 640000,
    status: 'Price Improved',
    transactionType: 'Buy',
    propertyType: 'Modern Condo',
    location: {
      address: '200 E Market Street #802',
      city: 'Jeffersonville',
      state: 'IN',
      zip: '47130',
      neighborhood: 'Downtown Riverfront',
      county: 'Clark',
      latitude: 38.2716,
      longitude: -85.7402
    },
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2450,
    lotSizeAcres: 0.0,
    garageSpaces: 2,
    description: 'Unrivaled panoramic views of the Louisville downtown skyline across the Big Four Bridge. 10-foot ceilings, corner terrace, private elevator access, and reserved underground parking.',
    highlightStory: 'Walk to Big Four Bridge, fine dining, and riverfront parks with zero maintenance worries.',
    featured: false,
    architecturalStyle: 'Contemporary High-Rise Penthouse',
    media: [
      {
        id: 'm6-1',
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1800&q=85',
        caption: 'Corner penthouse terrace with skyline views',
        isPrimary: true,
        type: 'image'
      }
    ],
    features: [
      {
        category: 'Condo Amenities',
        items: ['Direct secure elevator entry', 'Corner wraparound balcony (380 sqft)', '2 assigned heated garage spaces', 'Fitness center & rooftop lounge']
      }
    ],
    mls: {
      mlsId: 'IN-2026-1049',
      mlsSource: 'INTERNAL_MOCK',
      taxAnnualAmount: 5600,
      hoaFee: 420,
      yearBuilt: 2022,
      daysOnMarket: 18
    },
    agentId: 'gio-del-mare',
    listedAt: '2026-08-30',
    updatedAt: '2026-09-12'
  }
];
