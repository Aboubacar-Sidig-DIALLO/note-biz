import { NextResponse } from "next/server";
import {
  changesService,
  creditsService,
  investmentsService,
  guineeCreditsService,
} from "@/lib/services/generic-crud.service";

export async function GET() {
  try {
    // Récupérer le nombre d'éléments actifs pour chaque modèle
    const [changes, credits, guineeCredits, investments] = await Promise.all([
      changesService.findAll(),
      creditsService.findAll(),
      guineeCreditsService.findAll(),
      investmentsService.findAll(),
    ]);

    const stats = {
      changes: {
        title: "Monnaies",
        activeItems: changes.length,
        historyUrl: "/history/changes",
      },
      credits: {
        title: "Avoirs",
        activeItems: credits.length,
        historyUrl: "/history/credits",
      },
      guineeCredits: {
        title: "Avoir en Guinée",
        activeItems: guineeCredits.length,
        historyUrl: "/history/guinee-credits",
      },
      investments: {
        title: "Investissements",
        activeItems: investments.length,
        historyUrl: "/history/investments",
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}
