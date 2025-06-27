import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions, User } from "next-auth";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        pin: { label: "Code PIN", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          if (!credentials?.pin) {
            throw new Error("PIN requis");
          }

          // Utiliser l'URL absolue pour l'appel fetch
          const res = await fetch(
            `${process.env.NEXTAUTH_URL}/api/user/verify`,
            {
              method: "POST",
              body: JSON.stringify({ pin: credentials.pin }),
              headers: {
                "Content-Type": "application/json",
                "x-internal-auth":
                  process.env.INTERNAL_AUTH_SECRET || "dev-secret",
              },
            }
          );

          if (!res.ok) {
            console.log("Echec d'authentification");
            return null;
          }

          const user = await res.json();
          if (!user || !user.email) {
            console.log("Données utilisateur invalides");
            return null;
          }

          return {
            id: user.id,
            name: user.name || "Utilisateur",
            email: user.email,
          };
        } catch (error) {
          console.error("Error during authentication:", error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60, // 60 secondes - durée de vie de la session
    updateAge: 50, // 50 secondes - fréquence de mise à jour de la session
  },
  callbacks: {
    async jwt({ token, user }) {
      // Persist the user data in the token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
    error: "/auth/error", // Error page
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
