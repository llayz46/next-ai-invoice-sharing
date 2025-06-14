export type ExtractedData = {
    restaurantName: string;
    menus: {
        id: number;
        name: string;
        items: { id: string; name: string; price: number }[];
        totalPrice: number;
    }[];
    individualItems: { id: number; name: string; price: number }[];
    totalAmount: number;
};

export type Tab = "scan" | "items" | "split" | "summary";

export type Item = { id?: number | string; price: number };
export type Person = { id: number; name: string; items: Item[] | Item };