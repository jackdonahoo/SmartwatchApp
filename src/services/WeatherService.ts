import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
  icon: string;
}

class WeatherService {
  private readonly API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // Replace with your API key
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  async requestLocationPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS permissions handled in Info.plist
  }

  async getCurrentLocation(): Promise<{latitude: number; longitude: number}> {
    const hasPermission = await this.requestLocationPermission();
    if (!hasPermission) {
      throw new Error('Location permission not granted');
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          console.error('Location error:', error);
          reject(error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });
  }

  async getWeatherData(): Promise<WeatherData> {
    try {
      // For demo purposes, we'll use a mock location if geolocation fails
      let latitude = 37.7749; // San Francisco default
      let longitude = -122.4194;

      try {
        const location = await this.getCurrentLocation();
        latitude = location.latitude;
        longitude = location.longitude;
      } catch (error) {
        console.warn('Using default location for weather data');
      }

      // Since we don't have a real API key, we'll return mock data
      // In a real app, you would make this API call:
      // const response = await fetch(
      //   `${this.BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${this.API_KEY}&units=metric`
      // );
      // const data = await response.json();

      // Mock weather data for demonstration
      const mockWeatherData: WeatherData = {
        temperature: Math.floor(Math.random() * 30) + 10, // 10-40°C
        condition: this.getRandomCondition(),
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
        location: 'Current Location',
        icon: this.getWeatherIcon(),
      };

      return mockWeatherData;
    } catch (error) {
      console.error('Weather service error:', error);
      throw error;
    }
  }

  private getRandomCondition(): string {
    const conditions = [
      'Sunny',
      'Partly Cloudy',
      'Cloudy',
      'Rainy',
      'Thunderstorm',
      'Snow',
      'Fog',
    ];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }

  private getWeatherIcon(): string {
    const icons = ['☀️', '⛅', '☁️', '🌧️', '⛈️', '❄️', '🌫️'];
    return icons[Math.floor(Math.random() * icons.length)];
  }

  // Method to fetch weather with real API (commented out for demo)
  /*
  private async fetchWeatherFromAPI(latitude: number, longitude: number): Promise<WeatherData> {
    const response = await fetch(
      `${this.BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${this.API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error('Weather API request failed');
    }
    
    const data = await response.json();
    
    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      location: data.name,
      icon: this.mapWeatherIcon(data.weather[0].icon),
    };
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
  */
}

export default new WeatherService();
