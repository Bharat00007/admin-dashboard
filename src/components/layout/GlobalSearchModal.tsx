import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../../types';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchModalOpen, 
    setIsSearchModalOpen, 
    products, 
    sellers, 
    customers, 
    categories,
    setActiveTab,
    setSelectedSellerId
  } = useApp();

  const [query, setQuery] = useState('');

  // ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(!isSearchModalOpen);
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const filteredProducts = query.trim() === '' ? [] : products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.sku.toLowerCase().includes(query.toLowerCase()) ||
    p.brand.toLowerCase().includes(query.toLowerCase())
  );

  const filteredSellers = query.trim() === '' ? [] : sellers.filter(s => 
    s.shopName.toLowerCase().includes(query.toLowerCase()) || 
    s.ownerName.toLowerCase().includes(query.toLowerCase()) ||
    s.city.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCustomers = query.trim() === '' ? [] : customers.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.email.toLowerCase().includes(query.toLowerCase()) ||
    c.city.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCategories = query.trim() === '' ? [] : categories.filter(cat => 
    cat.name.toLowerCase().includes(query.toLowerCase())
  );

  const navigateTo = (tab: TabType, extraAction?: () => void) => {
    if (extraAction) extraAction();
    setActiveTab(tab);
    setIsSearchModalOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-[#202633]/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 flex flex-col overflow-hidden max-h-[70vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-outline-variant/20 flex items-center gap-3 bg-surface-container-lowest">
          <span className="material-symbols-outlined text-[24px] text-primary">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search products, sellers, customers, categories..."
            className="w-full bg-transparent text-headline-sm font-headline-sm text-on-surface placeholder:text-outline focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
          <kbd className="px-2 py-0.5 rounded bg-surface-container-high text-outline text-[11px] font-code-sm border border-outline-variant/30">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-4">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[36px] text-outline mb-2">manage_search</span>
              <p className="font-body-md text-body-md">Quick Navigation</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                <button 
                  onClick={() => navigateTo('products')}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-body-sm font-medium"
                >
                  📦 Products Catalog
                </button>
                <button 
                  onClick={() => navigateTo('sellers')}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-body-sm font-medium"
                >
                  🏪 Sellers Directory
                </button>
                <button 
                  onClick={() => navigateTo('customers')}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-body-sm font-medium"
                >
                  👥 Customer Accounts
                </button>
                <button 
                  onClick={() => navigateTo('approvals')}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-body-sm font-medium"
                >
                  ⏳ Seller Approvals
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Products */}
              {filteredProducts.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-outline uppercase tracking-wider mb-2">Products ({filteredProducts.length})</h4>
                  <div className="space-y-1">
                    {filteredProducts.map(p => (
                      <div 
                        key={p.id}
                        onClick={() => navigateTo('products')}
                        className="p-2.5 rounded-lg hover:bg-surface-container-low cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img src={p.imageUrl} alt={p.name} className="w-8 h-8 rounded object-cover" />
                          <div>
                            <p className="font-label-md text-label-md font-semibold text-on-surface">{p.name}</p>
                            <p className="font-code-sm text-code-sm text-outline">{p.sku} • {p.brand}</p>
                          </div>
                        </div>
                        <span className="font-code-sm text-[12px] text-primary font-semibold">₹{p.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sellers */}
              {filteredSellers.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-outline uppercase tracking-wider mb-2">Sellers ({filteredSellers.length})</h4>
                  <div className="space-y-1">
                    {filteredSellers.map(s => (
                      <div 
                        key={s.id}
                        onClick={() => navigateTo('seller-details', () => setSelectedSellerId(s.id))}
                        className="p-2.5 rounded-lg hover:bg-surface-container-low cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img src={s.logoUrl} alt={s.shopName} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="font-label-md text-label-md font-semibold text-on-surface">{s.shopName}</p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">{s.ownerName} • {s.city}</p>
                          </div>
                        </div>
                        <span className="text-[12px] px-2 py-0.5 rounded bg-surface-container font-medium text-on-surface">⭐ {s.rating}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers */}
              {filteredCustomers.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-outline uppercase tracking-wider mb-2">Customers ({filteredCustomers.length})</h4>
                  <div className="space-y-1">
                    {filteredCustomers.map(c => (
                      <div 
                        key={c.id}
                        onClick={() => navigateTo('customers')}
                        className="p-2.5 rounded-lg hover:bg-surface-container-low cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img src={c.avatarUrl} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="font-label-md text-label-md font-semibold text-on-surface">{c.name}</p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">{c.email} • {c.city}</p>
                          </div>
                        </div>
                        <span className="font-label-sm text-label-sm text-tertiary font-semibold">{c.totalOrders} Orders</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {filteredCategories.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-outline uppercase tracking-wider mb-2">Categories ({filteredCategories.length})</h4>
                  <div className="space-y-1">
                    {filteredCategories.map(cat => (
                      <div 
                        key={cat.id}
                        onClick={() => navigateTo('categories')}
                        className="p-2.5 rounded-lg hover:bg-surface-container-low cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                          </div>
                          <div>
                            <p className="font-label-md text-label-md font-semibold text-on-surface">{cat.name}</p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">{cat.productCount} Products</p>
                          </div>
                        </div>
                        <span className="font-label-sm text-label-sm text-outline">{cat.commission}% commission</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredProducts.length === 0 && filteredSellers.length === 0 && filteredCustomers.length === 0 && filteredCategories.length === 0 && (
                <div className="py-8 text-center text-on-surface-variant">
                  <p className="font-body-md text-body-md">No matching records found for "{query}".</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

