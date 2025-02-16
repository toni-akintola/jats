import { DataSource } from '../types';

export class GooglePlacesSource implements DataSource {
  async fetchData(location: string): Promise<Array<{ text: string; source: string }>> {
    const [lat, lng] = location.split(',').map(Number);
    
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=500&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();
    
    return data.results.slice(0, 5).map((place: any) => ({
      text: `${place.name} - ${place.types.join(', ')}`,
      source: 'google-places'
    }));
  }
}
