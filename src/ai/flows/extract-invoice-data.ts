"use server";

/**
 * @fileOverview Extracts data from an invoice image using OCR and AI.
 *
 * - extractInvoiceData - A function that handles the invoice data extraction process.
 * - ExtractInvoiceDataInput - The input type for the extractInvoiceData function.
 * - ExtractInvoiceDataOutput - The return type for the extractInvoiceData function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const ExtractInvoiceDataInputSchema = z.object({
    invoiceImage: z
        .string()
        .describe(
            "A photo of an invoice, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
});
export type ExtractInvoiceDataInput = z.infer<
    typeof ExtractInvoiceDataInputSchema
>;

const ExtractInvoiceDataOutputSchema = z.object({
    restaurantName: z.string().describe("The name of the restaurant."),
    items: z
        .array(z.object({ id: z.number(), name: z.string(), price: z.number() }))
        .describe("The list of items in the invoice."),
    totalAmount: z.number().describe("The total amount of the invoice."),
});
export type ExtractInvoiceDataOutput = z.infer<
    typeof ExtractInvoiceDataOutputSchema
>;

export async function extractInvoiceData(
    input: ExtractInvoiceDataInput
): Promise<ExtractInvoiceDataOutput> {
    return extractInvoiceDataFlow(input);
}

const extractInvoiceDataPrompt = ai.definePrompt({
    name: "extractInvoiceDataPrompt",
    input: { schema: ExtractInvoiceDataInputSchema },
    output: { schema: ExtractInvoiceDataOutputSchema },
    prompt: `You are an expert in extracting data from invoices.

  Given an image of an invoice, extract the following information:

  - Restaurant Name: The name of the restaurant that issued the invoice.
  - Items: A list of items in the invoice, including the name and price of each item.
  - Total Amount: The total amount of the invoice.

  Here is the invoice image:
  {{media url=invoiceImage}}

  Make sure that the extracted information is accurate and complete.
  Return the data in JSON format.`,
});

const extractInvoiceDataFlow = ai.defineFlow(
    {
        name: "extractInvoiceDataFlow",
        inputSchema: ExtractInvoiceDataInputSchema,
        outputSchema: ExtractInvoiceDataOutputSchema,
    },
    async (input) => {
        const { output } = await extractInvoiceDataPrompt(input);

        if(output?.items.length === 0) {
            throw new Error("No items found in the invoice.");
        }

        output?.items.forEach((item, index) => {
            item.id = index;
        })

        return output!;
    }
);
