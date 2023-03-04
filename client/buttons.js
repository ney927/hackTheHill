


getMessages(user){

    let data

    fetch('/api/getData', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        user: user
    })
    })
    .then(response => {
    if (response.ok) {

        //each message is            
        
        //from: from,
        //app: app,
        //title: title,
        //content: content,
        //date: date,

        //response is a list of messages and events
        data = response.json();
        return data;
    } else {
        throw new Error('Failed to get user data');
    }
    })
    .then(data => {
    console.log(data); // Do something with the user data
    })
    .catch(error => {
    console.error(error);
    });

    return data; 
}