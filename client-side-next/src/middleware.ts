import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import * as jose from 'jose'


export async function middleware(request: NextRequest) {

    const urlPath = request.nextUrl.pathname;   
    const adminOnlyApiRoutes = [
        '/api/users/banned-acc', 
        '/api/users/delete', 
        '/api/users/deleteban', 
        '/api/users/banned-acc',
        '/api/users/make-admin',
        '/api/users/unban'
    ]

    const internalRoute = urlPath.includes('internal');
    const adminRoute = urlPath.includes('admin');

    //API ROUTES--------------------------------

    //PUBLIC API ROUTES - anyone can issue requests to this routes
    const publicApiRoute = (urlPath === '/api/users/login' || urlPath === '/api/users/sign-up')

    //USERS API ROUTES - only users with valid token can issue requests
    const usersApiRoute = urlPath.includes('api') && (urlPath !== '/api/users/login' && urlPath !== '/api/users/signup') && !adminOnlyApiRoutes.includes(urlPath)

    //ADMIN API ROUTES - only admins can issue requests to this routes
    const adminApiRoute = urlPath.includes('api') && adminOnlyApiRoutes.includes(urlPath)

    //PAGE ROUTES--------------------------------
    //PUBLIC PAGE - anyone can access the page
    const publicPageRoute = (urlPath === '/login' || urlPath === '/sign-up')

    //USERS PAGE - only users with a valid tokan can access the page
    const usersPageRoute = urlPath.includes('internal')

    //ADMIN PAGE - only admin users with a valid tokan can access the page
    const adminPageRoute = urlPath.includes('admin')


    //CURRENT TOKEN--------------------------------
    const currentToken = request.cookies.get('token')?.value;

    //API RULES--------------------------------
    //API ADMIN ROUTES
    if(adminApiRoute && !currentToken){        
        return Response.json(
            { success: false, message: 'authentication failed' },
            { status: 401 }
        )
    }else if(adminApiRoute && currentToken){
        //return NextResponse.next()
        try{
            const decoded = await jose.jwtVerify(currentToken as string, new TextEncoder().encode(process.env.TOKEN_SECRET as string));
            const {id, username, type} = decoded.payload;

            if(type !== 'a'){
                return Response.json(
                    { success: false, message: 'Your token is invalid!'},
                    { status: 401 }
                )
            }
        }catch(e){
            return Response.json(
                { success: false, message: 'Your token is invalid, please reauthenticate!'},
                { status: 401 }
            )
        }
    }

    //API USERS ROUTES
    if(usersApiRoute && !currentToken){       
        return Response.json(
            { success: false, message: 'authentication failed' },
            { status: 401 }
        )
    }else if(usersApiRoute && currentToken){
        try{
            const decoded = await jose.jwtVerify(currentToken as string, new TextEncoder().encode(process.env.TOKEN_SECRET as string));
            const {id, username, type} = decoded.payload;
        }catch(e){
            return Response.json(
                { success: false, message: 'Your token is invalid, please reauthenticate!'},
                { status: 401 }
            )
        }
    }


    //PAGE RULES--------------------------------
    //USERS/ ADMIN PAGE ROUTE - check if the user has a valid token 
    if((usersPageRoute || adminPageRoute) && !currentToken) {
        console.log('no token redirect to login')
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }else if((usersPageRoute || adminPageRoute) && currentToken){
        try{
            const decoded = await jose.jwtVerify(currentToken as string, new TextEncoder().encode(process.env.TOKEN_SECRET as string));
            const {id, username, type} = decoded.payload;
            
            if(adminRoute){
                if(type !== 'a'){
                    return NextResponse.redirect(new URL('/login', request.nextUrl));
                }
            }
        }catch(error){
            console.log('Error while validationg signature. Please reauthenticate!');
            return NextResponse.redirect(new URL('/login', request.nextUrl));
        }
    }

    //LOGIN PAGES - redirect for users with valid token
    if(publicPageRoute && currentToken) {
        try{
            const decoded = await jose.jwtVerify(currentToken as string, new TextEncoder().encode(process.env.TOKEN_SECRET as string));
            const {id, username, type} = decoded.payload;
            if(type === 'a'){
                return NextResponse.redirect(new URL('/admin/dashboard', request.nextUrl));
            }else{
                return NextResponse.redirect(new URL('/internal/profile', request.nextUrl));
            }
        }catch(error){
            console.log('Error while validationg signature. Please reauthenticate!');
        }
    }

    


}
 
export const config = {
  matcher: ['/internal/:path*', '/admin/:path*', '/api/:path*'],
}   