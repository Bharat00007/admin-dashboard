import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  TabType, 
  Product, 
  Category, 
  Brand, 
  Unit, 
  Seller, 
  Customer, 
  SellerApprovalRequest 
} from '../types';
import { 
  initialProducts, 
  initialCategories, 
  initialBrands, 
  initialUnits, 
  initialSellers, 
  initialCustomers, 
  initialApprovals 
} from '../data/mockData';

interface ToastState {
  show: boolean;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedSellerId: string | null;
  setSelectedSellerId: (id: string | null) => void;
  selectedApprovalId: string | null;
  setSelectedApprovalId: (id: string | null) => void;
  
  // Data entities
  products: Product[];
  categories: Category[];
  brands: Brand[];
  units: Unit[];
  sellers: Seller[];
  customers: Customer[];
  approvals: SellerApprovalRequest[];

  // Mutations
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addBrand: (brand: Omit<Brand, 'id'>) => void;
  updateBrand: (id: string, brand: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;

  addUnit: (unit: Omit<Unit, 'id'>) => void;
  updateUnit: (id: string, unit: Partial<Unit>) => void;
  deleteUnit: (id: string) => void;

  toggleSellerBan: (id: string) => void;
  toggleCustomerBan: (id: string) => void;

  approveSellerRequest: (id: string) => void;
  rejectSellerRequest: (id: string, remarks?: string) => void;

  // Toast
  toast: ToastState;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
  hideToast: () => void;

  // Search & Navigation
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>('sel-101');
  const [selectedApprovalId, setSelectedApprovalId] = useState<string | null>('app-501');
  
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [sellers, setSellers] = useState<Seller[]>(initialSellers);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [approvals, setApprovals] = useState<SellerApprovalRequest[]>(initialApprovals);

  const [globalSearch, setGlobalSearch] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const [toast, setToast] = useState<ToastState>({
    show: false,
    title: '',
    message: '',
    type: 'success'
  });

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ show: true, title, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  // Products
  const addProduct = (p: Omit<Product, 'id'>) => {
    const newP: Product = { ...p, id: `prod-${Date.now()}` };
    setProducts(prev => [newP, ...prev]);
    showToast('Catalog Updated', `Added "${newP.name}" to Master Catalog.`);
  };

  const updateProduct = (id: string, p: Partial<Product>) => {
    setProducts(prev => prev.map(item => item.id === id ? { ...item, ...p } : item));
    showToast('Catalog Updated', 'Product changes saved successfully.');
  };

  const deleteProduct = (id: string) => {
    const p = products.find(x => x.id === id);
    setProducts(prev => prev.filter(x => x.id !== id));
    showToast('Item Archived', `Product "${p?.name || id}" was deleted from catalog.`, 'info');
  };

  // Categories
  const addCategory = (c: Omit<Category, 'id'>) => {
    const newC: Category = { ...c, id: `cat-${Date.now()}` };
    setCategories(prev => [newC, ...prev]);
    showToast('Category Created', `New category "${newC.name}" added.`);
  };

  const updateCategory = (id: string, c: Partial<Category>) => {
    setCategories(prev => prev.map(item => item.id === id ? { ...item, ...c } : item));
    showToast('Category Updated', 'Category details modified.');
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(x => x.id !== id));
    showToast('Category Removed', 'Category removed from directory.', 'info');
  };

  // Brands
  const addBrand = (b: Omit<Brand, 'id'>) => {
    const newB: Brand = { ...b, id: `br-${Date.now()}` };
    setBrands(prev => [newB, ...prev]);
    showToast('Brand Added', `Brand "${newB.name}" registered.`);
  };

  const updateBrand = (id: string, b: Partial<Brand>) => {
    setBrands(prev => prev.map(item => item.id === id ? { ...item, ...b } : item));
    showToast('Brand Updated', 'Brand updated successfully.');
  };

  const deleteBrand = (id: string) => {
    setBrands(prev => prev.filter(x => x.id !== id));
    showToast('Brand Removed', 'Brand deleted from platform.', 'info');
  };

  // Units
  const addUnit = (u: Omit<Unit, 'id'>) => {
    const newU: Unit = { ...u, id: `u-${Date.now()}` };
    setUnits(prev => [newU, ...prev]);
    showToast('Unit Added', `Unit of measure "${newU.name} (${newU.code})" created.`);
  };

  const updateUnit = (id: string, u: Partial<Unit>) => {
    setUnits(prev => prev.map(item => item.id === id ? { ...item, ...u } : item));
    showToast('Unit Updated', 'Measurement unit updated.');
  };

  const deleteUnit = (id: string) => {
    setUnits(prev => prev.filter(x => x.id !== id));
    showToast('Unit Removed', 'Unit removed from system.', 'info');
  };

  // Sellers
  const toggleSellerBan = (id: string) => {
    setSellers(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'Active' ? 'Banned' : 'Active';
        showToast(
          nextStatus === 'Banned' ? 'Seller Suspended' : 'Seller Re-activated',
          `Shop "${s.shopName}" status is now ${nextStatus}.`,
          nextStatus === 'Banned' ? 'error' : 'success'
        );
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  // Customers
  const toggleCustomerBan = (id: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'Active' ? 'Banned' : 'Active';
        showToast(
          nextStatus === 'Banned' ? 'Account Banned' : 'Account Restored',
          `Customer ${c.name} account is now ${nextStatus}.`,
          nextStatus === 'Banned' ? 'error' : 'success'
        );
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // Approvals
  const approveSellerRequest = (id: string) => {
    const req = approvals.find(x => x.id === id);
    if (!req) return;

    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a));

    // Also auto-create a verified seller
    const newSeller: Seller = {
      id: `sel-${Date.now()}`,
      shopName: req.shopName,
      ownerName: req.applicantName,
      email: req.email,
      phone: req.phone,
      city: req.city,
      address: req.storeAddress,
      rating: 5.0,
      totalOrders: 0,
      gmv: '₹0',
      commissionRate: 10.0,
      kycStatus: 'Verified',
      status: 'Active',
      logoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=120&auto=format&fit=crop&q=80',
      joinedDate: 'Just now',
      operatingHours: '09:00 AM – 09:00 PM',
      bankAccount: {
        accountNumber: 'XXXX-XXXX-XXXX',
        bankName: 'Verified Bank',
        ifsc: 'VERF0001',
        holderName: req.shopName
      },
      gstin: req.gstin,
      pan: req.pan
    };

    setSellers(prev => [newSeller, ...prev]);
    showToast('Merchant Approved', `"${req.shopName}" approved and onboarded as active seller!`, 'success');
  };

  const rejectSellerRequest = (id: string, remarks?: string) => {
    const req = approvals.find(x => x.id === id);
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'Rejected', remarks: remarks || 'Rejected by platform admin' } : a));
    showToast('Application Rejected', `Onboarding request for "${req?.shopName}" was rejected.`, 'error');
  };

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      selectedSellerId,
      setSelectedSellerId,
      selectedApprovalId,
      setSelectedApprovalId,
      products,
      categories,
      brands,
      units,
      sellers,
      customers,
      approvals,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      addBrand,
      updateBrand,
      deleteBrand,
      addUnit,
      updateUnit,
      deleteUnit,
      toggleSellerBan,
      toggleCustomerBan,
      approveSellerRequest,
      rejectSellerRequest,
      toast,
      showToast,
      hideToast,
      globalSearch,
      setGlobalSearch,
      isSearchModalOpen,
      setIsSearchModalOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

