import React, {createContext, useContext, useState, useEffect} from 'react';
import {useAuth} from '../services/auth';

const API_URL = 'https://portalfin.in';

interface Customer {
    id: string;
    type: string;
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

interface Website {
    id: string;
    name: string;
    domain: string;
    clients: Customer[];
}

interface WebsitesContextType {
    websites: Website[];
    currentWebsite: Website | null;
    setCurrentWebsite: (website: Website) => void;
    isLoading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
}

const WebsitesContext = createContext<WebsitesContextType>({
    websites: [],
    currentWebsite: null,
    setCurrentWebsite: () => {
    },
    isLoading: true,
    error: null,
    refreshData: async () => {
    },
});

export const WebsitesProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {token} = useAuth();
    const [websites, setWebsites] = useState<Website[]>([]);
    const [currentWebsite, setCurrentWebsite] = useState<Website | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const decodeURIValues = (obj: any): any => {
        if (typeof obj === 'string') {
            try {
                return decodeURIComponent(obj);
            } catch {
                return obj;
            }
        }
        if (Array.isArray(obj)) {
            return obj.map(decodeURIValues);
        }
        if (typeof obj === 'object' && obj !== null) {
            return Object.fromEntries(
                Object.entries(obj).map(([key, value]) => [key, decodeURIValues(value)])
            );
        }
        return obj;
    };

    const fetchData = async () => {
        if (!token) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/api-test.php`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({getWebsite: true})
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const decodedData = decodeURIValues(data);

            // Create website object with clients
            const websiteData = {
                id: decodedData.website_id || 'default',
                name: decodedData.name || 'Default Website',
                domain: decodedData.domain || '',
                clients: Object.entries(decodedData.clients || {}).map(([id, clientData]: [string, any]) => ({
                    id,
                    type: 'client',
                    fullName: clientData.fullName || 'No Name',
                    primaryEmail: clientData.primaryEmail || 'no-email@example.com',
                    homePhone: clientData.homePhone,
                    mobilePhone: clientData.mobilePhone,
                    workPhone: clientData.workPhone,
                    secondaryEmail: clientData.secondaryEmail,
                    address: clientData.address,
                    city: clientData.city,
                    state: clientData.state,
                    country: clientData.country,
                    zip: clientData.zip,
                    otherInfo: clientData.otherInfo
                }))
            };
            console.log(websiteData.clients)
            setWebsites(data.websites); // For now, just one website
            setCurrentWebsite(websiteData);
            localStorage.setItem('website_name', decodedData.name);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch data');
            console.error('Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshData = async () => {
        await fetchData();
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    return (
        <WebsitesContext.Provider value={{
            websites,
            currentWebsite,
            setCurrentWebsite,
            isLoading,
            error,
            refreshData
        }}>
            {children}
        </WebsitesContext.Provider>
    );
};

export const useWebsites = () => useContext(WebsitesContext);