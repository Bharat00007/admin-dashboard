import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const CustomersPage: React.FC = () => {
  const { customers, toggleCustomerBan } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [banConfirmOpen, setBanConfirmOpen] = useState(false);

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.email.toLowerCase().includes(search.toLowerCase()) ||
                          c.phone.includes(search) ||
                          c.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? c.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleInitiateBan = (c: Customer) => {
    setSelectedCustomer(c);
    setBanConfirmOpen(true);
  };

  const handleConfirmBan = () => {
    if (selectedCustomer) {
      toggleCustomerBan(selectedCustomer.id);
      setBanConfirmOpen(false);
    }
  };

  const totalActive = customers.filter(c => c.status === 'Active').length;
  const totalBanned = customers.filter(c => c.status === 'Banned').length;

  return (
    <div className="max-w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">Marketplace Users</span>
            <span className="text-outline-variant text-[10px]">•</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Pet Parents Directory</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Customers &amp; Users</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            View registered pet parents, monitor order frequencies, oversee lifetime spending, and manage account security.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-surface-container-low shadow-xs border border-outline-variant/30">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tertiary-container" />
            <span className="font-code-sm text-code-sm text-on-surface font-semibold">{totalActive} Active Buyers</span>
          </div>
          <div className="w-px h-4 bg-outline-variant/30" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-error" />
            <span className="font-code-sm text-code-sm text-on-surface-variant">{totalBanned} Restricted</span>
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
            placeholder="Search customers by name, email, phone, or city..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-container-low text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/20"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface-container-low text-label-md font-label-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/20"
          >
            <option value="">All Accounts</option>
            <option value="Active">Active Customers</option>
            <option value="Banned">Banned / Suspended</option>
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

      {/* Customers Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider select-none border-b border-outline-variant/20">
                <th className="py-3.5 px-4 w-12 text-center">
                  <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary/20 accent-primary cursor-pointer" />
                </th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4 text-center">Total Orders</th>
                <th className="py-3.5 px-4 text-right">Lifetime Spend</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-body-md font-body-md text-on-surface">
              {filteredCustomers.map(c => (
                <tr key={c.id} className="hover:bg-surface-container-low/60 transition-colors group">
                  <td className="py-3.5 px-4 text-center">
                    <input type="checkbox" className="w-4 h-4 rounded text-primary accent-primary cursor-pointer" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img className="w-10 h-10 rounded-full object-cover border border-outline-variant/30 flex-shrink-0" src={c.avatarUrl} alt={c.name} />
                      <div>
                        <span className="font-bold text-on-surface block">{c.name}</span>
                        <span className="font-code-sm text-primary text-[12px] block">{c.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-code-sm text-on-surface">
                    {c.phone}
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-medium">
                    {c.city}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-code-sm font-semibold px-2.5 py-0.5 rounded bg-surface-container-high text-on-surface">
                      {c.totalOrders}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-code-sm font-bold text-on-surface">
                      ₹{c.lifetimeSpend.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[12px] text-outline font-medium">
                    {c.lastOrderDate}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge variant={c.status === 'Active' ? 'success' : 'error'}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => handleInitiateBan(c)}
                      className={`px-3 py-1.5 rounded-lg text-label-sm font-semibold transition-colors flex items-center gap-1.5 ml-auto ${
                        c.status === 'Active'
                          ? 'bg-error/10 hover:bg-error/20 text-error border border-error/20'
                          : 'bg-tertiary/10 hover:bg-tertiary/20 text-tertiary border border-tertiary/20'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {c.status === 'Active' ? 'block' : 'check_circle'}
                      </span>
                      <span>{c.status === 'Active' ? 'Ban User' : 'Restore'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ban / Restore Confirmation Dialog */}
      <Modal
        isOpen={banConfirmOpen}
        onClose={() => setBanConfirmOpen(false)}
        title={selectedCustomer?.status === 'Active' ? 'Restrict Customer Account' : 'Restore Customer Access'}
        subtitle={`Action for user ${selectedCustomer?.name} (${selectedCustomer?.email})`}
        maxWidth="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setBanConfirmOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant={selectedCustomer?.status === 'Active' ? 'danger' : 'primary'}
              onClick={handleConfirmBan}
            >
              {selectedCustomer?.status === 'Active' ? 'Confirm Ban' : 'Restore Account'}
            </Button>
          </>
        }
      >
        <p className="text-body-md text-on-surface-variant leading-relaxed">
          {selectedCustomer?.status === 'Active'
            ? `Are you sure you want to suspend ${selectedCustomer?.name}? They will be blocked from placing new orders or accessing their saved payment options.`
            : `Are you sure you want to re-activate access for ${selectedCustomer?.name}? Their account will immediately return to active standing.`
          }
        </p>
      </Modal>
    </div>
  );
};

