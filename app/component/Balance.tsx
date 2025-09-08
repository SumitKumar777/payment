import prisma from "@/prisma";
import LastUpdated from "./LastUpdated";


const getUserData=async(id:number)=>{

   
   try {

			const usrBalance = await prisma.user.findUnique({
				where: {
					id
				},
				select: {
					wallet: true,
               updatedAt:true,
				},
			});

         return usrBalance;
		} catch (error) {
         console.log(error,"error in the balance component")
         return null
		}
}

const Balance=async({userId}:{userId:number})=>{
  const userData: {
		wallet: bigint;
		updatedAt: Date;
	} | null = await getUserData(userId);

	return (
		<>
			<div className="flex justify-between p-4 rounded-2xl">
				<div className=" ">
					<p>Available Balance</p>
					<div className="text-2xl font-">
						₹
						{userData?.wallet
							? (Number(userData.wallet) / 100).toFixed(2)
							: "0.00"}
					</div>
				</div>
            <LastUpdated userData={userData}/>
			</div>
		</>
	);

}

export default Balance;