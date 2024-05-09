import { connectToMongoDB } from "@/dbConfig/dbConfig";
import User from '@/models/userModel';
import { NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'

export async function GET(){
    try{
        const userLogoutResponse = NextResponse.json({
            message: 'The user was logged out',
            success: true
        });

        // set existing token empty
        userLogoutResponse.cookies.set('token', '', {
            httpOnly: true,
            expires: new Date(0)
        });

        return userLogoutResponse;
    }catch(error:any){
        return NextResponse.json({
            error: error.message
        },{
            status: 500
        })
    }
}