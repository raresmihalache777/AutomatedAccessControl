import User from '@/models/userModel';

import { NextRequest, NextResponse } from "next/server";

//DELETE - Delete a user
export async function DELETE(request: NextRequest){
    try{
        const reqBody = await request.json();
        const { email } = reqBody;
        
        // Find the user in the database
        const user = await User.findOne({ email });
        
        // If the user doesn't exist, return an error
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }
        
        // Delete the user from the database
        await user.remove();

        // Return a success message
        return NextResponse.json({
            message: 'User deleted successfully',
            success: true
        });
        
    }catch(error:any){
        return NextResponse.json({error: error.message}, {status: 500});
    }
}
