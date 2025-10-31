import React, { useState, useEffect } from 'react';
import { useSystemStats } from '../hooks/useSystemStats';
import StatCard from './StatCard';
import { CpuIcon, MemoryIcon, StorageIcon, TempIcon, BatteryIcon } from './icons';

interface WeatherData {
  temperature: number;
  description: string;
}

const LeftPanel: React.FC = () => {
  const stats = useSystemStats();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = (lat: number, lon: number) => {
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(res => res.json())
        .then(data => {
          if (data.current_weather) {
            setWeather({
              temperature: data.current_weather.temperature,
              description: 'Clear', // Open-Meteo doesn't provide text description
            });
          }
        })
        .catch(() => setError("Could not fetch weather data."));
    };
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setError("Location access denied.");
        // Fallback location (e.g., San Francisco)
        fetchWeather(37.77, -122.42);
      }
    );
  }, []);

  return (
    <div className="h-full flex flex-col justify-between p-4 bg-gray-900 bg-opacity-50 border border-cyan-400/30 rounded-lg backdrop-blur-md">
      <div>
        <h2 className="text-cyan-400 text-lg tracking-widest mb-4">SYSTEM STATUS</h2>
        <div className="space-y-3">
          <StatCard icon={<CpuIcon className="w-6 h-6 text-cyan-400"/>} label="CPU USAGE" value={`${stats.cpu}%`} />
          <StatCard icon={<MemoryIcon className="w-6 h-6 text-cyan-400"/>} label="MEMORY" value={`${stats.memory}%`} />
          <StatCard icon={<StorageIcon className="w-6 h-6 text-cyan-400"/>} label="STORAGE" value={`${stats.storage}%`} />
          <StatCard icon={<TempIcon className="w-6 h-6 text-cyan-400"/>} label="CORE TEMP" value={`${stats.temp}°C`} />
          <StatCard icon={<BatteryIcon className="w-6 h-6 text-cyan-400"/>} label="BATTERY" value={`${stats.battery}%`} />
        </div>
      </div>
      <div>
        <h2 className="text-cyan-400 text-lg tracking-widest mb-2">ENVIRONMENT</h2>
        {error && <p className="text-red-500">{error}</p>}
        {weather ? (
          <p className="text-2xl">{weather.temperature}°C - LOCAL</p>
        ) : (
          !error && <p className="animate-pulse">Fetching local weather...</p>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;
