const mongoose = require("mongoose");

let subscriberSchema = new mongoose.Schema({
    name: String,
    email: String
});

let Subscriber = mongoose.model("Subscriber", subscriberSchema);
module.exports = Subscriber;