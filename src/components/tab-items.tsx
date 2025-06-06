"use client";

import { useInvoice } from "@/context/InvoiceContext";
import { Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import PageHeading from "./page-heading";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useScopedI18n } from "@/locales/client";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function TabItems() {
    const scanTranslations = useScopedI18n("scan.items");

    const { extractedData, setExtractedData, setNavTab, navTab } = useInvoice();

    if (!extractedData) return null;

    const handleSplitBill = () => {
        if (!extractedData?.items.some((item) => !item.name)) {
            setNavTab("split");
        } else {
            toast.error(scanTranslations("error"));
            return;
        }
    };

    return (
        navTab === "items" && (
            <>
                <PageHeading
                    title={scanTranslations("title")}
                    description={scanTranslations("description")}
                    navTab="items"
                />

                <div className="mt-8 flex flex-col gap-4">
                    <div className="flex justify-start items-center gap-2">
                        <h2 className="text-lg font-medium">{extractedData.restaurantName} :</h2>
                        <p className="text-sm text-gray-500">
                            {scanTranslations("total", { total: extractedData.totalAmount.toFixed(2) })}
                        </p>
                    </div>

                    {extractedData.items.map((item, i) => (
                        <div key={i} className="flex justify-start items-center gap-2">
                            <Input
                                type="text"
                                value={item.name}
                                onChange={(e) => {
                                    setExtractedData({
                                        ...extractedData,
                                        items: extractedData.items.map((item, index) =>
                                            index === i
                                                ? {
                                                      ...item,
                                                      name: e.target.value,
                                                  }
                                                : item
                                        ),
                                    });
                                }}
                                className="w-3/4"
                            />
                            <Input
                                type="number"
                                value={item.price}
                                onChange={(e) => {
                                    const price = parseFloat(e.target.value);
                                    if (!isNaN(price) && extractedData) {
                                        const updatedItems = extractedData.items.map((item, index) =>
                                            index === i ? { ...item, price } : item
                                        );
                                        setExtractedData({
                                            ...extractedData,
                                            items: updatedItems,
                                            totalAmount: updatedItems.reduce((sum, item) => sum + item.price, 0),
                                        });
                                    }
                                }}
                                className="w-1/4"
                            />
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="p-0 cursor-pointer"
                                        onClick={() => {
                                            setExtractedData({
                                                ...extractedData,
                                                items: extractedData.items.filter((_, index) => index !== i),
                                            });
                                        }}
                                    >
                                        <Trash size={12} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{scanTranslations("delete")}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    ))}

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            setExtractedData({
                                ...extractedData,
                                items: [
                                    ...extractedData.items,
                                    { id: extractedData.items.length + 1, name: "", price: 0 },
                                ],
                            });
                        }}
                    >
                        {scanTranslations("button")}
                        <Plus size={12} />
                    </Button>
                </div>

                <Button
                    disabled={!extractedData}
                    onClick={handleSplitBill}
                    variant="studio"
                    className="font-sans w-full mt-16 py-5"
                >
                    {scanTranslations("validate")}
                </Button>
            </>
        )
    );
}
