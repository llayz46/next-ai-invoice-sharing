import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PageHeading({ title, description, backLink }: { title: string, description: string, backLink: string }) {
    return (
        <div className="flex flex-col items-start gap-3 font-sans">
            <Link href={backLink} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft size={16} />
                Back
            </Link>

            <h1 className="text-2xl font-medium text-foreground">
                {title}
            </h1>

            <p className="text-muted-foreground">
                {description}
            </p>
        </div>
    )
}