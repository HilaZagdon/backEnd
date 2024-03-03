const dotenv = require("dotenv");

dotenv.config();

const {MONGO_URL}= process.env;

const config={MONGO_URL};

console.log(process.env);

module.exports = {config};