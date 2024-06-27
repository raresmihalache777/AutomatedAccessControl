import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";


const endpointSecret = 'whsec_931bb7aa47ba03380691d6a811575009e5abc5528f0428c951f08001d608c968';

const stripe = new Stripe(endpointSecret, {
  apiVersion: "2024-04-10",
  typescript: true,
});

export async function POST(request:any){
  const body = await request.text();
  const sig = headers().get("stripe-signature") as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    console.log(event);
    return new Response(`Event: ${event}`, {
      status: 200,
    });
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, {
      status: 400,
    });
  }
    
}
/*
// server.js
//
// Use this sample code to handle webhook events in your integration.
//
// 1) Paste this code into a new file (server.js)
//
// 2) Install dependencies
//   npm install stripe
//   npm install express
//
// 3) Run the server on http://localhost:4242
//   node server.js

// The library needs to be configured with your account's secret key.
// Ensure the key is kept out of any version control system you might be using.
const stripe = require('stripe')('sk_test_...');
const express = require('express');
const app = express();


// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_931bb7aa47ba03380691d6a811575009e5abc5528f0428c951f08001d608c968";

app.post('/', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      console.log(paymentIntentSucceeded)
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});
*/