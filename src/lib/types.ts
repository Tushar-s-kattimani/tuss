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
  discount: {
    type: 'percentage' | 'flat';
    value: number;
  };
  discountAmount: number;
  tax: {
    type: 'gst';
    value: number; // Stored as a percentage value, e.g., 5 for 5%
  };
  taxAmount: number;
  total: number;
}
