const puppeteer = require('puppeteer');

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Set mobile viewport
  await page.setViewport({ width: 412, height: 840, isMobile: true, hasTouch: true });
  
  console.log("Navigating to http://localhost:4200/study-notes/reactivity-rxjs ...");
  try {
    await page.goto('http://localhost:4200/study-notes/reactivity-rxjs', {
      waitUntil: 'networkidle0',
      timeout: 15000
    });
  } catch (e) {
    console.log("Navigation timeout or warning:", e.message);
  }
  
  console.log("Waiting 3s for animations and layout...");
  await new Promise(r => setTimeout(r, 3000));
  
  console.log("Scrolling to the bottom of the focus-overlay container...");
  await page.evaluate(() => {
    const overlay = document.querySelector('.focus-overlay');
    if (overlay) {
      overlay.scrollTop = overlay.scrollHeight;
    }
  });
  
  console.log("Waiting 1s for scroll...");
  await new Promise(r => setTimeout(r, 1000));
  
  console.log("Taking screenshot of the page...");
  await page.screenshot({
    path: 'C:\\Users\\AdityaPranav\\.gemini\\antigravity\\brain\\81cd1094-0885-44cf-8f94-a566d4331090\\scratch\\mobile_bottom.png'
  });
  console.log("Saved screenshot to scratch/mobile_bottom.png");
  
  await browser.close();
  console.log("Done!");
}

run().catch(err => {
  console.error("Execution failed:", err);
});
