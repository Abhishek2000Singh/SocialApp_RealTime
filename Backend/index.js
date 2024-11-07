const express = require('express')
const app = express()
const dotenv = require('dotenv')
const helmet = require('helmet');
const morgan = require('morgan')
const port = 8800
const connectToMongo = require('./db')

connectToMongo()
dotenv.config()
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const multer = require('multer')
const path = require("path")

app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//Middleware
const cors = require('cors');
app.use(cors());


app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/assets");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("File uploded successfully");
    } catch (error) {
        console.error(error);
    }
});

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})