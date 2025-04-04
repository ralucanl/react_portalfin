import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Plus, Trash, Search } from 'lucide-react';
import type { Customer, InvoiceProduct } from '../types';

interface InvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface InvoiceFormData {
  clientInfo: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
  };
  invoiceNumber: string;
  date: string;
  dueDate: string;
  products: InvoiceProduct[];
  taxPercentage: number;
  discountPercentage: number;
  adjustment: number;
  notes: string;
}

// Mock customers data for the search dropdown
const mockCustomers: Customer[] = [
  {
    id: '1',
    type: 'client',
    fullName: 'John Doe',
    primaryEmail: 'john@example.com',
    address: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    country: 'USA',
    zip: '62701',
    phone: '555-0123'
  },
  {
    id: '2',
    type: 'client',
    fullName: 'Jane Smith',
    primaryEmail: 'jane@example.com',
    address: '456 Oak Ave',
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    zip: '60601',
    phone: '555-0124'
  }
];

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: 'Professional Consultation',
    price: 150.00,
    description: '1-hour professional consultation session'
  },
  {
    id: '2',
    name: 'Website Development',
    price: 2500.00,
    description: 'Custom website development package'
  },
  {
    id: '3',
    name: 'SEO Optimization',
    price: 750.00,
    description: 'Complete SEO optimization service'
  },
  {
    id: '4',
    name: 'Logo Design',
    price: 300.00,
    description: 'Professional logo design package'
  },
  {
    id: '5',
    name: 'Social Media Management',
    price: 500.00,
    description: 'Monthly social media management service'
  }
];

export const InvoiceDialog: React.FC<InvoiceDialogProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [formData, setFormData] = useState<InvoiceFormData>({
    clientInfo: {
      fullName: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      phone: ''
    },
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    products: [],
    taxPercentage: 0,
    discountPercentage: 0,
    adjustment: 0,
    notes: ''
  });

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.primaryEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(productSearchQuery.toLowerCase())
  );

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData(prev => ({
      ...prev,
      clientInfo: {
        fullName: customer.fullName,
        email: customer.primaryEmail,
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        zip: customer.zip || '',
        country: customer.country || '',
        phone: customer.phone || ''
      }
    }));
    setShowDropdown(false);
    setSearchQuery('');
  };

  const handleProductSelect = (product: typeof mockProducts[0]) => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { 
        id: Date.now().toString(),
        name: product.name,
        price: product.price,
        quantity: 1
      }]
    }));
    setShowProductDropdown(false);
    setProductSearchQuery('');
  };

  const subtotal = formData.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const tax = subtotal * (formData.taxPercentage / 100);
  const discount = subtotal * (formData.discountPercentage / 100);
  const total = subtotal + tax - discount - formData.adjustment;

  const handleAddProduct = () => {
    setShowProductDropdown(true);
    setProductSearchQuery('');
  };

  const handleRemoveProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const handleProductChange = (index: number, field: keyof InvoiceProduct, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map((product, i) => 
        i === index ? { ...product, [field]: value } : product
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <Dialog.Title className="text-lg font-semibold">Create New Invoice</Dialog.Title>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-4">Client Information</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Search Client
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        placeholder="Search by name or email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 pl-10"
                      />
                      <Search className="absolute left-3 top-[13px] text-gray-400" size={16} />
                    </div>
                    
                    {showDropdown && searchQuery && (
                      <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
                        {filteredCustomers.length > 0 ? (
                          filteredCustomers.map(customer => (
                            <button
                              key={customer.id}
                              type="button"
                              onClick={() => handleCustomerSelect(customer)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                            >
                              <div className="font-medium">{customer.fullName}</div>
                              <div className="text-sm text-gray-600">{customer.primaryEmail}</div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500">No results found</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.clientInfo.fullName}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        clientInfo: { ...prev.clientInfo, fullName: e.target.value }
                      }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.clientInfo.email}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        clientInfo: { ...prev.clientInfo, email: e.target.value }
                      }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.clientInfo.phone}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        clientInfo: { ...prev.clientInfo, phone: e.target.value }
                      }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.clientInfo.address}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        clientInfo: { ...prev.clientInfo, address: e.target.value }
                      }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.clientInfo.city}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          clientInfo: { ...prev.clientInfo, city: e.target.value }
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={formData.clientInfo.state}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          clientInfo: { ...prev.clientInfo, state: e.target.value }
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP
                      </label>
                      <input
                        type="text"
                        value={formData.clientInfo.zip}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          clientInfo: { ...prev.clientInfo, zip: e.target.value }
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={formData.clientInfo.country}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          clientInfo: { ...prev.clientInfo, country: e.target.value }
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Invoice Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invoice Number
                    </label>
                    <input
                      type="text"
                      value={formData.invoiceNumber}
                      onChange={e => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={e => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Products</h3>
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Product
                  </button>
                  
                  {showProductDropdown && (
                    <div className="absolute right-0 z-10 mt-2 w-96 bg-white rounded-md shadow-lg border border-gray-200">
                      <div className="p-2">
                        <div className="relative">
                          <input
                            type="text"
                            value={productSearchQuery}
                            onChange={(e) => setProductSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 pl-10"
                          />
                          <Search className="absolute left-3 top-[11px] text-gray-400" size={16} />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-auto">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map(product => (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() => handleProductSelect(product)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                            >
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-600">{product.description}</div>
                              <div className="text-sm font-medium text-blue-600">${product.price.toFixed(2)}</div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500">No products found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                {formData.products.map((product, index) => (
                  <div key={product.id} className="flex items-start space-x-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={product.name}
                        onChange={e => handleProductChange(index, 'name', e.target.value)}
                        placeholder="Product name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                      />
                    </div>
                    <div className="w-32">
                      <input
                        type="number"
                        value={product.price}
                        onChange={e => handleProductChange(index, 'price', parseFloat(e.target.value))}
                        placeholder="Price"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={e => handleProductChange(index, 'quantity', parseInt(e.target.value))}
                        placeholder="Qty"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(index)}
                      className="mt-1 text-red-600 hover:text-red-700"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Percentage
                    </label>
                    <input
                      type="number"
                      value={formData.taxPercentage}
                      onChange={e => setFormData(prev => ({ ...prev, taxPercentage: parseFloat(e.target.value) }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Percentage
                    </label>
                    <input
                      type="number"
                      value={formData.discountPercentage}
                      onChange={e => setFormData(prev => ({ ...prev, discountPercentage: parseFloat(e.target.value) }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adjustment/Amount Paid
                    </label>
                    <input
                      type="number"
                      value={formData.adjustment}
                      onChange={e => setFormData(prev => ({ ...prev, adjustment: parseFloat(e.target.value) }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Summary</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax ({formData.taxPercentage}%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Discount ({formData.discountPercentage}%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Adjustment</span>
                    <span>${formData.adjustment.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total Balance</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
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
                Create Invoice
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};