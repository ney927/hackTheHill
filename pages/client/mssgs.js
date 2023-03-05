

const all_mssg_div = document.getElementById('all-mssgs');


function load(){

    console.log("inside the messages page, Get messages");
}


function gen_messages(){
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


 
