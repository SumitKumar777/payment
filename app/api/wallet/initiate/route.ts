
import prisma from "@/prisma";
import { OnRampStatus, OnRampType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import axios from "axios";
import { userInitiate } from "@/app/lib/validators/transaction";



export const POST = async (req: NextRequest) => {
   const body = await req.json();

   const parsedData = userInitiate.safeParse(body);

   if (!parsedData.success) {
      return NextResponse.json({ message: "request body invalid", parsedData }, { status: 400 })
   }
   try {


      const initTransaction = await prisma.onRamp.create({
         data: {
            userId: Number(parsedData.data.id),
            type: OnRampType.DEPOSIT,
            status: OnRampStatus.PENDING,
            amount: BigInt(parsedData.data.amount)
         },
      });

      // "http://localhost:3001/api/transaction/session"
      const bankResponse = await axios.post(`${process.env.NEXT_PUBLIC_BANKSERVER_URL}/api/transaction/session`, {

         tranxId: initTransaction.id,
         userId: Number(initTransaction.userId),
         amount: (initTransaction.amount).toString(),
      },
      )

     

      return NextResponse.json({ message: "success in Initiate", redirectUrl: bankResponse.data.bankResponse })

   } catch (error) {
      console.log(error, "error");

      return NextResponse.json({ message: "error while initate transfer", error }, { status: 500 });
   }
}