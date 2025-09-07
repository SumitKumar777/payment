interface UserData {
	wallet: bigint;
	updatedAt: Date;
}

interface LastUpdatedProps {
	userData: UserData | null;
}

function LastUpdated({ userData }: LastUpdatedProps) {
	return (
		<div className="text-end">
			<p>Last updated</p>
			<p className="">
				{userData?.updatedAt
					? userData.updatedAt.toLocaleString("en-GB", {
							day: "2-digit",
							month: "2-digit",
							year: "numeric",
							hour: "2-digit",
							minute: "2-digit",
							hour12: true,
					  })
					: "1/9/2025"}
			</p>
		</div>
	);
}


export default LastUpdated;