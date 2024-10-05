import { Router } from "express";
import { fetchElection, loginVoter, castVote } from "../controllers/voter.controller.js";
import { verifyVoterJWT } from "../middlewares/voterAuth.middleware.js";

const router = Router()

router.route('/login').post(loginVoter)
router.route('/fetchElection').get(verifyVoterJWT, fetchElection)
router.route('/castVote').post(verifyVoterJWT, castVote);

export default router