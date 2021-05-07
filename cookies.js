const { chromium } = require("playwright");
const fs = require("fs");

async function getCookies() {
    const browser = await chromium.launch({ args: ["--no-sandbox"] });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.route("**/*", (route) => {
        if (route.request().resourceType() === "stylesheet" || 
            route.request().resourceType() === "image" || 
            route.request().resourceType() === "script") {
                route.abort();
            }
        else route.continue();
    })

    await page.goto(`https://finance.yahoo.com/`);
    await page.waitForSelector("button[type=submit]");
    await page.click("button[type=submit]");

    const storage = await context.storageState();
    const cookieJSON = JSON.stringify(storage);
    fs.writeFileSync("cookies.json", cookieJSON);

    await browser.close();
}

module.exports = getCookies;
