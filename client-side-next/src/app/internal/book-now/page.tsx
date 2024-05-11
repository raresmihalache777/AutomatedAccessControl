'use client';

import { useUserContext } from "@/app/context/userContext";
import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import getAvailableSlots from '@/app/utils/timeslotsUtils'


export default function BookPage() {
    const [booking, setBooking] = useState({
        userId : '',
        date : new Date(),
        startTime : 0,
        duration:0,
        timestamp : new Date(),
        code: ''
    })

    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
	const [bookingDuration, setBookingDuration] = useState(60);
	const [bookDisabled, setBookDisabled] = useState(true);
    const [existingBookings, setExistingBookings] = useState([[0,0],[0,0]]);
    const [availableSlots, setAvailableSlots] = useState({})
    const [disabledDurations, setDisabledDurations] = useState({button60:true, button90:true, button120:true});
	const userState = useUserContext();
    const dayStart = 0;
    const dayEnd = 1440;



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
            userId : userState.id,
            date : dayStart,
            startTime : minutesElapsed
        })
    }

	const handleDurationChange = (duration: number) => {
        setBookingDuration(duration);
        setBooking({...booking,
            duration: duration
        })
    };

    const getBookingsByDate = async (date:Date) => {
        try{
            setLoading(true);
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
    
	const onBook = async () => {
		try{
            setLoading(true);
            //console.log(booking)
			const response = await axios.post('/api/bookings/create', booking);
			//console.log('booking saved!', response.data);
        }catch(error:any){
            console.log('Error while saving your booking: ' + error.message);
        }
	}

    const filterTime = (time:any) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);

        // Format the hour and minute components with leading zeros if necessary
        const hours = String(selectedDate.getHours()).padStart(2, '0');
        const minutes = String(selectedDate.getMinutes()).padStart(2, '0');

        // Combine the formatted hour and minute components with a colon to create the time string
        let stringTime:String = `${hours}:${minutes}`;
        //console.log(stringTime);
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

    useEffect(() => {
        //console.log(booking)
        getBookingsByDate(booking.date)
        setDisabledDurations({button60:true, button90:true, button120:true})
    }, [booking])

    useEffect(() => {
        //console.log(existingBookings)
        setAvailableSlots(getAvailableSlots(existingBookings, dayStart, dayEnd))
    }, [existingBookings])

    useEffect(() => {
        console.log(booking)
        // Format the hour and minute components with leading zeros if necessary
        const hours = String(Math.trunc(booking.startTime/60)).padStart(2, '0');
        const minutes = String(booking.startTime%60).padStart(2, '0');

        // Creating string time format to access the Object
        let stringTime:String = `${hours}:${minutes}`;
        console.log(availableSlots[stringTime])
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

    return (
        <div className="mx-5 flex flex-col justify-center items-center">
            <h1 className="text-black-600 text-5xl text-center py-10">
                Book your tennis court!
            </h1>

            <div className="mb-6">
                <h2 className="mb-2">Pick your date:</h2>
                <DatePicker 
                    selected={startDate} 
                    showTimeSelect 
                    onChange={handleDateChange} 
                    icon="fa fa-calendar" 
                    dateFormat="MMMM d, yyyy h:mm aa"
                    filterTime={filterTime}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
                />
            </div>

            <div>
                <h2 className="mb-2">Booking duration:</h2>
				<div className="flex gap-4">
				<div>
    <button 
        className={`bg-gray-200 text-center py-2 px-4 rounded-lg border cursor-pointer ${bookingDuration === 60 ? 'border-black bg-gray-400' : ''} ${disabledDurations.button60 ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => handleDurationChange(60)}
        disabled={disabledDurations.button60}
    >
        60 min
    </button>
    <button 
        className={`bg-gray-200 text-center py-2 px-4 rounded-lg border cursor-pointer ${bookingDuration === 90 ? 'border-black bg-gray-400' : ''} ${disabledDurations.button90 ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => handleDurationChange(90)}
        disabled={disabledDurations.button90}
    >
        90 min
    </button>
    <button 
        className={`bg-gray-200 text-center py-2 px-4 rounded-lg border cursor-pointer ${bookingDuration === 120 ? 'border-black bg-gray-400' : ''} ${disabledDurations.button120 ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => handleDurationChange(120)}
        disabled={disabledDurations.button120}
    >
        120 min
    </button>
</div>
				</div>
            </div>
			<button
				onClick={onBook}
				disabled = {bookDisabled}
				className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 uppercase px-40 py-3 mt-10 font-bold">
				Book!
			</button>
        </div>
    );
}
