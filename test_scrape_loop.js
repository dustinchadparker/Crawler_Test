const puppeteer = require("puppeteer");
let fs = require("fs");
let allData = "";

let scrape = async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();

  //goes to main page
  await page.goto(
    "https://forum.median-xl.com/tradegold.php?sort_id=0&start=0",
    { waitUntil: "domcontentloaded" }
  );

  //clicks the LOGIN button
  await page.click("#nav-main > li:nth-child(2)", {
    waitUntil: "domcontentloaded"
  });

  //LOGS IN with username/password
  await page.type("#username", "name", { delay: 10 });
  await page.type("#password", "pass", { delay: 10 });
  page.click("input.button1");

  let howManyPages = -1;

  while (howManyPages < 2) {
    howManyPages++;
    console.log(howManyPages);
    await page.waitForNavigation({ waitUntil: "domcontentloaded" });

    //This will be ~2000, 3 for now just for debugging

    await page.goto(
      `https://forum.median-xl.com/tradegold.php?sort_id=0&start=${howManyPages *
        25}`,
      {
        waitUntil: "domcontentloaded"
      }
    );

    const result = await page.evaluate(() => {
      let stringData = "";

      let price = [];
      let comment = [];

      price = $("div.coins.coins-embed")
        .toArray()
        .map(function(i) {
          return i.innerText;
        });
      comment = $("tr > td:nth-last-of-type(2)")
        .toArray()
        .map(function(i) {
          return i.innerText.replace("Comment", "");
        });

      for (i = 0; i < price.length; i++) {
        stringData += "\n" + price[i] + " ::: " + comment[i];
      }

      this.allData += stringData;
      stringData = this.allData;

      //gets all prices and comments on the page - store in array
      return {
        stringData
      };
    });
  }

  return this.allData;
};

scrape().then(value => {
  fs.writeFile("./data.json", value.stringData, function(err) {
    if (err) {
      return console.log(err);
    }
  });

  console.log(value.stringData);
});
