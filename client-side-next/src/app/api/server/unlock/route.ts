import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try{
        const reqBody = await request.json();
        console.log(reqBody);
        
        return NextResponse.json({message:'change'}, {status:200})
    }catch(error:any){
        return NextResponse.json({error: 'Error in api/server/unlock: Could not unlockthe door'}, {status:400});
    }
}