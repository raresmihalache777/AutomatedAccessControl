import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    code: {
        type: Number,
        required: true
    }
});

const Booking = mongoose.models.bookings || mongoose.model('bookings', bookingSchema);

export default Booking;
