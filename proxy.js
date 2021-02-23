const portfinder = require('portfinder');
const ParcelProxyServer = require("parcel-proxy-server");
// configure the proxy server
const server = new ParcelProxyServer({
  entryPoint: "./index.html",
  proxies: {
    // add proxies here
    "/api": {
      target: "https://qyapi.weixin.qq.com",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "",
      },
    },
  },
});

portfinder.getPort({
  port: 1234,    // minimum port
  stopPort: 3333 // maximum port.., 
}, (err, port) => {
  if (err) throw err
  // start up the server
  server.listen(port, () => {
    console.log(`start on http://localhost:${port}/`);
   
  });

});
