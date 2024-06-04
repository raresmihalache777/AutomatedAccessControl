'use client'

import { useUserContext } from "@/app/context/userContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { Interface } from "readline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { MdEmail } from "react-icons/md";




export default function AdminDashboardPage(){

	interface BookingInterface{
		code:number,
		date:Date,
		duration:number,
		startTime:number,
		timeStamp:Date,
		userId:String,
		_id:String,
		username:String
	}

	interface UserInterface{
		_id:String,
		email:String,
		username:String,
		type:String
	}

	interface BannedInterface{
		_id:String,
		email: String
	}

	const userState = useUserContext();
	const [bookings, setBookings] = useState([]);
	const [displayBookings, setDisplayBookings] = useState([]);
	const [lightsStatus, setLightsStatus] = useState('Off');
	const [users, setUsers] = useState([])
	const [queryDate, setQueryDate] = useState(new Date());
	const [filterUserName, setFilterUserName] = useState('');
	const [bannedAcc, setBannedAcc] = useState([]);

	const getBookingsByDate = async (date:Date) => {
        try{
            const query = `dateQuery=${date.toISOString()}`
            var response = await axios.get(`/api/bookings/get-booking-list?${query}`)

			for(var i=0; i < response.data.message.length; i++){
				var userQuery = `userIdQuery=${response.data.message[i].userId}`
				const userName = await axios.get(`/api/users/info?${userQuery}`)
				response.data.message[i].username = userName.data.message
			}
			setDisplayBookings(response.data.message)
			setBookings(response.data.message)
        }catch(err:any){
            console.log('Error while fetching bookings: ' + err.message);
        }
        
    }

	const getAllUsers = async () => {
		try{
            const response = await axios.get(`/api/users/all-users`)
			console.log(response.data)
			setUsers(response.data)
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
	
	const deleteUser = async (email:String) => {
		try{
			const query = `email=${email}`
            const response = await axios.delete(`/api/users/delete?${query}`)
			handleUsersLoad()
        }catch(err:any){
            console.log('Error while fetching bookings: ' + err.message);
        }
	}

	const deleteBanUser = async (email:String) => {
		try{
			const query = `email=${email}`
            const response = await axios.delete(`/api/users/deleteban?${query}`)
			handleUsersLoad()
		}catch(err:any){
            console.log('Error while fetching bookings: ' + err.message);
        }
	}

	const unlockDoor = async () => {
		try{
			const response = await axios.post(`/api/server/relay-control`, {relay_command:'close', relay_number:1, relay_delay:2})
			console.log(response)
		}catch(error:any){
			console.log('Error while unlocking: '+ error.message);
		}
	}

	const turnLightsOn = async () => {
		try{
			const response = await axios.post(`/api/server/relay-control`, {relay_command:'close', relay_number:2, relay_delay:0})
			setLightsStatus('Pending')
			console.log(response)
			getLightsStatus()
		}catch(error:any){
			console.log('Error while unlocking: '+ error.message);
		}
	}

	const turnLightsOff = async () => {
		try{
			const response = await axios.post(`/api/server/relay-control`, {relay_command:'open', relay_number:2, relay_delay:0})
			setLightsStatus('Pending')
			console.log(response)
			getLightsStatus()
		}catch(error:any){
			console.log('Error while unlocking: '+ error.message);
		}
	}
	
	const getLightsStatus = async () => {
		try{
			const response = await axios.post(`/api/server/relay-status`)
			setLightsStatus('Pending')
			console.log(response)
			if(response.data['relay2'] === 'open'){
				setLightsStatus('off')
			}else if(response.data['relay2'] === 'closed'){
				setLightsStatus('on')
			}
			
		}catch(error:any){
			console.log('Error while unlocking: '+ error.message);
		}
	}

	const deleteBooking = async (id:String, userId:String) => {
		try{
            const query = `idQuery=${id}&userId=${userId}`
            const response = await axios.post(`/api/bookings/delete?${query}`)
			getBookingsByDate(queryDate)
        }catch(err:any){
            console.log('Error while fetching bookings: ' + err.message);
        }
	}

	const handleDateChange = (date: any) => {
        setQueryDate(new Date(date.toISOString().slice(0,10)))
	}

	const handleUsersLoad = () => {
		getAllUsers();
	}

	const clearFilter = () => {
		setQueryDate(new Date());
		setFilterUserName('')
	}

	const changeAdminStatus = async (email: String) => {
		try{
			const query = `email=${email}`
			const response = await axios.put(`/api/users/make-admin?${query}`)
			
			console.log(response)
			
			handleUsersLoad()

		}catch(error:any){
			console.log('Error while unlocking: '+ error.message);
		}
	}

	const getBannedAcc = async () => {
		try{
			const response = await axios.get(`/api/users/banned-acc`)
			setBannedAcc(response.data)

		}catch(error:any){
			console.log('Error while unlocking: '+ error.message);
		}
	}

	const unbanUser = async (email: String) => {
		try{
			const response = await axios.post('/api/users/unban', {email})
			getBannedAcc()
		}catch(error:any){
			console.log('Error while unlocking: '+ error.message);
		}
	}
	useEffect(() => {
		getBookingsByDate(queryDate)
	}, [userState, queryDate])

	useEffect(() => {
		getLightsStatus()
		handleUsersLoad()
		getBannedAcc()
	},[])

	useEffect(() => {
		setDisplayBookings(bookings.filter((booking:BookingInterface) => booking.username.includes(filterUserName)))
	}, [filterUserName])



    return (
		<div className="mx-5">
			<h1 className="text-black-600 text-5xl text-center py-10">
				Hello, <span className='text-black-600 text-5xl'>{userState.username}!</span>
			</h1>
			<div className="grid grid-cols-2 gap-4">
				<div className='flex flex-col justify-start border-solid border-2 border-gray-60 bg-white p-5 rounded-2xl'>
					<h2 className="text-black-700 text-3xl py-2">
						Status
					</h2>
					<div className="grid grid-cols-2 gap-4">
						<h3 className="text-black-700 text-2xl py-2">Lights: {lightsStatus}</h3>
					</div>
					<div className='flex flex-row'>
						<button
							className="text-white bg-blue-600 rounded-full px-10 py-1 hover:bg-blue-700"
							onClick={getLightsStatus}>
							Get Status
						</button>
					</div>
				</div>
				<div className='flex flex-col border-solid border-2 border-gray-60 bg-white p-5 rounded-2xl'>
					<h2 className="text-black-700 text-3xl py-2">
						Command
					</h2>
					<div className="grid grid-cols-2 gap-4">
						<div className='flex flex-col'>
							<h3 className="text-black-700 text-2xl py-2">
								Door:
							</h3>
							<div className='flex flex-row'>
							<button
								className="text-white bg-blue-600 rounded-full px-10 py-1 hover:bg-blue-700"
								onClick={unlockDoor}>
								Unlock
							</button>
							</div>
						</div>
						<div className='flex flex-col'>
							<h3 className="text-black-700 text-2xl py-2">
								Lights
							</h3>
							<div className='flex flex-row justify-between'>
							<button
								className="text-white bg-yellow-300 rounded-full px-10 py-1 hover:bg-yellow-400"
								onClick={turnLightsOn}>
								On
							</button>
							<button
								className="mx-5 text-white bg-slate-800 rounded-full px-10 py-1 hover:bg-slate-900"
								onClick={turnLightsOff}>
								Off
							</button>
							</div>
						</div>
					</div>	
				</div>
			</div>
			<div className='flex flex-col'>
				<div className='flex flex-col border-solid border-2 border-gray-60 bg-white p-5 rounded-2xl my-5'>
					<h2 className="text-black-700 text-3xl py-2">
						Filter bookings
					</h2>
					<div className='flex flex-row items-end'>
						<div className='flex flex-col'>
							<label className="mx-5">Search by name:</label>
							<input
							type="text"
							value={filterUserName}
							onChange={(e) => setFilterUserName(e.target.value)}
							placeholder="Name"
							className=" mx-5 bg-slate-100 text-black rounded-lg px-10 py-2 focus:outline-none focus:border-gray-60"
							/>
						</div>
						<div className='flex flex-col'>
							<label className="mx-5">Search by date:</label>
							<DatePicker
									selected={queryDate} 
									onChange={handleDateChange} 
									icon="fa fa-calendar" 
									dateFormat="MMMM d, yyyy"
									className=" mx-5 bg-slate-100 text-black rounded-lg px-10 py-2 focus:outline-none focus:border-gray-600"
							/>
						</div>
						
						<button
							className="mx-5 text-white bg-red-600 rounded-full px-10 py-1 hover:bg-red-700"
							onClick={clearFilter}>
							Clear filters
						</button>
					</div>
				</div>

				<div className='flex flex-col border-solid border-2 border-gray-60 bg-white p-5 rounded-2xl my-5'>
					<h2 className="text-black-700 text-3xl py-2">
						Bookings
					</h2>
					{bookings.length !== 0 ?
						<div className="grid grid-cols-2 gap-4">
							{displayBookings.map((booking:BookingInterface, index) => (
								<div key={index} className="p-4 bg-slate-100 rounded-lg">
									<p className="font-bold">Booking {index + 1}</p>
									<p>Player: {booking.username}</p>
									<p>Date: {booking.date.toString().slice(0,10)}</p>
									<p>Start Time: {String(Math.trunc(booking.startTime/60)).padStart(2, '0')}:{String(booking.startTime%60).padStart(2, '0')}</p>
									<p>Duration: {booking.duration} minutes</p>
									<button
										className={"text-white bg-red-600 rounded-full px-10 py-1 hover:bg-red-700"}
										onClick={() => {deleteBooking(booking._id, booking.userId)}}
									>
										Delete
									</button>
								</div>
							))}
						</div>
					: 
						<div>No bookings found</div>
					}
				</div>

				<div className='flex flex-col bg-white p-5 rounded-2xl my-5'>
					<div className='flex flex-col items-start'>
						<h2 className="text-black-700 text-3xl py-2">
							Users
						</h2>
					
					</div>
					{users.length !== 0 ?
						<div className="grid grid-cols-2 gap-4">
							{users.map((user:UserInterface, index) => (
								<div key={index} className="p-4 bg-slate-100 rounded-lg">
									<div className='flex flex-row items-start'>
										<h4 className="text-3xl">{user.username}</h4>
										{user.type === 'a' ? <h4 className="text-red-600">(admin user)</h4> : <h4 className="text-red-600">(normal user)</h4>}
									</div>
									{user.type !== 'a' ? 
									<button
										className={"text-white bg-blue-600 rounded-full px-10 py-1 hover:bg-blue-700"}
										onClick={() => {changeAdminStatus(user.email)}}
									>
										Make admin
									</button> : <></>}
									<p className="my-2">ID: {user._id}</p>
									<p className="my-2">Email: {user.email}</p>
									<button
										className={"text-white bg-red-600 rounded-full px-10 py-1 hover:bg-red-700"}
										onClick={() => {deleteUser(user.email)}}
									>
										Delete
									</button>
									<button
										className={"mx-5 text-white bg-red-600 rounded-full px-10 py-1 hover:bg-red-700"}
										onClick={() => {deleteBanUser(user.email)}}
									>
										Delete & Ban
									</button>
								</div>
							))}
						</div>
					: 
						<div>No users found</div>
					}
				</div>

				<div className='flex flex-col bg-white p-5 rounded-2xl my-5'>
					<div className='flex flex-col items-start'>
						<h2 className="text-black-700 text-3xl py-2">
							Banner accounts
						</h2>
						{bannedAcc.length !== 0 ? 
							<div className="grid grid-cols-2 gap-4">
								{bannedAcc.map((acc: BannedInterface, index) => (
								<div key={index} className="p-4 bg-slate-100 rounded-lg">
									<div className='flex flex-row items-start'>
										<p className="">{acc.email}</p>
										<button
										className={"mx-5 text-white bg-red-600 rounded-full px-10 py-1 hover:bg-red-700"}
										onClick={() => {unbanUser(acc.email)}}
										>
										Allow									
										</button>
									</div>
								</div>
							))}
							</div>
						: 
							<div>No banned accounts</div>
						}
					</div>
				</div>
			</div>
		</div>
	);
}