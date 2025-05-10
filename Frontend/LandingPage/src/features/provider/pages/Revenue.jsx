
import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import RevenueStats from '../components/revenue/RevenueStats';
import RevenueChart from '../components/revenue/RevenueChart';
import RevenuePeriodSelector from '../components/revenue/RevenuePeriodSelector';
import ChartTypeSelector from '../components/revenue/ChartTypeSelector';
import { Loader2 } from 'lucide-react';

const Revenue = () => {
  const [period, setPeriod] = useState('weekly');
  const [chartType, setChartType] = useState('line');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [period]);

  return (
    <Layout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Revenue Analytics</h1>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <RevenuePeriodSelector period={period} setPeriod={setPeriod} />
            <ChartTypeSelector chartType={chartType} setChartType={setChartType} />
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="flex items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <span className="text-lg text-gray-600">Loading revenue data...</span>
            </div>
          </div>
        ) : (
          <>
            <RevenueStats period={period} />
            
            <div className="mt-8">
              <RevenueChart period={period} chartType={chartType} />
            </div>
            
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Services</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Haircut & Styling</span>
                        <span className="text-sm text-gray-500">45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Manicure & Pedicure</span>
                        <span className="text-sm text-gray-500">30%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Facial Treatment</span>
                        <span className="text-sm text-gray-500">15%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Body Massage</span>
                        <span className="text-sm text-gray-500">10%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Sarah Johnson</p>
                      <p className="text-sm text-gray-500">Apr 15, 2025 - 10:00 AM</p>
                    </div>
                    <span className="font-medium text-gray-900">$75.99</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Michael Smith</p>
                      <p className="text-sm text-gray-500">Apr 16, 2025 - 2:30 PM</p>
                    </div>
                    <span className="font-medium text-gray-900">$120.00</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Jennifer Brown</p>
                      <p className="text-sm text-gray-500">Apr 17, 2025 - 11:30 AM</p>
                    </div>
                    <span className="font-medium text-gray-900">$90.00</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">David Wilson</p>
                      <p className="text-sm text-gray-500">Apr 13, 2025 - 1:00 PM</p>
                    </div>
                    <span className="text-red-500 font-medium">Cancelled</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Revenue;
