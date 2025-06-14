"use client";

import { CachedInvoice, useInvoiceCache } from "@/hooks/use-invoice-cache";
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
    history: CachedInvoice[];
    saveToHistory: () => void;
    deleteFromHistory: (id: string) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: ReactNode }) {
    const [navTab, setNavTab] = useState<Tab>("scan");
    const [people, setPeople] = useState<Person[]>([]);
    const [splitEqually, setSplitEqually] = useState(false);
    const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
    
    const { cachedInvoices, saveInvoice, deleteInvoice } = useInvoiceCache();

    const saveToHistory = () => {
        if (!extractedData) return;
        
        const total = people.reduce((sum, person) => {
            if (Array.isArray(person.items)) {
                return sum + person.items.reduce((sum, item) => sum + item.price, 0);
            } else {
                return sum + person.items.price;
            }
        }, 0);

        saveInvoice({
            restaurantName: extractedData.restaurantName,
            people,
            total,
            extractedData,
        });
    };

    const deleteFromHistory = (id: string) => {
        deleteInvoice(id);
    };

    const value = {
        navTab,
        setNavTab,
        people,
        setPeople,
        splitEqually,
        setSplitEqually,
        extractedData,
        setExtractedData,
        history: cachedInvoices,
        saveToHistory,
        deleteFromHistory,
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