export * from './auth';

export type TabType = 
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'brands'
  | 'units'
  | 'product-requests'
  | 'sellers'
  | 'seller-details'
  | 'customers'
  | 'approvals'
  | 'approval-details'
  | 'customer-issues'
  | 'seller-issues'
  | 'issues'
  | 'settings'
  | 'audit-logs';

export interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  unit: string;
  description: string;
  status: 'Active' | 'Inactive';
  imageUrl: string;
  images?: string[];
  price?: number;
  stock?: number;
}

export interface Category {
  id: string;
  code: string;
  name: string;
  description: string;
  productCount: number;
  commission?: number;
  status: 'Active' | 'Inactive';
  icon: string;
  color: string;
  imageUrl?: string;
}

export interface Brand {
  id: string;
  name: string;
  origin?: string;
  productCount: number;
  website?: string;
  status: 'Active' | 'Inactive';
  logoUrl: string;
  imageUrl?: string;
  isFeatured?: boolean;
}

export type IssueStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED_NO_ACTION';

export interface Issue {
  id: string;
  orderId?: {
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    createdAt: string;
  } | null;
  customerId?: {
    id: string;
    mobile: string;
    name: string;
    email?: string | null;
  } | null;
  shopId?: {
    id: string;
    shopName: string;
    phone: string;
  } | null;
  orderStatusAtReport?: string;
  problemType?: string;
  description: string;
  status: IssueStatus;
  adminNotes?: string | null;
  reviewedBy?: {
    id: string;
    name?: string | null;
    mobile?: string | null;
  } | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  reporterType: 'CUSTOMER' | 'SELLER';
}

export interface Unit {
  id: string;
  name: string;
  code: string;
  type: 'Weight' | 'Volume' | 'Count' | 'Package';
  precision: number;
  status: 'Active' | 'Inactive';
  skuCount: number;
}

export interface Seller {
  id: string;
  shopName: string;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  rating: number;
  totalOrders: number;
  gmv?: string;
  commissionRate?: number;
  kycStatus: 'Verified' | 'Pending' | 'Rejected';
  status: 'Active' | 'Banned' | 'Pending';
  logoUrl: string;
  joinedDate: string;
  operatingHours?: string;
  bankAccount?: {
    accountNumber: string;
    bankName: string;
    ifsc: string;
    holderName: string;
  } | null;
  gstin?: string;
  pan?: string;
  customRadiusKm?: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  lifetimeSpend: number;
  joinedDate: string;
  status: 'Active' | 'Banned';
  avatarUrl: string;
  lastOrderDate: string;
}

export interface SellerApprovalRequest {
  id: string;
  shopName: string;
  applicantName: string;
  email: string;
  phone: string;
  city: string;
  businessType?: string;
  gstin?: string;
  pan?: string;
  appliedDate: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
  documents: {
    gstCertificate: boolean;
    panCard: boolean;
    fssaiDrugLicense?: boolean;
    bankPassbook?: boolean;
    storeFrontPhoto: boolean;
  };
  storeAddress: string;
  catalogCategory?: string;
  remarks?: string;
  verificationFiles?: Array<{
    documentType: string;
    documentNumber?: string | null;
    fileUrl: string;
  }>;
}

export type ProductRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ProductRequest {
  id: string;
  shopId?: {
    id: string;
    shopName: string;
    phone?: string;
    shopCode?: string;
  } | null;
  sellerId?: {
    id: string;
    name?: string | null;
    mobile: string;
    email?: string | null;
  } | null;
  name: string;
  proposedName?: string;
  description: string;
  categoryId?: {
    id: string;
    name: string;
  } | null;
  brandId?: {
    id: string;
    name: string;
  } | null;
  unitId?: {
    id: string;
    name: string;
    code: string;
  } | null;
  unitValue: number;
  imageUrl?: string;
  images: string[];
  status: ProductRequestStatus;
  adminNotes?: string | null;
  reviewedBy?: {
    id: string;
    name?: string | null;
  } | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}


export interface GlobalSettings {
  key: string;
  universalSearchRadiusKm: number;
  globalDeliveryChargePaise: number;
  globalDeliveryChargeRupees: string;
  updatedBy?: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actorId?: {
    id: string;
    role: string;
    email: string;
    name?: string | null;
  } | null;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  changes?: {
    before?: any;
    after?: any;
  } | null;
  ipAddress?: string | null;
  createdAt: string;
}

export interface ShopRating {
  id: string;
  shopId: string;
  orderId?: string | null;
  customerId?: {
    id: string;
    name?: string | null;
    mobile?: string | null;
  } | null;
  rating: number;
  review?: string | null;
  createdAt: string;
}


