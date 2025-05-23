import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Split the bill",
    description: "Split the bill between the people you're with.",
}

export default function ScanLayout({ children }: { children: React.ReactNode }) {
    return children
}