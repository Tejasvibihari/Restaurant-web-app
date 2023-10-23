import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import session from "express-session";
import fs from "fs";
import QRCode from 'qrcode';

const app = express();
const port = 3000;



app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("uploads"));

app.use(session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
}));
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

// Image Upload

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
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

// Product Schema 

const productSchema = new mongoose.Schema({
    // _id: {
    //     type: Number,
    //     required: true,
    // },
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

// Coustomer Schema 

const coustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    mobile: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    // time: {
    //     type: Date,
    //     required: true
    // },
    group: {
        type: String,
        required: true
    }
})
const Coustomer = mongoose.model("Coustomer", coustomerSchema);




app.get("/", (req, res) => {
    const pizzaPromise = Product.find({ type: "pizza" }).exec();
    const burgerPromise = Product.find({ type: "burgur" }).exec();
    const beveragePromise = Product.find({ type: "beverage" }).exec();

    Promise.all([pizzaPromise, burgerPromise, beveragePromise])
        .then(([pizzaProducts, burgerProducts, beverageProducts]) => {
            res.render("index.ejs", {
                pizzaproduct: pizzaProducts,
                burgurproduct: burgerProducts,
                beverageproduct: beverageProducts
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});




app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
});
app.get("/pizza", (req, res) => {
    Product.find({ type: "pizza" })
        .then((pizzaproduct) => {
            res.render("pizza.ejs", ({ pizzaproduct: pizzaproduct }));
        })
        .catch((err) => {
            console.log(err);
        })

});
app.get("/burgur", (req, res) => {
    Product.find({ type: "burgur" })
        .then((burgurproduct) => {
            res.render("burgur.ejs", ({ burgurproduct: burgurproduct }));
        })
        .catch((err) => {
            console.log(err);
        })
});
app.get("/beverage", (req, res) => {
    Product.find({ type: "beverage" })
        .then((beverageproduct) => {
            res.render("beverage.ejs", ({ beverageproduct: beverageproduct }));
        })
        .catch((err) => {
            console.log(err);
        })
});
app.get("/addproduct", (req, res) => {
    res.render("addproduct.ejs");
});

app.get("/product", (req, res) => {
    Product.find({})
        .then((productDetail) => {
            res.render("product.ejs", ({ product: productDetail }));
        })
        .catch((err) => {
            console.log(err);
        });
});

// Delete Product 

app.get("/delete/:id", async (req, res) => {
    const id = req.params.id;

    try {
        // Find the product by ID.
        const product = await Product.findById(id);

        // If the product is not found, return an error.
        if (!product) {
            return res.json({ message: "Product not found." });
        }

        // If the product has an image, delete it.
        if (product.imagePath) {
            await fs.promises.unlink(`./uploads/${product.imagePath}`);
        }

        // Delete the product from the database.
        await Product.findByIdAndRemove(id);

        // Set a success message in the session.
        req.session.message = {
            type: "success",
            message: "Product deleted successfully.",
        };

        // Redirect the user to the product list page.
        res.redirect("/product");
    } catch (err) {
        // Handle the error.
        res.json({ message: err.message });
    }
});


// Edit Product 

app.get("/edit/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const product = await Product.findById(id);

        // If the product is not found, redirect to the home page.
        if (!product) {
            return res.redirect("/");
        }

        // Render the edit product page with the product details.
        res.render("editProduct.ejs", { title: "Edit Product", product });
    } catch (error) {
        // Handle the error.
        res.redirect("/");
    }
});

app.get("/bookTable", (req, res) => {
    res.render("bookTable.ejs");
});

app.get("/bookingdetail", (req, res) => {
    Coustomer.find({})
        .then((coustomerDetail) => {
            res.render("bookingdetail.ejs", ({ coustomer: coustomerDetail }));
        })
        .catch((err) => {
            console.log(err);
        })
});
app.get("/orderSuccess", (req, res) => {
    res.render("orderSuccess.ejs");
});








app.post("/addproduct", upload.single("image"), (req, res) => {
    // const id = req.body["id"];
    const name = req.body["name"];
    const description = req.body["description"];
    const price = req.body["price"];
    const type = req.body["type"];
    const file = req.file.filename;

    const product = new Product({
        // _id: id,
        name: name,
        description: description,
        price: price,
        type: type,
        imagePath: file
    });


    product.save()
        .then(() => {
            req.session.message = {
                type: "success",
                message: "Product added Successfully"
            }
        })
        .catch((err) => {
            console.log(err);
        })
    res.redirect("/product")
});

// Update Product Route 
app.post("/update/:id", upload.single("image"), async (req, res) => {
    const id = req.params.id;
    let newImage = "";

    if (req.file) {
        newImage = req.file.filename;
        try {
            await fs.promises.unlink(`./uploads/${req.body.oldImage}`);
        } catch (err) {
            console.log(err);
        }
    } else {
        newImage = req.body.oldImage;
    }

    try {
        const result = await Product.findByIdAndUpdate(id, {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            type: req.body.type,
            imagePath: newImage,
        });

        req.session.message = {
            type: "success",
            message: "Product updated successfully.",
        };

        res.redirect("/product");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

app.post("/bookTable", (req, res) => {
    const name = req.body["name"];
    const email = req.body["email"];
    const mobile = req.body["mobile"];
    const date = req.body["date"];
    // const time = req.body["time"];
    const group = req.body["group"];

    const coustomer = new Coustomer({
        name: name,
        email: email,
        mobile: mobile,
        date: date,
        // time: time,
        group: group
    });

    coustomer.save()
        .then(() => {

        })
        .catch((err) => {
            console.log(err);
        })


    res.redirect("/orderSuccess");
});


// With promises








app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})