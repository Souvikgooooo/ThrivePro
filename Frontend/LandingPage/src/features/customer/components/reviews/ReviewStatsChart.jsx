import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#34D399", "#60A5FA", "#FBBF24", "#F87171", "#9CA3AF"];

const ReviewStatsChart = ({ reviews }) => {
  const ratingsCount = [5, 4, 3, 2, 1].map((star) => ({
    name: `${star} Stars`,
    value: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="flex justify-center mb-8">
      <PieChart width={300} height={300}>
        <Pie
          data={ratingsCount}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          dataKey="value"
        >
          {ratingsCount.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default ReviewStatsChart;
