import mongoose from 'mongoose';

const gymSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    facilities: {
        type: [String],
        required: true,
    },
    membershipTypes: {
        type: [String],
        required: true,
    },
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    membership: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym',
    },
});

const Gym = mongoose.model('Gym', gymSchema);
const User = mongoose.model('User', userSchema);

export { Gym, User };