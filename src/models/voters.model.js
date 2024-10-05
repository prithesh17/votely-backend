import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const voterSchema = new Schema({
    electionId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVoteCasted: {
        type: Boolean,
        default: false,  
    }
}, { timestamps: true });


voterSchema.pre('save', async function (next) {
    this.email = this.email.toLowerCase();

    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

voterSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

voterSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            electionId: this.electionId,
            email: this.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

export const Voter = mongoose.model('Voter', voterSchema);
