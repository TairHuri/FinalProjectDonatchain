import { Router } from "express";
import authRoutes from "./auth.routes";
import campaignsRoutes from "./campaigns.routes";
import donationsRoutes from "./donations.routes";
import ngoRoutes from "./ngos.routes";
import usersRoutes from "./users.routes";
import adminRoutes from "./admin.routes";
import messagesRoutes from "./message.route";
import requestsRoutes from "./request.route";
import aboutRoutes from "./about.routes";
import rulesRoutes from "./rules.routes";

const router = Router();
// This file aggregates and registers all API routes for the application.
// Each route group handles a specific domain: authentication, campaigns, donations, NGOs, users, admin operations, messages, requests, about info, and rules.
// The root "/" route is a simple health check returning { ok: true }.
router.use("/auth", authRoutes);
router.use("/campaigns", campaignsRoutes);
router.use("/donations", donationsRoutes);
router.use("/ngos", ngoRoutes);
router.use("/users", usersRoutes);
router.use("/admin", adminRoutes);
router.use("/messages", messagesRoutes);
router.use("/requests", requestsRoutes);
router.use("/about", aboutRoutes);
router.use("/rules", rulesRoutes); 

router.get("/", (req, res) => res.json({ ok: true }));

export default router;
