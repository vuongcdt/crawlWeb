const express = require("express");
const { saveDataFirebase } = require("../Modal/firebase_data");
const puppeteer = require("puppeteer");
const { db } = require("../Modal/mongodb_data");
const { async } = require("@firebase/util");
const fs = require("fs");
const path = require("path");
const { writeFileBacklog } = require("./common");

const diemBaoRouter = express.Router();
let pause = 0;

const crawlWeb = async () => {
   if (pause === 1) {
      clearInterval(timeId);
      pause = 0;
      return;
   }
   const browser = await puppeteer.launch({
      // headless: "chrome",
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
   });
   const page = await browser.newPage(); 
   await page.goto("https://voz.vn/f/diem-bao.33/");
   const articles = await page.evaluate(() => {
      let titleLinks = document.querySelectorAll(".structItem-title > a");
      let pageNumber = document.querySelectorAll(".structItem-minor > .structItem-pageJump");
      titleLinks = [...titleLinks];
      pageNumber = [...pageNumber];
      let articles = titleLinks.map((link, index) => {
         const replicesPost = +document.querySelectorAll(".pairs.pairs--justified >dd")[index * 2].innerText;
         return {
            title_post: link.innerText,
            url_post: link.getAttribute("href"),
            replices_post: replicesPost,
            id_post: link.getAttribute("href").replace(/.+\./, "").replace(/\//, ""),
            page_number: replicesPost % 20 ? -~(replicesPost / 20) : replicesPost / 20,
         };
      });
      return articles;
   });

   await writeFileBacklog(articles);
   await browser.close();  

};

module.exports = { crawlWeb };
