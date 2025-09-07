import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {

   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

   const {pathname}=req.nextUrl;

   const publicPaths = ["/", "/signin", "/signup"];


   if (token && publicPaths.includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
   }
   const isPublicPaths=!publicPaths.includes(pathname);
   if(!token  && isPublicPaths){
      return NextResponse.redirect(new URL("/",req.url))
   }

   return NextResponse.next();
}

export const config = {
   matcher: [
      "/",
      "/signin",
      "/signup",
      "/dashboard/:path*",
      "/coffee/:path*",
      "/onramp/:path*",
      "/transaction/:path*",
      "/transfer/:path*",
      "/api/wallet/:path*",
   ],
};
