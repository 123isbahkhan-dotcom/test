import React, { useEffect, useState } from 'react';
import { HouseSpecs, CostEstimate } from '../types';
import { generateCostEstimate } from '../services/geminiService';
import { CalculatorIcon, CurrencyDollarIcon, InformationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface CostEstimatorProps {
  specs: HouseSpecs;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#6366f1', '#ec4899'];

const CostEstimator: React.FC<CostEstimatorProps> = ({ specs }) => {
  const [estimate, setEstimate] = useState<CostEstimate | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only estimate if we have basic details
    if (specs.city && specs.plotSize) {
      handleEstimate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEstimate = async () => {
    setLoading(true);
    const result = await generateCostEstimate(specs);
    setEstimate(result);
    setLoading(false);
  };

  if (!specs.city) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 p-10">
            <InformationCircleIcon className="w-16 h-16 mb-4 opacity-50"/>
            <p>Please enter design details in the Design Studio first.</p>
        </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Construction Estimator</h2>
          <p className="text-slate-500">Based on current market rates in {specs.city} for a {specs.plotSize} plot.</p>
        </div>
        <button 
          onClick={handleEstimate}
          disabled={loading}
          className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-lg transition flex items-center gap-2"
        >
            {loading ? <ArrowPathIcon className="w-4 h-4 animate-spin"/> : <CalculatorIcon className="w-4 h-4" />}
            Refresh Estimate
        </button>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-100">
           <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4"></div>
           <p className="text-slate-500">Analyzing materials, labor, and {specs.layout} requirements...</p>
        </div>
      ) : estimate ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Summary Card */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-lg">
                <p className="text-emerald-100 text-sm font-medium mb-1">Total Estimated Cost</p>
                <div className="text-4xl font-bold mb-2">
                    {estimate.currency} {(estimate.totalEstimatedCost / 1000000).toFixed(2)} Million
                </div>
                <p className="text-emerald-100 text-xs opacity-80">
                    *Estimates are approximate and subject to market fluctuation.
                </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-4">Cost Distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={estimate.breakdown}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="amount"
                            >
                                {estimate.breakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip formatter={(value: number) => `${estimate.currency} ${value.toLocaleString()}`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <CurrencyDollarIcon className="w-6 h-6 text-emerald-600"/>
                Detailed Breakdown
            </h3>
            
            <div className="space-y-6">
                {estimate.breakdown.map((item, idx) => (
                    <div key={idx} className="flex items-start p-4 hover:bg-slate-50 rounded-xl transition border border-transparent hover:border-slate-100">
                        <div className="w-3 h-3 rounded-full mt-2 mr-4 flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length]}}></div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="font-semibold text-slate-800">{item.category}</h4>
                                <span className="font-bold text-slate-700">{estimate.currency} {item.amount.toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-semibold text-slate-700 mb-2">AI Summary</h4>
                <p className="text-slate-600 text-sm">{estimate.summary}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CostEstimator;