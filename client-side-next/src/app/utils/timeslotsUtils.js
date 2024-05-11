export default function getAvailableSlotsWithDurations(bookings, dayStart, dayEnd) {
    /*
        The cuntion returs the availableDurations Object that contains all the timeslots and their available durations.
        INPUTS:
            - Booking Array of Arrays [[start_time],[duration]]
            - dayStart integer
            - dayEnd integer

        CONSTRAINTS:
            - start_time, dayStart, dayEnd, duration must all divide by 30
    */
    try{

        bookings.forEach(function(booking){
            if(booking[0]%30 != 0 || booking[1]%30 != 0){

                throw new Error(`One existing (${booking[0]},${booking[1]}) booking doesnt respect /30 rule`);
            }
        })

        if(dayStart%30 !== 0 || dayEnd%30 !== 0){
            throw new Error(`dayStart=${dayStart} or dayEnd${dayStart} doesnt respect /30 rule`);
        }
        //console.log('here')
        let availableSlots = [];
        let availableDurations = {};
        let currentTime = dayStart;

        while (currentTime < dayEnd) {
            let slotAvailable = true;
            let availableDurationsForSlot = [60, 90, 120]; // Initialize with all durations
            
            for (let booking of bookings) {
                let [bookingStart, bookingDuration] = booking;
                let bookingEnd = bookingStart + bookingDuration;

                if (currentTime >= bookingStart && currentTime < bookingEnd) {
                    slotAvailable = false;
                    currentTime = bookingEnd;
                    break;
                } else if (currentTime < bookingStart) {
                    // If the booking starts after the current time slot,
                    // update available durations for this slot
                    availableDurationsForSlot = availableDurationsForSlot.filter(duration => duration <= (bookingStart - currentTime));
                }
            }

            if (slotAvailable) {
                // Convert time in minutes to hours and minutes format
                let hours = Math.floor(currentTime / 60);
                let minutes = currentTime % 60;
                let timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                availableSlots.push(timeString);
                availableDurations[timeString] = availableDurationsForSlot;
                currentTime += 30;
            }
        }
        return availableDurations;

    }catch(err){
        console.log(err)
        return {};
    }
    
}

/*
// Example usage:
let bookings = [[810, 120], [960, 90], [1020, 60]];  // Example bookings (start time, duration)
let dayStart = 0;  // Start of the day in minutes since midnight
let dayEnd = 1440;  // End of the day in minutes since midnight

// Get available slots with durations
let availableDurations = getAvailableSlotsWithDurations(bookings, dayStart, dayEnd);
console.log("Available durations for each timeslot:");
console.log(availableDurations);
*/