import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Brand } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const BrandsPage: React.FC = () => {
  const { brands, addBrand, updateBrand, deleteBrand } = useApp();

  const [search, setSearch] = useState('');
  const [modalType, setModalType] = useState<'none' | 'add' | 'edit'>('none');
  const [activeBrand, setActiveBrand] = useState<Brand | null>(null);

  const [formName, setFormName] = useState('');
  const [formOrigin, setFormOrigin] = useState('');
  const [formWebsite, setFormWebsite] = useState('');
  const [formLogoUrl, setFormLogoUrl] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');

  const openAddModal = () => {
    setActiveBrand(null);
    setFormName('');
    setFormOrigin('India');
    setFormWebsite('https://');
    setFormLogoUrl('https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&auto=format&fit=crop&q=80');
    setFormStatus('Active');
    setModalType('add');
  };

  const openEditModal = (b: Brand) => {
    setActiveBrand(b);
    setFormName(b.name);
    setFormOrigin(b.origin);
    setFormWebsite(b.website);
    setFormLogoUrl(b.logoUrl);
    setFormStatus(b.status);
    setModalType('edit');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === 'add') {
      addBrand({
        name: formName,
        origin: formOrigin,
        website: formWebsite,
        logoUrl: formLogoUrl,
        status: formStatus,
        productCount: 0
      });
    } else if (modalType === 'edit' && activeBrand) {
      updateBrand(activeBrand.id, {
        name: formName,
        origin: formOrigin,
        website: formWebsite,
        logoUrl: formLogoUrl,
        status: formStatus
      });
    }
    setModalType('none');
  };

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.origin.toLowerCase().includes(search.toLowerCase()) ||
    b.website.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">Inventory &amp; Master Data</span>
            <span className="text-outline-variant text-[10px]">•</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Brand Partners</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Brands Management</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Maintain authorized pet manufacturing brands, distributor provenance, and logo assets.
          </p>
        </div>

        <Button onClick={openAddModal} variant="primary" icon="add_circle">
          + Add Brand
        </Button>
      </div>

      {/* Toolbar */}
      <div className="bg-surface-container-lowest rounded-xl p-4 mb-6 shadow-sm border border-outline-variant/30 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brands by brand name, origin, or website..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-container-low text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/20"
          />
        </div>
        <span className="text-body-sm text-on-surface-variant font-medium">
          Showing {filteredBrands.length} Verified Brands
        </span>
      </div>

      {/* Brands Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider select-none border-b border-outline-variant/20">
                <th className="py-3.5 px-4 w-16">Brand</th>
                <th className="py-3.5 px-4">Brand Name</th>
                <th className="py-3.5 px-4">Origin / Parent Entity</th>
                <th className="py-3.5 px-4">Official Website</th>
                <th className="py-3.5 px-4 text-center">Active Catalog SKUs</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-body-md font-body-md text-on-surface">
              {filteredBrands.map(b => (
                <tr key={b.id} className="hover:bg-surface-container-low/60 transition-colors group">
                  <td className="py-3.5 px-4">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-container-high p-0.5 border border-outline-variant/30 flex items-center justify-center">
                      <img className="w-full h-full object-cover rounded" src={b.logoUrl} alt={b.name} />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-on-surface">
                    <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => openEditModal(b)}>
                      {b.name}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-medium">
                    {b.origin}
                  </td>
                  <td className="py-3.5 px-4">
                    <a 
                      href={b.website.startsWith('http') ? b.website : `https://${b.website}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="font-code-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <span>{b.website}</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-code-sm font-semibold px-2 py-0.5 rounded bg-surface-container-high text-on-surface">
                      {b.productCount} SKUs
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge variant={b.status === 'Active' ? 'success' : 'neutral'}>
                      {b.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="inline-flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(b)}
                        className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" 
                        title="Edit Brand"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit_square</span>
                      </button>
                      <button 
                        onClick={() => deleteBrand(b.id)}
                        className="p-1.5 rounded-lg hover:bg-error-container text-outline hover:text-error transition-colors" 
                        title="Delete Brand"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Brand Modal */}
      <Modal
        isOpen={modalType === 'add' || modalType === 'edit'}
        onClose={() => setModalType('none')}
        title={modalType === 'add' ? 'Register New Brand' : 'Edit Brand Details'}
        subtitle={modalType === 'add' ? 'Add an authorized partner brand into the global marketplace directory.' : `Editing brand ${activeBrand?.name}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalType('none')}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {modalType === 'add' ? 'Register Brand' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
              Brand Name *
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Royal Canin"
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-md font-body-md focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
                Country / Entity Origin *
              </label>
              <input
                type="text"
                required
                value={formOrigin}
                onChange={(e) => setFormOrigin(e.target.value)}
                placeholder="e.g. France (Mars Petcare)"
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-md font-body-md focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
                Official Website
              </label>
              <input
                type="text"
                value={formWebsite}
                onChange={(e) => setFormWebsite(e.target.value)}
                placeholder="brandname.com"
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-md font-body-md focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
                Logo Image URL
              </label>
              <input
                type="text"
                value={formLogoUrl}
                onChange={(e) => setFormLogoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-sm font-body-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
                Status
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as 'Active' | 'Inactive')}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-md font-body-md focus:border-primary focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

