const userData = require("../model/dbSch")
const express = require("express")
const path = require("path")
const jwt = require("jsonwebtoken")
const cokke = require("cookie-parser")
const app = express();
app.set('view engine', 'ejs');

const bcrypt = require("bcryptjs")

app.use(express.static(path.join(__dirname, 'public')));




exports.SingPage = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        // console.log("Received:", name, email, password);

        // Check if email already exists
        const existingUser = await userData.findOne({ email });

        if (existingUser) {

            return res.status(409).send("User Is Already Exists");
        }

        // Hash the password
        let hashPass;
        try {
            hashPass = await bcrypt.hash(password, 10);
        } catch (err) {
            console.error("Hashing error:", err);
            return res.status(500).json({
                message: "Error while hashing password",
                success: false
            });
        }

        // Create user
        const newUser = await userData.create({
            name,
            email,
            password: hashPass
        });

        return res.render("login", {
            message: "User created successfully",
            success: true,


        });



    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};


exports.logInpage = async (req, res) => {

    try {

        const { email, password } = req.body;
        // console.log(email, password);


        if (!email || !password) {
            return res.status(400).send("Enter Field Information Proper")
        }

        let user = await userData.findOne({ email })

        if (!user) {
            res.redirect("/signup")
            return res.status(401).send("Invalid User").json({
                message: "User is not found ",
                success: false

            })
        }
        // console.log(user.password);


        const payload = {
            user: user.name,
            email: user.email,
            id: user.id,
            password: user.password
        }

        if (await bcrypt.compare(password, user.password)) {

            let token = jwt.sign(payload, process.env.JWT_KEY, {
                expiresIn: "10h"
            })

            // user = user.toObject();
            // user.token = token,
            // user.password = undefined;
            // await user.save()

            res.cookie("GarryCookie", token, {
                httpOnly: true,
                // secure: true, // use only with HTTPS
                sameSite: "Strict",
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            })

            if (!token) {
                return res.status(401).json({
                    message: "Invalid Password",
                    success: false
                });
            }
            res.redirect("/home2")
            return res.status(200).json({
                message: "All Done "
            })
        }

        res.status(400).json({
            message: "Invalid Password"
        })






    }
    catch (err) {

        console.log(err);
        return res.status(500).json({
            message: "Err In Login Data"
        })


    }




}

function Islog(req, res, next) {
    if (req.cookies.GarryCookie === "") res.send("Your Must Be login");

    else {
        let data = jwt.verify(req.cookies.GarryCookie, process.env.JWT_KEY);

        req.user = data;

    }
    next()

}


exports.findUser = async (req, res, next) => {
    try {
        const user = await userData.findOne({ email: req.user.email });

        if (!user) {
            return res.status(404).send("User not found");
        }

        console.log("✅ Logged-in user:", user); // ✅ This will log user data
        req.userData = user; // attach it to req for the next middleware
        next();
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("Internal Server Error");
    }

}