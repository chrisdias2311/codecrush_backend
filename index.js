const express = require('express');
const app = express();
const ConnectionDB = require("./database");
const cors = require('cors')
const expressSession = require('express-session')

ConnectionDB();


app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }))
app.use(expressSession({ secret: "secret", resave: false, saveUninitialized: false }));


app.use('/api/image', require('./middlewares/multer').router)
app.use('/api/user', require('./routes/user'))
app.use('/api/product', require('./routes/product'))
app.use('/api/farmer', require('./routes/farmer'))

app.listen(5000, () => {
    console.log(`server is running on port 5000`);
})