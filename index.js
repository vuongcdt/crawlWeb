const { log } = require("console");
const express = require("express");
const { runRouter } = require("./Router/Run");
const bodypasrser = require("body-parser");
const { default: axios } = require("axios");
const data = require("./dataAllLink.json");
const dataend = require("./dataCrawl/data.json");
//price:33
const test = dataend.filter((item) => {
   return item.reviews ;
});
// console.log(`  ~ test`, test);
console.log(`  ~ test`, test.length);
// console.log(`  ~ dataend`, dataend.length);
// const temp = dataend.map((data) => data.id);
// const set = new Set(temp);
// console.log(`  ~ set`, [...set].length);
// const count = {};
// const arr = [];
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
const port = process.env.PORT || 5001;

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
