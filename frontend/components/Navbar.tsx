"use client";

import { BarChart3, HeartPulse, History, Home, LogIn, LogOut, Moon, Stethoscope, Sun, UserRound } from "lucide-react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const links = [
	{ href: "/", label: "Home", icon: Home },
	{ href: "/diagnosis", label: "Diagnosis", icon: Stethoscope },
	{ href: "/history", label: "History", icon: History },
	{ href: "/models", label: "Models", icon: BarChart3 },
];

export function Navbar() {
	const [darkMode, setDarkMode] = useState(() =>
		typeof window !== "undefined" && window.localStorage.getItem("medical-theme") === "dark",
	);
	const { data: session, status } = useSession();

	useEffect(() => {
		document.documentElement.classList.toggle("dark", darkMode);
	}, [darkMode]);

	function toggleTheme() {
		const enabled = !darkMode;
		const applyTheme = () => {
			setDarkMode(enabled);
			document.documentElement.classList.toggle("dark", enabled);
			window.localStorage.setItem("medical-theme", enabled ? "dark" : "light");
		};

		const transitionDocument = document as Document & {
			startViewTransition?: (update: () => void) => void;
		};

		if (transitionDocument.startViewTransition) {
			transitionDocument.startViewTransition(applyTheme);
		} else {
			applyTheme();
		}
	}

	return (
		<header className="site-header">
			<nav className="site-nav" aria-label="Main navigation">
				<Link href="/" className="brand">
					<span className="brand-mark"><HeartPulse size={22} strokeWidth={2.5} /></span>
					<strong>MediQ</strong>
				</Link>
				<div className="nav-links">
					{links.map(({ href, label, icon: Icon }) => (
						<Link href={href} key={href} className={label === "Home" ? "nav-link active" : "nav-link"}>
							<Icon size={15} />{label}
						</Link>
					))}
					<span className="nav-divider" />
					<button className="icon-button" type="button" aria-label="Toggle theme" onClick={toggleTheme}>
						<span className={`theme-icon ${darkMode ? "show-sun" : "show-moon"}`}>
							<Moon size={17} />
							<Sun size={17} />
						</span>
					</button>
					{status === "authenticated" ? (
						<button className="profile-name auth-action" type="button" onClick={() => signOut({ callbackUrl: "/" })}>
							<span className="user-avatar" aria-hidden="true"><UserRound size={15} /></span>
							{session.user?.name ?? "Account"}<LogOut size={14} />
						</button>
					) : status !== "loading" ? (
						<button className="profile-name auth-action" type="button" onClick={() => signIn("google", { callbackUrl: "/" })}>
							<LogIn size={15} /> Sign in with Google
						</button>
					) : null}
				</div>
			</nav>
		</header>
	);
}
