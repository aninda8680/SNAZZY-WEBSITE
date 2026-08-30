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
  await page.waitForTimeout(2000);
  
  const getStyles = async (selector) => {
    return await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const computed = window.getComputedStyle(el);
      return {
        overflow: computed.overflow,
        'overflow-x': computed.overflowX,
        'overflow-y': computed.overflowY,
        'touch-action': computed.touchAction,
        height: computed.height,
        position: computed.position,
        transform: computed.transform
      };
    }, selector);
  };
  
  console.log('HTML:', await getStyles('html'));
  console.log('BODY:', await getStyles('body'));
  console.log('#ROOT:', await getStyles('#root'));
  
  await browser.close();
})();
