import { 
  DisasterDeclaration, 
  FemaRegion, 
  GeoLocation, 
  RiskAssessment,
  GoogleMapsResponse,
  FemaRegionResponse,
  FemaDisasterResponse,
  GoogleMapsAddressComponent,
} from "./types";

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const FEMA_BASE_URL = "https://www.fema.gov/api/open/v2";

export class RiskService {
  private async geocodeAddress(address: string): Promise<GeoLocation> {
    const encodedAddress = encodeURIComponent(address);
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_API_KEY}`;
    
    const response = await fetch(geocodeUrl);
    if (!response.ok) {
      throw new Error("Failed to geocode address");
    }
    
    const data = await response.json() as GoogleMapsResponse;
    if (!data.results || data.results.length === 0) {
      throw new Error("No results found for address");
    }

    const result = data.results[0];
    const location = result.geometry.location;
    
    const county = result.address_components.find(
      (c: GoogleMapsAddressComponent) => c.types.includes("administrative_area_level_2")
    )?.long_name;
    
    const state = result.address_components.find(
      (c: GoogleMapsAddressComponent) => c.types.includes("administrative_area_level_1")
    )?.short_name;

    if (!county || !state) {
      throw new Error("Could not determine county or state from address");
    }

    return {
      lat: location.lat,
      lng: location.lng,
      county,
      state,
    };
  }

  private async getFemaRegion(state: string): Promise<FemaRegion> {
    const response = await fetch(`${FEMA_BASE_URL}/FemaRegions`);
    if (!response.ok) {
      throw new Error("Failed to fetch FEMA regions");
    }

    const data = await response.json() as FemaRegionResponse;
//     console.log("fema regions response: ", data);
    const region = data.FemaRegions.find((r: FemaRegionResponse['FemaRegions'][0]) => 
        // console.log("r is : ", r)
        r.states.includes(state)
    );

    if (!region) {
      throw new Error(`No FEMA region found for state: ${state}`);
    }
//     console.log("region is")

    return {
      id: region.id,
      name: region.name,
      states: region.states,
    };
  }

  private async getDisasterDeclarations(state: string, county: string): Promise<DisasterDeclaration[]> {
//     const filter = encodeURIComponent(`state eq '${state}' and county eq '${county}'`);
//     const filter = encodeURIComponent(
//       "state eq 'WA' and county eq 'King County'"
//     );
//     const filter = encodeURIComponent("state eq 'WA'");
//     const filter = encodeURIComponent("county eq 'King County'");
//     const filter = encodeURIComponent(
//       "state eq 'WA' and declaredCountyArea eq 'King County'"
//     );
//     const filter = encodeURIComponent(
//       "declaredCountyArea eq 'King County'"
//     );
    console.log("state is ", state);
    console.log("county is ", county);
    const raw_county = county.split(" County")[0];
    const baseUrl =
      "https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries";
    const params = new URLSearchParams({
      $filter: `state eq '${state}' and designatedArea eq '${raw_county} (County)'`,
      $format: "json",
    });
    const url = `${baseUrl}?${params.toString()}`;
    console.log("url is ", url);
//     const url = `${FEMA_BASE_URL}/DisasterDeclarationsSummaries?$top=5`;

    
    const response = await fetch(url);
    console.log("response is: ", response);
    if (!response.ok) {
      throw new Error("Failed to fetch disaster declarations");
    }

    const data = await response.json() as FemaDisasterResponse;
    return data.DisasterDeclarationsSummaries.map((d: FemaDisasterResponse['DisasterDeclarationsSummaries'][0]) => ({
      disasterNumber: d.disasterNumber,
      state: d.state,
      county: d.county,
      declarationDate: d.declarationDate,
      disasterType: d.disasterType,
      incidentType: d.incidentType,
      title: d.title,
      incidentBeginDate: d.incidentBeginDate,
      incidentEndDate: d.incidentEndDate,
    }));
  }

  private calculateRiskScore(disasters: DisasterDeclaration[]): number {
    if (disasters.length === 0) return 0;

    const currentYear = new Date().getFullYear();
    const weightedSum = disasters.reduce((sum, disaster) => {
      const yearDiff = currentYear - new Date(disaster.declarationDate).getFullYear();
      const weight = Math.exp(-0.1 * yearDiff); // More recent disasters have higher weight
      return sum + weight;
    }, 0);

    return Math.min(100, (weightedSum / disasters.length) * 100);
  }

  private calculateHistoricalTrends(disasters: DisasterDeclaration[]): { year: number; disasterCount: number }[] {
    const countsByYear = disasters.reduce((acc, disaster) => {
      const year = new Date(disaster.declarationDate).getFullYear();
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(countsByYear)
      .map(([year, count]) => ({
        year: parseInt(year),
        disasterCount: count,
      }))
      .sort((a, b) => a.year - b.year);
  }

  public async assessRisk(address: string): Promise<RiskAssessment> {
    // Get location data from Google Maps API
    const location = await this.geocodeAddress(address);
    console.log("location from google maps", location);

    // Get FEMA region for the state
    const femaRegion = await this.getFemaRegion(location.state);
    console.log("fema region is: ", femaRegion);

    // Get disaster declarations for the location
    const disasters = await this.getDisasterDeclarations(location.state, location.county);

    // Calculate disaster type distribution
    const disastersByType = disasters.reduce((acc, disaster) => {
      acc[disaster.incidentType] = (acc[disaster.incidentType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate risk score and historical trends
    const riskScore = this.calculateRiskScore(disasters);
    const historicalTrends = this.calculateHistoricalTrends(disasters);

    return {
      location,
      femaRegion,
      recentDisasters: disasters.slice(0, 10), // Get 10 most recent disasters
      riskScore,
      disastersByType,
      historicalTrends,
    };
  }
}

export const riskService = new RiskService();
