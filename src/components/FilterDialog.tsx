import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export const FilterDialog: React.FC<FilterDialogProps> = ({ isOpen, onClose, children, title }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-xl w-full bg-white rounded-lg shadow-xl">
          <div className="flex justify-between items-center p-4 border-b">
            <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-4">
            {children}
          </div>
          
          <div className="p-4 border-t flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};