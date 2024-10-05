import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Voter } from "../models/voters.model.js"; 

export const verifyVoterJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const voter = await Voter.findById(decodedToken?._id).select("-password");

        if (!voter) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.voter = voter; 
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
