import React from 'react';

interface SummaryCardProps {
  value: React.ReactNode;
  label: string;
  color?: string; // Tailwind color class for the value
  icon?: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ value, label, color, icon }) => (
  <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center justify-center min-w-[170px] min-h-[120px] border border-gray-100 hover:shadow-lg transition-shadow">
    {icon && <div className="mb-2 text-3xl opacity-80">{icon}</div>}
    <div className={`text-4xl font-extrabold mb-1 ${color || 'text-blue-600'}`}>{value}</div>
    <div className="text-gray-500 text-base text-center font-medium tracking-wide">{label}</div>
  </div>
);

export default SummaryCard; 