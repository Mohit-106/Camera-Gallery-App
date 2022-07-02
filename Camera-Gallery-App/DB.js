//Open database(step1)
//Create object store(step2)
//Make transactions(step3)

let db;
let openRequest = indexedDB.open("myDataBase", 2); //request to open indexDB
//second parameter is version of database (default value is 1)
//when bg accessed successfuly
openRequest.addEventListener("success", (e) => {
  db = openRequest.result;
});

//when error accured during opening of db
openRequest.addEventListener("error", (e) => {});

// this will upgrade the db upgrades
//let we dont set version of db then browser make update by itself
//and will set its version to 1
//if we set version manually then this will not execute to upgrade
//version
openRequest.addEventListener("upgradeneeded", (e) => {
  //initial db creation
  db = openRequest.result;
  //creating object store
  db.createObjectStore("video", { keyPath: "id" });
  db.createObjectStore("image", { keyPath: "id" });
});
