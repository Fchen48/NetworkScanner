const path = require("path");
const spawn = require("child_process");
const parseXML = require("xml2js").parseString;
const network = require("./network");

const cOptions = {
    encoding: "utf8",
    // timeout: 30000,
    windowsHide: true
};

const scan = {
    nmap: path.join(__dirname, "..", "bin", "nmap_bin", "nmap.exe"),
    unprivileged: " --unprivileged",
    verbose: " -v",
    scanType: " -sn",
    output: " -oX -",
    command() {return this.nmap + this.verbose + this.unprivileged + this.scanType + this.output + " ";}
}

module.exports = () => new Promise(function (resolve, reject) {
    const hosts = [];

    network()
    .then((ipv4, ipv6) => {
        // const cidr = "192.168.0.10/24"
        let cidr = "";

        ipv4.forEach(element => {
            cidr += element + " ";
        });

        discover(cidr)
        .then(result => {
            if(result) {
                result.forEach(host => {
                    hosts.push(host);
                });
            }
            return resolve(hosts);
        })
        .catch(error => reject(error));
    })
    .catch(error => reject(error));
});

// eslint-disable-next-line id-length
function compareIP(a, b) {
    return a.address[0].$.addr.split(".").slice(3)[0] - b.address[0].$.addr.split(".").slice(3)[0];
}

function discover(cidr) {
    return new Promise(function (resolve, reject) {
        clock.start();
        spawn.exec(scan.command() + cidr, cOptions, (error, data) => {
            if(error) return reject(error);
            parseXML(data, { trim: true }, (error, result) => {
                if(error) return reject(error);
                if(!result.nmaprun.host) return resolve(undefined);
                const hosts = result.nmaprun.host;

                const online = hosts.filter(host => host.status[0].$.state == "up");
                online.sort(compareIP);

                const array = [];
                online.forEach(host => {
                    let hostname, ip, mac, vendor;
                    if(host.address[0]) {
                        ip = host.address[0].$.addr;
                    }
                    if(host.address[1]) {
                        mac = host.address[1].$.addr;
                        vendor = host.address[1].$.vendor;
                    }
                    if(host.hostnames[0] !== "\r\n") {
                        hostname = host.hostnames[0].hostname[0].$.name;
                    }
                    console.log(JSON.stringify(host));

                    array.push({
                        ip,
                        mac,
                        vendor,
                        hostname
                    });
                });
                clock.stop();
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