const express = require('express');
const User = require('../schemas/userSchema');
const Farmer = require('../schemas/FarmerSchema')
const router = express.Router();
const bcrypt = require('bcrypt');
const auth = require('../mailhandelling/auth');
const otpGenerator = require('otp-generator');
const mongoose = require('mongoose')
const multer = require('../middlewares/multer')

const URL = `http://localhost:5000`


//Rigister (alternative to Signup)
router.post("/register", multer.upload.single("file"), async (req, res) => {

    const saltRounds = 10;
    try {
        const farmer = await Farmer.findOne({ phone: req.body.phone })

        if (farmer) {
            console.log(farmer)
            res.status(400).send("Account already exists");
            return
        } else {

            console.log("This is REQ FILE =", req.file);
            //bcrypt encryption
            bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
                console.log(hash);
                if (err) {
                    res.status(400).send('error generating hash')
                }
                else {
                    const newFarmer = new Farmer({
                        phone: req.body.phone,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        password: hash,
                        IdImage: `${URL}/api/image/${req.file.filename}`,
                        verified:"No"
                    });
                    const saved = await newFarmer.save((err, farmer) => {
                        if (err) {
                            console.log(err);
                            res.status(400).send('bad request');
                        }
                        else {
                            res.status(200).send(farmer)
                        }
                    });
                }
            })
        }
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

router.post("/getfarmer", async (req, res) => {
    try {
        let farmer = await Farmer.findOne({ phone: req.body.farmerPhone }); //find user here
        if (farmer) {
            res.status(200).send(farmer);
        } else {
            res.send("No user found").send(401);
        }
    } catch (error) {
        res.status(401).send(error);
        console.log(error);
    }
})

router.post("/login", async (req, res) => {
    try {
        let farmer = await Farmer.findOne({ phone: req.body.phone }); //find user here
        if (farmer) {
            //bcrypt compare
            const match = await bcrypt.compare(req.body.password, farmer.password);
            if (match) {
                console.log('match')
                res.send(farmer).status(200);
            }
            else {
                console.log('incorrect password')
                res.status(400).send('incorrect password')
            }
        } else {
            res.status(400).send("No user found");
        }
    } catch (error) {
        res.send(error);
        console.log(error);
    }
})


module.exports = router;