
import React from 'react';

const RevenuePeriodSelector = ({ period, setPeriod }) => {
  const periods = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'yearly', label: 'Yearly' },
  ];

  return (
    <div className="inline-flex p-1 bg-gray-100 rounded-lg">
      {periods.map((item) => (
        <button
          key={item.id}
          onClick={() => setPeriod(item.id)}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            period === item.id
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default RevenuePeriodSelector;
