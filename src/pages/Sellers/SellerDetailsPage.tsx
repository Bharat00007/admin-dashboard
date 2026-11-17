import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { shopService, BackendShopRating } from '../../services/shopService';

export const SellerDetailsPage: React.FC = () => {
  const { 
    selectedSellerId, 
    sellers, 
    setActiveTab, 
    toggleSellerBan,
    updateShopDetails,
    products 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'REVIEWS'>('OVERVIEW');
  const [isLoadingFresh, setIsLoadingFresh] = useState(false);
  const [ratings, setRatings] = useState<BackendShopRating[]>([]);
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editShopName, setEditShopName] = useState('');
  const [editRadiusKm, setEditRadiusKm] = useState<number>(15);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const seller = sellers.find(s => s.id === selectedSellerId) || sellers[0];

  // Fetch fresh shop details directly from backend
  const fetchFreshShop = useCallback(async (id: string) => {
    setIsLoadingFresh(true);
    try {
      const res = await shopService.getShopById(id);
      if (res.success && res.data) {
        setEditShopName(res.data.shopName);
        setEditRadiusKm(res.data.customRadiusKm || 15);
      }
    } catch (err) {
      console.error('[SellerDetails] Failed to fetch shop details', err);
    } finally {
      setIsLoadingFresh(false);
    }
  }, []);

  // Fetch shop ratings directly from backend
  const fetchShopRatings = useCallback(async (id: string) => {
    setIsLoadingRatings(true);
    try {
      const res = await shopService.getShopRatings(id);
      if (res.success && res.data) {
        setRatings(res.data);
      }
    } catch (err) {
      console.error('[SellerDetails] Failed to fetch shop ratings', err);
    } finally {
      setIsLoadingRatings(false);
    }
  }, []);

  useEffect(() => {
    if (seller?.id) {
      fetchFreshShop(seller.id);
      fetchShopRatings(seller.id);
      setEditShopName(seller.shopName);
      setEditRadiusKm(seller.customRadiusKm || 15);
    }
  }, [seller?.id, fetchFreshShop, fetchShopRatings]);

  if (!seller) {
    return (
      <div className="p-8 text-center">
        <p>No seller selected.</p>
        <Button onClick={() => setActiveTab('sellers')} className="mt-4">Back to Sellers</Button>
      </div>
    );
  }

  const handleSaveShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editShopName.trim() || editRadiusKm < 1) return;

    setIsSavingEdit(true);
    try {
      const success = await updateShopDetails(seller.id, {
        shopName: editShopName.trim(),
        customRadiusKm: Number(editRadiusKm),
      });
      if (success) {
        setIsEditModalOpen(false);
        fetchFreshShop(seller.id);
      }
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <div className="max-w-full pb-12 space-y-6">
      {/* Top Back Action & Sync Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('sellers')}
            className="p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/30 text-on-surface flex items-center gap-1 text-body-sm font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Sellers</span>
          </button>
          <span className="text-outline-variant">•</span>
          <span className="font-label-sm text-on-surface-variant font-medium">
            Shop ID: <code className="font-mono">{seller.id}</code>
          </span>
        </div>
        {isLoadingFresh && (
          <span className="text-[12px] text-primary flex items-center gap-1 animate-pulse font-medium">
            <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
            Syncing live store data...
          </span>
        )}
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
          {seller.logoUrl ? (
            <img
              src={seller.logoUrl}
              alt={seller.shopName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-outline-variant/30 shadow-sm flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl shadow-sm border border-primary/20 flex-shrink-0">
              {seller.shopName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
              <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">{seller.shopName}</h1>
              <Badge variant={seller.status === 'Active' ? 'success' : 'error'}>
                {seller.status} Store
              </Badge>
              <Badge variant="primary">
                ⭐ {seller.rating > 0 ? `${seller.rating.toFixed(1)} Rating` : 'No ratings yet'} ({seller.totalOrders} reviews)
              </Badge>
              {seller.customRadiusKm && (
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-semibold">
                  {seller.customRadiusKm} km radius
                </span>
              )}
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-outline">location_on</span>
              <span>{seller.address}</span>
            </p>
            <div className="flex items-center gap-4 mt-2 text-[12px] text-outline font-medium">
              <span>Joined: {seller.joinedDate}</span>
              <span>•</span>
              <span>Hours: {seller.operatingHours || 'Not specified'}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <Button
            variant="secondary"
            icon="edit"
            onClick={() => {
              setEditShopName(seller.shopName);
              setEditRadiusKm(seller.customRadiusKm || 15);
              setIsEditModalOpen(true);
            }}
          >
            Edit Shop
          </Button>
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
            <span>{seller.status === 'Active' ? 'Suspend Store' : 'Reactivate'}</span>
          </button>
          <Button 
            variant="ghost" 
            icon="mail"
            onClick={() => {
              if (seller.email) {
                window.location.href = `mailto:${seller.email}?subject=GoTails%20Marketplace%20Platform%20Notice%20-%20${encodeURIComponent(seller.shopName)}`;
              }
            }}
          >
            Contact
          </Button>
        </div>
      </div>

      {/* Sub Tabs: Overview vs Ratings & Reviews */}
      <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('OVERVIEW')}
          className={`px-4 py-2 rounded-lg font-label-md text-label-md font-semibold transition-colors flex items-center gap-2 ${
            activeSubTab === 'OVERVIEW'
              ? 'bg-primary/10 text-primary'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">storefront</span>
          <span>Store Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('REVIEWS')}
          className={`px-4 py-2 rounded-lg font-label-md text-label-md font-semibold transition-colors flex items-center gap-2 ${
            activeSubTab === 'REVIEWS'
              ? 'bg-primary/10 text-primary'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">reviews</span>
          <span>Customer Ratings &amp; Reviews ({ratings.length})</span>
        </button>
      </div>

      {activeSubTab === 'OVERVIEW' ? (
        <>
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs">
              <span className="text-[12px] font-semibold text-outline uppercase tracking-wider block mb-1">Lifetime GMV</span>
              <div className="flex items-baseline justify-between">
                <span className="font-headline-lg font-bold text-on-surface">{seller.gmv || '—'}</span>
                <span className="text-on-surface-variant font-label-sm font-semibold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">storefront</span>
                  Store Level
                </span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs">
              <span className="text-[12px] font-semibold text-outline uppercase tracking-wider block mb-1">Orders Fulfilled</span>
              <div className="flex items-baseline justify-between">
                <span className="font-headline-lg font-bold text-on-surface">{seller.totalOrders}</span>
                <span className="text-outline text-body-sm font-medium">Recorded Volume</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs">
              <span className="text-[12px] font-semibold text-outline uppercase tracking-wider block mb-1">Fulfillment Radius</span>
              <div className="flex items-baseline justify-between">
                <span className="font-headline-lg font-bold text-primary">{seller.customRadiusKm || 15} km</span>
                <span className="text-on-surface-variant text-body-sm font-medium">Custom Setting</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs">
              <span className="text-[12px] font-semibold text-outline uppercase tracking-wider block mb-1">KYC Audit Status</span>
              <div className="flex items-baseline justify-between">
                <span className="font-headline-sm font-bold text-tertiary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                  {seller.kycStatus}
                </span>
                <span className="text-outline text-body-sm">Merchant Profile</span>
              </div>
            </div>
          </div>

          {/* Business & Bank Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Store Details & Compliance */}
            <div className="space-y-6 lg:col-span-1">
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
                    <span className="font-code-sm text-primary">{seller.email || '—'}</span>
                  </div>
                  <div>
                    <span className="text-outline text-[11px] block font-medium">Direct Phone Line</span>
                    <span className="font-code-sm text-on-surface">{seller.phone}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline-variant/20">
                    <div>
                      <span className="text-outline text-[11px] block font-medium">GSTIN</span>
                      <span className="font-code-sm font-bold text-on-surface">{seller.gstin || 'Not Provided'}</span>
                    </div>
                    <div>
                      <span className="text-outline text-[11px] block font-medium">PAN</span>
                      <span className="font-code-sm font-bold text-on-surface">{seller.pan || 'Not Provided'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settlement Account */}
              <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs">
                <h3 className="font-headline-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-[20px]">account_balance</span>
                  <span>Settlement Account</span>
                </h3>
                {seller.bankAccount ? (
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
                ) : (
                  <div className="p-4 bg-surface-container-low rounded-lg text-center text-on-surface-variant text-body-sm">
                    <span className="material-symbols-outlined text-[28px] text-outline mb-1">account_balance_wallet</span>
                    <p className="font-medium text-on-surface">No settlement account on file</p>
                    <p className="text-[11px] text-outline mt-0.5">Direct merchant payout banking details have not been submitted.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Catalog Products Listed */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-headline-sm font-bold text-on-surface">Store Catalog Offerings</h3>
                    <p className="font-body-sm text-on-surface-variant">Active SKUs currently listed in master catalog.</p>
                  </div>
                  <span className="font-code-sm text-body-sm px-2.5 py-1 rounded bg-surface-container text-on-surface font-semibold">
                    {products.length} Products
                  </span>
                </div>

                <div className="divide-y divide-outline-variant/10">
                  {products.slice(0, 5).map(prod => (
                    <div key={prod.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex items-center gap-3">
                        <img src={prod.imageUrl} alt={prod.name} className="w-12 h-12 rounded-lg object-cover border border-outline-variant/20" />
                        <div>
                          <h4 className="font-label-md font-semibold text-on-surface">{prod.name}</h4>
                          <p className="font-code-sm text-outline text-[12px]">{prod.sku} • {prod.category}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <span className="font-code-sm font-bold text-primary block">{prod.price ? `₹${prod.price}` : '—'}</span>
                          <span className="text-[11px] text-tertiary font-medium">Catalog SKU</span>
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
        </>
      ) : (
        /* Reviews Sub Tab */
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/20 pb-4">
            <div>
              <h3 className="font-headline-sm font-bold text-on-surface">Customer Reviews &amp; Ratings</h3>
              <p className="text-body-sm text-on-surface-variant mt-0.5">
                Authentic buyer feedback and satisfaction ratings recorded from completed orders.
              </p>
            </div>
            <Button
              variant="secondary"
              icon="refresh"
              onClick={() => fetchShopRatings(seller.id)}
              disabled={isLoadingRatings}
            >
              {isLoadingRatings ? 'Refreshing...' : 'Refresh Reviews'}
            </Button>
          </div>

          {/* Aggregate Rating Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface-container-low/60 p-4 rounded-xl border border-outline-variant/20">
            <div>
              <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                Overall Average Rating
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-3xl font-bold text-on-surface">
                  {seller.rating > 0 ? seller.rating.toFixed(1) : '0.0'}
                </span>
                <span className="text-base text-secondary font-semibold">
                  {seller.rating > 0 
                    ? `${'★'.repeat(Math.min(5, Math.max(1, Math.round(seller.rating))))}${'☆'.repeat(5 - Math.min(5, Math.max(1, Math.round(seller.rating))))}`
                    : '☆☆☆☆☆'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                Total Reviews Submitted
              </span>
              <p className="text-2xl font-bold text-on-surface mt-1">{ratings.length}</p>
              <p className="text-[11px] text-on-surface-variant">Verified buyer purchases</p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                Merchant Fulfillment Status
              </span>
              <p className="text-base font-semibold text-tertiary mt-1">Operational Storefront</p>
              <p className="text-[11px] text-on-surface-variant">Admin compliance record verified</p>
            </div>
          </div>

          {/* Reviews List */}
          {ratings.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[44px] text-outline mb-2">rate_review</span>
              <h4 className="font-semibold text-on-surface text-base">No Customer Reviews Yet</h4>
              <p className="text-body-sm text-on-surface-variant mt-1">
                This store has not yet received written ratings or comments from completed deliveries.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/10">
              {ratings.map((rev) => (
                <div key={rev._id} className="py-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-on-surface">
                        {rev.customerId?.name || 'Verified Buyer'}
                      </span>
                      <span className="text-secondary font-bold text-[13px]">
                        {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                      </span>
                    </div>
                    <span className="text-[11px] text-outline">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {rev.review && (
                    <p className="text-body-sm text-on-surface bg-surface-container-low/40 p-3 rounded-lg border border-outline-variant/20">
                      "{rev.review}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Shop Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Merchant Store Details"
          subtitle={`Configure official name and fulfillment radius for ${seller.shopName}`}
          maxWidth="md"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveShop}
                disabled={isSavingEdit || !editShopName.trim()}
              >
                {isSavingEdit ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </div>
          }
        >
          <form onSubmit={handleSaveShop} className="space-y-4 py-1">
            <div>
              <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">
                Store Business Name *
              </label>
              <input
                type="text"
                required
                value={editShopName}
                onChange={(e) => setEditShopName(e.target.value)}
                placeholder="e.g. Pet Care & Gourmet Supplies"
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-sm font-medium focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">
                Fulfillment Radius (km) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="500"
                  required
                  value={editRadiusKm}
                  onChange={(e) => setEditRadiusKm(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-sm font-medium focus:border-primary focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[12px] font-semibold">
                  km
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1">
                Maximum distance this store delivers to customer coordinates.
              </p>
            </div>

            <div className="p-3 bg-surface-container-low/60 rounded-xl border border-outline-variant/20 text-[11px] text-on-surface-variant space-y-1">
              <p className="font-semibold text-on-surface">Backend Validated Fields:</p>
              <p>Per production API contract on <code className="font-mono">PATCH /admin/shops/:id</code>, only shop name and delivery radius are administrative configurable parameters.</p>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
