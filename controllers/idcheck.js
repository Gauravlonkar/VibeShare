const Post = require("../model/post");


const checkPostOwnership = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id).populate("user");
        // console.log(post.id);
        // console.log(post.user.id);
        // console.log(req.user._id);




        if (!post) {
            return res.status(404).send("Post not found");
        }
        // console.log(req.user.id);

        // console.log();

        if (post.user.id !== req.user.id) {
            return res.status(403).send("Unauthorized: You cannot edit this post");
        }

        // res.send("You CaN Edit Post")

        // User owns the post
        next();
    } catch (err) {
        console.error("Ownership check failed:", err);
        res.status(500).send("Internal server error");
    }
};

module.exports = checkPostOwnership;