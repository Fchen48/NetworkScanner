// const electron = require("electron");
// const ElectronConfig = require("electron-config");
// const config = new ElectronConfig();
const path = require("path");
const fs = require("fs-extra");
const spawn = require("child_process");

const options = {
    encoding: "utf8",
    nmap: path.join(__dirname, "bin/nmap_bin/nmap.exe"),
    range: [
        "192.168.0.1/28"
    ],
    // timeout: 1,
    verbose: false
};

// const ping = spawn.exec(options.nmap + " -V", options, (error, stdout, stderr) => {
//     if(error) return console.error(error);
// });

// ping.stdout.on("data", data => {
//     console.log(data);
// })

// ping.on("close", code => {
//     console.log("Exitcode: " + code);
// })