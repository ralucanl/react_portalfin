import React, {useState, useEffect} from 'react';
import {useAuth} from '../services/auth';
import {Panel} from '../components/Panel';
import {Submenu} from '../components/Submenu';
import {FilterDialog} from '../components/FilterDialog';
import {ConfirmDialog} from '../components/ConfirmDialog';
import type {Customer, CustomerType} from '../types';
import {useWebsites} from '../contexts/WebsitesContext';

console.log('Rendering CustomersPage');

interface CustomerFormData {
    type: CustomerType;
    fullName: string;
    primaryEmail: string;
    homePhone?: string;
    mobilePhone?: string;
    workPhone?: string;
    secondaryEmail?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
    otherInfo?: string;
}

export const CustomersPage: React.FC = () => {
    const {token, isAuthenticated} = useAuth();
    const {currentWebsite, isLoading, error} = useWebsites();
    console.log('Current website:', currentWebsite);
    // const [customers, setCustomers] = useState<Customer[]>([]);
    // const [isLoading, setIsLoading] = useState(true);
    // const [error, setError] = useState<string | null>(null);

    const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    if (!isAuthenticated) {
        return <div>Please log in to view customers.</div>;
    }

    if (isLoading) {
        return <div>Loading customers...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    const customers = currentWebsite?.clients || [];
    console.log(customers)
    const handleEdit = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsEditOpen(true);
    };

    const handleDelete = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsDeleteConfirmOpen(true);
    };
    const CustomerForm: React.FC<{
        initialData?: CustomerFormData;
        onSubmit: (data: CustomerFormData) => void;
        onClose: () => void;
    }> = ({initialData, onSubmit, onClose}) => (
        <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            // Handle form submission
            onSubmit(initialData || {} as CustomerFormData);
        }}>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                </label>
                <select
                    required
                    defaultValue={initialData?.type}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                >
                    <option value="client">Client</option>
                    <option value="private">Private</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                </label>
                <input
                    type="text"
                    required
                    defaultValue={initialData?.fullName}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Email *
                </label>
                <input
                    type="email"
                    required
                    defaultValue={initialData?.primaryEmail}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary Email
                </label>
                <input
                    type="email"
                    defaultValue={initialData?.secondaryEmail}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Home Phone
                    </label>
                    <input
                        type="tel"
                        defaultValue={initialData?.homePhone}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Phone
                    </label>
                    <input
                        type="tel"
                        defaultValue={initialData?.mobilePhone}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Work Phone
                    </label>
                    <input
                        type="tel"
                        defaultValue={initialData?.workPhone}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                </label>
                <input
                    type="text"
                    defaultValue={initialData?.address}
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
                        defaultValue={initialData?.city}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                    </label>
                    <input
                        type="text"
                        defaultValue={initialData?.state}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                    </label>
                    <input
                        type="text"
                        defaultValue={initialData?.country}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP
                    </label>
                    <input
                        type="text"
                        defaultValue={initialData?.zip}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Other Info
                </label>
                <textarea
                    defaultValue={initialData?.otherInfo}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
            </div>
        </form>
    );

    return (
        <div>
            <Submenu
                title="Customers"
                onAdd={() => setIsAddOpen(true)}
            />

            {customers.map(customer => (
                <Panel
                    key={customer.id}
                    title={customer.fullName}
                    expanded={expandedCustomerId === customer.id}
                    onToggle={() => setExpandedCustomerId(expandedCustomerId === customer.id ? null : customer.id)}
                    actions={
                        <div className="flex space-x-2">
                            <button
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => handleEdit(customer)}
                            >
                                Edit
                            </button>
                            <button
                                className="text-red-600 hover:text-red-800"
                                onClick={() => handleDelete(customer)}
                            >
                                Delete
                            </button>
                        </div>
                    }
                >
                    <div className="space-y-2">
                        <p><strong>Primary Email:</strong> {customer.primaryEmail}</p>
                        {expandedCustomerId === customer.id && (
                            <>
                                <p><strong>Secondary Email:</strong> {customer.secondaryEmail}</p>
                                <p><strong>Home Phone:</strong> {customer.homePhone}</p>
                                <p><strong>Mobile Phone:</strong> {customer.mobilePhone}</p>
                                <p><strong>Work Phone:</strong> {customer.workPhone}</p>
                                <p><strong>Address:</strong> {customer.address}</p>
                                <p><strong>City:</strong> {customer.city}</p>
                                <p><strong>State:</strong> {customer.state}</p>
                                <p><strong>Country:</strong> {customer.country}</p>
                                <p><strong>ZIP:</strong> {customer.zip}</p>
                                <p><strong>Other Info:</strong> {customer.otherInfo}</p>
                            </>
                        )}
                    </div>
                </Panel>
            ))}

            <FilterDialog
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Add New Customer"
            >
                <CustomerForm
                    onSubmit={(data) => {
                        console.log('Add customer:', data);
                        setIsAddOpen(false);
                    }}
                    onClose={() => setIsAddOpen(false)}
                />
            </FilterDialog>

            <FilterDialog
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Edit Customer"
            >
                <CustomerForm
                    initialData={selectedCustomer as CustomerFormData}
                    onSubmit={(data) => {
                        console.log('Update customer:', data);
                        setIsEditOpen(false);
                    }}
                    onClose={() => setIsEditOpen(false)}
                />
            </FilterDialog>

            <ConfirmDialog
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={() => {
                    console.log('Delete customer:', selectedCustomer?.id);
                    setIsDeleteConfirmOpen(false);
                }}
                title="Delete Customer"
                message={`Are you sure you want to delete ${selectedCustomer?.fullName}? This action cannot be undone.`}
            />
        </div>
    );
};