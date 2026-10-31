import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const CategoriesPage: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useApp();

  const [search, setSearch] = useState('');
  const [modalType, setModalType] = useState<'none' | 'add' | 'edit'>('none');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCommission, setFormCommission] = useState<number>(8);
  const [formIcon, setFormIcon] = useState('pets');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');

  const openAddModal = () => {
    setActiveCategory(null);
    setFormName('');
    setFormCode(`CAT-${Math.floor(100 + Math.random() * 900)}`);
    setFormDescription('');
    setFormCommission(10);
    setFormIcon('pets');
    setFormStatus('Active');
    setModalType('add');
  };

  const openEditModal = (cat: Category) => {
    setActiveCategory(cat);
    setFormName(cat.name);
    setFormCode(cat.code);
    setFormDescription(cat.description);
    setFormCommission(cat.commission);
    setFormIcon(cat.icon);
    setFormStatus(cat.status);
    setModalType('edit');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === 'add') {
      addCategory({
        name: formName,
        code: formCode,
        description: formDescription,
        commission: formCommission,
        icon: formIcon,
        status: formStatus,
        productCount: 0,
        color: '#3d7ff0'
      });
    } else if (modalType === 'edit' && activeCategory) {
      updateCategory(activeCategory.id, {
        name: formName,
        code: formCode,
        description: formDescription,
        commission: formCommission,
        icon: formIcon,
        status: formStatus
      });
    }
    setModalType('none');
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">Inventory &amp; Master Data</span>
            <span className="text-outline-variant text-[10px]">•</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Taxonomy</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Categories Management</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Organize platform product hierarchy, manage commissions, and classify taxonomy.
          </p>
        </div>

        <Button onClick={openAddModal} variant="primary" icon="add_circle">
          + Add Category
        </Button>
      </div>

      {/* Toolbar */}
      <div className="bg-surface-container-lowest rounded-xl p-3.5 sm:p-4 mb-4 sm:mb-6 shadow-xs border border-outline-variant/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name, code, or description..."
            className="w-full pl-10 pr-4 py-2 min-h-[40px] rounded-lg bg-surface-container-low text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/20"
          />
        </div>
        <span className="text-body-sm text-on-surface-variant font-medium shrink-0">
          Showing {filteredCategories.length} Categories
        </span>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6">
        {filteredCategories.map(cat => (
          <div 
            key={cat.id}
            className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30 hover:border-primary/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">{cat.icon}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={cat.status === 'Active' ? 'success' : 'neutral'}>
                    {cat.status}
                  </Badge>
                  <button 
                    onClick={() => openEditModal(cat)}
                    className="p-1 rounded text-outline hover:text-primary hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button 
                    onClick={() => deleteCategory(cat.id)}
                    className="p-1 rounded text-outline hover:text-error hover:bg-error/10 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>

              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{cat.name}</h3>
              <span className="font-code-sm text-code-sm text-outline block mb-2">{cat.code}</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed line-clamp-2">
                {cat.description}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-outline-variant/20 flex items-center justify-between text-body-sm">
              <span className="font-code-sm font-semibold text-on-surface">
                {cat.productCount} SKUs
              </span>
              <span className="px-2.5 py-1 rounded bg-secondary-container/20 text-secondary font-label-sm font-bold">
                {cat.commission}% Commission
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={modalType === 'add' || modalType === 'edit'}
        onClose={() => setModalType('none')}
        title={modalType === 'add' ? 'Create Product Category' : 'Edit Category'}
        subtitle={modalType === 'add' ? 'Add a new taxonomy classification with marketplace commission rate.' : `Editing category ${activeCategory?.code}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalType('none')}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {modalType === 'add' ? 'Create Category' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Cat Food & Nutrition"
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-md font-body-md focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
                Category Code *
              </label>
              <input
                type="text"
                required
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-code-sm font-code-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
                Commission Rate (%) *
              </label>
              <input
                type="number"
                required
                min={0}
                max={100}
                value={formCommission}
                onChange={(e) => setFormCommission(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-md font-body-md focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Detailed description of what items belong in this category..."
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-md font-body-md focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
                Material Symbol Icon Name
              </label>
              <input
                type="text"
                value={formIcon}
                onChange={(e) => setFormIcon(e.target.value)}
                placeholder="e.g. pets, soap, cleaning_services"
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

