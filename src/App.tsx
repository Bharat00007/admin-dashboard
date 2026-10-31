import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
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

      {/* Spotlight Command Modal */}
      <GlobalSearchModal />

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
  return <AppContent />;
}

