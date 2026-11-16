/**
 * Centralized formatting utilities for GoTails Admin Panel
 */

/**
 * Formats integer Paise into INR currency display (e.g. 45000 paise -> "₹450.00")
 */
export function formatPaiseToRupees(paise?: number | null): string {
  if (typeof paise !== 'number' || isNaN(paise)) return '₹0';
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: rupees % 1 === 0 ? 0 : 2,
  }).format(rupees);
}

/**
 * Converts Rupees float/number to integer Paise (e.g. 450 -> 45000)
 */
export function rupeesToPaise(rupees?: number | string | null): number {
  if (rupees === undefined || rupees === null || rupees === '') return 0;
  const num = typeof rupees === 'string' ? parseFloat(rupees.replace(/[^0-9.]/g, '')) : rupees;
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
}

/**
 * Formats ISO date string into readable display (e.g. "Nov 10, 2026")
 */
export function formatDate(isoDate?: string | null): string {
  if (!isoDate) return '—';
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return isoDate;
  }
}

/**
 * Formats backend structured address object into a single readable string
 */
export function formatAddress(address?: {
  street?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  landmark?: string | null;
} | string | null): string {
  if (!address) return 'No address provided';
  if (typeof address === 'string') return address;
  const parts = [
    address.street,
    address.landmark,
    address.city,
    address.state,
    address.pincode,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'No address provided';
}

/**
 * Safely capitalizes a status string (e.g. "PENDING" -> "Pending")
 */
export function formatStatus(status?: string | null): string {
  if (!status) return '—';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}
