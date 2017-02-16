# Azure Web Apps Node.js Todo Sample

Quick demo on how to run a Node.js App on Azure

## Important pieces

### web.config

This file contains the info to tell us which file to start (in this case, `bin/www`)

### .deployment

This file tells us which file contains the deployment commands

### deploy.cmd

This file will run npm install for us when we deploy to the Azure Web App

## Set up on Azure

1. Fork this repo
2. Create a Web App
3. Add DB connection info as App Settings
    - PGUSER
    - PGPASSWORD
    - PGDATABASE
    - PGSERVER
4. Set up GitHub deployment
    1. Click on Deployment Options
    2. Choose GitHub
    3. Select the forked repo
    4. Click on Deployment Options again and wait for it to complete
5. Visit home page

## Develop and run locally

1. Clone this repo
2. Set up env variables
    - PGUSER
    - PGPASSWORD
    - PGDATABASE
    - PGSERVER
3. Run `npm install`
4. Run `npm start`

If you want to modify the server code, you'll need to run `npm run build` from the root directory

If you want to modify the client library, you'll need to navigate to the client directory and run `npm run build`

## LICENSE

[MIT](LICENSE)