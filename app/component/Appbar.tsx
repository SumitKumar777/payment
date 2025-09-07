
import { getServerSession } from "next-auth";
import AppbarUser from "./AppbarUser";
import { authOptions } from "../lib/auth";
import AuthUser from "./AuthUser";

export const Appbar = async() => {
	const session=await getServerSession(authOptions);
	return (
		<div className="flex justify-between px-2 py-3 w-full border-b-2   ">
			<div className="flex items-center">
				<div className="border-2 px-2.5 py-0.5 bg-green-500 rounded-md ">P</div>
				<h1 className="ml-1 ">PayTM</h1>
			</div>
			<div className="px-2 flex items-center justify-end rounded-md ">
				{session?.user ? <AppbarUser/>:<AuthUser/>}
			</div>
		</div>
	);
};
