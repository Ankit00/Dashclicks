const fs = require('fs');
const readline = require('readline');
const {
    google
} = require('googleapis');
const gmail = google.gmail('v1');
const express = require('express');
const app = express();

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Gmail API.
    authorize(JSON.parse(content), fetchTenMails);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const {
        client_secret,
        client_id,
        redirect_uris
    } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

//For Fetching Mail IDs
const getMessageIds = (maxResults, auth) => {
    return new Promise((resolve, reject) => {
        gmail.users.messages.list({
            auth,
            userId: 'me',
            maxResults
        }, (err, res) => {
            if (err) reject(err)
            resolve(res.data.messages.map((el) => el.id))
        });
    })
}

//For Fetching a particular mail with id
const getMailById = (auth, mailId) => {
    return new Promise((resolve, reject) => {
        gmail.users.messages.get({
            id: mailId,
            userId: 'me',
            auth
        }, (error, response) => {
            if (error) reject(error)
            resolve(response.data);
        })
    })
}

//For Fetching Given Number of Mails(Default 10) 
const fetchTenMails = async (auth) => {
    let mailArray = new Array();
    const messageIds = await getMessageIds(2, auth);
    console.log(messageIds);
    Promise.all(messageIds.map(async id => {
        const mail = await getMailById(auth, id)
        mailArray.push(mail);
        console.log(mailArray);
    }));
}
app.use('/', fetchTenMails);
app.use('/:id', getMailById);

app.listen(3000, () => {
    console.log('Server listening to port 3000')
})