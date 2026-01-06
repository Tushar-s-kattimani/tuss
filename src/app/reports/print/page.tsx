
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { IndianRupee } from 'lucide-react';

import type { ReportData } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function PrintReportPage() {
  const [report, setReport] = useState<ReportData | null>(null);

  useEffect(() => {
    const savedReport = sessionStorage.getItem('latestReport');
    if (savedReport) {
      const parsedReport: ReportData = JSON.parse(savedReport);
      setReport(parsedReport);
    }
  }, []);

  useEffect(() => {
    if (report) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [report]);
  
  const logoPlaceholder = PlaceHolderImages.find(p => p.id === 'logo');

  if (!report) {
    return <div className="p-10 text-center">Loading report for printing...</div>;
  }

  return (
    <div className="bg-white text-black font-sans p-4 md:p-8 max-w-4xl mx-auto my-4 md:my-8 shadow-lg print-container">
      <style jsx global>{`
        @media print {
          @page {
            margin: 5mm;
          }
          body, html, div, img {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          body, html {
            background-color: #fff !important;
          }
          .no-print {
            display: none;
          }
          .print-container {
            margin: 0;
            padding: 0;
            box-shadow: none;
            max-width: 100%;
          }
        }
        body {
            background-color: #eee;
        }
      `}</style>
      <div>
        <header className="flex justify-between items-start pb-4 border-b border-gray-300">
          <div>
            {logoPlaceholder && (
              <Image
                src={logoPlaceholder.imageUrl}
                alt="Ghajanan Enterprise Logo"
                width={150}
                height={40}
                data-ai-hint={logoPlaceholder.imageHint}
                priority
                unoptimized
              />
            )}
            <h1 className="text-sm text-gray-600 mt-1">Ghajanan Enterprise</h1>
          </div>
          <div className="text-right">
            <h2 className="text-xl md:text-2xl font-bold uppercase">Sales Report</h2>
            <p className="text-sm">Date: {format(new Date(), 'dd/MM/yy')}</p>
            <p className="text-sm">Period: {report.dateRange.from} - {report.dateRange.to}</p>
          </div>
        </header>

        <section className="py-4">
          <h3 className="text-lg font-bold mb-2">Sales Summary by Product</h3>
          <table className="w-full text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left font-bold">Product</th>
                <th className="p-2 text-center font-bold">Boxes</th>
                <th className="p-2 text-center font-bold">Pieces</th>
                <th className="p-2 text-right font-bold">Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {report.productSummary.map((item) => (
                <tr key={item.productId} className="border-b border-gray-200">
                  <td className="p-2">{item.productName}</td>
                  <td className="p-2 text-center font-mono">{item.totalBoxes || 0}</td>
                  <td className="p-2 text-center font-mono">{item.totalPieces || 0}</td>
                  <td className="p-2 text-right font-mono">{item.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="flex justify-end pt-4">
          <div className="w-full md:w-1/2 lg:w-1/3 text-sm md:text-base">
            <div className="flex justify-between py-1">
              <span className="font-bold">Total Invoices:</span>
              <span className="font-mono">{report.totalInvoices}</span>
            </div>
            <div className="flex justify-between py-2 text-lg md:text-xl font-bold border-t border-gray-300 mt-2">
              <span>Grand Total Revenue:</span>
              <span className="font-mono flex items-center"><IndianRupee className="h-4 w-4 md:h-5 md:w-5 mr-1"/>{report.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </section>

        <footer className="text-center text-xs text-gray-500 pt-6 border-t border-gray-300 mt-4">
          <p>Computer-generated report.</p>
        </footer>
      </div>
    </div>
  );
}
