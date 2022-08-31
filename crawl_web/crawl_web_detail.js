const puppeteer = require("puppeteer");
const fs = require("fs");
const { readFileBacklog, writeFileDetail, writeFileBacklog, readFileDetail } = require("./common");

const crawlWebDetail = async () => {
   const browser = await puppeteer.launch({
      // headless: "chrome",
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
   });
   // const timeIdPageDetail = setInterval(async () => {
   const listPage = await readFileBacklog();
   const { url_page_detail, is_page, id_post, page_number, replices_post } = JSON.parse(listPage)[5];

   const pageChild = await browser.newPage();
   await pageChild.goto("https://voz.vn" + url_page_detail);

   const articlesChild = await pageChild.evaluate(() => {
      const comment = document.querySelectorAll(".bbWrapper");
      const orderComment = document.querySelectorAll(".message-attribution-opposite.message-attribution-opposite--list");
      const listComment = [...comment].map((element, index) => {
         return { comment: element.innerText, order_comment: orderComment[index].innerText };
      });
      return listComment;
      // articlesChild=[...articlesChild,listComment]
   });

   // const data= JSON.parse(await readFileDetail())
   // console.log('aa',data[id_post]);
   // await writeFileDetail({ id: id_post, url_page_detail, page_number, replices_post, [`page_${is_page}`]: articlesChild }, id_post);
   await writeFileDetail(
      {
         [id_post]: { url_page_detail, page_number, replices_post, [`page_${is_page}`]: articlesChild },
      },
      id_post
   );

   // }, 1500);

   // console.log(`  ~ articlesChild`, articlesChild)

   // console.log(`  ~ articlesChild`, articlesChild[2]);
   // return articlesChild;

   await browser.close();
};

module.exports = { crawlWebDetail };
