const fs = require("fs-extra");
const path = require("path");

const readline = require("readline").createInterface({input: process.stdin, output: process.stdout});

new Promise((resolve, reject) => {
    readline.question("Do you want to deinstall? ", (userAnswer)=>{
        switch (userAnswer) {
            case "Yes": {
                resolve();
                break;
            }
            case "No": {
                console.log("Deinstall canceled");
                break;
            }
            default: {
                console.log("No such answer option");
                break;
            }
        }
        readline.close();
    })
})
    .then(()=>{
        fs.remove(path.resolve(__dirname), (err)=>{
            if(err){
                console.log(err);
            }
        })
    })