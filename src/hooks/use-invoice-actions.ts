'use client'

import { useInvoice } from "@/context/InvoiceContext";
import { Tab } from "@/lib/types";
import { useRouter } from "next/navigation";

export function useInvoiceActions() {
    const router = useRouter();
    const {
        setNavTab,
        setPeople,
        setSplitEqually,
        setExtractedData,
    } = useInvoice();

    const handleBack = (tab: Tab, newTab: Tab) => {
        if (tab === "items") {
            setExtractedData(null);
            setPeople([]);
            setSplitEqually(false);
            setNavTab(newTab);
        } else if (tab === "scan") {
            router.push("/");
        } else {
            setNavTab(newTab);
        }
    };

    const resetInvoice = () => {
        setExtractedData(null);
        setPeople([]);
        setSplitEqually(false);
        setNavTab("scan");
        router.push("/");
    };

    return {
        handleBack,
        resetInvoice,
    };
} 