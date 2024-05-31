import Booking from '@/models/bookingModel';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose'

export async function POST(request: NextRequest){
    try{
        const params = request.nextUrl.searchParams;
        const id = params.get('idQuery');
        const userId = params.get('userId')
        
        //Getting the details of the user that sent the request
        const currentToken = request.cookies.get('token')?.value;
        const decoded = await jose.jwtVerify(currentToken as string, new TextEncoder().encode(process.env.TOKEN_SECRET as string));
        
        if(userId === decoded.payload.id || decoded.payload.type === 'a'){
            const response = await Booking.findByIdAndDelete(id);
        }else{
            throw new Error('Permission denied...not your booking and not admin')
        }

        

        //response
        return NextResponse.json({
            message:'Booking deleted!',
            success:true
        })
    }catch(error:any){
        return NextResponse.json({message: error.message}, {status: 500})
    }
}