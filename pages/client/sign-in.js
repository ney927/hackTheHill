

//<script src="../client/sign-in.js"></script>



function submit_pressed(){
	console.log("inside submit ");

    //console.log("the value is ", document.getElementById("exampleInputEmail1").value);
    let username = document.getElementById("exampleInputEmail1").value ;
	let pw = document.getElementById("exampleInputPassword1").value ;

	let body = {"user"  : username , "password" : pw};

    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		//console.log(res);
		if(this.readyState==4 && this.status==200){
			
			//alert("password has been received" );
			
			//change location to be the user 
			location.href = "http://localhost:3000/user.html";
			
		}else{
			//alert("incorrect password please try again");
			console.log("incorrect password");
		}
	}
    req.open("POST", `/api/login`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(body));
}






function signup_pressed(){
	//console.log("inside signup ");
    //console.log("the value is ", document.getElementById("exampleInputEmail1").value);
    let username = document.getElementById("exampleInputEmail1").value ;
	let pw = document.getElementById("exampleInputPassword1").value ;

	let body = { "user": username, "password": pw };

    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		console.log(req);
		if(this.readyState==4 && this.status==200){

			alert("user has been added" );
            //console.log(req.responseText);
			
		}else{
			//console.log(res.body);
			alert("sorry the user name has been taken ");
			console.log("user not added");
		}
	}

	req.open("POST", `/api/addUser`);
	req.setRequestHeader("Content-Type", "application/json");
	console.log(JSON.stringify(body));
	//req.send(JSON.stringify(body));
}