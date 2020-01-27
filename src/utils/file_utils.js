const fs  = require('fs');

class FileUtils{
    static writeJsonToFile(filePath, data){
        const json = JSON.stringify(data);
        fs.writeFileSync(filePath, json);
    }

    static readJsonFromFile(){
        const data = fs.readFileSync(filePath)
        return JSON.parse(data);
    }
}

module.exports = FileUtils;