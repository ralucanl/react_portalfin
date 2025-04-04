import React from 'react';
import { X } from 'lucide-react';
import type { BookingStatus } from '../types';

interface StatusChipProps {
  status: BookingStatus;
  selected: boolean;
  onClick: () => void;
}

const getStatusColor = (status: BookingStatus): { bg: string; text: string; hover: string } => {
  switch (status) {
    case 'Pending':
      return { bg: 'bg-yellow-100', text: 'text-yellow-800', hover: 'hover:bg-yellow-200' };
    case 'Cancel':
      return { bg: 'bg-red-100', text: 'text-red-800', hover: 'hover:bg-red-200' };
    case 'Approved':
      return { bg: 'bg-green-100', text: 'text-green-800', hover: 'hover:bg-green-200' };
    case 'Invoice':
      return { bg: 'bg-purple-100', text: 'text-purple-800', hover: 'hover:bg-purple-200' };
    case 'Paid':
      return { bg: 'bg-blue-100', text: 'text-blue-800', hover: 'hover:bg-blue-200' };
  }
};

export const StatusChip: React.FC<StatusChipProps> = ({ status, selected, onClick }) => {
  const colors = getStatusColor(status);
  
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium
        transition-colors duration-200
        ${selected ? `${colors.bg} ${colors.text}` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
      `}
    >
      {status}
      {selected && <X size={14} className="ml-1" />}
    </button>
  );
};