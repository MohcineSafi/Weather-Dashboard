
import React from 'react';
import { Cloud, CloudRain, CloudSnow } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherIconProps {
  iconCode: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  iconCode, 
  size = 'medium', 
  className 
}) => {
  const getIconComponent = (code: string) => {
    // Map OpenWeatherMap icon codes to our available Lucide icons
    if (code.includes('01') || code.includes('02')) {
      // Clear sky / few clouds
      return <Cloud className={cn(getIconSize(size), 'text-yellow-500', className)} />;
    } else if (code.includes('03') || code.includes('04') || code.includes('50')) {
      // Scattered clouds / broken clouds / mist
      return <Cloud className={cn(getIconSize(size), 'text-gray-500', className)} />;
    } else if (code.includes('09') || code.includes('10') || code.includes('11')) {
      // Rain / thunderstorm
      return <CloudRain className={cn(getIconSize(size), 'text-blue-600', className)} />;
    } else if (code.includes('13')) {
      // Snow
      return <CloudSnow className={cn(getIconSize(size), 'text-blue-300', className)} />;
    }
    
    // Default to cloud
    return <Cloud className={cn(getIconSize(size), 'text-gray-400', className)} />;
  };

  const getIconSize = (size: string) => {
    switch (size) {
      case 'small':
        return 'h-6 w-6';
      case 'large':
        return 'h-16 w-16';
      default:
        return 'h-10 w-10';
    }
  };

  return getIconComponent(iconCode);
};
