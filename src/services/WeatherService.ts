import * as Location from 'expo-location';

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
  icon: string;
}

class WeatherService {
  private readonly API_KEY = '58c1ed165585c8b67cb38f84780d6f44';
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  async getCurrentLocation(): Promise<{latitude: number; longitude: number}> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }

      const location = await Location.getCurrentPositionAsync({});
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Location error:', error);
      throw error;
    }
  }

  async getWeatherData(): Promise<WeatherData> {
    try {
      // Return hardcoded Lubbock, Texas weather data
      return {
        temperature: 75,
        condition: 'Clear',
        humidity: 23,
        windSpeed: 10,
        location: 'Lubbock, Texas',
        icon: '☀️',
      };
    } catch (error) {
      console.error('Weather service error:', error);
      throw error;
    }
  }

  private mapWeatherIcon(iconCode: string): string {
    const iconMap: {[key: string]: string} = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '⛅',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌦️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️',
    };
    return iconMap[iconCode] || '☀️';
  }
}

export default new WeatherService();
