const express = require("express");
const {
    getTopTenMails,
    getMailById
} = require("./Routers/mailRouter")
const app = express();

app.get('/gmailApi/v1/top-10-mails', getTopTenMails);

app.get('/gmailApi/v1/mails/:id', getMailById);

app.listen(3000, () => {
    console.log("Server listening to port 3000");
});