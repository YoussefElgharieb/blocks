// offline data
db.enablePersistence()
    .catch(err => {
        if(err.code == 'failed-precondition'){
            console.log('presistence failed')
        }
        else if(err.code == 'unimplemented'){
            console.log('presistence not available')
        }
    });

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
}

createBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    const block = {
        title: form.title.value,
        startTime: form.startTime.value,
        endTime: form.endTime.value
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
        endTime: form.endTime.value
    }
    blocksRef.add(block)
        .catch(err => console.error(err))
    closeForm();
})

deleteBtn.addEventListener('click', evt => {
    blocksRef.doc(deleteBtn.getAttribute('data-id')).delete();
    closeForm();
})
