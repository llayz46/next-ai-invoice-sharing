"use client";

import { extractInvoiceData } from "@/ai/flows/extract-invoice-data";
import { FormImageUpload } from "@/components/form-image-upload";
import PageHeading from "@/components/page-heading";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileMetadata } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";
import { Plus, Share, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type ExtractedData = {
    items: { id: number; name: string; price: number }[];
    restaurantName: string;
    totalAmount: number;
};
type Item = { id?: number; price: number };
type Person = { id: number; name: string; items: Item[] | Item };
type Tab = "scan" | "items" | "split" | "summary";

export default function Scan() {
    const [navTab, setNavTab] = useState<Tab>("scan");
    const [people, setPeople] = useState<Person[]>([]);
    const [splitEqually, setSplitEqually] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | FileMetadata | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);

    const handleProcessImage = async () => {
        if (!selectedImageFile) {
            toast.error("Please select an image first.");
            return;
        }

        setIsLoading(true);
        setExtractedData(null);

        try {
            const imageData = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(selectedImageFile as File);
            });

            const result = await extractInvoiceData({
                invoiceImage: imageData,
            });
            setExtractedData(result);
            toast.success("Invoice data extracted.");
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "Failed to extract data from invoice.";
            toast.error(errorMessage);
            setExtractedData(null);
        } finally {
            setIsLoading(false);
            setNavTab("items");
        }
    };

    const handleSplitBill = () => {
        if (!extractedData?.items.some((item) => !item.name || item.price === 0)) {
            setNavTab("split");
        } else {
            toast.error("All items must have a name and price greater than 0");
            return;
        }
    };

    const handleSplitEqually = () => {
        if (splitEqually) {
            setSplitEqually(false);

            people.forEach((person) => {
                person.items = [];
            });

            return;
        }

        const numberOfPeople = people.length;

        if (numberOfPeople === 0) {
            toast.error("No people to split the bill between");
            return;
        }

        const totalAmount = extractedData?.totalAmount;

        if (!totalAmount) {
            toast.error("No total amount found");
            return;
        } else {
            people.forEach((person) => {
                person.items = { price: totalAmount / numberOfPeople };
            });

            toast.success("Bill split equally");
            setSplitEqually(true);
        }
    };

    const handleAssignItemToPerson = (
        item: { id: number; name: string; price: number },
        person: { id: number; name: string; items: Item[] | Item }
    ) => {
        setPeople((prevPeople) => {
            const currentAssignments = prevPeople.reduce((count, p) => {
                const currentItems = Array.isArray(p.items) ? p.items : [p.items];
                return count + (currentItems.some((i) => i.id === item.id) ? 1 : 0);
            }, 0);

            const currentItems = Array.isArray(person.items) ? person.items : [person.items];
            const alreadyAssigned = currentItems.some((i) => i.id === item.id);
            const newAssignmentCount = alreadyAssigned ? currentAssignments - 1 : currentAssignments + 1;

            const pricePerPerson = newAssignmentCount > 0 ? item.price / newAssignmentCount : 0;

            return prevPeople.map((p) => {
                if (p.id === person.id) {
                    if (!alreadyAssigned) {
                        return {
                            ...p,
                            items: [...currentItems, { ...item, price: pricePerPerson }],
                        };
                    } else {
                        return {
                            ...p,
                            items: currentItems.filter((i) => i.id !== item.id),
                        };
                    }
                } else {
                    const pItems = Array.isArray(p.items) ? p.items : [p.items];
                    const hasItem = pItems.some((i) => i.id === item.id);
                    
                    if (hasItem) {
                        return {
                            ...p,
                            items: pItems.map((i) => 
                                i.id === item.id ? { ...i, price: pricePerPerson } : i
                            ),
                        };
                    }
                }
                return p;
            });
        });
    };

    const handleBillSummary = () => {
        const noItemsAssigned = people.every(
            (person) =>
                (!Array.isArray(person.items) && person.items.price === 0) ||
                (Array.isArray(person.items) && person.items.length === 0)
        );
        if (noItemsAssigned) {
            if (people.length === 0) {
                toast.error("No people to split the bill between");
                return;
            }
            handleSplitEqually();
            setNavTab("summary");

            return;
        }

        if (people.every((person) => !Array.isArray(person.items) && person.items.price !== 0)) {
            setNavTab("summary");

            return;
        }

        const allItemsAssigned = extractedData?.items.every((item) =>
            people.some((person) => {
                if (Array.isArray(person.items)) {
                    return person.items.some((i) => i.id === item.id);
                }

                return person.items.id === item.id;
            })
        );
        if (allItemsAssigned) {
            setNavTab("summary");
        }

        if (!noItemsAssigned && !allItemsAssigned) {
            toast.error("All items must be assigned to a person");
        }
    };

    const router = useRouter();

    const handleBack = (tab: Tab, newTab: Tab) => {
        if (tab === "items") {
            setExtractedData(null);
            setNavTab(newTab);
        } else if (tab === "scan") {
            router.push("/");
        } else {
            setNavTab(newTab);
        }
    };

    const handleShare = () => {
        const billSummary = people
            .map((person) => {
                const items = Array.isArray(person.items) ? person.items : [person.items];

                return `${person.name}: $${items.reduce((sum, item) => sum + item.price, 0)}`;
            })
            .join("\n");

        const total = people.reduce((sum, person) => {
            if (Array.isArray(person.items)) {
                return sum + person.items.reduce((sum, item) => sum + item.price, 0);
            } else {
                return sum + person.items.price;
            }
        }, 0);

        const text = `Here's how we should split this bill:
        ${billSummary}
        Total: $${total}`;

        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    return (
        <main className="flex flex-col max-w-xs md:max-w-sm mx-auto mt-20">
            {!extractedData && navTab === "scan" && (
                <>
                    <PageHeading
                        title="Scan Receipt"
                        description="Take a photo or upload an image of your receipt."
                        navTab="scan"
                        handleBack={handleBack}
                    />

                    <Card className="!p-4 mt-8">
                        <FormImageUpload onImageUploaded={setSelectedImageFile} isLoading={isLoading} />
                    </Card>

                    <Button
                        disabled={!selectedImageFile}
                        onClick={handleProcessImage}
                        variant="default"
                        className="font-sans bg-studio-700 w-full mt-16 py-5"
                    >
                        Scan Invoice
                    </Button>
                </>
            )}

            {extractedData && navTab === "items" && (
                <>
                    <PageHeading
                        title="Receipt items"
                        description="Here are the items on your receipt."
                        navTab="items"
                        handleBack={handleBack}
                    />

                    <div className="mt-8 flex flex-col gap-4">
                        <div className="flex justify-start items-center gap-2">
                            <h2 className="text-lg font-medium">{extractedData.restaurantName} :</h2>
                            <p className="text-sm text-gray-500">Total: ${extractedData.totalAmount}</p>
                        </div>

                        {extractedData.items.map((item, i) => (
                            <div key={i} className="flex justify-start items-center gap-2">
                                <Input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => {
                                        setExtractedData({
                                            ...extractedData,
                                            items: extractedData.items.map((item, index) =>
                                                index === i
                                                    ? {
                                                          ...item,
                                                          name: e.target.value,
                                                      }
                                                    : item
                                            ),
                                        });
                                    }}
                                    className="w-3/4"
                                />
                                <Input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => {
                                        const price = parseFloat(e.target.value);
                                        if (!isNaN(price) && extractedData) {
                                            setExtractedData((prevState) => {
                                                if (!prevState) return null;
                                                const updatedItems = prevState.items.map((item, index) =>
                                                    index === i
                                                        ? {
                                                              ...item,
                                                              price,
                                                          }
                                                        : item
                                                );
                                                return {
                                                    ...prevState,
                                                    items: updatedItems,
                                                    totalAmount:
                                                        updatedItems?.reduce((sum, item) => sum + item.price, 0) ?? 0,
                                                };
                                            });
                                        }
                                    }}
                                    className="w-1/4"
                                />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="p-0"
                                    onClick={() => {
                                        setExtractedData({
                                            ...extractedData,
                                            items: extractedData.items.filter((_, index) => index !== i),
                                        });
                                    }}
                                >
                                    <Trash size={12} />
                                </Button>
                            </div>
                        ))}

                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                setExtractedData({
                                    ...extractedData,
                                    items: [
                                        ...extractedData.items,
                                        { id: extractedData.items.length + 1, name: "", price: 0 },
                                    ],
                                });
                            }}
                        >
                            Add Item
                            <Plus size={12} />
                        </Button>
                    </div>

                    <Button
                        disabled={!extractedData}
                        onClick={handleSplitBill}
                        variant="default"
                        className="font-sans bg-studio-700 w-full mt-16 py-5"
                    >
                        Validate Items
                    </Button>
                </>
            )}

            {extractedData && navTab === "split" && (
                <>
                    <PageHeading
                        title="Split the bill"
                        description="Split the bill between the people you're with."
                        navTab="split"
                        handleBack={handleBack}
                    />

                    <div className="mt-8 flex flex-col gap-4">
                        {people.map((person, i) => (
                            <div key={i} className="flex justify-start items-center gap-2">
                                <Input
                                    type="text"
                                    value={person.name}
                                    onChange={(e) => {
                                        setPeople(
                                            people.map((person, index) =>
                                                index === i
                                                    ? {
                                                          ...person,
                                                          name: e.target.value,
                                                      }
                                                    : person
                                            )
                                        );
                                    }}
                                />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="p-0"
                                    onClick={() => {
                                        setPeople(people.filter((_, index) => index !== i));
                                    }}
                                >
                                    <Trash size={12} />
                                </Button>
                            </div>
                        ))}

                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                setPeople([
                                    ...people,
                                    {
                                        id: people.length + 1,
                                        name: "",
                                        items: [],
                                    },
                                ]);
                            }}
                        >
                            Add Person
                            <Plus size={12} />
                        </Button>
                    </div>

                    <div className="mt-8 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium">Assign items to people</h2>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSplitEqually}
                                className={cn(
                                    splitEqually && "bg-studio-600 text-white border-transparent",
                                    "cursor-pointer transition-colors"
                                )}
                            >
                                Split Equally
                            </Button>
                        </div>

                        {extractedData.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col gap-2 rounded-md text-sm font-medium shrink-0 outline-none border bg-background shadow-xs dark:bg-input/30 dark:border-input dark:hover:bg-input/50 px-4 py-2 w-full"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <p>{item.name}</p>
                                    <p>${item.price}</p>
                                </div>

                                {people.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {people.map((person) => (
                                            <Badge
                                                key={person.id}
                                                variant="outline"
                                                onClick={() => !splitEqually && handleAssignItemToPerson(item, person)}
                                                className={cn(
                                                    Array.isArray(person.items) &&
                                                        person.items.some((i) => i.id === item.id) &&
                                                        "bg-studio-600 text-white border-transparent",
                                                    splitEqually ? "opacity-50 cursor-default" : "cursor-pointer"
                                                )}
                                            >
                                                {person.name}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <Button
                        disabled={!extractedData}
                        onClick={handleBillSummary}
                        variant="default"
                        className="font-sans bg-studio-700 w-full mt-16 py-5"
                    >
                        Split Bill
                    </Button>
                </>
            )}

            {extractedData && navTab === "summary" && (
                <>
                    <PageHeading
                        title="Bill Summary"
                        description="Review how much each person owes for their items."
                        navTab="summary"
                        handleBack={handleBack}
                    />

                    <div className="mt-8 flex flex-col gap-4 w-full">
                        {people.map((person) => (
                            <div
                                key={person.id}
                                className={cn(buttonVariants({ variant: "outline" }), "flex justify-between w-full")}
                            >
                                <p>{person.name}</p>
                                {Array.isArray(person.items) ? (
                                    <p>${person.items.reduce((sum, item) => sum + item.price, 0)}</p>
                                ) : (
                                    <p>${person.items.price}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    <Button onClick={handleShare} className="bg-studio-700 w-full mt-12 py-5">
                        <Share size={16} />
                        Share
                    </Button>

                    <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "w-full mt-4")}>
                        Back to Scan
                    </Link>
                </>
            )}
        </main>
    );
}
