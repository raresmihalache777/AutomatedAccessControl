import Booking from '@/models/bookingModel';
import User from '@/models/userModel';

import { NextRequest, NextResponse } from "next/server";

//UPDATE - make an user admin
export async function PUT(request: NextRequest){
    try{
        const params = request.nextUrl.searchParams;
        const email = params.get('email');
        
        // Find the user in the database
        const user = await User.findOneAndUpdate({ email }, {type: 'a'});

        // If the user doesn't exist, return an error
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }
        

        // Return a success message
        return NextResponse.json({
            message: `${user.username} is now an admin`,
            success: true
        });
        
    }catch(error:any){
        return NextResponse.json({error: error.message}, {status: 500});
    }
}
