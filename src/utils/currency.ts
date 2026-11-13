// ==============================================================================
// BioPlant.AI - Indian Rupee Currency Formatter
// All prices displayed in INR (₹) with Indian number formatting (Lakhs / Crores)
// ==============================================================================

/** Format a rupee value with Indian number grouping (₹1,26,000) */
export function formatINR(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 1_00_00_000) {
      return `₹${(amount / 1_00_00_000).toFixed(2)} Cr`;
    }
    if (amount >= 1_00_000) {
      return `₹${(amount / 1_00_000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

/** Format a per-MT rupee price compactly e.g. ₹26,040 / MT */
export function formatINRperMT(pricePerMT: number): string {
  return `₹${pricePerMT.toLocaleString('en-IN')}`;
}

