import TabItems from "@/components/tab-items";
import TabScan from "@/components/tab-scan";
import TabSplit from "@/components/tab-split";
import TabSummary from "@/components/tab-summary";

export default function Scan() {
    return (
        <main className="flex flex-col size-full max-w-xs md:max-w-sm mx-auto mt-20">
            <TabScan />

            <TabItems />

            <TabSplit />

            <TabSummary />
        </main>
    );
}
