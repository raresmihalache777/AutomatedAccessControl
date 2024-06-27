import User from '@/models/userModel';

import { NextRequest, NextResponse } from "next/server";

import bcryptjs from 'bcryptjs';
import Banned from '@/models/bannedModel';

//POST - Create a new user
export async function POST(request: NextRequest){
    try{
        //body handling
        const reqBody = await request.json();
        const {username, email, password} = reqBody;
        
        //USER IS BANNED
        const banned = await Banned.findOne({email});
        if(banned){
            return NextResponse.json({error: 'This email account has been banned!'}, {status:400});
        }

        const user = await User.findOne({email})
        if(user){
            return NextResponse.json(
                {error: 'User already exists'},
                {status: 400}
            )
        }
        console.log('newUser')
        
        
        const salt = await bcryptjs.genSalt(10);
        const hashedPass = await bcryptjs.hash(password, salt);

        //create new user
        const newUser = new User({
            username,
            email,
            password: hashedPass,
            type: 'u'
        })

        console.log(newUser)
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
