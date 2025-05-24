export type ExtractedData = {
    items: { id: number; name: string; price: number }[];
    totalAmount: number;
    restaurantName: string;
};

export type Tab = "scan" | "items" | "split" | "summary";

export type Item = { id?: number; price: number };
export type Person = { id: number; name: string; items: Item[] | Item };
