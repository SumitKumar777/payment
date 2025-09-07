"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface QuickActionProps {
	data: {
		svg: ReactNode;
		heading: string;
		description: string;
		link: string;
      color:string;
	};
}

const QuickAction = ({ data }: QuickActionProps) => {
	return (
		<Link href={data.link} className="w-full">
			<div className="p-6 border border-gray-300 rounded-2xl mb-4 cursor-pointer hover:shadow-md transition">
				<div className="flex gap-3">
					<div className={`p-2.5 rounded-md ${data.color}`}>{data.svg}</div>
					<div className="inline-block">
						<p className="text-sm">{data.heading}</p>
						<p className="text-[12px] text-gray-400">{data.description}</p>
					</div>
				</div>
			</div>
		</Link>
	);
};


export default QuickAction;
