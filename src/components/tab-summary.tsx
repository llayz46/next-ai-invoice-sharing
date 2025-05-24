'use client'

import { cn } from "@/lib/utils";
import { Share } from "lucide-react";
import PageHeading from "./page-heading";
import { buttonVariants, Button } from "./ui/button";
import { toast } from "sonner";
import { useInvoice } from "@/context/InvoiceContext";
import { useInvoiceActions } from "@/hooks/use-invoice-actions";

export default function TabSummary() {
    const {
        people,
        navTab
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

        const text = `Here's how we should split this bill:
        ${billSummary}
        Total: $${total}`;

        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };
    
    return navTab === "summary" && (
        <>
            <PageHeading
                title="Bill Summary"
                description="Review how much each person owes for their items."
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
                            <p>${person.items.reduce((sum, item) => sum + item.price, 0)}</p>
                        ) : (
                            <p>${person.items.price}</p>
                        )}
                    </div>
                ))}
            </div>

            <Button onClick={handleShare} variant="studio" className="w-full mt-12 py-5">
                <Share size={16} />
                Share
            </Button>

            <Button onClick={resetInvoice} variant="outline" className={cn(buttonVariants({ variant: "outline" }), "w-full mt-4")}>
                Back to Scan
            </Button>
        </>
    );
}
