authForm.addEventListener('submit', (evt)=>{
    evt.preventDefault();
    const email = authForm.email.value;
    const password = authForm.password.value;
    if(confirmPassword.style.display === "" || confirmPassword.style.display === "none"){
        // log in
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
                console.log(error);
            });
    }
    else{
        // sign up        
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
                    endTime:"08:00"
                })

                authPage.style.display ='none';

                
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                // ..
            });
    }

})

logout.addEventListener('click', (evt)=>{
    auth.signOut().then(() => {
        console.log("logout")
        localStorage.removeItem("id");
        blocks.innerHTML = "";
        authPage.style.display= "block"
    });
})

  