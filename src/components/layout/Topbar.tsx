import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const Topbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsMobileMenuOpen
  } = useApp();

  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return 'AD';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
  };

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
      case 'product-requests':
        return ['Inventory & Master Data', 'Requests', 'Seller SKU Approvals'];
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
      case 'issues':
      case 'customer-issues':
      case 'seller-issues':
        return ['Customer & Seller Support', 'Issue Reports'];

      case 'audit-logs':
        return ['System & Compliance', 'Audit Logs'];
      case 'settings':
        return ['System & Compliance', 'Global Settings'];
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
        {/* Profile Dropdown */}
        <div className="relative">
          <div 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 sm:gap-3 pl-1 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-label-md shrink-0 border border-primary/30">
              {getInitials(user?.name)}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-label-md text-label-md text-on-surface leading-none font-semibold truncate max-w-[140px]">
                {user?.name || 'Administrator'}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant leading-none mt-1">
                {user?.role === 'ADMIN' ? 'Platform Admin' : user?.role || 'Admin'}
              </span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-outline">keyboard_arrow_down</span>
          </div>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-outline-variant/20">
                <p className="font-label-sm text-label-sm font-semibold text-on-surface truncate">
                  {user?.email || 'admin@gotails.com'}
                </p>
                <p className="text-[11px] text-tertiary font-medium mt-0.5">
                  {user?.name || 'Administrator'}
                </p>
              </div>
              <button 
                onClick={() => { setActiveTab('dashboard'); setProfileOpen(false); }}
                className="w-full text-left px-4 py-2 text-body-sm text-on-surface-variant hover:bg-surface-container flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                <span>Dashboard Overview</span>
              </button>
              <div className="border-t border-outline-variant/20 my-1" />
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-body-sm text-error hover:bg-error/10 flex items-center gap-2 font-medium transition-colors"
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
