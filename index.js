const { json } = require("express");
//const URL = require("url").URL;
const validUrl = require("valid-url");
const dns = require("dns");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;

app.use("/public", express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    console.log(req.method, req.path);
    next();
  })

/* Api to solve the third problem of freecodecamp (Back End Development and APIs Projects)*/
/*
this route shows index for this problem
app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/views/index.html");
})
*/

const stringIsAValidUrl = (s) => {
    try {
        new URL(s);
        return true;
    } catch (err) {
        return false;
    }
};

const getHigher = (arr) => {
    let max = 0;
    arr.forEach(ele => {
        max = ele.short_url > max ? ele.short_url : max;
    })
    return max;
}

let arrayLinks = [
    { original_url: "https://freeCodeCamp.org", short_url : 1},
    { original_url: "http://www.freecodecamp.com" , short_url: 2},
    { original_url: "http://www.youtube.com" , short_url: 3},
    { original_url: "http://www.hackerrank.com" , short_url: 4},
    { original_url: "http://www.codepen.io" , short_url: 5},
]



app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/views/index.html");
})

app.get("/api/shorturl/:short_url", (req, res) => {
    let jsonUrl = arrayLinks.find(ele => ele.short_url == req.params.short_url)
    //res.json({ original_url: jsonUrl.original_url });
    if(jsonUrl)
        res.redirect(jsonUrl.original_url);
    else
        res.status(404).json({error: "No URL found"});
})

app.post("/api/shorturl", async (req, res) => {
    console.log(req.body.url, " - ", validUrl.isUri(req.body.url), " - ", req.body.url.replace(/https?:\/\//, ""))
    if (validUrl.isUri(req.body.url)) {
        dns.lookup(req.body.url.replace(/https?:\/\//, ""), (err, address, family) => {
            try {
                if (!address || address == "undefined") {
                    res.json({ error: "Invalid Hostname" })
                }
                else {
                    console.log(req.body.url);
                    let jsonUrl = arrayLinks.find(ele => ele.original_url == req.body.url);
                    if (jsonUrl)
                        res.json(jsonUrl);
                    else {
                        arrayLinks.push({ original_url: req.body.url, short_url: getHigher(arrayLinks) + 1 })
                        let newUrl = arrayLinks.find(ele => ele.original_url == req.body.url);
                        res.json(newUrl)
                    }
                }
            }
            catch (err) {
                console.log(err);
                res.json({ error: "Error validating Hosting" })
            }
        })
    }
    else {
        res.json({ error: "Invalid URL" });
    }
})
/* Api1 to solve the second problem of freecodecamp (Back End Development and APIs Projects)*/
/*
this route shows index for this problem
app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/views/index2.html");
})
*/
app.get("/api2/whoami", (req, res) => {
    let jsonResponse = {};
    jsonResponse.ipaddress = req.ip;
    jsonResponse.language = req.headers["accept-language"];
    jsonResponse.software = req.headers["user-agent"];

    res.json(jsonResponse);

})
/* Api1 to solve the first problem of freecodecamp (Back End Development and APIs Projects)*/
/*
this route shows index for this problem
app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/views/index1.html");
})
*/
app.get("/api1", (req, res) => {
    let jsonResponse = {
        unix: new Date().getTime(),
        utc: new Date().toUTCString()
    };
    res.json(jsonResponse);
})


app.get("/api1/:date", (req, res) => {
    let { date } = req.params;
    console.log(date);
    let jsonResponse = {
        unix: null,
        utc: null
    }
    let jsonError = {
        error: "Invalid Date"
    }

    let regExp = /[/-\s]/;
    if (new Date(date) | new Date(parseInt(date))) {
        if (regExp.test(date)) {
            jsonResponse.unix = Date.parse(date);
            jsonResponse.utc = new Date(date).toUTCString();
        }
        else {
            let auxDate = new Date(parseInt(date));
            jsonResponse.unix = parseInt(date);
            jsonResponse.utc = auxDate.toUTCString();
        }
        res.json(jsonResponse);
    }
    else {
        res.json(jsonError)
    }
})

app.listen(port, () => {
    console.log("ya ta funcionando en el puerto " + port);
})


