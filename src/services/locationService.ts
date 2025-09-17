// Location Service for GPS coordinates and reverse geocoding
export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  // Neighbourhood/locality if available (e.g., Bandra, Dadar)
  locality?: string;
  // District/borough if provided by geocoder
  district?: string;
  state: string;
  country: string;
  formattedAddress: string;
}

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export class LocationService {
  private static instance: LocationService;

  // Reference localities for Mumbai snapping when geocoder returns vague labels
  private static readonly MUMBAI_LOCALITIES: { name: string; lat: number; lng: number }[] = [
    { name: 'Bandra', lat: 19.0596, lng: 72.8295 },
    { name: 'Dadar', lat: 19.0186, lng: 72.8424 },
    { name: 'Sion', lat: 19.0473, lng: 72.8626 },
    { name: 'Andheri', lat: 19.1197, lng: 72.8468 },
    { name: 'Powai', lat: 19.1166, lng: 72.9043 },
    { name: 'BKC', lat: 19.0669, lng: 72.8697 },
    { name: 'Worli', lat: 19.0169, lng: 72.8160 },
    { name: 'Colaba', lat: 18.9067, lng: 72.8147 },
    { name: 'Chembur', lat: 19.0622, lng: 72.9007 },
    { name: 'Ghatkopar', lat: 19.0853, lng: 72.9080 },
    { name: 'Kurla', lat: 19.0726, lng: 72.8790 },
    { name: 'Lower Parel', lat: 18.9936, lng: 72.8305 },
    { name: 'Fort', lat: 18.9350, lng: 72.8356 },
    { name: 'Mahim', lat: 19.0387, lng: 72.8400 },
    { name: 'Matunga', lat: 19.0270, lng: 72.8553 },
    { name: 'Wadala', lat: 19.0169, lng: 72.8593 },
    { name: 'Byculla', lat: 18.9766, lng: 72.8331 },
    { name: 'Santacruz', lat: 19.0800, lng: 72.8410 },
    { name: 'Juhu', lat: 19.1024, lng: 72.8265 }
  ];

  // Maximum distance (in km) to snap to a Mumbai locality
  private static readonly MUMBAI_SNAP_DISTANCE_KM = 2.5;

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async getCurrentLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Try to obtain a higher-accuracy fix by sampling positions briefly
  async getHighAccuracyLocation(maxWaitMs: number = 8000, targetAccuracyM: number = 30): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      let best: GeolocationPosition | null = null;
      let watchId: number | null = null;
      const timeout = setTimeout(() => {
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        if (best) {
          resolve(best);
        } else {
          reject(new Error('Timed out getting high-accuracy location'));
        }
      }, maxWaitMs);

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const current: GeolocationPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          if (!best || current.accuracy < best.accuracy) {
            best = current;
          }
          if (current.accuracy <= targetAccuracyM) {
            if (watchId !== null) navigator.geolocation.clearWatch(watchId);
            clearTimeout(timeout);
            resolve(current);
          }
        },
        (error) => {
          if (watchId !== null) navigator.geolocation.clearWatch(watchId);
          clearTimeout(timeout);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: maxWaitMs
        }
      );
    });
  }

  // Fallback using IP-based geolocation (approximate)
  async getApproxLocationByIP(): Promise<GeolocationPosition> {
    try {
      // Try ipapi.co first
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        if (data && data.latitude && data.longitude) {
          return {
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            accuracy: 50000 // IP accuracy is coarse (~50km)
          };
        }
      }
    } catch (_) {
      // ignore and try next
    }

    try {
      // Fallback to ipinfo.io (no key limited)
      const res2 = await fetch('https://ipinfo.io/json');
      if (res2.ok) {
        const data2 = await res2.json();
        if (data2 && data2.loc) {
          const [latStr, lonStr] = String(data2.loc).split(',');
          return {
            latitude: parseFloat(latStr),
            longitude: parseFloat(lonStr),
            accuracy: 50000
          };
        }
      }
    } catch (_) {
      // ignore
    }

    // Default to Delhi if all fail
    return {
      latitude: 28.6139,
      longitude: 77.2090,
      accuracy: 100000
    };
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<LocationData> {
    try {
      // Prefer Google Geocoding if API key is configured (more precise locality data)
      const googleKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || (window as any)?.VITE_GOOGLE_MAPS_API_KEY;
      if (googleKey) {
        const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleKey}&language=en`;
        const gRes = await fetch(googleUrl);
        if (gRes.ok) {
          const gData = await gRes.json();
          if (gData.status === 'OK' && gData.results && gData.results.length > 0) {
            const primary = gData.results[0];
            const components = primary.address_components || [];
            const getComponent = (types: string[]) => {
              const comp = components.find((c: any) => types.every(t => c.types.includes(t)));
              return comp ? comp.long_name : undefined;
            };
            const locality = getComponent(['sublocality_level_1']) || getComponent(['neighborhood']) || getComponent(['sublocality']) || undefined;
            const city = getComponent(['locality']) || getComponent(['administrative_area_level_2']) || 'Unknown';
            const state = getComponent(['administrative_area_level_1']) || 'Unknown';
            const country = getComponent(['country']) || 'Unknown';

            return {
              latitude,
              longitude,
              city,
              locality,
              district: getComponent(['administrative_area_level_2']) || undefined,
              state,
              country,
              formattedAddress: primary.formatted_address || `${latitude}, ${longitude}`
            };
          }
        }
        // If Google call fails, fall back to Nominatim below
      }

      // Using OpenStreetMap Nominatim API (free, no API key required)
      // Include a descriptive User-Agent per Nominatim usage policy
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=en`,
        {
          headers: {
            'User-Agent': 'LocalAirGuardian/1.0 (contact: support@localairguardian.app)'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const address = data.address || {};
      
      // Extract pieces first
      let city = address.city || address.town || address.village || address.city_district || address.county || 'Unknown';
      // Prefer fine-grained fields first
      let locality = address.neighbourhood || address.suburb || address.borough || address.quarter || address.hamlet || undefined;
      // Compose from road + suburb if very granular locality missing
      if (!locality && address.road && (address.suburb || address.neighbourhood)) {
        locality = `${address.road}, ${address.suburb || address.neighbourhood}`;
      }
      const district = address.city_district || address.county || undefined;
      const state = address.state || address.region || 'Unknown';
      const country = address.country || 'Unknown';

      // Optional snapping behind env flag to avoid incorrect labels
      const enableSnap = (import.meta as any).env?.VITE_ENABLE_MUMBAI_SNAP === 'true';
      if (enableSnap && city && city.toLowerCase() === 'mumbai') {
        const isVague = !locality || /(zone|ward|division|block)/i.test(locality);
        if (isVague) {
          let best = LocationService.MUMBAI_LOCALITIES[0];
          let bestDist = this.calculateDistance(latitude, longitude, best.lat, best.lng);
          for (const loc of LocationService.MUMBAI_LOCALITIES) {
            const d = this.calculateDistance(latitude, longitude, loc.lat, loc.lng);
            if (d < bestDist) {
              best = loc;
              bestDist = d;
            }
          }
          if (bestDist <= LocationService.MUMBAI_SNAP_DISTANCE_KM) {
            locality = best.name;
          }
        }
      }

      return {
        latitude,
        longitude,
        city,
        locality,
        district,
        state,
        country,
        formattedAddress: data.display_name || `${latitude}, ${longitude}`
      };
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      // Fallback to coordinates-based naming
      return {
        latitude,
        longitude,
        city: 'Unknown',
        state: 'Unknown',
        country: 'India',
        formattedAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
      };
    }
  }

  async getLocationFromCoordinates(latitude: number, longitude: number): Promise<LocationData> {
    return this.reverseGeocode(latitude, longitude);
  }

  // Calculate distance between two coordinates
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  // Check if coordinates are within India (approximate bounds)
  isWithinIndia(latitude: number, longitude: number): boolean {
    return (
      latitude >= 6.0 && latitude <= 37.0 &&
      longitude >= 68.0 && longitude <= 97.0
    );
  }
}

export const locationService = LocationService.getInstance();


