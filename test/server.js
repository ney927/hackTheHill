

//Server Code --USING ONLY NODE.JS BUILT IN MODULES
const http = require('http') //need to http
const fs = require('fs') //need to read static files
const url = require('url') //to parse url strings
const { exit } = require('process')

dataPath = "data.json"


const ROOT_DIR = 'html' //dir to serve static files from


console.log('Finding database\n')

fs.exists(songFile, (exists) => {
  if(exists){
    console.log(songFile + '<--EXISTS')
    //Found the song file
    fs.readFile(songFile, function(err, data) {
      //Read song data file and send lines and chords to client
      if (err) {

        console.log('Failed to load database\n')

        exit;

      } else {
        
console.log('Loading Data\n')
        var dataBase =  JSON.parse(dataPath)
        console.log('Successfully Loaded Data\n')

      }
    }
    )
  }
}
)





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

    //Get data from any POST request
    if (request.method == "POST") {
      //Do this for all POST messages
      dataObj = JSON.parse(receivedData)
      console.log("received data object: ", dataObj)
      console.log("type: ", typeof dataObj)
      console.log("USER REQUEST: " + dataObj.text)
      returnObj.text = "METHOD NOT FOUND: " + dataObj.text
    }


    if (request.method === "POST" && urlObj.pathname === "/addUser") {

    }
    if (request.method === "POST" && urlObj.pathname === "/addEvent") {
      
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
