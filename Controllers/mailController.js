const authenticate = require("../utils/connections");
const {
    google
} = require("googleapis");
const gmail = google.gmail("v1");

//For Fetching Mail IDs
const getMessageIds = (maxResults, auth) => {
    return new Promise((resolve, reject) => {
        gmail.users.messages.list({
                auth,
                userId: "me",
                maxResults
            },
            (err, res) => {
                if (err) reject(err);
                resolve(res.data.messages.map(el => el.id));
            }
        );
    });
};

//For Fetching a particular mail with id
const getMailById = async (id) => {
    const auth = await authenticate();
    return new Promise((resolve, reject) => {
        gmail.users.messages.get({
                id,
                auth,
                userId: "me"
            },
            (error, response) => {
                if (error) reject(error);

                //Please Uncomment this Code for decoding the mail

                // if (response.data && response.data.payload &&
                //     response.data.payload.parts && response.data.payload.parts[0].body &&
                //     response.data.payload.parts[0].body.data) {
                //     const buffer = Buffer.from(response.data.payload.parts[0].body.data, 'base64');
                //     resolve(buffer.toString())
                // } 
                else {
                    resolve(response.data);
                }
            }
        );
    });
};

//For Fetching Given Number of Mails(Default 10)
const fetchTenMails = () => {
    return new Promise(async (resolve, reject) => {
        const auth = await authenticate();
        let mailArray = new Array();
        const messageIds = await getMessageIds(10, auth);
        Promise.all(
            messageIds.map(async id => {
                const mail = await getMailById(id);
                mailArray.push(mail);
            })
        ).then(() => {
            resolve(mailArray);
        });
    })
};

module.exports = {
    getMessageIds,
    fetchTenMails,
    getMailById
}