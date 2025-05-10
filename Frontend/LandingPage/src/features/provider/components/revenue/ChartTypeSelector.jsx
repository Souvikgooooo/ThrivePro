
import React from 'react';
import { BarChart2, LineChart, PieChart } from 'lucide-react';

const ChartTypeSelector = ({ chartType, setChartType }) => {
  const chartTypes = [
    { id: 'line', icon: LineChart, label: 'Line' },
    { id: 'bar', icon: BarChart2, label: 'Bar' },
    { id: 'area', icon: PieChart, label: 'Area' },
  ];

  return (
    <div className="flex space-x-2">
      {chartTypes.map((type) => (
        <button
          key={type.id}
          onClick={() => setChartType(type.id)}
          className={`p-2 rounded-md ${
            chartType === type.id
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
          title={type.label}
        >
          <type.icon className="h-5 w-5" />
        </button>
      ))}
    </div>
  );
};

export default ChartTypeSelector;
