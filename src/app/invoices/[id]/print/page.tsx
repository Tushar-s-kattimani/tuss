'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { IndianRupee } from 'lucide-react';

import type { Invoice } from '@/lib/types';
import { customers } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function PrintInvoicePage({ params }: { params: { id: string } }) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const savedInvoice = sessionStorage.getItem('latestInvoice');
    if (savedInvoice) {
      const parsedInvoice: Invoice = JSON.parse(savedInvoice);
      // Ensure the ID matches to prevent showing the wrong invoice if navigating directly
      if (parsedInvoice.id === `inv-${params.id}`) {
        setInvoice(parsedInvoice);
      }
    }
  }, [params.id]);

  useEffect(() => {
    if (invoice) {
      // Use a timeout to ensure content is rendered before printing
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [invoice]);
  
  const logoPlaceholder = PlaceHolderImages.find(p => p.id === 'logo');
  const customer = customers.find(c => c.id === invoice?.customerId);

  if (!invoice) {
    return <div className="p-10 text-center">Loading invoice for printing...</div>;
  }

  return (
    <div className="bg-white text-black font-sans p-8 max-w-4xl mx-auto">
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none;
          }
        }
        body {
            background-color: #eee;
        }
      `}</style>
      <header className="flex justify-between items-start pb-4 border-b border-gray-300">
        <div>
          {logoPlaceholder && (
            <Image
              src={logoPlaceholder.imageUrl}
              alt="BevBooks Logo"
              width={200}
              height={50}
              data-ai-hint={logoPlaceholder.imageHint}
              priority
            />
          )}
          <h1 className="text-xs text-gray-600 mt-2">BevBooks Billing</h1>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold uppercase">Invoice</h2>
          <p className="text-sm">Invoice #: {invoice.invoiceNumber}</p>
          <p className="text-sm">Date: {format(new Date(invoice.date), 'dd MMM yyyy')}</p>
        </div>
      </header>

      <section className="flex justify-between items-start py-4">
        <div>
          <h3 className="font-bold text-sm mb-1">Bill To:</h3>
          <p className="font-bold">{customer?.name}</p>
          <p className="text-sm">{customer?.address}</p>
          <p className="text-sm">Phone: {customer?.phone}</p>
        </div>
      </section>

      <section>
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left font-bold">Item</th>
              <th className="p-2 text-right font-bold">Qty (Box)</th>
              <th className="p-2 text-right font-bold">Qty (Piece)</th>
              <th className="p-2 text-right font-bold">Rate</th>
              <th className="p-2 text-right font-bold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.productId} className="border-b border-gray-200">
                <td className="p-2">{item.productName}</td>
                <td className="p-2 text-right">{item.qtyBox > 0 ? item.qtyBox : '-'}</td>
                <td className="p-2 text-right">{item.qtyPiece > 0 ? item.qtyPiece : '-'}</td>
                <td className="p-2 text-right">
                  {item.qtyBox > 0 && <span>{item.priceBox.toFixed(2)}/box</span>}
                  {item.qtyBox > 0 && item.qtyPiece > 0 && <br />}
                  {item.qtyPiece > 0 && <span>{item.pricePiece.toFixed(2)}/pc</span>}
                </td>
                <td className="p-2 text-right font-mono">{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="flex justify-end pt-4">
        <div className="w-1/2 text-sm">
          <div className="flex justify-between py-1">
            <span className="font-bold">Subtotal:</span>
            <span className="font-mono">{invoice.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-bold">Discount ({invoice.discount.type === 'percentage' ? `${invoice.discount.value}%` : 'Flat'}):</span>
            <span className="font-mono">- {invoice.discountAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-300">
            <span className="font-bold">GST ({invoice.tax.value}%):</span>
            <span className="font-mono">+ {invoice.taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 text-xl font-bold">
            <span>Total:</span>
            <span className="font-mono flex items-center"><IndianRupee className="h-4 w-4 mr-1"/>{invoice.total.toFixed(2)}</span>
          </div>
        </div>
      </section>

      <footer className="text-center text-xs text-gray-500 pt-8 border-t border-gray-300 mt-4">
        <p>Thank you for your business!</p>
        <p>This is a computer-generated invoice.</p>
      </footer>
    </div>
  );
}