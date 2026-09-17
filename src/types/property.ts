export type ListingStatus = 'Active' | 'Pending' | 'Sold' | 'New' | 'Price Improved' | 'Exclusive';

export type PropertyType = 'Single Family' | 'Luxury Estate' | 'Modern Condo' | 'Townhome' | 'Waterfront' | 'Commercial' | 'Land';

export type TransactionType = 'Buy' | 'Sell' | 'Rent';

export interface PropertyMedia {
  id: string;
  url: string;
  caption?: string;
  isPrimary?: boolean;
  type: 'image' | 'video' | 'floorplan' | 'virtual_tour';
}

export interface MLSMetadata {
  mlsId: string;
  mlsSource: 'SPARK_MLS' | 'GLAR' | 'INTERNAL_MOCK';
  parcelNumber?: string;
  taxAnnualAmount?: number;
  hoaFee?: number;
  yearBuilt: number;
  originalListPrice?: number;
  daysOnMarket: number;
}

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  zip: string;
  neighborhood: string;
  county: string;
  latitude: number;
  longitude: number;
  schoolDistrict?: string;
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  licenseNumber?: string;
  phone: string;
  email: string;
  photoUrl: string;
  bio: string;
  specialties: string[];
  languages: string[];
  activeListingsCount: number;
  yearsExperience: number;
  instagram?: string;
  facebook?: string;
  featured?: boolean;
}

export interface PropertyFeatureCategory {
  category: string;
  items: string[];
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  price: number;
  status: ListingStatus;
  transactionType: TransactionType;
  propertyType: PropertyType;
  location: PropertyLocation;
  bedrooms: number;
  bathrooms: number;
  halfBaths?: number;
  sqft: number;
  lotSizeAcres: number;
  garageSpaces: number;
  description: string;
  highlightStory: string;
  featured: boolean;
  architecturalStyle: string;
  media: PropertyMedia[];
  features: PropertyFeatureCategory[];
  mls: MLSMetadata;
  agentId: string;
  listedAt: string;
  updatedAt: string;
}

export interface PropertyFilter {
  query?: string;
  transactionType?: TransactionType;
  propertyType?: PropertyType | 'All';
  city?: string | 'All';
  neighborhood?: string | 'All';
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
  minSqft?: number;
  status?: ListingStatus | 'All';
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'sqft-desc';
}

export interface BrokerageInfo {
  name: string;
  legalName: string;
  brokerCeo: string;
  phone: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    state: string;
    zip: string;
    fullFormatted: string;
  };
  officeHours: string;
  licenseNote: string;
}

export interface TourBookingRequest {
  propertyId: string;
  propertyTitle: string;
  date: string;
  time: string;
  tourType: 'In-Person' | 'Live Video Tour';
  name: string;
  email: string;
  phone: string;
  message?: string;
}

export interface ValuationRequest {
  address: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  condition: 'Excellent' | 'Good' | 'Needs Work' | 'Fully Renovated';
  timeline: 'Immediate (1-30 days)' | '1-3 months' | '3-6 months' | 'Just curious';
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  notes?: string;
}
