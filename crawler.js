const router = require("express").Router();
const { chromium } = require("playwright");
const fs = require("fs");
const cookies = require("./cookies.js");

const namePATH = "#quote-header-info > div.Mt\\(15px\\) > div.D\\(ib\\).Mt\\(-5px\\).Mend\\(20px\\).Maw\\(56\\%\\)--tab768.Maw\\(52\\%\\).Ov\\(h\\).smartphone_Maw\\(85\\%\\).smartphone_Mend\\(0px\\) > div.D\\(ib\\) > h1";
const dataPATH = "#quote-header-info > div.My\\(6px\\).Pos\\(r\\).smartphone_Mt\\(6px\\) > div.D\\(ib\\).Va\\(m\\).Maw\\(65\\%\\).Ov\\(h\\) > div > span.Trsdu\\(0\\.3s\\).Fw\\(b\\).Fz\\(36px\\).Mb\\(-4px\\).D\\(ib\\)";

router.route("/stock/:ticker").get(async (req, res) => {
    console.time("Time");

    const ticker = req.ticker;

    let storageState = null;

    try {
        const storage = fs.readFileSync("cookies.json");
        storageState = JSON.parse(storage);
    } catch(err) {
        console.log(err);

        await cookies();

        const storage = fs.readFileSync("cookies.json");
        storageState = JSON.parse(storage);
    }

    const browser = await chromium.launch({ args: ["--no-sandbox"] });
    const context = await browser.newContext({ storageState });
    const page = await context.newPage();

    await page.route("**/*", (route) => {
        if (route.request().resourceType() === "stylesheet" || 
            route.request().resourceType() === "image" || 
            route.request().resourceType() === "script") {
                route.abort();
            }
        else route.continue();
    })

    try {
        await page.goto(`https://finance.yahoo.com/quote/${ticker}?p=${ticker}`);
        const price = await page.$eval(dataPATH, el => el.textContent);
        const name = await page.$eval(namePATH, el => el.textContent);
        
        res.send({ticker, name, price});
    } catch(err) {
        console.log(err);
        res.send(err); 
    }

    await browser.close();
    console.timeEnd("Time");
});

router.param("ticker", (req, res, next, ticker) => {
    req.ticker = ticker.toUpperCase();
    next();
});

module.exports = router;