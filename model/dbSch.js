const { default: mongoose } = require("mongoose")
const User = require("mongoose")

const nodeMailer = require("nodemailer")

const PageSch = mongoose.Schema({
    name: {
        type: String,
        require: true

    },

    email: {
        type: String,
        require: true

    },

    password: {
        type: String,
        require: true

    },
    CreateDate: {
        type: Date,
        maxLength: 50,
        default: Date.now()
    },
    token: {
        type: String

    },

    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }]

})


PageSch.post("save", async function (doc) {
    if (!doc.isNew) return;

    try {

        // console.log(doc);

        let trans = nodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }

        })

        let Sdmail = await trans.sendMail({
            from: "Lonkar's Web-Tech",
            to: doc.email,
            subject: "Account Created",
            html: `<h2>Welcome to   Gaurav's Web-Tech!</h2>

<p>Hi <strong>${doc.name}</strong>,</p>

<p>Thank you for registering with <strong>Gaurav's Web-Tech</strong>. We're excited to have you on board!</p>

<p>Your account has been successfully created, and you can now access all our features and services.</p>

<p>If you have any questions or need assistance, feel free to reply to this email or contact our support team anytime.</p>

<hr>

<p>🚀 <strong>Let's build something amazing together!</strong></p>

<p>Warm regards,<br>
The Gaurav's Web-Tech Team</p>

<small>This is an automated message. Please do not reply directly to this email.</small>
`

        })


    } catch (err) {
        console.log(err);
        console.log("Err In post Schema");



    }

})


module.exports = User.model("PageData", PageSch)
