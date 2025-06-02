
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Droplets, Eye, Thermometer, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { WeatherIcon } from './WeatherIcon';
import { ForecastCard } from './ForecastCard';
import { ApiKeyModal } from './ApiKeyModal';
import { weatherService } from '../services/weatherService';
import type { WeatherData, ForecastData } from '../types/weather';

const WeatherDashboard = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiModal, setShowApiModal] = useState(false);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('openweather_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      // Load default city weather (London)
      fetchWeatherData('London', storedApiKey);
    } else {
      setShowApiModal(true);
    }
  }, []);

  const fetchWeatherData = async (city: string, key?: string) => {
    const keyToUse = key || apiKey;
    if (!keyToUse) {
      toast({
        title: "API Key Required",
        description: "Please set your OpenWeatherMap API key first.",
        variant: "destructive",
      });
      setShowApiModal(true);
      return;
    }

    setLoading(true);
    try {
      const [weatherData, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(city, keyToUse),
        weatherService.getForecast(city, keyToUse)
      ]);
      
      setCurrentWeather(weatherData);
      setForecast(forecastData);
      toast({
        title: "Weather Updated",
        description: `Showing weather for ${weatherData.name}`,
      });
    } catch (error) {
      console.error('Weather fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please check your API key and city name.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeatherData(searchCity.trim());
      setSearchCity('');
    }
  };

  const handleApiKeySave = (key: string) => {
    setApiKey(key);
    localStorage.setItem('openweather_api_key', key);
    setShowApiModal(false);
    fetchWeatherData('London', key);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Weather Dashboard</h1>
          <p className="text-blue-100">Get current weather and 5-day forecast for any city</p>
        </div>

        {/* Search and API Key Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for a city..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="pl-10 bg-white/90 border-0 focus:bg-white transition-all"
              />
            </div>
            <Button type="submit" disabled={loading} className="bg-white text-blue-600 hover:bg-blue-50">
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </form>
          <Button 
            variant="outline" 
            onClick={() => setShowApiModal(true)}
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            API Settings
          </Button>
        </div>

        {/* Current Weather */}
        {currentWeather && (
          <Card className="mb-8 bg-white/95 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <MapPin className="h-6 w-6 text-blue-600" />
                {currentWeather.name}, {currentWeather.sys.country}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                    <WeatherIcon 
                      iconCode={currentWeather.weather[0].icon} 
                      size="large"
                      className="w-20 h-20"
                    />
                    <div>
                      <div className="text-5xl font-bold text-gray-800">
                        {Math.round(currentWeather.main.temp)}°C
                      </div>
                      <div className="text-lg text-gray-600 capitalize">
                        {currentWeather.weather[0].description}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Feels like {Math.round(currentWeather.main.feels_like)}°C
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Wind className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Wind</span>
                    </div>
                    <div className="text-lg font-semibold">{currentWeather.wind.speed} m/s</div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Humidity</span>
                    </div>
                    <div className="text-lg font-semibold">{currentWeather.main.humidity}%</div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Visibility</span>
                    </div>
                    <div className="text-lg font-semibold">{(currentWeather.visibility / 1000).toFixed(1)} km</div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Pressure</span>
                    </div>
                    <div className="text-lg font-semibold">{currentWeather.main.pressure} hPa</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>Sunrise: {formatTime(currentWeather.sys.sunrise)}</div>
                  <div>Sunset: {formatTime(currentWeather.sys.sunset)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 5-Day Forecast */}
        {forecast && (
          <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">5-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {forecast.list.filter((_, index) => index % 8 === 0).slice(0, 5).map((item, index) => (
                  <ForecastCard key={index} forecast={item} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Data State */}
        {!currentWeather && !loading && (
          <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
            <CardContent className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Search for a city to get started</p>
                <p className="text-sm">Make sure you have set your OpenWeatherMap API key</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <ApiKeyModal 
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
        onSave={handleApiKeySave}
        currentKey={apiKey}
      />
    </div>
  );
};

export default WeatherDashboard;
