# forkify

## Recipe application with custom recipe uploads.

I created the functionality for this website during Jonas Schmedtmann's The Complete JavaScript Course 2021: From Zero to Expert! course.\
The .htmlnanorc file here ensures that the Parcel build runs properly (otherwise, due to some bug with Parcel version 2.0.0-beta.1, parcel build just doesn't work due to some issue with the SVGs).\
When you download this code for your own use, make sure you grab an API key from https://forkify-api.herokuapp.com/v2 and put it in the config.js file.

Besides the JS practice gained from building the JavaScript up from scratch, other things learned during this project included how to implement a well-estalished architecture pattern (MVC, i.e. Model-View-Controller), use modern AJAX calls with the Fetch API to perform both GET and POST requests to interact with an API (the API being the one linked above), write a "simple" DOM updating algorithm (so as to avoid unnecessary re-rendering), use Parcel v2, and set up continuous integration (or continuous deployment) with Netlify and GitHub.

View the site here: https://forkify-nkemdi.netlify.app/ (I disabled the ability to upload recipes on this version).
