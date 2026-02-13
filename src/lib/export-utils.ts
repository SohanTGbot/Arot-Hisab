import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { formatCurrency, formatDate } from "@/lib/utils";

// Define Transaction Interface matching your data
interface Transaction {
    id: string;
    created_at: string;
    buyer_name?: string;
    seller_name?: string;
    fish_type?: string;
    gross_weight?: number;
    total_weight?: number;
    rate?: number;
    commission_amount?: number;
    base_amount?: number;
    final_amount?: number;
}

/**
 * Export transactions to PDF
 */
export const exportToPDF = (transactions: Transaction[], title: string = "Transaction Report", locale: string = "en") => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    // Table Columns
    const tableColumn = ["Date", "Buyer", "Seller", "Fish Type", "Weight (kg)", "Rate", "Commission", "Total"];

    // Table Rows
    const tableRows = transactions.map((t) => [
        formatDate(t.created_at, locale === 'bn' ? 'bn-BD' : 'en-IN'),
        t.buyer_name || "-",
        t.seller_name || "-",
        t.fish_type || "-",
        t.total_weight?.toFixed(3) || "0",
        t.rate?.toFixed(2) || "0",
        t.commission_amount?.toFixed(2) || "0",
        t.final_amount?.toFixed(2) || "0",
    ]);

    // Generate Table
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [22, 163, 74] }, // Green header like app theme
    });

    // Save
    doc.save(`${title.replace(/\s+/g, "_").toLowerCase()}_${new Date().toISOString().split("T")[0]}.pdf`);
};

/**
 * Export transactions to Excel
 */
export const exportToExcel = (transactions: Transaction[], fileName: string = "transactions", locale: string = "en") => {
    // Prepare data for Excel
    const data = transactions.map((t) => ({
        Date: formatDate(t.created_at, locale === 'bn' ? 'bn-BD' : 'en-IN'),
        "Buyer Name": t.buyer_name || "-",
        "Seller Name": t.seller_name || "-",
        "Fish Type": t.fish_type || "-",
        "Gross Weight (kg)": t.gross_weight || 0,
        "Net Weight (kg)": t.total_weight || 0,
        "Rate (₹)": t.rate || 0,
        "Base Amount (₹)": t.base_amount || 0,
        "Commission (₹)": t.commission_amount || 0,
        "Final Amount (₹)": t.final_amount || 0,
    }));

    // Create Worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create Workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    // Save
    XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split("T")[0]}.xlsx`);
};
