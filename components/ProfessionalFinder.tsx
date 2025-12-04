import React, { useState } from 'react';
import { findLocalPros } from '../services/geminiService';
import { HouseSpecs, GroundingChunk } from '../types';
import { MapPinIcon, StarIcon, BriefcaseIcon, TruckIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';

interface ProfessionalFinderProps {
  city: string;
}

const ProfessionalFinder: React.FC<ProfessionalFinderProps> = ({ city }) => {
  const [activeTab, setActiveTab] = useState<'architects' | 'contractors' | 'suppliers'>('architects');
  const [results, setResults] = useState<{ text: string, chunks: GroundingChunk[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (category: string) => {
    if (!city) return;
    setLoading(true);
    try {
      const data = await findLocalPros(city, category);
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search when tab changes if city is present
  React.useEffect(() => {
    if (city) {
      let queryCategory = "Architects and Interior Designers";
      if (activeTab === 'contractors') queryCategory = "Construction Companies and Contractors";
      if (activeTab === 'suppliers') queryCategory = "Construction Material Suppliers (Cement, Steel, Tiles)";
      
      handleSearch(queryCategory);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, city]);

  if (!city) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 p-10">
            <MapPinIcon className="w-16 h-16 mb-4 opacity-50"/>
            <p>Select a city in the Design Studio to find local professionals.</p>
        </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Local Professionals in {city}</h2>
        <p className="text-slate-500">Connect with top-rated experts to bring your vision to life.</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
          <button
            onClick={() => setActiveTab('architects')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${activeTab === 'architects' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <BriefcaseIcon className="w-4 h-4" /> Architects
          </button>
          <button
            onClick={() => setActiveTab('contractors')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${activeTab === 'contractors' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <TruckIcon className="w-4 h-4" /> Contractors
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${activeTab === 'suppliers' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <MapPinIcon className="w-4 h-4" /> Suppliers
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex gap-6">
        {/* Results List */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-y-auto p-8">
          {loading ? (
            <div className="space-y-4 animate-pulse">
                {[1,2,3].map(i => (
                    <div key={i} className="h-32 bg-slate-100 rounded-xl"></div>
                ))}
            </div>
          ) : results ? (
            <div className="prose prose-slate max-w-none">
              <ReactMarkdown 
                components={{
                    // Override link to look like a button or nice link
                    a: ({node, ...props}) => <a {...props} className="text-emerald-600 font-semibold hover:underline" target="_blank" rel="noopener noreferrer" />
                }}
              >
                {results.text}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-center text-slate-400 mt-20">
                <p>No results found.</p>
            </div>
          )}
        </div>

        {/* Map Links / Sources Sidebar */}
        <div className="w-80 hidden lg:block bg-slate-50 rounded-2xl border border-slate-200 overflow-y-auto p-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Verified Locations</h3>
            <div className="space-y-3">
                {results?.chunks?.map((chunk, idx) => {
                    const mapData = chunk.maps;
                    if (!mapData) return null;
                    
                    return (
                        <a 
                            key={idx} 
                            href={mapData.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block bg-white p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition group"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
                                    <MapPinIcon className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">{mapData.title}</h4>
                                    <p className="text-xs text-slate-500 mt-1">View on Google Maps</p>
                                </div>
                            </div>
                        </a>
                    );
                })}
                {results?.chunks?.length === 0 && !loading && (
                    <p className="text-xs text-slate-400 text-center">No map locations returned.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalFinder;
