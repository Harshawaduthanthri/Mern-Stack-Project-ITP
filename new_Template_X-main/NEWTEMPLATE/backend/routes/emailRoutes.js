import express from "express";
const router = express.Router();

import { sendEmail } from "../controllers/emailControllers.js";

router.post("/sendEmail", sendEmail);
export default router;
