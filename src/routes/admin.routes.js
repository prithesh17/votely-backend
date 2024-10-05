import { Router } from "express";
import { registerAdmin, loginAdmin , createElection, addVoters, announceResults, fetchElectionsByAdmin, deleteElection} from "../controllers/admin.controller.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";

const router = Router()

router.route('/register').post(registerAdmin)
router.route('/login').post(loginAdmin)
router.route('/createElection').post(verifyAdminJWT, createElection)
router.route('/addVoters').post(verifyAdminJWT, addVoters)
router.route('/announceResult').post(verifyAdminJWT, announceResults)
router.route('/fetchElections').get(verifyAdminJWT,fetchElectionsByAdmin )
router.route('/deleteElection').post(verifyAdminJWT, deleteElection)

export default router