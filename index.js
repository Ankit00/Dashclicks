const fs = require('fs');
const readline = require('readline');
const {
    google
} = require('googleapis');
const gmail = google.gmail('v1');

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

//For Fetching One Mail (Practice)

const fetchOneMail = async (auth) => {
    await gmail.users.messages.list({
        auth: auth,
        userId: 'me',
        maxResults: 1
    }, async (error, response) => {
        if (error) return error;
        const messageId = response.data.messages[0].id;
        console.log(messageId);
        await gmail.users.messages.get({
            id: messageId,
            auth: auth,
            userId: 'me',
        }, (err, message) => {
            if (err) return err
            console.log(message.data);
            const data = message.data;
            if (data.payload && data.payload.body && data.payload.body.data) {
                const data = data.payload.body.data;
                const buff = Buffer.from(data, 'base64');
                console.log(buff.toString());
            }
            console.log(data);
        })
    })
}


//For Fetching 10 Mails

const fetchTenMails = (auth) => {
    let buntyBhai = new Array();
    gmail.users.messages.list({
        userId: 'me',
        auth,
        maxResults: 10
    }, (err, res) => {
        if (err) return err;
        const messageIds = res.data.messages.map(message => message.id);
        console.log(messageIds);

        const topTenMails = messageIds.map(id => {
            gmail.users.messages.get({
                id,
                auth,
                userId: 'me',
            }, (err, response) => {
                if (err) return err;
                const data = response.data;
                if (response.data && response.data.payload && response.data.payload.body && response.data.payload.body.data) {
                    const buffer = Buffer.from(response.data.payload.body.data, 'base64');
                    buntyBhai.push(buffer.toString());
                    console.log(buffer.toString())
                }
                buntyBhai.push(data);
                console.log(data);
            })
        });
    })
}