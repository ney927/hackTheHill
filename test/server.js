

//Server Code --USING ONLY NODE.JS BUILT IN MODULES
const http = require('http') //need to http
const fs = require('fs') //need to read static files
const url = require('url') //to parse url strings
const { exit } = require('process')
const { json } = require('stream/consumers')

dataPath = "data.json"

let userFormat
userFormatPath = "jsonFormats/addUserFormat.json"
fs.readFileSync(userFormatPath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    console.log('Did not find user format\n')

    return;
  }
  userFormat = JSON.parse(data)
  console.log('Found user format\n')

})

eventFormatPath = "jsonFormats/addEventFormat.json"
let eventFormat
fs.readFileSync(eventFormatPath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    console.log('Did not find event format\n')

    return;
  }
  eventFormat = JSON.parse(data)
  console.log('Found event format\n')
})

const ROOT_DIR = 'html' //dir to serve static files from

const MIME_TYPES = {
  'css': 'text/css',
  'gif': 'image/gif',
  'htm': 'text/html',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'js': 'application/javascript', 
  'json': 'application/json',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'txt': 'text/plain'
}

function get_mime(filename) {
  for (let ext in MIME_TYPES) {
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return MIME_TYPES[ext]
    }
  }
  return MIME_TYPES['txt']
}


console.log('Finding database\n')
let dataBase
fs.readFileSync(dataPath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    console.log('Could not find database\n')
    exit(-1);
  }
  console.log('Found database\n')
  dataBase = JSON.parse(data)
})


function validateJSON(json, format) {
  // Check if both inputs are valid JSON objects
  if (!json || typeof json !== "object") {
    throw new Error("Invalid JSON object provided.");
  }
  if (!format || typeof format !== "object") {
    throw new Error("Invalid JSON format provided.");
  }

  // Check if each key in the format exists in the input
  for (let key in format) {
    if (!json.hasOwnProperty(key)) {
      return false;
    }

    // Check if the value types match
    if (!(json[key] instanceof format[key])) {
      return false;
    }
  }

  // If all checks pass, return true
  return true;
}


http.createServer(function (request, response) {
  let urlObj = url.parse(request.url, true, false)
  console.log('\n============================')
  console.log("PATHNAME: " + urlObj.pathname)
  console.log("REQUEST: " + ROOT_DIR + urlObj.pathname)
  console.log("METHOD: " + request.method)

  let receivedData = ''

  //attached event handlers to collect the message data
  request.on('data', function (chunk) {
    receivedData += chunk
  })

  let dataObj = undefined //object representing the client data
  let returnObj = {} //object to be returned to client

  //event handler for the end of the message
  request.on('end', function () {
    console.log('received data: ', receivedData)
    console.log('type: ', typeof receivedData)


    dataObj = JSON.parse(urlObj.data)
    returnObj.text = "ERROR"//error until proven otherwise

    if (request.method === "POST" && urlObj.pathname === "/addUser") {
      if (validateJSON(urlObj.data, userFormat)) {
        let addUser = urlObj.data;
        //
        if (dataBase[addUser.user] === undefined) {
          //username not taken

          // Read the JSON file and parse it into an object
          const rawData = fs.readFileSync('data.json');
          const data = JSON.parse(rawData);

          //add user to database
          dataBase[addUser.user] = {
            "password": addUser.password,
            "events": [],
            "messages": []
          }

          // Write the updated object back to the file
          fs.writeFileSync('data.json', JSON.stringify(data));

        }
        else {
          returnObj.text = "USER NOT FOUND"
          response.writeHead(200, { "Content-Type": MIME_TYPES["json"] })
          response.end(JSON.stringify(returnObj))
        }

      }
    }
    else if (request.method === "POST" && urlObj.pathname === "/addEvent") {
      if (validateJSON(urlObj.data, eventFormat)) {
        let addEvent = urlObj.data;
        //
        if (dataBase[addEvent.user] === undefined) {
          //username not found
          returnObj.text = "USER NOT FOUND"
          response.writeHead(200, { "Content-Type": MIME_TYPES["json"] })
          response.end(JSON.stringify(returnObj))
        }
        else {

          // Read the JSON file and parse it into an object
          const rawData = fs.readFileSync('data.json');
          const data = JSON.parse(rawData);

          //add event to user entry in database
          dataBase[addEvent.user].events.append(addEvent.event)

          // Write the updated object back to the file
          fs.writeFileSync('data.json', JSON.stringify(data));

        }

      }
    }

    else if (request.method === "POST" && urlObj.pathname === "/getData") {

      if (validateJSON(urlObj.data, dataGetFormat)) {

        let getUser = urlObj.data;
        if (dataBase[getUser.user] === undefined) {
          //username not found
          returnObj.text = "USER NOT FOUND"
          response.writeHead(200, { "Content-Type": MIME_TYPES["json"] })
          response.end(JSON.stringify(returnObj))
        }
        else {

          //add event to user entry in database
          returnObj.data = dataBase[getUser.user]
          response.writeHead(200, { "Content-Type": MIME_TYPES["json"] })
          response.end(JSON.stringify(returnObj))

        }

      }

    }
    else {
      console.log(songFile + '<--DOES NOT EXIST')
      response.writeHead(200, { "Content-Type": MIME_TYPES["json"] })
      response.end(JSON.stringify(returnObj)) //send just the JSON object
    }

    if (request.method === "GET") {
      //handle GET requests as static file requests
      let filePath = ROOT_DIR + urlObj.pathname
      if (urlObj.pathname === '/') filePath = ROOT_DIR + '/index.html'

      fs.readFile(filePath, function (err, data) {
        if (err) {
          //report error to console
          console.log('ERROR: ' + JSON.stringify(err))
          //respond with not found 404 to client
          response.writeHead(404)
          response.end(JSON.stringify(err))
          return
        }
        response.writeHead(200, {
          'Content-Type': get_mime(filePath)
        })
        response.end(data)
      })
    }
  })
}).listen(3000)

console.log('http://localhost:3000/index.html')
