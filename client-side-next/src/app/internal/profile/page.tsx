'use client'

import { useUserContext } from "@/app/context/userContext";
import { useAppContext } from "@/app/context/appContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { Interface } from "readline";



export default function ProfilePage(){

	interface BookingInterface{
		code:number,
		date:Date,
		duration:number,
		startTime:number,
		timeStamp:Date,
		userId:String
	}

	const userState = useUserContext();
	const appContext = useAppContext();
	const [bookings, setBookings] = useState([]);

	const getBookingsById = async (id:String) => {
		try{
			const query = `userIdQuery=${id}`
			const response = await axios.get(`/api/bookings/get-booking-list?${query}`)
			setBookings(response.data.message)
	
		}catch(err:any){
			console.log('Error while fetching bookings: ' + err.message);
		}
		
	}
	
	const unlockApiCall = async (code:number) => {
		try{
			const response = await axios.post(`/api/server/relay-unlock`, code)
			console.log(response)
		}catch(error:any){
			console.log('Error while unlocking: '+ error.message);
		}
	}

	const unlockHandler = (code:number) => {
		unlockApiCall(code);
		//console.log('Ulocking' + code)
	}

	const unlockEnabler = (booking:BookingInterface) => {
		const now = new Date();

		//Local time booking date
		var reconstructDate:Date = new Date(booking.date);
		reconstructDate.setHours(Math.trunc(booking.startTime/60), booking.startTime%60)

		// Calculate the interval with a maximum deviation of 10 minutes
		const intervalStart = new Date(reconstructDate.getTime() - 10 * 60000); // 10 minutes before bookingDate
		const intervalEnd = new Date(reconstructDate.getTime() + booking.duration * 60000 + 10 * 60000); // 10 minutes after bookingEndDate
		
		/* DUBUGGING
		console.log("START:" + (now.getTime()-intervalStart.getTime()) + "suntem in interval:" + (now >= intervalStart))
		console.log(intervalStart)
		console.log("ACUM:")
		console.log(now)
		console.log("END:" + (now.getTime()-intervalEnd.getTime()) + "suntem in interval:" + (now <= intervalEnd))
		console.log(intervalEnd)
		*/

		// Check if the current date is within the interval
		return !(now >= intervalStart && now <= intervalEnd);
	}
	useEffect(() => {
		appContext.toggleLoadingState(true);
		getBookingsById(userState.id)
		appContext.toggleLoadingState(false);
	}, [userState])

	useEffect(() => {
		console.log(bookings)
	}, [bookings])

	

    return (
		<div className="mx-5">
			<h1 className="text-black-600 text-5xl text-center py-10">
				Hello, {userState.username}
			</h1>
			{bookings.length !== 0 ?
				<div className="grid grid-cols-3 gap-4">
				{bookings.map((booking:BookingInterface, index) => (
					<div key={index} className="p-4 bg-gray-200 rounded-lg">
						<p className="font-bold">Booking {index + 1}</p>
						<p>Date: {booking.date.toString().slice(0,10)}</p>
						<p>Start Time: {String(Math.trunc(booking.startTime/60)).padStart(2, '0')}:{String(booking.startTime%60).padStart(2, '0')}</p>
						<p>Duration: {booking.duration} minutes</p>
						<button
							className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${unlockEnabler(booking) ? 'opacity-50 cursor-not-allowed' : ''}`}
							onClick={() => {unlockHandler(booking.code)}}
							disabled = {unlockEnabler(booking)}
						>
							Unlock
						</button>
					</div>
				))}
				</div>
			: <></>}
		</div>
	);
}