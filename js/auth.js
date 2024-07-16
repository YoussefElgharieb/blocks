authForm.addEventListener('submit', (evt)=>{
    evt.preventDefault();
    const email = authForm.email.value;
    const password = authForm.password.value;
    if(confirmPassword.style.display === "" || confirmPassword.style.display === "none"){
        // log in
        if(emailValid){
            auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) =>{
                // Signed in
                let user = userCredential.user;
                // ...
                localStorage.setItem('id', user.uid)
                
                authPage.style.display ='none';

                listenToBlocksRef()
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                // ..
                logInError.style.display = "block"
            });
        }
        else{
            authForm.email.style.border = "solid red"
        }
        
    }
    else{
        // sign up        
        if(emailValid && passwordValid && confirmPasswordValid){
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in 
                    let user = userCredential.user;
                    // ...
                    localStorage.setItem('id', user.uid)

                    listenToBlocksRef()
                    db.collection("users").doc(localStorage.getItem('id')).collection("blocks").add({
                        title:"Your first time block",
                        startTime:"07:00",
                        endTime:"08:00",
                        date:format(date),
                    })

                    authPage.style.display ='none';

                    
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // ..
                    if(errorCode == "auth/email-already-in-use"){
                        signUpError.style.display = "block"
                        authForm.email.style.border = "solid red"
                    }
                });
        }
        else{
            if(!emailValid){
                authForm.email.style.border = "solid red"
            }
            if (!passwordValid){
                authForm.password.style.border = "solid red"
            }
            if (!confirmPasswordValid){
                authForm.confirmPassword.style.border = "solid red"
            } 
        }
    }

})

logout.addEventListener('click', (evt)=>{
    auth.signOut().then(() => {
        console.log("logout")
        localStorage.removeItem("id");
        blocks.innerHTML = "";
        authPage.style.display= "block"
        
        authSwitchToLogInFunc();
    });
})

  