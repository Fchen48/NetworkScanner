const path = require("path");
const spawn = require("child_process");
const parseXML = require("xml2js").parseString;
const network = require("./network");

const cOptions = {
    encoding: "utf8",
    timeout: 10000,
    windowsHide: true
};

const nOptions = {
    nmap: path.join(__dirname, "../bin/nmap_bin/nmap.exe"),
    verbose: " -v",
    scanType: " -sn",
    output: " -oX -",
    command() {return this.nmap + this.verbose + this.scanType + this.output + " ";}
}

module.exports = () => new Promise(function (resolve, reject) {
    const hosts = [];

    network()
    .then(cidrs => {
        let cidr = "";

        cidrs.forEach(element => {
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
        spawn.exec(nOptions.command() + cidr, cOptions, (error, data) => {
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
                        hostname = host.hostnames[0];
                    }

                    array.push({
                        ip,
                        mac,
                        vendor,
                        hostname
                    });
                });
                return resolve(array);
            });
        });
    });
}