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
  "guinee-credits": guineeCreditsService,
};

// GET - Récupérer tous les enregistrements ou un enregistrement spécifique
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Récupérer un enregistrement spécifique
      const record = await service.findById(id);
      if (!record) {
        return NextResponse.json(
          { error: "Enregistrement non trouvé" },
          { status: 404 }
        );
      }
      return NextResponse.json(record);
    } else {
      // Récupérer tous les enregistrements
      const records = await service.findAll();
      return NextResponse.json(records);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// POST - Créer un nouvel enregistrement
export async function POST(
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

    const body = await request.json();
    const record = await service.create(body);

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un enregistrement
export async function PUT(
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID requis pour la mise à jour" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const record = await service.update(id, body);

    return NextResponse.json(record);
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer ou déplacer vers l'historique
export async function DELETE(
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const moveToHistory = searchParams.get("moveToHistory") === "true";

    if (!id) {
      return NextResponse.json(
        { error: "ID requis pour la suppression" },
        { status: 400 }
      );
    }

    let result;
    if (moveToHistory) {
      // Déplacer vers l'historique
      result = await service.moveToHistory(id);
    } else {
      // Suppression définitive
      result = await service.delete(id);
    }

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
