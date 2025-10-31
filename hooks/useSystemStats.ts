import { useState, useEffect } from 'react';
import { SystemStats } from '../types';

export const useSystemStats = (): SystemStats => {
  const [stats, setStats] = useState<SystemStats>({
    cpu: 0,
    memory: 0,
    storage: 78,
    temp: 0,
    battery: 92,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => ({
        ...prevStats,
        cpu: Math.min(100, Math.max(10, prevStats.cpu + (Math.random() - 0.5) * 5)),
        memory: Math.min(100, Math.max(20, prevStats.memory + (Math.random() - 0.5) * 4)),
        temp: Math.min(90, Math.max(40, prevStats.temp + (Math.random() - 0.5) * 2)),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return {
    cpu: Math.round(stats.cpu),
    memory: Math.round(stats.memory),
    storage: Math.round(stats.storage),
    temp: Math.round(stats.temp),
    battery: Math.round(stats.battery),
  };
};
