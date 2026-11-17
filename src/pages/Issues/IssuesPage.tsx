import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Issue, IssueStatus } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const IssuesPage: React.FC = () => {
  const { issues, isLoadingIssues, loadIssues, updateIssueStatus, activeTab } = useApp();

  // Filters
  const initialSource = activeTab === 'customer-issues' ? 'CUSTOMER' : activeTab === 'seller-issues' ? 'SELLER' : 'ALL';
  const [sourceTab, setSourceTab] = useState<'ALL' | 'CUSTOMER' | 'SELLER'>(initialSource);
  const [statusFilter, setStatusFilter] = useState<'ALL' | IssueStatus>('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (activeTab === 'customer-issues') setSourceTab('CUSTOMER');
    else if (activeTab === 'seller-issues') setSourceTab('SELLER');
  }, [activeTab]);

  // Selected Issue & Modal
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<IssueStatus>('OPEN');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Compute KPI counts
  const kpis = useMemo(() => {
    const total = issues.length;
    const open = issues.filter(i => i.status === 'OPEN').length;
    const underReview = issues.filter(i => i.status === 'UNDER_REVIEW').length;
    const resolved = issues.filter(i => i.status === 'RESOLVED').length;
    const closed = issues.filter(i => i.status === 'CLOSED_NO_ACTION').length;
    const customerCount = issues.filter(i => i.reporterType === 'CUSTOMER').length;
    const sellerCount = issues.filter(i => i.reporterType === 'SELLER').length;
    return { total, open, underReview, resolved, closed, customerCount, sellerCount };
  }, [issues]);

  // Filtered Issues list
  const filteredIssues = useMemo(() => {
    return issues.filter(item => {
      // Source filter
      if (sourceTab !== 'ALL' && item.reporterType !== sourceTab) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }
      // Search term
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesId = item.id.toLowerCase().includes(q);
        const matchesProblem = item.problemType?.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        const matchesOrder = item.orderId?.orderNumber?.toLowerCase().includes(q);
        const matchesCustomer = item.customerId?.name?.toLowerCase().includes(q) || item.customerId?.mobile?.includes(q);
        const matchesShop = item.shopId?.shopName?.toLowerCase().includes(q) || item.shopId?.phone?.includes(q);
        const matchesNotes = item.adminNotes?.toLowerCase().includes(q);

        if (!matchesId && !matchesProblem && !matchesDesc && !matchesOrder && !matchesCustomer && !matchesShop && !matchesNotes) {
          return false;
        }
      }
      return true;
    });
  }, [issues, sourceTab, statusFilter, search]);

  const openDetails = (issue: Issue) => {
    setSelectedIssue(issue);
    setNewStatus(issue.status);
    setAdminNotes(issue.adminNotes || '');
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedIssue) return;
    setIsUpdating(true);
    const success = await updateIssueStatus(selectedIssue.id, newStatus, adminNotes);
    setIsUpdating(false);
    if (success) {
      setSelectedIssue(prev => prev ? { ...prev, status: newStatus, adminNotes } : null);
    }
  };

  const renderStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case 'OPEN':
        return <Badge variant="error" size="sm">Open</Badge>;
      case 'UNDER_REVIEW':
        return <Badge variant="warning" size="sm">Under Review</Badge>;
      case 'RESOLVED':
        return <Badge variant="success" size="sm">Resolved</Badge>;
      case 'CLOSED_NO_ACTION':
        return <Badge variant="neutral" size="sm">Closed (No Action)</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            Customer &amp; Seller Support Issues
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Centralized dispute resolution, ticket tracking, and merchant-customer inquiries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon="refresh"
            onClick={loadIssues}
            disabled={isLoadingIssues}
          >
            {isLoadingIssues ? 'Syncing...' : 'Sync Issues'}
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
              Open Tickets
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-on-surface mt-2">{kpis.open}</div>
          <p className="text-[12px] text-error font-medium mt-1">Requires immediate attention</p>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
              Under Review
            </span>
            <span className="material-symbols-outlined text-[18px] text-secondary">pending_actions</span>
          </div>
          <div className="text-2xl font-bold text-on-surface mt-2">{kpis.underReview}</div>
          <p className="text-[12px] text-on-surface-variant mt-1">Investigation in progress</p>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
              Resolved
            </span>
            <span className="material-symbols-outlined text-[18px] text-tertiary">task_alt</span>
          </div>
          <div className="text-2xl font-bold text-on-surface mt-2">{kpis.resolved}</div>
          <p className="text-[12px] text-tertiary font-medium mt-1">Successfully settled</p>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
              Total Issues
            </span>
            <span className="material-symbols-outlined text-[18px] text-primary">analytics</span>
          </div>
          <div className="text-2xl font-bold text-on-surface mt-2">{kpis.total}</div>
          <p className="text-[12px] text-on-surface-variant mt-1">
            {kpis.customerCount} Buyer · {kpis.sellerCount} Seller
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs overflow-hidden">
        {/* Source Navigation Tabs & Filter Bar */}
        <div className="p-4 border-b border-outline-variant/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Source Tabs */}
          <div className="inline-flex rounded-lg bg-surface-container p-1 shrink-0">
            <button
              type="button"
              onClick={() => setSourceTab('ALL')}
              className={`px-3 py-1.5 rounded-md text-label-sm font-semibold transition-all ${
                sourceTab === 'ALL'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All Issues ({issues.length})
            </button>
            <button
              type="button"
              onClick={() => setSourceTab('CUSTOMER')}
              className={`px-3 py-1.5 rounded-md text-label-sm font-semibold transition-all flex items-center gap-1.5 ${
                sourceTab === 'CUSTOMER'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">person</span>
              Customer Issues ({kpis.customerCount})
            </button>
            <button
              type="button"
              onClick={() => setSourceTab('SELLER')}
              className={`px-3 py-1.5 rounded-md text-label-sm font-semibold transition-all flex items-center gap-1.5 ${
                sourceTab === 'SELLER'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">storefront</span>
              Seller Issues ({kpis.sellerCount})
            </button>
          </div>

          {/* Search & Status Filter */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 flex-1 max-w-xl justify-end">
            <div className="relative flex-1 min-w-[180px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID, order, name, details..."
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

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'ALL' | IssueStatus)}
              className="px-3 py-1.5 rounded-lg border border-outline-variant/30 bg-surface-container-low text-label-sm text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED_NO_ACTION">Closed (No Action)</option>
            </select>
          </div>
        </div>

        {/* Issues Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/70 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-outline-variant/20 select-none">
                <th className="py-3.5 px-4">Ticket</th>
                <th className="py-3.5 px-4">Reporter &amp; Source</th>
                <th className="py-3.5 px-4">Problem Category</th>
                <th className="py-3.5 px-4">Associated Order</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Reported</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-body-sm font-body-sm">
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                    <div className="flex flex-col items-center justify-center">
                      <span className="material-symbols-outlined text-[40px] text-outline mb-2">
                        inbox
                      </span>
                      <p className="font-semibold text-on-surface">No support issues found</p>
                      <p className="text-[12px] text-on-surface-variant mt-0.5">
                        {search || statusFilter !== 'ALL' || sourceTab !== 'ALL'
                          ? 'Try adjusting your filters or search keywords.'
                          : 'There are currently no tickets submitted in the system.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => {
                  const isSeller = issue.reporterType === 'SELLER';
                  return (
                    <tr 
                      key={issue.id}
                      className="hover:bg-surface-container-low/60 transition-colors cursor-pointer"
                      onClick={() => openDetails(issue)}
                    >
                      {/* Ticket Reference */}
                      <td className="py-3 px-4 font-mono text-[12px] font-semibold text-primary whitespace-nowrap">
                        #{issue.id.slice(-6).toUpperCase()}
                      </td>

                      {/* Reporter Info */}
                      <td className="py-3 px-4 min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isSeller 
                              ? 'bg-secondary-container/20 text-secondary' 
                              : 'bg-primary/10 text-primary'
                          }`}>
                            {isSeller ? 'Seller' : 'Customer'}
                          </span>
                          <span className="font-medium text-on-surface truncate max-w-[150px]">
                            {isSeller
                              ? (issue.shopId?.shopName || 'Merchant')
                              : (issue.customerId?.name || 'Customer')}
                          </span>
                        </div>
                        <div className="text-[11px] text-on-surface-variant mt-0.5 truncate">
                          {isSeller
                            ? (issue.shopId?.phone || 'No phone')
                            : (issue.customerId?.mobile || 'No mobile')}
                        </div>
                      </td>

                      {/* Problem Category & Snippet */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-on-surface truncate">
                          {issue.problemType || 'General Inquiry'}
                        </div>
                        <div className="text-[12px] text-on-surface-variant truncate mt-0.5">
                          {issue.description}
                        </div>
                      </td>

                      {/* Associated Order */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {issue.orderId ? (
                          <div>
                            <span className="font-mono text-[12px] font-semibold text-on-surface">
                              #{issue.orderId.orderNumber}
                            </span>
                            <div className="text-[11px] text-on-surface-variant mt-0.5">
                              ₹{issue.orderId.totalAmount.toLocaleString()} · {issue.orderId.status}
                            </div>
                          </div>
                        ) : (
                          <span className="text-outline text-[12px]">None</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {renderStatusBadge(issue.status)}
                      </td>

                      {/* Reported Date */}
                      <td className="py-3 px-4 whitespace-nowrap text-[12px] text-on-surface-variant">
                        {issue.createdAt}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon="visibility"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetails(issue);
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

      {/* Review / Details Modal */}
      {selectedIssue && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Ticket #${selectedIssue.id.slice(-6).toUpperCase()}`}
          subtitle={`Reported on ${selectedIssue.createdAt} · ${selectedIssue.reporterType} Issue`}
          maxWidth="2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="text-[12px] text-on-surface-variant">
                Status: {renderStatusBadge(selectedIssue.status)}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  icon="check"
                  onClick={handleUpdate}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save Status & Notes'}
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-5 py-1">
            {/* Context Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Reporter Information Card */}
              <div className="bg-surface-container-low/60 rounded-xl p-3.5 border border-outline-variant/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label-sm text-label-sm font-semibold uppercase text-on-surface-variant tracking-wider">
                    {selectedIssue.reporterType === 'SELLER' ? 'Merchant Details' : 'Customer Details'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                    selectedIssue.reporterType === 'SELLER' 
                      ? 'bg-secondary-container/20 text-secondary' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {selectedIssue.reporterType}
                  </span>
                </div>

                {selectedIssue.reporterType === 'SELLER' ? (
                  <div className="space-y-1 text-body-sm">
                    <p className="font-semibold text-on-surface">
                      {selectedIssue.shopId?.shopName || 'Registered Merchant'}
                    </p>
                    <p className="text-on-surface-variant">
                      Phone: <span className="text-on-surface font-medium">{selectedIssue.shopId?.phone || '—'}</span>
                    </p>
                    <p className="font-mono text-[11px] text-outline">
                      Shop ID: {selectedIssue.shopId?.id || '—'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1 text-body-sm">
                    <p className="font-semibold text-on-surface">
                      {selectedIssue.customerId?.name || 'Customer Account'}
                    </p>
                    <p className="text-on-surface-variant">
                      Mobile: <span className="text-on-surface font-medium">{selectedIssue.customerId?.mobile || '—'}</span>
                    </p>
                    {selectedIssue.customerId?.email && (
                      <p className="text-on-surface-variant">
                        Email: <span className="text-on-surface font-medium">{selectedIssue.customerId.email}</span>
                      </p>
                    )}
                    <p className="font-mono text-[11px] text-outline">
                      Customer ID: {selectedIssue.customerId?.id || '—'}
                    </p>
                  </div>
                )}
              </div>

              {/* Order Information Card */}
              <div className="bg-surface-container-low/60 rounded-xl p-3.5 border border-outline-variant/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label-sm text-label-sm font-semibold uppercase text-on-surface-variant tracking-wider">
                    Associated Order
                  </span>
                  {selectedIssue.orderId && (
                    <span className="font-mono text-[11px] font-semibold text-primary">
                      #{selectedIssue.orderId.orderNumber}
                    </span>
                  )}
                </div>

                {selectedIssue.orderId ? (
                  <div className="space-y-1 text-body-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant">Total Value:</span>
                      <span className="font-semibold text-on-surface">
                        ₹{selectedIssue.orderId.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant">Order Status:</span>
                      <span className="font-semibold text-on-surface">{selectedIssue.orderId.status}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant">Order Date:</span>
                      <span className="text-on-surface">{selectedIssue.orderId.createdAt}</span>
                    </div>
                    {selectedIssue.orderStatusAtReport && (
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant">Status At Report:</span>
                        <span className="font-medium text-secondary">{selectedIssue.orderStatusAtReport}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-20 text-on-surface-variant text-[12px]">
                    <span className="material-symbols-outlined text-[20px] text-outline mb-1">receipt_long</span>
                    No order directly associated with this issue
                  </div>
                )}
              </div>
            </div>

            {/* Issue Description Container */}
            <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-label-sm text-label-sm font-bold text-on-surface uppercase tracking-wider">
                  Subject: {selectedIssue.problemType || 'General Dispute'}
                </span>
                <span className="text-[11px] text-outline">
                  Created {selectedIssue.createdAt}
                </span>
              </div>
              <p className="text-body-md text-on-surface whitespace-pre-wrap bg-surface-container-low/40 p-3 rounded-lg border border-outline-variant/20">
                {selectedIssue.description}
              </p>
            </div>

            {/* Admin Audit Trail */}
            {(selectedIssue.reviewedBy || selectedIssue.reviewedAt) && (
              <div className="bg-tertiary/5 border border-tertiary/20 rounded-xl p-3 flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">verified_user</span>
                  <span className="text-on-surface font-medium">
                    Reviewed by {selectedIssue.reviewedBy?.name || 'Administrator'}
                  </span>
                </div>
                {selectedIssue.reviewedAt && (
                  <span className="text-on-surface-variant">{selectedIssue.reviewedAt}</span>
                )}
              </div>
            )}

            {/* Resolution Controls Form */}
            <div className="bg-surface-container-low/80 rounded-xl p-4 border border-outline-variant/30 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md font-bold text-on-surface">
                  Admin Resolution &amp; Actions
                </label>
                <span className="text-[11px] text-on-surface-variant">
                  Changes sync directly to production
                </span>
              </div>

              {/* Status Selector & Quick Buttons */}
              <div>
                <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">
                  Ticket Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStatus('OPEN')}
                    className={`py-2 px-3 rounded-lg text-label-sm font-semibold border text-center transition-all ${
                      newStatus === 'OPEN'
                        ? 'border-error bg-error/10 text-error ring-2 ring-error/20'
                        : 'border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant hover:border-outline'
                    }`}
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus('UNDER_REVIEW')}
                    className={`py-2 px-3 rounded-lg text-label-sm font-semibold border text-center transition-all ${
                      newStatus === 'UNDER_REVIEW'
                        ? 'border-secondary bg-secondary/10 text-secondary ring-2 ring-secondary/20'
                        : 'border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant hover:border-outline'
                    }`}
                  >
                    Under Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus('RESOLVED')}
                    className={`py-2 px-3 rounded-lg text-label-sm font-semibold border text-center transition-all ${
                      newStatus === 'RESOLVED'
                        ? 'border-tertiary bg-tertiary/10 text-tertiary ring-2 ring-tertiary/20'
                        : 'border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant hover:border-outline'
                    }`}
                  >
                    Resolved
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus('CLOSED_NO_ACTION')}
                    className={`py-2 px-3 rounded-lg text-label-sm font-semibold border text-center transition-all ${
                      newStatus === 'CLOSED_NO_ACTION'
                        ? 'border-outline bg-surface-container-high text-on-surface ring-2 ring-outline/20'
                        : 'border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant hover:border-outline'
                    }`}
                  >
                    Closed (No Action)
                  </button>
                </div>
              </div>

              {/* Admin Notes / Remarks Textarea */}
              <div>
                <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">
                  Admin Resolution Notes / Findings
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record customer support decision, refund ID, investigation results, or communication with seller..."
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-primary resize-none placeholder:text-outline"
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
