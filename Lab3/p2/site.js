const express = require("express");
const path = require("path")

const app = express();

const urlencodedParser = express.urlencoded({extended: false});

const staticSiteOptions ={
    portNum: 5000,
    maxAge: 1000*60*15
}

app.use(express.static(path.resolve(__dirname, "static"), staticSiteOptions)).listen(staticSiteOptions.portNum);
app.use(express.json())

app.post('/haha', urlencodedParser, (req, res, next)=>{
    if(!req.body) return res.sendStatus(400);
    console.log(req.body);
})
