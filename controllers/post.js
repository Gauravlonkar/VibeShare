const Post = require("../model/post");
const userData = require("../model/dbSch")

exports.createPost = async (req, res) => {
    try {



    } catch (err) {
        console.error("❌ Error in createPost:", err);
        res.status(500).send("Server error");
    }
};
