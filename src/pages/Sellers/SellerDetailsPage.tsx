import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const SellerDetailsPage: React.FC = () => {
  const { 
    selectedSellerId, 
    sellers, 
    setActiveTab, 
    toggleSellerBan,
    products 
  } = useApp();

  const seller = sellers.find(s => s.id === selectedSellerId) || sellers[0];

  if (!seller) {
    return (
      <div className="p-8 text-center">
        <p>No seller selected.</p>
        <Button onClick={() => setActiveTab('sellers')} className="mt-4">Back to Sellers</Button>
      </div>
    );
  }

  return (
    <div className="max-w-full pb-12">
      {/* Top Back Action */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setActiveTab('sellers')}
          className="p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/30 text-on-surface flex items-center gap-1 text-body-sm font-semibold transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Sellers</span>
        </button>
        <span className="text-outline-variant">•</span>
        <span className="font-label-sm text-on-surface-variant font-medium">Shop Identification: {seller.id}</span>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start md:items-center gap-5">
          <img
            src={seller.logoUrl}
            alt={seller.shopName}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-outline-variant/30 shadow-sm flex-shrink-0"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
              <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">{seller.shopName}</h1>
              <Badge variant={seller.status === 'Active' ? 'success' : 'error'}>
                {seller.status} Store
              </Badge>
              <Badge variant="primary">
                ⭐ {seller.rating} Customer Rating
              </Badge>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-outline">location_on</span>
              <span>{seller.address}</span>
            </p>
            <div className="flex items-center gap-4 mt-2 text-[12px] text-outline font-medium">
              <span>Joined: {seller.joinedDate}</span>
              <span>•</span>
              <span>Hours: {seller.operatingHours}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => toggleSellerBan(seller.id)}
            className={`px-4 py-2 rounded-lg text-label-md font-semibold transition-colors flex items-center gap-2 ${
              seller.status === 'Active'
                ? 'bg-error/10 hover:bg-error/20 text-error border border-error/20'
                : 'bg-tertiary/10 hover:bg-tertiary/20 text-tertiary border border-tertiary/20'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {seller.status === 'Active' ? 'block' : 'check_circle'}
            </span>
            <span>{seller.status === 'Active' ? 'Ban Merchant Store' : 'Unban Store'}</span>
          </button>
          <Button variant="secondary" icon="mail">
            Contact Owner
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs">
          <span className="text-[12px] font-semibold text-outline uppercase tracking-wider block mb-1">Lifetime GMV</span>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-lg font-bold text-on-surface">{seller.gmv}</span>
            <span className="text-tertiary font-label-sm font-semibold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +14.2%
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs">
          <span className="text-[12px] font-semibold text-outline uppercase tracking-wider block mb-1">Orders Fulfilled</span>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-lg font-bold text-on-surface">{seller.totalOrders}</span>
            <span className="text-outline text-body-sm font-medium">99.4% on-time</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs">
          <span className="text-[12px] font-semibold text-outline uppercase tracking-wider block mb-1">Commission Rate</span>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-lg font-bold text-primary">{seller.commissionRate}%</span>
            <span className="text-on-surface-variant text-body-sm font-medium">Standard Tier</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs">
          <span className="text-[12px] font-semibold text-outline uppercase tracking-wider block mb-1">KYC Audit Status</span>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-sm font-bold text-tertiary flex items-center gap-1">
              <span className="material-symbols-outlined text-[20px]">verified</span>
              {seller.kycStatus}
            </span>
            <span className="text-outline text-body-sm">All Docs Valid</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Business/Bank Info & Live Store Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Store Details & Compliance */}
        <div className="space-y-6 lg:col-span-1">
          {/* Business Entity Details */}
          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs">
            <h3 className="font-headline-sm font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
              <span>Business Registration</span>
            </h3>
            <div className="space-y-3 text-body-sm">
              <div>
                <span className="text-outline text-[11px] block font-medium">Owner &amp; Authorized Signatory</span>
                <span className="font-semibold text-on-surface">{seller.ownerName}</span>
              </div>
              <div>
                <span className="text-outline text-[11px] block font-medium">Official Contact Email</span>
                <span className="font-code-sm text-primary">{seller.email}</span>
              </div>
              <div>
                <span className="text-outline text-[11px] block font-medium">Direct Phone Line</span>
                <span className="font-code-sm text-on-surface">{seller.phone}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline-variant/20">
                <div>
                  <span className="text-outline text-[11px] block font-medium">GSTIN</span>
                  <span className="font-code-sm font-bold text-on-surface">{seller.gstin}</span>
                </div>
                <div>
                  <span className="text-outline text-[11px] block font-medium">PAN</span>
                  <span className="font-code-sm font-bold text-on-surface">{seller.pan}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs">
            <h3 className="font-headline-sm font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-[20px]">account_balance</span>
              <span>Settlement Account</span>
            </h3>
            <div className="space-y-3 text-body-sm">
              <div>
                <span className="text-outline text-[11px] block font-medium">Account Beneficiary</span>
                <span className="font-semibold text-on-surface">{seller.bankAccount.holderName}</span>
              </div>
              <div>
                <span className="text-outline text-[11px] block font-medium">Bank &amp; Branch</span>
                <span className="text-on-surface">{seller.bankAccount.bankName}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-outline text-[11px] block font-medium">Account Number</span>
                  <span className="font-code-sm font-bold text-on-surface">{seller.bankAccount.accountNumber}</span>
                </div>
                <div>
                  <span className="text-outline text-[11px] block font-medium">IFSC Code</span>
                  <span className="font-code-sm font-bold text-on-surface">{seller.bankAccount.ifsc}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Live Stock Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-headline-sm font-bold text-on-surface">Store Catalog Offerings</h3>
                <p className="font-body-sm text-on-surface-variant">Active SKUs currently listed and priced by this merchant storefront.</p>
              </div>
              <span className="font-code-sm text-body-sm px-2.5 py-1 rounded bg-surface-container text-on-surface font-semibold">
                {products.length} Products Active
              </span>
            </div>

            <div className="divide-y divide-outline-variant/10">
              {products.slice(0, 5).map(prod => (
                <div key={prod.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={prod.imageUrl} alt={prod.name} className="w-12 h-12 rounded-lg object-cover border border-outline-variant/20" />
                    <div>
                      <h4 className="font-label-md font-semibold text-on-surface">{prod.name}</h4>
                      <p className="font-code-sm text-outline text-[12px]">{prod.sku} • {prod.category}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <span className="font-code-sm font-bold text-primary block">₹{prod.price}</span>
                      <span className="text-[11px] text-tertiary font-medium">{prod.stock} in stock</span>
                    </div>
                    <Badge variant={prod.status === 'Active' ? 'success' : 'neutral'} size="sm">
                      {prod.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

