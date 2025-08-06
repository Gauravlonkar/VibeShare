// controllers/postController.js

const Post = require("../model/post");

const updatePost = async (req, res) => {
    try {
        const { content, description } = req.body;

        // Find the post by ID and update it
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { content, description },
            // { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).send("Post not found");
        }

        // Redirect or send a success response
        res.redirect("/home2"); // or
        res.status(302).redirect("/home2", { user: req.user, posts: [updatedPost] })

    } catch (err) {
        console.error("Error updating post:", err);
        res.status(500).send("Server Error");
    }
};

module.exports = { updatePost };
