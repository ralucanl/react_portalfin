import React, { useState, useMemo } from 'react';
import { Panel } from '../components/Panel';
import { Submenu } from '../components/Submenu';
import { FilterDialog } from '../components/FilterDialog';
import { InvoiceDialog } from '../components/InvoiceDialog';
import { format } from 'date-fns';
import { FileText, Calendar, DollarSign, User, Download, ArrowUp, ArrowDown, Filter, Plus } from 'lucide-react';
import type { Invoice, InvoiceType, InvoiceGenerationType, Customer, InvoiceProduct } from '../types';

export const InvoicesPage: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'date' | 'total'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sample data
  const invoices: Invoice[] = [
    {
      id: '1',
      number: 'INV-2024-001',
      generatedAt: '2024-03-15T10:30:00Z',
      transactionId: 'TRX-001',
      buyerId: 'BUY-001',
      createdDate: '2024-03-15',
      type: 'invoice',
      generationType: 'admin',
      clientInfo: {
        fullName: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip: '62701',
        country: 'USA',
        phone: '555-0123'
      },
      products: [
        {
          id: '1',
          name: 'Product 1',
          price: 100,
          quantity: 2
        }
      ],
      subtotal: 200,
      tax: 20,
      taxPercentage: 10,
      discount: 10,
      discountPercentage: 5,
      adjustment: 0,
      total: 210,
      dueDate: '2024-04-15',
      balance: 210,
      notes: 'Sample invoice notes'
    }
  ];

  const sortedInvoices = useMemo(() => {
    return [...invoices].sort((a, b) => {
      if (sortField === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
          : new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      } else {
        return sortOrder === 'asc' 
          ? a.total - b.total
          : b.total - a.total;
      }
    });
  }, [invoices, sortField, sortOrder]);

  const handleSort = (field: 'date' | 'total') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleGenerateInvoicePDF = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to generate PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Controls */}
            <div className="flex rounded-lg border border-gray-200 bg-white">
              <button
                onClick={() => handleSort('date')}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors
                  border-r border-gray-200
                  ${sortField === 'date' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                  rounded-l-lg
                `}
                title="Sort by date"
              >
                <Calendar size={16} />
                <span className="hidden sm:inline">Date</span>
                {sortField === 'date' && (
                  sortOrder === 'asc' 
                    ? <ArrowUp size={16} className="text-blue-600" />
                    : <ArrowDown size={16} className="text-blue-600" />
                )}
              </button>
              <button
                onClick={() => handleSort('total')}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors
                  ${sortField === 'total' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                  rounded-r-lg
                `}
                title="Sort by total"
              >
                <DollarSign size={16} />
                <span className="hidden sm:inline">Total</span>
                {sortField === 'total' && (
                  sortOrder === 'asc' 
                    ? <ArrowUp size={16} className="text-blue-600" />
                    : <ArrowDown size={16} className="text-blue-600" />
                )}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Filter invoices"
              >
                <Filter size={16} />
                <span className="hidden sm:inline">Filter</span>
              </button>
              <button
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Create new invoice"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">New Invoice</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4">
        {sortedInvoices.map(invoice => (
          <Panel
            key={invoice.id}
            title={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <FileText className="text-blue-600" size={20} />
                  <span className="font-semibold">{invoice.number}</span>
                </div>
                <button
                  onClick={() => handleGenerateInvoicePDF(invoice.id)}
                  className="text-gray-600 hover:text-blue-600"
                >
                  <Download size={20} />
                </button>
              </div>
            }
            expanded={expandedInvoiceId === invoice.id}
            onToggle={() => setExpandedInvoiceId(expandedInvoiceId === invoice.id ? null : invoice.id)}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar size={16} />
                    <span>Generated: {format(new Date(invoice.generatedAt), 'PPp')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User size={16} />
                    <span>Buyer ID: {invoice.buyerId}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <DollarSign size={16} />
                    <span>Total: ${invoice.total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span>Balance: ${invoice.balance.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {expandedInvoiceId === invoice.id && (
                <>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Client Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{invoice.clientInfo.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{invoice.clientInfo.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{invoice.clientInfo.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium">
                          {invoice.clientInfo.address}, {invoice.clientInfo.city}, {invoice.clientInfo.state} {invoice.clientInfo.zip}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Products</h3>
                    <div className="space-y-2">
                      {invoice.products.map(product => (
                        <div key={product.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">${product.price.toFixed(2)} × {product.quantity}</p>
                          </div>
                          <p className="font-medium">${(product.price * product.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${invoice.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Tax ({invoice.taxPercentage}%)</span>
                        <span>${invoice.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Discount ({invoice.discountPercentage}%)</span>
                        <span>-${invoice.discount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Adjustment</span>
                        <span>${invoice.adjustment.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold pt-2 border-t">
                        <span>Total</span>
                        <span>${invoice.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Balance Due</span>
                        <span>${invoice.balance.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {invoice.notes && (
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">Notes</h3>
                      <p className="text-gray-600">{invoice.notes}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </Panel>
        ))}
      </div>

      <FilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filter Invoices"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200">
              <option value="all">All</option>
              <option value="invoice">Invoice</option>
              <option value="quote">Quote</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Generation Type
            </label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200">
              <option value="all">All</option>
              <option value="admin">Generated by Admin</option>
              <option value="cart">Generated by Cart</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Date Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              />
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Amount Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Min"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              />
              <input
                type="number"
                placeholder="Max"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              placeholder="Search by client name"
            />
          </div>
        </div>
      </FilterDialog>

      <InvoiceDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />
    </div>
  );
};