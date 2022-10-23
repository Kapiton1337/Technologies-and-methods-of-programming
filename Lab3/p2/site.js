const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const urlencodedParser = express.urlencoded({extended: false});

const staticSiteOptions ={
    portNum: 5000,
    maxAge: 1000*60*15
}

app.use(express.static(path.resolve(__dirname, "static"), staticSiteOptions));
app.use(express.json());

app.get("/", (req, res)=>{
    res.sendFile(path.resolve(__dirname, "static", "index.html"))
}).listen(staticSiteOptions.portNum);

app.post('/haha', urlencodedParser, (req, res, next)=>{
    if(!req.body) return res.sendStatus(400);
    const userInfo = JSON.stringify(req.body).replace(/\"\,\"/g,"\n").replace(/[\"\}\{]/g, "").replace(/\:/g, " -- ");
    const fileName = req.ip.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g) + ".txt";
    fs.writeFile(path.resolve(__dirname, fileName), userInfo, "utf-8", (err)=> {
        if(err) console.error(err);
        else console.log("File saved")
    })
})
