const path = require("path");
const spawn = require("child_process");
const parseXML = require("xml2js").parseString;

module.exports = (ip) => new Promise(function (resolve, reject) {
    console.log(ip);
});