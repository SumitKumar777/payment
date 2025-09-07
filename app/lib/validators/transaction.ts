

import { z} from "zod";

export const depositFormSchema = z.object({
   amount: z
      .string()
      .min(1, {
         message: "amount cannot be zero",
      })
      .max(8, {
         message: "amount must to0 big",
      })
});



export const phoneTransferFormSchema = z.object({
   phone:z.string().min(10,{message:"phone number is short"}).max(10,{message:"phone number is long"}),
   amount: z
      .string()
      .min(1, {
         message: "amount cannot be zero",
      })
      .max(8, {
         message: "phone number must be 10 of digits",
      })
   
});

export const paymentSchema = z.object({
   userId: z.string(),
   amount: z.string(),
   transxId: z.string(),
   status: z.string(),
});

export const userBank = z.object({
   userId: z.number(),
   transxId: z.string(),
   type: z.string(),
   amount: z.string(),
   status: z.string()
})

export const userInitiate = z.object({
   id: z.string(),
   amount: z.string(),
   type: z.string()
});


export const userTransfer = z.object({
   id: z.number(),
   toUserPhone: z.string(),
   amount: z.string()
})

export const userWithdraw = z.object({
   userId: z.number(),
   amount: z.string(),
   type: z.string(),
})




export type OnRampInput = z.infer<typeof depositFormSchema>