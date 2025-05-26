'use client'

import { useInvoice } from "@/context/InvoiceContext";
import { useInvoiceActions } from "@/hooks/use-invoice-actions";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";
import { Share } from "lucide-react";
import { toast } from "sonner";
import PageHeading from "./page-heading";
import { Button, buttonVariants } from "./ui/button";

export default function TabSummary() {
    const scanTranslations = useScopedI18n("scan.summary");

    const {
        people,
        navTab,
        saveToHistory
    } = useInvoice();

    const { resetInvoice } = useInvoiceActions();
    
    const handleShare = () => {
        const billSummary = people
            .map((person) => {
                const items = Array.isArray(person.items) ? person.items : [person.items];

                return `${person.name}: $${items.reduce((sum, item) => sum + item.price, 0)}`;
            })
            .join("\n");

        const total = people.reduce((sum, person) => {
            if (Array.isArray(person.items)) {
                return sum + person.items.reduce((sum, item) => sum + item.price, 0);
            } else {
                return sum + person.items.price;
            }
        }, 0);

        const text = scanTranslations("text", { billSummary, total });

        navigator.clipboard.writeText(text);
        toast.success(scanTranslations("copied"));
    };

    const handleSave = () => {
        saveToHistory();
        toast.success(scanTranslations("saved"));
    };
    
    return navTab === "summary" && (
        <>
            <PageHeading
                title={scanTranslations("title")}
                description={scanTranslations("description")}
                navTab="summary"
            />

            <div className="mt-8 flex flex-col gap-4 w-full">
                {people.map((person) => (
                    <div
                        key={person.id}
                        className={cn(buttonVariants({ variant: "outline" }), "flex justify-between w-full")}
                    >
                        <p>{person.name}</p>
                        {Array.isArray(person.items) ? (
                            <p>${person.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</p>
                        ) : (
                            <p>${person.items.price.toFixed(2)}</p>
                        )}
                    </div>
                ))}
            </div>

            <Button onClick={handleShare} variant="studio" className="w-full mt-12 py-5">
                <Share size={16} />
                {scanTranslations("button")}
            </Button>

            <Button onClick={handleSave} variant="outline" className={cn(buttonVariants({ variant: "outline" }), "w-full mt-4")}>
                {scanTranslations("save")}
            </Button>

            <Button onClick={resetInvoice} variant="outline" className={cn(buttonVariants({ variant: "outline" }), "w-full mt-4")}>
                {scanTranslations("back")}
            </Button>
        </>
    );
}
