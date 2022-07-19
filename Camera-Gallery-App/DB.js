let db;
let openRequest = indexedDB.open("myDataBase", 2);
openRequest.addEventListener("success", (e) => {
  db = openRequest.result;
});

openRequest.addEventListener("error", (e) => {});

openRequest.addEventListener("upgradeneeded", (e) => {
  db = openRequest.result;

  db.createObjectStore("video", { keyPath: "id" });
  db.createObjectStore("image", { keyPath: "id" });
});
