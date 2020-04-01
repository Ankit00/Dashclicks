# Dashclicks

Interview Project

Hello and welcome to this gmail api for fetching mails from your gmail and displaying them on the brpwser.

Steps To Use :

Kindly clone the project to your IDE (Eg. Eclipse or Atom)
You need to run the index.js file using command node index.js and follow the steps mentioned in the console.
There are following 2 API's in this application

1. For fetching top 10 mails we have an alias --> localhost:3000/gmailApi/v1/top-10-mails
2. For fetching mail using message id --> localhost:3000/gmailApi/v1/mails/{messageID}
   (eg. localhost:3000/gmailApi/v1/mails//17135da4a73af5a0)

You can open and test these API's on any browser or postman.
Mail data would be encrypted but in case you want to decrypt that data you can uncomment the code from line number 37 - 42 in the mailController.js file present in Controllers directory.

Thank You For Using!!
