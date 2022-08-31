const { async } = require("@firebase/util");
const fs = require("fs");
const path = require("path");

const writeFileBacklog = async (data) => {
   try {
      const dataOld = await readFileBacklog();
      await fs.promises.writeFile(
         path.resolve(__dirname, "backlog.json"),
         JSON.stringify([
            ...JSON.parse(dataOld),
            ...data
               .slice(3)
               .map(({ page_number, url_post, id_post, replices_post }) => {
                  let list_url = [];
                  for (let i = 1; i <= page_number; i++) {
                     list_url = [...list_url, { url_page_detail: url_post + "page-" + i, page_number, id_post, replices_post, is_page: i }];
                  }

                  return list_url;
               })
               .flat(),
         ])
      );
      //   const readFile=await readFileBacklog()
      //   const dataTest=JSON.parse(readFile).filter(({ id_post }) => id_post === "590253")
      //   await fs.promises.writeFile(
      //      path.resolve(__dirname, "test.json"),
      //      JSON.stringify(dataTest)
      //   );
   } catch (error) {
      console.log("ERROR writeFileBacklog: ", error);
   }
};
const readFileBacklog = async () => {
   try {
      return await fs.promises.readFile(path.resolve(__dirname, "backlog.json"));
   } catch (error) {
      console.log("ERROR readFileBacklog: ", error);
   }
};
const writeFileDetail = async (data, id_post) => {
   try {
      const oldData = JSON.parse(await readFileDetail());
      const { url_page_detail, is_page, page_number, replices_post } = data;
      // console.log(`  ~ oldData`, oldData);
      //   console.log(`  ~ data`, data)
      const {
         url_page_detail: url_page_detail_oldData,
         is_page: is_page_oldData,
         id_post: id_post_oldData,
         page_number: page_number_oldData,
         replices_post: replices_post_oldData,
      } = oldData;

      // let item = oldData.find(({ id }) => id === id_post);
      // item={...item,...data}
      // console.log(`  ~ item`, item);
      // const itemIndex = oldData.findIndex(({ id }) => id === id_post);
      // console.log(`  ~ itemIndex`, itemIndex);
      await fs.promises.writeFile(
         path.resolve(__dirname, "dataDetail.json"),
         // JSON.stringify([data])
         JSON.stringify({ ...oldData, [id_post]: { ...oldData[id_post], ...data[id_post] } })
      );
   } catch (error) {
      console.log("ERROR writeFileDetail_append: ", error);
   }
};

const readFileDetail = async () => {
   try {
      return await fs.promises.readFile(path.resolve(__dirname, "dataDetail.json"));
   } catch (error) {
      console.log("ERROR writeFileDetail_append: ", error);
   }
};

const writeFileDone = async () => {
   try {
      await fs.promises.writeFile(path.resolve(__dirname, "done.json"), JSON.stringify([data]));
   } catch (error) {
      console.log("ERROR writeFileDone: ", error);
   }
};

const readFileDone = async () => {
   try {
      await fs.promises.readFile(path.resolve(__dirname, "done.json"));
   } catch (error) {
      console.log("ERROR writeFileDone: ", error);
   }
};

module.exports = { writeFileBacklog, writeFileDetail, readFileBacklog, readFileDetail };
