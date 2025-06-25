import { PageConfig } from "@/components/GenericBizPage";

// Configuration centralisée pour toutes les pages métier
export const PAGE_CONFIGS: Record<string, PageConfig> = {
  changes: {
    model: "changes",
    title: "Monnaies",
    buttonLabel: "Ajouter une Monnaie",
    addModalTitle: "Ajouter une monnaie",
    emptyStateTitle: "Aucune monnaie",
    emptyStateDescription:
      "Il n'y a actuellement aucune monnaie enregistrée. Ajoutez votre première monnaie pour commencer.",
  },
  credits: {
    model: "credits",
    title: "Avoirs",
    buttonLabel: "Ajouter un Crédit",
    addModalTitle: "Ajouter un crédit",
    emptyStateTitle: "Aucun crédit trouvé",
    emptyStateDescription:
      "Il n'y a actuellement aucun crédit à afficher. Ajoutez votre premier crédit pour commencer.",
  },
  "guinee-credits": {
    model: "guinee-credits",
    title: "Avoirs en Guinée",
    buttonLabel: "Ajouter un Avoir",
    addModalTitle: "Ajouter un avoir en Guinée",
    emptyStateTitle: "Aucun avoir en Guinée",
    emptyStateDescription:
      "Il n'y a actuellement aucun avoir enregistré en Guinée. Ajoutez votre premier avoir pour commencer.",
  },
  investments: {
    model: "investments",
    title: "Investissements",
    buttonLabel: "Ajouter un Investissement",
    addModalTitle: "Ajouter un investissement",
    emptyStateTitle: "Aucun investissement",
    emptyStateDescription:
      "Il n'y a actuellement aucun investissement enregistré. Ajoutez votre premier investissement pour commencer.",
  },
};
