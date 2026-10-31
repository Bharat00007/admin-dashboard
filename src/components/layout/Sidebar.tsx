import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../../types';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, approvals } = useApp();
  const [catalogExpanded, setCatalogExpanded] = useState(
    ['products', 'categories', 'brands', 'units'].includes(activeTab)
  );

  const pendingApprovalsCount = approvals.filter(a => a.status === 'Pending' || a.status === 'Under Review').length;

  const handleNav = (tab: TabType) => {
    setActiveTab(tab);
  };

  const isCatalogActive = ['products', 'categories', 'brands', 'units'].includes(activeTab);

  return (
    <aside className="fixed left-0 top-0 h-screen w-[250px] bg-surface-container-lowest border-r border-outline-variant/30 z-50 flex flex-col justify-between select-none shadow-sm">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="h-16 px-space-lg flex items-center gap-3 border-b border-outline-variant/20 bg-surface-container-lowest">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
              <circle cx="7" cy="8.2" r="2.2" />
              <circle cx="17" cy="8.2" r="2.2" />
              <circle cx="10.2" cy="4.8" r="2" />
              <circle cx="13.8" cy="4.8" r="2" />
              <path d="M12 10.8c-2.8 0-5.2 1.8-5.2 4.2 0 2.2 2 3.5 5.2 3.5s5.2-1.3 5.2-3.5c0-2.4-2.4-4.2-5.2-4.2z" />
            </svg>
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight whitespace-nowrap leading-tight">
              Gotails Admin
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium whitespace-nowrap mt-0.5">
              Administration Panel
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-space-md space-y-1 flex-1">
          {/* Dashboard */}
          <button
            onClick={() => handleNav('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-body-md text-body-md text-left ${
              activeTab === 'dashboard'
                ? 'bg-surface-container-high text-primary font-semibold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span>Dashboard</span>
          </button>

          {/* Master Catalog Group */}
          <div className="pt-2">
            <div
              onClick={() => setCatalogExpanded(!catalogExpanded)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg font-body-md text-body-md cursor-pointer transition-colors ${
                isCatalogActive
                  ? 'text-primary font-medium'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">layers</span>
                <span>Master Catalog</span>
              </div>
              <span className={`material-symbols-outlined text-[16px] transition-transform ${catalogExpanded ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </div>

            {catalogExpanded && (
              <div className="pl-8 pr-1 py-1 space-y-1">
                <button
                  onClick={() => handleNav('products')}
                  className={`w-full flex items-center px-3 py-1.5 rounded-lg transition-colors text-left font-body-sm text-body-sm ${
                    activeTab === 'products'
                      ? 'bg-surface-container-high text-primary font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  Products
                </button>
                <button
                  onClick={() => handleNav('categories')}
                  className={`w-full flex items-center px-3 py-1.5 rounded-lg transition-colors text-left font-body-sm text-body-sm ${
                    activeTab === 'categories'
                      ? 'bg-surface-container-high text-primary font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  Categories
                </button>
                <button
                  onClick={() => handleNav('brands')}
                  className={`w-full flex items-center px-3 py-1.5 rounded-lg transition-colors text-left font-body-sm text-body-sm ${
                    activeTab === 'brands'
                      ? 'bg-surface-container-high text-primary font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  Brands
                </button>
                <button
                  onClick={() => handleNav('units')}
                  className={`w-full flex items-center px-3 py-1.5 rounded-lg transition-colors text-left font-body-sm text-body-sm ${
                    activeTab === 'units'
                      ? 'bg-surface-container-high text-primary font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  Units
                </button>
              </div>
            )}
          </div>

          {/* Sellers & Shops */}
          <button
            onClick={() => handleNav('sellers')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-body-md text-body-md text-left ${
              activeTab === 'sellers' || activeTab === 'seller-details'
                ? 'bg-surface-container-high text-primary font-semibold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">store</span>
            <span>Sellers &amp; Shops</span>
          </button>

          {/* Customers */}
          <button
            onClick={() => handleNav('customers')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-body-md text-body-md text-left ${
              activeTab === 'customers'
                ? 'bg-surface-container-high text-primary font-semibold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">group</span>
            <span>Customers &amp; Users</span>
          </button>

          {/* Seller Approvals */}
          <button
            onClick={() => handleNav('approvals')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors font-body-md text-body-md text-left ${
              activeTab === 'approvals' || activeTab === 'approval-details'
                ? 'bg-surface-container-high text-primary font-semibold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">verified</span>
              <span>Seller Approvals</span>
            </div>
            {pendingApprovalsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-label-sm text-label-sm font-semibold">
                {pendingApprovalsCount} Pending
              </span>
            )}
          </button>

          {/* Marketplace Flow */}
          <button
            onClick={() => handleNav('flow')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-body-md text-body-md text-left ${
              activeTab === 'flow'
                ? 'bg-surface-container-high text-primary font-semibold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">account_tree</span>
            <span>Marketplace Flow</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

