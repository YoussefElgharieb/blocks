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

const get = (date) =>{
    blocksRef.where("date", "==", date)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            createBlock(doc.data(), doc.id);
        });
        wait = false;
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
    
}
