'use client'

import { useState } from "react";
import { FormImageUpload } from "./form-image-upload";
import PageHeading from "./page-heading";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { FileMetadata } from "@/hooks/use-file-upload";
import { extractInvoiceData } from "@/ai/flows/extract-invoice-data";
import { toast } from "sonner";
import { useInvoice } from "@/context/InvoiceContext";

export default function TabScan() {    
    const {
        setExtractedData,
        setNavTab,
        navTab
    } = useInvoice();

    const [selectedImageFile, setSelectedImageFile] = useState<File | FileMetadata | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleProcessImage = async () => {
        if (!selectedImageFile) {
            toast.error("Please select an image first.");
            return;
        }

        setIsLoading(true);
        setExtractedData(null);

        try {
            const imageData = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(selectedImageFile as File);
            });

            const result = await extractInvoiceData({
                invoiceImage: imageData,
            });

            setExtractedData(result);
            toast.success("Invoice data extracted.");

            setNavTab("items");
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "Failed to extract data from invoice.";
            toast.error(errorMessage);
            setExtractedData(null);
        } finally {
            setIsLoading(false);
        }
    };

    return navTab === "scan" && (
        <>
            <PageHeading
                title="Scan Receipt"
                description="Take a photo or upload an image of your receipt."
                navTab="scan"
            />

            <Card className="!p-4 mt-8">
                <FormImageUpload onImageUploaded={setSelectedImageFile} isLoading={isLoading} />
            </Card>

            <Button
                disabled={!selectedImageFile}
                onClick={handleProcessImage}
                variant="studio"
                className="font-sans cursor-pointer w-full mt-16 py-5"
            >
                Scan Invoice
            </Button>
        </>
    );
}
