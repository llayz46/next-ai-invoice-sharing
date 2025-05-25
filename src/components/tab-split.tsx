'use client'

import { useInvoice } from "@/context/InvoiceContext";
import { Item, Person } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import PageHeading from "./page-heading";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function TabSplit() {
    const {
        people,
        splitEqually,
        extractedData,
        setNavTab,
        setPeople,
        setSplitEqually,
        navTab
    } = useInvoice();

    if (!extractedData) return null;

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
        const currentAssignments = people.reduce((count: number, p: Person) => {
            const currentItems = Array.isArray(p.items) ? p.items : [p.items];
            return count + (currentItems.some((i) => i.id === item.id) ? 1 : 0);
        }, 0);

        const currentItems = Array.isArray(person.items) ? person.items : [person.items];
        const alreadyAssigned = currentItems.some((i) => i.id === item.id);
        const newAssignmentCount = alreadyAssigned ? currentAssignments - 1 : currentAssignments + 1;
        const pricePerPerson = newAssignmentCount > 0 ? item.price / newAssignmentCount : 0;

        const updatedPeople = people.map((p) => {
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

        setPeople(updatedPeople);
    };

    return navTab === "split" && (
        <>
            <PageHeading
                title="Split the bill"
                description="Split the bill between the people you're with."
                navTab="split"
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
                variant="studio"
                className="font-sans w-full mt-16 py-5"
            >
                Split Bill
            </Button>
        </>
    );
}
