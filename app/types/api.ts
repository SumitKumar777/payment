// all the response types for the API
// all the request types for the API






export type ApiResponse<T>={
   success:boolean;
   message:string,
   data?:T,
   error?:string
}