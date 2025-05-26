export default {
    home: {
        title: "Une nouvelle façon de partager les factures",
        description: "Partagez les factures avec vos amis en quelques clics. Pas besoin de compte. Pas besoin de connexion. Pas besoin de messagerie. Juste un appareil photo.",
        button: "Scanner une facture",
        history: "Historique",
    },
    back: "Retour",
    scan: {
        scan: {
            title: "Scanner une facture",
            description: "Prenez une photo ou téléchargez une image de votre facture.",
            button: "Scanner une facture",
            formImageUpload: {
                title: "Glissez votre image ici ou cliquez pour parcourir",
                maxSize: "Taille maximale: {maxSize}MB",
                errorImage: "Veuillez sélectionner une image d'abord.",
                errorExtract: "Impossible d'extraire les données de la facture.",
                success: "Données de la facture extraites.",
            }
        },
        items: {
            title: "Articles de la facture",
            description: "Voici les articles de votre facture.",
            total: "Total: {total} €",
            button: "Ajouter un article",
            validate: "Valider les articles",
            error: "Tous les articles doivent avoir un nom",
            delete: "Supprimer l'article",
        },
        split: {
            title: "Partager la facture",
            description: "Partagez la facture entre les personnes avec qui vous êtes.",
            addPerson: "Ajouter une personne",
            assignItems: "Assigner les articles à des personnes",
            splitEqually: "Partager équitablement",
            splitBill: "Partager la facture",
            error: {
                noPeople: "Aucune personne pour partager la facture",
                noItemsAssigned: "Tous les articles doivent être assignés à une personne",
                noTotalAmount: "Aucun montant total trouvé",
            },
            success: "Facture partagée équitablement",
        },
        summary: {
            title: "Résumé de la facture",
            description: "Revoyez combien chacune des personnes doit payer pour leurs articles.",
            button: "Partager",
            back: "Retour à la facture",
            copied: "Copié dans le presse-papiers",
            text: "Voici comment nous devons partager cette facture:\n{billSummary}\nTotal: {total} €",
            saved: "Facture sauvegardée avec succès",
            save: "Sauvegarder la facture"
        },
    },
    theme: {
        srOnly: "Basculer le thème",
        light: "Clair",
        dark: "Sombre",
        system: "Système",
    },
    history: {
        title: "Historique",
        back: "Retour à la page d'accueil",
        description: "Voici vos factures sauvegardées.",
        empty: "Aucune facture sauvegardée",
        total: "Total: {total} €",
        splitBetween: "Partager entre {people} personnes",
        amount: "{amount} €",
        delete: "Supprimer de l'historique",
    },
    footer: "Propulsé par Gemini AI"
} as const;
