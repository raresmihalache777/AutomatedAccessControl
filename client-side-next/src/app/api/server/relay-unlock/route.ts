import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try{
        const reqBody = await request.json();
        const serverResponse = await axios.post(`${process.env.SERVER_DOMAIN}:${process.env.SERVER_PORT}/api/relay/close?relay_number=1&relay_delay=2&code=${reqBody}`);
        console.log(serverResponse.data)
    
        return NextResponse.json({message:'change'}, {status:200})
    }catch(error:any){
        return NextResponse.json({error: 'Error in api/server/unlock: Could not unlock the door'}, {status:400});
    }
}