import { ExtractedData, Person } from "@/lib/types";
import { useEffect, useState } from "react";

export interface CachedInvoice {
    id: string;
    date: string;
    restaurantName: string;
    people: Person[];
    total: number;
    extractedData: ExtractedData;
}

export function useInvoiceCache() {
    const CACHE_KEY = 'invoice_history';
    const [cachedInvoices, setCachedInvoices] = useState<CachedInvoice[]>([]);

    useEffect(() => {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            setCachedInvoices(JSON.parse(cached));
        }
    }, []);

    const saveInvoice = (invoice: Omit<CachedInvoice, 'id' | 'date'>) => {
        const newInvoice: CachedInvoice = {
            ...invoice,
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
        };
        
        const updatedInvoices = [newInvoice, ...cachedInvoices];
        localStorage.setItem(CACHE_KEY, JSON.stringify(updatedInvoices));
        setCachedInvoices(updatedInvoices);
        return newInvoice;
    };

    const deleteInvoice = (id: string) => {
        const updatedInvoices = cachedInvoices.filter(invoice => invoice.id !== id);
        localStorage.setItem(CACHE_KEY, JSON.stringify(updatedInvoices));
        setCachedInvoices(updatedInvoices);
    };

    return {
        cachedInvoices,
        saveInvoice,
        deleteInvoice,
    };
} 