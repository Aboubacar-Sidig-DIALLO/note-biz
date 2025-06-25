import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { EMAIL_DEFAULT } from "@/app/constants/constant";
import { headers } from "next/headers";
import { verifyPin } from "@/helpers/bcrypt";

// Middleware pour vérifier l'authentification interne
async function verifyInternalAuth() {
  const headersList = await headers();
  const internalAuth = headersList.get("x-internal-auth");
  const expectedAuth = process.env.INTERNAL_AUTH_SECRET;

  if (internalAuth !== expectedAuth) {
    throw new Error("Non autorisé");
  }
}

export async function POST(req: Request) {
  try {
    // Vérifier l'authentification interne
    verifyInternalAuth();

    const { pin } = await req.json();

    if (!pin || typeof pin !== "string") {
      return NextResponse.json({ error: "PIN requis" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: EMAIL_DEFAULT,
      },
      select: {
        name: true,
        email: true,
        pin: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Verify the pin against the stored hashed pin
    const isValidPin = await verifyPin(pin, user.pin);
    if (!isValidPin) {
      return NextResponse.json({ error: "PIN incorrect" }, { status: 401 });
    }

    // Ne pas renvoyer le PIN hashé
    const { pin: _, ...userWithoutPin } = user;
    return NextResponse.json(userWithoutPin);
  } catch (error) {
    console.error("Error verifying user:", error);
    if (error instanceof Error && error.message === "Non autorisé") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
