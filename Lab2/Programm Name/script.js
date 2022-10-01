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


fs.readFile(config, "utf8", (err, data) => {
    if (err) console.log(err);
    else {
        let countExec = Number(data.split("\n")[0]);
        countExec+=1;
        let lastTimeExec = Number(data.split("\n")[1]);
        const currTimeExec = new Date().getTime() / 1000;
        const infToFile = countExec.toString() + "\n" + currTimeExec.toString();
        if(currTimeExec - lastTimeExec > 5 && countExec < 100){

        }
        else {
            console.log("Wait, please");
        }
    }
})

fs.writeFile(config, infToFile, {encoding:"utf8", flag:"w", mode:0o777},  (err)=> {
    if(err) {console.log(err)}
    else {
        fs.readFile(namesFile, "utf8", (err, data)=>{
            if(err) console.log(err);
            else {
                const names = data.split("\n");
                if(searchValue(names, userName)) console.log("Hello " + userName + " nice to see you again!");
                else {
                    console.log("Hello, " + userName + ", welcome!")
                    fs.appendFile(namesFile, userName + "\n",  (err)=> {
                        if(err) {console.log(err)};
                    })
                }
            }
        })
    }
});

