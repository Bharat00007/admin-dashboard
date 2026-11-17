import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditLog } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs, isLoadingAuditLogs, loadAuditLogs } = useApp();

  const [targetTypeFilter, setTargetTypeFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadAuditLogs();
  }, [loadAuditLogs]);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      if (targetTypeFilter !== 'ALL' && log.targetType !== targetTypeFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesAction = log.action.toLowerCase().includes(q);
        const matchesTargetId = log.targetId.toLowerCase().includes(q);
        const matchesActor = log.actorId?.name?.toLowerCase().includes(q) || log.actorId?.email?.toLowerCase().includes(q);
        if (!matchesAction && !matchesTargetId && !matchesActor) return false;
      }
      return true;
    });
  }, [auditLogs, targetTypeFilter, search]);

  const openInspection = (log: AuditLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const renderActionBadge = (action: string) => {
    if (action.includes('APPROVE') || action.includes('CREATE')) {
      return <Badge variant="success" size="sm">{action}</Badge>;
    }
    if (action.includes('SUSPEND') || action.includes('REJECT') || action.includes('DELETE')) {
      return <Badge variant="error" size="sm">{action}</Badge>;
    }
    if (action.includes('UPDATE') || action.includes('EDIT')) {
      return <Badge variant="primary" size="sm">{action}</Badge>;
    }
    return <Badge variant="neutral" size="sm">{action}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            Administrator Audit Logs
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Immutable system audit trail recording sensitive administrative decisions, onboarding reviews, and status changes.
          </p>
        </div>
        <Button
          variant="secondary"
          icon="refresh"
          onClick={() => loadAuditLogs()}
          disabled={isLoadingAuditLogs}
        >
          {isLoadingAuditLogs ? 'Syncing...' : 'Sync Logs'}
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by action, administrator, target ID..."
            className="w-full pl-9 pr-8 py-1.5 rounded-lg border border-outline-variant/30 bg-surface-container-low text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
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

        {/* Target Type Filter */}
        <div className="flex items-center gap-2">
          <span className="text-label-sm font-semibold text-on-surface-variant">Entity:</span>
          <select
            value={targetTypeFilter}
            onChange={(e) => setTargetTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-outline-variant/30 bg-surface-container-low text-label-sm text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="ALL">All Entities ({auditLogs.length})</option>
            <option value="SHOP">Shop (SHOP)</option>
            <option value="USER">User (USER)</option>
            <option value="PRODUCT">Product (PRODUCT)</option>
            <option value="SETTINGS">Settings (SETTINGS)</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/70 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-outline-variant/20 select-none">
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Target Entity</th>
                <th className="py-3.5 px-4">Actor / Administrator</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">Logged At</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-body-sm font-body-sm">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-on-surface-variant">
                    <div className="flex flex-col items-center justify-center">
                      <span className="material-symbols-outlined text-[42px] text-outline mb-2">
                        history_toggle_drop_down
                      </span>
                      <p className="font-semibold text-on-surface">No audit records found</p>
                      <p className="text-[12px] text-on-surface-variant mt-0.5">
                        {search || targetTypeFilter !== 'ALL'
                          ? 'Try adjusting your filters or search keywords.'
                          : 'No administrative actions have been captured in the production log yet.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => openInspection(log)}
                    className="hover:bg-surface-container-low/60 transition-colors cursor-pointer"
                  >
                    {/* Action */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {renderActionBadge(log.action)}
                    </td>

                    {/* Target */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-surface-container-high text-on-surface">
                        {log.targetType}
                      </span>
                      <span className="font-mono text-[11px] text-on-surface-variant ml-2">
                        #{log.targetId.slice(-8)}
                      </span>
                    </td>

                    {/* Actor */}
                    <td className="py-3 px-4 min-w-[180px]">
                      <p className="font-semibold text-on-surface">
                        {log.actorId?.name || 'System Admin'}
                      </p>
                      <p className="text-[11px] text-on-surface-variant">
                        {log.actorId?.email || 'admin@gotails.com'}
                      </p>
                    </td>

                    {/* IP Address */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-on-surface-variant">
                      {log.ipAddress || '127.0.0.1'}
                    </td>

                    {/* Timestamp */}
                    <td className="py-3 px-4 whitespace-nowrap text-[12px] text-on-surface-variant">
                      {log.createdAt}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon="data_object"
                        onClick={(e) => {
                          e.stopPropagation();
                          openInspection(log);
                        }}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Changes Inspection Modal */}
      {selectedLog && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Audit Record: ${selectedLog.action}`}
          subtitle={`Executed on ${selectedLog.createdAt} by ${selectedLog.actorId?.name || selectedLog.actorRole}`}
          maxWidth="lg"
          footer={
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          }
        >
          <div className="space-y-4 py-1 text-body-sm">
            {/* Meta Summary */}
            <div className="grid grid-cols-2 gap-3 bg-surface-container-low/60 p-3.5 rounded-xl border border-outline-variant/20 text-[12px]">
              <div>
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase block">Target Entity</span>
                <p className="font-mono font-semibold text-on-surface mt-0.5">
                  {selectedLog.targetType}: {selectedLog.targetId}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase block">Originating IP</span>
                <p className="font-mono text-on-surface mt-0.5">
                  {selectedLog.ipAddress || 'Internal Gateway'}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase block">Authorized Actor</span>
                <p className="text-on-surface mt-0.5">
                  {selectedLog.actorId?.name} ({selectedLog.actorId?.email})
                </p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase block">Actor Role</span>
                <p className="font-semibold text-primary mt-0.5">
                  {selectedLog.actorRole}
                </p>
              </div>
            </div>

            {/* Changes Inspection Diff */}
            <div>
              <span className="font-label-sm text-label-sm font-semibold uppercase text-on-surface-variant tracking-wider block mb-1">
                State Changes &amp; Transition
              </span>
              {selectedLog.changes ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Before */}
                  <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30 space-y-1">
                    <span className="text-[11px] font-bold text-error uppercase tracking-wider block">
                      Previous State (Before)
                    </span>
                    <pre className="font-mono text-[11px] text-on-surface-variant bg-surface-container-low p-2 rounded overflow-x-auto max-h-48">
                      {JSON.stringify(selectedLog.changes.before || {}, null, 2)}
                    </pre>
                  </div>

                  {/* After */}
                  <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30 space-y-1">
                    <span className="text-[11px] font-bold text-tertiary uppercase tracking-wider block">
                      Resulting State (After)
                    </span>
                    <pre className="font-mono text-[11px] text-on-surface-variant bg-surface-container-low p-2 rounded overflow-x-auto max-h-48">
                      {JSON.stringify(selectedLog.changes.after || {}, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-surface-container-low text-center text-on-surface-variant text-[12px]">
                  No structured state change payload captured for this administrative event.
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
