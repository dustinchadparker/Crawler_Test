const puppeteer = require("puppeteer");
let price = [];
let comment = [];

let data = [];
let length = 0;
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
  await page.type("#username", "username   ", { delay: 10 });
  await page.type("#password", "passwordhere", { delay: 10 });
  await page.click("input.button1");

  let pageInc = 0;

  //This will be ~2000, 3 for now just for debugging
  while (pageInc < 3) {
    const result = await page.evaluate(() => {
      page.goto(
        `https://forum.median-xl.com/tradegold.php?sort_id=0&start=${pageInc *
          25}`,
        {
          waitUntil: "domcontentloaded"
        }
      );

      //with this commented I get a "PAGE IS NOT DEFINED"
      //and with it active I get "Execution context was destroyed, most likely because of a navigation."
      page.waitForNavigation();

      //Will cycle through length of data
      length = document.querySelectorAll(".bg1").length();

      for (i = 0; i < length; i++) {
        price += document.querySelectorAll(":scope div.coins.coins-embed")[i];

        comment += document.querySelectorAll(
          ":scope tr > td:nth-last-of-type(2)"
        )[i];
      }
      //gets all prices and comments on the page - store in array
      data.push({
        price,
        comment
      });

      pageInc++;

      //reset for next page
      price = [];
      comment = [];
    });
    pageInc++;

    return result;
  }

  browser.close();
};

scrape().then(value => {
  console.log(value);
});
