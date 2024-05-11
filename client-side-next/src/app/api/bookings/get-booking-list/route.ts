import Booking from "@/models/bookingModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request : NextRequest){
    try{
        const params = request.nextUrl.searchParams;
        const dateQuery = params.get('dateQuery');
        const userIdQuery = params.get('userIdQuery');

        if(dateQuery === null && userIdQuery === null){
            const response = await Booking.find();
            return NextResponse.json({message: response}, {status: 200})
        }else if(dateQuery !== null){
            const response = await Booking.find({date : dateQuery});
            return NextResponse.json({message: response}, {status: 200})
        }else if(userIdQuery !== null){
            const response = await Booking.find({userId : userIdQuery});
            return NextResponse.json({message: response}, {status: 200})
        }else{
            return NextResponse.json({message: 'Query could not be completed'}, {status: 200})
        }
    }catch(error:any){
        return NextResponse.json({message: error.message}, {status: 500})
    }
}