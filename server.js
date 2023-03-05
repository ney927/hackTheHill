const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());

const fs = require("fs");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const createUserSchema = Joi.object({
  user: Joi.string().required(),
  password: Joi.string().required(),
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

console.log("Finding database\n");
const dataPath = "data.json";
var dataBase;
fs.readFile(dataPath, "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  try {
    const jsonData = JSON.parse(data);
    dataBase = jsonData;
    //console.log(jsonData);
    console.log("Loaded database\n");
  } catch (e) {
    console.error(`Failed to parse JSON: ${e}`);
  }
});


app.post('/api/login', (req, res) => {
    console.log("Login ");
    console.log(req.body)

    const { error, value: { user, password } = {} } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    if (dataBase[user]!==undefined) {

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        
        // Hash the password with the salt
        const hashedPassword = bcrypt.hashSync(password, salt)

        
        // add to the database
        if( hashedPassword === dataBase[user].password){
            return res.send(true)
        }else{
            return res.send(false)
        }
    }
    else {
        return res.status(409).send(false);
    }

});

app.post("/api/addMessage", (req, res) => {
  console.log("Add message");
  console.log(req.body);

  //check input matches expected json
  const { error, value: { user, from, app, title, content, date } = {} } =
    createMessageSchema.validate(req.body);
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
    });

    //update database file
    fs.writeFileSync(dataPath, JSON.stringify(dataBase));

    return res.send(true);
  } else {
    return res.send(false);
  }
});

app.post("/api/addEvent", (req, res) => {
  console.log("Add event");
  console.log(req.body);

  //checking that input matches expected json
  const { error, value: { user, title, description, date } = {} } =
    createEventSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //if user is in database
  if (dataBase[user]) {
    
    //append event to user's event array
    dataBase[user].messages.push({
      title: title,
      description: description,
      date: date,
    });

    //update database file
    fs.writeFileSync(dataPath, JSON.stringify(dataBase));

    return res.send(true);
  } else {
    return res.send(false);
  }
});

app.post('/api/addUser', (req, res) => {

    console.log("Add user")
    console.log(req.body)

    //const { error, value: { user, password } = {} } = createUserSchema.validate(req.body);

    // if (error) {
    //     return  res.status(400).send(error.details[0].message);
    // }

    // if (dataBase[user]!==undefined) {
    //     return res.status(409).send("Username taken");
    // }

    // User is available, add to the database
    // dataBase[user] = {
    //     messages: [],
    //     events: [],
    //     password: password,
    // };

    // fs.writeFileSync(dataPath, JSON.stringify(dataBase));

    return res.send(true);
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
      return res.status(409).send("User not found");
    }

});

app.get('*', function(req, res) {

    let requestedPath = req.path; // Get the requested path from the request object
    //console.log(requestedPath);

    if (requestedPath === "/") {
      requestedPath = "/sign-in.html";
    }

    const htmlFilePath = __dirname + "/pages" + requestedPath; // Construct the file path to the HTML file

   // console.log(htmlFilePath);

    res.sendFile(htmlFilePath); // Send the HTML file
  });
  

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})