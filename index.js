const express = require("express");

const app = express();
require("dotenv").config();
const path = require('path');
const dbconnect = require("./config/dbcon")
const { clodinaryConnect } = require("./config/cloudCongif")

const ck = require("cookie-parser")
const routes = require("./routes/routes");
const fileupload = require("express-fileupload")
const cookieParser = require("cookie-parser");

// const { singup } = require("../Project log/views/")
app.use(express.static("public"))
app.set('view engine', 'ejs');
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use(fileupload
    ({
        useTempFiles: true,
        tempFilePath: '/tmp/'
    }));

const PORT = process.env.PORT || 7350

app.use("", routes)


app.use(express.static(path.join(__dirname, 'public')));


// app.get("/", (req, res) => {
//     res.send("Wellcome To Gaurav Web-TECH")
// })



dbconnect();
clodinaryConnect();
app.listen(PORT, () => {
    console.log(`Sever Running On http://localhost:${PORT}`);

})