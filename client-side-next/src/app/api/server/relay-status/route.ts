import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try{
        const reqBody = await request.json();
        const serverResponse = await axios.get(`${process.env.SERVER_DOMAIN}:${process.env.SERVER_PORT}/api/relay`)
        console.log(serverResponse.data)
        
        return NextResponse.json({message:'change'}, {status:200})
    }catch(error:any){
        return NextResponse.json({error: 'Error in api/server/unlock: Could not unlockthe door'}, {status:400});
    }
}