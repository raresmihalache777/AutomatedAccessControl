import { NextRequest, NextResponse } from "next/server";


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
    
    try {
      const reqBody = await request.json();
      let price = ''
      if(reqBody.duration === 60){
        price = 'price_1PNzqiF2WL7X36vF5FkgZcqI'
      }else if(reqBody.duration === 90){
        price = 'price_1PNzr0F2WL7X36vFKNoNk7s1'
      }else{
        price = 'price_1PNzrVF2WL7X36vFSOOZKWTY'

      }
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `https://localhost:3000/internal/book-now/?success=true&session_id={CHECKOUT_SESSION_ID}&booking_id=${reqBody._id}`,
        cancel_url: `https://localhost:3000/internal/book-now/?canceled=true&session_id={CHECKOUT_SESSION_ID}&booking_id=${reqBody._id}`,
      });
      return NextResponse.json({ url: session.url });
    } catch (error:any) {
      return Response.json({message: error.message}, {status: error.statusCode})
    }
}