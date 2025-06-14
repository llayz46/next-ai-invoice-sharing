import { getI18n } from "@/locales/server";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Split the bill",
    description: "Split the bill between the people you're with.",
}

export default async function ScanLayout({ children }: { children: React.ReactNode }) {
    const t = await getI18n();

    return (
        <>
            {children}
            
            <footer className="mt-auto mb-10 text-center text-sm text-muted-foreground">
                {t("footer")}
            </footer>
        </>
    )
}