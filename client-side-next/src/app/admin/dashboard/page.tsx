'use client'

import { useUserContext } from "@/app/context/userContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { Interface } from "readline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";




export default function AdminDashboardPage(){

	interface BookingInterface{
		code:number,
		date:Date,
		duration:number,
		startTime:number,
		timeStamp:Date,
		userId:String,
		_id:String
	}

	const userState = useUserContext();
	const [bookings, setBookings] = useState([]);
	const [queryDate, setQueryDate] = useState(new Date());
	const [userName, setUserName] = useState('');

	const getBookingsByDate = async (date:Date) => {
        try{
            const query = `dateQuery=${date.toISOString()}`
            const response = await axios.get(`/api/bookings/get-booking-list?${query}`)
			setBookings(response.data.message)
        }catch(err:any){
            console.log('Error while fetching bookings: ' + err.message);
        }
        
    }

	const getAllBookings = async () => {
        try{
            const response = await axios.get(`/api/bookings/get-booking-list`)
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

	const handleDateChange = (date: any) => {
        setQueryDate(new Date(date.toISOString().slice(0,10)))
	}

	const clearFilter = () => {
		setQueryDate(null);

	}

	useEffect(() => {
		//getAllBookings();
	},[])

	useEffect(() => {
		getBookingsByDate(queryDate)
	}, [userState, queryDate])

	useEffect(() => {
		console.log(bookings)
	}, [bookings])

	

    return (
		<div className="mx-5">
			<h1 className="text-black-600 text-5xl text-center py-10">
				Hello, {userState.username}
			</h1>
			<div className='flex flex-row border-gray-60 '>
				<label className="mx-5">Search by name:</label>
				<input
				type="text"
				value={userName}
				onChange={(e) => setUserName(e.target.value)}
				placeholder="Name"
				className=" m-5 bg-white text-black rounded-lg px-10 py-2 focus:outline-none focus:border-gray-60"
				/>
				<label className="mx-5">Search by date:</label>
				<DatePicker
						selected={queryDate} 
						onChange={handleDateChange} 
						icon="fa fa-calendar" 
						dateFormat="MMMM d, yyyy"
						className=" m-5 bg-white text-black rounded-lg px-10 py-2 focus:outline-none focus:border-gray-600"
				/>
				<button
					className=" m-5 bg-white text-black rounded-full px-10 py-2 hover:bg-red-500 hover:text-white"
					onClick={clearFilter}>
					Clear filters
				</button>
			</div>
			{bookings.length !== 0 ?
				<div className="grid grid-cols-2 gap-4">
					{bookings.map((booking:BookingInterface, index) => (
						<div key={index} className="p-4 bg-gray-200 rounded-lg">
							<p className="font-bold">Booking {index + 1}</p>
							<p>Date: {booking.date.toString().slice(0,10)}</p>
							<p>Start Time: {String(Math.trunc(booking.startTime/60)).padStart(2, '0')}:{String(booking.startTime%60).padStart(2, '0')}</p>
							<p>Duration: {booking.duration} minutes</p>
							<button
								className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
								onClick={() => {unlockHandler(booking.code)}}
							>
								Unlock
							</button>
							<button
								className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
								onClick={() => {deleteBooking(booking._id, booking.userId)}}
							>
								Delete
							</button>
						</div>
					))}
				</div>
			: 
				<div>No bookings found</div>}
		</div>
	);
}