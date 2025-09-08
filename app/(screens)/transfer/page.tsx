"use client";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Button } from "@/app/component/ui/button";
import { phoneTransferFormSchema } from "@/app/lib/validators/transaction";

import {Send} from "lucide-react"




const Transfer =  () => {


	const { data: session } = useSession();
	let id: string;

	if (session && session.user) {

		id = session.user.id;
	}



	async function onSubmit(values: z.infer<typeof phoneTransferFormSchema>) {
		const { phone,amount } = values;

		const bankResponse=await axios.post("/api/wallet/pay",{
			id:Number(id),
			toUserPhone:phone,
			amount
		})
		if(!bankResponse){
			console.log("transfer failed  from the bank",bankResponse)
		}

		
	}
	const form = useForm<z.infer<typeof phoneTransferFormSchema>>({
		resolver: zodResolver(phoneTransferFormSchema),
		defaultValues: {
			phone:"",
			amount: "",
		},
	});


	
return (
	<>
		<div className="mt-4">
			<div className="space-y-2">
				<h1 className="text-2xl ">Send Money</h1>
				<p className="text-gray-500">
					Transfer money to any phone number instantly
				</p>
			</div>
		</div>
		<div className=" p-2 mt-10">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Recipient Phone Number *</FormLabel>
								<FormControl>
									<Input placeholder="892382XXXX" {...field} type="number" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="amount"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Amount</FormLabel>
								<FormControl>
									<Input
										placeholder="2322.92"
										{...field}
										type="number"
										min={1}
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
					<Button type="submit" className="w-full mt-6 ">
						<Send className="mr-2"/>Send Money
					</Button>
				</form>
			</Form>
		</div>
	</>
);
};

export default Transfer;
