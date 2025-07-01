export interface HistoryPageConfig {
  model: string;
  title: string;
}

export const HISTORY_CONFIGS: Record<string, HistoryPageConfig> = {
  changes: {
    model: "changes",
    title: "Monnaies",
  },
  credits: {
    model: "credits",
    title: "Crédits",
  },
  "guinee-credits": {
    model: "guinee-credits",
    title: "Crédits Guinée",
  },
  investments: {
    model: "investments",
    title: "Investissements",
  },
  payables: {
    model: "payables",
    title: "Dettes",
  },
  receivables: {
    model: "receivables",
    title: "Créances",
  },
};
