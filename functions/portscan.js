const path = require("path");
const spawn = require("child_process");
const parseXML = require("xml2js").parseString;

const cOptions = {
    encoding: "utf8",
    // timeout: 30000,
    windowsHide: true
};

const scan = {
    nmap: path.join(__dirname, "..", "bin", "nmap_bin", "nmap.exe"),
    unprivileged: "",
    verbose: " -v",
    scanType: " -F",
    output: " -oX -",
    command() {return this.nmap + this.verbose + this.unprivileged + this.scanType + this.output + " ";}
}

module.exports = (ip) => new Promise(function (resolve, reject) {
    portscan(ip)
    .then(result => resolve(result))
    .catch(error => reject(error));
});

function portscan(ip) {
    return new Promise(function (resolve, reject) {
        clock.start();
        spawn.exec(scan.command() + ip, cOptions, (error, data) => {
            if(error) return reject(error);
            parseXML(data, { trim: true }, (error, result) => {
                if(error) return reject(error);
                clock.stop();
                const ports = result.nmaprun.host[0].ports[0].port;
                const array = [];
                ports.forEach(port => {
                    array.push({
                        port: port.$.portid,
                        protocol: port.$.protocol,
                        service: port.service[0].$.name
                    })
                    // console.log(port.service[0].$)
                });
                return resolve(array);
            });
        });
    });
}

const clock = {
    start() {
        setTimeout(() => {
            if(!this.active) return;
            console.log("Time passed: " + this.timePassed);
            this.timePassed++;
            this.start();
        }, 1000);
    },
    stop() {
        this.active = false;
    },
    active: true,
    timePassed: 1
}