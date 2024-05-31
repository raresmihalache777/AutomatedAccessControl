import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import * as jose from 'jose'
import { connectToMongoDB } from './dbConfig/dbConfig';
 
connectToMongoDB();


export async function middleware(request: NextRequest) {
    const urlPath = request.nextUrl.pathname;   
    const profileRoute = urlPath.includes('profile');
    const internalRoute = urlPath.includes('internal');
    const adminRoute = urlPath.includes('admin');
    const signupRoute = urlPath === '/sign-up';
    const loginRoute = urlPath === '/login';

    const currentToken = request.cookies.get('token')?.value;

    //NO TOKEN & INTERNAL | ADMIN   
    if((internalRoute || adminRoute) && !currentToken) {
        console.log('no token redirect to login')
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    //ADMIN ROUTE
    if(adminRoute){
        try{
            const decoded = await jose.jwtVerify(currentToken as string, new TextEncoder().encode(process.env.TOKEN_SECRET as string));
            const {id, username, type} = decoded.payload;
            
            if(type !== 'a'){
                return NextResponse.redirect(new URL('/login', request.nextUrl));
            }
        }catch(error){
            console.log('Error while validationg signature. Please reauthenticate!');
            return NextResponse.redirect(new URL('/login', request.nextUrl));
        }
    }

    //INTERNAL ROUTE
    if(internalRoute) {
        try{
            console.log('internal url with token...veryfing type of user')
            const decoded = await jose.jwtVerify(currentToken as string, new TextEncoder().encode(process.env.TOKEN_SECRET as string));
            const {id, username, type} = decoded.payload;
            
            if(type === 'a'){
                return NextResponse.redirect(new URL('/admin/dashboard', request.nextUrl));
            }
        }catch(error){
            console.log('Error while validationg signature. Please reauthenticate!');
            return NextResponse.redirect(new URL('/login', request.nextUrl));
        }
    }
    
    //LOGIN PAGES + TOKEN
    if((signupRoute || loginRoute) && currentToken) {
        try{
            const decoded = await jose.jwtVerify(currentToken as string, new TextEncoder().encode(process.env.TOKEN_SECRET as string));
            const {id, username, type} = decoded.payload;
            if(type === 'a'){
                return NextResponse.redirect(new URL('/admin/dashboard', request.nextUrl));
            }else{
                return NextResponse.redirect(new URL('/internal/profile', request.nextUrl));
            }
            return NextResponse.redirect(new URL('/internal/profile', request.nextUrl));
        }catch(error){
            console.log('Error while validationg signature. Please reauthenticate!');
        }
    }
}
 
export const config = {
  matcher: ['/profile', '/sign-up', '/login'],
}