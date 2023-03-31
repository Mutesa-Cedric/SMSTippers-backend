import mongoose = require("mongoose");

const dbUrl_dev = process.env.MONGOURL_DEV as string;
const dbUrl_prod = process.env.MONGOURL_PROD as string;
const dbUrl = process.env.NODE_ENV === "development" ? dbUrl_dev : dbUrl_prod;

export const dbConnection = async () => {
    // try {
    await mongoose.connect(dbUrl);
    // console.log('Database connected');
    // } catch (error) {
    //     console.log(error);
    // }
};
