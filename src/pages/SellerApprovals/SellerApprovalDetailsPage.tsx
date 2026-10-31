import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const SellerApprovalDetailsPage: React.FC = () => {
  const { 
    selectedApprovalId, 
    approvals, 
    setActiveTab, 
    approveSellerRequest, 
    rejectSellerRequest 
  } = useApp();

  const req = approvals.find(a => a.id === selectedApprovalId) || approvals[0];

  const [inspectDoc, setInspectDoc] = useState<string | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState('');

  if (!req) {
    return (
      <div className="p-8 text-center">
        <p>No application selected for review.</p>
        <Button onClick={() => setActiveTab('approvals')} className="mt-4">Back to Approvals</Button>
      </div>
    );
  }

  const handleApprove = () => {
    approveSellerRequest(req.id);
    setActiveTab('approvals');
  };

  const handleReject = () => {
    rejectSellerRequest(req.id, rejectRemarks);
    setRejectModalOpen(false);
    setActiveTab('approvals');
  };

  return (
    <div className="max-w-full pb-12">
      {/* Top Back Action */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setActiveTab('approvals')}
          className="p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/30 text-on-surface flex items-center gap-1 text-body-sm font-semibold transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Approvals Queue</span>
        </button>
        <span className="text-outline-variant">•</span>
        <span className="font-label-sm text-on-surface-variant font-medium">Application Ref: {req.id}</span>
      </div>

      {/* Main Review Card */}
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="font-headline-lg font-bold text-on-surface">{req.shopName}</h1>
            <Badge variant={
              req.status === 'Approved' ? 'success' :
              req.status === 'Rejected' ? 'error' : 'warning'
            }>
              {req.status}
            </Badge>
            <span className="px-2 py-0.5 rounded bg-surface-container text-body-sm font-medium">
              {req.businessType}
            </span>
          </div>
          <p className="font-body-md text-on-surface-variant">
            Submitted by <strong className="text-on-surface">{req.applicantName}</strong> • {req.email} • {req.phone}
          </p>
          <p className="font-body-sm text-outline mt-1">
            Store Location: {req.storeAddress}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {req.status !== 'Approved' && (
            <>
              <button
                onClick={() => setRejectModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-error/10 hover:bg-error/20 text-error border border-error/20 text-label-md font-semibold transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
                <span>Reject Application</span>
              </button>
              <Button onClick={handleApprove} variant="primary" icon="check_circle">
                Approve &amp; Onboard
              </Button>
            </>
          )}
          {req.status === 'Approved' && (
            <Badge variant="success" size="md">
              ✓ Merchant Application Fully Approved
            </Badge>
          )}
        </div>
      </div>

      {/* Audit Checklist & Verification Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Statutory Identifiers */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs">
          <h3 className="font-headline-sm font-bold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
            <span>Statutory Tax &amp; Identity Credentials</span>
          </h3>

          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
              <div>
                <span className="text-[11px] text-outline block font-medium">GST Identification Number</span>
                <span className="font-code-sm font-bold text-on-surface text-[14px]">{req.gstin}</span>
              </div>
              <Badge variant="success" size="sm">Valid GST Active</Badge>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
              <div>
                <span className="text-[11px] text-outline block font-medium">Permanent Account Number (PAN)</span>
                <span className="font-code-sm font-bold text-on-surface text-[14px]">{req.pan}</span>
              </div>
              <Badge variant="success" size="sm">Name Matched</Badge>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
              <div>
                <span className="text-[11px] text-outline block font-medium">Core Catalog Category</span>
                <span className="font-semibold text-on-surface text-[13px]">{req.catalogCategory}</span>
              </div>
              <Badge variant="neutral" size="sm">Standard Pet Care</Badge>
            </div>
          </div>
        </div>

        {/* Uploaded Documents Inspection */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-xs">
          <h3 className="font-headline-sm font-bold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-[20px]">description</span>
            <span>Document Audit &amp; Attachments</span>
          </h3>

          <div className="space-y-3">
            <div 
              onClick={() => setInspectDoc('GST Registration Certificate')}
              className="p-3 rounded-lg border border-outline-variant/20 hover:border-primary/40 cursor-pointer flex items-center justify-between bg-surface-container-lowest transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[22px]">picture_as_pdf</span>
                <div>
                  <span className="font-label-md font-semibold text-on-surface block">GST Registration Certificate</span>
                  <span className="text-[11px] text-outline">Verified digitally via GSTN API</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-[18px]">visibility</span>
            </div>

            <div 
              onClick={() => setInspectDoc('PAN Card Identification')}
              className="p-3 rounded-lg border border-outline-variant/20 hover:border-primary/40 cursor-pointer flex items-center justify-between bg-surface-container-lowest transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[22px]">badge</span>
                <div>
                  <span className="font-label-md font-semibold text-on-surface block">PAN Card Copy</span>
                  <span className="text-[11px] text-outline">Sole Proprietorship / Corporate PAN</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-[18px]">visibility</span>
            </div>

            <div 
              onClick={() => setInspectDoc('Cancelled Cheque / Bank Passbook')}
              className="p-3 rounded-lg border border-outline-variant/20 hover:border-primary/40 cursor-pointer flex items-center justify-between bg-surface-container-lowest transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[22px]">account_balance</span>
                <div>
                  <span className="font-label-md font-semibold text-on-surface block">Bank Account Verification</span>
                  <span className="text-[11px] text-outline">Penny drop test validated</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-[18px]">visibility</span>
            </div>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {inspectDoc && (
        <Modal
          isOpen={true}
          onClose={() => setInspectDoc(null)}
          title="Document Verification Viewer"
          subtitle={inspectDoc}
          maxWidth="lg"
          footer={
            <Button variant="secondary" onClick={() => setInspectDoc(null)}>
              Close Viewer
            </Button>
          }
        >
          <div className="p-8 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/40 text-center">
            <span className="material-symbols-outlined text-[64px] text-primary/40 mb-3 block">verified</span>
            <h4 className="font-headline-sm font-bold text-on-surface">{inspectDoc}</h4>
            <p className="font-code-sm text-outline text-body-sm mt-1">Verified against statutory register • All signatures and stamps authentic.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="secondary" size="sm" icon="download">
                Download PDF
              </Button>
              <Button variant="primary" size="sm" icon="verified">
                Mark as Confirmed
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Remarks Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Onboarding Application"
        subtitle={`Applicant will receive formal email notice explaining rejection`}
        maxWidth="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReject}>
              Confirm Rejection
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold">
            Rejection Reason / Required Rectification
          </label>
          <textarea
            rows={4}
            value={rejectRemarks}
            onChange={(e) => setRejectRemarks(e.target.value)}
            placeholder="e.g. GST Certificate address does not match submitted commercial lease deed. Please re-upload with clear premises proof..."
            className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-md font-body-md focus:border-error focus:outline-none"
          />
        </div>
      </Modal>
    </div>
  );
};

