# Dashclicks

Interview Project

Hello and welcome to this gmail api for fetching mails from your gmail and displaying them on the brpwser.

Steps To Use :

Kindly clone the project to your IDE (Eg. Eclipse or Atom)
You need to run the index.js file using command node index.js and
There are following 2 API's in this application

1. For fetching top 10 mails we have an alias --> localhost:3000/gmailApi/v1/top-10-mails
2. For fetching mail using message id --> localhost:3000/gmailApi/v1/mails/{messageID}
   (eg. localhost:3000/gmailApi/v1/mails//17135da4a73af5a0)

You can open and test these API's on any browser or postman.

Note -> For the first time when you'll hit any of these api's you'll be asked to click on a link on the console. On clicking it you'll be provided a token code to authenticate which needs to be pasted on the console.
After that a token.json file will be generated and as long as its there there is no need to authenticate again.

Mail data would be encrypted but in case you want to decrypt that data you can uncomment the code from line number 37 - 47 in the mailController.js file present in Controllers directory.

Thank You For Using!!
