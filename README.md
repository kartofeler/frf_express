# Getting started

## First steps
Install Nodemon

```
npm install -g nodemon
```

Next download dependencies
```
npm i
```

## Configuration file

Copy file __config/config.dist.js__ as __config/config.js__ and type production data

```
 module.exports = {
     appId: '40d652b3-152f-40fb-8ec2-3fb8ee16b5cb',
     appToken: 'a82abad0-2520-4a3c-bb85-c404f9f1a782',
     campaign: 'Example referral campaign'
 };
```

To start app:
```
npm start
```