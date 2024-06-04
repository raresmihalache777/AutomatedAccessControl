import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose'
import User from "@/models/userModel";


export async function GET(request: NextRequest){
    try{
        const params = request.nextUrl.searchParams;
        const userIdQuery = params.get('userIdQuery');
        console.log(userIdQuery);

        if(userIdQuery){
            console.log("found userIdQuery")
            const user = await User.findOne({_id: userIdQuery});
            //create response
            const response = NextResponse.json({
                message: user.username,
                success: true,
                type: user.type
            })
            return response;

        }else{
            const currentToken = request.cookies.get('token')?.value;
            const decoded = await jose.jwtVerify(currentToken as string, new TextEncoder().encode(process.env.TOKEN_SECRET));
            return NextResponse.json({message: {id: decoded.payload.id, username: decoded.payload.username, email: decoded.payload.email, type: decoded.payload.type}}, {status:200})
        }
    }catch(err){
        console.log('Error while getting user data!')
        return NextResponse.json({error: 'Could not get user info'}, {status:400});
    }
}