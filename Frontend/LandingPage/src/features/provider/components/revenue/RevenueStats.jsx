
import React from 'react';
import { ArrowUp, ArrowDown, DollarSign, Users, ShoppingBag } from 'lucide-react';

const StatCard = ({ title, value, delta, icon: Icon, deltaType }) => {
  const isPositiveDelta = deltaType === 'positive' || delta > 0;
  
  return (
    <div className="stats-card">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-gray-500">{title}</h3>
        <div className={`rounded-full p-2 ${isPositiveDelta ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {Icon && <Icon className="h-5 w-5" />}
        </div>
      </div>
      <div className="mt-6 flex items-baseline">
        <p className="text-2xl sm:text-3xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className="mt-2 flex items-center">
        {isPositiveDelta ? (
          <ArrowUp className="mr-1 h-4 w-4 text-green-600 flex-shrink-0" />
        ) : (
          <ArrowDown className="mr-1 h-4 w-4 text-red-600 flex-shrink-0" />
        )}
        <span className={isPositiveDelta ? 'text-green-600' : 'text-red-600'}>
          {Math.abs(delta)}%
        </span>
        <span className="ml-2 text-sm text-gray-500">from last period</span>
      </div>
    </div>
  );
};

const RevenueStats = ({ period }) => {
  const statsData = {
    daily: [
      {
        title: "Total Revenue",
        value: "$435.25",
        delta: 12.5,
        icon: DollarSign,
        deltaType: "positive"
      },
      {
        title: "New Customers",
        value: "5",
        delta: 10.3,
        icon: Users,
        deltaType: "positive"
      },
      {
        title: "Orders Completed",
        value: "8",
        delta: -3.2,
        icon: ShoppingBag,
        deltaType: "negative"
      },
    ],
    weekly: [
      {
        title: "Total Revenue",
        value: "$2,874.30",
        delta: 23.6,
        icon: DollarSign,
        deltaType: "positive"
      },
      {
        title: "New Customers",
        value: "32",
        delta: 15.8,
        icon: Users,
        deltaType: "positive"
      },
      {
        title: "Orders Completed",
        value: "57",
        delta: 8.4,
        icon: ShoppingBag,
        deltaType: "positive"
      },
    ],
    monthly: [
      {
        title: "Total Revenue",
        value: "$12,345.67",
        delta: 18.2,
        icon: DollarSign,
        deltaType: "positive"
      },
      {
        title: "New Customers",
        value: "128",
        delta: -6.5,
        icon: Users,
        deltaType: "negative"
      },
      {
        title: "Orders Completed",
        value: "235",
        delta: 12.9,
        icon: ShoppingBag,
        deltaType: "positive"
      },
    ],
    yearly: [
      {
        title: "Total Revenue",
        value: "$148,532.90",
        delta: 32.7,
        icon: DollarSign,
        deltaType: "positive"
      },
      {
        title: "New Customers",
        value: "1,457",
        delta: 24.3,
        icon: Users,
        deltaType: "positive"
      },
      {
        title: "Orders Completed",
        value: "2,865",
        delta: 18.7,
        icon: ShoppingBag,
        deltaType: "positive"
      },
    ],
  };

  const stats = statsData[period] || statsData.monthly;

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default RevenueStats;
