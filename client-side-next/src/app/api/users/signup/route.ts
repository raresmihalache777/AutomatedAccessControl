import User from '@/models/userModel';

import { NextRequest, NextResponse } from "next/server";

import bcryptjs from 'bcryptjs';

//POST - Create a new user
export async function POST(request: NextRequest){
    try{
        //body handling
        const reqBody = await request.json();
        const {username, email, password} = reqBody;
        //console.log(reqBody);
        //check for user duplicates
        const user = await User.findOne({email})
        if(user){
            return NextResponse.json(
                {error: 'User already exists'},
                {status: 400}
            )
        }
        console.log('newUser')
        //password hashing
        const salt = await bcryptjs.genSalt(10);
        const hashedPass = await bcryptjs.hash(password, salt);

        //create new user
        const newUser = new User({
            username,
            email,
            password: hashedPass
        })

        console.log('newUser')
        //save to DB
        const savedUser = await newUser.save();

        //response
        return NextResponse.json({
            message:'User created!',
            success:true,
            savedUser
        })
    }catch(error:any){
        return NextResponse.json({error: error.message}, {status: 500});
    }
}

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
