import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Unit } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const UnitsPage: React.FC = () => {
  const { units, addUnit, updateUnit, deleteUnit } = useApp();

  const [search, setSearch] = useState('');
  const [modalType, setModalType] = useState<'none' | 'add' | 'edit'>('none');
  const [activeUnit, setActiveUnit] = useState<Unit | null>(null);

  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formType, setFormType] = useState<'Weight' | 'Volume' | 'Count' | 'Package'>('Weight');
  const [formPrecision, setFormPrecision] = useState<number>(2);
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');

  const openAddModal = () => {
    setActiveUnit(null);
    setFormName('');
    setFormCode('');
    setFormType('Weight');
    setFormPrecision(2);
    setFormStatus('Active');
    setModalType('add');
  };

  const openEditModal = (u: Unit) => {
    setActiveUnit(u);
    setFormName(u.name);
    setFormCode(u.code);
    setFormType(u.type);
    setFormPrecision(u.precision);
    setFormStatus(u.status);
    setModalType('edit');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === 'add') {
      addUnit({
        name: formName,
        code: formCode,
        type: formType,
        precision: formPrecision,
        status: formStatus,
        skuCount: 0
      });
    } else if (modalType === 'edit' && activeUnit) {
      updateUnit(activeUnit.id, {
        name: formName,
        code: formCode,
        type: formType,
        precision: formPrecision,
        status: formStatus
      });
    }
    setModalType('none');
  };

  const filteredUnits = units.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.code.toLowerCase().includes(search.toLowerCase()) ||
    u.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">Inventory &amp; Master Data</span>
            <span className="text-outline-variant text-[10px]">•</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Standards</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Units Management</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Standardize units of measurement across weight, liquid volume, counts, and bundle packaging.
          </p>
        </div>

        <Button onClick={openAddModal} variant="primary" icon="add_circle">
          + Add Unit
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
            placeholder="Search units by measurement name, symbol, or type..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-container-low text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/20"
          />
        </div>
        <span className="text-body-sm text-on-surface-variant font-medium">
          Showing {filteredUnits.length} Standard Units
        </span>
      </div>

      {/* Units Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider select-none border-b border-outline-variant/20">
                <th className="py-3.5 px-6">Unit Name</th>
                <th className="py-3.5 px-4">Standard Code / Symbol</th>
                <th className="py-3.5 px-4">Dimension Type</th>
                <th className="py-3.5 px-4 text-center">Decimal Precision</th>
                <th className="py-3.5 px-4 text-center">Associated Master SKUs</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-body-md font-body-md text-on-surface">
              {filteredUnits.map(u => (
                <tr key={u.id} className="hover:bg-surface-container-low/60 transition-colors group">
                  <td className="py-3.5 px-6 font-bold text-on-surface">
                    <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => openEditModal(u)}>
                      {u.name}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center font-code-sm font-bold px-2 py-0.5 rounded bg-surface-container-high text-primary border border-outline-variant/30 whitespace-nowrap">
                      {u.code}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-on-surface-variant">
                    {u.type}
                  </td>
                  <td className="py-3.5 px-4 text-center font-code-sm">
                    {u.precision} decimals
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-code-sm font-semibold px-2 py-0.5 rounded bg-surface-container-high text-on-surface">
                      {u.skuCount} SKUs
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge variant={u.status === 'Active' ? 'success' : 'neutral'}>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="inline-flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(u)}
                        className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" 
                        title="Edit Unit"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit_square</span>
                      </button>
                      <button 
                        onClick={() => deleteUnit(u.id)}
                        className="p-1.5 rounded-lg hover:bg-error-container text-outline hover:text-error transition-colors" 
                        title="Delete Unit"
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

      {/* Add / Edit Unit Modal */}
      <Modal
        isOpen={modalType === 'add' || modalType === 'edit'}
        onClose={() => setModalType('none')}
        title={modalType === 'add' ? 'Define Unit of Measure' : 'Edit Unit'}
        subtitle={modalType === 'add' ? 'Standardize dimension and packaging for catalog quantities.' : `Editing unit ${activeUnit?.name}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalType('none')}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {modalType === 'add' ? 'Define Unit' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
              Unit Name *
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Kilogram, Millilitre, Piece"
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-md font-body-md focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
                Standard Symbol / Code *
              </label>
              <input
                type="text"
                required
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                placeholder="e.g. kg, ml, pc"
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-code-sm font-code-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
                Dimension Type *
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-md font-body-md focus:border-primary focus:outline-none"
              >
                <option value="Weight">Weight</option>
                <option value="Volume">Volume</option>
                <option value="Count">Count</option>
                <option value="Package">Package</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
                Decimal Precision
              </label>
              <input
                type="number"
                min={0}
                max={4}
                value={formPrecision}
                onChange={(e) => setFormPrecision(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-md font-body-md focus:border-primary focus:outline-none"
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

