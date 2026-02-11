const express = require("express");
const router = express.Router();

const Session = require("../models/Session");
const auth = require("../middleware/authMiddleware");


// Dashboard
router.get("/dashboard", auth, async (req, res) => {
    const sessions = await Session.find({ userId: req.session.userId });
    res.render("dashboard", { sessions });
});


// Add session page
router.get("/add", auth, (req, res) => {
    res.render("addSession");
});


// Save session (Timer version)
router.post("/save-session", auth, async (req, res) => {

    const { subject, studyTime, distractionTime } = req.body;

    const focusScore = ((studyTime - distractionTime) / studyTime) * 100;

    await Session.create({
        userId: req.session.userId,
        subject,
        studyTime: Math.floor(studyTime / 60),
        distractionTime: Math.floor(distractionTime / 60),
        focusScore
    });

    res.json({ success: true });
});

module.exports = router;
