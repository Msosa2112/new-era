import { Property, PropertyFilter, Agent } from '../types/property';
import { MOCK_PROPERTIES } from '../data/mockProperties';
import { AGENTS_DATA } from '../data/agentsData';

/**
 * Property Data Provider Interface
 * Allows seamless hot-swapping between Mock Data, SPARK MLS API, or GLAR IDX feeds.
 */
export interface IPropertyProvider {
  getProperties(filter?: PropertyFilter): Promise<Property[]>;
  getPropertyById(idOrSlug: string): Promise<Property | null>;
  getFeaturedProperties(limit?: number): Promise<Property[]>;
  getPropertiesByAgentId(agentId: string): Promise<Property[]>;
  getSimilarProperties(propertyId: string, limit?: number): Promise<Property[]>;
  getLocations(): Promise<{ cities: string[]; neighborhoods: string[] }>;
  getPriceBounds(): Promise<{ min: number; max: number }>;
}

/**
 * Mock Property Provider Implementation
 */
class MockPropertyProvider implements IPropertyProvider {
  private properties: Property[] = MOCK_PROPERTIES;

  async getProperties(filter?: PropertyFilter): Promise<Property[]> {
    let result = [...this.properties];

    if (!filter) return result;

    if (filter.query) {
      const q = filter.query.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.location.address.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q) ||
          p.location.neighborhood.toLowerCase().includes(q) ||
          p.location.zip.includes(q) ||
          p.architecturalStyle.toLowerCase().includes(q)
      );
    }

    if (filter.transactionType) {
      result = result.filter(p => p.transactionType === filter.transactionType);
    }

    if (filter.propertyType && filter.propertyType !== 'All') {
      result = result.filter(p => p.propertyType === filter.propertyType);
    }

    if (filter.city && filter.city !== 'All') {
      result = result.filter(p => p.location.city.toLowerCase() === filter.city?.toLowerCase());
    }

    if (filter.neighborhood && filter.neighborhood !== 'All') {
      result = result.filter(p => p.location.neighborhood.toLowerCase() === filter.neighborhood?.toLowerCase());
    }

    if (filter.minPrice !== undefined) {
      result = result.filter(p => p.price >= filter.minPrice!);
    }

    if (filter.maxPrice !== undefined) {
      result = result.filter(p => p.price <= filter.maxPrice!);
    }

    if (filter.minBeds !== undefined) {
      result = result.filter(p => p.bedrooms >= filter.minBeds!);
    }

    if (filter.minBaths !== undefined) {
      result = result.filter(p => p.bathrooms >= filter.minBaths!);
    }

    if (filter.status && filter.status !== 'All') {
      result = result.filter(p => p.status === filter.status);
    }

    // Sorting
    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'sqft-desc':
          result.sort((a, b) => b.sqft - a.sqft);
          break;
        case 'newest':
        default:
          result.sort((a, b) => new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime());
          break;
      }
    }

    return result;
  }

  async getPropertyById(idOrSlug: string): Promise<Property | null> {
    const found = this.properties.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    return found || null;
  }

  async getFeaturedProperties(limit = 4): Promise<Property[]> {
    return this.properties.filter(p => p.featured).slice(0, limit);
  }

  async getPropertiesByAgentId(agentId: string): Promise<Property[]> {
    return this.properties.filter(p => p.agentId === agentId);
  }

  async getSimilarProperties(propertyId: string, limit = 3): Promise<Property[]> {
    const target = await this.getPropertyById(propertyId);
    if (!target) return this.properties.slice(0, limit);

    return this.properties
      .filter(p => p.id !== target.id)
      .sort((a, b) => Math.abs(a.price - target.price) - Math.abs(b.price - target.price))
      .slice(0, limit);
  }

  async getLocations(): Promise<{ cities: string[]; neighborhoods: string[] }> {
    const cities = Array.from(new Set(this.properties.map(p => p.location.city))).sort();
    const neighborhoods = Array.from(new Set(this.properties.map(p => p.location.neighborhood))).sort();
    return { cities, neighborhoods };
  }

  async getPriceBounds(): Promise<{ min: number; max: number }> {
    const prices = this.properties.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }
}

/**
 * Supabase Live Provider Implementation
 */
export class SupabasePropertyProvider implements IPropertyProvider {
  private mockFallback = new MockPropertyProvider();

  async getProperties(filter?: PropertyFilter): Promise<Property[]> {
    try {
      const { fetchSupabaseProperties } = await import('../lib/supabase');
      const liveProperties = await fetchSupabaseProperties();
      if (liveProperties && liveProperties.length > 0) {
        let result = [...liveProperties];
        if (!filter) return result;

        if (filter.query) {
          const q = filter.query.toLowerCase();
          result = result.filter(
            p =>
              p.title.toLowerCase().includes(q) ||
              p.location.address.toLowerCase().includes(q) ||
              p.location.city.toLowerCase().includes(q) ||
              p.location.neighborhood.toLowerCase().includes(q) ||
              p.location.zip.includes(q) ||
              p.architecturalStyle.toLowerCase().includes(q)
          );
        }

        if (filter.transactionType) {
          result = result.filter(p => p.transactionType === filter.transactionType);
        }

        if (filter.propertyType && filter.propertyType !== 'All') {
          result = result.filter(p => p.propertyType === filter.propertyType);
        }

        if (filter.city && filter.city !== 'All') {
          result = result.filter(p => p.location.city.toLowerCase() === filter.city?.toLowerCase());
        }

        if (filter.neighborhood && filter.neighborhood !== 'All') {
          result = result.filter(p => p.location.neighborhood.toLowerCase() === filter.neighborhood?.toLowerCase());
        }

        if (filter.minPrice !== undefined) {
          result = result.filter(p => p.price >= filter.minPrice!);
        }

        if (filter.maxPrice !== undefined) {
          result = result.filter(p => p.price <= filter.maxPrice!);
        }

        if (filter.minBeds !== undefined) {
          result = result.filter(p => p.bedrooms >= filter.minBeds!);
        }

        if (filter.minBaths !== undefined) {
          result = result.filter(p => p.bathrooms >= filter.minBaths!);
        }

        if (filter.status && filter.status !== 'All') {
          result = result.filter(p => p.status === filter.status);
        }

        if (filter.sortBy) {
          switch (filter.sortBy) {
            case 'price-asc':
              result.sort((a, b) => a.price - b.price);
              break;
            case 'price-desc':
              result.sort((a, b) => b.price - a.price);
              break;
            case 'sqft-desc':
              result.sort((a, b) => b.sqft - a.sqft);
              break;
            case 'newest':
            default:
              result.sort((a, b) => new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime());
              break;
          }
        }

        return result;
      }
    } catch (e) {
      console.warn('Falling back to local properties:', e);
    }
    return this.mockFallback.getProperties(filter);
  }

  async getPropertyById(idOrSlug: string): Promise<Property | null> {
    try {
      const { fetchSupabaseProperties } = await import('../lib/supabase');
      const properties = await fetchSupabaseProperties();
      if (properties && properties.length > 0) {
        return properties.find(p => p.id === idOrSlug || p.slug === idOrSlug) || null;
      }
    } catch (e) {
      console.warn('Falling back to local getPropertyById:', e);
    }
    return this.mockFallback.getPropertyById(idOrSlug);
  }

  async getFeaturedProperties(limit = 4): Promise<Property[]> {
    try {
      const properties = await this.getProperties();
      return properties.filter(p => p.featured).slice(0, limit);
    } catch {
      return this.mockFallback.getFeaturedProperties(limit);
    }
  }

  async getPropertiesByAgentId(agentId: string): Promise<Property[]> {
    const properties = await this.getProperties();
    return properties.filter(p => p.agentId === agentId);
  }

  async getSimilarProperties(propertyId: string, limit = 3): Promise<Property[]> {
    const target = await this.getPropertyById(propertyId);
    const properties = await this.getProperties();
    if (!target) return properties.slice(0, limit);

    return properties
      .filter(p => p.id !== target.id)
      .sort((a, b) => Math.abs(a.price - target.price) - Math.abs(b.price - target.price))
      .slice(0, limit);
  }

  async getLocations(): Promise<{ cities: string[]; neighborhoods: string[] }> {
    const properties = await this.getProperties();
    const cities = Array.from(new Set(properties.map(p => p.location.city))).sort();
    const neighborhoods = Array.from(new Set(properties.map(p => p.location.neighborhood))).sort();
    return { cities, neighborhoods };
  }

  async getPriceBounds(): Promise<{ min: number; max: number }> {
    const properties = await this.getProperties();
    const prices = properties.map(p => p.price);
    return {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 10000000
    };
  }
}

/**
 * Future SPARK MLS Provider Blueprint
 * Plugs in when API keys and credentials are provided.
 */
export class SparkMlsProvider implements IPropertyProvider {
  public apiBaseUrl: string;
  public apiKey?: string;

  constructor(apiBaseUrl: string, apiKey?: string) {
    this.apiBaseUrl = apiBaseUrl;
    this.apiKey = apiKey;
  }

  async getProperties(filter?: PropertyFilter): Promise<Property[]> {
    console.info('[SPARK MLS Provider] Ready for live endpoint query with filter:', filter);
    return new SupabasePropertyProvider().getProperties(filter);
  }

  async getPropertyById(idOrSlug: string): Promise<Property | null> {
    return new SupabasePropertyProvider().getPropertyById(idOrSlug);
  }

  async getFeaturedProperties(limit?: number): Promise<Property[]> {
    return new SupabasePropertyProvider().getFeaturedProperties(limit);
  }

  async getPropertiesByAgentId(agentId: string): Promise<Property[]> {
    return new SupabasePropertyProvider().getPropertiesByAgentId(agentId);
  }

  async getSimilarProperties(propertyId: string, limit?: number): Promise<Property[]> {
    return new SupabasePropertyProvider().getSimilarProperties(propertyId, limit);
  }

  async getLocations(): Promise<{ cities: string[]; neighborhoods: string[] }> {
    return new SupabasePropertyProvider().getLocations();
  }

  async getPriceBounds(): Promise<{ min: number; max: number }> {
    return new SupabasePropertyProvider().getPriceBounds();
  }
}

/**
 * Singleton Property Service Adapter
 */
export class PropertyService {
  private static instance: PropertyService;
  private provider: IPropertyProvider;

  private constructor() {
    // Default to Supabase live provider (with instant mock fallback)
    this.provider = new SupabasePropertyProvider();
  }

  public static getInstance(): PropertyService {
    if (!PropertyService.instance) {
      PropertyService.instance = new PropertyService();
    }
    return PropertyService.instance;
  }

  public setProvider(provider: IPropertyProvider): void {
    this.provider = provider;
  }

  public async getProperties(filter?: PropertyFilter): Promise<Property[]> {
    return this.provider.getProperties(filter);
  }

  public async getPropertyById(idOrSlug: string): Promise<Property | null> {
    return this.provider.getPropertyById(idOrSlug);
  }

  public async getFeaturedProperties(limit?: number): Promise<Property[]> {
    return this.provider.getFeaturedProperties(limit);
  }

  public async getPropertiesByAgentId(agentId: string): Promise<Property[]> {
    return this.provider.getPropertiesByAgentId(agentId);
  }

  public async getSimilarProperties(propertyId: string, limit?: number): Promise<Property[]> {
    return this.provider.getSimilarProperties(propertyId, limit);
  }

  public async getLocations(): Promise<{ cities: string[]; neighborhoods: string[] }> {
    return this.provider.getLocations();
  }

  public async getPriceBounds(): Promise<{ min: number; max: number }> {
    return this.provider.getPriceBounds();
  }

  // Agent retrieval helpers
  public getAgents(): Agent[] {
    return AGENTS_DATA;
  }

  public getAgentById(id: string): Agent | null {
    return AGENTS_DATA.find(a => a.id === id) || null;
  }

  public getFeaturedAgents(): Agent[] {
    return AGENTS_DATA.filter(a => a.featured);
  }
}

export const propertyService = PropertyService.getInstance();
