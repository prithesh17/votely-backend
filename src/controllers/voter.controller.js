import { asyncHandler } from '../utils/asyncHandler.js'
import { Voter } from '../models/voters.model.js';
import { Vote } from '../models/votes.model.js';
import { Election } from '../models/election.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const loginVoter = asyncHandler(async (req, res) => {
    const { electionId, email, password } = req.body;

    if (!electionId || !email || !password) {
        throw new ApiError(400, "Election ID, Email, and Password are required");
    }

    const voter = await Voter.findOne({ electionId, email });
    if (!voter) {
        throw new ApiError(404, "Voter does not exist");
    }

    const isPasswordValid = await voter.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const accessToken = voter.generateAccessToken();

    const loggedInVoter = await Voter.findById(voter._id).select("-password");

    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 60 * 1000), 
    };

    res.cookie('accessToken', accessToken, options);

    res.status(200).json(
        new ApiResponse(
            200,
            {
                voter: loggedInVoter, accessToken
            },
            "Voter logged in successfully"
        )
    );
});

const fetchElection = asyncHandler(async (req, res) => {
    const { electionId } = req.voter;

    const election = await Election.findOne({ electionId });

    if (!election) {
        throw new ApiError(404, "Election not found");
    }

    return res.status(200).json(
        new ApiResponse(200, election, "Election fetched successfully")
    );
});


const castVote = asyncHandler(async (req, res) => {
    const { candidate } = req.body;

    if (!candidate) {
        throw new ApiError(400, 'Candidate selection is required');
    }

    const { electionId, email } = req.voter;

    const election = await Election.findOne({ electionId });
    if (!election) {
        throw new ApiError(404, 'Election not found');
    }

    const currentTime = new Date();
    if (currentTime < election.startTime || currentTime > election.endTime) {
        throw new ApiError(403, 'Voting is not allowed outside the election period');
    }

    const voter = await Voter.findOne({ electionId, email });
    if (!voter) {
        throw new ApiError(403, 'You are not authorized to vote');
    }

    if (voter.isVoteCasted) {
        throw new ApiError(403, 'You have already cast your vote');
    }

    const newVote = new Vote({
        electionId,
        voterEmail: email,
        candidate,
    });

    await newVote.save();

    voter.isVoteCasted = true;
    await voter.save();

    res.status(201).json(
        new ApiResponse(
            201,
            null,
            'Vote cast successfully'
        )
    );
});



export { loginVoter, fetchElection, castVote }