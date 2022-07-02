let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");

let recorder;
let recordFlag = false;
let chunk = []; // to get recordered data

//Various Browser api to record video
let constraints = {
  video: true,
  audio: true,
};

//navigator->global object which provides browser information
//mediaDevices->it is a interface that connect hardware like camera mic with browser
//getUserMedia->it ask for user permission to on camera and audio devices
navigator.mediaDevices
  .getUserMedia(constraints) //promise
  .then((stream) => {
    //video opened and start displayig
    video.srcObject = stream;
    recorder = new MediaRecorder(stream);
    recorder.addEventListener("start", (e) => {
      chunk = []; // creating new chunk every time for new section of recording
    });
    //pushing data chunks to array
    recorder.addEventListener("dataavailable", (e) => {
      chunk.push(e.data);
    });
    recorder.addEventListener("stop", (e) => {
      //converting chunk data to video
      let blob = new Blob(chunk, { type: "video/mp4" });
      let videoURL = URL.createObjectURL(blob);
      if (db) {
        let Videoid = shortid();
        let dbTransaction = db.transaction("video", "readwrite");
        let videoStore = dbTransaction.objectStore("video");
        let videoEntry = {
          id: `video-${Videoid}`, //keyPath name and this obj name should be same
          blobData: blob,
        };
        videoStore.add(videoEntry); //adding in store
      }
      // let a = document.createElement("a");
      // a.href = videoURL;
      // a.download = "Video.mp4";
      // a.click();
    });
  });

  
recordBtnCont.addEventListener("click", (e) => {
  if (!recorder) return;
  recordFlag = !recordFlag;
  if (recordFlag) {
    recorder.start();
    startTimer();
    //adding class to perform animation
    recordBtn.classList.add("scale-record");
  } else {
    recorder.stop();
    stopTimer();
    recordBtn.classList.remove("scale-record");
  }
});

//timer Section
let timerID;
let counter = 0; // Represents total seconds
let timer = document.querySelector(".timer");
function startTimer() {
  timer.style.display = "block";
  function displayTimer() {
    let totalSeconds = counter;

    let hours = Number.parseInt(totalSeconds / 3600);
    totalSeconds = totalSeconds % 3600; // remaining value

    let minutes = Number.parseInt(totalSeconds / 60);
    totalSeconds = totalSeconds % 60; // remaining value

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
