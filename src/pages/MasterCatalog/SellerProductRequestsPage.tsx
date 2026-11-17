import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductRequest, ProductRequestStatus } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const SellerProductRequestsPage: React.FC = () => {
  const { 
    productRequests, 
    isLoadingProductRequests, 
    loadProductRequests, 
    approveProductRequest, 
    rejectProductRequest 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'ALL' | ProductRequestStatus>('ALL');
  const [search, setSearch] = useState('');
  
  // Modal states
  const [selectedRequest, setSelectedRequest] = useState<ProductRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadProductRequests();
  }, [loadProductRequests]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = productRequests.length;
    const pending = productRequests.filter(r => r.status === 'PENDING').length;
    const approved = productRequests.filter(r => r.status === 'APPROVED').length;
    const rejected = productRequests.filter(r => r.status === 'REJECTED').length;
    return { total, pending, approved, rejected };
  }, [productRequests]);

  // Filtered list
  const filteredRequests = useMemo(() => {
    return productRequests.filter(r => {
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesDesc = r.description?.toLowerCase().includes(q);
        const matchesShop = r.shopId?.shopName.toLowerCase().includes(q) || 
          Boolean(r.shopId?.phone?.toLowerCase().includes(q)) || 
          Boolean(r.sellerId?.mobile?.includes(q)) || 
          Boolean(r.shopId?.shopCode?.toLowerCase().includes(q));
        const matchesBrand = r.brandId?.name.toLowerCase().includes(q);
        const matchesCat = r.categoryId?.name.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesShop && !matchesBrand && !matchesCat) {
          return false;
        }
      }
      return true;
    });
  }, [productRequests, statusFilter, search]);

  const openDetails = (req: ProductRequest) => {
    setSelectedRequest(req);
    setRejectReason('');
    setIsRejecting(false);
    setIsDetailModalOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    const success = await approveProductRequest(selectedRequest.id);
    setIsProcessing(false);
    if (success) {
      setIsDetailModalOpen(false);
      setSelectedRequest(null);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    const success = await rejectProductRequest(selectedRequest.id, rejectReason);
    setIsProcessing(false);
    if (success) {
      setIsDetailModalOpen(false);
      setSelectedRequest(null);
      setIsRejecting(false);
    }
  };

  const renderStatusBadge = (status: ProductRequestStatus) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning" size="sm">Pending Review</Badge>;
      case 'APPROVED':
        return <Badge variant="success" size="sm">Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="error" size="sm">Rejected</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            Seller Product Requests
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Review, verify, and approve new catalog product listings submitted by registered sellers.
          </p>
        </div>
        <Button
          variant="secondary"
          icon="refresh"
          onClick={() => loadProductRequests()}
          disabled={isLoadingProductRequests}
        >
          {isLoadingProductRequests ? 'Syncing...' : 'Sync Requests'}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-xs">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
            Total Requests
          </span>
          <div className="text-2xl font-bold text-on-surface mt-2">{stats.total}</div>
          <p className="text-[12px] text-on-surface-variant mt-1">All submitted SKU requests</p>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
              Pending
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-secondary mt-2">{stats.pending}</div>
          <p className="text-[12px] text-on-surface-variant mt-1">Awaiting compliance check</p>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-xs">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
            Approved
          </span>
          <div className="text-2xl font-bold text-tertiary mt-2">{stats.approved}</div>
          <p className="text-[12px] text-tertiary font-medium mt-1">Published to master catalog</p>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-xs">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
            Rejected
          </span>
          <div className="text-2xl font-bold text-error mt-2">{stats.rejected}</div>
          <p className="text-[12px] text-error font-medium mt-1">Returned with remarks</p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-outline-variant/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="inline-flex rounded-lg bg-surface-container p-1 shrink-0">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-md text-label-sm font-semibold transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('PENDING')}
              className={`px-3 py-1.5 rounded-md text-label-sm font-semibold transition-all ${
                statusFilter === 'PENDING'
                  ? 'bg-surface-container-lowest text-secondary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('APPROVED')}
              className={`px-3 py-1.5 rounded-md text-label-sm font-semibold transition-all ${
                statusFilter === 'APPROVED'
                  ? 'bg-surface-container-lowest text-tertiary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Approved ({stats.approved})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('REJECTED')}
              className={`px-3 py-1.5 rounded-md text-label-sm font-semibold transition-all ${
                statusFilter === 'REJECTED'
                  ? 'bg-surface-container-lowest text-error shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product, seller, brand, category..."
              className="w-full pl-9 pr-8 py-1.5 rounded-lg border border-outline-variant/30 bg-surface-container-low text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/70 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-outline-variant/20 select-none">
                <th className="py-3.5 px-4 w-14">Image</th>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Seller &amp; Shop</th>
                <th className="py-3.5 px-4">Taxonomy</th>
                <th className="py-3.5 px-4">Unit Spec</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Submitted</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-body-sm font-body-sm">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-on-surface-variant">
                    <div className="flex flex-col items-center justify-center">
                      <span className="material-symbols-outlined text-[42px] text-outline mb-2">
                        inventory_2
                      </span>
                      <p className="font-semibold text-on-surface">No product requests found</p>
                      <p className="text-[12px] text-on-surface-variant mt-0.5">
                        {search || statusFilter !== 'ALL'
                          ? 'Try clearing your filters or search query.'
                          : 'There are currently no seller product requests submitted in the platform.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map(req => {
                  const thumb = req.images && req.images.length > 0 ? req.images[0] : null;
                  return (
                    <tr
                      key={req.id}
                      onClick={() => openDetails(req)}
                      className="hover:bg-surface-container-low/60 transition-colors cursor-pointer"
                    >
                      {/* Image Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-container-high border border-outline-variant/30 flex items-center justify-center shrink-0">
                          {thumb ? (
                            <img src={thumb} alt={req.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-[20px] text-outline">image</span>
                          )}
                        </div>
                      </td>

                      {/* Product Name */}
                      <td className="py-3 px-4 min-w-[200px]">
                        <p className="font-medium text-on-surface line-clamp-1">{req.name}</p>
                        <p className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">{req.description}</p>
                      </td>

                      {/* Seller & Shop */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <p className="font-semibold text-on-surface">{req.shopId?.shopName || 'Marketplace Store'}</p>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">{req.shopId?.phone || req.sellerId?.mobile || '—'}</p>
                      </td>

                      {/* Taxonomy */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <p className="text-on-surface">{req.categoryId?.name || 'General'}</p>
                        <p className="text-[11px] text-on-surface-variant">{req.brandId?.name || 'Partner Brand'}</p>
                      </td>

                      {/* Unit Spec */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono text-[12px] font-semibold text-on-surface">
                          {req.unitValue} {req.unitId?.code || 'unit'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {renderStatusBadge(req.status)}
                      </td>

                      {/* Submission Date */}
                      <td className="py-3 px-4 whitespace-nowrap text-[12px] text-on-surface-variant">
                        {req.createdAt}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon="visibility"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetails(req);
                          }}
                        >
                          Review
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Details & Action Modal */}
      {selectedRequest && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title="Product Request Inspection"
          subtitle={`Submitted by ${selectedRequest.shopId?.shopName || 'Seller'} on ${selectedRequest.createdAt}`}
          maxWidth="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <div>
                {renderStatusBadge(selectedRequest.status)}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)}>
                  Close
                </Button>
                {selectedRequest.status === 'PENDING' && !isRejecting && (
                  <>
                    <Button
                      variant="danger"
                      icon="close"
                      onClick={() => setIsRejecting(true)}
                      disabled={isProcessing}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="primary"
                      icon="check_circle"
                      onClick={handleApprove}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Approving...' : 'Approve & Publish'}
                    </Button>
                  </>
                )}
                {isRejecting && (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => setIsRejecting(false)}
                      disabled={isProcessing}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      icon="block"
                      onClick={handleReject}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          }
        >
          <div className="space-y-4 py-1">
            {/* Image Gallery */}
            {selectedRequest.images && selectedRequest.images.length > 0 ? (
              <div>
                <span className="font-label-sm text-label-sm font-semibold uppercase text-on-surface-variant tracking-wider block mb-2">
                  Product Images ({selectedRequest.images.length})
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {selectedRequest.images.map((img, idx) => (
                    <div key={idx} className="h-24 rounded-lg overflow-hidden bg-surface-container-high border border-outline-variant/30 p-1 flex items-center justify-center">
                      <img src={img} alt={`Asset ${idx + 1}`} className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-surface-container-low text-center text-on-surface-variant text-[13px]">
                No product images attached with this submission.
              </div>
            )}

            {/* Product Meta Grid */}
            <div className="grid grid-cols-2 gap-3 text-body-sm bg-surface-container-low/60 p-3.5 rounded-xl border border-outline-variant/20">
              <div>
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase block">Product Name</span>
                <p className="font-semibold text-on-surface mt-0.5">{selectedRequest.name}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase block">Category &amp; Brand</span>
                <p className="font-medium text-on-surface mt-0.5">
                  {selectedRequest.categoryId?.name || 'General'} · {selectedRequest.brandId?.name || 'Partner'}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase block">Unit Measurement</span>
                <p className="font-medium text-on-surface mt-0.5">
                  {selectedRequest.unitValue} {selectedRequest.unitId?.name || selectedRequest.unitId?.code || 'Units'}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase block">Merchant Outlet</span>
                <p className="font-medium text-on-surface mt-0.5">
                  {selectedRequest.shopId?.shopName || 'Registered Shop'} ({selectedRequest.shopId?.phone || selectedRequest.sellerId?.mobile || selectedRequest.shopId?.shopCode || '—'})
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <span className="font-label-sm text-label-sm font-semibold uppercase text-on-surface-variant tracking-wider block mb-1">
                Product Description
              </span>
              <p className="text-body-sm text-on-surface bg-surface-container-low/40 p-3 rounded-lg border border-outline-variant/20 whitespace-pre-wrap">
                {selectedRequest.description || 'No description provided by the seller.'}
              </p>
            </div>

            {/* Existing Audit remarks if any */}
            {(selectedRequest.adminNotes || selectedRequest.reviewedBy) && (
              <div className="bg-surface-container-high/60 rounded-xl p-3 border border-outline-variant/20 text-[12px]">
                <p className="font-semibold text-on-surface">Administrative Review Notes</p>
                <p className="text-on-surface-variant mt-1">{selectedRequest.adminNotes || 'No remark text.'}</p>
                {selectedRequest.reviewedAt && (
                  <p className="text-[11px] text-outline mt-1">Reviewed at {selectedRequest.reviewedAt}</p>
                )}
              </div>
            )}

            {/* Rejection Form Input */}
            {isRejecting && (
              <div className="bg-error/5 border border-error/20 rounded-xl p-3.5 space-y-2 animate-fade-in">
                <label className="block text-[12px] font-semibold text-error">
                  Rejection Reason / Compliance Feedback (Optional)
                </label>
                <textarea
                  rows={2}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Specify why this SKU proposal is rejected (e.g. Incomplete packaging details, barcode mismatch)..."
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-lowest text-body-sm text-on-surface focus:outline-none focus:border-error resize-none"
                />
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
