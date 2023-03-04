


//<script src="../client/sign-in.js"></script>

function submit_pressed(){
	console.log("inside submit ");
    console.log("the value is ", document.getElementById("exampleInputEmail1").value);
    let username = document.getElementById("exampleInputEmail1").value ;
	let pw = document.getElementById("exampleInputPassword1").value ;

	let un_and_pw = {"user"  : username , "password" : pw};

    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){

			alert("password has been received" );
            console.log(res.body);
			
		}
	}

    req.open("POST", `/api/login`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(un_and_pw));
}


function signup_pressed(){
	console.log("inside signup ");
    console.log("the value is ", document.getElementById("exampleInputEmail1").value);
    let username = document.getElementById("exampleInputEmail1").value ;
	let pw = document.getElementById("exampleInputPassword1").value ;

	let un_and_pw = {"user"  : username , "password" : pw};

    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){

			alert("user has been added" );
            console.log(res.body);
			
		}else{
			console.log(res.body);
			console.log("user not added");
		}
	}

    req.open("POST", `/api/addUser`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(un_and_pw));
}