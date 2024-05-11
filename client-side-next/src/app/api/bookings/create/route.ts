import Booking from '@/models/bookingModel';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try{
        //request date extraction
        const reqBody = await request.json();
        const {userId, date, startTime, duration} = reqBody;
        const objId = new mongoose.mongo.ObjectId(userId);
        //create new booking
        const newBooking = new Booking({
            userId: objId,
            date,
            startTime,
            duration,
            timestamp : new Date(),
            code: Math.floor(100000 + Math.random() * 900000)
        })
        console.log(newBooking)
        //saveto DB
        const savedBooking = newBooking.save();

        //response
        return NextResponse.json({
            message:'Booking created!',
            success:true,
            savedBooking    
        })
    }catch(error:any){
        return NextResponse.json({message: error.message}, {status: 500})
    }
}