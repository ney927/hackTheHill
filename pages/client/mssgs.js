
messages = [
    {
        from: "testdata",
        app: "testdata",
        title: "testdata",
        content: "testdata",
        date: "testdata"
    },
    {
        from: "testdata",
        app: "testdata",
        title: "testdata",
        content: "testdata",
        date: "testdata"
    },
    {
        from: "testdata",
        app: "testdata",
        title: "testdata",
        content: "testdata",
        date: "testdata"
    },
    {
        from: "testdata",
        app: "testdata",
        title: "testdata",
        content: "testdata",
        date: "testdata"
    }
];


const all_mssg_div = document.getElementById('all-mssgs');


console.log("Get messages")

//TEST PURPOSES: 
let user = "";
data = getUserData(user)
console.log(data)

/*if (user === "") {

    //go login
    const div = document.getElementById('all-mssgs');

    const login = document.createElement('p');
    login.className = 'header'
    login.innerHTML = "Login to view your messages"

    div.appendChild(login);
}
else {
    data = getUserData(user)
    console.log(data)


    let messages = data.messages

    //displaying the messages
    messages.forEach(element => {
        const mssg_div = document.createElement('div');
        mssg_div.className = 'mssg';

        const header = document.createElement('p');
        header.className = 'header';
        header.innerHTML = element.title;

        const content = document.createElement('p');
        content.className = 'content';
        content.innerHTML = element.description;

        const info = document.createElement('p');
        info.className = 'info';
        info.innerHTML = element.date + '&emsp;' + element.from + '&emsp;' + element.app;

        mssg_div.appendChild(header);
        mssg_div.appendChild(content);
        mssg_div.appendChild(info);

        all_mssg_div.appendChild(mssg_div);
    });

}

*/

function getUserData(user) {

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
                data = JSON.parse(response);

                return data;
            } else {
                throw new Error('Failed to get user data');
            }
        })
        .then(data => {
            console.log("slay my",data); // Do something with the user data
        })
        .catch(error => {
            console.error(error);
        });

    return data;
}