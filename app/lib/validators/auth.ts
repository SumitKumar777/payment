// auth related zod validation like login /signup 


import {z} from "zod";


export const formSchema = z.object({
   phoneNumber: z
      .string()
      .min(10, {
         message: "phone number must be 10 of digits",
      })
      .max(10, {
         message: "phone number must be 10 of digits",
      }),
   password: z.string().min(2, {
      message: "Username must be at least 2 characters.",
   }),
});


export const signupFormSchema = z
   .object({
      username: z.string().min(2, { message: "Username too short" }),

      phoneNumber: z
         .string()
         .min(10, {
            message: "phone number must be 10 of digits",
         })
         .max(10, {
            message: "phone number must be 10 of digits",
         }),
      password: z.string().min(2, {
         message: "Username must be at least 2 characters.",
      }),
      confirm: z.string(),
   })
   .refine((data) => data.password === data.confirm, {
      message: "password didn't match ",
      path: ["confirm"],
   });


export const userSignup = z.object({
   username: z.string(),
   phone: z
      .string()
      .min(10, { message: 'Must be a valid mobile number' })
      .max(14, { message: 'Must be a valid mobile number' }),
   password: z.string(),
   confirm: z.string()

}).refine((data) => data.password === data.confirm, {
   message: "Passwords don't match",
   path: ["confirm"],
})


// export type RegisterInput = z.infer<typeof RegisterSchema>;