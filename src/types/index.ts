export type CustomerType = 'client' | 'private';

export interface Customer {
    id: string;
    type: CustomerType;
    fullName: string;
    primaryEmail: string;
    secondaryEmail?: string;
    homePhone?: string;
    mobilePhone?: string;
    workPhone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
    otherInfo?: string;
}

export type BookingStatus = 'Pending' | 'Cancel' | 'Approved' | 'Invoice' | 'Paid';

export interface Booking {
    id: string;
    appDate: string;
    createdDate: string;
    startDate: string;
    service: string;
    email: string;
    phone: string;
    status: BookingStatus;
    name: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
}

export interface Order {
    id: string;
    clientNumber: string;
    totalAmount: number;
    shipToEmail: string;
    shipToName: string;
    date: string;
    invoiceDate: string;
    deliveryDate: string;
    type: string;
    products: Product[];
    clientInfo: {
        fullName: string;
        phoneNumber: string;
        email: string;
        address: string;
    };
}

export type InvoiceType = 'invoice' | 'quote';
export type InvoiceGenerationType = 'admin' | 'cart' | 'all';

export interface InvoiceProduct {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Invoice {
    id: string;
    number: string;
    generatedAt: string;
    transactionId: string;
    buyerId: string;
    createdDate: string;
    type: InvoiceType;
    generationType: InvoiceGenerationType;
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
    products: InvoiceProduct[];
    subtotal: number;
    tax: number;
    taxPercentage: number;
    discount: number;
    discountPercentage: number;
    adjustment: number;
    total: number;
    dueDate: string;
    balance: number;
    notes?: string;
}