const fs = require('fs');
const CDP = require('chrome-remote-interface');
const argv = require('minimist')(process.argv.slice(2));

const { url } = argv;
const outputDir = process.env.OUT_DIR || '.';
const devices = [{
    name: 'desktop',
    metrics: {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 0,
      mobile: false,
      fitWindow: false,
    },
  }, {
    name: 'tablet',
    metrics: {
      width: 768,
      height: 1024,
      deviceScaleFactor: 0,
      mobile: false,
      fitWindow: false,
    },
  }, {
    name: 'mobile',
    metrics: {
      width: 320,
      height: 568,
      deviceScaleFactor: 0,
      mobile: true,
      fitWindow: false,
    },
}];

CDP(async (client) => {
  const { Network, Page, DOM, Emulation, Runtime } = client;

  await Promise.all([
    Network.enable(),
    Page.enable(),
    DOM.enable(),
  ]);

  Page.navigate({ url });

  Page.loadEventFired(async () => {
    for (let d of devices) {
      const { result: { value } } = await Runtime.evaluate({ expression: 'document.body.offsetHeight'});

      await Promise.all([
        Emulation.setDeviceMetricsOverride(d.metrics),
        Emulation.setVisibleSize({ width: d.metrics.width, height: value }),
        Emulation.forceViewport({x: 0, y: 0, scale: 1}),
      ]);

      const screenshot = await Page.captureScreenshot({ format: 'jpeg' });
      const buf = Buffer.from(screenshot.data, 'base64');

      fs.writeFile(`${outputDir}/${d.name}.jpeg`, buf, 'base64', err => err && console.log(err));
    }

    client.close();
  });
});
