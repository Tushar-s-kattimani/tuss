import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { invoices } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

export default function InvoicesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Invoices
          </h1>
          <p className="text-muted-foreground">
            Manage and review all your invoices.
          </p>
        </div>
        <Link href="/invoices/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>A list of all past invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length > 0 ? (
                invoices
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>{invoice.customerName}</TableCell>
                      <TableCell>
                        {format(new Date(invoice.date), 'PPP')}
                      </TableCell>
                      <TableCell className="text-right">
                        {invoice.total.toLocaleString('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                        })}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No invoices found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
