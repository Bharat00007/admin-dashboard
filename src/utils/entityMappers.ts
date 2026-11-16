import {
  Product,
  Category,
  Brand,
  Unit,
  Seller,
  Customer,
  SellerApprovalRequest,
} from '../types';
import {
  BackendUnit,
  BackendCategory,
  BackendBrand,
  BackendMasterProduct,
} from '../services/catalogService';
import { BackendShop } from '../services/shopService';
import { BackendUser } from '../services/userService';
import { formatDate, formatAddress } from './formatters';

const DEFAULT_PRODUCT_IMG = 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=120&auto=format&fit=crop&q=80';
const DEFAULT_BRAND_LOGO = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=120&auto=format&fit=crop&q=80';
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';

/**
 * Maps BackendUnit -> Frontend Unit
 */
export function mapBackendUnit(u: BackendUnit): Unit {
  return {
    id: u._id,
    name: u.name,
    code: u.code,
    type: u.code === 'kg' || u.code === 'g' ? 'Weight' : u.code === 'ml' || u.code === 'L' ? 'Volume' : 'Count',
    precision: u.code === 'kg' || u.code === 'L' ? 2 : 0,
    status: u.isActive ? 'Active' : 'Inactive',
    skuCount: 0,
  };
}

/**
 * Maps BackendCategory -> Frontend Category
 */
export function mapBackendCategory(c: BackendCategory): Category {
  return {
    id: c._id,
    code: c.slug,
    name: c.name,
    description: c.description || 'Pet care category catalog',
    productCount: 0,
    commission: 10,
    status: c.isActive ? 'Active' : 'Inactive',
    icon: 'pets',
    color: '#4F46E5',
  };
}

/**
 * Maps BackendBrand -> Frontend Brand
 */
export function mapBackendBrand(b: BackendBrand): Brand {
  return {
    id: b._id,
    name: b.name,
    origin: 'India',
    productCount: 0,
    website: `https://${b.slug}.com`,
    status: b.isActive ? 'Active' : 'Inactive',
    logoUrl: b.imageUrl || DEFAULT_BRAND_LOGO,
    isFeatured: true,
  };
}

/**
 * Maps BackendMasterProduct -> Frontend Product
 */
export function mapBackendProduct(p: BackendMasterProduct): Product {
  const brandName = typeof p.brandId === 'object' && p.brandId !== null
    ? p.brandId.name
    : 'Partner Brand';

  const categoryName = typeof p.categoryId === 'object' && p.categoryId !== null
    ? p.categoryId.name
    : 'Pet Supplies';

  const unitCode = typeof p.unitId === 'object' && p.unitId !== null
    ? p.unitId.code
    : 'pc';

  const displayImage = p.images && p.images.length > 0 && p.images[0]
    ? p.images[0]
    : DEFAULT_PRODUCT_IMG;

  return {
    id: p._id,
    name: p.name,
    sku: `SKU-${p._id.slice(-6).toUpperCase()}`,
    brand: brandName,
    category: categoryName,
    unit: `${p.unitValue || 1} ${unitCode}`,
    description: p.description || 'Master platform catalog SKU specification',
    status: p.isActive ? 'Active' : 'Inactive',
    imageUrl: displayImage,
    price: p.unitValue || 0,
    stock: 100,
  };
}

/**
 * Maps BackendShop -> Frontend Seller
 */
export function mapBackendShop(s: BackendShop): Seller {
  const sellerObj = typeof s.sellerId === 'object' && s.sellerId !== null ? s.sellerId : null;
  const ownerName = sellerObj?.name || 'Registered Merchant';
  const ownerEmail = sellerObj?.email || `shop-${s.shopCode.toLowerCase()}@gotails.in`;
  const ownerPhone = s.phone || sellerObj?.mobile || '—';

  // Check verification documents for statutory details
  const gstinDoc = s.verificationDocuments?.find(d => d.documentType.includes('GST') || d.documentType.includes('TAX'));
  const panDoc = s.verificationDocuments?.find(d => d.documentType.includes('PAN') || d.documentType.includes('ID'));

  const kycStatus = s.approvalStatus === 'APPROVED'
    ? 'Verified'
    : s.approvalStatus === 'REJECTED'
    ? 'Rejected'
    : 'Pending';

  const status = s.isSuspended
    ? 'Banned'
    : s.approvalStatus === 'APPROVED'
    ? 'Active'
    : 'Pending';

  return {
    id: s._id,
    shopName: s.shopName,
    ownerName,
    email: ownerEmail,
    phone: ownerPhone,
    city: s.address?.city || 'India',
    address: formatAddress(s.address),
    rating: s.ratingAverage || 5.0,
    totalOrders: s.ratingCount || 0,
    gmv: '₹0',
    commissionRate: 10.0,
    kycStatus,
    status,
    logoUrl: s.logoUrl || DEFAULT_BRAND_LOGO,
    joinedDate: formatDate(s.createdAt),
    operatingHours: '09:00 AM – 10:00 PM',
    bankAccount: {
      accountNumber: 'XXXX-XXXX-XXXX',
      bankName: 'Merchant Settlement Account',
      ifsc: 'GOTAIL01',
      holderName: s.shopName,
    },
    gstin: gstinDoc?.documentNumber || '27AABCU9603R1ZM',
    pan: panDoc?.documentNumber || 'AABCU9603R',
  };
}

/**
 * Maps BackendShop -> Frontend SellerApprovalRequest
 */
export function mapBackendShopApproval(s: BackendShop): SellerApprovalRequest {
  const sellerObj = typeof s.sellerId === 'object' && s.sellerId !== null ? s.sellerId : null;
  const ownerName = sellerObj?.name || 'Applicant';
  const ownerEmail = sellerObj?.email || `${s.phone}@gotails.in`;
  const ownerPhone = s.phone || sellerObj?.mobile || '—';

  const hasDocs = Boolean(s.verificationDocuments && s.verificationDocuments.length > 0);

  const status = s.approvalStatus === 'APPROVED'
    ? 'Approved'
    : s.approvalStatus === 'REJECTED'
    ? 'Rejected'
    : 'Pending';

  return {
    id: s._id,
    shopName: s.shopName,
    applicantName: ownerName,
    email: ownerEmail,
    phone: ownerPhone,
    city: s.address?.city || 'India',
    businessType: 'Retailer',
    gstin: s.verificationDocuments?.[0]?.documentNumber || '27AABCU9603R1ZM',
    pan: s.verificationDocuments?.[1]?.documentNumber || 'AABCU9603R',
    appliedDate: formatDate(s.createdAt),
    status,
    documents: {
      gstCertificate: hasDocs,
      panCard: hasDocs,
      fssaiDrugLicense: true,
      bankPassbook: true,
      storeFrontPhoto: Boolean(s.bannerUrl || s.logoUrl),
    },
    storeAddress: formatAddress(s.address),
    catalogCategory: 'Pet Supplies & Nutrition',
    remarks: s.rejectionReason || undefined,
    verificationFiles: s.verificationDocuments || [],
  };
}

/**
 * Maps BackendUser -> Frontend Customer
 */
export function mapBackendCustomer(u: BackendUser): Customer {
  return {
    id: u._id,
    name: u.name || `Customer (${u.mobile.slice(-4)})`,
    email: u.email || `${u.mobile}@gotails.customer`,
    phone: u.mobile,
    city: 'India',
    totalOrders: 0,
    lifetimeSpend: 0,
    joinedDate: formatDate(u.createdAt),
    status: u.status === 'ACTIVE' ? 'Active' : 'Banned',
    avatarUrl: DEFAULT_AVATAR,
    lastOrderDate: formatDate(u.updatedAt),
  };
}
