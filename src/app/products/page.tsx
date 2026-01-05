'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { products as staticProducts } from '@/lib/data';
import type { Product } from '@/lib/types';
import { Logo } from '@/components/logo';

const productSchema = z.object({
  name: z.string().min(2, { message: 'Product name is required.' }),
  sku: z.string().min(2, { message: 'SKU is required.' }),
  category: z.string().min(2, { message: 'Category is required.' }),
  priceBox: z.coerce.number().min(0, { message: 'Price must be a positive number.' }),
  pricePiece: z.coerce.number().min(0, { message: 'Price must be a positive number.' }),
  stock: z.coerce.number().min(0, { message: 'Stock must be a positive number.' }),
  lowStockThreshold: z.coerce.number().min(0, { message: 'Threshold must be a positive number.' }),
});

export default function ProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(staticProducts);
      localStorage.setItem('products', JSON.stringify(staticProducts));
    }
  }, []);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      category: '',
      priceBox: 0,
      pricePiece: 0,
      stock: 0,
      lowStockThreshold: 10,
    },
  });

  function onSubmit(values: z.infer<typeof productSchema>) {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      ...values,
    };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    toast({ title: 'Product Added!', description: `${newProduct.name} has been added to your inventory.` });
    form.reset();
  }
  
  if (!isClient) {
    return null;
  }

  return (
    <div className="p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <Logo />
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Billing
          </Link>
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Product List</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price (Box)</TableHead>
                      <TableHead className="text-right">Price (Piece)</TableHead>
                      <TableHead className="text-center">Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-right font-mono">{product.priceBox.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{product.pricePiece.toFixed(2)}</TableCell>
                        <TableCell className="text-center font-mono">{product.stock}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Pepsi 500ml" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., P500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Pepsi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="priceBox"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price/Box</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pricePiece"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price/Piece</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>
                   <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lowStockThreshold"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Low Stock Alert</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>
                  <Button type="submit" className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Product
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
