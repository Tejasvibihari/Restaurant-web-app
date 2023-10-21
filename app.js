import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import ejs from "ejs";
import multer from "multer";

const app = express();
const port = 3000;


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Image Upload

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now + "_" + file.originalname);
    },
});

const upload = multer({
    storage,
});

// Connect to MongoDB database

mongoose.connect("mongodb://127.0.0.1:27017/restaurantDB")
    .then(() => {
        console.log("Database Created Succesfuly");
    })
    .catch((err) => {
        comsole.log(err);
    });


const productSchema = new mongoose.Schema({
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
    type: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    }

});
const Product = mongoose.model("Product", productSchema);







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





app.post("/addproduct", upload.single("image"), (req, res) => {
    const id = req.body["id"];
    const name = req.body["name"];
    const description = req.body["description"];
    const price = req.body["price"];
    const type = req.body["type"];
    const file = req.file;

    if (!file) {
        // Handle the file upload error
        return res.status(400).send("File upload failed");
    }

    const product = new Product({
        _id: id,
        name: name,
        description: description,
        price: price,
        type: type,
        imagePath: `/uploads/${file.originalname}`
    });

    product.save();
    res.redirect("/product")
});






app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})