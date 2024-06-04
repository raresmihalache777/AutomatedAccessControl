import axios from "axios";
import https from "https";
import serverToken from '@/app/layout'
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try{
        const serverResponse = await axios.get(`${process.env.SERVER_DOMAIN}:${process.env.SERVER_PORT}/api/relay`,{httpsAgent: new https.Agent({ rejectUnauthorized: false })})
        return NextResponse.json(serverResponse.data, {status:200})
    }catch(error:any){
        console.log(error)

        return NextResponse.json({error: 'Error in api/server/unlock: Could not unlockthe door'}, {status:400});
    }
}

export async function GET(request: NextRequest){
    try{
        const serverResponse = await axios.get(`${process.env.SERVER_DOMAIN}:${process.env.SERVER_PORT}/api/relay`,{httpsAgent: new https.Agent({ rejectUnauthorized: false })})
        return NextResponse.json(serverResponse.data, {status:200})
    }catch(error:any){
        console.log(error)

        return NextResponse.json({error: 'Error in api/server/unlock: Could not unlockthe door'}, {status:400});
    }
}