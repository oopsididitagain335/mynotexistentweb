// components/TemplateSelector.tsx
import React from 'react';

interface TemplateSelectorProps {
  selected: string;
  onSelect: (template: string) => void;
}

const templates = [
  { id: 'minimal', name: 'Minimal', className: 'bg-white text-gray-800' },
  { id: 'gradient', name: 'Gradient', className: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' },
  { id: 'dark', name: 'Dark', className: 'bg-gray-900 text-white' },
  { id: 'retro', name: 'Retro', className: 'bg-black text-green-400 font-retro' },
  { id: 'neon', name: 'Neon', className: 'bg-black text-cyan-400 glow' },
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {templates.map((t) => (
        <div
          key={t.id}
          className={`theme-preview p-4 text-center cursor-pointer rounded-xl border-2 ${
            selected === t.id ? 'border-primary ring-2 ring-primary/30' : 'border-gray-300 dark:border-gray-600'
          } ${t.className}`}
          onClick={() => onSelect(t.id)}
        >
          <div className="h-8 rounded mb-2"></div>
          <div className="text-sm font-medium">{t.name}</div>
        </div>
      ))}
    </div>
  );
};

export default TemplateSelector;
