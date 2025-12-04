export enum AppState {
  HOME = 'HOME',
  DESIGN = 'DESIGN',
  ESTIMATE = 'ESTIMATE',
  FIND_PROS = 'FIND_PROS'
}

export interface HouseSpecs {
  city: string;
  plotSize: string;
  dimensions: string;
  floors: number;
  style: string;
  exteriorColor: string;
  layout: string;
  features: string;
  budget: string;
}

export interface CostEstimateItem {
  category: string;
  amount: number;
  description: string;
}

export interface CostEstimate {
  currency: string;
  totalEstimatedCost: number;
  breakdown: CostEstimateItem[];
  summary: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
      }[];
    }[];
  };
}