// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './services/auth';
import { Layout } from './components/Layout';
import { CustomersPage } from './pages/CustomersPage';
import { BookingPage } from './pages/BookingPage';
import { OrdersPage } from './pages/OrdersPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { PrivateRoute } from './components/PrivateRoute';
import { LoginPage } from './pages/LoginPage';
import { WebsitesProvider } from './contexts/WebsitesContext';

function App() {
  return (
      <Router>
          <WebsitesProvider>
          <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route element={<PrivateRoute />}>
                  <Route element={<Layout />}>
                      <Route index element={<Navigate to="/customers" replace />} />
                      <Route path="customers" element={<CustomersPage />} />
                      <Route path="booking" element={<BookingPage />} />
                      <Route path="orders" element={<OrdersPage />} />
                      <Route path="invoices" element={<InvoicesPage />} />
                  </Route>
              </Route>
          </Routes>
          </WebsitesProvider>
      </Router>
  );
}

export default App;