const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const methodOverride = require("method-override")
const nodemailer = require("nodemailer");
const Subscriber = require("./models/subscriber");

const app = express();
//app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
mongoose.connect("mongodb://localhost/app2", {useNewUrlParser: true});
app.use(methodOverride("_method"));

app.get("/user", (req, res) => {
    //res.render("user.ejs");    
    res.send("hello");
});

app.post("/user", (req, res) => {
    Subscriber.create({name: req.body.name, email: req.body.email});
    res.redirect("/user");
});

app.get("/admin", (req, res) => {
    res.render("admin.ejs");
});

app.post("/admin", (req, res) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'tarrasqueaohk@gmail.com',
            pass: 'fuckyouallhackers123'
        }
    });

    Subscriber.find({}, (err, fSubs) => {
        if (err) {
            console.log(err);
        } else {
            for (let i = 0; i < fSubs.length; i++) {
                let mailOptions = {
                    from: '"Brian" <tarrasqueaohk@gmail.com>',
                    to: `${fSubs[i].email}`,
                    subject: `${req.body.subject}`,
                    text: `Dear ${fSubs[i].name},\n${req.body.text}\nUnsubscribe: http://localhost:3000/unsub/${fSubs[i]._id}`
                    // html: `<a href="http://localhost:3000/unsub/${fSubs[i]._id}">Unsubscribe</a>`
                };
        
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(info);
                    }
                });
            }      
            res.redirect("/admin");
        }
    });
});

app.get("/unsub/:id", (req, res) => {
    res.render("unsub.ejs", {id: req.params.id});
});

app.delete("/unsub/:id", (req, res) => {
    Subscriber.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("back");
        }
    });   
});

app.listen(4000, () => {console.log("Server started port 4000")});