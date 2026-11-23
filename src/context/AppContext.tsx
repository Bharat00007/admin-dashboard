import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
    TabType,
    Product,
    Category,
    Brand,
    Unit,
    Seller,
    Customer,
    SellerApprovalRequest,
    Issue,
    IssueStatus,
    ProductRequest,
    GlobalSettings,
    AuditLog
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
import { issueService } from '../services/issueService';
import { productRequestService } from '../services/productRequestService';
import { settingsService } from '../services/settingsService';
import { auditService } from '../services/auditService';
import { getApiErrorMessage } from '../services/apiClient';
import {
    mapBackendUnit,
    mapBackendCategory,
    mapBackendBrand,
    mapBackendProduct,
    mapBackendShop,
    mapBackendShopApproval,
    mapBackendCustomer,
    mapBackendIssue,
    mapBackendProductRequest,
    mapBackendGlobalSettings,
    mapBackendAuditLog
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

    // Issues
    issues: Issue[];
    isLoadingIssues: boolean;
    loadIssues: (params?: { status?: string; orderStatusAtReport?: 'PREPARING' | 'COMPLETED' | string; page?: number; limit?: number }) => Promise<void>;
    updateIssueStatus: (id: string, status: IssueStatus, adminNotes?: string) => Promise<boolean>;

    // Product Requests
    productRequests: ProductRequest[];
    isLoadingProductRequests: boolean;
    loadProductRequests: (status?: string) => Promise<void>;
    approveProductRequest: (id: string) => Promise<boolean>;
    rejectProductRequest: (id: string, adminNotes?: string) => Promise<boolean>;


    // Global Settings
    globalSettings: GlobalSettings | null;
    isLoadingSettings: boolean;
    loadGlobalSettings: () => Promise<void>;
    updateGlobalSettings: (payload: { universalSearchRadiusKm?: number; globalDeliveryChargePaise?: number }) => Promise<boolean>;

    // Audit Logs
    auditLogs: AuditLog[];
    isLoadingAuditLogs: boolean;
    loadAuditLogs: (params?: { page?: number; limit?: number; targetType?: string; action?: string }) => Promise<void>;

    // Shop Details Update
    updateShopDetails: (id: string, payload: { shopName?: string; customRadiusKm?: number | null }) => Promise<boolean>;

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
    const [issues, setIssues] = useState<Issue[]>([]);
    const [isLoadingIssues, setIsLoadingIssues] = useState<boolean>(false);

    const [productRequests, setProductRequests] = useState<ProductRequest[]>([]);
    const [isLoadingProductRequests, setIsLoadingProductRequests] = useState<boolean>(false);


    const [globalSettings, setGlobalSettings] = useState<GlobalSettings | null>(null);
    const [isLoadingSettings, setIsLoadingSettings] = useState<boolean>(false);

    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [isLoadingAuditLogs, setIsLoadingAuditLogs] = useState<boolean>(false);

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
                issuesRes,
                productReqRes,
                settingsRes,
                auditRes,
            ] = await Promise.allSettled([
                catalogService.getUnits(),
                catalogService.getCategories(),
                catalogService.getBrands(),
                catalogService.getAdminProducts({ limit: 100 }),
                shopService.getShops({ limit: 100 }),
                userService.getCustomers({ limit: 100 }),
                analyticsService.getOverview(),
                issueService.getIssues({ limit: 100 }),
                productRequestService.getProductRequests({ limit: 50 }),
                settingsService.getSettings(),
                auditService.getAuditLogs({ limit: 50 }),
            ]);

            // 1. Units
            if (unitsRes.status === 'fulfilled' && unitsRes.value.success && unitsRes.value.data) {
                setBackendUnits(unitsRes.value.data);
                setUnits(unitsRes.value.data.map(mapBackendUnit));
            }

            // 2. Categories
            if (categoriesRes.status === 'fulfilled' && categoriesRes.value.success && categoriesRes.value.data) {
                setBackendCategories(categoriesRes.value.data);
                setCategories(categoriesRes.value.data.map(mapBackendCategory));
            }

            // 3. Brands
            if (brandsRes.status === 'fulfilled' && brandsRes.value.success && brandsRes.value.data) {
                setBackendBrands(brandsRes.value.data);
                setBrands(brandsRes.value.data.map(mapBackendBrand));
            }

            // 4. Products
            if (productsRes.status === 'fulfilled' && productsRes.value.success && productsRes.value.data) {
                setBackendProducts(productsRes.value.data);
                setProducts(productsRes.value.data.map(mapBackendProduct));
            }

            // 5. Shops / Sellers & Approvals
            if (shopsRes.status === 'fulfilled' && shopsRes.value.success && shopsRes.value.data) {
                setBackendShops(shopsRes.value.data);
                setSellers(shopsRes.value.data.map(mapBackendShop));
                setApprovals(shopsRes.value.data.map(mapBackendShopApproval));

                if (!selectedSellerId && shopsRes.value.data.length > 0) {
                    setSelectedSellerId(shopsRes.value.data[0]._id);
                }
                if (!selectedApprovalId && shopsRes.value.data.length > 0) {
                    const pending = shopsRes.value.data.find(s => s.approvalStatus === 'PENDING') || shopsRes.value.data[0];
                    setSelectedApprovalId(pending._id);
                }
            }

            // 6. Customers
            if (customersRes.status === 'fulfilled' && customersRes.value.success && customersRes.value.data) {
                setBackendCustomers(customersRes.value.data);
                setCustomers(customersRes.value.data.map(mapBackendCustomer));
            }

            // 7. Analytics Overview
            if (analyticsRes.status === 'fulfilled' && analyticsRes.value.success && analyticsRes.value.data) {
                setAnalytics(analyticsRes.value.data);
            }

            // 8. Issues
            if (issuesRes.status === 'fulfilled' && issuesRes.value.success && issuesRes.value.data) {
                setIssues(issuesRes.value.data.map(mapBackendIssue));
            }

            // 9. Product Requests
            if (productReqRes.status === 'fulfilled' && productReqRes.value.success && productReqRes.value.data) {
                setProductRequests(productReqRes.value.data.map(mapBackendProductRequest));
            }

            // 10. Global Settings
            if (settingsRes.status === 'fulfilled' && settingsRes.value.success && settingsRes.value.data) {
                setGlobalSettings(mapBackendGlobalSettings(settingsRes.value.data));
            }

            // 11. Audit Logs
            if (auditRes.status === 'fulfilled' && auditRes.value.success && auditRes.value.data) {
                setAuditLogs(auditRes.value.data.map(mapBackendAuditLog));
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
            setIssues([]);
            setProductRequests([]);
            setGlobalSettings(null);
            setAuditLogs([]);
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
                images: p.images && p.images.length > 0 ? p.images : (p.imageUrl ? [p.imageUrl] : []),
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
            if (p.images !== undefined) {
                payload.images = p.images;
            } else if (p.imageUrl) {
                payload.images = [p.imageUrl];
            }
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
                imageUrl: c.imageUrl,
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
            if (c.imageUrl !== undefined) payload.imageUrl = c.imageUrl;

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
            const brandLogo = b.imageUrl || b.logoUrl || undefined;
            const res = await catalogService.createBrand({
                name: b.name,
                slug,
                description: b.origin,
                imageUrl: brandLogo,
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
            if (b.origin !== undefined) payload.description = b.origin;
            if (b.imageUrl !== undefined) payload.imageUrl = b.imageUrl;
            else if (b.logoUrl !== undefined) payload.imageUrl = b.logoUrl;
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

    // Issues Management
    const loadIssues = useCallback(async (params?: { status?: string; orderStatusAtReport?: 'PREPARING' | 'COMPLETED' | string; page?: number; limit?: number }) => {
        if (!isAuthenticated) return;
        setIsLoadingIssues(true);
        try {
            const res = await issueService.getIssues({ ...params, limit: params?.limit || 100 });
            if (res.success && res.data) {
                setIssues(res.data.map(mapBackendIssue));
            }
        } catch (err: any) {
            console.error('[AppContext] Failed to load issues', err);
        } finally {
            setIsLoadingIssues(false);
        }
    }, [isAuthenticated]);

    const updateIssueStatus = async (id: string, status: IssueStatus, adminNotes?: string): Promise<boolean> => {
        try {
            const res = await issueService.updateIssueStatus(id, { status, adminNotes });
            if (res.success && res.data) {
                const mapped = mapBackendIssue(res.data);
                setIssues(prev => prev.map(iss => iss.id === id ? mapped : iss));
                showToast('Issue Updated', `Issue status changed to ${status.replace(/_/g, ' ')}.`, 'success');
                return true;
            } else {
                const msg = getApiErrorMessage(res, 'Failed to update issue status');
                showToast('Update Failed', msg, 'error');
                return false;
            }
        } catch (err: any) {
            const msg = err?.message || 'Failed to update issue';
            showToast('Error', msg, 'error');
            return false;
        }
    };

    // Product Requests
    const loadProductRequests = useCallback(async (status?: string) => {
        if (!isAuthenticated) return;
        setIsLoadingProductRequests(true);
        try {
            const res = await productRequestService.getProductRequests({ status, limit: 100 });
            if (res.success && res.data) {
                setProductRequests(res.data.map(mapBackendProductRequest));
            }
        } catch (err: any) {
            console.error('[AppContext] Failed to load product requests', err);
        } finally {
            setIsLoadingProductRequests(false);
        }
    }, [isAuthenticated]);

    const approveProductRequest = async (id: string): Promise<boolean> => {
        try {
            const res = await productRequestService.approveProductRequest(id);
            if (res.success && res.data) {
                const mapped = mapBackendProductRequest(res.data);
                setProductRequests(prev => prev.map(pr => pr.id === id ? mapped : pr));
                showToast('Request Approved', 'Seller product request approved and created in catalog.', 'success');
                return true;
            } else {
                const msg = getApiErrorMessage(res, 'Failed to approve product request');
                showToast('Approval Failed', msg, 'error');
                return false;
            }
        } catch (err: any) {
            showToast('Error', err?.message || 'Failed to approve product request', 'error');
            return false;
        }
    };

    const rejectProductRequest = async (id: string, adminNotes?: string): Promise<boolean> => {
        try {
            const res = await productRequestService.rejectProductRequest(id, adminNotes);
            if (res.success && res.data) {
                const mapped = mapBackendProductRequest(res.data);
                setProductRequests(prev => prev.map(pr => pr.id === id ? mapped : pr));
                showToast('Request Rejected', 'Product request rejected.', 'info');
                return true;
            } else {
                const msg = getApiErrorMessage(res, 'Failed to reject product request');
                showToast('Rejection Failed', msg, 'error');
                return false;
            }
        } catch (err: any) {
            showToast('Error', err?.message || 'Failed to reject product request', 'error');
            return false;
        }
    };


    // Global Settings
    const loadGlobalSettings = useCallback(async () => {
        if (!isAuthenticated) return;
        setIsLoadingSettings(true);
        try {
            const res = await settingsService.getSettings();
            if (res.success && res.data) {
                setGlobalSettings(mapBackendGlobalSettings(res.data));
            }
        } catch (err: any) {
            console.error('[AppContext] Failed to load settings', err);
        } finally {
            setIsLoadingSettings(false);
        }
    }, [isAuthenticated]);

    const updateGlobalSettings = async (payload: { universalSearchRadiusKm?: number; globalDeliveryChargePaise?: number }): Promise<boolean> => {
        try {
            const res = await settingsService.updateSettings(payload);
            if (res.success && res.data) {
                setGlobalSettings(mapBackendGlobalSettings(res.data));
                showToast('Settings Saved', 'Platform global settings updated successfully.', 'success');
                return true;
            } else {
                const msg = getApiErrorMessage(res, 'Failed to update settings');
                showToast('Update Failed', msg, 'error');
                return false;
            }
        } catch (err: any) {
            showToast('Error', err?.message || 'Failed to update settings', 'error');
            return false;
        }
    };

    // Audit Logs
    const loadAuditLogs = useCallback(async (params?: { page?: number; limit?: number; targetType?: string; action?: string }) => {
        if (!isAuthenticated) return;
        setIsLoadingAuditLogs(true);
        try {
            const res = await auditService.getAuditLogs({ limit: 50, ...params });
            if (res.success && res.data) {
                setAuditLogs(res.data.map(mapBackendAuditLog));
            }
        } catch (err: any) {
            console.error('[AppContext] Failed to load audit logs', err);
        } finally {
            setIsLoadingAuditLogs(false);
        }
    }, [isAuthenticated]);

    // Shop Details
    const updateShopDetails = async (id: string, payload: { shopName?: string; customRadiusKm?: number | null }): Promise<boolean> => {
        try {
            const res = await shopService.updateShopDetails(id, payload);
            if (res.success && res.data) {
                const mapped = mapBackendShop(res.data);
                setSellers(prev => prev.map(s => s.id === id ? mapped : s));
                showToast('Shop Details Updated', `"${mapped.shopName}" updated successfully.`, 'success');
                return true;
            } else {
                const msg = getApiErrorMessage(res, 'Failed to update shop details');
                showToast('Update Failed', msg, 'error');
                return false;
            }
        } catch (err: any) {
            showToast('Error', err?.message || 'Failed to update shop details', 'error');
            return false;
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
            issues,
            isLoadingIssues,
            loadIssues,
            updateIssueStatus,
            productRequests,
            isLoadingProductRequests,
            loadProductRequests,
            approveProductRequest,
            rejectProductRequest,
            globalSettings,
            isLoadingSettings,
            loadGlobalSettings,
            updateGlobalSettings,
            auditLogs,
            isLoadingAuditLogs,
            loadAuditLogs,
            updateShopDetails,
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
