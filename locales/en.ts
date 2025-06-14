export default {
    home: {
        title: "Share Bills, Keep Friends",
        description: "Split bills effortlessly with friends. Just snap, tap, and share - it's that simple. No accounts needed.",
        button: "Scan Invoice",
        history: "History",
    },
    back: "Back",
    scan: {
        scan: {
            title: "Scan Receipt",
            description: "Take a photo or upload an image of your receipt.",
            button: "Scan Invoice",
            formImageUpload: {
                title: "Drop your image here or click to browse",
                maxSize: "Max size: {maxSize}MB",
                errorImage: "Please select an image first.",
                errorExtract: "Failed to extract data from invoice.",
                success: "Invoice data extracted.",
            }
        },
        items: {
            title: "Receipt Items",
            description: "Here are the items on your receipt.",
            total: "Total: ${total}",
            button: "Add Item",
            validate: "Validate Items",
            error: {
                name: "All items must have a name",
                empty: "Menu need to be empty before delete"
            },
            delete: "Delete Item",
        },
        split: {
            title: "Split the Bill",
            description: "Split the bill between the people you're with.",
            addPerson: "Add Person",
            assignItems: "Assign items to people",
            splitEqually: "Split Equally",
            splitBill: "Split Bill",
            devise: "${price}",
            error: {
                noPeople: "No people to split the bill between",
                noItemsAssigned: "All items must be assigned to a person",
                noTotalAmount: "No total amount found",
            },
            success: "Bill split equally",
        },
        summary: {
            title: "Bill Summary",
            description: "Review how much each person owes for their items.",
            button: "Share",
            back: "Back to home page",
            copied: "Copied to clipboard",
            text: "Here's how we should split this bill:\n{billSummary}\nTotal: ${total}",
            saved: "Bill saved successfully",
            save: "Save Bill",
        },
    },
    theme: {
        srOnly: "Toggle theme",
        light: "Light",
        dark: "Dark",
        system: "System",
    },
    history: {
        title: "History",
        back: "Back to Home",
        description: "Here are your saved bills.",
        empty: "No saved bills",
        total: "Total: ${total}",
        splitBetween: "Split between {people} people",
        amount: "${amount}",
        delete: "Delete from history",
    },
    footer: "Powered by Gemini AI"
} as const;
