
const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

const fs = require('fs')
const bcrypt = require('bcrypt');
const Joi = require('joi');


const createUserSchema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().min(8).required(),
});


const createEventSchema = Joi.object({
    user: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    date: Joi.string().required(),
});

const loginSchema = Joi.object({
    user: Joi.string().required(),
    password: Joi.string().required(),
});

const createMessageSchema = Joi.object({
    user: Joi.string().required(),
    from: Joi.string().required(),
    app: Joi.string().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
    date: Joi.string().required(),
});

const getDataSchema = Joi.object({
    user: Joi.string().required(),
    //probably should authenticate
});


console.log('Finding database\n')
const dataPath = 'data.json';
var dataBase
fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    try {
        const jsonData = JSON.parse(data);
        dataBase = jsonData;
        console.log(jsonData);
    } catch (e) {
        console.error(`Failed to parse JSON: ${e}`);
    }
});


app.post('/api/login', (req, res) => {
    console.log("inisde login function ");
    // console.log(req.body)

    if(dataBase[req.body.user] == undefined){
      console.log("could not find user");
      res.status(400);
    }

    if((dataBase[req.body.user]).password == req.body.password){
      console.log("match found");
      res.status(200);
      
    }else{
      console.log("not a match");
      res.status(400);
    }

    res.send();

});


app.post('/api/addMessage', (req, res) => {
    console.log("Add message");
    console.log(req.body)


    const { error, value: { user, from, app, title, content, date } = {} } = createMessageSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    if (dataBase[user]) {

        // add to the database
        dataBase[user].events.push({
            from: from,
            app: app,
            title: title,
            content: content,
            date: date,
        })

        fs.writeFileSync(dataPath, JSON.stringify(dataBase));

        return res.send('Event added successfully');

    }
    else {
        return res.status(409).send('User does not exist');
    }

});


app.post('/api/addEvent', (req, res) => {

    console.log("Add event") 
    console.log(req.body)

    const { error, value: { user, title, description, date } = {} } = createEventSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    if (dataBase[user]) {

        // add to the database
        dataBase[user].messages.push({
            title: title,
            description: description,
            date: date,
        })

        fs.writeFileSync(dataPath, JSON.stringify(dataBase));

        return res.send('Event added successfully');

    }
    else {
        return res.status(409).send('User does not exist');
    }

});




app.post('/api/getData', (req, res) => {
    console.log("Get Data")
    console.log(req.body)

    const { error, value: { user } = {} } = getDataSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    if (dataBase[user]) {
        const userData = dataBase[user]; // Get the user data from the database
        return res.json(userData); // Send the user data as a JSON response
    } else {
        return res.status(409).send('User not found');
    }

});

//post request to check if the user has already been added before
app.post('/api/addUser', (req, res) => {

  //if the user already existsin the database
  if(dataBase[req.body.user]){
    console.log("user already exists");
    return res.status(409).send('User not found');
  }else{

    //if user does not exists add them to the database
    console.log("add user ");
    dataBase[req.body.user] = {
          messages: [],
          events: [],
          password: req.body.password,
      };
  
      fs.writeFileSync(dataPath, JSON.stringify(dataBase));
      res.status(200).send();
  }
  
});

app.get('*', function(req, res) {

  //console.log('INSIDE HERE');

    let requestedPath = req.path; // Get the requested path from the request object
    //console.log(requestedPath);

    if(requestedPath==="/"){
        requestedPath = "/sign-in.html"
    }

    const htmlFilePath = __dirname + '/pages' + requestedPath; // Construct the file path to the HTML file

   // console.log(htmlFilePath);

    res.sendFile(htmlFilePath); // Send the HTML file
});
  

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});