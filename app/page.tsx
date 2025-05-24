import { SquaresExclude, Camera } from "lucide-react";
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Share Bills, Keep Friends",
    description: "Split bills effortlessly with friends. Just snap, tap, and share - it's that simple. No accounts needed.",
}

export default function Home() {
    return (
        <main className="flex-1 flex items-center justify-center">
            <section className="max-w-xs md:max-w-sm flex items-center flex-col">
                <SquaresExclude className="size-16" color="var(--color-studio-600)" />

                <h1 className="text-center text-balance text-primary font-mono text-3xl font-medium mt-12 mb-3">
                    Share Bills, Keep Friends
                </h1>

                <p className="text-sm text-balance text-center text-muted-foreground">
                    Split bills effortlessly with friends. Just snap, tap, and share - it&apos;s that simple. No accounts needed.
                </p>

                <Link href="/scan" className={cn(buttonVariants({ variant: "studio" }), "w-full mt-16 py-5")}>
                    <Camera size={16} />
                    Scan Invoice
                </Link>
            </section>
        </main>
    );
}
