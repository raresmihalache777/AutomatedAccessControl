import { connectToMongoDB } from "@/dbConfig/dbConfig";
import User from '@/models/userModel';
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'

connectToMongoDB();

export async function POST(request: NextRequest){
    try{
        //request data extraction
        const reqBody = await request.json();
        const {email, password} = reqBody;
        console.log(reqBody);
        //check email existence
        const user = await User.findOne({email});

        //console.log(user);

        //USER DOESN'T EXIST
        if(!user){
            return NextResponse.json({error: 'User was not found'}, {status:400});
        }
        
        //validationg pass
        const validPass = await bcryptjs.compare(password, user.password);
    

        //invalid pass
        if(!validPass){
            return NextResponse.json({error: 'Invalid password'}, {status:400});
        }

        //create token data
        const tokenData={
            id: user._id,
            username: user.username,
            email: user.email,
            type: user.type
        }
       
        //create token data
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
            expiresIn: '2d',
        });
        
        
        //save token to cookies
        const response = NextResponse.json({
            messaje: 'Login successful',
            success: true,
            type: user.type
        })
        
        
		//send TOKEN to user's cookies
		response.cookies.set('token', token, { httpOnly: true });
		return response;

    }catch(error:any){
        return NextResponse.json({error: error.message}, {status:500});
    }
}


