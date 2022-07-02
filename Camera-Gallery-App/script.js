let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");

let recorder;
let recordFlag = false;
let chunk = [];

let constraints = {
  video: true,
  audio: true,
};

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  video.srcObject = stream;
  recorder = new MediaRecorder(stream);
  recorder.addEventListener("start", (e) => {
    chunk = [];
  });

  recorder.addEventListener("dataavailable", (e) => {
    chunk.push(e.data);
  });
  recorder.addEventListener("stop", (e) => {
    let blob = new Blob(chunk, { type: "video/mp4" });
    let videoURL = URL.createObjectURL(blob);
    if (db) {
      let Videoid = shortid();
      let dbTransaction = db.transaction("video", "readwrite");
      let videoStore = dbTransaction.objectStore("video");
      let videoEntry = {
        id: `video-${Videoid}`,
        blobData: blob,
      };
      videoStore.add(videoEntry);
    }
  });
});

recordBtnCont.addEventListener("click", (e) => {
  if (!recorder) return;
  recordFlag = !recordFlag;
  if (recordFlag) {
    recorder.start();
    startTimer();

    recordBtn.classList.add("scale-record");
  } else {
    recorder.stop();
    stopTimer();
    recordBtn.classList.remove("scale-record");
  }
});

let timerID;
let counter = 0;
let timer = document.querySelector(".timer");
function startTimer() {
  timer.style.display = "block";
  function displayTimer() {
    let totalSeconds = counter;

    let hours = Number.parseInt(totalSeconds / 3600);
    totalSeconds = totalSeconds % 3600;

    let minutes = Number.parseInt(totalSeconds / 60);
    totalSeconds = totalSeconds % 60;

    let seconds = totalSeconds;

    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    timer.innerText = `${hours}:${minutes}:${seconds}`;

    counter++;
  }

  timerID = setInterval(displayTimer, 1000);
}
function stopTimer() {
  clearInterval(timerID);
  timer.innerText = "00:00:00";
  timer.style.display = "none";
}
