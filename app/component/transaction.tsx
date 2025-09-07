
import { MoveUpRight,MoveDownRight } from "lucide-react";
import { Transactions } from "./RecentTransaction";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";


const Transaction=async(transx:Transactions)=>{
   const session=await getServerSession(authOptions);
   return (
			<>
				<div className="flex justify-between border-b-1 p-4 hover:bg-gray-100">
					<div className="flex gap-4 justify-center items-center">
						<div
							className={` ${
								transx.type === "deposit" ? "text-green-400" : "text-red-400"
							} p-1 rounded-md border-1 bg-gray-100 `}
						>
							{transx.type === "deposit" ? (
								<MoveUpRight size={15} />
							) : (
								<MoveDownRight size={15} />
							)}
						</div>
						<div className="space-y-0.5">
							<p className="text-md">
								{session?.user.name === transx.to
									? `you to ${transx.from}`
									: `${transx.to} to you`}
							</p>
							<p className="text-[12px] text-gray-400">
								{transx.updatedAt.toLocaleString("en-GB", {
									day: "2-digit",
									month: "short",
									year: "numeric",
									hour: "2-digit",
									minute: "2-digit",
									hour12: true,
								})}
							</p>
						</div>
					</div>
					<div className="text-end">
						<p
							className={
								session?.user.name === transx.to
									? "text-red-500"
									: "text-green-500"
							}
						>
							{session?.user.name === transx.to ? "-" : null}{" "}
							{(Number(transx.amount) / 100).toFixed(2)}
						</p>
						<p
							className={`
    ${transx.status.toLowerCase() === "completed" && "bg-green-300"}
    ${transx.status.toLowerCase() === "success" && "bg-red-300"}
    text-sm rounded-md
  `}
						>
							{transx.status}
						</p>
					</div>
				</div>
			</>
		);
}

export default Transaction;