import React from 'react';
import { useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/Auth/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { Toast } from './components/ui/Toast';

import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { MasterCatalogPage } from './pages/MasterCatalog/MasterCatalogPage';
import { CategoriesPage } from './pages/MasterCatalog/CategoriesPage';
import { BrandsPage } from './pages/MasterCatalog/BrandsPage';
import { UnitsPage } from './pages/MasterCatalog/UnitsPage';
import { SellersPage } from './pages/Sellers/SellersPage';
import { SellerDetailsPage } from './pages/Sellers/SellerDetailsPage';
import { CustomersPage } from './pages/Customers/CustomersPage';
import { SellerApprovalsPage } from './pages/SellerApprovals/SellerApprovalsPage';
import { SellerApprovalDetailsPage } from './pages/SellerApprovals/SellerApprovalDetailsPage';

export const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'products':
        return <MasterCatalogPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'brands':
        return <BrandsPage />;
      case 'units':
        return <UnitsPage />;
      case 'sellers':
        return <SellersPage />;
      case 'seller-details':
        return <SellerDetailsPage />;
      case 'customers':
        return <CustomersPage />;
      case 'approvals':
        return <SellerApprovalsPage />;
      case 'approval-details':
        return <SellerApprovalDetailsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased">
      {/* Toast Notification Container */}
      <Toast />

      {/* Fixed 250px Left Sidebar */}
      <Sidebar />

      {/* Main Content Area (offset by 250px on desktop) */}
      <div className="lg:pl-[250px] min-h-screen flex flex-col w-full min-w-0">
        {/* Sticky Top Navigation Bar */}
        <Topbar />

        {/* Dynamic Page Body */}
        <main className="w-full flex-1 bg-surface px-4 py-4 sm:px-6 sm:py-6 lg:px-8 max-w-full min-w-0">
          {renderActiveScreen()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-surface">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 animate-pulse mb-4">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
            <circle cx="7" cy="8.2" r="2.2" />
            <circle cx="17" cy="8.2" r="2.2" />
            <circle cx="10.2" cy="4.8" r="2" />
            <circle cx="13.8" cy="4.8" r="2" />
            <path d="M12 10.8c-2.8 0-5.2 1.8-5.2 4.2 0 2.2 2 3.5 5.2 3.5s5.2-1.3 5.2-3.5c0-2.4-2.4-4.2-5.2-4.2z" />
          </svg>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant font-label-md">
          <svg
            className="animate-spin h-4 w-4 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Initializing administration session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== 'ADMIN') {
    return <LoginPage />;
  }

  return <AppContent />;
}


