import Booking from '@/models/bookingModel';
import User from '@/models/userModel';
import Banned from '@/models/bannedModel';

import { NextRequest, NextResponse } from "next/server";

//DELETE - Delete and ban a user
export async function DELETE(request: NextRequest){
    try{
        console.log('Am primit request de delete + ban pentru user-ul:')
        const params = request.nextUrl.searchParams;
        const email = params.get('email');
        
        // Find the user in the database
        const user = await User.findOne({ email });

        
        // If the user doesn't exist, return an error
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }
        
        //create new user
        const bannedUser = new Banned({
           email: user.email,
        })

        console.log(bannedUser)
        //save to DB
        const savedBanned = await bannedUser.save();

        // Delete the user from the database
        await User.deleteOne({email})
        await Booking.deleteMany({userId: user._id});

        // Return a success message
        return NextResponse.json({
            message: 'User deleted successfully',
            success: true
        });
        
    }catch(error:any){
        return NextResponse.json({error: error.message}, {status: 500});
    }
}
