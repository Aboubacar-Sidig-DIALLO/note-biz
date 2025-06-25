import { NextRequest, NextResponse } from "next/server";
import {
  changesService,
  creditsService,
  investmentsService,
  guineeCreditsService,
} from "@/lib/services/generic-crud.service";

// Mapping des modèles vers leurs services
const modelServices: Record<string, any> = {
  changes: changesService,
  credits: creditsService,
  investments: investmentsService,
  guineeCredits: guineeCreditsService,
};

// GET - Récupérer l'historique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  try {
    const { model } = await params;
    const service = modelServices[model];

    if (!service) {
      return NextResponse.json(
        { error: "Modèle non supporté" },
        { status: 400 }
      );
    }
    // Récupérer tout l'historique
    const history = await service.getAllHistory();
    return NextResponse.json(history);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
