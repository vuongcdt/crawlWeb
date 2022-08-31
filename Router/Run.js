const { urlencoded } = require("body-parser");
const url = require("url");
const express = require("express");
const { crawlListUrlProduct, crawlProductDetailByListUrlCtrl } = require("../Controller/runCtrl");
const runRouter = express.Router();
const listAdr = require("../dataCategories.json");
const puppeteer = require("puppeteer");
const dataAllLink = require("../dataLink.json");

let timeInterval;
runRouter.get("/detail", async (req, res) => {
   await crawlProductDetailByListUrlCtrl(dataAllLink.slice(0,25));
   res.send("test");
   // return;
});
runRouter.get("/", async (req, res) => {
   const listAdr2 = listAdr.slice(30, 31);
   // console.log(`  ~ listAdr2`, listAdr2);

   let countDelay = 1;
   const timeDelayReq = 1000;
   const timeSuccsessReq = 5 * 1000;
   const listData = [];
   const browser = await puppeteer.launch({
      // headless: "chrome",
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
   });
   // const adr = "https://www2.hm.com/en_gb/ladies/shop-by-product/dresses.html"
   // const adr = "https://www2.hm.com/en_gb/sale/women/view-all.html";

   const listItem = listAdr2.map((adr) => {
      const q = url.parse(adr, true);
      const chars = { ".html": "", "-": " ", "/en_gb/": "", "/products": "", "/view-all": "", "/shop-by-product": "", "/seasonal-trending": "" };
      const categories = q.pathname
         .replace(/.html|-|\/en_gb\/|\/products|\/view-all|\/seasonal-trending|\/shop-by-product/g, (m) => chars[m])
         .split("/")
         .map((category) => category[0].toUpperCase() + category.slice(1));
      return { adr, categories };
   });
   timeInterval = setInterval(async () => {
      if (listItem.length === 0 && countDelay % 5 === 0) {
         timeInterval._repeat = 5 * 1000;
         setTimeout(async () => {
            clearInterval(timeInterval);
            console.log(`  ~ listData`, listData);
            await browser.close();
            // try {
            //    const dataAll = JSON.parse(await fs.promises.readFile(path.resolve(__dirname, "../dataCrawl/data.json")));
            //    console.log(`  ~ dataAll.length`, dataAll.length);
            //    dataAll.push(...data);
            //    console.log(`  ~ dataAll.length`, dataAll.length);
            //    await fs.promises.writeFile(path.resolve(__dirname, "../dataCrawl/data.json"), JSON.stringify(dataAll));
            //    // console.log(`  ~ data.length end`, data.length);
            //    return;
            // } catch (error) {
            //    console.log(`  ~ error FS`, error);
            //    return;
            // }
         }, timeSuccsessReq);
         return;
      }
      if (listItem.length === 0) {
         countDelay++;
         return;
      }
      const fisrtItem = listItem.shift();
      try {
         const result = await crawlListUrlProduct(fisrtItem.adr, browser, fisrtItem.categories);
         listData.push(...result);
         // console.log(`  ~ result`, result.map(item=>item));
         // res.json("LongTime");
      } catch (error) {
         listItem.push(fisrtItem);
         console.log(`  ~ error run`, error);
         // res.send("LongTime");
      }
   }, timeDelayReq);

   res.send("test");
   // return;
});

module.exports = { runRouter };
