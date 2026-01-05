'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Printer, Save, IndianRupee, BarChart, Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { products as staticProducts } from '@/lib/data';
import type { Product, InvoiceItem, Invoice } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function NewInvoicePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(staticProducts);
      localStorage.setItem('products', JSON.stringify(staticProducts));
    }
  }, []);
  
  const filteredProducts = useMemo(() => {
    const searchTerms = productSearch.toLowerCase().split(' ').filter(term => term.trim() !== '');
    if (searchTerms.length === 0) return products;

    return products.filter((p) => {
        const productName = p.name.toLowerCase();
        return searchTerms.every(term => productName.includes(term));
    });
  }, [productSearch, products]);

  const addProductToInvoice = (product: Product) => {
    if (items.find((item) => item.productId === product.id)) {
      toast({ title: 'Product already added', description: 'This product is already in the invoice.', variant: 'destructive' });
      return;
    }
    const newItem: InvoiceItem = {
      productId: product.id,
      productName: product.name,
      boxes: 0,
      pieces: 0,
      total: 0,
    };
    setItems([...items, newItem]);
    setProductSearch('');
  };

  const updateItem = (productId: string, newValues: Partial<InvoiceItem>) => {
    setItems(
      items.map((item) => {
        if (item.productId === productId) {
          return { ...item, ...newValues };
        }
        return item;
      })
    );
  };
  
  const removeItem = (productId: string) => {
    setItems(items.filter((item) => item.productId !== productId));
  };

  const { subtotal, total } = useMemo(() => {
    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const total = subtotal;
    return { subtotal, total };
  }, [items]);
  
  const handleSaveAndPrint = () => {
    if (items.length === 0) {
        toast({ title: 'Error', description: 'Please add at least one product.', variant: 'destructive' });
        return;
    }
    setIsSaving(true);
    
    const newInvoiceId = `${Date.now()}`;
    const newInvoice: Invoice = {
        id: `inv-${newInvoiceId}`,
        invoiceNumber: `2024-${Math.floor(Math.random() * 1000)}`,
        date: new Date().toISOString(),
        items,
        subtotal,
        total,
    };

    sessionStorage.setItem('latestInvoice', JSON.stringify(newInvoice));

    const allInvoices: Invoice[] = JSON.parse(localStorage.getItem('invoices') || '[]');
    allInvoices.push(newInvoice);
    localStorage.setItem('invoices', JSON.stringify(allInvoices));
    
    toast({ title: 'Invoice Saved!', description: 'Preparing for printing...' });
    
    setTimeout(() => {
        const printUrl = `/invoices/${newInvoiceId}/print`;
        const printWindow = window.open(printUrl, '_blank');
        if (printWindow) {
          printWindow.focus();
        } else {
          router.push(printUrl);
        }
        setIsSaving(false);
        setItems([]);
        setProductSearch('');
    }, 1000);
  };
  
  useEffect(() => {
    // Show results if there's a search term or if the input is focused.
    setShowSearchResults(productSearch.length > 0 || document.activeElement === searchContainerRef.current?.querySelector('input'));
  }, [productSearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  return (
    <div className="p-4 md:p-6">
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/products">
              <Package className="mr-2 h-4 w-4" />
              Manage Products
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/reports">
              <BarChart className="mr-2 h-4 w-4" />
              View Reports
            </Link>
          </Button>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Product</TableHead>
                      <TableHead>Boxes</TableHead>
                      <TableHead>Pieces</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell>
                          <Input type="number" min="0" value={item.boxes || ''} onChange={(e) => updateItem(item.productId, { boxes: parseInt(e.target.value) || 0 })} className="w-20 h-10 text-base" />
                        </TableCell>
                         <TableCell>
                          <Input type="number" min="0" value={item.pieces || ''} onChange={(e) => updateItem(item.productId, { pieces: parseInt(e.target.value) || 0 })} className="w-20 h-10 text-base" />
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          <Input type="number" min="0" value={item.total || ''} onChange={(e) => updateItem(item.productId, { total: parseFloat(e.target.value) || 0 })} className="w-24 h-10 text-base text-right" />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.productId)}>
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                     <TableRow>
                        <TableCell colSpan={5} className="p-0">
                           <div className="relative p-2" ref={searchContainerRef}>
                            <Input
                              placeholder="Search to add a product..."
                              className="text-base h-12"
                              value={productSearch}
                              onChange={(e) => setProductSearch(e.target.value)}
                              onFocus={() => setShowSearchResults(true)}
                            />
                            {showSearchResults && (
                              <div className="absolute top-full mt-2 w-full left-0 bg-card border rounded-md shadow-lg z-10">
                                <ScrollArea className="h-[200px]">
                                  {(productSearch.length > 0 ? filteredProducts : products).map((p) => (
                                    <div key={p.id} onClick={() => addProductToInvoice(p)} className="p-3 hover:bg-accent cursor-pointer flex items-center gap-2">
                                       <Plus className="h-4 w-4 text-muted-foreground" />
                                      {p.name}
                                    </div>
                                  ))}
                                </ScrollArea>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">{subtotal.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 mt-2 flex justify-between items-center text-2xl font-bold font-headline">
                <span>Total</span>
                <span className="font-mono flex items-center"><IndianRupee className="h-5 w-5 mr-1" />{total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button size="lg" className="w-full text-lg h-14" onClick={handleSaveAndPrint} disabled={isSaving || items.length === 0}>
                    {isSaving ? 'Saving...' : <><Save className="mr-2 h-5 w-5" /> Save & Print</>}
                </Button>
                <Alert variant="default" className="text-center">
                    <Printer className="h-4 w-4" />
                    <AlertTitle>Bluetooth Printing</AlertTitle>
                    <AlertDescription>
                        Use your device's print dialog to select your connected Bluetooth printer.
                    </AlertDescription>
                </Alert>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
    </div>
  );
}
