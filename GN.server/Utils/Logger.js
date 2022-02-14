var fs = require('fs');
var path = require('path')
var rootPath = path.resolve(__dirname);

var Logger = function(options, data) {
    if(options.fileName != undefined) {
        this.fileName = options.fileName;
        this.absolutePath = rootPath + "/GNLog/" + options.fileName;

        this.createTime = new Date();
        this.createTime.setTime(this.createTime.getTime() + 8 * 60 * 60 * 1000);

        // Header
        fs.writeFile(this.absolutePath,
            "================================================================================\n" +
            "                       - Log file for GhostNight server -                       \n" +
            "================================================================================\n" +
            " - File name: " + options.fileName + "\n" +
            " - Create time: " + this.createTime.toLocaleDateString() + " " + this.createTime.toLocaleTimeString() + "\n" +
            " - Room Number: " + data.settings.Room + "\n" +
            // " - Setting: " + data.settings + "\n" +
            "================================================================================\n" +
            " Timestamp | Event source | Event name | Data                                   \n" +
            "--------------------------------------------------------------------------------"
            , {encoding: 'utf8', mode: 0666, flag: "w"}, console.error);
    }
}
Logger.prototype.Log = function(timestamp, unit, event, data) {
    var str = "\n"
            + ("          " + timestamp).substr(-10, 10) + " | "
            + ("            " + unit).substr(-12, 12) + " | "
            + ("          " + event).substr(-10, 10) + " | "
            + data;
    if(this.absolutePath != undefined) {
        fs.appendFile(this.absolutePath, str, {encoding: 'utf8'}, console.error);
    }
}
Logger.prototype.Statistics = function(data) {
    var str = "\n" +
            "================================================================================\n" +
            "                                 - Statistics -                                 \n" +
            "================================================================================\n" +
            "--------------------------------------------------------------------------------";
    for(var record in data) {
        str += "\n" + record.type + ": " + record.damage;
    }

    fs.appendFile(this.absolutePath, str, {encoding: 'utf8', mode: 0666, flag: "w"}, console.error);
}

module.exports = Logger;