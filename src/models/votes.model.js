import mongoose, { Schema } from 'mongoose';

const voteSchema = new Schema({
    electionId: {
        type: String,
        required: true,
    },
    candidate: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const Vote = mongoose.model('Vote', voteSchema);
