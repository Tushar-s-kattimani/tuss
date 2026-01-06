'use client';

import React, { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { IndianRupee } from 'lucide-react';

import type { Invoice } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function PrintInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const savedInvoice = sessionStorage.getItem('latestInvoice');
    if (savedInvoice) {
      const parsedInvoice: Invoice = JSON.parse(savedInvoice);
      // Ensure the ID matches to prevent showing the wrong invoice if navigating directly
      if (parsedInvoice.id === `inv-${id}`) {
        setInvoice(parsedInvoice);
      }
    }
  }, [id]);

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

  if (!invoice) {
    return <div className="p-10 text-center">Loading invoice for printing...</div>;
  }

  return (
    <div className="bg-white text-black font-sans p-2 max-w-sm mx-auto">
      <style jsx global>{`
        @media print {
          @page {
            margin: 5mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background-color: #fff;
          }
          .no-print {
            display: none;
          }
        }
        body {
            background-color: #eee;
        }
      `}</style>
      <header className="flex justify-between items-start pb-2 border-b border-gray-300">
        <div>
          {logoPlaceholder && (
            <Image
              src={logoPlaceholder.imageUrl}
              alt="Ghajanan Enterprise Logo"
              width={150}
              height={40}
              data-ai-hint={logoPlaceholder.imageHint}
              priority
            />
          )}
          <h1 className="text-2xs text-gray-600 mt-1">Ghajanan Enterprise</h1>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-bold uppercase">Invoice</h2>
          <p className="text-xs">Inv #: {invoice.invoiceNumber}</p>
          <p className="text-xs">Date: {format(new Date(invoice.date), 'dd/MM/yy')}</p>
        </div>
      </header>

      <section className="py-2">
        <table className="w-full text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-1 text-left font-bold">Item</th>
              <th className="p-1 text-center font-bold">Box</th>
              <th className="p-1 text-center font-bold">Pcs</th>
              <th className="p-1 text-right font-bold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.productId} className="border-b border-gray-200">
                <td className="p-1">{item.productName}</td>
                <td className="p-1 text-center font-mono">{item.boxes || 0}</td>
                <td className="p-1 text-center font-mono">{item.pieces || 0}</td>
                <td className="p-1 text-right font-mono">{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="flex justify-end pt-2">
        <div className="w-1/2 text-xs">
          <div className="flex justify-between py-1">
            <span className="font-bold">Subtotal:</span>
            <span className="font-mono">{invoice.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 text-base font-bold border-t border-gray-300 mt-1">
            <span>Total:</span>
            <span className="font-mono flex items-center"><IndianRupee className="h-3 w-3 mr-1"/>{invoice.total.toFixed(2)}</span>
          </div>
        </div>
      </section>

      <footer className="text-center text-2xs text-gray-500 pt-4 border-t border-gray-300 mt-2">
        <p>Thank you for your business!</p>
        <p>Computer-generated invoice.</p>
      </footer>
    </div>
  );
}
