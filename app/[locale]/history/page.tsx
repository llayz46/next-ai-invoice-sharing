'use client'

import { Button } from "@/components/ui/button";
import { useInvoice } from "@/context/InvoiceContext";
import { useScopedI18n } from "@/locales/client";
import { ArrowLeft, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function History() {
    const historyTranslations = useScopedI18n("history");
    const { history, deleteFromHistory } = useInvoice();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <main className="flex flex-col size-full max-w-xs md:max-w-sm mx-auto mt-20">
            <div className="flex flex-col items-start gap-3 font-sans">
                <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    <ArrowLeft size={16} />
                    {historyTranslations("back")}
                </Link>

                <h1 className="text-2xl font-medium text-foreground">
                    {historyTranslations("title")}
                </h1>

                <p className="text-muted-foreground">
                    {historyTranslations("description")}
                </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 w-full">
                {history.map((invoice) => (
                    <Card key={invoice.id} className="w-full bg-transparent rounded-md shadow-xs">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{invoice.restaurantName}</CardTitle>
                            <div className="text-lg font-semibold">{historyTranslations("total", { total: invoice.total })}</div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {invoice.people.map((person) => (
                                    <div key={person.id} className="flex justify-between text-sm">
                                        <span>{person.name}</span>
                                        <span className="text-muted-foreground">
                                            {historyTranslations("amount", { amount: Array.isArray(person.items)
                                                ? person.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)
                                                : person.items.price.toFixed(2)},
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                            <div className="text-sm text-muted-foreground">{historyTranslations("splitBetween", { people: invoice.people.length })}</div>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        className="hover:bg-destructive/10 cursor-pointer" 
                                        size="icon"
                                        onClick={() => deleteFromHistory(invoice.id)}
                                    >
                                        <Trash size={16} className="text-destructive" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{historyTranslations("delete")}</p>
                                </TooltipContent>
                            </Tooltip>
                        </CardFooter>
                    </Card>
                ))}

                {history.length === 0 && (
                    <p className="text-center text-muted-foreground">
                        {historyTranslations("empty")}
                    </p>
                )}
            </div>
        </main>
    );
}