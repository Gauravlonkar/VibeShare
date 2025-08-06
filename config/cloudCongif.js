const clodinary = require("cloudinary").v2
require("dotenv").config()


exports.clodinaryConnect = () => {
    try {

        clodinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET
        })

        console.log("Successfully Connect to Clodinary")





    } catch (err) {
        console.log(err);
        console.log("Err in Connect to Cloudinary Cloud");


    }
}

