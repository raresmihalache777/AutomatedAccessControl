import { NextRequest, NextResponse } from "next/server";


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
    console.log(request.body);
    try {
      console.log(request.body);
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: 'price_1PNzrVF2WL7X36vFSOOZKWTY',
            quantity: 1,
          },
        ],
        mode: 'payment',
        //success_url: `${request.referrer}/?success=true`,
        //cancel_url: `${request.referrer}/?canceled=true`,
        success_url: `https://google.com`,
        cancel_url: `https://google.com`,
      });
      return NextResponse.redirect(new URL(session.url));
    } catch (error:any) {
      return NextResponse.json({message: error.message}, {status: error.statusCode})
    }
}