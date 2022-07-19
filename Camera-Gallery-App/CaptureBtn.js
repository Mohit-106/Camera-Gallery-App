let transparentColor = "transparent";

captureBtnCont.addEventListener("click", (e) => {
  captureBtn.classList.add("scale-capture");
  let canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  let tool = canvas.getContext("2d");

  tool.drawImage(video, 0, 0, canvas.width, canvas.height);

  tool.fillStyle = transparentColor;
  tool.fillRect(0, 0, canvas.width, canvas.height);
  let imageURL = canvas.toDataURL();

  if (db) {
    let imageID = shortid();
    let dbTransaction = db.transaction("image", "readwrite");
    let imageStore = dbTransaction.objectStore("image");
    let imageEntry = {
      id: `img-${imageID}`,
      url: imageURL,
    };
    imageStore.add(imageEntry);
  }
  setTimeout(() => {
    captureBtn.classList.remove("scale-capture");
  }, 500);
});

let allFilters = document.querySelectorAll(".filter");
let filterLayer = document.querySelector(".filter-layer");

allFilters.forEach((filterEle) => {
  filterEle.addEventListener("click", (e) => {
    transparentColor =
      getComputedStyle(filterEle).getPropertyValue("background-color");
    filterLayer.style.backgroundColor = transparentColor;
  });
});
