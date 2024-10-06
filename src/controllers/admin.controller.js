import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Admin } from '../models/admin.model.js'
import { Vote } from '../models/votes.model.js'
import { sendEmail } from "../utils/emailSender.js";
import { createAccountEmail, createElectionResultsEmail,createVoterCredentialsEmail } from '../utils/emailContent.js'
import { Election } from "../models/election.model.js";
import { Voter } from '../models/voters.model.js';
import { generateUniquePassword } from '../utils/userpass.utils.js';

const registerAdmin = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    if ([fullName, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await Admin.findOne({ email });
    if (existedUser) {
        throw new ApiError(409, "Admin with email already exists");
    }

    const newAdmin = await Admin.create({
        fullName,
        email,
        password,
    });

    const createdUser = await Admin.findById(newAdmin._id).select("-password");
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the Admin");
    }

    const emailSubject = "Welcome to Votely!";
    const emailHtml = createAccountEmail(fullName, email, password);

    try {
        sendEmail(email, emailSubject, emailHtml);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new ApiError(500, "Admin created, but failed to send email");
    }

    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
});


const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email && !password) {
        throw new ApiError(400, "Email and Password is required")
    }

    const admin = await Admin.findOne({ email })
    if (!admin) {
        throw new ApiError(404, "Admin does not exist")
    }

    const isPasswordValid = await admin.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const accessToken = admin.generateAccessToken()
    const loggedInUser = await Admin.findById(admin._id).select("-password")

    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 60 * 1000)
    }

    res.cookie('accessToken', accessToken, options);
    res.status(200).json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken
            },
            "User logged In Successfully"
        )
    )
})


const createElection = asyncHandler(async (req, res) => {
    const { electionTitle, startTime, endTime, candidates } = req.body;
    const adminId = req.user._id;
    if (!startTime || !endTime || !Array.isArray(candidates) || candidates.length === 0) {
        throw new ApiError(400, "Start time, end time, and candidates are required");
    }

    const newElection = await Election.create({
        adminId,
        electionTitle,
        startTime,
        endTime,
        candidates,
    });

    return res.status(201).json({
        success: true,
        election: newElection,
        message: "Election created successfully",
    });
});

const addVoters = asyncHandler(async (req, res) => {
    const { electionId, voters } = req.body;

    const election = await Election.findOne({ electionId });
    if (!election) {
        throw new ApiError(404, "Election not found");
    }
    const { electionTitle, startTime, endTime } = election;

    for (let i = 0; i < voters.length; i++) {
        const email = voters[i];

        const existingVoter = await Voter.findOne({ email });

        if (existingVoter) {
            continue; 
        }

        const password = generateUniquePassword();
        const newVoter = new Voter({
            electionId,
            email,
            password,
        });

        await newVoter.save();

        const emailSubject = "You're Invited to Vote!";
        const emailHtml = createVoterCredentialsEmail(electionTitle, startTime, endTime, electionId, email, password);

        try {
            await sendEmail(email, emailSubject, emailHtml);
            console.log(`Email sent to: ${email}`);
        } catch (error) {
            console.error("Error sending email:", error);
            throw new ApiError(500, "Failed to send email");
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return res.status(201).json(new ApiResponse(200, voters, "Voter Added and mail sent successfully"));
});


const announceResults = asyncHandler(async (req, res) => {
    const { electionId } = req.body;

    const election = await Election.findOne({ electionId });
    if (!election) {
        throw new ApiError(404, 'Election not found');
    }

    const votes = await Vote.find({ electionId });

    const voteCounts = votes.reduce((acc, vote) => {
        acc[vote.candidate] = (acc[vote.candidate] || 0) + 1;
        return acc;
    }, {});

    console.log("Vote Counts: ", voteCounts);

    const results = Object.keys(voteCounts).map(candidate => ({
        candidate,
        votes: voteCounts[candidate],
    }));


    if (!Array.isArray(results)) {
        throw new ApiError(500, "Results should be an array");
    }

    const emailContent = createElectionResultsEmail(election.electionTitle, results, electionId);

    const voters = await Voter.find({ electionId });
    const voterEmails = voters.map(voter => voter.email);

    for (const email of voterEmails) {
        await sendEmail(email, `Election Results : ${election.electionTitle}`, emailContent);
    }

    await Voter.deleteMany({ electionId });

    res.status(200).json(
        new ApiResponse(200, results, 'Election results announced and emails sent successfully')
    );
});



const deleteElection = asyncHandler(async (req, res) => {
    const { electionId } = req.body;

    if (!electionId) {
        throw new ApiError(400, "Election ID is required");
    }

    await Election.deleteOne({electionId});

    await Vote.deleteMany({ electionId });

    await Voter.deleteMany({ electionId });

    return res.status(200).json(
        new ApiResponse(200, "Election and associated records deleted successfully")
    );
});

const fetchElectionsByAdmin = asyncHandler(async (req, res) => {
    const adminId = req.user._id; 
    const elections = await Election.find({ adminId });

    if (elections.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "No elections found for this admin")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, elections, "Elections fetched successfully")
    );
});

export { registerAdmin, loginAdmin, createElection, addVoters, announceResults,  deleteElection, fetchElectionsByAdmin}