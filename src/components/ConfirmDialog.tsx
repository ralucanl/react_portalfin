import React from 'react';
import { Dialog } from '@headlessui/react';
import { AlertCircle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm w-full bg-white rounded-lg shadow-xl">
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="text-yellow-500" size={24} />
              <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
            </div>
            <Dialog.Description className="mt-3 text-gray-600">
              {message}
            </Dialog.Description>
          </div>
          
          <div className="p-4 border-t flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Confirm
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};