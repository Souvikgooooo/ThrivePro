
import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, AreaChart, Area, BarChart, Bar
} from 'recharts';

const getRevenueData = (period) => {
  if (period === 'daily') {
    return [
      { name: '9AM', revenue: 120, orders: 2 },
      { name: '10AM', revenue: 85, orders: 1 },
      { name: '11AM', revenue: 0, orders: 0 },
      { name: '12PM', revenue: 200, orders: 3 },
      { name: '1PM', revenue: 150, orders: 2 },
      { name: '2PM', revenue: 0, orders: 0 },
      { name: '3PM', revenue: 100, orders: 1 },
      { name: '4PM', revenue: 220, orders: 3 },
      { name: '5PM', revenue: 180, orders: 2 },
      { name: '6PM', revenue: 0, orders: 0 },
      { name: '7PM', revenue: 75, orders: 1 },
      { name: '8PM', revenue: 0, orders: 0 },
    ];
  } else if (period === 'weekly') {
    return [
      { name: 'Monday', revenue: 850, orders: 8 },
      { name: 'Tuesday', revenue: 720, orders: 7 },
      { name: 'Wednesday', revenue: 950, orders: 9 },
      { name: 'Thursday', revenue: 1200, orders: 12 },
      { name: 'Friday', revenue: 1500, orders: 14 },
      { name: 'Saturday', revenue: 2100, orders: 18 },
      { name: 'Sunday', revenue: 1800, orders: 16 },
    ];
  } else if (period === 'yearly') {
    return [
      { name: 'Jan', revenue: 12000, orders: 110 },
      { name: 'Feb', revenue: 11000, orders: 95 },
      { name: 'Mar', revenue: 13500, orders: 125 },
      { name: 'Apr', revenue: 14200, orders: 130 },
      { name: 'May', revenue: 15800, orders: 145 },
      { name: 'Jun', revenue: 16500, orders: 155 },
      { name: 'Jul', revenue: 17200, orders: 165 },
      { name: 'Aug', revenue: 16800, orders: 160 },
      { name: 'Sep', revenue: 15500, orders: 150 },
      { name: 'Oct', revenue: 14800, orders: 140 },
      { name: 'Nov', revenue: 13900, orders: 130 },
      { name: 'Dec', revenue: 17500, orders: 170 },
    ];
  } else { // monthly
    return [
      { name: '1', revenue: 500, orders: 5 },
      { name: '3', revenue: 700, orders: 6 },
      { name: '6', revenue: 400, orders: 4 },
      { name: '9', revenue: 600, orders: 5 },
      { name: '12', revenue: 800, orders: 7 },
      { name: '15', revenue: 1200, orders: 10 },
      { name: '18', revenue: 900, orders: 8 },
      { name: '21', revenue: 700, orders: 6 },
      { name: '24', revenue: 1100, orders: 9 },
      { name: '27', revenue: 1300, orders: 11 },
      { name: '30', revenue: 1500, orders: 13 },
    ];
  }
};

const RevenueChart = ({ period, chartType = 'line' }) => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // In a real app, you would fetch this data from an API
    setData(getRevenueData(period));
  }, [period]);
  
  const formatYAxis = (value) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value}`;
  };

  const renderChart = () => {
    switch(chartType) {
      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" tickFormatter={formatYAxis} />
            <YAxis yAxisId="right" orientation="right" />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'revenue') return [`$${value}`, 'Revenue'];
                return [value, 'Orders'];
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              yAxisId="left"
              stroke="#4F46E5" 
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              name="Revenue"
            />
            <Area 
              type="monotone" 
              dataKey="orders" 
              yAxisId="right"
              stroke="#3B82F6" 
              fillOpacity={1} 
              fill="url(#colorOrders)" 
              name="Orders" 
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" tickFormatter={formatYAxis} />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'revenue') return [`$${value}`, 'Revenue'];
                return [value, 'Orders'];
              }}
            />
            <Legend />
            <Bar 
              dataKey="revenue" 
              yAxisId="left"
              fill="#4F46E5" 
              name="Revenue" 
            />
            <Bar 
              dataKey="orders" 
              yAxisId="right"
              fill="#3B82F6" 
              name="Orders" 
            />
          </BarChart>
        );
      default: // line
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" tickFormatter={formatYAxis} />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'revenue') return [`$${value}`, 'Revenue'];
                return [value, 'Orders'];
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              yAxisId="left"
              stroke="#4F46E5" 
              activeDot={{ r: 8 }} 
              name="Revenue"
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              yAxisId="right" 
              stroke="#3B82F6" 
              name="Orders"
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue Analysis</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
