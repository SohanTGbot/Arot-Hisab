import * as XLSX from 'xlsx';
import { Tables } from '@/types/supabase';

type Transaction = Tables<'transactions'>;

interface ExportOptions {
    filename?: string;
    includeDeleted?: boolean;
    sheetName?: string;
}

/**
 * Export transactions to Excel
 */
export function exportTransactionsToExcel(
    transactions: Transaction[],
    options: ExportOptions = {}
): void {
    const {
        filename = `transactions_${new Date().toISOString().split('T')[0]}.xlsx`,
        includeDeleted = false,
        sheetName = 'Transactions',
    } = options;

    // Filter out deleted transactions if needed
    const filteredTransactions = includeDeleted
        ? transactions
        : transactions.filter((t) => !t.is_deleted);

    // Prepare data for Excel
    const data = filteredTransactions.map((t) => ({
        'Date': new Date(t.created_at).toLocaleDateString('en-IN'),
        'Seller Name': t.seller_name || '',
        'Gross Weight (kg)': t.gross_weight_kg,
        'Net Weight (kg)': t.net_weight_kg,
        'Deduction Method': t.deduction_method,
        'Rate per kg (₹)': t.rate_per_kg,
        'Base Amount (₹)': t.base_amount,
        'Commission %': t.commission_percent,
        'Final Amount (₹)': t.final_amount,
        'Buyer Name': t.buyer_name || '',
        'Buyer Address': t.buyer_address || '',
        'Notes': t.notes || '',
    }));

    // Calculate totals
    const totals = {
        'Date': 'TOTAL',
        'Seller Name': '',
        'Gross Weight (kg)': data.reduce((sum, t) => sum + t['Gross Weight (kg)'], 0),
        'Net Weight (kg)': data.reduce((sum, t) => sum + t['Net Weight (kg)'], 0),
        'Deduction Method': '',
        'Rate per kg (₹)': '',
        'Base Amount (₹)': data.reduce((sum, t) => sum + t['Base Amount (₹)'], 0),
        'Commission %': '',
        'Final Amount (₹)': data.reduce((sum, t) => sum + t['Final Amount (₹)'], 0),
        'Buyer Name': '',
        'Buyer Address': '',
        'Notes': '',
    };

    // Add totals row
    data.push(totals as any);

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Set column widths
    const columnWidths = [
        { wch: 12 }, // Date
        { wch: 20 }, // Seller Name
        { wch: 15 }, // Gross Weight
        { wch: 15 }, // Net Weight
        { wch: 12 }, // Deduction Method
        { wch: 12 }, // Rate
        { wch: 15 }, // Base Amount
        { wch: 12 }, // Commission %
        { wch: 15 }, // Final Amount
        { wch: 20 }, // Buyer Name
        { wch: 30 }, // Buyer Address
        { wch: 30 }, // Notes
    ];
    worksheet['!cols'] = columnWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Save file
    XLSX.writeFile(workbook, filename);
}

/**
 * Export daily summary to Excel
 */
export function exportDailySummaryToExcel(
    summaries: Tables<'daily_summaries'>[],
    filename: string = `daily_summary_${new Date().toISOString().split('T')[0]}.xlsx`
): void {
    const data = summaries.map((s) => ({
        'Date': new Date(s.date).toLocaleDateString('en-IN'),
        'Total Transactions': s.total_transactions,
        'Total Gross Weight (kg)': s.total_gross_weight,
        'Total Net Weight (kg)': s.total_net_weight,
        'Total Base Amount (₹)': s.total_base_amount,
        'Total Commission (₹)': s.total_commission,
        'Total Final Amount (₹)': s.total_final_amount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daily Summary');

    XLSX.writeFile(workbook, filename);
}
