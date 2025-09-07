import Link from "next/link";

import { House,History, CoffeeIcon,ArrowUpDown } from "lucide-react";

export default function Sidebar() {
	return (
		<>
			<div className="border-2 inline-block  fixed bottom-0 w-full z-10 bg-gray-200">
				<div className="flex  items-center justify-center  text-[12px] text-center  ">
					<Link
						href={"/dashboard"}
						className="w-full py-5 px-2 hover:bg-blue-200  flex flex-col justify-center items-center focus:bg-blue-400"
						prefetch
					>
						<House size={20} />
						<p className="text-[10px]">Dashboard</p>
					</Link>

					<Link
						href={"/onramp"}
						className="w-full py-5 px-2 hover:bg-blue-200  flex flex-col justify-center items-center focus:bg-blue-400"
						prefetch
					>
						<House size={20} />
						<p className="text-[10px]">Onramp</p>
					</Link>

					<Link
						href={"/transfer"}
						className="w-full py-5 px-2 hover:bg-blue-200  flex flex-col justify-center items-center focus:bg-blue-400"
						prefetch
					>
						<ArrowUpDown size={20} />
						<p className="text-[10px]">Phone transfer</p>
					</Link>

					<Link
						href={"/transaction"}
						className="w-full py-5 px-2 hover:bg-blue-200  flex flex-col justify-center items-center focus:bg-blue-400"
					>
						<History size={20} />
						<p className="text-[10px]">History</p>
					</Link>

					<Link
						href={"/coffee"}
						className="w-full py-5 px-2 hover:bg-blue-200  flex flex-col justify-center items-center focus:bg-blue-400"
					>
						<CoffeeIcon size={20} />
						<p className="text-[10px]">Coffee</p>
					</Link>
				</div>
			</div>
		</>
	);
}
