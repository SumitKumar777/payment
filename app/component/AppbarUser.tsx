

import { DropdownMenu } from "radix-ui";
import Logout from "./Logout";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";



const AppbarUser = async() => {
   const session=await getServerSession(authOptions);

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<div className="lg:flex justify-center items-center gap-2 ">
					<button
						className="IconButton rounded-full bg-green-400 px-3 py-1  ml-2"
						aria-label="Customise options "
					>
						{session?.user?.name ? session.user.name[0].toUpperCase() : "A"}
					</button>
					<p className="hidden lg:block">{session?.user.name}</p>
				</div>
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					className="DropdownMenuContent   bg-amber-300"
					sideOffset={5}
				>
					<DropdownMenu.Item className="DropdownMenuItem ">
						<Logout />
					</DropdownMenu.Item>
					<DropdownMenu.Item className="DropdownMenuItem">
						Settings
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
};

export default AppbarUser;
