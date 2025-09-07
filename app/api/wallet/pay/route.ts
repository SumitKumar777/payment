import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

import { getBalance } from "../../actions/getBalance";
import { TransactionStatus, TransactionType } from "@prisma/client";
import { userTransfer } from "@/app/lib/validators/transaction";




export const POST = async (req: NextRequest) => {
   const body = await req.json();
   const parsedData = userTransfer.safeParse(body);
   if (!parsedData.success) {
   throw new Error("request body is invalid");
   }
   const receiver = await prisma.user.findUnique({
      where: { phoneNumber: parsedData.data.toUserPhone },
      select: {
         id: true,
         username:true
      }
   });
   const sender = await prisma.user.findUnique({
      where: { id: Number(parsedData.data.id) },
      select: {
         id: true,
         username: true
      }
   });
   if(!receiver){
     throw new Error("Reciever not found")
   }
   if (parsedData.data.id === receiver?.id) {
      return NextResponse.json({ message: "Self transfer", }, { status: 400 })
   }

   try {


      await prisma.$transaction(async (tx) => {
         const balance = await getBalance(parsedData.data.id);
         if (balance === null) throw new Error("user balance not found");
         if (balance < BigInt(parsedData.data.amount)) throw new Error("insufficient balance");


         const sender = await tx.user.update({
            where: { id: parsedData.data.id },
            data: { wallet: { decrement: BigInt(parsedData.data.amount) } }
         });

         const receiver = await tx.user.update({
            where: { phoneNumber: parsedData.data.toUserPhone },
            data: { wallet: { increment: BigInt(parsedData.data.amount) } }
         });


         await tx.transaction.create({
            data: {
               fromUserId: sender.id,
               fromUserName:sender.username,
               toUserId: receiver.id,
               toUserName:receiver.username,
               amount: BigInt(parsedData.data.amount),
               type: TransactionType.TRANSFER,
               status: TransactionStatus.SUCCESS

            }
         });
      });
      return NextResponse.json({ message: "transfered successfully " })

   } catch (error) {

      await prisma.transaction.create({
         data: {
            fromUserId: parsedData.data.id,
            fromUserName:sender?.username as string,
            toUserId: receiver?.id as number,
            toUserName:receiver.username,
            amount: BigInt(parsedData.data.amount),
            type: TransactionType.TRANSFER,
            status: TransactionStatus.FAILED
         }
      });
      console.log("error in the pay route", error);
      return NextResponse.json({ message: "Transaction failed", error }, { status: 400 })
   }
}