import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose'


export async function GET(request: NextRequest){
    try{
        
        const currentToken = request.cookies.get('token')?.value;
        const decoded = await jose.jwtVerify(currentToken as string, new TextEncoder().encode(process.env.TOKEN_SECRET));
        return NextResponse.json({message: {id: decoded.payload.id, username: decoded.payload.username, email: decoded.payload.email}}, {status:200})
    }catch(err){
        console.log('Error while getting user data!')
        return NextResponse.json({error: 'Could not get user info'}, {status:400});
    }
}