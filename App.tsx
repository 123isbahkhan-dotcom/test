import React, { useState } from 'react';
import { AppState, HouseSpecs } from './types';
import DesignWizard from './components/DesignWizard';
import CostEstimator from './components/CostEstimator';
import ProfessionalFinder from './components/ProfessionalFinder';
import { BuildingOffice2Icon, PaintBrushIcon, CalculatorIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppState>(AppState.HOME);
  const [specs, setSpecs] = useState<HouseSpecs>({
    city: 'Karachi',
    plotSize: '500 Sq Yards',
    dimensions: '50x90 ft',
    floors: 2,
    style: 'Modern Minimalist',
    exteriorColor: 'White and Grey',
    layout: '5 Bed, 6 Bath, Drawing, Dining',
    features: 'Large windows, lawn, solar panels',
    budget: ''
  });

  const renderContent = () => {
    switch (activeTab) {
      case AppState.HOME:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
              Build Your <span className="text-emerald-600">Legacy</span>
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-2xl leading-relaxed">
              Design your dream home in Pakistan with AI. Visualize architecture in real-time, 
              get instant construction cost estimates, and connect with trusted professionals.
            </p>
            <button 
              onClick={() => setActiveTab(AppState.DESIGN)}
              className="bg-slate-900 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-emerald-600 transition shadow-xl hover:shadow-2xl hover:-translate-y-1 transform duration-200"
            >
              Start Designing Now
            </button>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
                {[
                    { title: "Design", desc: "Visualize 3D concepts for any plot size." },
                    { title: "Estimate", desc: "Get detailed cost breakdowns in PKR." },
                    { title: "Build", desc: "Find architects & contractors in your city." }
                ].map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                        <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                ))}
            </div>
          </div>
        );
      case AppState.DESIGN:
        return <DesignWizard currentSpecs={specs} onSpecsChange={setSpecs} />;
      case AppState.ESTIMATE:
        return <CostEstimator specs={specs} />;
      case AppState.FIND_PROS:
        return <ProfessionalFinder city={specs.city} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-24 bg-white border-r border-slate-200 flex flex-row md:flex-col items-center py-4 md:py-8 z-20 shadow-sm flex-shrink-0">
        <div 
            className="w-10 h-10 bg-emerald-600 rounded-xl mb-0 md:mb-12 flex items-center justify-center text-white font-bold text-xl cursor-pointer ml-4 md:ml-0"
            onClick={() => setActiveTab(AppState.HOME)}
        >
            DB
        </div>
        
        <div className="flex flex-row md:flex-col gap-2 md:gap-6 mx-auto">
            <NavButton 
                active={activeTab === AppState.DESIGN} 
                onClick={() => setActiveTab(AppState.DESIGN)} 
                icon={<PaintBrushIcon className="w-6 h-6" />} 
                label="Design"
            />
            <NavButton 
                active={activeTab === AppState.ESTIMATE} 
                onClick={() => setActiveTab(AppState.ESTIMATE)} 
                icon={<CalculatorIcon className="w-6 h-6" />} 
                label="Cost"
            />
            <NavButton 
                active={activeTab === AppState.FIND_PROS} 
                onClick={() => setActiveTab(AppState.FIND_PROS)} 
                icon={<UserGroupIcon className="w-6 h-6" />} 
                label="Pros"
            />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 h-screen overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
    <button 
        onClick={onClick}
        className={`p-3 rounded-xl transition-all duration-200 group relative flex flex-col items-center gap-1 ${active ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:text-emerald-500 hover:bg-slate-50'}`}
    >
        {icon}
        <span className="text-[10px] font-medium">{label}</span>
        {active && <div className="absolute left-0 md:left-auto md:top-1/2 md:-translate-y-1/2 md:-right-1 w-1 h-8 md:w-1 md:h-8 bg-emerald-600 rounded-full md:block hidden"></div>}
    </button>
);

export default App;