import {
  Product,
  Category,
  Brand,
  Unit,
  Seller,
  Customer,
  SellerApprovalRequest,
  Issue,
  ProductRequest,
  GlobalSettings,
  AuditLog,
  ShopRating,
} from '../types';
import {
  BackendUnit,
  BackendCategory,
  BackendBrand,
  BackendMasterProduct,
} from '../services/catalogService';
import { BackendShop, BackendShopRating } from '../services/shopService';
import { BackendUser } from '../services/userService';
import { BackendIssue } from '../services/issueService';
import { BackendProductRequest } from '../services/productRequestService';
import { BackendGlobalSettings } from '../services/settingsService';
import { BackendAuditLog } from '../services/auditService';
import { formatDate, formatAddress } from './formatters';

const DEFAULT_PRODUCT_IMG = '';
const DEFAULT_BRAND_LOGO = '';
const DEFAULT_AVATAR = '';

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
    description: c.description || '',
    productCount: 0,
    commission: undefined,
    status: c.isActive ? 'Active' : 'Inactive',
    icon: 'pets',
    color: '#4F46E5',
    imageUrl: c.imageUrl || undefined,
  };
}

/**
 * Resolves a brand logo URL. If the backend contains an unreachable placeholder
 * URL (such as the legacy seed domain storage.gotails.com), resolves to the
 * high-definition bundled brand asset so the UI displays the true brand logo.
 */
export function resolveBrandLogo(url?: string | null, slugOrName?: string): string {
  if (url && !url.includes('storage.gotails.com')) {
    return url;
  }
  
  let slug = '';
  if (url && url.includes('storage.gotails.com/brands/')) {
    slug = url.split('/').pop()?.replace('.png', '').replace('.jpg', '') || '';
  }
  if (!slug && slugOrName) {
    slug = slugOrName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  const knownLogos: Record<string, string> = {
    'drools': '/assets/brands/drools.svg',
    'pedigree': '/assets/brands/pedigree.svg',
    'whiskas': '/assets/brands/whiskas.svg',
    'himalaya': '/assets/brands/himalaya.svg',
    'farmina-nd': '/assets/brands/farmina-nd.svg',
    'farmina': '/assets/brands/farmina-nd.svg',
    'jerhigh': '/assets/brands/jerhigh.svg',
  };

  if (slug && knownLogos[slug]) {
    return knownLogos[slug];
  }

  return url || '';
}

/**
 * Maps BackendBrand -> Frontend Brand
 */
export function mapBackendBrand(b: BackendBrand): Brand {
  const rawUrl = b.imageUrl || (b as any).logoUrl || (b as any).logo || (b as any).image;
  const imgUrl = resolveBrandLogo(rawUrl, b.slug || b.name);
  return {
    id: b._id,
    name: b.name,
    origin: b.description || undefined,
    productCount: 0,
    website: undefined,
    status: b.isActive ? 'Active' : 'Inactive',
    logoUrl: imgUrl,
    imageUrl: imgUrl,
    isFeatured: false,
  };
}

/**
 * Maps BackendMasterProduct -> Frontend Product
 */
export function mapBackendProduct(p: BackendMasterProduct): Product {
  const brandName = typeof p.brandId === 'object' && p.brandId !== null
    ? p.brandId.name
    : '—';

  const categoryName = typeof p.categoryId === 'object' && p.categoryId !== null
    ? p.categoryId.name
    : '—';

  const unitCode = typeof p.unitId === 'object' && p.unitId !== null
    ? p.unitId.code
    : '';

  const displayImage = p.images && p.images.length > 0 && p.images[0]
    ? p.images[0]
    : DEFAULT_PRODUCT_IMG;

  return {
    id: p._id,
    name: p.name,
    sku: `SKU-${p._id.slice(-6).toUpperCase()}`,
    brand: brandName,
    category: categoryName,
    unit: unitCode ? `${p.unitValue || 1} ${unitCode}` : `${p.unitValue || 1}`,
    description: p.description || '',
    status: p.isActive ? 'Active' : 'Inactive',
    imageUrl: displayImage,
    images: p.images && p.images.length > 0 ? p.images : (displayImage ? [displayImage] : []),
    price: 0,
    stock: 0,
  };
}

/**
 * Maps BackendShop -> Frontend Seller
 */
export function mapBackendShop(s: BackendShop): Seller {
  const sellerObj = typeof s.sellerId === 'object' && s.sellerId !== null ? s.sellerId : null;
  const ownerName = sellerObj?.name || 'Registered Merchant';
  const ownerEmail = sellerObj?.email || '';
  const ownerPhone = s.phone || sellerObj?.mobile || '—';

  // Check verification documents for statutory details
  const gstinDoc = s.verificationDocuments?.find(d => 
    d.documentType.toUpperCase().includes('GST') || d.documentType.toUpperCase().includes('TAX')
  );
  const panDoc = s.verificationDocuments?.find(d => 
    d.documentType.toUpperCase().includes('PAN') || d.documentType.toUpperCase().includes('ID')
  );

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
    city: s.address?.city || '—',
    address: formatAddress(s.address),
    rating: s.ratingAverage || 0,
    totalOrders: s.ratingCount || 0,
    gmv: undefined,
    commissionRate: undefined,
    kycStatus,
    status,
    logoUrl: s.logoUrl || DEFAULT_BRAND_LOGO,
    joinedDate: formatDate(s.createdAt),
    operatingHours: undefined,
    bankAccount: null,
    gstin: gstinDoc?.documentNumber || undefined,
    pan: panDoc?.documentNumber || undefined,
    customRadiusKm: s.customRadiusKm || undefined,
  };
}

/**
 * Maps BackendShop -> Frontend SellerApprovalRequest
 */
export function mapBackendShopApproval(s: BackendShop): SellerApprovalRequest {
  const sellerObj = typeof s.sellerId === 'object' && s.sellerId !== null ? s.sellerId : null;
  const ownerName = sellerObj?.name || 'Applicant';
  const ownerEmail = sellerObj?.email || '';
  const ownerPhone = s.phone || sellerObj?.mobile || '—';

  const gstinDoc = s.verificationDocuments?.find(d => 
    d.documentType.toUpperCase().includes('GST') || d.documentType.toUpperCase().includes('TAX')
  );
  const panDoc = s.verificationDocuments?.find(d => 
    d.documentType.toUpperCase().includes('PAN') || d.documentType.toUpperCase().includes('ID')
  );
  const drugDoc = s.verificationDocuments?.find(d => 
    d.documentType.toUpperCase().includes('DRUG') || d.documentType.toUpperCase().includes('FSSAI') || d.documentType.toUpperCase().includes('LICENSE')
  );
  const bankDoc = s.verificationDocuments?.find(d => 
    d.documentType.toUpperCase().includes('BANK') || d.documentType.toUpperCase().includes('PASSBOOK') || d.documentType.toUpperCase().includes('CHEQUE')
  );

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
    city: s.address?.city || '—',
    businessType: undefined,
    gstin: gstinDoc?.documentNumber || undefined,
    pan: panDoc?.documentNumber || undefined,
    appliedDate: formatDate(s.createdAt),
    status,
    documents: {
      gstCertificate: Boolean(gstinDoc),
      panCard: Boolean(panDoc),
      fssaiDrugLicense: Boolean(drugDoc),
      bankPassbook: Boolean(bankDoc),
      storeFrontPhoto: Boolean(s.bannerUrl || s.logoUrl),
    },
    storeAddress: formatAddress(s.address),
    catalogCategory: undefined,
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
    email: u.email || '',
    phone: u.mobile,
    city: '—',
    totalOrders: 0,
    lifetimeSpend: 0,
    joinedDate: formatDate(u.createdAt),
    status: u.status === 'ACTIVE' ? 'Active' : 'Banned',
    avatarUrl: DEFAULT_AVATAR,
    lastOrderDate: formatDate(u.updatedAt),
  };
}

/**
 * Maps BackendIssue -> Frontend Issue
 */
export function mapBackendIssue(iss: BackendIssue): Issue {
  const isSellerReported = !iss.customerId || (typeof iss.description === 'string' && (iss.description.toLowerCase().includes('[seller') || iss.description.toLowerCase().includes('merchant')));

  // Safely extract orderId whether populated object or raw ObjectId string
  let orderInfo: Issue['orderId'] = null;
  if (iss.orderId && typeof iss.orderId === 'object' && '_id' in iss.orderId) {
    const ord = iss.orderId as any;
    orderInfo = {
      id: ord._id || '',
      orderNumber: ord.orderNumber || '—',
      status: ord.status || '—',
      totalAmount: typeof ord.totalPaise === 'number' ? ord.totalPaise / 100 : 0,
      createdAt: ord.createdAt ? formatDate(ord.createdAt) : '—',
    };
  } else if (typeof iss.orderId === 'string' && iss.orderId.length > 0) {
    orderInfo = {
      id: iss.orderId,
      orderNumber: iss.orderId.slice(-6).toUpperCase(),
      status: '—',
      totalAmount: 0,
      createdAt: '—',
    };
  }

  // Safely extract customerId whether populated object or raw ObjectId string
  let customerInfo: Issue['customerId'] = null;
  if (iss.customerId && typeof iss.customerId === 'object' && '_id' in iss.customerId) {
    const cust = iss.customerId as any;
    const mobileStr = cust.mobile || '';
    customerInfo = {
      id: cust._id || '',
      mobile: mobileStr || '—',
      name: cust.name || (mobileStr && mobileStr.length >= 4 ? `Customer (${mobileStr.slice(-4)})` : 'Customer Account'),
      email: cust.email || null,
    };
  } else if (typeof iss.customerId === 'string' && iss.customerId.length > 0) {
    customerInfo = {
      id: iss.customerId,
      mobile: '—',
      name: `Customer (${iss.customerId.slice(-4)})`,
      email: null,
    };
  }

  // Safely extract shopId whether populated object or raw ObjectId string
  let shopInfo: Issue['shopId'] = null;
  if (iss.shopId && typeof iss.shopId === 'object' && '_id' in iss.shopId) {
    const shp = iss.shopId as any;
    shopInfo = {
      id: shp._id || '',
      shopName: shp.shopName || 'Registered Merchant',
      phone: shp.phone || '—',
    };
  } else if (typeof iss.shopId === 'string' && iss.shopId.length > 0) {
    shopInfo = {
      id: iss.shopId,
      shopName: 'Merchant Shop',
      phone: '—',
    };
  }

  // Safely extract reviewedBy whether populated object or raw ObjectId string
  let reviewerInfo: Issue['reviewedBy'] = null;
  if (iss.reviewedBy && typeof iss.reviewedBy === 'object' && '_id' in iss.reviewedBy) {
    const rev = iss.reviewedBy as any;
    reviewerInfo = {
      id: rev._id || '',
      name: rev.name || null,
      mobile: rev.mobile || null,
    };
  } else if (typeof iss.reviewedBy === 'string' && iss.reviewedBy.length > 0) {
    reviewerInfo = {
      id: iss.reviewedBy,
      name: null,
      mobile: null,
    };
  }

  return {
    id: iss._id,
    orderId: orderInfo,
    customerId: customerInfo,
    shopId: shopInfo,
    orderStatusAtReport: iss.orderStatusAtReport || undefined,
    problemType: iss.problemType ? iss.problemType.replace(/_/g, ' ') : undefined,
    description: iss.description,
    status: iss.status,
    adminNotes: iss.adminNotes,
    reviewedBy: reviewerInfo,
    reviewedAt: iss.reviewedAt ? formatDate(iss.reviewedAt) : null,
    createdAt: formatDate(iss.createdAt),
    updatedAt: formatDate(iss.updatedAt),
    reporterType: isSellerReported ? 'SELLER' : 'CUSTOMER',
  };
}

/**
 * Maps BackendProductRequest -> Frontend ProductRequest
 */
export function mapBackendProductRequest(pr: BackendProductRequest): ProductRequest {
  const productName = pr.proposedName || pr.name || 'Untitled Product';

  let productImages: string[] = [];
  if (Array.isArray(pr.images) && pr.images.length > 0) {
    productImages = pr.images.filter(Boolean);
  } else if (pr.imageUrl) {
    productImages = [pr.imageUrl];
  }

  return {
    id: pr._id,
    shopId: pr.shopId ? {
      id: pr.shopId._id,
      shopName: pr.shopId.shopName,
      phone: pr.shopId.phone || pr.shopId.shopCode || '',
      shopCode: pr.shopId.shopCode,
    } : null,
    sellerId: pr.sellerId ? {
      id: pr.sellerId._id,
      name: pr.sellerId.name,
      mobile: pr.sellerId.mobile,
      email: pr.sellerId.email,
    } : null,
    name: productName,
    proposedName: pr.proposedName,
    description: pr.description || '',
    categoryId: pr.categoryId ? {
      id: pr.categoryId._id,
      name: pr.categoryId.name,
    } : null,
    brandId: pr.brandId ? {
      id: pr.brandId._id,
      name: pr.brandId.name,
    } : null,
    unitId: pr.unitId ? {
      id: pr.unitId._id,
      name: pr.unitId.name,
      code: pr.unitId.code,
    } : null,
    unitValue: pr.unitValue,
    imageUrl: pr.imageUrl || (productImages.length > 0 ? productImages[0] : undefined),
    images: productImages,
    status: pr.status,
    adminNotes: pr.adminNotes,
    reviewedBy: pr.reviewedBy ? {
      id: pr.reviewedBy._id,
      name: pr.reviewedBy.name,
    } : null,
    reviewedAt: pr.reviewedAt ? formatDate(pr.reviewedAt) : null,
    createdAt: formatDate(pr.createdAt),
    updatedAt: formatDate(pr.updatedAt),
  };
}


/**
 * Maps BackendGlobalSettings -> Frontend GlobalSettings
 */
export function mapBackendGlobalSettings(s: BackendGlobalSettings): GlobalSettings {
  return {
    key: s.key,
    universalSearchRadiusKm: s.universalSearchRadiusKm,
    globalDeliveryChargePaise: s.globalDeliveryChargePaise,
    globalDeliveryChargeRupees: s.globalDeliveryChargeRupees,
    updatedBy: s.updatedBy,
    updatedAt: formatDate(s.updatedAt),
  };
}

/**
 * Maps BackendAuditLog -> Frontend AuditLog
 */
export function mapBackendAuditLog(al: BackendAuditLog): AuditLog {
  return {
    id: al._id,
    actorId: al.actorId ? {
      id: al.actorId._id,
      role: al.actorId.role,
      email: al.actorId.email,
      name: al.actorId.name || 'Admin',
    } : null,
    actorRole: al.actorRole,
    action: al.action,
    targetType: al.targetType,
    targetId: al.targetId,
    changes: al.changes,
    ipAddress: al.ipAddress,
    createdAt: formatDate(al.createdAt),
  };
}

/**
 * Maps BackendShopRating -> Frontend ShopRating
 */
export function mapBackendShopRating(r: BackendShopRating): ShopRating {
  return {
    id: r._id,
    shopId: r.shopId,
    orderId: r.orderId,
    customerId: r.customerId ? {
      id: r.customerId._id,
      name: r.customerId.name,
      mobile: r.customerId.mobile,
    } : null,
    rating: r.rating,
    review: r.review,
    createdAt: formatDate(r.createdAt),
  };
}

