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
