import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { products, customers, invoices } from '@/lib/data';
import { IndianRupee, Package, Users, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const today = new Date();
  const todaysSales = invoices
    .filter((invoice) => format(new Date(invoice.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'))
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalCustomers = customers.length;
  const totalProducts = products.length;

  const lowStockProducts = products.filter(
    (p) => p.stock <= p.lowStockThreshold
  );

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here's a summary of your business.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todaysSales.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Total sales for {format(today, 'PPP')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Total active customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Different products in catalog
            </p>
          </CardContent>
        </Card>
      </div>
      {lowStockProducts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Low Stock Alert!</AlertTitle>
          <AlertDescription>
            The following items are running low on stock. Consider reordering
            soon.
          </AlertDescription>
          <Card className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{product.stock}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Alert>
      )}
    </div>
  );
}
