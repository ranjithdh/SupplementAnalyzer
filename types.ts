export enum PageType {
  Product = "product",
  Service = "service",
  Content = "content",
  Unknown = "unknown"
}

export interface Specification {
  name: string;
  value: string;
}

export interface NutritionalComponent {
  element: string;
  amount: string;
  dailyValue?: string;
}

export interface ProductDetails {
  price: {
    amount: string | null;
    currency: string | null;
  } | null;
  specifications: Specification[]; // e.g. Serving Size, Servings Per Container
  nutritionalInformation: NutritionalComponent[]; // e.g. Vitamin C, 500mg, 833%
  description: string | null;
  suggestedUse: string | null;
  ingredients: string | null; // Other ingredients list
  warnings: string | null;
  disclaimer: string | null;
  labelImage: string | null; // URL of the supplement facts label
}

export interface ContentDetails {
  author: string | null;
  publishDate: string | null;
  mainContent: string | null;
  headings: string[];
}

export interface ScrapedData {
  pageType: PageType;
  metadata: {
    title: string | null;
    metaDescription: string | null;
    canonicalUrl: string | null;
    language: string | null;
  };
  coreEntity: {
    name: string | null;
    brand: string | null;
    category: string | null;
    image: string | null; // Main entity image URL
  };
  productDetails?: ProductDetails;
  contentDetails?: ContentDetails;
}

export interface AnalysisState {
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  data: ScrapedData | null;
  error: string | null;
  logs?: string[];
}