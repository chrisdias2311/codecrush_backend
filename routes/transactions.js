const express = require('express');
const Product = require('../schemas/ProductSchema')
const User = require('../schemas/userSchema');
const router = express.Router();
const { default: mongoose } = require('mongoose');
const multer = require('../middlewares/multer')
const Transaction = require('../schemas/TransactionSchema');
const Farmer = require('../schemas/FarmerSchema')


function distance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180; // Convert degrees to radians
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in km

    console.log(distance)
    return distance;
}

function extractLatLongFromMapsUrl(url) {
    console.log('url:', url);
    const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
        const latitude = match[1];
        const longitude = match[2];
        return { latitude, longitude };
    } else {
        return null;
    }
}


router.post("/createtransaction", async (req, res) => {
    try {
        const owner = await Farmer.findOne({ _id: req.body.ownerId })
        const product = await Product.findOne({ _id: req.body.id })
        let transDate = (new Date).toString()
        let slicedDate = transDate.substring(0, 16);

        // console.log("Product loc: ", product.location)
        // console.log("Buyer location: ", req.body.location);

        const ownerLatLong = extractLatLongFromMapsUrl(product.location);
        const buyerLatLong = extractLatLongFromMapsUrl(req.body.location);

        const dist = distance(ownerLatLong.latitude, ownerLatLong.longitude, buyerLatLong.latitude, buyerLatLong.longitude)

        const newTransaction = new Transaction({
            productId: req.body.id,
            ownerId: req.body.ownerId,
            ownerName: owner.firstname + ' ' + owner.lastname,
            ownerPhone: owner.phone,
            ownerLocation: product.location,
            buyerName: req.body.name,
            buyerPhone: req.body.phone,
            buyerLocation: req.body.location,
            orderDate: slicedDate,
            distance: dist,
            status: "Ordered",
            productName:product.name,
            productCategory:product.category
        });

        const saved = await newTransaction.save(function (err, transaction) {
            if (err) {
                console.log(err);
                res.send('bad request').status(400)
            }
            else {
                let transactionId = transaction._id.toString();
                //let slice = productId.slice(14, 38);
                res.send(transactionId).status(200);
                console.log(transactionId);
            }
        });

    } catch (error) {
        console.log(error);
        res.send(error).status(400);
    }
})

router.post('/updateone', async(req, res)=>{
    try {
        const transaction = await Transaction.findOne({ _id: mongoose.Types.ObjectId(req.body.id)  });
        if(transaction){
            try {
                let test = await Transaction.updateOne(
                    { _id: mongoose.Types.ObjectId(transaction._id) },
                    { $set: { status: "Out for delivery" } }
                )
                res.status(200).send("Transaction updated successfully")
            } catch (error) {
               res.status(400).send(error) 
               console.log(error)
            } 
        }else{
            res.status(401).send("Transaction not found")
        }
    } catch (error) {
        res.status(400).send("Couldn't update transaction")
    }
})

router.post('/updatetwo', async(req, res)=>{
    try {
        const transaction = await Transaction.findOne({ _id: mongoose.Types.ObjectId(req.body.id)  });
        if(transaction){
            try {
                let test = await Transaction.updateOne(
                    { _id: mongoose.Types.ObjectId(transaction._id) },
                    { $set: { status: "Delivered" } }
                )
                res.status(200).send("Transaction updated successfully")
            } catch (error) {
               res.status(400).send(error) 
               console.log(error)
            }
            
        }else{
            res.status(401).send("Transaction not found")
        }
    } catch (error) {
        res.status(400).send("Couldn't update transaction")
    }
})
router.post('/gettransaction', async(req, res)=>{
    try {
        const transaction = await Transaction.findOne({ _id: mongoose.Types.ObjectId(req.body.id)  });
        if(transaction){
            res.status(200).send(transaction)
            
        }else{
            res.status(401).send("Transaction not found")
        }
    } catch (error) {
        res.status(400).send("Couldn't update transaction")
    }
})

router.get('/alltransactions', async (req, res) => {
    try {
        let transactions = await Transaction.find({});
        if (transactions.length > 0) {
            res.send(transactions);
        } else {
            res.send({ result: "No transactions found" })
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/getmytransactions', async(req, res)=>{
    try {
        const transactions = await Transaction.find({ ownerId: mongoose.Types.ObjectId(req.body.id)  });
        if(transactions){
            res.status(200).send(transactions)
        }else{
            res.status(401).send("Transaction not found")
        }
    } catch (error) {
        res.status(400).send("Couldn't update transaction")
    }
})






module.exports = router;