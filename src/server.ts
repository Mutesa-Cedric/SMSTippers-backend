require('dotenv').config();
import express = require("express");
import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");
import { dbConnection } from "./utils/dbConnection";
import isAuthenticated from "./middlewares/auth";
import authRouter from "./modules/auth/authRouter";
import ticketsRouter from "./modules/tickets/ticketsRouter";
import referralsRouter from "./modules/referrals/referralsRouter";
import userRouter from "./modules/user/userRouter";
import topupRouter from "./modules/topup/topupRouter";
import ordersRouter from "./modules/orders/ordersRouter";
import rentalsRouter from "./modules/rentals/rentalsRouter";

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

// cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});


// router middlewares
app.use("/auth", authRouter);
app.use("/tickets", isAuthenticated, ticketsRouter);
app.use("/referrals", isAuthenticated, referralsRouter);
app.use("/users", isAuthenticated, userRouter);
app.use("/topup", isAuthenticated, topupRouter);
app.use("/orders", isAuthenticated, ordersRouter);
app.use("/rentals", isAuthenticated, rentalsRouter);


app.get("/", (req, res) => {
    res.send("hello smstippers");
});

