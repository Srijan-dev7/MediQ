import type { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

const googleClientId = process.env.AUTH_GOOGLE_ID;
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!googleClientId || !googleClientSecret || !nextAuthSecret) {
	throw new Error(
		"AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, and NEXTAUTH_SECRET must be configured.",
	);
}

export const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: googleClientId,
			clientSecret: googleClientSecret,
		}),
	],
	secret: nextAuthSecret,
	session: { strategy: "jwt" },
	callbacks: {
		async signIn({ user }) {
			if (!user.email) return false;
			await connectToDatabase();
			await User.findOneAndUpdate(
				{ email: user.email },
				{ $set: { name: user.name ?? "Google user", image: user.image ?? null } },
				{ upsert: true, setDefaultsOnInsert: true },
			);
			return true;
		},
	},
	pages: { signIn: "/" },
};