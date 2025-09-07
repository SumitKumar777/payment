import Balance from "@/app/component/Balance";
import QuickAction from "@/app/component/QuickAction";
import RecentTransaction from "@/app/component/RecentTransaction";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/prisma";
import {  Send, Wallet } from "lucide-react";

import { getServerSession } from "next-auth";
import Link from "next/link";

const userData=async(id:string)=>{

	const  userDataResponse= await prisma.user.findUnique({
		where:{
			id:Number(id)
		}
	})
	return userDataResponse;
}


export default async function Dashboard() {
	const session = await getServerSession(authOptions);
	let data;
	if(session?.user?.id){
			 data = await userData(session?.user?.id);
	}

const quickActionsData = [
	{
		id: 1,
		svg: <Send className="text-white" size={20} />,
		heading: "Send Money",
		description: "Transfer funds in seconds",
		link: "/transfer",
		color: "bg-green-500",
	},
	{
		id: 2,
		svg: <Send className="text-white" size={20} />,
		heading: "Deposit/Withdraw",
		description: "Bring In or Take out money",
		link: "/onramp",
		color: "bg-blue-500",
	},
	{
		id: 3,
		svg: <Wallet className="text-white" size={20} />,
		heading: "History",
		description: "Track your payments",
		link: "/transaction",
		color: "bg-purple-500",
	},
];

	return (
		<div className="w-full ">
			<div className="">
				<h1 className="text-3xl">
					Welcome Back, {data?.username[0].toUpperCase()}
					{data?.username.slice(1)}!
				</h1>
				<p>Here&apos;s is financial overview </p>
			</div>
			<div className="p-4 bg-red-200 rounded-2xl my-4">
				<Balance userId={Number(session?.user.id)} />
			</div>
			<div className="w-full">
				<h1 className="text-xl font-semibold my-3">Quick Actions</h1>
				<div className="block md:flex md:gap-4">
					{quickActionsData.map((item) => (
						<QuickAction key={item.id} data={item} />
					))}
				</div>
			</div>
			<div>
				<div className="flex justify-between py-2 mb-2">
					<h1 className="text-xl font-semibold ">Recent Transactions</h1>
					<Link href="/transaction" className="px-3 py-1 rounded-md bg-gray-200 text-sm">View All</Link>
				</div>
				<RecentTransaction id={Number(session?.user.id)} />
			</div>
		</div>
	);
}
