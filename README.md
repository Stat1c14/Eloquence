# [UNMAINTAINED] Eloquence

## Description

Eloquence is a single page web application built for creative writing. It supports logging in using a variety of social media sites as well as local login. Eloquence allows you to write, edit, and format compositions and then store them for later! It was built using Node.js, Express, and MongoDB, and is designed to be sleek, fast, and modern.

## Install

Install is same as any node.js install. After installing Node, just run
```
npm install
```
to install Eloquence and fetch any necessary modules.

Be sure to create a database.js file in the config folder containing the link to your MongoDB server

```
module.exports = {
    'url' : ''
};
```

You may change the port in the server.js file as well. Also, you can enable social login by modifying the auth.js file, if you wish.

## API

      ROUTE                     HTTP VERB       DES
      /api/compositions         GET             Gets a list of a user's compositions
      /api/compositions         POST            Creates a composition
      /api/compositions/:id     GET             Get composition with id
      /api/compositions/:id     PUT             Update composition with id
      /api/compositions/:id     DELETE          Delete composition with id

## Author

Written by Chandler Freeman (http://www.chandlerfreeman.com)
