import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { EMAIL_DEFAULT } from "@/constants/constant";
import { verifyPin } from "@/helpers/bcrypt";
import { verifyInternalAuth } from "@/services/verifyInternalAuth";

export async function POST(req: Request) {
  try {
    // Vérifier l'authentification interne
    await verifyInternalAuth();

    const { secret } = await req.json();

    if (!secret || typeof secret !== "string") {
      return NextResponse.json({ error: "Secret requis" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: EMAIL_DEFAULT,
      },
      select: {
        name: true,
        email: true,
        secret: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier le secret contre le secret hashé stocké
    const isValidSecret = await verifyPin(secret, user.secret);
    if (!isValidSecret) {
      return NextResponse.json({ error: "Secret incorrect" }, { status: 401 });
    }

    // Ne pas renvoyer le secret hashé
    const { secret: _, ...userWithoutSecret } = user;
    return NextResponse.json(userWithoutSecret);
  } catch (error) {
    console.error("Erreur lors de la vérification du secret:", error);
    if (error instanceof Error && error.message === "Non autorisé") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
