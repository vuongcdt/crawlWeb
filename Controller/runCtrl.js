const { default: axios } = require("axios");
const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
// const dataAll = require("../dataCrawl/data.json");
const urlParse = require("url");
const { readFile } = require("node:fs/promises");
const { writeFile } = require("node:fs/promises");
 
let data = [];
let count = 0;
let timeInterval = 0; 
let countPageAwait = 0;
let countError = 0;
const timeStart = new Date().toLocaleTimeString();
console.log(`  ~ timeStart`, timeStart);
const crawlListUrlProduct = async (url, browser, categories) => {
   // const url = "https://www2.hm.com/en_gb/women/products/dresses.html";

   let countDelay = 1;
   const timeDelayReq = 1000;
   const timeSuccsessReq = 5 * 1000;

   const page = await browser.newPage();

   await page.goto(url);

   try {
      const articles = await page.evaluate(() => {
         document.getElementById("image-stillLife").click();
         const listUrl = document.querySelectorAll(".image-container >a");
         const dataBackImg = [...listUrl].map((url) => ({ url: url.href, back_image: { src: url.querySelector("img").src } }));

         document.getElementById("image-model").click();
         const dataFrontImg = [...listUrl].map((url) => ({ url: url.href, front_image: { src: url.querySelector("img").src } }));

         return dataFrontImg.map((item, index) => ({ ...item, ...dataBackImg[index] }));
      });
      await page.close();
      articles.map(item=>item.categories=categories)
      return articles;
   } catch (error) {
      console.log(`  ~ error 2`, error);
      await page.close();
      throw new Error("loi");
   }

   // console.log(`  ~ articles`, articles)
   // articles.splice(3);
   // console.log(`  ~ articles.length`, articles.length);
   timeInterval = setInterval(async () => {
      if (articles.length === 0 && countDelay % 5 === 0) {
         timeInterval._repeat = 5 * 1000;
         setTimeout(async () => {
            clearInterval(timeInterval);
            await browser.close();
            // console.log(`  ~ data`, data);
            try {
               const dataAll = JSON.parse(await fs.promises.readFile(path.resolve(__dirname, "../dataCrawl/data.json")));
               console.log(`  ~ dataAll.length`, dataAll.length);
               dataAll.push(...data);
               console.log(`  ~ dataAll.length`, dataAll.length);
               await fs.promises.writeFile(path.resolve(__dirname, "../dataCrawl/data.json"), JSON.stringify(dataAll));
               // console.log(`  ~ data.length end`, data.length);
               return;
            } catch (error) {
               console.log(`  ~ error FS`, error);
               return;
            }
         }, timeSuccsessReq);
         return;
      }
      if (articles.length === 0) {
         countDelay++;
         return;
      }
      const dataFisrt = articles.shift();
      console.log(`articles.length: `, articles.length);
      try {
         count++;
         const dataDetail = await crawlProductDetailCtrl({ url: dataFisrt.url, browser, categories });
         data.push({ ...dataFisrt, ...dataDetail });
         console.log(`  ~ data.length: `, data.length, " count: ", count);
      } catch (error) {
         console.log(`  ~## error`, error, "count", count);
         articles.push(dataFisrt);
      }
   }, timeDelayReq);
};
const crawlProductDetailByListUrlCtrl = async (articles) => {
   // console.log(`  ~ articles`, articles.length)
   // return 
   let countDelay = 1;
   const timeDelayReq = 800;
   const timeSuccsessReq = 5 * 1000;
   const browser = await puppeteer.launch({
      // headless: "chrome",
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1920,1080"],
      defaultViewport: null,
   });
   // const page = await browser.newPage();
   // await page.goto(url);

   // console.log(`  ~ articles`, articles) 
   //   const articles=dataAllLink.splice(3); 
   //    console.log(`  ~ articles.length`, articles.length);
   timeInterval = setInterval(async () => {  
      if (countPageAwait > 5) return;
      if (articles.length < countError && countDelay >2) {
         console.log("END!!!!!!!!!!"); 
         timeInterval._repeat = 5 * 1000;
         setTimeout(async () => {
            clearInterval(timeInterval);
            await browser.close();
            try {
               // const dataAll = JSON.parse(await readFile(path.resolve(__dirname, "../dataCrawl/data.json")));
               // dataAll.push(...data);
               const timeEnd = new Date().toLocaleTimeString();
               console.log(`  ~ data`, data);
               // await writeFile(path.resolve(__dirname, "../dataCrawl/data.json"), JSON.stringify(dataAll));
               await writeFile(path.resolve(__dirname, "../dataCrawl/data.json"), JSON.stringify(data));
               console.log("timeStart", timeStart);
               console.log(`timeEnd`, timeEnd);
               // console.log(`  ~ data.length end`, data.length);
               return;
            } catch (error) {
               console.log(`  ~ error FS`, error);  
               return;
            }
         }, timeSuccsessReq);
         return;
      }
      if (articles.length < countError) {
         // countError = articles.length ? articles.length + countPageAwait : 0;
         countError = 0;
         countDelay++;
         return;
      }
      const dataFisrt = articles.shift();
      console.log(
         `articles.length: `,
         articles.length,
         "-dataLength ",
         data.length,
         "-countPageAwait ",
         countPageAwait,
         "-countErr ",
         countError,
         "-",
         timeStart,
         "countDelay",
         countDelay
      );
      try { 
         count++;
         countPageAwait++;
         const dataDetail = await crawlProductDetailCtrl({ url: dataFisrt.url, browser,categories:dataFisrt.categories });
         countPageAwait--;
         data.push({ ...dataFisrt, ...dataDetail });
      } catch (error) {
         countError++;
         articles.push(dataFisrt);
         countPageAwait--
      }
   }, timeDelayReq);
};

const crawlProductDetailCtrl = async ({ url, browser, categories }) => {
   // const url = "https://voz.vn/f/diem-bao.33/";
   // const url = "https://www2.hm.com/en_gb/productpage.1088102008.html";

   // const browser = await puppeteer.launch({
   //    // headless: "chrome",
   //    headless: false,
   //    args: ["--no-sandbox", "--disable-setuid-sandbox"],
   // });
   const page = await browser.newPage();
   await page.goto(url);

   try {
      const articles = await page.evaluate(() => {
         const listImage = document.querySelectorAll(".product-detail-thumbnail-image");
         const front_image = document.querySelector(".product-detail-main-image-container > img");
         const id = document.querySelector(".inner > hm-favourites-button").getAttribute("article-code");
         const name_product = document.querySelector("#js-product-name").innerText.trim();
         const price_product = document.querySelectorAll("#product-price > div > span");
         // const price_product = document.querySelector("#product-price > div").innerText.trim().slice(1);
         const colorName = document.querySelector(".product-input-label");
         const listColor = document.querySelectorAll(".group > .list-item > a");
         const reviewSku = document.querySelector("#reviews-trigger > .wc-turn-to-reviews-button").getAttribute("sku");
         const [regular_price, price] = [...price_product].map((item) => +item.innerText.trim().slice(1));
         const discount =
            document.querySelector("#product-price > div > div") && +document.querySelector("#product-price > div > div").innerText.slice(1, -1);
         return {
            id,
            reviewSku,
            name: name_product,
            price: price || regular_price,
            discount,
            regular_price,
            color: [...listColor]
               .map((item) => ({
                  image: {
                     id: item.getAttribute("data-articlecode"),
                     src: item.querySelector("img").src,

                     alt: item.querySelector("img").alt,
                  },
                  name: item.querySelector("img").alt,
               }))
               .filter((img) => img.image.id === id),

            images: [
               { src: front_image.src },
               ...[...listImage].map((img) => ({
                  src: img.src,
               })),
            ],
            imageColor: [...listColor].map((item) => ({
               link: item.href,
               id: item.getAttribute("data-articlecode"),
               src: item.querySelector("img").src,
               alt: item.querySelector("img").alt,
            })),
         };
      });
      // try {
      //    const review = await axios.get(
      //       "https://www2.hm.com/en_gb/reviews/rrs/reviews?sort=textLength%3Adesc&filter=&limit=30&offset=0&includeFilters=true&includeRelated=true&suppressUserPII=true&sku=" +
      //          articles.reviewSku,
      //       { headers: { "Content-Type": "application/json; charset=utf-8" } } 
      //    );
      //    review.data.reviews.map((item) => (item.idProduct = articles.id));
      //    articles.reviews = review.data.reviews;
      //    articles.reviewsLength = review.data.reviews.length;
      // } catch (error) { 
      //    console.log(`  ~ error review`, error.message);
      //    await page.close();
      //    throw new Error("err Review");
      //    articles.reviews = [];
      // }
      articles.categories = categories.map((category) => ({ name: category }));
      articles.stock_quantity = 10 * Math.round(10 * Math.random()) || 1;
      const listBrand = ["Allen Solly", "Louis Philippe", "HRX", `H&M`, "Puma", "Fila", "Louis Philippe Sport", "Nike", "Zara"];
      articles.brand = { name: listBrand[Math.round((listBrand.length - 1) * Math.random())] };
      articles.on_sale = Boolean(articles.discount);
      await page.close();
      return articles;
   } catch (error) {
      await page.close();
      throw new Error(error);
   }
};

module.exports = { crawlProductDetailCtrl, crawlListUrlProduct, crawlProductDetailByListUrlCtrl };
// document.getElementById('image-model').click()
// document.getElementById('image-stillLife').click()
