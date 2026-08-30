import { chromium, devices } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const iPhone = devices['iPhone 13'];
  const context = await browser.newContext({
    ...iPhone,
    hasTouch: true,
    isMobile: true,
  });
  
  const page = await context.newPage();
  await page.goto('http://localhost:5173');
  
  // Wait for the page to be somewhat loaded
  await page.waitForTimeout(2000);
  
  let scrollY = await page.evaluate(() => window.scrollY);
  console.log('Initial scrollY:', scrollY);
  
  // Simulate swipe up (scroll down) via real touch events
  await page.evaluate(() => {
    const el = document.elementFromPoint(200, 600) || document.body;
    const touchObj = new Touch({
      identifier: Date.now(),
      target: el,
      clientX: 200,
      clientY: 600,
      radiusX: 2.5,
      radiusY: 2.5,
      rotationAngle: 10,
      force: 0.5,
    });
    
    el.dispatchEvent(new TouchEvent('touchstart', {
      touches: [touchObj],
      targetTouches: [touchObj],
      changedTouches: [touchObj],
      bubbles: true,
      cancelable: true
    }));
    
    // move up
    let y = 600;
    const move = setInterval(() => {
      y -= 20;
      const moveTouch = new Touch({
        identifier: touchObj.identifier,
        target: el,
        clientX: 200,
        clientY: y,
        radiusX: 2.5,
        radiusY: 2.5,
        rotationAngle: 10,
        force: 0.5,
      });
      el.dispatchEvent(new TouchEvent('touchmove', {
        touches: [moveTouch],
        targetTouches: [moveTouch],
        changedTouches: [moveTouch],
        bubbles: true,
        cancelable: true
      }));
      if (y <= 100) {
        clearInterval(move);
        el.dispatchEvent(new TouchEvent('touchend', {
          touches: [],
          targetTouches: [],
          changedTouches: [moveTouch],
          bubbles: true,
          cancelable: true
        }));
      }
    }, 10);
  });
  
  await page.waitForTimeout(1000);
  
  scrollY = await page.evaluate(() => window.scrollY);
  console.log('After touch swipe scrollY:', scrollY);
  
  // Also try mouse wheel to see if it's completely locked or just touch
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(1000);
  
  scrollY = await page.evaluate(() => window.scrollY);
  console.log('After wheel scrollY:', scrollY);
  
  await browser.close();
})();
