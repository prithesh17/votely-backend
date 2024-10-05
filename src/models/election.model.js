import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';


const generateElectionId = () => {
    return uuidv4();
};

const candidateSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    party: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: false }); 

const electionSchema = new Schema({
    adminId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Admin' 
    },
    electionId: {
        type: String,
        unique: true,
        required: true,
        default: generateElectionId 
    },
    electionTitle: {
        type: String,
        required: true,
        trim: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    candidates: [candidateSchema], 
}, { timestamps: true });

electionSchema.pre('save', function(next) {
    if (!this.electionId) {
        this.electionId = generateElectionId();
    }
    next();
});

export const Election = mongoose.model('Election', electionSchema);








