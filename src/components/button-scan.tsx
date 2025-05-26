"use client";

import { cn } from "@/lib/utils";
import { Camera } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { useInvoiceActions } from "@/hooks/use-invoice-actions";
import { useScopedI18n } from "@/locales/client";

export function ButtonScan() {
    const { resetInvoice } = useInvoiceActions();
    const homeTranslations = useScopedI18n("home");

    return (
        <Link
            href="/scan"
            className={cn(buttonVariants({ variant: "studio" }), "w-full mt-16 py-5")}
            onClick={resetInvoice}
        >
            <Camera size={16} />
            {homeTranslations("button")}
        </Link>
    );
}
