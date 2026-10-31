import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const DashboardPage: React.FC = () => {
  const { setActiveTab, setSelectedApprovalId, setSelectedSellerId, showToast } = useApp();
  const [filterRegion, setFilterRegion] = useState('All Entities');
  const [filterQuery, setFilterQuery] = useState('');

  const pendingApprovalsData = [
    {
      id: 'app-501',
      code: 'PW',
      shopName: 'Paws & Whiskers Pet Store',
      ownerName: 'Rajesh Sharma',
      phone: '+91 98201 44321',
      city: 'Mumbai',
      regDate: 'Oct 24, 2024',
      status: 'Pending Review'
    },
    {
      id: 'app-502',
      code: 'FP',
      shopName: 'Furries Paradise Mart',
      ownerName: 'Ananya Roy',
      phone: '+91 97112 88902',
      city: 'Bengaluru',
      regDate: 'Oct 23, 2024',
      status: 'Pending Review'
    },
    {
      id: 'app-503',
      code: 'BA',
      shopName: 'Bark Avenue Supplies',
      ownerName: 'Vikram Seth',
      phone: '+91 98450 12345',
      city: 'Delhi',
      regDate: 'Oct 22, 2024',
      status: 'Pending Review'
    }
  ];

  const recentProductsData = [
    {
      name: 'Royal Canin Adult Cat Food 2kg',
      brand: 'Royal Canin',
      category: 'Cat Nutrition',
      status: 'Active',
      added: 'Today'
    },
    {
      name: 'Drools Chicken & Egg Puppy 3kg',
      brand: 'Drools',
      category: 'Dog Food',
      status: 'Active',
      added: 'Yesterday'
    },
    {
      name: 'Gotails Clumping Cat Litter 10L',
      brand: 'Gotails Essentials',
      category: 'Cat Litter',
      status: 'Active',
      added: 'Oct 21'
    },
    {
      name: 'Oatmeal Soothing Shampoo 500ml',
      brand: 'Bio-Groom',
      category: 'Grooming',
      status: 'Active',
      added: 'Oct 20'
    }
  ];

  const recentSellersData = [
    {
      id: 'SEL-9081',
      code: 'KH',
      shopName: 'K9 Haven Specialty Clinic & Shop',
      contactName: 'Dr. Meera Nambiar',
      phone: '+91 94471 20993',
      region: 'Kochi, Kerala',
      verification: 'Approved',
      status: 'Open'
    },
    {
      id: 'SEL-9078',
      code: 'WW',
      shopName: 'Wag & Walk Retail Hub',
      contactName: 'Kabir Chawla',
      phone: '+91 99100 87342',
      region: 'Gurugram, NCR',
      verification: 'Approved',
      status: 'Open'
    },
    {
      id: 'SEL-9075',
      code: 'PF',
      shopName: 'Pet Fiesta Gourmet & Care',
      contactName: 'Sneha Kulkarni',
      phone: '+91 91672 55431',
      region: 'Pune, MH',
      verification: 'Approved',
      status: 'Open'
    }
  ];

  const filteredApprovals = pendingApprovalsData.filter(a => {
    const matchesQuery = a.shopName.toLowerCase().includes(filterQuery.toLowerCase()) ||
                         a.ownerName.toLowerCase().includes(filterQuery.toLowerCase()) ||
                         a.city.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesRegion = filterRegion === 'All Entities' ? true :
                          filterRegion === 'Bengaluru' ? a.city.includes('Bengaluru') :
                          filterRegion === 'Mumbai' ? a.city.includes('Mumbai') :
                          filterRegion === 'Delhi NCR' ? (a.city.includes('Delhi') || a.city.includes('Gurgaon')) : true;
    return matchesQuery && matchesRegion;
  });

  const filteredSellers = recentSellersData.filter(s => {
    const matchesQuery = s.shopName.toLowerCase().includes(filterQuery.toLowerCase()) ||
                         s.contactName.toLowerCase().includes(filterQuery.toLowerCase()) ||
                         s.region.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesRegion = filterRegion === 'All Entities' ? true :
                          filterRegion === 'Bengaluru' ? s.region.includes('Bengaluru') :
                          filterRegion === 'Mumbai' ? s.region.includes('Mumbai') :
                          filterRegion === 'Delhi NCR' ? s.region.includes('NCR') : true;
    return matchesQuery && matchesRegion;
  });

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Header & Live Pulse Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Dashboard</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tertiary/10 text-tertiary font-label-sm text-label-sm font-semibold select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
              Live Sync
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Welcome to Gotails Admin. Manage your marketplace from one place.
          </p>
        </div>

        {/* Quick Operations Pill Bar */}
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => showToast('Catalog Exported', 'Downloaded master catalog specification CSV.')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px] text-outline">file_download</span>
            <span>Export Catalog</span>
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('products')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Metric Summary Bento Grid (6 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Total Sellers */}
        <div 
          onClick={() => setActiveTab('sellers')}
          className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer border border-outline-variant/20"
        >
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Total Sellers</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">store</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="font-headline-xl text-headline-xl text-on-surface font-bold leading-none">142</div>
            <div className="flex items-center gap-1 mt-2 text-tertiary font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              <span>+8 this week</span>
            </div>
          </div>
        </div>

        {/* 2. Pending Seller Approvals (Highlighted Amber Card) */}
        <div 
          onClick={() => setActiveTab('approvals')}
          className="group bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden bg-gradient-to-br from-surface-container-lowest to-secondary-container/10 border border-secondary-container/30 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Pending Approvals</span>
            <div className="w-8 h-8 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">pending_actions</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline-xl text-headline-xl text-secondary font-bold leading-none">5</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-label-sm text-label-sm font-semibold">Action Req.</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-secondary font-label-sm text-label-sm group-hover:translate-x-0.5 transition-transform font-semibold">
              <span>Review requests</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </div>
          </div>
        </div>

        {/* 3. Total Customers */}
        <div 
          onClick={() => setActiveTab('customers')}
          className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer border border-outline-variant/20"
        >
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Customers</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">group</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="font-headline-xl text-headline-xl text-on-surface font-bold leading-none">4,892</div>
            <div className="flex items-center gap-1 mt-2 text-tertiary font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              <span>+124 this month</span>
            </div>
          </div>
        </div>

        {/* 4. Master Catalog Products */}
        <div 
          onClick={() => setActiveTab('products')}
          className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer border border-outline-variant/20"
        >
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Catalog Products</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="font-headline-xl text-headline-xl text-on-surface font-bold leading-none">1,280</div>
            <div className="flex items-center gap-1 mt-2 text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[14px] text-tertiary font-bold">check_circle</span>
              <span>99.4% in-stock</span>
            </div>
          </div>
        </div>

        {/* 5. Total Categories */}
        <div 
          onClick={() => setActiveTab('categories')}
          className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer border border-outline-variant/20"
        >
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Categories</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">category</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="font-headline-xl text-headline-xl text-on-surface font-bold leading-none">24</div>
            <div className="flex items-center gap-1 mt-2 text-on-surface-variant font-label-sm text-label-sm">
              <span>8 Primary / 16 Sub</span>
            </div>
          </div>
        </div>

        {/* 6. Total Brands */}
        <div 
          onClick={() => setActiveTab('brands')}
          className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer border border-outline-variant/20"
        >
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Brands</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">sell</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="font-headline-xl text-headline-xl text-on-surface font-bold leading-none">86</div>
            <div className="flex items-center gap-1 mt-2 text-tertiary font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[14px]">new_releases</span>
              <span>+3 verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Filter Toolbar */}
      <div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm border border-outline-variant/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex items-center w-64">
            <span className="material-symbols-outlined absolute left-2.5 text-[18px] text-outline">search</span>
            <input 
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter stores or products..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-container-low text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 border border-outline-variant/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
            {['All Entities', 'Bengaluru', 'Mumbai', 'Delhi NCR'].map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterRegion(tab)}
                className={`px-2.5 py-1 rounded-md text-label-sm font-label-sm transition-colors ${
                  filterRegion === tab
                    ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant">
          <span className="w-2 h-2 rounded-full bg-tertiary" />
          <span>Gateway Health: 100% Operational</span>
        </div>
      </div>

      {/* Main Tables Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* 1. PENDING SELLER APPROVALS (7 Columns wide on XL) */}
        <div className="xl:col-span-7 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between bg-surface-container-lowest border-b border-outline-variant/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Pending Seller Approvals</h2>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Awaiting KYC &amp; trade license verification</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('approvals')}
              className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary hover:text-primary-container font-semibold transition-colors"
            >
              <span>View All Approvals</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm tracking-wider uppercase border-b border-outline-variant/20">
                  <th className="py-2.5 px-4 font-semibold">Shop &amp; Seller</th>
                  <th className="py-2.5 px-4 font-semibold">Contact &amp; City</th>
                  <th className="py-2.5 px-4 font-semibold">Reg Date</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-body-sm font-body-sm">
                {filteredApprovals.map((app) => (
                  <tr key={app.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary font-bold font-label-md text-label-md shrink-0">
                          {app.code}
                        </div>
                        <div className="min-w-0">
                          <p 
                            onClick={() => { setSelectedApprovalId(app.id); setActiveTab('approval-details'); }}
                            className="font-label-md text-label-md text-on-surface truncate font-semibold hover:text-primary cursor-pointer"
                          >
                            {app.shopName}
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{app.ownerName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-code-sm text-code-sm text-on-surface">{app.phone}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px] text-outline">location_on</span>
                          {app.city}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-on-surface font-body-sm text-body-sm whitespace-nowrap">
                      {app.regDate}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-label-sm text-label-sm font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button 
                        type="button"
                        onClick={() => { setSelectedApprovalId(app.id); setActiveTab('approval-details'); }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold transition-colors shadow-xs active:scale-95"
                      >
                        <span>Review</span>
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-surface-container-low flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant mt-auto border-t border-outline-variant/20">
            <span>Showing {filteredApprovals.length} of 5 pending shop verifications</span>
            <button 
              type="button"
              onClick={() => setActiveTab('approvals')}
              className="text-primary font-label-sm text-label-sm font-semibold hover:underline"
            >
              Process Batch Queue
            </button>
          </div>
        </div>

        {/* 2. RECENTLY ADDED PRODUCTS (5 Columns wide on XL) */}
        <div className="xl:col-span-5 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between bg-surface-container-lowest border-b border-outline-variant/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">shelves</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Recently Added Products</h2>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Master SKU registry sync</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('products')}
              className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary hover:text-primary-container font-semibold transition-colors"
            >
              <span>Catalog</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm tracking-wider uppercase border-b border-outline-variant/20">
                  <th className="py-2.5 px-4 font-semibold">Product Name</th>
                  <th className="py-2.5 px-4 font-semibold">Category</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-body-sm font-body-sm">
                {recentProductsData.map((prod, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded bg-surface-container flex items-center justify-center text-outline shrink-0">
                          <span className="material-symbols-outlined text-[16px]">pets</span>
                        </div>
                        <div className="min-w-0">
                          <p 
                            onClick={() => setActiveTab('products')}
                            className="font-label-md text-label-md text-on-surface truncate font-semibold hover:text-primary cursor-pointer"
                          >
                            {prod.name}
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">{prod.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-on-surface whitespace-nowrap">{prod.category}</td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary font-label-sm text-label-sm font-semibold">
                        {prod.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right text-on-surface-variant font-code-sm text-code-sm whitespace-nowrap font-medium">
                      {prod.added}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-surface-container-low flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant mt-auto border-t border-outline-variant/20">
            <span>Catalog version: v14.9 synced</span>
            <button 
              type="button"
              onClick={() => setActiveTab('products')}
              className="text-primary font-label-sm text-label-sm font-semibold hover:underline"
            >
              Bulk Stock Update
            </button>
          </div>
        </div>
      </div>

      {/* 3. RECENTLY REGISTERED SELLERS (Full Width Card) */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest border-b border-outline-variant/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">storefront</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Recently Registered &amp; Onboarded Sellers</h2>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Active marketplace merchant nodes with live store fronts</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary/10 text-tertiary font-label-sm text-label-sm font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
              <span>137 Live Outlets</span>
            </div>
            <button
              onClick={() => setActiveTab('sellers')}
              className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary hover:text-primary-container font-semibold transition-colors"
            >
              <span>Manage All Sellers</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Full Data Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm tracking-wider uppercase border-b border-outline-variant/20">
                <th className="py-2.5 px-4 font-semibold">Store Identifier</th>
                <th className="py-2.5 px-4 font-semibold">Primary Contact</th>
                <th className="py-2.5 px-4 font-semibold">Region / Hub</th>
                <th className="py-2.5 px-4 font-semibold text-center">Verification</th>
                <th className="py-2.5 px-4 font-semibold text-center">Store Status</th>
                <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-body-sm font-body-sm">
              {filteredSellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-label-sm font-label-sm">
                        {seller.code}
                      </div>
                      <div>
                        <p 
                          onClick={() => { setSelectedSellerId('sel-101'); setActiveTab('seller-details'); }}
                          className="font-label-md text-label-md text-on-surface font-semibold hover:text-primary cursor-pointer"
                        >
                          {seller.shopName}
                        </p>
                        <p className="font-code-sm text-code-sm text-on-surface-variant">ID: {seller.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-on-surface font-medium">{seller.contactName}</p>
                    <p className="font-code-sm text-code-sm text-on-surface-variant">{seller.phone}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-on-surface">
                      <span className="material-symbols-outlined text-[14px] text-outline">location_on</span>
                      <span>{seller.region}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tertiary/10 text-tertiary font-label-sm text-label-sm font-semibold">
                      <span className="material-symbols-outlined text-[13px]">check_circle</span>
                      {seller.verification}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tertiary/15 text-tertiary font-label-sm text-label-sm font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                      {seller.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        type="button"
                        onClick={() => { setSelectedSellerId('sel-101'); setActiveTab('seller-details'); }}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" 
                        title="View Storefront"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setSelectedSellerId('sel-101'); setActiveTab('seller-details'); }}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" 
                        title="Settings"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Compliance Status Bar */}
        <div className="p-4 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-3 text-body-sm font-body-sm text-on-surface-variant border-t border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-tertiary font-bold">check</span>
            <span>All newly registered stores comply with Pet Care Goods &amp; Services Guidelines (2024).</span>
          </div>
          <div 
            onClick={() => showToast('Audit Downloaded', 'Audit compliance manifest v2.4 saved.')}
            className="flex items-center gap-1 font-label-sm text-label-sm font-semibold text-primary cursor-pointer hover:underline"
          >
            <span>Download Onboarding Audit Log</span>
            <span className="material-symbols-outlined text-[14px]">download</span>
          </div>
        </div>
      </div>
    </div>
  );
};
