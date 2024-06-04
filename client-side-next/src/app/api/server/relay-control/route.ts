import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import serverToken from "@/app/layout"

export async function POST(request: NextRequest){
    try{
        const {relay_command, relay_number, relay_delay} = await request.json();

        if(relay_delay){
            const serverResponse = await axios.post(`${process.env.SERVER_DOMAIN}:${process.env.SERVER_PORT}/api/relay/${relay_command}?relay_number=${relay_number}&relay_delay=${relay_delay}`);
            console.log(serverResponse)
            return NextResponse.json({message:serverResponse}, {status:200})
        }else{
            const serverResponse = await axios.post(`${process.env.SERVER_DOMAIN}:${process.env.SERVER_PORT}/api/relay/${relay_command}?relay_number=${relay_number}`, {headers:{'Authorization': `Bearer ${serverToken}`}});
            console.log(serverResponse)
            return NextResponse.json({message:serverResponse}, {status:200})
        }
        
    }catch(error:any){
        console.log(error)
        return NextResponse.json({error}, {status:400});
    }
}