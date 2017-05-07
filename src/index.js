const fs = require('fs');
const CDP = require('chrome-remote-interface');
const argv = require('minimist')(process.argv.slice(2));
const devices = require('./devices');

const { url } = argv;
const outputDir = process.env.OUT_DIR || '.';

if (!url) {
  throw new Error('url parameter is required');
}

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
