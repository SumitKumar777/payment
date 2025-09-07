import type { Metadata } from "next";
import "./globals.css";
import SessProvider from "./component/SessionProvider";
import { Appbar } from "./component/Appbar";


export const metadata: Metadata = {
	title: "Paytm",
	description: "this is a paytm app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<SessProvider>
					<Appbar />
					<div className="flex overflow-hidden ">
						{children}
					</div>
				</SessProvider>
			</body>
		</html>
	);
}
