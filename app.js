// const electron = require("electron");
// const ElectronConfig = require("electron-config");
// const config = new ElectronConfig();
// const path = require("path");
// const fs = require("fs-extra");
const discover = require("./functions/discover");
const portscan = require("./functions/portscan");
const ping = require("./functions/ping");

// discover()
// .then(array => {
//     console.log(array);
// })
// .catch(error => console.error(error));

// portscan("192.168.0.1")
// .then(result => {
//     console.log(result);
// })
// .catch(error => console.error(error));

ping.start("192.168.0.1");
ping.on("ping", result => {
    console.log(result);
})
ping.once("error", error => {
    console.error(error);
})

process.on("uncaughtException", (error) => {
    console.trace(new Error(error));
});

setTimeout(() => {
    ping.stop();
    console.log("STOPPED TIMEOUT");
}, 3000);