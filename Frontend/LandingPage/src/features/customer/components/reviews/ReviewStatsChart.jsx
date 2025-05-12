import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#6B7280"]; // Adjusted for better contrast/vibrancy if needed

const ReviewStatsChart = ({ reviews }) => {
  const ratingsCount = [5, 4, 3, 2, 1].map((star) => ({
    name: `${star} Star${star === 1 ? '' : 's'}`, // Singular/plural for "Star"
    value: reviews.filter((r) => r.rating === star).length,
  }));

  // Filter out ratings with 0 reviews to avoid cluttering the chart if not needed
  const filteredRatingsCount = ratingsCount.filter(entry => entry.value > 0);

  if (reviews.length === 0) {
    return <p className="text-center text-slate-400 py-10">No reviews yet to display statistics.</p>;
  }

  return (
    <div className="flex justify-center items-center w-full h-full"> {/* Ensure chart takes available space */}
      <PieChart width={320} height={320}> {/* Slightly increased size */}
        <Pie
          data={filteredRatingsCount.length > 0 ? filteredRatingsCount : [{name: 'No Reviews', value: 1}]} // Handle empty filtered data
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={110} // Slightly increased radius
          innerRadius={55} // Doughnut effect
          dataKey="value"
          paddingAngle={2} // Adds a little space between segments
        >
          { (filteredRatingsCount.length > 0 ? filteredRatingsCount : [{name: 'No Reviews', value: 1}]).map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.name === 'No Reviews' ? '#475569' : COLORS[index % COLORS.length]} 
              stroke={entry.name === 'No Reviews' ? '#334155' : '#334155'} // Border for segments
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(30, 41, 59, 0.9)', // slate-800 with opacity
            borderColor: '#475569', // slate-600
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' 
          }}
          labelStyle={{ color: '#cbd5e1' }} // slate-300
          itemStyle={{ color: '#94a3b8' }} // slate-400
        />
        <Legend 
          iconSize={12}
          wrapperStyle={{ 
            fontSize: '0.8rem', 
            color: '#94a3b8', // slate-400
            paddingTop: '20px'
          }}
          formatter={(value, entry) => <span style={{ color: entry.color }}>{value}</span>}
        />
      </PieChart>
    </div>
  );
};

export default ReviewStatsChart;
