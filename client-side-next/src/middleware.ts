import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import * as jose from 'jose'
 
export async function middleware(request: NextRequest) {
    const urlPath = request.nextUrl.pathname;
    const profileRoute = urlPath === '/profile';
    const signupRoute = urlPath === '/sign-up';
    const loginRoute = urlPath === '/login';

    const currentToken = request.cookies.get('token')?.value;

    if(profileRoute && !currentToken) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    //if the user accesses profile and has a valid token do nothing else redirect
    if(profileRoute && currentToken) {
        try{
            const decoded = await jose.jwtVerify(currentToken as string, new TextEncoder().encode('mfrwejpoigmj' as string));
        }catch(error){
            console.log('Error while validationg signature. Please reauthenticate!');
            return NextResponse.redirect(new URL('/login', request.nextUrl));
        }
    }
    

    if((signupRoute || loginRoute) && currentToken) {
        try{
            const decoded = await jose.jwtVerify(currentToken as string, new TextEncoder().encode('mfrwejpoigmj' as string));
            return NextResponse.redirect(new URL('/profile', request.nextUrl));
        }catch(error){
            console.log('Error while validationg signature. Please reauthenticate!');
        }
    }

}
 
export const config = {
  matcher: ['/profile', '/sign-up', '/login'],
}