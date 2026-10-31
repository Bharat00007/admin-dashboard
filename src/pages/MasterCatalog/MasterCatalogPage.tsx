import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const MasterCatalogPage: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    categories, 
    brands, 
    units 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modal states
  const [modalType, setModalType] = useState<'none' | 'add' | 'edit' | 'view'>('none');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formUnit, setFormUnit] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formImageUrl, setFormImageUrl] = useState('');

  const openAddModal = () => {
    setActiveProduct(null);
    setFormName('');
    setFormSku(`SKU-GT-${Math.floor(100000 + Math.random() * 900000)}`);
    setFormBrand(brands[0]?.name || 'Gotails Essentials');
    setFormCategory(categories[0]?.name || 'Dog Food');
    setFormUnit(units[0]?.name || 'Kilogram (kg)');
    setFormDescription('');
    setFormStatus('Active');
    setFormPrice(499);
    setFormImageUrl('https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&auto=format&fit=crop&q=80');
    setModalType('add');
  };

  const openEditModal = (p: Product) => {
    setActiveProduct(p);
    setFormName(p.name);
    setFormSku(p.sku);
    setFormBrand(p.brand);
    setFormCategory(p.category);
    setFormUnit(p.unit);
    setFormDescription(p.description);
    setFormStatus(p.status);
    setFormPrice(p.price || 0);
    setFormImageUrl(p.imageUrl);
    setModalType('edit');
  };

  const openViewModal = (p: Product) => {
    setActiveProduct(p);
    setModalType('view');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === 'add') {
      addProduct({
        name: formName,
        sku: formSku,
        brand: formBrand,
        category: formCategory,
        unit: formUnit,
        description: formDescription,
        status: formStatus,
        price: formPrice,
        stock: 50,
        imageUrl: formImageUrl || 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&auto=format&fit=crop&q=80'
      });
    } else if (modalType === 'edit' && activeProduct) {
      updateProduct(activeProduct.id, {
        name: formName,
        sku: formSku,
        brand: formBrand,
        category: formCategory,
        unit: formUnit,
        description: formDescription,
        status: formStatus,
        price: formPrice,
        imageUrl: formImageUrl
      });
    }
    setModalType('none');
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.sku.toLowerCase().includes(search.toLowerCase()) || 
                          p.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? p.category.toLowerCase().includes(selectedCategory.toLowerCase()) : true;
    const matchesBrand = selectedBrand ? p.brand.toLowerCase().includes(selectedBrand.toLowerCase()) : true;
    const matchesStatus = selectedStatus ? p.status.toLowerCase() === selectedStatus.toLowerCase() : true;
    return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
  });

  const activeCount = products.filter(p => p.status === 'Active').length;
  const inactiveCount = products.filter(p => p.status === 'Inactive').length;

  return (
    <div className="max-w-full">
      {/* Header Section with Breadcrumbs & Action Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">Inventory &amp; Master Data</span>
            <span className="text-outline-variant text-[10px]">•</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Global SKUs</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">Master Catalog</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Create and manage standard specification products across all marketplace storefronts.
          </p>
        </div>

        {/* Quick Stats & Primary Action */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="hidden lg:flex items-center gap-4 px-4 py-2 rounded-xl bg-surface-container-low shadow-xs border border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse" />
              <span className="font-code-sm text-code-sm text-on-surface font-semibold">{activeCount} Active</span>
            </div>
            <div className="w-px h-4 bg-outline-variant/30" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-outline" />
              <span className="font-code-sm text-code-sm text-on-surface-variant">{inactiveCount} Inactive</span>
            </div>
          </div>
          
          <Button onClick={openAddModal} variant="primary" icon="add_circle">
            + Add Product
          </Button>
        </div>
      </div>

      {/* Filter & Utility Toolbar */}
      <div className="bg-surface-container-lowest rounded-xl p-4 mb-6 shadow-sm border border-outline-variant/30 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1 min-w-[280px]">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name, barcode, or SKU..."
            className="w-full pl-10 pr-10 py-2 rounded-lg bg-surface-container-low text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all border border-outline-variant/20"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface text-[14px]"
            >
              <span className="material-symbols-outlined text-[16px]">backspace</span>
            </button>
          )}
        </div>

        {/* Filter Selectors */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Category Dropdown */}
          <div className="relative min-w-[140px] flex-1 sm:flex-initial">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg bg-surface-container-low text-label-md font-label-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer border border-outline-variant/20"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[16px]">expand_more</span>
          </div>

          {/* Brand Dropdown */}
          <div className="relative min-w-[130px] flex-1 sm:flex-initial">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg bg-surface-container-low text-label-md font-label-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer border border-outline-variant/20"
            >
              <option value="">All Brands</option>
              {brands.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[16px]">expand_more</span>
          </div>

          {/* Status Dropdown */}
          <div className="relative min-w-[110px] flex-1 sm:flex-initial">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg bg-surface-container-low text-label-md font-label-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer border border-outline-variant/20"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[16px]">expand_more</span>
          </div>

          {/* Refresh / Reset Button */}
          <button
            onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedBrand(''); setSelectedStatus(''); }}
            className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant transition-colors flex items-center justify-center border border-outline-variant/20"
            title="Reset Filters"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
          </button>
        </div>
      </div>

      {/* Master Data Table Container */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider select-none border-b border-outline-variant/20">
                <th className="py-3.5 pl-6 pr-3 w-16">Item</th>
                <th className="py-3.5 px-4 min-w-[220px]">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-on-surface">
                    <span>Product Name</span>
                    <span className="material-symbols-outlined text-[14px]">unfold_more</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 whitespace-nowrap">Brand</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Category</th>
                <th className="py-3.5 px-4 text-center whitespace-nowrap min-w-[80px]">Unit</th>
                <th className="py-3.5 px-4 max-w-[260px]">Description Preview</th>
                <th className="py-3.5 px-4 text-center whitespace-nowrap">Status</th>
                <th className="py-3.5 px-6 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-body-md font-body-md text-on-surface">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[40px] text-outline mb-2">search_off</span>
                    <p className="font-body-md">No products match your current filters.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-surface-container-low/60 transition-colors group">
                    <td className="py-3.5 pl-6 pr-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-container-high p-0.5 flex-shrink-0 shadow-xs border border-outline-variant/30">
                        <img className="w-full h-full object-cover rounded-md" src={p.imageUrl} alt={p.name} />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-on-surface">
                      <div className="flex flex-col">
                        <span 
                          onClick={() => openEditModal(p)}
                          className="hover:text-primary cursor-pointer transition-colors"
                        >
                          {p.name}
                        </span>
                        <span className="font-code-sm text-code-sm text-outline font-normal">{p.sku}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-label-md text-label-md text-on-surface-variant whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-container text-on-surface font-medium whitespace-nowrap">
                        {p.brand}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-on-surface-variant whitespace-nowrap">
                        <span className="material-symbols-outlined text-[16px] text-primary">pets</span>
                        <span>{p.category}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center font-code-sm text-code-sm px-2.5 py-0.5 rounded-md bg-surface-container-high text-on-surface font-medium border border-outline-variant/20 whitespace-nowrap">
                        {p.unit}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-[260px]">
                      <p className="truncate text-on-surface-variant text-body-sm font-body-sm" title={p.description}>
                        {p.description}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant={p.status === 'Active' ? 'success' : 'neutral'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="inline-flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openViewModal(p)}
                          className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" 
                          title="Quick View"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <button 
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" 
                          title="Edit Product"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit_square</span>
                        </button>
                        <button 
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 rounded-lg hover:bg-error-container text-outline hover:text-error transition-colors" 
                          title="Archive SKU"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={modalType === 'add' || modalType === 'edit'}
        onClose={() => setModalType('none')}
        title={modalType === 'add' ? 'Add New Catalog Product' : 'Edit Catalog Product'}
        subtitle={modalType === 'add' ? 'Define a new master SKU with global specifications.' : `Updating specifications for ${activeProduct?.sku}`}
        maxWidth="xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalType('none')}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {modalType === 'add' ? 'Save Product' : 'Update Changes'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Royal Canin Medium Adult Dog Food 15kg"
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-md font-body-md focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
                SKU Code *
              </label>
              <input
                type="text"
                required
                value={formSku}
                onChange={(e) => setFormSku(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-code-sm font-code-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
                Base Price (₹)
              </label>
              <input
                type="number"
                value={formPrice}
                onChange={(e) => setFormPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-md font-body-md focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
                Brand *
              </label>
              <select
                value={formBrand}
                onChange={(e) => setFormBrand(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-md font-body-md focus:border-primary focus:outline-none"
              >
                {brands.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
                Category *
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-md font-body-md focus:border-primary focus:outline-none"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
                Standard Unit *
              </label>
              <input
                type="text"
                value={formUnit}
                onChange={(e) => setFormUnit(e.target.value)}
                placeholder="e.g. 2 kg, 500 ml"
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-md font-body-md focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
              Specification Description
            </label>
            <textarea
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Nutritional composition, target pet breed, age group, dietary benefits..."
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-md font-body-md focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
                Image URL
              </label>
              <input
                type="text"
                value={formImageUrl}
                onChange={(e) => setFormImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low text-body-sm font-body-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1">
                Catalog Status
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

      {/* Quick View Product Modal */}
      {activeProduct && modalType === 'view' && (
        <Modal
          isOpen={true}
          onClose={() => setModalType('none')}
          title="Product Specification"
          subtitle={activeProduct.sku}
          maxWidth="md"
          footer={
            <Button variant="secondary" onClick={() => setModalType('none')}>
              Close
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="w-full h-48 rounded-xl overflow-hidden bg-surface-container-high border border-outline-variant/30 flex items-center justify-center p-2">
              <img src={activeProduct.imageUrl} alt={activeProduct.name} className="w-full h-full object-contain" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-label-sm text-primary font-bold uppercase">{activeProduct.brand}</span>
                <Badge variant={activeProduct.status === 'Active' ? 'success' : 'neutral'}>
                  {activeProduct.status}
                </Badge>
              </div>
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">{activeProduct.name}</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                {activeProduct.description}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-surface-container-low text-center">
              <div>
                <span className="text-[11px] text-outline block">Category</span>
                <span className="font-label-md text-on-surface font-semibold">{activeProduct.category}</span>
              </div>
              <div>
                <span className="text-[11px] text-outline block">Standard Unit</span>
                <span className="font-code-sm text-on-surface font-semibold">{activeProduct.unit}</span>
              </div>
              <div>
                <span className="text-[11px] text-outline block">Benchmark Price</span>
                <span className="font-code-sm text-primary font-bold">₹{activeProduct.price}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

