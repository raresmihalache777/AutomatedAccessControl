import axios from "axios";
import https from "https";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try{
        const {relay_command, relay_number, relay_delay} = await request.json();

        if(relay_delay){
            const serverResponse = await axios.post(
                `${process.env.SERVER_DOMAIN}:${process.env.SERVER_PORT}/api/relay/${relay_command}?relay_number=${relay_number}&relay_delay=${relay_delay}`,{httpsAgent: new https.Agent({ rejectUnauthorized: false })});
            return NextResponse.json({message:serverResponse}, {status:200})
        }else{
            const serverResponse = await axios.post(
                `${process.env.SERVER_DOMAIN}:${process.env.SERVER_PORT}/api/relay/${relay_command}?relay_number=${relay_number}`,{httpsAgent: new https.Agent({ rejectUnauthorized: false })});
            return NextResponse.json({message:serverResponse}, {status:200})
        }
    
    }catch(error:any){
        console.log(error)
        return NextResponse.json({error}, {status:400});
    }
}





