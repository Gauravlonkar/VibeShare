const post = require("../model/post")
const userData = require("../model/dbSch")
const express = require("express")
const path = require("path")
const jwt = require("jsonwebtoken")
const { log } = require("console")

// exports.showPost = async (req, res) => {

//     const userId = req.userData._id; // or req.session.user._id
//     const user = await userData.findById(userId).populate('post');


// }

// const userData = require("../model/dbSch");

// exports.showPost = async (req, res) => {
//     try {
//         const userId = req.userData?._id;

//         if (!userId) {
//             return res.status(400).send("User not authenticated");
//         }

//         const user = await userData
//             .findById(userId)
//             .populate("post");

//         if (!user) {
//             return res.status(404).send("User not found");
//         }

//         res.render("Home", {
//             username: user.name,
//             posts: user.post // assuming 'post' is an array
//         });

//     } catch (err) {
//         console.error("Error in showPost:", err);
//         res.status(500).send("Server error");
//     }
// };

// const userData = require("../model/dbSch");

exports.showUser = async (req, res) => {
    try {


        // console.log(user.name);

    } catch (err) {
        console.error("Error in showPost:", err);
        res.status(500).send("Server error");
    }
};