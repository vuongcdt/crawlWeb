const { log } = require("console");
const express = require("express");
const { runRouter } = require("./Router/Run");
const bodypasrser = require("body-parser");
const { default: axios } = require("axios");
// const listUrl = require("./dataCrawl/listUrl.json");
const listUrl = require("./dataCrawl/listUrlSet.json");
const dataend = require("./dataCrawl/data.json");
const { writeFile } = require("node:fs/promises");
const path = require("path");

console.log(`  ~ dataend`, dataend.length);
console.log("set name", [...new Set(dataend.map((item) => item.name))].length);

// const arr = [];
// const mySet1 = new Set();
// listUrl.map((item) => {
//    if (!mySet1.has(item.url)) {
//       arr.push(item);
//       mySet1.add(item.url);
//    }
// });
// console.log(`  ~ arr`, arr)
// console.log(`  ~ mySet1:`, [...mySet1].length);

//price:33
// let a=1904
// console.log('ss',Math.floor(a/10)%10);
const dataEnd = dataend.filter((item) => {
   // writeFile(path.resolve(__dirname, "./dataCrawl/data.json"), JSON.stringify([]),()=>{});
   // return item.categories.length > 2;
   return item.categories.map((item) => item.name).includes("4016n back to school kids");
   // return item.categories.map(item=>item.name).includes('Home');
});
// console.log(`  ~ dataEnd`, dataEnd[0]);
console.log(`  ~ dataEnd`, dataEnd.length);
// // console.log(`  ~ dataend`, dataend.length);
// const temp = dataend.map((data) => data.id);
// const set = new Set(temp);
// console.log(`  ~ set`, [...set].length);
// console.log(`  ~ dataAllLink`, dataAllLink.length);
// console.log(`SET  ~ dataAllLink`, [...new Set(dataAllLink.map((item) => item.url))].length);
// const arrDb = [];
// const testDb = dataAllLink.filter((item) => {
//    return item.back_image.src.length > 150;
// });
// console.log(`  ~ testDb`, testDb.length);

// mySet1.add(JSON.stringify({ name: "1" }));
// console.log(`  ~ mySet1.has(JSON.stringify({ name: "1" }));`, mySet1.has(JSON.stringify({ name: "1" })))
// console.log(`  ~ mySet1`, JSON.parse([...mySet1][0]));

// const count = {};
// const arr = [];c:\Users\ADMIN\AppData\Local\Programs\Microsoft VS Code\resources\app\out\vs\code\electron-sandbox\workbench\workbench.html
// temp.map((id) => {
//    if (!count[id]) {
//       count[id] = 1;
//    } else {
//       count[id]++;
//       arr.push(id);
//    }
// });
// console.log(`  ~ arr`, arr);
// console.log(`  ~ arr`, arr.length);
// console.log([...new Set(arr)].length);

const app = express();
const port = process.env.PORT || 5002;

app.use(bodypasrser.json());
app.use("/run", runRouter);

// let listError = [];
// data.map((item) => {
//    if (item.back_image.src.length < 150 && item.back_image.src) listError.push(item.back_image.src);
//    // if (!item.back_image.src) listError.push(item.front_image.src);
//    // if (!item.back_image.src) item.back_image.src = item.front_image.src;
// });
// // const data2 = data.filter((item) => item.back_image.src.length > 150);
// // console.log(`  ~ data2`, data2);

// console.log(`  ~ listError`, listError);
// console.log(`  ~ listError`, listError.length);

app.get("/", async (req, res) => {
   res.send(`sever connect : ` + new Date());
});

app.listen(port, () => log(`listen ${port}`));
