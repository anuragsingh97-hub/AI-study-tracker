const startBtn = document.getElementById("startBtn");
const studyArea = document.getElementById("studyArea");
const video = document.getElementById("video");
const submitBtn = document.getElementById("submitBtn");

let totalTime = 0;
let distractionTime = 0;
let timerInterval;

startBtn.addEventListener("click", async () => {

  const subject = document.getElementById("subject").value.trim();

  if(subject === ""){
      alert("Please enter subject before starting study session");
      return;
  }

  alert("Camera will be used only for focus detection. Video will NOT be stored.");

  studyArea.style.display = "block";

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;

  startTimer();
  camera.start();
});

function startTimer() {
  timerInterval = setInterval(() => {
    totalTime++;
    document.getElementById("timer").innerText = formatTime(totalTime);
  }, 1000);
}

/* ================= AI FACE DETECTION ================= */

const faceDetection = new FaceDetection({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`
});

faceDetection.setOptions({
  model: "short",
  minDetectionConfidence: 0.5
});

faceDetection.onResults((results) => {
  if (!results.detections || results.detections.length === 0) {
    distractionTime++;
    console.log("Distracted!");
  }
});

const camera = new Camera(video, {
  onFrame: async () => {
    await faceDetection.send({ image: video });
  },
  width: 500,
  height: 400
});

/* ================= SUBMIT ================= */

submitBtn.addEventListener("click", async () => {
  clearInterval(timerInterval);

  const subject = document.getElementById("subject").value;

  const focusTime = totalTime - distractionTime;

  const focusScore = totalTime > 0
    ? Number(((focusTime / totalTime) * 100).toFixed(2))
    : 0;

  await fetch("/study/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      subject,
      studyTime: totalTime,
      focusTime,
      distractionTime,
      focusScore
    })
  });

  window.location.href = "/study/dashboard";
});

//add to change time formate

function formatTime(seconds){

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const h = String(hrs).padStart(2,'0');
    const m = String(mins).padStart(2,'0');
    const s = String(secs).padStart(2,'0');

    return `${h} : ${m} : ${s}`;
}