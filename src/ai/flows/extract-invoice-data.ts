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

class InvoiceExtractionError extends Error {
    constructor() {
        super();
        this.name = "InvoiceExtractionError";
    }
}

const ExtractInvoiceDataInputSchema = z.object({
    invoiceImage: z
        .string()
        .describe(
            "A photo of an invoice, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
});
export type ExtractInvoiceDataInput = z.infer<typeof ExtractInvoiceDataInputSchema>;

const ExtractInvoiceDataOutputSchema = z.object({
    restaurantName: z.string().describe("The name of the restaurant."),
    menus: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
            items: z.array(
                z.object({
                    id: z.string(),
                    name: z.string(),
                    price: z.number(),
                })
            ),
            totalPrice: z.number(),
        })
    ),
    individualItems: z
        .array(z.object({ id: z.number(), name: z.string(), price: z.number() }))
        .describe("The list of individual items in the invoice."),
    totalAmount: z.number().describe("The total amount of the invoice."),
});
export type ExtractInvoiceDataOutput = z.infer<typeof ExtractInvoiceDataOutputSchema>;

export async function extractInvoiceData(input: ExtractInvoiceDataInput): Promise<ExtractInvoiceDataOutput> {
    return extractInvoiceDataFlow(input);
}

const extractInvoiceDataPrompt = ai.definePrompt({
    name: "extractInvoiceDataPrompt",
    input: { schema: ExtractInvoiceDataInputSchema },
    output: { schema: ExtractInvoiceDataOutputSchema },
    prompt: `You are an expert in analyzing restaurant invoices and receipts.

Given an image of an invoice, extract the following structured information in JSON format:

1. **Restaurant Name**: The name of the restaurant.
2. **Menus** (if any): Group related items that form a combo meal or menu. A menu may include:
   - Starter (e.g., salad, nuggets)
   - Main dish (e.g., burger, pizza)
   - Side (e.g., fries)
   - Drink (e.g., soda, juice)
   - Dessert (e.g., ice cream, donut)
   Each menu must be grouped into a single object with:
   - a name (if available, or inferred like "Complete Menu")
   - the list of items (with name and price)
   - a totalPrice (sum of the menu items)
   
   If the menu name is not explicitly written, infer a suitable name like "Best Of Menu" or "Complete Meal".

3. **Individual Items**: Any items not part of a menu, listed separately with their name and price.
4. **Total Amount**: The final amount billed, at the bottom of the invoice.

Here is the invoice image:
{{media url=invoiceImage}}

**Important instructions**:
- Accurately identify items that belong to the same menu based on formatting, grouping, or naming conventions (e.g., "BO", "Best Of", "Menu", etc.).
- If the invoice uses abbreviations (e.g., "BO" for "Best Of"), expand them and group accordingly.
- All prices must be numerical values.
- Do not hallucinate values. Only use data visible on the invoice image.

Return only a valid JSON object containing:
- restaurantName (string)
- menus (array of menus with name, items[], and totalPrice)
- individualItems (array of items with name and price)
- totalAmount (number)

Example structure:
{
  "restaurantName": "McDonald's",
  "menus": [
    {
      "name": "Best Of Menu",
      "items": [
        { "name": "Royal Cheese", "price": 5.00 },
        { "name": "Ice Tea", "price": 2.50 },
        { "name": "Frites", "price": 2.00 }
      ],
      "totalPrice": 9.50
    }
  ],
  "individualItems": [
    { "name": "McFlurry", "price": 3.00 }
  ],
  "totalAmount": 12.50
}`,
});

const extractInvoiceDataFlow = ai.defineFlow(
    {
        name: "extractInvoiceDataFlow",
        inputSchema: ExtractInvoiceDataInputSchema,
        outputSchema: ExtractInvoiceDataOutputSchema,
    },
    async (input) => {
        const { output } = await extractInvoiceDataPrompt(input);

        if (output?.individualItems?.length === 0 || output?.menus?.[0].items?.length === 0) {
            throw new InvoiceExtractionError();
        }

        output?.individualItems.forEach((item, index) => {
            item.id = index;
        });

        output?.menus.forEach((menu, menuIndex) => {
            menu.id = menuIndex
            
            menu.items.forEach((item, itemIndex) => {
                item.id = `${menuIndex}-${itemIndex}`
            });
        });

        return output!;
    }
);
