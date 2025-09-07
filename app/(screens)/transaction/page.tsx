import RecentTransaction from "@/app/component/RecentTransaction";
import { authOptions } from "@/app/lib/auth";
// import prisma from "@/prisma";
import { getServerSession } from "next-auth";

// import {Funnel} from "lucide-react"
// import { Input } from "@/app/component/ui/input";



export default async function Transaction() {
	const session=await getServerSession(authOptions) ;
	console.log(session,"session in the transaction");




	return (
		<div className="mt-4">
			<div className="space-y-2">
				<h1 className="text-2xl ">Transaction History</h1>
				<p className="text-gray-500">
					View and search your transaction history
				</p>
			</div>
			{/* <div className="border-1  p-4 rounded-2xl mt-8 ">
				<h1 className="flex gap-2 items-center text-2xl mb-4 ">
					{" "}
					<Funnel size={20} />
					Filters
				</h1>
				<div>
					<Input placeholder="Search the transaction"  type="text" />

				</div>
			</div> */}

			<div className="mt-10">
				<RecentTransaction id={Number(session?.user.id)} />
			</div>
		</div>
	);
}


