import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PanelProps {
  title: string;
  children: React.ReactNode;
  expanded?: boolean;
  onToggle?: () => void;
  actions?: React.ReactNode;
}

export const Panel: React.FC<PanelProps> = ({
  title,
  children,
  expanded = false,
  onToggle,
  actions,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md mb-4">
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center space-x-2">
          {actions}
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          )}
        </div>
      </div>
      <div className={`p-4 ${expanded ? '' : 'max-h-[150px] overflow-hidden'}`}>
        {children}
      </div>
    </div>
  );
};