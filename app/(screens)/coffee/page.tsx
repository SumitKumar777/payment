"use client";
import { getBalance } from "@/app/api/actions/getBalance";
import { Button } from "@/app/component/ui/button";
import { Input } from "@/app/component/ui/input";
import { CoffeeIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {Heart} from "lucide-react"


	 
		
function Coffee() {
	const [balance,setBalance]=useState<bigint | null>(null)
	const [amount,setAmount]=useState<number| null>(null);
	const {data:session}=useSession();
	
	const id=Number(session?.user.id);

	useEffect(()=>{

		if(!id){
			return
		}
		const fetchBalance= async()=>{
			const balance=await getBalance(id);
			setBalance(balance);
		}

		fetchBalance();
		return ;
	},[balance,id]);

	return (
		<div className="space-y-6">
			<div className="text-center">
			
				<div className="p-4 bg-blue-100 inline-block rounded-full ">
					<CoffeeIcon size={40} className="text-blue-400 flex justify-center" />
				</div>
				<h2 className="text-2xl">Buy Me a Coffee</h2>
				<p className="text-gray-400 text-sm px-2 mt-2">
					Support our work with a small donation. Every contribution helps!
				</p>
			</div>
			<div className="text-center p-4 border-1   rounded-md">
				<div className="">
					<p className="text-[12px] text-gray-400">Available Balance</p>
					<p className="text-2xl font-semibold">
						₹{balance ? (Number(balance) / 100).toFixed(2) : "0.00"}
					</p>
				</div>
			</div>
			<div className="p-4 border-1  rounded-md">
				<p>Choose an amount</p>
				<div className="grid grid-cols-2 gap-2 mt-4">
					<button
						className="py-3 border-1 border-grey flex justify-center items-center gap-4 rounded-md hover:bg-blue-400 transition"
						onClick={() => setAmount(50)}
					>
						{" "}
						<CoffeeIcon size={20} />
						₹50.00
					</button>
					<button
						className="py-3 border-1 border-grey flex justify-center items-center gap-4 rounded-md hover:bg-blue-400 transition"
						onClick={() => setAmount(100)}
					>
						{" "}
						<CoffeeIcon size={20} />
						₹100.00
					</button>
					<button
						className="py-3 border-1 border-grey flex justify-center items-center gap-4 rounded-md hover:bg-blue-400 transition"
						onClick={() => setAmount(250)}
					>
						{" "}
						<CoffeeIcon size={20} />
						₹250.00
					</button>
					<button
						className="py-3 border-1 border-grey flex justify-center items-center gap-4 rounded-md hover:bg-blue-400 transition"
						onClick={() => setAmount(500)}
					>
						{" "}
						<CoffeeIcon size={20} />
						₹500.00
					</button>
				</div>
				<div className="mt-4 space-y-2">
					<p className="text-[14px]">Or enter custom amount</p>
					<Input
						placeholder="Enter custom amount"
						type="number"
						onChange={(e) => setAmount(Number(e.target.value))}
					/>
				</div>
			</div>
			<div className="w-full mb-20 p-6 border-1 rounded-md text-center   ">
				<h1 className="mb-4">
					{amount ? `You're about to donate ₹${amount}` : null}
				</h1>
				<Button className="w-full bg-blue-400">
					<Heart /> Donate Now
				</Button>
			</div>
		</div>
	);
}

export default Coffee;
