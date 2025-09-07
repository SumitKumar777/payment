"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/app/component/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/app/component/ui/form";
import { Input } from "@/app/component/ui/input";
import { useSession } from "next-auth/react";
import {
	depositFormSchema,
	OnRampInput,
	paymentSchema,
} from "@/app/lib/validators/transaction";
import { PaymentInfo } from "@/app/types/transaction";
import { getBalance } from "@/app/api/actions/getBalance";

const OnRamp = () => {
	const [screen, setScreen] = useState(true);
	const [balance, setBalance] = useState<number | null>(null);

	const searchParams = useSearchParams();
	const { data: session } = useSession();


	useEffect(() => {
		if (!session?.user?.id) return;

		const fetchBalance = async () => {
			try {
				const bal = await getBalance(Number(session.user.id));
				setBalance(Number(bal));
			} catch (error) {
				console.error("Error fetching balance:", error);
			}
		};

		fetchBalance();
	}, [session]); 


	useEffect(() => {
		if (!session?.user?.id) return;

		const paymentDetails: PaymentInfo = {
			userId: searchParams.get("userId"),
			amount: searchParams.get("amount"),
			transxId: searchParams.get("transxId"),
			status: searchParams.get("status"),
		};

		

		const validate = paymentSchema.safeParse(paymentDetails);
	

		if (validate.data) {
			const validatedData = validate.data;


			async function completeTransaction() {
				try {
					 await backendResponse(validatedData);



					const bal = await getBalance(Number(session?.user.id));
					setBalance(Number(bal));
				} catch (error) {
					console.log(error, "error in completing the transaction");
				}
			}

			completeTransaction();
		}
	}, [searchParams, session]);

	const backendResponse = async (data: PaymentInfo) => {
		const res = await axios.post("/api/wallet/deposit", {
			...data,
			userId: Number(data.userId),
			type: "deposit",
		});
		return res.data;
	};

	async function onSubmit(depositValues: OnRampInput) {
		if (!session?.user?.id) return;

		const { amount } = depositValues;
			let correctAmount;
			const [first, second] = amount.split(".");
			if (second) {
				correctAmount = first + second;
			} else {
				correctAmount = first + "00";
			}
		const data = {
			id: session.user.id,
			amount:correctAmount,
			type: "deposit",
		};

		const res = await axios.post("/api/wallet/initiate", data);
		window.open(res.data.redirectUrl);
	}

	async function onWithDraw(withDrawValues: OnRampInput) {
		if (!session?.user?.id) return;

		const { amount } = withDrawValues;
		let correctAmount;
		const [first,second]=amount.split(".");
		if(second){
			correctAmount=first+second;
		}else{
			correctAmount=first+"00";
		}
		const data = {
			userId: Number(session.user.id),
			amount:correctAmount,
			type: "withdraw",
		};

		const res = await axios.post("/api/wallet/withdraw", data);
		console.log(res, "response in onramp withdraw");


		const bal = await getBalance(Number(session.user.id));
		setBalance(Number(bal));
	}

	const form = useForm<z.infer<typeof depositFormSchema>>({
		resolver: zodResolver(depositFormSchema),
		defaultValues: {
			amount: "",
		},
	});

	return (
		<div className="flex flex-col space-y-2">
			<div>
				<h1 className="text-2xl">Deposit & Withdraw</h1>
				<p className="text-gray-500">Transfer money to and from your wallet</p>
			</div>


			<div className="p-4 bg-red-200 rounded-2xl my-4">
				<div className="flex justify-between p-4 rounded-2xl">
					<div>
						<p>Available Balance</p>
						<div className="text-2xl font-semibold">
							₹{balance !== null ? (balance / 100).toFixed(2) : "0.00"}
						</div>
					</div>
					<div>
						<p className="bg-green-300 rounded-md flex justify-center items-center translate-y-3">
							Active
						</p>
					</div>
				</div>
			</div>


			<div className="mt-6 w-full">
				<div className="flex w-full">
					<button
						className="w-full p-2 rounded-2xl hover:bg-gray-100 focus:bg-gray-200"
						onClick={() => setScreen(true)}
					>
						Deposit
					</button>
					<button
						className="w-full rounded-2xl hover:bg-gray-100 focus:bg-gray-200"
						onClick={() => setScreen(false)}
					>
						Withdraw
					</button>
				</div>

				{screen ? (
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-2 mt-10"
						>
							<FormField
								control={form.control}
								name="amount"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel className="text-xl">Amount</FormLabel>
										<FormControl>
											<Input
												placeholder="2323.89"
												{...field}
												type="number"
												className="p-4"
												onChange={(e)=>{
													 const value = e.target.value;
													if(/^\d*\.?\d{0,2}$/.test(value)){
														field.onChange(value);
													}
												}}

											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full mt-10">
								Deposit Money
							</Button>
						</form>
					</Form>
				) : (
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onWithDraw)}
							className="space-y-2 mt-10"
						>
							<FormField
								control={form.control}
								name="amount"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel className="text-xl">Amount</FormLabel>
										<FormControl>
											<Input
												placeholder="2323.89"
												{...field}
												type="number"
												min={1}
												max={500000}
												className="p-4"
												onChange={(e)=>{
													const value=e.target.value;

														if(/^\d*\.?\d{0,2}$/.test(value)){
															field.onChange(value);
														}
												}}

											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full mt-10">
								Withdraw Money
							</Button>
						</form>
					</Form>
				)}
			</div>
		</div>
	);
};

export default OnRamp;
