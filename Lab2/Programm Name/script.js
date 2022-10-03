const TIME_PERIOD = 5;
const EXEC_LIMIT = 100;

const fs = require("fs");
const path = require("path");

const searchValue = (array, value) => {
    for(let i in array){
        if (array[i] == value) {return true};
    }
    return false;
}

const userNameArr = process.argv.slice(2);
const userName = userNameArr.join(" ");

const config = path.resolve(__dirname, "../", "Programm_Data", "config.txt");
const namesFile = path.resolve(__dirname, "Names.txt");

const readConfigAsync = async (config) => {
    return new Promise((resolve, reject)=>{
        fs.readFile(config, "utf8", (err, data) => {
            if (err)
                return reject(err.message);
            else {
                let spentExec = Number(data.split("\n")[0]) + 1;

                let lastTimeExec = Number(data.split("\n")[1]);
                let currTimeExec = new Date().getTime() / 1000;

                let infToFile = spentExec.toString() + "\n" + currTimeExec.toString();
                const elapsedTime = currTimeExec - lastTimeExec;
                const remExec = EXEC_LIMIT - spentExec;

                if(spentExec > EXEC_LIMIT){
                    return reject("LIMIT");
                }

                if(elapsedTime > TIME_PERIOD){
                    return resolve({config: config, infToFile: infToFile, remExec: remExec});
                }
                else {
                    return console.log("Waiting for " + (TIME_PERIOD - elapsedTime))
                }
            }
        })
    })
}

const writeConfigAsync = async (obj, config, infToFile, remExec) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(obj.config, obj.infToFile, {encoding:"utf8", flag:"w", mode:0o777},  (err)=> {
            if(err)
                console.log(err)
            else
                return resolve(obj.remExec);
        });
    })
}

const readNamesFileAsync = async (namesFile, remExec) => {
    return new Promise((resolve, reject) => {
        fs.readFile(namesFile, "utf8", (err, data)=>{
            if(err)
                console.log(err);
            else {
                const names = data.split("\n");
                if(searchValue(names, userName))
                    console.log("Hello " + userName + " nice to see you again!" + "\n" + "Remaining execs: " + remExec);
                else {
                    console.log("Hello, " + userName + ", welcome!")
                    resolve();
                }
            }
        })
    })
}

const appendNamesFileAsync = async (namesFile, userName) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(namesFile, userName + "\n",  (err)=> {
            if(err)
                console.log(err)
        })
    })
}

readConfigAsync(config)
    .then((obj)=>writeConfigAsync(obj))
    .then((remExec)=>readNamesFileAsync(namesFile,remExec))
    .then((remExec)=>appendNamesFileAsync(namesFile, userName, remExec))



