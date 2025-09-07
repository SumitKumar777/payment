"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/app/component/ui/button";
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/app/component/ui/form";
import { Input } from "@/app/component/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formSchema } from "@/app/lib/validators/auth";



export default function ProfileForm() {

	const router = useRouter();
	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { phoneNumber, password } = values;

		 await signIn("credentials", {
			phoneNumber,
			password,
			redirect: false,
		});

		router.push("/");
	}
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			phoneNumber: "",
			password: "",
		},
	});

	return (
		<div className="flex flex-col items-center justify-center">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 h-screen min-w-[500px] max-h-[500px] mt-40 px-10 "
				>
					<FormField
						control={form.control}
						name="phoneNumber"
						render={({ field }) => (
							<FormItem>
								<FormLabel>PhoneNumber</FormLabel>
								<FormControl>
									<Input placeholder="789233XXXX" {...field} type="tel" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input placeholder="password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						className="flex justify-center items-center mx-auto"
					>
						Submit
					</Button>
					<p>
						Not Register <Link href={"/signup"}> Signup</Link>{" "}
					</p>
				</form>
			</Form>
		</div>
	);
}
