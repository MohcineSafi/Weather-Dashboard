
import type { WeatherData, ForecastData } from '../types/weather';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

class WeatherService {
  private async fetchWithErrorHandling(url: string): Promise<any> {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
      } else if (response.status === 404) {
        throw new Error('City not found. Please check the city name and try again.');
      } else {
        throw new Error(`Weather service error: ${response.statusText}`);
      }
    }
    
    return response.json();
  }

  async getCurrentWeather(city: string, apiKey: string): Promise<WeatherData> {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    console.log('Fetching current weather for:', city);
    return this.fetchWithErrorHandling(url);
  }

  async getForecast(city: string, apiKey: string): Promise<ForecastData> {
    const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    console.log('Fetching forecast for:', city);
    return this.fetchWithErrorHandling(url);
  }
}

export const weatherService = new WeatherService();
