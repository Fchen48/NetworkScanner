const path = require("path");
const spawn = require("child_process");
const Events = require("events");

const cOptions = {
    encoding: "utf8",
    timeout: 1000,
    windowsHide: true
};
const scan = {
    ping: "ping",
    count: " -n 1",
    timeout: " -w 500",
    command() {return this.ping + this.count + this.timeout + " ";}
};
class ContinousPing extends Events {
    start(ip) {
        ping(ip)
        .then(result => {
            this.timeout = setTimeout(() => {
                this.start(ip);
            }, 250);
            this.emit("ping", result)
        })
        .catch(error => this.emit("error", error));
    }
    stop() {
        clearTimeout(this.timeout);
    }
}

module.exports = new ContinousPing();

function ping(ip) {
    return new Promise(function (resolve, reject) {
        spawn.exec(scan.command() + ip, cOptions, (error, data) => {
            if(error) {
                if(error.code === 1) return resolve(undefined);
                return reject(error);
            }
            const result = data.split("\n")[2].split(": ")[1].split(" ")[1].split("=")[1];

            return resolve(result);
        });
    });
}