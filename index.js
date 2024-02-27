const { request } = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");



(async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: false, userDataDir: "./tmp" });
    const page = await browser.newPage();

    // Set the viewport to 1366 x 768
    await page.setViewport({ width: 1366, height: 768 });

    await page.goto("https://www.hokben.co.id/menu");

    const productHandles = await page.$$(".tab-pane > .row > .col-12");

    let items = [];

    for (const productHandle of productHandles) {
        try {
            let image = await page.evaluate((el) => el.querySelector(".row > .col-12 > .card > .card-body > img").getAttribute("src"), productHandle);
            let title = await page.evaluate((el) => el.querySelector(".row > .col-12 > .card > .card-body > p.card-title.mt-3.mb-0").innerHTML.trim(), productHandle);
            let price = await page.evaluate(
                (el) => el.querySelector(".row > .col-12 > .card > .card-body > p.card-text.text-hokben-red.my-3").textContent.trim().replace("Rp. ", "").replace(".", ""),
                productHandle
            );

            // push to items
            items.push({ image, title, price: parseInt(price) });
        } catch (error) {
            console.error(error);
        }
    }

    // save json as file
    const fs = require("fs");
    fs.writeFileSync("hokben.json", JSON.stringify(items, null, 2));

    await browser.close();
})();
