import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Split the bill",
    description: "Split the bill between the people you're with.",
}

export default function ScanLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            
            <footer className="mt-10 mb-5 text-center text-sm text-muted-foreground">
                Powered by Gemini AI
            </footer>
        </>
    )
}