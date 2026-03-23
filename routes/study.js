const express = require("express");
const router = express.Router();

const Session = require("../models/Session");
const auth = require("../middleware/authMiddleware");


// Dashboard
router.get("/dashboard", async (req, res) => {

  const sessions = await Session.find();

  const grouped = {};

  sessions.forEach(s => {
    if (!grouped[s.subject]) {
      grouped[s.subject] = [];
    }
    grouped[s.subject].push(s);
  });

  res.render("dashboard", { sessions, grouped });

});

// Add session page
router.get("/add", auth, (req, res) => {
    res.render("addSession");
});


// Save session (Timer version)
router.post("/sessions", auth, async (req, res) => {

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
