import React from 'react';
import { Plus, Filter } from 'lucide-react';

interface SubmenuProps {
  onAdd?: () => void;
  onFilter?: () => void;
  showFilter?: boolean;
  title: string;
  children?: React.ReactNode;
}

export const Submenu: React.FC<SubmenuProps> = ({
  onAdd,
  onFilter,
  showFilter = true,
  title,
  children,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <div className="flex items-center space-x-2">
          {children}
          {showFilter && onFilter && (
            <button
              onClick={onFilter}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center"
            >
              <Filter size={20} className="mr-2" />
              Filter
            </button>
          )}
          {onAdd && (
            <button
              onClick={onAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Add New
            </button>
          )}
        </div>
      </div>
    </div>
  );
};