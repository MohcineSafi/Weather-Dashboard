
import React from 'react';
import { WeatherIcon } from './WeatherIcon';
import type { ForecastItem } from '../types/weather';

interface ForecastCardProps {
  forecast: ForecastItem;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  const date = new Date(forecast.dt * 1000);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center hover:shadow-md transition-shadow">
      <div className="font-semibold text-gray-800 mb-1">{dayName}</div>
      <div className="text-sm text-gray-600 mb-3">{monthDay}</div>
      
      <div className="flex justify-center mb-3">
        <WeatherIcon iconCode={forecast.weather[0].icon} size="medium" />
      </div>
      
      <div className="text-lg font-bold text-gray-800 mb-1">
        {Math.round(forecast.main.temp)}°C
      </div>
      
      <div className="text-xs text-gray-600 capitalize mb-2">
        {forecast.weather[0].description}
      </div>
      
      <div className="text-xs text-gray-500">
        💧 {forecast.main.humidity}%
      </div>
    </div>
  );
};
