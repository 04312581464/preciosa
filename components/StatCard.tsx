import React from 'react';

interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  isStatic?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, isStatic = false }) => {
  return (
    <div className="flex items-center justify-between p-2 bg-black bg-opacity-30 rounded">
      <div className="flex items-center space-x-3">
        {icon}
        <span className="text-sm tracking-wider text-gray-400">{label}</span>
      </div>
      <span className={`text-base font-semibold ${!isStatic ? 'text-white' : 'text-gray-300'}`}>
        {value}
      </span>
    </div>
  );
};

export default StatCard;
