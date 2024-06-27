import Booking from '@/models/bookingModel';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try{
        //request date extraction
        const reqBody = await request.json();
        console.log(reqBody);
        const {bookingId, paymentId, paymentStatus} = reqBody;

        const booking = await Booking.findOneAndUpdate({ _id: bookingId }, {paymentStatus: paymentStatus, paymentId: paymentId});

        //response
        return NextResponse.json({
            message:'Booking updated!',
            success:true,
            booking    
        })
    }catch(error:any){
        return NextResponse.json({message: error.message}, {status: 500})
    }
}