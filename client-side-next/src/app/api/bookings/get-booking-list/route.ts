import Booking from "@/models/bookingModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request : NextRequest){
    try{
        const params = request.nextUrl.searchParams;
        const dateQuery = params.get('dateQuery');
        console.log(dateQuery);
        const bookingList = await Booking.find({date : dateQuery});

        console.log(bookingList);
        return NextResponse.json({message: bookingList}, {status: 200})
    }catch(error:any){
        return NextResponse.json({message: error.message}, {status: 500})
    }
}