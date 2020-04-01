const fs = require("fs");
const readline = require("readline");
const {
    google
} = require("googleapis");


// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

// Load client secrets from a local file.
const getAuthentication = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/credentials.json`, async (err, content) => {
            if (err) reject("Error loading client secret file:", err);
            // Authorize a client with credentials, then call the Gmail API.
            const auth = await authorize(JSON.parse(content));
            resolve(auth);
        });
    })
};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials) {
    return new Promise((resolve, reject) => {
        const {
            client_secret,
            client_id,
            redirect_uris
        } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id,
            client_secret,
            redirect_uris[0]
        );

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, async (err, token) => {
            try {
                if (err) {
                    const auth = await getNewToken(oAuth2Client);
                    resolve(auth);
                }
                oAuth2Client.setCredentials(JSON.parse(token));
                resolve(oAuth2Client);
            } catch (error) {
                console.log("Hello!! You can begin your search");
            }
        });
    })

}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client) {
    return new Promise((resolve, reject) => {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: SCOPES
        });
        console.log("Authorize this app by visiting this url:", authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question("Enter the code from that page here: ", code => {
            oAuth2Client.getToken(code, (err, token) => {
                if (err) reject("Error retrieving access token", err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
                    if (err) return console.error(err);
                    console.log("Token stored to", TOKEN_PATH);
                    resolve(oAuth2Client);
                });
            });
            rl.close();
        });
    })
}

module.exports = getAuthentication;