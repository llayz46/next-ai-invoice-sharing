'use client'

import { ExtractedData } from "@/lib/types";
import { Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import PageHeading from "./page-heading";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useInvoice } from "@/context/InvoiceContext";

export default function TabItems() {
    const {
        extractedData,
        setExtractedData,
        setNavTab,
        navTab
    } = useInvoice();

    if (!extractedData) return null;

    const handleSplitBill = () => {
        if (!extractedData?.items.some((item) => !item.name)) {
            setNavTab("split");
        } else {
            toast.error("All items must have a name");
            return;
        }
    };

    return navTab === "items" && (
        <>
            <PageHeading
                title="Receipt items"
                description="Here are the items on your receipt."
                navTab="items"
            />

            <div className="mt-8 flex flex-col gap-4">
                <div className="flex justify-start items-center gap-2">
                    <h2 className="text-lg font-medium">{extractedData.restaurantName} :</h2>
                    <p className="text-sm text-gray-500">Total: ${extractedData.totalAmount}</p>
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
                                    setExtractedData((prevState: ExtractedData) => {
                                        if (!prevState) return null;
                                        const updatedItems = prevState.items.map((item: { id: number; name: string; price: number }, index: number) =>
                                            index === i ? { ...item, price } : item
                                        );
                                        return {
                                            ...prevState,
                                            items: updatedItems,
                                            totalAmount: updatedItems.reduce((sum: number, item: { price: number }) => sum + item.price, 0),
                                        };
                                    });
                                }
                            }}
                            className="w-1/4"
                        />
                        <Button
                            variant="destructive"
                            size="icon"
                            className="p-0"
                            onClick={() => {
                                setExtractedData({
                                    ...extractedData,
                                    items: extractedData.items.filter((_, index) => index !== i),
                                });
                            }}
                        >
                            <Trash size={12} />
                        </Button>
                    </div>
                ))}

                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                        setExtractedData({
                            ...extractedData,
                            items: [...extractedData.items, { id: extractedData.items.length + 1, name: "", price: 0 }],
                        });
                    }}
                >
                    Add Item
                    <Plus size={12} />
                </Button>
            </div>

            <Button
                disabled={!extractedData}
                onClick={handleSplitBill}
                variant="studio"
                className="font-sans w-full mt-16 py-5"
            >
                Validate Items
            </Button>
        </>
    );
}
