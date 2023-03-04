//KEY CODES
//should clean up these hard-coded key codes
const ENTER = 13
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40


function handleKeyDown(e) {

  //console.log("keydown code = " + e.which)

  let dXY = 5; //amount to move in both X and Y direction
  if (e.which == UP_ARROW && movingBox.y >= dXY)
    movingBox.y -= dXY //up arrow
  if (e.which == RIGHT_ARROW && movingBox.x + movingBox.width + dXY <= canvas.width)
    movingBox.x += dXY //right arrow
  if (e.which == LEFT_ARROW && movingBox.x >= dXY)
    movingBox.x -= dXY //left arrow
  if (e.which == DOWN_ARROW && movingBox.y + movingBox.height + dXY <= canvas.height)
    movingBox.y += dXY //down arrow

  let keyCode = e.which
  if (keyCode == UP_ARROW | keyCode == DOWN_ARROW) {
    //prevent browser from using these with text input drop downs
    e.stopPropagation()
    e.preventDefault()
  }

}

function handleKeyUp(e) {
  //  console.log("key UP: " + e.which)
  if (e.which == RIGHT_ARROW | e.which == LEFT_ARROW | e.which == UP_ARROW | e.which == DOWN_ARROW) {
    let dataObj = {
      x: movingBox.x,
      y: movingBox.y
    }
    //create a JSON string representation of the data object
    let jsonString = JSON.stringify(dataObj)
    //DO NOTHING WITH THIS DATA FOR NOW


  }
  if (e.which == ENTER) {
    handleSubmitButton() //treat ENTER key like you would a submit
    document.getElementById('userTextField').value = ''

  }

  e.stopPropagation()
  e.preventDefault()

}




function handleFetchButton() {

  let userText = document.getElementById('userTextField').value
  if (userText && userText != '') {

    let userRequestObj = { text: userText }
    //let userRequestJSON = JSON.stringify(userRequestObj)
    document.getElementById('userTextField').value = ''
    //alert ("You typed: " + userText);


    //problem 4
    let textDiv = document.getElementById("text-area")
    textDiv.innerHTML = textDiv.innerHTML + `<p> ${userText}</p>`


    //problem 5

    fetch('http://localhost:3000/userText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userRequestObj),
      //response is type Response
    }).then(response => response.json())
      .then((data) => {
        //process the data how you want
        let responseObj = data

        processJsonLyrics(responseObj,userText);

        drawCanvas()

      })
      .catch((error) => {
        console.error('Error:', error)
      })


  }//end if
}

//processes the json lyric return object, if it has no lyrics itll display not found
//otherwise sets the words array to have all the words from hte lyrics in it, each with a random in bounds position
function processJsonLyrics(responseObj,userText) {


  //problem 2
  const context = canvas.getContext('2d')
  context.font = font

  //the width of M is a good approximation for the height of a sentence in the same font
  let wordHeight = context.measureText('M').width;


  words = []
  if (responseObj.text == ("NOT FOUND: " + userText)) {
    movingString.word = responseObj.text;
  }
  else {
    songLines = responseObj.songLines;
    movingString.word = "FOUND"

    for (let index = 0; index < songLines.length; index++) {
      let songWords = songLines[index].split(" ");
      for (let i = 0; i < songWords.length; i++) {

        let wordWidth = context.measureText(songWords[i]).width
        //let wordHeight = context.measureText(words[i]["word"]).height

        let x = Math.floor(Math.random() * (canvas.getBoundingClientRect().width - wordWidth));
        let y = Math.floor(Math.random() * (canvas.getBoundingClientRect().height - wordHeight) + wordHeight);
        let word = songWords[i];

        words.push({ word: word, x: x, y: y })
      }
    }
  }

}


function handleSubmitButton() {

  let userText = document.getElementById('userTextField').value
  if (userText && userText != '') {

    let userRequestObj = { text: userText }
    let userRequestJSON = JSON.stringify(userRequestObj)
    document.getElementById('userTextField').value = ''
    //alert ("You typed: " + userText);


    //problem 4
    let textDiv = document.getElementById("text-area")
    textDiv.innerHTML = textDiv.innerHTML + `<p> ${userText}</p>`


    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log("data: " + this.responseText)
        console.log("typeof: " + typeof this.responseText)
        //we are expecting the response text to be a JSON string
        let responseObj = JSON.parse(this.responseText)



        //problem 2
        processJsonLyrics(responseObj,userText);



        drawCanvas()
      }

    }
    xhttp.open("POST", "userText") //API .open(METHOD, URL)
    xhttp.send(userRequestJSON) //API .send(BODY)
  }
}
