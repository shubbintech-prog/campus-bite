import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getWalletBalance, getWalletTransactions, depositFunds, payForOrder } from "../controllers/walletController.js";

const router = express.Router();

router.use(protect);

router.get("/balance", getWalletBalance);
router.get("/transactions", getWalletTransactions);
router.post("/deposit", depositFunds);
router.post("/pay", payForOrder);

export default router;
