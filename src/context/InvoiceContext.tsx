"use client";

import { ExtractedData, Person, Tab } from "@/lib/types";
import { createContext, ReactNode, useContext, useState } from "react";

interface InvoiceContextType {
    navTab: Tab;
    setNavTab: (tab: Tab) => void;
    people: Person[];
    setPeople: (people: Person[]) => void;
    splitEqually: boolean;
    setSplitEqually: (split: boolean) => void;
    extractedData: ExtractedData | null;
    setExtractedData: (data: ExtractedData | null) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: ReactNode }) {
    const [navTab, setNavTab] = useState<Tab>("scan");
    const [people, setPeople] = useState<Person[]>([]);
    const [splitEqually, setSplitEqually] = useState(false);
    const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);

    const value = {
        navTab,
        setNavTab,
        people,
        setPeople,
        splitEqually,
        setSplitEqually,
        extractedData,
        setExtractedData,
    };

    return (
        <InvoiceContext.Provider value={value}>
            {children}
        </InvoiceContext.Provider>
    );
}

export function useInvoice() {
    const context = useContext(InvoiceContext);
    
    if (context === undefined) {
        throw new Error("useInvoice must be used within an InvoiceProvider");
    }
    
    return context;
} 