
import { userSignup } from "@/app/lib/validators/auth";
import prisma from "@/prisma";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/app/types/api";



 type ResponseData={
   id:number,
   username:string,
    createdAt:Date

}


export const POST = async (req: NextRequest) => {
   try {
      const data = await req.json();
      const parsedData = userSignup.safeParse(data);
      if (!parsedData.success) {
         return NextResponse.json({ message: "invalid inputs", error: parsedData.error.message, }, { status: 400 })
      }

      const createBankUser = await axios.post("http://localhost:3001/api/auth/signup", {
         username: parsedData.data.username,
         phone: parsedData.data.phone,
         password: parsedData.data.password
      });
      console.log(createBankUser, "createBankUser");
      if (!createBankUser) {
         return NextResponse.json<ApiResponse<null>>({success:false, message: "banksignup failed", data: createBankUser }, { status: 400 })
      }

      let userFound = await prisma.user.findUnique({
         where: {
            phoneNumber: parsedData.data.phone
         },select:{
            id:true,
            username:true,
            createdAt:true
         }
      })

      if (!userFound) {
         userFound = await prisma.user.create({
            data: {
               username: parsedData.data.username,
               phoneNumber: parsedData.data.phone,
               password: parsedData.data.password
            },select:{
               id:true,
               username:true,
               createdAt:true
            }
         })
      }

      if (!userFound) {
         throw new Error("user creation failed");
      }

        

      return NextResponse.json<ApiResponse<ResponseData>>({success:true, message: "user created", data: userFound  }, { status: 200 });

   } catch (error) {
      console.log(error)
      return NextResponse.json<ApiResponse<ResponseData>>({success:true, message: "Internal server Error", error:"Error in the user signup"  }, { status: 500 });
   }

}