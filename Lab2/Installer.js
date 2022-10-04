const fs = require("fs");
const path = require("path");
const readline = require("readline").createInterface({input: process.stdin, output: process.stdout});

const dataScript = "const TIME_PERIOD = 5;\n" +
    "const EXEC_LIMIT = 10;\n" +
    "\n" +
    "const fs = require(\"fs\");\n" +
    "const path = require(\"path\");\n" +
    "const readline = require(\"readline\").createInterface({input: process.stdin, output: process.stdout});\n" +
    "\n" +
    "const searchValue = (array, value) => {\n" +
    "    for(let i in array){\n" +
    "        if (array[i] == value) {return true};\n" +
    "    }\n" +
    "    return false;\n" +
    "}\n" +
    "\n" +
    "const config = path.resolve(__dirname, \"../\", \"Program_Data\", \"config.txt\");\n" +
    "\n" +
    "const namesFile = path.resolve(__dirname, \"Names.txt\");\n" +
    "\n" +
    "const readConfigAsync = async (config) => {\n" +
    "    return new Promise((resolve, reject)=>{\n" +
    "        fs.readFile(config, \"utf8\", (err, data) => {\n" +
    "            if (err)\n" +
    "                return reject(err.message);\n" +
    "            else {\n" +
    "                let spentExec = Number(data.split(\"\\n\")[0]) + 1;\n" +
    "                let lastTimeExec = Number(data.split(\"\\n\")[1]);\n" +
    "\n" +
    "                let currTimeExec = new Date().getTime() / 1000;\n" +
    "\n" +
    "                let infToFile = spentExec.toString() + \"\\n\" + currTimeExec.toString();\n" +
    "\n" +
    "                const elapsedTime = currTimeExec - lastTimeExec;\n" +
    "                const remExec = EXEC_LIMIT - spentExec;\n" +
    "\n" +
    "                if(spentExec > EXEC_LIMIT){\n" +
    "                    reject(\"You should buy full version of our program\");\n" +
    "                }\n" +
    "\n" +
    "                if(elapsedTime > TIME_PERIOD){\n" +
    "                    resolve({config: config, infToFile: infToFile, remExec: remExec});\n" +
    "                }\n" +
    "                else {\n" +
    "                    reject(\"Waiting for \" + (TIME_PERIOD - elapsedTime));\n" +
    "                }\n" +
    "            }\n" +
    "        })\n" +
    "    })\n" +
    "}\n" +
    "\n" +
    "const whatIsYourName = async (obj)=>{\n" +
    "    return new Promise((resolve, reject) => {\n" +
    "        readline.question(\"What is your name? \", (userName)=>{\n" +
    "            obj.userName = userName;\n" +
    "            resolve(obj);\n" +
    "            readline.close();\n" +
    "        })\n" +
    "    })\n" +
    "}\n" +
    "\n" +
    "const writeConfigAsync = async (obj) => {\n" +
    "    return new Promise((resolve, reject) => {\n" +
    "        fs.writeFile(obj.config, obj.infToFile, {encoding:\"utf8\", flag:\"w\", mode:0o777},  (err)=> {\n" +
    "            if(err)\n" +
    "                console.log(err)\n" +
    "            else\n" +
    "                return resolve(obj);\n" +
    "        });\n" +
    "    })\n" +
    "}\n" +
    "\n" +
    "const readNamesFileAsync = async (namesFile, obj) => {\n" +
    "    return new Promise((resolve, reject) => {\n" +
    "        fs.readFile(namesFile, \"utf8\", (err, data)=>{\n" +
    "            if(err)\n" +
    "                console.log(err);\n" +
    "            else {\n" +
    "                const names = data.split(\"\\n\");\n" +
    "                if(searchValue(names, obj.userName))\n" +
    "                    console.log(\"Hello \" + obj.userName + \" nice to see you again!\" + \"\\n\" + \"Remaining execs: \" + obj.remExec);\n" +
    "                else {\n" +
    "                    console.log(\"Hello, \" + obj.userName + \", welcome!\")\n" +
    "                    resolve(obj);\n" +
    "                }\n" +
    "            }\n" +
    "        })\n" +
    "    })\n" +
    "}\n" +
    "\n" +
    "const appendNamesFileAsync = async (namesFile, obj) => {\n" +
    "    return new Promise((resolve, reject) => {\n" +
    "        fs.appendFile(namesFile, obj.userName + \"\\n\",  (err)=> {\n" +
    "            if(err)\n" +
    "                console.log(err)\n" +
    "        })\n" +
    "    })\n" +
    "}\n" +
    "\n" +
    "readConfigAsync(config)\n" +
    "    .then((obj)=>whatIsYourName(obj))\n" +
    "    .then((obj)=> writeConfigAsync(obj))\n" +
    "    .then((obj)=>readNamesFileAsync(namesFile, obj))\n" +
    "    .then((userName)=>appendNamesFileAsync(namesFile, userName))\n" +
    "    .catch((message)=>{console.log(message); readline.close()})\n" +
    "\n" +
    "\n" +
    "\n"

const dataDeinstaller = "const fs = require(\"fs\");\n" +
    "const path = require(\"path\");\n" +
    "\n" +
    "const readline = require(\"readline\").createInterface({input: process.stdin, output: process.stdout});\n" +
    "\n" +
    "new Promise((resolve, reject) => {\n" +
    "    readline.question(\"Do you want to deinstall? \", (userAnswer)=>{\n" +
    "        switch (userAnswer) {\n" +
    "            case \"Yes\": {\n" +
    "                resolve();\n" +
    "                break;\n" +
    "            }\n" +
    "            case \"No\": {\n" +
    "                console.log(\"Deinstall canceled\");\n" +
    "                break;\n" +
    "            }\n" +
    "            default: {\n" +
    "                console.log(\"No such answer option\");\n" +
    "                break;\n" +
    "            }\n" +
    "        }\n" +
    "        readline.close();\n" +
    "    })\n" +
    "})\n" +
    "    .then(()=>{\n" +
    "        require(\"child_process\").execSync(\"sudo rm -rf ../Program_Name\");\n" +
    "    })"

const rl = async () => {
    return new Promise((resolve, reject) => {
        readline.question("choose directory: ", (userPathInput)=>{
            const userPath = path.resolve(__dirname, userPathInput)
            resolve(userPath);
            readline.close();
        })
    })
}

const createDir = async (userPath) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(userPath, (err) => {
            if(err){
                switch (err.code) {
                    case "EEXIST":
                    {
                        console.log("Dir already exist " + userPath);
                        resolve(userPath);
                    }
                }
            }
            else {
                resolve(userPath);
            }
        })
        fs.mkdir(path.resolve(__dirname, "Program_Data"), (err) => {
            if(err){
                switch (err.code) {
                    case "EEXIST":
                    {
                        console.log("Dir already exist " + userPath);
                        resolve(userPath);
                    }
                }
            }
            else {
                resolve(userPath);
            }
        })
    })
}

const createFiles = async (userPath) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.resolve(userPath, "Script.js"), dataScript, {encoding:"utf8", flag:"w", mode:0o777}, (data,err )=>{
            if(err){
                console.log(err);
            }
        })
        fs.writeFile(path.resolve(userPath, "Names.txt"), "", {encoding:"utf8", flag:"w", mode:0o777}, (data,err )=>{
            if(err){
                console.log(err);
            }
        })
        fs.writeFile(path.resolve(userPath, "Deinstaller.js"), dataDeinstaller, {encoding:"utf8", flag:"w", mode:0o777}, (data,err )=>{
            if(err){
                console.log(err);
            }
        })
        if(!fs.existsSync(path.resolve(__dirname, "Program_Data", "config.txt"))){
            fs.writeFile(path.resolve(__dirname, "Program_Data", "config.txt"), "0\n0", (err)=>{
                if(err){
                    console.log(err);
                }
            })
        }
    })
}

rl()
    .then((userPath)=>{return createDir(userPath)})
    .then((userPath)=>{return createFiles(userPath)})
    .catch((err)=>{
        console.log(err);
    })