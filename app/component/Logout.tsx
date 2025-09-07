"use client"

import { signOut } from "next-auth/react"

export default function Logout(){
   return <>
   <button  onClick={()=>signOut()} className="hover:bg-amber-200 w-full">Logout</button>
   </>
}