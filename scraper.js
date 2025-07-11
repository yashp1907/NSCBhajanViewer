const puppeteer = require('puppeteer');


async function scrapeData(url) {

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage()
    await page.goto(url);


    const [searchInput] = await page.$$('xpath/.//*[@id="___gcse_0"]/div/div/form/table/tbody/tr/td[1]');
    const [searchButton] = await page.$$('xpath/.//*[@id="___gcse_0"]/div/div/form/table/tbody/tr/td[2]/button')

    // Check if the elements weren't found
    if (!searchButton) {
        console.log("Element not found");
        await browser.close();
        return;
    }

    console.log("Element found");
    const text = await page.evaluate(el => el.textContent, searchButton); 
    console.log(text);


    // Fill the search input and click the search button
    await searchInput.click();
    await page.locator('input').fill("hari bin koi");
    await searchButton.click();

    // Wait for the results to load
    await page.waitForSelector('#___gcse_0 > div > div > div > div.gsc-wrapper', { timeout: 5000 });




    //Getting FIRST result
    // Wait for the first search result to appear in the main page
    await page.waitForSelector('.gsc-webResult.gsc-result a.gs-title', { timeout: 5000 });

    // Get the first result element thing
    const firstResult = await page.$('.gsc-webResult.gsc-result a.gs-title');

    if (!firstResult) {
        console.log("First result not found");
        await browser.close();
        return;
    }

    console.log("First result found");
    await firstResult.click();
    
    //await browser.close();
}

scrapeData("https://www.anirdesh.com/kirtan/kirtan-index.php")