'use client'

import { extractInvoiceData } from "@/ai/flows/extract-invoice-data";
import { useInvoice } from "@/context/InvoiceContext";
import { FileMetadata } from "@/hooks/use-file-upload";
import { useScopedI18n } from "@/locales/client";
import { useState } from "react";
import { toast } from "sonner";
import { FormImageUpload } from "./form-image-upload";
import PageHeading from "./page-heading";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export default function TabScan() {
    const scanTranslations = useScopedI18n("scan.scan");

    const {
        setExtractedData,
        setNavTab,
        navTab
    } = useInvoice();

    const [selectedImageFile, setSelectedImageFile] = useState<File | FileMetadata | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleProcessImage = async () => {
        if (!selectedImageFile) {
            toast.error(scanTranslations("formImageUpload.errorImage"));
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
            toast.success(scanTranslations("formImageUpload.success"));

            setNavTab("items");
        } catch (e) {
            const errorMessage = e instanceof Error && e.name === 'InvoiceExtractionError' 
                ? scanTranslations("formImageUpload.errorExtract")
                : scanTranslations("formImageUpload.errorExtract");
            toast.error(errorMessage);
            setExtractedData(null);
        } finally {
            setIsLoading(false);
        }
    };

    return navTab === "scan" && (
        <>
            <PageHeading
                title={scanTranslations("title")}
                description={scanTranslations("description")}
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
                {scanTranslations("button")}
            </Button>
        </>
    );
}
