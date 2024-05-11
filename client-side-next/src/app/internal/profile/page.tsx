'use client'

import { useUserContext } from "@/app/context/userContext";
import axios from "axios";
import { useEffect, useState } from "react";



export default function ProfilePage(){

	const userState = useUserContext();
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
	
	const unlockApiCall = async (code:String) => {
		try{
			const response = await axios.post(`/api/server/unlock`, code)
			console.log(response)
		}catch(error:any){
			console.log('Error while unlocking: '+ error.message);
		}
	}

	const unlockHandler = (code:String) => {
		unlockApiCall(code);
		//console.log('Ulocking' + code)
	}

	useEffect(() => {
		getBookingsById(userState.id)
	}, [userState])

    return (
		<div className="mx-5">
			<h1 className="text-black-600 text-5xl text-center py-10">
				Hello, {userState.username}
			</h1>
			<div className="grid grid-cols-3 gap-4">
				{bookings.map((booking, index) => (
				<div key={index} className="p-4 bg-gray-200 rounded-lg">
					<p className="font-bold">Booking {index + 1}</p>
					<p>Date: {booking.date.slice(0,10)}</p>
					<p>Start Time: {String(Math.trunc(booking.startTime/60)).padStart(2, '0')}:{String(booking.startTime%60).padStart(2, '0')}</p>
					<p>Duration: {booking.duration} minutes</p>
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						onClick={() => {unlockHandler(booking.code)}}
					>
						Unlock
					</button>
				</div>
				))}
      		</div>
		</div>
	);
}