require('dotenv').config();
import express = require("express");
import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");
import { rawBody } from "./middlewares/rawBody";
import authRouter from "./modules/auth/authRouter";
import depositsRouter from "./modules/deposit/depositRouter";
import ordersRouter from "./modules/orders/ordersRouter";
import referralsRouter from "./modules/referrals/referralsRouter";
import refundRouter from "./modules/refund/refundRouter";
import rentalsRouter from "./modules/rentals/rentalsRouter";
import ticketsRouter from "./modules/tickets/ticketsRouter";
import topupRouter from "./modules/topup/topupRouter";
import userRouter from "./modules/user/userRouter";
import { dbConnection } from "./utils/dbConnection";
const PORT = process.env.PORT || 3000;

const app = express();
dbConnection().then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}).catch((err) => {
    console.log(err);
});

app.use(bodyParser.json())
app.use(cookieParser());

// @ts-ignore   
// app.use(rawBody)

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin ? req.headers.origin : "https://smstippers.com");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
    next();
});

app.use((req, res, next) => {
    console.log(req.originalUrl, "\t", req.method, "\t", req.url);
    next();
});

// router middlewares
app.use("/auth", authRouter);
app.use("/tickets", ticketsRouter);
app.use("/referrals", referralsRouter);
app.use("/users", userRouter);
app.use("/topup", topupRouter);
app.use("/orders", ordersRouter);
app.use("/rentals", rentalsRouter);
app.use("/refund", refundRouter);
app.use("/deposits", depositsRouter);

app.get("/", (req, res) => {
    res.send("hello smstippers");
});
