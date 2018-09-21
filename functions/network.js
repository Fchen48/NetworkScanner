const os = require("os");

module.exports = () => new Promise(function (resolve, reject) {
    const interfaces = os.networkInterfaces();
    const array = [];

    for (const key in interfaces) {
        if (interfaces.hasOwnProperty(key)) {
            const element = interfaces[key];

            element.forEach(ip => {
                if(ip.internal === false) {
                    array.push(ip.cidr);
                }
            });
        }
    }
    return resolve(array);
});

// .filter(int => int[0].internal === false)