'use server';
/**
 * @fileOverview Generates insightful sales reports with AI-driven analysis of purchasing trends.
 *
 * - generateInsightfulSalesReport - A function that generates the sales report.
 * - GenerateInsightfulSalesReportInput - The input type for the generateInsightfulSalesReport function.
 * - GenerateInsightfulSalesReportOutput - The return type for the generateInsightfulSalesReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInsightfulSalesReportInputSchema = z.object({
  reportType: z.enum(['day', 'week', 'month']).describe('The type of sales report to generate (day, week, or month).'),
  salesData: z.string().describe('Sales data for the specified period.'),
});
export type GenerateInsightfulSalesReportInput = z.infer<typeof GenerateInsightfulSalesReportInputSchema>;

const GenerateInsightfulSalesReportOutputSchema = z.object({
  report: z.string().describe('The generated sales report with AI-driven analysis.'),
});
export type GenerateInsightfulSalesReportOutput = z.infer<typeof GenerateInsightfulSalesReportOutputSchema>;

export async function generateInsightfulSalesReport(input: GenerateInsightfulSalesReportInput): Promise<GenerateInsightfulSalesReportOutput> {
  return generateInsightfulSalesReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInsightfulSalesReportPrompt',
  input: {schema: GenerateInsightfulSalesReportInputSchema},
  output: {schema: GenerateInsightfulSalesReportOutputSchema},
  prompt: `You are an AI assistant that generates insightful sales reports based on the provided sales data.

  Analyze the following sales data and generate a report that includes:
  - Total sales for the period ({{reportType}})
  - Top selling products
  - Purchasing trends
  - Recommendations for improving sales

  Sales Data:
  {{salesData}}

  Report Type: {{reportType}}`,
});

const generateInsightfulSalesReportFlow = ai.defineFlow(
  {
    name: 'generateInsightfulSalesReportFlow',
    inputSchema: GenerateInsightfulSalesReportInputSchema,
    outputSchema: GenerateInsightfulSalesReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
