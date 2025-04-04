import React, { useState, useMemo } from 'react';
import { Panel } from '../components/Panel';
import { Submenu } from '../components/Submenu';
import { FilterDialog } from '../components/FilterDialog';
import { format, isToday, isThisWeek, isThisMonth, isThisYear, parseISO, subDays } from 'date-fns';
import { Package2, Calendar, Truck, CreditCard } from 'lucide-react';
import type { Order } from '../types';

export const OrdersPage: React.FC = () => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('today');

  // Sample data with different dates
  const orders: Order[] = [
    {
      id: '1',
      clientNumber: 'ORD001',
      totalAmount: 299.99,
      shipToEmail: 'john.doe@example.com',
      shipToName: 'John Doe',
      date: format(new Date(), 'yyyy-MM-dd'), // Today
      invoiceDate: format(new Date(), 'yyyy-MM-dd'),
      deliveryDate: format(subDays(new Date(), -5), 'yyyy-MM-dd'),
      type: 'Express',
      products: [
        {
          id: '1',
          name: 'Premium Headphones',
          description: 'Wireless noise-canceling headphones',
          price: 299.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'
        }
      ],
      clientInfo: {
        fullName: 'John Doe',
        phoneNumber: '555-0123',
        email: 'john.doe@example.com',
        address: '123 Main St, Springfield, IL 62701'
      }
    },
    {
      id: '2',
      clientNumber: 'ORD002',
      totalAmount: 1299.99,
      shipToEmail: 'sarah.smith@example.com',
      shipToName: 'Sarah Smith',
      date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), // This week
      invoiceDate: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
      deliveryDate: format(subDays(new Date(), -3), 'yyyy-MM-dd'),
      type: 'Standard',
      products: [
        {
          id: '2',
          name: 'Professional Camera',
          description: 'DSLR camera with 4K video capability',
          price: 1299.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32'
        }
      ],
      clientInfo: {
        fullName: 'Sarah Smith',
        phoneNumber: '555-0124',
        email: 'sarah.smith@example.com',
        address: '456 Oak Ave, Chicago, IL 60601'
      }
    }
  ];

  const groupedOrders = useMemo(() => {
    return orders.reduce((acc, order) => {
      const orderDate = parseISO(order.date);
      
      if (isToday(orderDate)) {
        acc.today.push(order);
      } else if (isThisWeek(orderDate)) {
        acc.week.push(order);
      } else if (isThisMonth(orderDate)) {
        acc.month.push(order);
      } else if (isThisYear(orderDate)) {
        acc.year.push(order);
      }
      
      return acc;
    }, {
      today: [] as Order[],
      week: [] as Order[],
      month: [] as Order[],
      year: [] as Order[]
    });
  }, [orders]);

  const renderOrderGroup = (orders: Order[], title: string) => {
    if (orders.length === 0) return null;

    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Package2 className="mr-2" size={24} />
          {title}
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({orders.length} orders)
          </span>
        </h2>
        <div className="grid gap-4">
          {orders.map(order => (
            <Panel
              key={order.id}
              title={
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <span className="text-lg font-semibold">#{order.id}</span>
                    <span className="ml-2 text-gray-500">•</span>
                    <span className="ml-2 text-gray-600">{order.clientNumber}</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              }
              expanded={expandedOrderId === order.id}
              onToggle={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="text-gray-400 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-medium">{format(parseISO(order.date), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Truck className="text-gray-400 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Delivery</p>
                      <p className="font-medium">{format(parseISO(order.deliveryDate), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CreditCard className="text-gray-400 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Invoice Date</p>
                      <p className="font-medium">{format(parseISO(order.invoiceDate), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Ship To</h3>
                      <p className="text-gray-600">{order.shipToName}</p>
                      <p className="text-gray-500 text-sm">{order.shipToEmail}</p>
                    </div>
                    <div className="sm:text-right">
                      <h3 className="font-medium text-gray-900">Order Type</h3>
                      <p className="text-gray-600">{order.type}</p>
                    </div>
                  </div>
                </div>
                
                {expandedOrderId === order.id && (
                  <>
                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Products</h3>
                      <div className="space-y-4">
                        {order.products.map(product => (
                          <div key={product.id} className="flex items-center bg-white rounded-lg border p-3">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className="ml-4 flex-1">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                <div>
                                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                                  <p className="text-sm text-gray-600">{product.description}</p>
                                </div>
                                <div className="mt-2 sm:mt-0 sm:text-right">
                                  <p className="font-medium text-gray-900">
                                    ${(product.price * product.quantity).toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    ${product.price.toFixed(2)} × {product.quantity}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Client Information</h3>
                      <div className="bg-white rounded-lg border p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">{order.clientInfo.fullName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{order.clientInfo.phoneNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{order.clientInfo.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium">{order.clientInfo.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Panel>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          Filter
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6 p-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { key: 'today', label: 'Today', count: groupedOrders.today.length },
            { key: 'week', label: 'Week', count: groupedOrders.week.length },
            { key: 'month', label: 'Month', count: groupedOrders.month.length },
            { key: 'year', label: 'Year', count: groupedOrders.year.length }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setPeriod(key as typeof period)}
              className={`
                px-3 py-2 rounded-lg transition-colors duration-200 flex flex-col items-center justify-center
                ${period === key 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <span className="font-medium text-sm">{label}</span>
              <span className={`text-xs ${
                period === key ? 'text-blue-100' : 'text-gray-400'
              }`}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {period === 'today' && renderOrderGroup(groupedOrders.today, 'Today')}
      {period === 'week' && renderOrderGroup(groupedOrders.week, 'This Week')}
      {period === 'month' && renderOrderGroup(groupedOrders.month, 'This Month')}
      {period === 'year' && renderOrderGroup(groupedOrders.year, 'This Year')}

      <FilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filter Orders"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order ID
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              placeholder="Search by order ID + client number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Date
            </label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
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
    </div>
  );
};