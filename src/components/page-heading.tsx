import { useInvoiceActions } from "@/hooks/use-invoice-actions";
import { ArrowLeft } from "lucide-react";

type Tab = "scan" | "items" | "split" | "summary"

const TAB_MAP: Record<Tab, Tab> = {
    "scan": "scan",
    "items": "scan",
    "split": "items",
    "summary": "split",
}

export default function PageHeading({ title, description, navTab }: { title: string, description: string, navTab: Tab }) {
    const { handleBack } = useInvoiceActions();
    
    return (
        <div className="flex flex-col items-start gap-3 font-sans">
            <span 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                onClick={() => handleBack(navTab, TAB_MAP[navTab])}
            >
                <ArrowLeft size={16} />
                Back
            </span>

            <h1 className="text-2xl font-medium text-foreground">
                {title}
            </h1>

            <p className="text-muted-foreground">
                {description}
            </p>
        </div>
    )
}