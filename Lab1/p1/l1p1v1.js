const PERMISSIONS_BAN = 0o000;
const PERMISSIONS_ALLOW = 0o777;

class Files {
    constructor(fileName, filePath) {
        this.fileName = fileName;
        this.filePath = filePath;
    }
    get fileName(){
        return this.fileName;
    }
    get filePath(){
        return this.filePath;
    }
    permissionsFlag() {
        try {
            this.permissions = new Mode(fs.statSync(this.filePath)); // 1 - not found; 2 - is granted; 3 - is denied;
        } catch (e) {
            console.log(this.fileName + " Not Found");
            return 0;
        }
        return this.permissions.toString() != "----------" ? 1 : 2;
    }
    fileName;
    filePath;
    permissions;
}

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const readline = require("readline").createInterface({input: process.stdin, output: process.stdout});
const Mode = require("stat-mode");

const template = path.resolve(__dirname, "template.tbl");
const fileObjCreator = (template) => {
    const fileNames = fs.readFileSync(template, 'utf-8').split('\n');
    fileNames.shift();
    const filePaths = fs.readFileSync(template, 'utf-8').split('\n').map(file=>path.resolve(__dirname, file));
    filePaths.shift();

    const fileObjs = {};
    if(fileNames.length == filePaths.length){
        for(let i = 0; i < fileNames.length; i++){
            fileObjs[i] = new Files(fileNames[i], filePaths[i]);
        }
    }
    else{
        console.log("Strings not equal")
    }
    return fileObjs;
};

let fileObjs = fileObjCreator(template);
let password_flag = 0;

const cipher = fs.readFileSync(template, 'utf-8').split('\n').shift();
const key = Buffer.from('xNRxA48aNYd33PXaODSutRNFyCu4cAe/InKT/Rx+bw0=', 'base64');
const iv = Buffer.from('81dFxOpX7BPG1UpZQPcS6w==', 'base64');
const algorithm = "aes-256-cbc";

const decrypt = (algorithm, key, iv, encryptedData) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
    decryptedData += decipher.final("utf8");

    return decryptedData;
}

const deny_access = (fileObjs) => {
    for (const i in fileObjs){
        if(fileObjs[i].permissionsFlag() == 1){
            fs.chmod(fileObjs[i].filePath, PERMISSIONS_BAN, (error) => {if (error) console.log(error);})
            require('child_process').execSync('sudo chattr +i ' + fileObjs[i].filePath);
            console.log("Permissions denied for " + fileObjs[i].fileName)
        }
    }
}
const allow_access = (fileObjs) => {
    for (const i in fileObjs){
        if (fileObjs[i].permissionsFlag() == 2) {
            require('child_process').execSync('sudo chattr -i ' + fileObjs[i].filePath);
            fs.chmod(fileObjs[i].filePath, PERMISSIONS_ALLOW, err => {if (err) console.log(err)});
            console.log("Permissions granted for  " + fileObjs[i].fileName)
        }
    }
};

deny_access(fileObjs);

readline.question("Your password: ", user_password => { //Read password from console
    if (user_password == decrypt(algorithm, key, iv, cipher)) {
        console.log("Accepted");
        password_flag = 1;
        allow_access(fileObjs);
    }
    else {
        console.log("Wrong password");
    }
    fs.watch(path.resolve(__dirname), (event, filename) => {
        console.log(event);
        switch (event) {
            case "rename": !password_flag ? deny_access(fileObjs) : allow_access(fileObjs);
            case "change": !password_flag ? deny_access(fileObjs) : {};
        }

    })
    fs.watch(template, (event, filename) => {
       if(event){
            fileObjs = fileObjCreator(template);
            password_flag ? allow_access(fileObjs) : deny_access(fileObjs);
        }
    })
    readline.close();
})