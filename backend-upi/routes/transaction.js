const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Transaction = require("../models/Transactions");
const { logAction } = require("../utils/logger");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middleware/auth");

const generateTxnRef = () => {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const randomPart = Math.floor(1000 + Math.random() * 9000); // random 4 digits
    return `UPI${datePart}${randomPart}`;
};

router.post("/send", authMiddleware, async (req, res) => {
    const { fromVPA, toVPA, amount, pin } = req.body;

    try {
        const sender = await User.findOne({ vpa: fromVPA });
        const receiver = await User.findOne({ vpa: toVPA });

        if (!sender || !receiver)
            return res.status(404).json({ error: "User not found" });
        if (!sender.pinHash)
            return res.status(403).json({ error: "Sender has not set a PIN" });

        const isPinValid = await bcrypt.compare(pin, sender.pinHash);
        if (!isPinValid) return res.status(401).json({ error: "Invalid UPI PIN" });

        if (sender.balance < amount)
            return res.status(400).json({ error: "Insufficient balance" });

        // Deduct and add balances
        sender.balance -= amount;
        receiver.balance += amount;

        await sender.save();
        await receiver.save();

        // Create txnRef
        const txnRef = generateTxnRef();

        // Save transaction with txnRef
        const txn = new Transaction({ from: fromVPA, to: toVPA, amount, txnRef });
        await txn.save();

        await logAction(fromVPA, "MONEY_SENT", { to: toVPA, amount, txnRef });
        await logAction(toVPA, "MONEY_RECEIVED", { from: fromVPA, amount, txnRef });

        res.status(201).json(txn);
    } catch (err) {
        console.error("Transaction error:", err);
        res.status(500).json({ error: "Transaction failed" });
    }
});


router.get("/history/:vpa", async (req, res) => {
    const { vpa } = req.params;
    const txns = await Transaction.find({ $or: [{ from: vpa }, { to: vpa }] }).sort({ timestamp: -1 });
    res.json(txns);
});

router.get("/history", authMiddleware, async (req, res) => {
    const { type, search } = req.query;
    const vpa = req.user.vpa;

    let filter = {};

    try {
        if (type === "sent") {
            filter.from = vpa;
        } else if (type === "received") {
            filter.to = vpa;
        } else {
            filter.$or = [{ from: vpa }, { to: vpa }];
        }

        if (search && search.trim() !== "") {
            // Important: If filter.$or exists, extend it, else create it
            // But if type is "all", filter.$or was already set above for from/to = vpa
            // You must merge carefully to avoid invalid filter logic.

            // Let's create a combined $and filter for "all" type to include search properly
            if (type === "all") {
                filter = {
                    $and: [
                        {
                            $or: [{ from: vpa }, { to: vpa }]
                        },
                        {
                            $or: [
                                { from: { $regex: search, $options: "i" } },
                                { to: { $regex: search, $options: "i" } },
                            ],
                        },
                    ],
                };
            } else {
                // For sent or received, just add regex on the other field(s)
                // e.g. if sent (from = vpa), search on "to" or "from"
                filter.$or = filter.$or || [];
                filter.$or.push(
                    { from: { $regex: search, $options: "i" } },
                    { to: { $regex: search, $options: "i" } }
                );
            }
        }

        const transactions = await Transaction.find(filter).sort({ timestamp: -1 });
        res.json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});


module.exports = router;
