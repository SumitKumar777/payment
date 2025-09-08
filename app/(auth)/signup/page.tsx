
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { signupFormSchema } from "@/app/lib/validators/auth";


export default function SignUp() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const router = useRouter();
	async function onSubmit(values: z.infer<typeof signupFormSchema>) {
		const { username, phoneNumber, password, confirm } = values;

		try {
			if (password !== confirm) {
				setErrorMessage("password didn't match ");
				return;
			}

			const signUser = await axios.post("/api/signup", {
				username,
				phone: phoneNumber,
				password,
				confirm,
			});
		
			console.log(signUser, "signUser");

			if (signUser.data) {
				await signIn("credentials", {
					phoneNumber,
					password,
				});
				router.push("/");
			}
		} catch (error) {
			console.error("Signup failed:", error);
		}
	}
	const form = useForm<z.infer<typeof signupFormSchema>>({
		resolver: zodResolver(signupFormSchema),
		defaultValues: {
			username: "",
			phoneNumber: "",
			password: "",
			confirm: "",
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
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input placeholder="rahul" {...field} type="text" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="phoneNumber"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone Number</FormLabel>
								<FormControl>
									<Input placeholder="9823423XXX" {...field} type="tel" />
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
									<Input
										placeholder="create password"
										{...field}
										type="password"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="confirm"
						render={({ field }) => (
							<FormItem>
								<FormLabel>ConfirmPassword</FormLabel>
								<FormControl>
									<Input
										placeholder="re-enter the password"
										{...field}
										type="password"
									/>
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
						Not Register <Link href={"/signin"}> SignIn</Link>{" "}
					</p>
					{errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
				</form>
			</Form>
		</div>
	);
}
