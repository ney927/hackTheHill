


//<script src="../client/sign-in.js"></script>

function submit_pressed(){
    console.log("the value is ", document.getElementById("exampleInputEmail1").value);
    let username = document.getElementById("exampleInputEmail1").value ;

    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){

			alert("password has been received" );
            console.log(res.body);
			
		}
	}

    req.open("POST", `/api/login`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(username));
}