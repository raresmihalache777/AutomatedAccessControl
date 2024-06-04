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
		userId:String,
		_id: String
	}

	const userState = useUserContext();
	const appContext = useAppContext();
	const [bookings, setBookings] = useState([]);

	const getBookingsById = async (id:String) => {
		try{
			const query = `userIdQuery=${id}`
			const response = await axios.get(`/api/bookings/get-booking-list?${query}`)
			var sortedBookings = response.data.message.sort(
				(a: BookingInterface,b: BookingInterface) => {
					if(a.date < b.date){
						return a
					}else if (a.date === b.date){
						if(a.startTime <= b.startTime){
							return a
						}else{
							return b
						}
					}else{
						return b
					}
			})
			setBookings(sortedBookings)
	
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

	const deleteBooking = async (id:String, userId:String) => {
		try{
            const query = `idQuery=${id}&userId=${userId}`
            const response = await axios.post(`/api/bookings/delete?${query}`)
			window.location.reload()
        }catch(err:any){
            console.log('Error while fetching bookings: ' + err.message);
        }
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
		<div className="pt-20 mx-5">
			<div className="grid grid-cols-2 gap-4">
			<div className='flex flex-col min-w-96 border-solid border-2 border-gray-60 bg-white p-5 rounded-2xl my-5'>
				<h2 className="text-black-700 text-3xl py-2">
					My Profile
				</h2>
				<p><b>Username:</b> {userState.username}</p>
				<p><b>Email:</b> {userState.email}</p>
			</div>
			<div className='flex flex-col min-w-96 border-solid border-2 border-gray-60 bg-white p-5 rounded-2xl my-5'>
				<h2 className="text-black-700 text-3xl py-2">
					Next booking...
				</h2>
				<p><b>Date:</b> {bookings[0]?.date.toString().slice(0,10)}</p>
				<p><b>Start Time:</b> {String(Math.trunc(bookings[0]?.startTime/60)).padStart(2, '0')}:{String(bookings[0]?.startTime%60).padStart(2, '0')}</p>
				<p><b>Duration:</b> {bookings[0]?.duration} minutes</p>
			</div>
				
			</div>
			
			<div className='flex flex-col min-w-96 border-solid border-2 border-gray-60 bg-white p-5 rounded-2xl my-5'>
				<h2 className="text-black-700 text-3xl py-2">
					Bookings
				</h2>
				{bookings.length !== 0 ?
					<div className="grid grid-cols-3 gap-4">
						{bookings.map((booking:BookingInterface, index) => (
							<div key={index} className="p-4 bg-slate-100 rounded-lg">
								<p className="font-bold">Booking {index + 1}</p>
								<p>Date: {booking.date.toString().slice(0,10)}</p>
								<p>Start Time: {String(Math.trunc(booking.startTime/60)).padStart(2, '0')}:{String(booking.startTime%60).padStart(2, '0')}</p>
								<p>Duration: {booking.duration} minutes</p>
								<button
									className={`text-white bg-blue-600 rounded-full px-10 py-1 hover:bg-blue-700 ${unlockEnabler(booking) ? 'opacity-50 cursor-not-allowed' : ''}`}
									onClick={() => {unlockHandler(booking.code)}}
									disabled = {unlockEnabler(booking)}
								>
									Unlock
								</button>
								<button
									className={"text-white bg-red-600 rounded-full px-10 py-1 hover:bg-red-700 mx-5"}
									onClick={() => {deleteBooking(booking._id, booking.userId)}}
								>
									Delete
								</button>
							</div>
						))}
					</div>
				: <>No bookings found</>}
			</div>
		</div>
	);
}