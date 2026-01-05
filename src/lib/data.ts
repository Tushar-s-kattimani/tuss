import type { Product, Customer, Invoice } from './types';
import { subDays } from 'date-fns';

export const products: Product[] = [
  { id: 'prod-001', name: 'Pepsi 500ml', sku: 'P500', category: 'Pepsi', priceBox: 240, pricePiece: 20, stock: 150, lowStockThreshold: 20 },
  { id: 'prod-002', name: '7Up 500ml', sku: '7U500', category: '7Up', priceBox: 240, pricePiece: 20, stock: 8, lowStockThreshold: 10 },
  { id: 'prod-003', name: 'Mirinda 500ml', sku: 'M500', category: 'Other', priceBox: 240, pricePiece: 20, stock: 120, lowStockThreshold: 20 },
  { id: 'prod-004', name: 'Mountain Dew 500ml', sku: 'MD500', category: 'Other', priceBox: 250, pricePiece: 22, stock: 90, lowStockThreshold: 20 },
  { id: 'prod-005', name: 'Pepsi Black 500ml', sku: 'PB500', category: 'Pepsi', priceBox: 300, pricePiece: 25, stock: 75, lowStockThreshold: 15 },
  { id: 'prod-006', name: '7Up Revive 500ml', sku: '7UR500', category: '7Up', priceBox: 280, pricePiece: 24, stock: 5, lowStockThreshold: 10 },
  { id: 'prod-007', name: 'Sting Energy 250ml', sku: 'SE250', category: 'Other', priceBox: 480, pricePiece: 20, stock: 200, lowStockThreshold: 30 },
  { id: 'prod-008', name: 'Pepsi 1.5L', sku: 'P1500', category: 'Pepsi', priceBox: 480, pricePiece: 40, stock: 60, lowStockThreshold: 10 },
  { id: 'prod-009', name: '7Up 1.5L', sku: '7U1500', category: '7Up', priceBox: 480, pricePiece: 40, stock: 40, lowStockThreshold: 10 },
];

export const customers: Customer[] = [
  { id: 'cust-001', name: 'Star General Store', phone: '9876543210', address: '123 Main St, Cityville', outstandingBalance: 1500.50 },
  { id: 'cust-002', name: 'Quick Mart', phone: '8765432109', address: '456 Oak Ave, Townsville', outstandingBalance: 0 },
  { id: 'cust-003', name: 'Daily Needs', phone: '7654321098', address: '789 Pine Ln, Villageton', outstandingBalance: 320.00 },
  { id: 'cust-004', name: 'Honest Grocers', phone: '6543210987', address: '101 Maple Dr, Suburbia', outstandingBalance: 8540.75 },
  { id: 'cust-005', name: 'Beverage Corner', phone: '5432109876', address: '212 Birch Rd, Hamlet', outstandingBalance: 210.00 },
];
