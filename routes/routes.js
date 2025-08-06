const express = require("express");
// const path = require("path");
const userData = require("../model/dbSch")
const jwt = require("jsonwebtoken");
const Post = require("../model/post");
const { SingPage, logInpage, findUser } = require("../controllers/Slpage");
const { createPost } = require("../controllers/post")
const { showUser } = require("../controllers/showpost");
const checkPostOwnership = require("../controllers/idcheck")
const { updatePost } = require("../controllers/updatepost")
const post = require("../model/post");
// const { rotate } = require("three/tsl");
const path = require('path');
const cloudinary = require("cloudinary")
const { log } = require("console");
const { AsyncCompress } = require("three/examples/jsm/libs/fflate.module.js");

// const { log } = require("console");
// const { Path } = require("three");
// const { userData } = require("three/tsl");
require("dotenv").config();

const router = express.Router(); // ✅ Use proper router naming

// ✅ Middleware to check authentication
function Islog(req, res, next) {
    const token = req.cookies?.GarryCookie;

    if (!token) {
        return res.status(401).redirect("/login");
    }

    try {
        const data = jwt.verify(token, process.env.JWT_KEY);
        req.user = data;

        next();

    } catch (err) {
        return res.status(403).send("Invalid or expired token");
    }
}

function isFileTypeSupport(type, supportedType) {
    return supportedType.includes(type)
}


async function uploadToCloudinary(file, folder, quality = null) {
    const option = { folder };
    option.resource_type = "auto";
    if (option) option.quality = quality;

    return await cloudinary.uploader.upload(file.tempFilePath, option)

}

// ✅ Routes
router.get("/", Islog, (req, res) => {
    res.redirect("Home2");
});

router.get("/signup", (req, res) => {
    res.render("singup"); // spelling corrected from "singup"
});

router.post("/signup", SingPage);

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", logInpage);

router.get("/logout", (req, res) => {
    res.clearCookie("GarryCookie"); // Better than setting it to ""
    res.redirect("/login");
});

// const { showPost } = require("../controllers/showpost");

// router.get("/home", Islog, async (req, res) => {
//     let user = await userData.findOne({ email: req.user.email })


//     const posts = await Post.find({}).populate('user').sort({ createdAt: -1 });
//     // console.log(posts);
//     // console.log(posts);
//     // console.log(JSON.stringify(posts.userName));





//     res.render("Home", { user, posts })

// })

// router.get("/home", Islog, findUser, (req, res) => {
//     res.render("Home", { username: req.userData.name }, showPost)
// });

router.get("/create", Islog, findUser, async (req, res) => {
    let user = await userData.findOne({ email: req.user.email })

    let users = await userData.find()


    const posts = await Post.find({}).populate('user').sort({ createdAt: -1 });
    // console.log(posts);
    // console.log(posts);
    // console.log(JSON.stringify(posts.userName));

    // console.log(users);





    res.render("create", { user, posts, users })

    // console.log(findUser);
});



router.post("/Create-post", Islog, async (req, res) => {
    let user = await userData.findOne({ email: req.user.email });

    let { content, description } = req.body;
    if (!req.files || !req.files.file) {
        return res.status(400).send("No file uploaded.");
    }

    // let file = req.files.file;
    const file = req.files.file;

    const supportedType = [".jpg", ".jpeg", ".png", ".JPG", ".HEIC"]
    // const fileType = path.extname(file.name)
    const fileType = path.extname(file.name)
    console.log(fileType);


    if (!isFileTypeSupport(fileType, supportedType)) {
        return res.status(400).json({
            message: "File Type not Support"
        })
    }

    const fileSizeMb = file.size / (1024 * 1024);
    const quality = fileSizeMb > 20 ? 80 : null;

    const responce = await uploadToCloudinary(file, "VibeShare", quality)

    console.log(responce);











    // console.log(__dirname);
    // let path = __dirname + "/file/" + Date.now() + `.${file.name.split(`.`)[1]}`
    // console.log(path);
    // file.mv(path, (err) => {
    //     console.log(err);
    // })




    const post = await Post.create({
        userName: user.name,
        content,
        description,
        user: user._id, // <-- Include this to satisfy the schema
        fileUlr: responce.secure_url,

    });

    // Make sure user has a posts array
    if (!user.posts) {
        user.posts = [];
    }

    user.posts.push(post._id);
    await user.save();

    res.redirect("/home2");



});


router.get("/mypost", Islog, async (req, res) => {
    let user = await userData.findOne({ email: req.user.email }).populate('posts');
    // console.log(user.posts);


    let user2 = await userData.findOne({ email: req.user.email })

    let users = await userData.find()


    const posts = await Post.find({}).populate('user').sort({ createdAt: -1 });
    // console.log(posts);
    // console.log(posts);
    // console.log(JSON.stringify(posts.userName));

    // console.log(users);




    res.render("mypost", { user, user2, posts, users })


})


router.get("/like/:id", Islog, async (req, res) => {
    const post = await Post.findOne({ _id: req.params.id }).populate('user')
    // console.log(post.like);
    // console.log("req.user.id=", req.user.id);

    if (post.like.indexOf(req.user.id) === -1) {
        post.like.push(req.user.id)
    } else {
        post.like.splice(post.like.indexOf(req.user.id), 1)
    }
    // console.log(req.user.id);
    await post.save()
    // post.like.push()
    // console.log(posts);
    res.redirect("/Home2")
})

router.get("/edit/:id", Islog, async (req, res) => {
    const post = await Post.findOne({ _id: req.params.id }).populate('user')
    // console.log(post.content);
    let user = await userData.findOne({ email: req.user.email })
    res.render("edit", { post, user })
})



// router.post("/update/:id", Islog, checkPostOwnership, async (req, res) => {
//     const post = await Post.findOneAndUpdate({ _id: req.params.id }, { content: req.body.content, description: req.body.description })

//     let user = await userData.findOne({ email: req.user.email })

//     // res.redirect("/home", { post, user })
//     res.redirect("/home");
// })


router.post("/update/:id", Islog, checkPostOwnership, updatePost)

//     async (req, res) => {
//     const post = await Post.findOne({ _id: req.params.id }).populate('user')
//     let user = await userData.findOne({ email: req.user.email })
//     // console.log(post.content);
//     console.log(req.user.id);

//     console.log(post.user.id);
//     // console.log(req.params._id);
//     // 68892401e86f7b18342cde94
//     // 68892401e86f7b18342cde94


//     // console.log(user);

//     // console.log(req.params._id);


//     // (post.id !== req.user._id)
// });


router.get("/demo", (req, res) => {
    res.render("demo")
})

router.get("/Home2", Islog, async (req, res) => {
    let user = await userData.findOne({ email: req.user.email })

    let users = await userData.find()


    const posts = await Post.find({}).populate('user').sort({ createdAt: -1 });
    // console.log(posts);
    // console.log(posts);
    // console.log(JSON.stringify(posts.userName));

    // console.log(users);





    res.render("Home2", { user, posts, users })
    // res.render("Home2")
})

router.get("/about", Islog, async (req, res) => {
    let user = await userData.findOne({ email: req.user.email })

    let users = await userData.find()


    const posts = await Post.find({}).populate('user').sort({ createdAt: -1 });

    res.render("about", { user, posts, users })

})


module.exports = router;
