import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
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
import { useAuth } from './AuthContext';
import { 
  catalogService, 
  BackendUnit, 
  BackendCategory, 
  BackendBrand, 
  BackendMasterProduct 
} from '../services/catalogService';
import { shopService, BackendShop } from '../services/shopService';
import { userService, BackendUser } from '../services/userService';
import { analyticsService, AdminAnalyticsOverview } from '../services/analyticsService';
import { getApiErrorMessage } from '../services/apiClient';
import {
  mapBackendUnit,
  mapBackendCategory,
  mapBackendBrand,
  mapBackendProduct,
  mapBackendShop,
  mapBackendShopApproval,
  mapBackendCustomer
} from '../utils/entityMappers';

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
  
  // Data entities (Mapped to UI representations)
  products: Product[];
  categories: Category[];
  brands: Brand[];
  units: Unit[];
  sellers: Seller[];
  customers: Customer[];
  approvals: SellerApprovalRequest[];

  // Raw Backend entities
  backendUnits: BackendUnit[];
  backendCategories: BackendCategory[];
  backendBrands: BackendBrand[];
  backendProducts: BackendMasterProduct[];
  backendShops: BackendShop[];
  backendCustomers: BackendUser[];
  analytics: AdminAnalyticsOverview | null;

  // Loading & refresh states
  isLoadingData: boolean;
  dataError: string | null;
  refreshAllData: () => Promise<void>;

  // Mutations
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  addBrand: (brand: Omit<Brand, 'id'>) => Promise<void>;
  updateBrand: (id: string, brand: Partial<Brand>) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;

  addUnit: (unit: Omit<Unit, 'id'>) => Promise<void>;
  updateUnit: (id: string, unit: Partial<Unit>) => Promise<void>;
  deleteUnit: (id: string) => Promise<void>;

  toggleSellerBan: (id: string) => Promise<void>;
  toggleCustomerBan: (id: string) => Promise<boolean>;

  approveSellerRequest: (id: string) => Promise<void>;
  rejectSellerRequest: (id: string, remarks?: string) => Promise<void>;

  // Toast
  toast: ToastState;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
  hideToast: () => void;

  // Search & Navigation
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [selectedApprovalId, setSelectedApprovalId] = useState<string | null>(null);
  
  // Mapped frontend states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [approvals, setApprovals] = useState<SellerApprovalRequest[]>([]);

  // Raw backend states
  const [backendUnits, setBackendUnits] = useState<BackendUnit[]>([]);
  const [backendCategories, setBackendCategories] = useState<BackendCategory[]>([]);
  const [backendBrands, setBackendBrands] = useState<BackendBrand[]>([]);
  const [backendProducts, setBackendProducts] = useState<BackendMasterProduct[]>([]);
  const [backendShops, setBackendShops] = useState<BackendShop[]>([]);
  const [backendCustomers, setBackendCustomers] = useState<BackendUser[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalyticsOverview | null>(null);

  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const [globalSearch, setGlobalSearch] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [toast, setToast] = useState<ToastState>({
    show: false,
    title: '',
    message: '',
    type: 'success'
  });

  const showToast = useCallback((title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ show: true, title, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, []);

  /**
   * Load real data from production backend
   */
  const refreshAllData = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoadingData(true);
    setDataError(null);

    try {
      const [
        unitsRes,
        categoriesRes,
        brandsRes,
        productsRes,
        shopsRes,
        customersRes,
        analyticsRes,
      ] = await Promise.all([
        catalogService.getUnits(),
        catalogService.getCategories(),
        catalogService.getBrands(),
        catalogService.getAdminProducts({ limit: 100 }),
        shopService.getShops({ limit: 100 }),
        userService.getCustomers({ limit: 100 }),
        analyticsService.getOverview(),
      ]);

      // 1. Units
      if (unitsRes.success && unitsRes.data) {
        setBackendUnits(unitsRes.data);
        setUnits(unitsRes.data.map(mapBackendUnit));
      }

      // 2. Categories
      if (categoriesRes.success && categoriesRes.data) {
        setBackendCategories(categoriesRes.data);
        setCategories(categoriesRes.data.map(mapBackendCategory));
      }

      // 3. Brands
      if (brandsRes.success && brandsRes.data) {
        setBackendBrands(brandsRes.data);
        setBrands(brandsRes.data.map(mapBackendBrand));
      }

      // 4. Products
      if (productsRes.success && productsRes.data) {
        setBackendProducts(productsRes.data);
        setProducts(productsRes.data.map(mapBackendProduct));
      }

      // 5. Shops / Sellers & Approvals
      if (shopsRes.success && shopsRes.data) {
        setBackendShops(shopsRes.data);
        setSellers(shopsRes.data.map(mapBackendShop));
        setApprovals(shopsRes.data.map(mapBackendShopApproval));

        if (!selectedSellerId && shopsRes.data.length > 0) {
          setSelectedSellerId(shopsRes.data[0]._id);
        }
        if (!selectedApprovalId && shopsRes.data.length > 0) {
          const pending = shopsRes.data.find(s => s.approvalStatus === 'PENDING') || shopsRes.data[0];
          setSelectedApprovalId(pending._id);
        }
      }

      // 6. Customers
      if (customersRes.success && customersRes.data) {
        setBackendCustomers(customersRes.data);
        setCustomers(customersRes.data.map(mapBackendCustomer));
      }

      // 7. Analytics Overview
      if (analyticsRes.success && analyticsRes.data) {
        setAnalytics(analyticsRes.data);
      }
    } catch (err: any) {
      console.error('[AppContext] Failed to load production data', err);
      setDataError(err.message || 'Failed to sync with production server');
      showToast('Network Sync Error', 'Could not fetch latest records from backend', 'error');
    } finally {
      setIsLoadingData(false);
    }
  }, [isAuthenticated, selectedSellerId, selectedApprovalId, showToast]);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshAllData();
    } else {
      // Clear data on logout
      setProducts([]);
      setCategories([]);
      setBrands([]);
      setUnits([]);
      setSellers([]);
      setCustomers([]);
      setApprovals([]);
      setAnalytics(null);
    }
  }, [isAuthenticated, refreshAllData]);

  // ==========================================
  // MUTATIONS (Connected to Production Backend)
  // ==========================================

  // Products
  const addProduct = async (p: Omit<Product, 'id'>) => {
    try {
      // Resolve IDs
      const categoryMatch = backendCategories.find(c => c.name.toLowerCase() === p.category.toLowerCase()) || backendCategories[0];
      const brandMatch = backendBrands.find(b => b.name.toLowerCase() === p.brand.toLowerCase()) || backendBrands[0];
      const unitMatch = backendUnits.find(u => p.unit.toLowerCase().includes(u.code.toLowerCase()) || p.unit.toLowerCase().includes(u.name.toLowerCase())) || backendUnits[0];

      if (!categoryMatch || !unitMatch) {
        showToast('Creation Error', 'Valid category and unit required', 'error');
        return;
      }

      const res = await catalogService.createProduct({
        name: p.name,
        description: p.description,
        images: p.imageUrl ? [p.imageUrl] : [],
        categoryId: categoryMatch._id,
        brandId: brandMatch ? brandMatch._id : null,
        unitId: unitMatch._id,
        unitValue: p.price || 1,
        isActive: p.status === 'Active',
      });

      if (res.success && res.data) {
        const mapped = mapBackendProduct(res.data);
        setProducts(prev => [mapped, ...prev]);
        setBackendProducts(prev => [res.data!, ...prev]);
        showToast('Catalog Updated', `Added "${mapped.name}" to Master Catalog.`);
      } else {
        showToast('Catalog Error', res.message || 'Failed to create product', 'error');
      }
    } catch (err: any) {
      showToast('Catalog Error', err.message || 'Product creation failed', 'error');
    }
  };

  const updateProduct = async (id: string, p: Partial<Product>) => {
    try {
      const payload: any = {};
      if (p.name !== undefined) payload.name = p.name;
      if (p.description !== undefined) payload.description = p.description;
      if (p.imageUrl) payload.images = [p.imageUrl];
      if (p.status !== undefined) payload.isActive = p.status === 'Active';

      const res = await catalogService.updateProduct(id, payload);
      if (res.success && res.data) {
        const mapped = mapBackendProduct(res.data);
        setProducts(prev => prev.map(item => item.id === id ? mapped : item));
        showToast('Catalog Updated', 'Product changes saved to backend.');
      } else {
        showToast('Update Error', res.message || 'Failed to update product', 'error');
      }
    } catch (err: any) {
      showToast('Update Error', err.message || 'Product update failed', 'error');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      // Soft-deactivate to preserve historical integrity
      const res = await catalogService.updateProduct(id, { isActive: false });
      if (res.success) {
        setProducts(prev => prev.map(x => x.id === id ? { ...x, status: 'Inactive' } : x));
        showToast('Item Deactivated', 'Product marked inactive in catalog.', 'info');
      } else {
        showToast('Delete Error', res.message || 'Failed to deactivate product', 'error');
      }
    } catch (err: any) {
      showToast('Delete Error', err.message || 'Deactivation failed', 'error');
    }
  };

  // Categories
  const addCategory = async (c: Omit<Category, 'id'>) => {
    try {
      const slug = c.code ? c.code.toLowerCase().replace(/[^a-z0-9]+/g, '-') : c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const res = await catalogService.createCategory({
        name: c.name,
        slug,
        description: c.description,
        isActive: c.status === 'Active',
      });

      if (res.success && res.data) {
        const mapped = mapBackendCategory(res.data);
        setCategories(prev => [mapped, ...prev]);
        setBackendCategories(prev => [res.data!, ...prev]);
        showToast('Category Created', `New category "${mapped.name}" added.`);
      } else {
        showToast('Creation Error', res.message || 'Failed to create category', 'error');
      }
    } catch (err: any) {
      showToast('Creation Error', err.message || 'Failed to create category', 'error');
    }
  };

  const updateCategory = async (id: string, c: Partial<Category>) => {
    try {
      const payload: any = {};
      if (c.name !== undefined) payload.name = c.name;
      if (c.description !== undefined) payload.description = c.description;
      if (c.status !== undefined) payload.isActive = c.status === 'Active';

      const res = await catalogService.updateCategory(id, payload);
      if (res.success && res.data) {
        const mapped = mapBackendCategory(res.data);
        setCategories(prev => prev.map(item => item.id === id ? mapped : item));
        showToast('Category Updated', 'Category modified successfully.');
      } else {
        showToast('Update Error', res.message || 'Failed to update category', 'error');
      }
    } catch (err: any) {
      showToast('Update Error', err.message || 'Failed to update category', 'error');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const res = await catalogService.updateCategory(id, { isActive: false });
      if (res.success) {
        setCategories(prev => prev.map(x => x.id === id ? { ...x, status: 'Inactive' } : x));
        showToast('Category Deactivated', 'Category marked inactive.', 'info');
      } else {
        showToast('Delete Error', res.message || 'Failed to deactivate category', 'error');
      }
    } catch (err: any) {
      showToast('Delete Error', err.message || 'Failed to deactivate category', 'error');
    }
  };

  // Brands
  const addBrand = async (b: Omit<Brand, 'id'>) => {
    try {
      const slug = b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const res = await catalogService.createBrand({
        name: b.name,
        slug,
        description: b.origin,
        imageUrl: b.logoUrl,
        isActive: b.status === 'Active',
      });

      if (res.success && res.data) {
        const mapped = mapBackendBrand(res.data);
        setBrands(prev => [mapped, ...prev]);
        setBackendBrands(prev => [res.data!, ...prev]);
        showToast('Brand Added', `Brand "${mapped.name}" registered.`);
      } else {
        showToast('Creation Error', res.message || 'Failed to add brand', 'error');
      }
    } catch (err: any) {
      showToast('Creation Error', err.message || 'Failed to add brand', 'error');
    }
  };

  const updateBrand = async (id: string, b: Partial<Brand>) => {
    try {
      const payload: any = {};
      if (b.name !== undefined) payload.name = b.name;
      if (b.logoUrl !== undefined) payload.imageUrl = b.logoUrl;
      if (b.status !== undefined) payload.isActive = b.status === 'Active';

      const res = await catalogService.updateBrand(id, payload);
      if (res.success && res.data) {
        const mapped = mapBackendBrand(res.data);
        setBrands(prev => prev.map(item => item.id === id ? mapped : item));
        showToast('Brand Updated', 'Brand updated successfully.');
      } else {
        showToast('Update Error', res.message || 'Failed to update brand', 'error');
      }
    } catch (err: any) {
      showToast('Update Error', err.message || 'Failed to update brand', 'error');
    }
  };

  const deleteBrand = async (id: string) => {
    try {
      const res = await catalogService.updateBrand(id, { isActive: false });
      if (res.success) {
        setBrands(prev => prev.map(x => x.id === id ? { ...x, status: 'Inactive' } : x));
        showToast('Brand Deactivated', 'Brand marked inactive.', 'info');
      } else {
        showToast('Delete Error', res.message || 'Failed to deactivate brand', 'error');
      }
    } catch (err: any) {
      showToast('Delete Error', err.message || 'Failed to deactivate brand', 'error');
    }
  };

  // Units
  const addUnit = async (u: Omit<Unit, 'id'>) => {
    try {
      const res = await catalogService.createUnit({
        name: u.name,
        code: u.code,
        isActive: u.status === 'Active',
      });

      if (res.success && res.data) {
        const mapped = mapBackendUnit(res.data);
        setUnits(prev => [mapped, ...prev]);
        setBackendUnits(prev => [res.data!, ...prev]);
        showToast('Unit Added', `Unit "${mapped.name} (${mapped.code})" created.`);
      } else {
        showToast('Creation Error', res.message || 'Failed to create unit', 'error');
      }
    } catch (err: any) {
      showToast('Creation Error', err.message || 'Failed to create unit', 'error');
    }
  };

  const updateUnit = async (id: string, u: Partial<Unit>) => {
    try {
      const payload: any = {};
      if (u.name !== undefined) payload.name = u.name;
      if (u.code !== undefined) payload.code = u.code;
      if (u.status !== undefined) payload.isActive = u.status === 'Active';

      const res = await catalogService.updateUnit(id, payload);
      if (res.success && res.data) {
        const mapped = mapBackendUnit(res.data);
        setUnits(prev => prev.map(item => item.id === id ? mapped : item));
        showToast('Unit Updated', 'Measurement unit updated.');
      } else {
        showToast('Update Error', res.message || 'Failed to update unit', 'error');
      }
    } catch (err: any) {
      showToast('Update Error', err.message || 'Failed to update unit', 'error');
    }
  };

  const deleteUnit = async (id: string) => {
    try {
      const res = await catalogService.updateUnit(id, { isActive: false });
      if (res.success) {
        setUnits(prev => prev.map(x => x.id === id ? { ...x, status: 'Inactive' } : x));
        showToast('Unit Deactivated', 'Unit marked inactive.', 'info');
      } else {
        showToast('Delete Error', res.message || 'Failed to deactivate unit', 'error');
      }
    } catch (err: any) {
      showToast('Delete Error', err.message || 'Failed to deactivate unit', 'error');
    }
  };

  // Sellers (Suspend / Reactivate)
  const toggleSellerBan = async (id: string) => {
    const current = sellers.find(s => s.id === id);
    if (!current) return;

    try {
      const willSuspend = current.status === 'Active';
      const res = willSuspend
        ? await shopService.suspendShop(id, 'Store suspended by administrator')
        : await shopService.reactivateShop(id);

      if (res.success && res.data) {
        const mapped = mapBackendShop(res.data);
        setSellers(prev => prev.map(s => s.id === id ? mapped : s));
        showToast(
          willSuspend ? 'Seller Suspended' : 'Seller Re-activated',
          `Shop "${mapped.shopName}" status is now ${mapped.status}.`,
          willSuspend ? 'error' : 'success'
        );
      } else {
        showToast('Action Failed', res.message || 'Could not update seller status', 'error');
      }
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to update status', 'error');
    }
  };

  // Customers (Ban / Restore)
  const toggleCustomerBan = async (id: string): Promise<boolean> => {
    const current = customers.find(c => c.id === id);
    if (!current) return false;

    try {
      const willSuspend = current.status === 'Active';
      const nextStatus = willSuspend ? 'SUSPENDED' : 'ACTIVE';
      const res = await userService.updateUserStatus(id, nextStatus);

      if (res.success && res.data) {
        const mapped = mapBackendCustomer(res.data);
        setCustomers(prev => prev.map(c => c.id === id ? mapped : c));
        showToast(
          willSuspend ? 'Account Suspended' : 'Account Restored',
          `Customer ${mapped.name} is now ${mapped.status}.`,
          willSuspend ? 'error' : 'success'
        );
        return true;
      } else {
        const errMsg = getApiErrorMessage(res, 'Could not update customer status');
        showToast('Action Failed', errMsg, 'error');
        return false;
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to update customer status';
      showToast('Error', errMsg, 'error');
      return false;
    }
  };

  // Approvals (Approve / Reject)
  const approveSellerRequest = async (id: string) => {
    try {
      const res = await shopService.approveShop(id);
      if (res.success && res.data) {
        const mappedShop = mapBackendShop(res.data);
        const mappedApproval = mapBackendShopApproval(res.data);

        setApprovals(prev => prev.map(a => a.id === id ? mappedApproval : a));
        setSellers(prev => [mappedShop, ...prev.filter(s => s.id !== id)]);
        showToast('Merchant Approved', `"${mappedShop.shopName}" has been successfully approved!`, 'success');
      } else {
        showToast('Approval Failed', res.message || 'Could not approve shop', 'error');
      }
    } catch (err: any) {
      showToast('Approval Error', err.message || 'Approval request failed', 'error');
    }
  };

  const rejectSellerRequest = async (id: string, remarks?: string) => {
    try {
      const res = await shopService.rejectShop(id, remarks);
      if (res.success && res.data) {
        const mappedApproval = mapBackendShopApproval(res.data);
        setApprovals(prev => prev.map(a => a.id === id ? mappedApproval : a));
        showToast('Application Rejected', `Onboarding application was rejected.`, 'error');
      } else {
        showToast('Rejection Failed', res.message || 'Could not reject shop', 'error');
      }
    } catch (err: any) {
      showToast('Rejection Error', err.message || 'Rejection request failed', 'error');
    }
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
      backendUnits,
      backendCategories,
      backendBrands,
      backendProducts,
      backendShops,
      backendCustomers,
      analytics,
      isLoadingData,
      dataError,
      refreshAllData,
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
      setIsSearchModalOpen,
      isMobileMenuOpen,
      setIsMobileMenuOpen
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
