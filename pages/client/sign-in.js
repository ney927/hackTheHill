


//<script src="../client/sign-in.js"></script>



function submit_pressed(){
	console.log("inside signup ");
    let username = document.getElementById("exampleInputEmail1").value ;
	let pw = document.getElementById("exampleInputPassword1").value ;

	let body = {"user"  : username , "password" : pw};

    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){

			console.log("correct pw let them sign in" );
			alert("login successful");
			
		}else{
			//console.log(res.body);
			//alert("sorry the user name has been taken ");
			alert("login not ");
			console.log("incorrect pw try again");
		}
	}

    req.open("POST", `/api/login`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(body));
}






function signup_pressed(){
	console.log("inside signup ");
    let username = document.getElementById("exampleInputEmail1").value ;
	let pw = document.getElementById("exampleInputPassword1").value ;

	let body = {"user"  : username , "password" : pw};

    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){

			alert("user has been added" );
			
		}else{
			//console.log(res.body);
			//alert("sorry the user name has been taken ");
			alert("someone with a duplicate username already exists, choose another username");
		}
	}

    req.open("POST", `/api/addUser`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(body));
}