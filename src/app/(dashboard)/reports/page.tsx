'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateInsightfulSalesReport } from '@/ai/flows/generate-insightful-sales-report';
import { invoices, products } from '@/lib/data';
import type { GenerateInsightfulSalesReportInput } from '@/ai/flows/generate-insightful-sales-report';
import { subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

type ReportType = 'day' | 'week' | 'month';

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('day');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setReport(null);

    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (reportType) {
      case 'day':
        startDate = subDays(now, 1);
        break;
      case 'week':
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
    }

    const relevantInvoices = invoices.filter(inv => {
        const invDate = new Date(inv.date);
        return invDate >= startDate && invDate <= endDate;
    });

    if (relevantInvoices.length === 0) {
        setReport(`No sales data found for the selected period (${reportType}).`);
        setIsLoading(false);
        return;
    }

    const salesDataString = relevantInvoices.map(inv => 
        `Invoice ${inv.invoiceNumber} to ${inv.customerName} on ${new Date(inv.date).toLocaleDateString()}: ` +
        inv.items.map(item => `${item.qtyBox} boxes and ${item.qtyPiece} pieces of ${item.productName}`).join(', ') +
        `. Total: ${inv.total.toFixed(2)}`
    ).join('\n');

    try {
        const input: GenerateInsightfulSalesReportInput = {
            reportType,
            salesData: salesDataString,
        };
        const result = await generateInsightfulSalesReport(input);
        setReport(result.report);
    } catch (error) {
        console.error('Failed to generate report:', error);
        setReport('An error occurred while generating the report. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Sales Reports
        </h1>
        <p className="text-muted-foreground">
          Generate insightful reports powered by AI.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>
            Select a period and generate an AI-driven sales analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-start">
          <Tabs value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
            <TabsList>
              <TabsTrigger value="day">Past Day</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={handleGenerateReport} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Insightful Report'
            )}
          </Button>
        </CardContent>
      </Card>
      
      {(isLoading || report) && (
        <Card>
          <CardHeader>
            <CardTitle>AI-Generated Sales Report</CardTitle>
             <CardDescription>Analysis for {reportType} ending {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p>Analyzing data and generating insights. This may take a moment...</p>
              </div>
            )}
            {report && (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {report}
                </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
