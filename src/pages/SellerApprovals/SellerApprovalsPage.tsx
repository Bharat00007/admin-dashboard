import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SellerApprovalRequest } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const SellerApprovalsPage: React.FC = () => {
  const { 
    approvals, 
    approveSellerRequest, 
    setSelectedApprovalId, 
    setActiveTab 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('');

  const filteredApprovals = approvals.filter(a => 
    statusFilter ? a.status === statusFilter : true
  );

  const handleReview = (req: SellerApprovalRequest) => {
    setSelectedApprovalId(req.id);
    setActiveTab('approval-details');
  };

  const pendingCount = approvals.filter(a => a.status === 'Pending' || a.status === 'Under Review').length;

  return (
    <div className="max-w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">Compliance &amp; Onboarding</span>
            <span className="text-outline-variant text-[10px]">•</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Merchant Applications</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Seller Approvals</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Audit business credentials, verify statutory tax records, inspect drug licenses, and approve new store applications.
          </p>
        </div>

        {/* Quick Pending Alert Pill */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary-container/20 text-secondary border border-secondary-container/30">
          <span className="material-symbols-outlined text-[20px]">pending_actions</span>
          <span className="font-label-md font-bold">{pendingCount} Applications Awaiting Decision</span>
        </div>
      </div>

      {/* Toolbar Filter */}
      <div className="bg-surface-container-lowest rounded-xl p-4 mb-6 shadow-sm border border-outline-variant/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-body-sm font-semibold text-on-surface">Filter Pipeline:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-surface-container-low text-label-md font-label-md text-on-surface border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Applications ({approvals.length})</option>
            <option value="Pending">Pending Audit</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <span className="text-body-sm text-on-surface-variant font-medium">
          Showing {filteredApprovals.length} applications
        </span>
      </div>

      {/* Approvals Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider select-none border-b border-outline-variant/20">
                <th className="py-3.5 px-6">Proposed Shop Name</th>
                <th className="py-3.5 px-4">Applicant &amp; Phone</th>
                <th className="py-3.5 px-4">Entity Type</th>
                <th className="py-3.5 px-4">City / Region</th>
                <th className="py-3.5 px-4 text-center">Submitted Docs</th>
                <th className="py-3.5 px-4">Applied</th>
                <th className="py-3.5 px-4 text-center">Review Status</th>
                <th className="py-3.5 px-6 text-right">Decision Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-body-md font-body-md text-on-surface">
              {filteredApprovals.map(req => (
                <tr key={req.id} className="hover:bg-surface-container-low/60 transition-colors group">
                  <td className="py-3.5 px-6 font-bold text-on-surface">
                    <span 
                      onClick={() => handleReview(req)}
                      className="hover:text-primary cursor-pointer transition-colors block"
                    >
                      {req.shopName}
                    </span>
                    <span className="font-code-sm text-outline text-[11px] block">{req.gstin}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-on-surface">{req.applicantName}</span>
                      <span className="font-code-sm text-on-surface-variant text-[12px]">{req.phone}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container text-on-surface text-[12px] font-medium">
                      {req.businessType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-medium">
                    {req.city}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-tertiary" title="GST Verified">verified</span>
                      <span className="material-symbols-outlined text-[16px] text-tertiary" title="PAN Verified">id_card</span>
                      <span className={`material-symbols-outlined text-[16px] ${req.documents.fssaiDrugLicense ? 'text-tertiary' : 'text-outline'}`} title="Drug License">
                        medical_services
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[12px] text-outline font-medium">
                    {req.appliedDate}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge variant={
                      req.status === 'Approved' ? 'success' :
                      req.status === 'Rejected' ? 'error' :
                      req.status === 'Under Review' ? 'warning' : 'neutral'
                    }>
                      {req.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Button
                        onClick={() => handleReview(req)}
                        variant="secondary"
                        size="sm"
                        icon="visibility"
                      >
                        Inspect
                      </Button>
                      {req.status !== 'Approved' && (
                        <Button
                          onClick={() => approveSellerRequest(req.id)}
                          variant="primary"
                          size="sm"
                          icon="check"
                        >
                          Approve
                        </Button>
                      )}
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

