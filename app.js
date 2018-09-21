// const electron = require("electron");
// const ElectronConfig = require("electron-config");
// const config = new ElectronConfig();
// const path = require("path");
// const fs = require("fs-extra");
const discover = require("./functions/discover");
// const portscan = require("./functions/portscan");

discover()
.then(array => {
    console.log(array);
})
.catch(error => console.error(error));

process.on("uncaughtException", (error) => {
    console.trace(new Error(error));
});