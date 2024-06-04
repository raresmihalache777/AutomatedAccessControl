import mongoose from 'mongoose';

const bannedSchema = new mongoose.Schema({
    email:{
        type : String,
        required: true,
        unique: true
    }
});

const Banned = mongoose.models.banned || mongoose.model('banned', bannedSchema);

export default Banned;
