import express from "express";
import { adminLogin, adminLogout, isAdminAuth } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/logout", adminLogout);
adminRouter.get("/is-auth", isAdminAuth);

export default adminRouter;
