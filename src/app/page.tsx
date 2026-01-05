'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus, Printer, Save, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { products } from '@/lib/data';
import type { Product, InvoiceItem, Invoice } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Logo } from '@/components/logo';

export default function NewInvoicePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('flat');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [taxValue, setTaxValue] = useState<number>(5); // Default 5% GST

  const [productSearch, setProductSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const filteredProducts = useMemo(() => {
    if (!productSearch) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [productSearch]);

  const addProductToInvoice = (product: Product) => {
    if (items.find((item) => item.productId === product.id)) {
      toast({ title: 'Product already added', description: 'This product is already in the invoice.', variant: 'destructive' });
      return;
    }
    const newItem: InvoiceItem = {
      productId: product.id,
      productName: product.name,
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

  const { subtotal, discountAmount, taxAmount, total } = useMemo(() => {
    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    let discountAmount = 0;
    if (discountType === 'flat') {
      discountAmount = discountValue;
    } else {
      discountAmount = (subtotal * discountValue) / 100;
    }
    const totalAfterDiscount = subtotal - discountAmount;
    const taxAmount = (totalAfterDiscount * taxValue) / 100;
    const total = totalAfterDiscount + taxAmount;
    return { subtotal, discountAmount, taxAmount, total };
  }, [items, discountType, discountValue, taxValue]);
  
  const handleSaveAndPrint = () => {
    if (items.length === 0) {
        toast({ title: 'Error', description: 'Please add at least one product.', variant: 'destructive' });
        return;
    }
    setIsSaving(true);
    
    // In a real app, this would be an API call to save the invoice.
    // Here we just simulate it and prepare for printing.
    const newInvoiceId = `${Date.now()}`;
    const newInvoice: Invoice = {
        id: `inv-${newInvoiceId}`,
        invoiceNumber: `2024-${Math.floor(Math.random() * 1000)}`,
        date: new Date().toISOString(),
        items,
        subtotal,
        discount: { type: discountType, value: discountValue },
        discountAmount,
        tax: { type: 'gst', value: taxValue },
        taxAmount,
        total,
    };

    // Store in session storage to pass to print page
    sessionStorage.setItem('latestInvoice', JSON.stringify(newInvoice));
    
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
    }, 1000);
  };

  return (
    <div className="p-4 md:p-6">
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Logo />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Popover open={productSearch.length > 0} onOpenChange={(open) => !open && setProductSearch('')}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Input
                      placeholder="Search for product by name or SKU..."
                      className="text-base h-12"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <ScrollArea className="h-[200px]">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((p) => (
                        <div key={p.id} onClick={() => addProductToInvoice(p)} className="p-2 hover:bg-accent cursor-pointer">
                          {p.name}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground">No products found.</div>
                    )}
                  </ScrollArea>
                </PopoverContent>
              </Popover>

              <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="text-right">
                          <Input type="number" min="0" value={item.total} onChange={(e) => updateItem(item.productId, { total: parseFloat(e.target.value) || 0 })} className="w-32 h-10 text-base ml-auto" />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.productId)}>
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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
              <div className="space-y-2">
                <Label>Discount</Label>
                <div className="flex gap-2">
                    <Select value={discountType} onValueChange={(v: 'percentage' | 'flat') => setDiscountType(v)}>
                        <SelectTrigger className="w-32 h-10"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="flat">Flat</SelectItem>
                            <SelectItem value="percentage">%</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input type="number" min="0" value={discountValue} onChange={e => setDiscountValue(parseFloat(e.target.value) || 0)} className="h-10 text-base" />
                </div>
                 <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Discount Applied</span>
                    <span className="font-mono">- {discountAmount.toFixed(2)}</span>
                </div>
              </div>
               <div className="space-y-2">
                <Label>Tax (GST)</Label>
                 <div className="flex items-center gap-2">
                    <Input type="number" min="0" value={taxValue} onChange={e => setTaxValue(parseFloat(e.target.value) || 0)} className="h-10 text-base" />
                    <span className="text-muted-foreground">%</span>
                </div>
                 <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Tax Amount</span>
                    <span className="font-mono">+ {taxAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t pt-4 mt-2 flex justify-between items-center text-2xl font-bold font-headline">
                <span>Total</span>
                <span className="font-mono flex items-center"><IndianRupee className="h-5 w-5 mr-1" />{total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button size="lg" className="w-full text-lg h-14" onClick={handleSaveAndPrint} disabled={isSaving}>
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
