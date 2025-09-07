"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const AuthUser = () => {
	const router = useRouter();
	return (
		<>
			<div className="flex gap-4 ">
				<button onClick={() => router.push("/signup")} className="p-2">
					Signup
				</button>
				<button onClick={() => signIn()} className="p-2">
					Signin
				</button>
			</div>
		</>
	);
};

export default AuthUser;
