import type { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.AUTH_GOOGLE_ID ?? "",
			clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
		}),
	],
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