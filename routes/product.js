const express = require('express');
const Product = require('../schemas/ProductSchema')
const User = require('../schemas/userSchema');
const router = express.Router();
const { default: mongoose } = require('mongoose');
const multer = require('../middlewares/multer')

const URL = `http://localhost:5000`



router.post("/addproduct", multer.upload.single("file"), async (req, res) => {
    try {
        console.log(req.file)
        //Will send the email

        const newProduct = new Product({
            ownerId: req.body.ownerId,
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            productImage: `${URL}/api/image/${req.file.filename}`,
            location:req.body.location,
            quantity: req.body.quantity,
            rating: 0,
            ratingCount: 0
        });
        let productId;
        const saved = await newProduct.save(function (err, product) {
            if (err) {
                console.log(err);
                res.send('bad request').status(400)

            }
            else {
                let productId = product._id.toString();
                //let slice = productId.slice(14, 38);
                res.send(productId).status(200);
                console.log(productId);

            }
        });
    } catch (error) {
        console.log(error);
        res.send(error).status(400);
    }
})

router.post("/addtemporaryproduct", async (req, res) => {
    try {
        const newProduct = new Product({
            ownerId: req.body.ownerId,
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            quantity: req.body.quantity,
            rating: 0,
            ratingCount: 0
        });
        let productId;
        const saved = await newProduct.save(function (err, product) {
            if (err) {
                console.log(err);
                res.send('bad request').status(400)

            }
            else {
                let productId = product._id.toString();
                //let slice = productId.slice(14, 38);
                res.send(productId).status(200);
                console.log(productId);

            }
        });
    } catch (error) {
        console.log(error);
        res.send(error).status(400);
    }
})

router.post("/getproducts", async (req, res) => {
    try {
        let products = await Product.find({ quantity: { $ne: 0 } });
        let user = await User.findOne({ _id: mongoose.Types.ObjectId(req.body.id) })
        let fruits, vegetables, foodGrains, reccomended, reccomend=[];

        if (user) {
            if (user.fruits != 0 || user.vegetables != 0 || user.foodGrains != 0) {
                if (user.fruits >= user.vegetables && user.fruits >= user.foodGrains) {
                    if (user.fruits === user.vegetables && user.fruits === user.foodGrains) {
                        fruits = await Product.find({ category: "Fruits" })
                        vegetables = await Product.find({ category: "Vegetables" })
                        foodGrains = await Product.find({ category: "Foodgrains" })
                        reccomend.push(fruits)
                        reccomend.push(vegetables)
                        reccomend.push(foodGrains)
                        res.status(200).send({allproducts:products, reccomended:reccomend})

                    } else if (user.fruits === user.vegetables) {
                        fruits = await Product.find({ category: "Fruits" })
                        vegetables = await Product.find({ category: "Vegetables" })
                        reccomend.push(fruits)
                        reccomend.push(vegetables)
                        res.status(200).send({allproducts:products, reccomended:reccomend})
                        
                    } else if (user.fruits === user.foodGrains) {
                        fruits = await Product.find({ category: "Fruits" })
                        foodGrains = await Product.find({ category: "Foodgrains" })
                        reccomend.push(fruits)
                        reccomend.push(foodGrains)
                        res.status(200).send({allproducts:products, reccomended: reccomend})
                    } else {
                        fruits = await Product.find({ category: "Fruits" })
                        res.status(200).send({allproducts:products, reccomended: fruits})
                    }
                } else if (user.vegetables >= user.foodGrains) {
                    if (user.vegetables === user.foodGrains) {
                        vegetables = await Product.find({ category: "Vegetables" })
                        foodGrains = await Product.find({ category: "Foodgrains" })
                        reccomend.push(vegetables)
                        reccomend.push(foodGrains)
                        res.status(200).send({allproducts:products, reccomended:reccomend})
                    } else {
                        vegetables = await Product.find({ category: "Vegetables" })
                        res.status(200).send({allproducts:products, reccomended:vegetables})
                    }
                } else {
                    foodGrains = await Product.find({ category: "Foodgrains" })
                    res.status(200).send({allproducts:products, reccomended:foodGrains})
                }
            }else{

                res.status(200).send({allproducts:products, reccomended:[]})
            }
        }

    } catch (error) {
        res.send(error);
        console.log(error);
    }
})


router.get('/allproducts', async (req, res) => {
    try {
        let products = await Product.find({ quantity: { $ne: 0 } });
        if (products.length > 0) {
            products.reverse();
            res.send(products);
        } else {
            res.send({ result: "No products found" })
        }
    } catch (error) {
        console.log(error)
    }
})




module.exports = router;