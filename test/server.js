

//Server Code --USING ONLY NODE.JS BUILT IN MODULES
const http = require('http') //need to http
const fs = require('fs') //need to read static files
const url = require('url') //to parse url strings
const { exit } = require('process')
const { json } = require('stream/consumers')

dataPath = "data.json"

userFormatPath = "jsonFormats/addUserFormat.json"
userFormatFile = fs.open(userFormatPath)
userFormat = JSON.parse(fs.readFile(userFormatFile))
fs.close(userFormatFile);

eventFormatPath = "jsonFormats/addEventFormat.json"
eventFormatFile = fs.open(eventFormatPath)
eventFormat = JSON.parse(fs.readFile(eventFormatFile))
fs.close(eventFormatFile);

const ROOT_DIR = 'html' //dir to serve static files from

console.log('Finding database\n')

fs.exists(dataFile, (exists) => {
  if(exists){
    console.log(dataFile + '<--EXISTS')
    //Found the song file
    fs.readFile(dataFile, function(err, data) {
      //Read song data file and send lines and chords to client
      if (err) {

        console.log('Failed to load database\n')

        exit;

      } else {
        
        console.log('Loading Data\n')
        var dataBase =  JSON.parse(data)
        console.log('Successfully Loaded Data\n')

      }
    }
    )
  }
}
)



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




http.createServer(function(request, response) {
  let urlObj = url.parse(request.url, true, false)
  console.log('\n============================')
  console.log("PATHNAME: " + urlObj.pathname)
  console.log("REQUEST: " + ROOT_DIR + urlObj.pathname)
  console.log("METHOD: " + request.method)

  let receivedData = ''

  //attached event handlers to collect the message data
  request.on('data', function(chunk) {
    receivedData += chunk
  })

  let dataObj = undefined //object representing the client data
  let returnObj = {} //object to be returned to client

  //event handler for the end of the message
  request.on('end', function() {
    console.log('received data: ', receivedData)
    console.log('type: ', typeof receivedData)

    
    dataObj = json.parse(urlObj.data)
    returnObj.text = "ERROR"//error until proven otherwise

    if (request.method === "POST" && urlObj.pathname === "/addUser") {
      if(validateJSON(urlObj.data,userFormat)){
        let addUser = urlObj.data;
        //
        if(dataBase[addUser.user]===undefined){
          //username not taken

          // Read the JSON file and parse it into an object
          const rawData = fs.readFileSync('data.json');
          const data = JSON.parse(rawData);

          //add user to database
          dataBase[addUser.user] = {
            "password":addUser.password,
            "events":[],
            "messages":[]
          }

          // Write the updated object back to the file
          fs.writeFileSync('data.json', JSON.stringify(data));
                    
        }
        
      }
    }
    else if (request.method === "POST" && urlObj.pathname === "/addEvent") {
      if(validateJSON(urlObj.data,userFormat)){
        let addUser = urlObj.data;
        //
        if(dataBase[addUser.user]===undefined){
          //username not taken

          // Read the JSON file and parse it into an object
          const rawData = fs.readFileSync('data.json');
          const data = JSON.parse(rawData);

          //add user to database
          dataBase[addUser.user] = {
            "password":addUser.password,
            "events":[],
            "messages":[]
          }

          // Write the updated object back to the file
          fs.writeFileSync('data.json', JSON.stringify(data));
                    
        }
        
      }
    }

    

    
      //a POST request to fetch a song
    //look for song file in songs directory based on song title
    let songFile = `songs/${dataObj.text.trim()}.txt`
    console.log(`Looking for song file: ${songFile}`)
    fs.exists(songFile, (exists) => {
      if(exists){
        console.log(songFile + '<--EXISTS')
        //Found the song file
        fs.readFile(songFile, function(err, data) {
          //Read song data file and send lines and chords to client
          if (err) {
            returnObj.text = "FILE READ ERROR"
            response.writeHead(200, { "Content-Type": MIME_TYPES["json"] })
            response.end(JSON.stringify(returnObj))
          } else {
            var fileLines = data.toString().split("\n")
            //get rid of any return characters
            for (i in fileLines)
              fileLines[i] = fileLines[i].replace(/(\r\n|\n|\r)/gm, "")
            returnObj.text = songFile
            returnObj.songLines = fileLines
            returnObj.filePath = songFile
            response.writeHead(200, { "Content-Type": MIME_TYPES["json"] })
            response.end(JSON.stringify(returnObj))
          }
        })
      }
      else{
           console.log(songFile + '<--DOES NOT EXIST')
           response.writeHead(200, { "Content-Type": MIME_TYPES["json"] })
           response.end(JSON.stringify(returnObj)) //send just the JSON object
      }
    })

  }

    if (request.method === "GET") {
      //handle GET requests as static file requests
      let filePath = ROOT_DIR + urlObj.pathname
      if (urlObj.pathname === '/') filePath = ROOT_DIR + '/index.html'

      fs.readFile(filePath, function(err, data) {
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

console.log('Server Running at http://127.0.0.1:3000  CNTL-C to quit')
console.log('To Test')
console.log('http://localhost:3000/index.html')
