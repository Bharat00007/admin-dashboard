import { Product, Category, Brand, Unit, Seller, Customer, SellerApprovalRequest } from '../types';

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Royal Canin Fit 32 Adult Cat Dry Food',
    sku: 'SKU-RC-882190',
    brand: 'Royal Canin',
    category: 'Cat Food',
    unit: '2 kg',
    description: 'Nutritionally balanced kibble specifically formulated for adult domestic felines with standard outdoor/indoor access.',
    status: 'Active',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgvyGMkt8xX7Y91SatuUozJCFXEz9nVgHlv1U3vOJ2_UgQXvhfo3upEcSw_m0f_9d75TR0YgAM66g9LczAvu8p7Tw9NobjyOBLJKjoVp5Lx_29ii9kx32YinSx-M14xaW_QsXW_3MKtZv5RlX_sgVbO2adNgDDqEVTVpMu8jdQSEhplPhWQCEDkkjN7vvdiquGkBl8s-TTZd7RuEgYaIJsM7dMPK50eNrG9o2ppkAC',
    price: 1850,
    stock: 42
  },
  {
    id: 'prod-2',
    name: 'Drools Optimum Performance Dog Food 10kg',
    sku: 'SKU-DRL-410982',
    brand: 'Drools',
    category: 'Dog Food',
    unit: '10 kg',
    description: 'Real chicken formula with essential vitamins and digestive enzymes for daily athletic performance.',
    status: 'Active',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4IAKeEg90YRDU3h3EAAol9E0_Jk-6C8vaPkSu1vo28npkbB5KNZemCkreN24bkdbFwsqKmiLKQbl1YYE3LAEOcYSpCljp9yYZrmhRIb8sTNBtwqoe8r32Dz-D_idMs8yL0BbMD0_S69bJixxrqVTCcBm2pM5p9mRYrMjbElPuuk_6DfyzVVlngVbSNxK7OxFVeSsWoeBC5uH5vDlznnLWKU4KhoxHMiGZrZ1yChLn',
    price: 2499,
    stock: 78
  },
  {
    id: 'prod-3',
    name: 'Gotails Super Clumping Unscented Cat Litter 10L',
    sku: 'SKU-GT-009134',
    brand: 'Gotails Essentials',
    category: 'Cat Litter',
    unit: '10 L',
    description: 'Fast clumping 100% natural bentonite clay with 99.9% dust free processing for maximum odor control.',
    status: 'Active',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0piErTriAwoa_pIYhKENIYBzjr-tPnw7UNoMXSnTsidq-JGd2HRm19yU764uvFIq8GHaVxta5Cz1uoTCCBjqRekNWsUeXvCOmJBS6otzTRHUEKhvKHabdTmnX9VllMcDGMvxQVjIOo88LQ7de0GfqhyWshEDswDxJRKmGONYQxpXOylkX_Vj_KIE2Mlb-CGOf9XiguuwuogV92b8vXioh-mjnvognlYJOvQJs4gur',
    price: 899,
    stock: 130
  },
  {
    id: 'prod-4',
    name: 'Himalaya Erina-EP Flea & Tick Shampoo 200ml',
    sku: 'SKU-HIM-112004',
    brand: 'Himalaya Pet',
    category: 'Pet Grooming',
    unit: '200 ml',
    description: 'Ayurvedic proprietary formulation with Eucalyptus and Neem for safe insect repellent bath care.',
    status: 'Active',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDDIbRX7tiYxlbFJHhJrk1-9u0MIZJerAPdAebmVzSbvNnaM-jXa0P4XwMacCkFbpzG-QJBjvlnLRb0IpSO_AdXVjH6xeilYvkpgbVo8iGvY2RZJNqNj6rsLsvHZA_ZHZi2tN0kziBHXUiAlLOfP0tgQferI8SgK5rdxmYdGS2saf9DYPImh69ApIcs5oDpU0v7lXf0A6hgtgkKDer1UVPe3zRYUjhTjDCTHYh8XdN',
    price: 320,
    stock: 95
  },
  {
    id: 'prod-5',
    name: 'Kong Classic Dog Chew Toy - Large',
    sku: 'SKU-KNG-770412',
    brand: 'Kong',
    category: 'Dog Toys',
    unit: '1 pc',
    description: 'Standard red rubber compound engineered specifically for persistent chewers; treat stuffing design.',
    status: 'Active',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9BtEgeX3e--rWoLQBhetwyUGgTll1I5pi1Gs5q6MwByZi6wFKmuslBqhhpK7ZxMv-TWRlUV-w5U6I4xzONe2VKeyLsW-xHcZSnwTPN7U0w9bM8el6RGNvc24PxuADUuMT3KWsKnTFy38YTLyJMLWCb1wIxEhGqNzRo15-yEVfxwPwQmjaxdpxJz-b1GtCBmuIYwvWCny1XzqxajbBwANTUugfs30IPFBwQt7qxC50',
    price: 1150,
    stock: 55
  },
  {
    id: 'prod-6',
    name: 'Whiskas Ocean Fish Adult Cat Food 1.2kg',
    sku: 'SKU-WHK-552910',
    brand: 'Whiskas',
    category: 'Cat Food',
    unit: '1.2 kg',
    description: 'Dry cat food pockets packed with real fish protein, zinc, and vitamin A for fur shine.',
    status: 'Inactive',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaIjZ2iPoN0yhoH5wjr-42zUGROrIbfCK9XJTuKhyaBOKHQnzf21UOpljl_uYTUToXRVowUxTZj9FawN7PlqBXhFP0rlSg0dphX9CYhdfpjUkO6ZQXKOaTEXbsMN0VSxR7vi8DceZGknAqosmscNmz4oVPHnJbjaSXhwftZbLig9F2ThoL_tyvYe0pt9cvuAvGk1hyZW0cJGdFKdjdzdyV-qpmA8zitxtVLDIRnlmW',
    price: 499,
    stock: 0
  }
];

export const initialCategories: Category[] = [
  {
    id: 'cat-1',
    code: 'CAT-DOG-FOOD',
    name: 'Dog Food',
    description: 'Dry kibbles, wet gravy pouches, puppy growth formulas, and prescription diet blends.',
    productCount: 142,
    commission: 8,
    status: 'Active',
    icon: 'pets',
    color: '#3d7ff0'
  },
  {
    id: 'cat-2',
    code: 'CAT-CAT-FOOD',
    name: 'Cat Food',
    description: 'Feline dry kibbles, canned pate, salmon gravies, kitten milk replacers, and hairball control.',
    productCount: 118,
    commission: 8,
    status: 'Active',
    icon: 'pets',
    color: '#ff963f'
  },
  {
    id: 'cat-3',
    code: 'CAT-CAT-LITTER',
    name: 'Cat Litter & Hygiene',
    description: 'Bentonite clay clumping litter, silica crystals, tofu organic granules, and deodorizers.',
    productCount: 45,
    commission: 10,
    status: 'Active',
    icon: 'cleaning_services',
    color: '#2eaf65'
  },
  {
    id: 'cat-4',
    code: 'CAT-GROOMING',
    name: 'Pet Grooming & Spa',
    description: 'Anti-tick shampoos, deshedding brushes, ear cleaning wipes, and paw moisturizers.',
    productCount: 76,
    commission: 12,
    status: 'Active',
    icon: 'soap',
    color: '#0057bf'
  },
  {
    id: 'cat-5',
    code: 'CAT-TOYS',
    name: 'Toys & Accessories',
    description: 'Rubber chew toys, teaser wands, orthopedic beds, nylon collars, and training leashes.',
    productCount: 92,
    commission: 15,
    status: 'Active',
    icon: 'sports_baseball',
    color: '#934b00'
  },
  {
    id: 'cat-6',
    code: 'CAT-HEALTH',
    name: 'Veterinary Healthcare',
    description: 'Calcium supplements, joint care tabs, flea spot-ons, wound sprays, and oral pastes.',
    productCount: 54,
    commission: 6,
    status: 'Active',
    icon: 'medical_services',
    color: '#ba1a1a'
  }
];

export const initialBrands: Brand[] = [
  {
    id: 'br-1',
    name: 'Royal Canin',
    origin: 'France (Mars Petcare)',
    productCount: 48,
    website: 'royalcanin.com',
    status: 'Active',
    logoUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=100&auto=format&fit=crop&q=80',
    isFeatured: true
  },
  {
    id: 'br-2',
    name: 'Drools',
    origin: 'India (IB Group)',
    productCount: 64,
    website: 'drools.com',
    status: 'Active',
    logoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&auto=format&fit=crop&q=80',
    isFeatured: true
  },
  {
    id: 'br-3',
    name: 'Gotails Essentials',
    origin: 'In-House Brand',
    productCount: 32,
    website: 'gotails.in',
    status: 'Active',
    logoUrl: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=100&auto=format&fit=crop&q=80',
    isFeatured: true
  },
  {
    id: 'br-4',
    name: 'Himalaya Pet',
    origin: 'India (Himalaya Wellness)',
    productCount: 28,
    website: 'himalayawellness.in',
    status: 'Active',
    logoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&auto=format&fit=crop&q=80',
    isFeatured: false
  },
  {
    id: 'br-5',
    name: 'Kong',
    origin: 'Golden, Colorado, USA',
    productCount: 19,
    website: 'kongcompany.com',
    status: 'Active',
    logoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=100&auto=format&fit=crop&q=80',
    isFeatured: true
  },
  {
    id: 'br-6',
    name: 'Whiskas',
    origin: 'USA (Mars Petcare)',
    productCount: 37,
    website: 'whiskas.com',
    status: 'Active',
    logoUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=100&auto=format&fit=crop&q=80',
    isFeatured: false
  }
];

export const initialUnits: Unit[] = [
  {
    id: 'u-1',
    name: 'Kilogram',
    code: 'kg',
    type: 'Weight',
    precision: 2,
    status: 'Active',
    skuCount: 124
  },
  {
    id: 'u-2',
    name: 'Gram',
    code: 'g',
    type: 'Weight',
    precision: 0,
    status: 'Active',
    skuCount: 88
  },
  {
    id: 'u-3',
    name: 'Litre',
    code: 'L',
    type: 'Volume',
    precision: 2,
    status: 'Active',
    skuCount: 35
  },
  {
    id: 'u-4',
    name: 'Millilitre',
    code: 'ml',
    type: 'Volume',
    precision: 0,
    status: 'Active',
    skuCount: 42
  },
  {
    id: 'u-5',
    name: 'Piece',
    code: 'pc',
    type: 'Count',
    precision: 0,
    status: 'Active',
    skuCount: 195
  },
  {
    id: 'u-6',
    name: 'Pack',
    code: 'pk',
    type: 'Package',
    precision: 0,
    status: 'Active',
    skuCount: 60
  }
];

export const initialSellers: Seller[] = [
  {
    id: 'sel-101',
    shopName: 'Paws & Whiskers Superstore',
    ownerName: 'Rahul Sharma',
    email: 'rahul@pawswhiskers.in',
    phone: '+91 98450 12345',
    city: 'Bangalore (Indiranagar)',
    address: '42, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, KA - 560038',
    rating: 4.8,
    totalOrders: 1420,
    gmv: '₹14,25,000',
    commissionRate: 12.5,
    kycStatus: 'Verified',
    status: 'Active',
    logoUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=120&auto=format&fit=crop&q=80',
    joinedDate: '12 Jan 2025',
    operatingHours: '09:00 AM – 09:30 PM (All Days)',
    bankAccount: {
      accountNumber: '921020048192841',
      bankName: 'HDFC Bank, Indiranagar',
      ifsc: 'HDFC0001248',
      holderName: 'Paws & Whiskers Retail LLP'
    },
    gstin: '29ABCDE1234F1Z5',
    pan: 'ABCDE1234F'
  },
  {
    id: 'sel-102',
    shopName: 'Barking Lot Pet Mart',
    ownerName: 'Priya Patel',
    email: 'priya@barkinglot.com',
    phone: '+91 98200 54321',
    city: 'Mumbai (Bandra West)',
    address: '15, Hill Road, Opposite Mehboob Studio, Bandra West, Mumbai, MH - 400050',
    rating: 4.6,
    totalOrders: 980,
    gmv: '₹9,80,000',
    commissionRate: 10.0,
    kycStatus: 'Verified',
    status: 'Active',
    logoUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=120&auto=format&fit=crop&q=80',
    joinedDate: '24 Feb 2025',
    operatingHours: '10:00 AM – 09:00 PM (Mon-Sat)',
    bankAccount: {
      accountNumber: '50100239482109',
      bankName: 'ICICI Bank, Bandra West',
      ifsc: 'ICIC0000018',
      holderName: 'Barking Lot Pet Mart'
    },
    gstin: '27AABCB9876C1Z1',
    pan: 'AABCB9876C'
  },
  {
    id: 'sel-103',
    shopName: 'Happy Tails Pharmacy & Care',
    ownerName: 'Dr. Vikram Rao',
    email: 'dr.rao@happytails.care',
    phone: '+91 98111 67890',
    city: 'New Delhi (South Extension)',
    address: 'G-12, South Extension Part 2, New Delhi, DL - 110049',
    rating: 4.9,
    totalOrders: 2150,
    gmv: '₹22,10,000',
    commissionRate: 8.0,
    kycStatus: 'Verified',
    status: 'Active',
    logoUrl: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=120&auto=format&fit=crop&q=80',
    joinedDate: '05 Nov 2024',
    operatingHours: '08:30 AM – 10:00 PM (Emergency 24x7)',
    bankAccount: {
      accountNumber: '003405001294',
      bankName: 'State Bank of India, South Ext',
      ifsc: 'SBIN0000742',
      holderName: 'Happy Tails Healthcare Pvt Ltd'
    },
    gstin: '07AAACH4567D1Z8',
    pan: 'AAACH4567D'
  },
  {
    id: 'sel-104',
    shopName: 'Furry Friends Corner',
    ownerName: 'Sneha Kulkarni',
    email: 'sneha@furryfriends.in',
    phone: '+91 97654 32109',
    city: 'Pune (Kothrud)',
    address: 'Shop 8, DP Road, Near City Pride, Kothrud, Pune, MH - 411038',
    rating: 3.8,
    totalOrders: 310,
    gmv: '₹2,40,000',
    commissionRate: 12.0,
    kycStatus: 'Pending',
    status: 'Banned',
    logoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=120&auto=format&fit=crop&q=80',
    joinedDate: '15 Mar 2025',
    operatingHours: '10:30 AM – 08:30 PM (Closed Tuesday)',
    bankAccount: {
      accountNumber: '394820194820',
      bankName: 'Axis Bank, Kothrud',
      ifsc: 'UTIB0000214',
      holderName: 'Sneha Kulkarni'
    },
    gstin: '27AAMFS3412E1Z9',
    pan: 'AAMFS3412E'
  },
  {
    id: 'sel-105',
    shopName: 'Animal Kingdom Depot',
    ownerName: 'Rajesh Reddy',
    email: 'rajesh@animalkingdom.com',
    phone: '+91 99887 65432',
    city: 'Hyderabad (Jubilee Hills)',
    address: 'Road No 36, Beside Peddamma Temple Metro, Jubilee Hills, Hyderabad, TG - 500033',
    rating: 4.4,
    totalOrders: 820,
    gmv: '₹8,90,000',
    commissionRate: 11.0,
    kycStatus: 'Verified',
    status: 'Active',
    logoUrl: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=120&auto=format&fit=crop&q=80',
    joinedDate: '18 Apr 2025',
    operatingHours: '09:30 AM – 09:30 PM',
    bankAccount: {
      accountNumber: '109283746192',
      bankName: 'Kotak Mahindra Bank, Jubilee Hills',
      ifsc: 'KKBK0000552',
      holderName: 'Animal Kingdom Enterprises'
    },
    gstin: '36AABCA7788P1Z6',
    pan: 'AABCA7788P'
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@example.com',
    phone: '+91 98451 90211',
    city: 'Bangalore, KA',
    totalOrders: 24,
    lifetimeSpend: 48520,
    joinedDate: '14 Aug 2024',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    lastOrderDate: 'Yesterday, 04:30 PM'
  },
  {
    id: 'cust-2',
    name: 'Rohan Verma',
    email: 'rohan.v@example.com',
    phone: '+91 98201 44329',
    city: 'Mumbai, MH',
    totalOrders: 18,
    lifetimeSpend: 32100,
    joinedDate: '29 Sep 2024',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    lastOrderDate: '2 days ago'
  },
  {
    id: 'cust-3',
    name: 'Meera Nambiar',
    email: 'meera.n@example.com',
    phone: '+91 99401 88712',
    city: 'Chennai, TN',
    totalOrders: 31,
    lifetimeSpend: 64900,
    joinedDate: '03 Jan 2024',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    lastOrderDate: '3 days ago'
  },
  {
    id: 'cust-4',
    name: 'Amitav Sen',
    email: 'amitav.sen@example.com',
    phone: '+91 98302 77190',
    city: 'Kolkata, WB',
    totalOrders: 5,
    lifetimeSpend: 7250,
    joinedDate: '11 Oct 2025',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    lastOrderDate: '18 Oct 2025'
  },
  {
    id: 'cust-5',
    name: 'Sandeep Joshi',
    email: 'sandeep.j@example.com',
    phone: '+91 97640 11984',
    city: 'Pune, MH',
    totalOrders: 12,
    lifetimeSpend: 19800,
    joinedDate: '20 May 2024',
    status: 'Banned',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80',
    lastOrderDate: '02 Sep 2025'
  }
];

export const initialApprovals: SellerApprovalRequest[] = [
  {
    id: 'app-501',
    shopName: 'Canine Care & Nutrition Supplies',
    applicantName: 'Amit Saxena',
    email: 'amit@caninecare.in',
    phone: '+91 98101 22334',
    city: 'Gurgaon (Sector 29), HR',
    businessType: 'Retailer',
    gstin: '07AAAAA0000A1Z5',
    pan: 'AAAAA0000A',
    appliedDate: 'Today, 11:20 AM',
    status: 'Pending',
    documents: {
      gstCertificate: true,
      panCard: true,
      fssaiDrugLicense: true,
      bankPassbook: true,
      storeFrontPhoto: true
    },
    storeAddress: 'Booth 104, Sector 29 Main Market, Gurugram, Haryana - 122002',
    catalogCategory: 'Dog Food & Premium Grooming'
  },
  {
    id: 'app-502',
    shopName: 'Purrfect Corner Pet Boutique',
    applicantName: 'Shweta Roy',
    email: 'shweta@purrfectcorner.com',
    phone: '+91 98310 99887',
    city: 'Kolkata (Salt Lake), WB',
    businessType: 'Retailer',
    gstin: '19BBBBB1111B1Z2',
    pan: 'BBBBB1111B',
    appliedDate: 'Today, 08:45 AM',
    status: 'Pending',
    documents: {
      gstCertificate: true,
      panCard: true,
      fssaiDrugLicense: false,
      bankPassbook: true,
      storeFrontPhoto: true
    },
    storeAddress: 'Block CF, Sector 1, Salt Lake City, Bidhannagar, Kolkata - 700064',
    catalogCategory: 'Cat Toys, Towers & Organic Litter'
  },
  {
    id: 'app-503',
    shopName: 'VetMed Express Veterinary Supplies',
    applicantName: 'Dr. Aniket Patil',
    email: 'aniket@vetmedexpress.com',
    phone: '+91 99220 44556',
    city: 'Pune (Baner), MH',
    businessType: 'Pharmacy',
    gstin: '27CCCCC2222C1Z3',
    pan: 'CCCCC2222C',
    appliedDate: 'Yesterday, 03:15 PM',
    status: 'Under Review',
    documents: {
      gstCertificate: true,
      panCard: true,
      fssaiDrugLicense: true,
      bankPassbook: true,
      storeFrontPhoto: true
    },
    storeAddress: 'High Street Plaza, Baner Road, Baner, Pune, Maharashtra - 411045',
    catalogCategory: 'Prescription Diets, Antibiotics & Post-Op Care'
  }
];

