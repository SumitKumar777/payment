import prisma from "@/prisma"
import Transaction from "./transaction";


export interface Transactions {
	type: string;
	updatedAt: Date;
	amount: bigint;
   from :string;
   to :string;
   status:string
}

const getLatestTransaction=async(id:number)=>{
   try {
      const transaction = await prisma.user.findUnique({
				where: {
					id,
				},
				select: {
					onRamps: {
						orderBy: { createdAt: "desc" },
                  take:5
					},
					sentTransactions: {
						orderBy: { createdAt: "desc" },
                  take:5
					},
					receivedTransactions: {
						orderBy: { createdAt: "desc" },
                  take:5
					},
				},
			});
         const allTransactions: Transactions[] = [
						...(transaction?.onRamps ?? []).map((t) => ({
							type: t.type.toString().toLowerCase(),
							updatedAt: t.updatedAt,
							amount: t.amount,
							from: t.type === "DEPOSIT" ? "Bank" : "Bank",
							to: t.type === "WITHDRAW" ? "you" : "Bank",
							status: t.status,
						})),

						...(transaction?.sentTransactions ?? []).map((t) => ({
							type: "sent",
							updatedAt: t.updatedAt,
							amount: t.amount,
							from: t.fromUserName,
							to: t.toUserName,
							status: t.status,
						})),

						...(transaction?.receivedTransactions ?? []).map((t) => ({
							type: "received",
							updatedAt: t.updatedAt,
							amount: t.amount,
							from: t.fromUserName,
							to: t.toUserName,
							status: t.status,
						})),
					].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());


         return allTransactions;
   } catch (error) {
      console.log(error,"error in the getting the transaction ");
   }
}


const RecentTransaction=async({id}:{id:number})=>{
   const latestTransaction=await getLatestTransaction(id)
   return (
			<div className="border-1 rounded-2xl ">{latestTransaction ? latestTransaction.map((item, index) => <Transaction key={index} {...item} />):"No Transaction"}</div>
		);
}

export default RecentTransaction;