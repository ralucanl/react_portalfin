import React, { useState } from 'react';
import { Panel } from '../components/Panel';
import { Submenu } from '../components/Submenu';
import { FilterDialog } from '../components/FilterDialog';
import { BookingDialog } from '../components/BookingDialog';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StatusChip } from '../components/StatusChip';
import { format } from 'date-fns';
import type { Booking, BookingStatus } from '../types';

interface BookingFormData {
  appDate: string;
  createdDate: string;
  name: string;
  service: string;
  email: string;
  phone: string;
}

export const BookingPage: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<BookingStatus[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    bookingId: string;
    newStatus: BookingStatus;
  }>({
    isOpen: false,
    bookingId: '',
    newStatus: 'Pending'
  });

  const bookings: Booking[] = [
    {
      id: '1',
      appDate: '2024-03-15',
      createdDate: '2024-03-10',
      startDate: '2024-03-15',
      service: 'Consultation',
      email: 'john.doe@example.com',
      phone: '555-0123',
      status: 'Pending',
      name: 'John Doe'
    }
  ];

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    setConfirmDialog({
      isOpen: true,
      bookingId,
      newStatus
    });
  };

  const confirmStatusChange = () => {
    // Update status logic here
    console.log(`Status changed to ${confirmDialog.newStatus} for booking ${confirmDialog.bookingId}`);
  };

  const handleAddBooking = (data: BookingFormData) => {
    console.log('New booking:', data);
    setIsAddOpen(false);
  };

  const toggleStatus = (status: BookingStatus) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const allStatuses: BookingStatus[] = ['Pending', 'Cancel', 'Approved', 'Invoice', 'Paid'];

  const getStatusColor = (status: BookingStatus): string => {
    switch (status) {
      case 'Pending': return 'text-yellow-600';
      case 'Cancel': return 'text-red-600';
      case 'Approved': return 'text-green-600';
      case 'Invoice': return 'text-purple-600';
      case 'Paid': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const BookingForm: React.FC<{
    onSubmit: (data: BookingFormData) => void;
    onClose: () => void;
  }> = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState<BookingFormData>({
      appDate: format(new Date(), 'yyyy-MM-dd'),
      createdDate: format(new Date(), 'yyyy-MM-dd'),
      name: '',
      service: '',
      email: '',
      phone: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Appointment Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            required
            value={formData.appDate}
            onChange={(e) => setFormData({ ...formData, appDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Created Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            required
            value={formData.createdDate}
            onChange={(e) => setFormData({ ...formData, createdDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
            placeholder="Enter client name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service
          </label>
          <input
            type="text"
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
            placeholder="Enter service type"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
            placeholder="Enter phone number"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Booking
          </button>
        </div>
      </form>
    );
  };

  return (
    <div>
      <Submenu 
        title="Bookings" 
        onAdd={() => setIsAddOpen(true)} 
        onFilter={() => setIsFilterOpen(true)}
        showFilter={true}
      />
      
      <div className="grid gap-4">
        {bookings.map(booking => (
          <Panel
            key={booking.id}
            title={`Booking - ${booking.name}`}
            actions={
              <select
                className="border rounded px-2 py-1"
                value={booking.status}
                onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
              >
                <option value="Pending">Pending</option>
                <option value="Cancel">Cancel</option>
                <option value="Approved">Approved</option>
                <option value="Invoice">Invoice</option>
                <option value="Paid">Paid</option>
              </select>
            }
          >
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">App Date:</span>
                  <span className="font-medium">{booking.appDate}</span>
                </div>
                <div className={`font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Service:</span>
                <span className="font-medium">{booking.service}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Contact:</span>
                <span className="font-medium">{booking.phone}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{booking.email}</span>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <BookingDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Booking"
      >
        <BookingForm
          onSubmit={handleAddBooking}
          onClose={() => setIsAddOpen(false)}
        />
      </BookingDialog>

      <FilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filter Bookings"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Created Date Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600">From</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">To</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {allStatuses.map(status => (
                <StatusChip
                  key={status}
                  status={status}
                  selected={selectedStatuses.includes(status)}
                  onClick={() => toggleStatus(status)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              placeholder="Search by name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              placeholder="Search by email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              placeholder="Search by phone"
            />
          </div>
        </div>
      </FilterDialog>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmStatusChange}
        title="Confirm Status Change"
        message={`Are you sure you want to change the status to ${confirmDialog.newStatus}?`}
      />
    </div>
  );
};