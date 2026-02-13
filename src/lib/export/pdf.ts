import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Tables } from '@/types/supabase';
import { formatCurrency, formatWeight } from '@/lib/calculations';

type Transaction = Tables<'transactions'>;

interface ExportOptions {
    filename?: string;
    includeDeleted?: boolean;
    title?: string;
}

/**
 * Export transactions to PDF
 */
export function exportTransactionsToPDF(
    transactions: Transaction[],
    options: ExportOptions = {}
): void {
    const {
        filename = `transactions_${new Date().toISOString().split('T')[0]}.pdf`,
        includeDeleted = false,
        title = 'Transaction Report',
    } = options;

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 15);

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 22);

    // Filter out deleted transactions if needed
    const filteredTransactions = includeDeleted
        ? transactions
        : transactions.filter((t) => !t.is_deleted);

    // Prepare table data
    const tableData = filteredTransactions.map((t) => [
        t.seller_name || '-',
        formatWeight(t.gross_weight_kg),
        formatWeight(t.net_weight_kg),
        formatCurrency(t.rate_per_kg, false),
        formatCurrency(t.base_amount, false),
        formatCurrency(t.final_amount, false),
        t.buyer_name || '-',
    ]);

    // Add table
    autoTable(doc, {
        startY: 28,
        head: [['Seller', 'Gross (kg)', 'Net (kg)', 'Rate', 'Base', 'Final', 'Buyer']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
        styles: { fontSize: 9 },
        columnStyles: {
            2: { halign: 'right' },
            3: { halign: 'right' },
            4: { halign: 'right' },
            5: { halign: 'right' },
        },
    });

    // Add summary
    const totals = calculateTotals(filteredTransactions);
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(10);
    doc.text(`Total Transactions: ${filteredTransactions.length}`, 14, finalY);
    doc.text(`Total Amount: ${formatCurrency(totals.totalFinalAmount)}`, 14, finalY + 7);

    // Save PDF
    doc.save(filename);
}

/**
 * Calculate transaction totals
 */
function calculateTotals(transactions: Transaction[]) {
    return transactions.reduce(
        (acc, t) => ({
            totalGrossWeight: acc.totalGrossWeight + t.gross_weight_kg,
            totalNetWeight: acc.totalNetWeight + t.net_weight_kg,
            totalBaseAmount: acc.totalBaseAmount + t.base_amount,
            totalFinalAmount: acc.totalFinalAmount + t.final_amount,
        }),
        {
            totalGrossWeight: 0,
            totalNetWeight: 0,
            totalBaseAmount: 0,
            totalFinalAmount: 0,
        }
    );
}
