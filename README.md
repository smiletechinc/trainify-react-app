#1) Install and Run the App
a) Run these commands to install and run the app;

cd ./crm-client npm install npm start

Then visit the app URL in your browser.

b) You will need a "config.local.ts" to place in the folder "./crm-client/config" Please ask for this file to start local development

c) Next you will need a username and password for our test server to login and use the app locally. Please ask for this login.

##2) Where to Find our API Docs
Our API docs are all on Postman. You will need to ask for a login to access them here https://gotoapi.postman.co/workspaces

Troubleshooting Steps
========================

Build and Start Errors/Issues
Sometimes some code changes cause some build issues. Always try these commands first before asking for help

rm -rf ./src/.umi npm install --force npm start

If still doesnt work try this

n 16.13.1 rm -rf ./src/.umi rm -rf node_modules rm package-lock.json rm yarn.lock npm install --force npm start

Update the Web Designer Plugin
npm update web-designer@https://fedora_dist:dQawFkKQKyMTg9meWEGU@bitbucket.org/procrmco/dist-web-designer.git#dev

npm install web-designer@https://fedora_dist:dQawFkKQKyMTg9meWEGU@bitbucket.org/procrmco/dist-web-designer.git#dev
