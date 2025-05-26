import { SquaresExclude } from "lucide-react";
import { Metadata } from "next";
import { ButtonScan } from "@/components/button-scan";
import { getScopedI18n } from "@/locales/server";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Share Bills, Keep Friends",
    description: "Split bills effortlessly with friends. Just snap, tap, and share - it's that simple. No accounts needed.",
}

export default async function Home() {
    const homeTranslations = await getScopedI18n("home");

    return (
        <main className="flex-1 flex items-center justify-center">
            <section className="max-w-xs md:max-w-sm flex items-center flex-col">
                <SquaresExclude className="size-16" color="var(--color-studio-600)" />

                <h1 className="text-center text-balance text-primary font-mono text-3xl font-medium mt-12 mb-3">
                    {homeTranslations("title")}
                </h1>

                <p className="text-sm text-balance text-center text-muted-foreground">
                    {homeTranslations("description")}
                </p>

                <ButtonScan />

                <Link href="/history" className={`${buttonVariants({ variant: "outline" })} w-full mt-4`}>
                    {homeTranslations("history")}
                </Link>
            </section>
        </main>
    );
}
