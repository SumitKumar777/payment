"use client";
import { SessionProvider } from "next-auth/react";

const SessProvider = ({ children }: { children: React.ReactNode }) => {
	return <SessionProvider>{children}</SessionProvider>;
};

export default SessProvider;
