const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const readline = require("readline").createInterface({input: process.stdin, output: process.stdout});

const ENCODING_KEY = 'xNRxA48aNYd33PXaODSutRNFyCu4cAe/InKT/Rx+bw0=';

const sh = "#!bin/bash\n" +
    "node secure.js";

const runscript = (pth) => {
    return `"[Unit]
Description=My Script Service
After=multi-user.target
[Service]
Type=idle
ExecStart= ${pth}
[Install]
WantedBy=multi-user.target"`;
}

const securejsData = "const PERMISSIONS_BAN = 0o000;\n" +
    "const PERMISSIONS_ALLOW = 0o777;\n" +
    "\n" +
    "class Files {\n" +
    "    constructor(filePath) {\n" +
    "        this.filePath = filePath;\n" +
    "    }\n" +
    "    get filePath(){\n" +
    "        return this.filePath;\n" +
    "    }\n" +
    "    permissionsFlag() {\n" +
    "        try {\n" +
    "            this.permissions = new Mode(fs.statSync(this.filePath)); // 1 - not found; 2 - is granted; 3 - is denied;\n" +
    "        } catch (e) {\n" +
    "            return 0;\n" +
    "        }\n" +
    "        return this.permissions.toString() != \"----------\" ? 1 : 2;\n" +
    "    }\n" +
    "    filePath;\n" +
    "    permissions;\n" +
    "}\n" +
    "\n" +
    "const fs = require(\"fs\");\n" +
    "const path = require(\"path\");\n" +
    "const crypto = require(\"crypto\");\n" +
    "const readline = require(\"readline\").createInterface({input: process.stdin, output: process.stdout});\n" +
    "const Mode = require(\"stat-mode\");\n" +
    "\n" +
    "const systat = path.resolve(__dirname, \"sys.tat\");\n" +
    "\n" +
    "const fileObj = new Files(systat);\n" +
    "\n" +
    "const decrypt = (encryptedData, regKey) => {\n" +
    "    const key = Buffer.from(regKey, 'base64');\n" +
    "    const iv = Buffer.from('81dFxOpX7BPG1UpZQPcS6w==', 'base64');\n" +
    "    const algorithm = \"aes-256-cbc\";\n" +
    "\n" +
    "    const decipher = crypto.createDecipheriv(algorithm, key, iv);\n" +
    "    let decryptedData = decipher.update(encryptedData, \"hex\", \"utf-8\");\n" +
    "    decryptedData += decipher.final(\"utf8\");\n" +
    "\n" +
    "    return decryptedData;\n" +
    "}\n" +
    "\n" +
    "const password = \"parppawaparsparspardpaodparspaww\";\n" +
    "\n" +
    "function enc(str, key) {\n" +
    "    var length = key.length;\n" +
    "    var keyList = key.split(\"\");\n" +
    "    var s = \"\", bit, bit1, bit2, bit3, bit4;\n" +
    "    for (var i = 0; i < str.length; i++) {\n" +
    "        bit = str.charCodeAt(i);\n" +
    "        bit1 = bit % length;\n" +
    "        bit = (bit - bit1) / length;\n" +
    "        bit2 = bit % length;\n" +
    "        bit = (bit - bit2) / length;\n" +
    "        bit3 = bit % length;\n" +
    "        bit = (bit - bit3) / length;\n" +
    "        bit4 = bit % length;\n" +
    "        s += keyList[bit4] + keyList[bit3] + keyList[bit2] + keyList[bit1];\n" +
    "    }\n" +
    "    return s;\n" +
    "}\n" +
    "\n" +
    "const deny_access = (fileObj) => {\n" +
    "    if(fileObj.permissionsFlag() == 1){\n" +
    "        fs.chmod(fileObj.filePath, PERMISSIONS_BAN, (error) => {if (error) console.log(error);})\n" +
    "        require('child_process').execSync('sudo chattr +i ' + fileObj.filePath);\n" +
    "        console.log(\"Permissions denied for \" + fileObj.filePath);\n" +
    "    }\n" +
    "}\n" +
    "const allow_access = (fileObj) => {\n" +
    "    if (fileObj.permissionsFlag() == 2) {\n" +
    "        require('child_process').execSync('sudo chattr -i ' + fileObj.filePath);\n" +
    "        fs.chmod(fileObj.filePath, PERMISSIONS_ALLOW, err => {if (err) console.log(err)});\n" +
    "        console.log(\"Permissions granted for  \" + fileObj.filePath)\n" +
    "    }\n" +
    "};\n" +
    "\n" +
    "deny_access(fileObj);\n" +
    "\n" +
    "const specifyReg = async () => {\n" +
    "    return new Promise((resolve, reject)=>{\n" +
    "        readline.question(\"Specify name of registry key: \", user_reg => { //Read password from console\n" +
    "            if (user_reg == \"Artem_Polevtsov\") {\n" +
    "                const registry = path.resolve(\"/home\", \"kali\", \"software\", user_reg);\n" +
    "                console.log(\"Accepted\");\n" +
    "                resolve(registry);\n" +
    "            }\n" +
    "            reject(\"Wrong registry name\")\n" +
    "        })\n" +
    "    })\n" +
    "}\n" +
    "\n" +
    "const specifyPass = async (registry) => {\n" +
    "    return new Promise((resolve, reject) => {\n" +
    "        readline.question(\"Password: \", user_password => { //Read password from console\n" +
    "            resolve({user_password: user_password, registry: registry});\n" +
    "        })\n" +
    "    })\n" +
    "}\n" +
    "\n" +
    "const specifyKey = async (obj) => {\n" +
    "    return new Promise((resolve, reject) => {\n" +
    "        readline.question(\"Key: \", userKey => {\n" +
    "            const user_password_enc = enc(obj.user_password, userKey);\n" +
    "            if (user_password_enc == password) {\n" +
    "                console.log(\"Accepted\");\n" +
    "                allow_access(fileObj);\n" +
    "\n" +
    "                readline.close();\n" +
    "                resolve(obj.registry);\n" +
    "            }\n" +
    "            reject(\"Wrong password\");\n" +
    "        })\n" +
    "    })\n" +
    "}\n" +
    "\n" +
    "const readReg = async (registry) => {\n" +
    "    return new Promise((resolve, reject) => {\n" +
    "        fs.readFile(registry, \"utf-8\", (err, key)=>{\n" +
    "            if(err){\n" +
    "                console.log(err);\n" +
    "                reject(\"Error read\" + registry)\n" +
    "            }\n" +
    "            else {\n" +
    "                resolve(key);\n" +
    "            }\n" +
    "        })\n" +
    "    })\n" +
    "}\n" +
    "\n" +
    "const readSystat = async (key) => {\n" +
    "    return new Promise((resolve, reject) => {\n" +
    "        fs.readFile(systat, \"utf-8\", (err, compConfig)=>{\n" +
    "            if(err){\n" +
    "                reject(\"Error read\" + systat)\n" +
    "            }\n" +
    "            else {\n" +
    "                resolve({conf: compConfig, key: key});\n" +
    "            }\n" +
    "        })\n" +
    "    })\n" +
    "}\n" +
    "\n" +
    "const decryption = async (data) => {\n" +
    "    return new Promise((resolve, reject) => {\n" +
    "        fs.writeFile(systat, decrypt(data.conf, data.key), (err)=>{\n" +
    "            if(err){\n" +
    "                reject(\"Decryption error\");\n" +
    "            }\n" +
    "        })\n" +
    "    })\n" +
    "}\n" +
    "\n" +
    "specifyReg()\n" +
    "    .then((registry) => specifyPass(registry))\n" +
    "    .then((obj)=>specifyKey(obj))\n" +
    "    .then((registry)=>readReg(registry))\n" +
    "    .then((key)=>readSystat(key))\n" +
    "    .then((data)=>decryption(data))\n" +
    "    .catch((message)=>{\n" +
    "\n" +
    "        console.log(message);\n" +
    "        readline.close();\n" +
    "\n" +
    "        fs.watch(path.resolve(__dirname), (event, filename) => {\n" +
    "            console.log(event);\n" +
    "            switch (event) {\n" +
    "                case \"rename\": deny_access(fileObj);\n" +
    "                case \"change\": deny_access(fileObj);\n" +
    "            }\n" +
    "        })\n" +
    "    })";

const encrypt = (data) => {
    const algorithm = "aes-256-cbc";
    const key = Buffer.from('xNRxA48aNYd33PXaODSutRNFyCu4cAe/InKT/Rx+bw0=', 'base64');
    const iv = Buffer.from('81dFxOpX7BPG1UpZQPcS6w==', 'base64');

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedData = cipher.update(data, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    return encryptedData;
}

const decrypt = (encryptedData) => {
    const algorithm = "aes-256-cbc";
    const key = Buffer.from('xNRxA48aNYd33PXaODSutRNFyCu4cAe/InKT/Rx+bw0=', 'base64');
    const iv = Buffer.from('81dFxOpX7BPG1UpZQPcS6w==', 'base64');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
    decryptedData += decipher.final("utf8");
    return decryptedData;
}

const choosePath = async () => {
    return new Promise((resolve, reject) => {
        readline.question("Choose an installations path: ", (userPath)=>{
            userPath = path.resolve(__dirname, userPath);
            resolve(userPath);
            readline.close();
        })
    })
}

const readPath = async(userPath) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(userPath, {recursive: true}, (err, path)=>{
            if (err){
                reject();
            }
            else {
                resolve(userPath);
            }
        })
    })
}

const getSysInfo = async (userPath) => {
    return new Promise((resolve, reject)=>{
        let data = "Type of os: " + os.type() +
            "\nVersion of os: " + os.release() +
            "\nPlatform: " + os.platform() +
            "\n\nComputer name: " + os.hostname() +
            "\nUsername: " + os.userInfo().username +
            "\nCPU: " + os.cpus()[0].model +
            "\nMemory: " + Math.round(os.totalmem()/(1024 * 1024)) + " GB";

        resolve({userPath: userPath, data: encrypt(data)})
    })
}

const createFiles = async (obj) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.resolve(obj.userPath, "sys.tat"), obj.data, (err)=>{
            if(err){
                console.log(err);
                reject();
            }
            else {
                resolve(obj);
            }
        })
        fs.writeFile(path.resolve(obj.userPath, "secure.js"), securejsData, (err)=>{
            if(err){
                console.log(err);
                reject(obj);
            }
            else {
                resolve(obj);
            }
        })
        fs.writeFile(path.resolve(obj.userPath, "autoload.sh"), sh, (err)=>{
            if(err){
                console.log(err);
                reject(obj);
            }
            else {
                resolve(obj);
            }
        })
        /*fs.writeFile(path.resolve("/lib", "systemd", "system", "runscript.service"), runscript(path.resolve(obj.userPath, "autoload.sh")), (err)=>{
            if(err){
                console.log(err);
            }
        })*/
        console.log("sudo echo " + runscript(path.resolve(obj.userPath, "autoload.sh")) + " > /lib/systemd/system/runscript.service")
        require("child_process").exec("sudo echo " + runscript(path.resolve(obj.userPath, "autoload.sh")) + " > /lib/systemd/system/runscript.service")
        fs.writeFile(path.resolve("/home", "kali", "software", "Artem_Polevtsov"), ENCODING_KEY, (err)=>{
            if(err){
                console.log(err);
                reject();
            }
            else {
                resolve(obj);
            }
        })
    })
}

const animationInstall = async (obj) => {
    return new Promise((resolve, reject) => {

        const anim = ["/", "|", "\\", "-"];
        let iter = 0;

        const indicator = setInterval(() => {
            console.clear();
            console.log("Installation in progress, please wait...")
            let ind = "";

            for(let i = 0; i < 10; i++){
                ind += anim[iter];
            }

            if(iter < anim.length){
                console.log(ind);
                iter++;
            }
            else {
                iter = 0;
            }
        }, 1000)

        setTimeout(()=> {
            clearInterval(indicator);
            resolve(obj);
        }, 10000);

    })
}

const execSecure = async (obj) => {
    return new Promise((resolve, reject) => {
        require("child_process").fork(path.resolve(obj.userPath, "secure.js"));
    })
}

choosePath()
    .then((userPath)=>readPath(userPath))
    .then((userPath)=>getSysInfo(userPath))
    .then((obj)=>createFiles(obj))
    //.then((obj)=>animationInstall(obj))
    .then((obj) => execSecure(obj))
