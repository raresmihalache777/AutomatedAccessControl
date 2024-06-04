import Banned from '@/models/bannedModel';

import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest){
    try{
        const bannedAcc = await Banned.find({}, { _id: 1, email: 1})
        return NextResponse.json(bannedAcc)
    }catch(error:any){
        return NextResponse.json({error: error.message}, {status: 500});
    }
}
