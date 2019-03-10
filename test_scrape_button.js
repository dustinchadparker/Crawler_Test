const puppeteer = require('puppeteer');
//same general layout as test_scrape_simple with a few changes
let scrape = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    //this will go to the specified url and waits until its loaded to the dom before moving on
    await page.goto('http://books.toscrape.com/', { waitUntil: 'domcontentloaded' });

    //i navigated to the first book on http://books.toscrape.com/
    //opened chrome dev tools, selected the image of the first book 'a light in the attic'
    //and found it in the html in the chrome dev tool.  right click the element
    //select copy from the menu, and copy the selector which is what this giant string is
    await page.click('#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a > img');

    //it navigates to the next page and we run another function on that page
    const result = await page.evaluate(() => {
        //the title in the page is sitting in a <h1>
        //so i grab the text in that element
        let title = document.querySelector('h1').innerText;
        //the price has a <p> element with a class of price_color
        //so i select the text in the element with that class
        let price = document.querySelector('.price_color').innerText;
        //the function returns an object with the title and price using some ES6 syntax
        //it is the same as writing:
        //return { 
        // title: title,
        // price: price
        //}
        return {
            title,
            price
        }
    });

    browser.close();
    return result;
};

//run the function we made and then log its value into the console
scrape().then((value) => {
    console.log(value);
});

////*[@id="default"]/div/div/div/div/section/div[2]/ol/li[1]/article/div[1]/a/img