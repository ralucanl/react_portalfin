import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, Calendar, ShoppingCart, FileText, ChevronDown, Globe } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { useWebsites } from '../contexts/WebsitesContext';
interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-4 ${
            active ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'
        }`}
    >
      {icon}
      <span className="mt-1 text-sm">{label}</span>
    </button>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isWebsiteDropdownOpen, setIsWebsiteDropdownOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { currentWebsite, isLoading, error, websites } = useWebsites();

console.log(websites);
  if (!currentWebsite) {
    return <div>Loading current website...</div>;
  }
  //const [currentWebsite, setCurrentWebsite] = useState(websites[0]);

  return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-8 pb-32"> {/* Increased padding-bottom */}
          <Outlet />
        </main>

        <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200">
          <div className="flex justify-around items-center">
            <NavButton
                icon={<Users size={24} />}
                label="Customers"
                path="/customers"
                active={location.pathname === '/customers'}
                onClick={() => navigate('/customers')}
            />
            <NavButton
                icon={<Calendar size={24} />}
                label="Booking"
                path="/booking"
                active={location.pathname === '/booking'}
                onClick={() => navigate('/booking')}
            />
            <NavButton
                icon={<ShoppingCart size={24} />}
                label="Orders"
                path="/orders"
                active={location.pathname === '/orders'}
                onClick={() => navigate('/orders')}
            />
            <NavButton
                icon={<FileText size={24} />}
                label="Invoices"
                path="/invoices"
                active={location.pathname === '/invoices'}
                onClick={() => navigate('/invoices')}
            />
          </div>

          {/* Website Selector */}
          <div className="relative border-t border-gray-100 px-4 py-3">
            <button
                onClick={() => setIsWebsiteDropdownOpen(!isWebsiteDropdownOpen)}
                className="w-full flex items-center justify-between text-gray-700 hover:text-blue-600 transition-colors"
            >
              <div className="flex items-center">
                <Globe size={18} className="mr-2" />
                <div className="text-left">
                  <p className="font-medium text-sm">{currentWebsite.name}</p>
                  <p className="text-xs text-gray-500">{currentWebsite.domain}</p>
                </div>
              </div>
              <ChevronDown size={18} className={`transition-transform ${isWebsiteDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isWebsiteDropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-1 mx-4 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-1 max-h-60 overflow-y-auto">
                    {websites.map(website => (
                        <button
                            key={website.id}
                            onClick={() => {
                              setCurrentWebsite(website);
                              setIsWebsiteDropdownOpen(false);
                              // Here you would also load the new website's data
                            }}
                            className={`w-full text-left px-4 py-2 text-sm flex items-center ${
                                parseInt(website.id) === currentWebsite.id
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                          <div className="flex-1">
                            <p className="font-medium">{website.name}</p>
                            <p className="text-xs text-gray-500">{website.domain}</p>
                          </div>
                          {website.id === currentWebsite.id && (
                              <span className="ml-2 text-blue-500">✓</span>
                          )}
                        </button>
                    ))}
                  </div>
                </div>
            )}
          </div>
        </nav>
      </div>
  );
};