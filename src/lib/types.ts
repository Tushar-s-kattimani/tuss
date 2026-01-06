export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  priceBox: number;
  pricePiece: number;
  stock: number;
  lowStockThreshold: number;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  boxes?: number;
  pieces?: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  total: number;
}

export interface ProductSummary {
  productId: string;
  productName: string;
  totalBoxes: number;
  totalPieces: number;
  totalAmount: number;
}

export interface ReportData {
    dateRange: {
        from: string;
        to: string;
    };
    productSummary: ProductSummary[];
    grandTotal: number;
    totalInvoices: number;
}
