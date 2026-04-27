import React from 'react';
import { Beaker, Activity, ShieldAlert, Heart, FlaskConical, Bug } from 'lucide-react';

interface SidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  { id: 'oncology', name: 'Oncology', icon: Activity },
  { id: 'immunology', name: 'Immunology', icon: ShieldAlert },
  { id: 'critical-care', name: 'Critical Care', icon: Heart },
  { id: 'medical-research', name: 'Medical Research', icon: Beaker },
  { id: 'virology', name: 'Virology', icon: Bug },
  { id: 'general', name: 'General Healthcare', icon: FlaskConical },
];

const Sidebar: React.FC<SidebarProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-tight text-blue-400 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6" />
          GovDraft AI
        </h1>
        <p className="text-xs text-slate-400 mt-1">Secure Government Drafting</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Departments
        </div>
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors ${selectedCategory === cat.name
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <Icon className="w-4 h-4" />
              {cat.name}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-3 text-xs text-slate-400">
          <p className="font-medium text-slate-200 mb-1">POC / Demo Mode</p>
          <p>Secure local processing with Gemini AI integration.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
