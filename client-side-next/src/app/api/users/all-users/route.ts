import User from '@/models/userModel';

import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest){
    try{
        const users = await User.find({}, { _id: 1, username: 1, email: 1, type: 1});
        //console.log('from all-users:')
        //console.log(users)
        return NextResponse.json(users)
    }catch(error:any){
        return NextResponse.json({error: error.message}, {status: 500});
    }
}
