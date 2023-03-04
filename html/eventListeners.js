
document.addEventListener('DOMContentLoaded', function () {
  //This is called after the browser has loaded the web page

  //problem 1

  //randomize word positions
  //Math.floor(Math.random()*canvas.width)
  //words are stored in an array called "words", and each word is a dictionary containing "word" "x" and "y" items

  const context = canvas.getContext('2d')
  context.font = font

  let wordHeight = context.measureText('M').width;
  //apparently its difficult to get textHeight
  //but the M character is almost a square
  //and so its width is a good approximation for height

  for (let i = 0; i < words.length; i++) {
    let wordWidth = context.measureText(words[i]["word"]).width
    //let wordHeight = context.measureText(words[i]["word"]).height

    console.log(canvas.getBoundingClientRect().width - wordWidth)
    //console.log(wordHeight);

    //drawn from bottom left corner, so height needs to be offset, while width can just be reduced
    words[i]["y"] = Math.floor(Math.random() * (canvas.getBoundingClientRect().height - wordHeight) + wordHeight)
    words[i]["x"] = Math.floor(Math.random() * (canvas.getBoundingClientRect().width - wordWidth))
  }



  //add mouse down listener to our canvas object
  document.getElementById('canvas1').addEventListener('mousedown', handleMouseDown)
  //add listener to submit button
  document.getElementById('submit_button').addEventListener('click', handleSubmitButton)

  document.getElementById('fetch_button').addEventListener('click', handleFetchButton)


  //add key handler for the document as a whole, not separate elements.
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)

  timer = setInterval(handleTimer, 100)


  drawCanvas()
})
