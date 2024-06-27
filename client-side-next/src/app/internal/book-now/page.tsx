// @ts-nocheck

'use client';

import { useUserContext } from "@/app/context/userContext";
import { useAppContext } from "@/app/context/appContext";

import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import getAvailableSlots from '@/app/utils/timeslotsUtils'
import { loadStripe } from '@stripe/stripe-js';

const stripe = require('stripe')('sk_test_51PNzm2F2WL7X36vFrDjDBRO8G9ijqWGGmGYTXWf4FxyPN9FlT52ttK5sRsF67MIFxCALcCIdstYuAmkhWM3Nb4cd00iIMqPBoS');


const stripePromise = loadStripe(
    String(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  );

export default function BookPage() {
    const [booking, setBooking] = useState({
        _id : '',
        userId : '',
        date : new Date(),
        startTime : 0,
        duration:60,
        timestamp : new Date(),
        code: '',
        paymentId: '',
        paymentMethod: '',
        paymentStatus: ''
    })

    const userContext = useUserContext();
    const appContext = useAppContext();

    const [startDate, setStartDate] = useState(new Date());
	const [bookingDuration, setBookingDuration] = useState(60);
	const [bookDisabled, setBookDisabled] = useState(true);
    const [existingBookings, setExistingBookings] = useState([[0,0],[0,0]]);
    const [availableSlots, setAvailableSlots] = useState({'s':[1,2,3]})
    const [disabledDurations, setDisabledDurations] = useState({button60:true, button90:true, button120:true});
    const [cardPayment, setCardPayment] = useState(false)
    const dayStart = 0;
    const dayEnd = 1440;
    

    const handlePaymentChange = (type:String) => {
        if(type === 'cash'){
            setCardPayment(false);
        }else{
            setCardPayment(true);
        }
    }

    //Computes start of day, computes minutes elapsed and modifies booking state
    const handleDateChange = (date: any) => {

        //duration = minutes elapsed from 00:00
        const minutesElapsed = date.getHours()*60 + date.getMinutes();

        //sanitize date so that hour is always 00:00
        var dayStartString = date.toISOString();
        dayStartString = dayStartString.slice(0,10);
        dayStartString = dayStartString + 'T03:00:00';
        
        //create dayStart Date() object
        const dayStart = new Date(dayStartString)

        setStartDate(date)
		setBookDisabled(false);
        setBooking({...booking,
            userId : userContext.id,
            date : dayStart,
            startTime : minutesElapsed
        })
    }

    //Sets the booking duration
	const handleDurationChange = (duration: number) => {
        setBookingDuration(duration);
        setBooking({...booking,
            duration: duration
        })
    };

    //gets all the bookings of a given day and creates an array with [startTime, duration]
    const getBookingsByDate = async (date:Date) => {
        try{
            const query = `dateQuery=${date.toISOString()}`
            const response = await axios.get(`/api/bookings/get-booking-list?${query}`)
            
            let auxSlotsArray:number[][] = [];
            response.data.message.forEach(function(book:any){
                let aux:number[] = [];
                aux.push(book.startTime);
                aux.push(book.duration);
                auxSlotsArray.push(aux);
            });
            //console.log(auxSlotsArray)
            setExistingBookings(auxSlotsArray)
            setLoading(false);
        }catch(err:any){
            console.log('Error while fetching bookings: ' + err.message);
        }
        
    }
    
    //handles the booking save to DB or Stripe activation
	const onBook = async () => {
        var startTime = performance.now()
		try{
            appContext.toggleLoadingState(true)
            
            if(cardPayment === false){
                let response = await axios.post('/api/bookings/create', {...booking, paymentMethod: (cardPayment ? 'card' : 'cash'), paymentStatus: 'unpaid', paymentId: 'none'});
                const updateResponse = await axios.post('https://localhost:3000/api/bookings/change-payment-info', {
                    paymentStatus: 'none',
                    paymentId: 'none',
                    bookingId: response.data._id
                }) 
                appContext.alert.setAlertState('Booking confirmed! Go to profile to see all your bookings. ', true)
            }else{
                let response = await axios.post('/api/bookings/create', {...booking, paymentMethod: (cardPayment ? 'card' : 'cash'), paymentStatus: 'unpaid', paymentId: 'none'});
                const savedBooking = await response.data.savedBooking
                response = await axios.post('/api/stripe', savedBooking);
                window.location.href = response.data.url;
                appContext.alert.setAlertState('Booking confirmed! Go to profile to see all your bookings. ', true)
            }
        }catch(error:any){
            appContext.alert.setAlertState('Error while saving your booking', true)
            console.log('Error while saving your booking: ' + error.message);
        }finally{
            var endTime = performance.now()
            console.log(`Functia de rezervere a rulat in ${(endTime - startTime)/1000} secunde`)
            appContext.toggleLoadingState(false)
        }
	}

    //filters the options in the time selector so you can only choose a time after current time
    const filterTime = (time:any) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);

        // Format the hour and minute components with leading zeros if necessary
        const hours = String(selectedDate.getHours()).padStart(2, '0');
        const minutes = String(selectedDate.getMinutes()).padStart(2, '0');

        // Combine the formatted hour and minute components with a colon to create the time string
        let stringTime:String = `${hours}:${minutes}`;
        //console.log(stringTime);
        console.log(availableSlots)
        if(currentDate.getTime() < selectedDate.getTime()){
            if(availableSlots[stringTime]?.length){
                return true
            }else{
                return false
            }
        }else{
            return false
        }
      };

    const handleStripeRedirect = async () => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);
        if (query.get('session_id')){
            const session = await stripe.checkout.sessions.retrieve(query.get('session_id'));
            console.log(session)
            if (query.get('success')) {
                const response = await axios.post('https://localhost:3000/api/bookings/change-payment-info', {
                    paymentStatus: session.status,
                    paymentId: session.id,
                    bookingId: query.get('booking_id')
                })
            }
            if (query.get('canceled')) {
                const response = await axios.post('https://localhost:3000/api/bookings/change-payment-info', {
                    paymentStatus: session.id,
                    paymentId: session.payment_intent,
                    bookingId: query.get('booking_id')
                })                
            }
        }
        
    }

    useEffect(() => {
        getBookingsByDate(booking.date)
        setDisabledDurations({button60:true, button90:true, button120:true})
    }, [booking])

    useEffect(() => {
        setAvailableSlots(getAvailableSlots(existingBookings, dayStart, dayEnd))
    }, [existingBookings])

    useEffect(() => {
        // Format the hour and minute components with leading zeros if necessary
        const hours = String(Math.trunc(booking.startTime/60)).padStart(2, '0');
        const minutes = String(booking.startTime%60).padStart(2, '0');

        // Creating string time format to access the Object
        let stringTime:String = `${hours}:${minutes}`;
        for( let i = 0; i <= availableSlots[stringTime]?.length; i++ ){
            let duration = availableSlots[stringTime][i];
            if(duration === 120){
                setDisabledDurations({...disabledDurations, button60:false, button90:false, button120:false});
                break;
            }else if(duration === 90){
                setDisabledDurations({...disabledDurations, button60:false, button90:false});
            }else if(duration === 60){
                setDisabledDurations({...disabledDurations, button60:false});
            }
        }
    }, [availableSlots])

    useEffect(() => {
        handleStripeRedirect();
      }, []);
    return (
        <div className="flex flex-col w-screen h-screen justify-center items-center bg-[url('/court_bg_2.jpg')] bg-cover">
            <div
                className="flex flex-col justify-center items-center bg-white/90 rounded-2xl p-10">
                <h1 className="text-black-600 text-5xl text-center py-10">
                    Book your tennis court!
                </h1>
                <div className="flex flex-col justify-center items-center mb-6">
                    <h2 className="text-black-700 text-3xl py-2">
						Choose the date:
					</h2>
                    <DatePicker 
                        selected={startDate} 
                        showTimeSelect 
                        onChange={handleDateChange} 
                        icon="fa fa-calendar" 
                        dateFormat="MMMM d, yyyy h:mm aa"
                        filterTime={filterTime}
                        className=" mx-5 bg-white text-black rounded-lg px-10 py-2 focus:outline-none focus:border-gray-600"
                    />
                </div>

                <div className="flex flex-col justify-center items-center mb-10">
                    <h2 className="text-black-700 text-3xl py-2">
						Booking duration:
					</h2>
                    <div className="flex gap-4">
                        <div>
                            <button 
                                className={`text-white rounded-full px-5 py-1  mx-5 hover:bg-blue-700 border cursor-pointer ${bookingDuration === 60 ? 'bg-blue-700' : 'bg-gray-400'} ${disabledDurations.button60 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => handleDurationChange(60)}
                                disabled={disabledDurations.button60}
                            >
                                60 min
                            </button>
                            <button 
                                className={`text-white rounded-full px-5 py-1 mx-5 hover:bg-blue-700 border cursor-pointer ${bookingDuration === 90 ? 'bg-blue-700' : 'bg-gray-400'} ${disabledDurations.button90 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => handleDurationChange(90)}
                                disabled={disabledDurations.button90}
                            >
                                90 min
                            </button>
                            <button 
                                className={`text-white rounded-full px-5 py-1 mx-5 hover:bg-blue-700 border cursor-pointer ${bookingDuration === 120 ? 'bg-blue-700' : 'bg-gray-400'} ${disabledDurations.button120 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => handleDurationChange(120)}
                                disabled={disabledDurations.button120}
                            >
                                120 min
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center mb-10">
                    <h2 className="text-black-700 text-3xl py-2">
						Payment method:
					</h2>
                    <div className="flex gap-4">
                        <button 
                            className={`text-white rounded-full px-5 py-1 mx-5 hover:bg-blue-700 border cursor-pointer ${cardPayment === false ? 'bg-blue-700' : ' bg-gray-400 opacity-50 cursor-not-allowed'}`}
                            onClick={() => handlePaymentChange('cash')}
                            disabled={cardPayment === false}
                            >
                            Cash
                        </button>
                        <button 
                            className={`text-white  rounded-full px-5 py-1 mx-5 hover:bg-blue-700 border cursor-pointer ${cardPayment === true ? 'bg-blue-700' : 'bg-gray-400 opacity-50 cursor-not-allowed'}`}
                            onClick={() => handlePaymentChange('card')}
                            disabled={cardPayment === true}
                            >
                            Card
                        </button>
                    </div>
                </div>

                <button
                    onClick={onBook}
                    disabled = {bookDisabled}
                    className={`text-white bg-blue-600 rounded-full px-10 py-1 hover:bg-blue-700 ${bookDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    Book!
                </button>
            </div>
        </div>
    );
}
