
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
    <div className="bg-gray-100 flex justify-center">
        <div className="bg-white text-black font-sans p-4 w-full max-w-[320px] mx-auto my-4 shadow-lg print-container">
            <style jsx global>{`
                @media print {
                    @page {
                        margin: 2mm;
                    }
                    body {
                        background-color: #fff !important;
                    }
                    .print-container {
                        margin: 0;
                        padding: 0;
                        box-shadow: none;
                        width: 80mm;
                        max-width: 80mm;
                        min-width: 80mm;
                        border: none;
                    }
                    .no-print {
                        display: none;
                    }
                    body, html, div, img {
                        -webkit-print-color-adjust: exact;
                        color-adjust: exact;
                    }
                }
                body {
                    background-color: #eee;
                }
            `}</style>
            <div>
                <header className="flex justify-between items-start pb-2 border-b border-gray-300">
                    <div>
                        {logoPlaceholder && (
                        <Image
                            src={logoPlaceholder.imageUrl}
                            alt="Ghajanan Enterprise Logo"
                            width={120}
                            height={32}
                            data-ai-hint={logoPlaceholder.imageHint}
                            priority
                            unoptimized
                        />
                        )}
                        <h1 className="text-xs text-gray-600 mt-1">Ghajanan Enterprise</h1>
                    </div>
                    <div className="text-right">
                        <h2 className="text-lg font-bold uppercase">Sales Report</h2>
                        <p className="text-xs">Date: {format(new Date(), 'dd/MM/yy')}</p>
                        <p className="text-xs">Period: {report.dateRange.from} - {report.dateRange.to}</p>
                    </div>
                </header>

                <section className="py-2">
                    <h3 className="text-base font-bold mb-2 text-center">Sales Summary</h3>
                    <table className="w-full text-xs">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="p-1 text-left font-bold">Product</th>
                            <th className="p-1 text-center font-bold">Boxes</th>
                            <th className="p-1 text-center font-bold">Pcs</th>
                            <th className="p-1 text-right font-bold">Sales</th>
                        </tr>
                        </thead>
                        <tbody>
                        {report.productSummary.map((item) => (
                            <tr key={item.productId} className="border-b border-gray-200">
                            <td className="p-1">{item.productName}</td>
                            <td className="p-1 text-center font-mono">{item.totalBoxes || 0}</td>
                            <td className="p-1 text-center font-mono">{item.totalPieces || 0}</td>
                            <td className="p-1 text-right font-mono">{item.totalAmount.toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>

                <section className="flex justify-end pt-2">
                    <div className="w-full text-xs">
                        <div className="flex justify-between py-1">
                        <span className="font-bold">Total Invoices:</span>
                        <span className="font-mono">{report.totalInvoices}</span>
                        </div>
                        <div className="flex justify-between py-1 text-base font-bold border-t border-gray-300 mt-1">
                        <span>Grand Total:</span>
                        <span className="font-mono flex items-center"><IndianRupee className="h-3 w-3 mr-1"/>{report.grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </section>

                <footer className="text-center text-[10px] text-gray-500 pt-4 border-t border-gray-300 mt-2">
                    <p>Computer-generated report.</p>
                </footer>
            </div>
        </div>
    </div>
  );
}
