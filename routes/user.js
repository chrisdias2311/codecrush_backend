const express = require('express');
const User = require('../schemas/userSchema');
const router = express.Router();
const bcrypt = require('bcrypt');
const auth = require('../mailhandelling/auth');
const otpGenerator = require('otp-generator');
const mongoose = require('mongoose')

router.post("/register", async (req, res) => {

    const saltRounds = 10;
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) return res.status(400).send("Account already exists");

        //bcrypt encryption
        console.log(req.body.password)
        bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
            console.log(hash);
            if (err) {
                console.log(err)
                res.send('error generating hash').status(500)
            }
            else {
                const NewUser = new User({
                    email: req.body.email,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    password: hash,
                    fruits:0,
                    vegetables:0,
                    foodGrains:0,
                    verified:"No",
                })
                //save user here
                const saved = await NewUser.save().then((result) => {
                    console.log('user created');
                    res.status(200).send(NewUser);
                }).catch((err) => {
                    console.log(err)
                });
            }
        })
    } catch (error) {
        console.log(error);
        res.send(error).status(500)
    }
})

router.post("/getuser", async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.verifyEmail }); //find user here
        if (user) {
            res.status(200).send(user);
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
        let user = await User.findOne({ email: req.body.email }); //find user here
        if (user) {
            //bcrypt compare
            const match = await bcrypt.compare(req.body.password, user.password);
            if (match) {
                console.log('match')
                res.send(user).status(200);
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

router.get('/generateotp/:email', async (req, res) => {
    const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, specialChars: false });
    const user = await User.findOne({ email: req.params.email })

    if (user) {
        if (user.verified === 'Yes') {
            res.status(400).send("Email verified")
        }
        else {
            try {
                let test = await User.updateOne({ _id: mongoose.Types.ObjectId(user._id) }, { $set: { verified: otp } })
                console.log(test);
                auth.sendOtp(otp, user.email);
                console.log(user.email)
                res.status(200).send('generated');
            } catch (err) {
                console.log(err)
                res.status(400).send(err);
            }
        }
    } else {
        res.status(400).send("No user found")
    }
})

router.get('/verifyotp/:email/:otp', async (req, res) => {

    const user = await User.findOne({ email: req.params.email });
    console.log(user);

    if (user) {
        if (user.verified === 'yes') {
            res.send("already verified")
        }
        else {
            if (user.verified == req.params.otp) {
                console.log('passed')
                const update = await User.updateOne({ email: req.params.email }, { $set: { verified: 'yes' } })
                console.log("verified");
                res.send(update);
            }
        }
    } else {
        res.status(400).send("No user found")
    }
})


module.exports = router;