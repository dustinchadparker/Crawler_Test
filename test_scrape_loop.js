const puppeteer = require("puppeteer");
let fs = require("fs");

let pageStartNum = 0; //page to start on
const PAGES_TO_MINE = 2; //pages to mine
let loggedIn = false;

//this creates data.json and makes it empty from last run
fs.writeFile("./data.json", "", function(err) {
  if (err) {
    return console.log(err);
  }
});

let scrape = async pageStartNum => {
  let pageStartNums = pageStartNum;

  //launches a new browser window
  const browser = await puppeteer.launch({
    headless: false
  });
  let stringData = "";

  const page = await browser.newPage(); //creates new page
  //checks to see if user is logged in
  if (!loggedIn) {
    await page.goto("https://forum.median-xl.com/ucp.php?mode=login", {
      waitUntil: "domcontentloaded"
    });
    //LOGS IN with username/password
    await page.type("#username", "USERNAMEHERE", { delay: 10 });
    await page.type("#password", "PASSWORDHERE", { delay: 10 });
    page.click("input.button1");
    this.loggedIn = true;
  }

  await page.waitForNavigation({ waitUntil: "domcontentloaded" });

  //loops through pages
  while (pageStartNums < PAGES_TO_MINE) {
    //navigates to page and waits for DOMContent
    await page.goto(
      `https://forum.median-xl.com/tradegold.php?sort_id=0&start=${pageStartNums *
        25}`,
      {
        waitUntil: "domcontentloaded"
      }
    );
    //wait time just in case. 1 second seems to be enough. Uncomment if program fails
    // await page.waitFor(1000);

    //gets all prices
    let price = await page.$$eval("div.coins.coins-embed", el =>
      el.map(i => i.innerText)
    );

    //gets all comments
    let comment = await page.$$eval("tr > td:nth-last-of-type(2)", el =>
      el.map(i => i.innerText)
    );

    let time = await page.$$eval(
      "td:nth-child(5)",
      el => el.map(i => i.innerText)
    );

    //Will cycle through arrays of data and store in stringData
    for (let i = 0; i < price.length; i++) {
      stringData +=
        "\n\n" +
        i +
        ":::" +
        "\n" +
        "Coins: " +
        price[i] +
        "\n" +
        "Comment: " +
        comment[i] +
        "\n" +
        "Time: " +
        time[i];
    }

    pageStartNums++;
  }

  //closes page; change page to 'browser' if you want it to close browser when done
  browser.close();
  return stringData;
};

//calls the scrape function and passes in pageStart
scrape(pageStartNum).then(value => {
  fs.appendFile("./data.json", value, function(err) {
    if (err) {
      return console.log(err);
    }
  });
});
