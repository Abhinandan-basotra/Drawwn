import express from 'express';
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

dotenv.config({})

const app = express();

app.use(cookieParser());
app.use(express.urlencoded());
app.use(express.json());


const port = process.env.PORT;
app.listen(port, () => {
    console.log("server is running on ", port);
})