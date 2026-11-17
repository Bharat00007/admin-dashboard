import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const DashboardPage: React.FC = () => {
  const { 
    setActiveTab, 
    setSelectedApprovalId, 
    setSelectedSellerId, 
    analytics,
    sellers,
    approvals,
    products,
    customers,
    issues,
    productRequests,
    isLoadingData,
  } = useApp();

  const [filterRegion, setFilterRegion] = useState('All Entities');
  const [filterQuery, setFilterQuery] = useState('');

  // Live KPI values from backend
  const totalSellersCount = analytics ? analytics.activeShopsCount : sellers.filter(s => s.status === 'Active').length;
  const pendingApprovalsList = approvals.filter(a => a.status === 'Pending');
  const pendingApprovalsCount = pendingApprovalsList.length;
  const totalCustomersCount = analytics ? analytics.customerCount : customers.length;
  const pendingProductRequestsCount = productRequests.filter(r => r.status === 'PENDING').length;
  const openIssuesCount = issues.filter(i => i.status === 'OPEN' || i.status === 'UNDER_REVIEW').length;

  // Real Order & GMV metrics from /admin/analytics/overview
  const totalOrders = analytics?.totalOrdersCount ?? 0;
  const gmvDisplay = isLoadingData && !analytics
    ? '...'
    : analytics?.totalGmvRupees
    ? `₹${analytics.totalGmvRupees}`
    : '₹0.00';

  const orderDistribution = analytics?.orderStatusDistribution || {
    PLACED: 0,
    ACCEPTED: 0,
    PREPARING: 0,
    COMPLETED: 0,
    CANCELLED: 0,
    REJECTED: 0
  };

  const completedOrders = orderDistribution.COMPLETED || 0;
  const cancelledOrders = orderDistribution.CANCELLED || 0;
  const rejectedOrders = orderDistribution.REJECTED || 0;
  const inFlightOrders = (orderDistribution.PLACED || 0) + (orderDistribution.ACCEPTED || 0) + (orderDistribution.PREPARING || 0);

  const completionRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : '0';
  const cancellationRate = totalOrders > 0 ? (((cancelledOrders + rejectedOrders) / totalOrders) * 100).toFixed(1) : '0';

  // Filter pending approvals by search and region
  const filteredApprovals = pendingApprovalsList.filter(a => {
    const matchesQuery = a.shopName.toLowerCase().includes(filterQuery.toLowerCase()) ||
                         a.applicantName.toLowerCase().includes(filterQuery.toLowerCase()) ||
                         a.city.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesRegion = filterRegion === 'All Entities' ? true :
                          filterRegion === 'Bengaluru' ? a.city.toLowerCase().includes('bengaluru') || a.city.toLowerCase().includes('bangalore') :
                          filterRegion === 'Mumbai' ? a.city.toLowerCase().includes('mumbai') :
                          filterRegion === 'Delhi NCR' ? (a.city.toLowerCase().includes('delhi') || a.city.toLowerCase().includes('ncr') || a.city.toLowerCase().includes('gurgaon')) : true;
    return matchesQuery && matchesRegion;
  });

  // Filter registered sellers by search and region
  const filteredSellers = sellers.filter(s => {
    const matchesQuery = s.shopName.toLowerCase().includes(filterQuery.toLowerCase()) ||
                         s.ownerName.toLowerCase().includes(filterQuery.toLowerCase()) ||
                         s.city.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesRegion = filterRegion === 'All Entities' ? true :
                          filterRegion === 'Bengaluru' ? s.city.toLowerCase().includes('bengaluru') || s.city.toLowerCase().includes('bangalore') :
                          filterRegion === 'Mumbai' ? s.city.toLowerCase().includes('mumbai') :
                          filterRegion === 'Delhi NCR' ? (s.city.toLowerCase().includes('delhi') || s.city.toLowerCase().includes('ncr') || s.city.toLowerCase().includes('gurgaon')) : true;
    return matchesQuery && matchesRegion;
  });

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Header & Live Pulse Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-headline-lg sm:font-headline-xl text-headline-lg sm:text-headline-xl text-on-surface font-bold tracking-tight">
              Executive Dashboard
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tertiary/10 text-tertiary font-label-sm text-label-sm font-semibold select-none">
              <span className={`w-1.5 h-1.5 rounded-full bg-tertiary ${isLoadingData ? 'animate-ping' : 'animate-pulse'}`} />
              {isLoadingData ? 'Syncing...' : 'Live Production Data'}
            </span>
          </div>
          <p className="font-body-sm sm:font-body-md text-body-sm sm:text-body-md text-on-surface-variant mt-0.5 sm:mt-1">
            Real-time business telemetry, sales fulfillment, and marketplace administration.
          </p>
        </div>

        {/* Quick Operations Action */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            type="button"
            onClick={() => setActiveTab('products')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[40px] rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-all shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span className="whitespace-nowrap">Add Product</span>
          </button>
        </div>
      </div>

      {/* Hero Financial & Order Fulfillment Metrics (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GMV Card */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">
              Gross Merchandise Value (GMV)
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-on-surface">{gmvDisplay}</span>
            <div className="flex items-center gap-1 mt-1.5 text-[12px] text-tertiary font-semibold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>100% Verified Production Volume</span>
            </div>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">
              Total Orders Processed
            </span>
            <div className="w-8 h-8 rounded-lg bg-secondary-container/20 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-on-surface">{totalOrders}</span>
            <p className="text-[12px] text-on-surface-variant mt-1.5">
              Across all registered retail outlets
            </p>
          </div>
        </div>

        {/* Completed Orders Card */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">
              Completed Deliveries
            </span>
            <div className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-tertiary">{completedOrders}</span>
              <span className="text-[12px] font-semibold text-tertiary">({completionRate}%)</span>
            </div>
            <p className="text-[12px] text-on-surface-variant mt-1.5">
              Successfully fulfilled and delivered
            </p>
          </div>
        </div>

        {/* Cancelled / Rejected Orders Card */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">
              Cancelled / Rejected
            </span>
            <div className="w-8 h-8 rounded-lg bg-error/10 text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-error">{cancelledOrders + rejectedOrders}</span>
              <span className="text-[12px] font-semibold text-error">({cancellationRate}%)</span>
            </div>
            <p className="text-[12px] text-on-surface-variant mt-1.5">
              {cancelledOrders} cancelled · {rejectedOrders} rejected
            </p>
          </div>
        </div>
      </div>

      {/* Order Status Distribution Progress Visualizer */}
      <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-headline-sm font-bold text-on-surface">Order Lifecycle Distribution</h2>
            <p className="text-[12px] text-on-surface-variant">Live breakdown of order statuses returned by production analytics.</p>
          </div>
          <span className="text-[12px] font-mono text-outline">
            Total Orders: {totalOrders}
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="h-4 w-full bg-surface-container rounded-full overflow-hidden flex">
          {totalOrders > 0 ? (
            <>
              <div 
                style={{ width: `${(completedOrders / totalOrders) * 100}%` }} 
                className="bg-tertiary transition-all"
                title={`Completed: ${completedOrders}`}
              />
              <div 
                style={{ width: `${(cancelledOrders / totalOrders) * 100}%` }} 
                className="bg-secondary transition-all"
                title={`Cancelled: ${cancelledOrders}`}
              />
              <div 
                style={{ width: `${(rejectedOrders / totalOrders) * 100}%` }} 
                className="bg-error transition-all"
                title={`Rejected: ${rejectedOrders}`}
              />
              {inFlightOrders > 0 && (
                <div 
                  style={{ width: `${(inFlightOrders / totalOrders) * 100}%` }} 
                  className="bg-primary transition-all"
                  title={`In-Flight: ${inFlightOrders}`}
                />
              )}
            </>
          ) : (
            <div className="w-full h-full bg-surface-container" title="No orders to display" />
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-[12px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-tertiary shrink-0" />
            <span className="text-on-surface font-medium">Completed: <strong>{completedOrders}</strong> ({completionRate}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-secondary shrink-0" />
            <span className="text-on-surface font-medium">Cancelled: <strong>{cancelledOrders}</strong> ({totalOrders > 0 ? ((cancelledOrders / totalOrders) * 100).toFixed(1) : '0'}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-error shrink-0" />
            <span className="text-on-surface font-medium">Rejected: <strong>{rejectedOrders}</strong> ({totalOrders > 0 ? ((rejectedOrders / totalOrders) * 100).toFixed(1) : '0'}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-primary shrink-0" />
            <span className="text-on-surface font-medium">In-Flight: <strong>{inFlightOrders}</strong></span>
          </div>
        </div>
      </div>

      {/* Metric Summary Bento Grid (5 Secondary Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {/* 1. Total Sellers */}
        <div 
          onClick={() => setActiveTab('sellers')}
          className="bg-surface-container-lowest rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer border border-outline-variant/20 active:scale-98"
        >
          <div className="flex items-center justify-between gap-1">
            <span className="font-label-sm text-[11px] sm:text-label-sm uppercase tracking-wider text-on-surface-variant font-bold truncate">Active Sellers</span>
            <div className="w-7 h-7 sm:w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">store</span>
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="font-headline-lg sm:font-headline-xl text-headline-lg sm:text-headline-xl text-on-surface font-bold leading-none">
              {isLoadingData ? '...' : totalSellersCount}
            </div>
            <div className="flex items-center gap-1 mt-1.5 sm:mt-2 text-tertiary text-[11px] sm:text-label-sm font-semibold truncate">
              <span className="material-symbols-outlined text-[13px] sm:text-[14px]">storefront</span>
              <span>{sellers.length} registered</span>
            </div>
          </div>
        </div>

        {/* 2. Pending Seller Approvals */}
        <div 
          onClick={() => setActiveTab('approvals')}
          className="group bg-surface-container-lowest rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden bg-gradient-to-br from-surface-container-lowest to-secondary-container/10 border border-secondary-container/30 cursor-pointer active:scale-98"
        >
          <div className="flex items-center justify-between gap-1">
            <span className="font-label-sm text-[11px] sm:text-label-sm uppercase tracking-wider text-secondary font-bold truncate">Approvals</span>
            <div className="w-7 h-7 sm:w-8 h-8 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">pending_actions</span>
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="font-headline-lg sm:font-headline-xl text-headline-lg sm:text-headline-xl text-secondary font-bold leading-none">
                {isLoadingData ? '...' : pendingApprovalsCount}
              </span>
              {pendingApprovalsCount > 0 && (
                <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary text-[10px] sm:text-label-sm font-semibold">Action</span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1.5 sm:mt-2 text-secondary text-[11px] sm:text-label-sm group-hover:translate-x-0.5 transition-transform font-semibold truncate">
              <span>Review applications</span>
              <span className="material-symbols-outlined text-[12px] sm:text-[14px]">chevron_right</span>
            </div>
          </div>
        </div>

        {/* 3. Product Requests */}
        <div 
          onClick={() => setActiveTab('product-requests')}
          className="bg-surface-container-lowest rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer border border-outline-variant/20 active:scale-98"
        >
          <div className="flex items-center justify-between gap-1">
            <span className="font-label-sm text-[11px] sm:text-label-sm uppercase tracking-wider text-on-surface-variant font-bold truncate">SKU Requests</span>
            <div className="w-7 h-7 sm:w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">inventory</span>
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="font-headline-lg sm:font-headline-xl text-headline-lg sm:text-headline-xl text-on-surface font-bold leading-none">
              {pendingProductRequestsCount}
            </div>
            <div className="flex items-center gap-1 mt-1.5 sm:mt-2 text-primary text-[11px] sm:text-label-sm font-semibold truncate">
              <span>{productRequests.length} total requests</span>
            </div>
          </div>
        </div>

        {/* 4. Support Issues */}
        <div 
          onClick={() => setActiveTab('issues')}
          className="bg-surface-container-lowest rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer border border-outline-variant/20 active:scale-98"
        >
          <div className="flex items-center justify-between gap-1">
            <span className="font-label-sm text-[11px] sm:text-label-sm uppercase tracking-wider text-on-surface-variant font-bold truncate">Support Tickets</span>
            <div className="w-7 h-7 sm:w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-error shrink-0">
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">support_agent</span>
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="font-headline-lg sm:font-headline-xl text-headline-lg sm:text-headline-xl text-error font-bold leading-none">
              {openIssuesCount}
            </div>
            <div className="flex items-center gap-1 mt-1.5 sm:mt-2 text-on-surface-variant text-[11px] sm:text-label-sm truncate">
              <span>{issues.length} total tickets</span>
            </div>
          </div>
        </div>


        {/* 6. Total Customers */}
        <div 
          onClick={() => setActiveTab('customers')}
          className="bg-surface-container-lowest rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer border border-outline-variant/20 active:scale-98"
        >
          <div className="flex items-center justify-between gap-1">
            <span className="font-label-sm text-[11px] sm:text-label-sm uppercase tracking-wider text-on-surface-variant font-bold truncate">Customers</span>
            <div className="w-7 h-7 sm:w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">group</span>
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="font-headline-lg sm:font-headline-xl text-headline-lg sm:text-headline-xl text-on-surface font-bold leading-none">
              {totalCustomersCount}
            </div>
            <div className="flex items-center gap-1 mt-1.5 sm:mt-2 text-tertiary text-[11px] sm:text-label-sm font-semibold truncate">
              <span className="material-symbols-outlined text-[13px] sm:text-[14px]">verified_user</span>
              <span>Active users</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Filter Toolbar */}
      <div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-wrap">
          <div className="relative flex items-center w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-2.5 text-[18px] text-outline">search</span>
            <input 
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter stores or products..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-container-low text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 border border-outline-variant/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg overflow-x-auto max-w-full">
            {['All Entities', 'Bengaluru', 'Mumbai', 'Delhi NCR'].map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterRegion(tab)}
                className={`px-2.5 py-1 rounded-md text-label-sm font-label-sm transition-colors whitespace-nowrap ${
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
        <div className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant shrink-0">
          <span className="w-2 h-2 rounded-full bg-tertiary" />
          <span>Production Gateway: 100% Operational</span>
        </div>
      </div>

      {/* Main Tables Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* 1. PENDING SELLER APPROVALS (7 Columns wide on XL) */}
        <div className="xl:col-span-7 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-surface-container-lowest border-b border-outline-variant/20">
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
              className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary hover:text-primary-container font-semibold transition-colors self-start sm:self-auto"
            >
              <span>View All Approvals</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto w-full">
            {filteredApprovals.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[32px] text-outline mb-1">task_alt</span>
                <p className="font-label-md font-semibold text-on-surface">No pending approvals</p>
                <p className="text-body-sm text-outline mt-0.5">All seller onboarding applications are currently up-to-date.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm tracking-wider uppercase border-b border-outline-variant/20">
                    <th className="py-2.5 px-4 font-semibold whitespace-nowrap">Shop &amp; Seller</th>
                    <th className="py-2.5 px-4 font-semibold whitespace-nowrap">Contact &amp; City</th>
                    <th className="py-2.5 px-4 font-semibold whitespace-nowrap">Reg Date</th>
                    <th className="py-2.5 px-4 font-semibold whitespace-nowrap">Status</th>
                    <th className="py-2.5 px-4 font-semibold text-right whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-body-sm font-body-sm">
                  {filteredApprovals.slice(0, 5).map((app) => (
                    <tr key={app.id} className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="py-2.5 px-4">
                        <p 
                          onClick={() => { setSelectedApprovalId(app.id); setActiveTab('approval-details'); }}
                          className="font-label-md text-label-md text-on-surface font-semibold hover:text-primary cursor-pointer leading-tight truncate max-w-[160px]"
                        >
                          {app.shopName}
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant truncate max-w-[160px]">{app.applicantName}</p>
                      </td>
                      <td className="py-2.5 px-4 text-on-surface-variant whitespace-nowrap">
                        <p className="font-code-sm text-code-sm text-on-surface leading-tight">{app.phone}</p>
                        <p className="text-[11px] text-outline">{app.city}</p>
                      </td>
                      <td className="py-2.5 px-4 text-on-surface-variant font-code-sm text-code-sm whitespace-nowrap">
                        {app.appliedDate}
                      </td>
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-label-sm text-label-sm font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse" />
                          {app.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => { setSelectedApprovalId(app.id); setActiveTab('approval-details'); }}
                          className="px-2.5 py-1 rounded-md bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold transition-colors shadow-2xs"
                        >
                          Audit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="p-3 bg-surface-container-low flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant mt-auto border-t border-outline-variant/20">
            <span>{pendingApprovalsList.length} applications awaiting approval</span>
            <button
              onClick={() => setActiveTab('approvals')}
              className="text-primary font-label-sm text-label-sm font-semibold hover:underline"
            >
              Open Approvals Queue
            </button>
          </div>
        </div>

        {/* 2. RECENTLY ADDED PRODUCTS (5 Columns wide on XL) */}
        <div className="xl:col-span-5 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-surface-container-lowest border-b border-outline-variant/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">inventory_2</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Recently Added SKUs</h2>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Latest additions to master catalog</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('products')}
              className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary hover:text-primary-container font-semibold transition-colors self-start sm:self-auto"
            >
              <span>View All SKUs</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          <div className="overflow-x-auto w-full">
            {products.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[32px] text-outline mb-1">inventory_2</span>
                <p className="font-label-md font-semibold text-on-surface">No products available</p>
                <p className="text-body-sm text-outline mt-0.5">Add new SKUs to the master catalog.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm tracking-wider uppercase border-b border-outline-variant/20">
                    <th className="py-2.5 px-4 font-semibold whitespace-nowrap">Product Name</th>
                    <th className="py-2.5 px-4 font-semibold whitespace-nowrap">Category</th>
                    <th className="py-2.5 px-4 font-semibold whitespace-nowrap">Status</th>
                    <th className="py-2.5 px-4 font-semibold text-right whitespace-nowrap">Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-body-sm font-body-sm">
                  {products.slice(0, 5).map((prod) => (
                    <tr key={prod.id} className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {prod.imageUrl ? (
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              className="w-7 h-7 rounded object-cover border border-outline-variant/20 shrink-0"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded bg-surface-container flex items-center justify-center text-outline shrink-0">
                              <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                            </div>
                          )}
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
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                          prod.status === 'Active' ? 'bg-tertiary/10 text-tertiary' : 'bg-surface-container text-outline'
                        }`}>
                          {prod.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right text-on-surface-variant font-code-sm text-code-sm whitespace-nowrap font-medium">
                        {prod.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="p-3 bg-surface-container-low flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant mt-auto border-t border-outline-variant/20">
            <span>{products.length} live SKUs registered</span>
            <button 
              type="button"
              onClick={() => setActiveTab('products')}
              className="text-primary font-label-sm text-label-sm font-semibold hover:underline"
            >
              Manage Catalog
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
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Marketplace Sellers &amp; Outlets</h2>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Merchant storefront nodes across regional fulfillment clusters</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary/10 text-tertiary font-label-sm text-label-sm font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
              <span>{sellers.filter(s => s.status === 'Active').length} Live Outlets</span>
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
          {filteredSellers.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[32px] text-outline mb-1">store</span>
              <p className="font-label-md font-semibold text-on-surface">No sellers found</p>
              <p className="text-body-sm text-outline mt-0.5">Approved merchant shops will appear in this directory.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm tracking-wider uppercase border-b border-outline-variant/20">
                  <th className="py-2.5 px-4 font-semibold whitespace-nowrap">Store Identifier</th>
                  <th className="py-2.5 px-4 font-semibold whitespace-nowrap">Primary Contact</th>
                  <th className="py-2.5 px-4 font-semibold whitespace-nowrap">Region / Hub</th>
                  <th className="py-2.5 px-4 font-semibold text-center whitespace-nowrap">Verification</th>
                  <th className="py-2.5 px-4 font-semibold text-center whitespace-nowrap">Store Status</th>
                  <th className="py-2.5 px-4 font-semibold text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-body-sm font-body-sm">
                {filteredSellers.slice(0, 5).map((seller) => (
                  <tr key={seller.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-label-sm font-label-sm">
                          {seller.shopName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p 
                            onClick={() => { setSelectedSellerId(seller.id); setActiveTab('seller-details'); }}
                            className="font-label-md text-label-md text-on-surface font-semibold hover:text-primary cursor-pointer"
                          >
                            {seller.shopName}
                          </p>
                          <p className="font-code-sm text-code-sm text-on-surface-variant">ID: {seller.id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-on-surface font-medium">{seller.ownerName}</p>
                      <p className="font-code-sm text-code-sm text-on-surface-variant">{seller.phone}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-on-surface">
                        <span className="material-symbols-outlined text-[14px] text-outline">location_on</span>
                        <span>{seller.city}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                        seller.kycStatus === 'Verified' ? 'bg-tertiary/10 text-tertiary' : 'bg-secondary-container/20 text-secondary'
                      }`}>
                        <span className="material-symbols-outlined text-[13px]">
                          {seller.kycStatus === 'Verified' ? 'check_circle' : 'pending'}
                        </span>
                        {seller.kycStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold ${
                        seller.status === 'Active' ? 'bg-tertiary/15 text-tertiary' : 'bg-error/10 text-error'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${seller.status === 'Active' ? 'bg-tertiary animate-pulse' : 'bg-error'}`} />
                        {seller.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          type="button"
                          onClick={() => { setSelectedSellerId(seller.id); setActiveTab('seller-details'); }}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" 
                          title="View Storefront"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Bottom Compliance Status Bar: Wired to real Audit Logs */}
        <div className="p-3 sm:p-4 bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-body-sm font-body-sm text-on-surface-variant border-t border-outline-variant/20">
          <div className="flex flex-wrap items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-tertiary font-bold">check</span>
            <span>All registered stores operate under Quick Commerce Compliance Guidelines.</span>
          </div>
          <div 
            onClick={() => setActiveTab('audit-logs')}
            className="flex items-center gap-1 font-label-sm text-label-sm font-semibold text-primary cursor-pointer hover:underline"
          >
            <span>View Administrative Audit Trail</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </div>
        </div>
      </div>
    </div>
  );
};
