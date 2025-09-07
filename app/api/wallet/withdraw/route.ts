import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getBalance } from "../../actions/getBalance";
import { OnRampStatus, OnRampType } from "@prisma/client";
import axios from "axios";
import { userWithdraw } from "@/app/lib/validators/transaction";

import { ApiResponse } from "@/app/types/api";


type withDrawData={
   id:number,
   username: string;
   wallet: string;
   
}



export const POST = async (req: NextRequest) => {
   try {
      const body = await req.json();

      const parsedData = userWithdraw.safeParse(body);

      if (!parsedData.success) {
         return NextResponse.json({ message: "request body is invalid ", parsedData }, { status: 400 })
      }
      const userId = parsedData.data.userId;

      const value = Number(parsedData.data.amount);



         const balance = await getBalance(userId);

         if (balance === null) {
            throw new Error("balance not found");
         }

         if (balance < BigInt(parsedData.data.amount)) {
            throw new Error("Balance is lower than withdraw request");
         }

         try {
            const addMoneyBank = await axios.post("http://localhost:3001/api/transaction/withdraw",{
               id:Number(parsedData.data.userId),
               amount:parsedData.data.amount
            })
            if(!addMoneyBank){
               throw new Error("bank with failed");
            }
            const userQuery = await prisma.$transaction(async (tx) => {

               const updatedUser = await tx.user.update({
                  where: {
                     id: userId,
                  },
                  data: {
                     wallet: {
                        decrement: BigInt(value)
                     }
                  },
                  select: {
                     id: true,
                     username: true,
                     wallet: true
                  }
               })

                await tx.onRamp.create({
                  data: {
                     userId,
                     amount: BigInt(parsedData.data.amount),
                     status: OnRampStatus.COMPLETED,
                     type: OnRampType.WITHDRAW
                  }
               })
              
               return updatedUser;
            })

            return NextResponse.json<ApiResponse<withDrawData>>({success:true,message:"withdraw completed",data:{...userQuery,wallet:userQuery.wallet.toString()}})

         } catch (error) {
            const record=await prisma.onRamp.create({
               data: {
                  userId,
                  amount: BigInt(parsedData.data.amount),
                  status: OnRampStatus.FAILED,
                  type: OnRampType.WITHDRAW
               }
            })
            console.log("error in withdraw", error);
            return NextResponse.json({ message: "withdraw completed", data: { ...record, amount: record.amount.toString() } },{status:400})
         }
      }
    
    catch (error) {
      console.log("error in withdraw", error);
      return NextResponse.json({ error, message: "error in the withdraw" });
   }
}
