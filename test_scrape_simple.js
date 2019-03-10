//import the package into this file to use its methods
const puppeteer = require('puppeteer');

//i hate using promises when not needed so async/await is ES2017
//makes it really easy to handle any asynchronos code
async function getPic() {
    //launch an instance of chrome browser with puppeteer and set it to the variable 'browser'
    const browser = await puppeteer.launch();
    //opens a new page in the browser and set it to the variable 'page'
    const page = await browser.newPage();
    //tells our page to navigate to a url
    await page.goto('https://google.com');
    //takes a screenshot of our current page
    await page.screenshot({ path: 'google.png'});
    //close down the browser
    await browser.close();
};

//runs the function!
getPic();