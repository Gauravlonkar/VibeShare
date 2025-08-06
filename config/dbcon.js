const moongose = require("mongoose")
require("dotenv").config();
console.log(process.env.DATABASE_URL);

const dbconnect = () => moongose.connect(process.env.DATABASE_URL, {

}

)


    .then(() => {
        console.log("Db Connected");

    })

    .catch((err) => {
        console.log("Error In Db Connection");
        console.log(err);


    })





module.exports = dbconnect;