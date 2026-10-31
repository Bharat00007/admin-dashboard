import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const Topbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsSearchModalOpen,
    globalSearch,
    setIsMobileMenuOpen
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const getBreadcrumbs = () => {
    switch (activeTab) {
      case 'dashboard':
        return ['Administration', 'Dashboard'];
      case 'products':
        return ['Inventory & Master Data', 'Global SKUs', 'Master Catalog'];
      case 'categories':
        return ['Inventory & Master Data', 'Taxonomy', 'Categories Management'];
      case 'brands':
        return ['Inventory & Master Data', 'Partners', 'Brands Management'];
      case 'units':
        return ['Inventory & Master Data', 'Standards', 'Units Management'];
      case 'sellers':
        return ['Marketplace Operations', 'Sellers & Shops'];
      case 'seller-details':
        return ['Marketplace Operations', 'Sellers & Shops', 'Shop Profile'];
      case 'customers':
        return ['Marketplace Users', 'Customer Accounts'];
      case 'approvals':
        return ['Compliance & Onboarding', 'Seller Approvals'];
      case 'approval-details':
        return ['Compliance & Onboarding', 'Seller Approvals', 'Application Audit'];
      default:
        return ['Administration', 'Dashboard'];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 h-16 w-full bg-surface-container-lowest border-b border-outline-variant/30 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
      {/* Breadcrumb Navigation & Mobile Menu Button */}
      <div className="flex items-center min-w-0">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          className="lg:hidden p-2 -ml-2 mr-1 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors flex items-center justify-center shrink-0"
          title="Open menu"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        {/* Mobile current page title */}
        <div className="md:hidden truncate text-body-sm font-semibold text-on-surface">
          {breadcrumbs[breadcrumbs.length - 1]}
        </div>

        {/* Desktop breadcrumb trail */}
        <div className="hidden md:flex items-center gap-2 text-body-sm font-body-sm truncate">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <span className="material-symbols-outlined text-[14px] text-outline shrink-0">chevron_right</span>
              )}
              <span
                onClick={() => {
                  if (idx === 0) setActiveTab('dashboard');
                }}
                className={`truncate ${
                  idx === breadcrumbs.length - 1
                    ? 'text-on-surface font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface cursor-pointer'
                }`}
              >
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Mobile Search Button */}
        <button
          type="button"
          onClick={() => setIsSearchModalOpen(true)}
          className="md:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors flex items-center justify-center"
          title="Search"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>

        {/* Quick Search Bar */}
        <div 
          onClick={() => setIsSearchModalOpen(true)}
          className="hidden md:flex relative items-center w-56 lg:w-80 cursor-pointer"
        >
          <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline">search</span>
          <input
            type="text"
            readOnly
            value={globalSearch}
            placeholder="Search products, sellers, customers..."
            className="w-full pl-9 pr-14 py-1.5 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-sm font-body-sm text-on-surface placeholder:text-outline cursor-pointer hover:border-primary/50 transition-colors"
          />
          <kbd className="absolute right-2 px-1.5 py-0.5 rounded bg-surface-container-high text-outline text-[10px] font-code-sm border border-outline-variant/40">
            ⌘K
          </kbd>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors relative flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-2 z-50 animate-fade-in max-w-[calc(100vw-2rem)]">
              <div className="px-4 py-2 border-b border-outline-variant/20 flex items-center justify-between">
                <span className="font-label-md text-label-md font-bold text-on-surface">Notifications</span>
                <span className="text-[11px] font-semibold text-primary cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-outline-variant/10">
                <div className="p-3 hover:bg-surface-container-low transition-colors cursor-pointer flex gap-3">
                  <span className="w-2 h-2 rounded-full bg-secondary-container mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="font-label-sm text-label-sm font-semibold text-on-surface">New Seller Application</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Canine Care &amp; Nutrition applied from Gurgaon.</p>
                    <span className="text-[10px] text-outline mt-1 block">12 mins ago</span>
                  </div>
                </div>
                <div className="p-3 hover:bg-surface-container-low transition-colors cursor-pointer flex gap-3">
                  <span className="w-2 h-2 rounded-full bg-tertiary mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="font-label-sm text-label-sm font-semibold text-on-surface">Payout Batch Completed</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Settled ₹4.28L across 48 merchant accounts.</p>
                    <span className="text-[10px] text-outline mt-1 block">1 hr ago</span>
                  </div>
                </div>
                <div className="p-3 hover:bg-surface-container-low transition-colors cursor-pointer flex gap-3">
                  <span className="w-2 h-2 rounded-full bg-error mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="font-label-sm text-label-sm font-semibold text-on-surface">Low Stock Alert</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Whiskas Ocean Fish 1.2kg reached 0 inventory.</p>
                    <span className="text-[10px] text-outline mt-1 block">3 hrs ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-outline-variant/30" />

        {/* Profile Dropdown */}
        <div className="relative">
          <div 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 sm:gap-3 pl-1 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-label-md shrink-0 border border-primary/30">
              SJ
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-label-md text-label-md text-on-surface leading-none font-semibold">Sarah Jenkins</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant leading-none mt-1">Platform Admin</span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-outline">keyboard_arrow_down</span>
          </div>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-outline-variant/20">
                <p className="font-label-sm text-label-sm font-semibold text-on-surface">sarah.jenkins@gotails.in</p>
                <p className="text-[11px] text-tertiary font-medium">Super Administrator</p>
              </div>
              <button 
                onClick={() => { setActiveTab('dashboard'); setProfileOpen(false); }}
                className="w-full text-left px-4 py-2 text-body-sm text-on-surface-variant hover:bg-surface-container flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                <span>Account Settings</span>
              </button>
              <div className="border-t border-outline-variant/20 my-1" />
              <button 
                onClick={() => setProfileOpen(false)}
                className="w-full text-left px-4 py-2 text-body-sm text-error hover:bg-error/10 flex items-center gap-2 font-medium"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
