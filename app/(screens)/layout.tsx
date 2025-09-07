import { Suspense } from "react";
import Sidebar from "../component/Sidebar";
import Loading from "./loading";

export default function ScreenLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-col w-full">
			<Suspense fallback={<Loading/>}>
				<div className="mx-4 lg:mx-20">{children}</div>
			</Suspense>

			<Sidebar />
		</div>
	);
}
