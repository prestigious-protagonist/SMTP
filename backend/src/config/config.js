require("dotenv").config();
module.exports = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    APP_BASE_URL: process.env.APP_BASE_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD
    
    

}