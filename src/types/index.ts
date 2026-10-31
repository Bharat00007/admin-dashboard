export type TabType = 
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'brands'
  | 'units'
  | 'sellers'
  | 'seller-details'
  | 'customers'
  | 'approvals'
  | 'approval-details';

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
  price?: number;
  stock?: number;
}

export interface Category {
  id: string;
  code: string;
  name: string;
  description: string;
  productCount: number;
  commission: number;
  status: 'Active' | 'Inactive';
  icon: string;
  color: string;
}

export interface Brand {
  id: string;
  name: string;
  origin: string;
  productCount: number;
  website: string;
  status: 'Active' | 'Inactive';
  logoUrl: string;
  isFeatured?: boolean;
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
  gmv: string;
  commissionRate: number;
  kycStatus: 'Verified' | 'Pending' | 'Rejected';
  status: 'Active' | 'Banned' | 'Pending';
  logoUrl: string;
  joinedDate: string;
  operatingHours: string;
  bankAccount: {
    accountNumber: string;
    bankName: string;
    ifsc: string;
    holderName: string;
  };
  gstin: string;
  pan: string;
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
  businessType: 'Retailer' | 'Wholesaler' | 'Pharmacy' | 'Direct Brand';
  gstin: string;
  pan: string;
  appliedDate: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
  documents: {
    gstCertificate: boolean;
    panCard: boolean;
    fssaiDrugLicense?: boolean;
    bankPassbook: boolean;
    storeFrontPhoto: boolean;
  };
  storeAddress: string;
  catalogCategory: string;
  remarks?: string;
}

