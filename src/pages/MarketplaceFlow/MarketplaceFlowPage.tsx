import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const MarketplaceFlowPage: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="max-w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">Architecture</span>
            <span className="text-outline-variant text-[10px]">•</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Ecosystem Blueprint</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Gotails Marketplace Flow</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            End-to-end operational architecture connecting Master Catalog data, Merchant Onboarding, Storefront Fulfillment, and Pet Parent Commerce.
          </p>
        </div>

        <Badge variant="primary" size="md">
          Platform Architecture v2.4
        </Badge>
      </div>

      {/* 4 Interactive Flow Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Pillar 1: Master Catalog */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:border-primary/50 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[26px]">layers</span>
            </div>
            <h3 className="font-headline-sm font-bold text-on-surface mb-2">1. Master Catalog</h3>
            <p className="font-body-sm text-on-surface-variant leading-relaxed mb-4">
              The single source of truth for all pet SKUs. Enforces strict brand authenticity, verified barcodes, and standardized weights.
            </p>
            <ul className="space-y-2 text-[12px] text-on-surface font-medium border-t border-outline-variant/20 pt-3">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[16px]">check</span>
                <span>Global SKUs &amp; Pricing</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[16px]">check</span>
                <span>Category Taxonomies</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[16px]">check</span>
                <span>Authorized Brand Directory</span>
              </li>
            </ul>
          </div>

          <Button onClick={() => setActiveTab('products')} variant="secondary" size="sm" className="mt-5 w-full">
            Manage Catalog
          </Button>
        </div>

        {/* Pillar 2: Onboarding & KYC */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:border-primary/50 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-xl bg-secondary-container/20 text-secondary flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[26px]">verified</span>
            </div>
            <h3 className="font-headline-sm font-bold text-on-surface mb-2">2. Compliance &amp; KYC</h3>
            <p className="font-body-sm text-on-surface-variant leading-relaxed mb-4">
              Rigorous verification gate verifying GSTIN, PAN, drug licenses, and bank accounts before stores can go live.
            </p>
            <ul className="space-y-2 text-[12px] text-on-surface font-medium border-t border-outline-variant/20 pt-3">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[16px]">check</span>
                <span>Statutory GST &amp; PAN Check</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[16px]">check</span>
                <span>FSSAI / Vet Drug Licensing</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[16px]">check</span>
                <span>Bank Penny-Drop Test</span>
              </li>
            </ul>
          </div>

          <Button onClick={() => setActiveTab('approvals')} variant="secondary" size="sm" className="mt-5 w-full">
            Review Applications
          </Button>
        </div>

        {/* Pillar 3: Seller App & Storefronts */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:border-primary/50 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[26px]">storefront</span>
            </div>
            <h3 className="font-headline-sm font-bold text-on-surface mb-2">3. Seller Storefronts</h3>
            <p className="font-body-sm text-on-surface-variant leading-relaxed mb-4">
              Local pet store partners use the Gotails Seller App to adopt Master Catalog SKUs, update prices, and fulfill incoming orders.
            </p>
            <ul className="space-y-2 text-[12px] text-on-surface font-medium border-t border-outline-variant/20 pt-3">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[16px]">check</span>
                <span>Instant Order Notifications</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[16px]">check</span>
                <span>Shop Status Toggle (Open/Close)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[16px]">check</span>
                <span>Hyperlocal Dispatch in 20m</span>
              </li>
            </ul>
          </div>

          <Button onClick={() => setActiveTab('sellers')} variant="secondary" size="sm" className="mt-5 w-full">
            Inspect Merchants
          </Button>
        </div>

        {/* Pillar 4: Consumer App & Payments */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:border-primary/50 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[26px]">pets</span>
            </div>
            <h3 className="font-headline-sm font-bold text-on-surface mb-2">4. Pet Parents &amp; Orders</h3>
            <p className="font-body-sm text-on-surface-variant leading-relaxed mb-4">
              Consumers browse local inventory, receive 90-minute fast delivery, and enjoy pet breed personalized recommendations.
            </p>
            <ul className="space-y-2 text-[12px] text-on-surface font-medium border-t border-outline-variant/20 pt-3">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[16px]">check</span>
                <span>Real-Time Rider GPS Tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[16px]">check</span>
                <span>Automated Platform Settlement</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[16px]">check</span>
                <span>Customer Trust Guarantee</span>
              </li>
            </ul>
          </div>

          <Button onClick={() => setActiveTab('customers')} variant="secondary" size="sm" className="mt-5 w-full">
            Manage Customers
          </Button>
        </div>
      </div>
    </div>
  );
};

