export const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Avoirs",
    href: "/credits",
  },
  {
    label: "Monnaies",
    href: "/changes",
  },
  {
    label: "Avoir en Guinée",
    href: "/guinee-credits",
  },
  {
    label: "Investissements",
    href: "/investments",
  },
  {
    label: "Créances",
    href: "/receivables",
  },
  {
    label: "Dettes",
    href: "/payables",
  },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
