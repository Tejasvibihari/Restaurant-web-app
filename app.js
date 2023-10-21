import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import ejs from "ejs";

const app = express();
const port = 3000;


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// Connect to MongoDB database

mongoose.connect("mongodb://127.0.0.1:27017/restaurentDB")
    .then(() => {
        console.log("Database Created Succesfuly");
    })
    .catch((err) => {
        comsole.log(err);
    });


const pizzaSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    }

});
const Pizza = mongoose.model("Pizza", pizzaSchema);

const burburSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    }

});
const Burger = mongoose.model("Burger", burburSchema);
const beverageSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    }

});
const Beverage = mongoose.model("Beverage", beverageSchema);





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
app.get("/addproduct", (req, res) => {
    res.render("addproduct.ejs");
});

app.get("/product", (req, res) => {
    res.render("product.ejs");
});


app.post("/addproduct", (req, res) => {
    const id = req.body["id"];
    const name = req.body["name"];
    const description = req.body["description"];
    const price = req.body["price"];
})









app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})