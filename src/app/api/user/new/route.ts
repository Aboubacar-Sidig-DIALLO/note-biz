import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPin } from "@/helpers/bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, pin, secret } = body;

    // Validation basique
    if (!email || !pin || !secret) {
      return NextResponse.json(
        { error: "Email, PIN ou Secret requis" },
        { status: 400 }
      );
    }

    if (pin.length != 6) {
      return NextResponse.json(
        { error: "Le PIN doit contenir 6 caractères" },
        { status: 400 }
      );
    }

    if (secret.length !== 6) {
      return NextResponse.json(
        { error: "Le Secret doit contenir 6 caractères" },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un utilisateur avec cet email existe déjà" },
        { status: 409 }
      );
    }

    // Hasher le PIN
    const hashedPin = await hashPin(pin);
    const hashedSecret = await hashPin(secret);

    // Créer l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        email,
        name: name || null,
        pin: hashedPin,
        secret: hashedSecret,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return NextResponse.json(
      {
        message: "Utilisateur créé avec succès",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
