import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Seller } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const SellersPage: React.FC = () => {
  const { sellers, toggleSellerBan, setSelectedSellerId, setActiveTab } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredSellers = sellers.filter(s => {
    const matchesSearch = s.shopName.toLowerCase().includes(search.toLowerCase()) ||
                          s.ownerName.toLowerCase().includes(search.toLowerCase()) ||
                          s.city.toLowerCase().includes(search.toLowerCase()) ||
                          s.phone.includes(search);
    const matchesStatus = statusFilter ? s.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleViewSeller = (seller: Seller) => {
    setSelectedSellerId(seller.id);
    setActiveTab('seller-details');
  };

  const totalActive = sellers.filter(s => s.status === 'Active').length;
  const totalBanned = sellers.filter(s => s.status === 'Banned').length;

  return (
    <div className="max-w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">Marketplace Operations</span>
            <span className="text-outline-variant text-[10px]">•</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Merchant Partners</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Sellers &amp; Shops</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Monitor merchant storefronts, manage compliance status, oversee GMV volumes, and control access permissions.
          </p>
        </div>

        {/* Quick Summary Pill */}
        <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-surface-container-low shadow-xs border border-outline-variant/30">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tertiary-container" />
            <span className="font-code-sm text-code-sm text-on-surface font-semibold">{totalActive} Active Stores</span>
          </div>
          <div className="w-px h-4 bg-outline-variant/30" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-error" />
            <span className="font-code-sm text-code-sm text-on-surface-variant">{totalBanned} Suspended</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-surface-container-lowest rounded-xl p-4 mb-6 shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sellers by shop name, owner, city, or phone..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-container-low text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/20"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface-container-low text-label-md font-label-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/20"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active Stores</option>
            <option value="Banned">Suspended / Banned</option>
            <option value="Pending">Pending Review</option>
          </select>

          <Button 
            onClick={() => { setSearch(''); setStatusFilter(''); }}
            variant="secondary"
            size="sm"
            icon="refresh"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Sellers Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider select-none border-b border-outline-variant/20">
                <th className="py-3.5 px-4 w-12 text-center">
                  <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary/20 accent-primary cursor-pointer" />
                </th>
                <th className="py-3.5 px-4">Store &amp; Brand</th>
                <th className="py-3.5 px-4">Owner Contact</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4 text-center">Rating</th>
                <th className="py-3.5 px-4 text-right">Lifetime GMV</th>
                <th className="py-3.5 px-4 text-center">Commission</th>
                <th className="py-3.5 px-4 text-center">KYC</th>
                <th className="py-3.5 px-4 text-center">Account Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-body-md font-body-md text-on-surface">
              {filteredSellers.map(s => (
                <tr key={s.id} className="hover:bg-surface-container-low/60 transition-colors group">
                  <td className="py-3.5 px-4 text-center">
                    <input type="checkbox" className="w-4 h-4 rounded text-primary accent-primary cursor-pointer" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img className="w-10 h-10 rounded-full object-cover border border-outline-variant/30 flex-shrink-0" src={s.logoUrl} alt={s.shopName} />
                      <div>
                        <span 
                          onClick={() => handleViewSeller(s)}
                          className="font-bold text-on-surface hover:text-primary cursor-pointer transition-colors block"
                        >
                          {s.shopName}
                        </span>
                        <span className="font-code-sm text-outline text-[11px] block">{s.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-on-surface">{s.ownerName}</span>
                      <span className="font-code-sm text-on-surface-variant text-[12px]">{s.phone}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-medium">
                    {s.city}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container font-semibold text-[12px]">
                      <span className="material-symbols-outlined text-[14px] text-secondary">star</span>
                      {s.rating}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-code-sm font-bold text-on-surface">{s.gmv}</span>
                      <span className="text-[11px] text-outline font-medium">{s.totalOrders} orders</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-code-sm font-bold text-primary">
                      {s.commissionRate}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge variant={s.kycStatus === 'Verified' ? 'success' : 'warning'} size="sm">
                      {s.kycStatus}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge variant={s.status === 'Active' ? 'success' : s.status === 'Banned' ? 'error' : 'warning'}>
                      {s.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Button
                        onClick={() => handleViewSeller(s)}
                        variant="secondary"
                        size="sm"
                        icon="visibility"
                      >
                        Profile
                      </Button>
                      <button
                        onClick={() => toggleSellerBan(s.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-label-sm font-semibold transition-colors flex items-center gap-1 ${
                          s.status === 'Active'
                            ? 'bg-error/10 hover:bg-error/20 text-error border border-error/20'
                            : 'bg-tertiary/10 hover:bg-tertiary/20 text-tertiary border border-tertiary/20'
                        }`}
                        title={s.status === 'Active' ? 'Suspend merchant account' : 'Restore merchant account'}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {s.status === 'Active' ? 'block' : 'check_circle'}
                        </span>
                        <span>{s.status === 'Active' ? 'Ban' : 'Unban'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

