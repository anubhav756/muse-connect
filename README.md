# Muse For Professionals Dashboard - React Project#
 
## OVERVIEW
The Muse For Professionals Dashboard is a web-based app for healthcare professionals working with clients who use Muse: the brain sensing headband. 

## LOCAL DEVELOPMENT
If you are running this project for the first time, you need to install the dependencies by running

`npm install`

To run the project

`npm start`

In your browser, go to `http://127.0.0.1:8888/`.

## Building and deploying

### Building 

```
# Build for staging:
npm run build-staging

# Build for production:
npm run build-production
```

Built bundles will be located in the `build` folder


### Deploying

Deployment happens through Google App Engine. This repository is included in the Appcloud repo as a submodule (`APPCLOUD/apps/museconnect/frontend`).


## Testing

Tests can be run by `npm run test`. This will run all the tests written for the application.
 
## PREVIOUS VERSIONS
A beta version of this product already exists and can be accessed through https://pro.choosemuse.com. This version is written in Ember.js and is no longer being maintained. For interest, It can be accessed with the following credentials:
Username: prodemo@interaxon.ca, Password: demopro
The new version of the app will be written in React.js and is a full re-write of the front-end app. 

## CONTRIBUTION GUIDELINES
The code repository can be found at: https://bitbucket.org/interaxon/muse-for-professionals-dashboard-react 
One of our goals during development is to maintain a stable state in the master branch for all projects contained in the repo. To contribute, create a feature branch for your changes based off of the master branch.
Your feature branch must follow this format: <your name>/<feature description> (e.g., bob/lob_law_feature). You can use the asana task name as the feature description, or create your own
Once you've completed your feature, you must create a pull request (PR) in bitbucket and assign your PR to be reviewed by Jasna Todorovic. Your PR must be approved by the assignee before it can be merged into the master branch.

## TICKET PROCESS GUIDELINES
Our tickets are tracked in Asana: https://app.asana.com/0/281543613512724/board 
All tickets in the To Do column are ready for development. When working on a ticket, move it from the To Do column to the Doing column and assign it to yourself. When development is complete and a PR is created, move the ticket to the Code Review column and assign it to Jasna. The rest of the columns will be used by InteraXon internally unless otherwise specified.  

## CODE GUIDELINES
We follow the Airbnb React style guide: https://github.com/airbnb/javascript/tree/master/react  
We use Material Design for most visual components. Please do not create custom CSS unless Material Design does not have a component that corresponds to what you are building. http://www.material-ui.com/#/
The app will be fully responsive.

## IMPORTANT LINKS
Repository: https://bitbucket.org/interaxon/muse-for-professionals-dashboard-react 
Asana Project: https://app.asana.com/0/281543613512724/board 
Zeplin Project (full designs): https://app.zeplin.io/project.html#pid=58af05001f89045a80a55a91&dashboard
Google Drive: https://drive.google.com/open?id=0B8hqTJToCCEHUFl5T1FOYzhiNzA   
Slack Channel: https://interaxon.slack.com/messages/pro_dashboard_dev/  
Code Style Guide: https://github.com/airbnb/javascript/tree/master/react  

If you are having trouble accessing any of the above, please contact Jasna at jasna@interaxon.ca.