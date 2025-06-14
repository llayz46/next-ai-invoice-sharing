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
        if (
            !extractedData?.individualItems.some((item) => !item.name) ||
            !extractedData?.menus.some((item) => !item.name)
        ) {
            setNavTab("split");
        } else {
            toast.error(scanTranslations("error.name"));
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

                <div className="mt-8 flex flex-col gap-5">
                    <div className="flex justify-start items-center gap-2">
                        <h2 className="text-lg font-medium">{extractedData.restaurantName} :</h2>
                        <p className="text-sm text-gray-500">
                            {scanTranslations("total", { total: extractedData.totalAmount.toFixed(2) })}
                        </p>
                    </div>

                    {extractedData.menus.map((menu, i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <div className="flex justify-start items-center gap-2">
                                <Input
                                    type="text"
                                    value={menu.name}
                                    onChange={(e) => {
                                        const updatedItems = extractedData.menus.map((menu, idx) =>
                                            idx === i ? { ...menu, name: e.target.value } : menu
                                        );
                                        setExtractedData({
                                            ...extractedData,
                                            menus: updatedItems,
                                        });
                                    }}
                                    className="w-3/4"
                                />
                                <Input type="text" value={menu.totalPrice.toFixed(2)} className="w-1/4 min-w-1/4" readOnly />
                                <Tooltip delayDuration={500}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="p-0 cursor-pointer"
                                            onClick={() => {
                                                if (menu.items.length !== 0) {
                                                    toast.error(scanTranslations("error.empty"));
                                                    return
                                                }

                                                const updatedMenus = extractedData.menus.filter((_, idx) => idx !== i);

                                                setExtractedData({
                                                    ...extractedData,
                                                    menus: updatedMenus,
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

                            {menu.items.map((item, i) => (
                                <div key={i} className="flex justify-start items-center gap-2">
                                    <Input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => {
                                            const updatedMenus = extractedData.menus.map(mnu =>
                                                mnu.id === menu.id
                                                    ? {
                                                          ...mnu,
                                                          items: mnu.items.map((itm, idx) =>
                                                              idx === i ? { ...itm, name: e.target.value } : itm
                                                          ),
                                                      }
                                                    : mnu
                                            );
                                            setExtractedData({
                                                ...extractedData,
                                                menus: updatedMenus,
                                            });
                                        }}
                                        className="w-full shrink-1 ml-5"
                                    />
                                    <Input
                                        type="number"
                                        value={item.price.toFixed(2)}
                                        onChange={(e) => {
                                            const price = parseFloat(e.target.value);
                                            if (!isNaN(price) && extractedData) {
                                                const updatedMenus = extractedData.menus.map(mnu =>
                                                    mnu.id === menu.id 
                                                        ? {
                                                            ...mnu,
                                                            totalPrice: mnu.items
                                                                .map((itm, idx) => idx === i ? price : itm.price)
                                                                .reduce((sum, p) => sum + p, 0),
                                                            items: mnu.items.map((itm, idx) =>
                                                                idx === i ? { ...itm, price } : itm
                                                            ),
                                                        } 
                                                        : mnu
                                                );
                                                setExtractedData({
                                                    ...extractedData,
                                                    menus: updatedMenus,
                                                    totalAmount:
                                                        updatedMenus.reduce(
                                                            (sum, mnu) => sum + (mnu.totalPrice || 0),
                                                            0
                                                        ) + extractedData.individualItems.reduce((sum, itm) => sum + itm.price, 0)                                                        
                                                });
                                            }
                                        }}
                                        className="w-1/4 min-w-1/4"
                                    />
                                    <Tooltip delayDuration={500}>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="p-0 cursor-pointer"
                                                onClick={() => {
                                                    const updatedMenuItems = extractedData.menus.map(mnu => (
                                                        mnu.id === menu.id
                                                            ? {
                                                                ...mnu,
                                                                items: mnu.items.filter((_, idx) => idx !== i)
                                                            }
                                                            : mnu
                                                    ))
                                                    setExtractedData({
                                                        ...extractedData,
                                                        menus: updatedMenuItems.map(mnu => ({
                                                            ...mnu,
                                                            totalPrice: mnu.items.reduce((sum, itm) => sum + itm.price, 0)
                                                        })),
                                                        totalAmount:
                                                            updatedMenuItems.reduce(
                                                                (sum, mnu) => sum + (mnu.items.reduce((itemSum, itm) => itemSum + itm.price, 0)),
                                                                0
                                                            ) +
                                                            (extractedData.individualItems
                                                                ? extractedData.individualItems.reduce((sum, itm) => sum + itm.price, 0)
                                                                : 0)
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
                        </div>
                    ))}

                    {extractedData.individualItems.map((item, i) => (
                        <div key={i} className="flex justify-start items-center gap-2">
                            <Input
                                type="text"
                                value={item.name}
                                onChange={(e) => {
                                    const updatedItems = extractedData.individualItems.map((itm, idx) =>
                                        idx === i ? { ...itm, name: e.target.value } : itm
                                    );
                                    setExtractedData({
                                        ...extractedData,
                                        individualItems: updatedItems,
                                    });
                                }}
                                className="w-3/4"
                            />
                            <Input
                                type="number"
                                value={item.price.toFixed(2)}
                                onChange={(e) => {
                                    const price = parseFloat(e.target.value);
                                    if (!isNaN(price) && extractedData) {
                                        const updatedItems = extractedData.individualItems.map((itm, idx) =>
                                            idx === i ? { ...itm, price } : itm
                                        );
                                        setExtractedData({
                                            ...extractedData,
                                            individualItems: updatedItems,
                                            totalAmount:
                                                updatedItems.reduce((sum, itm) => sum + itm.price, 0) +
                                                (extractedData.menus
                                                    ? extractedData.menus.reduce(
                                                          (menuSum, menu) => menuSum + menu.totalPrice,
                                                          0
                                                      )
                                                    : 0),
                                        });
                                    }
                                }}
                                className="w-1/4 min-w-1/4"
                            />
                            <Tooltip delayDuration={500}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="p-0 cursor-pointer"
                                        onClick={() => {
                                            const updatedItems = extractedData.individualItems.filter((_, idx) => idx !== i);
                                            setExtractedData({
                                                ...extractedData,
                                                individualItems: updatedItems,
                                                totalAmount:
                                                    updatedItems.reduce((sum, itm) => sum + itm.price, 0) +
                                                    (extractedData.menus
                                                        ? extractedData.menus.reduce(
                                                              (menuSum, menu) => menuSum + menu.totalPrice,
                                                              0
                                                          )
                                                        : 0),
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
                            if (!extractedData) return;
                            setExtractedData({
                                ...extractedData,
                                individualItems: [
                                    ...extractedData.individualItems, 
                                    { id: extractedData.individualItems.length, name: "", price: 0 }
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
