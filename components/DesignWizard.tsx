import React, { useState } from 'react';
import { HouseSpecs } from '../types';
import { generateArchitectureImage } from '../services/geminiService';
import { ArrowPathIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface DesignWizardProps {
  onSpecsChange: (specs: HouseSpecs) => void;
  currentSpecs: HouseSpecs;
}

const DesignWizard: React.FC<DesignWizardProps> = ({ onSpecsChange, currentSpecs }) => {
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'exterior' | 'interior' | 'garden'>('exterior');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    onSpecsChange({
      ...currentSpecs,
      [e.target.name]: e.target.value
    });
  };

  const handleGenerate = async () => {
    if (!currentSpecs.city || !currentSpecs.plotSize) return;
    setLoading(true);
    setGeneratedImage(null);
    const img = await generateArchitectureImage(currentSpecs, viewType);
    setGeneratedImage(img);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Inputs */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-y-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Design Your Dream Structure</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">City / Location</label>
            <input 
              name="city" 
              value={currentSpecs.city} 
              onChange={handleChange}
              className="w-full rounded-lg border-slate-300 border p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition" 
              placeholder="e.g. DHA Phase 8, Karachi"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Plot Size</label>
              <select 
                name="plotSize" 
                value={currentSpecs.plotSize} 
                onChange={handleChange}
                className="w-full rounded-lg border-slate-300 border p-3"
              >
                <option value="120 Sq Yards">120 Sq Yards (5 Marla)</option>
                <option value="240 Sq Yards">240 Sq Yards (10 Marla)</option>
                <option value="500 Sq Yards">500 Sq Yards (1 Kanal)</option>
                <option value="1000 Sq Yards">1000 Sq Yards (2 Kanal)</option>
                <option value="2000 Sq Yards">2000 Sq Yards (4 Kanal)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Exact Dimensions</label>
              <input 
                name="dimensions" 
                value={currentSpecs.dimensions} 
                onChange={handleChange}
                className="w-full rounded-lg border-slate-300 border p-3" 
                placeholder="e.g. 50x90 ft"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Floors</label>
              <select 
                name="floors" 
                value={currentSpecs.floors} 
                onChange={handleChange}
                className="w-full rounded-lg border-slate-300 border p-3"
              >
                <option value="1">Single Story</option>
                <option value="2">Double Story</option>
                <option value="3">Triple Story + Basement</option>
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Room Layout</label>
              <input 
                name="layout" 
                value={currentSpecs.layout} 
                onChange={handleChange}
                className="w-full rounded-lg border-slate-300 border p-3" 
                placeholder="e.g. 5 Bed, 6 Bath, Drawing"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Architectural Style</label>
            <select 
              name="style" 
              value={currentSpecs.style} 
              onChange={handleChange}
              className="w-full rounded-lg border-slate-300 border p-3"
            >
              <option value="Modern Minimalist">Modern Minimalist</option>
              <option value="Contemporary">Contemporary</option>
              <option value="Spanish Villa">Spanish Villa</option>
              <option value="Classic Islamic">Classic Islamic</option>
              <option value="Industrial">Industrial</option>
              <option value="Mediterranean">Mediterranean</option>
              <option value="Colonial">Colonial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Exterior Color Palette</label>
            <input 
              name="exteriorColor" 
              value={currentSpecs.exteriorColor} 
              onChange={handleChange}
              className="w-full rounded-lg border-slate-300 border p-3" 
              placeholder="e.g. White and Charcoal Grey"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Specific Features</label>
            <textarea 
              name="features" 
              value={currentSpecs.features} 
              onChange={handleChange}
              rows={2}
              className="w-full rounded-lg border-slate-300 border p-3" 
              placeholder="e.g. Large glass windows, rooftop garden, wooden cladding..."
            />
          </div>

          <div className="pt-2">
             <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  Generating Visualization...
                </>
              ) : (
                <>
                  <PhotoIcon className="w-5 h-5" />
                  Visualize Structure
                </>
              )}
            </button>
            <p className="text-xs text-slate-500 mt-2 text-center">AI generated designs based on Pakistani architectural trends.</p>
          </div>
        </div>
      </div>

      {/* Visualizer Output */}
      <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col relative group">
        <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
          <div className="flex bg-black/50 backdrop-blur-md rounded-lg p-1">
            {(['exterior', 'interior', 'garden'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setViewType(type)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition ${viewType === type ? 'bg-white text-black shadow' : 'text-white hover:bg-white/10'}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          {generatedImage && (
             <span className="bg-emerald-500/90 backdrop-blur text-white px-3 py-1 rounded-md text-xs font-bold">
               AI Generated
             </span>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center bg-slate-800">
          {loading ? (
            <div className="text-center p-8">
              <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-300 animate-pulse">Designing your {currentSpecs.style} home in {currentSpecs.city}...</p>
              <p className="text-xs text-slate-500 mt-2">Integrating {currentSpecs.features}...</p>
            </div>
          ) : generatedImage ? (
            <img src={generatedImage} alt="Generated Design" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-12 text-slate-500">
              <PhotoIcon className="w-20 h-20 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">No design generated yet</p>
              <p className="text-sm">Enter specifications and click "Visualize Structure"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignWizard;