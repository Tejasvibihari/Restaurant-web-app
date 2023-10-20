import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import ejs from "ejs";

const app = express();
const port = 3000;


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// Connect to MongoDB database

// mongoose.connect("mongodb://127.0.0.1:27017/restaurentDB")
//     .then(() => {
//         console.log("Database Created Succesfuly");
//     })
//     .catch((err) => {
//         comsole.log(err);
//     });

app.get("/", (req, res) => {
    res.render("index.ejs");
});
app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
});
app.get("/pizza", (req, res) => {
    res.render("pizza.ejs");
});
app.get("/burgur", (req, res) => {
    res.render("burgur.ejs");
});
app.get("/beverage", (req, res) => {
    res.render("beverage.ejs");
});












app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})