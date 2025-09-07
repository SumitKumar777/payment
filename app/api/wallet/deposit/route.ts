import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { OnRampStatus } from "@prisma/client";
import { userBank } from "@/app/lib/validators/transaction";




export const POST = async (req: NextRequest) => {
   const body = await req.json();

   const parsedData = userBank.safeParse(body);

   if (!parsedData.success) {
      return NextResponse.json({ message: "request body is invalid ", parsedData }, { status: 400 })
   }
   try {
      const userId = parsedData.data.userId;

      const value = Number(parsedData.data.amount);

            const userQuery = await prisma.$transaction(async (tx) => {

               const updatedUser = await tx.user.update({
                  where: {
                     id: userId,
                  },
                  data: {
                     wallet: {
                        increment: BigInt(value)
                     }
                  },
                  select: {
                     id: true,
                     username: true,
                     phoneNumber: true,
                     wallet: true
                  }
               })
               if (!updatedUser) {
                  throw new Error("user upadation falied");
               }


               const recordTrnx = await tx.onRamp.update({
                  where: {
                     id: Number(parsedData.data.transxId)
                  },
                  data: {
                     status: OnRampStatus.COMPLETED,
                  }
               })
               if (!recordTrnx) {
                  throw new Error("transaction not recorded");
               }
               return updatedUser;
            })
      return NextResponse.json(
         { message: "request received", data: { ...userQuery, wallet: userQuery.wallet.toString() } },
         { status: 201 }
      );


         }  catch (error) {
      await prisma.onRamp.update({
         where: {
            id: Number(parsedData.data.transxId)
         },
         data: {
            status: OnRampStatus.FAILED,
         }
      })
      console.log("error in deposit", error);
      return NextResponse.json({ error, message: "error in the paytm deposit" });
   }

}