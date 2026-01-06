'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, IndianRupee, Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '@/components/logo';
import type { Invoice, InvoiceItem } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

interface ProductSummary {
  productId: string;
  productName: string;
  totalBoxes: number;
  totalPieces: number;
  totalAmount: number;
}

export default function ReportsPage() {
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      from: firstDayOfMonth,
      to: today,
    };
  });

  useEffect(() => {
    setIsClient(true);
    const storedInvoices = localStorage.getItem('invoices');
    if (storedInvoices) {
      const parsedInvoices: Invoice[] = JSON.parse(storedInvoices);
      setAllInvoices(parsedInvoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, []);

  const filteredInvoices = useMemo(() => {
    if (!date?.from) return allInvoices;
    const fromDate = new Date(date.from);
    fromDate.setHours(0, 0, 0, 0); 
    
    // If only 'from' is selected, 'to' should be the same day
    const toDate = date.to ? new Date(date.to) : new Date(date.from);
    toDate.setHours(23, 59, 59, 999);

    return allInvoices.filter(invoice => {
      const invoiceDate = new Date(invoice.date);
      return invoiceDate >= fromDate && invoiceDate <= toDate;
    });
  }, [allInvoices, date]);

  const { productSummary, grandTotal } = useMemo(() => {
    const summary: Record<string, ProductSummary> = {};
    let grandTotal = 0;

    filteredInvoices.forEach((invoice) => {
      grandTotal += invoice.total;
      invoice.items.forEach((item) => {
        if (!summary[item.productId]) {
          summary[item.productId] = {
            productId: item.productId,
            productName: item.productName,
            totalBoxes: 0,
            totalPieces: 0,
            totalAmount: 0,
          };
        }
        summary[item.productId].totalBoxes += item.boxes || 0;
        summary[item.productId].totalPieces += item.pieces || 0;
        summary[item.productId].totalAmount += item.total;
      });
    });

    return {
      productSummary: Object.values(summary).sort((a,b) => b.totalAmount - a.totalAmount),
      grandTotal,
    };
  }, [filteredInvoices]);

  if (!isClient) {
    return null; // Avoid rendering on the server
  }

  return (
    <div className="p-4 md:p-6">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <Logo />
        <div className="flex items-center gap-2">
           <div className={cn('grid gap-2')}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={'outline'}
                    className={cn(
                      'w-[300px] justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, 'LLL dd, y')} -{' '}
                          {format(date.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(date.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Billing
            </Link>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">Boxes Sold</TableHead>
                      <TableHead className="text-center">Pieces Sold</TableHead>
                      <TableHead className="text-right">Total Sales</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                     {productSummary.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                No sales data for the selected period.
                            </TableCell>
                        </TableRow>
                     ) : (
                        productSummary.map((product) => (
                          <TableRow key={product.productId}>
                            <TableCell className="font-medium">{product.productName}</TableCell>
                            <TableCell className="text-center font-mono">{product.totalBoxes}</TableCell>
                            <TableCell className="text-center font-mono">{product.totalPieces}</TableCell>
                            <TableCell className="text-right font-mono flex items-center justify-end gap-1">
                              <IndianRupee className="h-4 w-4" />
                              {product.totalAmount.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))
                     )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>All Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                No invoices for the selected period.
                            </TableCell>
                        </TableRow>
                    ) : (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                          <TableCell>{format(new Date(invoice.date), 'dd MMM yyyy, hh:mm a')}</TableCell>
                          <TableCell className="text-right font-mono flex items-center justify-end gap-1">
                              <IndianRupee className="h-4 w-4" />
                              {invoice.total.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Grand Totals</CardTitle>
                 <CardDescription>
                    For period: {date?.from ? format(date.from, 'LLL dd, y') : 'N/A'} - {date?.to ? format(date.to, 'LLL dd, y') : (date?.from ? format(date.from, 'LLL dd, y') : 'N/A')}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-center">
              <div className="text-sm text-muted-foreground">Total Invoices</div>
              <div className="text-4xl font-bold font-headline">{filteredInvoices.length}</div>
              
              <div className="border-t pt-4 mt-2">
                <div className="text-sm text-muted-foreground">Total Revenue</div>
                <div className="text-4xl font-bold font-headline flex items-center justify-center">
                    <IndianRupee className="h-7 w-7 mr-1" />
                    {grandTotal.toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
