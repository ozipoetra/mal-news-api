const scrapeIt = require("./lib");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

//const page = request.params.page
app.get("/api/index/:page", async (request, response, next) => {
  try {
  await scrapeIt(`https://myanimelist-net.translate.goog/news?p=${request.params.page}&_x_tr_sl=en&_x_tr_tl=id&_x_tr_hl=id&_x_tr_pto=wapp`, {
  articles: {
    listItem: "div.news-list > div.news-unit.clearfix",
    data: {
      title: "p.title",
      url: {
        selector: "a",
        attr: "href",
        convert: x => x.split("/")[4].split("?")[0]
      },
      img: {
        selector: "img",
        attr: "src",
        convert: x => x.replace('/r/100x156','')
      },
      text: "div.text",
      date: {
        selector: "p.info.di-ib",
        convert: x => x.replace(/by (.*)/g,'')
      },
      tags: {
        listItem: "p.di-ib.tags > a"
      }
    }
  }
    
  }).then(async ({ data, status }) => {
    //await console.log(`Status Code: ${status}`)
    response.send(await data)
});
  } catch (err) {
    response.send({"status": "error", "message": "Backend error"})
  }
});