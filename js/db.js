let userRef
let blocksRef;

const listenToBlocksRef = () =>{
    userRef = db.collection("users").doc(localStorage.getItem('id'))
    blocksRef = userRef.collection("blocks")
    if(localStorage.getItem('id')){
        blocksRef.onSnapshot((snapshot) => {
            snapshot.docChanges().forEach(change => {
                if(change.type === 'added'){
                    createBlock(change.doc.data(), change.doc.id);
                }
                else if (change.type === 'removed'){
                    deleteBlock(change.doc.id);
                }
            })
        })
    }
}

if(localStorage.getItem('id')){
    listenToBlocksRef();
    authPage.style.display ='none';
}

// CRUD operations
createBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    console.log(form.date.value)
    const block = {
        title: form.title.value,
        startTime: form.startTime.value,
        endTime: form.endTime.value,
        date: form.date.value,
    }
    blocksRef.add(block)
        .catch(err => console.error(err))
    closeForm();
})

updateBtn.addEventListener('click', evt => {
    blocksRef.doc(deleteBtn.getAttribute('data-id')).delete();
    const block = {
        title: form.title.value,
        startTime: form.startTime.value,
        endTime: form.endTime.value,
        date: form.date.value,
    }
    blocksRef.add(block)
        .catch(err => console.error(err))
    closeForm();
})

deleteBtn.addEventListener('click', evt => {
    blocksRef.doc(deleteBtn.getAttribute('data-id')).delete();
    closeForm();
})

const get = (date, isRight) =>{
    blocksRef.where("date", "==", date)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            createBlock(doc.data(), doc.id, isRight);
        });
        var tl = gsap.timeline();
        tl.to(".block", {
            x: `${isRight?"-":"+"}=110%`,
            stagger:0.1,
            duration:0.1,
            delay:-0.1,
            opacity:0,            
            ease: "power4.in",
        })
        tl.to(".block", {
            stagger:0.1,
            opacity:1,
            delay:0.1
        })
        
        

    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
    
}