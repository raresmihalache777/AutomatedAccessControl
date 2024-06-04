import Booking from '@/models/bookingModel';
import User from '@/models/userModel';
import Banned from '@/models/bannedModel';

import { NextRequest, NextResponse } from "next/server";

//DELETE - Delete and ban a user
export async function POST(request: NextRequest){
    try{
        //body handling
        const reqBody = await request.json();
        console.log(reqBody)
        const {email} = reqBody;
        
        console.log(email)
        // Find the user in the database
        const banned = await Banned.findOne({ email });

        
        // If the user doesn't exist, return an error
        if (!banned) {
            return NextResponse.json(
                { error: 'Banned user not found' },
                { status: 404 }
            );
        }
        // DELETE banned entry the user from the database
        await Banned.deleteOne({email})

        // Return a success message
        return NextResponse.json({
            message: 'User is no longer banned',
            success: true
        });
        
    }catch(error:any){
        return NextResponse.json({error: error.message}, {status: 500});
    }
}
