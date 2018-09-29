const os = require("os");

module.exports = () => new Promise(function (resolve, reject) {
    const interfaces = os.networkInterfaces();
    const ipv4 = [];
    const ipv6 = [];

    for (const key in interfaces) {
        if (interfaces.hasOwnProperty(key)) {
            const element = interfaces[key];

            element.forEach(ip => {
                if(ip.internal === false) {
                    if(ip.family == "IPv4") ipv4.push(ip.cidr);
                    if(ip.family == "IPv6") ipv6.push(ip.cidr);
                }
            });
        }
    }
    return resolve(ipv4, ipv6);
});

// .filter(int => int[0].internal === false)