export interface DataSource {
  fetchData(query: string): Promise<
    Array<{
      text: string;
      source: string;
      url?: string;
      date?: string;
    }>
  >;
}

export interface SentimentTimePoint {
  date: string;
  sentiment: number;
}

export interface Mention {
  text: string;
  sentiment: number;
  source: string;
  date: string;
  url?: string;
}

export interface SentimentResult {
  mentions: Mention[];
  score: number;
  keywords: string[];
}

export interface SentimentSource {
  name: string;
  fetchSentiment: (company: string) => Promise<SentimentResult>;
}

export interface FemaRegion {
  id: string;
  name: string;
  states: string[];
}

export interface DisasterDeclaration {
  disasterNumber: string;
  state: string;
  county: string;
  declarationDate: string;
  disasterType: string;
  incidentType: string;
  title: string;
  incidentBeginDate: string;
  incidentEndDate: string;
}

export interface GeoLocation {
  lat: number;
  lng: number;
  county: string;
  state: string;
}

export interface RiskAssessment {
  location: GeoLocation;
  femaRegion: FemaRegion;
  recentDisasters: DisasterDeclaration[];
  riskScore: number;
  disastersByType: Record<string, number>;
  historicalTrends: {
    year: number;
    disasterCount: number;
  }[];
}

export interface GoogleMapsAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GoogleMapsGeometry {
  location: {
    lat: number;
    lng: number;
  };
}

export interface GoogleMapsResult {
  address_components: GoogleMapsAddressComponent[];
  geometry: GoogleMapsGeometry;
}

export interface GoogleMapsResponse {
  results: GoogleMapsResult[];
  status: string;
}

export interface FemaRegionResponse {
  FemaRegions: {
    id: string;
    name: string;
    states: string[];
  }[];
}

export interface FemaDisasterResponse {
  DisasterDeclarationsSummaries: {
    disasterNumber: string;
    state: string;
    county: string;
    declarationDate: string;
    disasterType: string;
    incidentType: string;
    title: string;
    incidentBeginDate: string;
    incidentEndDate: string;
  }[];
}
