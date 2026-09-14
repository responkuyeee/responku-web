export { cn } from 'cn';

export { getCookie } from './server-utils';

/**
 * Formats a numeric value into an Indonesian Rupiah (IDR) currency string.
 *
 * @param {number} value - The numeric value to format.
 * @returns {string} The formatted IDR currency string (e.g., "Rp 10.000").
 */
export function formatRupiah(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}
